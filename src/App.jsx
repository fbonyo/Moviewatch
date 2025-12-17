import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import MovieGrid from './components/MovieGrid'
import MovieModal from './components/MovieModal'
import './styles/App.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

function App() {
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [watchlist, setWatchlist] = useState([])
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    loadWatchlist()
    loadTheme()
    fetchLatestMovies()
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    saveTheme()
  }, [theme])

  const loadTheme = async () => {
    try {
      const result = await window.storage.get('theme')
      if (result) {
        setTheme(result.value)
      }
    } catch (error) {
      console.log('No theme found, using default')
    }
  }

  const saveTheme = async () => {
    try {
      await window.storage.set('theme', theme)
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }

  const fetchLatestMovies = async () => {
    setLoading(true)
    try {
      const [upcomingRes, nowPlayingRes] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`),
        fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`)
      ])
      
      const upcomingData = await upcomingRes.json()
      const nowPlayingData = await nowPlayingRes.json()
      
      const allMovies = [...upcomingData.results, ...nowPlayingData.results]
      const uniqueMovies = Array.from(
        new Map(allMovies.map(movie => [movie.id, movie])).values()
      )
      
      const sortedMovies = uniqueMovies.sort((a, b) => {
        const dateA = new Date(a.release_date || '2000-01-01')
        const dateB = new Date(b.release_date || '2000-01-01')
        return dateB - dateA
      })
      
      const formattedMovies = sortedMovies.slice(0, 20).map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date?.split('-')[0] || '2024',
        rating: movie.vote_average?.toFixed(1) || 'N/A',
        poster_url: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : 'https://via.placeholder.com/500x750',
        description: movie.overview || 'No description available.',
        backdrop_url: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          : null
      }))
      
      setMovies(formattedMovies)
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
    setLoading(false)
  }

  const searchMovies = async (query) => {
    if (!query.trim()) {
      fetchLatestMovies()
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
      )
      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        const formattedMovies = data.results.map(movie => ({
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
            : null
        }))
        setMovies(formattedMovies)
      } else {
        setMovies([])
      }
    } catch (error) {
      console.error('Error searching movies:', error)
    }
    setLoading(false)
  }

  const loadWatchlist = async () => {
    try {
      const result = await window.storage.get('watchlist')
      if (result) {
        setWatchlist(JSON.parse(result.value))
      }
    } catch (error) {
      console.log('No watchlist found')
    }
  }

  const toggleWatchlist = async (movie) => {
    const isInWatchlist = watchlist.some(m => m.id === movie.id)
    let newWatchlist
    
    if (isInWatchlist) {
      newWatchlist = watchlist.filter(m => m.id !== movie.id)
    } else {
      newWatchlist = [...watchlist, movie]
    }
    
    setWatchlist(newWatchlist)
    
    try {
      await window.storage.set('watchlist', JSON.stringify(newWatchlist))
    } catch (error) {
      console.error('Error saving watchlist:', error)
    }
  }

  return (
    <div className="app">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={searchMovies}
        theme={theme}
        setTheme={setTheme}
      />
      <Hero movies={movies} onSelectMovie={setSelectedMovie} />
      <Features />
      <MovieGrid 
        movies={movies} 
        loading={loading}
        onSelectMovie={setSelectedMovie}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
      />
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)}
          isInWatchlist={watchlist.some(m => m.id === selectedMovie.id)}
          onToggleWatchlist={toggleWatchlist}
        />
      )}
    </div>
  )
}

export default App
