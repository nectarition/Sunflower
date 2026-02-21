import { ArrowClockwiseIcon, PencilIcon, PencilSlashIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FormButton from '../../components/Form/FormButton'
import FormCheckbox from '../../components/Form/FormCheckbox'
import FormItem from '../../components/Form/FormItem'
import FormSection from '../../components/Form/FormSection'
import AttendStatusLabel from '../../components/parts/AttendStatusLabel'
import BlinkField from '../../components/parts/BlinkField'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import IconLabel from '../../components/parts/IconLabel'
import useCircle from '../../hooks/useCircle'
import useEvent from '../../hooks/useEvent'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { SoleilCircleAppModel, SoleilCircleStatus, SoleilEvent } from 'soleil'

const EventCircleAttendanceRecordPage: React.FC = () => {
  const { code } = useParams()
  const { getEventByCodeAsync } = useEvent()
  const { updateCircleStatusByCodeAsync, getCirclesByEventCodeAsync } = useCircle()

  const [event, setEvent] = useState<SoleilEvent>()
  const [forceAttendanceCheck, setForceAttendanceCheck] = useState(false)
  const [isShowUnregistered, setIsShowUnregistered] = useState(false)
  const [circles, setCircles] = useState<Record<string, SoleilCircleAppModel>>()

  const filteredCircles = useMemo(() => {
    if (!circles) return null
    return Object.entries(circles)
      .filter(([, circle]) => !isShowUnregistered || !circle.status)
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

    if (!confirm(`${circle.name} (${circle.spaceNumber}) のステータスを「${statusText}」にします。\nよろしいですか？`)) {
      return
    }

    updateCircleStatusByCodeAsync(circleCode, status, abort)
      .then(() => {
        alert('状態を更新しました')
        setCircles(s => (s && {
          ...s,
          [circleCode]: {
            ...circle,
            status,
            updatedAt: new Date().getTime()
          }
        }))
      })
      .catch(err => { throw err })
  }, [circles, forceAttendanceCheck])

  const handleRefresh = useCallback(() => {
    if (!code) return
    const abort = new AbortController()
    getCirclesByEventCodeAsync(code, abort)
      .then(setCircles)
      .catch(err => { throw err })
  }, [code, getCirclesByEventCodeAsync])

  useEffect(() => {
    if (!code) return
    const abort = new AbortController()
    getEventByCodeAsync(code, abort)
      .then(setEvent)
      .catch(err => { throw err })
    return () => abort.abort()
  }, [code, getEventByCodeAsync])

  useEffect(() => {
    if (!code) return
    const abort = new AbortController()
    getCirclesByEventCodeAsync(code, abort)
      .then(setCircles)
      .catch(err => { throw err })
  }, [code, getCirclesByEventCodeAsync])

  return (
    <DefaultLayout>
      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
        <li><Link to={`/events/${code}`}>{event?.name ?? <BlinkField />}</Link></li>
      </Breadcrumbs>

      <h1>出席簿</h1>

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
          {filteredCircles && Object.keys(filteredCircles).length === 0 && (
            <tr>
              <td colSpan={6}>該当するサークルが存在しません</td>
            </tr>
          )}
          {filteredCircles && Object.entries(filteredCircles).map(([id, c]) => (
            <tr key={id}>
              <td>{c.spaceNumber}</td>
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

export default EventCircleAttendanceRecordPage
