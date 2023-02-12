import axios from "axios";
import {API_URL ,FACEBOOK_ID, GOOGLE_ID } from "./url";
import axiosClient from "./index";
import Cookies from "js-cookie";

const login = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/auth/login`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const logout = async () => {
 let refreshToken = Cookies.get("refreshToken");
  return axios({
    method: "POST",
    url: API_URL + `/auth/logout`,
    data:{
      refreshToken: refreshToken
    }
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const onRegister = (data) => {
  console.log("data:", data);
  return axios({
    method: "POST",
    url: API_URL + `/auth/register`,
    data: {
      fullname: data.fullname,
      username: data.phone,
      password: data.password
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const loadUser = async () => {
  let username = Cookies.get("username");
  console.log("username:", username);
  return axiosClient()({
    method: "GET",
    url: API_URL + `/auth/find-by-username/${username}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const changePassword = async (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/auth/change-password`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const changePassword2 = async (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/auth/change-password2`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const  checkExistPhone = async (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/auth/check-existence/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export {
  onRegister,
  changePassword2,
  login,
  logout,
  loadUser,
  changePassword,
  checkExistPhone
};
