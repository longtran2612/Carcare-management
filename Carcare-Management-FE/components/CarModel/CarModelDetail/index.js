import React, { useEffect, useState, useRef } from "react";
import {
  Col,
  Row,
  Image,
  Button,
  Form,
  Select,
  Input,
  DatePicker,
  InputNumber,
  Upload,
  Popconfirm,
} from "antd";
import { useRouter } from "next/router";
import { openNotification ,openNotificationWarning } from "utils/notification";
import {
  updateUserById,
  uploadImagesUser,
} from "pages/api/userAPI";
import { getCarModelById,updateCarModel } from "pages/api/carModel";
import { validateMessages } from "utils/messageForm";
import ModalQuestion from "components/Modal/ModalQuestion";
import moment from "moment";
import ModalUploadImage from "components/Modal/ModalUploadImage";
import { SaveOutlined, UploadOutlined } from "@ant-design/icons";
import Loading from "components/Loading";
const formatDate = "YYYY/MM/DD";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import CarDetail from "components/Car/CarDetail";

const CarModelDetail = ({ carModelId, onUpdateCarModel }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [carModelDetail, setCarModelDetail] = useState({});
  const [modalUpload, setModalUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const [listFiles, setListFiles] = useState({
    images: [],
    imageBlob: [],
  });
  const [modalQuestion, setModalQuestion] = useState(false);

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

  const fetchcarModelDetail = async () => {
    setLoading(true);
    try {
      const response = await getCarModelById(carModelId);
      setCarModelDetail(response.data.Data);
      form.setFieldsValue({
        id: response.data.Data.id,
        name: response.data.Data.name,
        brand: response.data.Data.brand,
        model: response.data.Data.model,
        engine: response.data.Data.engine,
        imageUrl: response.data.Data.imageUrl,
        transmission: response.data.Data.transmission,
        seats: response.data.Data.seats,
        fuel: response.data.Data.fuel,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };

  useEffect(() => {
    if (carModelId) {
      fetchcarModelDetail();
    }
  }, [carModelId]);

  const onFinish = async (values) => {
    try {
      let body = {
        brand: values.email,
        model: values.address,
        engine: values.engine,
        transmission: values.transmission,
        seats: values.seats,
        fuel: values.fuel,
        year: values.year,
      };
      const res = await updateCarModel(body, carModelId);
        openNotification("Thành công!", "Cập nhật thành công");
        onUpdateCarModel();
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
    console.log(info);
    const result = info.fileList.map((file) => {
      const blob = new Blob([file.originFileObj], {
        type: file.type,
      });
      return (window.URL || window.webkitURL).createObjectURL(blob);
    });
    setListFiles({ images: info.fileList, imageBlob: result });
    setModalUpload(true);
  };

  const handleUploadImages = async () => {
    try {
      const formData = new FormData();
      listFiles.images.map((image) => {
        formData.append("files", image.originFileObj);
      });

      const response = await uploadImagesUser(formData);
      setListFiles({ images: [], imageBlob: [] });
      setModalUpload(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Row gutter={16}>
        {/* <Col span={6}>
          <Image width={300} height={250} src={carModelDetail.imageUrl} />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Upload
              onChange={(info) => handleFileChosen(info)}
              multiple
              showUploadList={false}
              fileList={listFiles.imageBlob}
            >
              <Button icon={<UploadOutlined />}>Tải hình lên</Button>
            </Upload>
          </div>
        </Col> */}
        <Col span={24}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Model"
                  name="model"
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
                <Form.Item label="Số nghế ngồi" name="seats">
                  <InputNumber style={{ width: "100%" }} min={1} max={16} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Năm sản xuất" name="year">
                  <InputNumber
                    style={{ width: "100%" }}
                    min={1900}
                    max={moment().year()}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Thương hiệu"
                  name="brand"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    showSearch
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
              <Col span={12}>
                <Form.Item label="Đông cơ" name="engine">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Truyền động" name="transmission">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nhiên liệu" name="fuel">
                  <Select
                    showSearch
                    placeholder="Chọn nhiên liệu"
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
                    <Option value="Xăng">Xăng</Option>
                    <Option value="Dầu">Dầu</Option>
                    <Option value="Điện">Điện</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row className="PullRight">
              <div
                style={{ bottom: "0", right: "20px", margin: "10px" }}
                className="service-action"
              >
                {/* <div style={{ marginRight: "20px" }}>
                  <Button
                    onClick={() => {
                      fetchcarModelDetail();
                    }}
                  >
                    Đặt lại
                  </Button>
                </div> */}
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

export default CarModelDetail;
