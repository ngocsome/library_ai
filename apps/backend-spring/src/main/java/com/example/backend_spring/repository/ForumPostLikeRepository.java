package com.example.backend_spring.repository;

import com.example.backend_spring.entity.ForumPostLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ForumPostLikeRepository extends JpaRepository<ForumPostLike, Long> {

    boolean existsByPostIdAndUserId(Long postId, Long userId);

    Optional<ForumPostLike> findByPostIdAndUserId(Long postId, Long userId);

    Long countByPostId(Long postId);
}
