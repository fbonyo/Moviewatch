import React, { useState, useEffect } from 'react'
import MovieCard from './MovieCard'
import '../styles/MovieGrid.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'

function TrendingMovies({ onSelectMovie, watchlist, onToggleWatchlist }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingMovies()
  }, [])

  const fetchTrendingMovies = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`
      )
      const data = await response.json()

      const formattedMovies = data.results.slice(0, 12).map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date?.split('-')[0] || 'N/A',
        rating: movie.vote_average?.toFixed(1) || 'N/A',
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : 'https://via.placeholder.com/500x750',
        description: movie.overview || 'No description available.',
        backdrop_url: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          : null,
        type: 'movie'
      }))

      setMovies(formattedMovies)
    } catch (error) {
      console.error('Error fetching trending movies:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="movie-grid-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading trending movies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-grid-container">
      <h2 className="section-title">🎬 Trending Movies This Week</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
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

export default TrendingMovies
