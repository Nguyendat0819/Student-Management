package com.example.student_grade.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.Dto.JwtResponse;
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
            JwtResponse response = userService.Login(dtoLogin);
            System.out.println("Dang nhap thanh cong: " + dtoLogin.getEmail());

            return ResponseEntity.ok(response);
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
}
