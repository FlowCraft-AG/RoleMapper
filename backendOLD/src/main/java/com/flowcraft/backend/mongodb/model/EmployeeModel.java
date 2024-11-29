package com.flowcraft.backend.mongodb.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.flowcraft.backend.mongodb.model.entity.Employee;
import com.flowcraft.backend.mongodb.model.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.ToString;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id", "userId", "userType", "userRole", "orgUnit", "active",
    "validFrom", "validUntil", "costCenter", "department"
})
@Getter
@ToString(callSuper = true)
@Schema(description = "Repräsentiert ein Mitarbeiter-Modell, das zusätzliche Informationen zur Kostenstelle und Abteilung enthält.")
public class EmployeeModel extends BaseUserModel {

    @Schema(description = "Kostenstelle des Mitarbeiters.")
    private final String costCenter;

    @Schema(description = "Abteilung des Mitarbeiters.")
    private final String department;

    /**
     * Konstruktor zur Erstellung eines EmployeeModel-Objekts.
     *
     * @param user     Das Benutzerobjekt, das allgemeine Informationen enthält.
     * @param employee Das Mitarbeiterobjekt, das spezifische Informationen enthält.
     * @throws IllegalArgumentException Falls das Mitarbeiterobjekt null ist.
     */
    public EmployeeModel(final User user, final Employee employee) {
        super(user);
        if (employee == null) {
            throw new IllegalArgumentException("Employee cannot be null");
        }
        this.costCenter = employee.getCostCenter();
        this.department = employee.getDepartment();
    }
}
