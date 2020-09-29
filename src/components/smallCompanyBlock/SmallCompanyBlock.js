import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomImg from "../customImg/CustomImg";

import {
  EN_SHORT_TO_RU_LONG_V_P,
  queryPath,
  EN_SHORT_TO_RU_LONG,
} from "../../constants";
import { isShowStreamNow, isWorkTimeNow } from "../../calculateTime";
import { getDistanceFromLatLonInKm } from "../../getDistance";
import styled, { keyframes } from "styled-components";
import { defaultColor } from "../../constants";

const SmallCompBlock = styled(Link)`
  width: 240px;
  height: 240px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  background-color: #fff;
  transition: 0.3s ease opacity;
  border: 1px solid #f3f3f3;
  box-shadow: 4px 4px 4px #e5e5e5;
  margin: 6px;
  margin-left: 0;
  &:hover {
    opacity: 0.9;
  }
  &:nth-child(2n + 2) {
    margin-left: 6px;
    margin-right: 12px;
  }

  &:nth-child(4n + 4) {
    margin: 6px;
    margin-right: 0;
  }
  /* &:nth-child(3n + 3) {
    margin: 6px;
    box-shadow: 10px 10px 10px blue;
  } */
  @media (max-width: 760px) {
    height: 235px;
    margin: 5px;
    margin-left: 5px;
    margin-right: 5px;
    width: calc(33% - 10px);
    border-radius: 5px;
    &:nth-child(2n + 2) {
      margin-left: 5px;
      margin-right: 5px;
    }

    &:nth-child(4n + 4) {
      margin: 5px;
      margin-right: 5px;
    }
  }
  @media (max-width: 650px) {
    width: calc(50% - 10px);
  }
  @media (max-width: 375px) {
    height: 205px;
  }
`;

const Desctop = styled.div`
  display: block;
  @media (max-width: 760px) {
    display: none;
  }
`;

const PreviewBlockD = styled.div`
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  height: 150px;
  background: #000;
  background-size: cover;
  background-position: center;
`;

const NoTranslationD = styled.div`
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  height: 150px;
  font-weight: 400;
  font-size: 18px;
  line-height: 19px;
  color: #eee;
  background: #000;
  background-image: url(${({ bg }) => bg});
  background-size: cover;
  background-position: center;
`;
const TransparentBgD = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 15px;
  position: relative;
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const DescriptionD = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: 10px;
`;

const TopDescriptionBlockD = styled.div`
  width: 100%;
  display: flex;
  position: relative;
`;

const IconToCenter = styled.div`
  width: 20px;
  display: flex;
  justify-content: center;
  margin-right: 5px;
`;

const HoverTooltip = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: transparent;
`;

const CustomImgStyleD = styled(CustomImg)``;

const CompanyNameD = styled.p`
  color: #000;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const MiddleDescriptionBlockD = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
`;

const WorkTimeWrapD = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`;

const CircleD = styled.div`
  width: 7px;
  height: 7px;
  background: ${({ isWork }) => (isWork ? "#04b000" : " #C4C4C4")};
  border-radius: 50%;
`;

const IsOpenedD = styled.p`
  font-weight: normal;
  font-size: 14px;
  color: #000;
  line-height: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  @media (max-width: 460px) {
    font-size: 13px;
  }
`;

const LocationWrapD = styled.div`
  display: flex;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.5px;
  color: #000;
  padding-top: 7px;

  @media (max-width: 460px) {
    font-size: 13px;
  }
`;

const LocationStyleD = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
`;

const TooltipTypeD = styled.div`
  transition: 0.3s ease all;
  padding: 5px;
  background: #ff0960;
  border-radius: 5px;
  position: absolute;
  font-weight: bold;
  font-size: 10px;
  line-height: 12px;
  top: -15px;
  left: 5px;
  letter-spacing: 0.05em;
  color: #ffffff;
  text-transform: uppercase;
  opacity: 0;
`;

const Mobile = styled.div`
  display: none;
  @media (max-width: 760px) {
    display: block;
  }
`;

const PreviewBlockM = styled.div`
  border-radius: 5px;
  overflow: hidden;
  height: 175px;
  background: #000;
  background-size: cover;
  background-position: center;
  @media (max-width: 375px) {
    height: 150px;
  }
`;

const NoTranslationM = styled.div`
  border-radius: 5px;
  overflow: hidden;
  height: 175px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #eee;
  background: #000;
  background-image: url(${({ bg }) => bg});
  background-size: cover;
  background-position: center;
  @media (max-width: 375px) {
    height: 150px;
  }
`;
const TransparentBgM = styled.div`
  line-height: 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 15px;
  position: relative;
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  flex-direction: column;
`;

const DescriptionM = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: 5px;
`;

const TopDescriptionBlockM = styled.div`
  width: 100%;
  display: flex;
`;

const CustomImgStyleM = styled(CustomImg)``;

const CompanyNameM = styled.p`
  color: #363636;
  font-weight: 500;
  font-size: 18px;
  line-height: 25px;
  letter-spacing: 0.5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const DistanceM = styled.p`
  font-weight: bold;
  font-size: 14px;
  letter-spacing: 0.5px;
  color: ${defaultColor};
  line-height: 23px;
  white-space: nowrap;
`;

const BottomDescriptionBlockM = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const WorkTimeDistanceWrapM = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  overflow: hidden;
  justify-content: space-between;
`;

const CircleRowM = styled.div`
  display: flex;
  align-items: center;
`;

const IsOpenedM = styled.p`
  font-weight: normal;
  font-size: 14px;
  color: #000;
  line-height: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const blik = keyframes`
  0% {
   opacity:1;
  }
  50% {
    opacity:0;
  }
  100% {
   opacity:1;
  }
`;

const FilmCircleWrap = styled.span`
  display: flex;
  align-items: "center";
`;

const CircleTranslation = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #ff0000;
  border-radius: 50%;
  margin-top: 9px;
  animation: ${blik} 1s ease infinite;
`;

const SmallCompanyBlock = ({ item }) => {
  const [showStream, setShowStream] = useState(false);
  const [workTime, setWorkTime] = useState(false);
  const [isWork, setIsWork] = useState(false);
  const [curDistance, setCurDistance] = useState(null);
  const [nextStreamTime, setNextStreamTime] = useState(false);
  const [nextWorkTime, setNextWorkTime] = useState(null);
  const [ismobileStream, setIsmobileStream] = useState(false);

  const dateNow = new Date()
    .toLocaleDateString()
    .split(".")
    .reverse()
    .join("-");

  useEffect(() => {
    isShowStreamNow(
      item,
      setShowStream,
      setNextStreamTime,
      item.streams[0] && dateNow === item.streams[0].see_you_tomorrow
    );
    isWorkTimeNow(item, setWorkTime, setIsWork, setNextWorkTime);
  }, [item]);

  const findLocation = () => {
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
  };

  findLocation();

  const whenWillBeTranslation = () => {
    if (
      nextStreamTime.start_time &&
      nextStreamTime.day.toLowerCase() !== "сегодня"
    ) {
      return "";
      // "Начало трансляции: " +
      // EN_SHORT_TO_RU_LONG_V_P[nextStreamTime.day] +
      // " в " +
      // nextStreamTime.start_time
    } else if (
      nextStreamTime.start_time &&
      nextStreamTime.day.toLowerCase() === "сегодня"
    ) {
      return "";
      // "Начало трансляции: сегодня в " + nextStreamTime.start_time;
    } else if (!nextStreamTime.start_time) {
      return "";
    }
  };

  const updateIsMobileStreaming = () => {
    fetch(`https://partylivestream.web4net.ru:8080/hls/show/${item.id}.m3u8`)
      .then((res) => setIsmobileStream(res.ok))
      .catch(() => setIsmobileStream(false));
  };

  useEffect(() => {
    updateIsMobileStreaming();
  }, []);

  setInterval(() => {
    updateIsMobileStreaming();
  }, 10000);

  return (
    <SmallCompBlock to={{ pathname: `/company/${item.id}` }}>
      <Desctop>
        {!ismobileStream ? (
          item.streams && item.streams[0] && showStream ? (
            <PreviewBlockD
              style={{ backgroundImage: `url(${item.streams[0].preview})` }}
            >
              <FilmCircleWrap>
                {!!item.streams && !!item.streams.length && (
                  <CustomImgStyleD
                    alt="Icon"
                    name={"film"}
                    style={{ marginLeft: "7px", marginTop: "4px" }}
                  />
                )}
                {item.streams && item.streams[0] && showStream && (
                  <CircleTranslation />
                )}
              </FilmCircleWrap>
            </PreviewBlockD>
          ) : (
            <NoTranslationD
              bg={
                item.profile_image
                  ? `${queryPath}/storage/` + item.profile_image
                  : ""
              }
            >
              <FilmCircleWrap>
                {!!item.streams && !!item.streams.length && (
                  <CustomImgStyleD
                    alt="Icon"
                    name={"film"}
                    style={{ marginLeft: "10px", marginTop: "5px" }}
                  />
                )}
                {item.streams && item.streams[0] && showStream && (
                  <CircleTranslation />
                )}
              </FilmCircleWrap>
              {!isWork && (
                <TransparentBgD>{whenWillBeTranslation()}</TransparentBgD>
              )}
            </NoTranslationD>
          )
        ) : (
          <PreviewBlockD
            style={{
              backgroundImage: `url(https://partylivestream.web4net.ru:8080/hls/show/${item.id}.jpeg)`,
            }}
          />
        )}
        <DescriptionD>
          <TooltipTypeD>
            {item.categories[0] && item.categories[0].name}
          </TooltipTypeD>
          <TopDescriptionBlockD
            onMouseEnter={(e) => {
              e.currentTarget.previousSibling.style.opacity = 1;
            }}
            onMouseOut={(e) => {
              e.currentTarget.previousSibling.style.opacity = 0;
            }}
          >
            <HoverTooltip />
            <IconToCenter>
              {item.categories[0] && (
                <CustomImgStyleD
                  alt="Icon"
                  name={item.categories[0].slug}
                  width="20"
                  height="20"
                />
              )}
            </IconToCenter>
            <CompanyNameD>{item.name}</CompanyNameD>
          </TopDescriptionBlockD>
          <MiddleDescriptionBlockD>
            <WorkTimeWrapD>
              {isWork ? (
                <>
                  <IconToCenter>
                    <CircleD isWork={isWork} />
                  </IconToCenter>
                  <IsOpenedD>Открыто до {workTime.split("-")[1]}</IsOpenedD>
                </>
              ) : (
                <>
                  <IconToCenter>
                    <CircleD isWork={isWork} />
                  </IconToCenter>
                  <IsOpenedD>
                    {nextWorkTime && nextWorkTime.start_time
                      ? `${
                          nextWorkTime.day.toLowerCase() !== "сегодня"
                            ? EN_SHORT_TO_RU_LONG[
                                nextWorkTime.day
                              ][0].toUpperCase() +
                              EN_SHORT_TO_RU_LONG[nextWorkTime.day].slice(1)
                            : nextWorkTime.day
                        }: ${nextWorkTime.start_time}-${nextWorkTime.end_time}`
                      : "Закрыто"}
                  </IsOpenedD>
                </>
              )}
            </WorkTimeWrapD>
          </MiddleDescriptionBlockD>
          <LocationWrapD>
            <IconToCenter>
              <CustomImgStyleD
                alt="Icon"
                name={"location"}
                width="16"
                height="16"
              />
            </IconToCenter>

            <LocationStyleD>
              {item.address &&
                item.address
                  .split(",")[0]
                  .replace("улица", "ул.")
                  .replace("проспект", "пр-т.")}
            </LocationStyleD>
          </LocationWrapD>
        </DescriptionD>
      </Desctop>
      <Mobile>
        {!ismobileStream ? (
          item.streams && item.streams[0] && showStream && isWork ? (
            <PreviewBlockM
              style={{ backgroundImage: `url(${item.streams[0].preview})` }}
            />
          ) : (
            <NoTranslationM
              bg={
                item.profile_image
                  ? `${queryPath}/storage/` + item.profile_image
                  : ""
              }
            >
              <TransparentBgM>
                {nextWorkTime
                  ? isWork
                    ? whenWillBeTranslation()
                    : "Откроется:"
                  : isWork
                  ? whenWillBeTranslation()
                  : "Закрыто"}
                <p>
                  {nextWorkTime && nextWorkTime.start_time
                    ? `${
                        nextWorkTime.day.toLowerCase() !== "сегодня"
                          ? EN_SHORT_TO_RU_LONG[nextWorkTime.day]
                          : nextWorkTime.day
                      }`
                    : ""}
                  {nextWorkTime && nextWorkTime.start_time && <br />}
                  {nextWorkTime &&
                    nextWorkTime.start_time &&
                    nextWorkTime.start_time + "-" + nextWorkTime.end_time}
                </p>
              </TransparentBgM>
            </NoTranslationM>
          )
        ) : (
          <PreviewBlockM
            style={{
              backgroundImage: `url(https://partylivestream.web4net.ru:8080/hls/show/${item.id}.jpeg)`,
            }}
          />
        )}
        <DescriptionM>
          <TopDescriptionBlockM>
            <IconToCenter>
              {item.categories[0] && (
                <CustomImgStyleM
                  alt="Icon"
                  name={item.categories[0] && item.categories[0].slug}
                  width="20"
                  height="20"
                />
              )}
            </IconToCenter>
            <CompanyNameM>{item.name}</CompanyNameM>
          </TopDescriptionBlockM>

          <BottomDescriptionBlockM>
            <WorkTimeDistanceWrapM>
              <CircleRowM>
                <IconToCenter>
                  <CircleD isWork={isWork} />
                </IconToCenter>
                {isWork ? (
                  <IsOpenedM>До {workTime.split("-")[1]}</IsOpenedM>
                ) : (
                  <IsOpenedM>Закрыто</IsOpenedM>
                )}
              </CircleRowM>

              <DistanceM>
                {curDistance && curDistance.toFixed(2) + "km"}
              </DistanceM>
            </WorkTimeDistanceWrapM>
          </BottomDescriptionBlockM>
        </DescriptionM>
      </Mobile>
    </SmallCompBlock>
  );
};

export default SmallCompanyBlock;
