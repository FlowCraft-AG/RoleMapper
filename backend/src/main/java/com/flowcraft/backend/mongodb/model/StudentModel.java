package com.flowcraft.backend.mongodb.model;

import com.flowcraft.backend.mongodb.model.entity.Student;
import com.flowcraft.backend.mongodb.model.entity.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.ToString;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id", "userId", "userType", "userRole", "orgUnit", "active",
    "validFrom", "validUntil", "courseOfStudy", "courseOfStudyUnique",
    "courseOfStudyShort", "courseOfStudyName", "level", "examRegulation"
})
@Getter
@ToString(callSuper = true)
public class StudentModel extends BaseUserModel {

    private final String courseOfStudy;
    private final String courseOfStudyUnique;
    private final String courseOfStudyShort;
    private final String courseOfStudyName;
    private final String level;
    private final String examRegulation;

    public StudentModel(final User user, final Student student) {
        super(user);
        this.courseOfStudy = student.getCourseOfStudy();
        this.courseOfStudyUnique = student.getCourseOfStudyUnique();
        this.courseOfStudyShort = student.getCourseOfStudyShort();
        this.courseOfStudyName = student.getCourseOfStudyName();
        this.level = student.getLevel();
        this.examRegulation = student.getExamRegulation();
    }
}
