// News Aggregator JavaScript

class NewsAggregator {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8080/api/news';
        this.currentCategory = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadNews(); // Load top headlines by default
    }

    bindEvents() {
        // Category navigation
        document.querySelectorAll('.nav-link[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCategoryClick(e.target);
            });
        });

        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.handleSearch();
        });

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
    }

    handleCategoryClick(element) {
        // Update active nav item
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        element.classList.add('active');

        // Get category and load news
        const category = element.dataset.category;
        this.currentCategory = category;
        this.updateCategoryTitle(category);
        this.loadNews(category);
    }

    updateCategoryTitle(category) {
        const categoryTitle = document.getElementById('categoryTitle');
        const categoryTitles = {
            '': { title: 'Top Headlines', icon: 'fas fa-fire' },
            'business': { title: 'Business News', icon: 'fas fa-chart-line' },
            'technology': { title: 'Technology', icon: 'fas fa-microchip' },
            'sports': { title: 'Sports', icon: 'fas fa-futbol' },
            'entertainment': { title: 'Entertainment', icon: 'fas fa-film' },
            'health': { title: 'Health', icon: 'fas fa-heartbeat' }
        };

        const categoryInfo = categoryTitles[category] || categoryTitles[''];
        categoryTitle.innerHTML = `<i class="${categoryInfo.icon} text-danger me-2"></i>${categoryInfo.title}`;
    }

    async handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim();
        
        if (!query) {
            alert('Please enter a search term');
            return;
        }

        this.currentCategory = 'search';
        this.updateCategoryTitle('search');
        document.getElementById('categoryTitle').innerHTML = `<i class="fas fa-search text-danger me-2"></i>Search Results: "${query}"`;
        
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        await this.searchNews(query);
    }

    async loadNews(category = '') {
        this.showLoading(true);
        this.hideError();
        this.hideNoResults();

        try {
            let url = `${this.API_BASE_URL}/headlines?country=us`;
            if (category) {
                url += `&category=${category}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch news');
            }

            this.displayNews(data.articles || []);
        } catch (error) {
            console.error('Error loading news:', error);
            this.showError(error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async searchNews(query) {
        this.showLoading(true);
        this.hideError();
        this.hideNoResults();

        try {
            const url = `${this.API_BASE_URL}/search?query=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to search news');
            }

            this.displayNews(data.articles || []);
        } catch (error) {
            console.error('Error searching news:', error);
            this.showError(error.message);
        } finally {
            this.showLoading(false);
        }
    }

    displayNews(articles) {
        const newsContainer = document.getElementById('newsContainer');
        
        if (!articles || articles.length === 0) {
            this.showNoResults();
            newsContainer.innerHTML = '';
            return;
        }

        const newsHTML = articles.map(article => this.createArticleCard(article)).join('');
        newsContainer.innerHTML = newsHTML;
    }

    createArticleCard(article) {
        const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const imageUrl = article.urlToImage || 'https://via.placeholder.com/400x200/e9ecef/6c757d?text=No+Image';
        const title = article.title || 'No title available';
        const description = article.description || 'No description available';
        const source = article.source?.name || 'Unknown Source';
        const url = article.url || '#';

        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="news-card">
                    <img src="${imageUrl}" alt="${title}" class="news-image" 
                         onerror="this.src='https://via.placeholder.com/400x200/e9ecef/6c757d?text=No+Image'">
                    <div class="news-content">
                        <a href="${url}" target="_blank" class="news-title">
                            ${title}
                        </a>
                        <p class="news-description">
                            ${description}
                        </p>
                        <div class="news-meta">
                            <span class="news-source">${source}</span>
                            <span class="news-date">${publishedDate}</span>
                        </div>
                        <a href="${url}" target="_blank" class="read-more-btn">
                            <i class="fas fa-external-link-alt me-1"></i>
                            Read Full Article
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        loading.style.display = show ? 'block' : 'none';
    }

    showError(message) {
        const errorDiv = document.getElementById('error');
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        errorDiv.classList.remove('d-none');
    }

    hideError() {
        const errorDiv = document.getElementById('error');
        errorDiv.classList.add('d-none');
    }

    showNoResults() {
        const noResults = document.getElementById('noResults');
        noResults.classList.remove('d-none');
    }

    hideNoResults() {
        const noResults = document.getElementById('noResults');
        noResults.classList.add('d-none');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NewsAggregator();
});

// Add some utility functions for enhanced UX
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll to top when category changes
    document.querySelectorAll('.nav-link[data-category]').forEach(link => {
        link.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Add loading state to search button
    const searchBtn = document.getElementById('searchBtn');
    const originalSearchHTML = searchBtn.innerHTML;
    
    // You can extend this to show loading state during search
    function setSearchLoading(loading) {
        if (loading) {
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            searchBtn.disabled = true;
        } else {
            searchBtn.innerHTML = originalSearchHTML;
            searchBtn.disabled = false;
        }
    }
});