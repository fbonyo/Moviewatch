import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import MovieRow from './components/MovieRow'
import MovieModal from './components/MovieModal'
import VideoPlayer from './components/VideoPlayer'
import ContinueWatching from './components/ContinueWatching'
import './styles/App.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

function App() {
  const [trendingMovies, setTrendingMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [newReleases, setNewReleases] = useState([])
  const [mustSeeHits, setMustSeeHits] = useState([])
  const [actionMovies, setActionMovies] = useState([])
  const [comedyMovies, setComedyMovies] = useState([])
  const [horrorMovies, setHorrorMovies] = useState([])
  const [trendingTV, setTrendingTV] = useState([])
  const [popularTV, setPopularTV] = useState([])
  const [newEpisodes, setNewEpisodes] = useState([])
  const [topRatedTV, setTopRatedTV] = useState([])
  const [kdramas, setKdramas] = useState([])
  const [cdramas, setCdramas] = useState([])
  const [anime, setAnime] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [playingMovie, setPlayingMovie] = useState(null)
  const [watchlist, setWatchlist] = useState([])
  const [continueWatching, setContinueWatching] = useState([])
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    loadWatchlist()
    loadContinueWatching()
    loadTheme()
    fetchAllContent()
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    saveTheme()
  }, [theme])

  const loadTheme = async () => {
    try {
      const result = await window.storage.get('theme')
      if (result) setTheme(result.value)
    } catch (error) {}
  }

  const saveTheme = async () => {
    try {
      await window.storage.set('theme', theme)
    } catch (error) {}
  }

  const loadContinueWatching = async () => {
    try {
      const result = await window.storage.get('continueWatching')
      if (result) setContinueWatching(JSON.parse(result.value))
    } catch (error) {}
  }

  const updateContinueWatching = async (movie, watchedTime) => {
    const existing = continueWatching.find(m => m.id === movie.id && m.type === movie.type)
    let updated
    if (existing) {
      updated = continueWatching.map(m => 
        m.id === movie.id && m.type === movie.type 
          ? { ...m, watchedTime, lastWatched: Date.now() }
          : m
      )
    } else {
      updated = [{ ...movie, watchedTime, lastWatched: Date.now(), totalTime: 5400 }, ...continueWatching].slice(0, 20)
    }
    setContinueWatching(updated)
    try {
      await window.storage.set('continueWatching', JSON.stringify(updated))
    } catch (error) {}
  }

  const removeContinueWatching = async (movie) => {
    const updated = continueWatching.filter(m => !(m.id === movie.id && m.type === movie.type))
    setContinueWatching(updated)
    try {
      await window.storage.set('continueWatching', JSON.stringify(updated))
    } catch (error) {}
  }

  const fetchAllContent = async () => {
    try {
      const [trending, popular, topRated, nowPlaying, highRated, action, comedy, horror, tv, popularTv, airingToday, topTv, korean, chinese, animeData] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&vote_average.gte=7.5&vote_count.gte=1000`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/tv/airing_today?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_original_language=ko&sort_by=popularity.desc`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_original_language=zh&sort_by=popularity.desc`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_original_language=ja&with_genres=16`).then(r => r.json())
      ])

      setTrendingMovies(formatMovies(trending.results, 'movie'))
      setPopularMovies(formatMovies(popular.results, 'movie'))
      setTopRatedMovies(formatMovies(topRated.results, 'movie'))
      setNewReleases(formatMovies(nowPlaying.results, 'movie'))
      setMustSeeHits(formatMovies(highRated.results, 'movie'))
      setActionMovies(formatMovies(action.results, 'movie'))
      setComedyMovies(formatMovies(comedy.results, 'movie'))
      setHorrorMovies(formatMovies(horror.results, 'movie'))
      setTrendingTV(formatMovies(tv.results, 'tv'))
      setPopularTV(formatMovies(popularTv.results, 'tv'))
      setNewEpisodes(formatMovies(airingToday.results, 'tv'))
      setTopRatedTV(formatMovies(topTv.results, 'tv'))
      setKdramas(formatMovies(korean.results, 'tv'))
      setCdramas(formatMovies(chinese.results, 'tv'))
      setAnime(formatMovies(animeData.results, 'tv'))
    } catch (error) {}
  }

  const formatMovies = (results, type) => {
    return results.map(item => ({
      id: item.id,
      title: item.title || item.name,
      year: (item.release_date || item.first_air_date)?.split('-')[0] || 'N/A',
      rating: item.vote_average?.toFixed(1) || 'N/A',
      poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750',
      description: item.overview || 'No description available.',
      backdrop_url: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
      type
    }))
  }

  const loadWatchlist = async () => {
    try {
      const result = await window.storage.get('watchlist')
      if (result) setWatchlist(JSON.parse(result.value))
    } catch (error) {}
  }

  const toggleWatchlist = async (movie) => {
    const isInWatchlist = watchlist.some(m => m.id === movie.id && m.type === movie.type)
    const newWatchlist = isInWatchlist 
      ? watchlist.filter(m => !(m.id === movie.id && m.type === movie.type))
      : [...watchlist, movie]
    setWatchlist(newWatchlist)
    try {
      await window.storage.set('watchlist', JSON.stringify(newWatchlist))
    } catch (error) {}
  }

  const handlePlayMovie = (movie) => {
    setSelectedMovie(null)
    setPlayingMovie(movie)
  }

  return (
    <div className="app">
      <Header theme={theme} setTheme={setTheme} />
      
      {continueWatching.length > 0 && (
        <ContinueWatching continueWatching={continueWatching} onSelectMovie={handlePlayMovie} onRemove={removeContinueWatching} />
      )}

      <MovieRow title="Trending Movies" movies={trendingMovies} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="New Releases" movies={newReleases} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="Must-See Hits" movies={mustSeeHits} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="Popular Movies" movies={popularMovies} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="Top Rated Movies" movies={topRatedMovies} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="Action Movies" movies={actionMovies} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="Comedy Movies" movies={comedyMovies} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="Horror Movies" movies={horrorMovies} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="Trending TV Shows" movies={trendingTV} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="New Episodes" movies={newEpisodes} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="Popular TV Shows" movies={popularTV} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="Top Rated TV Shows" movies={topRatedTV} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="Korean Dramas" movies={kdramas} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="Chinese Dramas" movies={cdramas} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
      <MovieRow title="Anime" movies={anime} onSelectMovie={setSelectedMovie} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} isInWatchlist={watchlist.some(m => m.id === selectedMovie.id && m.type === selectedMovie.type)} onToggleWatchlist={toggleWatchlist} onPlayMovie={handlePlayMovie} />
      )}

      {playingMovie && (
        <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} onUpdateProgress={updateContinueWatching} />
      )}
    </div>
  )
}

export default App
