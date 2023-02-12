import React, { useEffect, useState, useRef } from "react";
import {
  Col,
  Row,
  Space,
  Button,
  Tag,
  Form,
  Select,
  Input,
  DatePicker,
  Table,
  Popconfirm,
  Drawer,
} from "antd";
import { useRouter } from "next/router";
import { openNotification, openNotificationWarning } from "utils/notification";
import { getPricesByHeader } from "pages/api/priceAPI";
import {
  deletePriceHeader,
  getPriceHeaderById,
  updatePriceHeader,
  activePriceHeader,
  inActivePriceHeader,
} from "pages/api/PriceHeaderAPI";
import { validateMessages } from "utils/messageForm";
import ModalQuestion from "components/Modal/ModalQuestion";
import ModalAddPrice from "components/Modal/ModalAddPrice";
import moment from "moment";
import Loading from "components/Loading";
import {
  ClearOutlined,
  SearchOutlined,
  PlusOutlined,
  SaveOutlined,
  EditFilled,
  EditOutlined,
  DeleteOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { formatMoney } from "utils/format";
import DrawerPriceDetail from "components/Drawer/DrawerPriceDetail";
const formatDate = "DD/MM/YYYY";
const PriceHeaderDetail = ({ priceHeaderId }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [priceHeaderDetail, setPriceHeaderDetail] = useState({});
  const [prices, setPrices] = useState([]);
  const [modalQuestion, setModalQuestion] = useState(false);
  const [modalPrice, setModalPrice] = useState(false);

  const [modalPriceDetail, setModalPriceDetail] = useState(false);
  const [priceSelected, setPriceSelected] = useState({});

  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
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

  const fetchPrice = async () => {
    setLoading(true);
    try {
      const response = await getPricesByHeader(priceHeaderId);
      console.log(response.data.Data);
      setPrices(response.data.Data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const fetchPriceHeaderDetail = async () => {
    setLoading(true);
    try {
      const response = await getPriceHeaderById(priceHeaderId);
      setPriceHeaderDetail(response.data.Data);
      form.setFieldsValue({
        name: response.data.Data.name,
        description: response.data.Data.description,
        fromDate: moment(moment(response.data.Data.fromDate), formatDate),
        toDate: moment(moment(response.data.Data.toDate), formatDate),
        status: response.data.Data.status,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (priceHeaderId) {
      fetchPriceHeaderDetail();
      fetchPrice();
    }
  }, [priceHeaderId]);

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
      title: "Mã dịch vụ",
      dataIndex: "serviceCode",
      key: "serviceCode",
      render: (text, record) => (
        <a    onClick={() => {
          setPriceSelected(record);
          setModalPriceDetail(true);
        }}
        style={{ color: "blue", textDecorationLine: "underline" }}>
          {record?.serviceCode}
        </a>
      ),
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.serviceCode)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.statusName)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.price).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Giá dịch vụ",
      dataIndex: "price",
      key: "price",
      ...getColumnSearchProps("price"),
      render: (price) => {
        return <div>{formatMoney(price)}</div>;
      },
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => {
    //     return (
    //       <>
    //         {status === 100 ? (
    //           <Tag color={"green"}>Đang hoạt động</Tag>
    //         ) : (
    //           <Tag color={"red"}>Không hoạt động</Tag>
    //         )}
    //       </>
    //     );
    //   },
    // },
    // {
    //   dataIndex: "action",
    //   key: "action",
    //   width: 90,
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <EditOutlined
    //           onClick={() => {
    //             setPriceSelected(record);
    //             setModalPriceDetail(true);
    //           }}
    //           style={{ fontSize: "20px", color: "blue" }}
    //         />
    //       </>
    //     );
    //   },
    // },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    let body = {
      name: values.name,
      toDate: values.toDate,
    };
    if (moment().isBefore(values.fromDate)) {
      body.fromDate = values.fromDate;
    }
    try {
      const res = await updatePriceHeader(body, priceHeaderDetail.id);
      openNotification("Thành công", "Cập nhật bảng giá thành công!");
      fetchPrice();
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Cập nhật bảng giá thất bại");
      }
      setLoading(false);
    }
  };

  const handleSuccessCreatePrice = () => {
    fetchPrice();
  };

  const handleUpdatePrice = () => {
    fetchPrice();
  };
  const handleActivePrice = async () => {
    setLoading(true);
    if (prices.length === 0) {
      openNotificationWarning("không có giá dịch vụ nào trong bảng giá");
      return;
    }
    try {
      const res = await activePriceHeader(priceHeaderId);
      openNotification("Thành công", "Kích hoạt bảng giá thành công!");
      fetchPriceHeaderDetail();
      fetchPrice();
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Thất bại! Có lỗi xảy ra");
      }
      setLoading(false);
    }
  };

  const handleInActivePrice = async () => {
    setLoading(true);
    try {
      const res = await inActivePriceHeader(priceHeaderId);
      openNotification("Thành công", "Vô hiệu bảng giá thành công!");
      fetchPriceHeaderDetail();
      fetchPrice();
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Thất bại! Có lỗi xảy ra");
      }
      setLoading(false);
    }
  };

  const handleDeletePrice = async () => {
    setLoading(true);
    try {
      const res = await deletePriceHeader(priceHeaderId);
      openNotification("Thành công", "Xóa bảng giá thành công!");
      router.push("/admin");
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Thất bại! Có lỗi xảy ra");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Row gutter={[16]}>
              <Col span={12}>
                <Form.Item
                  label="Tên bảng giá"
                  name="name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="fromDate"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker
                    disabled={moment().isAfter(priceHeaderDetail?.fromDate)}
                    disabledDate={(d) =>
                      d.isBefore(moment()) ||
                      !d ||
                      (form.getFieldValue("toDate") &&
                        d.isAfter(form.getFieldValue("toDate")))
                    }
                    format={formatDate}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="Ngày kết thúc"
                  name="toDate"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker
                    disabled={moment().isAfter(priceHeaderDetail?.toDate)}
                    disabledDate={(d) =>
                      !d ||
                      d.isSameOrBefore(form.getFieldValue("fromDate")) ||
                      d.isSameOrBefore(moment())
                    }
                    format={formatDate}
                  />
                </Form.Item>
              </Col>
              {/* <Col span={4}>
                <Form.Item
                  label="Trạng thái"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name="status"
                >
                  <Select>
                    <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                    <Select.Option value="INACTIVE">
                      Không hoạt động
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col> */}
              <Col span={4}>
                <Form.Item
                  label="Trạng thái"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name="status"
                >
                  {priceHeaderDetail?.status === "ACTIVE" ? (
                    <Popconfirm
                      title="Bạn có chắc chắn vô hiệu bảng giá này?"
                      placement="topLeft"
                      okText="Đông ý"
                      cancelText="Hủy"
                      onConfirm={() => {
                        handleInActivePrice();
                      }}
                    >
                      <Button
                        style={{
                          backgroundColor: "#22C55E",
                          width: "100%",
                          color: "white",
                        }}
                      >
                        Hoạt dộng
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      title="Bạn có chắc chắn kích hoạt bảng giá này?"
                      placement="topLeft"
                      okText="Đông ý"
                      cancelText="Hủy"
                      onConfirm={() => {
                        handleActivePrice();
                      }}
                    >
                      <Button style={{ width: "100%" }} type="danger">
                        Không hoạt dộng
                      </Button>
                    </Popconfirm>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className="PullRight">
              <div
                style={{ bottom: "0", right: "20px", margin: "10px" }}
                className="service-action"
              >
                <div>
                  {moment().isBefore(priceHeaderDetail?.fromDate) && (
                    <Popconfirm
                      title="Bạn có chắc chắn xóa bảng giá này?"
                      placement="topLeft"
                      okText="Xóa"
                      cancelText="Hủy"
                      onConfirm={() => {
                        handleDeletePrice(priceHeaderDetail.id);
                      }}
                    >
                      <Button
                        style={{ marginRight: "20px" }}
                        icon={<DeleteOutlined />}
                        type="danger"
                      >
                        Xóa bảng giá
                      </Button>
                    </Popconfirm>
                  )}

                  <Popconfirm
                    title="Cập nhật?"
                    placement="topLeft"
                    okText="Xác nhận"
                    cancelText="Hủy"
                    onConfirm={() => {
                      form
                        .validateFields()
                        .then((values) => {
                          onFinish(values);
                        })
                        .catch((info) => {
                          console.log("Validate Failed:", info);
                        });
                    }}
                  >
                    <Button icon={<SaveOutlined />} type="primary">
                      Cập nhật
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </Row>
          </Form>
        </Col>
        <Col span={24}>
          <Table
            size="small"
            bordered
            title={() => (
              <>
                <Row>
                  <Col span={8} style={{ marginRight: "10px" }}>
                    <Input.Search
                      placeholder="Tìm kiếm mã/tên dịch vụ"
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
                      onClick={() => setModalPrice(true)}
                    >
                      {" "}
                      Thêm giá
                    </Button>
                  </Col>
                </Row>
              </>
            )}
            columns={columns}
            dataSource={prices}
            scroll={{
              y: 320,
            }}
            pagination={false}
            rowKey="id"
          />
        </Col>
      </Row>
      <DrawerPriceDetail
        show={modalPriceDetail}
        handleCancel={() => setModalPriceDetail(false)}
        onUpdate={handleUpdatePrice}
        price={priceSelected}
        canUpdatePrice={moment().isAfter(form.getFieldValue("fromDate"))}
      />

      <ModalAddPrice
        show={modalPrice}
        handleCancel={() => setModalPrice(false)}
        onSuccess={(data) => handleSuccessCreatePrice(data)}
        priceHeaderId={priceHeaderId}
      />
      <Loading show={loading} />
    </>
  );
};

export default PriceHeaderDetail;
