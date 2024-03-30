import React, { useEffect, useState } from "react";
import { getData } from "../api";
import { useLoaderData, redirect } from "react-router-dom";
import FlipLayer from "../Components/FlipLayer";
import BackgroundLayer from "../Components/BackgroundLayer";
import TilesLayer from "../Components/TilesLayer";
import BorderLayer from "../Components/BorderLayer";

import "./Mosaic.css";

export const mosaicLoader = async ({ params, request }) => {
  const eventId = params.eventId;

  // get event information
  const event_info = await getData(`events/${eventId}?type=photomosaic`).then(
    (res) => {
      if (res.statusCode === 404) {
        // no active event with a photo mosiac found
        return redirect("/");
      } else {
        return res.data ?? {};
      }
    }
  );

  // get image data
  const image_data = await getData(`/media/${eventId}/photo_mosaic`).then(
    (res) => {
      // todo handle additional pages
      return res.data ?? [];
    }
  );

  return { event: event_info, images: image_data };
};

const Mosaic = () => {
  const { event, images } = useLoaderData();
  const [activeTile, setActiveTile] = useState();

  console.log({ event });
  console.log({ images });
  return (
    <div className="container">
      <FlipLayer data={images} />
      <BorderLayer />
      <TilesLayer
        className="tiles"
        data={images}
        rows={event.rows}
        cols={event.cols}
        height={event.height}
        width={event.width}
        offset={event.offset}
        tilesPrefix={event.tiles_prefix}
      />
      <BackgroundLayer
        className="background"
        src={event.fill_image}
        height={event.height}
        width={event.width}
        x={0}
        y={0}
      />
    </div>
  );
};

export default Mosaic;
