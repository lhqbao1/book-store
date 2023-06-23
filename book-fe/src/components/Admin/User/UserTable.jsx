import { callCreateUser, callDeleteuser, callEditUser, callGetUserWithPaginate } from '../../../services/api';
import { useEffect, useState } from 'react';
import InputSearch from './InputSearch';
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
import './UserTable.scss'
import { Button, Drawer, Modal, Form, Input, Tag, message, Upload, Table, notification, Popconfirm } from 'antd';
import UserImport from './UserImport';
import * as XLSX from 'xlsx'



const UserTable = () => {
    const [listUser, setListUser] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    let [sortQuery, setsortQuery] = useState('')
    let [detailQuery, setDetailQuery] = useState('')
    let [asc, setAsc] = useState(false)

    const [open, setOpen] = useState(false);
    const [userDetails, setuserDetails] = useState([])
    const [sorter, setSorter] = useState('')

    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();

    const [openModalImport, setOpenModalImport] = useState(false);

    const [openEditUser, setOpenEditUser] = useState(false);
    const [confirmLoadingEdit, setConfirmLoadingEdit] = useState(false);

    const [userId, setUserId] = useState()


    //title of columns
    const columns = [
        // {
        //     title: 'Id',
        //     dataIndex: '_id',
        // },
        {
            title: 'Email',
            render: (text, record) => <button className='drawer-button' onClick={() => showDetail(text, record)}>{text}</button>,
            dataIndex: 'email',
            sorter: true
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            sorter: true

        },

        {
            title: 'Phone number',
            dataIndex: 'phone',
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
                        onConfirm={() => deleteUser(record)}
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
                        onClick={() => editUser(record)}
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
    const showDetail = async (text, record) => {
        setOpen(true);
        setuserDetails(record)
    }

    //close view detail user
    const onClose = () => {
        setOpen(false);
    };

    //reload when current, pageSize, asc change
    useEffect(() => {
        getAllUserPaginate();
    }, [current, pageSize, asc])

    //get listUser for table datasource
    const getAllUserPaginate = async (searchFilter) => {
        let query = `current=${current}&pageSize=${pageSize}`;
        setDetailQuery(query)
        //filter search
        if (searchFilter) {
            query += searchFilter
        }
        //sort by asc
        if (asc === true) {
            sortQuery = `&sort=${sorter}`
            query += sortQuery
        }
        //sort by dsc
        if (asc === false && sorter) {
            sortQuery = `&sort=-${sorter}`
            query += sortQuery
        }

        setsortQuery(query)
        //call api 
        const res = await callGetUserWithPaginate(query)
        if (res && res.data) {
            setListUser(res.data.result)
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
        getAllUserPaginate(query)
    }

    // open modal add user
    const showModal = () => {
        setOpenModal(true);
    };

    //handle close button (modal add user)
    const handleReset = () => {
        form.resetFields();
    };

    //handle close button (modal add user)
    const handleCancleAdd = () => {
        setOpenModal(false)
    };

    //handle add button (modal add user)
    const onFinish = async (values) => {
        const res = await callCreateUser(values.fullName, values.password, values.email, values.phone)
        if (res && res.data) {
            setConfirmLoading(true);
            setTimeout(() => {
                message.success('Created a user ')
                setOpenModal(false)
                setConfirmLoading(false);
                form.resetFields()
            }, 500);
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 2
            })
        }

    };

    const showModalImport = () => {
        setOpenModalImport(true);
    };

    //handle close button (modal import user)
    const handleCancleImport = () => {
        setOpenModalImport(false);
    };

    const downloadFile = () => {
        const worksheet = XLSX.utils.json_to_sheet(listUser);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workbook, "DataUser.csv");

        console.log('hehe', listUser)
    }


    const editUser = async (record) => {
        setOpenEditUser(true);
        console.log('check recoed', record)
        form.setFieldsValue({
            fullName: record.fullName,
            email: record.email,
            phoneNumber: record.phone
        });
        setUserId(record._id)
    }


    const handleCancelEdit = () => {
        setOpenEditUser(false);
        form.resetFields()
    };

    const onEditUser = async (values) => {
        console.log('Success:', values);
        console.log('check id', userId)
        const res = await callEditUser(userId, values.fullName, values.phoneNumber)
        if (res && res.data) {
            getAllUserPaginate()
            setConfirmLoadingEdit(true);
            setTimeout(() => {
                setOpenEditUser(false);
                setConfirmLoadingEdit(false);
                form.resetFields()
            }, 500)
        } else {
            notification.error({
                description: 'Error',
                message: res.message
            })
        }
        message.success('Edited a user')


    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    //table header
    const tableHeader = () => {
        return (
            <div style={{ display: 'flex', gap: 15, justifyContent: 'flex-end' }}>
                <Button type='primary' onClick={downloadFile}><ImportOutlined />Export</Button>
                <Button type='primary' onClick={showModalImport}><ExportOutlined />Import</Button>
                <Button type='primary' onClick={showModal}><PlusCircleOutlined />Add</Button>
                <Modal
                    cancelButtonProps={{ style: { display: 'none' } }}
                    okButtonProps={{ style: { display: 'none' } }}
                    title="Add a user"
                    open={openModal}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancleAdd}
                    width={630}
                >
                    <Form
                        form={form}
                        name="add_user"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        style={{
                            maxWidth: 500,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Full Name"
                            name="fullName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                            style={{ marginBottom: 40, marginTop: 30 }}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                            style={{ marginBottom: 40 }}

                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                            style={{ marginBottom: 40 }}

                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Phone Number"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone number!',
                                },
                            ]}
                            style={{ marginBottom: 40 }}

                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            // wrapperCol={{
                            //     offset: 20,
                            //     span: 16,
                            // }}
                            style={{ display: 'flex', justifyContent: 'flex-end' }}

                        >

                            <Button onClick={handleReset} style={{ marginRight: 10 }}>
                                Reset
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Create
                            </Button>
                        </Form.Item>

                    </Form>
                </Modal>
                <UserImport
                    openModalImport={openModalImport}
                    handleCancleImport={handleCancleImport}
                    getAllUserPaginate={getAllUserPaginate}
                />



            </div>
        )
    }

    const text = 'Are you sure to delete this user?';
    const description = 'Delete a user';



    //delete user
    const deleteUser = async (record) => {
        const res = await callDeleteuser(record._id)
        if (res && res.data && res.data.deletedCount > 0) {
            message.success("Deleted a user")
            getAllUserPaginate()
        } else {
            message.error("Can not delete this sample account!!!    ")
        }
    }


    //table layout
    return (
        <>

            <InputSearch handleSearch={handleSearch} />
            <Table
                title={tableHeader}
                rowKey="_id"
                columns={columns}
                dataSource={listUser}
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
            <Drawer title="Basic Drawer" placement="right" onClose={onClose} open={open}>
                <p key="{fullName}"> {userDetails.fullName}</p>
                <p key="{email}"> {userDetails.email}</p>
                <p key="{phone}"> {userDetails.phone}</p>
                <p key="{role}"> {userDetails.role}</p>
                <p key="{createdAt}"> {userDetails.createdAt}</p>
                <p key="{updatedAt}"> {userDetails.updatedAt}</p>
            </Drawer>
            <Modal
                on
                title="Edit user"
                open={openEditUser}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
                // onOk={handleConfirmEdit}
                confirmLoading={confirmLoadingEdit}
                onCancel={handleCancelEdit}
            >
                <Form
                    form={form}
                    name="edit"
                    labelCol={{
                        span: 0,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    style={{
                        maxWidth: 700,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onEditUser}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        style={{ marginTop: 30, marginBottom: 30 }}
                        label="Full Name"
                        name="fullName"

                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        style={{ marginBottom: 30 }}
                        label="Email"
                        name="email"
                    >
                        <Input disabled={true}
                        />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 30 }}
                        label="Phone Number"
                        name="phoneNumber"

                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        style={{ display: 'flex', justifyContent: 'flex-end' }}

                    >
                        <Button style={{ marginRight: 15 }} type="primary" htmlType="submit">
                            Edit
                        </Button>
                        <Button onClick={handleCancelEdit}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>


        </>
    )
}

export default UserTable;