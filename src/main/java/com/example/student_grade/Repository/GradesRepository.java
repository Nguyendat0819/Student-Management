package com.example.student_grade.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.student_grade.Model.*;
import com.example.Dto.GradesDto;

import java.util.Optional;

public interface GradesRepository extends JpaRepository<Grades, Integer> {
    Optional<Grades> findFirstByUserAndSubject(User user, Subject subject);

    @Query("""
            SELECT new com.example.Dto.GradesDto(
                u.id,
                g.id,
                u.userName,
                u.email,
                u.role,
                s.subject_name,
                g.diem_cc1,
                g.diem_cc2,
                g.diem_gk,
                g.diem_ck
            )
            FROM Grades g
            JOIN g.user u
            JOIN g.subject s
            WHERE u.role = 'student'
            """)
    List<GradesDto> getGrades();
}