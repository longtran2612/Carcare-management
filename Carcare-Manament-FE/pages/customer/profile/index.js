import React, { useState, useEffect } from "react";
import { Tabs, Layout, Button, Col, Row } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { ProfileCustomer } from "components-customer/Profile";
import ChangePassword from "components-customer/ChangePassword";
import Cookies from "js-cookie";
import { CustomerNavigation } from "components-customer/navigation";
import Loading from "components/Loading";
import { useRouter } from "next/router";
import CarCustomer from "components-customer/Car";
import StatisticCustomer from "components-customer/statistic";

export default function CustomerProfilePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(Cookies.get("accessToken"));
  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, [accessToken]);
  return (
    <>
      <CustomerNavigation />
      <Layout.Content
        style={{
          padding: "1rem",
          backgroundColor: "#EAE3E3",
        }}
      >
        <Row>
          <Col
            style={{ borderRadius: "5px", backgroundColor: "white" }}
            span={24}
          >
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
            <div
              style={{
                margin: "0.4rem",
                padding: "1.5rem",
                minHeight: "75vh",
              }}
            >
              <Tabs defaultActiveKey={1}>
                <Tabs.items tab="Thông tin cá nhân" key="1">
                  <ProfileCustomer />
                </Tabs.items>
                <Tabs.items tab="Thống kê chi tiêu" key="4">
                  <StatisticCustomer />
                </Tabs.items>
                <Tabs.items tab="Xe của tôi" key="2">
                  <CarCustomer />
                </Tabs.items>
                <Tabs.items tab="Đổi mật khẩu" key="3">
                  <ChangePassword />
                </Tabs.items>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Layout.Content>
      <Loading loading={loading} />
    </>
  );
}
