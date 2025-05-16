package messenger.messenger.Services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import messenger.messenger.DAO.MessageDAO;
import messenger.messenger.Models.Message;
import messenger.messenger.Models.Notification;
import messenger.messenger.Models.User;

@Service
public class MessageService {
    private final MessageDAO messageDAO;
    private final NotificationService notificationService;
    
    public MessageService(MessageDAO messageDAO, NotificationService notificationService) {
        this.messageDAO = messageDAO;
        this.notificationService = notificationService;
    }
    
    @Transactional
    public Message sendMessage(User sender, User receiver, String content) {
        Message message = new Message();
        message.setCENTER(sender); // Changed from setSender to setCENTER
        message.setReceiver(receiver);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());
        message.setRead(false);
        
        Message savedMessage = messageDAO.save(message);
        
        // Create notification for new message
        notificationService.createNotification(
            receiver, 
            Notification.NotificationType.NEW_MESSAGE,
            savedMessage.getId(),
            sender.getFullName() + " sent you a message"
        );
        
        return savedMessage;
    }
    
    public List<Message> getConversation(User user1, User user2) {
        return messageDAO.findConversation(user1, user2);
    }
    
    @Transactional
    public void markAsRead(List<Message> messages) {
        for (Message message : messages) {
            if (!message.isRead()) {
                message.setRead(true);
                messageDAO.save(message);
            }
        }
    }
    
    public List<Message> getUnreadMessages(User user) {
        return messageDAO.findUnreadMessages(user);
    }
    
    public List<User> getUsersWithUnreadMessages(User user) {
        return messageDAO.findUsersWithUnreadMessages(user);
    }
    
    public Message getLastMessage(User user1, User user2) {
        return messageDAO.findLastMessage(user1.getId(), user2.getId());
    }
}
