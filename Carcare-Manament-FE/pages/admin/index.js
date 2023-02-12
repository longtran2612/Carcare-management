import { Affix, Col, Layout, Row, Space, Typography, Modal } from "antd";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import MyHeader from "components/Header";
import SideBar from "components/SideBar";
import MyContent from "components/Content";
import { loadUser } from "pages/api/authAPI";
import Loading from "components/Loading";
import ModalChangePassword from "components/Modal/ModalChangePassword";
const { Content, Sider, Footer } = Layout;

const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState("1");
  const [loading, setLoading] = useState(false);

  const [showModalChangePassword, setShowModalChangePassword] = useState(false);

  const router = useRouter();

  const handleAuthentication = async () => {
    setLoading(true);
    let accessToken = Cookies.get("accessToken");
    console.log(accessToken);
    if (accessToken == null) {
      router.push("/login");
      setLoading(false);
      return;
    }
    try {
      const res = await loadUser();
      if (
        res.data.Data.roles == "ROLE_USER" ||
        res.data.Data.roles == "ROLE_ADMIN"
      ) {
        router.push("/admin");
      } else {
        router.push("/home");
      }
      console.log(res.data.Data);
      if (res?.data?.Data?.loginBefore === false) {
        setShowModalChangePassword(true);
        countDown();
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    handleAuthentication();
  }, []);

  const countDown = () => {
    let secondsToGo = 30;
    const modal = Modal.success({
      title: "Chào mừng bạn đến với LVCARCARE",
      content: <>Vì lý do bảo mật! Xin vui lòng đổi mật khẩu ({secondsToGo}) </>,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: <>Vì lý do bảo mật! Xin vui lòng đổi mật khẩu ({secondsToGo})</>,
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    }, secondsToGo * 1000);
  };

  useEffect(() => {}, []);

  return (
    <>
      <Layout
        style={{
          minHeight: "70vh",
        }}
      >
        <Sider
          className="site-layout-background"
          collapsible
          onCollapse={(value) => setCollapsed(value)}
          theme="dark"
          style={{
            overflow: "hidden",
            height: "100vh",
            // position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Affix style={{ top: 0, left: 0 }}>
          <SideBar
            // collapsed={collapsed}
            handleOpenKey={(key) => setKey(key)}
          />
          </Affix>
        </Sider>
        <Layout
        
          className="site-layout"
        >
          <Affix style={{ top: 0, left: 0 }}>
            <MyHeader />
          </Affix>
          <Content
            className="site-layout-background content"
            style={{
              minHeight: "78vh",
            }}
          >
            <MyContent keyMenu={key} />
          </Content>
          {/* <Footer style={{ backgroundColor: "white", textAlign: "center" }}>
            <Row justify="center">©2022 Coppy right by VL-CARCARE</Row>
          </Footer> */}
        </Layout>
      </Layout>
      <ModalChangePassword
        show={showModalChangePassword}
        handleCancel={() => setShowModalChangePassword(false)}
        onFinish={() => setShowModalChangePassword(false)}
      />
      <Loading loading={loading} />
    </>
  );
};

export default AdminPage;
