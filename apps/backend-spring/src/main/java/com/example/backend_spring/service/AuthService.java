package com.example.backend_spring.service;

import com.example.backend_spring.dto.AuthResponse;
import com.example.backend_spring.dto.ForgotPasswordRequest;
import com.example.backend_spring.dto.LoginRequest;
import com.example.backend_spring.dto.RegisterRequest;
import com.example.backend_spring.dto.ResetPasswordRequest;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.enums.Role;
import com.example.backend_spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        String username = request.getUsername() != null ? request.getUsername().trim() : "";
        String email = request.getEmail() != null ? request.getEmail().trim() : "";
        String password = request.getPassword() != null ? request.getPassword() : "";
        String fullName = request.getFullName() != null ? request.getFullName().trim() : "";

        if (username.isBlank()) {
            throw new RuntimeException("Username không được để trống");
        }

        if (email.isBlank()) {
            throw new RuntimeException("Email không được để trống");
        }

        if (password.isBlank()) {
            throw new RuntimeException("Mật khẩu không được để trống");
        }

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username đã tồn tại");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email đã tồn tại");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .role(Role.USER)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return buildAuthResponse(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {
        String usernameOrEmail = request.getUsernameOrEmail() != null
                ? request.getUsernameOrEmail().trim()
                : "";

        if (usernameOrEmail.isBlank()) {
            throw new RuntimeException("Vui lòng nhập tài khoản hoặc email");
        }

        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác");
        }

        if (user.getActive() != null && !user.getActive()) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }

        String token = jwtService.generateToken(user);

        return buildAuthResponse(user, token);
    }

    public Map<String, Object> forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim() : "";

        if (email.isBlank()) {
            throw new RuntimeException("Email không được để trống");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));

        if (user.getActive() != null && !user.getActive()) {
            throw new RuntimeException("Tài khoản đã bị khóa");
        }

        String resetToken = UUID.randomUUID().toString();

        user.setResetPasswordToken(resetToken);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(30));

        userRepository.save(user);

        return Map.of(
                "message", "Đã tạo yêu cầu đặt lại mật khẩu. Token có hiệu lực trong 30 phút.",
                "token", resetToken
        );
    }

    public Map<String, Object> resetPassword(ResetPasswordRequest request) {
        String token = request.getToken() != null ? request.getToken().trim() : "";
        String newPassword = request.getNewPassword() != null ? request.getNewPassword() : "";

        if (token.isBlank()) {
            throw new RuntimeException("Token không hợp lệ");
        }

        if (newPassword.isBlank()) {
            throw new RuntimeException("Mật khẩu mới không được để trống");
        }

        if (newPassword.length() < 6) {
            throw new RuntimeException("Mật khẩu mới phải có ít nhất 6 ký tự");
        }

        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ hoặc không tồn tại"));

        LocalDateTime expiryTime = user.getResetPasswordTokenExpiry();

        if (expiryTime == null || expiryTime.isBefore(LocalDateTime.now())) {
            user.setResetPasswordToken(null);
            user.setResetPasswordTokenExpiry(null);
            userRepository.save(user);

            throw new RuntimeException("Token đã hết hạn. Vui lòng gửi lại yêu cầu quên mật khẩu");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);

        userRepository.save(user);

        return Map.of("message", "Đặt lại mật khẩu thành công");
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}