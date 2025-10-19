import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { ListIcon, XIcon } from '@phosphor-icons/react'
import LogotypeSVG from '../../assets/logotype.svg'
// import useFirebase from '../../hooks/useFirebase'
import useAccount from '../../hooks/useAccount'
import useSession from '../../hooks/useSession'
import useWindowDimension from '../../hooks/useWindowDimension'
import HeadHelper from '../../libs/Helmet'
import RequiredLogin from '../../libs/RequiredLogin'
import SideMenu from './SideMenu'

interface Props {
  children: React.ReactNode
  title?: string
  allowAnonymous?: boolean
}
const DefaultLayout: React.FC<Props> = (props) => {
  const { sessionState, resetSession } = useSession()
  const { user, logoutAsync } = useAccount()
  const { isSmallDisplay } = useWindowDimension()

  const [showMenu, setIsShowMenu] = useState(false)

  const handleLogout = useCallback(() => {
    logoutAsync()
      .then(() => resetSession())
      .catch((err) => {
        console.error('ログアウトに失敗しました:', err)
      })
  }, [])

  return (
    <RequiredLogin allowAnonymous={props.allowAnonymous}>
      <Container>
        <HeadHelper title={props.title} />
        <Sidebar>
          <HeaderWrap>
            <BrandArea>
              <Link to="/">
                <LogotypeImage src={LogotypeSVG} />
              </Link>
            </BrandArea>
            <MenuButtonArea>
              {isSmallDisplay && (
                <MenuButton onClick={() => setIsShowMenu(!showMenu)}>
                  {showMenu ? <XIcon /> : <ListIcon />}
                </MenuButton>
              )}
            </MenuButtonArea>
          </HeaderWrap>
          <MenuWrap>
            <SideMenu
              closeMenu={() => setIsShowMenu(false)}
              handleLogout={handleLogout}
              sessionState={sessionState}
              showMenu={isSmallDisplay === false || showMenu}
              user={user} />
          </MenuWrap>
        </Sidebar>
        <MainContainer>
          {(props.allowAnonymous ?? (!props.allowAnonymous && user)) && props.children}
        </MainContainer>
      </Container>
    </RequiredLogin>
  )
}

export default DefaultLayout

const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 280px 1fr;
  @media screen and (max-width: 840px) {
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
  }
`
const Sidebar = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  background-color: var(--panel-background-color);
`
const MenuWrap = styled.div`
  overflow-y: auto;
`
const HeaderWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 36px;
  background-color: var(--brand-background-color);
  border-left: 24px solid var(--brand-color);
  @media screen and (max-width: 840px) {
    border-left: none;
  }
`
const BrandArea = styled.div`
  background-color: var(--brand-background-color);
  padding: 10px;
  font-size: 0;
`
const MenuButtonArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0;

  @media screen and (max-width: 840px) {
    background-color: var(--brand-color);
  }
`
const MenuButton = styled.button`
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
    color: var(--white-color);
  }
`
const LogotypeImage = styled.img`
  height: 16px;
`
const MainContainer = styled.main`
  padding: 20px;
  overflow-y: auto;
`
