package messenger.messenger.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import messenger.messenger.DTO.LoginDTO;
import messenger.messenger.DTO.RegisterDTO;
import messenger.messenger.Models.User;
import messenger.messenger.Services.AuthService;

@Controller
public class AuthController {
    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("user", new RegisterDTO());
        return "auth/register";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("user") RegisterDTO registerDTO, BindingResult bindingResult, Model model) {
        // Kiểm tra lỗi validation
        if (bindingResult.hasErrors()) {
            return "auth/register";
        }
        
        // Kiểm tra username đã tồn tại chưa
        if (authService.isUsernameExists(registerDTO.getUsername())) {
            bindingResult.rejectValue("username", "error.user", "Tên đăng nhập đã tồn tại");
            return "auth/register";
        }
        
        // Kiểm tra email đã tồn tại chưa
        if (authService.isEmailExists(registerDTO.getEmail())) {
            bindingResult.rejectValue("email", "error.user", "Email đã được sử dụng");
            return "auth/register";
        }
        
        // Chuyển đổi từ DTO sang User entity
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setPassword(registerDTO.getPassword());
        user.setEmail(registerDTO.getEmail());
        user.setFullName(registerDTO.getFullName());
        
        // Đăng ký người dùng
        authService.register(user);
        return "redirect:/login?registered=true";
    }

    @GetMapping("/login")
    public String showLoginForm(Model model) {
        model.addAttribute("loginDTO", new LoginDTO());
        return "auth/login";
    }

    @PostMapping("/login")
    public String login(@Valid @ModelAttribute("loginDTO") LoginDTO loginDTO, BindingResult bindingResult,HttpSession session) {
        // Kiểm tra lỗi validation
        if (bindingResult.hasErrors()) {
            return "auth/login";
        }
        
        // Thực hiện đăng nhập
        User user = authService.login(loginDTO.getUsername(), loginDTO.getPassword());
        if (user != null) {
            session.setAttribute("user", user);
            return "redirect:/home";
        }
        
        // Đăng nhập thất bại
        bindingResult.reject("error.user", "Tên đăng nhập hoặc mật khẩu không chính xác");
        return "auth/login";
    }

    // @GetMapping("/logout")
    // public String logout(HttpSession session) {
    //     session.invalidate();
    //     return "redirect:/login";
    // }
}
