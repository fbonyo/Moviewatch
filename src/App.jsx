import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import GenreFilter from './components/GenreFilter'
import MovieGrid from './components/MovieGrid'
import MovieModal from './components/MovieModal'
import VideoPlayer from './components/VideoPlayer'
import Pagination from './components/Pagination'
import ContinueWatching from './components/ContinueWatching'
import './styles/App.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

function App() {
  const [movies, setMovies] = useState([])
  const [tvShows, setTvShows] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [playingMovie, setPlayingMovie] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [watchlist, setWatchlist] = useState([])
  const [continueWatching, setContinueWatching] = useState([])
  const [theme, setTheme] = useState('dark')
  const [activeSection, setActiveSection] = useState('home')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedGenre, setSelectedGenre] = useState(null)

  useEffect(() => {
    loadWatchlist()
    loadContinueWatching()
    loadTheme()
    fetchLatestMovies(1, null)
    fetchLatestTVShows(1, null)

    const handleOpenMovie = (event) => {
      setSelectedMovie(event.detail)
    }

    window.addEventListener('openMovie', handleOpenMovie)
    return () => window.removeEventListener('openMovie', handleOpenMovie)
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

  const loadContinueWatching = async () => {
    try {
      const result = await window.storage.get('continueWatching')
      if (result) {
        setContinueWatching(JSON.parse(result.value))
      }
    } catch (error) {
      console.log('No continue watching data found')
    }
  }

  const updateWatchProgress = async (movie, watchedTime) => {
    try {
      const existingIndex = continueWatching.findIndex(
        item => item.id === movie.id && item.type === movie.type
      )

      const updatedItem = {
        ...movie,
        watchedTime,
        totalTime: movie.type === 'tv' ? 2400 : 7200, // 40 min for TV, 2 hours for movies
        lastWatched: new Date().toISOString()
      }

      let newContinueWatching
      if (existingIndex >= 0) {
        newContinueWatching = [...continueWatching]
        newContinueWatching[existingIndex] = updatedItem
      } else {
        newContinueWatching = [updatedItem, ...continueWatching]
      }

      // Keep only last 20 items
      newContinueWatching = newContinueWatching.slice(0, 20)

      setContinueWatching(newContinueWatching)
      await window.storage.set('continueWatching', JSON.stringify(newContinueWatching))
    } catch (error) {
      console.error('Error updating watch progress:', error)
    }
  }

  const removeFromContinueWatching = async (movie) => {
    try {
      const newContinueWatching = continueWatching.filter(
        item => !(item.id === movie.id && item.type === movie.type)
      )
      setContinueWatching(newContinueWatching)
      await window.storage.set('continueWatching', JSON.stringify(newContinueWatching))
    } catch (error) {
      console.error('Error removing from continue watching:', error)
    }
  }

  const removeDuplicates = (movies) => {
    const seen = new Set()
    return movies.filter(movie => {
      const key = `${movie.id}-${movie.type}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  const fetchLatestMovies = async (page, genreId) => {
    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    try {
      const endpoint = genreId 
        ? `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
        : `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
      
      const response = await fetch(endpoint)
      const data = await response.json()
      
      const formattedMovies = data.results.map(movie => ({
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
          : null,
        type: 'movie'
      }))
      
      setMovies(removeDuplicates(formattedMovies))
      setTotalPages(Math.min(data.total_pages, 500))
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
    setLoading(false)
  }

  const fetchLatestTVShows = async (page, genreId) => {
    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    try {
      const endpoint = genreId
        ? `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
        : `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
      
      const response = await fetch(endpoint)
      const data = await response.json()
      
      const formattedShows = data.results.map(show => ({
        id: show.id,
        title: show.name,
        year: show.first_air_date?.split('-')[0] || '2024',
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
      
      setTvShows(removeDuplicates(formattedShows))
      setTotalPages(Math.min(data.total_pages, 500))
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching TV shows:', error)
    }
    setLoading(false)
  }

  const searchMovies = async (query, page = 1) => {
    if (!query.trim()) {
      fetchLatestMovies(1, null)
      setActiveSection('home')
      setCurrentPage(1)
      setSelectedGenre(null)
      return
    }
    
    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    try {
      const [movieRes, tvRes] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${page}`),
        fetch(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${page}`)
      ])
      
      const movieData = await movieRes.json()
      const tvData = await tvRes.json()
      
      const formattedMovies = movieData.results?.map(movie => ({
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
      })) || []

      const formattedTVShows = tvData.results?.map(show => ({
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
      })) || []
      
      setMovies(removeDuplicates([...formattedMovies, ...formattedTVShows]))
      setTotalPages(Math.min(movieData.total_pages + tvData.total_pages, 500))
      setCurrentPage(page)
      setActiveSection('search')
      setSelectedGenre(null)
    } catch (error) {
      console.error('Error searching:', error)
    }
    setLoading(false)
  }

  const handlePageChange = (page) => {
    if (activeSection === 'movies') {
      fetchLatestMovies(page, selectedGenre)
    } else if (activeSection === 'tvshows') {
      fetchLatestTVShows(page, selectedGenre)
    } else if (activeSection === 'search') {
      searchMovies(searchQuery, page)
    } else if (activeSection === 'home') {
      fetchLatestMovies(page, selectedGenre)
    }
  }

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId)
    setCurrentPage(1)
    
    if (activeSection === 'movies') {
      fetchLatestMovies(1, genreId)
    } else if (activeSection === 'tvshows') {
      fetchLatestTVShows(1, genreId)
    } else {
      fetchLatestMovies(1, genreId)
    }
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
    const isInWatchlist = watchlist.some(m => m.id === movie.id && m.type === movie.type)
    let newWatchlist
    
    if (isInWatchlist) {
      newWatchlist = watchlist.filter(m => !(m.id === movie.id && m.type === movie.type))
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

  const handleSectionChange = (section) => {
    setActiveSection(section)
    setCurrentPage(1)
    setSelectedGenre(null)
    
    if (section === 'movies') {
      setLoading(true)
      fetchLatestMovies(1, null)
    } else if (section === 'tvshows') {
      setLoading(true)
      fetchLatestTVShows(1, null)
    } else if (section === 'home') {
      setLoading(true)
      fetchLatestMovies(1, null)
    }
  }

  const handlePlayMovie = (movie) => {
    setSelectedMovie(null)
    setPlayingMovie(movie)
  }

  const getDisplayContent = () => {
    switch(activeSection) {
      case 'movies':
        return { data: movies, title: selectedGenre ? 'Movies by Genre' : 'Popular Movies', type: 'movie' }
      case 'tvshows':
        return { data: tvShows, title: selectedGenre ? 'TV Shows by Genre' : 'Popular TV Shows', type: 'tv' }
      case 'mylist':
        return { data: watchlist, title: 'My List', type: 'movie' }
      case 'search':
        return { data: movies, title: 'Search Results', type: 'movie' }
      default:
        return { data: movies, title: selectedGenre ? 'Movies by Genre' : 'Popular Movies', type: 'movie' }
    }
  }

  const displayContent = getDisplayContent()
  const showPagination = activeSection !== 'mylist' && !loading && displayContent.data.length > 0
  const showGenreFilter = (activeSection === 'home' || activeSection === 'movies' || activeSection === 'tvshows') && activeSection !== 'mylist'

  return (
    <div className="app">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={searchMovies}
        theme={theme}
        setTheme={setTheme}
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
      />
      {activeSection === 'home' && (
        <>
          <Hero movies={movies} onSelectMovie={setSelectedMovie} />
          {continueWatching.length > 0 && (
            <ContinueWatching 
              continueWatching={continueWatching}
              onSelectMovie={handlePlayMovie}
              onRemove={removeFromContinueWatching}
            />
          )}
        </>
      )}
      {showGenreFilter && (
        <GenreFilter 
          selectedGenre={selectedGenre}
          onGenreChange={handleGenreChange}
          contentType={displayContent.type}
        />
      )}
      <MovieGrid 
        movies={displayContent.data} 
        loading={loading}
        onSelectMovie={setSelectedMovie}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
        title={displayContent.title}
      />
      {showPagination && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)}
          isInWatchlist={watchlist.some(m => m.id === selectedMovie.id && m.type === selectedMovie.type)}
          onToggleWatchlist={toggleWatchlist}
          onPlayMovie={handlePlayMovie}
        />
      )}
      {playingMovie && (
        <VideoPlayer 
          movie={playingMovie}
          onClose={() => setPlayingMovie(null)}
          onUpdateProgress={updateWatchProgress}
        />
      )}
    </div>
  )
}

export default App
