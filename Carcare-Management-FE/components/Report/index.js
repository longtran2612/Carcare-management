import React, { useState, useEffect } from "react";
import { Breadcrumb, Col, Row, Select, Form, DatePicker, Button,Typography } from "antd";
import {
  ExportOutlined,
  HomeOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { getReport } from "pages/api/reportAPI";
import { getCustomers } from "pages/api/customerAPI";
import { getUsers } from "pages/api/userAPI";
import Loading from "components/Loading";
import { openNotification, openNotificationWarning } from "utils/notification";
const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

const ReportPage = () => {
  const [form] = Form.useForm();
  const [typeDate, setTypeDate] = useState("d");
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState(100);
  const [loading, setLoading] = useState(false);
  // const [fromDate, setFromDate] = useState(moment());
  // const [toDate, setToDate] = useState(moment());

  const handleFetchCustomer = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFetchUser = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.Data);
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

  const onFinish = async (values) => {
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
      reportType: values.reportType,
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

  // const handleDate = () => {
  //   console.log(form.getFieldValue('rangerDate'));
  //   switch (typeDate) {
  //     case "d":
  //       setFromDate(moment(form.getFieldValue('rangerDate') && form.getFieldValue('rangerDate')[0]).startOf("day"));
  //       setToDate(moment(form.getFieldValue('rangerDate') &&form.getFieldValue('rangerDate')[1]).endOf("day"));
  //     case "m":
  //       setFromDate(moment(form.getFieldValue('rangerDate') &&form.getFieldValue('rangerDate')[0]).startOf("month"));
  //       setToDate(moment(form.getFieldValue('rangerDate') &&form.getFieldValue('rangerDate')[1]).endOf("month"));
  //     case "y":
  //       setFromDate(moment(form.getFieldValue('rangerDate') &&form.getFieldValue('rangerDate')[0]).startOf("year"));
  //       setToDate(moment(form.getFieldValue('rangerDate') &&form.getFieldValue('rangerDate')[1]).endOf("year"));
  //   }
  // };
  // useEffect(() => {
  //   handleDate();
  // }, [typeDate,form]);

  useEffect(() => {
    handleFetchCustomer();
    handleFetchUser();
  }, []);

  return (
    <>
      <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Báo cáo tổng hợp</Breadcrumb.Item>
      </Breadcrumb>

      <Form form={form} layout="vertical" autoComplete="off">
      <Row style={{ padding: "0 5rem 0 5rem" }} gutter={[16]}>
        <Col span={24}>
            <Typography.Title level={2} className="content-center">
              Báo cáo tổng hợp
            </Typography.Title>
          </Col>
          <Col span={24}>
            <Form.Item
            
              initialValue={0}
              name="reportType"
              label="Loại báo cáo"
            >
              <Select
            
                style={{ width: "100%" }}
              >
                <Select.Option value={0}>Báo cáo tổng hợp</Select.Option>
                <Select.Option value={1}>Bảng kê hủy hóa đơn</Select.Option>
                <Select.Option value={2}>Doanh số theo ngày theo ngày</Select.Option>
                <Select.Option value={3}>Doanh số theo khách hàng</Select.Option>
                <Select.Option value={4}>Tổng kết khuyến mãi</Select.Option>
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
          <Col span={18}>
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
          <Col style={{ display: "flex", justifyContent: "center" }} span={24}>
            <Button
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
              icon={<FileExcelOutlined />}
              type="primary"
              size="large"
            >
              Xuất báo cáo
            </Button>
          </Col>
        </Row>
      </Form>
      <Loading loading={loading} />
    </>
  );
};
export default ReportPage;
