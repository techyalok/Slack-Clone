// Simulate user data
const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

const channels = [];
const messages = {};
const directMessages = {};
const notifications = [];

// Display Notification
function displayNotification(message) {
    const notificationBar = document.getElementById('notificationBar');
    if (notificationBar) {
        notificationBar.innerHTML = message;
        notificationBar.style.display = 'block';
        setTimeout(() => {
            notificationBar.style.display = 'none';
        }, 5000);
    }
}

// Signup
document.getElementById('signupForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    users.push({ username, password });
    alert('Signup successful! Please login.');
    window.location.href = 'index.html';
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        sessionStorage.setItem('currentUser', username);
        window.location.href = 'channels.html';
    } else {
        alert('Invalid username or password');
    }
});

// Logout
document.getElementById('logoutButton')?.addEventListener('click', function() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Create Channel
document.getElementById('createChannelForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('channelName').value;
    const description = document.getElementById('channelDescription').value;
    channels.push({ name, description });
    alert('Channel created successfully!');
    displayChannels();
});

// Display Channels
function displayChannels() {
    const channelList = document.getElementById('channelList');
    if (channelList) {
        channelList.innerHTML = '';
        channels.forEach(channel => {
            const li = document.createElement('li');
            li.textContent = `${channel.name}: ${channel.description}`;
            channelList.appendChild(li);
        });
    }
}

// Display Search Results
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.innerHTML = '';
        results.forEach(result => {
            const div = document.createElement('div');
            div.textContent = result;
            searchResults.appendChild(div);
        });
    }
}

// Send Message
document.getElementById('sendMessageForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const currentUser = sessionStorage.getItem('currentUser');
    const messageContent = document.getElementById('messageInput').value;
    const timestamp = new Date().toLocaleTimeString();
    const message = { sender: currentUser, content: messageContent, timestamp };
    const channelName = 'default'; // assuming single channel for simplicity
    if (!messages[channelName]) {
        messages[channelName] = [];
    }
    messages[channelName].push(message);
    displayMessages(channelName);
    
    // Check for mentions and display notification
    users.forEach(user => {
        if (messageContent.includes(`@${user.username}`)) {
            displayNotification(`You were mentioned in ${channelName} by ${currentUser}`);
        }
    });
});

// Display Messages
function displayMessages(channelName) {
    const messageList = document.getElementById('messageList');
    if (messageList) {
        messageList.innerHTML = '';
        (messages[channelName] || []).forEach(msg => {
            const div = document.createElement('div');
            div.textContent = `${msg.timestamp} ${msg.sender}: ${msg.content}`;
            messageList.appendChild(div);
        });
    }
}

// Send Direct Message
document.getElementById('sendDMForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const currentUser = sessionStorage.getItem('currentUser');
    const recipient = document.getElementById('dmRecipient').value;
    const messageContent = document.getElementById('dmMessage').value;
    const timestamp = new Date().toLocaleTimeString();
    const message = { sender: currentUser, content: messageContent, timestamp };
    if (!directMessages[recipient]) {
        directMessages[recipient] = [];
    }
    directMessages[recipient].push(message);
    alert('Direct message sent!');
    displayDirectMessages(recipient);

    // Display notification for the recipient
    displayNotification(`You received a direct message from ${currentUser}`);
});


// Display Direct Messages
function displayDirectMessages(username) {
    const dmList = document.getElementById('dmList');
    if (dmList) {
        dmList.innerHTML = '';
        (directMessages[username] || []).forEach(msg => {
            const div = document.createElement('div');
            div.textContent = `${msg.timestamp} ${msg.sender}: ${msg.content}`;
            dmList.appendChild(div);
        });
    }
}

// Search
document.getElementById('searchBar')?.addEventListener('input', function(event) {
    const query = event.target.value.toLowerCase();
    const channelResults = channels
        .filter(channel => channel.name.toLowerCase().includes(query) || channel.description.toLowerCase().includes(query))
        .map(channel => `Channel: ${channel.name} - ${channel.description}`);
    
    const messageResults = Object.keys(messages).flatMap(channelName => {
        return messages[channelName]
            .filter(msg => msg.content.toLowerCase().includes(query))
            .map(msg => `Message in ${channelName} from ${msg.sender} at ${msg.timestamp}: ${msg.content}`);
    });

    const directMessageResults = Object.keys(directMessages).flatMap(username => {
        return directMessages[username]
            .filter(msg => msg.content.toLowerCase().includes(query))
            .map(msg => `Direct message to ${username} from ${msg.sender} at ${msg.timestamp}: ${msg.content}`);
    });

    const results = [...channelResults, ...messageResults, ...directMessageResults];
    displaySearchResults(results);
});