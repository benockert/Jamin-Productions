import React, { useEffect, useState } from "react";
import { getData, getMedia } from "../api";
import { useLoaderData, useParams, redirect } from "react-router-dom";
import FlipLayer from "../Components/FlipLayer";
import BackgroundLayer from "../Components/BackgroundLayer";
import TilesLayer from "../Components/TilesLayer";

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
  const image_data = await getMedia(
    `media/${eventId}/photo_mosaic?pageSize=50`
  ).then((res) => {
    return res.data ?? {};
  });

  return { event: event_info, images: image_data };
};

const Mosaic = () => {
  const { event, images } = useLoaderData();
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  // determine window size
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const onBackgroundLoad = (className) => {
    document.getElementsByClassName(className)[0].style.opacity = 1;
    setBackgroundLoaded(true);
  };

  return (
    <>
      {backgroundLoaded && (
        <MainLayers
          event={event}
          images={images}
          width={screenWidth}
          height={screenHeight}
        ></MainLayers>
      )}
      <BackgroundLayer
        src={event.fill_image}
        width={screenWidth}
        height={screenHeight}
        onLoad={onBackgroundLoad}
      />
    </>
  );
};

const MainLayers = ({ event, images, width, height }) => {
  const { eventId } = useParams();
  const [loadTime, setLoadTime] = useState(Date.now() - 2000); // loadTime will be used in requests for new data, 2 second buffer in case someone submits at same time as load
  const [tiles, setTiles] = useState(images); // start out with our initial loaded images
  const [activeTile, setActiveTile] = useState({});
  const [flipQueue, setFlipQueue] = useState([]);

  // determine width and height scale compared to window size
  const widthScale = width / event.width;
  const heightScale = height / event.height;

  // determine the height and width of each tile
  const tileWidth = width / event.cols;
  const tileHeight = height / event.rows;

  // determine left and top position for flipping cards to end at the center
  const centerLeft = width / 2 - tileWidth / 2;
  const centerTop = height / 2 - tileHeight / 2;

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(async () => {
      if (!!flipQueue.length) {
        // if we have a queue here, it means the first element has already been flipped so we want to remove it in order
        // to rerender with the updated queue and start a new interval
        setFlipQueue(flipQueue.slice(1));
      } else {
        // if we are here, the queue is cleared, if a certain multiple, check for new content and set flip queue again, else get the next tile randomly
        // TODO: cleanup and make simpler
        if (iteration % 5 === 0) {
          const new_image_data = await getData(
            `media/${eventId}/photo_mosaic?since=${loadTime}`
          ).then((res) => {
            return res.data.items;
          });

          if (!!new_image_data.length) {
            setTiles({ ...tiles, items: tiles.items.concat(new_image_data) });
            setFlipQueue(new_image_data);
            setLoadTime(Date.now() - 2000);
          } else {
            let nextIndex = Math.floor(Math.random() * tiles.items.length);
            setActiveTile({ index: nextIndex, tile: tiles.items[nextIndex] });
          }
        } else {
          let nextIndex = Math.floor(Math.random() * tiles.items.length);
          setActiveTile({ index: nextIndex, tile: tiles.items[nextIndex] });
        }
      }
      iteration += 1;
    }, 8000);

    // once to start, pull from top of our queue, otherwise choose randomly
    if (!!flipQueue.length) {
      setActiveTile({ index: -1, tile: flipQueue[0] });
    } else {
      const startingIndex = Math.floor(Math.random() * tiles.items.length);
      setActiveTile({
        index: startingIndex,
        tile: tiles.items[startingIndex],
      });
    }

    // clear on dismount
    return () => clearInterval(interval);
  }, [flipQueue]);

  return (
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
        data={tiles}
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
  );
};

export default Mosaic;
