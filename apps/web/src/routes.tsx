import { createBrowserRouter } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';
import { RequireWritable } from './components/auth/RequireWritable';
import { AppLayout } from './components/layout/AppLayout';
import { CreateShot } from './pages/CreateShot';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { NotFound } from './pages/NotFound';
import { Profile } from './pages/Profile';
import { PublicProfile } from './pages/PublicProfile';
import { Register } from './pages/Register';
import { ResetPassword } from './pages/ResetPassword';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'users/:userId',
            element: <PublicProfile />,
          },
          {
            index: true,
            element: <Home />,
          },
          {
            element: <RequireWritable />,
            children: [
              {
                path: 'create',
                element: <CreateShot />,
              },
              {
                path: 'edit/:shotId',
                element: <CreateShot />,
              },
              {
                path: 'profile',
                element: <Profile />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
