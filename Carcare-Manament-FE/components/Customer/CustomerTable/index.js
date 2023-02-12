import {
  Table,
  message,
  Tag,
  Space,
  Button,
  Tooltip,
  Row,
  Col,
  Input,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import { ClearOutlined, PlusOutlined } from "@ant-design/icons";
import { getCustomers } from "pages/api/customerAPI";
import ModalQuestion from "components/Modal/ModalQuestion";
import ModalAddCustomer from "components/Modal/ModalAddCustomer";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import CustomerDetail from "components/Customer/CustomerDetail";
import Loading from "components/Loading";
import Highlighter from "react-highlight-words";
import moment from "moment";
const formatDate = "DD/MM/YYYY";

function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [modalCustomer, setModalCustomer] = useState(false);
  const [modalQuestion, setModalQuestion] = useState(false);
  const router = useRouter();
  const { customerId } = router.query;
  const [loading, setLoading] = useState(false);

  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchText, setSearchText] = useState("");
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
      dataIndex: "customerCode",
      key: "customerCode",
      width: 150,
      render: (text, record) => (
        <a
          onClick={() => {
            router.push(`/admin?customerId=${record.customerCode}`);
          }}
          style={{ color: "blue", textDecorationLine: "underline" }}
        >
          {record?.customerCode}
        </a>
      ),
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.customerCode)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.email).toLowerCase().includes(value.toLowerCase()) ||
          String(record.phoneNumber)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.identityNumber)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 150,
      ...getColumnSearchProps("name"),
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 140,
      sorter: {
        compare: (a, b) => a.phoneNumber - b.phoneNumber,
        multiple: 2,
      },
      ...getColumnSearchProps("phoneNumber"),
      render: (phoneNumber) => (
        <Tooltip placement="topLeft" title={phoneNumber}>
          {phoneNumber}
        </Tooltip>
      ),
    },
    {
      title: "CCCD/CMND",
      dataIndex: "identityNumber",
      key: "identityNumber",
      width: 140,
      sorter: {
        compare: (a, b) => a.identityNumber - b.identityNumber,
        multiple: 2,
      },
      ...getColumnSearchProps("identityNumber"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      render: (email) => (
        <Tooltip placement="topLeft" title={email}>
          {email}
        </Tooltip>
      ),
    },
    {
      title: "Ngày sinh",
      key: "dateOfBirth",
      dataIndex: "dateOfBirth",
      render: (dateOfBirth) => (
        <>{dateOfBirth ? moment(dateOfBirth).format(formatDate) : ""}</>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      with: 100,
      render: (gender) => (
        <>
          {gender === "Nam" ? (
            <Tag color="blue">Nam</Tag>
          ) : (
            <Tag color="pink">Nữ</Tag>
          )}
        </>
      ),
    },
    {
      title: "Nhóm khách hàng",
      key: "statusName",
      dataIndex: "statusName",
      render: (statusName) => (
        <>
          <Tag color="green">{statusName}</Tag>
        </>
      ),
    },
    // {
    //   title: "Quốc gia",
    //   key: "nationality",
    //   dataIndex: "nationality",
    //   ...getColumnSearchProps("nationality"),
    // },
  ];

  const handlecustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomers();
      setCustomers(res.data.Data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  useEffect(() => {
    handlecustomers();
  }, [customerId]);

  const handleSuccessCreateCustomer = (data) => {
    handlecustomers();
  };

  return (
    <>
      {customerId ? (
        <CustomerDetail
          customerId={customerId}
          onUpdateUser={handlecustomers}
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
              <Button onClick={() => handleReset()} icon={<ClearOutlined />}>
                Xóa bộ lọc
              </Button>
            </Col>
            <Col span={11}>
              <Button
                className="PullRight"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalCustomer(true)}
              >
                Thêm khách hàng mới
              </Button>
            </Col>
          </Row>
          <Table
            // onChange={handleSearch}
            searchable
            columns={columns}
            dataSource={customers}
            bordered
            pagination={{
              pageSize: 20,
            }}
            scroll={{
              y: 425,
            }}
          />
          <ModalAddCustomer
            show={modalCustomer}
            handleCancel={() => setModalCustomer(false)}
            onSuccess={(data) => handleSuccessCreateCustomer(data)}
          />
        </div>
      )}
      <ModalQuestion
        title="Bạn có chắc chắn muốn xóa người dùng này không?"
        visible={modalQuestion}
        handleCancel={() => setModalQuestion(false)}
        // handleOk={() => handleRemoveService()}
      />
      <Loading loading={loading} />
    </>
  );
}

export default CustomerTable;
