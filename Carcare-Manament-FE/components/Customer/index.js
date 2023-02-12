import React from "react";
import { Breadcrumb, Button, Col, Row } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import CustomerTable from "./CustomerTable";

const CustomerPage = () => {
  const router = useRouter();
  const { customerId } = router.query;
  return (
    <>
      <Row style={{ paddingBottom: "7px" }}>
        <Col span={12}>
          <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
            <Breadcrumb.Item href="/admin">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">
              <UserOutlined /> Quản lý khách hàng
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={12}>
          {customerId && (
            <Button
              style={{ float: "right" }}
              icon={<RollbackOutlined />}
              onClick={() => router.back()}
            >
              Trở lại
            </Button>
          )}
        </Col>
      </Row>

      <div className="content-white-admin">
        <CustomerTable />
      </div>
    </>
  );
};
export default CustomerPage;
