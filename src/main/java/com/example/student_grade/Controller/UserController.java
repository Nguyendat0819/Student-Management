package com.example.student_grade.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.Dto.LoginDto;
import com.example.Dto.RegisterDto;
import com.example.student_grade.Service.UserService;
import com.example.student_grade.Util.JwtUtil;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

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

            // tao JWT Token
            String token = jwtUtil.generateToken(dtoLogin.getEmail());

            // Tra ve token cho client
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Login success");
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
