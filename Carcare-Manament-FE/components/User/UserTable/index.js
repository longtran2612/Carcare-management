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
import { ClearOutlined } from "@ant-design/icons";
import { getUsers } from "pages/api/userAPI";
import ModalQuestion from "components/Modal/ModalQuestion";
import ModalAddUser from "components/Modal/ModelAddUser";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import UserDetail from "../UserDetail";
import Loading from "components/Loading";
import Highlighter from "react-highlight-words";
import moment from "moment";
const formatDate = "DD/MM/YYYY";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [modalUser, setModalUser] = useState(false);
  const [modalQuestion, setModalQuestion] = useState(false);
  const router = useRouter();
  const { userId } = router.query;
  const [loading, setLoading] = useState(false);

  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [filteredInfo, setFilteredInfo] = useState({});

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
      dataIndex: "userCode",
      key: "userCode",
      render: (text, record) => (
        <a
          onClick={() => {
            router.push(`/admin?userId=${record.id}`);
          }}
          style={{ color: "blue", textDecorationLine: "underline" }}
        >
          {record?.userCode}
        </a>
      ),
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.userCode).toLowerCase().includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.email).toLowerCase().includes(value.toLowerCase()) ||
          String(record.phone).toLowerCase().includes(value.toLowerCase()) ||
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
      ...getColumnSearchProps("name"),
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
      sorter: {
        compare: (a, b) => a.phoneNumber - b.phoneNumber,
        multiple: 2,
      },
      render: (phone) => (
        <Tooltip placement="topLeft" title={phone}>
          {phone}
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
      key: "birthDay",
      dataIndex: "birthDay",
      render: (birthDay) => (
        <>{birthDay ? moment(birthDay).format(formatDate) : ""}</>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 120,
      // ...getColumnSearchProps("gender"),
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
      title: "Trạng thái",
      key: "status",
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

  const handleUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data.Data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  useEffect(() => {
    handleUsers();
  }, [userId]);

  const handleSuccessCreteUser = () => {
    handleUsers();
  };
  return (
    <>
      {userId ? (
        <UserDetail userId={userId} onUpdateUser={handleUsers} />
      ) : (
        <div>
          <Row style={{ margin: "5px" }}>
            <Col span={8} style={{ marginRight: "10px" }}>
              <Input.Search
                placeholder="Tìm kiếm"
                onChange={(e) => setSearchGlobal(e.target.value)}
                // onSearch={(value) => setSearchGlobal(value)}
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
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setModalUser(true)}
              >
                Thêm nhân viên
              </Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={users}
            bordered
            pagination={{
              pageSize: 20,
            }}
            scroll={{
              y: 425,
            }}
          />
          <ModalAddUser
            show={modalUser}
            handleCancel={() => setModalUser(false)}
            onSuccess={(data) => handleSuccessCreteUser(data)}
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

export default UserTable;
