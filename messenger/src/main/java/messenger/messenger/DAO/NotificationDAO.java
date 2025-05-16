package messenger.messenger.DAO;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import messenger.messenger.Models.Notification;
import messenger.messenger.Models.User;

@Repository
public interface NotificationDAO extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = ?1 AND n.isRead = false")
    int countUnreadNotifications(User user);
}
