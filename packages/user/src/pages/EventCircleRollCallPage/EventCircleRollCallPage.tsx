import styled from '@emotion/styled'
import { CameraIcon, CameraSlashIcon, KeyboardIcon, UsbIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Result } from '@zxing/library'
import toast, { Toaster } from 'react-hot-toast'
import useSound from 'use-sound'
import OKSE from '../../assets/se/ok.wav'
import FormButton from '../../components/Form/FormButton'
import FormInput from '../../components/Form/FormInput'
import FormItem from '../../components/Form/FormItem'
import FormLabel from '../../components/Form/FormLabel'
import FormSection from '../../components/Form/FormSection'
import BlinkField from '../../components/parts/BlinkField'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import IconLabel from '../../components/parts/IconLabel'
import KeyboardInputComponent from '../../components/parts/KeyboardInputComponent'
import QRReaderComponent from '../../components/parts/QRReaderComponent'
import RollCallStatusLabel from '../../components/parts/RollCallStatusLabel'
import useCircle from '../../hooks/useCircle'
import useEvent from '../../hooks/useEvent'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { RollCallProcessStatus, SoleilCircleAppModel, SoleilEvent } from 'soleil'

/**
 * スキャナーモード
 * 0: 手入力, 1: 内蔵カメラ, 2: 外付けリーダー
 */
type ScannerMode = 0 | 1 | 2

const EventCircleRollCallPage: React.FC = () => {
  const { code: eventCode } = useParams()

  const {
    convertCodeDataByCircleCode,
    getCircleByCodeAsync,
    updateCircleStatusByCodeAsync
  } = useCircle()

  const { getEventByCodeAsync } = useEvent()

  const [event, setEvent] = useState<SoleilEvent>()

  const [scannerMode, setScannerMode] = useState<ScannerMode>(0)
  const [isCameraMute, setIsCameraMute] = useState(true)
  const [code, setCode] = useState('')
  const [tempCode, setTempCode] = useState('')
  const scanResult = useRef<string>('')

  const [inputtedCodes, setInputtedCodes] = useState<{ id: string, code: string, readAt: Date }[]>([])
  const [processResults, setProcessResults] = useState<Record<string, RollCallProcessStatus>>({})

  const [circles, setCircles] = useState<Record<string, SoleilCircleAppModel>>({})

  const [playOKSE] = useSound(OKSE)

  const submitCodeAsync = useCallback(async (code: string) => {
    if (!eventCode || !code.trim()) return

    const abort = new AbortController()

    const now = new Date()
    const guid = crypto.randomUUID()
    const newCode = { id: guid, code, readAt: now }
    setInputtedCodes(s => ([newCode, ...s]))

    const codeData = convertCodeDataByCircleCode(code)
    if (!codeData) {
      toast.error('封筒コードの形式が正しくありません。')
      setProcessResults(s => ({ ...s, [guid]: 2 }))
      setCode('')
      throw new Error('invalid circleCode')
    }
    else if (codeData.eventCode !== eventCode) {
      toast.error('イベントコードが一致しません。')
      setProcessResults(s => ({ ...s, [guid]: 2 }))
      setCode('')
      throw new Error('eventCode mismatch')
    }

    if (!circles[code]) {
      getCircleByCodeAsync(code, abort)
        .then(circle => setCircles(s => ({ ...s, [code]: circle })))
        .catch(err => { throw err })
    }

    await toast.promise(
      updateCircleStatusByCodeAsync(code, 1, abort),
      {
        loading: '出席登録中…',
        success: () => {
          setProcessResults(s => ({ ...s, [guid]: 1 }))
          return '出席登録が完了しました。'
        },
        error: (err) => {
          console.error(err)
          setProcessResults(s => ({ ...s, [guid]: 2 }))
          if (err.message === 'circle not found') {
            return 'この封筒コードは登録されていません。'
          }
          return '出席登録に失敗しました。'
        }
      }
    )
    setCode('')
  }, [eventCode])

  const handleSubmit = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitCodeAsync(code)
    }
  }, [submitCodeAsync, code])

  const handleOnScan = useCallback((result: Result) => {
    const currentCode = result.getText()
    if (scanResult.current === currentCode) return
    scanResult.current = currentCode
    submitCodeAsync(currentCode)
      .then(() => playOKSE())
    setIsCameraMute(true)
  }, [playOKSE, submitCodeAsync])

  const handleOnData = useCallback((data: string) => {
    submitCodeAsync(data)
      .then(() => playOKSE())
  }, [playOKSE])

  const getCircle = useCallback((code: string) => {
    const circle = circles[code]
    if (!circle) return null
    return circle
  }, [circles])

  useEffect(() => {
    if (!eventCode) return
    const abort = new AbortController()
    getEventByCodeAsync(eventCode, abort)
      .then(setEvent)
      .catch(err => { throw err })
    return () => abort.abort()
  }, [eventCode, getEventByCodeAsync])

  return (
    <DefaultLayout title="出席登録">
      <Toaster position="bottom-center" />

      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
        <li><Link to={`/events/${eventCode}`}>{event?.name ?? <BlinkField />}</Link></li>
      </Breadcrumbs>

      <Layout>
        <Column>
          <h1>出席登録</h1>
          <FormSection>
            <FormItem>
              <FormLabel>スキャナーモード</FormLabel>
            </FormItem>
            <FormItem>
              <FormButton
                disabled={scannerMode === 0}
                onClick={() => setScannerMode(0)}>
                <IconLabel
                  icon={<KeyboardIcon />}
                  label="手入力" />
              </FormButton>
            </FormItem>
            <FormItem>
              <FormButton
                disabled={scannerMode === 1}
                onClick={() => {
                  setScannerMode(1)
                  setIsCameraMute(true)
                }}>
                <IconLabel
                  icon={<CameraIcon />}
                  label="内蔵カメラ" />
              </FormButton>
            </FormItem>
            <FormItem>
              <FormButton
                disabled={scannerMode === 2}
                onClick={() => setScannerMode(2)}>
                <IconLabel
                  icon={<UsbIcon />}
                  label="外付けリーダー" />
              </FormButton>
            </FormItem>
          </FormSection>
          {scannerMode === 0 && (
            <FormSection>
              <FormItem>
                <FormLabel>封筒コード入力</FormLabel>
                <FormInput
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleSubmit}
                  placeholder="封筒コードを入力"
                  value={code} />
              </FormItem>
              <FormItem>
                <FormButton
                  onClick={() => submitCodeAsync(code)}
                  type="button">登録</FormButton>
              </FormItem>
            </FormSection>
          )}
          {scannerMode === 1 && (
            <>
              <FormSection>
                <FormItem>
                  <FormButton
                    onClick={() => {
                      setIsCameraMute(!isCameraMute)
                      scanResult.current = ''
                    }}>
                    <IconLabel
                      icon={isCameraMute ? <CameraIcon /> : <CameraSlashIcon />}
                      label={isCameraMute ? 'カメラオン' : 'カメラオフ'} />
                  </FormButton>
                </FormItem>
              </FormSection>
              {!isCameraMute && (
                <QRReaderComponent
                  onScan={handleOnScan}
                  style={{ width: '100%' }} />
              )}
            </>
          )}
          {scannerMode === 2 && (
            <>
              <p>
                外付けリーダーの終了コード設定は「Enter」にしてください。
              </p>
              <FormSection>
                <FormItem>
                  <FormLabel>外付けリーダーの読み取り結果</FormLabel>
                  <FormInput value={tempCode} />
                </FormItem>
              </FormSection>
              <KeyboardInputComponent
                onData={handleOnData}
                onKeyDown={setTempCode} />
            </>
          )}
        </Column>
        <Column>
          <h2>受付結果</h2>
          <p>
            この端末で受付操作を行なった封筒コードの一覧です。<br />
            全端末での受付結果は <Link to={`/events/${eventCode}/records`}>出席記録</Link> ページから確認できます。<br />
          </p>
          <table>
            <thead>
              <tr>
                <th>封筒コード</th>
                <th>結果</th>
                <th>配置番号</th>
                <th>サークル名</th>
                <th>登録日時</th>
              </tr>
            </thead>
            <tbody>
              {inputtedCodes.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: 'center' }}>登録された封筒コードはありません</td>
                </tr>
              )}
              {inputtedCodes.map((code) => {
                const circle = getCircle(code.code)
                return (<tr key={code.id}>
                  <td>{code.code}</td>
                  <td><RollCallStatusLabel status={processResults[code.id]} /></td>
                  <td>{circle?.spaceNumber}</td>
                  <td>{circle?.name}</td>
                  <td>{code.readAt.toLocaleString()}</td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </Column>
      </Layout>
    </DefaultLayout>
  )
}

export default EventCircleRollCallPage

const Layout = styled.div`
  display: grid;
  grid-template-columns: 30% 1fr;
  gap: 20px;
  @media screen and (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`
const Column = styled.div``
