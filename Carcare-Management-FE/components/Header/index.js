import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  InfoOutlined,
  LogoutOutlined,
  SettingOutlined,
  LoginOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, message } from "antd";
import Link from "next/link";
import { logout } from "pages/api/authAPI";
import { setLogout } from "redux/slices/authSlice";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { openNotification } from "utils/notification";
import ModalQuestion from "components/Modal/ModalQuestion";

const { SubMenu } = Menu;

const MyHeader = () => {
  const [keyMenu, setKeyMenu] = useState(1);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authSlice);
  const [role , setRole] = useState(Cookies.get("roles"));
  const router = useRouter();

  const[showComfirm, setShowComfirm] = useState(false)

  const accessToken = Cookies.get("accessToken");

  const handleOnClick = (e) => {
    setKeyMenu(e.key);
  };

  const handleLogout = () => {
    dispatch(setLogout());
    router.push("/login");
  };
  const headerStyle = {
    display: "flex",
    justifyContent: "right",
    alignItems: "right",
    padding: "4px 16px",
    paddingRight: "20px",
    boxShadow: " 0 4px 4px -2px #CCD6FC",
  };
  return (
    <>
    <div className="header">
      <Menu
        mode="horizontal"
        style={headerStyle}
        onClick={handleOnClick}
        selectedKeys={keyMenu}
      >
        {user.roles === "ROLE_USER" && (
          <>
            {/* <Menu.Item key={1} icon={<HomeOutlined />}>
              <Link href="/home">Trang chủ</Link>
            </Menu.Item>

            <Menu.Item key={2} icon={<CarOutlined />}>
              <Link href="/service">Dịch vụ</Link>
            </Menu.Item> */}
          </>
        )}

        {accessToken ? (
          <SubMenu key="10" icon={<UserOutlined />} title={role === 'ROLE_ADMIN' ?'ADMIN' :'Nhân viên'}>
            <Menu.Item key="10_1" icon={<InfoOutlined />}>
              <Link href="/admin/profile">Thông tin cá nhân</Link>
            </Menu.Item>
            {/* <Menu.Item key="10_4" icon={<SettingOutlined />}>
              <Link href="/setting">Cài đặt</Link>
            </Menu.Item> */}
            <Menu.Item key="10_2" icon={<LogoutOutlined />}>
              {/* <Link a>Đăng xuất</Button> */}
              <a onClick={() => setShowComfirm(true)}>Đăng xuất</a>
            </Menu.Item>
          </SubMenu>
        ) : (
          <SubMenu key="11" icon={<LoginOutlined />} title="Đăng nhập">
            <Menu.Item key="11_1">
              <Link href="/login">Đăng nhập</Link>
            </Menu.Item>
          </SubMenu>
        )}
      </Menu>
    </div>
    <ModalQuestion
        title="Bạn có chắc chắn đăng xuất?"
        visible={showComfirm}
        handleCancel={() => setShowComfirm(false)}
        handleOk={() => {
          handleLogout();
          setShowComfirm(false);
        }}
      />
    </>
  );
};

export default MyHeader;
