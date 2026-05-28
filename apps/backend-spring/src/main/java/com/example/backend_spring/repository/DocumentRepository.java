package com.example.backend_spring.repository;

import com.example.backend_spring.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByApprovedTrueOrderByCreatedAtDesc();

    List<Document> findByCategoryIdAndApprovedTrueOrderByCreatedAtDesc(Long categoryId);

    boolean existsByCategoryId(Long categoryId);
}