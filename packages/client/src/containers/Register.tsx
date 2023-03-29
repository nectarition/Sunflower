import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import type { SunflowerCircle } from 'sunflower'
import sunflowerShared from '@sunflower/shared'

import DefaultLayout from '../components/Layouts/Default/DefaultLayout'

import useSound from 'use-sound'
import OKSound from '../assets/se/ok.mp3'
import NGSound from '../assets/se/ng.mp3'

import RequiredLogin from '../libs/RequiredLogin'
import useQRReader from '../hooks/useQRReader'
import useSession from '../hooks/useSession'
import useCircle from '../hooks/useCircle'
import useCircleStream from '../hooks/useCircleStream'

import Panel from '../components/parts/Panel'
import Alert from '../components/parts/Alert'
import FormSection from '../components/Form/FormSection'
import FormItem from '../components/Form/FormItem'
import FormButton from '../components/Form/FormButton'
import FormLabel from '../components/Form/FormLabel'
import FormInput from '../components/Form/FormInput'
import Breadcrumbs from '../components/parts/Breadcrumbs'
import { Link } from 'react-router-dom'

const Register: React.FC = () => {
  const { sessionCode } = useSession()
  const {
    convertCodeDataByCircleCode,
    getCircleByCodeAsync,
    updateCircleStatusByCodeAsync
  } = useCircle()
  const { startStreamBySessionCode, streamCircles } = useCircleStream()
  const { data, QRReaderComponent } = useQRReader()
  const [playSEOK] = useSound(OKSound)
  const [playSENG] = useSound(NGSound)

  const [code, setCode] = useState<string>()
  const [prevCode, setPrevCode] = useState<string>()
  const [readCircle, setReadCircle] = useState<{ code: string, data: SunflowerCircle }>()

  const [isActive, setActive] = useState(false)
  const [error, setError] = useState<string>()

  const [query, setQuery] = useState<string>()
  const [queriedCircles, setQueriedCircles] = useState<Record<string, SunflowerCircle>>()

  const onInitialize: () => void =
    () => {
      if (!sessionCode) return
      startStreamBySessionCode(sessionCode)
    }
  useEffect(onInitialize, [sessionCode])

  const onChangeCircles = () => {
    if (!streamCircles) return
    if (!query) {
      setQueriedCircles(streamCircles)
      return
    }

    const filtered = Object.entries(streamCircles)
      .filter(([co, ci]) => co.includes(query) || ci.name.includes(query) || ci.space.includes(query))
      .reduce<Record<string, SunflowerCircle>>((p, c) => ({ ...p, [c[0]]: c[1] }), {})
    setQueriedCircles(filtered)
  }
  useEffect(onChangeCircles, [query, streamCircles])

  const handleSubmit: (circleCode: string) => Promise<void> =
    async (circleCode) => {
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
        .catch((err: Error) => {
          setError(err.message === 'circle not found' ? '登録されていない封筒コードが入力されました' : err.message)
          playSENG()
          throw err
        })
      setReadCircle({
        code: circleCode,
        data: fetchedCircle
      })

      updateCircleStatusByCodeAsync(circleCode, sunflowerShared.enumerations.circle.status.attended)
        .then(() => {
          setPrevCode(circleCode)
          playSEOK()
        })
        .catch((err: Error) => {
          setError(err.message)
          throw err
        })
    }

  const onReadData: () => void =
    () => {
      if (!data) return
      handleSubmit(data)
    }
  useEffect(onReadData, [data])

  const handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void =
    e => {
      if (!e.ctrlKey || e.code !== 'Enter') return
      if (!code) {
        setError('コードが入力されていません')
        return
      }
      handleSubmit(code)
      e.preventDefault()
    }

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
      return Object.entries(queriedCircles).map(([co, ci]) => (
        <tr key={co}>
          <td>{co}</td>
          <td>{ci.name}</td>
          <td>{ci.space}</td>
          <td>{sunflowerShared.constants.circle.status[ci.status ?? 0]}</td>
        </tr>
      ))
    }
  }, [queriedCircles])

  return (
    <DefaultLayout title="出席登録">
      <RequiredLogin />

      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
      </Breadcrumbs>
      <h2>出席登録</h2>
      <p>
        欠席登録は「<Link to="/list">出欠確認</Link>」から行ってください。
      </p>

      <Layout>
        <Column>
          {error && <Alert>{error}</Alert>}
          {readCircle &&
            <Panel title="サークル情報" subTitle={readCircle.code}>
              {readCircle.data.name}({readCircle.data.space})
            </Panel>
          }
          {isActive && <>
            <p>
              封筒のQRコードを読み取ってください
            </p>
            <ReaderWrap>
              <QRReaderComponent />
            </ReaderWrap>
            <Panel title='読み取り結果'>
              {data ?? '待機中'}
            </Panel>
          </>}
          <FormSection>
            <FormItem>
              <FormButton
                onClick={() => setActive(s => !s)}
                color={isActive ? 'default' : undefined}>読み取りを{isActive ? '終了' : '開始'}</FormButton>
            </FormItem>
            <FormItem>
              <FormLabel>封筒コード</FormLabel>
              <FormInput
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyPress={handleKeyPress} />
            </FormItem>
            <FormItem>
              <FormButton onClick={() => code && handleSubmit(code)}>出席登録</FormButton>
            </FormItem>
          </FormSection>
        </Column>
        <Column>
          <h2>一覧</h2>
          <FormSection>
            <FormItem>
              <FormLabel>検索フィルター(封筒コード, サークル名, スペース)</FormLabel>
              <FormInput value={query} onChange={e => setQuery(e.target.value)} />
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

export default Register

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
