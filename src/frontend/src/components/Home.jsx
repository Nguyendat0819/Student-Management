import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosclient";

// Hàm tính toán mảng phân trang thông minh (có dấu 3 chấm)
const getPagination = (currentPage, totalPages) => {
    // Nếu tổng số trang ít (từ 5 trang trở xuống), hiển thị tất cả
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i);
    }

    // Nếu đang ở 3 trang đầu
    if (currentPage <= 2) {
        return [0, 1, 2, 3, "...", totalPages - 1];
    }

    // Nếu đang ở 3 trang cuối
    if (currentPage >= totalPages - 3) {
        return [0, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
    }

    // Nếu đang ở đoạn giữa
    return [0, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages - 1];
};

export default function Home() {
    // 1. CÁC BIẾN TRẠNG THÁI (STATE)
    // Nơi lưu trữ bộ nhớ ngắn hạn của màn hình. Bất cứ khi nào State thay đổi, React sẽ tự động vẽ lại (re-render) màn hình.
    const [messages, setMessage] = useState([]); // Lưu mảng dữ liệu lấy từ Java. Khởi tạo là mảng rỗng [].
    const [inputValue, setInputValue] = useState(""); // Lưu trữ giá trị hiện tại mà người dùng đang gõ trong ô input.
    const [editId, setEditId] = useState(null); // Lưu ID (vị trí) của tin nhắn đang được bấm "Edit". Nếu là null nghĩa là đang ở chế độ Thêm mới.
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 2. GỌI API LẤY DỮ LIỆU (READ - GET)
    const getchMesssage = () => {
        axiosClient.get(`/api/messages?page=${page}&size=5`)
            .then((response) => {
                setMessage(response.message) // Lấy mảng tin nhắn mới nhất đắp vào biến 'messages' để React vẽ lên giao diện.
                setTotalPages(response.totalPages);
            })
            .catch((error) => { console.log(error) })
    }

    // 3. GỌI API THÊM MỚI (CREATE - POST)
    const createMessage = () => {
        axiosClient.post('/api/messages', { home: inputValue }) // Gói cái chữ đang gõ trong ô input thành cục JSON gửi đi
            .then(response => {
                setMessage(prevMessage => [...prevMessage, response]); // Cập nhật lại danh sách hiển thị với mảng mới
                setInputValue(""); // Xóa trắng ô input để người dùng nhập câu tiếp theo
            })
            .catch((error) => { console.log(error) })
    }

    // 4. GỌI API CẬP NHẬT (UPDATE - PUT)
    const updateMessage = () => {
        // Gắn 'editId' lên đuôi URL để báo cho Java biết mình muốn sửa dòng nào
        axiosClient.put(`/api/messages/${editId}`, { home: inputValue })
            .then(response => {
                setMessage(prevMessage => prevMessage.map((value, index) => index === editId ? response : value)); // Cập nhật lại danh) sách
                setInputValue(""); // Xóa trắng ô input
                setEditId(null);   // Đặt lại editId về null để hệ thống tự quay về chế độ "Thêm mới" ban đầu
            })
            .catch(error => {
                console.log(error);
            })
    }

    // 5. GỌI API XÓA (DELETE)
    const deleteMessage = (id) => {
        // Nhấn nút xóa ở dòng nào thì truyền ID của dòng đó xuống đây để đính kèm lên URL
        axiosClient.delete(`/api/messages/${id}`)
            .then(response => {
                setMessage(findIndex => findIndex.filter((_, index) => index !== id)) // Lấy mảng mới (đã bị xóa mất 1 dòng) đắp lên lại màn hình
            })
            .catch(error => {
                console.log(error)
            })
    }

    // 6. XỬ LÝ SỰ KIỆN KHI BẤM NÚT EDIT (CHƯA GỌI API)
    const handleEdit = (id, value) => {
        setEditId(id) // Bật cờ đánh dấu "Đang sửa dòng số X"
        setInputValue(value) // Copy chữ của dòng cũ đắp ngược lên ô input để người ta tiện gõ sửa
    }

    useEffect(() => {
        getchMesssage(); // Vừa vào trang web là lập tức đòi Java trả dữ liệu về để hiển thị luôn
    }, [page]);

    const pages = getPagination(page, totalPages);

    return (
        <div>
            <h1>Home</h1>

            <div>
                <strong>Java trả về:</strong>

                {messages.map((value, index) => (

                    <p key={index}>

                        {value}


                        <button onClick={() => handleEdit(index, value)}>Edit</button>


                        <button onClick={() => deleteMessage(index)}>Delete</button>
                    </p>
                ))}
            </div>
            <div className="pagination">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                >
                    Trang trước
                </button>
                {
                    pages.map((item, index) => (
                        item === "..." ?
                            <span key={index}>...</span> :
                            <button
                                key={index}
                                onClick={() => setPage(item)}
                            >
                                {item + 1}
                            </button>
                    ))
                }
                <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                >
                    Trang sau
                </button>
            </div>


            <form action="" onSubmit={(e) => e.preventDefault()}>

                <input type="text" onChange={(e) => setInputValue(e.target.value)} value={inputValue} />

                {editId !== null ?
                    <div>
                        <button type="button" onClick={updateMessage}>Cap nhat du lieu</button>
                        <button type="button" onClick={() => {
                            setEditId(null);
                            setInputValue("")
                        }}>Huy</button>
                    </div>
                    :
                    <button type="button" onClick={createMessage}>Gửi dữ liệu</button>
                }
            </form>

        </div >
    );
}