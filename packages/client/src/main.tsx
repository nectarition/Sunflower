import React from 'react'
import ReactDOM from 'react-dom/client'
import { Outlet, RouterProvider, ScrollRestoration, createBrowserRouter } from 'react-router-dom'


import ResetStyle from './styles/ResetStyle'
import GlobalStyle from './styles/GlobalStyle'

import './index.css'

import { getFirebaseApp } from './libs/FirebaseApp'

import MenuComponent from './containers/Menu'
import LoginComponent from './containers/Login'
import RegisterComponent from './containers/Register'
import ListComponent from './containers/List'

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
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ResetStyle />
    <GlobalStyle />
    <RouterProvider router={router} />
  </React.StrictMode>
)
