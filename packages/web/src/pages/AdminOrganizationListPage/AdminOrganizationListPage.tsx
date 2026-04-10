import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import useAdmin from '../../hooks/useAdmin'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { Organization } from 'soleil'

const AdminOrganizationListPage: React.FC = () => {
  const { getOrganizationsAsync } = useAdmin()

  const [organizations, setOrganizations] = useState<Organization[]>()

  useEffect(() => {
    const abort = new AbortController()
    getOrganizationsAsync(abort)
      .then(setOrganizations)
      .catch(err => {
        if (err.name !== 'APIError') return
        throw err
      })
    return () => abort.abort()
  }, [getOrganizationsAsync])
  
  return (
    <DefaultLayout
      requiredAdmin={true}
      title="組織管理">
      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
      </Breadcrumbs>
      <h1>組織管理</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>組織名</th>
          </tr>
        </thead>
        <tbody>
          {organizations === undefined && (
            <tr>
              <td colSpan={2}>読み込み中...</td>
            </tr>
          )}
          {organizations?.length === 0 && (
            <tr>
              <td colSpan={2}>組織が存在しません</td>
            </tr>
          )}
          {organizations?.map((organization) => (
            <tr key={organization.id}>
              <td><Link to={`/admin/organizations/${organization.id}`}>{organization.id}</Link></td>
              <td><Link to={`/admin/organizations/${organization.id}`}>{organization.name}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </DefaultLayout>
  )
}

export default AdminOrganizationListPage
