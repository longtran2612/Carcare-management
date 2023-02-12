import { Card, Row, Col, Typography, Modal } from "antd";
import { getCarSlots } from "pages/api/carSlotApi";
import React, { useState, useEffect, useRef } from "react";
const formatDate = "HH:mm:ss DD/MM/YYYY ";
import Loading from "components/Loading";
import slot_active from "public/images/slot_active.gif";
import slot_available from "public/images/slot_available.png";
import slot_unavailable from "public/images/slot_unavailable.png";
import Image from "next/image";
import { executeCarSlot } from "pages/api/carSlotApi";
import { openNotification ,openNotificationWarning } from "utils/notification";

const { Title } = Typography;

function ModalSelectSlot({ onSelectOrder, show, onSuccess, handleCancel }) {
  const [loading, setLoading] = useState(false);

  const [carSlots, setCarSlots] = useState([]);

  const onFinish = async (values) => {
    setLoading(true);
    console.log(values);
    let data = {
      carSlotId: values,
      orderId: onSelectOrder,
    };
    console.log(data);
    try {
      const response = await executeCarSlot(data);
      openNotification(
        "Thành công!",
        "Bắt đầu sử lý yêu cầu ở vị trí: " +
          carSlots.find((item) => item.id === values).name
      );
      handleCancel();
      onSuccess();
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning( "có lỗi xảy ra");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarSlots();
  }, []);

  const fetchCarSlots = async () => {
    setLoading(true);
    try {
      const response = await getCarSlots();
      setCarSlots(response.data.Data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const convertStatusCarSlotImg = (status) => {
    switch (status) {
      case "UNAVAILABLE":
        return <Image height={120} width={120} src={slot_unavailable} />;
      case "AVAILABLE":
        return <Image height={120} width={120} src={slot_available} />;
      case "IN_USE":
        return <Image height={120} width={120} src={slot_active} />;
      default:
        break;
    }
  };
  const handleCss = (status) => {
    switch (status) {
      case "IN_USE":
        return {
          backgroundColor: "#002140",
          color: "white",
          height: "20px",
          justifyContent: "center",
          alignContent: "center",
          textAlign: "center",
          fontSize: "15px",
        };
      case "AVAILABLE":
        return {
          backgroundColor: "#004d00",
          color: "white",
          height: "20px",
          justifyContent: "center",
          alignContent: "center",
          textAlign: "center",
          fontSize: "15px",
        };
      case "UNAVAILABLE":
        return {
          backgroundColor: "#b38600",
          color: "white",
          height: "20px",
          justifyContent: "center",
          alignContent: "center",
          textAlign: "center",
          fontSize: "15px",
        };
    }
  };

  return (
    <>
      <Modal
        title="Chọn vị trí xử lý xe"
        visible={show}
        onCancel={handleCancel}
        width={900}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Row style={{ backgroundColor: "#C5C5C5" }} gutter={[16]}>
          {carSlots?.map((carSlot) => {
            return (
              <Col
                key={carSlot.id}
                xs={24}
                sm={24}
                md={8}
                lg={6}
                style={{ marginBottom: "10px" }}
                onClick={() => {
                  if (carSlot.status === "AVAILABLE") {
                    onFinish(carSlot.id);
                  } else {
                    openNotification("Vui lòng chọn vị trí trống!");
                  }
                }}
              >
                <Card
                  headStyle={handleCss(carSlot.status)}
                  style={
                    carSlot.status === "AVAILABLE"
                      ? {
                          margin: "10px",
                          borderRadius: "20px",
                          overflow: "hidden",
                          cursor: "pointer",
                          height: "200px",
                        }
                      : {
                          margin: "10px",
                          borderRadius: "20px",
                          overflow: "hidden",
                          cursor: "pointer",
                          height: "200px",
                          pointerEvents: "none",
                        }
                  }
                  hoverable={carSlot.status === "AVAILABLE" ? true : false}
                  title={carSlot.name}
                  bordered={false}
                >
                  {/* {carSlot.status == "IN_USE" && ( */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                      pointerEvents: "none",
                    }}
                  >
                    {convertStatusCarSlotImg(carSlot.status)}
                  </div>
                  {/* )}
                  {carSlot.status == "AVAILABLE" && (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignContent: "center",
                        }}
                      >
                        {convertStatusCarSlotImg(carSlot.status)}
                      </div>
                    </div>
                  )} */}
                </Card>
              </Col>
            );
          })}
        </Row>
      </Modal>

      <Loading loading={loading} />
    </>
  );
}

export default ModalSelectSlot;
