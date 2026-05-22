package com.example.backend_spring.repository;

import com.example.backend_spring.entity.ForumComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForumCommentRepository extends JpaRepository<ForumComment, Long> {

    List<ForumComment> findByPostIdOrderByCreatedAtAsc(Long postId);
}