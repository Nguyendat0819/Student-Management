package com.example.student_grade.Service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;
import com.example.Dto.LoginDto;
import com.example.student_grade.Repository.UserRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        LoginDto user = userRepository.findLoginData(email);
        if (user == null) {
            throw new UsernameNotFoundException("Khong tim thay email: " + email);
        }
        
        // Cấp quyền (Role) cho User trong Spring Security
        String role = user.getRole() != null ? user.getRole().toUpperCase() : "STUDENT";
        
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));
    }
}
