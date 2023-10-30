import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { SunflowerCircle, SunflowerCircleStatus } from 'sunflower'
import sunflowerShared from '@sunflower/shared'

import DefaultLayout from '../components/Layouts/Default/DefaultLayout'

import useCircleStream from '../hooks/useCircleStream'
import useSession from '../hooks/useSession'
import useCircle from '../hooks/useCircle'
import FormButton from '../components/Form/FormButton'
import FormSection from '../components/Form/FormSection'
import FormItem from '../components/Form/FormItem'
import FormLabel from '../components/Form/FormLabel'
import FormInput from '../components/Form/FormInput'
import Breadcrumbs from '../components/parts/Breadcrumbs'

const List: React.FC = () => {
  const { updateCircleStatusByCodeAsync } = useCircle()
  const { streamCircles, startStreamBySessionCode } = useCircleStream()
  const { sessionCode } = useSession()

  const [queriedCircles, setQueriedCircles] = useState<Record<string, SunflowerCircle>>()
  const [query, setQuery] = useState<string>()

  const onInitialize = () => {
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

  const updateStatus: (circleCode: string, status: SunflowerCircleStatus) => void =
    (circleCode, status) => {
      if (!streamCircles) return

      const circle = streamCircles[circleCode]
      const statusText = sunflowerShared.constants.circle.status[status]

      const confirm = window.confirm(`${circle.space}「${circle.name}」を「${statusText}」にします。\nよろしいですか？`)
      if (!confirm) return

      updateCircleStatusByCodeAsync(circleCode, status)
        .then(() => alert('状態を更新しました。'))
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
        <tr key={co} className={ci.status ? 'disabled' : ''}>
          <td>
            {ci.status !== sunflowerShared.enumerations.circle.status.absented && <FormButton
              onClick={() => updateStatus(co, sunflowerShared.enumerations.circle.status.absented)}
              color={ci.status ? 'default' : undefined}>欠席</FormButton>}
            {ci.status === sunflowerShared.enumerations.circle.status.absented && <FormButton
              color="default"
              onClick={() => updateStatus(co, sunflowerShared.enumerations.circle.status.attended)}>出席</FormButton>}
          </td>
          <td>{ci.space}</td>
          <td>{sunflowerShared.constants.circle.status[ci.status ?? 0]}</td>
          <td>{ci.name}</td>
        </tr>
      ))
    }
  }, [queriedCircles])

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

export default List
