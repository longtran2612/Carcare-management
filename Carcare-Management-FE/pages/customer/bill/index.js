import React,{useState,useEffect} from "react";
import { Tabs, Layout, Button, Col, Row } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import BillCustomer from "components-customer/bill";
import Loading from "components/Loading";
import { useRouter } from "next/router";
import { CustomerNavigation } from "components-customer/navigation";
import Cookies from "js-cookie";

export default function CustomerBillPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
 

  return (
    <>
      <CustomerNavigation />
      <Layout.Content
        style={{
          padding: "1rem",
          backgroundColor: "#EAE3E3",
        }}
      >
        <Row>
          <Col
            style={{ borderRadius: "5px", backgroundColor: "white" }}
            span={24}
          >
            <Button
              type="dashed"
              style={{
                paddingLeft: "20px",
                marginTop: "10px",
                marginLeft: "15px",
              }}
              onClick={() => router.push("/customer")}
              icon={<RollbackOutlined />}
            >
              Trở lại
            </Button>
            <div
              style={{
                margin: "0.4rem",
                padding: "1.5rem",
                minHeight: "75vh",
              }}
            >
              <BillCustomer />
            </div>
          </Col>
        </Row>
      </Layout.Content>
    </>
  );
}
