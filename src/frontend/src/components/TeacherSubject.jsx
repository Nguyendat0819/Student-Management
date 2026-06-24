import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosclient";
import "../assets/teacherSubject.css";

export default function TeacherSubject() {
    const [error, setError] = useState();
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [data, setData] = useState({
        subject_name: '',
        coefficient: ''
    });
    const [viewUpdate, setViewupdate] = useState(false);

    const getPagination = (currentPage, totalPages) => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i);
        }

        if (currentPage <= 2) {
            return [0, 1, 2, "...", totalPages - 1];
        }

        if (currentPage >= totalPages - 3) {
            return ["...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
        }

        return [0, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages - 1];
    }
    const pages = getPagination(page, totalPages);

    const [updateData, setUpdateData] = useState(
        {
            id: '',
            subject_name: '',
            coefficient: ''
        }
    )

    const handleChange = (type) => (e) => {
        const { name, value } = e.target;
        const setStateFunc = type === 'update' ? setUpdateData : setData

        setStateFunc(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const formSubject = (e) => {
        e.preventDefault();

        axiosClient.post('/api/subject', data)
            .then((reponse) => {
                alert("Đã thêm môn học thành công");
                setData({
                    subject_name: '',
                    coefficient: ''
                });
                getSubject();
            })
            .catch((error) => {
                const errData = error.response?.data;
                const message = typeof errData === 'string' ? errData.toLocaleLowerCase() : (errData?.message?.toLocaleLowerCase() || "");
                if (message.includes("da co trong subject roi")) {
                    setError("Đã có trong môn học");
                } else {
                    setError("Lỗi không xác định: " + (typeof errData === 'string' ? errData : ""));
                }
            })
    }

    const getSubject = () => {
        axiosClient.get(`/api/subject?page=${page}&size=5`)
            .then((reponse) => {
                setSubjects(reponse.content || []);
                setTotalPages(reponse.totalPages || 0);
            })
            .catch((error) => {

            })
    }

    const putSubject = (e) => {
        e.preventDefault();
        axiosClient.put(`/api/subject/${updateData.id}`, updateData)
            .then((reponse => {
                alert("Sửa thành công ");
                getSubject();
                setViewupdate(false); // Ẩn form sau khi sửa
            }))
            .catch((error) => {
                const errData = error.response?.data;
                const message = typeof errData === 'string' ? errData.toLocaleLowerCase() : (errData?.message?.toLocaleLowerCase() || "");
                if (message.includes("tồn tại") || message.includes("ton tai")) {
                    setError("Tên môn học đã tồn tại");
                } else {
                    setError("Lỗi không xác định: " + (typeof errData === 'string' ? errData : ""));
                }
            })
    }
    
    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(null)
            }, 3000)
        }
    }, [error]);
    
    useEffect(() => {
        getSubject();
    }, [page]);

    return (
        <div className="container-subject">
            <div className="subject-header">
                <h2>Quản lý môn học</h2>
                <p>Thêm mới, cập nhật và xem danh sách các môn học trong hệ thống.</p>
            </div>

            <div className="subject-content-wrapper">
                {/* Form Thêm Mới */}
                <div className="card">
                    <h3 className="card-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Thêm môn học
                    </h3>
                    <form onSubmit={formSubject}>
                        {error && !viewUpdate && (
                            <div className="error-alert">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="subject_name">Tên môn học</label>
                            <input 
                                type="text" 
                                id="subject_name"
                                name="subject_name" 
                                className="form-input-control"
                                value={data.subject_name} 
                                onChange={handleChange('add')} 
                                placeholder="Nhập tên môn học..." 
                                autoComplete="off" 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="coefficient">Hệ số môn</label>
                            <input 
                                type="text" 
                                id="coefficient"
                                name="coefficient" 
                                className="form-input-control"
                                value={data.coefficient} 
                                onChange={handleChange('add')} 
                                placeholder="Nhập hệ số môn..." 
                                autoComplete="off" 
                                required 
                            />
                        </div>
                        <button className="btn-primary" style={{ marginTop: '8px' }} type="submit">Thêm môn học</button>
                    </form>
                </div>

                {/* Danh Sách Môn Học */}
                <div className="card">
                    <h3 className="card-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        Danh sách môn học
                    </h3>
                    
                    <div className="table-container">
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên môn học</th>
                                    <th>Hệ số</th>
                                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects && subjects.length > 0 ? (
                                    subjects.map((subject, index) => (
                                        <tr key={index} className={updateData.id === subject.id && viewUpdate ? 'active-row' : ''}>
                                            <td><span className="badge badge-id">#{subject.id}</span></td>
                                            <td style={{ fontWeight: 500 }}>{subject.subject_name}</td>
                                            <td><span className="badge">{subject.coefficient}</span></td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="btn-action" onClick={() => {
                                                    setViewupdate(true);
                                                    setUpdateData(subject);
                                                }}>
                                                    Chỉnh sửa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                                            Chưa có môn học nào trong hệ thống
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="pagination-container">
                            <div className="pagination-info">
                                Hiển thị trang {page + 1} / {totalPages}
                            </div>
                            <div className="pagination-controls">
                                <button
                                    className="page-btn"
                                    onClick={() => setPage(prev => Math.max(0, prev - 1))}
                                    disabled={page === 0}
                                    title="Trang trước"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>

                                {pages.map((item, index) => (
                                    item === "..." ? (
                                        <span key={index} style={{ padding: '0 4px', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>...</span>
                                    ) : (
                                        <button
                                            key={index}
                                            className={`page-btn ${item === page ? 'active' : ''}`}
                                            onClick={() => setPage(item)}
                                        >
                                            {item + 1}
                                        </button>
                                    )
                                ))}

                                <button
                                    className="page-btn"
                                    onClick={() => setPage(prev => prev + 1)}
                                    disabled={page >= totalPages - 1}
                                    title="Trang sau"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Cập Nhật */}
            <div className={`modal-overlay ${viewUpdate ? 'open' : ''}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>Cập nhật môn học</h3>
                        <button className="close-btn" onClick={() => {
                            setViewupdate(false);
                            setUpdateData({
                                id: '',
                                subject_name: '',
                                coefficient: ''
                            });
                        }}>&times;</button>
                    </div>
                    
                    <form onSubmit={putSubject}>
                        {error && viewUpdate && (
                            <div className="error-alert">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="form-group">
                            <label>Tên môn học</label>
                            <input 
                                type="text" 
                                name="subject_name" 
                                className="form-input-control"
                                value={updateData.subject_name || ''} 
                                onChange={handleChange('update')} 
                                placeholder="Nhập tên môn học..." 
                                autoComplete="off" 
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Hệ số</label>
                            <input 
                                type="text" 
                                name="coefficient" 
                                className="form-input-control"
                                value={updateData.coefficient || ''} 
                                onChange={handleChange('update')} 
                                placeholder="Nhập hệ số..." 
                                autoComplete="off" 
                                required
                            />
                        </div>
                        
                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => {
                                setViewupdate(false);
                                setUpdateData({
                                    id: '',
                                    subject_name: '',
                                    coefficient: ''
                                });
                            }}>
                                Hủy bỏ
                            </button>
                            <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}