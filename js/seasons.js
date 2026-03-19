// seasons.js — shared seasonal theme data for YGW landing and canvas
// Visual data only. Season detection logic lives in domain.js.
// Import getCurrentUKSeason from domain.js in consuming files.

export const SEASON_THEMES = {
  spring: {
    gradient: ['#1a5c2a', '#2d8a42', '#4db870', '#85d4a0'],
    particles: 'petals',
    ctaColor: '#1a5c2a',
    grid: {
      ground:   '#e8f5e0',
      minor:    '#b8e0a0',
      major:    '#7bc860',
      boundary: '#3a8c1e'
    }
  },
  summer: {
    gradient: ['#2d6a4f', '#52b788', '#95d5b2'],
    particles: 'shimmer',
    ctaColor: '#1b4332',
    grid: {
      ground:   '#e6efdc',
      minor:    '#c8d9a4',
      major:    '#9dbc58',
      boundary: '#5a7c1e'
    }
  },
  autumn: {
    gradient: ['#7c3d10', '#c1611a', '#e09150', '#f0c080'],
    particles: 'leaves',
    ctaColor: '#5c1e05',
    grid: {
      ground:   '#f5ede0',
      minor:    '#e0c090',
      major:    '#c07840',
      boundary: '#8b4513'
    }
  },
  winter: {
    gradient: ['#2c3e6b', '#4a6fa5', '#8ab4d4', '#cfe0f0'],
    particles: 'snow',
    ctaColor: '#1a2a4a',
    grid: {
      ground:   '#f0f4f8',
      minor:    '#d0dce8',
      major:    '#9ab0c8',
      boundary: '#4a6880'
    }
  }
};

/**
 * Apply season theme to document root CSS variables.
 * @param {string} season — 'spring'|'summer'|'autumn'|'winter'
 */
export function applySeasonTheme(season) {
  const theme = SEASON_THEMES[season];
  if (!theme) return;
  const root = document.documentElement;
  root.setAttribute('data-season', season);
  root.style.setProperty('--season-ground',   theme.grid.ground);
  root.style.setProperty('--season-minor',    theme.grid.minor);
  root.style.setProperty('--season-major',    theme.grid.major);
  root.style.setProperty('--season-boundary', theme.grid.boundary);
  root.style.setProperty('--season-cta',      theme.ctaColor);
}
