import { Table, Tag, Space, Button, Row, Col, Input } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { getPriceHeaders, deletePriceHeader } from "pages/api/PriceHeaderAPI";
import { useRouter } from "next/router";
import PriceHeaderDetail from "../PriceHeaderDetail";
import ModalAddPriceHeader from "components/Modal/ModalAddPriceHeader";
import moment from "moment";
const formatDate = "DD/MM/YYYY";
import Loading from "components/Loading";
import {
  ClearOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

function PriceHeaderTable({}) {
  const [priceHeaders, setPriceHeaders] = useState([]);
  const [modalPriceHeader, setModalPriceHeader] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const { priceHeaderId } = router.query;
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
      dataIndex: "priceHeaderCode",
      key: "priceHeaderCode",
      render: (text, record) => (
        <a
          onClick={() => {
            router.push(`/admin?priceHeaderId=${record.id}`);
          }}
          style={{ color: "blue", textDecorationLine: "underline" }}
        >
          {record?.priceHeaderCode}
        </a>
      ),
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.priceHeaderCode)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Tên bảng giá",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Từ ngày",
      dataIndex: "fromDate",
      key: "fromDate",
      width: 150,
      render: (text, record, dataIndex) => {
        return <div>{moment(record.fromDate).format(formatDate)}</div>;
      },
    },
    {
      title: "Đến ngày",
      dataIndex: "toDate",
      key: "toDate",
      width: 150,
      render: (text, record, dataIndex) => {
        return <div>{moment(record.toDate).format(formatDate)}</div>;
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      ...getColumnSearchProps("status"),
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

  const handleGetPriceHeaders = async () => {
    setLoading(true);
    try {
      getPriceHeaders().then((res) => {
        if (res.data.StatusCode == 200) {
          setPriceHeaders(res.data.Data);
        }
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetPriceHeaders();
  }, [priceHeaderId]);

  const handleSuccessCreatePriceHeader = () => {
    handleGetPriceHeaders();
  };

  return (
    <>
      {priceHeaderId ? (
        <PriceHeaderDetail
          priceHeaderId={priceHeaderId}
          onUpdatePriceHeaders={handleGetPriceHeaders}
        />
      ) : (
        <div>
          <Row style={{ margin: "5px" }}>
            <Col span={8} style={{ marginRight: "10px" }}>
              <Input.Search
                placeholder="Tìm kiếm"
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
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setModalPriceHeader(true)}
              >
                Thêm bảng giá
              </Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={priceHeaders}
            bordered
            pagination={{
              pageSize: 20,
            }}
            scroll={{
              y: 425,
            }}
            // onRow={(record, rowIndex) => {
            //   return {
            //     onClick: (event) => {
            //       router.push(`/admin?priceHeaderId=${record.id}`);
            //     },
            //   };
            // }}
          />
          <ModalAddPriceHeader
            show={modalPriceHeader}
            handleCancel={() => setModalPriceHeader(false)}
            onSuccess={(data) => handleSuccessCreatePriceHeader(data)}
          />
        </div>
      )}
      <Loading loading={loading} />
    </>
  );
}

export default PriceHeaderTable;
