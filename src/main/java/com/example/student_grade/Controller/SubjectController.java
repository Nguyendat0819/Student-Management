package com.example.student_grade.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.student_grade.Model.Subject;
import com.example.student_grade.Service.SubjectService;

@RestController
public class SubjectController {
    @Autowired
    private SubjectService subjectService;

    @PostMapping("/api/subject")
    public ResponseEntity<?> addSubject(@RequestBody Subject data) {
        try {
            subjectService.addSubject(data);
            return ResponseEntity.ok("Nhap mon thanh cong");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Hệ thống đang gặp sự cố, vui lòng thử lại sau!");
        }
    }

    @GetMapping("/api/subject")
    public ResponseEntity<?> getAllSubject() {
        try {
            List<Subject> subjects = subjectService.getAllSubject();
            return ResponseEntity.ok(subjects);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Hệ thống đang gặp sự cố, vui lòng thử lại sau!");
        }
    }
}
