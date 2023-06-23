import { useLocation } from "react-router-dom";
import './bookPage.scss'
import ViewBookDetail from "../../components/Home/ViewBookDetail";
import { callGetBookById } from "../../services/api";
import { useEffect } from "react";
import { useState } from "react";
const BookPage = () => {

    const [bookDetail, setBookDetail] = useState()

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    //get book id
    const id = params?.get("id");
    const getBookById = async () => {
        const res = await callGetBookById(id)
        if (res && res.data) {
            let raw = res.data;
            raw.items = getImages(raw)
            setTimeout(() => {
                setBookDetail(raw)
            }, 1500)

        }

    }
    useEffect(() => {
        getBookById()
    }, [id])

    const getImages = (raw) => {
        let images = []
        if (raw?.thumbnail) {
            images.push(
                {
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw?.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw?.thumbnail}`,
                }
            )
        }
        if (raw.slider) {
            raw.slider?.map(item => {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    }
                )
            })
        }
        return images;
    }


    return (
        <>
            <ViewBookDetail
                bookDetail={bookDetail}
            />
        </>
    )
}

export default BookPage;