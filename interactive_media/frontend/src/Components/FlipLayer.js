import React, { useEffect } from "react";
import "./FlipLayer.css";

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

export default FlipLayer;
