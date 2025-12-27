# Food Ordering App

A simple food ordering application with Next.js frontend and Express backend.

## Features

- Browse food menu
- Add items to cart
- Adjust quantities
- Place orders
- Responsive design
- Error monitoring with Sentry
- Slack alerts for errors and issues

## Project Structure

```
simulations/
├── backend/          # Express API server
│   ├── server.js     # Main server file
│   └── package.json
├── frontend/         # Next.js app
│   ├── app/
│   │   └── page.tsx  # Main page
│   └── package.json
└── README.md
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Start the Express server:
```bash
npm start
```

The backend will run on [http://localhost:5001](http://localhost:5001)

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on [http://localhost:3000](http://localhost:3000)

## Usage

1. Make sure both backend and frontend are running
2. Open [http://localhost:3000](http://localhost:3000) in your browser
3. Browse the menu and click "Add to Cart" on items you want
4. Click the cart button to view your cart
5. Adjust quantities using the + and - buttons
6. Enter your name and click "Place Order"

## API Endpoints

- `GET /api/menu` - Get all menu items
- `POST /api/orders` - Place a new order
- `GET /api/orders` - Get all orders

## Technologies Used

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Communication**: REST API with CORS enabled
- **Monitoring**: Sentry for error tracking and performance monitoring
- **Alerts**: Slack integration for real-time notifications

## Error Monitoring & Alerts

This app includes production-ready error monitoring with Sentry and Slack integration.

### Quick Setup

1. **Create Sentry Account**: Sign up at [https://sentry.io/signup/](https://sentry.io/signup/)

2. **Configure Backend**:
   ```bash
   cd backend
   cp .env.example .env
   # Add your Sentry DSN to .env
   ```

3. **Configure Frontend**:
   ```bash
   cd frontend
   cp .env.local.example .env.local
   # Add your Sentry configuration to .env.local
   ```

4. **Set Up Slack Alerts**: Follow the detailed guide in [SENTRY_SLACK_SETUP.md](SENTRY_SLACK_SETUP.md)

### Test Endpoints

Once configured, you can test error monitoring:

- **Backend errors**: `http://localhost:5001/api/test-error`
- **Frontend errors**: `http://localhost:3000/api/test-error`

### Full Setup Guide

For detailed instructions on setting up Sentry with Slack alerts, see:

**[📖 Complete Sentry & Slack Setup Guide](SENTRY_SLACK_SETUP.md)**

This guide includes:
- Step-by-step Sentry setup
- Slack integration configuration
- Alert rules and customization
- Production best practices
- Troubleshooting tips
