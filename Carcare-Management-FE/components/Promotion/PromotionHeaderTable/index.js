import { Table, Tag, Space, Button, Row, Col, Input } from "antd";
import React, { useState, useEffect, useRef } from "react";
import {getPromotionHeaders} from "pages/api/promotionHeaderAPI";
import ModalQuestion from "components/Modal/ModalQuestion";
import { useRouter } from "next/router";
import PromotionHeaderDetail from "../PromotionHeaderDetail";
import ModalAddPriceHeader from "components/Modal/ModalAddPriceHeader";
import ModalAddPromotionHeader from "components/Modal/ModalAddPromotionHeader";
import moment from "moment";
const formatDate = "DD/MM/YYYY";
import Loading from "components/Loading";
import { ClearOutlined, SearchOutlined,PlusOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { openNotification } from "utils/notification";

function PromotionHeaderTable({}) {
  const [promotionHeaders, setproMotionHeaders] = useState([]);
  const [modalPromotionHeader, setModalPromotionHeader] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const { promotionHeaderId } = router.query;
  const [loading, setLoading] = useState(false);

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
      dataIndex: "promotionHeaderCode",
      key: "promotionHeaderCode",
      width:290,
      render: (text, record) => (
        <a
          onClick={() => {
            router.push(`/admin?promotionHeaderId=${record.id}`);
          }}
          style={{ color: "blue", textDecorationLine: "underline" }}
        >
          {record?.promotionHeaderCode}
        </a>
      ),
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.promotionHeaderCode).toLowerCase().includes(value.toLowerCase()) ||
          String(record.description).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Tên chương trình",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Từ ngày",
      dataIndex: "fromDate",
      key: "fromDate",
      width: 120,
      render: (text, record, dataIndex) => {
        return <div>{moment(record.fromDate).format(formatDate)}</div>;
      },
    },
    {
      title: "Đến ngày",
      dataIndex: "toDate",
      key: "toDate",
      width: 120,
      render: (text, record, dataIndex) => {
        return <div>{moment(record.toDate).format(formatDate)}</div>;
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 200,
      dataIndex: "status",
      render: (status) => {
        return (
          <>
            {status === "ACTIVE" ? (
              <Tag color={"green"}>{"Hoạt động"}</Tag>
            ) : (
              <Tag color={"red"}>{"Không hoạt động"}</Tag>
            )}
          </>
        );
      },
    },
  ];

  const handleGetpromotionHeaders = async () => {
    setLoading(true);
    try {
      const res = await getPromotionHeaders();
      setproMotionHeaders(res.data.Data);
      setLoading(false);
      
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetpromotionHeaders();
  }, [promotionHeaderId]);

  const handleSuccessCreatePromotionHeader = () => {
    handleGetpromotionHeaders();
  };

  return (
    <>
      {promotionHeaderId ? (
        <PromotionHeaderDetail
          promotionHeaderId={promotionHeaderId}
          onUpdatepromotionHeaders={handleGetpromotionHeaders}
        />
      ) : (
        <div>
          <Row style={{ margin: "5px" }}>
            <Col span={8} style={{ marginRight: "10px" }}>
              <Input.Search
                placeholder="Tìm kiếm"
                onChange={(e) => setSearchGlobal(e.target.value)}
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
              <Button style={{float:"right"}} type="primary" icon={<PlusOutlined />} onClick={() => setModalPromotionHeader(true)}>
                Thêm chương trình khuyến mãi
              </Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={promotionHeaders}
            bordered
            pagination={{
              pageSize: 20,
            }}
            scroll={{
              y: 425,
            }}
          />
          <ModalAddPromotionHeader
            show={modalPromotionHeader}
            handleCancel={() => setModalPromotionHeader(false)}
            onSuccess={(data) => handleSuccessCreatePromotionHeader(data)}
          />
        </div>
      )}
  
      <Loading loading={loading} />
    </>
  );
}

export default PromotionHeaderTable;
