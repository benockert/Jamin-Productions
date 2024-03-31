import React, { useEffect } from "react";
import "./FlipLayer.css";

const FlipLayer = (props) => {
  useEffect(() => {
    setTimeout(() => {
      const tile = props.tile;
      const domObject = document.getElementById(
        `tile-${tile.position_y}-${tile.position_x}`
      );

      // starting positions for resetting (will be string '###.px')
      const startingLeft = domObject.style.left;
      const startingTop = domObject.style.top;

      // move card to ending position on screen and scale it up
      domObject.style.left = `${props.endingLeft}px`;
      domObject.style.top = `${props.endingTop}px`;
      domObject.style.scale = 6;

      // start flip animation
      domObject.classList.add("tile-flipped");

      // return to original position and scale after delay
      setTimeout(() => {
        domObject.classList.remove("tile-flipped");

        domObject.style.left = startingLeft;
        domObject.style.top = startingTop;
        domObject.style.scale = 1;
      }, 5000);
    }, 2000);
  }, [props.tile]);
};

export default FlipLayer;
