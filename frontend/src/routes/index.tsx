import { ElementType, Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// import { PATH_AFTER_LOGIN } from 'src/config';
// pages
// import GuestGuard from 'src/guards/GuestGuard';
// import AuthGuard from 'src/guards/AuthGuard';

import LoadingScreen from 'src/components/base/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

// function withAuthGuard(element: JSX.Element) { return <AuthGuard>{element}</AuthGuard> };

export default function Router() {
  return useRoutes([
    {
      path: '',
      children: [
        { path: 'home', element: <Home /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      children: [
        { element: <Navigate to="/landing" replace />, index: true },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

const Home = Loadable(lazy(() => import('src/pages/Home')));