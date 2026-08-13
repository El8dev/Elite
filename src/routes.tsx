import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectFullPage from './pages/ProjectFullPage';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  /** Accessible without login. Routes without this flag require authentication. Has no effect when RouteGuard is not in use. */
  public?: boolean;
}

export const routes: RouteConfig[] = [

  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
    public: true,
  },
  {
    name: 'Projects',
    path: '/projects',
    element: <ProjectsPage />,
    public: true,
  },

  {
    name: 'Project Details',
    path: '/project/:projectId',
    element: <ProjectFullPage />,
    public: true,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    public: true,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <Dashboard />,
    public: false,
  },
];
