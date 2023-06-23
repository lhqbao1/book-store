import { Button, Col, Form, Row, notification } from 'antd';
import './home.scss'
import { Checkbox, Tabs, Pagination } from 'antd';
import { InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import { Rate } from 'antd';
import { callGetBookCategory, callGetBookWithPaginate } from '../../services/api';
import { useNavigate } from 'react-router-dom';



const HomePage = () => {
    const navigate = useNavigate()
    const [startPrice, setStartPrice] = useState()
    const [endPrice, setEndPrice] = useState()
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(20)
    const [bookCategory, setBookCategory] = useState([])
    const [sortQuery, setSortQuery] = useState(null)
    const [listBook, setListBook] = useState([])
    const [filterCategory, setFilterCategory] = useState(null)
    const [form] = Form.useForm();
    const [filterPrice, setFilterPrice] = useState(null)


    useEffect(() => {
        const getBookCategoryData = async () => {
            const res = await callGetBookCategory()
            setBookCategory(res.data)
        }
        getBookCategoryData()
    }, [])

    useEffect(() => {
        const getAllBookPaginate = async () => {
            let query = `current=${current}&pageSize=${pageSize}`;
            console.log(filterCategory, filterPrice, sortQuery)
            if (filterCategory !== null) {
                query += filterCategory
            }
            if (filterPrice !== null) {
                query += filterPrice
            }
            if (sortQuery !== null) {
                query += sortQuery
            }
            //filter search
            const res = await callGetBookWithPaginate(query)
            if (res && res.data) {
                let result = res.data.result
                result.map((item) => {
                    item.price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)
                    return item
                })
                setListBook(result)
                setTotal(res.data.meta.total)
            }
        }
        getAllBookPaginate()
    }, [current, pageSize, total, sortQuery, filterCategory, filterPrice])


    const onChangeTags = (key) => {
        setSortQuery(key)
    };
    const items = [
        {
            key: '&sort=-sold',
            label: `Popular products`,
        },
        {
            key: '&sort=-updatedAt',
            label: `New products`,
        },
        {
            key: '&sort=price',
            label: `From low to high`,
        },
        {
            key: '&sort=-price',
            label: `From high to low`,
        },
    ];

    const onChangeCategory = (checkedValues) => {
        if (checkedValues && checkedValues.length > 0) {
            setFilterCategory(`&category=${checkedValues}`)
        } else {
            setFilterCategory('')
        }
    };

    const onChangePriceStart = (value) => {
        setStartPrice(value)
    };
    const onChangePriceEnd = (value) => {
        setEndPrice(value)
    };



    const onChangePagination = (page, pageSize) => {
        setCurrent(page)
        setPageSize(pageSize)
    }

    const customIcons = {
        1: <FrownOutlined />,
        2: <FrownOutlined />,
        3: <MehOutlined />,
        5: <SmileOutlined />,
        5: <SmileOutlined />,
    };

    const onApplyFilerPrice = (values) => {
        if (values?.startPrice > values?.endPrice) {
            notification.error({
                message: 'An error occured',
                description: 'Start price must be lower than end price',
                duration: 2
            })
            return
        }
        if (values?.startPrice > 0 && values?.endPrice > 0) {
            let queryString = `&price>=${values?.startPrice}&price<=${values?.endPrice}`;
            setFilterPrice(queryString)
        }
        // form.resetFields()
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleResetPrice = () => {
        form.resetFields()
        setFilterPrice('')
    }

    const handleRedirectBook = (book) => {
        const slug = convertSlug(book.mainText);
        navigate(`/book/${slug}?id=${book._id}`)
    }

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }



    return (
        <>
            <div className="home">
                <div className='home-freeship'>
                    <img className='home-freeship-image' src="https://salt.tikicdn.com/ts/upload/5e/ec/fb/150f3c633781ed1da9921e45db90c62d.png" alt="" />
                    mỗi ngày, tự động áp dụng không cần săn mã
                </div>
                <Row>
                    <Col span={4}>
                        <div className='side-bar'>
                            <div className='side-bar-filter'>
                                <div className='side-bar-filter-category'>
                                    <div className='filter-category-header'>Product category</div>
                                    <br></br>
                                    <div className='category'>
                                        <Checkbox.Group
                                            style={{
                                                width: '100%',
                                            }}
                                            onChange={onChangeCategory}
                                        >
                                            <Row>
                                                {bookCategory.map((item, index) => {
                                                    return (
                                                        <Col span={24}>
                                                            <Checkbox style={{ marginBottom: 10 }} value={item} key={`index - ${item} `}>{item}</Checkbox>
                                                        </Col>
                                                    )
                                                })}
                                            </Row>
                                        </Checkbox.Group>
                                    </div>
                                </div>
                                <hr></hr>

                                <div className='side-bar-filter-price'>
                                    <b>Price range</b>
                                    <Form

                                        name="basic"
                                        labelCol={{
                                            span: 16,
                                        }}
                                        wrapperCol={{
                                            span: 24,
                                        }}
                                        style={{
                                            maxWidth: 300,
                                            marginTop: 20
                                        }}
                                        initialValues={{
                                            remember: true,
                                        }}
                                        form={form}
                                        onFinish={onApplyFilerPrice}
                                        onFinishFailed={onFinishFailed}
                                        autoComplete="off"
                                    >
                                        <Form.Item
                                            style={{
                                                display: 'inline-block',
                                                width: 'calc(40% - 8px)',
                                                marginRight: 20,
                                                marginLeft: 10
                                            }}
                                            name="startPrice"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input start price!',
                                                },
                                            ]}
                                        >
                                            <InputNumber min={1}
                                                onChange={onChangePriceStart}
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            />
                                        </Form.Item>
                                        -
                                        <Form.Item
                                            style={{
                                                display: 'inline-block',
                                                width: 'calc(40% - 8px)',
                                                marginLeft: 15
                                            }}
                                            name="endPrice"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input end price!',
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                min={1}
                                                onChange={onChangePriceEnd}
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            wrapperCol={{
                                                offset: 1,
                                                span: 24,
                                            }}
                                        >
                                            <Button type="primary" htmlType="submit">
                                                Apply
                                            </Button>
                                            <Button
                                                style={{ marginLeft: 10 }}
                                                onClick={handleResetPrice}
                                            >
                                                Reset
                                            </Button>
                                        </Form.Item>
                                    </Form>

                                </div>
                                <br></br>
                                <hr></hr>
                                <div className='side-bar-filter-rating'>
                                    <b>Rating</b>
                                    <br></br>
                                    <br></br>

                                    <Rate disabled defaultValue={5} />  <div style={{ display: 'inline-block', cursor: 'pointer' }}>from 5 stars</div>
                                    <br></br>
                                    <Rate disabled defaultValue={4} />  <div style={{ display: 'inline-block', cursor: 'pointer' }}>from 4 stars</div>
                                    <br></br>
                                    <Rate disabled defaultValue={3} />  <div style={{ display: 'inline-block', cursor: 'pointer' }}>from 3 stars</div>
                                </div>
                                <div className='side-bar-filter-author'>
                                </div>
                            </div>


                        </div>
                    </Col>
                    <Col span={20}>
                        <div className='product-page'>
                            <Tabs defaultActiveKey="1" items={items} onChange={onChangeTags} />
                            <Row className='product-content'>
                                {listBook.map((item, index) => {
                                    return (
                                        <Col className='product'
                                            span={5}
                                            key={`item-${index}`}
                                            onClick={() => handleRedirectBook(item)}
                                        >
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} />
                                            <div className='product-name' style={{ height: 40, marginTop: 15 }}>{item.mainText}</div>
                                            <div className='product-price'>{item.price}</div>
                                            <br></br>

                                            <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                                                <Rate style={{ fontSize: 15 }} disabled defaultValue={5}></Rate>
                                                <div className='prodcut-sold'>Sold: {item.sold}</div>
                                            </div>
                                        </Col>
                                    )
                                })}

                            </Row>

                        </div>

                    </Col>
                    <Col span={24}>
                        <div className='pagination'>
                            <Pagination
                                className='pagination-content'
                                current={current}
                                total={total}
                                onChange={onChangePagination}
                                pageSize={pageSize}
                                // defaultCurrent={5}
                                style={{
                                    textAlign: 'center',
                                    fontSize: 20,
                                }}
                            />
                        </div>
                    </Col>
                </Row>

            </div>
        </>
    )
}

export default HomePage;