import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import useAdmin from '../../hooks/useAdmin'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { User } from 'soleil'

const AdminUserListPage: React.FC = () => {
  const { getUsersAsync } = useAdmin()

  const [users, setUsers] = useState<User[]>()

  useEffect(() => {
    const abort = new AbortController()
    getUsersAsync(abort)
      .then(setUsers)
      .catch(err => {
        if (err.name !== 'APIError') return
        throw err
      })
    return () => abort.abort()
  }, [getUsersAsync])
  
  return (
    <DefaultLayout
      requiredAdmin={true}
      title="ユーザ管理">
      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
      </Breadcrumbs>
      <h1>ユーザ管理</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>ユーザ名</th>
          </tr>
        </thead>
        <tbody>
          {users === undefined && (
            <tr>
              <td colSpan={2}>読み込み中...</td>
            </tr>
          )}
          {users?.length === 0 && (
            <tr>
              <td colSpan={2}>ユーザが存在しません</td>
            </tr>
          )}
          {users?.map((user) => (
            <tr key={user.id}>
              <td><Link to={`/admin/users/${user.id}`}>{user.id}</Link></td>
              <td><Link to={`/admin/users/${user.id}`}>{user.name}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </DefaultLayout>
  )
}

export default AdminUserListPage
