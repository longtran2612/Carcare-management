import axios from "axios";

import { API_URL } from "./url";

const getStatisticCustomer = (id) => {
  return axios({
    method: "GET",
    url: API_URL + `/statistic/get-customer-statistic/${id}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getStatistic = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/statistic`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getAdminStatistic = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/statistic/get-admin-statistic`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export { getStatisticCustomer,getStatistic,getAdminStatistic};
