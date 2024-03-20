import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import Mosaic, { mosaicLoader } from "./Viewers/Mosaic";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <h1>Path not supported</h1>,
    },
    {
      path: `/mosaic/:eventId`,
      element: <Mosaic />,
      loader: mosaicLoader,
      errorElement: <></>,
    },
    {
      // 404: page not found
      path: `/*`,
      loader: async () => {
        return redirect("/");
      },
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
