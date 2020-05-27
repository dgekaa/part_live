import React from "react";
import AvatarEditor from "react-avatar-editor";

const CropperMobile = ({
  imgSrc,
  scaleValue,
  editorRef,
  onCrop,
  onScaleChange,
}) => {
  return (
    <div style={{ width: "250px", height: "250px", position: "relative" }}>
      <AvatarEditor
        width={230}
        height={230}
        image={imgSrc}
        border={10}
        scale={scaleValue}
        ref={editorRef}
      />
      <input
        style={{ width: "250px" }}
        type="range"
        value={scaleValue}
        min="1"
        max="10"
        onChange={onScaleChange}
        step="0.1"
      />
      <button onClick={onCrop}>crop</button>
    </div>
  );
};

export default CropperMobile;
