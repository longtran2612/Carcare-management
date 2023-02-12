import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Col,
  Row,
  Select,
  Form,
  DatePicker,
  Button,
  Typography,
  Table,
} from "antd";
import {
  ExportOutlined,
  HomeOutlined,
  FileExcelOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { getReport, getCancelBillReport } from "pages/api/reportAPI";
import { getUsers } from "pages/api/userAPI";
import { getServices } from "pages/api/serviceAPI";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import { openNotification, openNotificationWarning } from "utils/notification";
const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

const ReportCancelBill = () => {
  const [form] = Form.useForm();
  const [typeDate, setTypeDate] = useState("d");
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataSaleReport, setDataSaleReport] = useState([]);

  const handleFetchUser = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFetchService = async () => {
    try {
      const res = await getServices();
      setServices(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeTypeDate = (value) => {
    setTypeDate(value);
    handleDatePicker();
  };

  const handleDatePicker = () => {
    switch (typeDate) {
      case "d":
        return <RangePicker disabledDate={(d)=> !d || d.isAfter(moment())} format={dateFormat} />;
      case "m":
        return <RangePicker disabledDate={(d)=> !d || d.isAfter(moment())} picker="month" />;
      case "y":
        return <RangePicker disabledDate={(d)=> !d || d.isAfter(moment())} picker="year" />;
    }
  };

  const handleExportExcel = async (values) => {
    if (dataSaleReport.length === 0) {
      openNotificationWarning("Không có dữ liệu để xuất file");
      return;
    }
    openNotification("Đang xuất file excel");
    let fromDate;
    let toDate;
    if (values.typeDate === "d") {
      fromDate = values.rangerDate[0];
      toDate = values.rangerDate[1];
    }
    if (values.typeDate === "m") {
      fromDate = moment(values.rangerDate[0]).startOf("month").add(1, "days");
      toDate = moment(values.rangerDate[1]).endOf("month");
    }
    if (values.typeDate === "y") {
      fromDate = moment(values.rangerDate[0]).startOf("year").add(1, "days");
      toDate = moment(values.rangerDate[1]).endOf("year");
    }

    setLoading(true);
    let body = {
      reportType: 1,
      userId: values.user,
      serviceId: values.service,
      fromDate: fromDate,
      toDate: toDate,
    };
    try {
      const response = await getReport(body);
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

  const onFinish = async (values) => {
    setLoading(true);
    let fromDate;
    let toDate;
    if (values.typeDate === "d") {
      fromDate = values.rangerDate[0];
      toDate = values.rangerDate[1];
    }
    if (values.typeDate === "m") {
      fromDate = moment(values.rangerDate[0]).startOf("month").add(1, "days");
      toDate = moment(values.rangerDate[1]).endOf("month");
    }
    if (values.typeDate === "y") {
      fromDate = moment(values.rangerDate[0]).startOf("year").add(1, "days");
      toDate = moment(values.rangerDate[1]).endOf("year");
    }

    let body = {
      userId: values.user,
      fromDate: fromDate,
      serviceId: values.service,
      toDate: toDate,
    };
    try {
      const res = await getCancelBillReport(body);
      setDataSaleReport(res.data.Data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchService();
    handleFetchUser();
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: 70,
      render: (text, record, dataIndex) => {
        return <div>{dataIndex + 1}</div>;
      },
    },
    {
      title: "Mã hóa đơn",
      dataIndex: "billCode",
      key: "billCode",
    },
    {
      title: "Ngày tạo hóa đơn",
      dataIndex: "billCreatedDate",
      key: "billCreatedDate",
      render: (text, record) => {
        return <div>{moment(record.billCreatedDate).format(dateFormat)}</div>;
      },
    },
    {
      title: "Ngày hủy hóa đơn",
      dataIndex: "billCanceledDate",
      key: "billCanceledDate",
      render: (text, record) => {
        return <div>{moment(record.billCanceledDate).format(dateFormat)}</div>;
      },
    },
    {
      title: "Mã nhân viên hủy",
      dataIndex: "canceledUserCode",
      key: "canceledUserCode",
    },
    {
      title: "Tên nhân viên hủy",
      dataIndex: "canceledUserName",
      key: "canceledUserName",
    },
    {
      title: "Dịch vụ",
      dataIndex: "services",
      key: "services",
    },
    {
      title: "Tổng tiền dịch vụ",
      dataIndex: "totalServicePrice",
      key: "totalServicePrice",
      render: (text, record) => {
        return <div>{formatMoney(record.totalPromotionAmount)}</div>;
      },
    },
    {
      title: "Tổng tiền khuyến mãi",
      dataIndex: "totalPromotionAmount",
      key: "totalPromotionAmount",
      render: (text, record) => {
        return <div>{formatMoney(record.totalPromotionAmount)}</div>;
      },
    },
    {
      title: "Tổng tiền thanh toán",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      render: (text, record) => {
        return <div>{formatMoney(record.paymentAmount)}</div>;
      },
    },
  ];

  return (
    <>
      <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Báo cáo hóa đơn hủy</Breadcrumb.Item>
      </Breadcrumb>

      <Form form={form} autoComplete="off">
        <Row style={{ padding: "0 5rem 0 5rem" }} gutter={[16]}>
          <Col span={24}>
            <Typography.Title level={2} className="content-center">
              Báo cáo hóa đơn hủy
            </Typography.Title>
          </Col>

          <Col span={3}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              name="typeDate"
              initialValue="d"
            >
              <Select
                onChange={onChangeTypeDate}
                value={typeDate}
                style={{ width: "100%" }}
              >
                <Select.Option value="d">Ngày</Select.Option>
                <Select.Option value="m">Tháng</Select.Option>
                <Select.Option value="y">Năm</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              name="rangerDate"
              initialValue={[
                moment(moment().subtract(7, "days")),
                moment(),
              ]}
            >
              {handleDatePicker()}
            </Form.Item>
          </Col>

          <Col span={7}>
            <Form.Item name="user">
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Chọn nhân viên"
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
                  user: undefined,
                  service: undefined,
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
                    onFinish(values);
                  })
                  .catch((info) => {
                    console.log("Validate Failed:", info);
                  });
              }}
              type="dashed"
            >
              Thống kê
            </Button>
          </Col>
          <Col span={4}>
            <Button
              style={{ width: "100%" }}
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    handleExportExcel(values);
                  })
                  .catch((info) => {
                    console.log("Validate Failed:", info);
                  });
              }}
              icon={<FileExcelOutlined />}
              type="primary"
            >
              Xuất báo cáo
            </Button>
          </Col>
          <Col span={24}>
            <Form.Item name="service">
              <Select
                showSearch
                placeholder="Chọn dịch vụ"
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
                {services.map((item) => (
                  <Option value={item.id}>
                    {item?.serviceCode + " - " + item?.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              bordered
              columns={columns}
              dataSource={dataSaleReport}
              scroll={{
                y: 280,
              }}
              pagination={{
                pageSize: 20,
              }}
            />
          </Col>
        </Row>
      </Form>
      <Loading loading={loading} />
    </>
  );
};
export default ReportCancelBill;
