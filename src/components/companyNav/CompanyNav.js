import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import QUERY from "../../query";

import "./companyNav.css";
import smoothscroll from "smoothscroll-polyfill";

const CompanyNav = ({ style, clickedType, currentPage, toSlideFixedNav }) => {
  const [uniqueCompanyType, setUniqueCompanyType] = useState([]);

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState();
  const [scrollLeft, setScrollLeft] = useState();
  const [clickedTypeLocal, setClickedTypeLocal] = useState();

  const slideBtnMenu = useRef(null);

  useEffect(() => {
    QUERY({
      query: `query {
        categories {
          id name slug
        }
      }`
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setUniqueCompanyType(data.data.categories);
      })
      .catch(err => {
        console.log(err, "  ERR");
      });
  }, []);

  const supportsTouch = "ontouchstart" in document.documentElement;
  smoothscroll.polyfill();

  const scrollBtnToCenter = e => {
    e.preventDefault();
    const btnPositionToCenter =
      slideBtnMenu.current.offsetWidth / 2 -
      (e.currentTarget.offsetLeft -
        slideBtnMenu.current.scrollLeft +
        e.currentTarget.offsetWidth / 2);

    slideBtnMenu.current.scrollTo({
      left: slideBtnMenu.current.scrollLeft - btnPositionToCenter,
      behavior: "smooth"
    });
  };

  return (
    <div
      className="overflowClass"
      style={
        ({
          ...style
        },
        toSlideFixedNav
          ? {
              animation: "toLeftFixed 0.3s ease",
              left: "-200px"
            }
          : {
              animation: "toRightFixed 0.3s ease",
              left: "0px"
            })
      }
    >
      <div
        className={"сompanyNav"}
        ref={slideBtnMenu}
        // //BROWSER ===========================================
        onMouseDown={e => {
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
        onMouseMove={e => {
          if (!supportsTouch) {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slideBtnMenu.current.offsetLeft;
            const walk = (x - startX) * 2;
            slideBtnMenu.current.scrollLeft = scrollLeft - walk;
          }
        }}
        //TOUCH =============================================
        // onTouchStart={e => {
        //   if (supportsTouch) {
        //     setIsDown(true);
        //     setStartX(
        //       Math.ceil(e.nativeEvent.touches[0].clientX) -
        //         slideBtnMenu.current.offsetLeft
        //     );
        //     setScrollLeft(slideBtnMenu.current.scrollLeft);
        //   }
        // }}
        // onTouchEnd={e => {
        //   if (supportsTouch) {
        //     setIsDown(false);
        //   }
        // }}
        // onTouchMove={e => {
        //   if (supportsTouch) {
        //     const x =
        //       e.nativeEvent.touches[0].clientX -
        //       slideBtnMenu.current.offsetLeft;
        //     const walk = (x - startX) * 2;
        //     slideBtnMenu.current.scrollLeft = scrollLeft - walk;
        //   }
        // }}
      >
        <div
          className={
            !clickedTypeLocal ? "activeBtn companyNavBlock" : "companyNavBlock"
          }
          style={!clickedTypeLocal ? { background: "#e32a6c" } : {}}
          onClick={e => {
            clickedType();
            setClickedTypeLocal();
          }}
        >
          <Link
            className={
              !clickedTypeLocal
                ? "activeBtnText companyNavLink"
                : "companyNavLink"
            }
            style={!clickedTypeLocal ? { color: "#fff" } : {}}
            to={currentPage}
          >
            <p className="allText">Все</p>
          </Link>
        </div>
        {uniqueCompanyType.map((el, i) => {
          const slideBtn = React.createRef();
          return (
            <div
              ref={slideBtn}
              className={
                clickedTypeLocal === el.name
                  ? "activeBtn companyNavBlock"
                  : "companyNavBlock"
              }
              style={
                clickedTypeLocal === el.name ? { background: "#e32a6c" } : {}
              }
              key={i}
              onClick={e => {
                clickedType(el.name);
                setClickedTypeLocal(el.name);
                scrollBtnToCenter(e);
              }}
            >
              <Link
                className={
                  clickedTypeLocal === el.name
                    ? "activeBtnText companyNavLink"
                    : "companyNavLink"
                }
                style={clickedTypeLocal === el.name ? { color: "#fff" } : {}}
                to={currentPage}
              >
                <img
                  alt="Icon"
                  className="сompanyNavImg"
                  src={`${process.env.PUBLIC_URL}/img/${el.slug}.png`}
                  width="30"
                  height="30"
                />
                <p className="сompanyNavText">{el.name}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyNav;
