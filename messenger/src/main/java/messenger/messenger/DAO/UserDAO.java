package messenger.messenger.DAO;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import messenger.messenger.Models.User;

@Repository
public interface UserDAO extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
    @Query("SELECT u FROM User u WHERE u.username LIKE %?1% OR u.fullName LIKE %?1%")
    List<User> searchUsers(String keyword);
}
