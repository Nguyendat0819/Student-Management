package com.example.student_grade.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
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
    public ResponseEntity<?> getAllSubject(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Subject> subjectsPage = subjectService.getAllSubject(pageable);
            return ResponseEntity.ok(subjectsPage);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Hệ thống đang gặp sự cố, vui lòng thử lại sau!");
        }
    }

    @PutMapping("/api/subject/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable int id, @RequestBody Subject updateData) {
        try {
            updateData.setId(id);
            subjectService.putSubject(updateData);
            System.out.println("Cập nhật thành công môn học");
            return ResponseEntity.ok("Sửa môn học thành công");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi chi tiết " + e.getMessage() + "(" + e.getClass().getSimpleName() + ")");
        }
    }

    @DeleteMapping("/api/subject/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable int id) {
        try {
            subjectService.deleteSubject(id);
            return ResponseEntity.ok("Xóa môn học thành công");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống: " + e.getMessage() + " (" + e.getClass().getSimpleName() + ")");
        }
    }
}
