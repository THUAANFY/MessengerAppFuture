// Notifications functionality
document.addEventListener('DOMContentLoaded', function() {
    const notificationsContainer = document.createElement('div');
    notificationsContainer.className = 'notifications-container';
    document.querySelector('.chat-container').appendChild(notificationsContainer);
    
    // Create notification icon in user actions
    const notificationBtn = document.createElement('button');
    notificationBtn.className = 'action-btn notification-btn';
    notificationBtn.title = 'Notifications';
    notificationBtn.innerHTML = '<i class="fas fa-bell"></i>';
    
    // Add notification counter
    const notificationCounter = document.createElement('span');
    notificationCounter.className = 'notification-counter';
    notificationCounter.style.display = 'none';
    notificationBtn.appendChild(notificationCounter);
    
    // Insert before the logout button
    const userActions = document.querySelector('.user-actions');
    userActions.insertBefore(notificationBtn, userActions.querySelector('form'));
    
    // Create notifications panel
    const notificationsPanel = document.createElement('div');
    notificationsPanel.className = 'notifications-panel';
    notificationsPanel.style.display = 'none';
    
    // Add header to notifications panel
    notificationsPanel.innerHTML = `
        <div class="notifications-header">
            <h6>Notifications</h6>
            <button class="mark-all-read-btn">Mark all as read</button>
        </div>
        <div class="notifications-list"></div>
    `;
    
    document.querySelector('.user-profile').appendChild(notificationsPanel);
    
    // Toggle notifications panel
    notificationBtn.addEventListener('click', function() {
        const isVisible = notificationsPanel.style.display === 'block';
        notificationsPanel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            loadNotifications();
        }
    });
    
    // Close notifications panel when clicking outside
    document.addEventListener('click', function(e) {
        if (!notificationsPanel.contains(e.target) && e.target !== notificationBtn && !notificationBtn.contains(e.target)) {
            notificationsPanel.style.display = 'none';
        }
    });
    
    // Mark all as read button
    document.querySelector('.mark-all-read-btn').addEventListener('click', function() {
        fetch('/notifications/mark-all-read', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelectorAll('.notification-item:not(.read)').forEach(item => {
                    item.classList.add('read');
                });
                updateNotificationCounter(0);
            }
        });
    });
    
    // Load notifications initially and every 30 seconds
    loadNotifications();
    setInterval(loadNotifications, 30000);
    
    function loadNotifications() {
        fetch('/notifications')
            .then(response => response.json())
            .then(notifications => {
                updateNotificationCounter(notifications.length);
                
                if (notificationsPanel.style.display === 'block') {
                    const notificationsList = document.querySelector('.notifications-list');
                    notificationsList.innerHTML = '';
                    
                    if (notifications.length === 0) {
                        notificationsList.innerHTML = '<div class="no-notifications">No new notifications</div>';
                    } else {
                        notifications.forEach(notification => {
                            const notificationItem = document.createElement('div');
                            notificationItem.className = 'notification-item';
                            notificationItem.dataset.id = notification.id;
                            
                            let icon;
                            let actionHtml = '';
                            
                            switch(notification.type) {
                                case 'FRIEND_REQUEST':
                                    icon = '<i class="fas fa-user-plus notification-icon"></i>';
                                    actionHtml = `
                                        <div class="notification-actions">
                                            <button class="accept-friend-btn" data-request-id="${notification.relatedId}">Accept</button>
                                            <button class="reject-friend-btn" data-request-id="${notification.relatedId}">Reject</button>
                                        </div>
                                    `;
                                    break;
                                case 'FRIEND_ACCEPTED':
                                    icon = '<i class="fas fa-user-check notification-icon"></i>';
                                    break;
                                case 'NEW_MESSAGE':
                                    icon = '<i class="fas fa-envelope notification-icon"></i>';
                                    break;
                                default:
                                    icon = '<i class="fas fa-bell notification-icon"></i>';
                            }
                            
                            notificationItem.innerHTML = `
                                <div class="notification-content">
                                    ${icon}
                                    <div class="notification-text">
                                        <p>${notification.content}</p>
                                        <span class="notification-time">${formatTimeAgo(new Date(notification.createdAt))}</span>
                                    </div>
                                </div>
                                ${actionHtml}
                            `;
                            
                            notificationsList.appendChild(notificationItem);
                            
                            // Mark notification as read when clicked
                            notificationItem.addEventListener('click', function() {
                                if (!this.classList.contains('read')) {
                                    markNotificationAsRead(this.dataset.id);
                                    this.classList.add('read');
                                }
                            });
                        });
                        
                        // Add event listeners for friend request buttons
                        document.querySelectorAll('.accept-friend-btn').forEach(button => {
                            button.addEventListener('click', function(e) {
                                e.stopPropagation();
                                const requestId = this.getAttribute('data-request-id');
                                respondToFriendRequest(requestId, true, this.closest('.notification-item'));
                            });
                        });
                        
                        document.querySelectorAll('.reject-friend-btn').forEach(button => {
                            button.addEventListener('click', function(e) {
                                e.stopPropagation();
                                const requestId = this.getAttribute('data-request-id');
                                respondToFriendRequest(requestId, false, this.closest('.notification-item'));
                            });
                        });
                    }
                }
            })
            .catch(error => {
                console.error('Error loading notifications:', error);
            });
    }
    
    function markNotificationAsRead(notificationId) {
        fetch('/notifications/mark-read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `notificationId=${notificationId}`
        });
    }
    
    function respondToFriendRequest(requestId, accept, notificationElement) {
        fetch('/friend-request/respond', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `requestId=${requestId}&accept=${accept}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Mark notification as read
                markNotificationAsRead(notificationElement.dataset.id);
                notificationElement.classList.add('read');
                
                // Update notification content
                const actionsDiv = notificationElement.querySelector('.notification-actions');
                const iconElement = notificationElement.querySelector('.notification-icon');
                
                if (actionsDiv) {
                    actionsDiv.innerHTML = accept ? 
                        '<div class="response-message success">Accepted</div>' : 
                        '<div class="response-message">Rejected</div>';
                }
                
                if (iconElement && accept) {
                    iconElement.className = 'fas fa-user-check notification-icon';
                }
                
                // Nếu chấp nhận kết bạn, thêm người dùng vào danh sách trò chuyện
                if (accept && data.user) {
                    addUserToConversationList(data.user);
                }
            }
        })
        .catch(error => {
            console.error('Error responding to friend request:', error);
        });
    }
    
    function updateNotificationCounter(count) {
        if (count > 0) {
            notificationCounter.textContent = count > 99 ? '99+' : count;
            notificationCounter.style.display = 'block';
            notificationBtn.classList.add('has-notifications');
        } else {
            notificationCounter.style.display = 'none';
            notificationBtn.classList.remove('has-notifications');
        }
    }
    
    function formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffSecs < 60) {
            return 'just now';
        } else if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays === 1) {
            return 'yesterday';
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    // Thêm hàm mới để thêm người dùng vào danh sách trò chuyện
function addUserToConversationList(user) {
    // Tạo phần tử conversation mới
    const conversationItem = document.createElement('div');
    conversationItem.className = 'conversation-item';
    conversationItem.dataset.userId = user.id;
    
    // Tạo avatar với trạng thái
    const statusClass = user.status ? user.status.toLowerCase() : 'offline';
    
    // Tạo HTML cho conversation item
    conversationItem.innerHTML = `
        <div class="conversation-avatar">
            <img src="${user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=0D8ABC&color=fff`}" alt="${user.fullName}">
            <span class="status-indicator ${statusClass}"></span>
        </div>
        <div class="conversation-info">
            <div class="conversation-name">${user.fullName}</div>
            <div class="conversation-last-message">New friend added</div>
        </div>
        <div class="conversation-meta">
            <div class="conversation-time">Just now</div>
        </div>
    `;
    
    // Thêm vào đầu danh sách trò chuyện
    const conversationList = document.querySelector('.conversation-list');
        if (conversationList) {
            // Thêm vào đầu danh sách
            if (conversationList.firstChild) {
                conversationList.insertBefore(conversationItem, conversationList.firstChild);
            } else {
                conversationList.appendChild(conversationItem);
            }
            
            // Thêm sự kiện click để mở cuộc trò chuyện
            conversationItem.addEventListener('click', function() {
                openConversation(user);
            });
            
            // Hiệu ứng nhấp nháy để thu hút sự chú ý
            conversationItem.classList.add('new-conversation');
            setTimeout(() => {
                conversationItem.classList.remove('new-conversation');
            }, 3000);
        }
    }
});