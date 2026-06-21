package com.example.student_grade.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "grades")
@Getter
@Setter

public class Grades {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Id;    

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @Column(name = "diem_cc1", nullable = false)
    private float diem_cc1;

    @Column(name = "diem_cc2", nullable = false)
    private float diem_cc2;

    @Column(name = "diem_gk", nullable = false)
    private float diem_gk;

    @Column(name = "diem_ck", nullable = false)
    private float diem_ck;

}
