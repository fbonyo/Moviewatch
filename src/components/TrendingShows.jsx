import React, { useState, useEffect } from 'react'
import MovieCard from './MovieCard'
import '../styles/MovieGrid.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'

function TrendingShows({ onSelectMovie, watchlist, onToggleWatchlist }) {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingShows()
  }, [])

  const fetchTrendingShows = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}`
      )
      const data = await response.json()

      const formattedShows = data.results.slice(0, 12).map(show => ({
        id: show.id,
        title: show.name,
        year: show.first_air_date?.split('-')[0] || 'N/A',
        rating: show.vote_average?.toFixed(1) || 'N/A',
        poster_url: show.poster_path
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
          : 'https://via.placeholder.com/500x750',
        description: show.overview || 'No description available.',
        backdrop_url: show.backdrop_path
          ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
          : null,
        type: 'tv'
      }))

      setShows(formattedShows)
    } catch (error) {
      console.error('Error fetching trending shows:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="movie-grid-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading trending shows...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-grid-container">
      <h2 className="section-title">🔥 Trending TV Shows This Week</h2>
      <div className="movie-grid">
        {shows.map((show) => (
          <MovieCard
            key={show.id}
            movie={show}
            onClick={() => onSelectMovie(show)}
            isInWatchlist={watchlist.some(m => m.id === show.id && m.type === show.type)}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
    </div>
  )
}

export default TrendingShows
