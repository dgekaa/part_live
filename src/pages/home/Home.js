import React, { useState, useEffect, useContext } from "react";

import CompanyNav from "../../components/companyNav/CompanyNav";
import TypeNav from "../../components/typeNav/TypeNav";
import SmallCompanyBlock from "../../components/smallCompanyBlock/SmallCompanyBlock";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Header from "../../components/header/Header";
import Loader from "../../components/loader/Loader";

import "./home.css";

import QUERY from "../../query";

const Home = props => {
  const [DATA, setDATA] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    QUERY({
      query: `query {
        places {
          id name address description logo menu actions coordinates
          streams{url name id preview
            schedules{id day start_time end_time}
          }
          schedules {id day start_time end_time}
          categories {id name}
        }
      }`
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setIsLoading(false);
        setCompanyData(data.data.places);
        setDATA(data.data.places);
      })
      .catch(err => {
        console.log(err, "  ERR");
      });
  }, []);

  const clickedType = type => {
    if (type) {
      const filteredData = DATA.filter(
        el => el.categories[0].name.toUpperCase() === type.toUpperCase()
      );
      setCompanyData(filteredData);
    } else {
      setCompanyData(DATA);
    }
  };

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

  return (
    <div
      onClick={e => {
        if (e.target.className !== "SlideSideMenu" && showSlideSideMenu) {
          hideSideMenu();
        }
      }}
      style={
        isShowMenu
          ? {
              animation: "toLeft 0.3s ease",
              position: "relative",
              right: "200px"
            }
          : {
              animation: "toRight 0.3s ease",
              position: "relative"
            }
      }
    >
      <div>
        <Header
          logo
          burger
          toSlideFixedHeader={isShowMenu}
          showSlideSideMenu={showSlideSideMenu}
          showSideMenu={showSideMenu}
        />
        <div className="homeContentWrap">
          <div className="navContainer">
            <CompanyNav
              currentPage="/home"
              toSlideFixedNav={isShowMenu}
              clickedType={type => {
                clickedType(type);
              }}
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
        </div>

        <BottomMenu toSlideFixedBottomMenu={isShowMenu} />
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
