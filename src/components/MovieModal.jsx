import React, { useState, useEffect } from 'react'
import '../styles/MovieModal.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'

function MovieModal({ movie, onClose, isInWatchlist, onToggleWatchlist, onPlayMovie }) {
  const [trailerKey, setTrailerKey] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [similarContent, setSimilarContent] = useState([])
  const [loadingSimilar, setLoadingSimilar] = useState(true)
  const [movieDetails, setMovieDetails] = useState(null)
  const [credits, setCredits] = useState(null)

  useEffect(() => {
    fetchTrailer()
    fetchSimilarContent()
    fetchMovieDetails()
    fetchCredits()
  }, [movie.id, movie.type])

  // Keyboard shortcut: ESC to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const fetchMovieDetails = async () => {
    try {
      const endpoint = movie.type === 'tv' ? 'tv' : 'movie'
      const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${movie.id}?api_key=${TMDB_API_KEY}&language=en-US`
      )
      const data = await response.json()
      setMovieDetails(data)
    } catch (error) {
      console.error('Error fetching movie details:', error)
    }
  }

  const fetchCredits = async () => {
    try {
      const endpoint = movie.type === 'tv' ? 'tv' : 'movie'
      const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${movie.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`
      )
      const data = await response.json()
      setCredits(data)
    } catch (error) {
      console.error('Error fetching credits:', error)
    }
  }

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

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const director = credits?.crew?.find(person => person.job === 'Director')
  const writers = credits?.crew?.filter(person => 
    person.job === 'Writer' || person.job === 'Screenplay' || person.job === 'Story'
  ).slice(0, 3)
  const cast = credits?.cast?.slice(0, 8)

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
                {movieDetails?.runtime && <span className="meta-item">{formatRuntime(movieDetails.runtime)}</span>}
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
              </div>

              {/* Cast Section */}
              {cast && cast.length > 0 && (
                <div className="details-section">
                  <h3 className="details-section-title">Cast</h3>
                  <div className="cast-grid">
                    {cast.map((person) => (
                      <div key={person.id} className="cast-card">
                        <div className="cast-photo">
                          {person.profile_path ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} 
                              alt={person.name}
                            />
                          ) : (
                            <div className="cast-placeholder">
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="cast-info">
                          <p className="cast-name">{person.name}</p>
                          <p className="cast-character">{person.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Crew Section */}
              {(director || writers?.length > 0) && (
                <div className="details-section">
                  <h3 className="details-section-title">Crew</h3>
                  <div className="crew-list">
                    {director && (
                      <div className="crew-item">
                        <span className="crew-role">Director</span>
                        <span className="crew-name">{director.name}</span>
                      </div>
                    )}
                    {writers && writers.length > 0 && (
                      <div className="crew-item">
                        <span className="crew-role">Writers</span>
                        <span className="crew-name">{writers.map(w => w.name).join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Production Info */}
              {movieDetails && (
                <div className="details-section">
                  <h3 className="details-section-title">Production</h3>
                  <div className="production-grid">
                    {movieDetails.budget > 0 && (
                      <div className="production-item">
                        <span className="production-label">Budget</span>
                        <span className="production-value">{formatCurrency(movieDetails.budget)}</span>
                      </div>
                    )}
                    {movieDetails.revenue > 0 && (
                      <div className="production-item">
                        <span className="production-label">Box Office</span>
                        <span className="production-value">{formatCurrency(movieDetails.revenue)}</span>
                      </div>
                    )}
                    {movieDetails.production_companies?.length > 0 && (
                      <div className="production-item full-width">
                        <span className="production-label">Production Companies</span>
                        <span className="production-value">
                          {movieDetails.production_companies.map(c => c.name).join(', ')}
                        </span>
                      </div>
                    )}
                    {movieDetails.spoken_languages?.length > 0 && (
                      <div className="production-item">
                        <span className="production-label">Languages</span>
                        <span className="production-value">
                          {movieDetails.spoken_languages.map(l => l.english_name).join(', ')}
                        </span>
                      </div>
                    )}
                    {movieDetails.status && (
                      <div className="production-item">
                        <span className="production-label">Status</span>
                        <span className="production-value">{movieDetails.status}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Similar Content */}
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
  )
}

export default MovieModal
