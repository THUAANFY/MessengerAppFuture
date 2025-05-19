package messenger.messenger.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import jakarta.servlet.http.HttpSession;
import messenger.messenger.Models.User;

@Controller
public class HomeController {
    @GetMapping("/home")
    public String showHomePage(HttpSession session, Model model) {
        // Get user from session (same as in your AuthController)
        User user = (User) session.getAttribute("user");
        
        // If user is not logged in, redirect to login page
        if (user == null) {
            return "redirect:/login";
        }
        
        // Add user to model so it can be accessed in the view
        model.addAttribute("user", user);
        
        // Return the home view (this will use your home.html template)
        return "index";
    }
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
