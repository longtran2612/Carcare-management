import axios from "axios";

import { API_URL } from "./url";

const getCarModel = () => {
  return axios({
    method: "GET",
    url: API_URL + `/car-models`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getCarModelById = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/car-models/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getCarModelByBrand = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/car-models/find-car-model-by-brand/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const createCarModel = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-models/create`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const deleteCarModel = (data) => {
  return axios({
    method: "DELETE",
    url: API_URL + `/car-models/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const updateCarModel = (data,id) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-models/update/${id}`,
    data: data,
  })
    .then((res) => {  
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const exportExcelCarModel = () => {
  return axios({
    method: "GET",
    url: API_URL + `/car-models/export-to-excel`,
    responseType: "blob",
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const importExcelCarModel = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-models/import-from-excel`,
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export { getCarModel,updateCarModel, getCarModelById, deleteCarModel, createCarModel,getCarModelByBrand, exportExcelCarModel, importExcelCarModel };
