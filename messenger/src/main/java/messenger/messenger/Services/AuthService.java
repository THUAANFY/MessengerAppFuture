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
        // Mã hóa mật khẩu trước khi lưu (nên sử dụng BCrypt)
        // user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userDAO.save(user);
    }
    
    public User login(String username, String password) {
        User user = userDAO.findByUsername(username);
        if (user != null) {
            // Kiểm tra mật khẩu (nên sử dụng BCrypt để so sánh)
            // if (passwordEncoder.matches(password, user.getPassword())) {
            if (password.equals(user.getPassword())) {
                return user;
            }
        }
        return null;
    }
    
    public boolean isUsernameExists(String username) {
        return userDAO.findByUsername(username) != null;
    }
    
    public boolean isEmailExists(String email) {
        return userDAO.findByEmail(email) != null;
    }
}
