package com.example.backend_spring.repository;

import com.example.backend_spring.entity.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {

    List<ForumPost> findAllByOrderByCreatedAtDesc();

    List<ForumPost> findByCategoryIdOrderByCreatedAtDesc(Long categoryId);

    boolean existsByCategoryId(Long categoryId);
}