import React, { useState, useEffect, useRef } from "react";
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
  const [DATA, setDATA] = useState([]),
    [companyData, setCompanyData] = useState([]),
    [isLoading, setIsLoading] = useState(true),
    [isLocation, setIsLocation] = useState(false),
    [fetching, setFetching] = useState(true),
    [first, setFirst] = useState(12);

  const clickedType = (type) => {
    if (type) {
      // нажатие на не все
      const filteredData = DATA.filter((el) => {
        if (el.categories && el.categories[0]) {
          return el.categories[0].name.toUpperCase() === type.toUpperCase();
        }
      });
      setCompanyData(filteredData);
    } else {
      // нажатие на  все
      setCompanyData(DATA);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("filter_type") && !isLoading && DATA.length) {
      const filterName = sessionStorage.getItem("filter_type");
      clickedType(filterName);
    }
  }, [DATA]);

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
    const { scrollHeight, scrollTop } = e.target.documentElement;
    if (scrollHeight - (scrollTop + window.innerHeight) < 150)
      setFetching(true);
  };

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return () => document.removeEventListener("scroll", scrollHandler);
  }, []);

  useEffect(() => {
    if (fetching) {
      setIsLoading(true);
      QUERY({
        query: `query {
          places(first:${first}) {
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
          setCompanyData(data.data.places.data);
          setDATA(data.data.places.data);
          setFirst((prev) => (prev += 12));
          setFetching(false);
        })
        .catch((err) => console.log(err, "HOME DATA ERR"));

      sessionStorage.setItem("prevZoom", "");
      sessionStorage.setItem("prevCenter", "");
    }
  }, [fetching]);

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
              clickedType={(type) => clickedType(type)}
            />
            <TypeNav />
          </NavContainer>
          <HomeContent>
            {!!companyData.length &&
              companyData.map((el, i) => {
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
            {!companyData.length && isLoading && <Loader />}
            {fetching && <Loader />}
            {!companyData.length && !isLoading && (
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
