import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Redirect, Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import Loader from "../../components/loader/Loader";
import QUERY from "../../query";
import { defaultColor } from "../../constants";
import Popup from "../../components/popup/Popup";

const GoBackBtnD = styled(Link)`
  font-size: 16px;
  display: block;
  font-weight: normal;
  height: 100px;
  width: 150px;
  line-height: 100px;
  &:hover {
    color: ${defaultColor};
  }
  @media (max-width: 760px) {
    display: none;
  }
`;

const GoBackBtnArrowD = styled.span`
  font-size: 18px;
  padding-right: 5px;
`;

const EditCompanyContent = styled.div`
  width: 1000px;
  margin: 0 auto;
  @media (max-width: 760px) {
    width: 100vw;
    overflow: hidden;
    margin: 0;
    position: relative;
    display: block;
    padding-top: 60px;
  }
`;

const HeaderText = styled.h3`
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 40px;
  @media (max-width: 760px) {
    width: 100vw;
    padding: 5px;
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 15px;
    text-align: center;
  }
`;

const NewCompany = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${defaultColor};
  cursor: pointer;
  color: #fff;
  width: 240px;
  height: 40px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  margin-top: 20px;
  &:hover {
    opacity: 0.7;
  }
  @media (max-width: 760px) {
    margin: 20px auto;
  }
`;

const Table = styled.table`
  width: 80%;
  border-bottom: 1px solid #eaeaea;
  @media (max-width: 760px) {
    display: flex;
    flex: 1;
    width: 100vw;
  }
`;

const Tr = styled.tr`
  border-top: 1px solid #eaeaea;
  display: flex;
  @media (max-width: 760px) {
    display: flex;
    width: 100vw;
    border-bottom: 1px solid #eaeaea;
    padding: 0 15px;
  }
`;

const Td = styled.td`
  padding: 4px;
  display: flex;
  flex: 1;
  &:first-of-type {
    flex: 1.5;
  }
  &:nth-child(2) {
    font-weight: 400;
    font-size: 18px;
  }
  &:nth-child(3) {
    font-weight: 400;
    font-size: 18px;
    color: #aeaeae;
  }
  &:nth-child(4) {
    font-weight: 500;
    font-size: 18px;
    color: ${defaultColor};
  }
  @media (max-width: 760px) {
    display: flex;
    height: 50px;
    line-height: 45px;
    font-weight: 700;
    display: inline-block;
    &:nth-child(2) {
      white-space: nowrap;
      overflow: hidden;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      display: flex;
      flex: 2 !important;
    }

    &:nth-child(2) {
      display: flex;
      text-transform: capitalize;
      justify-content: center;
      font-weight: 700;
      flex: 1.3 !important;
    }

    &:nth-child(3) {
      display: none;
      justify-content: center;
      flex: 1.3 !important;
      font-weight: 700;
    }
  }
`;

const TdDelete = styled.td`
  width: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${defaultColor};
  transition: 0.3s ease color;
  font-weight: 400;
  font-size: 22px;
  &:hover {
    color: #000;
  }
`;

const TdDisable = styled(Td)`
  cursor: pointer;
  font-weight: 500;
  &:hover {
    opacity: 0.7;
  }
`;

const NameLink = styled(Link)`
  display: block;
  width: 100%;
  transition: 0.3s ease color;
  &:hover {
    color: ${defaultColor};
  }
`;

const PopupQuestion = styled.p`
  font-size: 18px;
  font-weight: 500;
  text-align: center;
`;

const PopupBtnsWrap = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const Yes = styled.div`
  display: flex;
  align-items: center;
  width: 120px;
  justify-content: center;
  height: 40px;
  border-radius: 5px;
  color: #fff;
  font-weight: 400;
  cursor: pointer;
  font-size: 16px;
  text-transform: uppercase;
  &:hover {
    opacity: 0.7;
  }

  background-color: ${defaultColor};
`;

const No = styled(Yes)`
  background-color: #fff;
  border: 2px solid ${defaultColor};
  color: #000;
`;

const EditCompany = () => {
  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [cookies] = useCookies([]);
  const [isLoading, setIsLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [showPopupIsDelete, setShowPopupIsDelete] = useState(false);
  const [clickedDeleteBtnName, setClickedDeleteBtnName] = useState("");
  const [clickedDeleteBtnId, setClickedDeleteBtnId] = useState("");

  const togglePopupIsDelete = () => {
    showPopupIsDelete
      ? setShowPopupIsDelete(false)
      : setShowPopupIsDelete(true);
  };

  const hideSideMenu = () => {
    setShowSlideSideMenu(false);
    document.body.style.overflow = "visible";
    setIsShowMenu(false);
  };

  useEffect(() => {
    if (showPopupIsDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showPopupIsDelete]);

  const showSideMenu = () => {
    setShowSlideSideMenu(true);
    document.body.style.overflow = "hidden";
    setIsShowMenu(true);
  };

  window.onresize = function (e) {
    hideSideMenu();
  };

  const refreshData = () => {
    QUERY({
      query: `query {
            places {id name alias disabled categories{name slug} streams{url preview}}
          }`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setIsLoading(false);
          setPlaces(data.data.places);
        } else {
          console.log(data.errors, "EDIT ERROR");
        }
      })
      .catch((err) => console.log(err, "EDIT ERROR"));
  };

  useEffect(() => {
    refreshData();

    sessionStorage.setItem("prevZoom", "");
    sessionStorage.setItem("prevCenter", "");
  }, []);

  const SwipePageSpring = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 200 },
  });

  const createNewCompany = () => {
    QUERY(
      {
        query: `mutation {
          createPlace(
            input:{
              name: "Стандартное название",
              address:"улица Ленина 8, Минск, Беларусь",
              description: "введите описание",
              coordinates: "53.9006799,27.5582599",
              alias:"pseudonim",
              categories:{
                connect: 2
              }    
            }){id name address description coordinates categories{slug}}        
      }`,
      },
      cookies.origin_data
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          console.log(data, "____ID____");
          refreshData();
          return <Redirect to={`/admin/${data.data.createPlace.id}`} />;
        } else {
          console.log(data.errors, "EDIT ERROR");
        }
      })
      .catch((err) => console.log(err, "EDIT ERROR"));
  };

  const deleteCompany = (id) => {
    QUERY(
      {
        query: `mutation {
          deletePlace(
             id:${id}
            ){id name}        
      }`,
      },
      cookies.origin_data
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          console.log(data, "____ID____");
          refreshData();
        } else {
          console.log(data.errors, "EDIT ERROR");
        }
      })
      .catch((err) => console.log(err, "EDIT ERROR"));
  };

  const toggleDisabled = (id, disabled) => {
    QUERY(
      {
        query: `mutation {
        updatePlace(
          input:{
            id:"${id}"            
            disabled : ${disabled ? false : true}
          }
        ){id disabled}
      }`,
      },
      cookies.origin_data
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          refreshData();
        } else {
        }
      })
      .catch((err) => {});
  };

  if (!Number(cookies.origin_id)) {
    return <Redirect to="/login" />;
  } else if (Number(cookies.origin_id) !== 1) {
    return <Redirect to="/" />;
  } else {
    return (
      <div
        onClick={(e) => {
          if (e.target.className !== "SlideSideMenu" && showSlideSideMenu)
            hideSideMenu();
        }}
      >
        <Header
          isShowMenu={isShowMenu}
          logo
          burger
          arrow
          showSlideSideMenu={showSlideSideMenu}
          showSideMenu={showSideMenu}
        />
        {!isLoading && (
          <EditCompanyContent as={animated.div} style={SwipePageSpring}>
            <GoBackBtnD to="/">
              <GoBackBtnArrowD>&#8592;</GoBackBtnArrowD>
              На главную
            </GoBackBtnD>

            <HeaderText>СПИСОК ЗАВЕДЕНИЙ</HeaderText>

            <Table>
              <tbody>
                {places &&
                  places.length &&
                  places.map(({ id, name, alias, categories, disabled }) => {
                    return (
                      <Tr key={id}>
                        <TdDelete
                          onClick={() => {
                            togglePopupIsDelete();
                            setClickedDeleteBtnName(name);
                            setClickedDeleteBtnId(id);
                          }}
                        >
                          &#215;
                        </TdDelete>
                        <Td>
                          <NameLink to={`/admin/${id}`}>{name}</NameLink>
                        </Td>
                        <Td>{alias && alias.toLowerCase()}</Td>
                        <Td>
                          {categories[0] &&
                            categories[0].name &&
                            categories[0].name.toLowerCase()}
                        </Td>

                        <TdDisable onClick={() => toggleDisabled(id, disabled)}>
                          {disabled ? "Выкл." : "Вкл."}
                        </TdDisable>
                      </Tr>
                    );
                  })}
              </tbody>
            </Table>
            <NewCompany onClick={() => createNewCompany()}>
              Создать заведение
            </NewCompany>
          </EditCompanyContent>
        )}
        {isLoading && <Loader />}
        <SlideSideMenu isShowMenu={isShowMenu} />
        {showPopupIsDelete && (
          <Popup
            togglePopup={togglePopupIsDelete}
            style={{ padding: "20px", borderRadius: "10px" }}
          >
            <PopupQuestion>{`Действительно хотите удалить  "${clickedDeleteBtnName}"?`}</PopupQuestion>
            <PopupBtnsWrap>
              <Yes
                onClick={() => {
                  deleteCompany(clickedDeleteBtnId);
                  setShowPopupIsDelete(false);
                }}
              >
                да
              </Yes>
              <No onClick={() => setShowPopupIsDelete(false)}>нет</No>
            </PopupBtnsWrap>
          </Popup>
        )}
      </div>
    );
  }
};

export default EditCompany;
