import React from 'react';
import { Menu, Button } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, DashboardOutlined, BookOutlined, FormOutlined, LoginOutlined, UserAddOutlined, LogoutOutlined } from '@ant-design/icons';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const getMenuItems = () => {
    if (token) {
      if (role === 'teacher') {
        return [
          {
            key: '/teacher-dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/teacher-dashboard">Dashboard</Link>,
          },
          {
            key: '/teacher-subject',
            icon: <BookOutlined />,
            label: <Link to="/teacher-subject">Quản lý môn học</Link>,
          },
          {
            key: '/teacher-grades',
            icon: <FormOutlined />,
            label: <Link to="/teacher-grades">Quản lý điểm</Link>,
          },
        ];
      } else if (role === 'student') {
        return [
          {
            key: '/student-dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/student-dashboard">Dashboard</Link>,
          },
        ];
      }
    }
    return [
      {
        key: '/home',
        icon: <HomeOutlined />,
        label: <Link to="/home">Trang chủ</Link>,
      },
      {
        key: '/login',
        icon: <LoginOutlined />,
        label: <Link to="/login">Đăng nhập</Link>,
      },
      {
        key: '/regist',
        icon: <UserAddOutlined />,
        label: <Link to="/regist">Đăng ký</Link>,
      },
    ];
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1890ff' }}>
        Student Grade Management
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={getMenuItems()}
        style={{ flex: 1, justifyContent: 'flex-end', borderBottom: 'none' }}
      />
      {token && (
        <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginLeft: '20px' }}>
          Đăng xuất
        </Button>
      )}
    </div>
  );
};

export default Navbar;
