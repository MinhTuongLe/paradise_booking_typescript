import dayjs from "dayjs";

// convert from DD-MM:YYYY HH:mm:ss to YYYY-MM-DDTHH:mm:ss
export const formatDateTime_DMYHMS_To_ISO8601 = (inputDate: string) => {
  let parts = inputDate.split(" ");

  let dateParts = parts[0].split("-");

  let newDateFormat = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];

  let timeParts = parts[1].split(":");

  newDateFormat += "T" + timeParts[0] + ":" + timeParts[1] + ":" + timeParts[2];

  return newDateFormat;
};

// format thời gian cho biểu đồ trong thống kê
export const renderChartLabels = (dateStr: string) => {
  let formattedDate = dateStr;

  switch (true) {
    case /^\d{4}-\d{2}-\d{2} - \d{4}-\d{2}-\d{2}$/.test(dateStr):
      const [startYear, startMonth, startDay, endYear, endMonth, endDay]: any =
        dateStr.match(/\d+/g);
      formattedDate = `${startDay}/${startMonth} - ${endDay}/${endMonth}`;
      break;

    case /^\d{4}-\d{2}-\d{2}$/.test(dateStr):
      const [yearSingle, monthSingle, daySingle] = dateStr.split("-");
      formattedDate = `${daySingle}/${monthSingle}`;
      break;

    case /^\d{4}-\d{2}$/.test(dateStr):
      const [year, month] = dateStr.split("-");
      formattedDate = `${month}/${year}`;
      break;

    default:
      break;
  }

  return formattedDate;
};

// format thời gian từ params cho thẻ input trong thống kê
export const convertDate = (input: string | null) => {
  if (!input) return "";
  let date;

  if (/^\d{2}-\d{2}-\d{4}$/.test(input)) {
    date = dayjs(input, "DD-MM-YYYY");
  } else if (/^\d{2}-\d{4}$/.test(input)) {
    date = dayjs(input, "MM-YYYY").startOf("month");
  } else if (/^\d{4}$/.test(input)) {
    date = dayjs(input, "YYYY").startOf("year");
  } else {
    return "";
  }

  return date.isValid() ? date.format("YYYY-MM-DD") : "";
};
