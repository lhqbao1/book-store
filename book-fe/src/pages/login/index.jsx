import { callLogin } from "../../services/api";
import { useForm } from 'antd/es/form/Form';
import { Button, Form, Input, Checkbox, message, notification } from 'antd';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './login.scss'
import { useDispatch } from "react-redux";
import { doLoginAction, doGetAccountAction } from "../../redux/account/accountSlice";

const LoginPage = () => {
    const [form] = useForm();
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(false)

    const dispatch = useDispatch();


    const onFinish = async (values) => {
        const { username, password } = values
        setIsLogin(true)
        const res = await callLogin(username, password)
        setIsLogin(false)
        if (res?.data?.access_token) {
            localStorage.setItem('access_token', res.data.access_token)
            dispatch(doLoginAction(res.data.user))
            dispatch(doGetAccountAction(res.data.user))
            message.success("Dang nhap thanh cong")
            navigate("/")
        } else {
            notification.error({
                message: "Wrong username or password",
                duration: 2
            })
        }
    }
    return (
        <div className="login-page">
            <div className="content">
                <div className="left-content"></div>
                <div className="right-content">
                    <h2 className="header"> User Login</h2>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 800,
                            marginLeft: 100
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            className="input"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                            style={{
                                borderRadius: 20
                            }}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            className="input"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                            style={{
                                borderRadius: 20
                            }}
                        >
                            <Input.Password />
                        </Form.Item>



                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button className="login-button" htmlType="submit" loading={isLogin}>
                                LOGIN
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>


        </div>
    )
}

export default LoginPage;