import React from "react";
import CarModelTable from "./CarModelTable";
import { Breadcrumb, Button, Col, Row } from "antd";
import { HomeOutlined, CarOutlined, RollbackOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
const CarModelPage = () => {
  const router = useRouter();
  const { carModelId } = router.query;
  return (
    <>
      <Row style={{ paddingBottom: "7px" }}>
        <Col span={12}>
          <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
            <Breadcrumb.Item href="/admin">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">
              <CarOutlined /> Quản lý mẫu xe
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={12}>
          {carModelId && (
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
        <CarModelTable />
      </div>
    </>
  );
};
export default CarModelPage;
