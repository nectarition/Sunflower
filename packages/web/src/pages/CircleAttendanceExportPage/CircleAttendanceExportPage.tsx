import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FormTextarea from '../../components/Form/FormTextarea'
import BlinkField from '../../components/parts/BlinkField'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import useCircle from '../../hooks/useCircle'
import useEvent from '../../hooks/useEvent'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { SoleilCircleAppModel, SoleilEvent } from 'soleil'

const CircleAttendanceExportPage: React.FC = () => {
  const { code } = useParams()
  const { getEventByCodeAsync } = useEvent()
  const { getCirclesByEventCodeAsync } = useCircle()

  const [event, setEvent] = useState<SoleilEvent>()
  const [circles, setCircles] = useState<Record<string, SoleilCircleAppModel>>()  

  const attendancesTSV = useMemo(() => {
    if (!circles) return ''
    const tsv = Object.values(circles)
      .map(c => `${c.spaceNumber}\t${c.status === 1 ? 1 : 0}\t${c.updatedAt}`)
      .join('\n')
    return tsv
  }, [circles])

  useEffect(() => {
    if (!code) return
    const abort = new AbortController()
    getEventByCodeAsync(code, abort)
      .then(setEvent)
      .catch(err => { throw err })
    getCirclesByEventCodeAsync(code, abort)
      .then(setCircles)
      .catch(err => { throw err })
    return () => abort.abort()
  }, [code, getEventByCodeAsync, getCirclesByEventCodeAsync])
  
  return (
    <DefaultLayout title="出欠情報のエクスポート">
      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
        <li><Link to={`/events/${code}`}>{event?.name ?? <BlinkField />}</Link></li>
      </Breadcrumbs>

      <h1>出欠情報のエクスポート</h1>

      <FormTextarea
        readOnly
        value={attendancesTSV} />
    </DefaultLayout>
  )
}

export default CircleAttendanceExportPage
