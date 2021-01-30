import React, { useState, useEffect } from "react";
import AvatarEditor from "react-avatar-editor";

const CropperMobile = ({ imgSrc, editorRef }) => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const Hammer = window.Hammer,
      hammerEvent = document.getElementById("hammerEvent"),
      mc = new Hammer(hammerEvent);

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
    <div
      style={{
        width: `${window.innerWidth - 40}px`,
        height: `${window.innerWidth - 40}px`,
        margin: "0 auto",
      }}
      id="hammerEvent"
    >
      <AvatarEditor
        width={window.innerWidth - 60}
        height={(window.innerWidth - 60) * 0.56}
        image={imgSrc}
        border={10}
        scale={count}
        ref={editorRef}
      />
    </div>
  );
};

export default CropperMobile;
