import React, { useState, useEffect } from "react";
import { Tabs, Layout, Modal } from "antd";
import { Features } from "components-customer/features";
import { CustomerNavigation } from "components-customer/navigation";
import MyFooter from "components/Footer";
import Loading from "components/Loading";
import { loadUser } from "pages/api/authAPI";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import ModalChangePassword from "components/Modal/ModalChangePassword";
export default function CustomerPage() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [accessToken, setAccessToken] = useState(Cookies.get("accessToken"));

  const [showModalChangePassword, setShowModalChangePassword] = useState(false);

  const handleAuthentication = async () => {
    if (accessToken == null) {
      router.push("/login");
      setLoading(false);
      return;
    }
    try {
      const res = await loadUser();

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
      content: (
        <>Vì lý do bảo mật! Xin vui lòng đổi mật khẩu ({secondsToGo}) </>
      ),
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: (
          <>Vì lý do bảo mật! Xin vui lòng đổi mật khẩu ({secondsToGo})</>
        ),
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    }, secondsToGo * 1000);
  };

  return (
    <>
      <CustomerNavigation />
      <Layout.Content className="background-customer">
        <Features />
      </Layout.Content>
      {/* <MyFooter/> */}
      <ModalChangePassword
        show={showModalChangePassword}
        handleCancel={() => setShowModalChangePassword(false)}
        onFinish={() => setShowModalChangePassword(false)}
      />
      <Loading loading={loading} />
    </>
  );
}
