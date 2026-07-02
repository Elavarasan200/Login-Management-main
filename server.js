const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 5000;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;
const loginAttempts = new Map();

app.use(cors());
app.use(express.json());

const mockUser = {
  email: 'user@netflix.com',
  password: 'Password'
};

function getAttemptKey(req) {
  return `${req.ip || 'unknown'}:${(req.body?.email || '').trim().toLowerCase()}`;
}

function getStoredPasswordHash() {
  return crypto.createHash('sha256').update(mockUser.password).digest('hex');
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  const attemptKey = getAttemptKey(req);
  const now = Date.now();
  const existingAttempt = loginAttempts.get(attemptKey);

  if (existingAttempt && existingAttempt.lockedUntil > now) {
    const minutesLeft = Math.ceil((existingAttempt.lockedUntil - now) / 60000);
    return res.status(403).json({
      success: false,
      message: `Too many failed attempts. Please try again in ${minutesLeft} minute(s).`
    });
  }

  if (existingAttempt && existingAttempt.lockedUntil <= now) {
    loginAttempts.delete(attemptKey);
  }

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  const storedPasswordHash = getStoredPasswordHash();
  const isValid =
    email.trim().toLowerCase() === mockUser.email.toLowerCase() &&
    password === storedPasswordHash;

  if (isValid) {
    loginAttempts.delete(attemptKey);
    return res.json({
      success: true,
      message: 'Login successful.',
      user: { email: mockUser.email }
    });
  }

  const failedAttempts = (existingAttempt?.count || 0) + 1;

  if (failedAttempts >= MAX_ATTEMPTS) {
    loginAttempts.set(attemptKey, {
      count: failedAttempts,
      lockedUntil: now + LOCKOUT_MS
    });

    return res.status(403).json({
      success: false,
      message: 'Too many failed attempts. Your account is temporarily locked for 5 minutes.'
    });
  }

  loginAttempts.set(attemptKey, {
    count: failedAttempts,
    lockedUntil: 0
  });

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Please try again.'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
