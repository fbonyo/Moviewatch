import React, { useRef, useState } from 'react'
import '../styles/MovieCard.css'

function MovieCard({ movie, onClick, isInWatchlist, onToggleWatchlist }) {
  const cardRef = useRef(null)
  const [transform, setTransform] = useState('')
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`)
  }

  const handleMouseLeave = () => {
    setTransform('')
  }

  const handleWatchlistClick = (e) => {
    e.stopPropagation()
    onToggleWatchlist(movie)
  }

  return (
    <div 
      className="movie-card" 
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
    >
      <div className="movie-card-inner">
        <div className="movie-card-image">
          {!imageLoaded && (
            <div className="image-placeholder">
              <div className="image-loading"></div>
            </div>
          )}
          <img 
            src={movie.poster_url || movie.cover_url || 'https://via.placeholder.com/300x450'} 
            alt={movie.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
          <div className="movie-card-overlay">
            <button className="play-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <div className="movie-quick-info">
              <span className="quick-rating">⭐ {movie.rating}</span>
              <span className="quick-year">{movie.year}</span>
            </div>
          </div>
          <button 
            className={`watchlist-btn ${isInWatchlist ? 'in-watchlist' : ''}`}
            onClick={handleWatchlistClick}
          >
            {isInWatchlist ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            )}
          </button>
          <div className="card-shine"></div>
        </div>
        <div className="movie-card-info">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-meta">
            <span className="movie-year-badge">{movie.year}</span>
            <span className="movie-rating">⭐ {movie.rating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
