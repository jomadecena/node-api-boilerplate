import dayjs from "dayjs";

const DATE_FORMAT = 'MM-DD-YYYY';
const TIME_FORMAT = 'HH:mm:ss';

export const formatDate = (date: Date, includeTime = false) => {
  return dayjs(date).format(`${DATE_FORMAT}${includeTime ? ` ${TIME_FORMAT}` : ''}`)
};