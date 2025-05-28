import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import AttendanceRecordPage from './pages/AttendanceRecordPage/AttendanceRecordPage'
import CircleManagePage from './pages/CircleManagePage/CircleManagePage'
import GuidePage from './pages/GuidePage/GuidePage'
import IndexPage from './pages/IndexPage/IndexPage'
import LoginPage from './pages/LoginPage/LoginPage'
import RollCallPage from './pages/RollCallPage/RollCallPage'

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
        element: <IndexPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'roll-call',
        element: <RollCallPage />
      },
      {
        path: 'records',
        element: <AttendanceRecordPage />
      },
      {
        path: 'manage',
        element: <CircleManagePage />
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
      <RouterProvider router={router} />
    </HelmetProvider>
  )
}

export default App
