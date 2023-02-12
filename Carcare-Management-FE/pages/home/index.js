import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import MyHeader from "components/Header";
import MyFooter from "components/Footer";
const { Content } = Layout;
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Features } from "components-customer/features";
import { CustomerHeader } from "components-customer/header";
import { About } from "components-customer/about";
import { Services } from "components-customer/services";
import { CustomerNavigation } from "components-customer/navigation";
import JsonData from "data/data.json";
import { Testimonials } from "components-customer/testimonials";

function HomePageCustomer() {
  const router = useRouter();

  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  
  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        {/* <MyHeader /> */}
        <Content>
          <CustomerNavigation />
          <CustomerHeader />
          {/* <Features data={landingPageData.Features} /> */}
          <Services  />
          <About data={landingPageData.About} />
          {/* <Testimonials data={landingPageData.Testimonials} /> */}
        </Content>
        <MyFooter />
      </Layout>
    </>
  );
}

export default HomePageCustomer;
