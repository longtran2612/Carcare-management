import axios from "axios";
import axiosClient from "./index";
import { API_URL } from "./url";
import Cookies from "js-cookie";

const getUsers = async () => {
  return axiosClient()({
    method: "GET",
    url: API_URL + `/users`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getUserById = async (id) => {
  return axiosClient()({
    method: "GET",
    url: API_URL + `/users/${id}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getUserByPhone = async () => {
  let phone = Cookies.get("username");
  return axiosClient()({
    method: "GET",
    url: API_URL + `/users/phone/${phone}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const createUser = async (data) => {
  return axiosClient()({
    method: "POST",
    url: API_URL + `/users`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const updateUserById = async (data, id) => {
  return axiosClient()({
    method: "PUT",
    url: API_URL + `/users/${id}`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const uploadImagesUser = async (data) => {
  return axios({
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: API_URL + "/upload",
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getUserAvaliable = async () => {
  return axios({
    method: "GET",
    url: API_URL + "/users/get-all-execute-available-user",
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const activeUser = async (id) => {
  return axiosClient()({
    method: "POST",
    url: API_URL + `/users/active/${id}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const inactiveUser = async (id) => {
  return axiosClient()({
    method: "POST",
    url: API_URL + `/users/inactive/${id}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export {
  getUserAvaliable,
  getUsers,
  createUser,
  getUserByPhone,
  getUserById,
  updateUserById,
  uploadImagesUser,
  activeUser,
  inactiveUser,
};
