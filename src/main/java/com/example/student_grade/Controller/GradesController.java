package com.example.student_grade.Controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import com.example.student_grade.Service.GradesService;

@RestController
public class GradesController {
    @Autowired
    GradesService gradesService;

    @PostMapping("/api/grades")
    public ResponseEntity<?> importGrades(@RequestBody Map<String, Float> grades) {
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
}
