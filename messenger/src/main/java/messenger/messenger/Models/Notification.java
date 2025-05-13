package messenger.messenger.Models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private NotificationType type;

    @Column
    private Long relatedId; // ID của tin nhắn hoặc yêu cầu kết bạn

    @Column(nullable = false, length = 255)
    private String content;

    @Column(nullable = false)
    private boolean isRead = false;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum NotificationType {
        NEW_MESSAGE, FRIEND_REQUEST, FRIEND_ACCEPTED
    }
}