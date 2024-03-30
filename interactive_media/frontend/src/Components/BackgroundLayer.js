import React, { useRef, useEffect } from "react";
import "./BackgroundLayer.css";

// The bottom layer of the mosaic, which will be a some background image or color
const BackgroundLayer = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // draw background image to fill screen
      context.drawImage(img, 0, 0, props.width, props.height);
    };

    img.src = props.src;
  }, []);

  return (
    <div className="background">
      <canvas ref={canvasRef} width={props.width} height={props.height} />
    </div>
  );
};

export default BackgroundLayer;
