import './ViewBookDetail.scss'
import "react-image-gallery/styles/scss/image-gallery.scss";
import ImageGallery from 'react-image-gallery';
import { Button, Col, Row, Rate, InputNumber, Skeleton, Form, message } from 'antd';
import { useState } from 'react';
import { doAddBookAction } from '../../redux/order/orderSlice';
import { useDispatch, useSelector } from 'react-redux';


const ViewBookDetail = (props) => {
    const { bookDetail } = props
    let price = bookDetail?.price ?? []
    const dispatch = useDispatch();

    // if (price) {
    //     price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookDetail.price)
    // }
    const onFinish = (values) => {
        let quantity = values.quantity
        dispatch(doAddBookAction({ quantity, detail: bookDetail, _id: bookDetail._id }))
        message.success('Added to cart')
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const images = bookDetail?.items ?? [];
    return (

        <div className="book-detail">
            <Row>
                <Col span={4}></Col>
                <Col md={8} sm={0} xs={0}>
                    <div className="image-gallery-wrapper">
                        {bookDetail && bookDetail._id ?
                            <ImageGallery
                                renderLeftNav={() => <></>}
                                renderRightNav={() => <></>}
                                showFullscreenButton={false}
                                items={images}
                                showPlayButton={false}
                            />
                            :
                            <>
                                <Skeleton.Input
                                    style={{ width: '635px', height: '400px', marginBottom: 20 }}
                                    active={true}
                                />
                                <div style={{ display: 'flex', gap: 20, marginLeft: 150 }}>
                                    <Skeleton.Image active={true} />
                                    <Skeleton.Image active={true} />
                                    <Skeleton.Image active={true} />
                                </div>
                            </>
                        }



                    </div>
                </Col>
                <Col span={8}>
                    <div className='detail-book'>
                        {bookDetail && bookDetail._id ?
                            <>
                                <div style={{ fontSize: 15 }}>Author: <a>{bookDetail.author}</a></div>
                                <div style={{ fontSize: 25 }}>{bookDetail.mainText}</div>
                                <div style={{ display: 'flex', justifyContent: 'row', alignItems: 'center', marginBottom: 30 }}>
                                    <Rate style={{ fontSize: 16 }} disabled defaultValue={5} />
                                    <div style={{ fontSize: 17, color: 'gray', marginTop: 4.45, marginLeft: 15 }}>Sold {bookDetail.sold}</div>
                                </div>
                                <div
                                    style={{ marginBottom: 30, backgroundColor: '#f5f5fa', display: 'inline-block', padding: '20px 200px 20px 20px', fontSize: 25, color: '#ff424e', fontWeight: 600 }}
                                >
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookDetail.price)}
                                </div>


                                <div style={{ fontSize: 15, marginBottom: 20 }}>Delivery:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Free delivery </div>
                                <Form
                                    name="basic"
                                    labelCol={{
                                        span: 0,
                                    }}
                                    wrapperCol={{
                                        span: 16,
                                    }}
                                    style={{
                                        maxWidth: 600,
                                    }}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    initialValues={{
                                        remember: true,
                                        quantity: 1
                                    }}
                                >
                                    <Form.Item
                                        label="Quantity"
                                        name="quantity"
                                    >
                                        <InputNumber
                                            min={1}
                                            max={100}
                                            style={{ marginLeft: 30 }} />
                                    </Form.Item>
                                    <Form.Item
                                        wrapperCol={{
                                            offset: 0,
                                            span: 16,
                                        }}
                                    >
                                        <Button
                                            htmlType="submit"
                                            style={{
                                                background: '#ff424e',
                                                fontSize: 15,
                                                fontWeight: 600,
                                                border: 'none',
                                                color: 'white',
                                                width: 200,
                                                height: 50

                                            }}
                                        >
                                            Choose to buy
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </>

                            :
                            <>
                                <Skeleton active={true} />
                                <Skeleton active={true} />
                                <Skeleton.Button active size='large' style={{ width: 200, height: 45 }} />
                            </>
                        }




                    </div>

                </Col>
            </Row>
        </div>


    )
}

export default ViewBookDetail