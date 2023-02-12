import React from "react";
import { Breadcrumb, Button, Col, Row } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import OrderNotRequestTable from "./OrderNotRequestTable";

const OrderNotRequestPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  return (
    <>
      <Row style={{ paddingBottom: "7px" }}>
        <Col span={12}>
          <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
            <Breadcrumb.Item href="/admin">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">Quản lý đơn hàng</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={12}>
          {orderId && (
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
      <div style={{padding:0}}>
        <OrderNotRequestTable />
      </div>
    </>
  );
};
export default OrderNotRequestPage;
