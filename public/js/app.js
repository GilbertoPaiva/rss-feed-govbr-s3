document.addEventListener('DOMContentLoaded', function() {
    const feedsContainer = document.getElementById('feeds');
    const refreshBtn = document.getElementById('refresh-btn');
    const statusMessage = document.getElementById('status-message');
    
    loadFeeds();

    refreshBtn.addEventListener('click', refreshFeeds);

    function loadFeeds() {
        feedsContainer.innerHTML = '<div class="loading">Carregando feeds...</div>';
        
        fetch('/api/feeds')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar feeds');
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    feedsContainer.innerHTML = '<div class="loading">Nenhum feed disponível. Clique em "Atualizar Feeds".</div>';
                    return;
                }
                
                displayFeeds(data);
            })
            .catch(error => {
                console.error('Erro:', error);
                feedsContainer.innerHTML = `<div class="loading">Erro ao carregar feeds: ${error.message}</div>`;
            });
    }

    function refreshFeeds() {
        refreshBtn.disabled = true;
        refreshBtn.textContent = 'Atualizando...';
        
        fetch('/api/refresh', {
            method: 'POST'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar feeds');
            }
            return response.json();
        })
        .then(data => {
            showStatusMessage(`Feeds atualizados com sucesso! ${data.count} itens carregados.`, 'success');
            loadFeeds();
        })
        .catch(error => {
            console.error('Erro:', error);
            showStatusMessage(`Erro ao atualizar feeds: ${error.message}`, 'error');
        })
        .finally(() => {
            refreshBtn.disabled = false;
            refreshBtn.textContent = 'Atualizar Feeds';
        });
    }

    function displayFeeds(feeds) {
        feedsContainer.innerHTML = '';
        
        feeds.forEach(feed => {
            const date = new Date(feed.isoDate);
            const formattedDate = date.toLocaleString('pt-BR');
            
            const feedCard = document.createElement('div');
            feedCard.className = 'feed-card';
            feedCard.innerHTML = `
                <h3 class="feed-title">${feed.title}</h3>
                <p class="feed-date">Publicado em: ${formattedDate}</p>
                <p class="feed-snippet">${feed.contentSnippet || 'Sem descrição disponível.'}</p>
                <a href="${feed.link}" target="_blank" class="feed-link">Leia mais</a>
            `;
            
            feedsContainer.appendChild(feedCard);
        });
    }

    function showStatusMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type;
        statusMessage.style.display = 'block';
        
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }
});