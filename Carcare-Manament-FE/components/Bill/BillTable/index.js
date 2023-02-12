import {
  Table,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Input,
  Typography,
  Divider,
  Drawer,
  Select,
  Popconfirm,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { getBills, cancelBill, searchBill } from "pages/api/billAPI";
import moment from "moment";
const formatDate = "HH:mm:ss DD/MM/YYYY ";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import {
  ClearOutlined,
  SearchOutlined,
  DeleteTwoTone,
  PrinterTwoTone,
  DeleteOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { openNotification, openNotificationWarning } from "utils/notification";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import logo from "public/images/logo-footer-customer.png";
const { Title } = Typography;
const { Option } = Select;

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const BillTable = () => {
  const [bills, setBills] = useState([]);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [billDetail, setBillDetail] = useState({});
  const [printBill, setPrintBill] = useState(false);
  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [status, setStatus] = useState(null);

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleSearch = (selectedKeys, dataIndex) => {
    setSearchText(selectedKeys[0]);
    setSearchGlobal(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = () => {
    setSearchText("");
    setSearchGlobal("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm`}
          value={selectedKeys[0]}
          onSearch={(value) => setSearchText(value)}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => {
              handleReset();
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Xóa bộ lọc
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handlePrintBill = (data) => {
    setBillDetail(data);
    setPrintBill(true);
    setShowDetail(false);
  };

  const handleCancelBill = async (id) => {
    setLoading(true);
    try {
      const res = await cancelBill(id);
      openNotification("Thành công", "Hủy hóa đơn thành công");

      handleGetbills();
      setShowDetail(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      openNotificationWarning("Thất bại", "Không thể hủy hóa đơn này");
      setLoading(false);
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
      title: "Mã",
      dataIndex: "billCode",
      key: "billCode",
      width: 120,
      render: (text, record) => (
        <a
          onClick={() => {
            setBillDetail(record);
            setShowDetail(true);
          }}
          style={{ color: "blue", textDecorationLine: "underline" }}
        >
          {record?.billCode}
        </a>
      ),
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.billCode).toLowerCase().includes(value.toLowerCase()) ||
          String(record.customerName)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.carLicensePlate)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.totalEstimateTime)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.createDate)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.createDate).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps("statusName"),
    },
    {
      title: "Biển số xe",
      dataIndex: "carLicensePlate",
      key: "carLicensePlate",
      ...getColumnSearchProps("carLicensePlate"),
    },
    {
      title: "Tổng tiền thanh toán",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      sorter: {
        compare: (a, b) => a.paymentAmount - b.paymentAmount,
        multiple: 2,
      },
      render: (text, record) => <div>{formatMoney(record.paymentAmount)}</div>,
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render(paymentDate) {
        return <div>{moment(paymentDate).format(formatDate)}</div>;
      },
    },
    {
      title: "Loại thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",

      render: (text, record, dataIndex) => {
        switch (record.paymentType) {
          case "CASH":
            return <Tag color="green">Tiền mặt</Tag>;
          case "DEBIT":
            return <Tag color="cyan">Thẻ - Chuyển khoản</Tag>;
        }
      },
    },
    {
      title: "Trạng thái",
      key: "statusName",
      dataIndex: "statusName",
      render: (text, record, dataIndex) => {
        switch (record.statusName) {
          case "Đã thanh toán":
            return <Tag color="green">{record.statusName}</Tag>;
          case "Đã hủy":
            return <Tag color="red">{record.statusName}</Tag>;
        }
      },
    },
    // {
    //   title: "Hành động",
    //   dataIndex: "action",
    //   width: 130,
    //   render: (text, record, dataIndex) => {
    //     if (record.statusName === "Đã thanh toán") {
    //       return (
    //         <>
    //           <Popconfirm
    //             title="Hủy hóa đơn này?"
    //             placement="topLeft"
    //             okText="Đồng ý"
    //             cancelText="Hủy"
    //             onConfirm={() => {
    //               handleCancelBill(record.id);
    //             }}
    //           >
    //             <DeleteTwoTone
    //               twoToneColor="#F4406D"
    //               style={{ fontSize: "30px", marginRight: "10px" }}
    //             />
    //           </Popconfirm>
    //           <Popconfirm
    //             title="In hóa đơn?"
    //             placement="topLeft"
    //             okText="Đồng ý"
    //             cancelText="Hủy"
    //             onConfirm={() => {
    //               setPrintBill(true);
    //               handlePrintBill(record);
    //             }}
    //           >
    //             <PrinterTwoTone
    //               style={{ color: "#FFFFFF", fontSize: "30px" }}
    //             />
    //           </Popconfirm>
    //         </>
    //       );
    //     }
    //   },
    // },
  ];

  const handleGetbills = async () => {
    setLoading(true);
    let dataGetBill = {
      pageSize: 100,
      status: status,
      pageNumber: 0,
      sort: [
        {
          key: "createDate",
          asc: false,
        },
      ],
    };
    console.log(dataGetBill);
    try {
      const res = await searchBill(dataGetBill);
      setBills(res.data.Data.content);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (printBill) {
      handlePrint();
      setPrintBill(false);
    }
  }, [printBill]);

  useEffect(() => {
    handleGetbills();
  }, [status]);

  const handlepromotionDetails = (data) => {
    if (data > 0) return true;
  };

  return (
    <>
      <Table
        rowKey="id"
        bordered
        title={() => (
          <>
            <Row>
              <Col span={8} style={{ marginRight: "10px" }}>
                <Input.Search
                  placeholder="Tìm kiếm khách hàng/xe"
                  onChange={(e) => setSearchGlobal(e.target.value)}
                  onSearch={(value) => setSearchGlobal(value)}
                  value={searchGlobal}
                />
              </Col>
              <Col span={4}>
                <Button
                  onClick={() => setSearchGlobal("")}
                  icon={<ClearOutlined />}
                >
                  Xóa bộ lọc
                </Button>
              </Col>
              <Col span={4}>
                <Select
                  placeholder="Trạng thái"
                  style={{ width: "100%" }}
                  onChange={(value) => setStatus(value)}
                  value={status}
                >
                  <Option value={null}>Tất cả</Option>
                  <Option value={1}>Đã thanh toán</Option>
                  <Option value={2}>Đã hủy</Option>
                </Select>
              </Col>
            </Row>
          </>
        )}
        columns={columns}
        dataSource={bills}
        pagination={{
          pageSize: 20,
        }}
        scroll={{
          y: 425,
        }}
        // onRow={(record, rowIndex) => {
        //   return {
        //     onClick: (event) => {
        //       setBillDetail(record);
        //       setShowDetail(true);
        //     },
        //   };
        // }}
      />
      <Drawer
        title="Chi tiết hóa đơn"
        placement="right"
        onClose={() => setShowDetail(false)}
        visible={showDetail}
        width={1000}
        extra={
          <Space>
            {billDetail.status === 1 ? (
              <>
                <Button
                  icon={<DeleteOutlined />}
                  type="danger"
                  onClick={() => handleCancelBill(billDetail.id)}
                >
                  Hủy
                </Button>
                <Button
                  icon={<PrinterOutlined />}
                  onClick={() => handlePrintBill(billDetail)}
                  type="primary"
                >
                  In hóa đơn
                </Button>
                 <Button style={{ backgroundColor: "#22C55E", color: "white" }}>
                 Đã thanh toán
                </Button>
              </>
            ) : (
              <Button type="danger">Đã hủy</Button>
            )}
          </Space>
        }
      >
        <Divider>
          <Title level={5}>
            Hóa đơn:
            <span style={{ color: "blue" }}> #{billDetail.billCode} </span>
          </Title>
        </Divider>

        <p
          style={{ color: "red", marginBottom: "5px" }}
          className="site-description-item-profile-p"
        >
          Khách hàng
        </p>
        <Row>
          <Col span={8}>
            <DescriptionItem
              title="Mã khách hàng"
              content={billDetail.customerCode}
            />
          </Col>
          <Col span={8}>
            <DescriptionItem
              title="Tên khách hàng"
              content={billDetail.customerName}
            />
          </Col>
          <Col span={8}>
            <DescriptionItem
              title="Số điện thoại"
              content={billDetail.customerPhoneNumber}
            />
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <DescriptionItem title="Mã xe" content={billDetail.carCode} />
          </Col>
          <Col span={8}>
            <DescriptionItem title="Tên xe" content={billDetail.carName} />
          </Col>
          <Col span={8}>
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
              <Col span={8}>
                <DescriptionItem
                  title="Mã dịch vụ"
                  content={item?.serviceCode}
                />
              </Col>
              <Col span={8}>
                <DescriptionItem title={item?.name} />
              </Col>
              <Col span={8}>
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
                  <Col span={8}>
                    <DescriptionItem title={item?.promotionDetailCode} />
                  </Col>
                  <Col span={8}>
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
                  <Col span={8}>
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
          <Col span={8}>
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
            <Col span={8}>
              <DescriptionItem
                title="Thông tin thanh toán"
                content={billDetail?.cardNumber}
              />
            </Col>
          )}
          <Col span={8}>
            <DescriptionItem
              title="Ngày thanh toán"
              content={moment(billDetail.paymentDate).format(formatDate)}
            />
          </Col>
          {billDetail.paymentType === "CASH" && <Col span={8}></Col>}

          <Col span={8}>
            <DescriptionItem
              title="Tổng Tiền dịch vụ"
              content={formatMoney(billDetail?.totalServicePrice || 0)}
            />
          </Col>
          <Col span={8}>
            <DescriptionItem
              title="Tổng tiền khuyến mãi"
              content={formatMoney(billDetail?.totalPromotionAmount || 0)}
            />
          </Col>
          <Col span={8}>
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
      {printBill && (
        <div ref={componentRef}>
          <br />
          <div className="invoice-box">
            <table>
              <tr className="top">
                <td colspan="2">
                  <table>
                    <tr>
                      <td className="title">
                        <Image
                          src={logo}
                          width={150}
                          height={100}
                          alt="Company logo"
                        />
                      </td>
                      <td>
                        Bill #: {billDetail?.billCode}
                        <br />
                        Ngày tạo:{" "}
                        {moment(billDetail?.createDate).format(
                          "HH:mm DD/MM/YYYY"
                        )}
                        <br />
                        Ngày thanh toán: {moment().format("HH:mm DD/MM/YYYY")}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr className="information">
                <td colspan="2">
                  <table>
                    <tr>
                      <td>
                        VLCareCare
                        <br />
                        0772555445
                        <br />
                        12 Nguyễn Văn bảo
                        <br />
                        Phường 5,Gò Vấp, Hồ Chí Minh
                      </td>

                      <td>
                        Khách hàng : {billDetail?.customerName}
                        <br />
                        Số điện thoại : {billDetail?.customerPhoneNumber}
                        <br />
                        Xe : {billDetail?.carName} -{" "}
                        {billDetail?.carLicensePlate}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr className="heading">
                <td>Thanh Toán</td>

                <td>
                  {billDetail?.paymentType == "CASH" ? "Tiền mặt" : "Thẻ - CK"}
                </td>
              </tr>
              <tr className="heading">
                <td>Dịch vụ</td>

                <td>Thành tiền</td>
              </tr>

              {billDetail?.services?.map((item) => (
                <>
                  <tr className="item">
                    <td>{item?.name}</td>

                    <td>{formatMoney(item?.servicePrice?.price)}</td>
                  </tr>
                </>
              ))}
              {handlepromotionDetails(billDetail?.totalPromotionAmount) && (
                <>
                  <tr className="item">
                    <td>Khuyến mãi</td>
                    <td>
                      <a style={{ color: "red" }}>
                        -{formatMoney(billDetail?.totalPromotionAmount || 0)}
                      </a>
                    </td>
                  </tr>
                </>
              )}

              <tr className="total">
                <td></td>

                <td>Tổng: {formatMoney(billDetail?.paymentAmount || 0)}</td>
              </tr>
            </table>
            <Divider style={{ paddingTop: "50px" }}>
              {" "}
              Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi
            </Divider>
          </div>
        </div>
      )}
      <Loading loading={loading} />
    </>
  );
};

export default BillTable;
