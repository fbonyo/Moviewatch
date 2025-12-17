import React from 'react'
import MovieCard from './MovieCard'
import '../styles/MovieGrid.css'

function MovieGrid({ movies, loading, loadingMore, onSelectMovie, watchlist, onToggleWatchlist, title = "Trending Now" }) {
  if (loading) {
    return (
      <div className="movie-grid-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading amazing content...</p>
        </div>
      </div>
    )
  }

  if (movies.length === 0) {
    const isMyList = title === "My List"
    
    return (
      <div className="movie-grid-container">
        <h2 className="section-title">{title}</h2>
        <div className="empty-state">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            {isMyList ? (
              <>
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </>
            ) : (
              <>
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                <polyline points="17 2 12 7 7 2"/>
              </>
            )}
          </svg>
          <h3>{isMyList ? "Your list is empty" : "No content found"}</h3>
          <p>
            {isMyList 
              ? "Add movies and TV shows to your list by clicking the + button on any title"
              : "Try adjusting your search or check back later"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-grid-container">
      <h2 className="section-title">{title}</h2>
      <div className="movie-grid">
        {movies.map((movie, index) => (
          <MovieCard 
            key={`${movie.type}-${movie.id}-${index}`} 
            movie={movie}
            onClick={() => onSelectMovie(movie)}
            isInWatchlist={watchlist.some(m => m.id === movie.id && m.type === movie.type)}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
      
      {loadingMore && (
        <div className="loading-more">
          <div className="loading-spinner-small"></div>
          <p>Loading more...</p>
        </div>
      )}
    </div>
  )
}

export default MovieGrid
