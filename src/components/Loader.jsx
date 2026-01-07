import React from "react";
import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";

const Loader = ({
  size = "40",
  className = "loaderWrapper",
  color = "#0265a1",
  speed = "1.75",
  stroke = "5",
  style = {
    height: "100%",
    width: "100%",
  },
}) => {
  return (
    <div className={className} style={style}>
      <Bouncy size={size} speed={speed} stroke={stroke} color={color} />
    </div>
  );
};

export default Loader;
