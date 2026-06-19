package com.example.student_grade.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.authentication.BadCredentialsException;
import com.example.Dto.LoginDto;
import com.example.Dto.RegisterDto;
import com.example.student_grade.Model.User;
import com.example.student_grade.Repository.*;
import com.example.student_grade.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepo;

    public void Register(RegisterDto dtoRegister) throws Exception {
        if (userRepo.existsByEmail(dtoRegister.getEmail())) {
            throw new Exception("Tài khoản đã tồn tại");
        }
        User user = new User();
        user.setUserName(dtoRegister.getUserName());

        String encodePassword = passwordEncoder.encode(dtoRegister.getPassword());
        user.setPassword(encodePassword);

        user.setEmail(dtoRegister.getEmail());
        userRepo.save(user);
    }

    public void Login(LoginDto dtoLogin) {
        LoginDto user = userRepo.findLoginData(dtoLogin.getEmail());
        if (user == null || !passwordEncoder.matches(dtoLogin.getPassword(), user.getPassword()) ) {
            throw new BadCredentialsException("Email hoặc mật khẩu không đúng");
        }
    }
}
