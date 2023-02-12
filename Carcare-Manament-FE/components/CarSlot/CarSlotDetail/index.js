import React, { useState, useEffect } from "react";
import {
  Tag,
  Row,
  Col,
  Typography,
  Table,
  Timeline,
  Button,
  Text,
  Card,
  Steps,
  Modal,
  Drawer,
  List,
  Avatar,
  Select,
  Breadcrumb,
  Form,
} from "antd";
import {
  getCarSlotByCode,
  getCarSlotDetail,
  executeCarSlot,
  cancelCarSlot,
  completeCarSlot,
} from "pages/api/carSlotApi";
import {
  SyncOutlined,
  LoadingOutlined,
  PrinterOutlined,
  PlusCircleFilled,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  TagsOutlined,
  HomeOutlined,
  CarOutlined,
  RollbackOutlined,
  QuestionCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { getUserById, getUserAvaliable } from "pages/api/userAPI";
import { useRouter } from "next/router";
import { formatMoney } from "utils/format";
import { getCarById } from "pages/api/carAPI";
import { getOrderById, updateOrder } from "pages/api/orderAPI";
import { getCustomerById } from "pages/api/customerAPI";
import Loading from "components/Loading";
import Image from "next/image";
import moment from "moment";
import ModalSelectOrder from "components/Modal/ModalSelectOrder";
import { openNotification, openNotificationWarning } from "utils/notification";
import ModalCreateBill from "components/Modal/ModalCreateBill";
import ModalQuestion from "components/Modal/ModalQuestion";
import UpDateServiceOrder from "components/Modal/ModalUpdateServiceOrder";
import DrawerPromotionOrder from "components/Drawer/DrawerPromotionOrder";
import { getAllPromotionUseable } from "pages/api/promotionDetail";
import ModalChangeExcutor from "components/Modal/ModalChangeExecutor";

const { Option } = Select;

const formatDate = "HH:mm DD/MM/YYYY";

const CarSlotDetail = ({ carSlotId }) => {
  const [form] = Form.useForm();
  const { Title } = Typography;
  const { Column, ColumnGroup } = Table;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCreateBill, setShowCreateBill] = useState(false);

  const [order, setOrder] = useState(null);
  const [car, setCar] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  const [orderSelected, setOrderSelected] = useState(null);

  const [showConfimCancel, setShowConfimCancel] = useState(false);
  const [showConfimComplete, setShowConfimComplete] = useState(false);
  const [showConfimExecute, setShowConfimExecute] = useState(false);
  const [showUpdateServiceOrder, setShowUpdateServiceOrder] = useState(false);
  const [promotionDetails, setPromotionDetails] = useState([]);
  const [showSelectPromotion, setShowSelectPromotion] = useState(false);
  const [showChangeExcutor, setShowChangeExcutor] = useState(false);
  const [step, setStep] = useState(1);

  const [carSlotDetail, setCarSlotDetail] = useState();

  const fetchCarSlotDetail = async () => {
    setLoading(true);
    try {
      const response = await getCarSlotByCode(carSlotId);
      setCarSlotDetail(response.data.Data);
      fetchOrderDetail(response.data.Data?.orderId);
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
      // form.setFieldValue("executorId", response.data.Data.id);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCarDetail = async (data) => {
    setLoading(true);
    try {
      const response = await getCarById(data);
      setCar(response.data.Data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchCustomerDetail = async (data) => {
    setLoading(true);
    try {
      const response = await getCustomerById(data);
      setCustomer(response.data.Data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (data) => {
    setLoading(true);
    try {
      const response = await getOrderById(data);
      console.log("order", response.data.Data);
      setOrder(response.data.Data);
      fetchCarDetail(response.data.Data.carId);
      fetchCustomerDetail(response.data.Data.customerId);
      fetchUser(response.data.Data.executorId);
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

  useEffect(() => {
    if (carSlotId) {
      fetchCarSlotDetail();
    }
  }, [carSlotId]);
  useEffect(() => {
    if (order) {
      handleFetchPromotion();
    }
  }, [order]);

  const convertStatusCarSlot = (status) => {
    console.log("statusss", status);
    switch (status) {
      case "AVAILABLE":
        return (
          <Tag
            style={{
              height: "30px",
              padding: "5px",
              fontSize: "15px",
            }}
            color="green"
          >
            Đang trống
          </Tag>
        );
      case "INAVAILABLE":
        return (
          <Tag
            style={{
              height: "30px",
              alignItems: "center",
              fontSize: "15px",
            }}
            color="red"
          >
            Đang sửa chữa
          </Tag>
        );
      case "IN_USE":
        return (
          <Tag
            style={{
              height: "30px",
              padding: "5px",
              fontSize: "15px",
            }}
            icon={<SyncOutlined spin />}
            color="processing"
          >
            Đang xử lý
          </Tag>
        );
    }
  };
  console.log(carSlotDetail?.status);

  const handleExecuteOrder = async () => {
    setLoading(true);
    let dataExecute = {
      orderId: orderSelected,
      carSlotId: carSlotDetail?.id,
    };
    try {
      const response = await executeCarSlot(dataExecute);
      openNotification("Thành công!", "Bắt đầu xử lý yêu cầu");
      fetchCarSlotDetail();
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Đã có lỗi xảy ra");
      }
      setLoading(false);
    }
  };
  const handleCompleteOrder = async () => {
    setLoading(true);
    let dataComplete = {
      orderId: order?.id,
      carSlotId: carSlotDetail?.id,
      totalExecuteTime: moment().diff(
        moment(carSlotDetail?.orderStartExecuting),
        "minutes"
      ),
    };
    try {
      console.log(dataComplete);
      const response = await completeCarSlot(dataComplete);
      openNotification("Hoàn thành xử lý thành công!");
      fetchCarSlotDetail();
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Đã có lỗi xảy ra");
      }
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setLoading(true);
    try {
      const response = await cancelCarSlot(carSlotDetail?.id);
      openNotification("Hủy yêu cầu thành công!", "");
      fetchCarSlotDetail();
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Đã có lỗi xảy ra");
      }
      setLoading(false);
    }
  };

  const handleSuccessBill = () => {
    setShowCreateBill(false);
    fetchCarSlotDetail();
  };

  const totalPriceService = () => {
    return order?.services?.reduce((total, cur) => {
      return (total += cur?.servicePrice?.price);
    }, 0);
  };

  const totalTimeService = () => {
    return order?.services?.reduce((total, cur) => {
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
    fetchCarSlotDetail();
  };

  const handleSuccessChangeExcutor = () => {
    setShowChangeExcutor(false);
    fetchCarSlotDetail();
  };
  return (
    <>
      <Row style={{ paddingBottom: "10px" }}>
        <Col span={12}>
          <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
            <Breadcrumb.Item href="/admin">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">
              <CarOutlined /> Quản lý vị trí chăm sóc xe
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">
              {carSlotDetail?.name}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={12}>
          <Button
            style={{ float: "right" }}
            icon={<RollbackOutlined />}
            onClick={() => router.back()}
          >
            Trở lại
          </Button>
        </Col>
      </Row>
    
        <Form form={form} layout="vertical">
          <div className="carslot">
            <div className="carslot-content">
              <div className="carslot-content--header">
                {/* <Title style={{ padding: "0px", color: "blue" }} level={3}>
                  {carSlotDetail?.name}
                </Title> */}
                <div></div>
                <div style={{float:'right'}}> {convertStatusCarSlot(carSlotDetail?.status)}</div>
              </div>
              {carSlotDetail?.status == "IN_USE" && (
                <Row>
                  <Col span={6}>
                    <div
                      style={{ marginRight: "10px" }}
                      className="carslot-customer content-white"
                    >
                       
                      <Title level={4}>Nhân viên xử lý</Title>
                      <Timeline>
                        <span>{user?.name + " - " + user?.phone}</span>

                        <EditOutlined
                          style={{ marginLeft: "5px" }}
                          onClick={() => setShowChangeExcutor(true)}
                        />
                      </Timeline>
                      <Title level={4}>Thông tin khách hàng</Title>
                      <Timeline>
                        <Timeline.Item>
                          Mã: {customer?.customerCode}
                        </Timeline.Item>
                        <Timeline.Item>Tên: {customer?.name}</Timeline.Item>
                        <Timeline.Item>
                          Số điện thoại: {customer?.phoneNumber}
                        </Timeline.Item>
                      </Timeline>
                      <Title level={4}>Thông tin xe</Title>
                      <Timeline>
                        <Timeline.Item>Tên xe: {car?.name}</Timeline.Item>
                        <Timeline.Item>Nhãn hiệu: {car?.brand}</Timeline.Item>
                        <Timeline.Item>Loại xe: {car?.model}</Timeline.Item>
                        <Timeline.Item>Nhiên liệu: {car?.fuel}</Timeline.Item>
                        <Timeline.Item>Chỗ ngồi: {car?.seats}</Timeline.Item>
                        <Timeline.Item>
                          Biển số: {car?.licensePlate}
                        </Timeline.Item>
                        <Timeline.Item>Màu xe: {car?.color}</Timeline.Item>
                      </Timeline>
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
                            title="Băt đầu xử lý"
                            status="process"
                            icon={<LoadingOutlined />}
                            description={
                              moment(carSlotDetail?.orderStartExecuting).format(
                                formatDate
                              ) || ""
                            }
                          />
                          <Steps.Step
                            title="Dự kiến hoàn thành"
                            status="wait"
                            description={moment(
                              carSlotDetail?.orderStartExecuting
                            )
                              .add(totalTimeService(), "m")
                              .format(formatDate)}
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
                                  <Table.Summary.Cell
                                    index={0}
                                  ></Table.Summary.Cell>
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
                                      onClick={() =>
                                        setShowSelectPromotion(true)
                                      }
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
                                  <Table.Summary.Cell
                                    index={0}
                                  ></Table.Summary.Cell>
                                  <Table.Summary.Cell
                                    index={1}
                                  ></Table.Summary.Cell>
                                  <Table.Summary.Cell index={2}>
                                    <span
                                      style={{
                                        color: "red",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Tổng thanh toán (tạm tính)
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
                                  <span
                                    style={{ fontSize: "1rem", font: "bold" }}
                                  >
                                    Dịch vụ sử dụng
                                  </span>
                                </Col>
                                <Col span={12}>
                                  <Button
                                    style={{ float: "right" }}
                                    type="primary"
                                    icon={<PlusCircleFilled />}
                                    onClick={() =>
                                      setShowUpdateServiceOrder(true)
                                    }
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
                          <Column
                            title="Tên dịch vụ"
                            dataIndex="name"
                            key="name"
                          />
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
                                  {formatMoney(
                                    record?.servicePrice?.price || 0
                                  )}
                                </div>
                              );
                            }}
                          />
                        </Table>
                      </Col>

                      <Col span={24}>
                        <Row className="PullRight">
                          <div
                            style={{
                              bottom: "0",
                              right: "20px",
                              margin: "10px",
                            }}
                            className="service-action"
                          >
                            <div style={{ marginRight: "20px" }}>
                              <Button
                                onClick={() => {
                                  setShowConfimCancel(true);
                                }}
                                size="large"
                                type="primary"
                                danger={true}
                              >
                                Hủy yêu cầu
                              </Button>
                            </div>
                            <div>
                              <Button
                                type="primary"
                                size="large"
                                onClick={() => {
                                  form
                                    .validateFields()
                                    .then((values) => {
                                      setShowConfimComplete(true);
                                    })
                                    .catch((info) => {
                                      console.log("Validate Failed:", info);
                                    });
                                }}
                              >
                                Hoàn thành - Thanh toán - In hóa đơn
                              </Button>
                            </div>
                          </div>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
              {carSlotDetail?.status == "AVAILABLE" && (
                  <div style={{overflow:'auto',height: "500px",minHeight:"75vh"}} className='content-white-admin'>
                <Row className="content-white" span={24}>
                  <Col span={24}>
                    <Typography.Title
                      className="content-center"
                      style={{ color: "#829822" }}
                      level={2}
                    >
                      Vị trí đang trống !!! vui lòng chọn yêu cầu xử lý
                    </Typography.Title>
                  </Col>
                  <Col span={24}>
                    <ModalSelectOrder
                      onSelectOrder={(value) => {
                        setOrderSelected(value);
                        setShowConfimExecute(true);
                      }}
                    />
                  </Col>
                </Row>
                </div>
              )}
            </div>
          </div>
        </Form>
    
      <ModalCreateBill
        order={order}
        show={showCreateBill}
        handleCancel={() => setShowCreateBill(false)}
        onSuccess={() => handleSuccessBill()}
      />
      <ModalQuestion
        title="Bạn có chắc chắn xử lý yêu cầu này?"
        visible={showConfimExecute}
        handleCancel={() => setShowConfimExecute(false)}
        handleOk={() => {
          handleExecuteOrder();
          setShowConfimExecute(false);
        }}
      />
      <ModalQuestion
        title="Bạn có chắc chắn hủy yêu cầu xử lý này?"
        visible={showConfimCancel}
        handleCancel={() => setShowConfimCancel(false)}
        handleOk={() => {
          handleCancelOrder();
          setShowConfimCancel(false);
        }}
      />
      <UpDateServiceOrder
        show={showUpdateServiceOrder}
        order={order}
        handleCancel={() => setShowUpdateServiceOrder(false)}
        onSuccess={() => handleSuccessUPdateOrder()}
      />
      <Modal
        title="Hoàn thành yêu cầu"
        width={700}
        onCancel={() => setShowConfimComplete(false)}
        visible={showConfimComplete}
        footer={
          <>
            <div className="steps-action">
              <Button
                style={{
                  margin: "0 8px",
                }}
                onClick={() => {
                  setShowConfimComplete(false);
                }}
              >
                Hủy
              </Button>
              <Button
                type="dashed"
                icon={<PrinterOutlined />}
                onClick={() => {
                  handleCompleteOrder();
                  setShowConfimComplete(false);
                  setShowCreateBill(true);
                }}
              >
                Hoàn thành - Thanh toán - In hóa đơn
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  handleCompleteOrder();
                  setShowConfimComplete(false);
                }}
              >
                Hoàn thành yêu cầu
              </Button>
            </div>
          </>
        }
      >
        <Typography.Title level={4}>
          <QuestionCircleOutlined style={{ color: "yellowgreen" }} /> Bạn có
          chắc chắn hoàn thành xử lý yêu cầu này?
        </Typography.Title>
      </Modal>

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

export default CarSlotDetail;
