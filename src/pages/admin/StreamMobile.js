import React, { useState, useEffect } from "react";
import styled from "styled-components";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import Switch from "react-switch";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

import { defaultColor, PLACE_QUERY, RTSP_CONNECTION } from "../../constants";
import QUERY from "../../query";
import Loader from "../../components/loader/Loader";

const Wrap = styled.div`
  position: relative;
  top: -46px;
`;

const HeaderWrap = styled.div`
  display: flex;
  height: 44px;
  border-bottom: 1px solid #ececec;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
`;

const CancelSave = styled.p`
  letter-spacing: 0.5px;
  color: defaultColor;
  font-size: 16px;
  font-weight: normal;
`;

const PartyLive = styled.p`
  display: inline-block;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: 0.05em;
  transition: 0.3s ease all;
  color: #323232;
  @media (max-width: 760px) {
    font-size: 20px;
  }
`;

const Live = styled.span`
  display: inline-block;
  background-color: ${defaultColor};
  color: #fff;
  border-radius: 5px;
  margin-left: 3px;
  padding: 0 7px;
`;

const AdminMenuTitleM = styled.p`
  text-align: center;
  padding-top: 20px;
  padding-bottom: 10px;
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;
`;

const DisableStreamM = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px;
  align-items: center;
  justify-content: space-between;
`;

const DisableStreamTextM = styled.div`
  font-size: 18px;
`;

const DisableStreamToNexDayM = styled.div`
    font-size: 16px;
  `,
  StreamTypeWrap = styled.div`
    display: flex;
  `,
  RtspBtn = styled.div`
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
    margin-right: 10px;
    background-color: ${({ active }) => (active ? defaultColor : "#fff")};
    color: ${({ active }) => (active ? "#fff" : "#000")};
    &:hover {
      color: ${({ active }) => (active ? "#fff" : "#000")};
      transition: 0.2s ease all;
    }
  `,
  RtmpBtn = styled(RtspBtn)``,
  ChooseStreamAddress = styled.div`
    padding: 0 10px;
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
    border-color: ${({ err }) => (err ? "red" : "#fff")};
  `,
  UserSelectDiv = styled.div`
    -o-user-select: text;
    -moz-user-select: text;
    -webkit-user-select: text;
    user-select: text;
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
  LoaderWrap = styled.div`
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    margin-left: -200px;
  `;

const StreamMobile = ({ closeAllSidebar, DATA, setDATA, refreshData }) => {
  const [cookies] = useCookies([]);

  const [switchChecked, setSwitchChecked] = useState(null),
    [streamType, setStreamType] = useState("rtsp"),
    [inputErrors, setInputErrors] = useState(false),
    [streamAddressData, setStreamAddressData] = useState(""),
    [streamPortData, setStreamPortData] = useState(""),
    [streamHostData, setStreamHostData] = useState(""),
    [streamPasswordData, setStreamPasswordData] = useState(""),
    [streamLoginData, setStreamLoginData] = useState(""),
    [isLoading, setIsLoading] = useState(false),
    [rtmpUrl, setRtmpUrl] = useState(""),
    [isStream, setIsStream] = useState(""),
    [vedeoLoading, setVedeoLoading] = useState(false);

  const toNewDateFormat = (date) => {
    const dataArr = date.split("/");
    if (dataArr[0].length < 2) dataArr[0] = "0" + dataArr[0];
    const dataArrNew = [dataArr[2], dataArr[0], dataArr[1]],
      dataString = dataArrNew.join("-");

    return dataString;
  };

  let wasInterval = false;
  useEffect(() => {
    console.log(isStream, "-----isStream");
    if (isStream && isStream.url && !wasInterval) {
      setVedeoLoading(true);
      let count = 0;

      const urlTimer = setInterval(() => {
        count++;
        console.log(isStream.url, "---isStream.url");
        setVedeoLoading(true);
        fetch(isStream.url)
          .then((res) => {
            if (res.ok) {
              clearInterval(urlTimer);
              count = 0;
              wasInterval = true;
              setVedeoLoading(false);
            } else {
              setVedeoLoading(true);
            }
          })
          .catch((err) => setVedeoLoading(true));

        if (count > 120) {
          clearInterval(urlTimer);
          setInputErrors(true);
        }
      }, 2500);
    }
  }, [isStream]);

  useEffect(() => {
    console.log(DATA, "---dATA");
    if (DATA.streams && !DATA.streams[0]) {
      setIsStream("");
      clearData();
    }
    if (DATA.streams && DATA.streams[0]) {
      setIsStream(DATA.streams[0]);

      if (DATA.streams[0].rtsp_connection) {
        const RTSP = DATA.streams[0].rtsp_connection;
        setStreamPortData(RTSP.port);
        setStreamHostData(RTSP.host);
        setStreamPasswordData(RTSP.password);
        setStreamLoginData(RTSP.login);
        setStreamAddressData(RTSP.address);
      } else {
        setStreamType("rtmp");
        setRtmpUrl(DATA.streams[0].url.replace("https://", "rtmp://"));
      }

      DATA.streams[0].see_you_tomorrow &&
        setSwitchChecked(
          DATA.streams[0].see_you_tomorrow ===
            toNewDateFormat(new Date().toLocaleDateString())
        );
    }
  }, [DATA]);

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
        place:{ connect: "${DATA.id}" }
        type: ${"RTSP"} 
        ${rtsp_connection_string}
      `
        : `
      name: "${DATA.name}"
      place:{connect:"${DATA.id}"}
      type: ${"RTMP"} 
    `;

  const createStream = (name) => {
      console.log(query_string_create, "---query_string_create");
      if (cookies.origin_data) {
        setIsLoading(true);
        QUERY(
          {
            query: `mutation {
            createStream( input:{ ${query_string_create} }) {
                id name url preview see_you_tomorrow ${PLACE_QUERY} 
                ${RTSP_CONNECTION}
                rtmp_url
            }
          }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            setIsLoading(false);

            data.data.createStream &&
              data.data.createStream.rtmp_url &&
              setRtmpUrl(
                data.data.createStream.rtmp_url.replace("https://", "rtmp://")
              );
            if (!data.errors) {
              refreshData();
              setDATA(data.data.createStream.place);
            } else {
              setInputErrors(true);
              console.log(data.errors, "CREATE STREAM ERRORS");
            }
          })
          .catch((err) => {
            setIsLoading(false);
            setInputErrors(true);
            console.log(err, "CREATE STREAM ERR");
          });
      }
    },
    save = () => {
      !isStream && createStream(streamAddressData);
    },
    clearData = () => {
      setStreamAddressData("");
      setStreamPortData("");
      setStreamHostData("");
      setStreamPasswordData("");
      setStreamLoginData("");
      setRtmpUrl("");
    },
    deleteStream = () => {
      if (cookies.origin_data && isStream) {
        setIsLoading(true);
        QUERY(
          {
            query: `mutation { deleteStream(id:"${+isStream.id}") {
                  id name url see_you_tomorrow ${PLACE_QUERY} 
                  ${RTSP_CONNECTION}
                  rtmp_url
            }}`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            setIsLoading(false);
            if (!data.errors) {
              refreshData();
              setDATA(data.data.deleteStream.place);
            } else {
              console.log(data.errors, "DELETE STREAM ERRORS");
            }
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err, "CREATE STREAM ERR");
          });
      }
    },
    disableStream = (data) => {
      const redact = (num) => {
        if (num > 9) return num;
        return "0" + num;
      };

      const today = new Date(),
        date = today.toLocaleString().split(",")[0].split("/"),
        dateNew = data
          ? date[2] + "-" + redact(date[0]) + "-" + redact(date[1])
          : +date[2] - 1 + "-" + redact(date[0]) + "-" + redact(date[1]);

      if (cookies.origin_data) {
        setIsLoading(true);
        QUERY(
          {
            query: `mutation {
            updateStream (
              input:{
                id:"${+isStream.id}"
                see_you_tomorrow: "${dateNew}"
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
          .then((data) => setIsLoading(false))
          .catch((err) => {
            setIsLoading(false);
            console.log(err, "disableStream ERR");
          });
      }
    };

  return (
    <Wrap>
      <HeaderWrap>
        <CancelSave onClick={() => closeAllSidebar()}>Отмена</CancelSave>
        <Link to="/">
          <PartyLive>
            PARTY<Live>.LIVE</Live>
          </PartyLive>
        </Link>
        <CancelSave onClick={() => save()}>Готово</CancelSave>
      </HeaderWrap>
      <AdminMenuTitleM>Стрим</AdminMenuTitleM>

      {!isStream && (
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
      )}

      {isStream && (
        <>
          {!vedeoLoading && (
            <div className="videoWrapAdminMobile">
              <VideoPlayer preview={isStream.preview} src={isStream.url} />
            </div>
          )}

          {vedeoLoading && (
            <div
              style={{
                padding: "15px",
                color: inputErrors ? "red" : "#000",
              }}
            >
              {inputErrors ? "Неверные данные" : "Идет настройка камеры..."}
            </div>
          )}

          <DisableStreamM>
            <div>
              <DisableStreamTextM>Отключить стрим</DisableStreamTextM>
              <DisableStreamToNexDayM>
                Выключить до следующего дня
              </DisableStreamToNexDayM>
            </div>
            <Switch
              onChange={(data) => {
                setSwitchChecked(data);
                disableStream(data);
              }}
              checked={switchChecked}
              onColor={defaultColor}
              offColor="#999"
              uncheckedIcon={false}
              checkedIcon={false}
            />
          </DisableStreamM>
        </>
      )}
      <ChooseStreamAddress>
        {streamType === "rtsp" && (
          <>
            <CameraAddressWrapper>
              <CameraAddresLable>Логин:</CameraAddresLable>
              <StreamAddress
                disabled={isStream}
                err={inputErrors}
                placeholder={"Логин"}
                value={
                  streamLoginData ||
                  (isStream &&
                    isStream.rtsp_connection &&
                    isStream.rtsp_connection.login)
                }
                onInput={(e) => {
                  setInputErrors(false);
                  setStreamLoginData(e.target.value);
                }}
              />
            </CameraAddressWrapper>
            <CameraAddressWrapper>
              <CameraAddresLable>Пароль:</CameraAddresLable>
              <StreamAddress
                disabled={isStream}
                err={inputErrors}
                placeholder={"пароль"}
                value={
                  streamPasswordData ||
                  (isStream &&
                    isStream.rtsp_connection &&
                    isStream.rtsp_connection.password)
                }
                onInput={(e) => {
                  setInputErrors(false);
                  setStreamPasswordData(e.target.value);
                }}
              />
            </CameraAddressWrapper>
            <CameraAddressWrapper>
              <CameraAddresLable>Хост:</CameraAddresLable>
              <StreamAddress
                disabled={isStream}
                err={inputErrors}
                placeholder={"хост"}
                value={
                  streamHostData ||
                  (isStream &&
                    isStream.rtsp_connection &&
                    isStream.rtsp_connection.host)
                }
                onInput={(e) => {
                  setInputErrors(false);
                  setStreamHostData(e.target.value);
                }}
              />
            </CameraAddressWrapper>
            <CameraAddressWrapper>
              <CameraAddresLable>Порт:</CameraAddresLable>
              <StreamAddress
                disabled={isStream}
                err={inputErrors}
                placeholder={"порт"}
                value={
                  streamPortData ||
                  (isStream &&
                    isStream.rtsp_connection &&
                    isStream.rtsp_connection.port)
                }
                onInput={(e) => {
                  setInputErrors(false);
                  setStreamPortData(e.target.value);
                }}
              />
            </CameraAddressWrapper>
            <CameraAddressWrapper>
              <CameraAddresLable>Адрес:</CameraAddresLable>
              <StreamAddress
                disabled={isStream}
                err={inputErrors}
                placeholder={"адрес"}
                value={
                  streamAddressData ||
                  (isStream &&
                    isStream.rtsp_connection &&
                    isStream.rtsp_connection.address)
                }
                onInput={(e) => {
                  setInputErrors(false);
                  setStreamAddressData(e.target.value);
                }}
              />
            </CameraAddressWrapper>
          </>
        )}

        {streamType === "rtmp" && (
          <UserSelectDiv>
            {rtmpUrl
              ? rtmpUrl
              : 'Нажмите "Создать" для генерации ссылки видео-потока'}
          </UserSelectDiv>
        )}

        <div style={{ display: "flex" }}>
          {!isStream && (
            <ChooseStreamAddressSaveBtn
              style={{ marginRight: "19px" }}
              onClick={() => save()}
            >
              {streamType === "rtsp" ? "Сохранить" : "Создать"}
            </ChooseStreamAddressSaveBtn>
          )}
          {!isStream && streamType === "rtsp" && (
            <CancelBtnProfile onClick={() => clearData("")}>
              Отмена
            </CancelBtnProfile>
          )}
          {isStream && (
            <CancelBtnProfile onClick={() => deleteStream()}>
              Удалить
            </CancelBtnProfile>
          )}
        </div>
      </ChooseStreamAddress>

      {isLoading && (
        <LoaderWrap>
          <Loader />
        </LoaderWrap>
      )}
    </Wrap>
  );
};

export default StreamMobile;
