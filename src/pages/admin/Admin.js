import React, { useState, useEffect, useRef } from "react";
import GoogleMap from "../../components/googleMap/GoogleMap";

import { useCookies } from "react-cookie";
import ReactHLS from "react-hls";
import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Popup from "../../components/popup/Popup";
import Loader from "../../components/loader/Loader";
import QUERY from "../../query";
import { EN_SHORT_DAY_OF_WEEK } from "../../constants";

import {} from "@mobiscroll/react-lite";
import "@mobiscroll/react-lite/dist/css/mobiscroll.min.css";

import "./admin.css";
import { Redirect } from "react-router-dom";

const TimePicker = ({ timePickerName, setTime, realTimeInPicker }) => {
  const [hours, setHours] = useState(realTimeInPicker.split(":")[0]);
  const [minutes, setMinutes] = useState(realTimeInPicker.split(":")[1]);

  const clickHandlerTop = (e, max) => {
    e.target.nextSibling.innerText = +e.target.nextSibling.innerText + 1;
    if (+e.target.nextSibling.innerText === max) {
      e.target.nextSibling.innerText = 0;
    }
    if (+e.target.nextSibling.innerText < 10) {
      e.target.nextSibling.innerText = "0" + e.target.nextSibling.innerText;
    }
    if (max === 24) {
      setHours(e.target.nextSibling.innerText);
    } else {
      setMinutes(e.target.nextSibling.innerText);
    }
  };

  const clickHandlerBottom = (e, max) => {
    if (+e.target.previousSibling.innerText === 0) {
      e.target.previousSibling.innerText = max;
    }
    e.target.previousSibling.innerText =
      +e.target.previousSibling.innerText - 1;

    if (e.target.previousSibling.innerText < 10) {
      e.target.previousSibling.innerText =
        "0" + e.target.previousSibling.innerText;
    }
    if (max === 24) {
      setHours(e.target.previousSibling.innerText);
    } else {
      setMinutes(e.target.previousSibling.innerText);
    }
  };

  useEffect(() => {
    setTime(hours, minutes);
  }, [hours, minutes]);

  return (
    <div className="timePickerWrap">
      <p className="timePickerName">{timePickerName}</p>
      <div className="timePicker">
        <div className="timePickerHoursWrap">
          <span
            className="topArrow"
            onClick={(e) => {
              clickHandlerTop(e, 24);
            }}
          ></span>
          <p className="timePickerHours">
            {realTimeInPicker && realTimeInPicker.split(":")[0]}
          </p>
          <span
            className="bottomArrow"
            onClick={(e) => {
              clickHandlerBottom(e, 24);
            }}
          ></span>
        </div>
        <p className="twoDots">:</p>
        <div className="timePickerMinutesWrap">
          <span
            className="topArrow"
            onClick={(e) => {
              clickHandlerTop(e, 60);
            }}
          ></span>
          <p className="timePickerMinutes">
            {realTimeInPicker && realTimeInPicker.split(":")[1]}
          </p>
          <span
            className="bottomArrow"
            onClick={(e) => {
              clickHandlerBottom(e, 60);
            }}
          ></span>
        </div>
      </div>
    </div>
  );
};

const Admin = (props) => {
  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [DATA, setDATA] = useState([]);
  const [showPopupDatePicker, setShowPopapDatePicker] = useState(false);
  const [showPopupGoogleMap, setShowPopapGoogleMap] = useState(false);
  const [startTimePicker, setStartTimePicker] = useState("00:00");
  const [endTimePicker, setEndTimePicker] = useState("00:00");

  const [startRealTimeInPicker, setStartRealTimeInPicker] = useState();
  const [endRealTimeInPicker, setEndRealTimeInPicker] = useState();
  const [isEmptyTime, setIsEmptyTime] = useState(true);
  const [enumWeekName, setEnumWeekName] = useState("");
  const [isSetWorkTimeDPick, setIsSetWorkTimeDPick] = useState(false);
  const [streamAddressData, setStreamAddressData] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [clickedTime, setClickedTime] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileInput = useRef(null);
  const [cookies, setCookie, removeCookie] = useCookies([]);

  !windowWidth && setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.onresize = function (e) {
      setWindowWidth(e.target.innerWidth);
    };
  });

  const chooseNewAddress = (streetName, latLng) => {
    const stringLatLng = "" + latLng.lat + "," + latLng.lng;

    if (cookies.origin_data) {
      QUERY(
        {
          query: `mutation {
          updatePlace(
            input:{
              id:"${props.match.params.id}"
              address : "${streetName}"
              coordinates: "${stringLatLng}"
            }
          ){id address coordinates}
        }`,
        },
        cookies.origin_data
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (!data.errors) {
            togglePopupGoogleMap();
            refreshData();
          } else {
          }
        })
        .catch((err) => {
          console.log(err, "  *****************ERR");
        });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("uniqueCompanyType")) {
      localStorage.setItem("uniqueCompanyType", "");
    }
  }, []);

  const refreshData = () => {
    QUERY({
      query: `query {
      place (id:"${props.match.params.id}") {
        id name address description logo menu actions coordinates
        streams{url name id preview
          schedules{id day start_time end_time}
        }
        schedules {id day start_time end_time}
        categories {id name}
      }
  }`,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.errors) {
          setIsLoading(false);
          setDATA(data.data.place);
        } else {
          console.log(data.errors, " ERRORS");
        }
      })
      .catch((err) => {
        console.log(err, "  *****************ERR");
      });
  };

  const setAsDayOf = () => {
    if (cookies.origin_data) {
      QUERY(
        {
          query: `mutation {
            deleteSchedule(
              id:"${clickedTime.id}"
            ){id day start_time end_time}
          }`,
        },
        cookies.origin_data
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (!data.errors) {
            refreshData();
            console.log(data, " ??????????????????");
          } else {
            console.log(data.errors, " ERRORS");
          }
        })
        .catch((err) => {
          console.log(err, "  *****************ERR");
        });
    }
  };

  const updateStream = (name) => {
    if (cookies.origin_data) {
      QUERY(
        {
          query: `mutation {
            updateStream (
              input:{
                id:"${DATA.streams[0].id}"
                url :"https://partycamera.org/${name}/index.m3u8"
                preview : "http://partycamera.org:80/${name}/preview.mp4"
              }
            ) {
              id name url
              }
          }`,
        },
        cookies.origin_data
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.errors) {
            refreshData();
            console.log(data, "FETCH data");
          } else {
            console.log(data.errors, " ERRORS");
          }
        })
        .catch((err) => console.log(err, "  *******ERR"));
    }
  };
  //https://partycamera.org/klever/index.m3u8
  // http://partycamera.org:80/maxshow/preview.mp4
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
          if (!data.errors) {
            refreshData();
            console.log(data, "FETCH data");
          } else {
            console.log(data.errors, " ERRORS");
          }
        })
        .catch((err) => console.log(err, "  *******ERR"));
    }
  };

  const setStreamTimeOfOneDay = () => {
    if (cookies.origin_data) {
      if (DATA.streams[0] && !isEmptyTime) {
        // не пустое время стрима и стрим уже существет
        QUERY(
          {
            query: `mutation {
              updateStream (
                input:{
                  id:"${DATA.streams[0].id}"
                  schedules:{
                    update:[
                       {
                        id: ${clickedTime.id}
                        start_time: "${startTimePicker}"
                        end_time: "${endTimePicker}"
                      }
                    ]
                  }
                }
              ) {
                id name url
                }
            }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.errors) {
              refreshData();
              console.log(data, "FETCH data");
            } else {
              console.log(data.errors, " ERRORS");
            }
          })
          .catch((err) => console.log(err, "  *******ERR"));
      }
      if (DATA.streams[0] && isEmptyTime) {
        // пустое время стрима и стрим уже существет
        QUERY(
          {
            query: `mutation {
              updateStream (
                input:{
                  id:"${DATA.streams[0].id}"
                  schedules:{
                    create:[
                       {
                        day: ${enumWeekName}
                        start_time: "${startTimePicker}"
                        end_time: "${endTimePicker}"
                      }
                    ]
                  }
                }
              ) {
                id name url
                }
            }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.errors) {
              refreshData();
              console.log(data, "FETCH data");
            } else {
              console.log(data.errors, " ERRORS");
            }
          })
          .catch((err) => console.log(err, "  *******ERR"));
      }
    }
  };
  const setWorkTimeOfOneDay = () => {
    if (cookies.origin_data) {
      if (isEmptyTime) {
        //СОЗДАТЬ время работы заведения
        QUERY(
          {
            query: `mutation {
              updatePlace(
                input:{
                  id:"${props.match.params.id}"
                  schedules:{
                    create:{
                      day: ${enumWeekName} start_time: "${startTimePicker}" end_time: "${endTimePicker}"
                    }
                  }
                }
              ){id}
            }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.errors) {
              refreshData();
            } else {
              console.log(data.errors, " ERRORS");
            }
          })
          .catch((err) => console.log(err, "  *******ERR"));
      }

      if (!isEmptyTime) {
        //ИЗМЕНИТЬ время работы заведения
        QUERY(
          {
            query: `mutation {
          updateSchedule(
            input:{
              id:"${clickedTime.id}" start_time: "${startTimePicker}" end_time: "${endTimePicker}"
            }
          ){id}
        }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.errors) {
              refreshData();
            } else {
              console.log(data.errors, " ERRORS");
            }
          })
          .catch((err) => console.log(err, "  *******ERR"));
      }
    }
  };

  useEffect(() => {
    if (cookies.origin_data) {
      refreshData();
    }
  }, []);

  const hideSideMenu = () => {
    setShowSlideSideMenu(false);
    document.body.style.overflow = "visible";
    setIsShowMenu(false);
  };

  const showSideMenu = () => {
    setShowSlideSideMenu(true);
    document.body.style.overflow = "hidden";
    setIsShowMenu(true);
  };

  window.onresize = function (e) {
    hideSideMenu();
  };

  const accordionHandler = (e) => {
    if (e.target.nextSibling.style.maxHeight) {
      e.target.nextSibling.style.maxHeight = null;
      e.target.firstElementChild.style.transform = "rotate(0deg)";
    } else {
      e.target.nextSibling.style.maxHeight =
        e.target.nextSibling.scrollHeight + "px";
      e.target.firstElementChild.style.transform = "rotate(180deg)";
    }
  };

  const togglePopupDatePicker = () => {
    showPopupDatePicker
      ? setShowPopapDatePicker(false)
      : setShowPopapDatePicker(true);
  };

  const togglePopupGoogleMap = () => {
    showPopupGoogleMap
      ? setShowPopapGoogleMap(false)
      : setShowPopapGoogleMap(true);
  };

  useEffect(() => {
    if (showPopupDatePicker || showPopupGoogleMap) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showPopupDatePicker, showPopupGoogleMap]);

  const setStartTime = (h, m) => {
    setStartTimePicker("" + h + ":" + m);
  };
  const setEndTime = (h, m) => {
    setEndTimePicker("" + h + ":" + m);
  };

  const selectFile = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = (e) => {
    if (selectedFile) {
      const fd = new FormData();
      fd.append("image", selectedFile, selectedFile.name);
      console.log(selectedFile, "---selecteedFile");
      console.log(fd, "---------======= fd");
    }
  };

  const SetNewTimeObject = (data) => {
    const timeObject = {};
    EN_SHORT_DAY_OF_WEEK.forEach((e, i) => {
      data.forEach((el, ind) => {
        if (!timeObject[e.day]) {
          timeObject[e.day] = "Пусто";
        }
        if (el.day) {
          timeObject[el.day] = el;
        }
      });
    });
    return timeObject;
  };

  if (!Number(cookies.origin_id)) {
    return <Redirect to="/login" />;
  } else {
    return (
      <div
        onClick={(e) => {
          if (e.target.className !== "SlideSideMenu" && showSlideSideMenu) {
            hideSideMenu();
          }
        }}
      >
        <div
          className="Admin"
          style={
            isShowMenu
              ? {
                  animation: "toLeft 0.3s ease",
                  position: "relative",
                  right: "200px",
                }
              : {
                  animation: "toRight 0.3s ease",
                  position: "relative",
                }
          }
          onClick={(e) => {
            if (e.target.className !== "SlideSideMenu" && showSlideSideMenu) {
              hideSideMenu();
            }
          }}
        >
          <Header
            logo
            burger
            arrow
            toSlideFixedHeader={isShowMenu}
            showSlideSideMenu={showSlideSideMenu}
            showSideMenu={showSideMenu}
          />
          {isLoading && <Loader />}
          {!isLoading && (
            <div className="adminContent">
              {!!DATA.streams && DATA.streams[0] && (
                <ReactHLS
                  url={DATA.streams[0].url}
                  controls={true}
                  hlsConfig={{}}
                  videoProps={{
                    autoPlay: true,
                    crossOrigin: "anonymous",
                    preload: "metadata",
                  }}
                />
              )}
              <div className="adminMenuContainer">
                <div className="menuBlockWrap profile">
                  <div
                    className="menuBlock"
                    onClick={(e) => {
                      accordionHandler(e);
                    }}
                  >
                    Профиль заведения
                    <span className="rotateArrow"></span>
                  </div>
                  <div className="drDownWrap">
                    <div className="uploadFileContainer">
                      <h3>Загрузка изображения профиля</h3>
                      <div className="uploadFile">
                        <input
                          type="file"
                          ref={fileInput}
                          style={{ display: "none" }}
                          onChange={selectFile}
                        />
                        <div
                          className="pickFileBtn"
                          onClick={() => {
                            fileInput.current.click();
                          }}
                        >
                          <p className="chooseImg"> Выбрать изображение</p>
                        </div>

                        <div className="uploadFileBtn" onClick={uploadFile}>
                          Загрузить
                        </div>
                      </div>
                      <p className="fileName">
                        Название:{" "}
                        {selectedFile
                          ? selectedFile.name
                          : "Изображение отсутствует "}
                      </p>
                    </div>
                    <div className="pickAddress">
                      <h3>Выбрать адрес заведения</h3>
                      <p className="curAddress">
                        {DATA.address || "Адрес не задан"}
                      </p>
                      <p
                        onClick={() => {
                          togglePopupGoogleMap();
                        }}
                        className="chooseAddressBtn"
                      >
                        Выбрать адрес
                      </p>
                    </div>
                  </div>
                </div>
                <div className="menuBlockWrap workSchedule">
                  <div
                    className="menuBlock"
                    onClick={(e) => {
                      accordionHandler(e);
                    }}
                  >
                    График работы
                    <span className="rotateArrow"></span>
                  </div>
                  <div className="drDownWrap">
                    <table>
                      <tbody>
                        {DATA.schedules &&
                          EN_SHORT_DAY_OF_WEEK.map((el, i) => {
                            const oneDay = SetNewTimeObject(DATA.schedules)[
                              el.day
                            ];
                            return (
                              <tr key={i}>
                                <td>{el.day}</td>
                                <td
                                  onClick={() => {
                                    if (oneDay && oneDay.id) {
                                      setIsEmptyTime(false); //не пустое время
                                      setEnumWeekName(""); //день недели для отправки запроса
                                      setStartRealTimeInPicker(
                                        oneDay.start_time
                                      );
                                      setEndRealTimeInPicker(oneDay.end_time);
                                      togglePopupDatePicker();
                                      setClickedTime(oneDay); //объект для отправки запроса
                                      setIsSetWorkTimeDPick(true);
                                    } else {
                                      setIsEmptyTime(true);
                                      setEnumWeekName(el.day);
                                      setStartRealTimeInPicker("00:00");
                                      setEndRealTimeInPicker("00:00");
                                      togglePopupDatePicker();
                                      setIsSetWorkTimeDPick(true);
                                    }
                                  }}
                                >
                                  {oneDay && oneDay.id
                                    ? oneDay.start_time +
                                      " - " +
                                      oneDay.end_time
                                    : "Выходной"}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="menuBlockWrap streamSchedule">
                  <div
                    className="menuBlock"
                    onClick={(e) => {
                      accordionHandler(e);
                    }}
                  >
                    График трансляций
                    <span className="rotateArrow"></span>
                  </div>
                  <div className="drDownWrap">
                    <div className="chooseStreamAddress">
                      <input
                        className="streamAddress"
                        placeholder={
                          (DATA.streams &&
                            DATA.streams[0] &&
                            DATA.streams[0].url &&
                            DATA.streams[0].url) ||
                          "Введите адрес стрима"
                        }
                        value={streamAddressData}
                        onInput={(e) => {
                          setStreamAddressData(e.target.value);
                        }}
                      />
                      <div
                        onClick={() => {
                          if (streamAddressData) {
                            if (!DATA.streams[0]) {
                              createStream(streamAddressData);
                            } else {
                              updateStream(streamAddressData);
                            }
                          } else {
                            alert("Заполните поле");
                          }
                        }}
                      >
                        Сохранить
                      </div>
                    </div>
                    <table>
                      <tbody>
                        {DATA.streams &&
                          EN_SHORT_DAY_OF_WEEK.map((el, i) => {
                            const oneDay = SetNewTimeObject(
                              DATA.streams[0] ? DATA.streams[0].schedules : []
                            )[el.day];
                            return (
                              <tr key={i}>
                                <td>{el.day}</td>
                                <td
                                  onClick={() => {
                                    if (!DATA.streams[0]) {
                                      alert("Стрим еще не создан");
                                    } else {
                                      if (oneDay && oneDay.id) {
                                        setIsEmptyTime(false); //не пустое время
                                        setEnumWeekName("");
                                        setStartRealTimeInPicker(
                                          oneDay.start_time
                                        );
                                        setEndRealTimeInPicker(oneDay.end_time);
                                        togglePopupDatePicker();
                                        setClickedTime(oneDay);
                                        setIsSetWorkTimeDPick(false);
                                      } else {
                                        setIsEmptyTime(true); //пустое время
                                        setEnumWeekName(el.day);
                                        setStartRealTimeInPicker("00:00");
                                        setEndRealTimeInPicker("00:00");
                                        togglePopupDatePicker();
                                        setIsSetWorkTimeDPick(false);
                                      }
                                    }
                                  }}
                                >
                                  {oneDay && oneDay.id
                                    ? oneDay.start_time +
                                      " - " +
                                      oneDay.end_time
                                    : "Выходной"}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="menuBlockWrap address">
                  <div
                    className="menuBlock"
                    onClick={(e) => {
                      accordionHandler(e);
                    }}
                  >
                    Адрес заведения
                    <span className="rotateArrow"></span>
                  </div>
                  <div className="drDownWrap">В разработке</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <BottomMenu
          style={{ borderTop: "1px solid #ECECEC" }}
          toSlideFixedBottomMenu={isShowMenu}
        />
        <SlideSideMenu isShowMenu={isShowMenu} />
        {showPopupDatePicker && (
          <Popup
            togglePopup={togglePopupDatePicker}
            wrpaStyle={{ alignItems: "flex-end" }}
          >
            <div className="popupWrapper">
              <span
                className="closePopupBtn"
                onClick={togglePopupDatePicker}
              ></span>
              <div className="TimePickerContainer">
                <TimePicker
                  realTimeInPicker={startRealTimeInPicker}
                  timePickerName="!!!!"
                  setTime={setStartTime}
                />
                <span className="space"></span>

                <TimePicker
                  realTimeInPicker={endRealTimeInPicker}
                  timePickerName="!!!!"
                  setTime={setEndTime}
                />
              </div>
              <p
                className="makeAsDayOff"
                onClick={() => {
                  setAsDayOf();
                  togglePopupDatePicker();
                }}
              >
                Сделать выходным
              </p>
              <div
                className="saveBtn"
                onClick={() => {
                  togglePopupDatePicker();
                  isSetWorkTimeDPick && setWorkTimeOfOneDay();
                  !isSetWorkTimeDPick && setStreamTimeOfOneDay();
                }}
              >
                Сохранить
              </div>
            </div>
          </Popup>
        )}
        {showPopupGoogleMap && (
          <Popup
            togglePopup={togglePopupGoogleMap}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <GoogleMap
              initialCenterMap={
                DATA.coordinates
                  ? {
                      lat: Number(DATA.coordinates.split(",")[0]),
                      lng: Number(DATA.coordinates.split(",")[1]),
                    }
                  : null
              }
              togglePopupGoogleMap={togglePopupGoogleMap}
              chooseNewAddress={chooseNewAddress}
              isNewAddress
            />
          </Popup>
        )}
      </div>
    );
  }
};

export default Admin;
