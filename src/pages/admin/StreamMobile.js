import React, { useState, useEffect } from "react";
import styled from "styled-components";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import Switch from "react-switch";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

import { defaultColor } from "../../constants";
import QUERY from "../../query";

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
`;

const StreamMobile = ({ closeAllSidebar, DATA, refreshData }) => {
  const [cookies] = useCookies([]);

  const [switchChecked, setSwitchChecked] = useState(null);

  const toNewDateFormat = (date) => {
    const dataArr = date.split("/");
    if (dataArr[0].length < 2) dataArr[0] = "0" + dataArr[0];
    const dataArrNew = [dataArr[2], dataArr[0], dataArr[1]],
      dataString = dataArrNew.join("-");

    return dataString;
  };

  const isStream = DATA.streams && DATA.streams[0];

  useEffect(() => {
    isStream &&
      isStream.see_you_tomorrow &&
      setSwitchChecked(
        isStream.see_you_tomorrow ===
          toNewDateFormat(new Date().toLocaleDateString())
      );
  }, [DATA.streams]);

  const disableStream = (data) => {
      if (cookies.origin_data && isStream) {
        QUERY(
          {
            query: `mutation {
            updateStream (
              input:{
                id:"${isStream.id}"
               ${
                 data
                   ? ` see_you_tomorrow: "${data}"`
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
            !data.errors
              ? refreshData()
              : console.log(data.errors, "disableStream ERRORS");
          })
          .catch((err) => console.log(err, "disableStream ERR"));
      }
    },
    save = () => {
      closeAllSidebar();
      disableStream(
        switchChecked ? toNewDateFormat(new Date().toLocaleDateString()) : null
      );
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
      {isStream && (
        <>
          <div className="videoWrapAdminMobile">
            <VideoPlayer preview={isStream.preview} src={isStream.url} />
          </div>
          <DisableStreamM>
            <div>
              <DisableStreamTextM>Отключить стрим</DisableStreamTextM>
              <DisableStreamToNexDayM>
                Выключить до следующего дня
              </DisableStreamToNexDayM>
            </div>
            <Switch
              onChange={setSwitchChecked}
              checked={switchChecked}
              onColor={defaultColor}
              offColor="#999"
              uncheckedIcon={false}
              checkedIcon={false}
            />
          </DisableStreamM>
        </>
      )}
    </Wrap>
  );
};

export default StreamMobile;
