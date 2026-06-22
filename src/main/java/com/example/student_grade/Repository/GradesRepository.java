package com.example.student_grade.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.student_grade.Model.*;

public interface GradesRepository extends JpaRepository<Grades, Integer> {

}