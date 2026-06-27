package com.example.student_grade.Service;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Dto.GradesDto;
import com.example.student_grade.Model.Grades;
import com.example.student_grade.Model.User;
import com.example.student_grade.Model.Subject;
import com.example.student_grade.Repository.GradesRepository;
import com.example.student_grade.Repository.UserRepository;
import com.example.student_grade.Repository.SubjectRepository;

@Service
public class GradesService {
    @Autowired
    private GradesRepository gRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public void ImportGrades(Map<String, String> grades) {
        if (!grades.containsKey("user_id") || grades.get("user_id").isEmpty()) {
            throw new IllegalArgumentException("Vui long chon hoc sinh");
        }
        if (!grades.containsKey("subject_id") || grades.get("subject_id").isEmpty()) {
            throw new IllegalArgumentException("Vui long chon mon hoc");
        }

        User user = userRepository.findById(Integer.parseInt(grades.get("user_id")))
                .orElseThrow(() -> new IllegalArgumentException("khong tim thay User"));

        Subject subject = subjectRepository.findById(Integer.parseInt(grades.get("subject_id")))
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay mon hoc"));

        // Lấy bản ghi điểm đã có, hoặc tạo mới nếu chưa có
        Grades grade = gRepository.findFirstByUserAndSubject(user, subject)
                .orElse(new Grades());

        grade.setUser(user);
        grade.setSubject(subject);
        grade.setDiem_cc1(Float.parseFloat(grades.get("diem_cc1")));
        grade.setDiem_cc2(Float.parseFloat(grades.get("diem_cc2")));
        grade.setDiem_gk(Float.parseFloat(grades.get("diem_gk")));
        grade.setDiem_ck(Float.parseFloat(grades.get("diem_ck")));

        gRepository.save(grade);
        System.out.println("Nhap diem thanh cong");
    }

    public List<GradesDto> getGrades() {
        List<GradesDto> ktramList = gRepository.getGrades();
        System.out.println("Kiem tra so luong: " + ktramList.size());
        return gRepository.getGrades();
    }

    public void deleteGrades(Integer id) {
        Grades existGrades = gRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay Id: " + id));
        gRepository.delete(existGrades);
        System.out.println("Xoa thanh cong Diem");
    }
}
