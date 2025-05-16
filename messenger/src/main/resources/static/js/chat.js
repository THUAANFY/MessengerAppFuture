document.addEventListener("DOMContentLoaded", () => {
  // Initialize particles with reduced count for better performance
  if (typeof particlesJS !== "undefined") {
    initChatParticles()
  }

  // Settings modal
  const settingsBtn = document.getElementById("settingsBtn")
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      const settingsModal = new bootstrap.Modal(document.getElementById("settingsModal"))
      settingsModal.show()
    })
  }

  // Tab switching
  const tabBtns = document.querySelectorAll(".tab-btn")
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      // Here you would typically load different content based on the tab
      console.log(`Switched to ${btn.dataset.tab} tab`)
    })
  })

  // Conversation selection
  const conversationItems = document.querySelectorAll(".conversation-item")
  conversationItems.forEach((item) => {
    item.addEventListener("click", () => {
      conversationItems.forEach((i) => i.classList.remove("active"))
      item.classList.add("active")
      // Here you would typically load the conversation messages
      console.log("Switched conversation")

      // On mobile, close the sidebar after selecting a conversation
      if (window.innerWidth < 768) {
        document.querySelector(".chat-sidebar").classList.remove("active")
      }
    })
  })

  // Message input handling
  const messageInput = document.querySelector(".message-input")
  const sendBtn = document.querySelector(".chat-send-btn")

  if (messageInput && sendBtn) {
    // Send message on Enter key
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    })

    // Send message on button click
    sendBtn.addEventListener("click", () => {
      sendMessage()
    })
  }

  // Toggle info sidebar
  const infoBtn = document.querySelector(".chat-header-actions .action-btn:last-child")
  const infoSidebar = document.querySelector(".info-sidebar")
  const closeInfoBtn = document.querySelector(".close-info-btn")

  if (infoBtn && infoSidebar && closeInfoBtn) {
    infoBtn.addEventListener("click", () => {
      infoSidebar.classList.toggle("active")
    })

    closeInfoBtn.addEventListener("click", () => {
      infoSidebar.classList.remove("active")
    })
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.createElement("button")
  mobileMenuBtn.className = "action-btn mobile-menu-btn"
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>'
  mobileMenuBtn.title = "Menu"

  if (window.innerWidth < 768) {
    const chatHeader = document.querySelector(".chat-header")
    if (chatHeader) {
      chatHeader.insertBefore(mobileMenuBtn, chatHeader.firstChild)

      mobileMenuBtn.addEventListener("click", () => {
        const chatSidebar = document.querySelector(".chat-sidebar")
        chatSidebar.classList.toggle("active")
      })
    }
  }

  // Background options in settings
  const bgOptions = document.querySelectorAll(".bg-option")
  bgOptions.forEach((option) => {
    option.addEventListener("click", () => {
      bgOptions.forEach((o) => o.classList.remove("active"))
      option.classList.add("active")

      // Change chat background color
      document.documentElement.style.setProperty("--chat-bg", option.style.backgroundColor)
    })
  })

  // Scroll to bottom of messages
  scrollToBottom()

  // Add animation to messages
  animateMessages()
})

// Function to send a message
function sendMessage() {
  const messageInput = document.querySelector(".message-input")
  const chatMessages = document.querySelector(".chat-messages")

  if (messageInput.value.trim() !== "") {
    const message = messageInput.value
    messageInput.value = ""

    // Get current time
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`

    // Create message element
    const messageElement = document.createElement("div")
    messageElement.className = "message-item sent animate__animated animate__fadeInUp"
    messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-bubble">
                    <p>${escapeHtml(message)}</p>
                </div>
                <div class="message-info">
                    <span class="message-time">${timeString}</span>
                    <span class="message-status">
                        <i class="fas fa-check"></i>
                    </span>
                </div>
            </div>
        `

    // Add message to chat
    chatMessages.appendChild(messageElement)

    // Scroll to bottom
    scrollToBottom()

    // Simulate reply after 1-3 seconds
    simulateReply()
  }
}

// Function to simulate a reply
function simulateReply() {
  const chatMessages = document.querySelector(".chat-messages")

  // Add typing indicator
  const typingElement = document.createElement("div")
  typingElement.className = "message-item received animate__animated animate__fadeIn"
  typingElement.innerHTML = `
        <div class="message-avatar">
            <img src="https://ui-avatars.com/api/?name=Jane+Smith&background=4CAF50&color=fff" alt="Jane Smith">
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `

  // Add typing indicator after a short delay
  setTimeout(() => {
    chatMessages.appendChild(typingElement)
    scrollToBottom()
  }, 500)

  // Remove typing indicator and add reply after random delay
  const replyDelay = Math.floor(Math.random() * 2000) + 1000 // 1-3 seconds
  setTimeout(() => {
    // Remove typing indicator
    chatMessages.removeChild(typingElement)

    // Get current time
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`

    // Random replies
    const replies = [
      "That sounds great!",
      "I'll get back to you on that.",
      "Thanks for letting me know.",
      "Can we discuss this further tomorrow?",
      "I appreciate your input on this matter.",
      "Let me check my schedule and get back to you soon.",
      "I'm not sure I understand. Could you explain more?",
      "That's a great idea! Let's implement it.",
    ]

    // Select random reply
    const reply = replies[Math.floor(Math.random() * replies.length)]

    // Create reply element
    const replyElement = document.createElement("div")
    replyElement.className = "message-item received animate__animated animate__fadeInUp"
    replyElement.innerHTML = `
            <div class="message-avatar">
                <img src="https://ui-avatars.com/api/?name=Jane+Smith&background=4CAF50&color=fff" alt="Jane Smith">
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <p>${reply}</p>
                </div>
                <div class="message-info">
                    <span class="message-time">${timeString}</span>
                </div>
            </div>
        `

    // Add reply to chat
    chatMessages.appendChild(replyElement)

    // Scroll to bottom
    scrollToBottom()

    // Update last message in conversation list
    updateConversationLastMessage(reply)
  }, replyDelay)
}

// Function to update the last message in the conversation list
function updateConversationLastMessage(message) {
  const activeConversation = document.querySelector(".conversation-item.active")
  if (activeConversation) {
    const lastMessageElement = activeConversation.querySelector(".conversation-last-message")
    if (lastMessageElement) {
      lastMessageElement.textContent = message
    }

    // Update time
    const timeElement = activeConversation.querySelector(".conversation-time")
    if (timeElement) {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const ampm = hours >= 12 ? "PM" : "AM"
      const formattedHours = hours % 12 || 12
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes
      timeElement.textContent = `${formattedHours}:${formattedMinutes} ${ampm}`
    }
  }
}

// Function to scroll to bottom of messages
function scrollToBottom() {
  const chatMessages = document.querySelector(".chat-messages")
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
}

// Function to animate messages on load
function animateMessages() {
  const messages = document.querySelectorAll(".message-item")
  messages.forEach((message, index) => {
    message.style.opacity = "0"
    setTimeout(() => {
      message.style.opacity = "1"
      message.classList.add("animate__animated", "animate__fadeInUp")
    }, index * 150)
  })
}

// Function to initialize particles with reduced count
function initChatParticles() {
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 30, // Reduced number of particles
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
        value: 0.3, // Reduced opacity
        random: true,
        anim: {
          enable: true,
          speed: 0.5, // Slower animation
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 1, // Slower animation
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#00bcd4",
        opacity: 0.2, // Reduced opacity
        width: 1,
      },
      move: {
        enable: true,
        speed: 1, // Slower movement
        direction: "none",
        random: false,
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
          particles_nb: 2, // Push fewer particles
        },
      },
    },
    retina_detect: true,
  })
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
