import axios from "axios";

import { API_URL } from "./url";

const getCarSlots = () => {
  return axios({
    method: "GET",
    url: API_URL + `/car-slots`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getCarSlotDetail = (id) => {
  return axios({
    method: "GET",
    url: API_URL + `/car-slots/${id}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const executeCarSlot = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-slots/execute`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const completeCarSlot = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-slots/complete`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const createCarSlot = () => {
  return axios({
    method: "POST",
    url: API_URL + `/car-slots/create`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const updateCarSlot = (data, id) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-slots/update/${id}`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getCarSlotByCode = (code) => {
  return axios({
    method: "GET",
    url: API_URL + `/car-slots/find-car-slot-by-code/${code}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const cancelCarSlot = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-slots/cancel/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const deteleCarSlot = (id) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-slots/delete/${id}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export {
  deteleCarSlot,
  cancelCarSlot,
  getCarSlots,
  getCarSlotDetail,
  executeCarSlot,
  completeCarSlot,
  createCarSlot,
  getCarSlotByCode,
  updateCarSlot
};
