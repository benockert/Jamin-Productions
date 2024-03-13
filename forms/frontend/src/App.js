import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RequestsRoutes from "./Requests/routes";
import InteractiveMediaRoutes from "./InteractiveMedia/routes";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <></>,
    },
    ...RequestsRoutes,
    ...InteractiveMediaRoutes,
  ]);

  return <RouterProvider router={router} />;
}

export default App;
