import React from 'react'
import '../styles/Hero.css'

function Hero({ movies, onSelectMovie }) {
  const displayMovies = movies.slice(0, 15)

  const handleStartWatching = () => {
    window.scrollTo({ top: 800, behavior: 'smooth' })
  }

  return (
    <div className="hero-new">
      <div className="hero-new-content">
        <div className="hero-text">
          <h1 className="hero-new-title">
            Unlimited Movies, TV Shows & More
          </h1>
          
          <div className="hero-new-buttons">
            <button className="btn-new btn-new-primary" onClick={handleStartWatching}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Start Watching Free
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="hero-movies-showcase">
          <div className="movies-grid-display">
            {displayMovies.map((movie, index) => (
              <div 
                key={movie.id || index} 
                className="showcase-card"
                onClick={() => onSelectMovie(movie)}
                style={{
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <img 
                  src={movie.poster_url || 'https://via.placeholder.com/200x300'} 
                  alt={movie.title}
                />
                <div className="showcase-overlay">
                  <span className="showcase-title">{movie.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
