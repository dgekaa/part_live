import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import smoothscroll from "smoothscroll-polyfill";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

import QUERY from "../../query";
import CustomImg from "../customImg/CustomImg";

import "./companyNav.css";

const CutScroll = styled.div`
  overflow: hidden;
  width: 100%;
  @media (max-width: 760px) {
    position: fixed;
    overflow: hidden;
    z-index: 2;
    top: 48px;
    width: 100%;
    height: 60px;
    background-color: #eef1f6;
    -webkit-overflow-scrolling: touch;
  }
`;

const CompanyNavStyle = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: calc(100% - 150px);
  @media (max-width: 760px) {
    overflow-x: scroll;
    overflow-y: hidden;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    white-space: nowrap;
    height: 80px;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    display: flex;
    align-items: center;
    &:active {
      cursor: grabbing;
    }
  }
  @media screen and (max-device-width: 760px) {
    padding-bottom: 17px;
  }
`;

const CompanyNavLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  @media (max-width: 760px) {
    &:active {
      cursor: grabbing;
    }
  }
`;

const CompanyNavBtn = styled.div`
  z-index: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  background-color: #fff;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-width: 110px;
  max-width: 150px;
  height: 54px;
  border: 2px solid #c4c4c4;
  cursor: pointer;
  border-right: none;
  transition: 0.2s ease all;
  &:hover {
    background-color: #e32a6c;
  }
  &:hover ${CompanyNavLink} {
    color: #fff;
  }
  &:last-of-type {
    border-right: 2px solid #c4c4c4;
    border-radius: 0 5px 5px 0;
  }
  &:first-of-type {
    border-radius: 5px 0 0 5px;
  }
  @media (max-width: 760px) {
    min-width: 75px;
    height: 30px;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 10px;
    margin-right: 0px;
    padding-bottom: 2px;
    margin-left: 10px;
    &:active {
      cursor: grabbing;
    }
    &:last-of-type {
      border-right: none;
      border-radius: 10px;
    }
    &:first-of-type {
      border-radius: 10px;
    }
  }
`;

const CustomImgStyle = styled(CustomImg)`
  margin-right: 7px;
  @media (max-width: 760px) {
    display: none;
  }
`;

const AllText = styled.p`
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  @media (max-width: 760px) {
    text-transform: none;
    font-style: normal;
    font-weight: 400 !important;
    font-size: 12px;
    letter-spacing: 0.05em;
    padding-top: 2px;
  }
`;

const CompNavText = styled.p`
  margin-top: 3px;
  font-size: 13px;
  font-weight: 700;
  line-height: 12px;
  text-transform: uppercase;
  @media (max-width: 760px) {
    text-transform: none;
    font-style: normal;
    font-weight: 400 !important;
    font-size: 12px;
    letter-spacing: 0.05em;
    &:active {
      cursor: grabbing;
    }
  }
`;

const CompanyNav = ({ style, clickedType, currentPage, toSlideFixedNav }) => {
  const [uniqueCompanyType, setUniqueCompanyType] = useState(
    sessionStorage.getItem("uniqueCompanyType")
      ? JSON.parse(sessionStorage.getItem("uniqueCompanyType"))
      : []
  );
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState();
  const [scrollLeft, setScrollLeft] = useState();
  const [clickedTypeLocal, setClickedTypeLocal] = useState();
  const [hoveredBtn, setHoveredBtn] = useState();

  const slideBtnMenu = useRef(null);

  const supportsTouch = "ontouchstart" in document.documentElement;
  smoothscroll.polyfill();

  useEffect(() => {
    QUERY({
      query: `query {categories {id name slug}}`,
    })
      .then((res) => res.json())
      .then((data) => {
        setUniqueCompanyType(
          sessionStorage.getItem("uniqueCompanyType")
            ? JSON.parse(sessionStorage.getItem("uniqueCompanyType"))
            : data.data.categories
        );
      })
      .catch((err) => console.log(err, "  ERR"));
  }, []);

  useEffect(() => {
    if (
      uniqueCompanyType &&
      uniqueCompanyType.length &&
      !sessionStorage.getItem("uniqueCompanyType")
    ) {
      sessionStorage.setItem(
        "uniqueCompanyType",
        JSON.stringify(uniqueCompanyType)
      );
    }
  }, [uniqueCompanyType]);

  const scrollBtnToCenter = (e) => {
    e && e.preventDefault();
    const btnPositionToCenter =
      slideBtnMenu.current.offsetWidth / 2 -
      (e.currentTarget.offsetLeft -
        slideBtnMenu.current.scrollLeft +
        e.currentTarget.offsetWidth / 2);

    slideBtnMenu.current.scrollTo({
      left: slideBtnMenu.current.scrollLeft - btnPositionToCenter,
      behavior: "smooth",
    });
  };

  const scrollAllBtnToCenter = () => {
    slideBtnMenu.current.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  };

  const firstScrollBtnToCenter = () => {
    if (sessionStorage.getItem("uniqueCompanyType")) {
      document.querySelectorAll(".companyNavBtn").forEach((el, i) => {
        if (isClickedTypeBtn(el.getAttribute("data-name"))) {
          const btnPositionToCenter =
            slideBtnMenu.current.offsetWidth / 2 -
            (el.offsetLeft -
              slideBtnMenu.current.scrollLeft +
              el.offsetWidth / 2);

          slideBtnMenu.current.scrollTo({
            left: slideBtnMenu.current.scrollLeft - btnPositionToCenter,
            // behavior: "smooth",
          });
        }
      });
    }
  };

  const isClickedAllBtn = () => {
    return !clickedTypeLocal && !sessionStorage.getItem("filter_type");
  };

  const isClickedTypeBtn = (name) => {
    if (sessionStorage.getItem("filter_type") === name) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    firstScrollBtnToCenter();
  }, []);

  const SwipeFixedElSpring = useSpring({
    left: toSlideFixedNav ? -200 : 0,
    config: {
      duration: 200,
    },
  });

  return (
    <CutScroll
      as={animated.div}
      style={{
        ...style,
        ...SwipeFixedElSpring,
      }}
    >
      <CompanyNavStyle
        ref={slideBtnMenu}
        onMouseDown={(e) => {
          if (!supportsTouch) {
            setIsDown(true);
            setStartX(e.pageX - slideBtnMenu.current.offsetLeft);
            setScrollLeft(slideBtnMenu.current.scrollLeft);
          }
        }}
        onMouseLeave={() => {
          if (!supportsTouch) {
            setIsDown(false);
          }
        }}
        onMouseUp={() => {
          if (!supportsTouch) {
            setIsDown(false);
          }
        }}
        onMouseMove={(e) => {
          if (!supportsTouch) {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slideBtnMenu.current.offsetLeft;
            const walk = (x - startX) * 2;
            slideBtnMenu.current.scrollLeft = scrollLeft - walk;
          }
        }}
      >
        <CompanyNavBtn
          className="companyNavBtn"
          style={isClickedAllBtn() ? { backgroundColor: "#e32a6c" } : {}}
          onClick={(e) => {
            clickedType();
            setClickedTypeLocal();
            sessionStorage.setItem("filter_type", "");
            scrollAllBtnToCenter();
          }}
        >
          <CompanyNavLink
            style={isClickedAllBtn() ? { color: "#fff" } : {}}
            to={currentPage}
          >
            <AllText>Все</AllText>
          </CompanyNavLink>
        </CompanyNavBtn>
        {uniqueCompanyType.map((el, i) => {
          const slideBtn = React.createRef();
          return (
            <CompanyNavBtn
              className="companyNavBtn"
              data-name={el.name}
              key={i}
              ref={slideBtn}
              style={isClickedTypeBtn(el.name) ? { background: "#e32a6c" } : {}}
              onClick={(e) => {
                clickedType(el.name);
                setClickedTypeLocal(el.name);
                sessionStorage.setItem("filter_type", el.name);
                scrollBtnToCenter(e);
              }}
              onMouseOver={() => setHoveredBtn(el.name)}
              onMouseOut={() => setHoveredBtn("")}
            >
              <CompanyNavLink
                style={
                  isClickedTypeBtn(el.name)
                    ? {
                        color: "#fff",
                        borderRadius: "10px",
                      }
                    : {}
                }
                to={currentPage}
              >
                {isClickedTypeBtn(el.name) ? (
                  <CustomImgStyle
                    alt="Icon"
                    name={el.slug}
                    active
                    width="30"
                    height="30"
                  />
                ) : hoveredBtn === el.name ? (
                  <CustomImgStyle
                    alt="Icon"
                    name={el.slug}
                    active
                    width="30"
                    height="30"
                  />
                ) : (
                  <CustomImgStyle
                    alt="Icon"
                    name={el.slug}
                    width="30"
                    height="30"
                  />
                )}
                <CompNavText>{el.name}</CompNavText>
              </CompanyNavLink>
            </CompanyNavBtn>
          );
        })}
      </CompanyNavStyle>
    </CutScroll>
  );
};

export default CompanyNav;
