import React from 'react'
import ReactDOM from 'react-dom/client'
import { Outlet, RouterProvider, ScrollRestoration, createBrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import ResetStyle from './styles/ResetStyle'
import ColorStyle from './styles/ColorStyle'
import GlobalStyle from './styles/GlobalStyle'

import './index.css'

import { getFirebaseApp } from './libs/FirebaseApp'

import MenuComponent from './containers/Menu'
import LoginComponent from './containers/Login'
import RegisterComponent from './containers/Register'
import ListComponent from './containers/List'
import ManageComponent from './containers/Manage'
import GuideComponent from './containers/Guide'

getFirebaseApp()

const Root: React.FC = () => (
  <>
    <Outlet />
    <ScrollRestoration />
  </>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <MenuComponent />
      },
      {
        path: 'login',
        element: <LoginComponent />
      },
      {
        path: 'register',
        element: <RegisterComponent />
      },
      {
        path: 'list',
        element: <ListComponent />
      },
      {
        path: 'manage',
        element: <ManageComponent />
      },
      {
        path: 'guide',
        element: <GuideComponent />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <ResetStyle />
      <ColorStyle />
      <GlobalStyle />
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
)
