import React, { useState, useEffect } from "react";
import "./smallCompanyBlock.css";
import { Link } from "react-router-dom";

import { isShowStreamNow, isWorkTimeNow } from "../../calculateTime";
import { getDistanceFromLatLonInKm } from "../../getDistance";

const SmallCompanyBlock = ({ item }) => {
  const [showStream, setShowStream] = useState(false);
  const [workTime, setWorkTime] = useState(false);
  const [isWork, setIsWork] = useState(false);
  const [curDistance, setCurDistance] = useState(null);
  const [nextStreamTime, setNextStreamTime] = useState(false);

  useEffect(() => {
    isShowStreamNow(item, setShowStream, setNextStreamTime);
    isWorkTimeNow(item, setWorkTime, setIsWork);
  }, [item]);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCurDistance(
          getDistanceFromLatLonInKm(
            pos.coords.latitude,
            pos.coords.longitude,
            item.coordinates.split(",")[0],
            item.coordinates.split(",")[1]
          )
        );
      },
      err => {
        console.log(err, " GEOLOCATION ERROR ");
      }
    );
  } else {
    console.log("Геолокация недоступна ");
  }

  return (
    <Link
      to={{ pathname: `/company/${item.id}` }}
      className="SmallCompanyBlock1"
    >
      <div className="imgContainer1" style={{ background: "#000" }}>
        {!!showStream && (
          <video
            className="companyImg1"
            src={item.streams[0].preview}
            autoPlay
          />
        )}
        {!showStream && (
          <div
            className="companyImg1"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <p style={{ color: "#fff", textAlign: "center", padding: "20px" }}>
              {nextStreamTime.start_time &&
                "Трансляция начнется в " +
                  nextStreamTime.day +
                  " в " +
                  nextStreamTime.start_time}

              {!nextStreamTime.start_time && "Нет предстоящих трансляций"}
            </p>
          </div>
        )}
      </div>
      <div className="description1">
        <div className="topBlockText1">
          <div className="companyNameWrap1">
            <p className="companyName1">{item.name}</p>
            <p className="companyType1">{item.categories[0].name} </p>
          </div>
          {/* <p className="companyTitle1">???????</p> */}
        </div>
        <div className="bottomBlockText1">
          <div className="row1">
            <p className="leftText1">Время работы</p>
          </div>
          <p className="rightText1">{workTime}</p>
        </div>
      </div>
      <div className="descriptionMobile1">
        <p className="nameOfCompany1">
          {item.categories[0].name} “{item.name}”
        </p>
        <p className="distanceFirst1 distanceFirstLeft1">
          {curDistance && <span>{Number(curDistance).toFixed(2)} km</span>}
          {!curDistance && " 0 km."}
        </p>
        {isWork && (
          <p className="endTime1">
            Открыто: до
            <span> {workTime.split("-")[1]}</span>
          </p>
        )}
        {!isWork && (
          <p className="endTime1">
            {/* {workTime} */}
            Закрыто
          </p>
        )}
      </div>
    </Link>
  );
};

export default SmallCompanyBlock;
