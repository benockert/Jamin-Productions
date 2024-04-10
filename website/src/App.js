import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <></>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
