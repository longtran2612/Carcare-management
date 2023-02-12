
import axios from "axios";

import { API_URL } from "./url";

const getPromotionHeaders = () => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-headers`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getPromotionHeaderById = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-headers/find-promotion-header-by-id/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getPromotionHeaderByCode = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-headers/find-promotion-header-by-code/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const createPromotionHeader = (data) => {
    return axios({
        method: "POST",
        url: API_URL + `/promotion-headers/create`,
        data: data,
    })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
};
const updatePromotionHeader = (id,data) => {
    return axios({
        method: "POST",
        url: API_URL + `/promotion-headers/update/${id}`,
        data: data,
    })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
};

const activePromotionHeader = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/promotion-headers/active/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const inActivePromotionHeader = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/promotion-headers/inactive/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const deletePromotionHeader = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/promotion-headers/delete/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export {deletePromotionHeader,activePromotionHeader,inActivePromotionHeader, updatePromotionHeader, getPromotionHeaders,getPromotionHeaderByCode, getPromotionHeaderById, createPromotionHeader };
