import React from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
// import OrderTable from "./OrderTable";
import BillTable from "./BillTable";
const BillPage = () => {
  return (
    <>
     <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Quản lý hóa đơn</Breadcrumb.Item>
      </Breadcrumb>
      <BillTable />
    </>
  );
};
export default BillPage;
