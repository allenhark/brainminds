// API configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// WebSocket configuration
export const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:3001';

// Other configuration constants
export const UPLOAD_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']; 