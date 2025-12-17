import React from 'react'
import '../styles/Hero.css'

function Hero({ movies, onSelectMovie }) {
  const displayMovies = movies.slice(0, 15)

  return (
    <div className="hero-new">
      <div className="hero-new-content">
        <div className="hero-text">
          <h1 className="hero-new-title">
            Unlimited Movies, TV Shows & More
          </h1>
          <p className="hero-new-description">
            Stream thousands of movies and shows for free. Watch anywhere, anytime on any device.
          </p>
          <div className="hero-new-buttons">
            <button className="btn-new btn-new-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Start Watching Free
            </button>
            <button className="btn-new btn-new-secondary">
              Learn More
            </button>
          </div>
        </div>

        <div className="hero-movies-showcase">
          <div className="movies-perspective">
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
                  <span>{movie.title}</span>
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
