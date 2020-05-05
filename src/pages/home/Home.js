import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

import CompanyNav from "../../components/companyNav/CompanyNav";
import TypeNav from "../../components/typeNav/TypeNav";
import SmallCompanyBlock from "../../components/smallCompanyBlock/SmallCompanyBlock";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Header from "../../components/header/Header";
import Loader from "../../components/loader/Loader";
import QUERY from "../../query";

import "./home.css";

const Home = () => {
  const [DATA, setDATA] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    QUERY({
      query: `query {
        places {
          id name address description logo menu actions coordinates
          streams{url name id preview schedules{id day start_time end_time}}
          schedules {id day start_time end_time}
          categories {id name}
        }
      }`,
    })
      .then((res) => res.json())
      .then((data) => {
        const left = [],
          middle = [],
          right = [];
        data.data.places.forEach((el, i) => {
          if (el.streams && el.streams[0] && el.streams[0].url) {
            fetch(el.streams[0].url)
              .then((res) => {
                if (res.ok) {
                  left.push(el);
                } else {
                  middle.push(el);
                }
                setIsLoading(false);

                setCompanyData([...left, ...middle, ...right]);
                setDATA([...left, ...middle, ...right]);
              })
              .catch((err) => console.log(err, "video status err"));
          } else {
            right.push(el);
          }
        });
      })
      .catch((err) => console.log(err, "HOME DATA ERR"));
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
    if (localStorage.getItem("filter_type") && !isLoading && DATA.length) {
      const filterName = localStorage.getItem("filter_type");
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

  const animateProps = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 100 },
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
        <animated.div className="homeContentWrap" style={animateProps}>
          <div className="navContainer">
            <CompanyNav
              currentPage="/home"
              toSlideFixedNav={isShowMenu}
              clickedType={(type) => clickedType(type)}
            />
            <TypeNav />
          </div>
          <div className="homeContent">
            {!!companyData.length &&
              companyData.map((el, i) => (
                <SmallCompanyBlock item={el} key={i} />
              ))}
            {!companyData.length && isLoading && <Loader />}
            {!companyData.length && !isLoading && (
              <div className="noOneCompany">Нет заведений</div>
            )}
          </div>
        </animated.div>

        <BottomMenu isShowMenu={isShowMenu} />
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
