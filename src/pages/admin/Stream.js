import React, { useState, useEffect } from "react";
import styled from "styled-components";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import Switch from "react-switch";
import { useCookies } from "react-cookie";
import Loader from "../../components/loader/Loader";

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
    border-color: ${({ err }) => (err ? "red" : "#fff")};
  `,
  ChooseStreamAddressSaveBtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    cursor: pointer;
    border: 1px solid #eee;
    height: 40px;
    width: 50%;
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
    width: 48%;
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
    justify-content: space-between;
  `,
  RtspBtn = styled(CancelBtnProfile)`
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
  `,
  LoaderWrap = styled.div`
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    margin-left: -200px;
  `,
  Inputs = styled.input`
    -webkit-user-select: initial;
    -khtml-user-select: initial;
    -moz-user-select: initial;
    -ms-user-select: initial;
    user-select: initial;
    -webkit-appearance: none;
    transition: 0.3s ease all;
    width: 100%;
    font-size: 20px;
    height: 45px;
    outline: none;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-color: ${({ err }) => (err ? "red" : "#e5e5e5")};
    box-sizing: border-box;
    border-radius: 7px;
    margin: 7px 0px;
    padding: 0 10px;
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
    [rtmpUrl, setRtmpUrl] = useState(""),
    [isLoading, setIsLoading] = useState(false),
    [vedeoLoading, setVedeoLoading] = useState(false),
    [inputErrors, setInputErrors] = useState({
      login: false,
      password: false,
      host: false,
      port: false,
      address: false,
      cameraError: false,
    }),
    [rtmpError, setrtmpError] = useState(false);

  const toNewDateFormat = (date) => {
      const dataArr = date.split("/");
      if (dataArr[0].length < 2) dataArr[0] = "0" + dataArr[0];
      const dataArrNew = [dataArr[2], dataArr[0], dataArr[1]],
        dataString = dataArrNew.join("-");

      return dataString;
    },
    clearData = () => {
      setStreamAddressData("");
      setStreamPortData("");
      setStreamHostData("");
      setStreamPasswordData("");
      setStreamLoginData("");
      setRtmpUrl("");
    },
    deleteErrors = () => {
      setInputErrors({
        login: false,
        password: false,
        host: false,
        port: false,
        address: false,
      });
    },
    createAllErrors = () => {
      setInputErrors({
        login: true,
        password: true,
        host: true,
        port: true,
        address: true,
      });
    },
    checkInpudData = () => {
      if (
        !streamAddressData ||
        !streamPortData ||
        !streamHostData ||
        !streamPasswordData ||
        !streamLoginData
      ) {
        !streamAddressData &&
          setInputErrors((prevState) => {
            return { ...prevState, address: true };
          });
        !streamPortData &&
          setInputErrors((prevState) => {
            return { ...prevState, port: true };
          });
        !streamHostData &&
          setInputErrors((prevState) => {
            return { ...prevState, host: true };
          });
        !streamPasswordData &&
          setInputErrors((prevState) => {
            return { ...prevState, password: true };
          });
        !streamLoginData &&
          setInputErrors((prevState) => {
            return { ...prevState, login: true };
          });
        return true;
      }
      return false;
    };

  useEffect(() => {
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
          place:{ connect: "${props.match.params.id}" }
          type: ${"RTSP"} 
          ${rtsp_connection_string}
        `
        : `
        name: "${DATA.name}"
        place:{connect:"${props.match.params.id}"}
        type: ${"RTMP"} 
      `;

  const createStream = (isRtmp) => {
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
              createAllErrors(true);
              setInputErrors((prevState) => {
                return { ...prevState, cameraError: true };
              });
              console.log(data.errors, "CREATE STREAM ERRORS");
            }
          })
          .catch((err) => {
            setIsLoading(false);

            createAllErrors(true);
            setInputErrors((prevState) => {
              return { ...prevState, cameraError: true };
            });

            console.log(err, "CREATE STREAM ERR");
          });
      }
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
    },
    save = () => {
      if (streamType === "rtsp") {
        !isStream && !checkInpudData() && createStream();
      } else {
        !isStream && createStream(true);
      }
    };

  let wasInterval = false;
  useEffect(() => {
    if (isStream && isStream.url && !wasInterval) {
      setVedeoLoading(true);
      let count = 0;

      const urlTimer = setInterval(() => {
        count++;
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
          createAllErrors(true);
          setInputErrors((prevState) => {
            return { ...prevState, cameraError: true };
          });
        }
      }, 2500);
    }
  }, [isStream]);

  return (
    <StreamBlock key={index}>
      <H3>СТРИМ</H3>

      {!isStream && (
        <StreamTypeWrap>
          <RtspBtn
            active={streamType === "rtsp"}
            onClick={() => {
              deleteErrors();
              setStreamType("rtsp");
            }}
          >
            RTSP
          </RtspBtn>
          <RtmpBtn
            active={streamType === "rtmp"}
            onClick={() => {
              deleteErrors();
              setStreamType("rtmp");
            }}
          >
            RTMP
          </RtmpBtn>
        </StreamTypeWrap>
      )}

      {isStream && (
        <>
          {!vedeoLoading && (
            <VideoWrap>
              <VideoPlayer preview={isStream.preview} src={isStream.url} />
            </VideoWrap>
          )}
          {vedeoLoading && (
            <div
              style={{
                color: inputErrors["cameraError"] ? "red" : "#000",
              }}
            >
              {inputErrors["cameraError"] ? (
                "Неверные данные"
              ) : (
                <VideoWrap
                  style={{
                    border: "1px solid #3d3d3d",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    height: "300px",
                  }}
                >
                  Идет настройка камеры...
                </VideoWrap>
              )}
            </div>
          )}

          {/* <DisableStreamD>
            <div>
              <DisableStreamTextD>Отключить стрим</DisableStreamTextD>
              <DisableStreamToNexDayD>
                Выключить до следующего дня
              </DisableStreamToNexDayD>
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
          </DisableStreamD> */}
        </>
      )}

      <ChooseStreamAddress>
        {streamType === "rtsp" && (
          <>
            <Inputs
              disabled={isStream}
              err={inputErrors["login"]}
              placeholder={"логин"}
              value={
                streamLoginData ||
                (isStream &&
                  isStream.rtsp_connection &&
                  isStream.rtsp_connection.login)
              }
              onInput={(e) => {
                deleteErrors();
                setStreamLoginData(e.target.value);
              }}
            />
            <Inputs
              disabled={isStream}
              err={inputErrors["password"]}
              placeholder={"пароль"}
              value={
                streamPasswordData ||
                (isStream &&
                  isStream.rtsp_connection &&
                  isStream.rtsp_connection.password)
              }
              onInput={(e) => {
                deleteErrors();
                setStreamPasswordData(e.target.value);
              }}
            />
            <Inputs
              disabled={isStream}
              err={inputErrors["host"]}
              placeholder={"хост"}
              value={
                streamHostData ||
                (isStream &&
                  isStream.rtsp_connection &&
                  isStream.rtsp_connection.host)
              }
              onInput={(e) => {
                deleteErrors();
                setStreamHostData(e.target.value);
              }}
            />
            <Inputs
              disabled={isStream}
              err={inputErrors["port"]}
              placeholder={"порт"}
              value={
                streamPortData ||
                (isStream &&
                  isStream.rtsp_connection &&
                  isStream.rtsp_connection.port)
              }
              onInput={(e) => {
                deleteErrors();
                setStreamPortData(e.target.value);
              }}
            />
            <Inputs
              disabled={isStream}
              err={inputErrors["address"]}
              placeholder={"адрес"}
              value={
                streamAddressData ||
                (isStream &&
                  isStream.rtsp_connection &&
                  isStream.rtsp_connection.address)
              }
              onInput={(e) => {
                deleteErrors();
                setStreamAddressData(e.target.value);
              }}
            />
          </>
        )}

        {streamType === "rtmp" && (
          <div>
            {rtmpUrl ? (
              <div>
                <p style={{ fontWeight: 500, fontSize: "16px" }}>
                  Скопируйте адрес видеосервера в соответствующее поле в панели
                  настроек Вашей ip-камеры
                </p>

                <UserSelectDiv>{rtmpUrl}</UserSelectDiv>
              </div>
            ) : (
              <p>Нажмите "Создать" для генерации ссылки видео-потока</p>
            )}
          </div>
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
            <CancelBtnProfile
              onClick={() => {
                deleteErrors();
                clearData("");
              }}
            >
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
    </StreamBlock>
  );
};

export default Stream;
