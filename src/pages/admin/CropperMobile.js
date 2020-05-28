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
  const [count, setCount] = useState(0);

  useEffect(() => {
    const Hammer = window.Hammer;
    const hammerEvent = document.getElementById("hammerEvent");
    const mc = new Hammer(hammerEvent);
    mc.get("pinch").set({ enable: true });

    // let count = 0;
    // mc.on("pinchend", (ev) => {
    //   setCountGlobl((prev) => prev + count);
    // });

    mc.on("pinch", (ev) => {
      if (ev.scale < 1) {
        setCount((prev) => prev - 0.1);
      } else {
        setCount((prev) => prev + 0.1);
      }
      //   setMouseScale((prev) => ev.scale);
    });
  }, []);

  return (
    <div style={{ width: "250px", height: "250px" }} id="hammerEvent">
      <AvatarEditor
        width={230}
        height={230}
        image={imgSrc}
        border={10}
        scale={count}
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
      <p>.</p>
      <p>{mouseScale}</p>
    </div>
  );
};

export default CropperMobile;
