import React, { useState, useEffect } from "react";
import { Tabs, Layout, Button, Col, Row, Select } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import ServiceCustomer from "components-customer/Service";
import Loading from "components/Loading";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { CustomerNavigation } from "components-customer/navigation";
const { Option } = Select;

export default function CustomerOrderPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [accessToken, setAccessToken] = useState(Cookies.get("accessToken"));

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, [accessToken]);
  return (
    <>
      {" "}
      <CustomerNavigation />{" "}
      <Layout.Content
        style={{
          padding: "1rem",
          backgroundColor: "#EAE3E3",
        }}
      >
        <Row style={{ borderRadius: "5px", backgroundColor: "white" }}>
          <Col xs={24} sm={24} md={24} lg={4} xl={4}>
            <Button
              type="dashed"
              style={{
                paddingLeft: "20px",
                marginTop: "10px",
                marginLeft: "15px",
              }}
              onClick={() => router.push("/customer")}
              icon={<RollbackOutlined />}
            >
              Trở lại
            </Button>
          </Col>
          <Col xs={1} sm={1} md={1} lg={6} xl={6}></Col>
          <Col xs={22} sm={22} md={22} lg={4} xl={4}>
            <Select
              placeholder="Trạng thái"
              style={{
                marginTop: "10px",
                width: "100%",
              }}
              onChange={(value) => setStatus(value)}
              value={status}
            >
              <Option value={null}>Tất cả</Option>
              <Option value={0}>Chờ xử lý</Option>
              <Option value={10}>Đã hoàn thành</Option>
              <Option value={2}>Đang xử lý</Option>
              <Option value={-100}>Đã hủy</Option>
              {/* <Option value={100}>Đã xuất hóa đơn</Option> */}
            </Select>
          </Col>

          <Col span={24}>
            <div
              style={{
                margin: "0.4rem",
                padding: "1.5rem",
                minHeight: "75vh",
              }}
            >
              <ServiceCustomer status={status} />
            </div>
          </Col>
        </Row>
      </Layout.Content>
      <Loading loading={loading} />
    </>
  );
}
