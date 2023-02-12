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
} from "antd";
import { getCategoryByCode, updateCategory } from "pages/api/categoryAPI";
import { openNotification ,openNotificationWarning } from "utils/notification";
import { validateMessages } from "utils/messageForm";
import Loading from "components/Loading";
function DrawerCategory({ categoryId, show, handleCancel }) {
  const [form] = Form.useForm();
  const [categoryDetail, setCategoryDetail] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchcategoryDetail = async () => {
    try {
      const response = await getCategoryByCode(categoryId);
      setCategoryDetail(response.data.Data);
      console.log(response.data.Data);
      form.setFieldsValue({
        categoryCode: response.data.Data.categoryCode,
        name: response.data.Data.name,
        type: response.data.Data.type,
        status: response.data.Data.status,
      });
    } catch (error) {
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
      <Drawer
        width={400}
        placement="right"
        closable
        onClose={() => {
          handleCancel();
          form.resetFields();
        }}
        open={show}
        visible={show}
        bodyStyle={{ padding: 40 }}
        extra={
          <Space>
            <Button onClick={handleCancel}>Hủy</Button>
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
        <Divider>
          <Typography.Title level={4}>Thông tin danh mục</Typography.Title>
        </Divider>

        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label="Mã danh mục"
                name="categoryCode"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input disabled style={{ width: "100%" }} />
              </Form.Item>
            </Col>
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
                <Input style={{ width: "100%" }} />
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
                <Select style={{ width: "100%" }}>
                  <Option value="NORMAL">Thường</Option>
                  <Option value="NEW">Mới</Option>
                  <Option value="LIKE">Yêu thích</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>

      <Loading loading={loading} />
    </>
  );
}

export default DrawerCategory;
