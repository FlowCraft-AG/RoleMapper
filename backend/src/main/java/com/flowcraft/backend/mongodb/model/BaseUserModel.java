package com.flowcraft.backend.mongodb.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.flowcraft.backend.mongodb.model.entity.User;
import lombok.Getter;
import lombok.ToString;
import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id", "userId", "userType", "userRole", "orgUnit", "active",
    "validFrom", "validUntil"
})
@Getter
@ToString(callSuper = true)
public class BaseUserModel extends RepresentationModel<BaseUserModel> {

    private final String id;
    private final String userId;
    private final String userType;
    private final String userRole;
    private final String orgUnit;
    private final boolean active;
    private final LocalDateTime validFrom;
    private final LocalDateTime validUntil;

    public BaseUserModel(final User user) {
        this.id = user.getId();
        this.userId = user.getUserId();
        this.userType = user.getUserType();
        this.userRole = user.getUserRole();
        this.orgUnit = user.getOrgUnit();
        this.active = user.isActive();
        this.validFrom = user.getValidFrom();
        this.validUntil = user.getValidUntil();
    }
}
