import RootLayout from "./RootLayout";
import Home from "./pages/home";
import Login from "./pages/login";
import { createBrowserRouter, RouterProvider } from "react-router";
import Main from "./pages/main";
import AddProject from "./pages/add-project";
import CreateProject from "./pages/create-project";
import BuildLogs from "./pages/build-logs";
import ProjectDashboard from "./pages/project-dashboard.tsx/pages/dashboard/index.tsx";
import ProjectDashboardLayout from "./pages/project-dashboard.tsx/project-dashboard-layout.tsx";
import Deployment from "./pages/project-dashboard.tsx/pages/deployment/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "main",
        element: <Main />,
      },
      {
        path: "addproject",
        element: <AddProject />,
      },
      {
        path: "create-project",
        element: <CreateProject />,
      },
      {
        path: "project-dashboard",
        element: <ProjectDashboardLayout />,
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
