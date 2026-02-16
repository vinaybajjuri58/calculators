// Theme configuration for FinCalc
export const theme = {
  colors: {
    // Dark backgrounds
    bgDark: '#0a0a0a',
    bgDarker: '#050505',
    bgCard: '#f5f0e6',
    bgCardAlt: '#ebe5d9',
    bgCardDark: '#111111',
    
    // Accent colors
    accent: '#2d8a6e',
    accentLight: '#3da882',
    accentDark: '#1f6b54',
    accentMuted: 'rgba(45, 138, 110, 0.2)',
    
    // Text colors
    textDark: '#1a1a1a',
    textLight: '#f5f0e6',
    textMuted: '#5a5a5a',
    textMutedLight: '#888888',
    
    // Border colors
    border: '#d4cfc3',
    borderDark: '#2a2a2a',
    borderDarkHover: '#3a3a3a',
    
    // Status colors
    positive: '#2d8a6e',
    negative: '#c44',
    warning: '#f5a623',
  },
  
  fonts: {
    primary: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'Space Mono', monospace",
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
    md: '0 4px 16px rgba(0, 0, 0, 0.15)',
    lg: '0 10px 40px rgba(0, 0, 0, 0.3)',
  },
  
  transitions: {
    fast: '0.15s ease',
    medium: '0.25s ease',
    slow: '0.4s ease',
  },
  
  chartSizes: {
    donutSize: 180,
    progressRingSize: 160,
    barHeight: 28,
  }
};

export default theme;
