import React from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import CategoryTable from "./CategoryTable";

const CategoryPage = () => {
  return (
    <>
       <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href=""> {" "}Quản lý danh mục dịch vụ</Breadcrumb.Item>
      </Breadcrumb>
      <div className="content-white-admin">
      <CategoryTable />
      </div>
    </>
  );
};
export default CategoryPage;
