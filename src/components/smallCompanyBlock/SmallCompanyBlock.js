import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomImg from "../customImg/CustomImg";

import { queryPath } from "../../constants";
import styled, { keyframes } from "styled-components";
import { defaultColor } from "../../constants";

const SmallCompBlock = styled(Link)`
    width: 240px;
    height: 215px;
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    background-color: #fff;
    transition: 0.3s ease opacity;
    border: 1px solid #eee;
    /* box-shadow: 4px 4px 4px #e5e5e5; */
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
  `,
  Desctop = styled.div`
    display: block;
    @media (max-width: 760px) {
      display: none;
    }
  `,
  PreviewBlockD = styled.div`
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    height: 150px;
    background: #000;
    background-size: cover;
    background-position: center;
  `,
  NoTranslationD = styled.div`
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
  `,
  TransparentBgD = styled.div`
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
  `,
  DescriptionD = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    padding: 10px;
  `,
  TopDescriptionBlockD = styled.div`
    width: 100%;
    display: flex;
    position: relative;
  `,
  IconToCenter = styled.div`
    width: 20px;
    display: flex;
    justify-content: center;
    margin-right: 5px;
  `,
  HoverTooltip = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: transparent;
  `,
  CustomImgStyleD = styled(CustomImg)``,
  CompanyNameD = styled.p`
    color: #000;
    font-weight: 700;
    font-size: 20px;
    line-height: 21px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
  MiddleDescriptionBlockD = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5px;
  `,
  WorkTimeWrapD = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
  `,
  CircleD = styled.div`
    width: 7px;
    height: 7px;
    background: ${({ isWork }) => (isWork ? "#04b000" : " #C4C4C4")};
    border-radius: 50%;
  `,
  IsOpenedD = styled.p`
    font-weight: 500;
    font-size: 14px;
    color: #9d9d9d;
    line-height: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    @media (max-width: 460px) {
      font-size: 13px;
    }
  `,
  LocationWrapD = styled.div`
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
  `,
  LocationStyleD = styled.span`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
  `,
  TooltipTypeD = styled.div`
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
  `,
  Mobile = styled.div`
    display: none;
    @media (max-width: 760px) {
      display: block;
    }
  `,
  PreviewBlockM = styled.div`
    border-radius: 5px;
    overflow: hidden;
    height: 175px;
    background: #000;
    background-size: cover;
    background-position: center;
    @media (max-width: 375px) {
      height: 150px;
    }
  `,
  NoTranslationM = styled.div`
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
  `,
  TransparentBgM = styled.div`
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
  `,
  DescriptionM = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    padding: 5px;
  `,
  TopDescriptionBlockM = styled.div`
    width: 100%;
    display: flex;
  `,
  CustomImgStyleM = styled(CustomImg)``,
  CompanyNameM = styled.p`
    color: #363636;
    font-weight: 500;
    font-size: 18px;
    line-height: 25px;
    letter-spacing: 0.5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
  DistanceM = styled.p`
    font-weight: bold;
    font-size: 14px;
    letter-spacing: 0.5px;
    color: ${defaultColor};
    line-height: 23px;
    white-space: nowrap;
  `,
  BottomDescriptionBlockM = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `,
  WorkTimeDistanceWrapM = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    align-items: center;
    overflow: hidden;
    justify-content: space-between;
  `,
  CircleRowM = styled.div`
    display: flex;
    align-items: center;
  `,
  IsOpenedM = styled.p`
    font-weight: normal;
    font-size: 14px;
    color: #000;
    line-height: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
  blik = keyframes`
  0% {
   opacity:1;
  }
  50% {
    opacity:0;
  }
  100% {
   opacity:1;
  }
`,
  FilmCircleWrap = styled.span`
    display: flex;
    align-items: "center";
  `,
  CircleTranslation = styled.span`
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #ff0000;
    border-radius: 50%;
    margin-top: 9px;
    animation: ${blik} 1s ease infinite;
  `;

const SmallCompanyBlock = ({ item }) => {
  const [ismobileStream, setIsmobileStream] = useState(false);

  // const mouseEnter = (e) => (e.currentTarget.previousSibling.style.opacity = 1),
  //   mouseOut = (e) => (e.currentTarget.previousSibling.style.opacity = 0);

  const locationAddress =
      item.address &&
      item.address
        .split(",")[0]
        .replace("улица", "ул.")
        .replace("проспект", "пр-т."),
    backgroundUrl = `url(https://ms1.partylive.by/hls/show/${item.id}/image.jpg)`,
    noTranslationBg = item.profile_image
      ? `${queryPath}/storage/` + item.profile_image.replace(".png", ".jpg")
      : "",
    openedTo =
      item.currentScheduleInterval &&
      item.currentScheduleInterval.end_time
        .split(" ")[1]
        .split(":")
        .slice(0, 2)
        .join(":");

  return (
    <SmallCompBlock to={{ pathname: `/company/${item.id}` }}>
      <Desctop>
        {!ismobileStream ? (
          item.is_online ? (
            <PreviewBlockD
              style={{ backgroundImage: `url(${item.streams[0].preview})` }}
            >
              <FilmCircleWrap>
                {!!item.streams.length && (
                  <CustomImgStyleD
                    alt="Icon"
                    name={"film"}
                    style={{ marginLeft: "7px", marginTop: "4px" }}
                  />
                )}
                {item.is_online && <CircleTranslation />}
              </FilmCircleWrap>
            </PreviewBlockD>
          ) : (
            <NoTranslationD
              bg={
                item.profile_image
                  ? `${queryPath}/storage/` +
                    item.profile_image.replace(".png", ".jpg")
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
                {item.is_online && <CircleTranslation />}
              </FilmCircleWrap>
            </NoTranslationD>
          )
        ) : (
          <PreviewBlockD
            style={{
              backgroundImage: backgroundUrl,
            }}
          />
        )}
        <DescriptionD>
          {/* <TooltipTypeD>
            {item.categories[0] && item.categories[0].name}
          </TooltipTypeD> */}
          <TopDescriptionBlockD
          // onMouseEnter={(e) => mouseEnter(e)}
          // onMouseOut={(e) => mouseOut(e)}
          >
            {/* <HoverTooltip /> */}
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
              {item.is_work ? (
                <>
                  <IconToCenter>
                    <CircleD isWork={item.is_work} />
                  </IconToCenter>
                  <IsOpenedD>Открыто до{" " + openedTo}</IsOpenedD>
                </>
              ) : (
                <>
                  <IconToCenter>
                    <CircleD isWork={item.is_work} />
                  </IconToCenter>
                  <IsOpenedD>Закрыто</IsOpenedD>
                </>
              )}
            </WorkTimeWrapD>
          </MiddleDescriptionBlockD>
          {/* <LocationWrapD>
            <IconToCenter>
              <CustomImgStyleD
                alt="Icon"
                name={"location"}
                width="16"
                height="16"
              />
            </IconToCenter>
            <LocationStyleD>{locationAddress}</LocationStyleD>
          </LocationWrapD> */}
        </DescriptionD>
      </Desctop>
      <Mobile>
        {!ismobileStream ? (
          item.is_online && item.is_work ? (
            <PreviewBlockM
              style={{ backgroundImage: `url(${item.streams[0].preview})` }}
            />
          ) : (
            <NoTranslationM bg={noTranslationBg}></NoTranslationM>
          )
        ) : (
          <PreviewBlockM
            style={{
              backgroundImage: backgroundUrl,
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
                  <CircleD isWork={item.is_work} />
                </IconToCenter>
                {item.is_work ? (
                  <IsOpenedM>До{" " + openedTo}</IsOpenedM>
                ) : (
                  <IsOpenedM>Закрыто</IsOpenedM>
                )}
              </CircleRowM>

              <DistanceM>
                {item.distance && item.distance.toFixed(2) + "km"}
              </DistanceM>
            </WorkTimeDistanceWrapM>
          </BottomDescriptionBlockM>
        </DescriptionM>
      </Mobile>
    </SmallCompBlock>
  );
};

export default SmallCompanyBlock;
