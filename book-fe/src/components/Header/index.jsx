import { Button, Checkbox, Col, Form, Input, Popover, Row, Upload } from 'antd';
import { GiSpellBook } from "react-icons/gi";
import { IconContext } from "react-icons";
import './header.scss'
import { CgShoppingCart } from "react-icons/cg";
import { BiSearch } from "react-icons/bi";
import { TiHome } from "react-icons/ti";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { Avatar, Badge, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { callFetchUser } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';




const Header = () => {
    const [orderQuantity, setOrderQuantity] = useState(0)
    const [cart, setCart] = useState([])
    const navigate = useNavigate()


    const user = useSelector(state => state.account.user.user)
    const userFullName = user?.fullName ?? ''
    const quantityRedux = useSelector(state => state.order.carts.length)
    const cartItem = useSelector(state => state.order.carts)
    useEffect(() => {
        setOrderQuantity(quantityRedux);
        setCart(cartItem)
    }, [quantityRedux, cartItem])

    const ToOrderPage = () => {
        navigate('order')
    }

    const content = (
        <div>
            <Row>
                {cart.map((item, index) => {
                    return (
                        <Col span={24} index={`index - ${item}`} style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`} style={{ width: 100, height: 100 }} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <b>{item.detail.mainText}</b>
                                <div>Price: {item.detail.price}</div>
                                <div>Quantity: {item.quantity}</div>

                            </div>
                        </Col>
                    )
                })}
                <Col span={14}></Col>
                <Col span={10}>
                    <button
                        style={{ backgroundColor: '#ff4259', border: 'none', color: 'white', padding: '15px 40px 15px 40px', borderRadius: 5, fontWeight: 600, marginLeft: 50 }}
                        onClick={ToOrderPage}
                    >
                        Check out</button>
                </Col>
            </Row>
        </div>
    );
    return (
        <>
            <div className='header-page'>
                <div className='header-container'>
                    <div className='header-left-content'>
                        {/* <div className='header-icon'><GiSpellBook size="50px" color="#0a68ff " /></div> */}
                        <div className='header-text'>IBook</div>
                    </div>
                    <div className='header-middle-content'>
                        <div className='header-search-icon'>
                            <BiSearch size="25px" color="grey" />
                        </div>
                        <input className='header-search' type="text" placeholder='Find your favourite book ...' />

                    </div>
                    <div className='header-right-content'>
                        <button className='header-home-button' >
                            <TiHome className='home-icon' size="20px" color="grey" />
                            <div className='home-text'>Home</div>
                        </button>

                        <button className='header-account-button'>
                            <MdOutlineSupervisorAccount className='account-icon' size="20px" color="grey" />
                            <div className='account-text'>{userFullName}</div>
                        </button>
                        <button className='header-cart-button'>
                            <Popover
                                content={content}
                                title="Your order"
                                trigger="hover"
                                placement='bottomRight'
                                overlayStyle={{
                                    width: "500px"
                                }}
                            >
                                <Badge size="small" count={quantityRedux}>
                                    <CgShoppingCart size="25px" color="#0a68ff " />
                                </Badge>
                            </Popover>

                        </button>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;

