import React from "react";
import { Breadcrumb, Button, Col, Row } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import PromotionHeaderTable from "./PromotionHeaderTable";

const PromotionHeaderPage = () => {
  const router = useRouter();
  const { promotionHeaderId } = router.query;
  return (
    <>
      <Row style={{ paddingBottom: "7px" }}>
        <Col span={12}>
          <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
            <Breadcrumb.Item href="/admin">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">
              {" "}
              Quản lý chương trình khuyến mãi
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={12}>
          {promotionHeaderId && (
            <Button
              style={{ float: "right" }}
              icon={<RollbackOutlined />}
              onClick={() => router.back()}
            >
              Trở lại
            </Button>
          )}
        </Col>
      </Row>

      <div className="content-white-admin">
        <PromotionHeaderTable />
      </div>
    </>
  );
};
export default PromotionHeaderPage;
