import ProtectedRoutes from '@/components/protected-routes/protected-routes';
import Appointments from '@/pages/appointments/appointments';
import ChangePassword from '@/pages/auth/change-password';
import Login from '@/pages/auth/login';
import Unauthorized from '@/pages/auth/unauthorized';
import Dashboard from '@/pages/dashboard/dashboard';
import Departments from '@/pages/departments/departments';
import Permissions from '@/pages/permissions/permissions';
import Persons from '@/pages/persons/persons';
import ReportViewer from '@/pages/reports/report-viewer';
import Roles from '@/pages/roles/roles';
import Users from '@/pages/users/users';
import Vehicles from '@/pages/vehicles/vehicles';
import RootLayout from '@/RootLayout';
import { createBrowserRouter } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/change-password',
    Component: ChangePassword,
  },
  {
    path: '/unauthorized',
    Component: Unauthorized,
  },
  {
    path: '/report-viewer',
    Component: ReportViewer,
  },
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        ),
      },
      {
        path: '/departments',
        element: (
          <ProtectedRoutes>
            <Departments />
          </ProtectedRoutes>
        ),
      },
      {
        path: '/roles',
        element: <Roles />,
      },
      {
        path: '/permissions',
        element: <Permissions />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: '/persons',
        element: <Persons />,
      },
      {
        path: '/vehicles',
        element: <Vehicles />,
      },
      {
        path: '/appointments',
        element: <Appointments />,
      },
    ],
  },
]);

export default router;
