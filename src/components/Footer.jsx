import React, { useState, useEffect } from 'react'
import '../styles/Footer.css'

function Footer() {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const checkSpecialDay = () => {
      const today = new Date()
      const month = today.getMonth() + 1 // 0-indexed
      const day = today.getDate()

      // Christmas (December 24-26)
      if (month === 12 && day >= 24 && day <= 26) {
        setGreeting('🎄 Merry Christmas! 🎅')
      }
      // New Year's Eve and Day (December 31 - January 1)
      else if ((month === 12 && day === 31) || (month === 1 && day === 1)) {
        setGreeting('🎉 Happy New Year! 🎊')
      }
      // Valentine's Day (February 14)
      else if (month === 2 && day === 14) {
        setGreeting('💕 Happy Valentine\'s Day! 💝')
      }
      // Halloween (October 31)
      else if (month === 10 && day === 31) {
        setGreeting('🎃 Happy Halloween! 👻')
      }
      // Easter (approximate - first Sunday after March 21)
      else if (month === 3 && day >= 21 && day <= 25) {
        setGreeting('🐰 Happy Easter! 🥚')
      }
      // Thanksgiving (4th Thursday of November - approximate)
      else if (month === 11 && day >= 22 && day <= 28) {
        setGreeting('🦃 Happy Thanksgiving! 🍂')
      }
      else {
        setGreeting('')
      }
    }

    checkSpecialDay()
    // Check daily at midnight
    const interval = setInterval(checkSpecialDay, 86400000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="footer">
      <div className="footer-content">
        {greeting && (
          <div className="footer-greeting">
            <div className="greeting-sparkles">✨</div>
            <p className="greeting-text">{greeting}</p>
            <div className="greeting-sparkles">✨</div>
            <div className="greeting-snow">❄️ ❄️ ❄️ ❄️ ❄️</div>
          </div>
        )}
        
        <div className="footer-disclaimer">
          <h3>Disclaimer</h3>
          <p>
            All videos and pictures on Frobo's Cinema are from the Internet, and their copyrights belong to the original creators. 
            We only provide webpage services and do not store, record, or upload any content.
          </p>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Frobo's Cinema. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
