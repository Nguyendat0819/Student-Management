package com.example.student_grade.Config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.student_grade.Repository.UserRepository;
import com.example.student_grade.Model.User;

@Configuration
public class DataSeeder {
    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0 || !userRepository.existsByRole("teacher")) {
                User teacher = new User();
                teacher.setEmail("nguyendinhdat801@gmail.com");
                teacher.setPassword(passwordEncoder.encode("123"));
                teacher.setRole("teacher");
                userRepository.save(teacher);
                System.out.println("Đã tự động tạo tài khoản giáo viên");
            }
        };
    };
}
