import axios from "axios";

// 1. KHỞI TẠO AXIOS CLIENT
// Tạo ra một "người vận chuyển" (axiosClient) chuyên đi giao tiếp với Backend.
// Giúp mình không phải viết đi viết lại cấu hình cơ bản cho mỗi lần gọi API.
const axiosClient = axios.create({
    baseURL: 'http://localhost:8080', // Địa chỉ gốc của Backend. Từ nay gọi API chỉ cần gõ '/api/messages' thay vì nguyên đường dẫn dài.
    withCredentials: true, // Cho phép trình duyệt gửi kèm Cookie/Session sang Backend (Bắt buộc phải có để khớp với allowCredentials(true) bên Java).
    headers: {
        // Khẳng định với Backend: "Mọi dữ liệu tôi gửi cho anh đều là chuẩn JSON nhé!"
        'Content-Type': 'application/json',
    },
});
// 2. CẤU HÌNH REQUEST (CAN THIỆP TRƯỚC KHI GỬI ĐI)
// Đây là "trạm kiểm soát xuất cảnh". Mọi request từ React trước khi bay sang Java đều phải chạy qua hàm này.
// Do RESTful API có tính "Stateless" (Server không thèm nhớ ai là ai), nên ta phải TỰ ĐỘNG nhét "thẻ căn cước" (Token) vào mỗi gói tin gửi đi.
axiosClient.interceptors.request.use(
    (config) => {
        // Lấy thẻ căn cước (Token) đã cất trong ví (localStorage) của trình duyệt (thường do lúc Đăng nhập lưu vào).
        const token = localStorage.getItem('token');
        if (token) {
            // Nếu có thẻ, đính kèm vào Header với định dạng chuẩn mực của REST là 'Bearer <mã_token>'
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config; // Cho phép gói tin cất cánh bay sang Java
    },
    (Error) => {
        // Nếu lúc chuẩn bị gửi mà phần cứng/mạng bị lỗi gì đó thì báo lỗi luôn
        return Promise.reject(Error);
    }
);
// 3. CẤU HÌNH RESPONSE (CAN THIỆP SAU KHI NHẬN KẾT QUẢ VỀ)
// Đây là "trạm kiểm soát nhập cảnh". Dữ liệu từ Java gửi về sẽ phải đi qua hàm này trước khi vào các file giao diện (.jsx).
axiosClient.interceptors.response.use(
    (response) => {
        // Thông thường kết quả Java trả về bị bọc trong một cái vỏ rất dày (gồm config, headers, request, status...).
        // Đoạn code này giúp "bóc vỏ" tự động, chỉ móc lấy đúng phần 'data' (cái ruột JSON) để trả về cho React xài cho lẹ.
        // (Đó là lý do file Home.jsx bạn không cần viết response.data.message nữa mà gọi thẳng response.message).
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (Error) => {
        // Bắt lỗi toàn cục: Nếu Backend đuổi cổ không cho vào (Lỗi 401 Unauthorized)
        if (Error.response && (Error.response.status === 401 || Error.response.status === 403)) {
            // NẾU KHÔNG CÓ DÒNG IF NÀY: Khi nhập sai mật khẩu sẽ bị tải lại trang liên tục và mất dòng chữ báo lỗi màu đỏ!
            if (Error.config.url !== '/api/login') {
                localStorage.removeItem('token');
                console.log('Token hết hạn hoặc bạn chưa đăng nhập!');
                window.location.href = '/login'; // Chuyển hướng người dùng về trang Đăng Nhập
            }
        }
        return Promise.reject(Error);
    }
);

export default axiosClient; // Đóng gói và xuất "người vận chuyển" này ra cho toàn ứng dụng dùng chung.