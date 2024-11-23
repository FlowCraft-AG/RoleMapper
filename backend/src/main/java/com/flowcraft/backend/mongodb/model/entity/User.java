package com.flowcraft.backend.mongodb.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "HKA_Users_Orig")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;
    private String userId;
    private String userType;
    private String userRole;
    private String orgUnit;
    private boolean active;
    private Student student;
    private Employee employee;
    @CreatedDate
    private LocalDateTime validFrom;
    @LastModifiedDate
    private LocalDateTime validUntil;

    @Getter
    @Setter
    @ToString
    private static class Student {
        @Id
        private String id;
        @Field("id")
        private String courseOfStudy;
        private String courseOfStudyUnique;
        private String courseOfStudyShort;
        private String courseOfStudyName;
        private String level;
        private String examRegulation;
    }

    @Getter
    @Setter
    @ToString
    private static class Employee {
        private String costCenter;
        private String department;
    }
}
