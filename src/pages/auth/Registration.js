import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSpring, animated } from "react-spring";

import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import QUERY from "../../query";

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
    if (localStorage.getItem("uniqueCompanyType")) {
      localStorage.setItem("uniqueCompanyType", "");
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
            {!isSuccess && (
              <>
                <h4>РЕГИСТРАЦИЯ</h4>
                <form
                  ref={register}
                  onSubmit={(e) => {
                    e.preventDefault();
                    registration();
                  }}
                >
                  <input
                    type="name"
                    name="name"
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="text"
                    name="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    name="re_password"
                    placeholder="Повтор пароля"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
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
        </animated.div>
      </div>
    );
  }
};

export default Registration;
