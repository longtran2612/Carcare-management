import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import {
  Breadcrumb,
  Col,
  Row,
  Select,
  Form,
  Button,
  Typography,
  Input,
  Card,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { DatePicker, Space } from "antd";
import { getStatistic, getAdminStatistic } from "pages/api/statisticAPI";
import { ClearOutlined, DollarOutlined } from "@ant-design/icons";
import moment from "moment";
import { formatMoney } from "utils/format";
import { getUsers } from "pages/api/userAPI";
const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

const StatisticalPage = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [dataStatistic, setDataStatistic] = useState([]);
  const [adminStatistic, setAdminStatistic] = useState([]);
  const [fromDate, setFromDate] = useState(moment().subtract(7, "days"));
  const [toDate, setToDate] = useState(moment());

  const handleFetchUser = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetchData = async () => {
    let body = {
      fromDate: moment(moment().subtract(7, "days")),
      toDate: moment(),
    };
    try {
      const res = await getStatistic(body);
      setDataStatistic(res.data.Data);
      const resAdmin = await getAdminStatistic(body);
      setAdminStatistic(resAdmin.data.Data);
      console.log(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetchData2 = async (values) => {
    console.log(values);
    let body = {
      fromDate: moment(values.rangerDate[0]),
      toDate: moment(values.rangerDate[1]),
      userId: values.user,
    };
    try {
      console.log(body);
      const res = await getStatistic(body);
      setDataStatistic(res.data.Data);
      const resAdmin = await getAdminStatistic(body);
      setAdminStatistic(resAdmin.data.Data);
      console.log(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchUser();
    handleFetchData();
  }, []);

  const config = {
    data: dataStatistic,
    xField: "date",
    yField: "value",
    label: {
      position: "top",
      style: {
        fill: "#100101",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },

    title: {
      position: "center",
      text: "Biểu đồ thống kê doanh thu",
    },
    slider: {
      start: 0.05,
      end: 0.95,
    },
    meta: {
      date: {
        alias: "Tháng",
      },
      value: {
        alias: "Doanh số",
        formatter: (v) => {
          return formatMoney(v);
        },
      },
    },
  };
  const handleDatePicker = () => {
    return (
      <RangePicker
        disabledDate={(current) =>
          (current && current > moment().endOf("day")) ||
          (current && current < moment().subtract(30, "days"))
        }
        format={dateFormat}
      />
    );
  };

  const cardStyle = {
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    height: "70px",
    padding: "10px 0 10px 0",
    background: "#C9DEE6",
    border: "0.5px solid #0E5599",
    boxShadow: " 4px 4px #053A6Cx #ADBBF3",
  };

  return (
    <>
      <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Dashboard</Breadcrumb.Item>
      </Breadcrumb>
      <Form form={form} autoComplete="off">
        <Row span={24}>
         
          <Col span={24}>
          <Typography.Title level={3}>(Từ ngày {moment(fromDate).format(dateFormat)} -  đến  {moment(toDate).format(dateFormat)})</Typography.Title>
          </Col>
        </Row>
       
        <Row style={{ padding: "0 5rem 0 5rem" }} gutter={[16]}>
          {/* <Col span={13}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày",
                },
              ]}
              name="rangerDate"
              initialValue={[moment(moment().subtract(7, "days")), moment()]}
            >
              {handleDatePicker()}
            </Form.Item>
          </Col>

          <Col span={7}>
            <Form.Item name="user">
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Nhân viên"
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
                {users.map((item) => (
                  <Option value={item.id}>
                    {item?.name + " - " + item?.phone}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={1}>
            <Button
              icon={<ClearOutlined />}
              style={{ width: "100%" }}
              onClick={() => {
                form.setFieldsValue({
                  rangerDate: [moment(moment().subtract(7, "days")), moment()],
                  user: undefined,
                });
              }}
              type="dashed"
            ></Button>
          </Col>
          <Col span={3}>
            <Button
              style={{ width: "100%" }}
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    handleFetchData2(values);
                  })
                  .catch((info) => {
                    console.log("Validate Failed:", info);
                  });
              }}
              type="primary"
            >
              Thống kê
            </Button>
          </Col> */}
        </Row>
        <Row gutter={32} style={{ marginBottom: "20px" }}>
          {/* <Col  span={4}>
            <Card bodyStyle={{padding:'0'}} style={cardStyle}>
              <Row>
                <Col style={{ textAlign: "center" }} span={24}>
                  <span>Tổng số bán hàng</span>
                </Col>
                <Col style={{ textAlign: "center" }} className="content-center" span={24}>
                  <span style={{ color: "green", fontSize: "17px" }}>
                    {formatMoney(adminStatistic?.totalServicePrice || 0)}
                  </span>
                </Col>
              </Row>
            </Card>
          </Col> */}
          <Col span={6}>
            <Card bodyStyle={{ padding: "0" }} style={cardStyle}>
              <Row>
                <Col style={{ textAlign: "center" }} span={24}>
                  <span>Tổng tiền khuyến mãi</span>
                </Col>
                <Col
                  style={{ textAlign: "center" }}
                  className="content-center"
                  span={24}
                >
                  <span style={{ color: "green", fontSize: "17px" }}>
                    {formatMoney(adminStatistic?.totalPromotionAmount || 0)}
                  </span>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={6}>
            <Card bodyStyle={{ padding: "0" }} style={cardStyle}>
              <Row>
                <Col style={{ textAlign: "center" }} span={24}>
                  <span>Doanh số</span>
                </Col>
                <Col
                  style={{ textAlign: "center" }}
                  className="content-center"
                  span={24}
                >
                  <span style={{ color: "green", fontSize: "17px" }}>
                    {formatMoney(adminStatistic?.totalPaymentAmount || 0)}
                  </span>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={6}>
            <Card bodyStyle={{ padding: "0" }} style={cardStyle}>
              <Row>
                <Col style={{ textAlign: "center" }} span={24}>
                  <span>Hóa đơn</span>
                </Col>
                <Col
                  style={{ textAlign: "center" }}
                  className="content-center"
                  span={24}
                >
                  <span style={{ color: "green", fontSize: "17px" }}>
                    {adminStatistic?.totalBill || 0}
                  </span>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={6}>
            <Card bodyStyle={{ padding: "0" }} style={cardStyle}>
              <Row>
                <Col style={{ textAlign: "center" }} span={24}>
                  <span>Hóa đơn hủy</span>
                </Col>
                <Col
                  style={{ textAlign: "center" }}
                  className="content-center"
                  span={24}
                >
                  <span style={{ color: "red", fontSize: "17px" }}>
                    {adminStatistic?.totalCancelBill || 0}
                  </span>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Column {...config} />;
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default StatisticalPage;
