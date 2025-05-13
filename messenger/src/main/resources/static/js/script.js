// Toggle password visibility with animation
function togglePassword(inputId) {
  const passwordInput = document.getElementById(inputId)
  const icon = event.target

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    icon.classList.remove("fa-eye")
    icon.classList.add("fa-eye-slash")
    icon.classList.add("animate__animated", "animate__flipInY")
    setTimeout(() => {
      icon.classList.remove("animate__animated", "animate__flipInY")
    }, 500)
  } else {
    passwordInput.type = "password"
    icon.classList.remove("fa-eye-slash")
    icon.classList.add("fa-eye")
    icon.classList.add("animate__animated", "animate__flipInY")
    setTimeout(() => {
      icon.classList.remove("animate__animated", "animate__flipInY")
    }, 500)
  }
}

// Add animation to form elements on page load
document.addEventListener("DOMContentLoaded", () => {
  // Animate form fields on load
  const formFields = document.querySelectorAll(".form-floating")
  formFields.forEach((field, index) => {
    field.classList.add("animate__animated", "animate__fadeInUp")
    field.style.animationDelay = `${0.3 + index * 0.1}s`
  })

  // Password strength meter
  const passwordInput = document.getElementById("password")
  const strengthMeter = document.getElementById("password-strength")

  if (passwordInput && strengthMeter) {
    passwordInput.addEventListener("input", () => {
      const val = passwordInput.value
      let strength = 0

      if (val.match(/[a-z]+/)) strength += 1
      if (val.match(/[A-Z]+/)) strength += 1
      if (val.match(/[0-9]+/)) strength += 1
      if (val.match(/[!@#$%^&*()]+/)) strength += 1

      switch (strength) {
        case 0:
          strengthMeter.style.width = "0%"
          strengthMeter.style.background = "transparent"
          break
        case 1:
          strengthMeter.style.width = "25%"
          strengthMeter.style.background = "#ff4d4d"
          break
        case 2:
          strengthMeter.style.width = "50%"
          strengthMeter.style.background = "#ffa64d"
          break
        case 3:
          strengthMeter.style.width = "75%"
          strengthMeter.style.background = "#ffff4d"
          break
        case 4:
          strengthMeter.style.width = "100%"
          strengthMeter.style.background = "#4dff4d"
          break
      }
    })
  }

  // Add ripple effect to buttons
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Don't add ripple for form submission - let the form handle that
      if (button.type === "submit") return

      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const ripple = document.createElement("span")
      ripple.classList.add("ripple")
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`

      button.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })

  // Add loading animation to form submission
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      // Don't prevent the default form submission - let Thymeleaf handle it
      // But add a loading animation to the button
      const submitBtn = form.querySelector('button[type="submit"]')
      const originalContent = submitBtn.innerHTML

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
      submitBtn.disabled = true

      // We'll let the form submit naturally, but if it takes too long,
      // we'll restore the button (in case there's a client-side issue)
      setTimeout(() => {
        if (submitBtn.disabled) {
          submitBtn.innerHTML = originalContent
          submitBtn.disabled = false
        }
      }, 10000) // 10 second timeout
    })
  })

  // Highlight validation errors with animation
  const invalidFeedbacks = document.querySelectorAll(".invalid-feedback")
  invalidFeedbacks.forEach((feedback) => {
    if (feedback.textContent.trim() !== "") {
      const inputField = feedback.previousElementSibling
      if (inputField) {
        inputField.classList.add("is-invalid")
        inputField.classList.add("animate__animated", "animate__shakeX")
        setTimeout(() => {
          inputField.classList.remove("animate__animated", "animate__shakeX")
        }, 1000)
      }
    }
  })
})
