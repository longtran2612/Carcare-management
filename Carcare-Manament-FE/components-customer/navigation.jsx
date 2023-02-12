import logo from "public/images/logo-header-customer.png";
import Image from "next/image";
import Link from "next/link";
import {
  InfoOutlined,
  LogoutOutlined,
  SettingOutlined,
  LoginOutlined,
  UserOutlined,
  DownOutlined,
  HighlightOutlined,
  ClearOutlined,
  BookOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "redux/slices/authSlice";
import { Menu, message, Dropdown } from "antd";
import { logout } from "pages/api/authAPI";
const { SubMenu } = Menu;
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export const CustomerNavigation = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authSlice);
  const accessToken = Cookies.get("accessToken");
  const router = useRouter();
  
  const handleLogout = () => {
    dispatch(setLogout());
    router.push("/login");
  };

  const handleMenu = () => {
    return (
      <Menu>
        <Menu.Item key="1">
          <Link href="/customer/profile">
            <a>
              <UserOutlined /> Trang cá nhân
            </a>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link href="/customer">
            <a>
              <BarsOutlined /> Chức năng
            </a>
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link href="/customer/order">
            <a>
              <BookOutlined /> Đơn hàng
            </a>
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link href="/customer/bill">
            <a>
              <BookOutlined /> Hóa đơn
            </a>
          </Link>
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item key="6" onClick={handleLogout}>
          <LogoutOutlined /> Đăng xuất
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <nav
      id="menu"
      style={{ position: "static", top: 0, marginBottom: 0 }}
      className="navbar navbar-default navbar-fixed-top"
    >
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a className="navbar-brand page-scroll">
            <Link href="/home">
              <Image src={logo} width={120} height={90} />
            </Link>
            {/* VLCARCARE */}
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            {accessToken && (
              <>
                <li>
                  <Link href="/service">
                    <a className="page-scroll">Dịch vụ</a>
                  </Link>
                </li>

                <li>
                  <Link href="/customer/order">
                    <a className="page-scroll">Đơn hàng</a>
                  </Link>
                </li>
                <li>
                  <Link href="/customer/bill">
                    <a className="page-scroll">Hóa đơn</a>
                  </Link>
                </li>
              </>
            )}

            {accessToken ? (
              <li>
                <a className="page-scroll">
                  <Dropdown overlay={handleMenu}>
                    <a onClick={(e) => e.preventDefault()}>
                      Cá nhân <DownOutlined />
                    </a>
                  </Dropdown>
                </a>
              </li>
            ) : (
              <li>
                <Link href="/login">
                  <a className="page-scroll">Đăng nhập</a>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
