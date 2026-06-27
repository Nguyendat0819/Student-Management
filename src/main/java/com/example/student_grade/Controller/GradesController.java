package com.example.student_grade.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.example.Dto.GradesDto;
import com.example.student_grade.Model.User;
import com.example.student_grade.Service.GradesService;

@RestController
public class GradesController {
    @Autowired
    GradesService gradesService;

    @PostMapping("/api/grades")
    public ResponseEntity<?> importGrades(@RequestBody Map<String, String> grades) {
        try {
            gradesService.ImportGrades(grades);
            return ResponseEntity.ok("Nhap diem thanh cong");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra màn hình console để biết chính xác lỗi gì
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi chi tiết: " + e.getMessage() + " (" + e.getClass().getSimpleName() + ")");
        }
    }

    @GetMapping("/api/grades-student")
    public ResponseEntity<?> layDanhSachHsinh() {
        try {
            List<GradesDto> danhsachUsers = gradesService.getGrades();
            return ResponseEntity.ok(danhsachUsers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Hệ thống đang gặp sự cố, vui lòng thử lại sau!");
        }
    }

    @DeleteMapping("/api/deleteGrades/{id}")
    public ResponseEntity<?> xoaHsinh(@PathVariable int id) {
        try {
            gradesService.deleteGrades(id);
            return ResponseEntity.ok("Xoa thanh cong");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống: " + e.getMessage() + " (" + e.getClass().getSimpleName() + ")");
        }
    }
}
