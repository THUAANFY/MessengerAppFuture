// Toggle password visibility with animation
function togglePassword(inputId) {
  const passwordInput = document.getElementById(inputId);
  const icon = event.target.closest('button').querySelector('i');

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// Initialize particles.js with fewer particles for better performance
function initParticles() {
  if (typeof particlesJS === 'undefined') {
    console.warn('particlesJS is not defined. Make sure particles.js is included in your project.');
    return;
  }
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 40, // Reduced number of particles
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#00e5ff"
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        },
        polygon: {
          nb_sides: 5
        }
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#00bcd4",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.5, // Reduced speed
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true
  });
}

// Add animation to form elements on page load
document.addEventListener("DOMContentLoaded", () => {
  // Initialize particles
  if (typeof particlesJS !== 'undefined') {
    initParticles();
  }

  // Animate form fields on load with shorter delays
  const formGroups = document.querySelectorAll(".form-group");
  formGroups.forEach((field, index) => {
    field.classList.add("animate__animated", "animate__fadeInUp");
    field.style.animationDelay = `${0.1 + index * 0.05}s`; // Shorter delays
    field.style.animationDuration = "0.5s"; // Faster animation
  });

  // Add hover effect to tech-input-group
  const inputGroups = document.querySelectorAll(".tech-input-group");
  inputGroups.forEach(group => {
    group.addEventListener("mouseenter", () => {
      if (!group.classList.contains("focus-within")) {
        group.style.borderColor = "rgba(0, 229, 255, 0.5)";
      }
    });
    
    group.addEventListener("mouseleave", () => {
      if (!group.classList.contains("focus-within")) {
        group.style.borderColor = "rgba(0, 229, 255, 0.2)";
      }
    });
    
    const input = group.querySelector(".tech-input");
    if (input) {
      input.addEventListener("focus", () => {
        group.classList.add("focus-within");
      });
      
      input.addEventListener("blur", () => {
        group.classList.remove("focus-within");
      });
    }
  });

  // Password strength meter
  const passwordInput = document.getElementById("password");
  const strengthBar = document.getElementById("password-strength");

  if (passwordInput && strengthBar) {
    passwordInput.addEventListener("input", () => {
      const val = passwordInput.value;
      let strength = 0;

      if (val.match(/[a-z]+/)) strength += 1;
      if (val.match(/[A-Z]+/)) strength += 1;
      if (val.match(/[0-9]+/)) strength += 1;
      if (val.match(/[!@#$%^&*()]+/)) strength += 1;

      switch (strength) {
        case 0:
          strengthBar.style.width = "0%";
          strengthBar.style.background = "transparent";
          break;
        case 1:
          strengthBar.style.width = "25%";
          strengthBar.style.background = "#ff1744"; // red
          break;
        case 2:
          strengthBar.style.width = "50%";
          strengthBar.style.background = "#ffab00"; // amber
          break;
        case 3:
          strengthBar.style.width = "75%";
          strengthBar.style.background = "#00bcd4"; // cyan
          break;
        case 4:
          strengthBar.style.width = "100%";
          strengthBar.style.background = "#00e676"; // green
          break;
      }
    });
  }

  // Add ripple effect to buttons
  const buttons = document.querySelectorAll(".tech-btn");
  buttons.forEach(button => {
    button.addEventListener("click", function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement("span");
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.position = "absolute";
      ripple.style.width = "0";
      ripple.style.height = "0";
      ripple.style.borderRadius = "50%";
      ripple.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      ripple.style.transform = "translate(-50%, -50%)";
      ripple.style.animation = "ripple 0.6s linear";
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 700);
    });
  });

  // Add keyframe animation for ripple effect if not already defined
  if (!document.querySelector("style#ripple-animation")) {
    const style = document.createElement("style");
    style.id = "ripple-animation";
    style.textContent = `
      @keyframes ripple {
        to {
          width: 200px;
          height: 200px;
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Highlight validation errors with animation
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((message) => {
    if (message.textContent.trim() !== "") {
      const inputGroup = message.previousElementSibling;
      if (inputGroup) {
        inputGroup.classList.add("animate__animated", "animate__shakeX");
        inputGroup.style.borderColor = "var(--tech-error)";
        setTimeout(() => {
          inputGroup.classList.remove("animate__animated", "animate__shakeX");
        }, 1000);
      }
    }
  });
  
  // Add typing effect to placeholders - but make it faster
  const inputs = document.querySelectorAll(".tech-input");
  inputs.forEach(input => {
    const originalPlaceholder = input.getAttribute("placeholder");
    
    // Skip if no placeholder
    if (!originalPlaceholder) return;
    
    // Clear the placeholder initially
    input.setAttribute("placeholder", "");
    
    // Add typing effect with faster speed
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < originalPlaceholder.length) {
        input.setAttribute("placeholder", input.getAttribute("placeholder") + originalPlaceholder.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // Faster typing speed
  });
});