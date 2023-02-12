import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import moment from "moment";
import { createPromotionLine } from "pages/api/promotionLineAPI";
import { validateMessages } from "utils/messageForm";
import { getServices } from "pages/api/serviceAPI";
import { getCategories } from "pages/api/categoryAPI";
import { openNotification, openNotificationWarning } from "utils/notification";
const formatDate = "DD/MM/YYYY";

const ModalAddPromotionLine = ({
  promotionHeaderId,
  show,
  onSuccess,
  handleCancel,
  startDate,
  endDate,
}) => {
  const [form] = Form.useForm();
  const [type, setType] = React.useState("MONEY");
  const [limitAmount, setLimitAmount] = React.useState(false);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  const onFinish = async (values) => {
    let dataCreate = {
      promotionHeaderId: promotionHeaderId,
      ...values,
    };
    console.log("dataCreate", dataCreate);
    try {
      console.log(dataCreate);
      const res = await createPromotionLine(dataCreate);
      openNotification("Thành công", "tạo mới dòng khuyến mãi thành công");
      handleCancel();
      onSuccess(res?.data?.Data);
      form.resetFields();
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

  useEffect(() => {
    if (show) {
      fetchCategories();
      fetchService();
    }
  }, [show]);

  return (
    <>
      <Modal
        title="Thêm dòng khuyến mãi mới"
        centered
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
        width={700}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
        >
          <Row gutter={[16]}>
            <Col span={18}>
              <Form.Item
                label="Tên dòng khuyến mãi"
                name="description"
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
              <Form.Item
                label="Loại khuyến mãi"
                name="type"
                rules={[
                  {
                    required: true,
                  },
                ]}
                initialValue="MONEY"
              >
                <Select onChange={(value) => setType(value)}>
                  <Select.Option value="MONEY">Giảm tiền</Select.Option>
                  <Select.Option value="PERCENTAGE">
                    Giảm tiền theo %
                  </Select.Option>
                  <Select.Option value="SERVICE">Dịch vụ</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="fromDate"
                rules={[
                  {
                    required: true,
                  },
                ]}
                initialValue={moment(startDate).isAfter(moment()) ? moment(startDate, formatDate): moment()}
              >
                <DatePicker
                  disabledDate={(d) =>
                    !d ||
                    d.isBefore(moment()) ||
                    (form.getFieldValue("toDate") &&
                      d.isAfter(form.getFieldValue("toDate"))) ||
                    d.isBefore(startDate) ||
                    d.isAfter(endDate)
                  }
                  placeholder="Ngày bắt đầu"
                  format={formatDate}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                  placeholder="Ngày kết thúc"
                  format={formatDate}
                />
              </Form.Item>
            </Col>
            {type != "SERVICE" && (
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
                    step={1000}
                    min={
                      type === "MONEY" || type === "SERVICE"
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
            {(type === "MONEY" || type === "SERVICE") && (
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
            {type === "PERCENTAGE" && (
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
                  <InputNumber step={1} addonAfter="%" min={0} max={100} />
                </Form.Item>
              </Col>
            )}
            {type === "SERVICE" && (
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
            {type === "PERCENTAGE" && (
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

            <Col span={12}>
              <Form.Item initialValue={0} label="Nhóm người dùng áp dụng" name="customerType">
                <Select>
                  <Select.Option value={0}>Tất cả</Select.Option>
                  {/* <Select.Option value={1}>Thân thiết</Select.Option> */}
                </Select>
              </Form.Item>
            </Col>
            {/* {type != "SERVICE" && (
              <Col span={12}>
                <Form.Item label="Danh mục dịch vụ áp dụng" name="categoryIds">
                  <Select mode="multiple">
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
              <Form.Item
                initialValue={false}
                label="Giới hạn ngân sách"
                name="limitUsedTime"
              >
                <Select onChange={(value) => setLimitAmount(value)}>
                  <Select.Option value={false}>Không</Select.Option>
                  <Select.Option value={true}>Có</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {limitAmount && (
              <>
                <Col span={12}>
                  <Form.Item
                    label="Ngân sách giới hạn"
                    name="limitPromotionAmount"
                  >
                    <InputNumber
                      step={1000}
                      addonAfter="VNĐ"
                      min={0}
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
      </Modal>
    </>
  );
};

export default ModalAddPromotionLine;
