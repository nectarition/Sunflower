import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import useAdmin from '../../hooks/useAdmin'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { SoleilEvent } from 'soleil'

const AdminEventListPage: React.FC = () => {
  const { getEventsAsync } = useAdmin()

  const [events, setEvents] = useState<SoleilEvent[]>()

  useEffect(() => {
    const abort = new AbortController()
    getEventsAsync(abort)
      .then(setEvents)
      .catch(err => {
        if (err.name !== 'APIError') return
        throw err
      })
    return () => abort.abort()
  }, [getEventsAsync])
  
  return (
    <DefaultLayout
      requiredAdmin={true}
      title="イベント管理">
      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
      </Breadcrumbs>
      <h1>イベント管理</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>組織名</th>
            <th>イベント名</th>
          </tr>
        </thead>
        <tbody>
          {events === undefined && (
            <tr>
              <td colSpan={3}>読み込み中...</td>
            </tr>
          )}
          {events?.length === 0 && (
            <tr>
              <td colSpan={3}>イベントが存在しません</td>
            </tr>
          )}
          {events?.map((event) => (
            <tr key={event.code}>
              <td><Link to={`/admin/events/${event.code}`}>{event.code}</Link></td>
              <td>{event.organization.name}</td>
              <td><Link to={`/admin/events/${event.code}`}>{event.name}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </DefaultLayout>
  )
}

export default AdminEventListPage
