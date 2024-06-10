import styled from 'styled-components'
import useFirebase from '../../hooks/useFirebase'
import useSession from '../../hooks/useSession'
import HeadHelper from '../../libs/Helmet'
import RequiredLogin from '../../libs/RequiredLogin'

interface Props {
  children: React.ReactNode
  title?: string
  allowAnonymous?: boolean
}
const DefaultLayout: React.FC<Props> = (props) => {
  const { sessionCode, sessionName } = useSession()
  const { isLoggedIn } = useFirebase()

  return (
    <Container>
      {!props.allowAnonymous && <RequiredLogin />}
      <HeadHelper title={props.title} />
      <Header>
        <HeaderBrand>
          🌻 Sunflower
        </HeaderBrand>
        <HeaderStatus>
          {sessionCode &&
            <>
              {sessionName} <small>({sessionCode})</small>
            </>}
        </HeaderStatus>
      </Header>
      <Main>
        {(props.allowAnonymous ?? (!props.allowAnonymous && isLoggedIn)) && props.children}
      </Main>
      <Footer>
        &copy; 2023 ねくたりしょん
      </Footer>
    </Container>
  )
}

export default DefaultLayout

const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
`
const Header = styled.header`
  padding: 10px 5%;
  background-color: #f0f0f0;
  color: #404040;
  font-weight: bold;
  border-bottom: 2px solid var(--primary-color);

  display: grid;
  grid-template-columns: 1fr 1fr;

  @media screen and (max-width: 840px) {
    padding: 10px 20px;
  }
`
const HeaderBrand = styled.section``
const HeaderStatus = styled.section`
  text-align: right;
`
const Main = styled.main`
  padding: 40px 12%;
  
  @media screen and (max-width: 840px) {
    padding: 20px;
  }
`
const Footer = styled.footer`
  padding: 10px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  background-color: #F0F0F0;
  text-align: center;
`
