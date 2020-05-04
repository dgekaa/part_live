import React, { useState, useEffect } from "react";

const TimePicker = ({ timePickerName, setTime, realTimeInPicker }) => {
  const [hours, setHours] = useState(realTimeInPicker.split(":")[0]);
  const [minutes, setMinutes] = useState(realTimeInPicker.split(":")[1]);

  const clickHandlerTop = (e, max) => {
    e.target.nextSibling.innerText = +e.target.nextSibling.innerText + 1;
    if (+e.target.nextSibling.innerText === max) {
      e.target.nextSibling.innerText = 0;
    }
    if (+e.target.nextSibling.innerText < 10) {
      e.target.nextSibling.innerText = "0" + e.target.nextSibling.innerText;
    }
    if (max === 24) {
      setHours(e.target.nextSibling.innerText);
    } else {
      setMinutes(e.target.nextSibling.innerText);
    }
  };

  const clickHandlerBottom = (e, max) => {
    if (+e.target.previousSibling.innerText === 0) {
      e.target.previousSibling.innerText = max;
    }
    e.target.previousSibling.innerText =
      +e.target.previousSibling.innerText - 1;

    if (e.target.previousSibling.innerText < 10) {
      e.target.previousSibling.innerText =
        "0" + e.target.previousSibling.innerText;
    }
    if (max === 24) {
      setHours(e.target.previousSibling.innerText);
    } else {
      setMinutes(e.target.previousSibling.innerText);
    }
  };

  useEffect(() => {
    setTime(hours, minutes);
  }, [hours, minutes]);

  return (
    <div className="timePickerWrap">
      <p className="timePickerName">{timePickerName}</p>
      <div className="timePicker">
        <div className="timePickerHoursWrap">
          <span
            className="topArrow"
            onClick={(e) => {
              clickHandlerTop(e, 24);
            }}
          ></span>
          <p className="timePickerHours">
            {realTimeInPicker && realTimeInPicker.split(":")[0]}
          </p>
          <span
            className="bottomArrow"
            onClick={(e) => clickHandlerBottom(e, 24)}
          ></span>
        </div>
        <p className="twoDots">:</p>
        <div className="timePickerMinutesWrap">
          <span
            className="topArrow"
            onClick={(e) => {
              clickHandlerTop(e, 60);
            }}
          ></span>
          <p className="timePickerMinutes">
            {realTimeInPicker && realTimeInPicker.split(":")[1]}
          </p>
          <span
            className="bottomArrow"
            onClick={(e) => {
              clickHandlerBottom(e, 60);
            }}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
