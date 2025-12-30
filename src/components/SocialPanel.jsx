import React, { useState, useEffect } from 'react'
import '../styles/SocialPanel.css'

function SocialPanel({ movie, onClose }) {
  const [activeTab, setActiveTab] = useState('reviews')
  const [reviews, setReviews] = useState([])
  const [userReview, setUserReview] = useState({ rating: 0, text: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadReviews()
    loadUserReview()
  }, [movie.id])

  const loadReviews = async () => {
    setLoading(true)
    try {
      const result = await window.storage.get(`reviews-${movie.type}-${movie.id}`, true)
      if (result) {
        const allReviews = JSON.parse(result.value)
        setReviews(allReviews.sort((a, b) => b.timestamp - a.timestamp))
      }
    } catch (error) {
      console.log('No reviews found')
    }
    setLoading(false)
  }

  const loadUserReview = async () => {
    try {
      const result = await window.storage.get(`my-review-${movie.type}-${movie.id}`)
      if (result) {
        setUserReview(JSON.parse(result.value))
      }
    } catch (error) {
      console.log('No user review found')
    }
  }

  const submitReview = async () => {
    if (!userReview.text.trim() || userReview.rating === 0) {
      alert('Please add a rating and review text')
      return
    }

    setSubmitting(true)
    try {
      const newReview = {
        id: Date.now(),
        rating: userReview.rating,
        text: userReview.text.trim(),
        timestamp: Date.now(),
        movieId: movie.id,
        movieType: movie.type,
        movieTitle: movie.title,
        helpful: 0,
        userName: 'Anonymous User'
      }

      // Save user's personal review
      await window.storage.set(
        `my-review-${movie.type}-${movie.id}`,
        JSON.stringify({ rating: userReview.rating, text: userReview.text })
      )

      // Add to shared reviews
      let allReviews = [...reviews]
      const existingIndex = allReviews.findIndex(r => r.id === newReview.id)
      if (existingIndex >= 0) {
        allReviews[existingIndex] = newReview
      } else {
        allReviews.unshift(newReview)
      }

      await window.storage.set(
        `reviews-${movie.type}-${movie.id}`,
        JSON.stringify(allReviews),
        true
      )

      setReviews(allReviews)
      alert('Review submitted successfully!')
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review')
    }
    setSubmitting(false)
  }

  const markHelpful = async (reviewId) => {
    try {
      const updatedReviews = reviews.map(r => 
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
      )
      setReviews(updatedReviews)
      await window.storage.set(
        `reviews-${movie.type}-${movie.id}`,
        JSON.stringify(updatedReviews),
        true
      )
    } catch (error) {
      console.error('Error marking helpful:', error)
    }
  }

  const shareMovie = async (platform) => {
    const shareText = `Check out ${movie.title} (${movie.year}) - ${movie.rating}⭐`
    const shareUrl = window.location.href

    switch(platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
        break
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl)
          alert('Link copied to clipboard!')
        } catch (error) {
          console.error('Failed to copy:', error)
        }
        break
    }
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const getRatingDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(r => {
      dist[r.rating] = (dist[r.rating] || 0) + 1
    })
    return dist
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const ratingDist = getRatingDistribution()
  const avgRating = getAverageRating()

  return (
    <div className="social-panel-overlay" onClick={onClose}>
      <div className="social-panel" onClick={(e) => e.stopPropagation()}>
        <div className="social-panel-header">
          <div className="social-movie-info">
            <img src={movie.poster_url} alt={movie.title} className="social-movie-poster" />
            <div>
              <h2>{movie.title}</h2>
              <p>{movie.year} • {movie.type === 'tv' ? 'TV Show' : 'Movie'}</p>
            </div>
          </div>
          <button className="social-close" onClick={onClose}>✕</button>
        </div>

        <div className="social-tabs">
          <button
            className={`social-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Reviews ({reviews.length})
          </button>
          <button
            className={`social-tab ${activeTab === 'share' ? 'active' : ''}`}
            onClick={() => setActiveTab('share')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
        </div>

        <div className="social-content">
          {activeTab === 'reviews' && (
            <>
              <div className="rating-summary">
                <div className="avg-rating-box">
                  <div className="avg-rating-number">{avgRating}</div>
                  <div className="avg-rating-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={star <= Math.round(avgRating) ? 'star filled' : 'star'}>★</span>
                    ))}
                  </div>
                  <div className="avg-rating-count">{reviews.length} reviews</div>
                </div>

                <div className="rating-bars">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="rating-bar-row">
                      <span>{rating}★</span>
                      <div className="rating-bar">
                        <div 
                          className="rating-bar-fill"
                          style={{ width: `${reviews.length > 0 ? (ratingDist[rating] / reviews.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="rating-count">{ratingDist[rating]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="write-review">
                <h3>Write Your Review</h3>
                <div className="review-rating-input">
                  <label>Your Rating:</label>
                  <div className="star-rating-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        className={star <= userReview.rating ? 'star-btn filled' : 'star-btn'}
                        onClick={() => setUserReview({ ...userReview, rating: star })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  className="review-text-input"
                  placeholder="Share your thoughts about this movie..."
                  value={userReview.text}
                  onChange={(e) => setUserReview({ ...userReview, text: e.target.value })}
                  rows="4"
                />
                <button 
                  className="submit-review-btn"
                  onClick={submitReview}
                  disabled={submitting || !userReview.text.trim() || userReview.rating === 0}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>

              <div className="reviews-list">
                <h3>Community Reviews</h3>
                {loading ? (
                  <div className="reviews-loading">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                  <div className="no-reviews">
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div className="review-user-avatar">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="review-user-info">
                          <div className="review-user-name">{review.userName}</div>
                          <div className="review-date">{formatDate(review.timestamp)}</div>
                        </div>
                        <div className="review-rating">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={star <= review.rating ? 'star filled' : 'star'}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="review-text">{review.text}</p>
                      <div className="review-actions">
                        <button 
                          className="helpful-btn"
                          onClick={() => markHelpful(review.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                          </svg>
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'share' && (
            <div className="share-options">
              <h3>Share This {movie.type === 'tv' ? 'Show' : 'Movie'}</h3>
              <div className="share-buttons">
                <button className="share-btn twitter" onClick={() => shareMovie('twitter')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                  Share on Twitter
                </button>

                <button className="share-btn facebook" onClick={() => shareMovie('facebook')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                  Share on Facebook
                </button>

                <button className="share-btn whatsapp" onClick={() => shareMovie('whatsapp')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Share on WhatsApp
                </button>

                <button className="share-btn copy" onClick={() => shareMovie('copy')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copy Link
                </button>
              </div>

              <div className="share-preview">
                <h4>Share Preview</h4>
                <div className="share-preview-card">
                  <img src={movie.backdrop_url || movie.poster_url} alt={movie.title} />
                  <div className="share-preview-info">
                    <h5>{movie.title}</h5>
                    <p>{movie.year} • {movie.rating}⭐</p>
                    <p className="share-preview-desc">{movie.description?.slice(0, 100)}...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SocialPanel
