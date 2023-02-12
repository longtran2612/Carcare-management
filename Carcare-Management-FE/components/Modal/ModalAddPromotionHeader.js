import React from "react";
import { Modal, Form, Input, Row, Col, DatePicker } from "antd";
import { createPromotionHeader } from "pages/api/promotionHeaderAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification ,openNotificationWarning } from "utils/notification";
import moment from "moment";
const formatDate = "DD/MM/YYYY";

const ModalAddPromotionHeader = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      console.log(values);
      const res = await createPromotionHeader(values);
      openNotification(
        "Thành công",
        "tạo mới chương trình khuyến mãi thành công"
      );
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
        title="Thêm chương trình khuyến mãi mới"
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
                label="Tên chương trình khuyến mãi"
                name="description"
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
                name="fromDate"
                initialValue={moment()}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <DatePicker
                  disabledDate={(d) =>
                    !d ||
                    d.isBefore(moment()) ||
                    form.getFieldValue("toDate") && d.isAfter(form.getFieldValue("toDate"))
                  }
                  placeholder="bắt đầu"
                  format={formatDate}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Ngày kết thúc"
                name="toDate"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <DatePicker
                  disabledDate={(d) =>
                    !d || d.isBefore(form.getFieldValue("fromDate")) 
                  }
                  placeholder="kết thúc"
                  format={formatDate}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddPromotionHeader;
