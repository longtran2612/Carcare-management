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
  Cascader,
} from "antd";
import {
  ExportOutlined,
  HomeOutlined,
  FileExcelOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { getReport, getSaleReportByCustomer } from "pages/api/reportAPI";
import { getCustomers } from "pages/api/customerAPI";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import { openNotification, openNotificationWarning } from "utils/notification";
const { RangePicker } = DatePicker;
import JsonData from "data/address-vn.json";

const dateFormat = "DD/MM/YYYY";

const SaleReportCustomer = () => {
  const [form] = Form.useForm();
  const [typeDate, setTypeDate] = useState("d");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataSaleReport, setDataSaleReport] = useState([]);

  const [addressData, setAddressData] = useState(JsonData);

  const [provinceSelected, setProvinceSelected] = useState("");
  const [districtSelected, setDistrictSelected] = useState("");
  const [wardSelected, setWardSelected] = useState("");
  const [provinceSelectedCode, setProvinceSelectedCode] = useState("");
  const [districtSelectedCode, setDistrictSelectedCode] = useState("");
  const [wardSelectedCode, setWardSelectedCode] = useState("");

  const handleFetchCustomer = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data.Data);
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
      reportType: 3,
      customerDistrict: districtSelectedCode,
      customerProvince: provinceSelectedCode,
      customerWard: wardSelectedCode,
      username: values.customer,
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
      customerDistrict: districtSelectedCode,
      customerProvince: provinceSelectedCode,
      customerWard: wardSelectedCode,
      customerId: values.customer,
      fromDate: fromDate,
      toDate: toDate,
    };
    try {
      const res = await getSaleReportByCustomer(body);
      console.log(res.data.Data);
      setDataSaleReport(res.data.Data);
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    handleFetchCustomer();
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
      title: "Mã khách hàng",
      dataIndex: "customerCode",
      key: "customerCode",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },

    {
      title: "Tỉnh/Thành",
      dataIndex: "province",
      key: "province",
    },
    {
      title: "Quận/Huyện",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Phường/Xã",
      dataIndex: "ward",
      key: "ward",
    },

    {
      title: "Nhóm khách hàng",
      dataIndex: "statusName",
      key: "statusName",
    },
    {
      title: "Mã xe",
      dataIndex: "carCode",
      key: "carCode",
    },
    {
      title: "Thương hiệu",
      dataIndex: "carBrand",
      key: "carBrand",
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Tổng tiền dịch vụ",
      dataIndex: "totalServicePrice",
      key: "totalServicePrice",
      render: (text, record) => {
        return <div>{formatMoney(record.totalServicePrice)}</div>;
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
      dataIndex: "totalPaymentAmount",
      key: "totalPaymentAmount",
      render: (text, record) => {
        return <div>{formatMoney(record.totalPaymentAmount)}</div>;
      },
    },
  ];

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    if (selectedOptions) {
      setProvinceSelected(selectedOptions[0]?.label);
      setDistrictSelected(selectedOptions[1]?.label);
      setWardSelected(selectedOptions[2]?.label);
      setProvinceSelectedCode(selectedOptions[0]?.value);
      setDistrictSelectedCode(selectedOptions[1]?.value);
      setWardSelectedCode(selectedOptions[2]?.value);
    }
  };
  const filter = (inputValue, path) =>
    path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );

  return (
    <>
      <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          Báo cáo doanh số theo khách hàng
        </Breadcrumb.Item>
      </Breadcrumb>

      <Form form={form} autoComplete="off">
        <Row style={{ padding: "0 5rem 0 5rem" }} gutter={[16]}>
          <Col span={24}>
            <Typography.Title level={2} className="content-center">
              Báo cáo doanh số theo khách hàng
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
            <Form.Item name="customer">
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Chọn khách hàng"
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
                {customers.map((item) => (
                  <Option value={item.id}>
                    {item?.name + " - " + item?.phoneNumber}
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
                  customer: undefined,
                  addressvn: undefined,
                });
                setProvinceSelected(undefined);
                setDistrictSelected(undefined);
                setWardSelected(undefined);
                setProvinceSelectedCode(undefined);
                setDistrictSelectedCode(undefined);
                setWardSelectedCode(undefined);
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
            <Form.Item name="addressvn">
              <Cascader
                changeOnSelect
                options={addressData}
                onChange={onChange}
                placeholder="Tỉnh/Thành phố - Quận/Huyện - Phường/Xã"
                showSearch={{
                  filter,
                }}
                onSearch={(value) => console.log(value)}
              />
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
export default SaleReportCustomer;
