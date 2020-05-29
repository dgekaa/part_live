import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { EN_SHORT_TO_RU_LONG_V_P } from "../../constants";
import { isShowStreamNow, isWorkTimeNow } from "../../calculateTime";
import { getDistanceFromLatLonInKm } from "../../getDistance";
import styled from "styled-components";

const SmallCompBlock = styled(Link)`
  width: 240px;
  height: 234px;
  overflow: hidden;
  border-radius: 10px;
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: #000;
  margin: 5px;
  transition: 0.2s ease all;
  &:hover {
    opacity: 0.9;
  }
  @media (max-width: 760px) {
    width: calc(33% - 10px);
  }
  @media (max-width: 650px) {
    width: calc(50% - 10px);
  }
  @media (max-width: 460px) {
    height: 200px;
  }
  @media (max-width: 380px) {
    width: calc(50% - 10px);
    height: 170px;
  }
`;

const NoTranslation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #000;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 64px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #aeaeae;
`;

const IsGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: ${({ showStream }) =>
    showStream
      ? "linear-gradient(180deg, rgba(196, 196, 196, 0) 0%, #000 100%)"
      : ""};
  display: flex;
  flex: 1;
  align-items: flex-end;
`;

const Description = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  flex-direction: column;
  padding: 0 10px;
`;

const TopDescriptionBlock = styled.div`
  width: 100%;
`;

const CompanyName = styled.p`
  color: ${({ showStream }) => (showStream ? "#fff" : "#919191")};
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
`;

const PartyType = styled.p`
  color: ${({ showStream }) => (showStream ? "#fff" : "#919191")};
  font-size: 13px;
  line-height: 15px;
  padding-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BottomDescriptionBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 6px;
`;

const WorkTimeWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const WorkTime = styled.p`
  font-weight: 500;
  font-size: 10px;
  color: ${({ showStream }) => (showStream ? "#fff" : "#919191")};
  line-height: 14px;
  margin-right: 4px;
`;

const IsOpened = styled.p`
  font-weight: 700;
  font-size: 10px;
  text-transform: uppercase;
  color: #36cc33;
  line-height: 14px;
`;

const CompanyType = styled.p`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  text-transform: uppercase;
  color: #ff0960;
`;

const SmallCompanyBlock = ({ item }) => {
  const [showStream, setShowStream] = useState(false);
  const [workTime, setWorkTime] = useState(false);
  const [isWork, setIsWork] = useState(false);
  const [curDistance, setCurDistance] = useState(null);
  const [nextStreamTime, setNextStreamTime] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  !windowWidth && setWindowWidth(window.innerWidth);
  useEffect(() => {
    window.onresize = function (e) {
      setWindowWidth(e.target.innerWidth);
    };
  });

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
          console.log(err, "Ошибка геолокации");
        }
      );
    } else {
      console.log("Геолокация недоступна");
    }
  }, []);

  const whenWillBeTranslation = () => {
    if (
      nextStreamTime.start_time &&
      nextStreamTime.day.toLowerCase() !== "сегодня"
    ) {
      return (
        "Начало трансляции:" +
        EN_SHORT_TO_RU_LONG_V_P[nextStreamTime.day] +
        " в " +
        nextStreamTime.start_time
      );
    } else if (
      nextStreamTime.start_time &&
      nextStreamTime.day.toLowerCase() === "сегодня"
    ) {
      return "Начало трансляции: сегодня в " + nextStreamTime.start_time;
    } else if (!nextStreamTime.start_time) {
      return "Нет предстоящих трансляций";
    }
  };

  return (
    <SmallCompBlock
      to={{ pathname: `/company/${item.id}` }}
      style={
        item.streams && item.streams[0] && item.streams[0].preview && showStream
          ? { backgroundImage: `url(${item.streams[0].preview})` }
          : {}
      }
    >
      {!showStream && <NoTranslation>{whenWillBeTranslation()}</NoTranslation>}
      <IsGradient showStream={showStream}>
        <Description>
          <TopDescriptionBlock>
            <CompanyName showStream={showStream}>{item.name}</CompanyName>
            <PartyType showStream={showStream}>
              Супер пати всех студентов
            </PartyType>
          </TopDescriptionBlock>
          <BottomDescriptionBlock>
            <WorkTimeWrap>
              {workTime && (
                <WorkTime showStream={showStream}>{workTime}</WorkTime>
              )}
              {isWork ? (
                <IsOpened>
                  {windowWidth <= 380 && workTime ? "ОТКР" : "ОТКРЫТО"}
                </IsOpened>
              ) : (
                <IsOpened>
                  {windowWidth <= 380 && workTime ? "ЗАКР" : "ЗАКРЫТО"}
                </IsOpened>
              )}
            </WorkTimeWrap>
            <CompanyType>
              {item.categories && item.categories[0] && item.categories[0].name}
            </CompanyType>
          </BottomDescriptionBlock>
        </Description>
      </IsGradient>
    </SmallCompBlock>
  );
};

export default SmallCompanyBlock;
