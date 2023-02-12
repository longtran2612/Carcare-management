import axios from "axios";

import { API_URL } from "./url";

const getUserGroup = (data) => {
    return axios({
      method: "GET",
      url: API_URL + `/user-groups`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  
  const getUserGroupById = (data) => {
    return axios({
      method: "GET",
      url: API_URL + `/user-groups/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const createUserGroup = (data) => {
    return axios({
      method: "POST",
      url: API_URL + `/user-groups`,
      data: data,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const deleteUserGroup = (data) => {
    return axios({
      method: "DELETE",
      url: API_URL + `/user-groups/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

export { getUserGroup, getUserGroupById, createUserGroup,deleteUserGroup };