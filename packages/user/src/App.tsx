import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import AttendanceRecordPage from './pages/CircleAttendanceRecordPage/CircleAttendanceRecordPage'
import CircleManagePage from './pages/CircleManagePage/CircleManagePage'
import RollCallPage from './pages/CircleRollCallPage/CircleRollCallPage'
import GuidePage from './pages/GuidePage/GuidePage'
import IndexPage from './pages/IndexPage/IndexPage'
import LoginPage from './pages/LoginPage/LoginPage'
import TestPage from './pages/TestPage/TestPage'
import AuthenticationProvider from './providers/AuthenticationProvider'

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
      },
      {
        path: 'test',
        element: <TestPage />
      }
    ]
  }
])

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthenticationProvider>
        <RouterProvider router={router} />
      </AuthenticationProvider>
    </HelmetProvider>
  )
}

export default App
