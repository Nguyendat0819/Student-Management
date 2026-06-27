package com.example.Dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GradesDto {
    private int id;
    private int grades_id;
    private String userName;
    private String email;
    private String role;
    private String subject_name;

    private float diem_cc1;

    private float diem_cc2;

    private float diem_gk;

    private float diem_ck;

}
