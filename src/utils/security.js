// Security utilities for Al Kautsar Exam Browser

export const EXAM_URL = 'https://ujiancbt.alkautsarkrw.web.id';
export const ADMIN_PASSWORD = '081511';

// Allowed domains for navigation
export const ALLOWED_DOMAINS = [
  'ujiancbt.alkautsarkrw.web.id',
  'alkautsarkrw.web.id',
  'google.com',
  'gstatic.com',
  'googleapis.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'about:blank',
];

// Check if URL is allowed
export const isAllowedUrl = (url) => {
  return ALLOWED_DOMAINS.some(domain => url.includes(domain));
};

// Log violation
export const logViolation = (type, timestamp = Date.now()) => {
  console.log(`[VIOLATION] ${type} at ${new Date(timestamp).toISOString()}`);
  // TODO: Send to server
};

// Format violation time
export const formatViolationTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
