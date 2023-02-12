const changeDate = (x) => {
  if (x === null || x === undefined || x === "") return "";
  let temp = new Date(x);
  x = `${temp.getDate()}/${temp.getMonth() + 1}/${temp.getFullYear()}`;
  let array = x.split("/");
  return array[1] + "/" + array[0] + "/" + array[2];
};
const formatMoney = (num) => {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " VNĐ";
};
export { changeDate, formatMoney };
