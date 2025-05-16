package messenger.messenger.Services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import messenger.messenger.DAO.NotificationDAO;
import messenger.messenger.Models.Notification;
import messenger.messenger.Models.User;

@Service
public class NotificationService {
    private final NotificationDAO notificationDAO;
    
    public NotificationService(NotificationDAO notificationDAO) {
        this.notificationDAO = notificationDAO;
    }
    
    @Transactional
    public Notification createNotification(User user, Notification.NotificationType type, Long relatedId, String content) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setRelatedId(relatedId);
        notification.setContent(content);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        return notificationDAO.save(notification);
    }
    
    public List<Notification> getUserNotifications(User user) {
        return notificationDAO.findByUserOrderByCreatedAtDesc(user);
    }
    
    public List<Notification> getUnreadNotifications(User user) {
        return notificationDAO.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
    }
    
    public int countUnreadNotifications(User user) {
        return notificationDAO.countUnreadNotifications(user);
    }
    
    @Transactional
    public void markAsRead(Notification notification) {
        notification.setRead(true);
        notificationDAO.save(notification);
    }
    
    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unreadNotifications = notificationDAO.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notificationDAO.save(notification);
        }
    }
}
