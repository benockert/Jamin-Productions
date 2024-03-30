import React, { useRef, useEffect, useState } from "react";
import { getData } from "../api";
import { useLoaderData, useParams, redirect } from "react-router-dom";

import "./Mosaic.css";

export const mosaicLoader = async ({ params, request }) => {
  const eventId = params.eventId;
  console.log(eventId);
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
      // todo handle leks
      return res.data ?? {};
    }
  );

  return { event: event_info, images: image_data };
};

const Mosaic = () => {
  const { event, images } = useLoaderData();
  console.log(event);
  console.log(images);
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

const FlipLayer = (props) => {
  useEffect(() => {
    setTimeout(() => {
      const items = props.data.items;

      const image = items[Math.floor(Math.random() * items.length)];
      const domObject = document.getElementById(
        `tile-${image.position_y}-${image.position_x}`
      );

      domObject.classList.add("tile-flipped");
    }, 2000);
  }, []);
};

const BorderLayer = (props) => {};

const TilesLayer = (props) => {
  const [tiles, setTiles] = useState([]);
  const scale = props.width / props.cols;
  const tilePrefix =
    "https://static.jaminproductions.com/dev/interactive_media/photo_mosaic/northeastern2024/tiles";

  const handleImageLoad = (event, delay) => {
    console.log("Loaded");
    console.log({ event });
    setTimeout(() => {
      event.target.style.opacity = 1;
      event.target.style.scale = 1;
    }, delay * 20);
    // todo: make time some formula based on number of tiles
  };

  const createTile = (image, index) => {
    const style = {
      height: scale,
      width: scale,
      left: parseInt((image.position_x - props.offset) * scale, 10),
      top: parseInt((image.position_y - props.offset) * scale, 10),
    };

    return (
      <div
        className="tile"
        id={`tile-${image.position_y}-${image.position_x}`}
        style={style}
        key={`${image.position_y}-${image.position_x}`}
      >
        <img
          className="tile-front tile-fade"
          onLoad={(event) => handleImageLoad(event, index)}
          src={`${tilePrefix}/${props.cols}x${props.rows}/${image.position_x}_${image.position_y}.jpg`}
        ></img>
        <div className="tile-back">
          <img className="tile-image" src={image.full_image}></img>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const imageElements = props.data.items.map((image, idx) => {
      return createTile(image, idx);
    });
    console.log({ imageElements });
    setTiles(imageElements);
  }, []);

  return (
    <div className="tiles" style={{ width: props.width, height: props.height }}>
      {tiles}
    </div>
  );
};

// The bottom layer of the mosaic, which will be a "transparent" background image or color
const BackgroundLayer = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // draw tile image
      context.drawImage(img, props.x, props.y, props.width, props.height);
    };

    img.src = props.src;
  }, []);

  return <canvas ref={canvasRef} width={props.width} height={props.height} />;
};

export default Mosaic;
