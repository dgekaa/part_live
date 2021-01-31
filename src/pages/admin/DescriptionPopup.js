import React from "react";
import { useCookies } from "react-cookie";
import GoogleMap from "../../components/googleMap/GoogleMap";
import {
  EN_SHORT_DAY_OF_WEEK,
  EN_SHORT_TO_RU_SHORT,
  SHORT_DAY_OF_WEEK,
  defaultColor,
  queryPath,
} from "../../constants";
import styled from "styled-components";

import QUERY from "../../query";
import Popup from "../../components/popup/Popup";

const AdminMenuTitleM = styled.p`
    text-align: center;
    padding-top: 20px;
    padding-bottom: 10px;
    font-weight: bold;
    font-size: 18px;
    text-transform: uppercase;
  `,
  DescTextareaM = styled.textarea`
    outline: none;
    color: #4f4f4f;
    opacity: none;
    border: none;
    border-bottom: 1px solid #e5e5e5;
    box-sizing: border-box;
    line-height: 24px;
    padding: 5px;
    width: calc(100% - 30px);
    margin: 0 15px;
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    resize: none;
  `,
  DescLengthM = styled.p`
    font-weight: 500;
    color: ${(props) =>
      props.descOfCompany.length === props.descOfCompanyLimit
        ? "red"
        : "green"};
    width: 100%;
    font-size: 10px;
    text-align: right;
    padding-left: 10px;
    padding-right: 15px;
  `,
  Header = styled.div`
    display: flex;
    height: 44px;
    border-bottom: 1px solid #ececec;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
  `,
  Cancel = styled.p`
    display: flex;
    letter-spacing: 0.5px;
    color: defaultColor;
    font-size: 18px;
    font-weight: 500;
  `,
  Ready = styled.p`
    letter-spacing: 0.5px;
    color: defaultColor;
    font-size: 18px;
    font-weight: 500;
  `;

const DescriptionPopup = ({
  togglePopupDescription,
  DATA,
  setDescOfCompany,
  props,
  descOfCompany,
  refreshData,
  descOfCompanyLimit,
}) => {
  const [cookies] = useCookies([]);

  const updateDescription = () => {
      if (cookies.origin_data) {
        QUERY(
          {
            query: `mutation {
            updatePlace(
              input:{
                id:"${props.match.params.id}"
                description:"${descOfCompany || DATA.description}" 
              }
            ){id}
          }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            !data.errors ? refreshData() : console.log(data.errors, " ERRORS");
          })
          .catch((err) => console.log(err, "  *******ERR"));
      }
    },
    cancel = () => {
      togglePopupDescription();
      setDescOfCompany(DATA.description);
    },
    save = () => {
      updateDescription();
      togglePopupDescription();
    };

  return (
    <Popup
      togglePopup={togglePopupDescription}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Header>
        <Cancel onClick={() => cancel()}>Отмена</Cancel>
        <Ready onClick={() => save()}>Готово</Ready>
      </Header>
      <AdminMenuTitleM>Описание</AdminMenuTitleM>
      <DescTextareaM
        id="autoresizeTextarea"
        maxLength={descOfCompanyLimit}
        value={descOfCompany}
        onChange={(e) => setDescOfCompany(e.target.value)}
      />

      <DescLengthM
        descOfCompany={descOfCompany}
        descOfCompanyLimit={descOfCompanyLimit}
      >
        {descOfCompany.length} / {descOfCompanyLimit}
      </DescLengthM>
    </Popup>
  );
};

export default DescriptionPopup;
