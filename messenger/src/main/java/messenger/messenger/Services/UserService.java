package messenger.messenger.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import messenger.messenger.DAO.UserDAO;
import messenger.messenger.Models.User;

@Service
public class UserService {
    @Autowired
    private UserDAO userDAO;
    
    public User getUserById(Long id) {
        return userDAO.findById(id).orElse(null);
    }
    
    public User getUserByUsername(String username) {
        return userDAO.findByUsername(username);
    }
    
    public User getUserByEmail(String email) {
        return userDAO.findByEmail(email);
    }
    
    public void updateUser(User user) {
        userDAO.save(user);
    }
    
    public boolean checkPassword(User user, String rawPassword) {
        // Kiểm tra mật khẩu không mã hóa
        return user.getPassword().equals(rawPassword);
    }
    
    public void updatePassword(User user, String newPassword) {
        // Cập nhật mật khẩu không mã hóa
        user.setPassword(newPassword);
        userDAO.save(user);
    }
}