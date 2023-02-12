import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Row,
  Col,
  Form,
  Select,
  Typography,
  Card,
  Table,
  Drawer,
  Divider,
  Button,
  Avatar,
  Tag,
  Input,
  List,
  // Image
} from "antd";
import {
  getPromotionDetail,
  getAllPromotionUseable,
} from "pages/api/promotionDetail";
import { createBill } from "pages/api/billAPI";
import { getCarbyCustomerId } from "pages/api/carAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification ,openNotificationWarning } from "utils/notification";
import { formatMoney } from "utils/format";
import moment from "moment";
import Image from "next/image";
import { TagsOutlined, PrinterOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import logo from "public/images/logo-footer-customer.png";
import DrawerPromotionOrder from "components/Drawer/DrawerPromotionOrder";
const { Title } = Typography;
const { Option } = Select;
const { Column, ColumnGroup } = Table;
const formatDate = "HH:mm DD/MM/YYYY";
import Loading from "components/Loading";

const ModalCreateBill = ({ order, show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();

  const [promotionDetails, setPromotionDetails] = useState([]);
  const [showSelectPromotion, setShowSelectPromotion] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showCardId, setShowCardId] = useState(false);
  const [billDetail, setBillDetail] = useState({});
  const [loading, setLoading] = useState(false);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleFetchPromotion = async () => {
    try {
      const res = await getAllPromotionUseable(order.id);
      setPromotionDetails(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFetchCar = async () => {
    try {
      const res = await getCarbyCustomerId(form.getFieldValue("customerId"));
      setCars(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (order) {
      handleFetchPromotion();
    }
  }, [show, order]);

  const totalPriceService = () => {
    return order?.services?.reduce((total, cur) => {
      return (total += cur.servicePrice.price);
    }, 0);
  };
  const totalPromotionAmount = () => {
    let totalPromotion = 0;
    promotionDetails.forEach((promotion) => {
      if (promotion.type === "PERCENTAGE") {
        let total = (totalPriceService() * promotion.amount) / 100;
        if (total > promotion.maximumDiscount) {
          totalPromotion += promotion.maximumDiscount;
        } else {
          totalPromotion += total;
        }
      } else {
        if (promotion.type === "MONEY"|| promotion.type ==="SERVICE") {
          totalPromotion += promotion.amount;
        }
      }
    });
    return totalPromotion;
  };
  const finalTotalPrice = () => {
    return totalPriceService() - totalPromotionAmount();
  };

  const handleType = (value) => {
    switch (value) {
      case "MONEY":
        return <Tag color="blue">Giảm tiền</Tag>;
      case "PERCENTAGE":
        return <Tag color="green">Giảm theo %</Tag>;
      case "GIFT":
        return <Tag color="gold">Tặng quà</Tag>;
      default:
    }
  };

  const handlepromotionDetails = () => {
    if(totalPromotionAmount() > 0)
    return true;

  }


  const onFinish = async (values) => {
    setLoading(true);
    const dataCreateBill = {
      orderId: order.id,
      paymentAmount: finalTotalPrice(),
      paymentType: values.paymentType,
    };
    if (promotionDetails.length > 0) {
      dataCreateBill.promotionCodes = 
        promotionDetails.map((promotion) => promotion.promotionDetailCode);
      
      dataCreateBill.totalPromotionAmount = totalPromotionAmount();
    }
    if (values.paymentType === "DEBIT") {
      dataCreateBill.cardNumber = values.cardNumber;
    }
    console.log(dataCreateBill);
   
    try {
      const res = await createBill(dataCreateBill);
      openNotification("Thành công!", "Tạo hóa đơn thành công!");
      handleCancel();
      setBillDetail(res.data.Data);
      onSuccess(res?.data?.Data);
      form.resetFields();
      setShowPrint(true);
      handlePrint();
      setShowPrint(false);
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
  const onchangePaymentType = (value) => {
    console.log(value);
    if (value === "CASH") {
      form.setFieldsValue({
        cardNumber: "",
      });
      setShowCardId(false);
    }
    if (value === "DEBIT") {
      setShowCardId(true);
    }
  };

  return (
    <>
      <Modal
        title="Tạo hóa đơn"
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
        width={1000}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
        footer={
          <>
            <div className="steps-action">
              <Button
                style={{
                  margin: "0 8px",
                }}
                onClick={() => {
                  handleCancel();
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                icon={<PrinterOutlined />}
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
              >
                Hoàn thành và in hóa đơn
              </Button>
            </div>
          </>
        }
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
        >
          <Row gutter={[16]}>
            <Col span={24}>
              <Col span={24}>
                <Divider>
                  <Title level={4}>Thông tin hóa đơn</Title>
                </Divider>
                <Row gutter={16}>
                  <Col span={24}>
                    <Table
                      size="small"
                      pagination={false}
                      summary={() => {
                        return (
                          <>
                            <Table.Summary.Row>
                              <Table.Summary.Cell
                                index={0}
                              ></Table.Summary.Cell>
                              <Table.Summary.Cell
                                index={1}
                              ></Table.Summary.Cell>
                              <Table.Summary.Cell index={2}>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#E34262",
                                  }}
                                >
                                  Tổng tiền dịch vụ
                                </span>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={3}>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#E34262",
                                  }}
                                >
                                  {formatMoney(totalPriceService() || 0)}
                                </span>
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row>
                              <Table.Summary.Cell
                                index={0}
                              ></Table.Summary.Cell>
                              <Table.Summary.Cell index={1}>
                                <Button
                                  icon={<TagsOutlined />}
                                  type="ghost"
                                  style={{
                                    backgroundColor: "#B6D433",
                                    color: "white",
                                  }}
                                  onClick={() => setShowSelectPromotion(true)}
                                >
                                  Danh sách khuyến mãi
                                </Button>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={2}>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#677E31",
                                  }}
                                >
                                  Khuyến mãi
                                </span>
                              </Table.Summary.Cell>

                              <Table.Summary.Cell index={3}>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#677E31",
                                  }}
                                >
                                  - {formatMoney(totalPromotionAmount() || 0)}
                                </span>
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row>
                              <Table.Summary.Cell
                                index={0}
                              ></Table.Summary.Cell>
                              <Table.Summary.Cell
                                index={1}
                              ></Table.Summary.Cell>
                              <Table.Summary.Cell index={2}>
                                <span
                                  style={{ color: "red", fontWeight: "bold" }}
                                >
                                  Khách phải trả
                                </span>
                              </Table.Summary.Cell>

                              <Table.Summary.Cell index={3}>
                                <span
                                  style={{ color: "red", fontWeight: "bold" }}
                                >
                                  {formatMoney(finalTotalPrice() || 0)}
                                </span>
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                          </>
                        );
                      }}
                      dataSource={order?.services}
                      bordered
                      scroll={{
                        y: 250,
                      }}
                    >
                      <Column
                        title="STT"
                        dataIndex="stt"
                        key="stt"
                        width={79}
                        render={(text, record, dataIndex) => {
                          return <div>{dataIndex + 1}</div>;
                        }}
                      />
                      <Column
                        title="Mã dịch vụ"
                        dataIndex="serviceCode"
                        key="serviceCode"
                        render={(text, record) => {
                          return (
                            <div>
                              <a color="blue">{record.serviceCode}</a>
                            </div>
                          );
                        }}
                      />
                      <Column title="Tên dịch vụ" dataIndex="name" key="name" />
                      <Column
                        title="Giá dịch vụ"
                        dataIndex="price"
                        key="price"
                        render={(text, record, dataIndex) => {
                          return (
                            <div>{formatMoney(record.servicePrice.price)}</div>
                          );
                        }}
                      />
                    </Table>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="Hình thức thanh toán"
                      name="paymentType"
                      initialValue="CASH"
                      rules={[{ required: true }]}
                    >
                      <Select onChange={(value) => onchangePaymentType(value)}>
                        <Select.Option value="CASH">Tiền mặt</Select.Option>
                        <Select.Option value="DEBIT">Thẻ - Chuyển khoản</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {showCardId && (
                    <Col span={6}>
                      <Form.Item label="Thông tin thanh toán" name="cardNumber">
                        <Input />
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Col>
            </Col>
          </Row>
        </Form>
      </Modal>
      <DrawerPromotionOrder
        show={showSelectPromotion}
        promotionDetails={promotionDetails}
        handleCancel={() => setShowSelectPromotion(false)}
      />
      {showPrint && (
        <div ref={componentRef}>
          <br />
          <div className="invoice-box">
            <table>
              <tr className="top">
                <td colspan="2">
                  <table>
                    <tr>
                      <td className="title">
                        <Image
                          src={logo}
                          width={150}
                          height={100}
                          alt="Company logo"
                        />
                        {/* <img src={logo}/> */}
                      </td>
                      <td>
                        Bill #: {billDetail?.billCode}
                        <br />
                        Ngày tạo:{" "}
                        {moment(billDetail?.createDate).format(
                          "HH:mm DD/MM/YYYY"
                        )}
                        <br />
                        Ngày thanh toán: {moment().format("HH:mm DD/MM/YYYY")}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr className="information">
                <td colspan="2">
                  <table>
                    <tr>
                      <td>
                        VLCareCare
                        <br />
                        0772555445
                        <br />
                        12 Nguyễn Văn bảo
                        <br />
                        Phường 5,Gò Vấp, Hồ Chí Minh
                      </td>

                      <td>
                        Khách hàng : {billDetail?.customerName}
                        <br />
                        Số điện thoại : {billDetail?.customerPhoneNumber}
                        <br />
                        Xe : {billDetail?.carName} -{" "}
                        {billDetail?.carLicensePlate}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr className="heading">
                <td>Thanh Toán</td>

                <td>
                  {billDetail?.paymentType == "CASH"
                    ? "Tiền mặt"
                    : "Thẻ-CK"}
                </td>
              </tr>
              <tr className="heading">
                <td>Dịch vụ</td>

                <td>Thành tiền</td>
              </tr>

              {billDetail?.services?.map((item) => (
                <>
                  <tr className="item">
                    <td>{item?.name}</td>

                    <td>{formatMoney(item?.servicePrice?.price)}</td>
                  </tr>
                </>
              ))}
              {handlepromotionDetails(billDetail?.totalPromotionAmount) && (
                <>
                  <tr className="item">
                    <td>Khuyến mãi</td>
                    <td>
                      <a style={{ color: "red" }}>
                        -{formatMoney(billDetail?.totalPromotionAmount || 0)}
                      </a>
                    </td>
                  </tr>
                </>
              )}

              <tr className="total">
                <td></td>

                <td>Tổng: {formatMoney(billDetail?.paymentAmount || 0)}</td>
              </tr>
            </table>
            <Divider style={{ paddingTop: "50px" }}>
              {" "}
              Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi
            </Divider>
          </div>
        </div>
      )}
      <Loading show={loading} />
    </>
  );
};

export default ModalCreateBill;
