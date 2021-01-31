import React from "react";
import { defaultColor } from "../../constants";
import styled from "styled-components";

import QUERY from "../../query";

import Popup from "../../components/popup/Popup";
import { useCookies } from "react-cookie";

const AdminMenuTitleM = styled.p`
    text-align: center;
    padding-top: 20px;
    padding-bottom: 10px;
    font-weight: bold;
    font-size: 18px;
    text-transform: uppercase;
  `,
  Header = styled.div`
    display: flex;
    height: 44px;
    border-bottom: 1px solid #ececec;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
  `,
  CancelSave = styled.p`
    letter-spacing: 0.5px;
    color: defaultColor;
    font-weight: 500;
    font-size: 18px;
  `,
  CategoryBtn = styled.span`
    display: inline-block;
    height: 50px;
    width: 45%;
    border-radius: 5px;
    border: 2px solid #c4c4c4;
    cursor: pointer;
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    margin: 8px;
    &:hover {
      background-color: #f8104d;
      color: #fff;
    }
  `;

const ChooseTypePopup = ({
  togglePopupChooseType,
  DATA,
  setTypeOfCompany,
  setTypeOfCompanyId,
  props,
  typeOfCompanyId,
  refreshData,
  uniqueCompanyType,
  typeOfCompany,
  setHoveredBtn,
  renderCustomTypeImg,
  hoveredBtn,
}) => {
  const [cookies] = useCookies([]);

  const updateCategory = () => {
      if (cookies.origin_data) {
        QUERY(
          {
            query: `mutation {
            updatePlace(
              input:{
                id:"${props.match.params.id}"
                ${
                  DATA.categories &&
                  DATA.categories[0] &&
                  typeOfCompanyId &&
                  typeOfCompanyId !== DATA.categories[0].id
                    ? `categories:{
                    disconnect:"${DATA.categories[0].id}"
                    connect:"${typeOfCompanyId}"
                  }`
                    : typeOfCompanyId
                    ? `categories:{
                            connect:"${typeOfCompanyId}"
                          }`
                    : `categories:{}`
                }
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
      setTypeOfCompany(
        DATA.categories && DATA.categories[0] && DATA.categories[0].name
      );
      setTypeOfCompanyId(
        DATA.categories && DATA.categories[0] && DATA.categories[0].id
      );
      togglePopupChooseType();
    },
    save = () => {
      updateCategory();
      togglePopupChooseType();
    },
    btnClick = (el) => {
      setTypeOfCompany(el.name);
      setTypeOfCompanyId(el.id);
    },
    getBtnStyle = (el) => {
      return el && el.name && typeOfCompany && typeOfCompany === el.name
        ? {
            background: defaultColor,
            color: "#fff",
          }
        : !typeOfCompany &&
          DATA.categories &&
          DATA.categories[0] &&
          el &&
          el.name &&
          DATA.categories[0].name === el.name
        ? {
            background: defaultColor,
            color: "#fff",
          }
        : {};
    },
    getBtnImg = (el) => {
      return typeOfCompany && typeOfCompany === el.name
        ? renderCustomTypeImg(el.slug, true)
        : !typeOfCompany &&
          DATA.categories &&
          DATA.categories[0] &&
          DATA.categories[0].name === el.name
        ? renderCustomTypeImg(el.slug, true)
        : hoveredBtn === el.name
        ? renderCustomTypeImg(el.slug, true)
        : renderCustomTypeImg(el.slug, false);
    };

  return (
    <Popup
      togglePopup={togglePopupChooseType}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Header>
        <CancelSave onClick={() => cancel()}>Отмена</CancelSave>
        <CancelSave onClick={() => save()}>Готово</CancelSave>
      </Header>
      <AdminMenuTitleM>Тип заведения</AdminMenuTitleM>
      <div style={{ width: "100%" }}>
        {!!uniqueCompanyType &&
          uniqueCompanyType.map((el, i) => (
            <CategoryBtn
              key={i}
              style={getBtnStyle(el)}
              onClick={() => btnClick(el)}
              onMouseOver={() => setHoveredBtn(el.name)}
              onMouseOut={() => setHoveredBtn("")}
            >
              <span style={{ position: "relative", top: "10px" }}>
                {getBtnImg(el)}
              </span>
              <span style={{ position: "relative", top: "4px" }}>
                {el.name}
              </span>
            </CategoryBtn>
          ))}
      </div>
    </Popup>
  );
};

export default ChooseTypePopup;
