package messenger.messenger.Services;

import org.springframework.stereotype.Service;

import messenger.messenger.DAO.UserDAO;
import messenger.messenger.Models.User;

@Service
public class AuthService {
    private final UserDAO userDAO;

    public AuthService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public User register(User user) {
        // Lưu mật khẩu plain text
        return userDAO.save(user);
    }

    public User login(String username, String password) {
        User user = userDAO.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}
