import moment from "moment";

//using moment for getting better time stamp 
export const dateHandler = (date) => {
  let now = moment();
  let momentDate = moment(date);
  let time = momentDate.fromNow(true);
  let dateByHourAndMin = momentDate.format("HH:mm");//displays time in place of hours or minutes
  const getDay = () => {
    let days = time.split(" ")[0];
    if (Number(days) < 8) {
      return now.subtract(Number(days), "days").format("dddd");
    } else {//>8 = DD/MM/YYYY
      return momentDate.format("DD/MM/YYYY");
    }
  };//for more than 1 day
  if (time === "a few seconds") {
    return "Now";
  }
  if (time.search("minute") !== -1) {
    let mins = time.split(" ")[0];
    if (mins === "a") {
      return "1 min";
    } else {
      return `${mins} min`;
    }
  }
  if (time.search("hour") !== -1) {
    return dateByHourAndMin;
  }
  if (time === "a day") {
    return "Yesterday";
  }
  if (time.search("days") !== -1) {
    return getDay();
  }
  return time;
};
