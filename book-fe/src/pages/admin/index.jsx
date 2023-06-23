import { FileOutlined, DashboardOutlined, UserOutlined, TeamOutlined, MenuFoldOutlined, MailOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Layout, Menu, message, theme } from 'antd';
import { FiBookOpen } from "react-icons/fi";
import { GrMoney } from "react-icons/gr";

import React, { useState } from 'react';
import './admin.scss'
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { callLogOut } from '../../services/api';
import { doLogoutAction } from '../../redux/account/accountSlice'
import { Link, useNavigate } from 'react-router-dom';
import UserTable from '../../components/Admin/User/UserTable';
import BookTable from '../../components/Admin/Book/BookTable';

import InputSearch from '../../components/Admin/User/InputSearch';
import Icon from '@ant-design/icons/lib/components/Icon';


const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}


const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [showUser, setShowUser] = useState(false)
    const [showBook, setShowBook] = useState(false)

    const dispatch = useDispatch();
    const user = useSelector(state => state.account.user.user)
    const userName = user.fullName
    const navigate = useNavigate()
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const items = [

        getItem('Dashboard',
            '1',
            <DashboardOutlined />),
        getItem('Users', 'sub1', <UserOutlined />, [
            getItem(<label
                style={{ cursor: 'pointer' }}
                onClick={() => handleShowUser()}
            >Manage user
            </label>, '3'),
        ]),
        getItem(<label
            style={{ cursor: 'pointer' }}
            onClick={() => handleShowBook()}
        >Manage book
        </label>, '6', <FiBookOpen />),
        getItem('Manage orders', '7', <GrMoney />),

    ];

    const handleShowBook = () => {
        setShowBook(!showBook)
        setShowUser(false)
    }
    const handleShowUser = () => {
        setShowUser(!showUser)
        setShowBook(false)
    }
    const userAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`

    const handleLogout = async () => {
        const res = await callLogOut();
        if (res && res.data) {
            dispatch(doLogoutAction())
            message.success('Đăng xuất thành công');
            navigate('/login')
        }
    }


    const itemsDropdown = [
        {
            label: <label style={{ cursor: 'pointer' }}>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];



    return (
        <div className='admin-page'>
            <Layout
                style={{
                    minHeight: '100vh',
                }}
            >
                <Sider style={{
                    background: colorBgContainer,
                }} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                        Admin
                    </div>
                    <div className="demo-logo-vertical" />
                    <Menu defaultSelectedKeys={['1']}
                        mode="inline"
                        items={items}
                    >
                    </Menu>
                </Sider>
                <Layout style={{
                }}>
                    <div className='header' >
                        <Header
                            style={{
                                margin: '10px 16px 30px 16px',
                                background: colorBgContainer,
                                textAlign: "right",
                            }}>
                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <Avatar size="large" src={userAvatar} />

                                        Welcome {user?.fullName}
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                        </Header>
                    </div>

                    <Content
                        style={{
                            margin: '-14px 16px 0 16px',
                        }}
                    >
                        {/* <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb> */}
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                            }}
                        >
                            {showUser === true ? <UserTable /> : ''}
                            {showBook === true ? <BookTable /> : ''}


                        </div>
                    </Content>
                    <Footer
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        Ant Design ©2023 Created by Ant UED
                    </Footer>
                </Layout>

            </Layout>
        </div>

    );
};
export default App;