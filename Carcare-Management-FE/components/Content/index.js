import React from "react";
import UserPage from "components/User";
import ServicePage from "components/Service";
import CategoryPage from "components/Category";
import CarModelPage from "components/CarModel";
import CarPage from "components/Car";
import PriceHeaderPage from "components/PriceHeader";
import CarSlot from "components/CarSlot";
import OrderPage from "components/Order";
import CustomerPage from "components/Customer";
import OrderNotRequestPage from "components/OrderNotRequest";
import PromotionHeaderPage from "components/Promotion";
import BillPage from "components/Bill";
import ReportPage from "components/Report";
import StatisticalPage from "components/Statistics";
import SaleReport from "components/Report/SaleReport";
import SaleReportCustomer from "components/Report/SaleReportCustomer";
import ReportCancelBill from "components/Report/CancelBill";
import ReportPromotion from "components/Report/Promotion";
const MyContent = ({ keyMenu }) => {
  const renderViewByKey = () => {
    switch (keyMenu) {
      case "order":
        return <OrderPage />;
      case "order-not-request":
        return <OrderNotRequestPage />;
      case "service":
        return <ServicePage />;
      case "category":
        return <CategoryPage />;
      case "user":
        return <UserPage />;
      case "user-group":
        return <UserPage />;
      case "car":
        return <CarPage />;
      case "car-model":
        return <CarModelPage />;
      case "price":
        return <PriceHeaderPage />;
      case "car-slot":
        return <CarSlot />;
      case "customer":
        return <CustomerPage />;
      case "6":
        return <PromotionHeaderPage />;
      case "bills":
        return <BillPage />;
      case "report":
        return <ReportPage />;
      case "report-bill":
        return <SaleReport />;
      case "report-bill-customer":
        return <SaleReportCustomer />;
      case "report-bill-cancel":
        return <ReportCancelBill />;
      case "report-promotion":
        return <ReportPromotion />;
      case "1":
        return <StatisticalPage />;
      default:
        break;
    }
  };

  return <>{renderViewByKey()}</>;
};

export default MyContent;
