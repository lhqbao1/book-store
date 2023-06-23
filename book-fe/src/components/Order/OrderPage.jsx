import { Col, Empty, Form, InputNumber, Row, Steps, Button, Checkbox, Input, Result, Radio, message, notification } from 'antd'
import './OrderPage.scss'
import { DeleteOutlined, SmileOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { doAddBookAction, doDeleteCartAction, doUpdateQuantityAction, doResetCart } from '../../redux/order/orderSlice'
import { callCreateOrder } from '../../services/api'
import moment from 'moment/moment'
import { useNavigate } from 'react-router-dom'

const OrderPage = () => {
    const dispatch = useDispatch()
    const [total, setTotal] = useState()
    const [currentStep, setCurrentStep] = useState(1)
    const [openCart, setOpenCart] = useState(false)
    const [openFinish, setOpenFinish] = useState(false)
    const orderProduct = useSelector(state => state.order.carts)
    const [form] = Form.useForm();
    const [disabledButton, setDisabledButton] = useState(false)
    const [dateTime, setDateTime] = useState()
    const navigate = useNavigate()



    useEffect(() => {
        if (orderProduct && orderProduct.length > 0) {
            let orderTotal = 0
            let updatedDate = ''
            orderProduct.map(item => {
                orderTotal += item.quantity * item.detail.price
                updatedDate = moment(item.detail.updatedAt).format('MMMM Do YYYY, h:mm:ss a');
            })
            setTotal(orderTotal)
            setDateTime(updatedDate)
        } else {
            setTotal(0)
        }
        if (orderProduct.length < 1) {
            setDisabledButton(true)
        }
    }, [orderProduct])




    const onChangeQuantity = (value, item) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateQuantityAction({ quantity: value, detail: item, _id: item._id }))
        }
    }

    const DeleteCartItem = (item) => {
        dispatch(doDeleteCartAction({ _id: item._id }))
    }

    const handleClickCheckOut = () => {
        setCurrentStep(2)
        setOpenCart(true)
    }

    const onCreateOrder = async (values) => {

        if (values.phoneNumber.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
            setOpenFinish(true)
            let detailOrder = []
            orderProduct.map(item => {
                detailOrder.push({
                    bookName: item.detail.mainText,
                    quantity: item.quantity,
                    _id: item._id,
                })
            })
            const data = {
                name: values.name,
                address: values.address,
                phone: values.phoneNumber,
                totalPrice: values.totalPrice,
                detail: detailOrder
            }

            const res = await callCreateOrder(data)
            if (res && res.data) {
                message.success("Order succeed")
                dispatch(doResetCart())
            } else {
                notification.error({
                    message: "An error occured",
                    description: res.message
                })
            }
        } else {
            notification.error({
                message: 'An error occured',
                description: 'Phone number is not valid in Viet Nam',
                duration: 2
            })
        }

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleViewHistory = () => {
        navigate('/history')
    }



    return (
        <div className="order-page">
            <Row>
                <Col span={4}></Col>
                <Col span={16} style={{ marginTop: 30, backgroundColor: 'white', padding: '20px 10px 20px 10px', borderRadius: 8 }}>
                    <Steps
                        size="small"
                        current={currentStep}
                        items={[
                            {
                                title: 'Order',
                            },
                            {
                                title: 'Check out',
                            },
                            {
                                title: 'Payment',
                            },
                        ]}
                    />
                </Col>
                <Col span={4}></Col>
            </Row>
            <Row>
                <Col span={4}></Col>
                {openFinish === false ?
                    <>
                        <Col span={12} className='order-page-product'>
                            {orderProduct && orderProduct.length > 0 ?
                                <Row>
                                    {orderProduct.map((item, index) => {
                                        return (
                                            <Col span={24} style={{ display: 'flex', alignItems: 'center', gap: 20, backgroundColor: 'white', marginBottom: 20, paddingTop: 15, paddingBottom: 15 }}>
                                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`} style={{ width: 80, height: 80 }} />
                                                <div style={{ marginRight: 40, width: 250 }}>{item.detail.mainText}</div>
                                                <div style={{ width: 100 }}>Price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail.price)}</div>
                                                <Form
                                                    initialValues={{
                                                        quantity: item.quantity,
                                                    }}
                                                    style={{ marginTop: 25 }}
                                                >
                                                    <Form.Item
                                                        name="quantity">
                                                        <InputNumber min={1} max={100} style={{ marginRight: 100 }} onChange={(value) => onChangeQuantity(value, item)} value={item.detail.quantity} />

                                                    </Form.Item>
                                                </Form>
                                                <div style={{ marginRight: 50 }}>Total: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.quantity * item?.detail?.price)} </div>
                                                <div><DeleteOutlined onClick={() => DeleteCartItem(item)} /></div>
                                            </Col>
                                        )
                                    })}
                                </Row>

                                :
                                <Row >
                                    <Col span={24} style={{ backgroundColor: 'white', height: 600 }}>
                                        <Empty
                                            style={{ marginTop: 50 }}
                                            description={
                                                <span style={{ fontSize: 20, color: 'gray' }}>
                                                    Cart is empty
                                                </span>
                                            }
                                        />
                                    </Col>
                                </Row>
                            }

                        </Col>


                        <Col span={4} className='order-page-price'>
                            <Row>
                                {openCart === false ?
                                    <>
                                        <Col span={24} style={{ display: 'flex', marginBottom: 25, fontSize: 16, justifyContent: 'space-between' }}>
                                            <div>Temporary price</div>
                                            <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</div>
                                        </Col>
                                        <Col span={24} style={{ marginBottom: 25 }}><hr></hr></Col>
                                        <Col span={24} style={{ display: 'flex', marginBottom: 25, justifyContent: 'space-between' }}>
                                            <div style={{ fontSize: 16 }}>Total</div>
                                            <div style={{ fontSize: 20, color: '#ff424e' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</div>
                                        </Col>
                                        <Col span={24} ><hr></hr></Col>

                                        <Col span={24} style={{ textAlign: 'center', marginTop: 30 }}>
                                            <Button
                                                style={{ backgroundColor: '#ff424e', color: 'white', width: 275, fontSize: 16, paddingBottom: 33 }}
                                                onClick={handleClickCheckOut}
                                                disabled={disabledButton}
                                            >
                                                Check out ({orderProduct.length})
                                            </Button>
                                        </Col>
                                    </>

                                    :
                                    <>
                                        <Col span={24}>
                                            <Form
                                                form={form}
                                                name="basic"
                                                labelCol={{
                                                    span: 24,
                                                }}
                                                wrapperCol={{
                                                    span: 24,
                                                }}
                                                style={{
                                                    maxWidth: 600,
                                                }}
                                                initialValues={{
                                                    remember: true,
                                                    totalPrice: 10000,
                                                    payment: 'Free Delivery'
                                                }}
                                                onFinish={onCreateOrder}
                                                onFinishFailed={onFinishFailed}
                                                autoComplete="off"
                                            >
                                                <Form.Item
                                                    label="Name"
                                                    name="name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please input your username!',
                                                        },
                                                    ]}
                                                >
                                                    <Input

                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Phone Number"
                                                    name="phoneNumber"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please input your phone number!',
                                                        },
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Address"
                                                    name="address"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please input your address!',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        style={{ height: 120, textAlign: 'left', paddingBottom: 90 }}

                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Payment method"
                                                    name="payment"

                                                >
                                                    <Radio defaultChecked value={1}>Free Delivery</Radio>

                                                </Form.Item>
                                                <Form.Item
                                                    name="totalPrice"
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ fontSize: 16, marginTop: 2 }}>Total:</div>
                                                        <div style={{ fontSize: 20, color: "#ff424e" }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</div>
                                                    </div>
                                                    <hr></hr>

                                                </Form.Item>
                                                <Form.Item>
                                                    <Button
                                                        htmlType="submit"
                                                        style={{ backgroundColor: '#ff424e', color: 'white', width: 275, fontSize: 16, paddingBottom: 33 }}
                                                    >
                                                        Buy now ({orderProduct.length})
                                                    </Button>
                                                </Form.Item>



                                            </Form>
                                        </Col>


                                    </>
                                }

                            </Row>



                        </Col>
                    </>

                    :
                    <Col span={24}>
                        <Result
                            icon={<SmileOutlined />}
                            title="Success, your order is ready for delivery. Thank you!!"
                            extra={<Button type="primary" onClick={handleViewHistory}>View history</Button>}
                        />
                    </Col>
                }

                <Col span={4}></Col>

            </Row >
        </div >
    )
}

export default OrderPage