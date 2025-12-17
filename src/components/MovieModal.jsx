import React, { useState, useEffect } from 'react'
import '../styles/MovieModal.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'

function MovieModal({ movie, onClose, isInWatchlist, onToggleWatchlist }) {
  const [trailerKey, setTrailerKey] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrailer()
  }, [movie.id])

  const fetchTrailer = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      )
      const data = await response.json()
      
      // Find official trailer or teaser
      const trailer = data.results?.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      ) || data.results?.find(
        video => video.type === 'Teaser' && video.site === 'YouTube'
      )
      
      if (trailer) {
        setTrailerKey(trailer.key)
      }
    } catch (error) {
      console.error('Error fetching trailer:', error)
    }
    setLoading(false)
  }

  const handlePlayTrailer = () => {
    if (trailerKey) {
      setShowTrailer(true)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        {showTrailer && trailerKey ? (
          <div className="modal-trailer">
            <button className="trailer-close" onClick={() => setShowTrailer(false)}>
              ← Back to Details
            </button>
            <div className="trailer-container">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <>
            <div className="modal-hero">
              <img src={movie.backdrop_url || movie.poster_url || movie.cover_url} alt={movie.title} />
              <div className="modal-hero-gradient"></div>
            </div>
            <div className="modal-details">
              <h2>{movie.title}</h2>
              <div className="modal-meta">
                {movie.year && <span className="meta-item">{movie.year}</span>}
                {movie.rating && <span className="meta-item">⭐ {movie.rating}</span>}
                {movie.runtime && <span className="meta-item">{movie.runtime} min</span>}
              </div>
              <p className="modal-description">
                {movie.description || 'No description available for this title.'}
              </p>
              <div className="modal-buttons">
                {trailerKey && (
                  <button className="btn btn-primary" onClick={handlePlayTrailer}>
                    ▶ Watch Trailer
                  </button>
                )}
                {!trailerKey && !loading && (
                  <button className="btn btn-primary" disabled style={{opacity: 0.5}}>
                    No Trailer Available
                  </button>
                )}
                {loading && (
                  <button className="btn btn-primary" disabled>
                    Loading...
                  </button>
                )}
                <button 
                  className={`btn btn-secondary ${isInWatchlist ? 'in-watchlist' : ''}`}
                  onClick={() => onToggleWatchlist(movie)}
                >
                  {isInWatchlist ? '✓ In My List' : '+ My List'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MovieModal
