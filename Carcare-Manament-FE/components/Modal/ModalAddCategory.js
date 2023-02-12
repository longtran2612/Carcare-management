import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  DatePicker,
} from "antd";
import { createCategory } from "pages/api/categoryAPI";

import { validateMessages } from "utils/messageForm";
import { openNotification ,openNotificationWarning } from "utils/notification";
const { TextArea } = Input;

const ModalAddCategory = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const res = await createCategory(values);
      openNotification("Thành công", "Tạo mới danh mục thành công");
      handleCancel();
      onSuccess(res?.data?.Data);
      form.resetFields();
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };

  return (
    <>
      <Modal
        title="Thêm danh mục dịch vụ mới"
        visible={show}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              onFinish(values);
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
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
        >
          <Row>
            <Col span={16} className='MarRight20'>
              <Form.Item
                label="Tên danh mục"
                name="name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Loại doanh mục"
                name="type"
                rules={[
                  {
                    required: true,
                  },
                ]}
                initialValue="NEW"
              >
                <Select style={{width:'100%'}}>
                  <Option value="NORMAL">Thường</Option>
                  <Option value="NEW">Mới</Option>
                  <Option value="LIKE">Yêu thích</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddCategory;
