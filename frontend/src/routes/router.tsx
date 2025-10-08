import ProtectedRoutes from '@/components/protected-routes/protected-routes';
import ActiveTimeReport from '@/pages/active-time-report/active-time-report';
import AppointmentLogReport from '@/pages/appointment-log-report/appointment-log-report';
import Appointments from '@/pages/appointments/appointments';
import ChangePassword from '@/pages/auth/change-password';
import Login from '@/pages/auth/login';
import Unauthorized from '@/pages/auth/unauthorized';
import Dashboard from '@/pages/dashboard/dashboard';
import Departments from '@/pages/departments/departments';
import Device from '@/pages/device/device';
import GateLogs from '@/pages/gate-logs/gate-logs';
import Permissions from '@/pages/permissions/permissions';
import Persons from '@/pages/persons/persons';
import ReportViewer from '@/pages/reports/report-viewer';
import Roles from '@/pages/roles/roles';
import Tenants from '@/pages/tenants/tenants';
import TimeInOut from '@/pages/time-in-out-report/time-in-out';
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
        path: '/tenants',
        element: <Tenants />,
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
      {
        path: '/gate-logs',
        element: <GateLogs />,
      },
      {
        path: '/active-time-report',
        element: <ActiveTimeReport />,
      },
      {
        path: '/time-in-out-report',
        element: <TimeInOut />,
      },
      {
        path: '/appointment-log-report',
        element: <AppointmentLogReport />,
      },
      {
        path: '/devices',
        element: <Device />,
      },
    ],
  },
]);

export default router;
