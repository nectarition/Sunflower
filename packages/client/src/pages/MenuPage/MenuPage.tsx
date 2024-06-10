import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import FormButton from '../../components/Form/FormButton'
import FormItem from '../../components/Form/FormItem'
import FormSection from '../../components/Form/FormSection'
import LinkButton from '../../components/parts/LinkButton'
import Panel from '../../components/parts/Panel'
import useFirebase from '../../hooks/useFirebase'
import useSession from '../../hooks/useSession'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'

const MenuPage: React.FC = () => {
  const navigate = useNavigate()
  const { sessionCode, sessionName, resetSession } = useSession()
  const { user, logout } = useFirebase()

  const handleLogout = useCallback(() => {
    logout()
    resetSession()
    navigate('/login')
  }, [])

  return (
    <DefaultLayout>
      <Panel title="操作中のイベント" subTitle={sessionCode}>
        {sessionName}
      </Panel>
      <FormSection>
        <FormItem>
          <LinkButton to="/register" size="large">
            出席登録<small>を行う</small>
          </LinkButton>
        </FormItem>
        <FormItem>
          <LinkButton to="/list" size="large">
            出欠確認<small>を行う</small>
          </LinkButton>
        </FormItem>
      </FormSection>
      {user
      && (
        <p>
          {user.email} としてログイン中です。
        </p>
      )}
      <FormSection>
        <FormItem>
          <FormButton color="default" onClick={handleLogout}>ログアウト</FormButton>
        </FormItem>
      </FormSection>

      <h3>管理</h3>
      <FormSection>
        <FormItem>
          <LinkButton to="/manage" color="default">
            封筒データ<small>を上書きする</small>
          </LinkButton>
        </FormItem>
        <FormItem>
          <LinkButton to="/guide" color="default">
            利用ガイド<small>を見る</small>
          </LinkButton>
        </FormItem>
      </FormSection>
    </DefaultLayout>
  )
}

export default MenuPage
