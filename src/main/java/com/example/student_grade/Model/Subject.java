package com.example.student_grade.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "subject")
@Getter
@Setter
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Id;

    @Column(name = "subject_name", nullable = false, length = 255)
    private String subject_name;

    @Column(nullable = false, name = "coefficient", length = 255)
    private String coefficient;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<Grades> grades;

}
