import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ModalProvider } from '../../contexts/ModalContext'
import GuidePage from '../GuidePage/GuidePage'
import ListPage from '../ListPage/ListPage'
import LoginPage from '../LoginPage/LoginPage'
import ManagePage from '../ManagePage/ManagePage'
import MenuPage from '../MenuPage/MenuPage'
import RegisterPage from '../RegisterPage/RegisterPage'

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
        element: <MenuPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'list',
        element: <ListPage />
      },
      {
        path: 'manage',
        element: <ManagePage />
      },
      {
        path: 'guide',
        element: <GuidePage />
      }
    ]
  }
])

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </HelmetProvider>
  )
}

export default App
