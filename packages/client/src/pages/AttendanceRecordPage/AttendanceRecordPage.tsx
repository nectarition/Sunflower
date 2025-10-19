import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PencilIcon, PencilSlashIcon } from '@phosphor-icons/react'
import { SoleilCircleAppModel, SoleilCircleStatus } from 'soleil'
import FormButton from '../../components/Form/FormButton'
import FormCheckbox from '../../components/Form/FormCheckbox'
import FormItem from '../../components/Form/FormItem'
import FormSection from '../../components/Form/FormSection'
import AttendStatusLabel from '../../components/parts/AttendStatusLabel'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import IconLabel from '../../components/parts/IconLabel'
import useCircle from '../../hooks/useCircle'
import useCircleStream from '../../hooks/useCircleStream'
import useSession from '../../hooks/useSession'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'

const AttendanceRecordPage: React.FC = () => {
  const { sessionCode } = useSession()
  const { updateCircleStatusByCodeAsync } = useCircle()
  const streamCircles = useCircleStream(sessionCode)

  const [now, setNow] = useState<Date>(new Date())
  const [forceAttendanceCheck, setForceAttendanceCheck] = useState(false)
  const [isShowUnregistered, setIsShowUnregistered] = useState(false)

  const filteredCircles = useMemo(() => {
    if (!streamCircles) return null
    return Object.entries(streamCircles)
      .filter(([_, circle]) => !isShowUnregistered || !circle.status)
      .reduce((acc, [code, circle]) => ({ ...acc, [code]: circle }), {} as Record<string, SoleilCircleAppModel>)
  }, [streamCircles, isShowUnregistered])

  const convertStatusText = useCallback((status: SoleilCircleStatus | undefined) => {
    return status === 1
      ? '出席済み'
      : status === 2
        ? '欠席'
        : '未提出'
  }, [])
  
  const updateStatus = useCallback((circleCode: string, status: SoleilCircleStatus) => {
    if (!streamCircles) return

    const circle = streamCircles[circleCode]
    const statusText = convertStatusText(status)

    if (!forceAttendanceCheck) {
      const promptText = '【一覧からの出欠登録には主催の許可が必要です】\n'
        + '主催に制限解除コードを確認し入力してください。\n'
        + '\n'
        + '※一度承認した後は再読み込みするまでこのダイアログは表示されません。'
      if (prompt(promptText) !== '承認') {
        alert('操作をキャンセルしました')
        return
      }
      setForceAttendanceCheck(true)
    }

    if (!confirm(`${circle.name} (${circle.space}) のステータスを「${statusText}」にします。\nよろしいですか？`)) {
      return
    }

    updateCircleStatusByCodeAsync(circleCode, status)
      .then(() => alert('状態を更新しました'))
  }, [streamCircles, forceAttendanceCheck])

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <DefaultLayout>
      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
      </Breadcrumbs>

      <h2>出席簿</h2>

      <p>
        {now.toLocaleString()} 現在の出席状況です。<br />
        出席状況はリアルタイムで更新されます。
      </p>

      <FormSection>
        <FormItem $inlined>
          <FormCheckbox
            checked={isShowUnregistered}
            inlined={true}
            label="未提出のみ表示"
            name="showUnregistered"
            onChange={checked => setIsShowUnregistered(checked)} />
        </FormItem>
      </FormSection>

      <table>
        <thead>
          <tr>
            <th>配置番号</th>
            <th>サークル名</th>
            <th>出欠</th>
            {!isShowUnregistered && <th>更新日時</th>}
            <th>封筒コード</th>
            <th>状態変更</th>
          </tr>
        </thead>
        <tbody>
          {!filteredCircles && (
            <tr>
              <td colSpan={6}>サークルリストを取得中です</td>
            </tr>
          )}
          {filteredCircles && Object.entries(filteredCircles).map(([id, c]) => (
            <tr key={id}>
              <td>{c.space}</td>
              <td>{c.name}</td>
              <td><AttendStatusLabel status={c.status} /></td>
              {!isShowUnregistered && <td>{c.updatedAt && new Date(c.updatedAt).toLocaleString()}</td>}
              <td>{id}</td>
              <td>
                {c.status !== 2 && (
                  <FormButton
                    color={c.status ? 'danger' : undefined}
                    onClick={() => updateStatus(id, 2)}
                    size="small">
                    <IconLabel
                      icon={<PencilSlashIcon />}
                      label="欠席" />
                  </FormButton>
                )}
                {c.status === 2 && (
                  <FormButton
                    onClick={() => updateStatus(id, 1)}
                    size="small">
                    <IconLabel 
                      icon={<PencilIcon />} 
                      label="出席" />
                  </FormButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DefaultLayout>
  )
}

export default AttendanceRecordPage
