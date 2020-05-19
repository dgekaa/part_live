import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import smoothscroll from "smoothscroll-polyfill";
import { useSpring, animated } from "react-spring";

import QUERY from "../../query";
import CustomImg from "../customImg/CustomImg";

import "./companyNav.css";

const CompanyNav = ({ style, clickedType, currentPage, toSlideFixedNav }) => {
  const [uniqueCompanyType, setUniqueCompanyType] = useState(
    localStorage.getItem("uniqueCompanyType")
      ? JSON.parse(localStorage.getItem("uniqueCompanyType"))
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
          localStorage.getItem("uniqueCompanyType")
            ? JSON.parse(localStorage.getItem("uniqueCompanyType"))
            : data.data.categories
        );
      })
      .catch((err) => console.log(err, "  ERR"));
  }, []);

  useEffect(() => {
    if (
      uniqueCompanyType &&
      uniqueCompanyType.length &&
      !localStorage.getItem("uniqueCompanyType")
    ) {
      localStorage.setItem(
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

  const firstScrollBtnToCenter = () => {
    if (localStorage.getItem("uniqueCompanyType")) {
      document.querySelectorAll(".companyNavBlock").forEach((el, i) => {
        console.log(el, "ELLLLL");
        // if (isClickedTypeBtn(el.innerText)) {
        const btnPositionToCenter =
          slideBtnMenu.current.offsetWidth / 2 -
          (el.offsetLeft -
            slideBtnMenu.current.scrollLeft +
            el.offsetWidth / 2);

        slideBtnMenu.current.scrollTo({
          left: slideBtnMenu.current.scrollLeft - btnPositionToCenter,
          behavior: "smooth",
        });
        // }
      });
    }
  };

  const isClickedAllBtn = () => {
    return !clickedTypeLocal && !localStorage.getItem("filter_type");
  };

  const isClickedTypeBtn = (name) => {
    return localStorage.getItem("filter_type") === name;
  };

  useEffect(() => {
    firstScrollBtnToCenter();
  }, []);

  const animateProps = useSpring({
    left: toSlideFixedNav ? -200 : 0,
    config: {
      duration: 200,
    },
  });

  return (
    <animated.div
      className="overflowClass"
      style={{
        ...style,
        ...animateProps,
      }}
    >
      <div
        className={"сompanyNav"}
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
        <div
          className={
            isClickedAllBtn() ? "activeBtn companyNavBlock" : "companyNavBlock"
          }
          style={isClickedAllBtn() ? { background: "#e32a6c" } : {}}
          onClick={(e) => {
            clickedType();
            setClickedTypeLocal();
            localStorage.setItem("filter_type", "");
          }}
        >
          <Link
            className={
              isClickedAllBtn()
                ? "activeBtnText companyNavLink"
                : "companyNavLink"
            }
            style={isClickedAllBtn() ? { color: "#fff" } : {}}
            to={currentPage}
          >
            <p className="allText">Все</p>
          </Link>
        </div>
        {uniqueCompanyType.map((el, i) => {
          const slideBtn = React.createRef();
          return (
            <div
              key={i}
              ref={slideBtn}
              className={
                isClickedTypeBtn(el.name)
                  ? "activeBtn companyNavBlock"
                  : "companyNavBlock"
              }
              style={isClickedTypeBtn(el.name) ? { background: "#e32a6c" } : {}}
              onClick={(e) => {
                clickedType(el.name);
                setClickedTypeLocal(el.name);
                localStorage.setItem("filter_type", el.name);
                scrollBtnToCenter(e);
              }}
              onMouseOver={() => setHoveredBtn(el.name)}
              onMouseOut={() => setHoveredBtn("")}
            >
              <Link
                className={
                  isClickedTypeBtn(el.name)
                    ? "activeBtnText companyNavLink"
                    : "companyNavLink"
                }
                style={isClickedTypeBtn(el.name) ? { color: "#fff" } : {}}
                to={currentPage}
              >
                {isClickedTypeBtn(el.name) ? (
                  <CustomImg
                    alt="Icon"
                    className="сompanyNavImg"
                    name={el.slug}
                    active
                    width="30"
                    height="30"
                  />
                ) : hoveredBtn === el.name ? (
                  <CustomImg
                    alt="Icon"
                    className="сompanyNavImg"
                    name={el.slug}
                    active
                    width="30"
                    height="30"
                  />
                ) : (
                  <CustomImg
                    alt="Icon"
                    className="сompanyNavImg"
                    name={el.slug}
                    width="30"
                    height="30"
                  />
                )}
                <p className="сompanyNavText">{el.name}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </animated.div>
  );
};

export default CompanyNav;
