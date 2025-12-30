import React from 'react'
import '../styles/GenreFilter.css'

function GenreFilter({ selectedGenre, onGenreChange, contentType = 'movie' }) {
  const movieGenres = [
    { id: null, name: 'All', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pattern: 'film' },
    { id: 28, name: 'Action', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', pattern: 'explosion' },
    { id: 12, name: 'Adventure', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', pattern: 'compass' },
    { id: 16, name: 'Animation', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', pattern: 'sparkle' },
    { id: 35, name: 'Comedy', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', pattern: 'laugh' },
    { id: 80, name: 'Crime', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', pattern: 'detective' },
    { id: 99, name: 'Documentary', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', pattern: 'camera' },
    { id: 18, name: 'Drama', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', pattern: 'mask' },
    { id: 10751, name: 'Family', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', pattern: 'family' },
    { id: 14, name: 'Fantasy', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', pattern: 'magic' },
    { id: 27, name: 'Horror', gradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)', pattern: 'skull' },
    { id: 10402, name: 'Music', gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', pattern: 'music' },
    { id: 9648, name: 'Mystery', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pattern: 'magnify' },
    { id: 10749, name: 'Romance', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', pattern: 'heart' },
    { id: 878, name: 'Sci-Fi', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', pattern: 'space' },
    { id: 53, name: 'Thriller', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', pattern: 'pulse' },
    { id: 10752, name: 'War', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', pattern: 'medal' },
    { id: 37, name: 'Western', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', pattern: 'cowboy' }
  ]

  const tvGenres = [
    { id: null, name: 'All', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pattern: 'tv' },
    { id: 10759, name: 'Action', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', pattern: 'explosion' },
    { id: 16, name: 'Animation', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', pattern: 'sparkle' },
    { id: 35, name: 'Comedy', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', pattern: 'laugh' },
    { id: 80, name: 'Crime', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', pattern: 'detective' },
    { id: 99, name: 'Documentary', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', pattern: 'camera' },
    { id: 18, name: 'Drama', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', pattern: 'mask' },
    { id: 10751, name: 'Family', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', pattern: 'family' },
    { id: 10762, name: 'Kids', gradient: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)', pattern: 'toy' },
    { id: 9648, name: 'Mystery', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pattern: 'magnify' },
    { id: 10763, name: 'News', gradient: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)', pattern: 'news' },
    { id: 10764, name: 'Reality', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', pattern: 'star' },
    { id: 10765, name: 'Sci-Fi', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', pattern: 'space' },
    { id: 10766, name: 'Soap', gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', pattern: 'bubble' },
    { id: 10767, name: 'Talk', gradient: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)', pattern: 'mic' },
    { id: 10768, name: 'War', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', pattern: 'medal' },
    { id: 37, name: 'Western', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', pattern: 'cowboy' }
  ]

  const genres = contentType === 'tv' ? tvGenres : movieGenres

  const getIcon = (pattern) => {
    const icons = {
      film: '🎬',
      explosion: '💥',
      compass: '🧭',
      sparkle: '✨',
      laugh: '😂',
      detective: '🔍',
      camera: '📹',
      mask: '🎭',
      family: '👨‍👩‍👧‍👦',
      magic: '🪄',
      skull: '💀',
      music: '🎵',
      magnify: '🔎',
      heart: '💕',
      space: '🚀',
      pulse: '⚡',
      medal: '🎖️',
      cowboy: '🤠',
      tv: '📺',
      toy: '🧸',
      news: '📰',
      star: '⭐',
      bubble: '💭',
      mic: '🎤'
    }
    return icons[pattern] || '🎬'
  }

  return (
    <div className="genre-filter-container">
      <div className="genre-filter-header">
        <h3>Browse by Genre</h3>
        <span className="genre-count">{genres.length} categories</span>
      </div>
      <div className="genre-filter-scroll">
        <div className="genre-filter-cards">
          {genres.map((genre) => (
            <button
              key={genre.id || 'all'}
              className={`genre-card ${selectedGenre === genre.id ? 'active' : ''}`}
              onClick={() => onGenreChange(genre.id)}
              style={{ background: genre.gradient }}
            >
              <div className="genre-card-pattern"></div>
              <div className="genre-card-content">
                <span className="genre-icon">{getIcon(genre.pattern)}</span>
                <span className="genre-name">{genre.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GenreFilter
