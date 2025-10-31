import { createBrowserRouter, Outlet, redirect } from 'react-router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import App from '@/App'
import { Login } from '@/components/auth/Login'
import { Register } from '@/components/auth/Register'
import { ErrorBoundary } from '@/components/error-boundary'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { UserDashboard } from '@/components/auth/UserDashboard'
import { auth } from '@/lib/firebase'
import KanbanBoard from '@/components/pages/kanban-board'
import DailyTasks from '@/components/pages/daily-tasks'
import CalendarPage from '@/components/pages/calendar-page'
import LandingPage from '@/components/pages/landing-page'
import DashBoard from '@/components/pages/dashboard'

const queryClient = new QueryClient()

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position='top-center' />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Providers><App /></Providers>,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'calendar',
        element: <CalendarPage />
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute><DashBoard /></ProtectedRoute>
      },
      {
        path: 'daily-tasks',
        element: <ProtectedRoute><DailyTasks /></ProtectedRoute>
      },
      {
        path: 'kanban',
        element: <ProtectedRoute><KanbanBoard /></ProtectedRoute>
      },
      {
        path: 'profile',
        element: <ProtectedRoute><UserDashboard /></ProtectedRoute>
      }
    ]
  },
  {
    path: 'auth',
    element: <Providers><Outlet /></Providers>,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />,
        loader: async () => {
          const currentUser = auth.currentUser
          if (currentUser) {
            return redirect('/')
          }
          return null
        }
      }
    ]
  }
])