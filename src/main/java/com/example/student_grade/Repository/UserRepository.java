package com.example.student_grade.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.student_grade.Model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByEmail(String email);

    @Query("""
                    SELECT new com.example.Dto.LoginDto(
                        u.email,
                        u.password
                    )
                    FROM User u
                    where u.email = :email
            """)
    com.example.Dto.LoginDto findLoginData(@Param("email") String email);
}
