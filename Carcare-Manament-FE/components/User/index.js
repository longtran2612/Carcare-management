import React from "react";
import UserTable from "./UserTable";
import { Breadcrumb, Button, Col, Row } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
const UserPage = () => {
  const router = useRouter();
  const { userId } = router.query;

  return (
    <>
      <Row style={{ paddingBottom: "7px" }}>
        <Col span={12}>
          <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
            <Breadcrumb.Item href="/admin">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">
              <UserOutlined /> Quản lý nhân viên
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={12}>
          {userId && (
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
        <UserTable />
      </div>
    </>
  );
};
export default UserPage;
