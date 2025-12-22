import React, { useRef } from 'react'
import '../styles/MovieRow.css'

function MovieRow({ title, movies, onSelectMovie, watchlist, onToggleWatchlist }) {
  const rowRef = useRef(null)

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        <button className="scroll-btn scroll-left" onClick={() => scroll('left')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <div className="row-posters" ref={rowRef}>
          {movies.map((movie) => (
            <div
              key={`${movie.type}-${movie.id}`}
              className="row-poster"
              onClick={() => onSelectMovie(movie)}
            >
              <img src={movie.poster_url} alt={movie.title} />
              <div className="poster-overlay">
                <div className="poster-info">
                  <h3>{movie.title}</h3>
                  <span className="poster-rating">⭐ {movie.rating}</span>
                </div>
                <button
                  className={`poster-watchlist ${watchlist?.some(m => m.id === movie.id && m.type === movie.type) ? 'in-list' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleWatchlist(movie)
                  }}
                >
                  {watchlist?.some(m => m.id === movie.id && m.type === movie.type) ? '✓' : '+'}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="scroll-btn scroll-right" onClick={() => scroll('right')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default MovieRow
