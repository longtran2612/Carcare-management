import {
  Table,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Input,
  Typography,
  Timeline,
  Divider,
  Popconfirm,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { getOrders, cancelOrder } from "pages/api/orderAPI";
import moment from "moment";
const formatDate = "HH:mm DD/MM/YYYY ";
import { openNotification,openNotificationWarning } from "utils/notification";
import { PlusOutlined } from "@ant-design/icons";

import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import {
  ClearOutlined,
  SearchOutlined,
  DeleteTwoTone,
  PlayCircleTwoTone,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import ModalAddOrder from "components/Modal/ModalAddOrder";
import { OrderDetail } from "components/Order/OrderDetail";
import ModalSelectSlot from "components/Modal/ModalSelectSlot";
const { Title } = Typography;

function OrderTable({}) {
  const [orders, setOrders] = useState([]);
  const [modalOrder, setModalOrder] = useState(false);
  const [modalSelectSlot, setModalSelectSlot] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const { orderRequestId } = router.query;
  const [loading, setLoading] = useState(false);
  const [orderSelected, setOrderSelected] = useState(null);

  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

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
          placeholder={`Tìm ${dataIndex}`}
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

  const handleSuccessCreateOrder = async () => {
    handleGetorders();
  };

  const handleCancelOrder = async (id) => {
    setLoading(true);
    try {
      const res = await cancelOrder(id);
      openNotification("Thành công", "Hủy đơn hàng thành công");
      handleGetorders();
    } catch (err) {
      openNotificationWarning("Hủy đơn hàng thất bại");
      setLoading(false);
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
      dataIndex: "orderCode",
      key: "orderCode",
      width: 130,
      render: (text, record) => (
        <a
          onClick={() => {
            router.push(`/admin?orderRequestId=${record.id}`);
          }}
          style={{ color: "blue", textDecorationLine: "underline" }}
        >
          {record?.orderCode}
        </a>
      ),
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.orderCode)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.customerName)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.carLicensePlate)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.totalEstimateTime)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "Biên số xe",
      dataIndex: "carLicensePlate",
      key: "carLicensePlate",
      ...getColumnSearchProps("carLicensePlate"),
    },
    {
      title: "Thời gian xử lý",
      dataIndex: "totalEstimateTime",
      key: "totalEstimateTime",
      sorter: {
        compare: (a, b) => a.totalEstimateTime - b.totalEstimateTime,
        multiple: 2,
      },
      render: (totalEstimateTime) => {
        return (
          <div>
            {totalEstimateTime ? `${totalEstimateTime} phút` : "Chưa có"}
          </div>
        );
      },
    },
    {
      title: "Tổng tiền dịch vụ",
      dataIndex: "totalServicePrice",
      key: "totalServicePrice",
      sorter: {
        compare: (a, b) => a.totalServicePrice - b.totalServicePrice,
        multiple: 2,
      },
      render: (totalServicePrice) => {
        return formatMoney(totalServicePrice);
      },
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createDate",
      key: "createDate",
      render: (text, record, dataIndex) => {
        return <div>{moment(record.createDate).format(formatDate)}</div>;
      },
    },
    {
      title: "Trạng thái",
      key: "statusName",
      dataIndex: "statusName",
      ...getColumnSearchProps("statusName"),
      render: (text, record, dataIndex) => {
        return (
          <div>
            <Tag color="orange">{record.statusName}</Tag>
          </div>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (text, record, dataIndex) => {
        return (
          <>
            <Popconfirm
              title="Hủy yêu cầu này?"
              placement="topLeft"
              okText="Đồng ý"
              cancelText="Hủy"
              onConfirm={() => {
         
                handleCancelOrder(record.id);
              }}
            >
              <DeleteTwoTone
                twoToneColor="#F4406D"
                style={{
                  fontSize: "30px",
                  marginRight: "10px",
                }}
              />
            </Popconfirm>

            <Popconfirm
              title="Xử lý yêu cầu này?"
              placement="topLeft"
              okText="Đồng ý"
              cancelText="Hủy"
              onConfirm={() => {
                setOrderSelected(record.id);
                setModalSelectSlot(true);
              }}
            >
              <PlayCircleTwoTone
                style={{
                  color: "#FFFFFF",
                  fontSize: "30px",
                  marginRight: "10px",
                }}
              />
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const handleGetorders = async () => {
    setLoading(true);
    let dataGetOrder = {
      keyword: "",
      status: 0,
      pageSize: 100,
      pageNumber: 0,
      sort: [
        {
          key: "createDate",
          asc: true,
        },
      ],
    };
    try {
      const res = await getOrders(dataGetOrder);
      setOrders(res.data.Data.content);
      setLoading(false);
    } catch (error) {
      openNotificationWarning("Lấy danh sách đơn hàng thất bại");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetorders();
  }, [orderRequestId]);

  const columnService = [
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
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thời gian xử lí",
      dataIndex: "estimateTime",
      key: "estimateTime",
      render: (text, record, dataIndex) => {
        return <div>{record.estimateTime} phút</div>;
      },
    },
    {
      title: "Giá",
      dataIndex: "servicePrice",
      key: "servicePrice",
      render: (servicePrice) => {
        return (
          <>
            {servicePrice === null ? (
              <Tag color={"red"}>{"Chưa có giá"}</Tag>
            ) : (
              <div>{formatMoney(servicePrice.price)}</div>
            )}
          </>
        );
      },
    },
  ];

  const handkeSuccessSelectSlot = async () => {
    handleGetorders();
  };

  return (
    <>
      {orderRequestId ? (
        <OrderDetail
          orderRequestId={orderRequestId}
          onUpdateOrders={handleGetorders}
        />
      ) : (
        <div>
          <Table
            rowKey="id"
            bordered
            title={() => (
              <>
                <Row>
                  <Col span={8} style={{ marginRight: "10px" }}>
                    <Input.Search
                      placeholder="Tìm kiếm mã / khách hàng / xe"
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
                  <Col span={11}>
                    <Button
                      style={{ float: "right" }}
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setModalOrder(true)}
                    >
                      {" "}
                      Thêm mới yêu cầu
                    </Button>
                  </Col>
                </Row>
              </>
            )}
            columns={columns}
            dataSource={orders}
            pagination={{
              pageSize: 20,
            }}
            scroll={{
              y: 425,
            }}
            expandable={{
              expandedRowRender: (record) => (
                <Row
                  style={{ padding: "10px", backgroundColor: "#ECE3E3" }}
                  gutter={16}
                >
                  <Col span={12}>
                    <Table
                      bordered
                      title={() => "Dịch vụ"}
                      dataSource={record.services}
                      columns={columnService}
                      pagination={false}
                      scroll={{
                        y: 200,
                      }}
                    ></Table>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        backgroundColor: "#fff",
                        padding: "10px",
                      }}
                    >
                      <Row gutter={32}>
                        <Col
                          style={{ borderRight: "solid LightGray 1px" }}
                          span={11}
                        >
                          <Divider> Khách hàng </Divider>
                          <Timeline style={{ marginTop: "20px" }}>
                            <Timeline.Item>
                              Tên: {record?.customerName}
                            </Timeline.Item>
                            <Timeline.Item>
                              Số điện thoại: {record?.customerPhoneNumber}
                            </Timeline.Item>
                          </Timeline>
                        </Col>
                        <Col span={12}>
                          <Divider> Xe </Divider>
                          <Timeline style={{ marginTop: "20px" }}>
                            <Timeline.Item>Xe: {record?.carName}</Timeline.Item>
                            <Timeline.Item>
                              Biển số: {record?.carLicensePlate}
                            </Timeline.Item>
                          </Timeline>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              ),
              rowExpandable: (record) => record.name !== "Not Expandable",
            }}
            // onRow={(record, rowIndex) => {
            //   return {
            //     onDoubleClick: (event) => {
            //       router.push(`/admin?orderRequestId=${record.id}`);
            //     },
            //   };
            // }}
          />
        </div>
      )}
      <ModalAddOrder
        show={modalOrder}
        handleCancel={() => setModalOrder(false)}
        onSuccess={(data) => handleSuccessCreateOrder(data)}
      />
      <ModalSelectSlot
        show={modalSelectSlot}
        onSelectOrder={orderSelected}
        handleCancel={() => setModalSelectSlot(false)}
        onSuccess={() => handkeSuccessSelectSlot()}
      />

      <Loading loading={loading} />
    </>
  );
}

export default OrderTable;
