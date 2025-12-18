import React, { useState, useEffect } from 'react'
import '../styles/NotificationPanel.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'

function NotificationPanel({ onClose, onSelectMovie, onNotificationUpdate }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [lastCheck, setLastCheck] = useState(Date.now())

  useEffect(() => {
    fetchLatestContent()
    
    // Check for new content every 5 minutes
    const interval = setInterval(() => {
      fetchLatestContent(true)
    }, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  const fetchLatestContent = async (isBackgroundCheck = false) => {
    if (!isBackgroundCheck) {
      setLoading(true)
    }

    try {
      const [moviesRes, tvRes, trendingRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`),
        fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US&page=1`),
        fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`)
      ])

      const moviesData = await moviesRes.json()
      const tvData = await tvRes.json()
      const trendingData = await trendingRes.json()

      const currentTime = Date.now()
      
      const movieNotifications = moviesData.results.slice(0, 5).map((movie) => ({
        id: `movie-${movie.id}`,
        type: 'new_release',
        title: 'New Movie Release',
        message: `${movie.title} is now available!`,
        movieData: {
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
        },
        timestamp: currentTime,
        time: getTimeAgo(movie.release_date),
        icon: '🎬',
        isNew: isBackgroundCheck && (currentTime - lastCheck < 360000)
      }))

      const tvNotifications = tvData.results.slice(0, 5).map((show) => ({
        id: `tv-${show.id}`,
        type: 'new_episode',
        title: 'New TV Episode',
        message: `${show.name} - New episode available`,
        movieData: {
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
        },
        timestamp: currentTime,
        time: 'Recently added',
        icon: '📺',
        isNew: isBackgroundCheck && (currentTime - lastCheck < 360000)
      }))

      const trendingNotifications = trendingData.results.slice(0, 3).map((item) => ({
        id: `trending-${item.id}`,
        type: 'trending',
        title: 'Trending Now',
        message: `${item.title || item.name} is trending!`,
        movieData: {
          id: item.id,
          title: item.title || item.name,
          year: (item.release_date || item.first_air_date)?.split('-')[0] || 'N/A',
          rating: item.vote_average?.toFixed(1) || 'N/A',
          poster_url: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : 'https://via.placeholder.com/500x750',
          description: item.overview || 'No description available.',
          backdrop_url: item.backdrop_path
            ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
            : null,
          type: item.media_type
        },
        timestamp: currentTime,
        time: 'Just now',
        icon: '🔥',
        isNew: isBackgroundCheck
      }))

      const allNotifications = [...movieNotifications, ...tvNotifications, ...trendingNotifications]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 30)

      setNotifications(allNotifications)
      
      // Update notification count in parent
      if (onNotificationUpdate) {
        const newCount = allNotifications.filter(n => n.isNew).length
        onNotificationUpdate(newCount)
      }

      setLastCheck(currentTime)

    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
    
    if (!isBackgroundCheck) {
      setLoading(false)
    }
  }

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently'
    
    const releaseDate = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - releaseDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return 'Recently'
  }

  const handleNotificationClick = (notification) => {
    onSelectMovie(notification.movieData)
    onClose()
  }

  const handleClearAll = () => {
    setNotifications([])
    if (onNotificationUpdate) {
      onNotificationUpdate(0)
    }
  }

  const handleViewAll = () => {
    setShowAll(!showAll)
  }

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5)

  if (loading) {
    return (
      <div className="notification-panel-overlay" onClick={onClose}>
        <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
          <div className="notification-loading">
            <div className="loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="notification-panel-overlay" onClick={onClose}>
      <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <h3>Notifications</h3>
          {notifications.length > 0 && (
            <button className="clear-all-btn" onClick={handleClearAll}>
              Clear All
            </button>
          )}
        </div>
        
        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <h4>No new notifications</h4>
              <p>Check back later for updates</p>
            </div>
          ) : (
            displayedNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.isNew ? 'new' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">{notification.icon}</div>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
                {notification.isNew && <div className="new-badge">NEW</div>}
              </div>
            ))
          )}
        </div>
        
        {notifications.length > 5 && (
          <div className="notification-footer">
            <button className="view-all-btn" onClick={handleViewAll}>
              {showAll ? 'Show Less' : `View All (${notifications.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationPanel
