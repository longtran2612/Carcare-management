import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Modal,
  Typography,
  notification,
} from "antd";
import { LockOutlined, SmileOutlined } from "@ant-design/icons";
import { changePassword } from "pages/api/authAPI";
import Loading from "components/Loading";
import Cookies from "js-cookie";
import { openNotification, openNotificationWarning } from "utils/notification";

function ModalChangePassword({ show, onFinish, handleCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (values) => {
    setLoading(true);
    if(values.password ==='123456'){
      openNotificationWarning("Mật khẩu mới không được trùng với mật khẩu cũ");
      setLoading(false);
      return;
    }
    const username = Cookies.get("username");
    let changePasswordRequets = {
      username: username,
      newPassword: values.password,
    };
    console.log(changePasswordRequets);
    try {
      const res = await changePassword(changePasswordRequets);
      openNotification("thành công", "Đổi mật khẩu thành công");
      setLoading(false);
      onFinish();
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
      <Modal
        title="Thay đổi mật khẩu"
        visible={show}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleChangePassword(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        onCancel={handleCancel}
        width={700}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
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
            lg={20}
            style={{
              borderRadius: "10px",
            }}
          >
            <Row justify="center">
              <Typography.Title
                level={3}
                style={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#1890ff",
                }}
              >
                Đổi mật khẩu
              </Typography.Title>
              {"   "}
            </Row>
            <Form
              form={form}
              autoComplete="off"
              labelCol={{ span: 6 }}
              labelAlign="left"
              size={"middle"}
              wrapperCol={{ span: 18 }}
            >
              <Form.Item
                label="Mật khẩu mới"
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
            </Form>
          </Col>
        </Row>
      </Modal>
      <Loading loading={loading} />
    </>
  );
}

export default ModalChangePassword;
