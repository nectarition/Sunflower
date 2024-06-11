import { useCallback, useEffect, useMemo, useState } from 'react'
import { MdEdit, MdEditOff } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { SunflowerCircle, SunflowerCircleStatus } from 'sunflower'
import FormButton from '../../components/Form/FormButton'
import FormInput from '../../components/Form/FormInput'
import FormItem from '../../components/Form/FormItem'
import FormLabel from '../../components/Form/FormLabel'
import FormSection from '../../components/Form/FormSection'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import IconLabel from '../../components/parts/IconLabel'
import useCircle from '../../hooks/useCircle'
import useCircleStream from '../../hooks/useCircleStream'
import useSession from '../../hooks/useSession'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'

const ListPage: React.FC = () => {
  const { sessionCode } = useSession()
  const { updateCircleStatusByCodeAsync } = useCircle()
  const { streamCircles, startStreamBySessionCode } = useCircleStream()

  const [query, setQuery] = useState<string>()
  const [forceAttendanceCheck, setForceAttendanceCheck] = useState(false)

  const queriedCircles = useMemo(() => {
    if (!streamCircles) return
    if (!query) {
      return streamCircles
    }

    const filtered = Object.entries(streamCircles)
      .filter(([co, ci]) => co.includes(query) || ci.name.includes(query) || ci.space.includes(query))
      .reduce<Record<string, SunflowerCircle>>((p, c) => ({ ...p, [c[0]]: c[1] }), {})
    return filtered
  }, [query, streamCircles])

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

    if (status === 1 && !forceAttendanceCheck) {
      const promptText = '【一覧からの出席登録には主催の許可が必要です】\n'
        + '主催に制限解除コードを確認し入力してください。\n'
        + '\n'
        + '※一度承認した後は再読み込みするまでこのダイアログは表示されません。'
      if (prompt(promptText) !== '承認') {
        alert('操作をキャンセルしました')
        return
      }
      setForceAttendanceCheck(true)
    }

    if (!confirm(`${circle.space}「${circle.name}」のステータスを ${statusText} にします。\nよろしいですか？`)) {
      return
    }

    updateCircleStatusByCodeAsync(circleCode, status)
      .then(() => alert('状態を更新しました'))
  }, [streamCircles, forceAttendanceCheck])

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
          <td>{ci.space}</td>
          <td>{convertStatusText(ci.status ?? 0)}</td>
          <td>{ci.name}</td>
          <td>
            {ci.status !== 2 && <FormButton
              onClick={() => updateStatus(co, 2)}
              color={ci.status ? 'danger' : undefined}>
              <IconLabel label="欠席" icon={<MdEditOff />} />
            </FormButton>}
            {ci.status === 2 && <FormButton onClick={() => updateStatus(co, 1)}>
              <IconLabel label="出席" icon={<MdEdit />} />
            </FormButton>}
          </td>
        </tr>
      ))
    }
  }, [queriedCircles])

  useEffect(() => {
    if (!sessionCode) return
    startStreamBySessionCode(sessionCode)
  }, [sessionCode])

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
            <th>スペース</th>
            <th>状態</th>
            <th>サークル名</th>
            <th>状態変更</th>
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
