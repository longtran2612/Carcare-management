import axios from "axios";
import moment from "moment";

import { API_URL } from "./url";
const dateFormat = "DD/MM/YYYY";

const handleType = (data) => {
  console.log(data);
  let fromDate = moment(data.fromDate).format("DD/MM/YYYY");
  let toDate = moment(data.toDate).format("DD/MM/YYYY");

  switch (data?.reportType) {
    case 0:
      return "bao_cao_tong_hop_"+fromDate+"-"+toDate+".xlsx";
    case 1:
      return "bang_ke_hoa_don_huy_"+fromDate+"-"+toDate+".xlsx";
    case 2:
      return "doanh_so_theo_ngay("+fromDate+"-"+toDate+".xlsx";
    case 3:
      return "doanh_so_theo_khach_hang_"+fromDate+"-"+toDate+".xlsx";
    case 4:
      return "tong_ket_khuyen_mai_"+fromDate+"-"+toDate+".xlsx";
  }
};

const getReport = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/report/get-report-in-range-date`,
    data: data,
    responseType: "blob",
  })
    .then((res) => {
      console.log(res);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        handleType(data)
      );
      document.body.appendChild(link);
      link.click();
      return res;
    })
    .catch((err) => {
      throw err;
    });
};


const getSaleReportByDate = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/report/get-sales-by-date-report`,
  data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getSaleReportByCustomer = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/report/get-sales-by-customer-report`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getPromotionReport = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/report/get-promotion-report`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getCancelBillReport = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/report/get-canceled-bill-report`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};


export { getReport, getSaleReportByDate, getSaleReportByCustomer, getPromotionReport, getCancelBillReport };
