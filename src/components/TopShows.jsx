import React, { useState, useEffect } from 'react'
import MovieCard from './MovieCard'
import '../styles/MovieGrid.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'

function TopShows({ onSelectMovie, watchlist, onToggleWatchlist }) {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  // TMDB IDs for the most popular shows
  const topShowIds = [
    1396,   // Breaking Bad
    1398,   // The Sopranos
    1438,   // The Wire
    1399,   // Game of Thrones
    83867,  // Succession
    1104,   // Mad Men
    60059,  // Better Call Saul
    2316,   // The Office
    1668,   // Friends
    1400,   // Seinfeld
    87108,  // Chernobyl
    4194,   // The Twilight Zone
    456,    // The Simpsons
    4613,   // Band of Brothers
    246,    // Avatar: The Last Airbender
    1920,   // Twin Peaks
    67070,  // Fleabag
    136315, // The Bear
    100088, // The Last of Us
    66732,  // Stranger Things
    68349,  // Atlanta
    66190,  // The Leftovers
    61222,  // BoJack Horseman
    4236    // Curb Your Enthusiasm
  ]

  useEffect(() => {
    fetchTopShows()
  }, [])

  const fetchTopShows = async () => {
    setLoading(true)
    try {
      const promises = topShowIds.map(id =>
        fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`)
          .then(res => res.json())
      )

      const results = await Promise.all(promises)

      const formattedShows = results.map(show => ({
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
      console.error('Error fetching top shows:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="movie-grid-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading must-watch classics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-grid-container">
      <h2 className="section-title">📺 Must-Watch TV Classics</h2>
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

export default TopShows
