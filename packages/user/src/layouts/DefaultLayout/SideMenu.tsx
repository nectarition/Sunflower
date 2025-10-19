import { Link } from 'react-router-dom'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { GearIcon, HouseIcon, ListIcon, PencilIcon, SignInIcon, SignOutIcon } from '@phosphor-icons/react'
import { InfoIcon } from '@phosphor-icons/react/dist/ssr'
import type { LoggedInUser, SessionState } from 'soleil'

const menuLinks = [
  {
    sectionName: null,
    items: [
      { to: '/', icon: <HouseIcon />, label: 'ホーム' },
      { to: '/roll-call', icon: <PencilIcon />, label: '出席登録を行う' },
      { to: '/records', icon: <ListIcon />, label: '出席簿を見る' }
    ]
  },
  {
    sectionName: '管理者向け',
    items: [
      { to: '/guide', icon: <InfoIcon />, label: '利用ガイドを見る' },
      { to: '/manage', icon: <GearIcon />, label: '封筒コード管理' }
    ]
  }
]

interface Props {
  sessionState: SessionState | undefined
  showMenu: boolean
  user: LoggedInUser | null | undefined
  handleLogout: () => void
  closeMenu: () => void
}
const SideMenu: React.FC<Props> = (props) => {
  return (
    props.showMenu
      ? (
        <MenuWrap>
          {props.user === null || props.sessionState === undefined && (
            <MenuSection>
              <MenuLinkItem to="/login">
                <MenuIcon><SignInIcon /></MenuIcon>
                <MenuLabel>ログイン</MenuLabel>
              </MenuLinkItem>
            </MenuSection>
          )}
          {props.user && props.sessionState && (
            <>
              <MenuSection>
                <MenuItemCard>
                  <MenuItemCardTitle>ログイン情報</MenuItemCardTitle>
                  <MenuItemCardContent>
                    {props.user.name}<br />
                    {props.sessionState.session.name} ({props.sessionState.sessionCode})
                  </MenuItemCardContent>
                </MenuItemCard>
                <MenuButtonItem onClick={props.handleLogout}>
                  <MenuIcon><SignOutIcon /></MenuIcon>
                  <MenuLabel>ログアウト</MenuLabel>
                </MenuButtonItem>
              </MenuSection>
              {menuLinks
                .map((menuLink, index) => (
                  <MenuSection key={index}>
                    {menuLink.sectionName && (
                      <MenuSectionTitle>{menuLink.sectionName}</MenuSectionTitle>
                    )}
                    <MenuItemRack>
                      {menuLink.items.map((item, index) => (
                        <MenuLinkItem
                          key={index}
                          onClick={props.closeMenu}
                          to={item.to}>
                          <MenuIcon>{item.icon}</MenuIcon>
                          <MenuLabel>{item.label}</MenuLabel>
                        </MenuLinkItem>
                      ))}
                    </MenuItemRack>
                  </MenuSection>
                ))}
            </>
          )}
        </MenuWrap>
      )
      : <></>
  )
}

export default SideMenu

const MenuWrap = styled.div`
  padding: 10px;
`
const MenuSection = styled.div`
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`
const MenuSectionTitle = styled.div`
  margin-bottom: 5px;
  font-size: 0.8em;
  color: var(--text-light-color);
`
const MenuItemRack = styled.div`
  display: flex;
  flex-direction: column;
`
const menuItemStyle = css`
  padding: 5px;
  display: grid;
  grid-template-columns: 1.5em 1fr;
  gap: 5px;
  cursor: pointer;
  transition: background-color 0.1s;

  &:hover {
    background-color: var(--brand-background-active-color);
  }
`
const MenuLinkItem = styled(Link)`
  ${menuItemStyle}
  color: inherit;
  text-decoration: inherit;
`
const MenuButtonItem = styled.button`
  ${menuItemStyle}
  width: 100%;
  text-align: left;
  font: inherit;
  color: inherit;
  background-color: inherit;
  border: inherit;
  cursor: pointer;
`
const MenuIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 1.5em;
    height: 1.5em;
  }
`
const MenuLabel = styled.div``
const MenuItemCard = styled.div`
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
  padding: 10px;
  border: 1px solid var(--outline-color);
  border-radius: 5px;
`
const MenuItemCardTitle = styled.div`
  font-size: 0.8em;
`
const MenuItemCardContent = styled.div`
  font-weight: bold;
  font-size: 0.9em;
`
