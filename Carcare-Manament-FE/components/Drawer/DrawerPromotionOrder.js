import React from "react";
import { Drawer, List, Row, Col, Avatar, Typography } from "antd";
import { TagsOutlined } from "@ant-design/icons";
import { getPromotionLineById } from "pages/api/promotionLineAPI";
import moment from "moment";
import { formatMoney } from "utils/format";
const formatDate = 'DD/MM/YYYY';
const { Title } = Typography;

export default function DrawerPromotionOrder({
  promotionDetails,
  show,
  handleCancel,
}) {

  // const getPromotionLineFromDate = async (id) => {
  //   try{
  //     const res = await getPromotionLineById(id);
  //     console.log(res.data.Data.fromDate);
  //     return moment(res.data.Data.fromDate).format(formatDate);
  //   }
  //   catch(err){
  //     console.log(err);
  //     return "";
  //   }
  // };
  // const getPromotionLineTodate = async (id) => {
  //   try{
  //     const res = await getPromotionLineById(id);
  //     console.log(res.data.Data.toDate);
      
  //     return moment(res.data.Data.toDate).format(formatDate);
  //   }
  //   catch(err){
  //     console.log(err);
  //     return "";
  //   }
  // };

  return (
    <Drawer
      title="Danh sách khuyến mãi được áp dụng"
      placement="right"
      onClose={() => handleCancel()}
      visible={show}
      width={700}
    >
      <>
        <List
          dataSource={promotionDetails}
          itemLayout="vertical"
          size="large"
          renderItem={(item) => (
            <Row gutter={16}>
              <Col
                style={{
                  border: "solid gray 1px",
                  borderRadius: "5px",
                  margin: "10px",
                  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                 
                }}
                className= 'background-promotion'
                span={24}
              >
                <List.Item key={item.id}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={{
                          xs: 24,
                          sm: 32,
                          md: 40,
                          lg: 64,
                          xl: 80,
                          xxl: 100,
                        }}
                        icon={<TagsOutlined />}
                      />
                    }
                    title={<a>{item.name}</a>}
                    description={<Title level={5}>{item.description}</Title>}
                  />
                  <Row>
                    {item.type === "PERCENTAGE" ? (
                      <Col span={24}>
                        {" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          Giảm {item.amount}%{" "}
                        </span>
                      </Col>
                    ) : (
                      <Col span={24}>
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          Giảm {formatMoney(item.amount || 0)}{" "}
                        </span>
                      </Col>
                    )}
                    {item.type != "SERVICE" && (
                    <Col span={12}>
                      <span style={{ fontWeight: "bold" }}>
                        Số tiền đơn hàng tối thiểu:{" "}
                      </span>
                      {formatMoney(item.minimumSpend || 0)}
                    </Col>
                    )}

                    <Col span={12}>
                      {item.type === "PERCENTAGE" && (
                        <>
                          <span style={{ fontWeight: "bold" }}>
                            Giảm tối đa:{" "}
                          </span>
                          {formatMoney(item.maximumDiscount || 0)}
                        </>
                      )}
                    </Col>

                    {/* <Col span={12}>
                      <span style={{ fontWeight: "bold" }}>Ngày bắt đầu: </span>
                      {moment(getPromotionLineFromDate(item?.promotionLineId)).format(formatDate)}
                    </Col>
                    <Col span={12}>
                      <span style={{ fontWeight: "bold" }}>Kết thúc: </span>
                      {moment(getPromotionLineTodate(item?.promotionLineId)).format(formatDate)}
                    </Col> */}
                  </Row>
                </List.Item>
              </Col>
            </Row>
          )}
        />
      </>
    </Drawer>
  );
}
