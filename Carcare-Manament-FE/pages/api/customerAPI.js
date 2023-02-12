import axios from "axios";
import axiosClient from "./index";
import { API_URL } from "./url";
import Cookies from "js-cookie";

const getCustomers = async () => {
  return axios({
    method: "GET",
    url: API_URL + `/customer`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getCustomerById = async (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/customer/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getCustomerByPhone = async (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/customer/find-customer-by-phone/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getCustomerByCode = async (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/customer/find-customer-by-code/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const createCustomer = async (data) => {
  return axiosClient()({
    method: "POST",
    url: API_URL + `/customer/create`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const updateCustomer = async (id, data) => {
  return axios({
    method: "POST",
    url: API_URL + `/customer/update/${id}`,
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
  createCustomer,
  getCustomerById,
  getCustomers,
  getCustomerByCode,
  getCustomerByPhone,
  updateCustomer
};
