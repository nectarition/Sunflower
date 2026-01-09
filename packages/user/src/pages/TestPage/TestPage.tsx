import { UserCirclePlusIcon } from '@phosphor-icons/react'
import { useCallback, useState } from 'react'
import FormButton from '../../components/Form/FormButton'
import FormInput from '../../components/Form/FormInput'
import FormItem from '../../components/Form/FormItem'
import FormLabel from '../../components/Form/FormLabel'
import FormSection from '../../components/Form/FormSection'
import IconLabel from '../../components/parts/IconLabel'
import useAccount from '../../hooks/useAccount'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'

const TestPage: React.FC = () => {
  const { createAccountAsync } = useAccount()
  
  const [account, setAccount] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleCreate = useCallback(async () => {
    const abort = new AbortController()
    await createAccountAsync(account.email, account.password, account.name, abort)
      .then(() => alert('アカウントを作成しました'))
      .catch((err) => alert(`アカウントの作成に失敗しました: ${err.message}`))
  }, [account, createAccountAsync])

  return (
    <DefaultLayout allowAnonymous={true}>
      <FormSection>
        <FormItem>
          <FormLabel>メールアドレス</FormLabel>
          <FormInput
            onChange={(e) => setAccount(s => ({ ...s, email: e.target.value }))}
            value={account.email} />
        </FormItem>
        <FormItem>
          <FormLabel>パスワード</FormLabel>
          <FormInput
            onChange={(e) => setAccount(s => ({ ...s, password: e.target.value }))}
            type="password"
            value={account.password} />
        </FormItem>
        <FormItem>
          <FormLabel>名前</FormLabel>
          <FormInput
            onChange={(e) => setAccount(s => ({ ...s, name: e.target.value }))}
            value={account.name} />
        </FormItem>
      </FormSection>
      <FormSection>
        <FormItem>
          <FormButton onClick={handleCreate}>
            <IconLabel
              icon={<UserCirclePlusIcon />}
              label="アカウント作成" />
          </FormButton>
        </FormItem>
      </FormSection>
    </DefaultLayout>
  )
}

export default TestPage
