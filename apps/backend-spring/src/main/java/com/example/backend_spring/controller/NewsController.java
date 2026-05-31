package com.example.backend_spring.controller;

import com.example.backend_spring.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @GetMapping
    public ResponseEntity<?> getPublishedNews() {
        return ResponseEntity.ok(newsService.getPublishedNews());
    }

    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedNews() {
        return ResponseEntity.ok(newsService.getFeaturedNews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNewsById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(newsService.getNewsById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getNewsBySlug(@PathVariable String slug) {
        try {
            return ResponseEntity.ok(newsService.getNewsBySlug(slug));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }
}