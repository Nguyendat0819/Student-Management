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

    const formSubject = (e) => {
        e.preventDefault();

        axiosClient.post('/api/subject', data)
            .then((reponse) => {

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
        axiosClient.get('/api/subject')
            .then((reponse) => {
                setSubjects(reponse);
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
    }, []);
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
                    <input type="text" name="subject_name" value={data.subject_name} onChange={handleChange} placeholder="Nhập tên môn học: " required />
                </div>
                <div>
                    <input type="text" name="coefficient" value={data.coefficient} onChange={handleChange} placeholder="Nhập hệ số môn: " required />
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
            </div>

        </div>
    )
}