package com.example.student_grade.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.student_grade.Model.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Integer> {
        @Query("""
                                SELECT s
                                FROM Subject s
                                where s.subject_name = :subject_name
                        """)
        Subject findBySubject_name(@Param("subject_name") String subject_name);

        @Query("""
                        SELECT s
                        FROM Subject s
                        """)
        List<Subject> getAllSubject();

        @Query("""
                        SELECT s
                        FROM Subject s
                        WHERE LOWER(s.subject_name) LIKE(CONCAT('%', :keyword, '%'))
                        """)
        Page<Subject> searchSubject(@Param("keyword") String keyword, Pageable pageable);
}