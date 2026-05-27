package com.example.backend_spring.repository;

import com.example.backend_spring.entity.ForumCommentLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ForumCommentLikeRepository extends JpaRepository<ForumCommentLike, Long> {

    boolean existsByCommentIdAndUserId(Long commentId, Long userId);

    Optional<ForumCommentLike> findByCommentIdAndUserId(Long commentId, Long userId);
}