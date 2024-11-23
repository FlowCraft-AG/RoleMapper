package com.flowcraft.backend.mongodb.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Functions")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Function {
    @Id
    private String id;
    private String name;
    private String orgUnit;
}
