import { notification } from "antd";
import {SmileOutlined ,WarningOutlined} from '@ant-design/icons';
const openNotification = (message = "Thành công", description = "",placement="topRight") => {
  notification.open({
    message: message,
    description: description,
    icon:  <SmileOutlined style={{ color: '#4B31DE' }} />,
    placement: placement,
  
    style: {
     backgroundColor: "#D9EEE1",
      color: "#4B31DE",
      // textAlign: "center",
      borderRadius: "10px",
    },

  });
};
const openNotificationWarning = (description = "",message = "Có lỗi xảy ra",placement="topRight") => {
  notification.open({
    message: message,
    description: description,
    icon:  <WarningOutlined style={{ color: '#D8C235' }} />,
    placement: placement,
  
    style: {
     backgroundColor: "#E8EED9",
      color: "#60801C",
      // textAlign: "center",
      borderRadius: "10px",
    },

  });
};

export { openNotification ,openNotificationWarning};
