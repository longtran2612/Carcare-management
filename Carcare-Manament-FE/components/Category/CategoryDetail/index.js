import React, { useEffect, useState } from "react";
import { Col, Row, Image, Button, Form, Select, Input, Popconfirm } from "antd";
import { useRouter } from "next/router";
import {
  getCategoryById,
  getCategoryByCode,
  updateCategory,
} from "pages/api/categoryAPI";
import { openNotification ,openNotificationWarning } from "utils/notification";
import { validateMessages } from "utils/messageForm";
import ModalQuestion from "components/Modal/ModalQuestion";
import Loading from "components/Loading";

const CategoryDetail = ({ categoryId, onUpdateCategory }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [categoryDetail, setCategoryDetail] = useState({});
  const [categoryServices, setCategoryServices] = useState({});
  const [modalQuestion, setModalQuestion] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchcategoryDetail = async () => {
    setLoading(true);
    try {
      const response = await getCategoryByCode(categoryId);
      setCategoryDetail(response.data.Data);
      console.log(response.data.Data);
      form.setFieldsValue({
        name: response.data.Data.name,
        type: response.data.Data.type,
        imageUrl: response.data.Data.imageUrl,
        status: response.data.Data.status,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchcategoryDetail();
    }
  }, [categoryId]);

  const onFinish = async (values) => {
    try {
      let body = {
        type: values.type,
        name: values.name,
        status: values.status,
      };
      const res = await updateCategory(body, categoryDetail.id);
      openNotification("Cập nhật danh mục dịch vụ thành công!", "");
      onUpdateCategory();
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
      <Button type="link" size="small" onClick={() => router.push("/admin")}>
        Trở lại
      </Button>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Image width={300} height={250} src={categoryDetail.imageUrl} />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* <Upload
              onChange={(info) => handleFileChosen(info)}
              multiple
              showUploadList={false}
              fileList={listFiles.imageBlob}
            >
              <Button icon={<UploadOutlined />}>Tải hình lên</Button>
            </Upload> */}
          </div>
        </Col>
        <Col span={18}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Row gutter={[32, 32]}>
              <Col span={24}>
                <Form.Item
                  label="Tên dịch vụ"
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
              <Col span={24}>
                <Form.Item
                  label="Trạng thái"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name="status"
                >
                  <Select>
                    <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                    <Select.Option value="INACTIVE">
                      Không hoạt động
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Kiểu dịch vụ"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name="type"
                >
                  <Select>
                    <Select.Option value="HOT">HOT</Select.Option>
                    <Select.Option value="LIKE">LIKE</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row className="PullRight">
              <div
                style={{ bottom: "0", right: "20px", margin: "10px" }}
                className="service-action"
              >
                <div style={{ marginRight: "20px" }}>
                  <Button
                    onClick={() => {
                      fetchcategoryDetail();
                    }}
                  >
                    Đặt lại
                  </Button>
                </div>
                <div>
                  <Popconfirm
                    title="Xác nhận?"
                    placement="topLeft"
                    okText="Đồng ý"
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
                    <Button type="primary">Cập nhật</Button>
                  </Popconfirm>
                </div>
              </div>
            </Row>
          </Form>
        </Col>
      </Row>

      <Loading loading={loading} />
    </>
  );
};

export default CategoryDetail;
