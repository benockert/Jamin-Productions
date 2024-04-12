import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./Pages/Main";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      errorElement: <></>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
