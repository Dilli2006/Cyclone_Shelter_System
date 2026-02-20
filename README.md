<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white" />
</p>

# Cyclone Shelter Availability System

A real-time emergency management web application that helps citizens locate available cyclone shelters on an interactive map. Administrators can manage shelter occupancy and monitor capacity through a dedicated dashboard.

---

## Features

### Public Home Page

- Interactive Leaflet.js map centered on Chennai with color-coded shelter markers
  - Green markers indicate shelters below 70% capacity
  - Yellow markers indicate shelters between 70% and 95% capacity
  - Red markers indicate shelters above 95% capacity
- Shelter cards with photos displayed in a sidebar, sorted by proximity using browser geolocation
- Filter shelters by availability status — All, Available, Filling Up, or Full
- Clickable map pins open detailed popups with shelter photo, occupancy data, and contact information

### Admin Panel

- Secure login page with credential-based authentication
- Add new shelters with name, address, GPS coordinates, capacity, contact number, and photo URL
- Adjust shelter occupancy using increment/decrement buttons or by entering an exact value
- Delete shelters with a confirmation prompt
- Live image preview when entering a shelter photo URL

### Dashboard

- Summary cards showing total shelters, available count, filling up count, and full count
- Detailed table view with progress bars, status badges, and last-updated timestamps
- Automatic data refresh every 60 seconds

### Design

- Emergency government-inspired dark navy theme
- Blinking "Cyclone Alert Active" indicator in the header
- Fully responsive layout for mobile and desktop devices
- Smooth transitions and hover effects
- Shelter photos with graceful fallback placeholders for missing images

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui, Lucide Icons |
| Maps | Leaflet.js, React-Leaflet |
| Backend | Supabase (PostgreSQL, Auth, Row Level Security) |
| Notifications | Sonner |
| Date Formatting | date-fns |

---

## Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable UI components (Button, Card, Badge, etc.)
│   │   ├── Header.tsx           # Application header with navigation
│   │   ├── NavLink.tsx          # Navigation link component
│   │   ├── ShelterCard.tsx      # Shelter information card with photo
│   │   ├── ShelterMap.tsx       # Leaflet map with shelter markers
│   │   └── StatusFilter.tsx     # Status filter buttons
│   ├── hooks/
│   │   ├── useShelters.ts       # Data fetching and mutation logic
│   │   ├── use-mobile.tsx       # Mobile screen detection
│   │   └── use-toast.ts         # Toast notification management
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts        # Supabase client configuration
│   │       └── types.ts         # TypeScript type definitions
│   ├── lib/
│   │   ├── shelterUtils.ts      # Status logic, color mapping, distance calculation
│   │   └── utils.ts             # Class name utility
│   ├── pages/
│   │   ├── Index.tsx            # Public home page
│   │   ├── Admin.tsx            # Admin management page
│   │   ├── Dashboard.tsx        # Statistics dashboard
│   │   └── NotFound.tsx         # 404 error page
│   ├── App.tsx                  # Application router
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── supabase/
│   └── migrations/
│       └── 001_create_shelters.sql
├── .env
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js version 18 or higher
- npm version 9 or higher
- A Supabase project (optional — the application includes built-in sample data)

### Installation

```bash
git clone https://github.com/Dilli2006/Cyclone_Shelter_System.git
cd Cyclone_Shelter_System

npm install

npm run dev
```

The application will be available at `http://localhost:5173/`

### Supabase Configuration (Optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Open the SQL Editor and run the contents of `supabase/migrations/001_create_shelters.sql`
3. Update the `.env` file with your project credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart the development server

Without Supabase configured, the application loads sample data for 8 shelters across Chennai with varying occupancy levels.

---

## Demo Credentials

| Field | Value |
|-------|-------|
| Email | `admin@shelter.com` |
| Password | `admin123` |

---

## Shelter Status Logic

| Status | Condition | Color |
|--------|-----------|-------|
| Available | Occupancy below 70% | Green |
| Filling Up | Occupancy between 70% and 95% | Yellow |
| Full | Occupancy above 95% | Red |

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).
