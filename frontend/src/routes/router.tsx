import Login from '@/pages/auth/login';
import Unauthorized from '@/pages/auth/unauthorized';
import Dashboard from '@/pages/dashboard/dashboard';
import Departments from '@/pages/departments/departments';
import Permissions from '@/pages/permissions/permissions';
import Roles from '@/pages/roles/roles';
import Users from '@/pages/users/users';
import RootLayout from '@/RootLayout';
import { createBrowserRouter } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/unauthorized',
    Component: Unauthorized,
  },
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/departments',
        element: <Departments />,
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
    ],
  },
]);

export default router;
