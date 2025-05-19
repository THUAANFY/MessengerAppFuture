package messenger.messenger.Services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import messenger.messenger.DAO.FriendshipDAO;
import messenger.messenger.Models.Friendship;
import messenger.messenger.Models.Notification;
import messenger.messenger.Models.User;

@Service
public class FriendshipService {
    private final FriendshipDAO friendshipDAO;
    private final NotificationService notificationService;
    
    public FriendshipService(FriendshipDAO friendshipDAO, NotificationService notificationService) {
        this.friendshipDAO = friendshipDAO;
        this.notificationService = notificationService;
    }
    
    @Transactional
    public Friendship sendFriendRequest(User sender, User receiver) {
        // Check if friendship already exists
        Friendship existingFriendship = friendshipDAO.findFriendship(sender, receiver);
        if (existingFriendship != null) {
            return existingFriendship;
        }
        
        // Create new friendship request
        Friendship friendship = new Friendship();
        friendship.setUser(sender);
        friendship.setFriend(receiver);
        friendship.setStatus(Friendship.Status.PENDING);
        friendship.setCreatedAt(LocalDateTime.now());
        friendship.setUpdatedAt(LocalDateTime.now());
        
        Friendship savedFriendship = friendshipDAO.save(friendship);
        
        // Create notification for friend request
        notificationService.createNotification(
            receiver, 
            Notification.NotificationType.FRIEND_REQUEST,
            savedFriendship.getId(),
            sender.getFullName() + " sent you a friend request"
        );
        
        return savedFriendship;
    }
    
    @Transactional
    public Friendship respondToFriendRequest(Friendship friendship, boolean accept) {
        if (friendship.getStatus() != Friendship.Status.PENDING) {
            return friendship;
        }
        
        friendship.setStatus(accept ? Friendship.Status.ACCEPTED : Friendship.Status.REJECTED);
        friendship.setUpdatedAt(LocalDateTime.now());
        
        Friendship updatedFriendship = friendshipDAO.save(friendship);
        
        if (accept) {
            // Create notification for accepted friend request
            notificationService.createNotification(
                friendship.getUser(), 
                Notification.NotificationType.FRIEND_ACCEPTED,
                updatedFriendship.getId(),
                friendship.getFriend().getFullName() + " accepted your friend request"
            );
        }
        
        return updatedFriendship;
    }
    
    public List<User> getFriends(User user) {
        List<User> friends1 = friendshipDAO.findFriends(user);
        List<User> friends2 = friendshipDAO.findFriendsAsReceiver(user);
        
        return Stream.concat(friends1.stream(), friends2.stream())
                .distinct()
                .collect(Collectors.toList());
    }
    
    public List<Friendship> getPendingFriendRequests(User user) {
        return friendshipDAO.findPendingFriendRequests(user);
    }
    
    public Friendship getFriendship(User user1, User user2) {
        return friendshipDAO.findFriendship(user1, user2);
    }
    
    public boolean areFriends(User user1, User user2) {
        Friendship friendship = friendshipDAO.findFriendship(user1, user2);
        return friendship != null && friendship.getStatus() == Friendship.Status.ACCEPTED;
    }

    public Friendship getFriendshipById(Long id) {
        return friendshipDAO.findById(id).orElse(null);
    }

}
