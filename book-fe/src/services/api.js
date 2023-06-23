import axios from "../utils/axios";

export const callRegister = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user/register', { fullName, email, password, phone })
}

export const callLogin = (username, password) => {
    return axios.post('/api/v1/auth/login', { username, password, delay: 1500 })
}

export const callFetchUser = () => {
    return axios.get('/api/v1/auth/account')
}

export const callLogOut = () => {
    return axios.post('/api/v1/auth/logout')
}

export const callGetUserWithPaginate = (query) => {
    return axios.get(`/api/v1/user?${query}`)
}

export const callCreateUser = (fullName, password, email, phone) => {
    return axios.post(`/api/v1/user`, { fullName, password, email, phone })
}

export const callCreateBulkUser = (data) => {
    return axios.post(`/api/v1/user/bulk-create`, data)
}

export const callEditUser = (_id, fullName, phone) => {
    return axios.put(`/api/v1/user`, { _id, fullName, phone })
}

export const callDeleteuser = (_id) => {
    return axios.delete(`/api/v1/user/${_id}`)
}

export const callGetBookWithPaginate = (query) => {
    return axios.get(`/api/v1/book?${query}`)
}

export const callGetBookCategory = () => {
    return axios.get(`/api/v1/database/category`)
}

export const callUploadImage = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: `/api/v1/file/upload`,
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        },
    });
}

export const callCreateBook = (mainText, author, price, sold, quantity, category, thumbnail, slider) => {
    return axios.post(`/api/v1/book`, { mainText, author, price, sold, quantity, category, thumbnail, slider })
}

export const callUpdateBook = (_id, thumbnail, slider, mainText, author, price, sold, quantity, category) => {
    return axios.put(`/api/v1/book/${_id}`, { thumbnail, slider, mainText, author, price, sold, quantity, category })
}

export const callDeleteBook = (_id) => {
    return axios.delete(`/api/v1/book/${_id}`)
}

export const callGetBookById = (_id) => {
    return axios.get(`/api/v1/book/${_id}`)
}

export const callCreateOrder = (data) => {
    return axios.post(`/api/v1/order`, { ...data })
}

export const callGetOrderHistory = () => {
    return axios.get(`/api/v1/history`)
}