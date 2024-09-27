const apiKey = 'd84b2378d0854c8b844faf8f477e23d2'; // Your NewsAPI key
const newsContainer = document.getElementById('news');
let currentPage = 1;
const pageSize = 9; // Number of articles per page
let totalPages = 0;
let currentQuery = '';

// Function to fetch news
async function fetchNews(page = 1, query = '') {
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}${query ? '&q=' + query : ''}`);
        const data = await response.json();
        totalPages = Math.ceil(data.totalResults / pageSize);
        displayNews(data.articles);
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
    } catch (error) {
        console.error('Error fetching news:', error);
        document.getElementById('errorMessage').innerText = 'Failed to load news articles.';
        document.getElementById('errorMessage').style.display = 'block';
    }
}

// Function to display news articles
function displayNews(articles) {
    newsContainer.innerHTML = '';
    articles.forEach(article => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        const cardClass = document.body.classList.contains('bg-dark') ? 'card-dark' : 'card-light';
        col.innerHTML = `
          <div class="card ${cardClass} d-flex flex-column fade-in">
            <img src="${article.urlToImage}" class="card-img-top" alt="${article.title}">
            <div class="card-body d-flex flex-grow-1 flex-column">
                <h5 class="card-title">${article.title}</h5>
                <p class="card-text">${article.description || 'No description available.'}</p>
                <a href="${article.url}" target="_blank" class="btn btn-light mt-auto">Read More</a>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <button class="btn btn-outline-primary btn-sm w-25 ml-5" onclick="shareOnTwitter('${encodeURIComponent(article.title)}', '${encodeURIComponent(article.url)}')">
                    <i class="fab fa-twitter"></i> Share
                </button>
                <button class="btn btn-outline-info btn-sm w-25 mr-5" onclick="shareOnFacebook('${encodeURIComponent(article.url)}')">
                    <i class="fab fa-facebook"></i> Share
                </button>
            </div>
          </div>
        `;
        newsContainer.appendChild(col);
    });
}

// Function to share on Twitter
function shareOnTwitter(title, url) {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
    window.open(tweetUrl, '_blank');
}

// Function to share on Facebook
function shareOnFacebook(url) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookUrl, '_blank');
}

// Function to update pagination visibility
function updatePagination() {
    document.getElementById('prevBtn').style.display = currentPage === 1 ? 'none' : 'inline-block';
    document.getElementById('nextBtn').style.display = currentPage === totalPages ? 'none' : 'inline-block';
}

// Event listeners for pagination buttons
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchNews(currentPage);
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchNews(currentPage);
    }
});

// Event listener for search button
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    currentQuery = query; // Save the current query
    currentPage = 1; // Reset to the first page
    fetchNews(currentPage, query);
});

// Event listener for sports section
document.getElementById('sportsLink').addEventListener('click', () => {
    currentQuery = ''; // Clear any previous search
    currentPage = 1; // Reset to the first page
    fetchNews(currentPage, 'sports'); // Fetch sports news
});

// Event listener for weather section
document.getElementById('weatherLink').addEventListener('click', () => {
    currentQuery = ''; // Clear any previous search
    currentPage = 1; // Reset to the first page
    fetchWeatherNews(); // Fetch weather news
});

// Function to fetch weather news (placeholder example)
async function fetchWeatherNews() {
    const weatherUrl = `https://newsapi.org/v2/everything?q=weather&pageSize=${pageSize}&page=${currentPage}&apiKey=${apiKey}`;
    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();
        totalPages = Math.ceil(data.totalResults / pageSize);
        displayNews(data.articles);
        updatePagination();
    } catch (error) {
        console.error('Error fetching weather news:', error);
        document.getElementById('errorMessage').innerText = 'Failed to load weather articles.';
        document.getElementById('errorMessage').style.display = 'block';
    }
}

// Toggle light/dark mode functionality
document.getElementById('toggleBtn').addEventListener('click', () => {
    document.body.classList.toggle('bg-dark');
    document.body.classList.toggle('bg-light');
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('bg-primary');
    navbar.classList.toggle('bg-light');

    // Toggle text colors
    const navbarLinks = document.querySelectorAll('.nav-link');
    navbarLinks.forEach(link => {
        link.classList.toggle('text-light');
        link.classList.toggle('text-dark');
    });

    // Toggle card classes
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.toggle('card-dark');
        card.classList.toggle('card-light');
    });

    // Toggle icon
    const toggleIcon = document.getElementById('toggleIcon');
    if (document.body.classList.contains('bg-dark')) {
        toggleIcon.classList.remove('fa-sun');
        toggleIcon.classList.add('fa-moon');
    } else {
        toggleIcon.classList.remove('fa-moon');
        toggleIcon.classList.add('fa-sun');
    }
});

// Initial fetch
fetchNews();
