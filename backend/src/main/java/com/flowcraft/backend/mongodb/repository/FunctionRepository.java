package com.flowcraft.backend.mongodb.repository;

import com.flowcraft.backend.mongodb.model.entity.Function;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FunctionRepository extends MongoRepository<Function, String> {

    @Query("{ 'user': ?0 }")
    Optional<Function> findByUserKennung(String kennung);

}
