import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import CustomImg from "../customImg/CustomImg";
import { EN_SHORT_TO_RU_LONG_V_P } from "../../constants";
import { isShowStreamNow, isWorkTimeNow } from "../../calculateTime";
import { getDistanceFromLatLonInKm } from "../../getDistance";

import "./smallCompanyBlock.css";

const SmallCompanyBlock = ({ item }) => {
  const [showStream, setShowStream] = useState(false);
  const [workTime, setWorkTime] = useState(false);
  const [isWork, setIsWork] = useState(false);
  const [curDistance, setCurDistance] = useState(null);
  const [nextStreamTime, setNextStreamTime] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [videoError, setVideoError] = useState(null);

  useEffect(() => {
    isShowStreamNow(item, setShowStream, setNextStreamTime);
    isWorkTimeNow(item, setWorkTime, setIsWork);
  }, [item]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurDistance(
            getDistanceFromLatLonInKm(
              pos.coords.latitude,
              pos.coords.longitude,
              item.coordinates.split(",")[0],
              item.coordinates.split(",")[1]
            )
          );
        },
        (err) => {
          console.log(err, " GEOLOCATION ERROR SMALLCOMPANYBLOCK");
        }
      );
    } else {
      console.log("Геолокация недоступна ");
    }
  }, []);

  const whenWillBeTranslation = () => {
    if (
      nextStreamTime.start_time &&
      nextStreamTime.day.toLowerCase() !== "сегодня"
    ) {
      return (
        "Трансляция начнется в " +
        EN_SHORT_TO_RU_LONG_V_P[nextStreamTime.day] +
        " в " +
        nextStreamTime.start_time
      );
    } else if (
      nextStreamTime.start_time &&
      nextStreamTime.day.toLowerCase() === "сегодня"
    ) {
      return "Трансляция начнется сегодня в " + nextStreamTime.start_time;
    } else if (!nextStreamTime.start_time) {
      return "Нет предстоящих трансляций";
    }
  };

  const videoErrorHandler = (data) => {
    console.log(data, "WWWWWWWWWWWWWWWWWWWWWWWWWWWw");
    setVideoError(data);
  };

  const showIsVideoErr = () => {
    if (item.streams && item.streams[0] && item.streams[0].url && videoError) {
      return (
        <span style={{ color: "red", fontSize: "10px", fontWeight: "bold" }}>
          Err
        </span>
      );
    } else if (
      item.streams &&
      item.streams[0] &&
      item.streams[0].url &&
      !videoError
    ) {
      return (
        <span style={{ color: "green", fontSize: "10px", fontWeight: "bold" }}>
          Ok
        </span>
      );
    } else {
      return <span style={{ color: "transparent" }}>.</span>;
    }
  };

  return (
    <Link
      to={{ pathname: `/company/${item.id}` }}
      className="SmallCompanyBlock"
    >
      <div className="imgContainer">
        {!!showStream &&
          item.streams[0] &&
          (!previewError ? (
            <video
              className="companyImg"
              src={item.streams[0].preview}
              autoPlay
              onError={(err) => setPreviewError(err)}
            />
          ) : (
            <div className="companyImg">
              <p className="noPreviewText">ERR</p>
            </div>
          ))}
        {!showStream && (
          <div className="companyImg">
            <p className="noPreviewText">{whenWillBeTranslation()}</p>
          </div>
        )}
      </div>
      <div className="description">
        <div className="topBlockText">
          <div className="companyNameWrap">
            <p className="companyName">{item.name}</p>
            <p className="companyType">
              {item.categories && item.categories[0] && item.categories[0].name}{" "}
            </p>
          </div>
          <p className="companyTitle">"Супер пати всех студентов"</p>
          {showIsVideoErr()}
        </div>

        <div style={{ display: "none" }}>
          <VideoPlayer
            muted={true}
            autoplay={true}
            onErr={videoErrorHandler}
            src={item.streams && item.streams[0] && item.streams[0].url}
          />
        </div>
        <div className="bottomBlockText">
          <div className="rowCompanyBlock">
            <div className="smallRowCompanyBlock">
              <CustomImg alt="eye" className="eyeCompanyBlock" name={"eye"} />
              <p className="leftTextCompanyBlock">25 752</p>
            </div>
            <div className="smallRowCompanyBlock">
              <span className="circle"></span>
              <p className="leftTextCompanyBlock">255</p>
            </div>
          </div>
          <p className="workTimeText">{workTime}</p>
        </div>
      </div>
      {/* Mobile */}
      <div className="descriptionMobile">
        <p className="nameOfCompany">{item.name}</p>
        <div className="distanceFirst1 distanceFirstLeft1">
          <div className="distanceAndType">
            {curDistance && <span>{Number(curDistance).toFixed(2)} km</span>}
            {!curDistance && " 0 km."}
            <span>
              {item.categories && item.categories[0] && item.categories[0].name}
            </span>
          </div>
        </div>
        {isWork && (
          <p className="endTimeMobile">
            Открыто: до
            <span> {workTime.split("-")[1]}</span>
          </p>
        )}
        {!isWork && <p className="endTimeMobile">Закрыто</p>}
      </div>
    </Link>
  );
};

export default SmallCompanyBlock;
