package com.example.backend_spring.controller;

import com.example.backend_spring.dto.forum.CreateCommentRequest;
import com.example.backend_spring.dto.forum.CreatePostRequest;
import com.example.backend_spring.service.ForumService;
import com.example.backend_spring.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;
    private final JwtService jwtService;

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(forumService.getCategories());
    }

    @GetMapping("/posts")
    public ResponseEntity<?> getPosts(@RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(forumService.getPosts(categoryId));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<?> getPostById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        try {
            String username = getOptionalUsernameFromRequest(request);
            return ResponseEntity.ok(forumService.getPostById(id, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/posts")
    public ResponseEntity<?> createPost(
            @Valid @RequestBody CreatePostRequest request,
            HttpServletRequest httpServletRequest
    ) {
        try {
            String username = getUsernameFromRequest(httpServletRequest);
            return ResponseEntity.ok(forumService.createPost(request, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody CreateCommentRequest request,
            HttpServletRequest httpServletRequest
    ) {
        try {
            String username = getUsernameFromRequest(httpServletRequest);
            return ResponseEntity.ok(forumService.addComment(postId, request, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<?> likePost(
            @PathVariable Long id,
            HttpServletRequest httpServletRequest
    ) {
        try {
            String username = getUsernameFromRequest(httpServletRequest);
            return ResponseEntity.ok(forumService.likePost(id, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/posts/{id}/like")
    public ResponseEntity<?> unlikePost(
            @PathVariable Long id,
            HttpServletRequest httpServletRequest
    ) {
        try {
            String username = getUsernameFromRequest(httpServletRequest);
            return ResponseEntity.ok(forumService.unlikePost(id, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private String getUsernameFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Thiếu token đăng nhập");
        }

        String token = authHeader.substring(7);
        return jwtService.extractUsername(token);
    }

    private String getOptionalUsernameFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        String token = authHeader.substring(7);
        return jwtService.extractUsername(token);
    }
}