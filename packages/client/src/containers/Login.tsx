import DefaultLayout from '../components/Layouts/Default/DefaultLayout'

import FormSection from '../components/Form/FormSection'
import FormItem from '../components/Form/FormItem'
import FormInput from '../components/Form/FormInput'
import FormLabel from '../components/Form/FormLabel'
import FormButton from '../components/Form/FormButton'
import Alert from '../components/parts/Alert'

const Login: React.FC = () => {
  return (
    <DefaultLayout>
      <FormSection>
        <FormItem>
          <FormLabel>メールアドレス</FormLabel>
          <FormInput type="email" />
        </FormItem>
        <FormItem>
          <FormLabel>パスワード</FormLabel>
          <FormInput type="password" />
        </FormItem>
        <FormItem>
          <FormLabel>イベントコード</FormLabel>
          <FormInput />
        </FormItem>
        <FormItem>
          <FormButton>ログイン</FormButton>
        </FormItem>
      </FormSection>
      <Alert>
        ログインに失敗しました
      </Alert>
    </DefaultLayout>

  )
}

export default Login
