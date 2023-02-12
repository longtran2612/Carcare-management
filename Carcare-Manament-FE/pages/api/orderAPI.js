import axios from "axios";
import axiosClient from "./index";

import { API_URL } from "./url";

const getOrders = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/order/search-order`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getOrderById = (id) => {
  return axios({
    method: "GET",
    url: API_URL + `/order/find-order-by-id/${id}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getAllExecuteOrder = () => {
  return axios({
    method: "GET",
    url: API_URL + `/order/get-all-executed-order`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const createOrder = async (data) => {
  return axiosClient()({
    method: "POST",
    url: API_URL + `/order/create`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const cancelOrder = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/order/cancel/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getAllOrder = () => {
  return axios({
    method: "GET",
    url: API_URL + `/order`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const updateOrder = (id,data) => {
  return axios({
    method: "POST",
    url: API_URL + `/order/update/${id}`,
    data: data,
  })
  .then((res) => {
    return res;
  })
  .catch((err) => {
    throw err;
  });
};


export {
  updateOrder,
  getAllOrder,
  createOrder,
  getOrderById,
  getOrders,
  getAllExecuteOrder,
  cancelOrder,
};
