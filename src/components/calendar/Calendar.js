import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addYears,
  subYears,
  startOfYear,
  getWeekOfMonth
} from "date-fns";

import "./calendar.css";

import { ru } from "date-fns/locale";
import buildLocalizeFn from "date-fns/locale/_lib/buildLocalizeFn";

const monthValues = {
  narrow: ["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"],
  abbreviated: [
    "янв.",
    "фев.",
    "март",
    "апр.",
    "май",
    "июнь",
    "июль",
    "авг.",
    "сент.",
    "окт.",
    "нояб.",
    "дек."
  ],
  wide: [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь"
  ]
};

ru.localize.month = buildLocalizeFn({
  values: monthValues,
  defaultWidth: "wide",
  defaultFormattingWidth: "wide"
});

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [currentYear, setCurrentYear] = useState(new Date());
  const [showTopFixedBlock, setShowTopFixedBloc] = useState(false);

  const [choosedDayMonth, setChoosedDayMonth] = useState(false);

  document.body.style.background = "#fff";

  const renderHeader = allMonths => {
    const dateFormat = "MMMM";
    return (
      <div className="monthNameBigCalendar">
        <div className="">
          {!allMonths && (
            <div className="icon" onClick={prevMonth}>
              chevron_left
            </div>
          )}
        </div>
        <div className="col col-center">
          <span>
            {format(allMonths || currentMonth, dateFormat, { locale: ru })}
          </span>
        </div>
        {!allMonths && (
          <div className="" onClick={nextMonth}>
            <div className="icon">chevron_right</div>
          </div>
        )}
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "E";
    const days = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className="col col-center"
          key={i}
          style={
            format(addDays(startDate, i), "E") === "Sat" ||
            format(addDays(startDate, i), "E") === "Sun"
              ? { color: "#f86262" }
              : {}
          }
        >
          {format(addDays(startDate, i), "E") === "Sat"
            ? "Сб"
            : format(addDays(startDate, i), dateFormat, { locale: ru }).slice(
                0,
                2
              )}
        </div>
      );
    }
    return (
      <div
        className="days row"
        style={{
          background: "rgb(243, 242, 242)",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.05)"
        }}
      >
        {days}
      </div>
    );
  };

  const onDateClick = (day, e) => {
    document.body.style.overflow = "hidden";
    setSelectedDate(day);

    const currentRow = e.target.closest(".animationRow");
    const currentCalendar = e.target.closest(".animationMonthCalendar");
    const animationMonthCalendar = document.getElementsByClassName(
      "animationMonthCalendar"
    );
    const curCalendarId = document.getElementById(format(selectedDate, "MMMM"));
    const calendarBody = curCalendarId.querySelector(".body");
    const animationRows = calendarBody.querySelectorAll(".animationRow");

    for (let j = 0; j < 12; j++) {
      if (animationRows[j]) {
        animationRows[j].style.height = "50px";
      }
      animationMonthCalendar[j].style.display = "none";
    }

    currentCalendar.style.display = "block";
    currentCalendar.style.marginTop =
      100 - getWeekOfMonth(day, { weekStartsOn: 1 }) * 50 + "px";

    setTimeout(() => {
      currentRow.style.height = window.innerHeight + "px";
    }, 350);

    setChoosedDayMonth(format(day, "MMMM yyyy", { locale: ru }));
  };

  const renderCells = allMonths => {
    const monthStart = startOfMonth(allMonths || currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell outline ${
              !isSameMonth(day, monthStart)
                ? !choosedDayMonth
                  ? "disabled"
                  : "disabledOpacity"
                : isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            style={
              format(addDays(startDate, i), "E") === "Sat" ||
              format(addDays(startDate, i), "E") === "Sun"
                ? isSameMonth(day, monthStart)
                  ? { color: "#f86262", height: "50px" }
                  : { height: "50px" }
                : { height: "50px" }
            }
            key={day}
            onClick={e => {
              !e.target.classList.contains("disabled") &&
                !e.target.classList.contains("disabledOpacity") &&
                !e.target.classList.contains("numberDisabled") &&
                onDateClick(cloneDay, e);
            }}
          >
            <span
              className={
                !isSameMonth(day, monthStart)
                  ? "number numberDisabled"
                  : "number"
              }
            >
              {formattedDate}
            </span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div
          className="row animationRow"
          key={day}
          style={{ height: "50px", overflow: "hidden" }}
        >
          {days}
          <div className="calendarDayDescription">
            <p>{format(selectedDate, "EEEE d MMMM yyyy", { locale: ru })} г.</p>
          </div>
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // ==================IOS START======================
  //ALL MONTHS
  let yearStart = startOfYear(currentYear);
  const monthsOfYear = [];
  for (let i = 0; i < 12; i++) {
    monthsOfYear.push(yearStart);
    yearStart = addMonths(yearStart, 1);
  }

  const nextIosYear = () => {
    setCurrentYear(addYears(currentYear, 1));
  };
  const prevIosYear = () => {
    setCurrentYear(subYears(currentYear, 1));
  };

  const renderIosHeader = () => {
    const dateFormat = "yyyy";
    return (
      <div className="headerIos rowIos ">
        <div className="">
          <div className="icon" onClick={prevIosYear}>
            chevron_left
          </div>
        </div>
        <div className="headerIosYear">
          <span>{format(currentYear, dateFormat, { locale: ru })}</span>
        </div>
        <div className="" onClick={nextIosYear}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  };
  const renderIosCells = el => {
    const monthStart = startOfMonth(el);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd);

    const clickOnMonth = () => {
      setCurrentMonth(el);

      const iosCalendar = document.getElementsByClassName("iosCalendar")[0];
      const bigCalendarWrap = document.getElementsByClassName(
        "bigCalendarWrap"
      )[0];

      iosCalendar.style.opacity = "0";
      iosCalendar.style.zIndex = 0;

      bigCalendarWrap.style.opacity = "1";
      bigCalendarWrap.style.display = "block";
      bigCalendarWrap.style.zIndex = 1;

      setShowTopFixedBloc(true);

      setTimeout(() => {
        document
          .getElementById(format(el, "MMMM"))
          .scrollIntoView({ block: "center", behavior: "smooth" });
        window.scrollTo(0, window.pageYOffset);
      }, 500);
    };

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        days.push(
          <div
            className={`col cellIos ${
              !isSameMonth(day, monthStart)
                ? "disabledIos"
                : isSameDay(day, selectedDate)
                ? "selectedIos"
                : ""
            }`}
            style={{
              height: "18px",
              fontSize: "10px"
            }}
            key={day}
          >
            <span
              className="number"
              style={
                format(addDays(startDate, i), "E") === "Sat" ||
                format(addDays(startDate, i), "E") === "Sun"
                  ? { color: "#999", display: "flex", alignSelf: "center" }
                  : { display: "flex", alignSelf: "center" }
              }
            >
              {formattedDate}
            </span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="rowIos" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return (
      <div
        className="iosCalendarWrap"
        onClick={e => {
          clickOnMonth();
        }}
      >
        <p
          className="iosMonth"
          style={
            isSameMonth(el, new Date())
              ? { color: "rgb(248, 98, 98)" }
              : { color: "black" }
          }
        >
          {format(el, "MMMM", { locale: ru })}
        </p>
        <div className="body">{rows}</div>
      </div>
    );
  };
  // ==================IOS END====================

  return (
    <div className="calendar" style={{ border: "none" }}>
      <div className="iosCalendar">
        {renderIosHeader()}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            margin: "5px",
            background: "#fff"
          }}
        >
          {monthsOfYear.map((el, i) => {
            return (
              <div className="animationCalendarBlock" key={i}>
                {renderIosCells(el)}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        {
          <div
            className={
              showTopFixedBlock ? "fixedBlocksShow" : "fixedBlocksHide"
            }
          >
            <p
              className="topArrowWrap"
              onClick={e => {
                if (!choosedDayMonth) {
                  // CLICK по    < 2020 >
                  const iosCalendar = document.getElementsByClassName(
                    "iosCalendar"
                  )[0];
                  const bigCalendarWrap = document.getElementsByClassName(
                    "bigCalendarWrap"
                  )[0];
                  setShowTopFixedBloc(false);

                  iosCalendar.style.opacity = "1";
                  iosCalendar.style.zIndex = 1;

                  bigCalendarWrap.style.opacity = "0";
                  bigCalendarWrap.style.display = "none";
                } else {
                  // CLICK по    < январь 2020
                  document.body.style.overflow = "auto";

                  const animationMonthCalendar = document.getElementsByClassName(
                    "animationMonthCalendar"
                  );

                  const curCalendarId = document.getElementById(
                    format(selectedDate, "MMMM")
                  );
                  const calendarBody = curCalendarId.querySelector(".body");
                  const animationRows = calendarBody.querySelectorAll(
                    ".animationRow"
                  );

                  for (let j = 0; j < 12; j++) {
                    if (animationRows[j]) {
                      animationRows[j].style.height = "50px";
                    }
                  }
                  setChoosedDayMonth(false);

                  setTimeout(() => {
                    for (let i = 0; i < 12; i++) {
                      animationMonthCalendar[i].style.display = "block";
                      animationMonthCalendar[i].style.marginTop = 10 + "px";
                      if (i === 0) {
                        animationMonthCalendar[i].style.marginTop = 100 + "px";
                      }
                    }
                    document
                      .getElementById(format(selectedDate, "MMMM"))
                      .scrollIntoView({ block: "center", behavior: "smooth" });
                  }, 400);
                }
              }}
            >
              <span className="topArrowCalendar">
                <span>{choosedDayMonth || format(currentYear, "yyyy")}</span>
              </span>
            </p>
            {renderDays()}
          </div>
        }
        <div className={`bigCalendarWrap`}>
          {monthsOfYear.map((el, i) => {
            return (
              <div
                key={i}
                id={format(el, "MMMM")}
                className="animationMonthCalendar"
                style={
                  ({ margin: "10px" },
                  +format(el, "M") === 1
                    ? { marginTop: "100px" }
                    : { marginTop: "10px" })
                }
              >
                {renderHeader(el)}
                {renderCells(el)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
