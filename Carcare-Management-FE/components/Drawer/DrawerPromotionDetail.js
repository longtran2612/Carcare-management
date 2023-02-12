import React, { useState, useEffect } from "react";
import { getPromotionDetailByLineId } from "pages/api/promotionDetail";
import {
  Drawer,
  Form,
  Row,
  Col,
  Button,
  Input,
  Select,
  Space,
  InputNumber,
  Typography,
  Divider,
  Popconfirm,
  DatePicker,
} from "antd";
import {
  updatePromotionLine,
  deletePromotionLine,
  activePromotionLine,
  inActivePromotionLine,
} from "pages/api/promotionLineAPI";
import { updatePromotionDetail } from "pages/api/promotionDetail";
import { getServices } from "pages/api/serviceAPI";
import { getCategories } from "pages/api/categoryAPI";
import Loading from "components/Loading";
import { validateMessages } from "utils/messageForm";
import TextArea from "antd/lib/input/TextArea";
import { openNotification, openNotificationWarning } from "utils/notification";
import {
  DeleteOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";
const formatDate = "DD/MM/YYYY";

function DrawerPromorionDetail({
  headerStatus,
  canUpdate,
  promotionLine,
  show,
  onUpdate,
  handleCancel,
  endDate,
  startDate,
}) {
  const [promotionDetail, setPromotionDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [showLimitAmount, setShowLimitAmount] = useState(false);
  const [form] = Form.useForm();
  const getPromotionDetail = async () => {
    // setLoading(true);
    try {
      const response = await getPromotionDetailByLineId(promotionLine?.id);
      setPromotionDetail(response.data.Data[0]);
      console.log(response.data.Data[0]);
      form.setFieldsValue({
        description: response.data.Data[0].description,
        type: response.data.Data[0].type,
        value: response.data.Data[0].value,
        amount: response.data.Data[0].amount,
        maximumDiscount: response.data.Data[0].maximumDiscount,
        minimumSpend: response.data.Data[0].minimumSpend,
        categoryIds: response.data.Data[0].categoryIds,

        customerType: response.data.Data[0].customerType,
        limitUsedTime: response.data.Data[0].limitUsedTime,
        limitPromotionAmount: response.data.Data[0].limitPromotionAmount,
        promotionUsedAmount: response.data.Data[0].promotionUsedAmount,
      });
      if (response.data.Data[0].type === "SERVICE") {
        if (response.data.Data[0].serviceIds) {
          form.setFieldsValue({
            serviceIds: response.data.Data[0].serviceIds[0],
          });
        }
      }
      setShowLimitAmount(response.data.Data[0].limitPromotionAmount);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };
  const onFinish = async (values) => {
    console.log(values);
    const dataUpdate = {
      description: values.description,
      type: values.type,
      minimumSpend: values.minimumSpend,
      categoryIds: values.categoryIds,
      customerType: values.customerType,
    };
    if (values.type === "PERCENTAGE") {
      (dataUpdate.maximumDiscount = values.maximumDiscount),
        (dataUpdate.amount = values.amount),
        (dataUpdate.limitUsedTime = values.limitUsedTime),
        (dataUpdate.limitPromotionAmount = values.limitPromotionAmount);
    }
    if (values.type === "MONEY") {
      (dataUpdate.amount = values.amount),
        (dataUpdate.limitUsedTime = values.limitUsedTime),
        (dataUpdate.limitPromotionAmount = values.limitPromotionAmount);
    }
    if (values.type === "SERVICE") {
      (dataUpdate.amount = values.amount),
        (dataUpdate.serviceIds = [values.serviceIds]);
    }

    const body = {
      description: values.name,
      fromDate: values.fromDate,
      toDate: values.toDate,
    };

    try {
      console.log("data update", dataUpdate);
      const response = await updatePromotionDetail(
        dataUpdate,
        promotionDetail.id
      );
      const response1 = await updatePromotionLine(promotionLine?.id, body);
      // onSuccess(response.data.Data);
      // handleCancel();
      openNotification("Thành công", "Cập nhật chi tiết khuyến mãi thành công");
      onUpdate();
      getPromotionDetail();
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchService = async () => {
    try {
      const response = await getServices();
      setServices(response.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = () => {
    setShowLimitAmount(form.getFieldValue("limitUsedTime"));
  };

  const handleDeletePromotionLine = async () => {
    setLoading(true);
    try {
      const res = await deletePromotionLine(promotionLine?.id);
      openNotification("Thành công", "Xóa chương trình khuyến mãi thành công!");
      handleCancel();
      onUpdate();
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Thất bại! Có lỗi xảy ra");
      }
      setLoading(false);
    }
  };
  const handleActivePromotionLine = async () => {
    setLoading(true);

    try {
      const res = await activePromotionLine(promotionLine?.id);
      openNotification("Thành công", "Kích hoạt dòng khuyến mãi thành công!");
      getPromotionDetail();
      onUpdate();
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Thất bại! Có lỗi xảy ra");
      }
      setLoading(false);
    }
  };

  const handleInActivePromotionLine = async () => {
    setLoading(true);
    try {
      const res = await inActivePromotionLine(promotionLine?.id);
      openNotification(
        "Thành công",
        "Ngưng hoạt động dòng khuyến mãi thành công!"
      );
      onUpdate();
      getPromotionDetail();
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Thất bại! Có lỗi xảy ra");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      getPromotionDetail();
      fetchCategories();
      fetchService();
      form.setFieldsValue({
        name: promotionLine.description,
        fromDate: moment(promotionLine?.fromDate),
        toDate: moment(promotionLine?.toDate),
      });
    }
  }, [show, promotionLine]);

  return (
    <>
      <Drawer
        width={800}
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
            {!canUpdate && (
              <Popconfirm
                title="Bạn có chắc chắn xóa dòng khuyến mãi này?"
                placement="topLeft"
                okText="Xóa"
                cancelText="Hủy"
                onConfirm={() => {
                  handleDeletePromotionLine();
                }}
              >
                <Button type="danger" icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Popconfirm>
            )}

            {(promotionLine?.status == "ACTIVE" && headerStatus == "ACTIVE") && (
              <Popconfirm
                title="Bạn có chắc chắn ngưng hoạt động dòng khuyến mã này?"
                placement="topLeft"
                okText="Đông ý"
                cancelText="Hủy"
                onConfirm={() => {
                  handleInActivePromotionLine();
                }}
              >
                <Button style={{ backgroundColor: "#22C55E", color: "white" }}>
                  Hoạt dộng
                </Button>
              </Popconfirm>
            )}
            {(promotionLine?.status == "INACTIVE" && headerStatus == "ACTIVE") && (
              <Popconfirm
                title="Bạn có chắc chắn kích hoạt dòng khuyến mãi này?"
                placement="topLeft"
                okText="Đông ý"
                cancelText="Hủy"
                onConfirm={() => {
                  handleActivePromotionLine();
                }}
              >
                <Button type="danger">Không hoạt dộng</Button>
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
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
        >
          <Row gutter={[16, 2]}>
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: true,
                  },
                ]}
                label="Tên"
                name="name"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Ngày bắt đầu"
                name="fromDate"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <DatePicker
                  disabled={
                    moment().isAfter(form.getFieldValue("fromDate"))
                      ? true
                      : false
                  }
                  disabledDate={(d) =>
                    !d ||
                    d.isBefore(moment()) ||
                    (form.getFieldValue("toDate") &&
                      d.isAfter(form.getFieldValue("toDate"))) ||
                    d.isBefore(startDate)
                  }
                  format={formatDate}
                />
                {/* <Input /> */}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ngày kết thúc"
                name="toDate"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <DatePicker
                  disabledDate={(d) =>
                    !d ||
                    (form.getFieldValue("fromDate") &&
                      d.isSameOrBefore(form.getFieldValue("fromDate"))) ||
                    d.isAfter(endDate)
                  }
                  format={formatDate}
                />
                {/* <Input /> */}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={2} />
              </Form.Item>
            </Col>
            <Divider />
            <Col span={12}>
              <Form.Item
                label="Loại khuyến mãi"
                name="type"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select disabled>
                  <Select.Option value="MONEY">Giảm tiền</Select.Option>
                  <Select.Option value="PERCENTAGE">
                    Giảm tiền theo %
                  </Select.Option>
                  <Select.Option value="SERVICE">Dịch vụ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {promotionDetail?.type != "SERVICE" && (
              <Col span={12}>
                <Form.Item
                  label="Giá trị đơn hàng tối thiểu"
                  name="minimumSpend"
                  rules={[
                    {
                      required: true,
                      pattern: new RegExp("[0-9]"),
                      message:
                        "Giá trị đơn hàng tối thiểu phải lớn hơn giá trị tiền khuyến mãi",
                    },
                  ]}
                >
                  <InputNumber
                    disabled={canUpdate}
                    step={1000}
                    min={
                      promotionDetail?.type === "MONEY" ||
                      promotionDetail?.type === "SERVICE"
                        ? form.getFieldValue("amount")
                        : 0
                    }
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="VNĐ"
                  />
                </Form.Item>
              </Col>
            )}
            {(promotionDetail?.type === "MONEY" ||
              promotionDetail?.type === "SERVICE") && (
              <Col span={12}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      pattern: new RegExp("[0-9]"),
                      message: "Giá phải là số có giá trị lớn hơn 0",
                    },
                  ]}
                  label="Giá trị khuyến mãi (Tiền)"
                  name="amount"
                >
                  <InputNumber
                    step={1000}
                    disabled={canUpdate}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="VNĐ"
                    min={0}
                  />
                </Form.Item>
              </Col>
            )}
            {promotionDetail?.type === "PERCENTAGE" && (
              <Col span={12}>
                <Form.Item
                  rules={[
                    {
                      required: true,

                      message: "Vui lòng nhập Số % giảm từ 0 - 100",
                    },
                  ]}
                  label="Giá trị khuyến mãi (%)"
                  name="amount"
                >
                  <InputNumber
                    step={1}
                    disabled={canUpdate}
                    addonAfter="%"
                    min={0}
                    max={100}
                  />
                </Form.Item>
              </Col>
            )}
            {promotionDetail?.type === "SERVICE" && (
              <Col span={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  label="Dịch vụ khuyến mãi"
                  name="serviceIds"
                >
                  <Select
                    disabled={canUpdate}
                    showSearch
                    placeholder="Chọn dịch vụ khuyến mãi"
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
                    {services.map((service) => (
                      <Select.Option value={service.id}>
                        {service.serviceCode + " - " + service.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            {promotionDetail?.type === "PERCENTAGE" && (
              <Col span={12}>
                <Form.Item
                  label="Số tiền tối đa được giảm"
                  name="maximumDiscount"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber
                    step={1000}
                    disabled={canUpdate}
                    addonAfter="VNĐ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    min={0}
                  />
                </Form.Item>
              </Col>
            )}
            {promotionDetail?.type === "MONEY" && <Col span={12}></Col>}
            <Col span={12}>
              <Form.Item label="Nhóm người dùng áp dụng" name="customerType">
                <Select disabled={canUpdate}>
                  <Select.Option value={0}>Tất cả</Select.Option>
                  <Select.Option value={1}>Thân thiết</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {/* {promotionDetail?.type != "SERVICE" && (
              <Col span={12}>
                <Form.Item label="Danh mục dịch vụ áp dụng" name="categoryIds">
                  <Select disabled={canUpdate} mode="multiple">
                    {categories.map((category) => (
                      <Select.Option value={category.id}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )} */}
            <Col span={12}>
              <Form.Item label="Giới hạn ngân sách" name="limitUsedTime">
                <Select disabled={canUpdate} onChange={onChange}>
                  <Select.Option value={false}>Không</Select.Option>
                  <Select.Option value={true}>Có</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {showLimitAmount && (
              <>
                <Col span={12}>
                  <Form.Item
                    label="Ngân sách giới hạn"
                    name="limitPromotionAmount"
                  >
                    <InputNumber
                      step={1000}
                      disabled={canUpdate}
                      addonAfter="VNĐ"
                      min={0}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Tổng tiền đã giảm"
                    name="promotionUsedAmount"
                  >
                    <InputNumber
                      disabled
                      addonAfter="VNĐ"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </Drawer>

      <Loading loading={loading} />
    </>
  );
}

export default DrawerPromorionDetail;
