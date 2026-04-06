import { vi, afterEach } from 'vitest';

// ================================
// TEST SETUP
// Runs before every test file.
// Sets up environment variables for testing.
// ================================

// Set test environment variables before anything imports them
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.API_VERSION = 'v1';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_that_is_long_enough_32chars';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_that_is_long_enough_32chars';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.COOKIE_SECRET = 'test_cookie_secret_that_is_long_enough_32chars';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
process.env.RATE_LIMIT_MAX = '1000'; // High limit so tests don't get rate limited
process.env.RATE_LIMIT_WINDOW_MS = '15';
process.env.UPLOAD_DIR = '/tmp/test-uploads';
process.env.UPLOAD_LIMIT = '52428800';

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
