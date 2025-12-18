import React, { useState, useEffect } from 'react'
import MovieCard from './MovieCard'
import '../styles/MovieGrid.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'

function TopMovies({ onSelectMovie, watchlist, onToggleWatchlist }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  // TMDB IDs for must-watch movies
  const topMovieIds = [
    496243, // Parasite
    872585, // Oppenheimer
    693134, // Dune: Part Two
    76341,  // Mad Max: Fury Road
    569094, // Spider-Man: Across the Spider-Verse
    244786, // Whiplash
    157336, // Interstellar
    545611, // Everything Everywhere All at Once
    106646, // The Wolf of Wall Street
    157336, // Blade Runner 2049
    674324, // The Banshees of Inisherin
    324857, // Spider-Man: Into the Spider-Verse
    329865, // Arrival
    361743, // Top Gun: Maverick
    27205,  // Inception
    37165,  // The Dark Knight
    120,    // The Lord of Rings: Fellowship
    121,    // The Lord of Rings: Two Towers
    122,    // The Lord of Rings: Return of the King
    598,    // City of God
    129,    // Spirited Away
    6977,   // No Country for Old Men
    7345,   // There Will Be Blood
    38,     // Eternal Sunshine
    1422,   // The Departed
    1281,   // Pan's Labyrinth
    77,     // Memento
    98,     // Gladiator
    195,    // Children of Men
    670,    // Oldboy
    155,    // The Social Network
    68718,  // Django Unchained
    120467, // The Grand Budapest Hotel
    150540, // Inside Out 2
    954,    // Mission: Impossible
    194662, // Birdman
    530915, // 1917
    419704, // Get Out
    334541, // Manchester by the Sea
    376867, // Moonlight
    508883, // La La Land
    503919, // The Lighthouse
    324857, // Uncut Gems
    475557, // Joker
    263115, // Logan
    354912, // Coco
    372058, // Your Name
    603692, // John Wick: Chapter 4
    840430, // Past Lives
    976573  // Anatomy of a Fall
  ]

  useEffect(() => {
    fetchTopMovies()
  }, [])

  const fetchTopMovies = async () => {
    setLoading(true)
    try {
      const promises = topMovieIds.slice(0, 24).map(id =>
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`)
          .then(res => res.json())
          .catch(err => null)
      )

      const results = await Promise.all(promises)
      const validResults = results.filter(movie => movie && movie.id)

      const formattedMovies = validResults.map(movie => ({
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
      console.error('Error fetching top movies:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="movie-grid-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading must-watch films...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-grid-container">
      <h2 className="section-title">🎬 Must-Watch Films</h2>
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

export default TopMovies
