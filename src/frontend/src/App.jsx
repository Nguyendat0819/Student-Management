import { useState } from 'react'
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './layout/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import TeacherGrades from './components/TeacherGrades';
import TeacherSubject from './components/TeacherSubject';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/regist" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* trang cho teacher */}
        <Route path='teacher-dashboard' element={

          <ProtectedRoute requiredRole={'teacher'}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
        />
        <Route path='teacher-grades' element={
          <ProtectedRoute requiredRole={'teacher'}>
            <TeacherGrades />
          </ProtectedRoute>
        }
        />
        <Route path='teacher-subject' element={
          <ProtectedRoute requiredRole={'teacher'}>
            <TeacherSubject />
          </ProtectedRoute>
        }
        />

        <Route path='/student-dashboard' element={
          <ProtectedRoute requiredRole={'student'}>
            <StudentDashboard />
          </ProtectedRoute>
        }
        />
      </Routes>
    </Router>
  );
}

export default App
