import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CameraIcon, CameraSlashIcon, KeyboardIcon, UsbIcon } from '@phosphor-icons/react'
import { Result } from '@zxing/library'
import useSound from 'use-sound'
import OKSE from '../../assets/se/ok.wav'
import FormButton from '../../components/Form/FormButton'
import FormInput from '../../components/Form/FormInput'
import FormItem from '../../components/Form/FormItem'
import FormLabel from '../../components/Form/FormLabel'
import FormSection from '../../components/Form/FormSection'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import IconLabel from '../../components/parts/IconLabel'
import KeyboardInputComponent from '../../components/parts/KeyboardInputComponent'
import QRReaderComponent from '../../components/parts/QRReaderComponent'
import RollCallStatusLabel from '../../components/parts/RollCallStatusLabel'
import useCircle from '../../hooks/useCircle'
import useSession from '../../hooks/useSession'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { RollCallProcessStatus, SoleilCircleAppModel } from 'sunflower'

/**
 * スキャナーモード
 * 0: 手入力, 1: 内蔵カメラ, 2: 外付けリーダー
 */
type ScannerMode = 0 | 1 | 2

const RollCallPage: React.FC = () => {
  const { convertCodeDataByCircleCode, getCircleByCodeAsync, updateCircleStatusByCodeAsync } = useCircle()
  const { sessionCode } = useSession()

  const [scannerMode, setScannerMode] = useState<ScannerMode>(0)
  const [isCameraMute, setIsCameraMute] = useState(true)
  const [code, setCode] = useState('')
  const [tempCode, setTempCode] = useState('')
  const readResult = useRef<string>('')

  const [inputtedCodes, setInputtedCodes] = useState<{ id: string, code: string, readAt: Date }[]>([])
  const [processResults, setProcessResults] = useState<Record<string, RollCallProcessStatus>>({})

  const [circles, setCircles] = useState<Record<string, SoleilCircleAppModel>>({})

  const [playOKSE] = useSound(OKSE)

  const submitCode = useCallback((code: string) => {
    if (!sessionCode || !code.trim()) return

    const now = new Date()
    const guid = crypto.randomUUID()
    const newCode = { id: guid, code, readAt: now }
    setInputtedCodes(s => ([newCode, ...s]))

    const codeData = convertCodeDataByCircleCode(code)
    if (!codeData || codeData.sessionCode !== sessionCode) {
      setProcessResults(s => ({ ...s, [guid]: 2 }))
      setCode('')
      return
    }

    if (!circles[code]) {
      getCircleByCodeAsync(code)
        .then(circle => {
          setCircles(s => ({ ...s, [code]: circle }))
        })
        .catch(err => { throw err })
    }

    updateCircleStatusByCodeAsync(code, 1)
      .then(() => {
        setProcessResults(s => ({ ...s, [guid]: 1 }))
      })
      .catch(err => {
        console.error(err)
        setProcessResults(s => ({ ...s, [guid]: 2 }))
      })

    setCode('')
  }, [sessionCode])

  const handleSubmit = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitCode(code)
    }
  }, [submitCode, code])

  const handleOnScan = useCallback((result: Result) => {
    const currentCode = result.getText()
    if (readResult.current === currentCode) return
    readResult.current = currentCode
    submitCode(currentCode)
    setIsCameraMute(true)
    playOKSE()
  }, [submitCode])

  const getCircle = useCallback((code: string) => {
    const circle = circles[code]
    if (!circle) return null
    return circle
  }, [circles])

  return (
    <DefaultLayout title="出席登録">
      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
      </Breadcrumbs>

      <Layout>
        <Column>
          <h2>出席登録</h2>
          <FormSection>
            <FormItem>
              <FormLabel>スキャナーモード</FormLabel>
            </FormItem>
            <FormItem>
              <FormButton
                onClick={() => setScannerMode(0)}
                disabled={scannerMode === 0}>
                <IconLabel
                  icon={<KeyboardIcon />}
                  label="手入力" />
              </FormButton>
            </FormItem>
            <FormItem>
              <FormButton
                onClick={() => {
                  setScannerMode(1)
                  setIsCameraMute(true)
                }}
                disabled={scannerMode === 1}>
                <IconLabel
                  icon={<CameraIcon />}
                  label="内蔵カメラ" />
              </FormButton>
            </FormItem>
            <FormItem>
              <FormButton
                onClick={() => setScannerMode(2)}
                disabled={scannerMode === 2}>
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
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleSubmit}
                  placeholder="封筒コードを入力" />
              </FormItem>
              <FormItem>
                <FormButton type="button" onClick={() => submitCode(code)}>登録</FormButton>
              </FormItem>
            </FormSection>
          )}
          {scannerMode === 1 && (
            <>
              <FormSection>
                <FormItem>
                  <FormButton onClick={() => setIsCameraMute(!isCameraMute)}>
                    <IconLabel
                      icon={isCameraMute ? <CameraIcon /> : <CameraSlashIcon />}
                      label={isCameraMute ? 'カメラオン' : 'カメラオフ'} />
                  </FormButton>
                </FormItem>
              </FormSection>
              {!isCameraMute && (
                <QRReaderComponent
                  style={{ width: '100%' }}
                  onScan={handleOnScan} />
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
                onKeyDown={setTempCode}
                onData={submitCode} />
            </>
          )}
        </Column>
        <Column>
          <h2>受付結果</h2>
          <p>
            この端末で受付操作を行なった封筒コードの一覧です。<br />
            全端末での受付結果は <Link to="/records">出席記録</Link> ページから確認できます。<br />
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
                  <td colSpan={6} style={{ textAlign: 'center' }}>登録された封筒コードはありません</td>
                </tr>
              )}
              {inputtedCodes.map((code) => {
                const circle = getCircle(code.code)
                return (<tr key={code.id}>
                  <td>{code.code}</td>
                  <td><RollCallStatusLabel status={processResults[code.id]} /></td>
                  <td>{circle?.space}</td>
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

export default RollCallPage

const Layout = styled.div`
  display: grid;
  grid-template-columns: 30% 1fr;
  gap: 20px;
  @media screen and (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`
const Column = styled.div``
