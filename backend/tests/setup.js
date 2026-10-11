// Loaded before every test file (node --import). Points the server at the test database and
// switches off real external services, so a test run never touches development data.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/raaah_test';
process.env.REDIS_URL = '';
process.env.JWT_SECRET = 'raaah-test-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.OPENWEATHER_API_KEY = '';
process.env.CHECKIN_AUTO_CLOSE_HOURS = '6';
