document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('feed-container');
    const loadingElement = document.getElementById('loading');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    const refreshBtn = document.getElementById('refresh-btn');
    const tryCacheBtn = document.getElementById('try-cache-btn');
    const statusIndicator = document.getElementById('status-indicator');
    const feedSource = document.getElementById('feed-source');
    const lastUpdate = document.getElementById('last-update');
    const themeToggle = document.getElementById('theme-toggle');
    const emptyFeed = document.getElementById('empty-feed');
    const appTitle = document.getElementById('app-title');
    const appDescription = document.getElementById('app-description');

    initTheme();
    loadFeed();

    refreshBtn.addEventListener('click', () => {
        refreshBtn.disabled = true;
        updateStatus('warning', 'Atualizando...', 'fa-sync-alt fa-spin');
        loadFeed(true);
    });

    tryCacheBtn.addEventListener('click', () => {
        loadCachedFeed();
    });

    themeToggle.addEventListener('click', toggleTheme);

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    function toggleTheme() {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    function loadFeed(forceRefresh = false) {
        showLoading();
        hideError();
        hideEmptyFeed();
        
        fetch('/api/feed')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar feed: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data.items || data.items.length === 0) {
                    showEmptyFeed();
                } else {
                    displayFeed(data);
                }
                updateSourceInfo(data, 'Online');
                hideLoading();
                updateStatus('success', 'Atualizado', 'fa-check');
            })
            .catch(error => {
                console.error('Erro ao carregar feed:', error);
                loadCachedFeed();
            })
            .finally(() => {
                refreshBtn.disabled = false;
            });
    }

    function loadCachedFeed() {
        fetch('/api/cache')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Cache não disponível: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data.items || data.items.length === 0) {
                    showEmptyFeed();
                } else {
                    displayFeed(data);
                }
                updateSourceInfo(data, 'Cache S3');
                hideLoading();
                updateStatus('info', 'Usando cache', 'fa-database');
            })
            .catch(error => {
                console.error('Erro ao carregar cache:', error);
                showError(`Não foi possível carregar o feed. ${error.message}`);
                hideLoading();
                updateStatus('danger', 'Erro', 'fa-exclamation-triangle');
                showEmptyFeed();
            });
    }

    function displayFeed(feed) {
        feedContainer.innerHTML = '';

        feed.items.forEach(item => {
            const date = new Date(item.pubDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const categories = item.categories && item.categories.length > 0 
                ? `<div class="mt-2 mb-3">${item.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}</div>`
                : '';

            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4 mb-4';
            card.innerHTML = `
                <div class="card news-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        ${categories}
                        <p class="card-text">${item.contentSnippet || 'Sem descrição disponível'}</p>
                    </div>
                    <div class="card-footer">
                        <small class="card-date">${date}</small>
                        <a href="${item.link}" target="_blank" class="btn btn-sm btn-outline-primary">Ler mais</a>
                    </div>
                </div>
            `;
            feedContainer.appendChild(card);
        });
    }

    function updateSourceInfo(data, source) {
        feedSource.textContent = `${data.title || 'Portal Gov.br'} (${source})`;
        
        const updateDate = new Date(data.lastUpdated).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        lastUpdate.textContent = updateDate;
    }

    function showLoading() {
        loadingElement.classList.remove('d-none');
    }

    function hideLoading() {
        loadingElement.classList.add('d-none');
    }

    function showError(message) {
        errorContainer.classList.remove('d-none');
        errorMessage.textContent = message;
    }

    function hideError() {
        errorContainer.classList.add('d-none');
    }

    function showEmptyFeed() {
        emptyFeed.classList.remove('d-none');
    }

    function hideEmptyFeed() {
        emptyFeed.classList.add('d-none');
    }

    function updateStatus(type, text, icon) {
        statusIndicator.className = `ms-2 badge rounded-pill bg-${type}`;
        statusIndicator.innerHTML = `<i class="fas ${icon || 'fa-info-circle'} me-1"></i><span>${text}</span>`;
    }
});