import React, { useState } from "react";
import styled from "styled-components";
import { useCookies } from "react-cookie";

import QUERY from "../../query";
import Popup from "../../components/popup/Popup";
import TimePicker from "./TimePicker";

import {
  EN_SHORT_TO_NUMBER,
  EN_SHORT_TO_RU_SHORT,
  PLACE_QUERY,
  SHORT_DAY_OF_WEEK,
} from "../../constants";

const MobileTimePickerHeader = styled.div`
    display: none;
    @media (max-width: 760px) {
      display: flex;
      margin-bottom: 31px;
      height: 44px;
      border-bottom: 1px solid #ececec;
      align-items: center;
      justify-content: space-between;
      padding: 0 25px;
    }
  `,
  CancelSave = styled.p`
    letter-spacing: 0.5px;
    color: defaultColor;
    font-size: 16px;
    font-weight: normal;
  `,
  Title = styled.p`
    font-weight: bold;
    font-size: 14px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  `,
  TimePickerContainer = styled.p`
    display: flex;
    flex-direction: row;
    justify-content: center;
  `,
  MakeAsDayOffMobile = styled.p`
    display: none;
    @media (max-width: 760px) {
      display: block;
      font-size: 18px;
      color: #f8104d;
      padding: 30px 0;
      text-align: center;
      cursor: pointer;
      font-weight: normal;
      &:hover {
        color: #000;
      }
    }
  `,
  PopupPickerBtnsWrap = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  `,
  PopupPickerBtn = styled.p`
    border-radius: 5px;
    width: 170px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    @media (max-width: 760px) {
      display: none;
    }
  `,
  Save = styled(PopupPickerBtn)`
    background: #f8104d;
    color: #fff;
  `,
  Cancel = styled(PopupPickerBtn)`
    background: #fff;
    border: 2px solid #c4c4c4;
  `;

const DatePickerPopup = ({
  togglePopupDatePicker,
  windowWidth,
  titleInPicker,
  setAsDayOf,
  startRealTimeInPicker,
  isSetWorkTimeDPick,
  isEmptyTime,
  props,
  enumWeekName,
  endRealTimeInPicker,
  refreshData,
  clickedTime,
  DATA,
  tomorrowFromDay,
  setDATA,
}) => {
  const [cookies] = useCookies([]);

  const [startTimePicker, setStartTimePicker] = useState("00:00"),
    [endTimePicker, setEndTimePicker] = useState("00:00");

  const setWorkTimeOfOneDay = () => {
      if (cookies.origin_data) {
        if (isEmptyTime) {
          //СОЗДАТЬ время работы заведения
          QUERY(
            {
              query: `mutation {
                  updatePlace(
                    input:{
                      id:"${props.match.params.id}"
                      schedules:{
                        create:{
                          day: ${enumWeekName} start_time: "${startTimePicker}" end_time: "${endTimePicker}"
                        }
                      }
                    }
                  ){id}
                }`,
            },
            cookies.origin_data
          )
            .then((res) => res.json())
            .then((data) => {
              !data.errors
                ? refreshData()
                : console.log(data.errors, " ERRORS");
            })
            .catch((err) => console.log(err, "  ERR"));
        }

        if (!isEmptyTime) {
          //ИЗМЕНИТЬ время работы заведения
          QUERY(
            {
              query: `mutation {
              updateSchedule(
                input:{
                  id:"${clickedTime.id}" start_time: "${startTimePicker}" end_time: "${endTimePicker}"
                }
              ){id
                schedulable {
                  ...on Place {
                    id name address description alias profile_image
                    streams{url name id preview schedules{id day start_time end_time}}
                    schedules {id day start_time end_time}
                    categories {id name slug}
                  }
              }
            }
            }`,
            },
            cookies.origin_data
          )
            .then((res) => res.json())
            .then((data) => {
              !data.errors
                ? setDATA(data.data.updateSchedule.schedulable)
                : console.log(data.errors, " ERRORS");
            })
            .catch((err) => console.log(err, " ERR"));
        }
      }
    },
    setStreamTimeOfOneDay = () => {
      if (cookies.origin_data) {
        if (DATA.streams[0] && !isEmptyTime) {
          // не пустое время стрима и стрим уже существет
          QUERY(
            {
              query: `mutation {
              updateStream (
                input:{
                  id:"${DATA.streams[0].id}"
                  schedules:{
                    update:[
                       {
                        id: ${clickedTime.id}
                        start_time: "${startTimePicker}"
                        end_time: "${endTimePicker}"
                      }
                    ]
                  }
                }
              ) { id name url ${PLACE_QUERY} }}`,
            },
            cookies.origin_data
          )
            .then((res) => res.json())
            .then((data) => {
              !data.errors
                ? setDATA(data.data.updateStream.place)
                : console.log(data.errors, " ERRORS");
            })
            .catch((err) => console.log(err, " ERR"));
        }
        if (DATA.streams[0] && isEmptyTime) {
          // пустое время стрима и стрим уже существет
          QUERY(
            {
              query: `mutation {
              updateStream (
                input:{
                  id:"${DATA.streams[0].id}"
                  schedules:{
                    create:[
                       {
                        day: ${enumWeekName}
                        start_time: "${startTimePicker}"
                        end_time: "${endTimePicker}"
                      }
                    ]
                  }
                }
              ) { id name url ${PLACE_QUERY} }}`,
            },
            cookies.origin_data
          )
            .then((res) => res.json())
            .then((data) => {
              !data.errors
                ? setDATA(data.data.updateStream.place)
                : console.log(data.errors, " ERRORS");
            })
            .catch((err) => console.log(err, " ERR"));
        }
      }
    },
    setStartTime = (h, m) => setStartTimePicker("" + h + ":" + m),
    setEndTime = (h, m) => setEndTimePicker("" + h + ":" + m),
    ready = () => {
      togglePopupDatePicker();
      isSetWorkTimeDPick && setWorkTimeOfOneDay();
      !isSetWorkTimeDPick && setStreamTimeOfOneDay();
    },
    save = () => {
      togglePopupDatePicker();
      isSetWorkTimeDPick && setWorkTimeOfOneDay();
      !isSetWorkTimeDPick && setStreamTimeOfOneDay();
    },
    setAsDayOfClick = () => {
      setAsDayOf();
      togglePopupDatePicker();
    };

  const firstName =
      EN_SHORT_TO_RU_SHORT[enumWeekName] ||
      EN_SHORT_TO_RU_SHORT[clickedTime.day],
    secondName =
      startTimePicker.split(":")[0] * 3600 +
        startTimePicker.split(":")[1] * 60 <=
      endTimePicker.split(":")[0] * 3600 + endTimePicker.split(":")[1] * 60
        ? EN_SHORT_TO_RU_SHORT[enumWeekName] ||
          EN_SHORT_TO_RU_SHORT[clickedTime.day]
        : SHORT_DAY_OF_WEEK[
            tomorrowFromDay(EN_SHORT_TO_NUMBER[enumWeekName || clickedTime.day])
          ];

  return (
    <Popup
      togglePopup={togglePopupDatePicker}
      wrpaStyle={windowWidth <= 760 ? { alignItems: "flex-end" } : {}}
      style={
        windowWidth <= 760
          ? { height: "100%" }
          : { borderRadius: "5px", transform: "scale(1.5)" }
      }
    >
      <div className="popupWrapper">
        <MobileTimePickerHeader>
          <CancelSave onClick={() => togglePopupDatePicker()}>
            Отмена
          </CancelSave>
          <Title>{titleInPicker}</Title>
          <CancelSave onClick={() => ready()}>Готово</CancelSave>
        </MobileTimePickerHeader>

        <TimePickerContainer>
          <TimePicker
            realTimeInPicker={startRealTimeInPicker}
            timePickerName={firstName}
            setTime={setStartTime}
          />
          <span className="space"></span>
          <TimePicker
            realTimeInPicker={endRealTimeInPicker}
            timePickerName={secondName}
            setTime={setEndTime}
          />
        </TimePickerContainer>

        <PopupPickerBtnsWrap>
          <Save onClick={() => save()}>Сохранить</Save>
          <Cancel onClick={() => togglePopupDatePicker()}>Отмена</Cancel>
        </PopupPickerBtnsWrap>
        <MakeAsDayOffMobile onClick={() => setAsDayOfClick()}>
          Сделать выходным
        </MakeAsDayOffMobile>
      </div>
    </Popup>
  );
};

export default DatePickerPopup;
