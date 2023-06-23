import { Table } from 'antd';
import './OrderHistory.scss'
import Column from 'antd/es/table/Column';
import { useSelector } from 'react-redux';
import { callGetOrderHistory } from '../../services/api';
import { useEffect, useState } from 'react';
import moment from 'moment/moment'
import ReactJson from 'react-json-view'


const OrderHistory = () => {
    const [historyDetail, setHistoryDetail] = useState()


    useEffect(() => {
        const getOrderHistory = async () => {
            const res = await callGetOrderHistory()
            if (res && res.data) {
                setHistoryDetail(res.data)
            }
        }
        getOrderHistory()
    }, [])

    const dataSource = [
        historyDetail?.map(item => {
            return (
                {
                    // key: 1,
                    numerical: 1,
                    time: moment(item.updatedAt).format('MMMM Do YYYY, h:mm:ss a'),
                    total: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice),
                    status: 'done',
                }
            )
        })
    ];

    const detailData =
        historyDetail?.map(item => {
            return { label: item.detail }
        })

    console.log(detailData)



    return (
        <div className="order-history">
            <div className='order-history-header' style={{ marginBottom: 20, fontSize: 18 }}>Order History:</div>
            <Table
                dataSource={dataSource[0]}
                pagination={false}
            >
                <Column width={30} align='center' title="Numerical" dataIndex="numerical" key="numerical" render={(text, record, index) => index + 1} />
                <Column title="Time" dataIndex="time" key="time" />
                <Column title="Total" dataIndex="total" key="total" />
                <Column title="Status" dataIndex="status" key="status" />
                <Column
                    title="Details"
                    dataIndex="details"
                    key="details"
                    render={(text, record, index) => <ReactJson src={detailData[index]} />
                    }

                >


                </Column>


            </Table>
        </div>
    )
}

export default OrderHistory