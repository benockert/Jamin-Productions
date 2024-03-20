import React, { useRef, useEffect } from "react";
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
      <Tiles
        className="tiles"
        data={images}
        rows={event.rows}
        cols={event.cols}
        height={event.height}
        width={event.width}
        offset={event.offset}
      />
      <BottomLayer
        className="bottom"
        src={event.fill_image}
        height={event.height}
        width={event.width}
        x={0}
        y={0}
      />
    </div>
  );
};

const Tiles = (props) => {
  const canvasRef = useRef(null);
  const tilePrefix =
    "https://static.jaminproductions.com/dev/interactive_media/photo_mosaic/northeastern2024/tiles";

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const scale = props.width / props.cols; // todo set this in tile split script and use here
    console.log({ scale });

    props.data.items.forEach((image, idx) => {
      const img = new Image();
      const imgName = `tile${idx}`; // todo consider returning image key and using as name

      img.onload = () => {
        // draw tile image
        context.drawImage(
          img,
          (image.position_x - props.offset) * scale,
          (image.position_y - props.offset) * scale,
          scale,
          scale
        );
      };

      console.log({
        row: image.position_y,
        col: image.position_x,
        x: (image.position_x - props.offset) * scale,
        y: (image.position_y - props.offset) * scale,
        src: `${tilePrefix}/${props.cols}x${props.rows}/${image.position_x}_${image.position_y}.jpg`,
      });

      img.src = `${tilePrefix}/${props.cols}x${props.rows}/${image.position_x}_${image.position_y}.jpg`;
    });
  }, []);

  return (
    <canvas
      className="tiles"
      ref={canvasRef}
      width={props.width}
      height={props.height}
    />
  );
};

const BottomLayer = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const img = new Image();
    const imgName = "background-fill-image";

    img.onload = () => {
      // draw tile image
      context.drawImage(img, props.x, props.y, props.width, props.height);
    };

    img.src = props.src;
  }, []);

  return <canvas ref={canvasRef} width={props.width} height={props.height} />;
};

export default Mosaic;
