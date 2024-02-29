import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RequestsRoutes from "./Requests/routes";
import InteractiveMediaRoutes from "./InteractiveMedia/routes";

function App() {
  const router = createBrowserRouter([
    ...RequestsRoutes,
    ...InteractiveMediaRoutes,
  ]);

  return <RouterProvider router={router} />;
}

export default App;
