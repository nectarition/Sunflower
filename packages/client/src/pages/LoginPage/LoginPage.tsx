import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { SignInIcon } from '@phosphor-icons/react'
import FormButton from '../../components/Form/FormButton'
import FormInput from '../../components/Form/FormInput'
import FormItem from '../../components/Form/FormItem'
import FormLabel from '../../components/Form/FormLabel'
import FormSection from '../../components/Form/FormSection'
import IconLabel from '../../components/parts/IconLabel'
import Panel from '../../components/parts/Panel'
import useFirebase from '../../hooks/useFirebase'
import useLocalizeFirebaseError from '../../hooks/useLocalizeFirebaseError'
import useSession from '../../hooks/useSession'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { loginByEmail } = useFirebase()
  const { localize } = useLocalizeFirebaseError()
  const { fetchSessionByCodeAsync } = useSession()

  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [sessionCode, setSessionCode] = useState<string>()
  
  const [isProcess, setProcess] = useState(false)
  const [error, setError] = useState<string>()

  const handleLogin = useCallback(() => {
    if (!email || !password || !sessionCode) return
    setProcess(true)
    loginByEmail(email, password)
      .then(() => {
        fetchSessionByCodeAsync(sessionCode)
          .then(() => navigate('/'))
          .catch(err => {
            setError(err.message === 'session not found' ? 'イベントコードが間違っています' : err.message)
            setProcess(false)
            throw err
          })
      })
      .catch(err => {
        const error = localize(err.message)
        setError(error)
        setProcess(false)
      })
  }, [email, password, sessionCode])
  return (
    <DefaultLayout title="ログイン" allowAnonymous>
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
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)} />
        </FormItem>
        <FormItem>
          <FormLabel>パスワード</FormLabel>
          <FormInput
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)} />
        </FormItem>
        <FormItem>
          <FormLabel>イベントコード</FormLabel>
          <FormInput
            value={sessionCode}
            onChange={e => setSessionCode(e.target.value)} />
        </FormItem>
      </FormSection>
      <FormSection>
        <FormItem>
          <FormButton
            onClick={handleLogin}
            disabled={!email || !password || !sessionCode || isProcess}
            $inlined>
            <IconLabel icon={<SignInIcon />} label="ログイン" />
          </FormButton>
        </FormItem>
      </FormSection>

      {error &&
        <Panel title="ログインに失敗しました" subTitle={error} />
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
