import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import MovieGrid from './components/MovieGrid'
import MovieModal from './components/MovieModal'
import './styles/App.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

function App() {
  const [movies, setMovies] = useState([])
  const [tvShows, setTvShows] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [watchlist, setWatchlist] = useState([])
  const [theme, setTheme] = useState('dark')
  const [activeSection, setActiveSection] = useState('home')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadWatchlist()
    loadTheme()
    fetchLatestMovies(1)
    fetchLatestTVShows(1)

    // Listen for similar movie clicks
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

  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return
      
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = document.documentElement.scrollTop
      const clientHeight = document.documentElement.clientHeight
      
      if (scrollTop + clientHeight >= scrollHeight - 500) {
        loadMoreContent()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeSection, currentPage, loadingMore, hasMore])

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

  const fetchLatestMovies = async (page) => {
    if (page === 1) setLoading(true)
    else setLoadingMore(true)
    
    try {
      const [upcomingRes, nowPlayingRes, popularRes, topRatedRes] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`),
        fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`),
        fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`),
        fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`)
      ])
      
      const upcomingData = await upcomingRes.json()
      const nowPlayingData = await nowPlayingRes.json()
      const popularData = await popularRes.json()
      const topRatedData = await topRatedRes.json()
      
      const allMovies = [
        ...upcomingData.results, 
        ...nowPlayingData.results, 
        ...popularData.results,
        ...topRatedData.results
      ]
      
      const uniqueMovies = Array.from(
        new Map(allMovies.map(movie => [movie.id, movie])).values()
      )
      
      const formattedMovies = uniqueMovies.map(movie => ({
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
      
      if (page === 1) {
        setMovies(formattedMovies)
      } else {
        setMovies(prev => {
          const combined = [...prev, ...formattedMovies]
          const unique = Array.from(
            new Map(combined.map(m => [m.id, m])).values()
          )
          return unique
        })
      }
      
      setHasMore(formattedMovies.length > 0)
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
    
    setLoading(false)
    setLoadingMore(false)
  }

  const fetchLatestTVShows = async (page) => {
    if (page === 1) setLoading(true)
    else setLoadingMore(true)
    
    try {
      const [popularRes, topRatedRes, onAirRes, airingTodayRes] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`),
        fetch(`${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`),
        fetch(`${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`),
        fetch(`${TMDB_BASE_URL}/tv/airing_today?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`)
      ])
      
      const popularData = await popularRes.json()
      const topRatedData = await topRatedRes.json()
      const onAirData = await onAirRes.json()
      const airingTodayData = await airingTodayRes.json()
      
      const allShows = [
        ...popularData.results, 
        ...topRatedData.results, 
        ...onAirData.results,
        ...airingTodayData.results
      ]
      
      const uniqueShows = Array.from(
        new Map(allShows.map(show => [show.id, show])).values()
      )
      
      const formattedShows = uniqueShows.map(show => ({
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
      
      if (page === 1) {
        setTvShows(formattedShows)
      } else {
        setTvShows(prev => {
          const combined = [...prev, ...formattedShows]
          const unique = Array.from(
            new Map(combined.map(s => [s.id, s])).values()
          )
          return unique
        })
      }
      
      setHasMore(formattedShows.length > 0)
    } catch (error) {
      console.error('Error fetching TV shows:', error)
    }
    
    setLoading(false)
    setLoadingMore(false)
  }

  const loadMoreContent = () => {
    if (loadingMore || !hasMore || activeSection === 'mylist' || activeSection === 'search') return
    
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    
    if (activeSection === 'movies') {
      fetchLatestMovies(nextPage)
    } else if (activeSection === 'tvshows') {
      fetchLatestTVShows(nextPage)
    } else if (activeSection === 'home') {
      fetchLatestMovies(nextPage)
    }
  }

  const searchMovies = async (query) => {
    if (!query.trim()) {
      fetchLatestMovies(1)
      setActiveSection('home')
      setCurrentPage(1)
      return
    }
    
    setLoading(true)
    setCurrentPage(1)
    
    try {
      const [movieRes, tvRes] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`),
        fetch(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`)
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
      
      setMovies([...formattedMovies, ...formattedTVShows])
      setActiveSection('search')
      setHasMore(false)
    } catch (error) {
      console.error('Error searching:', error)
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
    setHasMore(true)
    
    if (section === 'movies') {
      setLoading(true)
      fetchLatestMovies(1)
    } else if (section === 'tvshows') {
      setLoading(true)
      fetchLatestTVShows(1)
    }
  }

  const getDisplayContent = () => {
    switch(activeSection) {
      case 'movies':
        return { data: movies, title: 'Movies' }
      case 'tvshows':
        return { data: tvShows, title: 'TV Shows' }
      case 'mylist':
        return { data: watchlist, title: 'My List' }
      case 'search':
        return { data: movies, title: 'Search Results' }
      default:
        return { data: movies, title: 'Trending Now' }
    }
  }

  const displayContent = getDisplayContent()

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
        <Hero movies={movies} onSelectMovie={setSelectedMovie} />
      )}
      <MovieGrid 
        movies={displayContent.data} 
        loading={loading}
        loadingMore={loadingMore}
        onSelectMovie={setSelectedMovie}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
        title={displayContent.title}
      />
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)}
          isInWatchlist={watchlist.some(m => m.id === selectedMovie.id && m.type === selectedMovie.type)}
          onToggleWatchlist={toggleWatchlist}
        />
      )}
    </div>
  )
}

export default App
