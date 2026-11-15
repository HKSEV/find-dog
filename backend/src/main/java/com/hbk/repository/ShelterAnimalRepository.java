package com.hbk.repository;


import com.hbk.domain.ShelterStatus;
import com.hbk.entity.ShelterAnimal;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface ShelterAnimalRepository extends JpaRepository<ShelterAnimal, Long> {

    List<ShelterAnimal> findByStatus(ShelterStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from ShelterAnimal a where a.id = :id")
    Optional<ShelterAnimal> findByIdForUpdate(@Param("id") Long id);

}
