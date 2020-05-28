import React, { useState, useEffect } from "react";
import AvatarEditor from "react-avatar-editor";

const CropperMobile = ({ imgSrc, editorRef, onCrop }) => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const Hammer = window.Hammer;
    const hammerEvent = document.getElementById("hammerEvent");
    const mc = new Hammer(hammerEvent);
    mc.get("pinch").set({ enable: true });

    mc.on("pinch", (ev) => {
      if (ev.scale < 1) {
        setCount((prev) => {
          if (prev >= 0.3) {
            return prev - 0.01;
          } else {
            return prev;
          }
        });
      } else {
        setCount((prev) => {
          if (prev <= 3) {
            return prev + 0.01;
          } else {
            return prev;
          }
        });
      }
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

      {/* <button onClick={onCrop}>crop</button> */}
    </div>
  );
};

export default CropperMobile;
