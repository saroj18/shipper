import RootLayout from "./RootLayout";
import Home from "./pages/home";
import Login from "./pages/login";
import { createBrowserRouter, RouterProvider } from "react-router";
import Main from "./pages/main";
import AddProject from "./pages/add-project";
import CreateProject from "./pages/create-project";
import ProjectDashboard from "./pages/project-dashboard.tsx/pages/dashboard/index.tsx";
import ProjectDashboardLayout from "./pages/project-dashboard.tsx/project-dashboard-layout.tsx";
import Deployment from "./pages/project-dashboard.tsx/pages/deployment/index.tsx";
import SettingLayout from "./pages/project-dashboard.tsx/pages/settings/settingLayout.tsx";
import ProjectSettings from "./pages/project-dashboard.tsx/pages/settings/pages/general/index.tsx";
import ScriptSettings from "./pages/project-dashboard.tsx/pages/settings/pages/script-setting/index.tsx";
import EnvironmentVariables from "./pages/project-dashboard.tsx/pages/settings/pages/environment-variable/index.tsx";
import DeploymentLogs from "./pages/project-dashboard.tsx/pages/logs/index.tsx";
import ProtectedRoute from "./components/protected-route.tsx";
import PublicRoute from "./components/public-route.tsx";
import Loader from "./components/loader.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: () => <Loader />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "main",
        element: (
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        ),
      },
      {
        path: "addproject",
        element: (
          <ProtectedRoute>
            <AddProject />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-project/:repoName",
        element: (
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        ),
      },
      {
        path: "project-dashboard",
        element: (
          <ProtectedRoute>
            <ProjectDashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: (
              <ProjectDashboard
                projectName="blog-crud-htg3"
                deploymentUrl="blog-crud-htg3-3pym21hp3-sarojs-projects-c85bde44.vercel.app"
                domain="blog-crud-htg3.vercel.app"
                createdAt="2h ago"
                createdBy="saroj18"
                branch="main"
                commitMessage="Merge pull request #1 from saroj18/admin"
                commitId="4404524"
                status="ready"
                previewUrl="/placeholder.svg?height=400&width=600"
              />
            ),
          },
          {
            path: "deployment",
            element: <Deployment />,
          },
          {
            path: "logs",
            element: <DeploymentLogs />,
          },
          {
            path: "settings",
            element: <SettingLayout />,
            children: [
              {
                path: "",
                element: (
                  <ProjectSettings
                    projectName="blog-crud-htg3"
                    projectId="c85bde44"
                    lastUpdated="6h ago"
                  />
                ),
              },
              {
                path: "build-script",
                element: <ScriptSettings />,
              },

              {
                path: "environment-variables",
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
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
