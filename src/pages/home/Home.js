import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

import CompanyNav from "../../components/companyNav/CompanyNav";
import TypeNav from "../../components/typeNav/TypeNav";
import SmallCompanyBlock from "../../components/smallCompanyBlock/SmallCompanyBlock";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Header from "../../components/header/Header";
import Loader from "../../components/loader/Loader";
import QUERY from "../../query";

const HomeContentWrap = styled.div`
  padding-top: 50px;
  width: 1000px;
  margin: 0 auto;
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
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
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
  const [DATA, setDATA] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    QUERY({
      query: `query {
        places {
          id name mobile_stream address description profile_image logo menu actions coordinates disabled
          streams{url name id preview see_you_tomorrow schedules{id day start_time end_time}}
          schedules {id day start_time end_time}
          categories {id name slug}
        }
      }`,
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setCompanyData(data.data.places);
        setDATA(data.data.places);
      })
      .catch((err) => console.log(err, "HOME DATA ERR"));

    sessionStorage.setItem("prevZoom", "");
    sessionStorage.setItem("prevCenter", "");
  }, []);

  const clickedType = (type) => {
    if (type) {
      const filteredData = DATA.filter((el) => {
        if (el.categories && el.categories[0]) {
          return el.categories[0].name.toUpperCase() === type.toUpperCase();
        }
      });
      setCompanyData(filteredData);
    } else {
      setCompanyData(DATA);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("filter_type") && !isLoading && DATA.length) {
      const filterName = sessionStorage.getItem("filter_type");
      clickedType(filterName);
    }
  }, [DATA]);

  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
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
  useEffect(() => {
    window.onresize = function (e) {
      hideSideMenu();
    };
  });

  const SwipePageSpring = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 200 },
  });

  return (
    <div
      onClick={(e) => {
        if (e.target.className !== "SlideSideMenu" && showSlideSideMenu)
          hideSideMenu();
      }}
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
                  return <SmallCompanyBlock item={el} key={i} />;
                }
              })}
            {!companyData.length && isLoading && <Loader />}
            {!companyData.length && !isLoading && (
              <NoOneCompany>Нет заведений</NoOneCompany>
            )}
          </HomeContent>
        </HomeContentWrap>
        <BottomMenu isShowMenu={isShowMenu} border />
      </div>
      <SlideSideMenu isShowMenu={isShowMenu} />
    </div>
  );
};

export default Home;

// =================================================
// const [isLogin, setIsLogin] = useState(false);

// const requestBody = {
//   query: `
//     mutation {
//       login (input: {
//           username: "admin@example.com",
//           password: "password"
//       }) {
//         access_token
//         refresh_token
//         expires_in
//         token_type
//         user {
//           id
//           name
//           email
//         }
//       }
//   }`
// };
// useEffect(() => {
//   if (myContext.token) {
//     fetch("http://194.87.95.37/graphql", {
//       method: "POST",
//       body: JSON.stringify(requestBodyCreateNew),
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + myContext.token
//       }
//     })
//       .then(res => {
//         if (res.status !== 200 && res.status !== 201) {
//           throw new Error("Failed!!!");
//         }
//         return res.json();
//       })
//       .then(data => {
//         console.log(data, " DATA ------2");
//       })
//       .catch(err => {
//         console.log(err, "------------- ERRRRRRR");
//       });
//   } else {
//     console.log("ТОКЕНА НЕТ!!!!");
//   }
// }, []);

// ЭТО СОРТИРОВКА
// const getSecondsTime = (year, month, day, hours, minutes) => {
//   return Number(new Date(year, month, day, hours, minutes).getTime());
// };

// const current_time = new Date().getTime();
// const year = new Date().getFullYear(),
//   month = new Date().getMonth(),
//   day = new Date().getDate();

// const quickWorkTimeSort = object => {
//   if (object.length <= 1) {
//     return object;
//   } else {
//     const left = [],
//       right = [];

//     object.forEach((el, i) => {
//       const startTime =
//         +el.work_time[0].split(":")[0] * 3600 +
//         +el.work_time[0].split(":")[1] * 60;
//       let endTime =
//         +el.work_time[1].split(":")[0] * 3600 +
//         +el.work_time[1].split(":")[1] * 60;

//       // ПОШЕЛ СЛЕДУЮЩИЙ ДЕНЬ (найти подругому)
//       if (startTime > endTime) {
//         //ПОЛУЧЕНИЕ СЛЕДУЮЩЕГО ДНЯ В СЕКУНДАХ
//         const dayNow = new Date(year, month, day);
//         const nextDay = new Date(dayNow);
//         nextDay.setDate(dayNow.getDate() + 1);
//         const fullEndTomorrowTime = nextDay.getTime() + endTime; // ВРЕМЯ КОНЦА РАБОТЫ ЗАВТРАШНИМ ДНЕМ

//         if (
//           getSecondsTime(
//             year,
//             month,
//             day,
//             +el.work_time[0].split(":")[0],
//             +el.work_time[0].split(":")[1]
//           ) <= Number(current_time) &&
//           Number(fullEndTomorrowTime) > Number(current_time)
//         ) {
//           left.push(el);
//         } else {
//           right.push(el);
//         }
//       } else {
//         // ВСЕ ПРОИСХОДИТ В ОДИН ДЕНЬ
//         if (
//           getSecondsTime(
//             year,
//             month,
//             day,
//             +el.work_time[0].split(":")[0],
//             +el.work_time[0].split(":")[1]
//           ) <= Number(current_time) &&
//           getSecondsTime(
//             year,
//             month,
//             day,
//             +el.work_time[1].split(":")[0],
//             +el.work_time[1].split(":")[1]
//           ) > Number(current_time)
//         ) {
//           left.push(el);
//         } else {
//           right.push(el);
//         }
//       }
//     });
//     return [...left, ...right];
//   }
// };

// const quickStreemTimeSort = object => {
//   if (object.length <= 1) {
//     return object;
//   } else {
//     const left = [],
//       right = [];

//     object.forEach((el, i) => {
//       const startTime =
//         +el.streem_time[0].split(":")[0] * 3600 +
//         +el.streem_time[0].split(":")[1] * 60;
//       let endTime =
//         +el.streem_time[1].split(":")[0] * 3600 +
//         +el.streem_time[1].split(":")[1] * 60;

//       // ПОШЕЛ СЛЕДУЮЩИЙ ДЕНЬ (найти подругому)
//       if (startTime > endTime) {
//         //ПОЛУЧЕНИЕ СЛЕДУЮЩЕГО ДНЯ В СЕКУНДАХ
//         const dayNow = new Date(year, month, day);
//         const nextDay = new Date(dayNow);
//         nextDay.setDate(dayNow.getDate() + 1);
//         const fullEndTomorrowTime = nextDay.getTime() + endTime; // ВРЕМЯ КОНЦА РАБОТЫ ЗАВТРАШНИМ ДНЕМ

//         if (
//           getSecondsTime(
//             year,
//             month,
//             day,
//             +el.streem_time[0].split(":")[0],
//             +el.streem_time[0].split(":")[1]
//           ) <= Number(current_time) &&
//           Number(fullEndTomorrowTime) > Number(current_time)
//         ) {
//           left.push(el);
//         } else {
//           right.push(el);
//         }
//       } else {
//         // ВСЕ ПРОИСХОДИТ В ОДИН ДЕНЬ
//         if (
//           getSecondsTime(
//             year,
//             month,
//             day,
//             +el.streem_time[0].split(":")[0],
//             +el.streem_time[0].split(":")[1]
//           ) <= Number(current_time) &&
//           getSecondsTime(
//             year,
//             month,
//             day,
//             +el.streem_time[1].split(":")[0],
//             +el.streem_time[1].split(":")[1]
//           ) > Number(current_time)
//         ) {
//           left.push(el);
//         } else {
//           right.push(el);
//         }
//       }
//     });
//     return [...left, ...right];
//   }
// };
