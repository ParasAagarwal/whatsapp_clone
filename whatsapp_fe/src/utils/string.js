export const capitalize = (str) => {
  return str
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
    .join(" ");
};
//making first char to upper case of every part of Name
