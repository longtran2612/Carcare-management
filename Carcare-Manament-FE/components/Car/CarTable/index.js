import { Table, Tag, Space, Button, Row, Col, Input, Tooltip } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { ClearOutlined } from "@ant-design/icons";
import { getCars } from "pages/api/carAPI";
import { PlusOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import CarDetail from "../CarDetail";
import Loading from "components/Loading";
import Highlighter from "react-highlight-words";
import { openNotification } from "utils/notification";
// import ModalAddCarWithoutCustomer from "components/Modal/ModalAddCarWithoutCustomer";
import ModalAddCarWithCustomer from "components/Modal/ModalAddCarWithCustomer";
import Link from "next/link";

function CarTable({}) {
  const [cars, setCars] = useState([]);
  const [modalCar, setModalCar] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { carId } = router.query;

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
      title: "MÃ",
      dataIndex: "carCode",
      key: "carCode",
      render: (carCode) => (
        <a
          onClick={() => {
            router.push(`/admin?carId=${carCode}`);
          }}
          style={{ color: "blue" ,textDecorationLine: 'underline'}}
        >
          {carCode}
        </a>
      ),
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.carCode).toLowerCase().includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.color).toLowerCase().includes(value.toLowerCase()) ||
          String(record.brand).toLowerCase().includes(value.toLowerCase()) ||
          String(record.model).toLowerCase().includes(value.toLowerCase()) ||
          String(record.licensePlate)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.customerName)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      ...getColumnSearchProps("model"),
    },

    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
      ...getColumnSearchProps("licensePlate"),
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      ...getColumnSearchProps("brand"),
    },
    {
      title: "Màu xe",
      dataIndex: "color",
      key: "color",
      ...getColumnSearchProps("color"),
    },
    {
      title: "Sở hữu",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps("customerName"),
    },
  ];

  const handleGetCar = async () => {
    setLoading(true);
    try {
      const res = await getCars();
      setCars(res.data.Data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetCar();
  }, [carId]);

  const handleSuccessCreateCar = () => {
    handleGetCar();
  };

  return (
    <>
      {carId ? (
        <CarDetail carId={carId} onUpdateCar={handleGetCar} />
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
                style={{ float: "right" }}
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalCar(true)}
              >
                Thêm Xe
              </Button>
            </Col>
          </Row>
          <Table
            onChange={handleSearch}
            bordered
            columns={columns}
            dataSource={cars}
            pagination={{
              pageSize: 20,
            }}
            scroll={{
              y: 425,
              // x: 2000,
            }}
            // onRow={(record, rowIndex) => {
            //   return {
            //     onClick: (event) => {
            //       router.push(`/admin?carId=${record.carCode}`);
            //     },
            //   };
            // }}
          />
        </div>
      )}
      {/* <ModalAddCar
        show={modalCar}
        handleCancel={() => setModalCar(false)}
        onSuccess={(data) => handleSuccessCreateCar(data)}
      /> */}
      <ModalAddCarWithCustomer
        show={modalCar}
        handleCancel={() => setModalCar(false)}
        onSuccess={(data) => handleSuccessCreateCar(data)}
      />
      <Loading loading={loading} />
    </>
  );
}

export default CarTable;
