import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

import CompanyNav from "../../components/companyNav/CompanyNav";
import TypeNav from "../../components/typeNav/TypeNav";
import SmallCompanyBlock from "../../components/smallCompanyBlock/SmallCompanyBlock";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import QUERY from "../../query";
import { PLACE_EXT_DATA_QUERY } from "../../constants";

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
  `,
  NoOneCompany = styled.div`
    width: 100%;
    text-align: center;
    font-size: 22px;
    padding: 30px;
  `;

const Home = () => {
  const howMachLoad = 48;

  const [DATA, setDATA] = useState([]),
    [isLoading, setIsLoading] = useState(true),
    [isLocation, setIsLocation] = useState(false),
    [first, setFirst] = useState(howMachLoad),
    [typeId, setTypeId] = useState(""),
    [hasMorePages, setHasMorePages] = useState(true);

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
      const current_id = id || sessionStorage.getItem("filter_id"),
        current_first = isFirst || first,
        searchString = current_id
          ? `where: { column: CATEGORY_IDS, operator: LIKE, value: "%[${current_id}]%"}, first:${current_first}`
          : `first:${current_first}`;
      setIsLoading(true);
      QUERY({
        query: `query {
          placesExt(${searchString}) { paginatorInfo{hasMorePages lastItem total} ${PLACE_EXT_DATA_QUERY} }
        }`,
      })
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false);
          setDATA(data.data.placesExt.data);
          setFirst((prev) => (prev += howMachLoad));
          setHasMorePages(data.data.placesExt.paginatorInfo.hasMorePages);
        })
        .catch((err) => console.log(err, "HOME DATA ERR"));
    },
    clickedType = (id) => {
      setDATA([]);
      window.scrollTo(0, 0);
      setTypeId(id);
      setFirst(howMachLoad);
      setHasMorePages(true);
      if (typeId !== id) {
        id ? loadContent(id, howMachLoad) : loadContent("", howMachLoad);
      }
    };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.onresize = (e) => hideSideMenu();
  });

  const SwipePageSpring = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 200 },
  });

  findLocation();

  const scrollHandler = (e) => {
    if (hasMorePages && !isLoading) {
      const { scrollHeight, scrollTop } = e.target.documentElement;
      if (scrollHeight - (scrollTop + window.innerHeight) < 3000) {
        setIsLoading(true);
      }
    }
  };

  useEffect(() => {
    if (isLoading && hasMorePages) {
      loadContent();
      sessionStorage.setItem("prevZoom", "");
      sessionStorage.setItem("prevCenter", "");
    }

    document.addEventListener("scroll", scrollHandler);
    return () => document.removeEventListener("scroll", scrollHandler);
  }, [hasMorePages, isLoading]);

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

            {isLoading && hasMorePages && <Loader isBottom={true} />}

            {!DATA.length && !isLoading && (
              <NoOneCompany>Нет заведений</NoOneCompany>
            )}
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
