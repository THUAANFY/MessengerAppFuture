package messenger.messenger.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import messenger.messenger.DAO.UserDAO;
import messenger.messenger.Models.User;

@Service
public class UserService {
    private final UserDAO userDAO;
    
    public UserService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }
    
    public User getUserById(Long id) {
        return userDAO.findById(id).orElse(null);
    }
    
    public User getUserByUsername(String username) {
        return userDAO.findByUsername(username);
    }
    
    public List<User> searchUsers(String keyword) {
        return userDAO.searchUsers(keyword);
    }
    
    public List<User> getAllUsers() {
        return userDAO.findAll();
    }
}
