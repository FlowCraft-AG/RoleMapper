package com.flowcraft.backend.mongodb.model;

import com.flowcraft.backend.mongodb.model.entity.Employee;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.flowcraft.backend.mongodb.model.entity.User;
import lombok.Getter;
import lombok.ToString;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id", "userId", "userType", "userRole", "orgUnit", "active",
    "validFrom", "validUntil", "costCenter", "department"
})
@Getter
@ToString(callSuper = true)
public class EmployeeModel extends BaseUserModel {

    private final String costCenter;
    private final String department;

    public EmployeeModel(final User user, final Employee employee) {
        super(user);
        this.costCenter = employee.getCostCenter();
        this.department = employee.getDepartment();
    }
}
