import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select, Upload, message, notification } from "antd"
import { useEffect, useState } from "react";
import { callCreateBook, callGetBookCategory, callUploadImage } from "../../../services/api";

const BookAdd = (props) => {
    const { openModal, setOpenModal, confirmLoading, setConfirmLoading, getAllBookPaginate } = props
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [dataThumbnail, setDataThumbnail] = useState()
    const [dataSlider, setDataSlider] = useState([])
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const [dataCategory, setDataCategory] = useState([])



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




    //handle close button (modal add user)
    const handleCancleAdd = () => {
        setOpenModal(false)
        form.resetFields()
        setDataSlider([])
        setDataThumbnail()

    };
    //handle add button (modal add user)
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
        const res = await callCreateBook(values.mainText, values.author, values.price, values.sold, values.quantity, values.category, thumbnail, slider)
        if (res && res.data) {
            setConfirmLoading(true);
            setTimeout(() => {
                message.success('Created a book ')
                setOpenModal(false)
                setConfirmLoading(false);
                form.resetFields()
                setDataSlider([])
                setDataThumbnail()
                getAllBookPaginate()
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
    //handle close button (modal add user)
    const handleReset = () => {
        form.resetFields();
        setDataSlider([])
        setDataThumbnail()
    };

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const getBase64Preview = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64Preview(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    //control size and type of image
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
        console.log(file)
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
                            onChange={handleChange}
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
    )
}

export default BookAdd