package com.flowcraft.backend.mongodb.model;

import com.flowcraft.backend.mongodb.model.entity.Student;
import com.flowcraft.backend.mongodb.model.entity.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Repräsentiert ein Studentenmodell, das zusätzliche Informationen zum Studiengang enthält.")
public class StudentModel extends BaseUserModel {

    @Schema(description = "Studiengang des Studenten.")
    private final String courseOfStudy;

    @Schema(description = "Eindeutiger Identifier für den Studiengang.")
    private final String courseOfStudyUnique;

    @Schema(description = "Kurzbezeichnung des Studiengangs.")
    private final String courseOfStudyShort;

    @Schema(description = "Name des Studiengangs.")
    private final String courseOfStudyName;

    @Schema(description = "Studienniveau (z. B. Bachelor, Master).")
    private final String level;

    @Schema(description = "Prüfungsordnung.")
    private final String examRegulation;

    /**
     * Konstruktor zur Erstellung eines StudentModel-Objekts.
     *
     * @param user    Das Benutzerobjekt, das allgemeine Informationen enthält.
     * @param student Das Studentenobjekt, das spezifische Studieninformationen enthält.
     * @throws IllegalArgumentException Falls das Studentenobjekt null ist.
     */
    public StudentModel(final User user, final Student student) {
        super(user);
        if (student == null) {
            throw new IllegalArgumentException("Student cannot be null");
        }
        this.courseOfStudy = student.getCourseOfStudy();
        this.courseOfStudyUnique = student.getCourseOfStudyUnique();
        this.courseOfStudyShort = student.getCourseOfStudyShort();
        this.courseOfStudyName = student.getCourseOfStudyName();
        this.level = student.getLevel();
        this.examRegulation = student.getExamRegulation();
    }
}
