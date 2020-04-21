import React from "react";

const CustomImg = ({ name, className, alt, active, width, height }) => {
  return (
    <img
      alt={alt}
      className={className}
      src={
        active
          ? `${process.env.PUBLIC_URL}/img/${name}_w.png`
          : `${process.env.PUBLIC_URL}/img/${name}.png`
      }
      width={width}
      height={height}
    />
  );
};

export default CustomImg;
