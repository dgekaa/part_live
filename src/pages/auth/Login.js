import React, { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import { useSpring, animated } from "react-spring";

import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import QUERY from "../../query";

import "./auth.css";

const Login = () => {
  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgetPass, setIsForgetPass] = useState(false);
  const [allValidationError, setAllValidationError] = useState("");

  const loginRef = useRef(null);
  const [cookies, setCookie, removeCookie] = useCookies([]);

  useEffect(() => {
    if (localStorage.getItem("uniqueCompanyType")) {
      localStorage.setItem("uniqueCompanyType", "");
    }
  }, []);

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

  window.onresize = function (e) {
    hideSideMenu();
  };

  const userLogin = (email, password) => {
    QUERY({
      query: `mutation {
        login (input: {username: "${email}", password: "${password}"}) 
        {access_token refresh_token expires_in token_type user {id name email}}
      }`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setCookie("origin_data", data.data.login.access_token);
          setCookie("origin_id", data.data.login.user.id);

          for (let i = 0; i < loginRef.current.children.length - 1; i++) {
            loginRef.current.children[i].style.boxShadow = "none";
          }

          setAllValidationError("");
          setIsLogin(data.data.login.user.id);
        } else {
          removeCookie("origin_data");
          removeCookie("origin_id");

          setAllValidationError("Неверный логин либо пароль");

          for (let i = 0; i < loginRef.current.children.length - 1; i++) {
            loginRef.current.children[i].style.boxShadow =
              "0 0 1px 1px rgb(255, 54, 54)";
          }
          setIsLogin(false);
          console.log(data.errors[0], "LOGIN ERR");
        }
      })
      .catch((err) => {
        removeCookie("origin_data");
        removeCookie("origin_id");

        setIsLogin(false);
        console.log(err, "LOGIN ERR");
      });
  };

  const animateProps = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 100 },
  });

  if (Number(isLogin) === 1 || Number(cookies.origin_id) === 1) {
    return <Redirect to="/editCompany" />;
  } else if (
    Number(isLogin) ||
    (Number(cookies.origin_id) && Number(cookies.origin_id) !== 1)
  ) {
    return "Обычный юзер";
  } else {
    return (
      <div className="loginWrapper">
        <Header
          isShowMenu={isShowMenu}
          logo
          burger
          showSlideSideMenu={showSlideSideMenu}
          showSideMenu={showSideMenu}
        />
        <animated.div
          className="Login"
          onClick={(e) => {
            if (e.target.className !== "SlideSideMenu" && showSlideSideMenu) {
              hideSideMenu();
            }
          }}
          style={animateProps}
        >
          <div className="authBlock">
            <h4>{!isForgetPass ? "АВТОРИЗАЦИЯ" : "ВОССТАНОВЛЕНИЕ ПАРОЛЯ"}</h4>
            <form
              // autocomplete="on"
              ref={loginRef}
              onSubmit={(e) => {
                e.preventDefault();
                !isForgetPass && userLogin(email, password);
              }}
            >
              <input
                autocomplete="username"
                type="text"
                name="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!isForgetPass && (
                <>
                  <input
                    autocomplete="current-password"
                    type="password"
                    name="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input type="submit" value="ВОЙТИ" />
                </>
              )}
              {isForgetPass && <p className="btnSubmit">ОТПРАВИТЬ</p>}
            </form>
            <p
              className="forgetPass"
              onClick={() => setIsForgetPass((prev) => !prev)}
            >
              {!isForgetPass ? "  Забыли пароль?" : " Уже есть аккаунт?"}
              <span className="errorField">
                {!isForgetPass && allValidationError}
              </span>
            </p>
          </div>
          <SlideSideMenu isShowMenu={isShowMenu} />
        </animated.div>
      </div>
    );
  }
};

export default Login;
