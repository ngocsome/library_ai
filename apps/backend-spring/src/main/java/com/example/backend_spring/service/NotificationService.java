package com.example.backend_spring.service;

import com.example.backend_spring.dto.notification.NotificationResponse;
import com.example.backend_spring.entity.Notification;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.repository.NotificationRepository;
import com.example.backend_spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationResponse> getNotifications(String username) {
        User user = getUserByUsername(username);

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public NotificationResponse markAsRead(Long id, String username) {
        User user = getUserByUsername(username);

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền cập nhật thông báo này");
        }

        notification.setReadStatus(true);
        Notification saved = notificationRepository.save(notification);

        return toResponse(saved);
    }

    public Map<String, Object> markAllAsRead(String username) {
        User user = getUserByUsername(username);

        List<Notification> notifications =
                notificationRepository.findByUserIdAndReadStatusFalse(user.getId());

        notifications.forEach(notification -> notification.setReadStatus(true));

        notificationRepository.saveAll(notifications);

        return Map.of("message", "Đã đánh dấu tất cả thông báo là đã đọc");
    }

    public Map<String, Object> deleteNotification(Long id, String username) {
        User user = getUserByUsername(username);

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền xóa thông báo này");
        }

        notificationRepository.delete(notification);

        return Map.of("message", "Đã xóa thông báo");
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    private NotificationResponse toResponse(Notification notification) {
        Boolean isRead = notification.getReadStatus() != null && notification.getReadStatus();

        return NotificationResponse.builder()
                .id(notification.getId())
                .NotifID(notification.getId())

                .title(notification.getTitle())
                .Title(notification.getTitle())

                .message(notification.getMessage())
                .Message(notification.getMessage())

                .type(notification.getType())
                .Type(notification.getType())

                .isRead(isRead)
                .IsRead(isRead)

                .createdAt(notification.getCreatedAt())
                .CreatedAt(notification.getCreatedAt())
                .build();
    }
}