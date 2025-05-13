package messenger.messenger.DTO;

import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginDTO {
    @NotBlank(message = "Tên đăng nhập hoặc mật khẩu không được để trống")
    // @Size(min = 3, max = 50, message = "Tên đăng nhập phải từ 3 đến 50 ký tự")
    private String username;
    
    @NotBlank(message = "Tên đăng nhập hoặc mật khẩu không được để trống")
    // @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;
    
    private boolean rememberMe;
}
