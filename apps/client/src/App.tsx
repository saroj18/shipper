import RootLayout from "./RootLayout";
import Home from "./pages/home";
import Login from "./pages/login";
import { createBrowserRouter, RouterProvider } from "react-router";
import Main from "./pages/main";

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
