import { useEffect } from "react";
import "./FocusLayer.css";

// focuses a given tile in the front and center of the screen, optionally adds additional animations
const FocusLayer = (props) => {
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
      domObject.style.scale = 11;
      domObject.style.zIndex = 10000;

      // start animations
      if (props.flipEnabled) {
        domObject.classList.add("tile-flipped");
      }

      // // return to original position and scale after delay
      setTimeout(() => {
        domObject.classList.remove("tile-flipped");

        domObject.style.left = startingLeft;
        domObject.style.top = startingTop;
        domObject.style.scale = 1;
        domObject.style.zIndex = 1;
      }, 5000);
    }, 2000);
  }, [props.tile]);
};

export default FocusLayer;
