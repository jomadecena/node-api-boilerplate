import dayjs from "dayjs";

export const formatDate = (date: Date, includeTime = false) => {
  return dayjs(date).format(`MM-DD-YYYY${includeTime ? ' HH:mm:ss' : ''}`)
};