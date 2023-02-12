import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Button,
  Form,
  Select,
  Input,
  Drawer,
  Space,
  Divider,
  Upload,
  Typography,
  Table,
  InputNumber,
  Popconfirm,
} from "antd";
import { updatePrice, deletePrice } from "pages/api/priceAPI";
import {
  DeleteOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { getCarModelByBrand } from "pages/api/carModel";
import { updateCar } from "pages/api/carAPI";
import { openNotification, openNotificationWarning } from "utils/notification";
import Loading from "components/Loading";
const { TextArea } = Input;

function DrawerPriceDetail({
  canUpdatePrice,
  price,
  show,
  onUpdate,
  handleCancel,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    console.log("values", values);
    setLoading(true);
    let dataUpdate = {
      price: values.price,
      status: values.status,
    };
    try {
      const res = await updatePrice(price?.id, dataUpdate);
      openNotification("Thành công", "Cập nhật thành công");
      onUpdate();
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

  const handleDeletePrice = async () => {
    try {
      const res = await deletePrice(price?.id);
      openNotification("Thành công", "Xóa giá thành công");
      handleCancel();
      onUpdate();
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };

  useEffect(() => {
    if (price) {
      form.setFieldValue("priceCode", price.priceCode);
      form.setFieldValue("name", price.name);
      form.setFieldValue("price", price.price);
      form.setFieldValue("serviceCode", price.serviceCode);
      form.setFieldValue("status", price.status);
    }
  }, [show]);

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
        bodyStyle={{ padding: 40 }}
        extra={
          <Space>
            <Button onClick={() => handleCancel()}>Hủy</Button>
            {!canUpdatePrice && (
              <Popconfirm
                title="Bạn có chắc chắn xóa giá này?"
                placement="topLeft"
                okText="Xóa"
                cancelText="Hủy"
                onConfirm={() => {
                  handleDeletePrice();
                }}
              >
                <Button type="danger" icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Popconfirm>
            )}
            <Button
              icon={<SaveOutlined />}
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
          <Typography.Title level={4}>Thông tin chi tiết giá</Typography.Title>
        </Divider>

        <Form form={form} layout="vertical">
          <Form form={form} layout="vertical" autoComplete="off">
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label="Mã dịch vụ" name="serviceCode">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                
                  label="Trạng thái"
                  name="status"
                >
                  <Select disabled>
                    <Select.Option value={100}>Hoạt động</Select.Option>
                    <Select.Option value={10}>Không hoạt động</Select.Option>
                    {!canUpdatePrice && (
                    <Select.Option disabled value={10}>
                      Chưa tới hiệu lực
                    </Select.Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Tên dịch vụ" name="name">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  label="Giá"
                  name="price"
                >
                  <InputNumber
                    disabled={canUpdatePrice}
                    min={0}
                    step={1000}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="VNĐ"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Form>
      </Drawer>

      <Loading loading={loading} />
    </>
  );
}

export default DrawerPriceDetail;
