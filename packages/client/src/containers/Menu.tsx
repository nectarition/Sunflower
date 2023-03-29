import { useNavigate } from 'react-router-dom'

import DefaultLayout from '../components/Layouts/Default/DefaultLayout'

import useFirebase from '../hooks/useFirebase'
import useSession from '../hooks/useSession'
import RequiredLogin from '../libs/RequiredLogin'

import FormSection from '../components/Form/FormSection'
import FormItem from '../components/Form/FormItem'
import Panel from '../components/parts/Panel'
import FormButton from '../components/Form/FormButton'
import LinkButton from '../components/parts/LinkButton'

const Menu: React.FC = () => {
  const { user, logout } = useFirebase()
  const navigate = useNavigate()
  const { sessionCode, sessionName, resetSession } = useSession()

  const handleLogout: () => void =
    () => {
      logout()
      resetSession()
      navigate('/login')
    }

  return (
    <DefaultLayout>
      <RequiredLogin />
      <Panel title="操作中のイベント" subTitle={sessionCode}>
        {sessionName}
      </Panel>
      <FormSection>
        <FormItem>
          <LinkButton to="/register" size="large">出席登録<small>を行う</small></LinkButton>
        </FormItem>
        <FormItem>
          <LinkButton to="/list" size="large">出欠一覧<small>を表示する</small></LinkButton>
        </FormItem>
      </FormSection>
      {user &&
        <p>
          {user.email} としてログイン中です。
        </p>
      }
      <FormSection>
        <FormItem>
          <FormButton color="default" onClick={handleLogout}>ログアウト</FormButton>
        </FormItem>
      </FormSection>

      <h3>管理</h3>
      <FormSection>
        <FormItem>
          <LinkButton to="/manage" color="default">封筒データ<small>を管理する</small></LinkButton>
        </FormItem>
      </FormSection>
    </DefaultLayout >
  )
}

export default Menu
