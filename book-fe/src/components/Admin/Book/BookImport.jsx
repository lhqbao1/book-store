import { InboxOutlined } from '@ant-design/icons';
import { message, Modal, notification, Table, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { json } from 'react-router-dom';
const { Dragger } = Upload;
import * as XLSX from 'xlsx'
import { callCreateBulkUser } from '../../../services/api';
import sampleFile from '../User/bao.xlsx?url';

const BookImport = (props, handleCancleImport, getAllUserPaginate) => {
    const [dataExcel, setDataExcel] = useState()
    const [openModalImport, setOpenModalImport] = useState(false);
    const [confirmLoadingImport, setConfirmLoadingImport] = useState(false);
    const [dataExcelLength, setDataExcelLength] = useState(0)

    //customRequest
    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 1000)
    }
    //props for Dragger
    const propsImport = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        customRequest: dummyRequest,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log('cloading', info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);

                let file = info.fileList[0].originFileObj
                const reader = new FileReader();
                reader.onload = function (e) {
                    let data = new Uint8Array(e.target.result);
                    let workbook = XLSX.read(data, { type: 'array' });
                    // find the name of your sheet in the workbook first
                    let worksheet = workbook.Sheets[workbook.SheetNames[0]];

                    // convert to json format
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                        header: ["fullName", "email", "phone"],
                        range: 1
                    });
                    if (jsonData && jsonData.length > 0) {
                        setDataExcel(jsonData)
                        setDataExcelLength(jsonData.length)
                    }
                };
                reader.readAsArrayBuffer(file);

            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    }

    //table header
    const columns = [
        {
            title: 'Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
        },
    ];

    //handle close button (modal import user)
    const handleCancleImportChild = () => {
        props.handleCancleImport()
        setDataExcel([])
        setDataExcelLength(0)
    };
    const handleOk = async () => {
        const data = dataExcel.map(item => {
            item.password = '123456';
            return item;
        })
        const res = await callCreateBulkUser(data)
        if (res.data) {
            notification.success({
                description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
                message: "Upload successfully"
            })
            setDataExcel([])
            setDataExcelLength(0)
            props.getAllUserPaginate();
            setConfirmLoadingImport(true);
            setTimeout(() => {
                props.handleCancleImport()
                setConfirmLoadingImport(false);
            }, 1000);
        } else {
            notification.error({
                description: res.message,
                message: 'Error occured'
            })
        }


    };


    const onRemoveFile = () => {
        setDataExcel([])
    }

    return (
        <>
            <Modal
                title="Import"
                open={props.openModalImport}
                onOk={handleOk}
                confirmLoading={confirmLoadingImport}
                onCancel={handleCancleImportChild}
                width={630}
                okText="Import user"

            >

                <Dragger {...propsImport}
                    showUploadList={dataExcelLength > 0}
                    onRemove={onRemoveFile}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload (excel file). &nbsp;
                        <a
                            onClick={e => e.stopPropagation()}
                            href={sampleFile} download
                        >
                            Download sample file</a>
                    </p>
                </Dragger>
                <Table
                    style={{ marginTop: 40 }}
                    columns={columns}
                    dataSource={dataExcel}
                />
            </Modal>


        </>


    )
};
export default BookImport;