import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Image,
  Button,
  Form,
  Typography,
  Input,
  Timeline,
  Upload,
  InputNumber,
  Popconfirm,
  Select,
} from "antd";
import { useRouter } from "next/router";
import { getCarModelByBrand } from "pages/api/carModel";
import { uploadImage } from "pages/api/uploadAPI";
import { openNotification, openNotificationWarning } from "utils/notification";
import { getCarByCode, updateCar } from "pages/api/carAPI";
import { validateMessages } from "utils/messageForm";
import ModalUploadImage from "components/Modal/ModalUploadImage";
import { PlusCircleOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import Loading from "components/Loading";
const { Title } = Typography;

const CarDetail = ({ carId, onUpdateCar }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [carDetail, setCarDetail] = useState({});
  const [carModels, setCarModels] = useState([]);
  const [modalUpload, setModalUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageS3, setImageS3] = useState(null);
  const [listFiles, setListFiles] = useState({
    images: [],
    imageBlob: [],
  });
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
  ]);
  const fetchcarDetail = async () => {
    setLoading(true);
    try {
      const response = await getCarByCode(carId);
      setCarDetail(response.data.Data);
      console.log(response.data.Data);
      form.setFieldsValue({
        id: response.data.Data.id,
        carCode: response.data.Data.carCode,
        name: response.data.Data.name,
        color: response.data.Data.color,
        licensePlate: response.data.Data.licensePlate,
        description: response.data.Data.description,
        brand: response.data.Data.brand,
        model: response.data.Data.model,
        engine: response.data.Data.engine,
        transmission: response.data.Data.transmission,
        seats: response.data.Data.seats,
        fuel: response.data.Data.fuel,
        year: response.data.Data.year,
        imageUrl: response.data.Data.imageUrl,
        customerName: response.data.Data.customerName,
        customerPhoneNumber: response.data.Data.customerPhoneNumber,
        customerCode: response.data.Data.customerCode,
        carModelCode: response.data.Data.carModelCode,
      });
      setBrandSelected(response.data.Data.brand);
      setLoading(false);
    } catch (error) {
      openNotificationWarning("Đã có lỗi xảy ra");
      setLoading(false);
    }
  };
  const fetchCarModel = async (brand) => {
    try {
      const res = await getCarModelByBrand(brand);
      setCarModels(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (carId) {
      fetchcarDetail();
    }
  }, [carId]);

  useEffect(() => {
    fetchCarModel(form.getFieldValue("brand"));
  }, [form, brandSelected]);

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
      openNotification("Thành công", "Cập nhật xe thành công");
      onUpdateCar();
      fetchcarDetail();
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };
  // handle upload image

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

  return (
    <>
      <Row gutter={[4, 4]}>
        <Col span={6}>
          <Image width={300} height={250} src={carDetail.imageUrl} />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
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
          <div
            className="content-white"
            style={{
              marginTop: "20px",
              justifyContent: "center",
            }}
          >
            <Title style={{ textAlign: "center" }} level={4}>
              Người sở hữu
            </Title>
            <Timeline style={{ marginTop: "20px" }}>
              <Timeline.Item>Tên: {carDetail?.customerName}</Timeline.Item>
              <Timeline.Item>
                Số điện thoại: {carDetail?.customerPhoneNumber}
              </Timeline.Item>
              <Timeline.Item>Mã: {carDetail?.customerCode}</Timeline.Item>
            </Timeline>
          </div>
        </Col>

        <Col span={18}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Row gutter={30}>
              <Col span={18}>
                <Form.Item label="Tên xe" name="name">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Mã xe"
                  name="carCode"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input disabled="true" />
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
              <Col span={6}>
                <Form.Item label="Màu sắc" name="color">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
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
              <Col span={6}>
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
              <Col span={6}>
                <Form.Item label="Dung tích" name="engine">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Truyền động" name="transmission">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Số chỗ" name="seats">
                  <InputNumber disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Nhiên liệu" name="fuel">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Mô tả" name="description">
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Row className="PullRight">
              <div
                style={{ bottom: "0", right: "20px", margin: "10px" }}
                className="service-action"
              >
                <div>
                  <Popconfirm
                    title="Cập nhật?"
                    placement="topLeft"
                    okText="Xác nhận"
                    cancelText="Hủy"
                    onConfirm={() => {
                      form
                        .validateFields()
                        .then((values) => {
                          onFinish(values);
                        })
                        .catch((info) => {
                          console.log("Validate Failed:", info);
                        });
                    }}
                  >
                    <Button icon={<SaveOutlined/>} type="primary">Cập nhật</Button>
                  </Popconfirm>
                </div>
              </div>
            </Row>
          </Form>
        </Col>
      </Row>
      <ModalUploadImage
        visible={modalUpload}
        handleCancel={() => setModalUpload(false)}
        handleOk={() => handleUploadImages()}
        listImage={listFiles.imageBlob}
      />
      <Loading loading={loading} />
    </>
  );
};

export default CarDetail;
