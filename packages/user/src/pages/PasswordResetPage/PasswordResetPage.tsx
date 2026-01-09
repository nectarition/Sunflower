import { CheckIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FormButton from '../../components/Form/FormButton'
import FormInput from '../../components/Form/FormInput'
import FormItem from '../../components/Form/FormItem'
import FormLabel from '../../components/Form/FormLabel'
import FormSection from '../../components/Form/FormSection'
import IconLabel from '../../components/parts/IconLabel'
import useAccount from '../../hooks/useAccount'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'

const PasswordResetPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { resetPasswordAsync } = useAccount()

  const [password, setPassword] = useState({
    newPassword: '',
    newPasswordConfirm: ''
  })
  
  const token = useMemo(() => location.state?.passwordResetToken, [location.state])

  const handleResetPassword = useCallback(() => {
    if (!token) return
    if (password.newPassword.trim().length === 0) return
    if (password.newPassword !== password.newPasswordConfirm) return
    
    const abort = new AbortController()
    resetPasswordAsync(token, password.newPassword, abort)
      .then(() => {
        alert('パスワードがリセットされました。')
        navigate('/')
      })
      .catch(err => { throw err })
  }, [token, password, resetPasswordAsync])

  useEffect(() => {
    if (token) return
    navigate('/')
  }, [token])
  
  return (
    <DefaultLayout title="パスワード リセット">
      {token && (
        <>
          <h1>パスワード リセット</h1>
          <p>
            管理者よりパスワードのリセットが要求されました。新しいパスワードを設定してください。
          </p>
          <FormSection>
            <FormItem>
              <FormLabel>新しいパスワード</FormLabel>
              <FormInput
                onChange={(e) => setPassword(s => ({ ...s, newPassword: e.target.value }))}
                type="password"
                value={password.newPassword} />
            </FormItem>
            <FormItem>
              <FormLabel>新しいパスワード (確認)</FormLabel>
              <FormInput
                onChange={(e) => setPassword(s => ({ ...s, newPasswordConfirm: e.target.value }))}
                type="password"
                value={password.newPasswordConfirm} />
            </FormItem>
          </FormSection>
          <FormSection>
            <FormItem>
              <FormButton
                $inlined
                onClick={handleResetPassword}>
                <IconLabel
                  icon={<CheckIcon />}
                  label="パスワードをリセットする" />
              </FormButton>
            </FormItem>
          </FormSection>
        </>)}
    </DefaultLayout>
  )
}

export default PasswordResetPage
