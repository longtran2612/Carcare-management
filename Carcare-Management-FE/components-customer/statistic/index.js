import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  notification,
  Card,
  Statistic,
} from "antd";
import { getStatisticCustomer } from "pages/api/statisticAPI";
import Loading from "components/Loading";
import Cookies from "js-cookie";
import { formatMoney } from "utils/format";
import { MoneyCollectFilled, DollarOutlined ,BookOutlined } from "@ant-design/icons";

function StatisticCustomer() {
  const [loading, setLoading] = useState(false);
  const [statistic, setStatistic] = useState();
  const [id, setId] = useState(Cookies.get("id"));

  const fetchCustomerStatistic = async () => {
    try {
      const res = await getStatisticCustomer(id);
      console.log(res);
      setStatistic(res.data.Data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCustomerStatistic();
  }, []);

  const cardStyle = {
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    height: "170px",
    background: "#C9DEE6",
    border: "0.5px solid #0E5599",
    boxShadow: " 4px 4px #053A6Cx #ADBBF3",
  };
  return (
    <>
      <Row
        justify="space-around"
        align="middle"
        style={{
          textAlign: "center",
        }}
        gutter={[16, 16]}
      >
        <Col xs={24} sm={24} md={24} lg={12} xl={12} >
          <Card style={cardStyle}>
            <Row gutter={16}>
              <Col span={12}>
                <DollarOutlined style={{ fontSize: "120px" }} />
              </Col>
              <Col span={12}>
                <Typography.Title level={4}>Tổng chi tiêu</Typography.Title>
                <Typography.Title level={3}>
                  {formatMoney(statistic?.totalPaymentAmount || 0)}
                </Typography.Title>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col  xs={24} sm={24} md={24} lg={12} xl={12}>
          <Card style={cardStyle}>
            <Row gutter={16}>
              <Col span={12}>
                <DollarOutlined style={{ fontSize: "120px" }} />
              </Col>
              <Col span={12}>
                <Typography.Title level={4}>
                  Tổng tiền được khuyến mãi{" "}
                </Typography.Title>
                <Typography.Title level={3}>
                  {formatMoney(statistic?.totalPromotionAmount || 0)}
                </Typography.Title>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col   xs={24} sm={24} md={24} lg={12} xl={12}>
          <Card style={cardStyle}>
            <Row gutter={16}>
              <Col span={12}>
                <BookOutlined style={{ fontSize: "120px" }} />
              </Col>
              <Col span={12}>
                <Typography.Title level={4}>Hóa đơn</Typography.Title>
                <Typography.Title level={3}>
                  {statistic?.totalBill || 0}
                </Typography.Title>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col  xs={24} sm={24} md={24} lg={12} xl={12}>
          <Card style={cardStyle}>
            <Row gutter={16}>
              <Col span={12}>
                <BookOutlined  style={{ fontSize: "120px" }} />
              </Col>
              <Col span={12}>
                <Typography.Title level={4}>Hóa đơn hủy </Typography.Title>
                <Typography.Title style={{color:"red"}} level={3}>
                  {statistic?.totalCancelBill || 0}
                </Typography.Title>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Loading loading={loading} />
    </>
  );
}

export default StatisticCustomer;
