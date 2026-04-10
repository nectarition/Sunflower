import styled from '@emotion/styled'
import { useCallback } from 'react'
import FormButton from '../../components/Form/FormButton'
import FormItem from '../../components/Form/FormItem'
import FormSection from '../../components/Form/FormSection'
import useNectaritionID from '../../hooks/useNectaritionID'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'

const LoginPage: React.FC = () => {
  const { getAuthorizeURLAsync } = useNectaritionID()

  const handleLoginWithNectaritionID = useCallback(() => {
    getAuthorizeURLAsync(new AbortController())
      .then(url => {
        window.location.href = url
      })
  }, [getAuthorizeURLAsync])

  return (
    <DefaultLayout
      allowAnonymous={true}
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
