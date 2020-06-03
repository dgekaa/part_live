import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomImg from "../customImg/CustomImg";

import { EN_SHORT_TO_RU_LONG_V_P, EN_SHORT_TO_RU_LONG } from "../../constants";
import { isShowStreamNow, isWorkTimeNow } from "../../calculateTime";
import { getDistanceFromLatLonInKm } from "../../getDistance";
import styled from "styled-components";

const SmallCompBlock = styled(Link)`
  width: 240px;
  height: 240px;
  overflow: hidden;
  border-radius: 10px;
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: #fff;
  margin: 5px;
  transition: 0.2s ease all;
  border: 1px solid #f3f3f3;
  box-shadow: 4px 4px 4px #e5e5e5;
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
    height: 240px;
  }
  @media (max-width: 380px) {
    width: calc(50% - 10px);
    height: 240px;
  }
`;

const Desctop = styled.div`
  display: block;
  @media (max-width: 760px) {
    /* display: none; */
  }
`;

const PreviewBlockD = styled.div`
  height: 150px;
  background: #000;
  background-size: cover;
`;

const NoTranslationD = styled.div`
  display: flex;
  height: 150px;
  padding: 15px;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  line-height: 19px;
  color: #c4c4c4;
  background: #000;
`;

const DescriptionD = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: 10px;
`;

const TopDescriptionBlockD = styled.div`
  width: 100%;
  display: flex;
`;

const CustomImgStyle = styled(CustomImg)`
  margin-right: 5px;
`;

const CompanyNameD = styled.p`
  color: #000;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  letter-spacing: 0.5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const BottomDescriptionBlockD = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 6px;
`;

const WorkTimeWrapD = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`;

const Circle = styled.div`
  margin-left: 3px;
  width: 7px;
  height: 7px;
  background: ${({ isWork }) => (isWork ? "#04b000" : " #C4C4C4")};
  border-radius: 50%;
  margin-top: 2px;
  margin-right: 6px;
`;

const IsOpenedD = styled.p`
  font-weight: normal;
  font-size: 14px;
  text-transform: lowercase;
  color: #000;
  line-height: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  @media (max-width: 460px) {
    font-size: 13px;
  }
`;

const LocationWrap = styled.div`
  display: flex;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.5px;
  color: #000;
  padding-top: 7px;
  overflow: hidden;
  @media (max-width: 460px) {
    font-size: 13px;
  }
`;

const LocationStyle = styled.p`
  display: flex;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Tooltip = styled.div`
  transition: 0.3s ease all;
  padding: 5px;
  background: #ff0960;
  border-radius: 5px;
  position: absolute;
  font-weight: bold;
  font-size: 10px;
  line-height: 12px;
  top: 133px;
  left: 5px;
  letter-spacing: 0.05em;
  color: #ffffff;
  text-transform: uppercase;
  opacity: 0;
`;

const SmallCompanyBlock = ({ item }) => {
  const [showStream, setShowStream] = useState(false);
  const [workTime, setWorkTime] = useState(false);
  const [isWork, setIsWork] = useState(false);
  const [curDistance, setCurDistance] = useState(null);
  const [nextStreamTime, setNextStreamTime] = useState(false);
  const [nextWorkTime, setNextWorkTime] = useState(null);

  useEffect(() => {
    isShowStreamNow(item, setShowStream, setNextStreamTime);
    isWorkTimeNow(item, setWorkTime, setIsWork, setNextWorkTime);
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
        "Начало трансляции: " +
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
    <SmallCompBlock to={{ pathname: `/company/${item.id}` }}>
      <Desctop>
        {item.streams &&
        item.streams[0] &&
        item.streams[0].preview &&
        showStream ? (
          <PreviewBlockD
            style={{ backgroundImage: `url(${item.streams[0].preview})` }}
          />
        ) : (
          <NoTranslationD
            style={
              item.streams &&
              item.streams[0] &&
              item.streams[0].preview &&
              !showStream
                ? { backgroundImage: `url(${item.streams[0].preview})` }
                : {}
            }
          >
            {whenWillBeTranslation()}
          </NoTranslationD>
        )}
        <DescriptionD>
          <TopDescriptionBlockD>
            {item.categories[0] && (
              <>
                <Tooltip>{item.categories[0].name}</Tooltip>

                <CustomImgStyle
                  onMouseEnter={(e) => {
                    e.target.previousSibling.style.opacity = 1;
                  }}
                  onMouseOut={(e) => {
                    e.target.previousSibling.style.opacity = 0;
                  }}
                  alt="Icon"
                  name={item.categories[0].slug}
                  width="20"
                  height="20"
                />
              </>
            )}
            <CompanyNameD>{item.name}</CompanyNameD>
          </TopDescriptionBlockD>
          <BottomDescriptionBlockD>
            <WorkTimeWrapD>
              {isWork ? (
                <>
                  <Circle isWork={isWork} />
                  <IsOpenedD>Открыто до {workTime.split("-")[1]}</IsOpenedD>
                </>
              ) : (
                <>
                  <Circle isWork={isWork} />
                  <IsOpenedD>
                    {nextWorkTime && nextWorkTime.start_time
                      ? `${
                          nextWorkTime.day.toLowerCase() !== "сегодня"
                            ? EN_SHORT_TO_RU_LONG[nextWorkTime.day]
                            : nextWorkTime.day
                        }: ${nextWorkTime.start_time}-${nextWorkTime.end_time}`
                      : "Закрыто"}
                  </IsOpenedD>
                </>
              )}
            </WorkTimeWrapD>
          </BottomDescriptionBlockD>
          <LocationWrap>
            <CustomImgStyle
              alt="Icon"
              name={"location"}
              width="16"
              height="16"
            />
            <LocationStyle>{item.address}</LocationStyle>
            {/* <LocationStyle>
              {curDistance ? `${curDistance.toFixed(2)} km` : item.address}
            </LocationStyle> */}
          </LocationWrap>
        </DescriptionD>
      </Desctop>
    </SmallCompBlock>
  );
};

export default SmallCompanyBlock;
