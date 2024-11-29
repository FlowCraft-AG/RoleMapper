package com.flowcraft.backend.mongodb.repository;

import com.flowcraft.backend.mongodb.model.entity.OrgUnit;
import com.flowcraft.backend.mongodb.model.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrgUnitRepository extends MongoRepository<OrgUnit, String> {

    @NonNull
    @Override
    Optional<OrgUnit> findById(@NonNull String id);

    @NonNull
    Optional<OrgUnit> findByOrgId(@NonNull String orgId);
}
