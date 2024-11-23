package com.flowcraft.backend.mongodb.repository;

import com.flowcraft.backend.mongodb.model.entity.User;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    @NonNull
    @Override
    Optional<User> findById(@NonNull String id);

    @Override
    @NonNull
    List<User> findAll();
}
