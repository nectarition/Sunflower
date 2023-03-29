import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useFirebase from '../hooks/useFirebase'
import useSession from '../hooks/useSession'
import useLocalizeFirebaseError from '../hooks/useLocalizeFirebaseError'

import DefaultLayout from '../components/Layouts/Default/DefaultLayout'
import FormSection from '../components/Form/FormSection'
import FormItem from '../components/Form/FormItem'
import FormInput from '../components/Form/FormInput'
import FormLabel from '../components/Form/FormLabel'
import FormButton from '../components/Form/FormButton'
import Panel from '../components/parts/Panel'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { loginByEmail } = useFirebase()
  const { localize } = useLocalizeFirebaseError()
  const { fetchSessionByCodeAsync } = useSession()

  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [sessionCode, setSessionCode] = useState<string>()
  const [isProcessing, setProcessing] = useState(false)
  const [error, setError] = useState<string>()

  const handleLogin: () => void =
    () => {
      if (!email || !password || !sessionCode) return
      setProcessing(true)
      loginByEmail(email, password)
        .then(() => {
          fetchSessionByCodeAsync(sessionCode)
            .then(() => navigate('/'))
            .catch((err: Error) => {
              setError(err.message === 'session not found' ? 'イベントコードが間違っています' : err.message)
              setProcessing(false)
            })
        })
        .catch((err: Error) => {
          const error = localize(err.message)
          setError(error)
          setProcessing(false)
        })
    }

  return (
    <DefaultLayout title="ログイン">
      <h2>ログイン</h2>
      <FormSection>
        <FormItem>
          <FormLabel>メールアドレス</FormLabel>
          <FormInput type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormItem>
        <FormItem>
          <FormLabel>パスワード</FormLabel>
          <FormInput type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormItem>
        <FormItem>
          <FormLabel>イベントコード</FormLabel>
          <FormInput
            value={sessionCode}
            onChange={e => setSessionCode(e.target.value)}
          />
        </FormItem>
        <FormItem>
          <FormButton
            onClick={handleLogin}
            disabled={!email || !password || !sessionCode || isProcessing}>
            ログイン
          </FormButton>
        </FormItem>
      </FormSection>
      {error &&
        <Panel title="ログインに失敗しました" subTitle={error} />
      }
    </DefaultLayout>

  )
}

export default Login
