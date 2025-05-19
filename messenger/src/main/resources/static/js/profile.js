document.addEventListener("DOMContentLoaded", () => {
  // Đảm bảo trang được cuộn lên đầu khi tải
  window.scrollTo(0, 0)

  // Declare particlesJS and bootstrap variables
  const particlesJS = window.particlesJS
  const bootstrap = window.bootstrap

  // Initialize particles.js with improved performance
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 40,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#00e5ff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.3,
          random: true,
          anim: {
            enable: true,
            speed: 0.8,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 1.5,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#00bcd4",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.5,
            },
          },
          push: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    })
  }

  // Auto-dismiss alerts after 5 seconds with fade out effect
  const alerts = document.querySelectorAll(".alert")
  alerts.forEach((alert) => {
    setTimeout(() => {
      // Add fade out animation
      alert.classList.add("animate__fadeOutUp")

      // Remove after animation completes
      setTimeout(() => {
        if (typeof bootstrap !== "undefined" && bootstrap.Alert) {
          const bsAlert = new bootstrap.Alert(alert)
          bsAlert.close()
        } else {
          alert.style.display = "none"
        }
      }, 500)
    }, 5000)
  })

  // Password validation with visual feedback
  const passwordForm = document.querySelector('form[action="/profile/change-password"]')
  if (passwordForm) {
    const newPassword = document.getElementById("newPassword")
    const confirmPassword = document.getElementById("confirmPassword")

    // Add event listeners
    if (newPassword && confirmPassword) {
      newPassword.addEventListener("input", checkPasswordMatch)
      confirmPassword.addEventListener("input", checkPasswordMatch)

      passwordForm.addEventListener("submit", (e) => {
        if (newPassword.value !== confirmPassword.value) {
          e.preventDefault()
          checkPasswordMatch()

          // Shake the confirm password field
          confirmPassword.parentNode.classList.add("animate__animated", "animate__shakeX")
          setTimeout(() => {
            confirmPassword.parentNode.classList.remove("animate__animated", "animate__shakeX")
          }, 1000)
        }
      })
    }
  }

  // Add hover effects to cards
  const cards = document.querySelectorAll(".card")
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)"
      this.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.4)"
      this.style.borderColor = "rgba(0, 229, 255, 0.2)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = ""
      this.style.boxShadow = ""
      this.style.borderColor = ""
    })
  })

  // Enhanced ripple effect to buttons
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const x = e.clientX - e.target.getBoundingClientRect().left
      const y = e.clientY - e.target.getBoundingClientRect().top

      const ripple = document.createElement("span")
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.style.position = "absolute"
      ripple.style.width = "0"
      ripple.style.height = "0"
      ripple.style.borderRadius = "50%"
      ripple.style.backgroundColor = "rgba(255, 255, 255, 0.4)"
      ripple.style.transform = "translate(-50%, -50%)"
      ripple.style.animation = "ripple 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)"

      button.style.position = "relative"
      button.style.overflow = "hidden"
      button.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 800)
    })
  })

  // Add keyframe animation for ripple effect if not already defined
  if (!document.querySelector("style#ripple-animation")) {
    const style = document.createElement("style")
    style.id = "ripple-animation"
    style.textContent = `
      @keyframes ripple {
        to {
          width: 300px;
          height: 300px;
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }

  // Add animation to timeline items
  const timelineItems = document.querySelectorAll(".timeline-item")
  timelineItems.forEach((item, index) => {
    item.style.opacity = "0"
    item.style.transform = "translateX(-20px)"

    setTimeout(
      () => {
        item.style.transition = "all 0.5s ease"
        item.style.opacity = "1"
        item.style.transform = "translateX(0)"
      },
      300 + index * 150,
    )
  })

  // Add animation to friend items
  const friendItems = document.querySelectorAll(".friend-item")
  friendItems.forEach((item, index) => {
    item.style.opacity = "0"
    item.style.transform = "translateY(20px)"

    setTimeout(
      () => {
        item.style.transition = "all 0.5s ease"
        item.style.opacity = "1"
        item.style.transform = "translateY(0)"
      },
      300 + index * 150,
    )
  })

  // Add animation to stat items
  const statItems = document.querySelectorAll(".stat-item")
  statItems.forEach((item, index) => {
    item.style.opacity = "0"

    setTimeout(
      () => {
        item.style.transition = "all 0.5s ease"
        item.style.opacity = "1"
      },
      300 + index * 150,
    )
  })

  // Add focus effects to input fields
  const inputFields = document.querySelectorAll(".form-control, .form-select")
  inputFields.forEach((input) => {
    // Add subtle glow effect on focus
    input.addEventListener("focus", function () {
      const container = this.closest(".input-container")
      if (container) {
        container.style.borderColor = "#00e5ff"
        container.style.boxShadow = "0 0 15px rgba(0, 229, 255, 0.25)"
      }
    })

    // Remove effects on blur
    input.addEventListener("blur", function () {
      const container = this.closest(".input-container")
      if (container) {
        container.style.borderColor = ""
        container.style.boxShadow = ""
      }
    })

    // Add floating label effect
    if (input.value) {
      input.classList.add("has-value")
    }

    input.addEventListener("input", function () {
      if (this.value) {
        this.classList.add("has-value")
      } else {
        this.classList.remove("has-value")
      }
    })
  })

  // Add label animation for form groups
  const formLabels = document.querySelectorAll(".form-group label")
  formLabels.forEach((label) => {
    label.style.transition = "all 0.3s ease"

    const input = document.getElementById(label.getAttribute("for"))
    if (input) {
      input.addEventListener("focus", () => {
        label.style.color = "#00e5ff"
      })

      input.addEventListener("blur", () => {
        label.style.color = ""
      })
    }
  })
})

// Thêm vào cuối file profile.js

// Enhanced password validation
document.addEventListener("DOMContentLoaded", () => {
  // Password validation setup
  setupPasswordValidation()

  // Setup form validation feedback
  setupFormValidation()

  // Handle server-side errors
  handleServerErrors()
})

function setupPasswordValidation() {
  const newPassword = document.getElementById("newPassword")
  if (!newPassword) return

  // Password requirement elements
  const lengthCheck = document.getElementById("length-check")
  const letterCheck = document.getElementById("letter-check")
  const numberCheck = document.getElementById("number-check")
  const specialCheck = document.getElementById("special-check")

  // Add focus effect to password requirements
  newPassword.addEventListener("focus", () => {
    const requirements = document.querySelector(".password-requirements")
    if (requirements) {
      requirements.style.borderColor = "rgba(0, 229, 255, 0.3)"
      requirements.style.boxShadow = "0 0 15px rgba(0, 229, 255, 0.1)"
    }
  })

  newPassword.addEventListener("blur", () => {
    const requirements = document.querySelector(".password-requirements")
    if (requirements) {
      requirements.style.borderColor = ""
      requirements.style.boxShadow = ""
    }
  })
}

function setupFormValidation() {
  const inputs = document.querySelectorAll(".form-control")

  inputs.forEach((input) => {
    // Create or get error container
    let errorContainer = document.getElementById(`${input.id}-error`)
    if (!errorContainer) {
      errorContainer = document.createElement("div")
      errorContainer.id = `${input.id}-error`
      errorContainer.className = "invalid-feedback"
      input.parentNode.parentNode.appendChild(errorContainer)
    }

    // Add validation styling on input
    input.addEventListener("input", function () {
      if (this.value) {
        this.classList.remove("is-invalid")
        errorContainer.style.display = "none"
      }
    })
  })
}

function handleServerErrors() {
  // Check for error parameters in URL
  const urlParams = new URLSearchParams(window.location.search)
  const errorParam = urlParams.get("error")

  if (errorParam) {
    // Create alert if not exists
    if (!document.querySelector(".alert-danger")) {
      const alertDiv = document.createElement("div")
      alertDiv.className = "alert alert-danger animate__animated animate__fadeIn"
      alertDiv.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i>${decodeURIComponent(errorParam)}`

      const cardBody = document.querySelector(".profile-card:nth-child(2) .card-body")
      if (cardBody) {
        cardBody.insertBefore(alertDiv, cardBody.firstChild)
      }
    }
  }

  // Auto-dismiss alerts
  const alerts = document.querySelectorAll(".alert")
  alerts.forEach((alert) => {
    setTimeout(() => {
      alert.classList.add("animate__fadeOut")
      setTimeout(() => {
        alert.remove()
      }, 500)
    }, 5000)
  })
}

// Add visual feedback when form is submitted
document.addEventListener("DOMContentLoaded", () => {
  const passwordForm = document.getElementById("passwordForm")
  if (passwordForm) {
    passwordForm.addEventListener("submit", function () {
      const submitButton = this.querySelector('button[type="submit"]')
      if (submitButton && !submitButton.classList.contains("btn-loading")) {
        // Add loading state
        submitButton.classList.add("btn-loading")
        submitButton.disabled = true

        // Add subtle form animation
        this.classList.add("animate__animated", "animate__pulse")
      }
    })
  }
})

// Enhanced image upload functionality
document.addEventListener("DOMContentLoaded", () => {
  // Add drag and drop support for avatar upload
  setupDragDropAvatar()

  // Add file size validation
  validateFileSize()
})

function setupDragDropAvatar() {
  const avatarWrapper = document.querySelector(".avatar-wrapper")
  if (!avatarWrapper) return // Prevent default drag behaviors
  ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    avatarWrapper.addEventListener(eventName, preventDefaults, false)
  })

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }
  // Highlight drop area when item is dragged over
  ;["dragenter", "dragover"].forEach((eventName) => {
    avatarWrapper.addEventListener(eventName, highlight, false)
  })
  ;["dragleave", "drop"].forEach((eventName) => {
    avatarWrapper.addEventListener(eventName, unhighlight, false)
  })

  function highlight() {
    avatarWrapper.classList.add("drag-highlight")
  }

  function unhighlight() {
    avatarWrapper.classList.remove("drag-highlight")
  }

  // Handle dropped files
  avatarWrapper.addEventListener("drop", handleDrop, false)

  function handleDrop(e) {
    const dt = e.dataTransfer
    const files = dt.files

    if (files.length) {
      const fileInput = document.getElementById("profileImageInput")
      fileInput.files = files

      // Trigger change event
      const event = new Event("change", { bubbles: true })
      fileInput.dispatchEvent(event)
    }
  }
}

function validateFileSize() {
  const fileInput = document.getElementById("profileImageInput")
  if (!fileInput) return

  fileInput.addEventListener("change", function () {
    const file = this.files[0]
    if (file) {
      // Check file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        alert("File size exceeds 5MB. Please choose a smaller image.")
        this.value = "" // Clear the input
        return
      }

      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.")
        this.value = "" // Clear the input
        return
      }
    }
  })
}

// Add visual feedback styles for drag and drop
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style")
  style.textContent = `
        .avatar-wrapper.drag-highlight {
            border: 2px dashed #00e5ff !important;
            box-shadow: 0 0 20px rgba(0, 229, 255, 0.5) !important;
            transform: scale(1.05);
            transition: all 0.3s ease;
        }
        
        .avatar-wrapper.drag-highlight .avatar-overlay {
            background-color: rgba(0, 0, 0, 0.5);
        }
        
        .avatar-wrapper.drag-highlight .avatar-edit {
            transform: scale(1.2);
        }
    `
  document.head.appendChild(style)
})
