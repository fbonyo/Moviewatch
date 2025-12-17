import React from 'react'
import '../styles/GenreFilter.css'

function GenreFilter({ selectedGenre, onGenreChange, contentType = 'movie' }) {
  // TMDB Genre IDs
  const movieGenres = [
    { id: null, name: 'All', icon: '🎬' },
    { id: 28, name: 'Action', icon: '💥' },
    { id: 12, name: 'Adventure', icon: '🗺️' },
    { id: 16, name: 'Animation', icon: '🎨' },
    { id: 35, name: 'Comedy', icon: '😂' },
    { id: 80, name: 'Crime', icon: '🔫' },
    { id: 99, name: 'Documentary', icon: '📹' },
    { id: 18, name: 'Drama', icon: '🎭' },
    { id: 10751, name: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 14, name: 'Fantasy', icon: '🧙‍♂️' },
    { id: 27, name: 'Horror', icon: '👻' },
    { id: 10402, name: 'Music', icon: '🎵' },
    { id: 9648, name: 'Mystery', icon: '🔍' },
    { id: 10749, name: 'Romance', icon: '💕' },
    { id: 878, name: 'Sci-Fi', icon: '🚀' },
    { id: 53, name: 'Thriller', icon: '😱' },
    { id: 10752, name: 'War', icon: '⚔️' },
    { id: 37, name: 'Western', icon: '🤠' }
  ]

  const tvGenres = [
    { id: null, name: 'All', icon: '📺' },
    { id: 10759, name: 'Action', icon: '💥' },
    { id: 16, name: 'Animation', icon: '🎨' },
    { id: 35, name: 'Comedy', icon: '😂' },
    { id: 80, name: 'Crime', icon: '🔫' },
    { id: 99, name: 'Documentary', icon: '📹' },
    { id: 18, name: 'Drama', icon: '🎭' },
    { id: 10751, name: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 10762, name: 'Kids', icon: '👶' },
    { id: 9648, name: 'Mystery', icon: '🔍' },
    { id: 10763, name: 'News', icon: '📰' },
    { id: 10764, name: 'Reality', icon: '🎥' },
    { id: 10765, name: 'Sci-Fi', icon: '🚀' },
    { id: 10766, name: 'Soap', icon: '🧼' },
    { id: 10767, name: 'Talk', icon: '💬' },
    { id: 10768, name: 'War', icon: '⚔️' },
    { id: 37, name: 'Western', icon: '🤠' }
  ]

  const genres = contentType === 'tv' ? tvGenres : movieGenres

  return (
    <div className="genre-filter-container">
      <div className="genre-filter-header">
        <h3>Browse by Genre</h3>
        <span className="genre-count">{genres.length} categories</span>
      </div>
      <div className="genre-filter-scroll">
        <div className="genre-filter">
          {genres.map((genre) => (
            <button
              key={genre.id || 'all'}
              className={`genre-btn ${selectedGenre === genre.id ? 'active' : ''}`}
              onClick={() => onGenreChange(genre.id)}
            >
              <span className="genre-icon">{genre.icon}</span>
              <span className="genre-name">{genre.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GenreFilter
