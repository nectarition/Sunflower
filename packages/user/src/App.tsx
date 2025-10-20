import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import EventCircleAttendanceRecordPage from './pages/EventCircleAttendanceRecordPage/EventCircleAttendanceRecordPage'
import EventCircleManagePage from './pages/EventCircleManagePage/EventCircleManagePage'
import EventCircleRollCallPage from './pages/EventCircleRollCallPage/EventCircleRollCallPage'
import EventViewPage from './pages/EventViewPage/EventViewPage'
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
        path: 'events',
        children: [
          {
            path: ':code',
            children: [
              {
                index: true,
                element: <EventViewPage />
              },
              {
                path: 'roll-call',
                element: <EventCircleRollCallPage />
              },
              {
                path: 'records',
                element: <EventCircleAttendanceRecordPage />
              },
              {
                path: 'manage',
                element: <EventCircleManagePage />
              }
            ]
          }
        ]
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
