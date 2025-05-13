package messenger.messenger.DAO;

import org.springframework.data.jpa.repository.JpaRepository;

import messenger.messenger.Models.User;

public interface UserDAO extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
}
