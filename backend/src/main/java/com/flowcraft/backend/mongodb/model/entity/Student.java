package com.flowcraft.backend.mongodb.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Student {
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
