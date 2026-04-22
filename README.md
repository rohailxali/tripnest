# TripNest âœˆï¸

> An AI-powered trip planning web app for students, solo travelers, and small groups.

**TripNest** helps users create and manage travel plans with a multi-step wizard, itinerary generation, budget tracking, and collaboration features.

---

## ðŸ–¥ï¸ Requirements

Before you begin, make sure the following are installed on the PC:

| Tool | Minimum Version | Download |
|------|----------------|----------|
| **Node.js** | v18 or higher | https://nodejs.org |
| **npm** | v8 or higher | Comes with Node.js |

> You can check your versions by running: `node -v` and `npm -v`

---

## ðŸš€ Quick Start (Fresh Machine)

**1. Extract the ZIP**
```
Unzip Plan_a_route_MVP.zip into a folder of your choice.
```

**2. Set up environment variables**
```bash
# In the project root, copy the example file:
copy .env.example .env        # Windows
cp .env.example .env          # Mac/Linux
```
> The `.env` file already has the correct default values â€” no edits needed for local development.

**3. Install dependencies**
```bash
npm install
```

**4. Start the application**
```bash
npm start
```

This will start **both** servers simultaneously:
- ðŸŒ **Frontend** (React) â†’ http://localhost:3000
- âš™ï¸ **Backend** (Node.js + Express) â†’ http://localhost:5000

Open your browser and go to: **http://localhost:3000**

---

## ðŸ‘¤ Default Login

You can register a new account, or use the pre-seeded credentials:

| Field | Value |
|-------|-------|
| **Email** | zohair@example.com |
| **Password** | password456 |

---

## âœ¨ MVP Features

- âœ… User Signup & Login
- âœ… Dashboard with trip overview
- âœ… Trip Creation Wizard (6-step form)
- âœ… AI-style itinerary view
- âœ… Budget overview & tracking
- âœ… Collaboration & sharing
- âœ… Dark mode support
- âœ… Responsive design (mobile + desktop)
- âœ… Local SQLite database (auto-created on first run)

---

## ðŸ§± Project Structure

```
src/
â”œâ”€â”€ components/       Reusable UI components (layout, ui, trip)
â”œâ”€â”€ pages/            All application pages
â”œâ”€â”€ services/         API layer (mock + real)
â”œâ”€â”€ store/            Global state (Zustand)
â”œâ”€â”€ types/            TypeScript type definitions
â”œâ”€â”€ data/             Sample/mock data

server/
â”œâ”€â”€ index.js          Express server entry point
â”œâ”€â”€ db.js             SQLite database connection & init
â”œâ”€â”€ routes/           API endpoints (auth, trips)

public/               Static assets
```

---

## âš™ï¸ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:5000` | Backend API URL (don't change for local dev) |
| `REACT_APP_MAPS_KEY` | _(empty)_ | Optional Google Maps API key |

---

## ðŸ—„ï¸ Database

- Uses **SQLite** â€” no external database setup needed.
- The `database.sqlite` file is **auto-created** in `server/` on first run.
- A default user (`Zohair`) is automatically seeded.

---

## ðŸ¤– AI Trip Generation

The system includes a placeholder for AI-based itinerary generation. You can connect it to:
- OpenAI (ChatGPT)
- Anthropic (Claude)
- Google (Gemini)

---

## ðŸ³ Docker (Optional)

If you prefer Docker instead of running Node directly:

```bash
docker-compose up --build
```

---

## ðŸ§ª Testing

See `TESTING.md` for manual testing steps and expected results.

---

## ðŸ› ï¸ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Backend | Node.js + Express |
| Database | SQLite3 |
| Charts | Recharts |

---

## â“ Troubleshooting

**Port already in use?**
```bash
# Kill processes on ports 3000 and 5000, then re-run npm start
```

**`npm install` fails?**
- Ensure Node.js v18+ is installed.
- Try deleting `node_modules` and running `npm install` again.

**Database issues?**
- Delete `server/database.sqlite` and restart â€” it will be recreated automatically.
