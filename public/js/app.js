document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    const elements = {
        feedsContainer: document.getElementById('feeds'),
        loadingElement: document.getElementById('loading'),
        messageElement: document.getElementById('message'),
        refreshButton: document.getElementById('refresh-btn'),
        sourceSelect: document.getElementById('source')
    };
    
    let state = {
        currentSource: 'govbr'
    };
    
    setupEventListeners();
    loadFeeds();
    
    function setupEventListeners() {
        elements.refreshButton.addEventListener('click', refreshFeeds);
        elements.sourceSelect.addEventListener('change', (event) => {
            state.currentSource = event.target.value;
            loadFeeds();
        });
    }
    
    function showLoading() {
        elements.loadingElement.style.display = 'block';
        elements.messageElement.style.display = 'none';
        elements.feedsContainer.innerHTML = '';
    }
    
    function hideLoading() {
        elements.loadingElement.style.display = 'none';
    }
    
    function showMessage(message, isError = false) {
        elements.messageElement.textContent = message;
        elements.messageElement.style.display = 'block';
        if (isError) {
            elements.messageElement.classList.add('error');
        } else {
            elements.messageElement.classList.remove('error');
        }
    }
    
    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }
    
    function createFeedCard(feed) {
        const card = document.createElement('div');
        card.className = 'feed-card';
        
        const title = document.createElement('h2');
        const titleLink = document.createElement('a');
        titleLink.href = feed.link;
        titleLink.target = '_blank';
        titleLink.textContent = feed.title;
        title.appendChild(titleLink);
        
        const date = document.createElement('p');
        date.className = 'date';
        date.textContent = formatDate(feed.pubDate);
        
        const description = document.createElement('div');
        description.className = 'description';
        description.innerHTML = feed.description;
        
        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(description);
        
        return card;
    }
    
    function renderFeeds(feeds) {
        elements.feedsContainer.innerHTML = '';
        
        if (!feeds || feeds.length === 0) {
            showMessage('Nenhum feed encontrado.');
            return;
        }
        
        feeds.forEach(feed => {
            const card = createFeedCard(feed);
            elements.feedsContainer.appendChild(card);
        });
    }
    
    async function loadFeeds() {
        showLoading();
        
        try {
            const response = await fetch(`/api/feeds?source=${state.currentSource}`);
            const data = await response.json();
            
            hideLoading();
            
            if (response.ok) {
                renderFeeds(data);
            } else {
                showMessage(`Erro ao carregar feeds: ${data.message}`, true);
            }
        } catch (error) {
            hideLoading();
            showMessage(`Erro na comunicação com o servidor: ${error.message}`, true);
        }
    }
    
    async function refreshFeeds() {
        showLoading();
        showMessage('Atualizando feeds...');
        
        try {
            const response = await fetch('/api/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ source: state.currentSource })
            });
            
            const data = await response.json();
            hideLoading();
            
            if (response.ok) {
                showMessage('Feeds atualizados com sucesso!');
                renderFeeds(data);
            } else {
                showMessage(`Erro ao atualizar feeds: ${data.message}`, true);
            }
        } catch (error) {
            hideLoading();
            showMessage(`Erro na comunicação com o servidor: ${error.message}`, true);
        }
    }
}