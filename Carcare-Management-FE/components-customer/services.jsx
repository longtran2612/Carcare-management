import { getServices } from "pages/api/serviceAPI";
import React, { useState, useEffect } from "react";
import {Row,Col} from 'antd'
import Image from "next/image";
export const Services = () => {
  const [services, setServices] = useState([]);

  const getService = async () => {
    try {
      const res = await getServices();
      setServices(res.data.Data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getService();
  }, []);

  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Dịch vụ của chúng tôi</h2>
        </div>
       <Row>   
          {services
            ? services.map((d, i) => (
              i<6 && (
                <Col span={8} style={{ textAlign: "center" }}>
                  {" "}
                  <Image width={270} height={270} src={d.imageUrl} alt={d.name} />
                  <div className="service-desc">
                    <h3>{d.name}</h3>
                    <p>{d.description}</p>
                  </div>
                </Col>
            )))
            : "loading"}
        </Row>
      </div>
    </div>
  );
};
