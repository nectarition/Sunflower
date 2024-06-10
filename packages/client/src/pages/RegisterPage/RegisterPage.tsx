import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useSound from 'use-sound'
import NGSound from '../../assets/se/ng.mp3'
import OKSound from '../../assets/se/ok.mp3'
import FormButton from '../../components/Form/FormButton'
import FormInput from '../../components/Form/FormInput'
import FormItem from '../../components/Form/FormItem'
import FormLabel from '../../components/Form/FormLabel'
import FormSection from '../../components/Form/FormSection'
import Alert from '../../components/parts/Alert'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import Panel from '../../components/parts/Panel'
import useCircle from '../../hooks/useCircle'
import useCircleStream from '../../hooks/useCircleStream'
import useQRReader from '../../hooks/useQRReader'
import useSession from '../../hooks/useSession'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { SunflowerCircle } from 'sunflower'

const RegisterPage: React.FC = () => {
  const { sessionCode } = useSession()
  const {
    convertCodeDataByCircleCode,
    getCircleByCodeAsync,
    updateCircleStatusByCodeAsync
  } = useCircle()
  const {
    startStreamBySessionCode,
    streamCircles
  } = useCircleStream()
  const { data, QRReaderComponent } = useQRReader()

  const [playSEOK] = useSound(OKSound)
  const [playSENG] = useSound(NGSound)

  const [code, setCode] = useState('')
  const [prevCode, setPrevCode] = useState<string>()
  const [readCircle, setReadCircle] = useState<{ code: string, data: SunflowerCircle }>()

  const [isActiveQRReader, setActiveQRReader] = useState(false)
  const [isActiveReadKey, setActiveReadKey] = useState(false)
  const [error, setError] = useState<string>()

  const [query, setQuery] = useState<string>()
  const [hideInputed, setHideInputed] = useState(true)

  const queriedCircles = useMemo(() => {
    if (!streamCircles) return
    const filteredCircles = Object.entries(streamCircles)
      .filter(([co, ci]) => !query || (co.includes(query) || ci.name.includes(query) || ci.space.includes(query)))
      .filter(([, ci])=> !hideInputed || (hideInputed && !ci.status))
      .reduce<Record<string, SunflowerCircle>>((p, c) => ({ ...p, [c[0]]: c[1] }), {})
    return filteredCircles
  }, [streamCircles, query, hideInputed])

  const CirclesList = useMemo(() => {
    if (queriedCircles === undefined) {
      return (
        <tr>
          <td>サークルリストを取得中です</td>
        </tr>
      )
    } else if (Object.keys(queriedCircles).length === 0) {
      return (
        <tr>
          <td>サークルが見つかりませんでした</td>
        </tr>
      )
    } else {
      return Object.entries(queriedCircles).map(([co, ci]) => {
        const circleStatus = ci.status === 1
          ? '出席済み'
          : ci.status === 2
            ? '欠席'
            : '未確認'
        return (
          <tr key={co} className={ci.status ? 'disabled' : ''}>
            <td>{co}</td>
            <td>{ci.name}</td>
            <td>{ci.space}</td>
            <td>{circleStatus}</td>
          </tr>
        )
      })
    }
  }, [queriedCircles])

  const handleSubmit = useCallback(async (circleCode: string): Promise<void> => {
    if (circleCode === prevCode) return

    setError(undefined)

    const codeData = convertCodeDataByCircleCode(circleCode)
    if (!codeData) {
      setError('違う種類のコードが入力されました')
      playSENG()
      return
    }

    if (codeData.sessionCode !== sessionCode) {
      setError('違うイベントコードの封筒コードが入力されました')
      playSENG()
      return
    }

    const fetchedCircle = await getCircleByCodeAsync(circleCode)
      .catch(err => { 
        setError(err.message === 'circle not found' ? '登録されていない封筒コードが入力されました' : err.message)
        playSENG()
        throw err
      })

    setReadCircle({
      code: circleCode,
      data: fetchedCircle
    })

    updateCircleStatusByCodeAsync(circleCode, 1)
      .then(() => {
        setCode('')
        setPrevCode(circleCode)
        playSEOK()
        alert(`${circleCode}「${fetchedCircle.name}」の出席登録を行いました`)
      })
      .catch(err => {
        alert(`エラーが発生しました ${err.message}`)
        throw err
      })
  }, [sessionCode, prevCode])

  const handleKeyDownEvent = useCallback((event: KeyboardEvent) => {
    if (code && event.key == 'Enter') {
      handleSubmit(code)
      if (isActiveReadKey) {
        setCode('')
      }
      return
    } else if (!isActiveReadKey) {
      return
    }

    if (event.key === 'Backspace') {
      const newCode = code.slice(0, code.length - 1)
      setCode(newCode)
      return
    } else if (event.key.length > 1) {
      return
    }

    setCode(s => `${s}${event.key}`)
  }, [code, isActiveReadKey])

  useEffect(() => {
    if (!sessionCode) return
    startStreamBySessionCode(sessionCode )
  }, [sessionCode])

  useEffect(() => {
    if (!data) return
    setCode(data)
    handleSubmit(data)
  }, [data])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDownEvent)
    return () => document.removeEventListener('keydown', handleKeyDownEvent)
  }, [handleKeyDownEvent])

  return (
    <DefaultLayout title="出席登録">
      <Layout>
        <Column>
          <Breadcrumbs>
            <li><Link to="/">メニュー</Link></li>
          </Breadcrumbs>
          <h2>出席登録</h2>
          <p>
            欠席登録は「<Link to="/list">出欠確認</Link>」から行ってください。
          </p>

          {error && <Alert color="danger">{error}</Alert>}
          {readCircle &&
            <Panel color="success" title="出席登録が完了しました" subTitle={readCircle.code}>
              {readCircle.data.name} ({readCircle.data.space})
            </Panel>
          }
          <FormSection>
            {!isActiveReadKey && <FormItem>
              <FormButton
                onClick={() => setActiveQRReader(s => !s)}
                color={isActiveQRReader ? 'default' : undefined}>ソフトウェアQRリーダーを{isActiveQRReader ? '閉じる' : '開く'}</FormButton>
            </FormItem>}
            {!isActiveQRReader && <FormItem>
              <FormButton
                onClick={() => setActiveReadKey(s => !s)}
                color={isActiveReadKey ? 'default' : undefined}
                onFocus={e => e.target.blur()}>
                ハードウェアQRリーダを{isActiveReadKey ? '使用しない' : '使用する'}
              </FormButton>
            </FormItem>}
          </FormSection>
          {isActiveQRReader && <>
            <p>
              封筒のQRコードを読み取ってください
            </p>
            <ReaderWrap>
              <QRReaderComponent />
            </ReaderWrap>
          </>}
          <FormSection>
            <FormItem>
              <FormLabel>封筒コード</FormLabel>
              <FormInput
                value={code}
                onChange={e => setCode(e.target.value)}
                disabled={isActiveReadKey} />
            </FormItem>
            <FormItem>
              <FormButton
                onClick={() => code && handleSubmit(code)}
                disabled={!code}>
                出席登録(Enter)
              </FormButton>
            </FormItem>
          </FormSection>
        </Column>

        <Column>
          <h2>一覧</h2>
          <FormSection>
            <FormItem>
              <FormLabel>検索フィルター(封筒コード, サークル名, スペース)</FormLabel>
              <FormInput
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setActiveReadKey(false)}/>
            </FormItem>
            <FormItem>
              <FormButton
                onClick={() => setHideInputed(s => !s)}
                color={hideInputed ? 'default' : undefined}>チェック済みを{hideInputed ? '表示' : '隠す'}</FormButton>
            </FormItem>
          </FormSection>

          <table>
            <thead>
              <tr>
                <th>封筒コード</th>
                <th>サークル名</th>
                <th>スペース</th>
                <th>状態</th>
              </tr>
            </thead>
            <tbody>
              {CirclesList}
            </tbody>
          </table>
        </Column>
      </Layout>
    </DefaultLayout>
  )
}

export default RegisterPage

const Layout = styled.section`
  display: grid;
  grid-template-columns: 60% 1fr;
  gap: 40px;

  @media screen and (max-width: 840px) {
    grid-template-columns: auto;
    grid-template-rows: auto auto;
    gap: 20px;
  }
`
const ReaderWrap = styled.div`
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`
const Column = styled.section``
