import React from "react";
import { Modal ,Image } from "antd";

const ModalUploadImage = ({ visible, handleCancel, handleOk, listImage }) => {
  return (
    <Modal
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Hủy bỏ"
    >
      <div >
        {listImage?.map((image, index) => {
          return (
            <div style={{display:'flex' ,alignContent:"center",justifyContent:'center'}}  key={index}>
              {/* <img src={image} /> */}
              <Image width={200} height={200} src={image} />
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default ModalUploadImage;
