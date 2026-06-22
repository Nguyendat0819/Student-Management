package com.example.student_grade.Service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.student_grade.Model.Grades;
import com.example.student_grade.Repository.GradesRepository;

@Service
public class GradesService {
    @Autowired
    private GradesRepository gRepository;

    public void ImportGrades(Map<String, Float> grades) {
        Grades grade = new Grades();

        grade.setDiem_cc1(grades.get("diem_cc1"));
        grade.setDiem_cc2(grades.get("diem_cc2"));
        grade.setDiem_gk(grades.get("diem_gk"));
        grade.setDiem_ck(grades.get("diem_ck"));

        gRepository.save(grade);
        System.out.println("Nhap diem thanh cong");
    }
}
