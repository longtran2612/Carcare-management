import axios from "axios";

import { API_URL } from "./url";

const getPriceHeaders = () => {
    return axios({
      method: "GET",
      url: API_URL + `/price-headers`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  
  const getPriceHeaderById = (data) => {
    return axios({
      method: "GET",
      url: API_URL + `/price-headers/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const createPriceHeader = (data) => {
    return axios({
      method: "POST",
      url: API_URL + `/price-headers/create`,
      data: data,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const deletePriceHeader = (data) => {
    return axios({
      method: "POST",
      url: API_URL + `/price-headers/delete/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const updatePriceHeader = (data,id) => {
    return axios({
      method: "POST",
      url: API_URL + `/price-headers/update/${id}`,
      data: data,
    })

      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

  const activePriceHeader = (data) => {
    return axios({
      method: "POST",
      url: API_URL + `/price-headers/active/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const inActivePriceHeader = (data) => {
    return axios({
      method: "POST",
      url: API_URL + `/price-headers/inactive/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

export {activePriceHeader,inActivePriceHeader, getPriceHeaderById,updatePriceHeader, getPriceHeaders, createPriceHeader, deletePriceHeader };