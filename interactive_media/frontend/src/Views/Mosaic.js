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

  console.log({ event_info });
  console.log({ image_data });

  return { event: event_info, images: image_data };
};

const Mosaic = () => {
  const { event, images } = useLoaderData();
  const [activeTile, setActiveTile] = useState({});
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  // determine window size
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // determine width and height scale compared to window size
  const widthScale = screenWidth / event.width;
  const heightScale = screenHeight / event.height;

  // determine the height and width of each tile
  const tileWidth = screenWidth / event.cols;
  const tileHeight = screenHeight / event.rows;

  // determine left and top position for flipping cards to end at the center
  const centerLeft = screenWidth / 2 - tileWidth / 2;
  const centerTop = screenHeight / 2 - tileHeight / 2;

  useEffect(() => {
    const interval = setInterval(() => {
      // get the next random index, make sure isn't the same as the current
      let nextIndex = Math.floor(Math.random() * images.items.length);
      setActiveTile({ index: nextIndex, tile: images.items[nextIndex] });
    }, 8000);

    // once to start
    const startingIndex = Math.floor(Math.random() * images.items.length);
    setActiveTile({
      index: startingIndex,
      tile: images.items[startingIndex],
    });

    // clear on dismount
    return () => clearInterval(interval);
  }, []);

  const onBackgroundLoad = (className) => {
    document.getElementsByClassName(className)[0].style.opacity = 1;
    setBackgroundLoaded(true);
  };

  return (
    <div>
      {backgroundLoaded && (
        <>
          {activeTile.tile && (
            <FlipLayer
              tile={activeTile.tile}
              endingLeft={centerLeft}
              endingTop={centerTop}
            />
          )}
          {/* <BorderLayer /> */}
          <TilesLayer
            data={images}
            rows={event.rows}
            cols={event.cols}
            height={event.height}
            width={event.width}
            scaleY={heightScale}
            scaleX={widthScale}
            offset={event.offset}
            tilesPrefix={event.tiles_prefix}
          />
        </>
      )}
      <BackgroundLayer
        src={event.fill_image}
        width={screenWidth}
        height={screenHeight}
        onLoad={onBackgroundLoad}
      />
    </div>
  );
};

export default Mosaic;
