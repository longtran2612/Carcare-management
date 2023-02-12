import axios from "axios";

import { API_URL } from "./url";
import axiosClient from "./index";

const getCars = () => {
  return axios({
    method: "GET",
    url: API_URL + `/cars`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getCarByCode = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/cars/find-car-by-code/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getCarById = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/cars/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const createCar = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/cars/create`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const updateCar = (data, id) => {
  return axios({
    method: "POST",
    url: API_URL + `/cars/update/${id}`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getCarbyCustomerId = (id) => {
  return axios({
    method: "GET",
    url: API_URL + `/cars/find-cars-by-customer-id/${id}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export {
  getCarbyCustomerId,
  getCars,
  updateCar,
  getCarById,
  createCar,
  getCarByCode,
};
