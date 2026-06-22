import React, { useState } from "react";
import axiosClient from "../api/axiosclient";
export default function TeacherGrades() {
    const [grades, setGrades] = useState({
        diem_cc1: '',
        diem_cc2: '',
        diem_gk: '',
        diem_ck: ''
    });


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
            })
            .catch((error) => {
                console.log(error.response?.data);
            })
    }
    return (
        <div>
            <form action="" onSubmit={formGrades}>
                <div>
                    <input type="text" name="diem_cc1" value={grades.diem_cc1} onChange={handleChange} placeholder="Điểm chuyên cần 1: " required />
                </div>
                <div>
                    <input type="text" name="diem_cc2" value={grades.diem_cc2} onChange={handleChange} placeholder="Điểm chuyên cần 2: " required />
                </div>
                <div>
                    <input type="text" name="diem_gk" value={grades.diem_gk} onChange={handleChange} placeholder="Điểm giữa kỳ: " required />
                </div>
                <div>
                    <input type="text" name="diem_ck" value={grades.diem_ck} onChange={handleChange} placeholder="Điểm cuối kỳ: " required />
                </div>
                <button type="submit">
                    nhap diem
                </button>
            </form>
        </div>
    );
}