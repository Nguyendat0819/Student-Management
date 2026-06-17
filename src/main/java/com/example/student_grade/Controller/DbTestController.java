package com.example.student_grade.Controller;

import java.sql.Connection;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DbTestController {
    @Autowired
    private DataSource dataSource;

    @GetMapping("/api/dbtest")
    public String TestDbConnection() {
        try (Connection connection = dataSource.getConnection()) {
            return "Connected to database: " + connection.getCatalog();
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to connect to database";
        }

    }
}
