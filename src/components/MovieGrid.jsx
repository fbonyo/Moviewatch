import React, { useEffect, useRef } from 'react'
import MovieCard from './MovieCard'
import SkeletonLoader from './SkeletonLoader'
import '../styles/MovieGrid.css'

function MovieGrid({ movies, loading, onSelectMovie, watchlist, onToggleWatchlist, title = "Trending Now" }) {
  const gridRef = useRef(null)
  const selectedIndexRef = useRef(0)

  // Keyboard navigation: Arrow keys
  useEffect(() => {
    if (movies.length === 0) return

    const handleKeyDown = (e) => {
      // Only handle arrow keys if we're not in an input field
      if (document.activeElement.tagName === 'INPUT') return

      const currentIndex = selectedIndexRef.current
      let newIndex = currentIndex

      // Calculate grid columns based on screen width
      const getColumns = () => {
        const width = window.innerWidth
        if (width >= 1200) return 6
        if (width >= 992) return 5
        if (width >= 768) return 4
        if (width >= 576) return 3
        return 2
      }

      const columns = getColumns()

      switch(e.key) {
        case 'ArrowRight':
          e.preventDefault()
          newIndex = Math.min(currentIndex + 1, movies.length - 1)
          break
        case 'ArrowLeft':
          e.preventDefault()
          newIndex = Math.max(currentIndex - 1, 0)
          break
        case 'ArrowDown':
          e.preventDefault()
          newIndex = Math.min(currentIndex + columns, movies.length - 1)
          break
        case 'ArrowUp':
          e.preventDefault()
          newIndex = Math.max(currentIndex - columns, 0)
          break
        case 'Enter':
          e.preventDefault()
          if (movies[currentIndex]) {
            onSelectMovie(movies[currentIndex])
          }
          return
        default:
          return
      }

      if (newIndex !== currentIndex) {
        selectedIndexRef.current = newIndex
        
        // Highlight the selected card
        const cards = gridRef.current?.querySelectorAll('.movie-card')
        if (cards && cards[newIndex]) {
          cards.forEach(card => card.classList.remove('keyboard-selected'))
          cards[newIndex].classList.add('keyboard-selected')
          cards[newIndex].scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [movies, onSelectMovie])

  if (loading) {
    return (
      <div className="movie-grid-container">
        <h2 className="section-title">{title}</h2>
        <div className="movie-grid">
          <SkeletonLoader type="card" count={20} />
        </div>
      </div>
    )
  }

  if (movies.length === 0) {
    const isMyList = title === "My List"
    
    return (
      <div className="movie-grid-container">
        <h2 className="section-title">{title}</h2>
        <div className="empty-state">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            {isMyList ? (
              <>
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </>
            ) : (
              <>
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                <polyline points="17 2 12 7 7 2"/>
              </>
            )}
          </svg>
          <h3>{isMyList ? "Your list is empty" : "No content found"}</h3>
          <p>
            {isMyList 
              ? "Add movies and TV shows to your list by clicking the + button on any title"
              : "Try adjusting your search or check back later"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-grid-container">
      <h2 className="section-title">{title}</h2>
      <div className="movie-grid" ref={gridRef}>
        {movies.map((movie, index) => (
          <MovieCard 
            key={`${movie.type}-${movie.id}-${index}`} 
            movie={movie}
            onClick={() => onSelectMovie(movie)}
            isInWatchlist={watchlist.some(m => m.id === movie.id && m.type === movie.type)}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
    </div>
  )
}

export default MovieGrid
