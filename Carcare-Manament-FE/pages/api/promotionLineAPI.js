
import axios from "axios";

import { API_URL } from "./url";

const getPromotionLines = () => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-lines`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getPromotionLineById = async (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-lines/find-promotion-line-by-id/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getPromotionLineByCode = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-lines/find-promotion-line-by-code/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getPromotionLineByHeaderId = (data) => {
  return axios({
    method: "GET",
    url:
      API_URL + `/promotion-lines/find-all-promotion-line-by-header-id/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const createPromotionLine = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/promotion-lines/create`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const activePromotionLine = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/promotion-lines/active/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const inActivePromotionLine = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/promotion-lines/inactive/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const deletePromotionLine = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/promotion-lines/delete/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const updatePromotionLine = (id,data) => {
  return axios({
    method: "POST",
    url: API_URL + `/promotion-lines/update/${id}`,
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
  updatePromotionLine,
  deletePromotionLine,
  activePromotionLine,
  inActivePromotionLine,
  getPromotionLines,
  getPromotionLineByHeaderId,
  getPromotionLineById,
  getPromotionLineByCode,
  createPromotionLine,
};
