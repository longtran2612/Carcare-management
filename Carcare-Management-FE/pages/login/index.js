import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { Typography, Divider } from "antd";
import {
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Form, Input, Button, Col, Row, message, Space } from "antd";
import { useRouter } from "next/router";
import { setLogin } from "redux/slices/authSlice";
import { login } from "pages/api/authAPI";
import Loading from "components/Loading";
import logo from "public/images/logo.png";
import Image from "next/image";
import Cookies from "js-cookie";
import { getCustomerByPhone } from "pages/api/customerAPI";
import { openNotificationWarning } from "utils/notification";

export default function LoginPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);


  const router = useRouter();

  const onFinish = async (values)=>{
    setLoading(true);
    console.log(values);
    try{
      const res = await login(values);
      dispatch(setLogin(res.data.Data));
      if(res.data.Data.roles === "ROLE_CUSTOMER"){
        router.push("/customer");
        const customer = await getCustomerByPhone(res.data.Data.username);
        Cookies.set("id", customer.data.Data.id);
      }
      if(res.data.Data.roles  == "ROLE_USER" || res.data.Data.roles  == "ROLE_ADMIN"){
        router.push("/admin");
      }
      setLoading(false);
    }catch(error){
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
      setLoading(false);
    }

  }

  return (
    <>
      {/* <div class="container"> */}
      <Row
        justify="space-around"
        align="middle"
        className="background-login"
        style={{
          height: "100vh",

          textAlign: "center",
        }}
      >
        <Col
         className="background-login-white"
          span={18}
          xs={18}
          sm={18}
          md={18}
          lg={10}
          style={{
           
            padding: "50px",
            borderRadius: "10px",
          }}
        >
          <Row justify="center">
            <Typography.Title
              level={1}
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#1890ff",
              }}
            >
              Đăng nhập
            </Typography.Title>
            {"   "}
            <Image width={100} height={100} src={logo} alt="logo" />
          </Row>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            labelAlign="left"
            size={"middle"}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Số điện thoại"
              name="username"
              rules={[
                {
                  pattern: new RegExp("^(84|0[3|5|7|8|9])+([0-9]{8})$"),
                  required: true,
                  message:
                    "Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 ký tự số bắt đầu là 84 hoặc 03, 05, 07, 08, 09",
                },
              ]}
            >
              <Input
                maxLength={10}
                minLength={10}
                prefix={<PhoneOutlined className="site-form-item-icon" />}
                placeholder="Nhập vào số điện thoại"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  pattern: new RegExp(
                    "^([0-9a-zA-Z]*[.!@$%^&(){}[]:;<>,.?/~_+-=|]*).{6,32}$"
                  ),
                  required: true,
                  message:
                    "Mật khẩu không hợp lệ! Mật khẩu bao gồm 6-32 ký tự bao gồm chữ, số và ký tự đặc biệt",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Nhập vào mật khẩu"
              />
            </Form.Item>
            <Button
              className="btn-login"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form>
          <Divider />
          {/* Chưa có tài khoản?<Link href="/registry"> Đăng ký</Link>
          <br /> */}
          Quên mật khẩu?<Link href="/forgot-password"> Lấy lại mật khẩu</Link>
          {/* <p className="text-center"> Hoặc đăng nhập bằng</p>
          <div className="logo_sign-up">
            <div className="block-google block">
              <div className="icon-login">
                <GoogleOutlined style={{ fontSize: "30px" }} />
              </div>
              <div className="text-button">
                <span>Đăng nhập với Google</span>
              </div>
            </div>
       
            <div className="block-facebook block">
              <div className="icon-login">
                <FacebookOutlined style={{ fontSize: "30px" }} />
              </div>
              <div className="text-button">
                <span>Đăng nhập với Facebook</span>
              </div>
            </div>
          </div> */}
        </Col>
      </Row>
      <Loading loading={loading} />
    </>
  );
}
