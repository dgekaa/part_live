import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Redirect, Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import Loader from "../../components/loader/Loader";
import QUERY from "../../query";

const GoBackBtnD = styled(Link)`
  font-size: 16px;
  display: block;
  font-weight: normal;
  height: 100px;
  width: 150px;
  line-height: 100px;
  &:hover {
    color: #e32a6c;
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

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
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
  text-transform: uppercase;
  padding: 0 10px;
  border-radius: 5px;
  height: 30px;
  background-color: #e32a6c;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 15px;
  font-weight: 500;
  margin-bottom: 40px;
  &:hover {
    opacity: 0.7;
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
  &:nth-child(1) {
    font-weight: 400;
    font-size: 18px;
  }
  &:nth-child(2) {
    font-weight: 400;
    font-size: 18px;
    color: #aeaeae;
  }
  &:nth-child(3) {
    font-weight: 500;
    font-size: 18px;
    color: #e32a6c;
  }
  @media (max-width: 760px) {
    display: flex;
    height: 50px;
    line-height: 45px;
    font-weight: 700;
    display: inline-block;
    &:nth-child(1) {
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
      display: flex;
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
  color: #e32a6c;
  transition: 0.3s ease color;
  font-weight: 500;
  &:hover {
    color: #000;
  }
`;

const NameLink = styled(Link)`
  display: block;
  width: 100%;
  transition: 0.3s ease color;
  &:hover {
    color: #e32a6c;
  }
`;

const EditCompany = () => {
  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [cookies] = useCookies([]);
  const [isLoading, setIsLoading] = useState(true);
  const [places, setPlaces] = useState([]);

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

  const refreshData = () => {
    QUERY({
      query: `query {
            places {id name  categories{name slug} streams{url preview}}
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
              address:"...",
              description: "введите описание",
              coordinates: "53.904241,27.556932"      
            }){id name address description coordinates}        
      }`,
      },
      cookies.origin_data
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          console.log(data.data.createPlace.id, "____ID____");
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

  if (!Number(cookies.origin_id)) {
    return <Redirect to="/login" />;
  } else if (Number(cookies.origin_id) !== 1) {
    return <Redirect to="/home" />;
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
            <GoBackBtnD to="/home">
              <GoBackBtnArrowD>&#8592;</GoBackBtnArrowD>
              На главную
            </GoBackBtnD>

            <HeaderRow>
              <HeaderText>СПИСОК ЗАВЕДЕНИЙ</HeaderText>
              <NewCompany
                onClick={() => {
                  createNewCompany();
                }}
              >
                Создать заведение
              </NewCompany>
            </HeaderRow>
            <Table>
              <tbody>
                {places &&
                  places.length &&
                  places.map(({ id, name, categories }) => {
                    return (
                      <Tr key={id}>
                        <TdDelete
                          onClick={() => {
                            var isDelete = window.confirm(
                              "Действительно удалить?"
                            );
                            isDelete && deleteCompany(id);
                          }}
                        >
                          &#215;
                        </TdDelete>
                        <Td>
                          <NameLink to={`/admin/${id}`}>{name}</NameLink>
                        </Td>
                        <Td>
                          {categories[0] &&
                            categories[0].slug &&
                            categories[0].slug.toLowerCase()}
                        </Td>
                        <Td>
                          {categories[0] &&
                            categories[0].name &&
                            categories[0].name.toLowerCase()}
                        </Td>
                      </Tr>
                    );
                  })}
              </tbody>
            </Table>
          </EditCompanyContent>
        )}
        {isLoading && <Loader />}
        <SlideSideMenu isShowMenu={isShowMenu} />
      </div>
    );
  }
};

export default EditCompany;
