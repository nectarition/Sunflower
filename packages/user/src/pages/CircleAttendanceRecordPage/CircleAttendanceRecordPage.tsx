import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowClockwiseIcon, PencilIcon, PencilSlashIcon } from '@phosphor-icons/react'
import FormButton from '../../components/Form/FormButton'
import FormCheckbox from '../../components/Form/FormCheckbox'
import FormItem from '../../components/Form/FormItem'
import FormSection from '../../components/Form/FormSection'
import AttendStatusLabel from '../../components/parts/AttendStatusLabel'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import IconLabel from '../../components/parts/IconLabel'
import useCircle from '../../hooks/useCircle'
import useSession from '../../hooks/useSession'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { SoleilCircleAppModel, SoleilCircleStatus } from 'soleil'

const CircleAttendanceRecordPage: React.FC = () => {
  const { sessionCode } = useSession()
  const { updateCircleStatusByCodeAsync, getCirclesBySessionCodeAsync } = useCircle()

  const [forceAttendanceCheck, setForceAttendanceCheck] = useState(false)
  const [isShowUnregistered, setIsShowUnregistered] = useState(false)
  const [circles, setCircles] = useState<Record<string, SoleilCircleAppModel>>()

  const filteredCircles = useMemo(() => {
    if (!circles) return null
    return Object.entries(circles)
      .filter(([_, circle]) => !isShowUnregistered || !circle.status)
      .reduce((acc, [code, circle]) => ({ ...acc, [code]: circle }), {} as Record<string, SoleilCircleAppModel>)
  }, [circles, isShowUnregistered])

  const convertStatusText = useCallback((status: SoleilCircleStatus | undefined) => {
    return status === 1
      ? '出席済み'
      : status === 2
        ? '欠席'
        : '未提出'
  }, [])
  
  const updateStatus = useCallback((circleCode: string, status: SoleilCircleStatus) => {
    if (!circles) return
    
    const abort = new AbortController()

    const circle = circles[circleCode]
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

    updateCircleStatusByCodeAsync(circleCode, status, abort)
      .then(() => {
        alert('状態を更新しました')
      })
      .catch(err => { throw err })
  }, [circles, forceAttendanceCheck])

  const handleRefresh = useCallback(() => {
    if (!sessionCode) return
    const abort = new AbortController()
    getCirclesBySessionCodeAsync(sessionCode, abort)
      .then(setCircles)
      .catch(err => { throw err })
  }, [sessionCode])

  return (
    <DefaultLayout>
      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
      </Breadcrumbs>

      <h2>出席簿</h2>

      <FormSection>
        <FormItem>
          <FormButton
            onClick={handleRefresh}
            size="small">
            <IconLabel
              icon={<ArrowClockwiseIcon />}
              label="更新" />
          </FormButton>
        </FormItem>
      </FormSection>

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

export default CircleAttendanceRecordPage
