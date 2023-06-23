import { Descriptions, Drawer, Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';



const BookDetail = (props) => {
    const { bookDetails, setbookDetails, open, setOpen } = props

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    //close view detail user
    const onClose = () => {
        setOpen(false);
        setbookDetails('')
    };
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const [fileList, setFileList] = useState([]);

    // const fileList = [
    //     {
    //         uid: uuidv4(),
    //         name: bookDetails.thumbnail,
    //         status: 'done',
    //         url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${bookDetails.thumbnail}`,
    //     },
    // ]

    // if (bookDetails && bookDetails.slider && bookDetails.slider.length > 0) {
    //     bookDetails.slider.map(item => {
    //         fileList.push({
    //             uid: uuidv4(),
    //             name: item,
    //             status: 'done',
    //             url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
    //         })
    //     })
    // }



    useEffect(() => {
        let imgThumbNail = {};
        let imgSlider = []

        if (bookDetails && bookDetails.thumbnail) {
            imgThumbNail = {
                uid: uuidv4(),
                name: bookDetails.thumbnail,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${bookDetails.thumbnail}`,
            }
        }

        if (bookDetails && bookDetails.slider && bookDetails.slider.length > 0) {
            bookDetails.slider.map(item => {
                imgSlider.push({
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                })
            })
        }
        setFileList([imgThumbNail, ...imgSlider])
    }, [bookDetails])



    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);


    return (
        <>
            <Drawer title="Book details" placement="right" onClose={onClose} open={open} width={1000}>
                <Descriptions bordered style={{ marginBottom: 30 }}>
                    <Descriptions.Item label="Book Name" span={3}>{bookDetails.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Author" span={3}>{bookDetails.author}</Descriptions.Item>
                    <Descriptions.Item label="Category" span={3}>{bookDetails.category}</Descriptions.Item>
                    <Descriptions.Item label="Price" span={3}>{bookDetails.price} VNĐ</Descriptions.Item>
                    <Descriptions.Item label="Quantity" span={1}>{bookDetails.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Sold" span={2}>{bookDetails.sold}</Descriptions.Item>
                    <Descriptions.Item label="Created At" span={1}>{bookDetails.createdAt}</Descriptions.Item>
                    <Descriptions.Item label="Updated At" span={1}>{bookDetails.updatedAt}</Descriptions.Item>
                </Descriptions>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                ></Upload>
                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <img alt="example" style={{ width: "100%" }} src={previewImage} />
                </Modal>
            </Drawer>
        </>
    )
}

export default BookDetail;