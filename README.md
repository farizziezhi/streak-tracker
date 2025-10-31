# 🔥 Streak Tracker

A beautiful habit tracking application built with AdonisJS and modern UI design.

## Features

- 📊 Track daily activities and build streaks
- 🏆 Public leaderboard with rankings
- 🎨 Modern UI with Duolingo-inspired design
- 🔐 Secure authentication system
- 📱 Responsive design

## Tech Stack

- **Backend:** AdonisJS v6
- **Database:** MySQL
- **Frontend:** Vanilla JavaScript + Tailwind CSS
- **Authentication:** Token-based auth

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Setup database and run migrations: `npm run migrate`
4. Start development server: `npm run dev`

## Deployment

Ready to deploy on Railway, Render, or any Node.js hosting platform.

## API Endpoints

- `POST /register` - User registration
- `POST /login` - User login
- `POST /streaks` - Record daily activity (auth required)
- `GET /streaks/public` - Public leaderboard