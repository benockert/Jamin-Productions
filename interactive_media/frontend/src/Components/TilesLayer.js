import React, { useEffect, useState } from "react";
import "./TilesLayer.css";

const TilesLayer = (props) => {
  const [tiles, setTiles] = useState([]);
  const scaleX = (props.width / props.cols) * props.scaleX;
  const scaleY = (props.height / props.rows) * props.scaleY;
  // how many milliseconds we want each photo to take to load in
  const delay = 20;

  const handleImageLoad = (event, index) => {
    const wait = delay * index;
    setTimeout(() => {
      event.target.style.opacity = 1;
      event.target.style.scale = 1;
    }, wait);
  };

  const createTile = (image, index) => {
    const style = {
      height: scaleY + 0.1,
      width: scaleX + 0.1,
      left: parseInt(image.position_x - props.offset, 10) * scaleX + 0.1,
      top: parseInt(image.position_y - props.offset, 10) * scaleY + 0.1,
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
          src={`${props.tilesPrefix}/${props.cols}x${props.rows}/${image.position_x}_${image.position_y}.jpg`}
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

  return <>{tiles}</>;
};

export default TilesLayer;
