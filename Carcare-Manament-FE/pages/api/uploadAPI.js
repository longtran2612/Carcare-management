import axios from "axios";
import { API_URL } from "./url";

const uploadImage = async (data) => {
  return axios({
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: API_URL + "/upload",
    data: data,
  });
};

export { uploadImage };
