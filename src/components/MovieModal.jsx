import React, { useState, useEffect } from 'react'
import SocialPanel from './SocialPanel'
import '../styles/MovieModal.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'

function MovieModal({ movie, onClose, isInWatchlist, onToggleWatchlist, onPlayMovie }) {
  const [trailerKey, setTrailerKey] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [showSocial, setShowSocial] = useState(false)
  const [loading, setLoading] = useState(true)
  const [similarContent, setSimilarContent] = useState([])
  const [loadingSimilar, setLoadingSimilar] = useState(true)

  useEffect(() => {
    fetchTrailer()
    fetchSimilarContent()
  }, [movie.id, movie.type])

  const fetchTrailer = async () => {
    setLoading(true)
    try {
      const endpoint = movie.type === 'tv' ? 'tv' : 'movie'
      const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      )
      const data = await response.json()
      
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

  const fetchSimilarContent = async () => {
    setLoadingSimilar(true)
    try {
      const endpoint = movie.type === 'tv' ? 'tv' : 'movie'
      const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${movie.id}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      )
      const data = await response.json()
      
      const formatted = data.results?.slice(0, 6).map(item => ({
        id: item.id,
        title: item.title || item.name,
        year: (item.release_date || item.first_air_date)?.split('-')[0] || 'N/A',
        rating: item.vote_average?.toFixed(1) || 'N/A',
        poster_url: item.poster_path 
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : 'https://via.placeholder.com/500x750',
        description: item.overview || 'No description available.',
        backdrop_url: item.backdrop_path
          ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
          : null,
        type: movie.type
      })) || []
      
      setSimilarContent(formatted)
    } catch (error) {
      console.error('Error fetching similar content:', error)
    }
    setLoadingSimilar(false)
  }

  const handlePlayTrailer = () => {
    if (trailerKey) {
      setShowTrailer(true)
    }
  }

  const handleSimilarClick = (similarMovie) => {
    onClose()
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openMovie', { detail: similarMovie }))
    }, 100)
  }

  const handlePlayNow = () => {
    onPlayMovie(movie)
  }

  return (
    <>
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
                  <span className="meta-item">{movie.type === 'tv' ? 'TV Show' : 'Movie'}</span>
                </div>
                <p className="modal-description">
                  {movie.description || 'No description available for this title.'}
                </p>
                <div className="modal-buttons">
                  <button className="btn btn-primary" onClick={handlePlayNow}>
                    ▶ Watch Now
                  </button>
                  {trailerKey && (
                    <button className="btn btn-secondary" onClick={handlePlayTrailer}>
                      🎬 Trailer
                    </button>
                  )}
                  <button 
                    className={`btn btn-secondary ${isInWatchlist ? 'in-watchlist' : ''}`}
                    onClick={() => onToggleWatchlist(movie)}
                  >
                    {isInWatchlist ? '✓ In My List' : '+ My List'}
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowSocial(true)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    Share & Review
                  </button>
                </div>

                <div className="similar-section">
                  <h3 className="similar-title">Similar {movie.type === 'tv' ? 'Shows' : 'Movies'}</h3>
                  {loadingSimilar ? (
                    <div className="similar-loading">
                      <div className="loading-spinner-small"></div>
                    </div>
                  ) : similarContent.length > 0 ? (
                    <div className="similar-grid">
                      {similarContent.map((item) => (
                        <div 
                          key={item.id} 
                          className="similar-card"
                          onClick={() => handleSimilarClick(item)}
                        >
                          <div className="similar-poster">
                            <img src={item.poster_url} alt={item.title} />
                            <div className="similar-overlay">
                              <span className="similar-play">▶</span>
                            </div>
                            <div className="similar-rating">⭐ {item.rating}</div>
                          </div>
                          <div className="similar-info">
                            <h4>{item.title}</h4>
                            <span className="similar-year">{item.year}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-similar">No similar content found</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showSocial && (
        <SocialPanel 
          movie={movie}
          onClose={() => setShowSocial(false)}
        />
      )}
    </>
  )
}

export default MovieModal
