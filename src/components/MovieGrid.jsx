import React from 'react'
import MovieCard from './MovieCard'
import '../styles/MovieGrid.css'

function MovieGrid({ movies, loading, onSelectMovie, watchlist, onToggleWatchlist }) {
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

  return (
    <div className="movie-grid-container">
      <h2 className="section-title">Trending Now</h2>
      <div className="movie-grid">
        {movies.map((movie, index) => (
          <MovieCard 
            key={movie.id || index} 
            movie={movie}
            onClick={() => onSelectMovie(movie)}
            isInWatchlist={watchlist.some(m => m.id === movie.id)}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
    </div>
  )
}

export default MovieGrid
