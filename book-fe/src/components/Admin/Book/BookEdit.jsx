import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select, Upload, message, notification } from "antd";
import { useEffect, useState } from "react";
import { callGetBookCategory, callUpdateBook, callUploadImage } from "../../../services/api";
import { v4 as uuidv4 } from 'uuid';



const BookEdit = (props) => {

    const { openEditUser, setOpenEditUser, dataEdit, setDataEdit, getAllBookPaginate } = props
    const [confirmLoadingEdit, setConfirmLoadingEdit] = useState(false);
    const [form] = Form.useForm();
    const [dataCategory, setDataCategory] = useState([])
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [dataThumbnail, setDataThumbnail] = useState()
    const [dataSlider, setDataSlider] = useState([])
    const [init, setInit] = useState()
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [imageUrl, setImageUrl] = useState();





    const onEditUser = async (values) => {
        console.log('hehe')
        console.log(values)
        // const res = await callEditUser(userId, values.fullName, values.phoneNumber)
        // if (res && res.data) {
        //     getAllBookPaginate()
        //     setConfirmLoadingEdit(true);
        //     setTimeout(() => {
        //         setOpenEditUser(false);
        //         setConfirmLoadingEdit(false);
        //         form.resetFields()
        //     }, 500)
        // } else {
        //     notification.error({
        //         description: 'Error',
        //         message: res.message
        //     })
        // }
        // message.success('Edited a user')
    };


    useEffect(() => {
        const getDataCategory = async () => {
            const res = await callGetBookCategory()
            if (res && res.data && res.data.length > 0) {
                const dataBuildCategory = res.data.map(item => {
                    return { label: item, value: item }
                })
                setDataCategory(dataBuildCategory)
            }
        }
        getDataCategory()
    }, [])
    useEffect(() => {
        if (dataEdit) {
            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: dataEdit.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataEdit.thumbnail}`,
                }
            ]

            const arrSlider = dataEdit.slider.map(item => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                }
            })
            const priceFM = parseFloat(dataEdit.price)
            console.log(priceFM)
            const init = {
                _id: dataEdit._id,
                mainText: dataEdit.mainText,
                author: dataEdit.author,
                price: dataEdit.price,
                category: dataEdit.category,
                quantity: dataEdit.quantity,
                sold: dataEdit.sold,
                thumbnail: { fileList: arrThumbnail },
                slider: { fileList: arrSlider }
            }
            setInit(init)
            setDataSlider(arrSlider)
            setDataThumbnail(arrThumbnail)
            form.setFieldsValue(init)
        }
        return () => {
            form.resetFields()
        }
    }, [dataEdit])


    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };



    const handlePreview = async (file) => {
        if (file.url && !file.originFileObj) {
            setPreviewImage(file.url)
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return
        }
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));

        })
    };

    const handleChangeImage = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true)
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const handleUploadThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadImage(file);
        if (res && res.data) {
            setDataThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError("An error occured")
        }
    };

    const handleUploadSlider = async ({ file, onSuccess, onError }) => {
        const res = await callUploadImage(file);
        if (res && res.data) {
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError("An error occured")
        }
    };

    const handleCancelEdit = () => {
        setOpenEditUser(false);
        setDataEdit()
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = async (values) => {

        if (values.sold > values.quantity) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: "Sold quantity can not higher than quantity!!",
                duration: 2
            })
            return;
        }
        if (values.price < 1000) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: "Price must be higher than 1.000 VNĐ!!",
                duration: 2
            })
            return;
        }
        const thumbnail = dataThumbnail[0].name
        const slider = dataSlider.map(item => item.name)
        // thumbnail,slider,mainText,author,price,sold,quantity,category
        const res = await callUpdateBook(init._id, thumbnail, slider, values.mainText, values.author, values.price, values.sold, values.quantity, values.category)
        if (res && res.statusCode === 200) {
            message.success("Updated a book")
            form.resetFields()
            setOpenEditUser(false)
            setDataSlider([])
            setDataThumbnail([])
            getAllBookPaginate()

        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message,
                duration: 2
            })
        }
    }

    //handle close button (modal add user)
    const handleReset = () => {
        setOpenEditUser(false)
        setDataEdit()
    };

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter(x => x.uid !== file.uid);
            setDataSlider(newSlider)
        }
    }


    return (
        <>
            <Modal
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }}
                title="Add a user"
                open={openEditUser}
                confirmLoading={confirmLoadingEdit}
                onCancel={handleCancelEdit}
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
                        maxWidth: 700,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item>
                        <Form.Item
                            style={{
                                display: 'inline-block',
                                width: 'calc(50% - 8px)',
                            }}

                            labelCol={{
                                span: 24,
                            }}
                            label="Book Name"
                            name="mainText"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input book name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            style={{
                                display: 'inline-block',
                                width: 'calc(50% - 8px)',
                                marginLeft: 10
                            }}
                            labelCol={{
                                span: 24,
                            }}
                            label="Author"
                            name="author"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input author name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form.Item>


                    <Form.Item>

                        <Form.Item
                            style={{
                                display: 'inline-block',
                                width: 'calc(33% - 8px)',
                            }}

                            labelCol={{
                                span: 24,
                            }}
                            label="Price"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input price!',
                                },
                            ]}
                        >
                            <InputNumber
                                min={1}
                                addonAfter="VND"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            />

                        </Form.Item>


                        <Form.Item
                            style={{
                                display: 'inline-block',
                                width: 'calc(16.8% - 8px)',
                                marginLeft: 8
                            }}
                            labelCol={{
                                span: 24,
                            }}
                            label="Quantity"
                            name="quantity"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input quantity!',
                                },
                            ]}
                        >
                            <InputNumber
                                min={1}
                                max={10000}
                            />
                        </Form.Item>

                        <Form.Item
                            style={{
                                display: 'inline-block',
                                width: 'calc(16.8% - 8px)',
                                marginLeft: 8
                            }}
                            labelCol={{
                                span: 24,
                            }}
                            label="Sold"
                            name="sold"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input quantity!',
                                },
                            ]}

                        >
                            <InputNumber
                                min={1}
                                max={10000} />
                        </Form.Item>

                        <Form.Item
                            style={{
                                display: 'inline-block',
                                width: 'calc(16.8% - 8px)',
                                marginLeft: 8
                            }}
                            labelCol={{
                                span: 24,
                            }}
                            label="Category"
                            name="category"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose a category!',
                                },
                            ]}
                        >
                            <Select
                                // defaultValue="lucy"
                                style={{
                                    width: '188px',
                                }}
                                // onChange={handleChange}
                                options={dataCategory}
                            />
                        </Form.Item>
                    </Form.Item>

                    <Form.Item
                        labelCol={{
                            span: 24,
                        }}
                        label="Thumbnail"
                        name="thumbnail"
                        rules={[
                            {
                                required: true,
                                message: 'Please select thumbnail for book!',
                            },
                        ]}
                    >
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            beforeUpload={beforeUpload}
                            onChange={handleChangeImage}
                            customRequest={handleUploadThumbnail}
                            maxCount={1}
                            onPreview={handlePreview}
                            onRemove={(file) => handleRemoveFile(file, 'thumbnail')}
                            defaultFileList={init?.thumbnail?.fileList ?? []}

                        >
                            <div>
                                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        labelCol={{
                            span: 24,
                        }}
                        label="Slider"
                        name="slider"
                        rules={[
                            {
                                required: true,
                                message: 'Please select slider for book!',
                            },
                        ]}
                    >
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            beforeUpload={beforeUpload}
                            onChange={(info) => handleChangeImage(info, 'slider')}
                            customRequest={handleUploadSlider}
                            onRemove={(file) => handleRemoveFile(file, 'slider')}
                            defaultFileList={init?.slider?.fileList ?? []}
                            onPreview={handlePreview}


                        >
                            <div>
                                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>

                    </Form.Item>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                        <img
                            alt="example"
                            style={{
                                width: '100%',
                            }}
                            src={previewImage}
                        />
                    </Modal>


                    <Form.Item
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
        </>
    )
}

export default BookEdit