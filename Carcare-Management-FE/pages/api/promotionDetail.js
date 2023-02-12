
import axios from "axios";

import { API_URL } from "./url";

const getPromotionDetail = () => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-details`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getPromotionDetailById = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-details/find-promotion-detail-by-id/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getPromotionDetailByCode = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-details/find-promotion-detail-by-code/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getPromotionDetailByLineId = (data) => {
  return axios({
    method: "GET",
    url:
      API_URL +
      `/promotion-details/find-all-promotion-detail-by-promotion-line-id/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const createPromotionDetail = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/promotion-details/create`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const updatePromotionDetail = (data,id) => {
  return axios({
    method: "POST",
    url: API_URL + `/promotion-details/update/${id}`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getAllPromotionUseable = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-details/get-all-usable-promotion-by-order-id/${data}`,
  })
  .then((res) => {
    return res;
  })
  .catch((err) => {
    throw err;
  });
};
const getAllPromotionUseAbleByServiceIds = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/promotion-details/get-all-usable-promotion-by-service-ids`,
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
  getPromotionDetail,
  getPromotionDetailByLineId,
  getPromotionDetailById,
  getPromotionDetailByCode,
  createPromotionDetail,
  updatePromotionDetail,
  getAllPromotionUseable,
  getAllPromotionUseAbleByServiceIds
};
