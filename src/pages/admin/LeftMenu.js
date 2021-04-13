import React from "react";
import { defaultColor } from "../../constants";
import styled from "styled-components";

import CustomImg from "../../components/customImg/CustomImg";

const LeftAdminBtnD = styled.li`
    font-size: 13px;
    font-weight: 800;
    height: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: ${({ clicked }) => (clicked ? defaultColor : "#000")};
    letter-spacing: 1px;
    &:hover {
      color: ${defaultColor};
    }
  `,
  AdminImgWrapD = styled.div`
    width: 30px;
    height: 30px;
    margin-right: 16px;
  `;

const LeftMenu = ({ el, setLeftMenuSettings, id }) => {
  const click = () => {
    setLeftMenuSettings((prev) => {
      let newArr = [...prev];
      newArr.forEach((el) => (el.clicked = false));
      newArr[id] = {
        ...newArr[id],
        clicked: true,
      };
      return newArr;
    });
  };

  return (
    <LeftAdminBtnD clicked={el.clicked} key={id} onClick={() => click()}>
      {el.img && (
        <AdminImgWrapD>
          <CustomImg className={el.class} alt={el.altImg} name={el.img} />
        </AdminImgWrapD>
      )}
      {el.name}
    </LeftAdminBtnD>
  );
};

export default LeftMenu;
