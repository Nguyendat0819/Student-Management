package com.example.student_grade.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.student_grade.Model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByEmail(String email);
}
