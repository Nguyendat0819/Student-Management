import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosclient";
import "../assets/form.css";
import { useNavigate } from "react-router-dom";
export default function Register() {
    const [userName, setUsername] = useState();
    const [password, setPassword] = useState();
    const [repassword, setRepassword] = useState();
    const [email, setEmail] = useState();
    const [errorEmail, setErrorEmail] = useState();
    const [showPassword, setShowpassword] = useState(false);
    const [showRepassword, setShowrepassword] = useState(false);
    const Navigate = useNavigate();
    useEffect(() => {
        if (errorEmail) {
            const timer = setTimeout(() => {
                setErrorEmail(null)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [errorEmail])
    const formRegister = (e) => {
        e.preventDefault();

        if (password !== repassword) {
            alert("Nhập lại mật khẩu");
            return;
        }
        const dtoRegister = { userName, password, email };
        axiosClient.post('/api/register', dtoRegister)
            .then((response) => {
                console.log("Đăng ký thành công");
                alert("Đăng ký thành công");
                Navigate('/login');
            })
            .catch((error) => {
                setErrorEmail(error.response?.data || "Tài khoản đã tồn tại");
            });
    }
    return (
        <div className="register-container">
            <form onSubmit={formRegister} className="register-form">
                <h2 className="register-title">Đăng Ký Tài Khoản</h2>

                <div className="input-group">
                    <input type="text" className="register-input" name="userName" value={userName || ""} onChange={(e) => setUsername(e.target.value)} placeholder="Tên đăng nhập" required />
                </div>

                <div className="input-group password-group">
                    <input type={showPassword ? "text" : "password"} className="register-input" name="password" value={password || ""} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu" required />
                    <button type="button" className="toggle-password" onClick={() => setShowpassword(!showPassword)}>
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                </div>

                <div className="input-group password-group">
                    <input type={showRepassword ? "text" : "password"} className="register-input" name="repassword" value={repassword || ""} onChange={(e) => setRepassword(e.target.value)} placeholder="Nhập lại mật khẩu" required />
                    <button type="button" className="toggle-password" onClick={() => setShowrepassword(!showRepassword)}>
                        {showRepassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                </div>

                <div className="input-group">
                    <input type="email" name="email" className="register-input" value={email || ""} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email" required />
                </div>

                {errorEmail &&
                    <div className="error-container">
                        <p className="register-error text-red-500">
                            {errorEmail}
                        </p>
                    </div>
                }

                <button type="submit" className="register-submit">Đăng ký</button>
            </form>
        </div>
    );
}