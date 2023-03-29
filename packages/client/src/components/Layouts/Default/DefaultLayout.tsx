import styled from 'styled-components'
import useSession from '../../../hooks/useSession'

interface Props {
  children: React.ReactNode
}
const DefaultLayout: React.FC<Props> = (props) => {
  const { sessionCode, sessionName } = useSession()

  return (
    <Container>
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
        {props.children}
      </Main>
      <Footer>
        &copy; 2023 Nectarition
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
  padding: 10px 10%;
  background-color: #FFC93F;

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
  background-color: #F0F0F0;
  text-align: center;
`
