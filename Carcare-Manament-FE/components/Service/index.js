import React from "react";
import ServiceTable from "./ServiceTable";
import { Breadcrumb, Button, Col, Row } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
const ServicePage = () => {
  const router = useRouter();
  const { serviceId } = router.query;
  return (
    <>
      <Row style={{ paddingBottom: "7px" }}>
        <Col span={12}>
          <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
            <Breadcrumb.Item href="/admin">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href=""> Quản lý dịch vụ</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={12}>
          {serviceId && (
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
        <ServiceTable />
      </div>
    </>
  );
};
export default ServicePage;
