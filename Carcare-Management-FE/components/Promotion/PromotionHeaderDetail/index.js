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
} from "antd";
import { useRouter } from "next/router";
import { openNotification, openNotificationWarning } from "utils/notification";

import {
  getPromotionLineByHeaderId,
  activePromotionLine,
  inActivePromotionLine,
  updatePromotionLine,
} from "pages/api/promotionLineAPI";
import {
  getPromotionHeaderById,
  updatePromotionHeader,
  inActivePromotionHeader,
  activePromotionHeader,
  deletePromotionHeader,
} from "pages/api/promotionHeaderAPI";

import { validateMessages } from "utils/messageForm";
import ModalQuestion from "components/Modal/ModalQuestion";
import ModalAddPromotionLine from "components/Modal/ModalAddPromotionLine";
import moment from "moment";
import Loading from "components/Loading";
import {
  ClearOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { EditOutlined } from "@ant-design/icons";
import { formatMoney } from "utils/format";
const formatDate = "DD/MM/YYYY";
import DrawerPromorionDetail from "components/Drawer/DrawerPromotionDetail";

const PromotionHeaderDetail = ({ promotionHeaderId }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [promotionHeaderDetail, setPromotionHeaderDetail] = useState({});
  const [promotionLine, setPromotionLine] = useState([]);
  const [modalQuestion, setModalQuestion] = useState(false);
  const [modalPrice, setModalPrice] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showDrawer, setShowDrawer] = useState(false);
  const [promotionLineSelected, setPromotionLineSelected] = useState(null);

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

  const fetchPromotionLine = async () => {
    setLoading(true);
    try {
      const response = await getPromotionLineByHeaderId(promotionHeaderId);
      console.log(response.data.Data);
      setPromotionLine(response.data.Data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const fetchPromotionHeaderDetail = async () => {
    setLoading(true);
    try {
      const response = await getPromotionHeaderById(promotionHeaderId);
      setPromotionHeaderDetail(response.data.Data);
      console.log(response.data.Data);
      form.setFieldsValue({
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
    if (promotionHeaderId) {
      fetchPromotionHeaderDetail();
      fetchPromotionLine();
    }
  }, [promotionHeaderId]);

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
      dataIndex: "promotionLineCode",
      key: "promotionLineCode",
      filteredValue: [searchGlobal],
      render: (promotionLineCode) => (
        <a style={{ color: "blue" }}>{promotionLineCode}</a>
      ),
      onFilter: (value, record) => {
        return (
          String(record.promotionLineCode)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.description)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Tên",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Từ ngày",
      dataIndex: "fromDate",
      key: "fromDate",
      render: (text, record) => {
        return <div>{moment(record.fromDate).format(formatDate)}</div>;
      },
    },
    {
      title: "Đến ngày",
      dataIndex: "toDate",
      key: "toDate",
      render: (text, record) => {
        return <div>{moment(record.toDate).format(formatDate)}</div>;
      },
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (text, record) => {
        return handleType(record.type);
      },
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (text, record) => {
    //     return (
    //       <div>
    //         {record.status == "ACTIVE" ? (
    //           <Popconfirm
    //             title="Bạn có chắc chắn ngưng hoạt động dòng khuyến mã này?"
    //             placement="topLeft"
    //             okText="Đông ý"
    //             cancelText="Hủy"
    //             onConfirm={() => {
    //               handleInActivePromotionLine(record.id);
    //             }}
    //           >
    //             <Button style={{ backgroundColor: "#22C55E", color: "white" }}>
    //               Hoạt dộng
    //             </Button>
    //           </Popconfirm>
    //         ) : (
    //           <Popconfirm
    //             title="Bạn có chắc chắn kích hoạt dòng khuyến mãi này?"
    //             placement="topLeft"
    //             okText="Đông ý"
    //             cancelText="Hủy"
    //             onConfirm={() => {
    //               handleActivePromotionLine(record.id);
    //             }}
    //           >
    //             <Button type="danger">Không hoạt dộng</Button>
    //           </Popconfirm>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (text, record) => {
        return (
          <div>
            <EditOutlined
              onClick={() => {
                setPromotionLineSelected(record);
                setShowDrawer(true);
              }}
              style={{ color: "#6B92F2", fontSize: "25px" }}
            />
          </div>
        );
      },
    },
  ];

  const handleType = (value) => {
    switch (value) {
      case "MONEY":
        return <Tag color="blue">Giảm tiền</Tag>;
      case "PERCENTAGE":
        return <Tag color="green">Giảm theo %</Tag>;
      case "SERVICE":
        return <Tag color="gold">Dịch vụ</Tag>;
      default:
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    let body = {
      description: values.description,
      toDate: values.toDate,
    };
    if (moment().isBefore(values.fromDate)) {
      body.fromDate = values.fromDate;
    }

    try {
      const res = await updatePromotionHeader(promotionHeaderDetail.id, body);
      openNotification(
        "Thành công",
        "Cập nhật chương trình khuyến mãi thành công!"
      );
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

  const handleSuccessCreatePromotionLine = () => {
    fetchPromotionLine();
  };
  const handleUpdatePromotionLine = () => {
    fetchPromotionLine();
    setShowDrawer(false);
  };

  const handleActivePromotion = async () => {
    setLoading(true);

    try {
      const res = await activePromotionHeader(promotionHeaderId);
      openNotification(
        "Thành công",
        "Kích hoạt chương trình khuyến mãi thành công!"
      );
      fetchPromotionHeaderDetail();
      fetchPromotionLine();
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

  const handleInActivePromotion = async () => {
    setLoading(true);
    try {
      const res = await inActivePromotionHeader(promotionHeaderId);
      openNotification(
        "Thành công",
        "Ngưng hoạt động chương trình khuyến mãi thành công!"
      );
      fetchPromotionHeaderDetail();
      fetchPromotionLine();
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
  const handleActivePromotionLine = async (id) => {
    setLoading(true);

    try {
      const res = await activePromotionLine(id);
      openNotification("Thành công", "Kích hoạt dòng khuyến mãi thành công!");
      fetchPromotionLine();
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

  const handleInActivePromotionLine = async (id) => {
    setLoading(true);
    try {
      const res = await inActivePromotionLine(id);
      openNotification(
        "Thành công",
        "Ngưng hoạt động dòng khuyến mãi thành công!"
      );
      fetchPromotionLine();
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

  const handleDeletePromotion = async () => {
    setLoading(true);
    try {
      const res = await deletePromotionHeader(promotionHeaderId);
      openNotification("Thành công", "Xóa chương trình khuyến mãi thành công!");
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
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Row gutter={[32]}>
              <Col span={12}>
                <Form.Item
                  label="Tên chương trình"
                  name="description"
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
                    disabled={moment().isAfter(promotionHeaderDetail?.fromDate)}
                    disabledDate={(d) =>
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
                    disabled={moment().isAfter(promotionHeaderDetail?.toDate)}
                    disabledDate={(d) =>
                      !d ||
                      d.isSameOrBefore(form.getFieldValue("fromDate")) ||
                      d.isSameOrBefore(moment())
                    }
                    format={formatDate}
                  />
                </Form.Item>
              </Col>

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
                  {promotionHeaderDetail?.status === "ACTIVE" ? (
                    <Popconfirm
                      title="Bạn có chắc chắn ngưng hoạt động chương trình khuyến mãi này?"
                      placement="topLeft"
                      okText="Đông ý"
                      cancelText="Hủy"
                      onConfirm={() => {
                        handleInActivePromotion();
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
                      title="Bạn có chắc chắn kích hoạt hương trình khuyến mãi này?"
                      placement="topLeft"
                      okText="Đông ý"
                      cancelText="Hủy"
                      onConfirm={() => {
                        handleActivePromotion();
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
                  {moment().isBefore(promotionHeaderDetail?.fromDate) && (
                    <Popconfirm
                      title="Bạn có chắc chắn xóa chương trình khuyến mãi này?"
                      placement="topLeft"
                      okText="Xóa"
                      cancelText="Hủy"
                      onConfirm={() => {
                        handleDeletePromotion(promotionHeaderDetail.id);
                      }}
                    >
                      <Button
                        style={{ marginRight: "20px" }}
                        icon={<DeleteOutlined />}
                        type="danger"
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                  )}
                  <Popconfirm
                    title="Xác nhận?"
                    placement="topLeft"
                    okText="Đồng ý"
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
                      placeholder="Tìm kiếm mã/tên"
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
                      Thêm dòng khuyến mãi
                    </Button>
                  </Col>
                </Row>
              </>
            )}
            columns={columns}
            dataSource={promotionLine}
            pagination={{
              pageSize: 10,
            }}
            scroll={{
              y: 280,
            }}
            rowKey="id"
          />
        </Col>
      </Row>
      <DrawerPromorionDetail
        headerStatus={promotionHeaderDetail?.status}
        canUpdate={moment().isAfter(form.getFieldValue("fromDate"))}
        show={showDrawer}
        handleCancel={() => setShowDrawer(false)}
        promotionLine={promotionLineSelected}
        onUpdate={handleUpdatePromotionLine}
        endDate={form.getFieldValue("toDate")}
        startDate={form.getFieldValue("fromDate")}
      />
      <ModalAddPromotionLine
        show={modalPrice}
        handleCancel={() => setModalPrice(false)}
        onSuccess={(data) => handleSuccessCreatePromotionLine(data)}
        promotionHeaderId={promotionHeaderId}
        startDate={form.getFieldValue("fromDate")}
        endDate={form.getFieldValue("toDate")}
      />
      <Loading show={loading} />
    </>
  );
};

export default PromotionHeaderDetail;
