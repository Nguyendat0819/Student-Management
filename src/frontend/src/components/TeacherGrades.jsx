import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosclient";
import { useSubjects } from "../hook/useSubjects";
import "../assets/teacherSubject.css";

const initialGradesState = {
    user_id: '',
    subject_id: '',
    diem_cc1: '',
    diem_cc2: '',
    diem_gk: '',
    diem_ck: ''
};

export default function TeacherGrades() {
    const [students, setStudent] = useState([]);
    const { subjects, loading, error, fetchSubjects, deleteGrade } = useSubjects();
    const [grades, setGrades] = useState(initialGradesState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGrades(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formGrades = (e) => {
        e.preventDefault();

        axiosClient.post('/api/grades', grades)
            .then((response) => {
                alert("Nhập điểm thành công");
                getStudentGrades();
                setGrades(initialGradesState);
            })
            .catch((error) => {
                console.log(error.response?.data);
            })
    }

    const getStudentGrades = () => {
        axiosClient.get('/api/grades-student')
            .then((reponse) => {
                setStudent(reponse);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    useEffect(() => {
        getStudentGrades();
    }, []);

    return (
        <div className="container-subject">
            <div className="subject-header">
                <h2>Quản lý Điểm số</h2>
                <p>Cập nhật và theo dõi điểm số chi tiết của học sinh.</p>
            </div>

            <div className="subject-content-wrapper" style={{ gridTemplateColumns: '1fr 2.5fr' }}>

                {/* Panel Form Nhập Điểm */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <h3 className="card-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        {grades.user_id ? "Cập nhật điểm" : "Nhập điểm mới"}
                    </h3>

                    {grades.user_id ? (
                        <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#ecfdf5', border: '1px solid #10b981', color: '#059669', borderRadius: '8px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            Đang sửa điểm - ID: #{grades.user_id}
                        </div>
                    ) : (
                        <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', color: '#64748b', borderRadius: '8px', fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
                            Vui lòng chọn học sinh từ danh sách bên cạnh để nhập điểm
                        </div>
                    )}

                    <form onSubmit={formGrades}>
                        <div className="form-group">
                            <label>Chọn môn học</label>
                            {loading && <p style={{ fontSize: '13px', color: '#64748b' }}>Đang tải danh sách...</p>}
                            {error && <p style={{ fontSize: '13px', color: 'red' }}>{error}</p>}
                            <select
                                name="subject_id"
                                className="form-input-control"
                                value={grades.subject_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Chọn môn học --</option>
                                {subjects.map((subject, index) => (
                                    <option key={index} value={subject.id}>{subject.subject_name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="form-group">
                                <label>Chuyên cần 1</label>
                                <input type="number" step="0.1" min="0" max="10" name="diem_cc1" className="form-input-control" value={grades.diem_cc1} onChange={handleChange} placeholder="VD: 8.5" required />
                            </div>
                            <div className="form-group">
                                <label>Chuyên cần 2</label>
                                <input type="number" step="0.1" min="0" max="10" name="diem_cc2" className="form-input-control" value={grades.diem_cc2} onChange={handleChange} placeholder="VD: 9.0" required />
                            </div>
                            <div className="form-group">
                                <label>Giữa kỳ</label>
                                <input type="number" step="0.1" min="0" max="10" name="diem_gk" className="form-input-control" value={grades.diem_gk} onChange={handleChange} placeholder="VD: 7.5" required />
                            </div>
                            <div className="form-group">
                                <label>Cuối kỳ</label>
                                <input type="number" step="0.1" min="0" max="10" name="diem_ck" className="form-input-control" value={grades.diem_ck} onChange={handleChange} placeholder="VD: 8.0" required />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            {grades.user_id && (
                                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => {
                                    setGrades(initialGradesState);
                                }}>
                                    Hủy bỏ
                                </button>
                            )}
                            <button type="submit" className="btn-primary" style={{ flex: grades.user_id ? 1 : 2 }}>
                                Lưu điểm số
                            </button>
                        </div>
                    </form>
                </div>

                {/* Panel Danh Sách Học Sinh */}
                <div className="card" style={{ overflow: 'hidden' }}>
                    <h3 className="card-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        Danh sách điểm học sinh
                    </h3>

                    <div className="table-container">
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Họ Tên</th>
                                    <th>Môn học</th>
                                    <th>CC1</th>
                                    <th>CC2</th>
                                    <th>Giữa kỳ</th>
                                    <th>Cuối kỳ</th>
                                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students && students.length > 0 ? (
                                    students.map((student, index) => (
                                        <tr key={index} className={grades.user_id === student.id ? 'active-row' : ''}>
                                            <td><span className="badge badge-id">#{student.id}</span></td>
                                            <td style={{ fontWeight: 500 }}>
                                                <div>{student.userName}</div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'normal' }}>{student.email}</div>
                                            </td>
                                            <td><span className="badge">{student.subject_name}</span></td>
                                            <td>{student.diem_cc1}</td>
                                            <td>{student.diem_cc2}</td>
                                            <td>{student.diem_gk}</td>
                                            <td style={{ fontWeight: 'bold', color: '#0f172a' }}>{student.diem_ck}</td>
                                            <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                                <button
                                                    className="btn-action"
                                                    style={{ backgroundColor: grades.user_id === student.id ? '#10b981' : '', color: grades.user_id === student.id ? '#fff' : '', borderColor: grades.user_id === student.id ? '#10b981' : '' }}
                                                    onClick={() => {
                                                        const matchedSubject = subjects.find(s => s.subject_name === student.subject_name);
                                                        setGrades({
                                                            user_id: student.id,
                                                            subject_id: matchedSubject ? matchedSubject.id : '',
                                                            diem_cc1: student.diem_cc1 || '',
                                                            diem_cc2: student.diem_cc2 || '',
                                                            diem_gk: student.diem_gk || '',
                                                            diem_ck: student.diem_ck || ''
                                                        });
                                                    }}
                                                >
                                                    {grades.user_id === student.id ? "Đang chọn" : "Sửa"}
                                                </button>

                                                <button
                                                    className="btn-action"
                                                    style={{ color: '#ef4444', backgroundColor: '#fef2f2', borderColor: '#fecaca' }}
                                                    onClick={async () => {
                                                        if (window.confirm("Bạn có chắc chắn muốn xóa điểm này không?")) {
                                                            await deleteGrade(student.grades_id)
                                                            getStudentGrades(); // Đợi xóa xong thì tự load lại bảng
                                                        }
                                                    }}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                                            Chưa có dữ liệu điểm học sinh
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}