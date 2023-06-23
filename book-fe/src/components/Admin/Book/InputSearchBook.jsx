import { Button, Checkbox, Form, Input, Space } from 'antd';
import { useEffect, useState } from 'react';


const InputSearchBook = (props) => {
    const [form] = Form.useForm();
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onReset = () => {
        form.resetFields();
    };

    const onFinishBook = (values) => {
        console.log(values)
        const mainText = values.mainText
        const author = values.author
        const category = values.category
        let query = "";
        //build query
        if (mainText) {
            query += `&mainText=/${mainText}/i`
        }

        if (author) {
            query += `&author=/${author}/i`
        }

        if (category) {
            query += `&category=/${category}/i`
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
                onFinish={onFinishBook}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}

            >
                <div className='input' style={{ display: "flex" }}>
                    <Form.Item
                        label="Book Name"
                        name="mainText"
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
                        label="Author"
                        name="author"
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
                        label="Category"
                        name="category"
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

export default InputSearchBook;