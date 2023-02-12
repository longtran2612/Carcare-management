import { Table, Tag, Space, Button, Row, Col, Input } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { ClearOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { getCategories } from "pages/api/categoryAPI";
import ModalAddCategory from "components/Modal/ModalAddCategory";
import Loading from "components/Loading";
import Highlighter from "react-highlight-words";
import DrawerCategory from "components/Drawer/DrawerCategory";

function CategoryTable({}) {
  const [categories, setCategories] = useState([]);
  const [modalCategory, setModalCategory] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [categorySelected, setCategorySelected] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

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

  const handleCatetgory = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data.Data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleSuccessCategory = () => {
    handleCatetgory();
  };

  useEffect(() => {
    handleCatetgory();
  }, [showDrawer]);

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
      dataIndex: "categoryCode",
      key: "categoryCode",
      render: (text, record) => (
        <a
          onClick={() => {
            setCategorySelected(record.categoryCode);
            setShowDrawer(true);
          }}
          style={{ color: "blue", textDecorationLine: "underline" }}
        >
          {record?.categoryCode}
        </a>
      ),
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.categoryCode)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.type).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (text, record) => {
        return handleTypeService(record.type);
      },
    },
    // {
    //   title: "Trạng thái",
    //   key: "status",
    //   dataIndex: "status",
    //   render: (status) => {
    //     return (
    //       <>
    //         {status === "ACTIVE" ? (
    //           <Tag color={"green"}>{"Hoạt động"}</Tag>
    //         ) : (
    //           <Tag color={"red"}>{"Không hoạt động"}</Tag>
    //         )}
    //       </>
    //     );
    //   },
    // },
  ];
  const handleTypeService = (value) => {
    switch (value) {
      case "NORMAL":
        return <Tag color={"blue"}>{"Thông thường"}</Tag>;
      case "NEW":
        return <Tag color={"green"}>{"Mới"}</Tag>;
      case "LIKE":
        return <Tag color={"pink"}>{"Yêu thích"}</Tag>;
      default:
        break;
    }
  };

  return (
    <>
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
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalCategory(true)}
            >
              Thêm danh mục
            </Button>
          </Col>
        </Row>
        <Table
          onChange={handleSearch}
          columns={columns}
          dataSource={categories}
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
          //       // router.push(`/admin?categoryId=${record.categoryCode}`);
          //       setCategorySelected(record.categoryCode);
          //       setShowDrawer(true);
          //     },
          //   };
          // }}
        />
      </div>

      <ModalAddCategory
        show={modalCategory}
        handleCancel={() => setModalCategory(false)}
        onSuccess={(data) => handleSuccessCategory(data)}
      />
      <DrawerCategory
        show={showDrawer}
        handleCancel={() => setShowDrawer(false)}
        categoryId={categorySelected}
      />
      {/* <ModalQuestion
        title="Bạn có chắc chắn muốn xóa người dùng này không?"
        visible={modalQuestion}
        handleCancel={() => setModalQuestion(false)}
        // handleOk={() => handleRemoveService()}
      /> */}
      <Loading loading={loading} />
    </>
  );
}

export default CategoryTable;
