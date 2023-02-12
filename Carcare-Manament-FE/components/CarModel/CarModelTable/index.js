import {
  Table,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Input,
  Popconfirm,
  Upload,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import {
  getCarModel,
  importExcelCarModel,
  exportExcelCarModel,
} from "pages/api/carModel";
import {
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import ModalQuestion from "components/Modal/ModalQuestion";
import ModalAddCarModel from "components/Modal/ModalAddCarModal";
import CarModelDetail from "components/CarModel/CarModelDetail";
import Loading from "components/Loading";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { openNotification } from "utils/notification";

function CarModelTable({}) {
  const [carModels, setCarModels] = useState([]);
  const [modalCarModel, setModalCarModel] = useState(false);
  const [id, setId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [file, setFile] = useState(null);
  const { carModelId } = router.query;
  const [uploadFile, setUploadFile] = useState(null);

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
      dataIndex: "carModelCode",
      key: "carModelCode",
      render: (text, record) => (
        <a
          onClick={() => {
            router.push(`/admin?carModelId=${record.id}`);
          }}
          style={{ color: "blue", textDecorationLine: "underline" }}
        >
          {record.carModelCode}
        </a>
      ),
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.carModelCode)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.brand).toLowerCase().includes(value.toLowerCase()) ||
          String(record.model).toLowerCase().includes(value.toLowerCase()) ||
          String(record.type).toLowerCase().includes(value.toLowerCase()) ||
          String(record.year).toLowerCase().includes(value.toLowerCase()) ||
          String(record.engine).toLowerCase().includes(value.toLowerCase()) ||
          String(record.fuel).toLowerCase().includes(value.toLowerCase()) ||
          String(record.transmission)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.seat).toLowerCase().includes(value.toLowerCase())
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
      title: "Hãng xe",
      dataIndex: "brand",
      key: "brand",
      width: 120,
      ...getColumnSearchProps("brand"),
    },

    {
      title: "Động cơ",
      dataIndex: "engine",
      key: "engine",
      width: 120,
    },
    {
      title: "Truyền động",
      dataIndex: "transmission",
      key: "transmission",
      width: 120,
    },
    {
      title: "Số nghế ngồi",
      dataIndex: "seats",
      key: "seats",
      width: 120,
      sorter: {
        compare: (a, b) => a.seats - b.seats,
        multiple: 2,
      },
    },
    {
      title: "Nhiên liệu",
      dataIndex: "fuel",
      key: "fuel",
      width: 120,
    },
    {
      title: "Năm sản xuất",
      dataIndex: "year",
      key: "year",
      width: 120,
      sorter: {
        compare: (a, b) => a.year - b.year,
        multiple: 2,
      },
    },
  ];

  const handleGetCarModel = async () => {
    setLoading(true);
    try {
      const res = await getCarModel();
      setCarModels(res.data.Data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  useEffect(() => {
    handleGetCarModel();
  }, [carModelId]);

  const handleSuccessCarModel = () => {
    handleGetCarModel();
  };

  const handleExportExcel = async () => {
    try {
      const response = await exportCarModelExcel();
    } catch (err) {
      console.log(err);
    }
  };
  const handleImportExcel = async () => {
    openNotification("Thành công", "Nhập dữ liệu thành công");
    handleGetCarModel();
  };

  return (
    <>
      {carModelId ? (
        <CarModelDetail
          carModelId={carModelId}
          onUpdateCarModel={handleGetCarModel}
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
            <Col span={2}></Col>
            <Col span={3}>
              <a
                download="dowload"
                href="https://khoa-luan-gl.herokuapp.com/car-models/export-to-excel"
              >
                <Button
                  style={{ float: "right" }}
                  icon={<VerticalAlignTopOutlined />}

                  // onClick={() => handleExportExcel()}
                >
                  Export Excel
                </Button>
              </a>
            </Col>
            <Col span={3}>
              <Upload
                name="file"
                action="https://khoa-luan-gl.herokuapp.com/car-models/import-from-excel"
                onChange={handleImportExcel}
                showUploadList={false}
              >
                <Button
                  style={{ marginLeft: "10px", float: "right" }}
                  icon={<VerticalAlignBottomOutlined />}
                >
                  Import Excel
                </Button>
              </Upload>
            </Col>
            <Col span={3}>
              <Button
                style={{ float: "right" }}
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setModalCarModel(true)}
              >
                Thêm mẫu xe
              </Button>
            </Col>
          </Row>
          <Table
            onChange={handleSearch}
            columns={columns}
            dataSource={carModels}
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
            //       router.push(`/admin?carModelId=${record.id}`);
            //     },
            //   };
            // }}
          />
        </div>
      )}
      <ModalAddCarModel
        show={modalCarModel}
        handleCancel={() => setModalCarModel(false)}
        onSuccess={(data) => handleSuccessCarModel(data)}
      />
      {/* <ModalQuestion
        title="Bạn có chắc chắn muốn xóa dịch vụ này không?"
        visible={modalQuestion}
        handleCancel={() => setModalQuestion(false)}
        handleOk={() => handleRemoveService()}
      /> */}
      <Loading loading={loading} />
    </>
  );
}

export default CarModelTable;
