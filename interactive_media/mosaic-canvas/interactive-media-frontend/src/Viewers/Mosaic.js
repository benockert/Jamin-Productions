import React from "react";
import { Surface, Image, Text } from "react-canvas";
import PropTypes from "prop-types";
import { getData } from "../api";
import { useLoaderData, useParams, redirect } from "react-router-dom";

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
  const data = useLoaderData();
  return (
    <View
      data={data}
      height={1080}
      width={1920}
      x={0}
      y={0}
      // size={{ width: 80, height: 80 }}
    />
  );
};

const View = (props) => {
  console.log({ props });
  const imageStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    border: "1px solid black",
  };
  const textStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    color: "#171717",
  };

  const surfaceWidth = window.innerWidth;
  const surfaceHeight = window.innerHeight;

  return (
    <Surface width={surfaceWidth} height={surfaceHeight} left={0} top={0}>
      <Image style={imageStyle} src={props.data.images.items[0].full_image} />
      <Text style={textStyle}>Here is some text below an image.</Text>
    </Surface>
  );
};

View.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Mosaic;
