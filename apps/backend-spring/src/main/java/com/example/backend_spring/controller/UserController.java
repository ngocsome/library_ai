package com.example.backend_spring.controller;

import com.example.backend_spring.dto.user.ChangePasswordRequest;
import com.example.backend_spring.dto.user.UpdateProfileRequest;
import com.example.backend_spring.dto.user.UserProfileResponse;
import com.example.backend_spring.service.JwtService;
import com.example.backend_spring.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping("/me")
    public ResponseEntity<?> getMe(HttpServletRequest request) {
        try {
            String username = getUsernameFromRequest(request);
            UserProfileResponse response = userService.getMe(username);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(
            HttpServletRequest request,
            @RequestBody UpdateProfileRequest updateProfileRequest
    ) {
        try {
            String username = getUsernameFromRequest(request);
            UserProfileResponse response = userService.updateMe(username, updateProfileRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            HttpServletRequest request,
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest
    ) {
        try {
            String username = getUsernameFromRequest(request);
            userService.changePassword(username, changePasswordRequest);
            return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/activity")
    public ResponseEntity<?> getActivity() {
        return ResponseEntity.ok(userService.getActivity());
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