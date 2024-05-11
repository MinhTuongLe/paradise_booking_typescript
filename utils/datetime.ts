// convert from DD-MM:YYYY HH:mm:ss to YYYY-MM-DDTHH:mm:ss
export const formatDateTime_DMYHMS_To_ISO8601 = (inputDate: string) => {
  let parts = inputDate.split(" ");

  let dateParts = parts[0].split("-");

  let newDateFormat = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];

  let timeParts = parts[1].split(":");

  newDateFormat += "T" + timeParts[0] + ":" + timeParts[1] + ":" + timeParts[2];

  return newDateFormat;
};
