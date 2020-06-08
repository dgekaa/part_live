import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import QUERY from "../../query";
import {
  GoBackBtn,
  GoBackBtnArrow,
  AuthBlock,
  HeadTitle,
  AuthBlockWrap,
  AuthForm,
  AuthInput,
  AuthSubmitBtn,
  Question,
  ErrorField,
  AuthForgetSubmitBtn,
} from "./Login";

const SuccessText = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  margin-bottom: 25px;
  margin-top: 5px;
`;

const Registration = () => {
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [allValidationError, setAllValidationError] = useState(null);
  const [oneValidationError, setOneValidationError] = useState(null);

  const register = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem("uniqueCompanyType")) {
      sessionStorage.setItem("uniqueCompanyType", "");
    }
  }, []);

  useEffect(() => {
    if (allValidationError) {
      const nameFirstErrInput = Object.keys(allValidationError)[0].split(
        "."
      )[1];

      for (let i = 0; i < register.current.children.length; i++) {
        register.current.children[i].style.boxShadow = "none";
      }

      register.current.children[nameFirstErrInput].style.boxShadow =
        "0 0 1px 1px rgb(255, 54, 54)";

      setOneValidationError(
        allValidationError[`input.${nameFirstErrInput}`][0]
      );
    }
  }, [allValidationError]);

  window.onresize = function (e) {
    hideSideMenu();
  };

  const registration = () => {
    QUERY({
      query: `mutation {
        register (input: {
          name: "${name}", email: "${email}",
          password: "${password}" password_confirmation: "${rePassword}"
        }) {
          status
          tokens{access_token refresh_token expires_in token_type
          user{id name email }
         }}
      }`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setCookie("origin_data", data.data.register.tokens.access_token);
          setCookie("origin_id", data.data.register.tokens.user.id);

          setName("");
          setEmail("");
          setPassword("");
          setRePassword("");
          setIsSuccess(true);
        } else {
          removeCookie("origin_data");
          removeCookie("origin_id");
          setAllValidationError(data.errors[0].extensions.validation);
          console.log(data.errors, "REGISER ERR");
        }
      })
      .catch((err) => {
        removeCookie("origin_data");
        removeCookie("origin_id");
        console.log(err, "  *****************ERR");
      });
  };
  useEffect(() => {
    sessionStorage.setItem("prevZoom", "");
    sessionStorage.setItem("prevCenter", "");
  }, []);
  const animateProps = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 200 },
  });

  if (!!Number(cookies.origin_id)) {
    return <Redirect to="/home" />;
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
          onClick={(e) => {
            if (e.target.className !== "SlideSideMenu" && showSlideSideMenu) {
              hideSideMenu();
            }
          }}
          style={animateProps}
        >
          <GoBackBtn to="/home">
            <GoBackBtnArrow>&#8592;</GoBackBtnArrow>
            На главную
          </GoBackBtn>
          <AuthBlock>
            {!isSuccess && (
              <>
                <HeadTitle>РЕГИСТРАЦИЯ</HeadTitle>
                <AuthForm
                  ref={register}
                  onSubmit={(e) => {
                    e.preventDefault();
                    registration();
                  }}
                >
                  <AuthInput
                    type="name"
                    name="name"
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <AuthInput
                    type="text"
                    name="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <AuthInput
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <AuthInput
                    type="password"
                    name="re_password"
                    placeholder="Повтор пароля"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                  />
                  <AuthSubmitBtn type="submit" value="Зарегистрироваться" />
                </AuthForm>
                <Question as={Link} to="/login">
                  Уже есть аккаунт?
                  <ErrorField> {oneValidationError}</ErrorField>
                </Question>
              </>
            )}
            {isSuccess && (
              <>
                <h4>ПОЗДРАВЛЯЕМ!</h4>
                <SuccessText>Вы успешно прошли регистрацию!</SuccessText>
                <AuthForgetSubmitBtn to="/home">
                  ПЕРЕЙТИ НА ГЛАВНУЮ
                </AuthForgetSubmitBtn>
              </>
            )}
          </AuthBlock>
          <SlideSideMenu isShowMenu={isShowMenu} />
        </AuthBlockWrap>
      </div>
    );
  }
};

export default Registration;
