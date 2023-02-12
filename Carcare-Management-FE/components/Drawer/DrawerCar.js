import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Image,
  Button,
  Form,
  Select,
  Input,
  Drawer,
  Space,
  Divider,
  Typography,
  Table,
  TextArea,
} from "antd";
import { getCarbyCustomerId } from "pages/api/carAPI";
import Loading from "components/Loading";
import DrawerCarDetail from "./DrawerCarDetail";
import ModalAddCarWithCustomer from "components/Modal/ModalAddCarWithCustomer";
import { PlusCircleFilled } from "@ant-design/icons";

function DrawerCar({ id, show, handleCancel }) {
  const [cars, setCars] = useState([]);
  const [carDetail, setCarDetail] = useState({});
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalCar, setModalCar] = useState(false);

  const fetchCar = async () => {
    try {
      const res = await getCarbyCustomerId(id);
      setCars(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCar();
    }
  }, [id,modalCar]);

  const handleUpdate = () => {
    fetchCar();
  };
  const handleSuccessCreateCar = () => {
    fetchCar();
  };

  const columns = [
    {
      title: "MÃ",
      dataIndex: "carCode",
      key: "carCode",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Màu xe",
      dataIndex: "color",
      key: "color",
    },
  ];

  return (
    <>
      <Drawer
        width={600}
        placement="right"
        closable
        onClose={() => {
          handleCancel();
        }}
        open={show}
        extra={

          <Button
          icon={<PlusCircleFilled/>}
            type="primary"
            onClick={() => {
              setModalCar(true);
            }}
          > Thêm xe
          </Button>
        }
      >
        <Divider>
          <Typography.Title level={4}>Danh sách xe</Typography.Title>
        </Divider>

        <Row>
          <Col span={24}>
            <Table
              bordered
              columns={columns}
              dataSource={cars}
              pagination={false}
              scroll={{
                y: 425,
              }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    setCarDetail(record);
                    setShowDetail(true);
                  },
                };
              }}
            />
          </Col>
        </Row>
        <DrawerCarDetail
          show={showDetail}
          handleCancel={() => setShowDetail(false)}
          car={carDetail}
          onUpdate={() => handleUpdate()}
        />
      </Drawer>
      <ModalAddCarWithCustomer
        show={modalCar}
        handleCancel={() => setModalCar(false)}
        onSuccess={(data) => handleSuccessCreateCar(data)}
        customerId={id}
      />

      <Loading loading={loading} />
    </>
  );
}

export default DrawerCar;
