import { Button, Form, Input, message, notification } from 'antd';
import './register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { callRegister } from '../../services/api';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form] = useForm();
    const [isSubmit, setIsSubmit] = useState(false)

    const onFinish = async (values) => {

        const { fullName, email, password, phone } = values;
        setIsSubmit(true)
        if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            if (values.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {

                const res = await callRegister(fullName, email, password, phone)
                setIsSubmit(false)
                if (res?.data?._id) {
                    navigate('/login')
                    message.success("Dang ki thanh cong")
                    console.log(res)
                } else {
                    notification.error({
                        message: "Có lỗi xảy ra",
                        description:
                            res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                        duration: 2
                    })
                }


            } else {
                notification.error({
                    message: "So dien thoai chua dung",
                    duration: 2
                })
            }
        } else {
            notification.error({
                message: "Email chua dung",
                duration: 2
            })
        }


    };
    const onReset = () => {
        form.resetFields();
    };

    return (
        <div className='register-page'>

            <div className='container'>
                <div className='left'></div>
                <div className='right'>
                    <div className='header'>Register</div>
                    <Form
                        {...layout}
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        style={{
                            maxWidth: 600,
                            marginRight: 50,
                            marginTop: 20,

                        }}
                    >
                        <Form.Item
                            name="fullName"
                            label="Full Name"
                            style={{
                                marginBottom: 45,
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your full name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            style={{
                                marginBottom: 45,
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',

                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            style={{
                                marginBottom: 45,
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',

                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Phone Number"
                            style={{
                                marginBottom: 45,
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone number!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item {...tailLayout}>
                            <Button htmlType="submit" className='submitBtn'
                                style={{
                                    marginRight: 60,
                                    marginLeft: -30,
                                    width: 100,
                                    height: 35,
                                }}>
                                Sign up
                            </Button>
                            <Button htmlType="button" onClick={onReset}
                                style={{
                                    width: 100,
                                    height: 35
                                }}>
                                Reset
                            </Button>

                        </Form.Item>
                    </Form>
                </div>

            </div>
        </div>

    );
}

export default RegisterPage;