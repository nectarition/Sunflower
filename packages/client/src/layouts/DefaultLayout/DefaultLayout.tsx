import { useCallback, useState } from 'react'
import { MdClose, MdMenu } from 'react-icons/md'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import LogotypeSVG from '../../assets/logotype.svg'
import useFirebase from '../../hooks/useFirebase'
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
  const { sessionCode, sessionName } = useSession()
  const { isLoggedIn, user, logoutAsync } = useFirebase()
  const { isSmallDisplay } = useWindowDimension()

  const [showMenu, setIsShowMenu] = useState(false)

  const handleLogout = useCallback(() => {
    logoutAsync()
      .catch((err) => {
        console.error('ログアウトに失敗しました:', err)
      })
  }, [])

  return (
    <Container>
      {!props.allowAnonymous && <RequiredLogin />}
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
                {showMenu ? <MdClose /> : <MdMenu />}
              </MenuButton>
            )}
          </MenuButtonArea>
        </HeaderWrap>
        <MenuWrap>
          <SideMenu
            sessionName={sessionName}
            sessionCode={sessionCode}
            user={user}
            handleLogout={handleLogout}
            showMenu={isSmallDisplay === false || showMenu}
            closeMenu={() => setIsShowMenu(false)} />
        </MenuWrap>
      </Sidebar>
      <MainContainer>
        {(props.allowAnonymous ?? (!props.allowAnonymous && isLoggedIn)) && props.children}
      </MainContainer>
    </Container>
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
  @media screen and (max-width: 840px) {
    border-left: none;
  }
`
const BrandArea = styled.div`
  border-left: 24px solid var(--brand-color);
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
`
