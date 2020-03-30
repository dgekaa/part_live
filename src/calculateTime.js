const numberDayNow = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
let numberDayYest;

if (new Date().getDay() === 0) {
  numberDayYest = 5;
} else if (new Date().getDay() === 1) {
  numberDayYest = 6;
} else {
  numberDayYest = new Date().getDay() - 2;
}

const HtoMs = 3600000,
  MtoMs = 60000;

const currentTimeMS =
  new Date().getHours() * HtoMs + new Date().getMinutes() * MtoMs;

export const isShowStreamNow = (item, setShowStream) => {
  const yesterdayStream = item.streams[0].schedules[numberDayYest],
    todayStream = item.streams[0].schedules[numberDayNow];

  const startYesterdayStreamMS =
    yesterdayStream.start_time.split(":")[0] * HtoMs +
    yesterdayStream.start_time.split(":")[1] * MtoMs;
  const endYesterdayStreamMS =
    yesterdayStream.end_time.split(":")[0] * HtoMs +
    yesterdayStream.end_time.split(":")[1] * MtoMs;

  const startTodayStreamMS =
    todayStream.start_time.split(":")[0] * HtoMs +
    todayStream.start_time.split(":")[1] * MtoMs;
  const endTodayStreamMS =
    todayStream.end_time.split(":")[0] * HtoMs +
    todayStream.end_time.split(":")[1] * MtoMs;

  if (
    startYesterdayStreamMS > endYesterdayStreamMS &&
    endYesterdayStreamMS > currentTimeMS
  ) {
    // идет видео за вчерашний день ещe
    setShowStream(true);
  } else if (
    startTodayStreamMS > endTodayStreamMS &&
    currentTimeMS > startTodayStreamMS
  ) {
    // если видео началось сегодня и закончилось завтра
    setShowStream(true);
  } else if (
    startTodayStreamMS < endTodayStreamMS &&
    currentTimeMS > startTodayStreamMS &&
    currentTimeMS < endTodayStreamMS
  ) {
    // началось и закончилось сегодня
    setShowStream(true);
  } else {
    setShowStream(false);
  }
};

export const isWorkTimeNow = (item, setWorkTime, setIsWork) => {
  const yesterdayWorkTime = item.schedules[numberDayYest],
    todayWorkTime = item.schedules[numberDayNow];

  const endYesterdayMS =
    yesterdayWorkTime.end_time.split(":")[0] * HtoMs +
    yesterdayWorkTime.end_time.split(":")[1] * MtoMs;
  const startYesterdayMS =
    yesterdayWorkTime.start_time.split(":")[0] * HtoMs +
    yesterdayWorkTime.start_time.split(":")[1] * MtoMs;
  const endTodayMS =
    todayWorkTime.end_time.split(":")[0] * HtoMs +
    todayWorkTime.end_time.split(":")[1] * MtoMs;
  const startTodayMS =
    todayWorkTime.start_time.split(":")[0] * HtoMs +
    todayWorkTime.start_time.split(":")[1] * MtoMs;

  if (startYesterdayMS > endYesterdayMS && endYesterdayMS > currentTimeMS) {
    // идет работа за вчерашний день ещe
    setIsWork(true);
    setWorkTime(
      yesterdayWorkTime.start_time.split(":")[0] +
        ":" +
        yesterdayWorkTime.start_time.split(":")[1] +
        "-" +
        yesterdayWorkTime.end_time.split(":")[0] +
        ":" +
        yesterdayWorkTime.end_time.split(":")[1]
    );
  } else if (startTodayMS > endTodayMS && currentTimeMS > startTodayMS) {
    // если работа началось сегодня и закончилось завтра
    setIsWork(true);
    setWorkTime(
      todayWorkTime.start_time.split(":")[0] +
        ":" +
        todayWorkTime.start_time.split(":")[1] +
        "-" +
        todayWorkTime.end_time.split(":")[0] +
        ":" +
        todayWorkTime.end_time.split(":")[1]
    );
  } else if (
    startTodayMS < endTodayMS &&
    currentTimeMS > startTodayMS &&
    currentTimeMS < endTodayMS
  ) {
    // началось и закончилось сегодня
    setIsWork(true);
    setWorkTime(
      todayWorkTime.start_time.split(":")[0] +
        ":" +
        todayWorkTime.start_time.split(":")[1] +
        "-" +
        todayWorkTime.end_time.split(":")[0] +
        ":" +
        todayWorkTime.end_time.split(":")[1]
    );
  } else {
    setIsWork(false);
    setWorkTime(
      todayWorkTime.start_time.split(":")[0] +
        ":" +
        todayWorkTime.start_time.split(":")[1] +
        "-" +
        todayWorkTime.end_time.split(":")[0] +
        ":" +
        todayWorkTime.end_time.split(":")[1]
    );
  }
};
