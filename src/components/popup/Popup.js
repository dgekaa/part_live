import React from "react";

import "./popup.css";

const Popup = ({ children, togglePopup, style, wrpaStyle }) => {
  return (
    <div
      className="popup"
      onClick={e => {
        if (e.target.className === "popup") {
          togglePopup();
        }
      }}
      style={wrpaStyle}
    >
      <div className="popup_inner" style={style}>
        {children}
      </div>
    </div>
  );
};
export default Popup;
