import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosclient";
import { useNavigate } from "react-router-dom";
import "../assets/Login.css"
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowpassword] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(null);
            }, 3000);
        }
    }, [error]);


    const formLogin = (e) => {
        e.preventDefault();
        const dtoLogin = { email, password }
        axiosClient.post('/api/login', dtoLogin)
            .then(() => {
                alert("Đăng nhập thành công");
                navigate('/home');
            })
            .catch((error) => {
                // Lấy thông báo lỗi từ backend trả về (vd: "Tai khoan khong ton tai")
                const errData = error.response?.data;
                const message = typeof errData === 'string' ? errData.toLowerCase() : (errData?.message?.toLowerCase() || "");

                // So khớp với chữ mà Java throw ra ("tai khoan khong ton tai", "mat khau khong dung")
                if (message.includes("mat khau")) {
                    setError("Sai mật khẩu");
                } else if (message.includes("tai khoan")) {
                    setError("Tài khoản không tồn tại");
                } else {
                    setError("Lỗi không xác định");
                }
            })
    }
    return (
        <div className="login-container">
            <form onSubmit={formLogin} className="form-login">
                {error &&
                    <div className="warn-login">
                        <p className="warn-text-login">
                            {error}
                        </p>
                    </div>
                }
                <div className="input-group">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email: " className="email-input" required />
                </div>

                <div className="input-group pass-group ">
                    <input type={showPassword ? "text" : "password"}
                        value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu: "
                        className="password-input" required />
                    <button type="button" onClick={() => setShowpassword(!showPassword)} className="toggle-password">
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                </div>

                <button type="submit" className="login-btn">
                    Đăng Nhập
                </button>
            </form>
        </div>
    )
}