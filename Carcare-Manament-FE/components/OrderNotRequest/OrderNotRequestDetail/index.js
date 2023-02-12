import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Typography,
  Divider,
  Timeline,
  Table,
  Button,
  Tag,
  Steps,
  Drawer,
  Avatar,
  List,
  Modal,
} from "antd";
import {
  LoadingOutlined,
  TagsOutlined,
  SyncOutlined,
  PlusCircleFilled,
  PrinterOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { getUserById, getUserAvaliable } from "pages/api/userAPI";
import { getOrderById, updateOrder } from "pages/api/orderAPI";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import ModalCreateBill from "components/Modal/ModalCreateBill";
import moment from "moment";
import { useRouter } from "next/router";
import { openNotification } from "utils/notification";
import UpDateServiceOrder from "components/Modal/ModalUpdateServiceOrder";
import { getAllPromotionUseable } from "pages/api/promotionDetail";
import DrawerPromotionOrder from "components/Drawer/DrawerPromotionOrder";
import ModalChangeExcutor from "components/Modal/ModalChangeExecutor";

const { Title } = Typography;
const { Option } = Select;
const { Column, ColumnGroup } = Table;
const formatDate = "HH:mm DD/MM/YYYY";

export const OrderNotRequestDetail = ({ orderId }) => {
  const [form] = Form.useForm();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showCreateBill, setShowCreateBill] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(0);

  const [showUpdateServiceOrder, setShowUpdateServiceOrder] = useState(false);

  const [promotionDetails, setPromotionDetails] = useState([]);
  const [showSelectPromotion, setShowSelectPromotion] = useState(false);

  const [showChangeExcutor, setShowChangeExcutor] = useState(false);

  const getOrder = async () => {
    try {
      setLoading(true);
      const res = await getOrderById(orderId);
      setOrder(res.data.Data);
      fetchUser(res.data.Data.executorId);
      fetchUsers();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleFetchPromotion = async () => {
    try {
      const res = await getAllPromotionUseable(order?.id);
      setPromotionDetails(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async (data) => {
    console.log("id", data);
    try {
      const response = await getUserById(data);
      setUser(response.data.Data);
      form.setFieldValue("executorId", response.data.Data.id);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await getUserAvaliable();
      setUsers(response.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrder();
  }, [orderId]);

  useEffect(() => {
    handleStep();
    handleFetchPromotion();
  }, [order]);

  const handleStep = () => {
    switch (order?.status) {
      case 0:
        return 0;
      case 2:
        return 1;
      case 10:
        return 2;
      case 100:
        return 4;
      case -100:
        return 2;
        break;
    }
  };

  const handleSuccessBill = () => {
    setShowCreateBill(false);
    getOrder();
  };
  const totalPriceService = () => {
    return order?.services.reduce((total, cur) => {
      return (total += cur?.servicePrice?.price);
    }, 0);
  };
  const totalTimeService = () => {
    return order?.services.reduce((total, cur) => {
      return (total += cur?.estimateTime);
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
        if (promotion.type === "MONEY" || promotion.type === "SERVICE") {
          totalPromotion += promotion.amount;
        }
      }
    });
    return totalPromotion;
  };
  const finalTotalPrice = () => {
    let total = totalPriceService() - totalPromotionAmount();
    return total;
  };

  const convertOrderStatus = () => {
    switch (order?.status) {
      case 0:
        return (
          <Tag
            style={{
              height: "30px",
              alignItems: "center",
              fontSize: "15px",
            }}
            color="orange"
          >
            Chờ xử lý
          </Tag>
        );
      case 2:
        return (
          <Tag
            style={{
              height: "30px",
              alignItems: "center",
              fontSize: "15px",
            }}
            icon={<SyncOutlined spin />}
            color="processing"
          >
            Đang xử lý
          </Tag>
        );
      case 10:
        return (
          <Tag
            style={{
              height: "30px",
              padding: "5px",
              fontSize: "15px",
            }}
            color="green"
          >
            Đã hoàn thành
          </Tag>
        );
      case 100:
        return (
          <Tag
            style={{
              height: "30px",
              padding: "5px",
              fontSize: "15px",
            }}
            color="pink"
          >
            Đã xuất hóa đơn
          </Tag>
        );
      case -100:
        return (
          <Tag
            style={{
              height: "30px",
              padding: "5px",
              fontSize: "15px",
            }}
            color="red"
          >
            Đã hủy
          </Tag>
        );
    }
  };
  const handleSuccessUPdateOrder = () => {
    setShowUpdateServiceOrder(false);
    getOrder();
  };
  const handleSuccessChangeExcutor = () => {
    setShowChangeExcutor(false);
    getOrder();
  };

  return (
    <>
      <div className="carslot-content--header">
        <Title style={{ padding: "0px" }} level={3}>
          Thông tin đơn hàng{" "}
          <span style={{ color: "blue" }}>#{order?.orderCode}</span>
        </Title>
        <div> {convertOrderStatus()}</div>
      </div>
      <Form form={form} layout="vertical">
        <Row>
          <Col span={6}>
            <div
              style={{ marginRight: "10px" }}
              className="carslot-customer content-white"
            >
              <Title level={4}>Nhân viên xử lý</Title>
              <Timeline>
                {user ? (
                  <span>{user?.name + " - " + user?.phone}</span>
                ) : (
                  <span style={{color:'red'}}> Chưa có nhân viên xử lý</span>
                )}

                {(order?.status === 0 || order?.status === 2) && (
                  <EditOutlined
                    style={{ marginLeft: "5px" }}
                    onClick={() => setShowChangeExcutor(true)}
                  />
                )}
              </Timeline>
              <Title level={4}>Thông tin khách hàng</Title>
              <Timeline>
                <Timeline.Item>Mã: {order?.customerCode}</Timeline.Item>
                <Timeline.Item>Tên: {order?.customerName}</Timeline.Item>
                <Timeline.Item>
                  Số điện thoại: {order?.customerPhoneNumber}
                </Timeline.Item>
              </Timeline>
              <Title level={4}>Thông tin xe</Title>
              <Timeline>
                <Timeline.Item>Mã xe: {order?.carCode}</Timeline.Item>
                <Timeline.Item>Tên xe: {order?.carName}</Timeline.Item>
                <Timeline.Item>Biển số: {order?.carLicensePlate}</Timeline.Item>
              </Timeline>
              {order?.status === 10 && (
                <div
                  style={{ bottom: "0", right: "20px", margin: "10px" }}
                  className="service-action"
                >
                  <div>
                    <Button
                      type="primary"
                      size="large"
                      icon={<PrinterOutlined />}
                      onClick={() => {
                        setShowCreateBill(true);
                      }}
                    >
                      Thanh toán - In hóa đơn
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Col>
          <Col span={18}>
            <Row>
              {order?.status === -100 ? (
                <Col
                  className="content-white"
                  style={{ marginBottom: "1rem", margin: 0 }}
                  span={24}
                >
                  <Steps current={step} className="site-navigation-steps">
                    <Steps.Step
                      title="Tiếp nhận yêu cầu"
                      status="finish"
                      description={
                        moment(order?.createDate).format(formatDate) || ""
                      }
                    />
                    <Steps.Step
                      title="Hủy yêu cầu"
                      description={
                        order?.orderCanceledDate != null
                          ? moment(order?.orderCanceledDate).format(formatDate)
                          : ""
                      }
                    />
                  </Steps>
                </Col>
              ) : (
                <Col
                  className="content-white"
                  style={{ marginBottom: "1rem" }}
                  span={24}
                >
                  <Steps
                    current={handleStep()}
                    className="site-navigation-steps"
                  >
                    <Steps.Step
                      title="Tiếp nhận yêu cầu"
                      status="finish"
                      description={
                        moment(order?.createDate).format(formatDate) || ""
                      }
                    />
                    <Steps.Step
                      title="Băt đầu xử lý"
                      description={
                        order?.carExecutingDate != null
                          ? moment(order?.carExecutingDate).format(formatDate)
                          : ""
                      }
                    />
                    <Steps.Step
                      title="Hoàn thành"
                      description={
                        order?.carExecutedDate != null
                          ? moment(order?.carExecutedDate).format(formatDate)
                          : ""
                      }
                    />
                    <Steps.Step
                      title="Thanh toán"
                      description={
                        order?.paymentDate != null
                          ? moment(order?.paymentDate).format(formatDate)
                          : ""
                      }
                    />
                  </Steps>
                </Col>
              )}

              <Col span={24}>
                <Table
                  size="small"
                  pagination={false}
                  bordered
                  dataSource={order?.services}
                  scroll={{ y: 260 }}
                  summary={() => {
                    return (
                      <>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            Tổng dịch vụ
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2}>
                            {totalTimeService() || 0} phút
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={3}>
                            {formatMoney(totalPriceService() || 0)}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0}></Table.Summary.Cell>
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
                              Khuyến mãi được áp dụng
                            </Button>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2}>
                            <span
                              style={{
                                fontWeight: "bold",
                                color: "#677E31",
                              }}
                            >
                              Tổng tiền khuyến mãi
                            </span>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={3}>
                            <span
                              style={{
                                fontWeight: "bold",
                                color: "#677E31",
                              }}
                            >
                              {formatMoney(totalPromotionAmount() || 0)}
                            </span>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={2}>
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              Tổng tiền thanh toán
                            </span>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={3}>
                            {" "}
                            <span
                              style={{
                                fontWeight: "bold",
                                color: "red",
                              }}
                            >
                              {formatMoney(finalTotalPrice() || 0)}
                            </span>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </>
                    );
                  }}
                  title={() => (
                    <>
                      <Row>
                        <Col span={12}>
                          <span style={{ fontSize: "1rem", font: "bold" }}>
                            Dịch vụ sử dụng
                          </span>
                        </Col>
                        {order?.status === 1 ||
                          (order?.status === 2 && (
                            <Col span={12}>
                              <Button
                                style={{ float: "right" }}
                                type="primary"
                                icon={<PlusCircleFilled />}
                                onClick={() => setShowUpdateServiceOrder(true)}
                              >
                                Thêm dịch vụ
                              </Button>
                            </Col>
                          ))}
                      </Row>
                    </>
                  )}
                >
                  <Column
                    title="STT"
                    dataIndex="stt"
                    key="stt"
                    width={70}
                    render={(text, record, dataIndex) => {
                      return <div>{dataIndex + 1}</div>;
                    }}
                  />
                  <Column title="Tên dịch vụ" dataIndex="name" key="name" />
                  <Column
                    dataIndex="estimateTime"
                    key="estimateTime"
                    render={(text, record) => {
                      return <div>{record.estimateTime} phút</div>;
                    }}
                    title="Thời gian sử lý"
                  ></Column>
                  <Column
                    title="Giá dịch vụ"
                    dataIndex="price"
                    key="price"
                    render={(text, record, dataIndex) => {
                      return (
                        <div>
                          {formatMoney(record?.servicePrice?.price || 0)}
                        </div>
                      );
                    }}
                  />
                </Table>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      <UpDateServiceOrder
        show={showUpdateServiceOrder}
        order={order}
        handleCancel={() => setShowUpdateServiceOrder(false)}
        onSuccess={() => handleSuccessUPdateOrder()}
      />
      <ModalCreateBill
        order={order}
        show={showCreateBill}
        handleCancel={() => setShowCreateBill(false)}
        onSuccess={() => handleSuccessBill()}
      />
      <DrawerPromotionOrder
        show={showSelectPromotion}
        promotionDetails={promotionDetails}
        handleCancel={() => setShowSelectPromotion(false)}
      />

      <ModalChangeExcutor
        show={showChangeExcutor}
        handleCancel={() => setShowChangeExcutor(false)}
        order={order}
        onSuccess={() => handleSuccessChangeExcutor()}
      />

      <Loading loading={loading} />
    </>
  );
};
