import styled from '@emotion/styled'
import { ListIcon, XIcon } from '@phosphor-icons/react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import LogotypeSVG from '../../assets/logotype.svg'
import useAccount from '../../hooks/useAccount'
import useWindowDimension from '../../hooks/useWindowDimension'
import HeadHelper from '../../libs/Helmet'
import RequiredLogin, { type RedirectAfterLogin } from '../../libs/RequiredLogin'
import Sidebar from './Sidebar'

interface Props {
  children: React.ReactNode
  title?: string
  allowAnonymous?: boolean
  requiredAdmin?: boolean
  redirectAfterLogin?: RedirectAfterLogin
}
const DefaultLayout: React.FC<Props> = (props) => {
  const { user, logoutAsync } = useAccount()
  const { isSmallDisplay } = useWindowDimension()

  const [showMenu, setIsShowMenu] = useState(false)

  const handleLogout = useCallback(() => {
    logoutAsync()
      .catch((err) => {
        console.error('ログアウトに失敗しました:', err)
      })
  }, [])

  return (
    <RequiredLogin
      allowAnonymous={props.allowAnonymous}
      redirectAfterLogin={props.redirectAfterLogin}
      requiredAdmin={props.requiredAdmin}>
      <Container>
        <HeadHelper title={props.title} />
        <SidebarWrap>
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
            <Sidebar
              closeMenu={() => setIsShowMenu(false)}
              handleLogout={handleLogout}
              showMenu={isSmallDisplay === false || showMenu}
              user={user} />
          </MenuWrap>
        </SidebarWrap>
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
const SidebarWrap = styled.div`
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
