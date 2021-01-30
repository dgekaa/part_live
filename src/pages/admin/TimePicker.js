import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { defaultColor } from "../../constants";

const TPName = styled.p`
  text-align: center;
  padding-bottom: 15px;
  font-weight: 700;
  font-size: 16px;
  color: #909090;
`;

const TP = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 15px;
  background: #ffffff;
  border: 1px solid #d6d6d6;
  box-sizing: border-box;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 10px;
  margin: 5px;
`;

const TPHoursMinutesWrap = styled.div`
  font-size: 20px;
  display: flex;
  flex-direction: column;
  width: 60px;
  height: 120px;
  align-items: center;
  justify-content: center;
`;

const TPHoursMinutes = styled.span`
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  padding: 10px 0;
  justify-content: center;
`;

const TopArrow = styled.span`
  cursor: pointer;
  display: inline-block;
  width: 100%;
  height: 20px;
  position: relative;
  &:after {
    content: "";
    width: 15px;
    height: 2px;
    top: 7px;
    right: 17.5px;
    background-color: #909090;
    position: absolute;
    border-radius: 2px;
    transform: rotate(45deg);
  }
  &:before {
    content: "";
    width: 15px;
    height: 2px;
    top: 7px;
    left: 17.5px;
    background-color: #909090;
    position: absolute;
    border-radius: 2px;
    transform: rotate(-45deg);
  }
  &:hover::after {
    background-color: ${defaultColor};
  }
  &:hover::before {
    background-color: ${defaultColor};
  }
`;

const BottomArrow = styled(TopArrow)`
  &:after {
    content: "";
    width: 15px;
    height: 2px;
    top: 9px;
    right: 17.5px;
    background-color: #909090;
    position: absolute;
    transform: rotate(-45deg);
    border-radius: 2px;
  }
  &:before {
    content: "";
    width: 15px;
    height: 2px;
    top: 9px;
    left: 17.5px;
    background-color: #909090;
    position: absolute;
    border-radius: 2px;
    transform: rotate(45deg);
  }
`;

const TwoDots = styled.span`
  display: flex;
  width: 10px;
  font-weight: 700;
  align-self: center;
  justify-content: center;
`;

const TimePicker = ({ timePickerName, setTime, realTimeInPicker }) => {
  const [hours, setHours] = useState(realTimeInPicker.split(":")[0]),
    [minutes, setMinutes] = useState(realTimeInPicker.split(":")[1]);

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
    },
    clickHandlerBottom = (e, max) => {
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
    <div>
      <TPName>{timePickerName}</TPName>
      <TP>
        <TPHoursMinutesWrap>
          <TopArrow onClick={(e) => clickHandlerTop(e, 24)}></TopArrow>
          <TPHoursMinutes>
            {realTimeInPicker && realTimeInPicker.split(":")[0]}
          </TPHoursMinutes>
          <BottomArrow onClick={(e) => clickHandlerBottom(e, 24)}></BottomArrow>
        </TPHoursMinutesWrap>
        <TwoDots>:</TwoDots>
        <TPHoursMinutesWrap>
          <TopArrow onClick={(e) => clickHandlerTop(e, 60)}></TopArrow>
          <TPHoursMinutes>
            {realTimeInPicker && realTimeInPicker.split(":")[1]}
          </TPHoursMinutes>
          <BottomArrow onClick={(e) => clickHandlerBottom(e, 60)}></BottomArrow>
        </TPHoursMinutesWrap>
      </TP>
    </div>
  );
};

export default TimePicker;
