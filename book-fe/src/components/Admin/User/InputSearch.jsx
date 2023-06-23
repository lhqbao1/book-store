import { Button, Checkbox, Form, Input, Space } from 'antd';
import { useEffect, useState } from 'react';


const InputSearch = (props) => {
    const [form] = Form.useForm();
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onReset = () => {
        form.resetFields();
    };

    const onFinish = (values) => {
        const userName = values.userName
        const phoneNumber = values.phoneNumber
        const email = values.email
        let query = "";
        //build query
        if (userName) {
            query += `&fullName=/${userName}/i`
        }

        if (phoneNumber) {
            query += `&phone=/${phoneNumber}/i`
        }

        if (email) {
            query += `&email=/${email}/i`
        }

        if (query) {
            props.handleSearch(query)
        } else {
            props.handleSearch('')
        }

    };

    return (
        <>
            <Form
                name="basic"
                labelCol={{
                    span: 24,
                }}
                wrapperCol={{
                    span: 23,
                }}
                style={{
                    maxWidth: 2000,
                    // display: 'flex',
                    // justifyContent: 'space-evenly',
                    // marginLeft: 130
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}

            >
                <div className='input' style={{ display: "flex" }}>
                    <Form.Item
                        label="User Name"
                        name="userName"
                        style={{
                            width: 600
                        }}
                        rules={[
                            {
                                message: 'Input something!',
                            },
                        ]}

                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
                        style={{
                            width: 600
                        }}
                        rules={[
                            {
                                message: 'Input something!',
                            },
                        ]}

                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        style={{
                            width: 600
                        }}
                        rules={[
                            {
                                message: 'Input something!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </div>

                <Form.Item
                    wrapperCol={{
                        offset: 16,
                    }}
                    labelCol={{
                        span: 8,
                    }}


                >
                    <Button htmlType="submit" type='primary'
                        style={{ marginRight: 10 }}
                    >
                        Search
                    </Button>
                    <Button htmlType="submit" onClick={onReset}>
                        Clear
                    </Button>
                </Form.Item>
            </Form>

        </>
    )
}

export default InputSearch;