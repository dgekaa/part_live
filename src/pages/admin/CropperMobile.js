import React, { useState, useEffect } from "react";
import AvatarEditor from "react-avatar-editor";

const CropperMobile = ({
  imgSrc,
  scaleValue,
  editorRef,
  onCrop,
  onScaleChange,
}) => {
  const [mouseScale, setMouseScale] = useState(1);

  useEffect(() => {
    const Hammer = window.Hammer;
    var hammerEvent = document.getElementById("hammerEvent");
    var mc = new Hammer(hammerEvent);
    mc.get("pinch").set({ enable: true });

    mc.on("pinch", function (ev) {
      let count = 0;
      if (ev.scale > 1) {
        count = count + 0.1;
      } else {
        count = count - 0.1;
      }
      setMouseScale((prev) => count);
    });
  }, []);

  return (
    <div style={{ width: "250px", height: "250px" }} id="hammerEvent">
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
