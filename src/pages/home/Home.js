import React, { useState, useEffect, useCallback } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import debounce from "lodash/debounce";

import CompanyNav from "../../components/companyNav/CompanyNav";
import TypeNav from "../../components/typeNav/TypeNav";
import SmallCompanyBlock from "../../components/smallCompanyBlock/SmallCompanyBlock";
import ClearedBlock from "../../components/smallCompanyBlock/ClearedBlock";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import QUERY from "../../query";

const HomeContentWrap = styled.div`
    padding-top: 50px;
    width: 1000px;
    margin: 0 auto;
    padding-bottom: 70px;

    @media (max-width: 760px) {
      position: relative;
      padding-top: 100px;
      width: 100%;
      padding-bottom: 65px;
    }
  `,
  NavContainer = styled.div`
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    height: 54px;
    @media (max-width: 760px) {
      height: 0;
      margin: 0;
    }
  `,
  HomeContent = styled.div`
    margin-top: 50px;
    display: flex;
    flex-wrap: wrap;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    @media (max-width: 760px) {
      -webkit-transition: 0.3s ease all 0.2s;
      -o-transition: 0.3s ease all 0.2s;
      transition: 0.3s ease all 0.2s;
      margin-top: 10px;
      margin-right: 5px;
      margin-left: 5px;
    }
  `;

const Home = () => {
  const [DATA, setDATA] = useState([]),
    [isLocation, setIsLocation] = useState(false),
    [typeId, setTypeId] = useState(""),
    [hasMorePages, setHasMorePages] = useState(true),
    [lastItem, setLastItem] = useState(0),
    [total, setTotal] = useState(0),
    [howMachLoad, setHowMachLoad] = useState(12);

  const clickedType = (id) => {
    setTypeId(id);
    setHowMachLoad(12);
    setHasMorePages(true);
    if (typeId !== id) {
      id ? loadContent(id, 12) : loadContent("", 12);
    }
  };

  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false),
    [isShowMenu, setIsShowMenu] = useState(false);

  const hideSideMenu = () => {
      setShowSlideSideMenu(false);
      document.body.style.overflow = "visible";
      setIsShowMenu(false);
    },
    showSideMenu = () => {
      setShowSlideSideMenu(true);
      document.body.style.overflow = "hidden";
      setIsShowMenu(true);
    },
    findLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setIsLocation(true),
          (err) => setIsLocation(false)
        );
      } else {
        return setIsLocation(false);
      }
    },
    hide = (e) => {
      if (e.target.className !== "SlideSideMenu" && showSlideSideMenu)
        hideSideMenu();
    },
    loadContent = (id, isFirst) => {
      const searchString =
        id || sessionStorage.getItem("filter_id")
          ? `hasCategories: { AND: [{ column: ID, operator: EQ, value:${
              id || sessionStorage.getItem("filter_id")
            }}] }, first:${isFirst}`
          : `first:${isFirst}`;
      QUERY({
        query: `query {
          places(${searchString}) {
            paginatorInfo{hasMorePages lastItem total}
            data {
              id name address profile_image coordinates
              streams{ id preview see_you_tomorrow schedules{id day start_time end_time}}
              schedules {id day start_time end_time}
              categories {id name slug}
            }
          }
        }`,
      })
        .then((res) => res.json())
        .then((res) => {
          const { data, paginatorInfo } = res.data.places;
          setDATA(data);
          setTotal(paginatorInfo.total);
          setLastItem(paginatorInfo.lastItem);
          setHasMorePages(paginatorInfo.hasMorePages);
        })
        .catch((err) => console.log(err, "HOME data ERR"));
    };

  const loadContentDebounce = useCallback(debounce(loadContent, 200), []);

  useEffect(() => {
    window.onresize = (e) => hideSideMenu();
  });

  const SwipePageSpring = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 200 },
  });

  findLocation();

  const scrollHandler = (e) => {
    if (hasMorePages) {
      const { scrollHeight, scrollTop } = e.target.documentElement;
      if (scrollHeight - (scrollTop + window.innerHeight) < 400) {
        setHowMachLoad((prev) => (prev = prev + 12));
        sessionStorage.setItem("prevZoom", "");
        sessionStorage.setItem("prevCenter", "");
      } else {
      }
    }
  };

  useEffect(() => {
    loadContentDebounce("", howMachLoad, true);
    console.log(howMachLoad, "---howMachLoad");
  }, [howMachLoad]);

  useEffect(() => {
    console.log(lastItem, "---lastItem");
  }, [lastItem]);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => document.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <div
      style={{
        minHeight: 1 + window.innerHeight,
      }}
      onClick={(e) => hide(e)}
    >
      <div>
        <Header
          isShowMenu={isShowMenu}
          logo
          burger
          showSlideSideMenu={showSlideSideMenu}
          showSideMenu={showSideMenu}
        />
        <HomeContentWrap as={animated.div} style={SwipePageSpring}>
          <NavContainer>
            <CompanyNav
              currentPage="/"
              toSlideFixedNav={isShowMenu}
              clickedType={(id) => clickedType(id)}
            />
            <TypeNav />
          </NavContainer>
          <HomeContent>
            {!!DATA.length &&
              DATA.map((el, i) => (
                <SmallCompanyBlock item={el} key={i} isLocation={isLocation} />
              ))}

            {!!howMachLoad &&
              new Array(howMachLoad - lastItem)
                .fill(0)
                .map((el, i) => <ClearedBlock key={i} />)}
          </HomeContent>
        </HomeContentWrap>
        <BottomMenu isShowMenu={isShowMenu} border />
        <Footer />
      </div>
      <SlideSideMenu isShowMenu={isShowMenu} />
    </div>
  );
};

export default Home;
