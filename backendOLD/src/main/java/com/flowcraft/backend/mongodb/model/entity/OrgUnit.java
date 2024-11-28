package com.flowcraft.backend.mongodb.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "OrgUnits")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class OrgUnit {
    @Id
    private String id;
    @Field("id")
    private String orgId;
    private String name;
    private String type;
    private String supervisor;
}
