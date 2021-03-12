export const API_KEY = "AIzaSyAZQdg3dPHXD5Bt-Dgi85wNHG5G_MXpR7g";

export const DAY_OF_WEEK = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

export const SHORT_DAY_OF_WEEK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export const EN_SHORT_TO_RU_LONG = {
  Mon: "понедельник",
  Tue: "вторник",
  Wed: "среда",
  Thu: "четверг",
  Fri: "пятница",
  Sat: "суббота",
  Sun: "воскресенье",
};

export const EN_SHORT_TO_NUMBER = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

export const EN_SHORT_TO_RU_LONG_V_P = {
  Mon: "понедельник",
  Tue: "вторник",
  Wed: "среду",
  Thu: "четверг",
  Fri: "пятницу",
  Sat: "субботу",
  Sun: "воскресенье",
};

export const EN_SHORT_TO_RU_SHORT = {
  Mon: "Пн",
  Tue: "Вт",
  Wed: "Ср",
  Thu: "Чт",
  Fri: "Пт",
  Sat: "Сб",
  Sun: "Вс",
};

export const EN_SHORT_DAY_OF_WEEK = [
  {
    day: "Mon",
  },
  {
    day: "Tue",
  },
  {
    day: "Wed",
  },
  {
    day: "Thu",
  },
  {
    day: "Fri",
  },
  {
    day: "Sat",
  },
  {
    day: "Sun",
  },
];

export const defaultColor = "#f8104d";

export const PLACE_QUERY = `place{
  id name address description alias profile_image
  streams{url name id preview schedules{id day start_time end_time}}
  schedules {id day start_time end_time}
  categories {id name slug}
}`;

export const PLACES_EXT_DATA_QUERY = `data {
  id name  address  profile_image lat lon
  streams{ id preview }
  currentScheduleInterval {start_time end_time}
  is_work
  is_online
  categories {id name slug}
}`;

export const PLACE_EXT_DATA_QUERY = ` 
  id name  address  profile_image lat lon
  streams{ id preview url }
  currentScheduleInterval {start_time end_time}
  is_work
  is_online
  categories {id name slug}
`;

export const SCHEDULE_PLACE_QUERY = `schedulable {
  ...on Place {
    id name address description alias profile_image
    streams{url name id preview schedules{id day start_time end_time}}
    schedules {id day start_time end_time}
    categories {id name slug}
  }
}`;

// export const queryPath = "http://partyliveLocal";
export const queryPath = "https://backend.partylive.by";
