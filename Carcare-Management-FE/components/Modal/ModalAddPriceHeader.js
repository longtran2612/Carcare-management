import React from "react";
import { Modal, Form, Input, Row, Col, DatePicker } from "antd";
import { createPriceHeader } from "pages/api/PriceHeaderAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification ,openNotificationWarning} from "utils/notification";
import moment from "moment";
const { TextArea } = Input;
const formatDate = "DD/MM/YYYY";

const ModalAddPriceHeader = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      const res = await createPriceHeader(values);
      openNotification("Thành công", "tạo mới bảng giá thành công");
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
        title="Thêm bảng giá mới"
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
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Tên bảng giá"
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
                label="Ngày bắt đầu"
                name="effectiveDate"
                rules={[
                  {
                    required: true,
                  },
                ]}
                initialValue={moment()}
              >
                <DatePicker
                  disabledDate={(d) =>
                    !d ||
                    d.isBefore(moment()) ||
                    form.getFieldValue("expirationDate") && d.isAfter(form.getFieldValue("expirationDate"))
                  }
                  placeholder="bắt đầu"
                  format={formatDate}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Ngày kết thúc"
                name="expirationDate"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <DatePicker
                  disabledDate={(d) =>
                    !d || d.isBefore(form.getFieldValue("effectiveDate"))
                  }
                  placeholder="kết thúc"
                  format={formatDate}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddPriceHeader;
