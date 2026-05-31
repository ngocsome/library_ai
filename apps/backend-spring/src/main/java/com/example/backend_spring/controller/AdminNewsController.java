package com.example.backend_spring.controller;

import com.example.backend_spring.dto.news.NewsRequest;
import com.example.backend_spring.service.JwtService;
import com.example.backend_spring.service.NewsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/news")
@RequiredArgsConstructor
public class AdminNewsController {

    private final NewsService newsService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<?> getAllNews(HttpServletRequest request) {
        try {
            getUsernameFromRequest(request);
            return ResponseEntity.ok(newsService.getAllNewsForAdmin());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @PostMapping
    public ResponseEntity<?> createNews(
            @RequestBody NewsRequest newsRequest,
            HttpServletRequest request
    ) {
        try {
            getUsernameFromRequest(request);
            return ResponseEntity.ok(newsService.createNews(newsRequest));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNews(
            @PathVariable Long id,
            @RequestBody NewsRequest newsRequest,
            HttpServletRequest request
    ) {
        try {
            getUsernameFromRequest(request);
            return ResponseEntity.ok(newsService.updateNews(id, newsRequest));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNews(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        try {
            getUsernameFromRequest(request);
            return ResponseEntity.ok(
                    Map.of("message", newsService.deleteNews(id))
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
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
}