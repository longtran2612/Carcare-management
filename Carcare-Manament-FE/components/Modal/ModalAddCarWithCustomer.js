import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Form, Input, Select, Button } from "antd";
import { createCar } from "pages/api/carAPI";
import { getCarModel, getCarModelByBrand } from "pages/api/carModel";
import { validateMessages } from "utils/messageForm";
import { openNotification,openNotificationWarning } from "utils/notification";
import ModalAddCarModel from "./ModalAddCarModal";
import { getCustomers } from "pages/api/customerAPI";
import { PlusCircleOutlined } from "@ant-design/icons";

const ModalAddCarWithCustomer = ({
  customerId,
  show,
  onSuccess,
  handleCancel,
}) => {
  const [form] = Form.useForm();
  const [carModels, setCarModels] = useState([]);
  const [carModelName, setCarModelName] = useState("");
  const [modalCarModel, setModalCarModel] = useState(false);
  const [users, setUsers] = useState([]);
  const [brandSelected, setBrandSelected] = useState("");

  const [brands, setBrands] = useState([
    "Toyota",
    "VinFast",
    "Nissan",
    "Suzuki",
    "Subaru",
    "Lexus",
    "Audi",
    "Volkswagen",
    "Honda",
    "Volvo",
    "Hyundai",
    "Mazda",
    "KIA",
    "Mitsubishi",
    "Maserati",
    "Chevrolet",
    "Ford",
    "Mercedes-Benz",
    "BMW",
    "Cadillac",
  ]);

  const onFinish = async (values) => {
    const carModelName = carModels.find(
      (item) => item.carModelCode === values.carModel
    ).model;
    let dataCreate = {
      color: values.color,
      name:
        carModelName + " " + values.licensePlate + " " + (values.color || ""),
      carModel: values.carModel || null,
      licensePlate: values.licensePlate,
      customerId: customerId || values.customerId,
    };

    try {
      console.log(dataCreate);
      const res = await createCar(dataCreate);
      openNotification("Thành công", "Thêm mới xe thành công");
      handleCancel();
      onSuccess(res?.data?.Data);
      form.resetFields();
    } catch (error) {
      openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };
  const getCarModels = async () => {
    try {
      const res = await getCarModelByBrand(brandSelected);
      setCarModels(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
  const getUsersData = async () => {
    try {
      const res = await getCustomers();
      setUsers(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSuccessCarModel = async (data) => {
    await getCarModels();
    console.log(carModels);
    form.setFieldsValue({ carModel: data.carModelCode });
  };

  useEffect(() => {
    if (!customerId) {
      getUsersData();
    }
    getCarModels();
  }, [show, form, brandSelected]);

  return (
    <>
      <Modal
        title="Thêm xe"
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
        width={900}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
        >
          <Row gutter={[16, 4]}>
            <Col span={12}>
              <Form.Item
                label="Biển số xe"
                name="licensePlate"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Màu sắc" name="color">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                  },
                ]}
                label="Thương hiệu"
                name="brand"
              >
                <Select
                  showSearch
                  onChange={(value) => {
                    form.setFieldsValue({ carModel: undefined });
                    setBrandSelected(value);
                  }}
                  placeholder="Chọn thương hiệu"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {brands.map((brand) => (
                    <Option key={brand}>{brand}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                rules={[
                  {
                    required: true,
                  },
                ]}
                label="Model"
                name="carModel"
              >
                <Select
                  showSearch
                  placeholder="Chọn Model"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {carModels.map((carModel) => (
                    <Select.Option key={carModel.carModelCode}>
                      {carModel.model}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col style={{ display: "flex", alignItems: "center" }} span={2}>
              <Button
                icon={<PlusCircleOutlined />}
                type="primary"
                onClick={() => {
                  form.getFieldValue("brand") ?
                  setModalCarModel(true) : openNotification("Vui lòng chọn thương hiệu xe trước")}
                }
              ></Button>
            </Col>
            {!customerId && (
              <Col span={24}>
                <Form.Item
                  label="Người sở hữu"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name="customerId"
                >
                  <Select
                    showSearch
                    placeholder="Chọn Người sở hữu"
                    optionFilterProp="children"
                  >
                    {users.map((item, index) => {
                      return (
                        <Select.Option key={index} value={item.id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>
      <ModalAddCarModel
        brand={form.getFieldValue("brand")}
        show={modalCarModel}
        handleCancel={() => setModalCarModel(false)}
        onSuccess={(data) => handleSuccessCarModel(data)}
      />
    </>
  );
};

export default ModalAddCarWithCustomer;
