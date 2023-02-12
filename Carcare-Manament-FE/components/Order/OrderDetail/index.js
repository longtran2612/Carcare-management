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
  Popconfirm,
  Modal,
} from "antd";
import { getOrderById, updateOrder } from "pages/api/orderAPI";
import {
  LoadingOutlined,
  TagsOutlined,
  SyncOutlined,
  PlusCircleFilled,
  PlayCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { getUserById, getUserAvaliable } from "pages/api/userAPI";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import moment from "moment";
import { useRouter } from "next/router";
import { openNotification, openNotificationWarning } from "utils/notification";
import { getAllPromotionUseable } from "pages/api/promotionDetail";
import UpDateServiceOrder from "components/Modal/ModalUpdateServiceOrder";
import DrawerPromotionOrder from "components/Drawer/DrawerPromotionOrder";
import ModalSelectSlot from "components/Modal/ModalSelectSlot";
import ModalChangeExcutor from "components/Modal/ModalChangeExecutor";

const { Title } = Typography;
const { Option } = Select;
const { Column, ColumnGroup } = Table;
const formatDate = "HH:mm DD/MM/YYYY";

export const OrderDetail = ({ orderRequestId }) => {
  const [form] = Form.useForm();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showUpdateServiceOrder, setShowUpdateServiceOrder] = useState(false);
  const [modalSelectSlot, setModalSelectSlot] = useState(false);
  const [step, setStep] = useState(0);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  const [showChangeExcutor, setShowChangeExcutor] = useState(false);

  const [promotionDetails, setPromotionDetails] = useState([]);
  const [showSelectPromotion, setShowSelectPromotion] = useState(false);

  const getOrder = async () => {
    setLoading(true);
    try {
      const res = await getOrderById(orderRequestId);
      setOrder(res.data.Data);
      fetchUser(res.data.Data.executorId);
      fetchUsers();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
  const handleFetchPromotion = async () => {
    try {
      const res = await getAllPromotionUseable(order?.id);
      setPromotionDetails(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrder();
  }, [orderRequestId]);

  useEffect(() => {
    handleFetchPromotion();
  }, [order]);

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

  const handleSuccessUPdateOrder = () => {
    setShowUpdateServiceOrder(false);
    getOrder();
  };
  const handkeSuccessSelectSlot = async () => {
    router.push("/admin");
    // router.replace("/admin");
  };
  const handleSuccessChangeExcutor = () => {
    setShowChangeExcutor(false);
    getOrder();
  };

  console.log("order", order);
  return (
    <>
      <div className="carslot-content--header">
        <Title style={{ padding: "0px" }} level={3}>
          Thông tin yêu cầu
          <span style={{ color: "blue" }}>#{order?.orderCode}</span>
        </Title>
        <div>
          {" "}
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
        </div>
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
                  <span style={{ color: "red" }}> Chưa có nhân viên xử lý</span>
                )}

                <EditOutlined
                  style={{ marginLeft: "5px" }}
                  onClick={() => setShowChangeExcutor(true)}
                />
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
              <div
                style={{ bottom: "0", right: "20px", margin: "10px" }}
                className="service-action"
              >
                <div>
                  <Popconfirm
                    title="Bạn có chắc muốn Xử lý yêu cầu này?"
                    onConfirm={() => {
                      {
                        order?.executorId
                          ? setModalSelectSlot(true)
                          : openNotification("Vui lòng chọn nhân viên xử lý");
                      }
                    }}
                    okText="Đồng ý"
                    cancelText="Hủy"
                  >
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlayCircleOutlined />}
                    >
                      Xử lý yêu cầu
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          </Col>
          <Col span={18}>
            <Row>
              <Col
                className="content-white"
                style={{ marginBottom: "1rem" }}
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
                    title="Dự kiến nhận xe"
                    description={moment(order?.estimateReceiveDate).format(
                      formatDate
                    )}
                  />
                  <Steps.Step
                    title="Dự kiến xử lý"
                    description={moment(order?.estimateExecuteDate).format(
                      formatDate
                    )}
                  />
                  <Steps.Step
                    title="Dự kiến hoàn thành"
                    description={
                      moment(order?.estimateExecuteDate)
                      .add(order?.totalEstimateTime, "m")
                      .format(formatDate)
                    }
                  />
                </Steps>
              </Col>
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
      <DrawerPromotionOrder
        show={showSelectPromotion}
        promotionDetails={promotionDetails}
        handleCancel={() => setShowSelectPromotion(false)}
      />
      <ModalSelectSlot
        show={modalSelectSlot}
        onSelectOrder={order?.id}
        handleCancel={() => setModalSelectSlot(false)}
        onSuccess={() => handkeSuccessSelectSlot()}
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
