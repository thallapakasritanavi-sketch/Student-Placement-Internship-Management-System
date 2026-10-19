package com.sritanavi.placement.service;

import com.sritanavi.placement.dto.NotificationDto;
import com.sritanavi.placement.entity.Notification;
import com.sritanavi.placement.entity.User;
import com.sritanavi.placement.exception.ResourceNotFoundException;
import com.sritanavi.placement.repository.NotificationRepository;
import com.sritanavi.placement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Notification createNotification(User user, String title, String message, String type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type != null ? type : "INFO");
        notification.setIsRead(false);
        return notificationRepository.save(notification);
    }

    public void createNotificationForUserId(Long userId, String title, String message, String type) {
        userRepository.findById(userId).ifPresent(user -> createNotification(user, title, message, type));
    }

    public List<NotificationDto> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        List<Notification> unread = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    private NotificationDto mapToDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setUserId(n.getUser() != null ? n.getUser().getId() : null);
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setIsRead(n.getIsRead());
        dto.setType(n.getType());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
