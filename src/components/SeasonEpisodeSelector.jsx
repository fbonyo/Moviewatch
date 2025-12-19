import React, { useState, useEffect } from 'react'
import '../styles/SeasonEpisodeSelector.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'

function SeasonEpisodeSelector({ tvShow, onEpisodeSelect, currentSeason = 1, currentEpisode = 1 }) {
  const [seasons, setSeasons] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [selectedSeason, setSelectedSeason] = useState(currentSeason)
  const [selectedEpisode, setSelectedEpisode] = useState(currentEpisode)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSeasons()
  }, [tvShow.id])

  useEffect(() => {
    if (selectedSeason) {
      fetchEpisodes(selectedSeason)
    }
  }, [selectedSeason])

  const fetchSeasons = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${TMDB_API_KEY}&language=en-US`
      )
      const data = await response.json()
      
      // Filter out "Season 0" (specials) and get real seasons
      const realSeasons = data.seasons?.filter(s => s.season_number > 0) || []
      setSeasons(realSeasons)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching seasons:', error)
      setLoading(false)
    }
  }

  const fetchEpisodes = async (seasonNumber) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tvShow.id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en-US`
      )
      const data = await response.json()
      setEpisodes(data.episodes || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching episodes:', error)
      setLoading(false)
    }
  }

  const handleSeasonClick = (seasonNumber) => {
    setSelectedSeason(seasonNumber)
    setSelectedEpisode(1)
  }

  const handleEpisodeClick = (episodeNumber) => {
    setSelectedEpisode(episodeNumber)
    onEpisodeSelect(selectedSeason, episodeNumber)
  }

  if (loading && seasons.length === 0) {
    return (
      <div className="season-selector-loading">
        <div className="loading-spinner-small"></div>
        <p>Loading seasons...</p>
      </div>
    )
  }

  return (
    <div className="season-episode-selector">
      <div className="selector-header">
        <h3>Resources</h3>
        <span className="source-tag">By Server</span>
      </div>

      {/* Seasons */}
      <div className="seasons-section">
        <div className="seasons-grid">
          {seasons.map((season) => (
            <button
              key={season.season_number}
              className={`season-btn ${selectedSeason === season.season_number ? 'active' : ''}`}
              onClick={() => handleSeasonClick(season.season_number)}
            >
              S{String(season.season_number).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>

      {/* Episodes */}
      <div className="episodes-section">
        {loading ? (
          <div className="episodes-loading">
            <div className="loading-spinner-small"></div>
          </div>
        ) : (
          <div className="episodes-grid">
            {episodes.map((episode) => (
              <button
                key={episode.episode_number}
                className={`episode-btn ${selectedEpisode === episode.episode_number ? 'active playing' : ''}`}
                onClick={() => handleEpisodeClick(episode.episode_number)}
                title={episode.name}
              >
                {selectedEpisode === episode.episode_number && (
                  <div className="playing-indicator">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                  </div>
                )}
                {String(episode.episode_number).padStart(2, '0')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Episode Info */}
      {!loading && episodes.length > 0 && (
        <div className="episode-info">
          <h4>
            S{String(selectedSeason).padStart(2, '0')}E{String(selectedEpisode).padStart(2, '0')} - {
              episodes.find(e => e.episode_number === selectedEpisode)?.name || ''
            }
          </h4>
          <p className="episode-overview">
            {episodes.find(e => e.episode_number === selectedEpisode)?.overview || 'No description available.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default SeasonEpisodeSelector
