import styled from '@emotion/styled'
import { SignInIcon } from '@phosphor-icons/react'
import { useCallback, useState } from 'react'
import FormButton from '../../components/Form/FormButton'
import FormInput from '../../components/Form/FormInput'
import FormItem from '../../components/Form/FormItem'
import FormLabel from '../../components/Form/FormLabel'
import FormSection from '../../components/Form/FormSection'
import IconLabel from '../../components/parts/IconLabel'
import Panel from '../../components/parts/Panel'
import useAccount from '../../hooks/useAccount'
import useNectaritionID from '../../hooks/useNectaritionID'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { RedirectAfterLogin } from '../../libs/RequiredLogin'

const LoginPage: React.FC = () => {
  const { authenticateAsync } = useAccount()
  const { getAuthorizeURLAsync } = useNectaritionID()

  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  
  const [isProgress, setProgress] = useState(false)
  const [error, setError] = useState<string>()
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<RedirectAfterLogin>()

  const handleLogin = useCallback(() => {
    if (!email || !password) return
    const abort = new AbortController()
    setProgress(true)
    authenticateAsync(email, password, abort)
      .then((res) => {
        if (res.passwordResetToken) {
          setRedirectAfterLogin({
            pathname: '/reset-password',
            state: { passwordResetToken: res.passwordResetToken }
          })
        } else {
          setRedirectAfterLogin({
            pathname: '/'
          })
        }
      })
      .catch(err => {
        setError(err.message)
        setProgress(false)
      })
  }, [email, password])

  const handleLoginWithNectaritionID = useCallback(() => {
    getAuthorizeURLAsync(new AbortController())
      .then(url => {
        window.location.href = url
      })
  }, [getAuthorizeURLAsync])

  return (
    <DefaultLayout
      allowAnonymous={true}
      redirectAfterLogin={redirectAfterLogin}
      title="ログイン">
      <HeroContainer>
        <HeroTitle>🌻Soleil <small>ねくたりしょんソレイユ</small></HeroTitle>
        <p>
          同人誌即売会向け出欠確認支援システム
        </p>
      </HeroContainer>

      <FormSection>
        <FormItem $inlined>
          <FormButton
            $inlined
            onClick={handleLoginWithNectaritionID}>
            <LogoImage src="https://id.nectarition.jp/assets/logo/black.png" />
            ねくたりしょん ID でログイン
          </FormButton>
        </FormItem>
      </FormSection>

      <h3>ID/パスワード ログイン</h3>

      <p>
        ID/パスワード認証は 2026/2/28 に廃止予定です。<br />
        ねくたりしょん ID でのログインをお使いください。
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
            disabled={!email || !password || isProgress}
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
  background-color: #f0d180;
  border-radius: 5px;
`
const HeroTitle = styled.div`
  font-size: 1.5em;
  font-weight: bold;
`

const LogoImage = styled.img`
  height: 1.25em;
  vertical-align: sub;
  padding-right: 0.5em;

  transition: filter 0.2s;
  
  button:disabled & {
    filter: contrast(0.1)
  }
`
