import React from "react";
import { Modal, Typography } from "antd";

const ModalQuestion = ({ visible, handleCancel, handleOk, title }) => {
  return (
    <>
      <Modal
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Typography.Title level={4}>{title}</Typography.Title>
      </Modal>
    </>
  );
};

export default ModalQuestion;
