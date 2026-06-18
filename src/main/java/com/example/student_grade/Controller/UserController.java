package com.example.student_grade.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.Dto.LoginDto;
import com.example.Dto.RegisterDto;
import com.example.student_grade.Service.UserService;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/api/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto dtoRegister) {
        try {
            userService.Register(dtoRegister);
            System.out.println("Dang ky thanh cong: " + dtoRegister.getUserName());
            return ResponseEntity.ok("Register success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dtoLogin) {
        try {
            userService.Login(dtoLogin);
            System.out.println("Dang nhap thanh cong: " + dtoLogin.getEmail());
            return ResponseEntity.ok("Login success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
