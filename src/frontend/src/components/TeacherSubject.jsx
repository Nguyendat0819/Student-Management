import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosclient";
export default function TeacherSubject() {
    const [error, setError] = useState();
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [data, setData] = useState({
        subject_name: '',
        coefficient: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
            <form action="" onSubmit={formSubject} className="form-subject">
                {error &&
                    <div className="error-subject">
                        <p>
                            {error}
                        </p>
                    </div>
                }
                <div className="form-subject-name">
                    <input type="text" name="subject_name" value={data.subject_name} onChange={handleChange} placeholder="Nhập tên môn học: " autoComplete="off" required />
                </div>
                <div>
                    <input type="text" name="coefficient" value={data.coefficient} onChange={handleChange} placeholder="Nhập hệ số môn: " autoComplete="off" required />
                </div>
                <button type="submit">Submit</button>
            </form>

            <div className="subject-list">
                <h3>Danh sách môn học</h3>
                <table border="1" style={{ width: '100%', textAlign: 'left', marginTop: '20px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '8px' }}>ID</th>
                            <th style={{ padding: '8px' }}>Tên môn học</th>
                            <th style={{ padding: '8px' }}>Hệ số</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects && subjects.length > 0 ? (
                            subjects.map((subject, index) => (
                                <tr key={index}>
                                    <td style={{ padding: '8px' }}>{subject.id}</td>
                                    <td style={{ padding: '8px' }}>{subject.subject_name}</td>
                                    <td style={{ padding: '8px' }}>{subject.coefficient}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ padding: '8px', textAlign: 'center' }}>Chưa có môn học nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {/* pagination */}
                <div>
                    <button
                        onClick={() => setPage(prev => Math.max(0, prev - 1))}
                        disabled={page === 0}
                    >
                        Trang trước
                    </button>

                    <span>{page + 1} / {totalPages === 0 ? 1 : totalPages}</span>
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={page >= totalPages - 1}
                    >
                        Trang sau
                    </button>
                </div>
                <div>
                    {
                        pages.map((item, index) => (item === "..." ?
                            <span key={index}>...</span> :
                            <button
                                key={index}
                                onClick={() => setPage(item)}
                                style={item === page ? { backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold' } : {}}
                            >
                                {item + 1}
                            </button>

                        ))
                    }
                </div>
            </div>

        </div>
    )
}