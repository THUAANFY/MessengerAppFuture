// User search and friend request functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    
    // Tạo container cho kết quả tìm kiếm nếu chưa tồn tại
    let searchResultsContainer = document.querySelector('.search-results');
    if (!searchResultsContainer) {
        searchResultsContainer = document.createElement('div');
        searchResultsContainer.className = 'search-results';
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.appendChild(searchResultsContainer);
        } else {
            console.error('Search container not found');
            return; // Thoát nếu không tìm thấy container
        }
    }
    
    // Đảm bảo container có style đúng
    searchResultsContainer.style.position = 'absolute';
    searchResultsContainer.style.top = '100%';
    searchResultsContainer.style.left = '0';
    searchResultsContainer.style.right = '0';
    searchResultsContainer.style.zIndex = '1000';
    searchResultsContainer.style.display = 'none';
    
    let searchTimeout;
    
    // Debug log
    console.log('Search functionality initialized');
    console.log('Search input element:', searchInput);
    console.log('Search results container:', searchResultsContainer);
    
    searchInput.addEventListener('focus', function() {
        console.log('Search input focused, value:', searchInput.value);
        if (searchInput.value.trim().length >= 2) {
            performSearch();
        }
    });
    
    searchInput.addEventListener('input', function() {
        console.log('Search input changed:', searchInput.value);
        clearTimeout(searchTimeout);
        if (searchInput.value.trim().length >= 2) {
            searchTimeout = setTimeout(performSearch, 500);
        } else {
            searchResultsContainer.style.display = 'none';
        }
    });
    
    // Đảm bảo click bên ngoài sẽ đóng kết quả tìm kiếm
    document.addEventListener('click', function(e) {
        if (!searchResultsContainer.contains(e.target) && e.target !== searchInput) {
            searchResultsContainer.style.display = 'none';
        }
    });
    
    function performSearch() {
        const query = searchInput.value.trim();
        console.log('Performing search for:', query);
        
        // Hiển thị loading indicator
        searchResultsContainer.innerHTML = '<div class="search-loading">Searching...</div>';
        searchResultsContainer.style.display = 'block';
        
        fetch(`/search?query=${encodeURIComponent(query)}`)
            .then(response => {
                console.log('Search response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Search request failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(users => {
                console.log('Search results:', users);
                searchResultsContainer.innerHTML = '';
                
                if (!users || users.length === 0) {
                    searchResultsContainer.innerHTML = '<div class="search-no-results">No users found</div>';
                } else {
                    users.forEach(user => {
                        const userElement = document.createElement('div');
                        userElement.className = 'search-result-item';
                        
                        // Đảm bảo xử lý các trường hợp null/undefined
                        const fullName = user.fullName || 'Unknown User';
                        const username = user.username || user.email || 'unknown';
                        const profilePic = user.profilePicture || 
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D8ABC&color=fff`;
                        const status = (user.status || 'offline').toLowerCase();
                        
                        userElement.innerHTML = `
                            <div class="search-user-avatar">
                                <img src="${profilePic}" alt="${fullName}">
                                <span class="status-indicator ${status}"></span>
                            </div>
                            <div class="search-user-info">
                                <div class="search-user-name">${fullName}</div>
                                <div class="search-user-username">@${username}</div>
                            </div>
                            <button class="search-add-friend-btn" data-user-id="${user.id}">
                                <i class="fas fa-user-plus"></i>
                            </button>
                        `;
                        
                        searchResultsContainer.appendChild(userElement);
                    });
                    
                    // Add event listeners to add friend buttons
                    document.querySelectorAll('.search-add-friend-btn').forEach(button => {
                        button.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
                            const userId = this.getAttribute('data-user-id');
                            sendFriendRequest(userId, this);
                        });
                    });
                }
                
                // Đảm bảo container hiển thị
                searchResultsContainer.style.display = 'block';
                
                // Debug - kiểm tra DOM
                console.log('Search results container after update:', searchResultsContainer);
                console.log('Search results container display:', searchResultsContainer.style.display);
                console.log('Search results container children:', searchResultsContainer.children.length);
            })
            .catch(error => {
                console.error('Error searching users:', error);
                searchResultsContainer.innerHTML = '<div class="search-no-results">Error searching users. Please try again.</div>';
                searchResultsContainer.style.display = 'block';
            });
    }
    
    function sendFriendRequest(userId, buttonElement) {
        console.log('Sending friend request to user ID:', userId);
        buttonElement.disabled = true;
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        fetch('/friend-request/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `userId=${userId}`
        })
        .then(response => {
            console.log('Friend request response status:', response.status);
            if (!response.ok) {
                throw new Error(`Friend request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Friend request response:', data);
            if (data.success) {
                buttonElement.innerHTML = '<i class="fas fa-check"></i>';
                buttonElement.classList.add('sent');
                buttonElement.title = data.message;
            } else {
                buttonElement.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
                buttonElement.title = data.message;
                setTimeout(() => {
                    buttonElement.innerHTML = '<i class="fas fa-user-plus"></i>';
                    buttonElement.disabled = false;
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Error sending friend request:', error);
            buttonElement.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            buttonElement.title = 'Error sending friend request';
            setTimeout(() => {
                buttonElement.innerHTML = '<i class="fas fa-user-plus"></i>';
                buttonElement.disabled = false;
            }, 3000);
        });
    }
});