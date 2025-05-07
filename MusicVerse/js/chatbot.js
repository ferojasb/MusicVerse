export function initChatbot() {
    let isOpen = false;
    let isLoading = false;

    async function sendMessage(message) {
        try {
            console.log('Sending message:', message);
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error in sendMessage:', error);
            throw error;
        }
    }

    function addMessage(message, isUser = false) {
        const chatHistory = document.querySelector('.chat-history');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
        
        if (isUser) {
            messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        } else {
            messageDiv.innerHTML = `
                <img src="https://i.postimg.cc/8Td6SgVd/Chat-GPT-Image-Apr-27-2025-08-15-01-PM.png" alt="Assistant Avatar" class="bot-avatar">
                <div class="message-content">${message}</div>
            `;
        }
        
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function toggleChat() {
        const chatWindow = document.querySelector('.chat-window');
        const chatButton = document.querySelector('.chat-button');
        
        isOpen = !isOpen;
        chatWindow.style.transform = isOpen ? 'translateY(0)' : 'translateY(120%)';
        
        // Simplified button handling
        chatButton.style.opacity = isOpen ? '0' : '1';
        chatButton.style.visibility = isOpen ? 'hidden' : 'visible';
        
        // Log for debugging
        console.log('Chat toggled:', isOpen);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const input = document.querySelector('.chat-input');
        const message = input.value.trim();
        if (!message || isLoading) return;

        console.log('Handling submit:', message); // Debug log
        
        // Add user message
        addMessage(message, true);
        input.value = '';

        // Show loading state
        isLoading = true;
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'chat-message bot-message loading';
        loadingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        document.querySelector('.chat-history').appendChild(loadingDiv);

        try {
            // Get bot response
            const response = await sendMessage(message);
            // Remove loading indicator and add response
            loadingDiv.remove();
            addMessage(response);
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            loadingDiv.remove();
            addMessage('Sorry, I encountered an error. Please try again.');
        } finally {
            isLoading = false;
        }
    }

    // Remove existing chatbot if present
    const existingChatbot = document.querySelector('.chatbot-container');
    if (existingChatbot) {
        existingChatbot.remove();
    }

    // Create and inject chatbot HTML
    const chatbotHTML = `
        <div class="chatbot-container">
            <button class="chat-button" aria-label="Open chat">
                <i class="fas fa-comments"></i>
            </button>
            <div class="chat-window">
                <div class="chat-header">
                    <div class="chat-header-title">
                        <i class="fas fa-robot"></i>
                        <h3>MusicVerse Assistant</h3>
                    </div>
                    <button class="minimize-button" aria-label="Close chat">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
                <div class="chat-history">
                    <div class="chat-message bot-message">
                        <img src="https://i.postimg.cc/8Td6SgVd/Chat-GPT-Image-Apr-27-2025-08-15-01-PM.png" alt="Assistant Avatar" class="bot-avatar">
                        <div class="message-content">
                            Hi! I'm your MusicVerse assistant. Ask me anything about vinyl records, albums, or artists! 🎵
                        </div>
                    </div>
                </div>
                <form class="chat-form">
                    <input type="text" 
                           class="chat-input" 
                           placeholder="Ask about vinyl records, albums, artists..."
                           aria-label="Chat input">
                    <button type="submit" class="send-button" aria-label="Send message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    `;

    // Add chatbot to page
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // Add event listeners with slight delay to ensure DOM elements are ready
    setTimeout(() => {
        const chatButton = document.querySelector('.chat-button');
        const minimizeButton = document.querySelector('.minimize-button');
        const chatForm = document.querySelector('.chat-form');

        if (chatButton) chatButton.addEventListener('click', toggleChat);
        if (minimizeButton) minimizeButton.addEventListener('click', toggleChat);
        if (chatForm) chatForm.addEventListener('submit', handleSubmit);
        
        // Log for debugging
        console.log('Chat listeners initialized');
    }, 100);
}

const LASTFM_API = 'https://ws.audioscrobbler.com/2.0/';
const LASTFM_KEY = 'b4d3a8f2413b1000bc46b35c2b54c396';

async function getAlbumImageFromLastFM(albumName, artistName) {
    try {
        const response = await fetch(
            `${LASTFM_API}?method=album.getinfo&api_key=${LASTFM_KEY}&artist=${encodeURIComponent(artistName)}&album=${encodeURIComponent(albumName)}&format=json`
        );
        const data = await response.json();
        const images = data?.album?.image || [];
        const largeImage = images.find(img => img.size === 'extralarge');
        return largeImage?.['#text'] || null;
    } catch (error) {
        console.error('Error fetching from Last.fm:', error);
        return null;
    }
}

async function loadFeaturedAlbums() {
    const albumGrid = document.getElementById('featured-albums');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    const featuredAlbums = [
        {
            name: "Kind of Blue",
            artist: "Miles Davis",
            type: "analog",
            label: "Pure Analog Recording",
            fallbackImage: "https://lastfm.freetls.fastly.net/i/u/300x300/1cae68cd26364a789e7c9f58e2299561.jpg"
        },
        {
            name: "Random Access Memories",
            artist: "Daft Punk",
            type: "digital",
            label: "Digital Master",
            fallbackImage: "https://lastfm.freetls.fastly.net/i/u/300x300/0f9e1c581e17404b8f861d2fe76ed89a.jpg"
        },
        {
            name: "Abbey Road",
            artist: "The Beatles",
            type: "bundle",
            label: "Collector's Edition",
            fallbackImage: "https://lastfm.freetls.fastly.net/i/u/300x300/2e1bac0fc5d84107ac39d3d22c8895b9.jpg"
        }
    ];

    try {
        albumGrid.innerHTML = '';
        loadingIndicator.style.display = 'flex';
        
        for (const album of featuredAlbums) {
            const imageUrl = await getAlbumImageFromLastFM(album.name, album.artist);
            const albumHTML = `
                <div class="album">
                    <span class="album-type ${album.type}">${album.label}</span>
                    <div class="album-img">
                        <img src="${imageUrl || album.fallbackImage}" 
                             alt="${album.name}"
                             onerror="this.src='${album.fallbackImage}'">
                    </div>
                    <div class="album-content">
                        <h3 class="album-title">${album.name}</h3>
                        <p class="album-artist">${album.artist}</p>
                        <div class="album-details">
                            <p>Classic Release</p>
                            <p>${album.type.charAt(0).toUpperCase() + album.type.slice(1)} Recording</p>
                        </div>
                    </div>
                </div>
            `;
            albumGrid.insertAdjacentHTML('beforeend', albumHTML);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    } catch (error) {
        console.error('Error loading featured albums:', error);
        albumGrid.innerHTML = '<p class="no-results">Error loading albums</p>';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedAlbums().catch(console.error);
    initChatbot();
}, { once: true });
