package messenger.messenger.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpSession;
import messenger.messenger.Models.User;
import messenger.messenger.Services.UserService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Controller
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private UserService userService;
    
    private final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public String showProfile(HttpSession session, Model model) {
        User user = (User) session.getAttribute("user");
        
        if (user == null) {
            return "redirect:/login";
        }
        
        // Refresh user data from database
        user = userService.getUserById(user.getId());
        model.addAttribute("user", user);
        
        return "profile";
    }
    
    @GetMapping("/edit")
    public String showEditProfile(HttpSession session, Model model) {
        User user = (User) session.getAttribute("user");
        
        if (user == null) {
            return "redirect:/login";
        }
        
        model.addAttribute("user", user);
        return "edit-profile";
    }
    
    @PostMapping("/update")
    public String updateProfile(
            @ModelAttribute User updatedUser,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
            HttpSession session,
            RedirectAttributes redirectAttributes) {
        
        User currentUser = (User) session.getAttribute("user");
        
        if (currentUser == null) {
            return "redirect:/login";
        }
        
        // Update user fields
        currentUser.setFullName(updatedUser.getFullName());
        currentUser.setEmail(updatedUser.getEmail());
        currentUser.setStatus(updatedUser.getStatus());
        currentUser.setBio(updatedUser.getBio());
        currentUser.setUpdatedAt(LocalDateTime.now());
        
        // Handle profile picture upload
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                // Log file information for debugging
                System.out.println("Processing file upload: " + profileImage.getOriginalFilename());
                System.out.println("File size: " + profileImage.getSize() + " bytes");
                System.out.println("Content type: " + profileImage.getContentType());
                
                // Create absolute path to upload directory
                String currentDir = System.getProperty("user.dir");
                Path uploadPath = Paths.get(currentDir, UPLOAD_DIR);
                System.out.println("Upload directory: " + uploadPath.toString());
                
                // Create directory if it doesn't exist
                if (!Files.exists(uploadPath)) {
                    System.out.println("Creating upload directory...");
                    Files.createDirectories(uploadPath);
                }
                
                // Generate unique filename to prevent collisions
                String originalFilename = profileImage.getOriginalFilename();
                String fileExtension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String filename = UUID.randomUUID().toString() + fileExtension;
                Path filePath = uploadPath.resolve(filename);
                System.out.println("Saving file to: " + filePath.toString());
                
                // Delete old profile picture if exists and is not the default
                if (currentUser.getProfilePicture() != null && 
                    currentUser.getProfilePicture().startsWith("/uploads/")) {
                    try {
                        String oldFilename = currentUser.getProfilePicture().substring("/uploads/".length());
                        Path oldFilePath = uploadPath.resolve(oldFilename);
                        System.out.println("Attempting to delete old file: " + oldFilePath.toString());
                        Files.deleteIfExists(oldFilePath);
                    } catch (Exception e) {
                        System.err.println("Failed to delete old profile picture: " + e.getMessage());
                        // Continue with the update even if old file deletion fails
                    }
                }
                
                // Save the file using transferTo method
                profileImage.transferTo(filePath.toFile());
                System.out.println("File saved successfully");
                
                // Update user profile picture path in database
                currentUser.setProfilePicture("/uploads/" + filename);
                System.out.println("Profile picture path updated to: " + currentUser.getProfilePicture());
                
            } catch (IOException e) {
                System.err.println("Error during file upload: " + e.getMessage());
                e.printStackTrace();
                redirectAttributes.addFlashAttribute("error", "Failed to upload profile picture: " + e.getMessage());
                return "redirect:/profile/edit";
            }
        }
        
        try {
            // Save updated user to database
            userService.updateUser(currentUser);
            
            // Update session with new user data
            session.setAttribute("user", currentUser);
            
            redirectAttributes.addFlashAttribute("success", "Profile updated successfully");
            return "redirect:/profile";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Failed to update profile: " + e.getMessage());
            return "redirect:/profile/edit";
        }
    }
    
    @PostMapping("/change-password")
    public String changePassword(
            @RequestParam("currentPassword") String currentPassword,
            @RequestParam("newPassword") String newPassword,
            @RequestParam("confirmPassword") String confirmPassword,
            HttpSession session,
            RedirectAttributes redirectAttributes) {
        
        User user = (User) session.getAttribute("user");
        
        if (user == null) {
            return "redirect:/login";
        }
        
        // Validate passwords
        if (currentPassword.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Current password is required");
            return "redirect:/profile/edit";
        }
        
        if (newPassword.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "New password is required");
            return "redirect:/profile/edit";
        }
        
        if (!newPassword.equals(confirmPassword)) {
            redirectAttributes.addFlashAttribute("error", "New passwords do not match");
            return "redirect:/profile/edit";
        }
        
        // Validate password strength
        if (newPassword.length() < 8) {
            redirectAttributes.addFlashAttribute("error", "Password must be at least 8 characters long");
            return "redirect:/profile/edit";
        }
        
        if (!newPassword.matches(".*[a-zA-Z].*")) {
            redirectAttributes.addFlashAttribute("error", "Password must contain at least one letter");
            return "redirect:/profile/edit";
        }
        
        if (!newPassword.matches(".*[0-9].*")) {
            redirectAttributes.addFlashAttribute("error", "Password must contain at least one number");
            return "redirect:/profile/edit";
        }
        
        if (!newPassword.matches(".*[^a-zA-Z0-9].*")) {
            redirectAttributes.addFlashAttribute("error", "Password must contain at least one special character");
            return "redirect:/profile/edit";
        }
        
        // Check current password
        if (!userService.checkPassword(user, currentPassword)) {
            redirectAttributes.addFlashAttribute("error", "Current password is incorrect");
            return "redirect:/profile/edit";
        }
        
        // Update password
        userService.updatePassword(user, newPassword);
        
        // Update session
        session.setAttribute("user", user);
        
        redirectAttributes.addFlashAttribute("success", "Password changed successfully");
        return "redirect:/profile";
    }
}