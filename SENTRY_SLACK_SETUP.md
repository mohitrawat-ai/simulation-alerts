# Sentry Setup Guide with Slack Alerts

This guide will help you set up Sentry for error monitoring in your Food Ordering App and configure Slack alerts for real-time notifications.

> **Note:** Sentry is optional. The app works fine without it configured. When you're ready to add monitoring, follow this guide to set it up.

## Table of Contents

1. [Create Sentry Account](#1-create-sentry-account)
2. [Create Projects in Sentry](#2-create-projects-in-sentry)
3. [Configure Backend](#3-configure-backend)
4. [Configure Frontend](#4-configure-frontend)
5. [Set Up Slack Integration](#5-set-up-slack-integration)
6. [Configure Alert Rules](#6-configure-alert-rules)
7. [Test the Integration](#7-test-the-integration)

---

## 1. Create Sentry Account

1. Go to [https://sentry.io/signup/](https://sentry.io/signup/)
2. Sign up for a free account (or log in if you already have one)
3. The free tier includes:
   - 5,000 errors per month
   - 10,000 performance units
   - 500 replays
   - 1 team member

---

## 2. Create Projects in Sentry

### Create Backend Project

1. In Sentry dashboard, click **"Create Project"**
2. Select **Node.js** as the platform
3. Set Alert frequency to **"Alert me on every new issue"**
4. Name your project: `food-ordering-backend`
5. Click **"Create Project"**
6. **Copy the DSN** (Data Source Name) - you'll need this later

### Create Frontend Project

1. Click **"Projects"** > **"Create Project"** again
2. Select **Next.js** as the platform
3. Set Alert frequency to **"Alert me on every new issue"**
4. Name your project: `food-ordering-frontend`
5. Click **"Create Project"**
6. **Copy the DSN** - you'll need this later

---

## 3. Configure Backend

### Step 1: Create Environment File

In the `backend` directory, create a `.env` file:

```bash
cd backend
cp .env.example .env
```

### Step 2: Add Your Sentry DSN

Edit `backend/.env` and add your backend project DSN:

```env
SENTRY_DSN=https://your-backend-dsn@o123456.ingest.sentry.io/123456
NODE_ENV=development
```

### Step 3: Restart Backend Server

```bash
npm start
```

---

## 4. Configure Frontend

### Step 1: Create Environment File

In the `frontend` directory, create a `.env.local` file:

```bash
cd frontend
cp .env.local.example .env.local
```

### Step 2: Add Your Sentry Configuration

Edit `frontend/.env.local` and add:

```env
# Sentry DSN (from frontend project)
NEXT_PUBLIC_SENTRY_DSN=https://your-frontend-dsn@o123456.ingest.sentry.io/123456

# Organization slug (find in Sentry Settings > General Settings)
SENTRY_ORG=your-organization-slug

# Project slug (should be: food-ordering-frontend)
SENTRY_PROJECT=food-ordering-frontend

# Auth token (we'll create this in the next step)
SENTRY_AUTH_TOKEN=your_auth_token_here
```

### Step 3: Create Sentry Auth Token

1. In Sentry, go to **Settings** > **Account** > **API** > **Auth Tokens**
2. Click **"Create New Token"**
3. Name it: `food-ordering-app`
4. Scopes needed:
   - `project:read`
   - `project:releases`
   - `org:read`
5. Click **"Create Token"**
6. **Copy the token** and add it to your `.env.local` file

### Step 4: Restart Frontend

```bash
npm run dev
```

---

## 5. Set Up Slack Integration

### Step 1: Install Sentry Slack App

1. In Sentry, go to **Settings** > **Integrations**
2. Find **Slack** in the list
3. Click **"Install"**
4. Click **"Add to Slack"**
5. Select your Slack workspace
6. Choose a channel (e.g., `#alerts`, `#engineering`, or create a new one like `#sentry-alerts`)
7. Click **"Allow"**

### Step 2: Link Projects to Slack

After installation, you'll be redirected to configure which projects send alerts to Slack:

1. Select your workspace
2. Choose the Slack channel for alerts
3. Click **"Save"**

---

## 6. Configure Alert Rules

### Backend Alert Configuration

1. In Sentry, go to **Alerts** > **Create Alert**
2. Select the **food-ordering-backend** project
3. Choose **"Issues"** as the alert type
4. Configure the conditions:

   **When:** `An event is seen`

   **Filters:**
   - The issue is `firstSeen`
   - OR the issue's state changes to `unresolved`
   - OR the issue's level is equal to `error` or `fatal`

5. **Then perform these actions:**
   - Send a notification via **Slack** to `#sentry-alerts` (or your chosen channel)
   - Send a notification via **email** to your team

6. Set action interval: `Immediately`
7. Name the alert: `Backend Errors - Immediate Notification`
8. Click **"Save Rule"**

### Frontend Alert Configuration

1. Create another alert for **food-ordering-frontend**
2. Use the same configuration as above
3. Name it: `Frontend Errors - Immediate Notification`
4. Click **"Save Rule"**

### Advanced Alert Rules (Optional)

You can create additional alerts for specific scenarios:

#### High Error Rate Alert

1. Create Alert > Select Project
2. **When:** `An event is seen`
3. **Filters:**
   - The issue is seen `more than 10 times in 5 minutes`
4. **Actions:** Send to Slack + Email
5. Name: `High Error Rate Alert`

#### Performance Degradation Alert

1. Create Alert for frontend project
2. **When:** `Transaction duration is greater than 2000ms`
3. **For:** `More than 10 times in 5 minutes`
4. **Actions:** Send to Slack
5. Name: `Performance Degradation Alert`

---

## 7. Test the Integration

### Test Backend Error Monitoring

1. Make sure your backend is running on `http://localhost:5001`
2. Visit the test error endpoint:
   ```bash
   curl http://localhost:5001/api/test-error
   ```
3. Check your Slack channel - you should receive an alert within seconds!
4. Check Sentry dashboard - the error should appear in the Issues tab

### Test Frontend Error Monitoring

1. Make sure your frontend is running on `http://localhost:3000`
2. Visit the test error endpoint:
   ```bash
   curl http://localhost:3000/api/test-error
   ```
3. Check Slack for the alert
4. Check Sentry dashboard for the issue

### Test Client-Side Error

Add a test button to your frontend to trigger a client-side error:

```typescript
// Somewhere in your page.tsx
<button onClick={() => {
  throw new Error('Client-side test error!');
}}>
  Test Error
</button>
```

Click it and check Slack!

---

## Slack Alert Format

When an error occurs, you'll receive a Slack message with:

- **Issue Title**: The error message
- **Project**: Which app (backend/frontend)
- **Environment**: development/production
- **First Seen**: Timestamp
- **Count**: How many times it occurred
- **Link**: Direct link to Sentry issue page
- **Stack Trace**: Quick preview of the error

---

## Customizing Slack Notifications

### Notification Preferences

1. Go to **Settings** > **Integrations** > **Slack**
2. Click **"Configure"** next to your workspace
3. You can:
   - Change notification channel
   - Customize message format
   - Set notification triggers
   - Configure @mentions for critical errors

### Per-User Notifications

Each team member can set their own notification preferences:

1. Go to **Settings** > **Notifications**
2. Choose which alerts you want to receive
3. Select delivery methods (Email, Slack DM, etc.)

---

## Production Best Practices

### 1. Adjust Sample Rates

In production, update your sample rates to reduce noise:

**Backend** (`backend/server.js`):
```javascript
Sentry.init({
  // ... other config
  tracesSampleRate: 0.1,  // 10% of transactions
  profilesSampleRate: 0.1, // 10% of profiles
});
```

**Frontend** (Sentry config files):
```javascript
Sentry.init({
  // ... other config
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0, // Always capture on error
});
```

### 2. Set Environment Properly

Update your `.env` files for production:

```env
NODE_ENV=production
```

### 3. Filter Sensitive Data

Configure data scrubbing in Sentry:

1. Go to **Settings** > **Security & Privacy**
2. Add sensitive field names to scrub (passwords, tokens, etc.)
3. Enable **"Default Data Scrubbing"**

### 4. Set Up Releases

Track which version of your code caused errors:

```bash
# After deploying
npx sentry-cli releases new "food-ordering-app@1.0.0"
npx sentry-cli releases finalize "food-ordering-app@1.0.0"
```

### 5. Create Alert Digests

Instead of instant notifications for everything:

1. Create a daily digest alert
2. **When:** `An event is seen`
3. **Actions:** Send summary to Slack once per day
4. Reduces notification fatigue in production

---

## Troubleshooting

### Alerts Not Showing in Slack

1. **Check Integration**: Settings > Integrations > Slack > Make sure it's installed
2. **Verify Alert Rules**: Alerts > View your rules > Make sure Slack action is configured
3. **Check Permissions**: The Sentry bot needs permission to post in your channel
4. **Test Manually**: In an issue, click "Send Notification" to test

### Errors Not Being Captured

1. **Check DSN**: Make sure the DSN in `.env` is correct
2. **Restart Servers**: After changing `.env`, restart both frontend and backend
3. **Check Console**: Look for Sentry initialization errors in logs
4. **Verify SDK**: Run `npm list @sentry/nextjs` and `npm list @sentry/node`

### Too Many Alerts

1. **Adjust Alert Rules**: Change from "immediate" to "digest"
2. **Add Filters**: Only alert on critical errors
3. **Use Fingerprinting**: Group similar errors together
4. **Set Thresholds**: Alert only when errors occur X times

---

## Useful Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Node.js Guide](https://docs.sentry.io/platforms/node/)
- [Slack Integration Docs](https://docs.sentry.io/product/integrations/notification-incidents/slack/)
- [Alert Rules Guide](https://docs.sentry.io/product/alerts-notifications/alerts/)

---

## Quick Reference

### Environment Variables

**Backend (.env):**
```env
SENTRY_DSN=your_backend_dsn
NODE_ENV=development
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_SENTRY_DSN=your_frontend_dsn
SENTRY_ORG=your_org_slug
SENTRY_PROJECT=food-ordering-frontend
SENTRY_AUTH_TOKEN=your_auth_token
```

### Test Endpoints

- Backend: `http://localhost:5001/api/test-error`
- Frontend: `http://localhost:3000/api/test-error`

### Important Links

- Sentry Dashboard: `https://sentry.io/organizations/YOUR_ORG/issues/`
- Create Alert: `https://sentry.io/organizations/YOUR_ORG/alerts/new/`
- Slack Integration: `https://sentry.io/settings/YOUR_ORG/integrations/slack/`

---

**You're all set!** Your app now has production-grade error monitoring with real-time Slack alerts. 🎉
