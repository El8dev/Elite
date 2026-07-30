import HomePage from './pages/HomePage';
import DevelopersPage from './pages/DevelopersPage';
import DeveloperProfilePage from './pages/DeveloperProfilePage';
import ProjectFullPage from './pages/ProjectFullPage';
import MasterpiecesPage from './pages/Masterpieces';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ArticlesPage from './pages/ArticlesPage';
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
    name: 'Articles',
    path: '/articles',
    element: <ArticlesPage />,
    public: true,
  },
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
    public: true,
  },
  {
    name: 'Masterpieces',
    path: '/masterpieces',
    element: <MasterpiecesPage />,
    public: true,
  },
  {
    name: 'Developers',
    path: '/developers',
    element: <DevelopersPage />,
    public: true,
  },
  {
    name: 'Developer Profile',
    path: '/developer/:identifier',
    element: <DeveloperProfilePage />,
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
