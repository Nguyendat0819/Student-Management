package com.example.student_grade.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.example.student_grade.Repository.SubjectRepository;
import com.example.student_grade.Model.Subject;
import java.util.List;

@Service
public class SubjectService {
    @Autowired
    private SubjectRepository subjectRepos;

    public void addSubject(Subject data) throws Exception {
        Subject subject = subjectRepos.findBySubject_name(data.getSubject_name());
        if (subject != null) {
            throw new IllegalArgumentException("Da co trong subject roi");
        }
        Subject newSubject = new Subject();
        newSubject.setSubject_name(data.getSubject_name());
        newSubject.setCoefficient(data.getCoefficient());
        subjectRepos.save(newSubject);
        System.out.println("Nhap mon thanh cong");
    }

    public Page<Subject> getAllSubject(Pageable pageable, String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return subjectRepos.searchSubject(keyword.trim(), pageable);
        }
        return subjectRepos.findAll(pageable);
    }

    public Subject putSubject(Subject updateData) throws Exception {
        Subject existingSubject = subjectRepos.findById(updateData.getId())
                .orElseThrow(() -> {
                    System.out.println("khong tim thay mon hoc");
                    return new IllegalArgumentException("khong tim thay mon hoc");
                });

        if (!existingSubject.getSubject_name().equals(updateData.getSubject_name())) {
            Subject duplicaSubject = subjectRepos.findBySubject_name(updateData.getSubject_name());
            if (duplicaSubject != null) {
                System.out.println("Ten mon hoc da ton tai");
                throw new IllegalArgumentException("Tên môn học đã tồn tại");
            }
        }
        existingSubject.setSubject_name(updateData.getSubject_name());
        existingSubject.setCoefficient(updateData.getCoefficient());

        return subjectRepos.save(existingSubject);
    }

    public void deleteSubject(Integer id) {
        Subject existingSubject = subjectRepos.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học có ID: " + id));

        subjectRepos.delete(existingSubject);
    }
}
