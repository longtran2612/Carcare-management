import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Button,
  Input,
  Select,
  Form,
  List,
  Layout,
} from "antd";
import {
  SearchOutlined,
  ClearOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { getServices, searchService } from "pages/api/serviceAPI";
import { useRouter } from "next/router";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import { CustomerNavigation } from "components-customer/navigation";
import { getCategories } from "pages/api/categoryAPI";

const ServicePage = () => {
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [listCategory, setListCategory] = useState([]);

  const getService = async () => {
    setLoading(true);
    let dataGetOrder = {
      keyword: form.getFieldValue("keyword"),
      categoryId: form.getFieldValue("categoryId"),
      status: 100,
    };
    console.log(dataGetOrder);
    try {
      const res = await searchService(dataGetOrder);
      setServices(res?.data?.Data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const handleReset = () => {
    form.resetFields();
    getService();
  };

  const handleFetchCategory = async () => {
    try {
      const res = await getCategories();
      setListCategory(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getService();
    handleFetchCategory();
  }, []);
  return (
    <>
      <CustomerNavigation />

      <Layout.Content
        style={{
          padding: "1rem",
          backgroundColor: "#EAE3E3",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "20px",
            paddingLeft: "100px",
            paddingRight: "100px",
          }}
        >
          <Form form={form}>
            <Row gutter={[16,16]}>
              <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                <Button
                  style={{ width: "100%" }}
                  type="dashed"
                  onClick={() => router.push("/customer")}
                  icon={<RollbackOutlined />}
                >
                  Trở lại
                </Button>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Form.Item name="keyword">
                  <Input  placeholder="Tìm kiếm" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                <Form.Item name="categoryId">
                  <Select style={{ width: "100%" }} placeholder="Chọn danh mục">
                    {listCategory?.map((item) => {
                      return (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                <Button
                  style={{ width: "100%" }}
                  onClick={() => getService()}
                  icon={<SearchOutlined />}
                >
                  Tìm kiếm
                </Button>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                <Button
                  style={{ width: "100%" }}
                  onClick={() => handleReset()}
                  icon={<ClearOutlined />}
                >
                  Xóa bộ lọc
                </Button>
              </Col>
            </Row>
            <List
              grid={{
                gutter: [16, 16],
                xs: 1,
                sm: 2,
                md: 3,
                lg: 4,
                xl: 4,
                xxl: 4,
              }}
              style={{ overflow: "auto", padding: "5px", height: "520px" }}
              dataSource={services}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    style={{
                      cursor: "pointer",
                      height: "220px",
                      borderRadius: "5px",
                      boxShadow: "0px 0px 5px 0px #8D969F",
                    }}
                    hoverable
                    cover={<Image layout="fill" src={item.imageUrl} />}
                  />
                  <div style={{ textAlign: "center", padding: "5px" }}>
                    <h5 style={{ font: "bold" }}>{item.name}</h5>
                    <span>{formatMoney(item.servicePrice.price)}</span>
                  </div>

                  {/* <Card.Meta
                    style={{
                      display: "flex",
                      marginTop: "5px",
                      justifyContent: "space-between",
                    }}
                    title={item.name}
                    description={formatMoney(item.price)}
                  /> */}
                </List.Item>
              )}
            />
          </Form>
        </div>
      </Layout.Content>

      <Loading loading={loading} />
    </>
  );
};
export default ServicePage;
