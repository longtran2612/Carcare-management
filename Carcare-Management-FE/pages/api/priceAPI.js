import axios from "axios";

import { API_URL } from "./url";

const getPrices = () => {
  return axios({
    method: "GET",
    url: API_URL + `/prices`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getPricesByParent = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/prices/parent=${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getPricesByHeader = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/prices/header=${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getPriceById = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/prices/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const createPrice = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/prices/create`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const updatePrice = async (id, data) => {
  return axios({
    method: "POST",
    url: API_URL + `/prices/update/${id}`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const deletePrice = (id) => {
  return axios({
    method: "POST",
    url: API_URL + `/prices/delete/${id}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export {
  deletePrice,
  getPriceById,
  getPricesByHeader,
  getPricesByParent,
  getPrices,
  createPrice,
  updatePrice,
};
