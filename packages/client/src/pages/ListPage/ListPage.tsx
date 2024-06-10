import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SunflowerCircle, SunflowerCircleStatus } from 'sunflower'
import FormButton from '../../components/Form/FormButton'
import FormInput from '../../components/Form/FormInput'
import FormItem from '../../components/Form/FormItem'
import FormLabel from '../../components/Form/FormLabel'
import FormSection from '../../components/Form/FormSection'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import useCircle from '../../hooks/useCircle'
import useCircleStream from '../../hooks/useCircleStream'
import useSession from '../../hooks/useSession'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'

const ListPage: React.FC = () => {
  const { sessionCode } = useSession()
  const {updateCircleStatusByCodeAsync} = useCircle()
  const {streamCircles, startStreamBySessionCode} = useCircleStream()

  const [ query, setQuery ] = useState<string>()

  const queriedCircles = useMemo(() => {
    if (!streamCircles) return
    if (!query) {
      return streamCircles
    }

    const filtered = Object.entries(streamCircles)
      .filter(([ co, ci ]) => co.includes(query) || ci.name.includes(query) || ci.space.includes(query))
      .reduce<Record<string, SunflowerCircle>>((p, c) => ({ ...p, [c[0]]: c[1] }), {})
    return filtered
  }, [ query, streamCircles ])

  const convertStatusText = useCallback((status: SunflowerCircleStatus) => {
    return status === 1
      ? '出席済み'
      : status === 2
        ? '欠席'
        : '未確認'
  }, [])

  const updateStatus = useCallback((circleCode: string, status: SunflowerCircleStatus) => {
    if (!streamCircles) return

    const circle = streamCircles[circleCode]
    const statusText = convertStatusText(status)
    
    if (!confirm(`${circle.space}「${circle.name}」のステータスを ${statusText} にします。\nよろしいですか？`)) {
      return
    }

    updateCircleStatusByCodeAsync(circleCode, status)
      .then(() => alert('状態を更新しました'))
  }, [ streamCircles ])

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
      return Object.entries(queriedCircles).map(([ co, ci ]) => (
        <tr key={co} className={ci.status ? 'disabled' : ''}>
          <td>
            {ci.status !== 2 && <FormButton
              onClick={() => updateStatus(co, 2)}
              color={ci.status ? 'default' : undefined}>欠席</FormButton>}
            {ci.status === 2 && <FormButton
              color="default"
              onClick={() => updateStatus(co, 1)}>出席</FormButton>}
          </td>
          <td>{ci.space}</td>
          <td>{convertStatusText(ci.status ?? 0)}</td>
          <td>{ci.name}</td>
        </tr>
      ))
    }
  }, [ queriedCircles ])

  useEffect(() => {
    if (!sessionCode) return
    startStreamBySessionCode(sessionCode)
  }, [ sessionCode ])

  return (
    <DefaultLayout title="出欠一覧">
      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
      </Breadcrumbs>
      <h2>出欠一覧</h2>

      <p>
        出席登録は「<Link to="/register">出席登録</Link>」から行ってください。
      </p>

      <FormSection>
        <FormItem>
          <FormLabel>検索フィルター(封筒コード, サークル名, スペース)</FormLabel>
          <FormInput value={query} onChange={e => setQuery(e.target.value)} />
        </FormItem>
      </FormSection>

      <table>
        <thead>
          <tr>
            <th>状態更新</th>
            <th>スペース</th>
            <th>状態</th>
            <th>サークル名</th>
          </tr>
        </thead>
        <tbody>
          {CirclesList}
        </tbody>
      </table>
    </DefaultLayout>
  )
}

export default ListPage
