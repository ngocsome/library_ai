package com.example.backend_spring.controller;

import com.example.backend_spring.service.JwtService;
import com.example.backend_spring.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<?> getNotifications(HttpServletRequest request) {
        try {
            String username = getUsernameFromRequest(request);
            return ResponseEntity.ok(notificationService.getNotifications(username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        try {
            String username = getUsernameFromRequest(request);
            return ResponseEntity.ok(notificationService.markAsRead(id, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(HttpServletRequest request) {
        try {
            String username = getUsernameFromRequest(request);
            return ResponseEntity.ok(notificationService.markAllAsRead(username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        try {
            String username = getUsernameFromRequest(request);
            return ResponseEntity.ok(notificationService.deleteNotification(id, username));
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
}