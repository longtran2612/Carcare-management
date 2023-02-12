import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Typography, notification } from "antd";
import { LockOutlined, SmileOutlined } from "@ant-design/icons";
import { changePassword2 } from "pages/api/authAPI";
import Loading from "components/Loading";
import Cookies from "js-cookie";
import { openNotification, openNotificationWarning } from "utils/notification";

function ChangePassword() {
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (values) => {
    setLoading(true);
    const username = Cookies.get("username");
    let changePasswordRequets = {
      username: username,
      newPassword: values.password,
      oldPassword: values.oldPassword,
    };
    console.log(changePasswordRequets);
    try {
      const res = await changePassword2(changePasswordRequets);
      openNotification("thành công", "Đổi mật khẩu thành công");
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
      setLoading(false);
    }
  };
  return (
    <>
      <Row
        justify="space-around"
        align="middle"
        style={{
          textAlign: "center",
        }}
      >
        <Col
          span={20}
          xs={20}
          sm={20}
          md={20}
          lg={12}
          className="background-login-white"
          style={{
            padding: "50px",
            borderRadius: "10px",
          }}
        >
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            labelAlign="left"
            size={"middle"}
            wrapperCol={{ span: 18 }}
            onFinish={handleChangePassword}
          >
            <Form.Item
              label="Mật khẩu cũ"
              name="oldPassword"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Nhập vào mật cũ"
              />
            </Form.Item>
            <Form.Item
              label="Mật khẩu mới"
              dependencies={["oldPassword"]}
              name="password"
              hasFeedback
              rules={[
                {
                  pattern: new RegExp(
                          "^([0-9a-zA-Z]*[.!@$%^&(){}[]:;<>,.?/~_+-=|]*).{6,32}$"
                        ),
                  required: true,
                  message:
                    "Mật khẩu không hợp lệ! Mật khẩu bao gồm 6-32 ký tự bao gồm chữ, số và ký tự đặc biệt",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("oldPassword") != value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu mới không được trùng với mật khẩu cũ!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Nhập vào mật khẩu mới"
              />
            </Form.Item>
            <Form.Item
              label=" Xác nhận"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message:
                    "Mật khẩu không hợp lệ! Mật khẩu bao gồm 6-32 ký tự bao gồm chữ, số và ký tự đặc biệt",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Xác nhận mật khẩu phải trùng nhau!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Xác nhận mật khẩu"
              />
            </Form.Item>
            <Button
              className="btn-login center"
              type="primary
                            "
              htmlType="submit"
              loading={loading}
            >
              Thay đổi
            </Button>
          </Form>
        </Col>
      </Row>
      <Loading loading={loading} />
    </>
  );
}

export default ChangePassword;
