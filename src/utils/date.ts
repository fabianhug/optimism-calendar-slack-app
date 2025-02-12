import moment from "moment-timezone";
import { TIMEZONE } from "../config";

export function getNow() {
  return moment().tz(TIMEZONE);
}

export function getWeekEnd(date = getNow()) {
  return date.clone().endOf("week");
}

export function getTodayStart(date = getNow()) {
  return date.clone().startOf("day");
}

export function getTomorrow(date = getNow()) {
  return date.clone().add(1, "day").startOf("day");
}

export function formatEventDate(date: string) {
  return moment(date).tz(TIMEZONE).format("MMMM D, YYYY [at] HH:mm [EST]");
}
