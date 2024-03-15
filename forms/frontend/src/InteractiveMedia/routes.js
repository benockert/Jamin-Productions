import { redirect } from "react-router-dom";
import Home from "./pages/Home";
import SubmitToPhotoMosaic, {
  submitToPhotoMosaicPageLoader,
} from "./pages/SubmitToPhotoMosaic";
import ViewPhotos, { viewPhotosPageLoader } from "./pages/ViewPhotos";

const basepath = "/interactive";
const InteractiveMediaRoutes = [
  {
    path: basepath,
    element: <Home />,
  },
  {
    path: `${basepath}/mosaic/:eventId`,
    element: <SubmitToPhotoMosaic />,
    loader: submitToPhotoMosaicPageLoader,
    errorElement: <Home />,
  },
  {
    path: `${basepath}/mosaic/:eventId/view`,
    element: <ViewPhotos />,
    loader: viewPhotosPageLoader,
    errorElement: <Home />,
  },
  {
    // 404: page not found
    path: `${basepath}/*`,
    loader: async () => {
      return redirect(basepath);
    },
  },
];

export default InteractiveMediaRoutes;
