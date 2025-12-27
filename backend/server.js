require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Sentry = require('@sentry/node');

const app = express();
const PORT = 5001;

// Initialize Sentry only if DSN is configured
const sentryDsn = process.env.SENTRY_DSN;
const isSentryEnabled = sentryDsn && sentryDsn !== 'YOUR_SENTRY_DSN_HERE';

if (isSentryEnabled) {
  try {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [
        Sentry.httpIntegration(),
        Sentry.expressIntegration({ app }),
      ],
      tracesSampleRate: 1,
      environment: process.env.NODE_ENV || 'development',
    });

    console.log('Sentry monitoring enabled');
  } catch (error) {
    console.error('Failed to initialize Sentry:', error.message);
  }
} else {
  console.log('Sentry monitoring disabled - configure SENTRY_DSN to enable');
}

// Middleware
app.use(cors());
app.use(express.json());

// Sample menu data
const menu = [
  { id: 1, name: 'Margherita Pizza', price: 12.99, image: '🍕' },
  { id: 2, name: 'Cheeseburger', price: 9.99, image: '🍔' },
  { id: 3, name: 'Caesar Salad', price: 8.99, image: '🥗' },
  { id: 4, name: 'Pasta Carbonara', price: 14.99, image: '🍝' },
  { id: 5, name: 'Sushi Roll', price: 16.99, image: '🍣' },
  { id: 6, name: 'Chicken Wings', price: 11.99, image: '🍗' },
];

// Store orders in memory (in a real app, use a database)
const orders = [];

// Routes
app.get('/api/menu', (req, res) => {
  res.json(menu);
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, customerName } = req.body;

    // Simulate random bugs that occur in production (30% chance)
    const randomBug = Math.random();

    if (randomBug < 0.15) {
      // Simulate async database connection error
      await Promise.reject(new Error('Database connection timeout - Unable to save order to database'));
    } else if (randomBug < 0.30) {
      // Simulate async payment processing error
      const error = new Error('Payment gateway unavailable - Transaction failed');
      error.statusCode = 503;
      await Promise.reject(error);
    }

    const order = {
      id: orders.length + 1,
      items,
      total,
      customerName,
      timestamp: new Date(),
    };

    orders.push(order);
    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (err) {
    // Properly handle errors with appropriate status codes
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    
    // Re-throw to let Sentry capture it, but ensure response is sent
    if (isSentryEnabled) {
      Sentry.captureException(err);
    }
    
    res.status(statusCode).json({ error: message });
  }
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Test error endpoint for Sentry
app.get('/api/test-error', (_req, _res) => {
  throw new Error('Test error for Sentry monitoring!');
});

// Sentry error handler must be registered after all controllers
// but before any other error middleware
if (isSentryEnabled) {
  Sentry.setupExpressErrorHandler(app);
}

// Fallback error handler
app.use((err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
