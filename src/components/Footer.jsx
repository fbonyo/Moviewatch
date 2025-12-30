import React from 'react'
import '../styles/Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-disclaimer">
          <h3>Disclaimer</h3>
          <p>
            All videos and pictures on Frobo's Cinema are from the Internet, 
            and their copyrights belong to the original creators. We only provide webpage services and 
            do not store, record, or upload any content.
          </p>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Frobo's Cinema. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
