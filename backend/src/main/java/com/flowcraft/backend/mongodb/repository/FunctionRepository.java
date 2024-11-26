package com.flowcraft.backend.mongodb.repository;

import com.flowcraft.backend.mongodb.model.entity.Function;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FunctionRepository extends MongoRepository<Function, String> {

}
