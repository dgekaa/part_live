import React, { useState, useRef } from "react";
import { useCookies } from "react-cookie";

import { Redirect } from "react-router-dom";
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

  const userLogin = (email, password) => {
    QUERY({
      query: `mutation {
        login (input: {
            username: "${email}",
            password: "${password}"
        }) {access_token refresh_token expires_in token_type
          user {id name email}
        }
      }`
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (!data.errors) {
          console.log(data, " LOGIN");
          setCookie("origin_data", data.data.login.access_token);
          setCookie("origin_id", data.data.login.user.id);

          for (let i = 0; i < loginRef.current.children.length - 1; i++) {
            loginRef.current.children[i].style.boxShadow = "none";
          }

          setAllValidationError("");
          setIsLogin(true);
        } else {
          removeCookie("origin_data");
          removeCookie("origin_id");

          setAllValidationError("Неверный логин либо пароль");

          for (let i = 0; i < loginRef.current.children.length - 1; i++) {
            loginRef.current.children[i].style.boxShadow =
              "0 0 1px 1px rgb(255, 54, 54)";
          }
          setIsLogin(false);
          console.log(data.errors[0], "------------------ERR");
        }
      })
      .catch(err => {
        removeCookie("origin_data");
        removeCookie("origin_id");

        setIsLogin(false);
        console.log(err, "  *****************ERR");
      });
  };

  if (isLogin || Number(cookies.origin_id) === 1) {
    return <Redirect to="/editCompany" />;
  } else {
    return (
      <div
        className="Login"
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
        <Header
          logo
          burger
          toSlideFixedHeader={isShowMenu}
          showSlideSideMenu={showSlideSideMenu}
          showSideMenu={showSideMenu}
        />
        <div className="authBlock">
          <h4>{!isForgetPass ? "АВТОРИЗАЦИЯ" : "ВОССТАНОВЛЕНИЕ ПАРОЛЯ"}</h4>
          <form
            ref={loginRef}
            onSubmit={e => {
              e.preventDefault();
              !isForgetPass && userLogin(email, password);
            }}
          >
            <input
              type="text"
              name="email"
              placeholder="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
              }}
            />
            {!isForgetPass && (
              <input
                type="password"
                name="password"
                placeholder="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                }}
              />
            )}
            {!isForgetPass && <input type="submit" value="ВОЙТИ" />}
            {isForgetPass && <p className="btnSubmit">ОТПРАВИТЬ</p>}
          </form>
          <p
            className="forgetPass"
            onClick={() => {
              setIsForgetPass(prev => !prev);
            }}
          >
            {!isForgetPass ? "  Забыли пароль?" : " Уже есть аккаунт?"}
            <span className="errorField">
              {!isForgetPass && allValidationError}
            </span>
          </p>
        </div>
        <SlideSideMenu isShowMenu={isShowMenu} />
      </div>
    );
  }
};

export default Login;
