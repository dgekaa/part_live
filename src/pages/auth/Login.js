import React, { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Redirect, Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import QUERY from "../../query";
import { defaultColor } from "../../constants";

export const GoBackBtn = styled(Link)`
  position: relative;
  top: -104px;
  left: 0px;
  font-size: 16px;
  font-weight: normal;
  height: 30px;
  width: 150px;
  &:hover {
    color: ${defaultColor};
  }
  @media (max-width: 760px) {
    display: none;
  }
`;

export const GoBackBtnArrow = styled.span`
  font-size: 18px;
  padding-right: 5px;
`;

export const AuthBlock = styled.div`
  transition: 0.3s ease transform;
  transform: scale(1.5);
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 258px;
  padding: 20px 0;
  background: #ffffff;
  border: 1px solid #eef1f6;
  border-radius: 10px;
  flex-direction: column;
  @media (max-width: 760px) {
    transform: scale(1.1);
    width: 85%;
  }
`;

export const HeadTitle = styled.div`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.05em;
  margin-bottom: 15px;
  @media (max-width: 760px) {
    font-size: 16px;
    margin-bottom: 10px;
  }
`;

export const AuthBlockWrap = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  height: calc(100vh - 65px);
  padding-top: 140px;
  @media (max-width: 760px) {
    height: 100vh;
    position: relative;
  }
`;

export const AuthForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @media (max-width: 760px) {
    display: flex;
    width: 85%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`;

export const AuthInput = styled.input`
  -webkit-user-select: initial;
  -khtml-user-select: initial;
  -moz-user-select: initial;
  -ms-user-select: initial;
  user-select: initial;
  -webkit-appearance: none;
  transition: 0.3s ease all;
  width: 189px;
  font-size: 14px;
  height: 30px;
  outline: none;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  box-sizing: border-box;
  border-radius: 5px;
  margin: 7px 0px;
  padding: 0 10px;
  @media (max-width: 760px) {
    width: 100%;
    height: 45px;
  }
`;

export const AuthSubmitBtn = styled(AuthInput)`
  -webkit-user-select: initial;
  -khtml-user-select: initial;
  -moz-user-select: initial;
  -ms-user-select: initial;
  user-select: initial;
  -webkit-appearance: none;
  background: ${defaultColor};
  border: 1px solid ${defaultColor};
  box-sizing: border-box;
  border-radius: 5px;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.05em;
  color: #ffffff;
  cursor: pointer;
  &:active {
    background: #d37596;
  }
`;

export const AuthForgetSubmitBtn = styled.div`
  background: ${defaultColor};
  border: 1px solid ${defaultColor};
  box-sizing: border-box;
  border-radius: 5px;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.05em;
  color: #ffffff;
  cursor: pointer;
  width: 189px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Question = styled.p`
  display: block;
  text-align: center;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.05em;
  color: #bdbdbd;
  line-height: 8px;
  margin-top: 15px;
  cursor: pointer;
  transition: 0.3s ease color;
  &:hover {
    color: ${defaultColor};
  }
`;

export const ErrorField = styled.span`
  display: block;
  transition: 0.3s ease all;
  margin: 15px 10px 0 10px;
  font-size: 11px;
  color: rgb(241, 62, 62);
`;

const Login = () => {
  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false),
    [isShowMenu, setIsShowMenu] = useState(false),
    [isLogin, setIsLogin] = useState(false),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [isForgetPass, setIsForgetPass] = useState(false),
    [allValidationError, setAllValidationError] = useState("");

  const loginRef = useRef(null);
  const [cookies, setCookie, removeCookie] = useCookies([]);

  useEffect(() => {
    if (sessionStorage.getItem("uniqueCompanyType")) {
      sessionStorage.setItem("uniqueCompanyType", "");
    }

    sessionStorage.setItem("prevZoom", "");
    sessionStorage.setItem("prevCenter", "");
  }, []);

  const hideSideMenu = () => {
      setShowSlideSideMenu(false);
      document.body.style.overflow = "visible";
      setIsShowMenu(false);
    },
    showSideMenu = () => {
      setShowSlideSideMenu(true);
      document.body.style.overflow = "hidden";
      setIsShowMenu(true);
    };

  window.onresize = function (e) {
    hideSideMenu();
  };

  const hideMenu = (e) => {
      if (e.target.className !== "SlideSideMenu" && showSlideSideMenu) {
        hideSideMenu();
      }
    },
    loginClick = (e) => {
      e.preventDefault();
      !isForgetPass && userLogin(email, password);
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

  const SwipePageSpring = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 200 },
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
      <div>
        <Header
          arrow
          isShowMenu={isShowMenu}
          logo
          burger
          showSlideSideMenu={showSlideSideMenu}
          showSideMenu={showSideMenu}
        />
        <AuthBlockWrap
          as={animated.div}
          onClick={(e) => hideMenu(e)}
          style={SwipePageSpring}
        >
          <GoBackBtn to="/">
            <GoBackBtnArrow>&#8592;</GoBackBtnArrow>
            На главную
          </GoBackBtn>
          <AuthBlock>
            <HeadTitle>
              {!isForgetPass ? "АВТОРИЗАЦИЯ" : "ВОССТАНОВЛЕНИЕ ПАРОЛЯ"}
            </HeadTitle>
            <AuthForm ref={loginRef} onSubmit={(e) => loginClick(e)}>
              <AuthInput
                autocomplete="username"
                type="email"
                name="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!isForgetPass && (
                <>
                  <AuthInput
                    autocomplete="current-password"
                    type="password"
                    name="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <AuthSubmitBtn type="submit" value="ВОЙТИ" />
                </>
              )}
              {isForgetPass && (
                <AuthForgetSubmitBtn>ОТПРАВИТЬ</AuthForgetSubmitBtn>
              )}
            </AuthForm>
            <Question onClick={() => setIsForgetPass((prev) => !prev)}>
              {!isForgetPass ? "  Забыли пароль?" : " Уже есть аккаунт?"}
              <ErrorField>{!isForgetPass && allValidationError}</ErrorField>
            </Question>
          </AuthBlock>
          <SlideSideMenu isShowMenu={isShowMenu} />
        </AuthBlockWrap>
      </div>
    );
  }
};

export default Login;
