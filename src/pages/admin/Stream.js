import React, { useState, useEffect } from "react";
import styled from "styled-components";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import Switch from "react-switch";
import { useCookies } from "react-cookie";

import { defaultColor, PLACE_QUERY, RTSP_CONNECTION } from "../../constants";
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
  `,
  DisableStreamToNexDayD = styled.span`
    font-size: 16px;
    color: #6f6f6f;
  `,
  DisableStreamTextD = styled.span`
    font-size: 18px;
    color: #000;
  `,
  StreamBlock = styled.div`
    font-size: 18px;
  `,
  H3 = styled.h3`
    font-size: 24px;
  `,
  VideoWrap = styled.div`
    margin-top: 20px;
    width: 80%;
    border-radius: 10px;
    overflow: hidden;
  `,
  ChooseStreamAddress = styled.div`
    margin-top: 15px;
    display: flex;
    flex-direction: column;
  `,
  CameraAddressWrapper = styled.div`
    width: 80%;
    display: flex;
    margin-bottom: 5px;
  `,
  CameraAddresLable = styled.span`
    font-weight: 500;
    font-size: 16px;
    color: #4f4f4f;
    background-color: #fff;
    margin-right: 15px;
    padding-top: 2px;
    width: 50px;
  `,
  StreamAddress = styled.input`
    width: 100%;
    border-radius: 5px;
    outline: none;
    border: 1px solid #eee;
    padding: 0 7px;
    flex: 1;
    height: 30px;
  `,
  ChooseStreamAddressSaveBtn = styled.div`
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
  `,
  CancelBtnProfile = styled.div`
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
  `,
  StreamTypeWrap = styled.div`
    display: flex;
  `,
  RtspBtn = styled(CancelBtnProfile)`
    margin-right: 10px;
    background-color: ${({ active }) => (active ? defaultColor : "#fff")};
    color: ${({ active }) => (active ? "#fff" : "#000")};
    &:hover {
      color: ${({ active }) => (active ? "#fff" : "#000")};
      transition: 0.2s ease all;
    }
  `,
  RtmpBtn = styled(RtspBtn)``,
  UserSelectDiv = styled.div`
    -o-user-select: text;
    -moz-user-select: text;
    -webkit-user-select: text;
    user-select: text;
  `;

const Stream = ({ index, DATA, props, refreshData, setDATA }) => {
  const [cookies] = useCookies([]);

  const [switchChecked, setSwitchChecked] = useState(null),
    [streamAddressData, setStreamAddressData] = useState(""),
    [streamPortData, setStreamPortData] = useState(""),
    [streamHostData, setStreamHostData] = useState(""),
    [streamPasswordData, setStreamPasswordData] = useState(""),
    [streamLoginData, setStreamLoginData] = useState(""),
    [streamType, setStreamType] = useState("rtsp"),
    [isStream, setIsStream] = useState(""),
    [rtmpUrl, setRtmpUrl] = useState("");

  const toNewDateFormat = (date) => {
    const dataArr = date.split("/");
    if (dataArr[0].length < 2) dataArr[0] = "0" + dataArr[0];
    const dataArrNew = [dataArr[2], dataArr[0], dataArr[1]],
      dataString = dataArrNew.join("-");

    return dataString;
  };

  useEffect(() => {
    if (DATA.streams && DATA.streams[0]) {
      setIsStream(DATA.streams[0]);
      if (DATA.streams[0].rtsp_connection) {
        const RTSP = DATA.streams[0].rtsp_connection;
        setStreamPortData(RTSP.port);
        setStreamHostData(RTSP.host);
        setStreamPasswordData(RTSP.password);
        setStreamLoginData(RTSP.login);
        setStreamAddressData(RTSP.address);
      }
      DATA.streams[0].see_you_tomorrow &&
        setSwitchChecked(
          DATA.streams[0].see_you_tomorrow ===
            toNewDateFormat(new Date().toLocaleDateString())
        );
    }
  }, [DATA]);

  useEffect(() => {
    console.log(isStream, "---isStream");
  }, [isStream]);

  const rtsp_connection_string = `rtsp_connection: {
    create: {
      login : "${streamLoginData}"
      password : "${streamPasswordData}"
      host : "${streamHostData}"
      port : ${streamPortData}
      address : "${streamAddressData}"
    }
    }`,
    query_string_create =
      streamType === "rtsp"
        ? ` 
          name: "${DATA.name}"
          place:{connect:"${props.match.params.id}"}
          type: ${"RTSP"} 
          ${rtsp_connection_string}
        `
        : `
        name: "${DATA.name}"
        place:{connect:"${props.match.params.id}"}
        type: ${"RTMP"} 
      `,
    query_string_update =
      streamType === "rtsp"
        ? `
          id:"${isStream.id}"
          type: ${"RTSP"} 
          ${rtsp_connection_string}
        `
        : `id:"${isStream.id}"  type: ${"RTMP"}`;

  const createStream = (name) => {
      if (cookies.origin_data) {
        QUERY(
          {
            query: `mutation {
              createStream(
                input:{ ${query_string_create} }) {
                  id name url see_you_tomorrow ${PLACE_QUERY} 
                  ${RTSP_CONNECTION}
                  rtmp_url
              }}
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
        QUERY(
          {
            query: `mutation {
            updateStream (
              input:{ ${query_string_update} }
            ) { 
              id name url see_you_tomorrow ${PLACE_QUERY} 
              ${RTSP_CONNECTION}
              rtmp_url
            }}`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.errors) {
              data.data.updateStream.rtmp_url &&
                setRtmpUrl(data.data.updateStream.rtmp_url);
              setDATA(data.data.updateStream.place);
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
            ) { 
              id name url see_you_tomorrow ${PLACE_QUERY} 
              ${RTSP_CONNECTION}
              rtmp_url
            }
          }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            !data.errors
              ? setDATA(data.data.updateStream.place)
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
      <StreamTypeWrap>
        <RtspBtn
          active={streamType === "rtsp"}
          onClick={() => setStreamType("rtsp")}
        >
          RTSP
        </RtspBtn>
        <RtmpBtn
          active={streamType === "rtmp"}
          onClick={() => setStreamType("rtmp")}
        >
          RTMP
        </RtmpBtn>
      </StreamTypeWrap>
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
        {streamType === "rtsp" && (
          <>
            <CameraAddressWrapper>
              <CameraAddresLable>Логин:</CameraAddresLable>
              <StreamAddress
                placeholder={"Логин"}
                value={
                  streamLoginData ||
                  (isStream &&
                    isStream.rtsp_connection &&
                    isStream.rtsp_connection.login)
                }
                onInput={(e) => setStreamLoginData(e.target.value)}
              />
            </CameraAddressWrapper>
            <CameraAddressWrapper>
              <CameraAddresLable>Пароль:</CameraAddresLable>
              <StreamAddress
                placeholder={"пароль"}
                value={
                  streamPasswordData ||
                  (isStream &&
                    isStream.rtsp_connection &&
                    isStream.rtsp_connection.password)
                }
                onInput={(e) => setStreamPasswordData(e.target.value)}
              />
            </CameraAddressWrapper>
            <CameraAddressWrapper>
              <CameraAddresLable>Хост:</CameraAddresLable>
              <StreamAddress
                placeholder={"хост"}
                value={
                  streamHostData ||
                  (isStream &&
                    isStream.rtsp_connection &&
                    isStream.rtsp_connection.host)
                }
                onInput={(e) => setStreamHostData(e.target.value)}
              />
            </CameraAddressWrapper>
            <CameraAddressWrapper>
              <CameraAddresLable>Порт:</CameraAddresLable>
              <StreamAddress
                placeholder={"порт"}
                value={
                  streamPortData ||
                  (isStream &&
                    isStream.rtsp_connection &&
                    isStream.rtsp_connection.port)
                }
                onInput={(e) => setStreamPortData(e.target.value)}
              />
            </CameraAddressWrapper>
            <CameraAddressWrapper>
              <CameraAddresLable>Адрес:</CameraAddresLable>
              <StreamAddress
                placeholder={"адрес"}
                value={
                  streamAddressData ||
                  (isStream &&
                    isStream.rtsp_connection &&
                    isStream.rtsp_connection.address)
                }
                onInput={(e) => setStreamAddressData(e.target.value)}
              />
            </CameraAddressWrapper>
          </>
        )}

        {streamType === "rtmp" && rtmpUrl && (
          <UserSelectDiv>{rtmpUrl}</UserSelectDiv>
        )}

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
