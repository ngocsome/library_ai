package com.example.backend_spring.controller;

import com.example.backend_spring.dto.group.CreateGroupRequest;
import com.example.backend_spring.dto.group.SendMessageRequest;
import com.example.backend_spring.service.GroupService;
import com.example.backend_spring.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<?> getGroups() {
        return ResponseEntity.ok(groupService.getGroups());
    }

    @PostMapping
    public ResponseEntity<?> createGroup(
            @Valid @RequestBody CreateGroupRequest request,
            HttpServletRequest httpServletRequest
    ) {
        try {
            String username = getUsernameFromRequest(httpServletRequest);
            return ResponseEntity.ok(groupService.createGroup(request, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinGroup(
            @PathVariable Long id,
            HttpServletRequest httpServletRequest
    ) {
        try {
            String username = getUsernameFromRequest(httpServletRequest);
            return ResponseEntity.ok(groupService.joinGroup(id, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/chats")
    public ResponseEntity<?> getChats(@PathVariable Long id) {
        return ResponseEntity.ok(groupService.getChats(id));
    }

    @PostMapping("/{id}/chats")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long id,
            @Valid @RequestBody SendMessageRequest request,
            HttpServletRequest httpServletRequest
    ) {
        try {
            String username = getUsernameFromRequest(httpServletRequest);
            return ResponseEntity.ok(groupService.sendMessage(id, request, username));
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