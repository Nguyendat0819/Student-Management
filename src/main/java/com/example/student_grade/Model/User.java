package com.example.student_grade.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "userName")
    private String userName;

    @Column(nullable = false, name = "password", length = 255)
    private String password;

    @Column(nullable = false, name = "email", length = 255, unique = true)
    private String email;

    @Column(name = "role", length = 50)
    private String role;
}
