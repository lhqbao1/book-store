import { callCreateUser, callDeleteBook, callDeleteuser, callEditUser, callGetBookWithPaginate, callGetUserWithPaginate } from '../../../services/api';
import { useEffect, useState } from 'react';
import InputSearchBook from './InputSearchBook';
import BookDetail from './BookDetail';

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    ExportOutlined,
    ImportOutlined,
    MinusCircleOutlined,
    PlusCircleOutlined,
    SyncOutlined,
    InboxOutlined,
    EditOutlined
} from '@ant-design/icons';
// import './UserTable.scss'
import { Button, Drawer, Modal, Form, Input, Tag, message, Upload, Table, notification, Popconfirm, Badge, Descriptions } from 'antd';
import BookImport from './BookImport';
import * as XLSX from 'xlsx'
import BookAdd from './BookAdd';
import BookEdit from './BookEdit';




const UserTable = () => {
    const [listBook, setListBook] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    let [sortQuery, setsortQuery] = useState()
    let [detailQuery, setDetailQuery] = useState('')
    let [asc, setAsc] = useState()

    const [open, setOpen] = useState(false);
    const [bookDetails, setbookDetails] = useState([])
    const [sorter, setSorter] = useState()

    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();

    const [openModalImport, setOpenModalImport] = useState(false);

    const [openEditUser, setOpenEditUser] = useState(false);
    const [dataEdit, setDataEdit] = useState()

    //title of columns
    const columns = [
        // {
        //     title: 'Id',
        //     dataIndex: '_id',
        // },
        {
            title: 'Book Name',
            render: (text, record) => <button className='drawer-button' onClick={() => showDetail(text, record)}>{text}</button>,
            dataIndex: 'mainText',
            sorter: true
        },
        {
            title: 'Category',
            dataIndex: 'category',
            sorter: true

        },

        {
            title: 'Author',
            dataIndex: 'author',
            sorter: true
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: true
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            sorter: true
        },
        {
            title: 'Sold',
            dataIndex: 'sold',
            sorter: true
        },
        {
            title: 'Action',
            render: (record) => (
                <div className='button-column'>
                    <Popconfirm
                        placement="bottom"
                        title={text}
                        description={description}
                        onConfirm={() => deleteBook(record)}
                        okText="Yes"
                        cancelText="No"
                    >

                        <Tag
                            icon={<CloseCircleOutlined />}
                            color="error"
                            className='delete-tag'>
                            Delete
                        </Tag>
                    </Popconfirm>
                    <Tag
                        onClick={() => editBook(record, text)}
                        icon={<EditOutlined />}
                        color="warning"
                        className='edit-tag'
                        width='30px'

                    >
                        Edit
                    </Tag>
                </div>
            ),
        },
    ];





    //show detail user
    const showDetail = (text, record) => {
        setOpen(true);
        setbookDetails(record)
    }

    //reload when current, pageSize, asc change
    useEffect(() => {
        getAllBookPaginate();
    }, [current, pageSize, asc])

    //get listBook for table datasource
    const getAllBookPaginate = async (searchFilter) => {
        let query = `current=${current}&pageSize=${pageSize}`;
        setDetailQuery(query)
        //filter search
        if (searchFilter) {
            query += searchFilter
        }
        //sort by asc


        if (asc === true) {
            setsortQuery()
            sortQuery = `&sort=${sorter}`
            query += sortQuery
        }
        //sort by dsc
        if (asc === false && sorter) {
            setsortQuery()
            sortQuery = `&sort=-${sorter}`
            query += sortQuery
        }
        //call api 
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






    //onchange 
    const onChange = async (pagination, filters, sorter, extra) => {
        //when current page change
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
            setAsc(asc)
        } else {
            setAsc(!asc)
        }
        //when pagesize change
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }

        //set asc for sorter
        setSorter(sorter.field)
    };

    //fire search
    const handleSearch = (query) => {
        getAllBookPaginate(query)
    }

    // open modal add user
    const showModal = () => {
        setOpenModal(true);
    };

    const showModalImport = () => {
        setOpenModalImport(true);
    };

    //handle close button (modal import user)
    const handleCancleImport = () => {
        setOpenModalImport(false);
    };

    const downloadFile = () => {
        const worksheet = XLSX.utils.json_to_sheet(listBook);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workbook, "DataUser.csv");

    }

    //open modal edit
    const editBook = (record, text) => {
        setOpenEditUser(true);
        setDataEdit(record)
    }

    //table header
    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', gap: 15, justifyContent: 'flex-end' }}>
                <Button type='primary' onClick={downloadFile}><ImportOutlined />Book</Button>
                <Button type='primary' onClick={showModalImport}><ExportOutlined />Import</Button>
                <Button type='primary' onClick={showModal}><PlusCircleOutlined />Add</Button>
                <BookAdd
                    openModal={openModal}
                    confirmLoading={confirmLoading}
                    setOpenModal={setOpenModal}
                    setConfirmLoading={setConfirmLoading}
                    getAllBookPaginate={getAllBookPaginate}
                />
                <BookImport
                    openModalImport={openModalImport}
                    handleCancleImport={handleCancleImport}
                    getAllBookPaginate={getAllBookPaginate}
                />



            </div>
        )
    }

    const text = 'Are you sure to delete this user?';
    const description = 'Delete a user';



    //delete user
    const deleteBook = async (record) => {
        const res = await callDeleteBook(record._id)
        if (res && res.data && res.data.deletedCount > 0) {
            message.success("Deleted a book")
            getAllBookPaginate()
        } else {
            notification.error({
                title: "An error occured",
                description: res.message
            })
        }
    }


    //table layout
    return (
        <>

            <InputSearchBook handleSearch={handleSearch} />
            <Table
                title={tableHeader}
                rowKey="_id"
                columns={columns}
                dataSource={listBook}
                onChange={onChange}
                bordered={true}
                pagination={{
                    total: total,
                    current: current,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ['2', '5', '10', '20'],
                    showTotal: (total, range) => { return (<div>{range[0]} - {range[1]} on {total} results</div>) }
                }}



            />
            <BookDetail
                bookDetails={bookDetails}
                open={open}
                setOpen={setOpen}
                setbookDetails={setbookDetails}
            />

            <BookEdit
                openEditUser={openEditUser}
                setOpenEditUser={setOpenEditUser}
                dataEdit={dataEdit}
                setDataEdit={setDataEdit}
                getAllBookPaginate={getAllBookPaginate}

            />

        </>
    )
}

export default UserTable;