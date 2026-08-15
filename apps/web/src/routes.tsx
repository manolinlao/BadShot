import { createBrowserRouter } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';
import { AppLayout } from './components/layout/AppLayout';
import { CreateShot } from './pages/CreateShot';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Profile } from './pages/Profile';
import { Register } from './pages/Register';

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
        element: <RequireAuth />,
        children: [
          {
            index: true,
            element: <Home />,
          },
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
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
