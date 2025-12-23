import React, { useState, useEffect, useRef } from 'react'
import MovieCard from './MovieCard'
import '../styles/CategorySections.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

function CategorySections({ onSelectMovie, watchlist, onToggleWatchlist }) {
  const [categories, setCategories] = useState({
    trending: [],
    topRated: [],
    nowPlaying: [],
    upcoming: [],
    hottestTVShows: [],
    newTVReleases: [],
    kDramas: [],
    cDramas: [],
    action: [],
    comedy: [],
    horror: [],
    romance: [],
    sciFi: [],
    thriller: [],
    animation: [],
    documentary: []
  })
  const [loading, setLoading] = useState(true)
  const scrollRefs = useRef({})

  useEffect(() => {
    fetchAllCategories()
  }, [])

  const fetchAllCategories = async () => {
    setLoading(true)
    try {
      const [
        trending, 
        topRated, 
        nowPlaying, 
        upcoming,
        hottestTVShows,
        newTVReleases,
        kDramas,
        cDramas,
        action, 
        comedy, 
        horror, 
        romance, 
        sciFi, 
        thriller, 
        animation, 
        documentary
      ] = await Promise.all([
        // Movies
        fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`).then(r => r.json()),
        
        // TV Shows
        fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US&page=1`).then(r => r.json()),
        
        // K-Dramas (Korean TV Shows)
        fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_original_language=ko&sort_by=popularity.desc`).then(r => r.json()),
        
        // C-Dramas (Chinese TV Shows)
        fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_original_language=zh&sort_by=popularity.desc`).then(r => r.json()),
        
        // Movie Genres
        fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28&sort_by=popularity.desc`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35&sort_by=popularity.desc`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27&sort_by=popularity.desc`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749&sort_by=popularity.desc`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=878&sort_by=popularity.desc`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=53&sort_by=popularity.desc`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16&sort_by=popularity.desc`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99&sort_by=popularity.desc`).then(r => r.json())
      ])

      const formatMovies = (results, type = 'movie') => results.slice(0, 15).map(item => ({
        id: item.id,
        title: item.title || item.name,
        year: (item.release_date || item.first_air_date)?.split('-')[0] || '2024',
        rating: item.vote_average?.toFixed(1) || 'N/A',
        poster_url: item.poster_path 
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : 'https://via.placeholder.com/500x750',
        description: item.overview || 'No description available.',
        backdrop_url: item.backdrop_path
          ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
          : null,
        type: type
      }))

      setCategories({
        trending: formatMovies(trending.results),
        topRated: formatMovies(topRated.results),
        nowPlaying: formatMovies(nowPlaying.results),
        upcoming: formatMovies(upcoming.results),
        hottestTVShows: formatMovies(hottestTVShows.results, 'tv'),
        newTVReleases: formatMovies(newTVReleases.results, 'tv'),
        kDramas: formatMovies(kDramas.results, 'tv'),
        cDramas: formatMovies(cDramas.results, 'tv'),
        action: formatMovies(action.results),
        comedy: formatMovies(comedy.results),
        horror: formatMovies(horror.results),
        romance: formatMovies(romance.results),
        sciFi: formatMovies(sciFi.results),
        thriller: formatMovies(thriller.results),
        animation: formatMovies(animation.results),
        documentary: formatMovies(documentary.results)
      })
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
    setLoading(false)
  }

  const scroll = (key, direction) => {
    const container = scrollRefs.current[key]
    if (container) {
      const scrollAmount = direction === 'left' ? -800 : 800
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const categoryData = [
    { key: 'trending', title: 'Trending Movies', icon: '🔥', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { key: 'topRated', title: 'Top Rated Movies', icon: '⭐', gradient: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)' },
    { key: 'hottestTVShows', title: 'Hottest TV Shows', icon: '📺', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { key: 'newTVReleases', title: 'New TV Releases', icon: '🆕', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
    { key: 'kDramas', title: 'Korean Dramas', icon: '🇰🇷', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
    { key: 'cDramas', title: 'Chinese Dramas', icon: '🇨🇳', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { key: 'nowPlaying', title: 'Now Playing', icon: '🎬', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { key: 'upcoming', title: 'Coming Soon', icon: '📅', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { key: 'action', title: 'Action Movies', icon: '💥', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { key: 'comedy', title: 'Comedy', icon: '😂', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
    { key: 'horror', title: 'Horror', icon: '👻', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { key: 'romance', title: 'Romance', icon: '💕', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
    { key: 'sciFi', title: 'Sci-Fi & Fantasy', icon: '🚀', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
    { key: 'thriller', title: 'Thriller', icon: '😱', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { key: 'animation', title: 'Animation', icon: '🎨', gradient: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)' },
    { key: 'documentary', title: 'Documentary', icon: '📹', gradient: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)' }
  ]

  if (loading) {
    return (
      <div className="category-sections-loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="category-sections">
      {categoryData.map(({ key, title, icon, gradient }) => (
        <div key={key} className="category-section">
          <div className="category-header">
            <div className="category-title-wrapper">
              <span className="category-icon" style={{ background: gradient }}>{icon}</span>
              <h2 className="category-title">{title}</h2>
            </div>
            <div className="category-controls">
              <div className="category-count">{categories[key].length} titles</div>
              <div className="category-nav-buttons">
                <button 
                  className="category-nav-btn category-nav-left"
                  onClick={() => scroll(key, 'left')}
                  aria-label="Scroll left"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button 
                  className="category-nav-btn category-nav-right"
                  onClick={() => scroll(key, 'right')}
                  aria-label="Scroll right"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="category-scroll-wrapper">
            <div 
              className="category-scroll" 
              ref={el => scrollRefs.current[key] = el}
            >
              <div className="category-grid">
                {categories[key].map((movie, index) => (
                  <div key={`${movie.id}-${index}`} className="category-card-wrapper">
                    <MovieCard 
                      movie={movie}
                      onClick={() => onSelectMovie(movie)}
                      isInWatchlist={watchlist.some(m => m.id === movie.id && m.type === movie.type)}
                      onToggleWatchlist={onToggleWatchlist}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CategorySections
