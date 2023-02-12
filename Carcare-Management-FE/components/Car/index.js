import React from "react";
import CarTable from "./CarTable";
import { Breadcrumb, Button, Col, Row } from "antd";
import { HomeOutlined, CarOutlined, RollbackOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
const CarPage = () => {
  const router = useRouter();
  const { carId } = router.query;
  return (
    <>
      <Row style={{ paddingBottom: "7px" }}>
        <Col span={12}>
          <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
            <Breadcrumb.Item href="/admin">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">
              <CarOutlined />
              <span>Quản lý xe khách hàng</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={12}>
          {carId && (
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
        <CarTable />
      </div>
    </>
  );
};
export default CarPage;
