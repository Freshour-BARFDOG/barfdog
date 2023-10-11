import {
  FileSearchOutlined,
  UserOutlined,
  ShopOutlined,
  FundOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Layout, theme, Menu } from "antd";
import Link from "next/link";
import { useState } from "react";
import DashBoard from "./dash_board";
import OrderManager from "./order_manager";
import ProductManager from "./product_manager";
import MemberManager from "./member_manager";
import MemberModifier from "./member_modifier";
import OrderModifier from "./order_modifier";
import AlgorithmManager from "./algorithm_manager";
import SubscribeCreate from "./subscribe_create";
const { Sider, Content } = Layout;

function getItem(label, key, icon, path, children) {
  return { key, icon, children, label, path };
}
const menuItems = [
  getItem("대시보드", "dashboard", <FundOutlined />, "/dash_board"),
  getItem("DB관리", "manager", <FileSearchOutlined />, "/", [
    getItem("주문조회", "ordermanager", <ShopOutlined />, "/order_manager"),
    getItem("회원조회", "membermanager", <UserOutlined />, "/"),
    getItem("상품조회", "productmanager", <ShoppingCartOutlined />, "/"),
    getItem("알고리즘 변수", "algorithmmanager", <ShoppingCartOutlined />, "/"),
    //getItem("구독 임의생성", "subscribecreate", <ShoppingCartOutlined />, "/"),
  ]),
  //getItem("수정", "modifier", <FileSearchOutlined />, "/", [
    //getItem("구독정보수정", "orderModifier", <ShopOutlined />, "/"),
    //getItem("회원정보수정", "memberModifier", <UserOutlined />, "/"),
  //]),
];

export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onClick = (info) => {
    console.log(info.key);
    setSelectedKey(info.key);
  };

  const returnContetns = (item) => {
    if (selectedKey === "dashboard") {
      return <DashBoard />;
    } else if (selectedKey === "ordermanager") {
      return <OrderManager />;
    } else if (selectedKey === "membermanager") {
      return <MemberManager />;
    } else if (selectedKey === "productmanager") {
      return <ProductManager />;
    } else if (selectedKey === "orderModifier") {
      return <OrderModifier />;
    } else if (selectedKey === "memberModifier") {
      return <MemberModifier />;
    } else if (selectedKey === "algorithmmanager") {
      return <AlgorithmManager />;
    } else if (selectedKey === "subscribecreate") {
      return <SubscribeCreate />;
    } else {
      return null;
    }
  };

  return (
    <Layout>
      <Sider
        width={200}
        style={{ background: colorBgContainer }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />

        {/* <Menu theme="dark" mode="inline">
                    {menuItems.map((item) => (
                        <Menu.Item key={item.key} label={item.label}>
                        </Menu.Item>
                    ))}
                </Menu> */}
        <Menu
          onClick={onClick}
          defaultSelectedKeys={["dashboard"]}
          defaultOpenKeys={["manager","modifier"]}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Content
          style={{ background: colorBgContainer, margin: "24px 16px 0" }}
        >
          {returnContetns()}
        </Content>
      </Layout>
    </Layout>
  );
}
