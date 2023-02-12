import React, { useEffect, useState } from "react";
import { getAllBillsByCustomerId } from "pages/api/billAPI";
import Loading from "components/Loading";
import {
  Avatar,
  List,
  Space,
  Drawer,
  Col,
  Row,
  Typography,
  Divider,
  Tag,
} from "antd";
import { formatMoney } from "utils/format";
import moment from "moment";
import Image from "next/image";
import order_cancel from "public/images/order_cancel.png";
import payment_completed from "public/images/payment_complete.gif";
import Cookies from "js-cookie";

const { Title } = Typography;
const formatDate = "HH:mm DD/MM/YYYY";

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p
      style={{ font: "bold" }}
      className="site-description-item-profile-p-label"
    >
      {title}:
    </p>
    {content}
  </div>
);
const BillCustomer = () => {
  const [bills, setBills] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [billDetail, setBillDetail] = useState({});

  const getAllBill = async () => {
    setLoading(true);
    let id = Cookies.get("id");
    try {
      const res = await getAllBillsByCustomerId(id);
      console.log(res.data.Data);
      setBills(res.data.Data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const totalPriceService = () => {
    return billDetail?.services?.reduce((total, cur) => {
      return (total += cur?.servicePrice?.price);
    }, 0);
  };
  const totalTimeService = () => {
    return billDetail?.services?.reduce((total, cur) => {
      return (total += cur?.estimateTime);
    }, 0);
  };
  const handleType = (value) => {
    switch (value) {
      case "MONEY":
        return "Giảm tiền";
      case "PERCENTAGE":
        return "Giảm theo";
      case "SERVICe":
        return "Dịch vụ";
      default:
    }
  };
  const handleImage = (value) => {
    switch (value) {
      case 1:
        return <Image width={170} height={170} src={payment_completed} />;
      case 2:
        return <Image width={170} height={170} src={order_cancel} />;
      default:
        break;
    }
  };
  const convertOrderStatus = (status) => {
    console.log("statusss", status);
    switch (status) {
      case 1:
        return (
          <Tag
            style={{
              height: "30px",
              padding: "5px",
              fontSize: "15px",
            }}
            color="green"
          >
            Đã thanh toán
          </Tag>
        );
      case 2:
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
      default:
        break;
    }
  };
  const checkPromotion = (promotion) => {
    console.log(promotion);
    if (promotion) {
      if (promotion.length > 0) {
        return true;
      }
    }
  };

  const handlePricePromotion = (promotion) => {
    console.log(promotion);
    if (promotion?.type === "MONEY") {
      return promotion?.amount;
    }
    if (promotion.type === "PERCENTAGE") {
      let total = (totalPriceService() * promotion.amount) / 100;
      if (total > promotion.maximumDiscount) {
        return promotion.maximumDiscount;
      } else {
        return total;
      }
    }
  };
  useEffect(() => {
    getAllBill();
  }, []);

  return (
    <>
      <List
        itemLayout="vertical"
        size="small"
        pagination={{
          pageSize: 3,
        }}
        style={{ overflow: "auto", height: "520px" }}
        dataSource={bills}
        renderItem={(item) => (
          <List.Item
            key={item.title}
            onClick={() => {
              setBillDetail(item);
              setShowDetail(true);
            }}
            extra={handleImage(item.status)}
            style={{
              cursor: "pointer",
              border: "1px solid #9B9A9A",
              margin: "10px",
              borderRadius: "8px",
              padding: "5px",
              backgroundColor: "white",
              boxShadow: "0px 0px 3px 0px #9B9A9A",
            }}
          >
            <List.Item.Meta
              title={
                <Typography.Title
                  style={{ color: "#1C1266", margin: "0" }}
                  level={5}
                >
                  #{item.billCode}
                </Typography.Title>
              }
            />
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <DescriptionItem title="Tên xe" content={item.carName} />
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <DescriptionItem
                  title="Biển số"
                  content={item.carLicensePlate}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <DescriptionItem
                  title="Trạng thái"
                  content={convertOrderStatus(item.status)}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <DescriptionItem
                  title="Tổng tiền dịch vụ"
                  content={formatMoney(item.totalServicePrice)}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <DescriptionItem
                  title="Khuyến mãi"
                  content={formatMoney(item.totalPromotionAmount)}
                />
              </Col>

              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <DescriptionItem
                  title="Thanh toán"
                  content={formatMoney(item.paymentAmount)}
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <DescriptionItem
                  title="Ngày thanh toán"
                  content={moment(item.totalServicePrice).format(formatDate)}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <DescriptionItem
                  title="Hình thức thanh toán"
                  content={
                    item?.paymentType === "CASH" ? (
                      <Tag color="green">Tiền mặt</Tag>
                    ) : (
                      <Tag color="cyan">Thẻ - Chuyển khoản</Tag>
                    )
                  }
                />
              </Col>
            </Row>
          </List.Item>
        )}
      />
      <Drawer
        title="Chi tiết hóa đơn"
        placement="right"
        onClose={() => setShowDetail(false)}
        visible={showDetail}
        width="70%"
      >
        <Divider>
          <Title level={5}>
            Hóa đơn mã:
            <span style={{ color: "blue" }}> #{billDetail.billCode} </span>
          </Title>
        </Divider>
        <p
          style={{ color: "red", marginBottom: "5px" }}
          className="site-description-item-profile-p"
        >
          Xe xử lý
        </p>
        <Row>
          {/* <Col span={8}>
            <DescriptionItem title="Mã xe" content={billDetail.carCode} />
          </Col> */}
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <DescriptionItem title={billDetail.carName} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <DescriptionItem
              title="Biển số"
              content={billDetail.carLicensePlate}
            />
          </Col>
        </Row>
        <Divider />
        <p
          style={{ color: "red", marginBottom: "5px" }}
          className="site-description-item-profile-p"
        >
          Dịch vụ sử dụng
        </p>
        <Row>
          {billDetail?.services?.map((item, index) => (
            <>
              {/* <Col span={6}>
                <DescriptionItem
                  title="Mã dịch vụ"
                  content={item?.serviceCode}
                />
              </Col> */}

              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <DescriptionItem title={item?.name} />
              </Col>
              {/* <Col span={8}>
                <DescriptionItem
                  title="Thời gian xử lý"
                  content={item?.estimateTime + " phút"}
                />
              </Col> */}
              <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                <DescriptionItem
                  title="Giá"
                  content={formatMoney(item?.servicePrice?.price)}
                />
              </Col>
            </>
          ))}
        </Row>
        {checkPromotion(billDetail?.promotionDetails) && (
          <>
            <Divider />
            <p
              style={{ color: "red", marginBottom: "5px" }}
              className="site-description-item-profile-p"
            >
              Khuyến mãi sử dụng
            </p>
            {billDetail?.promotionDetails?.map((item, index) => (
              <>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <DescriptionItem title={item?.promotionDetailCode} />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <DescriptionItem
                      title="Mô tả"
                      content={item?.description}
                    />
                  </Col>
                  {/* <Col span={6}>
                    <DescriptionItem
                      title="Loại khuyến mãi"
                      content={handleType(item?.type)}
                    />
                  </Col> */}
                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    {/* {(item?.type == "PERCENTAGE" || item?.type == "MONEY") && ( */}
                    <DescriptionItem
                      title="Tiền giảm"
                      content={formatMoney(item?.promotionUsedAmount)}
                    />
                    {/* )} */}
                  </Col>
                </Row>
              </>
            ))}
          </>
        )}

        <Divider />
        <p
          style={{ color: "red", marginBottom: "5px" }}
          className="site-description-item-profile-p"
        >
          Thông tin thanh toán
        </p>
        <Row>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <DescriptionItem
              title="Hình thức thanh toán"
              content={
                billDetail.paymentType === "CASH" ? (
                  <Tag color="green">Tiền mặt</Tag>
                ) : (
                  <Tag color="cyan">Thẻ - Chuyển khoản</Tag>
                )
              }
            />
          </Col>
          {billDetail.paymentType != "CASH" && (
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <DescriptionItem
                title="Thông tin thanh toán"
                content={billDetail?.cardNumber}
              />
            </Col>
          )}
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <DescriptionItem
              title="Ngày thanh toán"
              content={moment(billDetail.paymentDate).format(formatDate)}
            />
          </Col>
          {billDetail.paymentType === "CASH" && (
            <Col xs={24} sm={24} md={24} lg={8} xl={8}></Col>
          )}

          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <DescriptionItem
              title="Tổng Tiền dịch vụ"
              content={formatMoney(billDetail?.totalServicePrice || 0)}
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <DescriptionItem
              title="Tổng tiền khuyến mãi"
              content={formatMoney(billDetail?.totalPromotionAmount || 0)}
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <DescriptionItem
              title="Tổng tiền thanh toán"
              content={
                <span style={{ color: "red" }}>
                  {formatMoney(billDetail?.paymentAmount || 0)}
                </span>
              }
            />
          </Col>
        </Row>
      </Drawer>

      <Loading loading={loading} />
    </>
  );
};

export default BillCustomer;
