import { redirect } from "react-router-dom";
import Home from "./pages/Home";
import RequestASong, { requestASongPageLoader } from "./pages/RequestASong";
import ViewRequests, { viewRequestsPageLoader } from "./pages/ViewRequests";

const basepath = "/requests";
const RequestsRoutes = [
  {
    path: basepath,
    element: <Home />,
  },
  {
    path: `${basepath}/:eventId`,
    element: <RequestASong />,
    loader: requestASongPageLoader,
  },
  {
    path: `${basepath}/:eventId/view`,
    element: <ViewRequests />,
    loader: viewRequestsPageLoader,
  },
  {
    // 404: page not found
    path: `${basepath}/*`,
    loader: async () => {
      return redirect(basepath);
    },
  },
];

export default RequestsRoutes;
