// Google Sheet URL
const apiURL = "https://opensheet.vercel.app/18wT8x-Lubi_Idd1yiHE-PRvHIKSd5CX4orb0Jm0YJvc/Movies";

// DOM Elements
const searchBar = document.getElementById('search-bar');
const recentMoviesContainer = document.getElementById('recent-movies');
const searchResultsContainer = document.getElementById('search-results');
const refreshBtn = document.getElementById('refresh-btn');

// Store all movies data
let allMovies = [];

// Fetch movies from Google Sheets
async function fetchMovies() {
    try {
        // Show loading state
        recentMoviesContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading movies...</p>
            </div>
        `;
        
        const response = await fetch(apiURL);
        const rawData = await response.json();
        
        // Process data - handle different possible data structures
        allMovies = rawData.map((item, index) => {
            // Handle different possible key names
            const title = item['Movie Title'] || item['movie title'] || item['title'] || item['Title'] || 'Unknown Title';
            const poster = item['Poster URL'] || item['poster url'] || item['poster'] || item['Poster'] || 'https://placehold.co/300x450?text=No+Poster';
            const screenshot = item['Screenshot URL'] || item['screenshot url'] || item['screenshot'] || item['Screenshot'] || 'https://placehold.co/300x200?text=No+Screenshot';
            const download = item['Download Link'] || item['download link'] || item['download'] || item['Download'] || '#';
            
            return {
                id: index,
                title: title,
                poster: poster,
                screenshot: screenshot,
                download: download
            };
        });
        
        // Display recent movies (last 6)
        displayRecentMovies();
        
        // Display all movies in search results
        displaySearchResults(allMovies);
        
    } catch (error) {
        console.error('Error fetching movies:', error);
        recentMoviesContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading movies. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

// Display recent movies (last 6)
function displayRecentMovies() {
    const recentMovies = allMovies.slice(-6).reverse();
    recentMoviesContainer.innerHTML = '';
    
    if (recentMovies.length === 0) {
        recentMoviesContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-film"></i>
                <p>No recent movies found</p>
            </div>
        `;
        return;
    }
    
    recentMovies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        recentMoviesContainer.appendChild(movieCard);
    });
}

// Display search results
function displaySearchResults(movies) {
    searchResultsContainer.innerHTML = '';
    
    if (movies.length === 0) {
        searchResultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No movies found matching your search</p>
            </div>
        `;
        return;
    }
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        searchResultsContainer.appendChild(movieCard);
    });
}

// Create movie card element
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    card.innerHTML = `
        <div class="poster-container">
            <img src="${movie.poster}" alt="${movie.title} Poster" onerror="this.src='https://placehold.co/300x450?text=No+Poster'">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="screenshots">
                <img src="${movie.screenshot}" alt="${movie.title} Screenshot" onerror="this.src='https://placehold.co/300x200?text=No+Screenshot'">
            </div>
            <a href="${movie.download}" class="download-btn" target="_blank" rel="noopener noreferrer">
                <i class="fas fa-download"></i> Download Now
            </a>
        </div>
    `;
    
    return card;
}

// Filter movies based on search term
function filterMovies(searchTerm) {
    if (!searchTerm) {
        displaySearchResults(allMovies);
        return;
    }
    
    const filteredMovies = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    displaySearchResults(filteredMovies);
}

// Event Listeners
searchBar.addEventListener('input', () => {
    filterMovies(searchBar.value);
});

refreshBtn.addEventListener('click', () => {
    fetchMovies();
});

// Initial fetch
fetchMovies();