import React, { useState, useEffect } from "react";
import styled from "styled-components";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import Switch from "react-switch";
import { useCookies } from "react-cookie";

import { defaultColor } from "../../constants";
import QUERY from "../../query";

const DisableStreamD = styled.span`
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  div {
    display: flex;
    flex-direction: column;
  }
`;

const DisableStreamToNexDayD = styled.span`
  font-size: 16px;
  color: #6f6f6f;
`;

const DisableStreamTextD = styled.span`
  font-size: 18px;
  color: #000;
`;

const StreamBlock = styled.div`
  font-size: 18px;
`;

const H3 = styled.h3`
  font-size: 24px;
`;

const VideoWrap = styled.div`
  margin-top: 20px;
  width: 80%;
  border-radius: 10px;
  overflow: hidden;
`;

const ChooseStreamAddress = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
`;

const CameraAddressWrapper = styled.div`
  width: 80%;
  display: flex;
`;

const CameraAddresLable = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: #4f4f4f;
  background-color: #fff;
  margin-right: 15px;
  padding-top: 2px;
`;

const StreamAddress = styled.input`
  width: 100%;
  border-radius: 5px;
  outline: none;
  border: 1px solid #eee;
  padding: 0 7px;
  flex: 1;
  height: 30px;
`;

const ChooseStreamAddressSaveBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid #eee;
  height: 40px;
  width: 244px;
  margin-top: 37px;
  border-radius: 5px;
  background-color: #f8104d;
  color: #fff;
  transition: 0.3s ease opacity;
  font-weight: bold;
  font-size: 14px;
  &:hover {
    opacity: 0.8;
  }
`;

const CancelBtnProfile = styled.div`
  border: 2px solid #c4c4c4;
  color: #4f4f4f;
  font-weight: 700;
  font-size: 14px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 244px;
  height: 39px;
  cursor: pointer;
  margin: 38px 0 15px 0;
  &:hover {
    color: rgb(227, 42, 108);
    border: 2px solid rgb(227, 42, 108);
    transition: 0.3s ease all;
  }
`;

const Stream = ({ index, DATA, props, refreshData }) => {
  const [cookies] = useCookies([]);

  const [switchChecked, setSwitchChecked] = useState(null),
    [streamAddressData, setStreamAddressData] = useState("");

  const toNewDateFormat = (date) => {
    const dataArr = date.split("/");
    if (dataArr[0].length < 2) dataArr[0] = "0" + dataArr[0];
    const dataArrNew = [dataArr[2], dataArr[0], dataArr[1]],
      dataString = dataArrNew.join("-");

    return dataString;
  };

  const isStream = DATA.streams && DATA.streams[0],
    streamAddressPlaceholder =
      (isStream && isStream.url && isStream.url) || "Введите адрес стрима";

  useEffect(() => {
    isStream &&
      isStream.see_you_tomorrow &&
      setSwitchChecked(
        isStream.see_you_tomorrow ===
          toNewDateFormat(new Date().toLocaleDateString())
      );
  }, [DATA.streams]);

  const createStream = (name) => {
      if (cookies.origin_data) {
        QUERY(
          {
            query: `mutation {
              createStream(
                input:{
                  name: "${DATA.name}"
                  url :"https://partycamera.org/${name}/index.m3u8"
                  preview : "http://partycamera.org:80/${name}/preview.mp4"
                  place:{connect:"${props.match.params.id}"}                  
                }) {id name url}
            }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            !data.errors
              ? refreshData()
              : console.log(data.errors, "CREATE STREAM ERRORS");
          })
          .catch((err) => console.log(err, "CREATE STREAM ERR"));
      }
    },
    updateStream = (name) => {
      if (cookies.origin_data) {
        const videoPreview = name.split("/"),
          videoPreviewUrl = name.replace(
            videoPreview[videoPreview.length - 1],
            "image.jpg"
          );

        QUERY(
          {
            query: `mutation {
            updateStream (
              input:{
                id:"${isStream.id}"
                url :"${name}"
                preview : "${videoPreviewUrl}"
              }
            ) { id name url }
          }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.errors) {
              refreshData();
            } else {
              console.log(data.errors, "UPDATESTREAM ERRORS");
            }
          })
          .catch((err) => console.log(err, "UPDATESTREAM ERR"));
      }
    },
    deleteStream = () => {
      if (cookies.origin_data && isStream) {
        QUERY(
          {
            query: `mutation {
              deleteStream(id:"${+isStream.id}"
                ) {id name url}
            }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.errors) {
              refreshData();
            } else {
              console.log(data.errors, "DELETE STREAM ERRORS");
            }
          })
          .catch((err) => console.log(err, "CREATE STREAM ERR"));
      }
    },
    disableStream = (data) => {
      let dataString = "";
      if (data)
        dataString = data.indexOf("-") === -1 ? toNewDateFormat(data) : data;

      if (cookies.origin_data && isStream) {
        QUERY(
          {
            query: `mutation {
            updateStream (
              input:{
                id:"${+isStream.id}"
               ${
                 data
                   ? ` see_you_tomorrow: "${dataString}"`
                   : ` see_you_tomorrow: ${data}`
               }               
              }
            ) { id name url }
          }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data, "---data");
            !data.errors
              ? refreshData()
              : console.log(data.errors, "disableStream ERRORS");
          })
          .catch((err) => console.log(err, "disableStream ERR"));
      }
    },
    save = () => {
      if (
        streamAddressData &&
        streamAddressData.toLocaleLowerCase() !== "delete"
      ) {
        !isStream
          ? createStream(streamAddressData)
          : updateStream(streamAddressData);
      } else if (streamAddressData.toLocaleLowerCase() === "delete") {
        deleteStream();
      }

      disableStream(
        switchChecked ? toNewDateFormat(new Date().toLocaleDateString()) : null
      );
    };

  return (
    <StreamBlock key={index}>
      <H3>СТРИМ</H3>
      {isStream && (
        <>
          <VideoWrap>
            <VideoPlayer preview={isStream.preview} src={isStream.url} />
          </VideoWrap>
          <DisableStreamD>
            <div>
              <DisableStreamTextD>Отключить стрим</DisableStreamTextD>
              <DisableStreamToNexDayD>
                Выключить до следующего дня
              </DisableStreamToNexDayD>
            </div>

            <Switch
              onChange={setSwitchChecked}
              checked={switchChecked}
              onColor={defaultColor}
              offColor="#999"
              uncheckedIcon={false}
              checkedIcon={false}
            />
          </DisableStreamD>
        </>
      )}

      <ChooseStreamAddress>
        <CameraAddressWrapper>
          <CameraAddresLable>Адрес камеры:</CameraAddresLable>
          <StreamAddress
            placeholder={streamAddressPlaceholder}
            value={streamAddressData}
            onInput={(e) => setStreamAddressData(e.target.value)}
          />
        </CameraAddressWrapper>
        <div style={{ display: "flex" }}>
          <ChooseStreamAddressSaveBtn
            style={{ marginRight: "19px" }}
            onClick={() => save()}
          >
            Сохранить
          </ChooseStreamAddressSaveBtn>
          <CancelBtnProfile onClick={() => setStreamAddressData("")}>
            Отмена
          </CancelBtnProfile>
        </div>
      </ChooseStreamAddress>
    </StreamBlock>
  );
};

export default Stream;
