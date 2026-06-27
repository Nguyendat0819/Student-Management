import { useState, useEffect } from "react";
import { getSubject, deleteGrade as deleteGradeApi } from "../api/subjectsApi";

export const useSubjects = () => {
    // 1. Khai báo các State
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false); // Trạng thái tải
    const [error, setError] = useState(null);      // Trạng thái lỗi

    // 2. Hàm gọi API
    const fetchSubjects = async () => {
        setLoading(true);
        setError(null); // Làm sạch lỗi cũ mỗi lần gọi lại
        try {
            const response = await getSubject();
            // Lưu dữ liệu vào state (có fallback [] nếu bị undefined)
            setSubjects(response || []);
        } catch (err) {
            console.error("Lỗi khi lấy môn học: ", err);
            // Bắt lỗi và lưu thông báo lỗi
            setError(err.response?.data?.message || "Không thể tải danh sách môn học.");
        } finally {
            // Tắt trạng thái loading bất kể thành công hay thất bại
            setLoading(false);
        }
    };

    // 3. (Tùy chọn) Tự động gọi hàm khi Hook này được khởi tạo
    useEffect(() => {
        fetchSubjects();
    }, []);

    // 4. Trả về mọi thứ dưới dạng Object để Component dùng


    const deleteGrade = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deleteGradeApi(id);
            fetchSubjects();
        } catch (err) {
            console.error("Lỗi khi xóa: ", err);
            setError(err.response?.data?.message || "Khong the xoa");
        } finally {
            setLoading(false);
        }
    }
    return { subjects, loading, error, fetchSubjects, deleteGrade };
};
