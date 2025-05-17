import RootLayout from "./RootLayout";
import Home from "./pages/home";
import Login from "./pages/login";
import { createBrowserRouter, RouterProvider } from "react-router";
import Main from "./pages/main";
import AddProject from "./pages/add-project";
import CreateProject from "./pages/create-project";

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
