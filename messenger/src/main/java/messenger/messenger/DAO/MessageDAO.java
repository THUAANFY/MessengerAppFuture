package messenger.messenger.DAO;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import messenger.messenger.Models.Message;
import messenger.messenger.Models.User;

@Repository
public interface MessageDAO extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE (m.sender = ?1 AND m.receiver = ?2) OR (m.sender = ?2 AND m.receiver = ?1) ORDER BY m.createdAt")
    List<Message> findConversation(User user1, User user2);
    
    @Query("SELECT m FROM Message m WHERE m.receiver = ?1 AND m.isRead = false")
    List<Message> findUnreadMessages(User user);
    
    @Query("SELECT DISTINCT m.sender FROM Message m WHERE m.receiver = ?1 AND m.isRead = false")
    List<User> findUsersWithUnreadMessages(User user);
    
    @Query("SELECT m FROM Message m WHERE m.receiver = ?1 ORDER BY m.createdAt DESC")
    List<Message> findReceivedMessages(User user);
    
    @Query(value = "SELECT m.* FROM Messages m WHERE " +
        "(m.SenderId = ?1 AND m.ReceiverId = ?2) OR (m.SenderId = ?2 AND m.ReceiverId = ?1) " +
        "ORDER BY m.createdAt DESC LIMIT 1", nativeQuery = true)
    Message findLastMessage(Long user1Id, Long user2Id);
}
