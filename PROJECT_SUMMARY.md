# Frobo's Cinema - Project Summary

## Project Overview
A modern movie streaming web application built with React + Vite that allows users to browse and watch movies and TV shows for free using TMDB API and multiple streaming sources.

## Tech Stack
- **Frontend**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Styling**: Custom CSS with CSS Variables for theming
- **API**: TMDB (The Movie Database) API
- **Storage**: Claude Artifacts Persistent Storage API

## Current Features

### 1. **Header & Navigation**
- Responsive header with logo "Frobo's Cinema 🍿"
- Navigation links: Home, Movies, TV Shows, My List
- Search functionality for movies and TV shows
- Dark/Light theme toggle
- Notification bell with pulse animation
- Sticky header that changes on scroll

### 2. **Hero Section (Home Page)**
- Large title: "Unlimited Movies, TV Shows & More"
- Call-to-action buttons
- 3D perspective movie showcase grid (15 movies)
- Hover effects with play overlay

### 3. **Must See Black Shows Section**
- Horizontal scrollable list of Black-led TV shows
- Shows include: Abbott Elementary, Insecure, The Chi, Atlanta, Scandal, Power, etc.
- Card size: 150px width with 2/3 aspect ratio
- Hover effects with play button overlay
- Rating badges on posters

### 4. **Movie/TV Grid Display**
- Responsive grid layout (auto-fill, minmax 200px)
- Movie cards with:
  - Poster images
  - Title, year, and rating
  - 3D hover effect with tilt
  - Play button overlay on hover
  - Watchlist toggle button (+ icon or checkmark)
  - Gradient shine effect

### 5. **Genre Filter**
- Horizontal scrollable genre buttons
- Different genres for Movies vs TV Shows
- Active state highlighting
- Emoji icons for each genre
- Filters content by selected genre

### 6. **Content Sections**
- **Home**: Trending movies of the week
- **Movies**: Popular movies with genre filtering
- **TV Shows**: Popular TV shows with genre filtering
- **My List**: User's saved watchlist
- **Search Results**: Combined movie and TV show search

### 7. **Movie/TV Modal**
- Large backdrop image with gradient overlay
- Title, year, rating, type metadata
- Full description
- Action buttons:
  - Watch Now (opens video player)
  - Trailer (plays YouTube trailer if available)
  - Add/Remove from My List
- Similar content section (6 items)
- Click similar items to open their modals

### 8. **Video Player**
- Full-screen overlay player
- 7 different streaming sources:
  1. VidSrc.to
  2. VidSrc.xyz
  3. VidSrc.me
  4. Embed.su
  5. VidLink Pro
  6. Movie API
  7. 2Embed
- Source switcher sidebar
- Loading states for each source
- Error handling with user-friendly messages
- Instructions panel for users
- Close button to exit player

### 9. **Pagination**
- Shows current page and total pages
- Previous/Next buttons
- Page number buttons with ellipsis for large page counts
- Disabled state for first/last pages
- Works on all content sections except My List

### 10. **Watchlist System**
- Persistent storage using Claude Storage API
- Add/remove movies and TV shows
- Visual indicator on cards (checkmark when in list)
- Separate "My List" section to view all saved items
- Data persists across sessions

### 11. **Theme System**
- Dark mode (default)
- Light mode
- Persistent theme storage
- CSS variables for easy theming
- Smooth transitions between themes

### 12. **Footer**
- Disclaimer text: "All videos and pictures on Frobo's Cinema are from the Internet, and their copyrights belong to the original creators. We only provide webpage services and do not store, record, or upload any content."
- Copyright notice
- Glassmorphism styling

## File Structure
```
moviewatch/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── GenreFilter.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieGrid.jsx
│   │   ├── MovieModal.jsx
│   │   ├── VideoPlayer.jsx
│   │   ├── Pagination.jsx
│   │   └── Footer.jsx
│   └── styles/
│       ├── index.css (Global styles & CSS variables)
│       ├── App.css
│       ├── Header.css
│       ├── Hero.css
│       ├── GenreFilter.css
│       ├── MovieCard.css
│       ├── MovieGrid.css
│       ├── MovieModal.css
│       ├── VideoPlayer.css
│       ├── Pagination.css
│       └── Footer.css
```

## API Integration

### TMDB API Endpoints Used:
- `/trending/movie/week` - Trending movies (Home page)
- `/movie/popular` - Popular movies
- `/tv/popular` - Popular TV shows
- `/discover/movie` - Movies by genre
- `/discover/tv` - TV shows by genre
- `/search/movie` - Search movies
- `/search/tv` - Search TV shows
- `/movie/{id}` - Movie details
- `/tv/{id}` - TV show details
- `/movie/{id}/videos` - Movie trailers
- `/tv/{id}/videos` - TV show trailers
- `/movie/{id}/similar` - Similar movies
- `/tv/{id}/similar` - Similar TV shows

**API Key**: `9430d8abce320d89568c56813102ec1d`

### Video Streaming Sources:
All sources use TMDB ID to find streams:
- Movies: `/{source}/embed/movie/{tmdb_id}`
- TV Shows: `/{source}/embed/tv/{tmdb_id}/1/1` (Season 1, Episode 1)

## Storage Implementation

### Claude Storage API Usage:
```javascript
// Save theme
await window.storage.set('theme', 'dark')

// Get theme
const result = await window.storage.get('theme')

// Save watchlist (JSON stringified)
await window.storage.set('watchlist', JSON.stringify(watchlistArray))

// Get watchlist
const result = await window.storage.get('watchlist')
const watchlist = JSON.parse(result.value)
```

## Design System

### Color Scheme (Dark Mode):
- **Primary Background**: `#0a0a0a`
- **Secondary Background**: `#1a1a2e`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `rgba(255, 255, 255, 0.7)`
- **Glass Background**: `rgba(255, 255, 255, 0.05)`
- **Glass Border**: `rgba(255, 255, 255, 0.1)`
- **Accent Gradient**: `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`
- **Primary Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

### Color Scheme (Light Mode):
- **Primary Background**: `#ffffff`
- **Secondary Background**: `#f5f5f7`
- **Text Primary**: `#1a1a2e`
- **Text Secondary**: `rgba(26, 26, 46, 0.7)`
- **Glass Background**: `rgba(0, 0, 0, 0.05)`
- **Glass Border**: `rgba(0, 0, 0, 0.1)`

### Typography:
- **Font**: System fonts (Apple system, Segoe UI, Roboto, etc.)
- **Hero Title**: 5rem (900 weight)
- **Section Titles**: 2.5rem (800 weight)
- **Card Titles**: 1.15rem (700 weight)
- **Body Text**: 1.05-1.3rem

### Animations:
- **Card Hover**: 3D tilt effect using transform
- **Float Animation**: Background gradient orbs
- **Fade In**: Opacity transitions
- **Slide In**: translateX/Y animations
- **Shine Effect**: Gradient sweep on hover
- **Pulse**: Notification dot animation

## Key Features Explained

### 1. Trending vs Popular
- **Home page** shows trending movies from the current week
- **Movies section** shows popular movies of all time
- This prevents old movies (like XXX 2002) from showing on homepage

### 2. Black Shows Section
- Curated list of Black-led TV shows
- Fetches specific show IDs from TMDB
- Horizontal scrollable layout
- Matches design of other content carousels

### 3. Video Player Strategy
- Multiple sources increase success rate
- Users can switch between sources if one fails
- Sidebar instructions guide users
- iframe-based embedding (no downloads)

### 4. Responsive Design
- Mobile-friendly grid layouts
- Hamburger menu not needed (simple nav)
- Touch-friendly scrollable sections
- Optimized for 768px, 1024px, and 1600px+ screens

## Common Git Bash Commands

### Setup:
```bash
npm install
npm run dev
```

### View running:
```bash
# Development server runs on http://localhost:5173
```

### Build for production:
```bash
npm run build
npm run preview
```

## Recent Changes (Latest Session)

1. ✅ Changed homepage from "popular" to "trending" movies
2. ✅ Added "Must See Black Shows" section below hero
3. ✅ Fixed card sizes to be consistent (150px)
4. ✅ Added Footer with copyright disclaimer
5. ✅ Removed old movies from homepage
6. ✅ Curated actual Black-led TV shows list

## Known Issues & Limitations

1. **Storage API**: Only works in Claude Artifacts environment (not standalone)
2. **Video Sources**: Some sources may be blocked or rate-limited
3. **TMDB API**: Free tier has rate limits
4. **TV Shows**: Player defaults to S1E1, no episode selector yet
5. **Mobile Navigation**: Desktop-only navigation (no mobile menu)

## Future Enhancement Ideas

1. Season/Episode selector for TV shows
2. Continue watching feature with progress tracking
3. User authentication and cloud sync
4. More curated categories (Horror, Sci-Fi, etc.)
5. Keyboard shortcuts for video player
6. Advanced search filters
7. Movie recommendations based on viewing history
8. Cast and crew information
9. User reviews and ratings
10. Download for offline viewing

## Environment Setup

### Prerequisites:
- Node.js (v14 or higher)
- npm or yarn
- Git Bash (for Windows)
- Modern web browser

### Installation Steps:
```bash
# Clone repository
git clone https://github.com/fbonyo/Moviewatch.git
cd Moviewatch

# Install dependencies
npm install

# Run development server
npm run dev
```

## Important Notes

- **No localStorage**: Claude Artifacts doesn't support localStorage/sessionStorage
- **Use window.storage**: Always use `window.storage` API for persistence
- **No authentication**: This is a free public app
- **Legal disclaimer**: We don't host content, just provide links
- **TMDB Attribution**: Required by TMDB API terms

## Contact & Repository

- **GitHub**: https://github.com/fbonyo/Moviewatch
- **Project Name**: Frobo's Cinema
- **License**: Not specified (add MIT or similar)

---

**Last Updated**: December 30, 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
