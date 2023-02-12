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
import { getReport, getPromotionReport } from "pages/api/reportAPI";
import { getPromotionHeaders } from "pages/api/promotionHeaderAPI";
import { getCustomers } from "pages/api/customerAPI";
import { getUsers } from "pages/api/userAPI";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import { openNotification, openNotificationWarning } from "utils/notification";
const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

const ReportPromotion = () => {
  const [form] = Form.useForm();
  const [typeDate, setTypeDate] = useState("d");
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [promotion, setPromotion] = useState([]);
  const [status, setStatus] = useState(100);
  const [loading, setLoading] = useState(false);
  const [dataSaleReport, setDataSaleReport] = useState([]);
  const [dataSaleReportCustomer, setDataSaleReportCustomer] = useState([]);
  // const [fromDate, setFromDate] = useState(moment());
  // const [toDate, setToDate] = useState(moment());

  const handleFetchPromotion = async () => {
    try {
      const res = await getPromotionHeaders();
      setPromotion(res.data.Data);
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
        return (
          <RangePicker
            disabledDate={(d) => !d || d.isAfter(moment())}
            format={dateFormat}
          />
        );
      case "m":
        return (
          <RangePicker
            disabledDate={(d) => !d || d.isAfter(moment())}
            picker="month"
          />
        );
      case "y":
        return (
          <RangePicker
            disabledDate={(d) => !d || d.isAfter(moment())}
            picker="year"
          />
        );
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
      promotionType: values.promotionType,
      promotionHeaderId: values.promotionHeaderId,
      reportType: 4,
      fromDate: fromDate,
      toDate: toDate,
    };
    try {
      const response = await getReport(body);
      setLoading(false);
    } catch (error) {
      openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
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
      promotionType: values.promotionType,
      promotionHeaderId: values.promotionHeaderId,
      fromDate: fromDate,
      toDate: toDate,
    };
    try {
      const res = await getPromotionReport(body);
      setDataSaleReport(res.data.Data);
      setLoading(false);
    } catch (error) {
      openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchPromotion();
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
      title: "Mã khuyến mãi",
      dataIndex: "promotionDetailCode",
      key: "promotionDetailCode",
    },
    {
      title: "Tên khuyến mãi",
      dataIndex: "promotionDetailName",
      key: "promotionDetailName",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "fromDate",
      key: "fromDate",
      render: (text, record) => {
        return <div>{moment(record.fromDate).format(dateFormat)}</div>;
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "toDate",
      key: "toDate",
      render: (text, record) => {
        return <div>{moment(record.toDate).format(dateFormat)}</div>;
      },
    },
    {
      title: "Loại khuyến mãi",
      dataIndex: "promotionType",
      key: "promotionType",
    },
    {
      title: "Mã dịch vụ",
      dataIndex: "serviceCode",
      key: "serviceCode",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Số tiền khuyến mãi",
      dataIndex: "promotionAmount",
      key: "promotionAmount",
      render: (text, record) => {
        return (
          <div>
            {record.promotionType === "Giảm theo %"
              ? record.promotionAmount + "%"
              : formatMoney(record.promotionAmount)}
          </div>
        );
      },
    },
    {
      title: "Giới hạn ngân sách",
      dataIndex: "limitUsedTime",
      key: "limitUsedTime",
    },
    {
      title: "Ngân sách tổng",
      dataIndex: "limitPromotionAmount",
      key: "limitPromotionAmount",
      render: (text, record) => {
        return <div>{formatMoney(record.limitPromotionAmount || 0)}</div>;
      },
    },
    {
      title: "Ngân sách còn lại",
      dataIndex: "limitPromotionAmountLeft",
      key: "limitPromotionAmountLeft",
      render: (text, record) => {
        return <div>{formatMoney(record.limitPromotionAmountLeft || 0)}</div>;
      },
    },

    {
      title: "Ngân sách đã sử dụng",
      dataIndex: "promotionUsedAmount",
      key: "promotionUsedAmount",
      render: (text, record) => {
        return <div>{formatMoney(record.promotionUsedAmount)}</div>;
      },
    },
  ];

  return (
    <>
      <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Báo cáo khuyến mãi</Breadcrumb.Item>
      </Breadcrumb>

      <Form form={form} autoComplete="off">
        <Row style={{ padding: "0 5rem 0 5rem" }} gutter={[16]}>
          <Col span={24}>
            <Typography.Title level={2} className="content-center">
              Báo cáo khuyến mãi
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
              initialValue={[moment(moment().subtract(7, "days")), moment()]}
            >
              {handleDatePicker()}
            </Form.Item>
          </Col>

          <Col span={7}>
            <Form.Item name="promotionType">
              <Select placeholder="Loại khuyến mãi">
                <Select.Option value="MONEY">Giảm tiền</Select.Option>
                <Select.Option value="PERCENTAGE">
                  Giảm tiền theo %
                </Select.Option>
                <Select.Option value="SERVICE">Giảm tiền dịch vụ</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={1}>
            <Button
              icon={<ClearOutlined />}
              style={{ width: "100%" }}
              onClick={() => {
                form.setFieldsValue({
                  promotionHeaderId: undefined,
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
            <Form.Item name="promotionHeaderId">
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Chương trình khuyến mãi"
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
                {promotion.map((item) => (
                  <Option value={item.id}>
                    {item?.promotionHeaderCode + " - " + item?.description}
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
export default ReportPromotion;
