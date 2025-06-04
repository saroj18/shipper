import RootLayout from './RootLayout';
import Home from './pages/home';
import Login from './pages/login';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Main from './pages/main';
import AddProject from './pages/add-project';
import CreateProject from './pages/create-project';
import ProjectDashboard from './pages/project-dashboard.tsx/pages/dashboard/index.tsx';
import ProjectDashboardLayout from './pages/project-dashboard.tsx/project-dashboard-layout.tsx';
import Deployment from './pages/project-dashboard.tsx/pages/deployment/index.tsx';
import SettingLayout from './pages/project-dashboard.tsx/pages/settings/settingLayout.tsx';
import ProjectSettings from './pages/project-dashboard.tsx/pages/settings/pages/general/index.tsx';
import ScriptSettings from './pages/project-dashboard.tsx/pages/settings/pages/script-setting/index.tsx';
import EnvironmentVariables from './pages/project-dashboard.tsx/pages/settings/pages/environment-variable/index.tsx';
import DeploymentLogs from './pages/project-dashboard.tsx/pages/logs/index.tsx';
import ProtectedRoute from './components/protected-route.tsx';
import PublicRoute from './components/public-route.tsx';
import Loader from './components/loader.tsx';
import { Toaster } from 'sonner';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    loader: () => <Loader />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: 'main',
        element: (
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        ),
      },
      {
        path: 'addproject',
        element: (
          <ProtectedRoute>
            <AddProject />
          </ProtectedRoute>
        ),
      },
      {
        path: 'create-project/:repoName',
        element: (
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        ),
      },
      {
        path: 'project-dashboard/:payload',
        element: (
          <ProtectedRoute>
            <ProjectDashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '',
            element: <ProjectDashboard />,
          },
          {
            path: 'deployment',
            element: <Deployment />,
          },
          {
            path: 'logs',
            element: <DeploymentLogs />,
          },
          {
            path: 'settings',
            element: <SettingLayout />,
            children: [
              {
                path: '',
                element: <ProjectSettings />,
              },
              {
                path: 'build-script',
                element: <ScriptSettings />,
              },

              {
                path: 'environment-variables',
                element: <EnvironmentVariables />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
const App = () => {
  return (
    < >
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
