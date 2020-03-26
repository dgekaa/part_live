import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";

import QUERY from "../../query";
import { useCookies } from "react-cookie";
import "./auth.css";

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
    if (allValidationError) {
      console.log(allValidationError, ":ASDA");
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

      // register.current.children;
    }
  }, [allValidationError]);

  const registration = () => {
    console.log(name, "-", email, "-", password, "-", rePassword);
    QUERY({
      query: `mutation {
        register (input: {
          name: "${name}",
            email: "${email}",
            password: "${password}"
            password_confirmation: "${rePassword}"
        }) {status
          tokens{access_token refresh_token expires_in token_type
             user{id name email }
         }}
      }`
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (!data.errors) {
          console.log(data.data.register, " DATA REGISTRATION");
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

          console.log(data.errors[0].extensions.validation, "=====validation");
          console.log(data.errors, "------------------ERR");
        }
      })
      .catch(err => {
        removeCookie("origin_data");
        removeCookie("origin_id");
        console.log(err, "  *****************ERR");
      });
  };

  if (Number(cookies.origin_id)) {
    return <Redirect to="/home" />;
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
          {!isSuccess && (
            <>
              <h4>РЕГИСТРАЦИЯ</h4>
              <form
                ref={register}
                onSubmit={e => {
                  e.preventDefault();
                  registration();
                }}
              >
                <input
                  type="name"
                  name="name"
                  placeholder="Имя"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                  }}
                />
                <input
                  type="text"
                  name="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                  }}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                  }}
                />
                <input
                  type="password"
                  name="re_password"
                  placeholder="Повтор пароля"
                  value={rePassword}
                  onChange={e => {
                    setRePassword(e.target.value);
                  }}
                />
                <input type="submit" value="Зарегистрироваться" />
              </form>
              <Link className="forgetPass" to="/login">
                Уже есть аккаунт?
                <p className="errorField"> {oneValidationError}</p>
              </Link>
            </>
          )}
          {isSuccess && (
            <>
              <h4>ПОЗДРАВЛЯЕМ!</h4>
              <p className="successText">Вы успешно прошли регистрацию!</p>
              <Link to="/home" className="btnSubmit">
                ПЕРЕЙТИ НА ГЛАВНУЮ
              </Link>
            </>
          )}
        </div>
        <SlideSideMenu isShowMenu={isShowMenu} />
      </div>
    );
  }
};

export default Registration;
