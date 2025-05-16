package messenger.messenger.DAO;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import messenger.messenger.Models.Friendship;
import messenger.messenger.Models.User;

@Repository
public interface FriendshipDAO extends JpaRepository<Friendship, Long> {
    @Query("SELECT f FROM Friendship f WHERE (f.user = ?1 AND f.friend = ?2) OR (f.user = ?2 AND f.friend = ?1)")
    Friendship findFriendship(User user1, User user2);
    
    @Query("SELECT f FROM Friendship f WHERE f.user = ?1 AND f.status = 'ACCEPTED'")
    List<Friendship> findAcceptedFriendships(User user);
    
    @Query("SELECT f FROM Friendship f WHERE f.friend = ?1 AND f.status = 'ACCEPTED'")
    List<Friendship> findAcceptedFriendshipsAsReceiver(User user);
    
    @Query("SELECT f FROM Friendship f WHERE f.friend = ?1 AND f.status = 'PENDING'")
    List<Friendship> findPendingFriendRequests(User user);
    
    @Query("SELECT f.friend FROM Friendship f WHERE f.user = ?1 AND f.status = 'ACCEPTED'")
    List<User> findFriends(User user);
    
    @Query("SELECT f.user FROM Friendship f WHERE f.friend = ?1 AND f.status = 'ACCEPTED'")
    List<User> findFriendsAsReceiver(User user);
}
