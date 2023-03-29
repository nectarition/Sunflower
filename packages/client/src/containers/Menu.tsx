import { useNavigate } from 'react-router-dom'

import DefaultLayout from '../components/Layouts/Default/DefaultLayout'

import FormSection from '../components/Form/FormSection'
import FormItem from '../components/Form/FormItem'
import Panel from '../components/parts/Panel'
import FormButton from '../components/Form/FormButton'
import LinkButton from '../components/parts/LinkButton'

const Menu: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout: () => void =
    () => {
      navigate('/login')
    }

  return (
    <DefaultLayout>
      <Panel title="操作中のイベント" subTitle="shiobana2">
        第二回しおばな祭
      </Panel>
      <FormSection>
        <FormItem>
          <LinkButton to="/register" size="large">出席登録<small>を行う</small></LinkButton>
        </FormItem>
        <FormItem>
          <LinkButton to="/list" size="large">出欠一覧<small>を表示する</small></LinkButton>
        </FormItem>
      </FormSection>
      <p>
        nirsmmy@gmail.com としてログイン中です。
      </p>
      <FormSection>
        <FormItem>
          <FormButton color="default" onClick={handleLogout}>ログアウト</FormButton>
        </FormItem>
      </FormSection>
    </DefaultLayout>
  )
}

export default Menu
