import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";

const CropperMobile = ({
  imgSrc,
  scaleValue,
  editorRef,
  onCrop,
  onScaleChange,
}) => {
  const [mouseScale, setMouseScale] = useState(1);
  return (
    <div
      style={{ width: "250px", height: "250px" }}
      onClick={() => console.log("C:IK")}
      //   onMousewheel={(e) => {
      //     console.log(e, "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
      //   }}
      onWheel={(event) => {
        event.preventDefault();
        document.body.addEventListener("wheel", (event) => {
          event.preventDefault();
        });
        if (event.deltaY < 0) {
          setMouseScale((prev) => +prev + 0.1);
        } else {
          setMouseScale((prev) => +prev - 0.1);
        }
        console.log(event, "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
      }}
    >
      <AvatarEditor
        width={230}
        height={230}
        image={imgSrc}
        border={10}
        scale={mouseScale}
        ref={editorRef}
      />
      {/* <input
        style={{ width: "250px" }}
        type="range"
        value={scaleValue}
        min="1"
        max="10"
        onChange={onScaleChange}
        step="0.1"
      /> */}
      {/* <button onClick={onCrop}>crop</button> */}
    </div>
  );
};

export default CropperMobile;
