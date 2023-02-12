import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Button,
  Image,
  Form,
  Select,
  Input,
  Drawer,
  Space,
  Divider,
  Upload,
  Typography,
  Table,
} from "antd";
// import Image from "next/image";
import { uploadImage } from "pages/api/uploadAPI";
import { UploadOutlined } from "@ant-design/icons";
import { getCarModelByBrand } from "pages/api/carModel";
import { updateCar } from "pages/api/carAPI";
import { openNotification, openNotificationWarning } from "utils/notification";
import Loading from "components/Loading";
import ModalUploadImage from "components/Modal/ModalUploadImage";
const { TextArea } = Input;
const { Title } = Typography;

function DrawerCarDetail({ car, show, onUpdate, handleCancel }) {
  const [form] = Form.useForm();
  const [carDetail, setCarDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [carModels, setCarModels] = useState([]);
  const [brandSelected, setBrandSelected] = useState("");

  const [modalUpload, setModalUpload] = useState(false);

  const [imageS3, setImageS3] = useState(null);
  const [listFiles, setListFiles] = useState({
    images: [],
    imageBlob: [],
  });

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
  ]);

  const fetchCarModel = async (brand) => {
    try {
      const res = await getCarModelByBrand(brand);
      setCarModels(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (values) => {
    const carModel = carModels.find(
      (c) => c.carModelCode === values.carModelCode
    );
    console.log(carModel);
    let body = {
      name:
        (carModel?.brand || "") +
        " " +
        values.licensePlate +
        " " +
        (values.color || ""),
      color: values.color,
      licensePlate: values.licensePlate,
      carModel: values.carModelCode,
      // imageUrl: imageS3 || carDetail?.imageUrl,
    };
    try {
      console.log(body);
      const res = await updateCar(body, carDetail?.id);
      onUpdate();
      handleCancel();
      openNotification("Thành công", "Cập nhật xe thành công");
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };

  const handleFileChosen = (info) => {
    const result = info.fileList.map((file) => {
      const blob = new Blob([file.originFileObj], {
        type: file.type,
      });
      return (window.URL || window.webkitURL).createObjectURL(blob);
    });
    setListFiles({ images: info.fileList, imageBlob: result });
    setModalUpload(true);
  };

  const handleUpdateImage = async (imageUpload) => {
    let body = {
      imageUrl: imageUpload,
    };
    try {
      const res = await updateCar(body, carDetail?.id);
      onUpdate();
      openNotification("Thành công!", "Cập nhật ảnh xe thành công");
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };

  const handleUploadImages = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      listFiles.images.map((image) => {
        formData.append("files", image.originFileObj);
      });
      const response = await uploadImage(formData);
      setImageS3(response.data.Data[0]);
      setCarDetail((prevState) => {
        return { ...prevState, imageUrl: response.data.Data[0] };
      });
      setListFiles({ images: [], imageBlob: [] });
      openNotification("Thành công", "Tải ảnh lên thành công");
      handleUpdateImage(response.data.Data[0]);
      setModalUpload(false);
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

  useEffect(() => {
    if (car) {
      setCarDetail(car);
      setBrandSelected(car?.brand);

      form.setFieldValue("name", car.name);
      form.setFieldValue("color", car.color);
      form.setFieldValue("carModelCode", car.carModelCode);
      form.setFieldValue("brand", car.brand);
      form.setFieldValue("licensePlate", car.licensePlate);
      form.setFieldValue("description", car.description);
    }
  }, [show]);

  useEffect(() => {
    fetchCarModel(form.getFieldValue("brand"));
  }, [form, brandSelected]);

  return (
    <>
      <Drawer
        width={500}
        placement="right"
        closable
        onClose={() => {
          handleCancel();
        }}
        open={show}
        extra={
          <Space>
            <Button onClick={() => handleCancel()}>Hủy</Button>
            <Button
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    onFinish(values);
                  })
                  .catch((info) => {
                    console.log("Validate Failed:", info);
                  });
              }}
              type="primary"
            >
              Lưu
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form form={form} layout="vertical" autoComplete="off">
            <Row gutter={10}>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
                span={24}
              >
                <Image width={170} height={170} src={carDetail.imageUrl} />
              </Col>
              <Col
                style={{
                  marginTop: "3px",
                  display: "flex",
                  justifyContent: "center",
                }}
                span={24}
              >
                <div>
                  <Upload
                    onChange={(info) => handleFileChosen(info)}
                    maxCount={1}
                    listType="picture"
                    accept="image/*"
                    showUploadList={false}
                    fileList={listFiles.imageBlob}
                  >
                    <Button icon={<UploadOutlined />}>Tải hình lên</Button>
                  </Upload>
                </div>
              </Col>
              <Col span={18}>
                <Form.Item label="Tên xe" name="name">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
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
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  label="Hãng xe"
                  name="brand"
                >
                  <Select
                    showSearch
                    placeholder="Chọn hãng xe"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                    onChange={(value) => {
                      setBrandSelected(value);
                      form.setFieldsValue({ carModelCode: undefined });
                    }}
                  >
                    {brands.map((brand) => (
                      <Option key={brand}>{brand}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  label="Model"
                  name="carModelCode"
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
              <Col span={24}>
                <Form.Item label="Màu sắc" name="color">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Mô tả" name="description">
                  <TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Form>
      </Drawer>
      <ModalUploadImage
        visible={modalUpload}
        handleCancel={() => setModalUpload(false)}
        handleOk={() => handleUploadImages()}
        listImage={listFiles.imageBlob}
      />

      <Loading loading={loading} />
    </>
  );
}

export default DrawerCarDetail;
