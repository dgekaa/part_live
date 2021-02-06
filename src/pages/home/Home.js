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
import { has } from "object-path";

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
`;

const NavContainer = styled.div`
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
`;

const HomeContent = styled.div`
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

const NoOneCompany = styled.div`
  width: 100%;
  text-align: center;
  font-size: 22px;
  padding: 30px;
`;

const Home = () => {
  const howMachLoad = 12;

  const [DATA, setDATA] = useState([]),
    [isLoading, setIsLoading] = useState(true),
    [isLocation, setIsLocation] = useState(false),
    [first, setFirst] = useState(howMachLoad),
    [typeId, setTypeId] = useState(""),
    [hasMorePages, setHasMorePages] = useState(true);

  const clickedType = (id) => {
    setTypeId(id);
    setFirst(howMachLoad);
    setHasMorePages(true);
    if (typeId !== id) {
      id ? loadContent(id, howMachLoad) : loadContent("", howMachLoad);
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
            }}] }, first:${isFirst || first}`
          : `first:${isFirst || first}`;

      QUERY({
        query: `query {
          places(${searchString}) {
            paginatorInfo{hasMorePages}
            data {
              id name mobile_stream address description profile_image logo menu actions coordinates disabled
              streams{url name id preview see_you_tomorrow schedules{id day start_time end_time}}
              schedules {id day start_time end_time}
              categories {id name slug}
            }
          }
        }`,
      })
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false);
          setDATA(data.data.places.data);
          setFirst((prev) => (prev += howMachLoad));
          setHasMorePages(data.data.places.paginatorInfo.hasMorePages);
        })
        .catch((err) => console.log(err, "HOME DATA ERR"));
    };

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
      if (scrollHeight - (scrollTop + window.innerHeight) < 200) {
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
              DATA.map((el, i) => {
                if (!el.disabled) {
                  return (
                    <SmallCompanyBlock
                      item={el}
                      key={i}
                      isLocation={isLocation}
                    />
                  );
                }
              })}
            {isLoading && <Loader />}
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
