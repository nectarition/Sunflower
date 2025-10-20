import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { SignInIcon } from '@phosphor-icons/react'
import FormButton from '../../components/Form/FormButton'
import FormInput from '../../components/Form/FormInput'
import FormItem from '../../components/Form/FormItem'
import FormLabel from '../../components/Form/FormLabel'
import FormSection from '../../components/Form/FormSection'
import IconLabel from '../../components/parts/IconLabel'
import Panel from '../../components/parts/Panel'
import useAccount from '../../hooks/useAccount'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { authenticateAsync } = useAccount()

  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  
  const [isProcess, setProcess] = useState(false)
  const [error, setError] = useState<string>()

  const handleLogin = useCallback(() => {
    if (!email || !password) return
    const abort = new AbortController()
    setProcess(true)
    authenticateAsync(email, password, abort)
      .then(() => {
        navigate('/')
      })
      .catch(err => {
        setError(err.message)
        setProcess(false)
      })
  }, [email, password])

  return (
    <DefaultLayout
      allowAnonymous
      title="ログイン">
      <HeroContainer>
        <HeroTitle>🌻Soleil <small>ねくたりしょんソレイユ</small></HeroTitle>
        <p>
          同人誌即売会向け出欠確認支援システム
        </p>
      </HeroContainer>

      <h2>ログイン</h2>

      <p>
        主催から提供されたアカウントでログインしてください。
      </p>

      <FormSection>
        <FormItem>
          <FormLabel>メールアドレス</FormLabel>
          <FormInput
            onChange={e => setEmail(e.target.value)}
            type="email"
            value={email} />
        </FormItem>
        <FormItem>
          <FormLabel>パスワード</FormLabel>
          <FormInput
            onChange={e => setPassword(e.target.value)}
            type="password"
            value={password} />
        </FormItem>
      </FormSection>
      <FormSection>
        <FormItem>
          <FormButton
            $inlined
            disabled={!email || !password || isProcess}
            onClick={handleLogin}>
            <IconLabel
              icon={<SignInIcon />}
              label="ログイン" />
          </FormButton>
        </FormItem>
      </FormSection>

      {error &&
        <Panel
          subTitle={error}
          title="ログインに失敗しました" />
      }
    </DefaultLayout>
  )
}

export default LoginPage

const HeroContainer = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 5px;
`
const HeroTitle = styled.div`
  font-size: 1.5em;
  font-weight: bold;
`
