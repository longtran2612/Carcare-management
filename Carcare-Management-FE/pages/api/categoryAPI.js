import axios from "axios";

import { API_URL } from "./url";

const getCategories = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/service-categories`,
  });
};
const createCategory = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/service-categories/create`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const updateCategory = (data, id) => {
  return axios({
    method: "POST",
    url: API_URL + `/service-categories/update/${id}`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getCategoryById = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/service-categories/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getCategoryByCode = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/service-categories/find-category-by-code/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export { getCategories, createCategory,updateCategory, getCategoryById, getCategoryByCode };
