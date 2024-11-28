package com.flowcraft.backend.mongodb.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "Functions")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Function {
    @Id
    private String id;
    @Field("function_nam")
    private String name;
    @Field("org_unit")
    private String orgUnit;
    private List<String> user;
}
