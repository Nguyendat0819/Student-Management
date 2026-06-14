import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosclient";

export default function Home() {
    // 1. CÁC BIẾN TRẠNG THÁI (STATE)
    // Nơi lưu trữ bộ nhớ ngắn hạn của màn hình. Bất cứ khi nào State thay đổi, React sẽ tự động vẽ lại (re-render) màn hình.
    const [messages, setMessage] = useState([]); // Lưu mảng dữ liệu lấy từ Java. Khởi tạo là mảng rỗng [].
    const [inputValue, setInputValue] = useState(""); // Lưu trữ giá trị hiện tại mà người dùng đang gõ trong ô input.
    const [editId, setEditId] = useState(null); // Lưu ID (vị trí) của tin nhắn đang được bấm "Edit". Nếu là null nghĩa là đang ở chế độ Thêm mới.

    // 2. GỌI API LẤY DỮ LIỆU (READ - GET)
    const getchMesssage = () => {
        axiosClient.get('/api/messages')
            .then((response) => {
                setMessage(response.message) // Lấy mảng tin nhắn mới nhất đắp vào biến 'messages' để React vẽ lên giao diện.
            })
            .catch((error) => { console.log(error) })
    }

    // 3. GỌI API THÊM MỚI (CREATE - POST)
    const createMessage = () => {
        axiosClient.post('/api/messages', { home: inputValue }) // Gói cái chữ đang gõ trong ô input thành cục JSON gửi đi
            .then(response => {
                setMessage(response.message); // Cập nhật lại danh sách hiển thị với mảng mới
                setInputValue(""); // Xóa trắng ô input để người dùng nhập câu tiếp theo
            })
            .catch((error) => { console.log(error) })
    }

    // 4. GỌI API CẬP NHẬT (UPDATE - PUT)
    const updateMessage = () => {
        // Gắn 'editId' lên đuôi URL để báo cho Java biết mình muốn sửa dòng nào
        axiosClient.put(`/api/messages/${editId}`, { home: inputValue })
            .then(response => {
                setMessage(response.message); // Cập nhật lại danh sách
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
                setMessage(response.message) // Lấy mảng mới (đã bị xóa mất 1 dòng) đắp lên lại màn hình
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

    // 7. VÒNG ĐỜI COMPONENT (LÚC VỪA MỞ TRANG WEB)
    // Dấu [] ở cuối nghĩa là: "Hàm useEffect này chỉ chạy đúng 1 lần duy nhất ngay khi trang web vừa load xong"
    useEffect(() => {
        getchMesssage(); // Vừa vào trang web là lập tức đòi Java trả dữ liệu về để hiển thị luôn
    }, []);

    // 8. GIAO DIỆN NGƯỜI DÙNG (UI / HTML)
    // Phần này quyết định những gì sẽ hiện lên màn hình. React sẽ tự động vẽ lại (re-render) phần này mỗi khi State thay đổi.
    return (
        <div>
            <h1>Home</h1>
            {/* --- 8.1 KHU VỰC HIỂN THỊ DANH SÁCH (READ & DELETE) --- */}
            <div>
                <strong>Java trả về:</strong>
                {/* Dùng hàm map() để lặp qua mảng messages. Cứ mỗi phần tử trong mảng sẽ được React "biến hình" thành 1 thẻ <p> */}
                {messages.map((value, index) => (
                    // React bắt buộc mỗi thẻ sinh ra từ vòng lặp phải có 1 cái 'key' duy nhất để nó theo dõi sự thay đổi
                    <p key={index}>
                        {/* In nội dung của tin nhắn ra màn hình */}
                        {value}

                        {/* Nút Sửa: Bấm vào thì gọi hàm handleEdit, truyền vị trí (index) và chữ hiện tại (value) vào ô input */}
                        <button onClick={() => handleEdit(index, value)}>Edit</button>

                        {/* Nút Xóa: Bấm vào thì gọi thẳng hàm deleteMessage, truyền đúng cái index của dòng đó để báo cho Java xóa */}
                        <button onClick={() => deleteMessage(index)}>Delete</button>
                    </p>
                ))}
            </div>
            {/* --- 8.2 KHU VỰC FORM NHẬP LIỆU (CREATE & UPDATE) --- */}
            {/* onSubmit={(e) => e.preventDefault()}: Lệnh kinh điển của React 
            giúp chặn thói quen xấu của thẻ <form> là tự động reload trang web khi bấm nút Enter */}
            <form action="" onSubmit={(e) => e.preventDefault()}>
                {/* 
                    Ô Input "2 chiều": 
                    - value={inputValue}: Trói chặt giá trị hiển thị trong ô với biến State 'inputValue'.
                    - onChange: Mỗi khi người dùng gõ 1 phím, lập tức túm lấy chữ đó (e.target.value) nhét ngược lại vào State.
                */}
                <input type="text" onChange={(e) => setInputValue(e.target.value)} value={inputValue} />
                {/* Toán tử 3 ngôi (Điều_kiện ? Nếu_Đúng_thì_in_cái_này : Nếu_Sai_thì_in_cái_kia) */}
                {/* Kiểm tra xem hệ thống có đang cắm cờ Sửa (editId) ở dòng nào không? */}
                {editId !== null ?

                    /* TRƯỜNG HỢP ĐÚNG (Có editId): Có nghĩa là đang ở chế độ Sửa (Edit Mode) */
                    <div>
                        {/* Bấm Cập nhật thì chạy hàm gọi API PUT */}
                        <button type="button" onClick={updateMessage}>Cap nhat du lieu</button>

                        {/* Bấm Hủy thì nhổ cờ (editId = null) và xóa trắng ô input để giao diện tự quay về chế độ Thêm mới như cũ */}
                        <button type="button" onClick={() => {
                            setEditId(null);
                            setInputValue("")
                        }}>Huy</button>
                    </div>
                    :
                    /* TRƯỜNG HỢP SAI (editId là null): Có nghĩa là đang ở chế độ Thêm mới bình thường (Create Mode) */
                    /* Bấm Gửi thì chạy hàm gọi API POST */
                    <button type="button" onClick={createMessage}>Gửi dữ liệu</button>
                }
            </form>

        </div>
    );
}