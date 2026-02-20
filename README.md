<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white" />
</p>

# 🌀 Cyclone Shelter Availability System

> A real-time emergency management web application designed to help citizens locate available cyclone shelters on an interactive map, while enabling administrators to manage shelter occupancy and monitor capacity through a comprehensive dashboard.

---

## 📸 Features Overview

### 🗺️ Public Home Page
- **Interactive Leaflet.js map** centered on Chennai with color-coded shelter markers
  - 🟢 **Green** — Available (< 70% full)
  - 🟡 **Yellow** — Filling Up (70–95% full)
  - 🔴 **Red** — Full (> 95% full)
- **Shelter photo** displayed on cards and map popups
- **Geolocation-based sorting** — shelters sorted by distance from user's location
- **Status filters** — filter by All, Available, Filling Up, or Full
- **Clickable map pins** with detailed popups showing occupancy, contact, and photo

### 🔐 Admin Panel (`/admin`)
- Secure login with hardcoded demo credentials
- **Add new shelters** with name, address, coordinates, capacity, phone, and photo URL
- **Adjust occupancy** with +10 / -10 buttons or set an exact number
- **Delete shelters** with confirmation dialog
- **Live image preview** when adding shelter photo URL

### 📊 Dashboard (`/dashboard`)
- **Summary stat cards**: Total Shelters, Available, Filling Up, Full
- **Detailed table** with progress bars, status badges, and last-updated timestamps
- **Auto-refresh** every 60 seconds

### 🎨 Design
- Emergency government-inspired dark navy theme (`#1B3A6B`)
- Blinking **"CYCLONE ALERT ACTIVE"** badge in the header
- Fully **mobile-responsive** layout
- Smooth transitions and micro-animations
- Shelter photos with graceful fallback placeholders

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui, Lucide Icons |
| **Maps** | Leaflet.js, React-Leaflet |
| **Backend** | Supabase (PostgreSQL + Auth + RLS) |
| **Notifications** | Sonner (Toast) |
| **Date Formatting** | date-fns |

---

## 📁 Project Structure

```
D:\DMS!\
├── public/                      # Static assets
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components (Button, Card, Badge, etc.)
│   │   ├── Header.tsx           # App header with alert badge & navigation
│   │   ├── NavLink.tsx          # Reusable navigation link
│   │   ├── ShelterCard.tsx      # Shelter card with photo, status, occupancy
│   │   ├── ShelterMap.tsx       # Leaflet map with colored markers & popups
│   │   └── StatusFilter.tsx     # Filter buttons (All/Available/Filling/Full)
│   ├── hooks/
│   │   ├── useShelters.ts       # Fetch, add, update, delete shelters
│   │   ├── use-mobile.tsx       # Mobile screen detection
│   │   └── use-toast.ts         # Toast notification hook
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts        # Supabase client initialization
│   │       └── types.ts         # TypeScript types for shelters table
│   ├── lib/
│   │   ├── shelterUtils.ts      # Status logic, colors, Haversine distance
│   │   └── utils.ts             # cn() class name utility
│   ├── pages/
│   │   ├── Index.tsx            # Public home — map + sidebar
│   │   ├── Admin.tsx            # Admin — login + occupancy management
│   │   ├── Dashboard.tsx        # Dashboard — stats + table
│   │   └── NotFound.tsx         # 404 page
│   ├── App.tsx                  # Router setup
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles & Tailwind directives
├── supabase/
│   └── migrations/
│       └── 001_create_shelters.sql  # DB schema + seed data
├── .env                         # Supabase credentials (placeholder)
├── tailwind.config.ts           # Custom theme (navy, status colors, blink)
├── vite.config.ts               # Vite config with path aliases
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Supabase** project (optional — app works with built-in mock data)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mitesh575/Cyclone_Shelter_System.git
cd Cyclone_Shelter_System

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173/**

### (Optional) Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/001_create_shelters.sql` in the SQL Editor
3. Update `.env` with your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart the dev server

> **Note:** Without Supabase, the app uses built-in mock data with 8 Chennai shelters at various occupancy levels.

---

## 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| Email | `admin@shelter.com` |
| Password | `admin123` |

---

## 📊 Shelter Status Logic

| Status | Condition | Color | Marker |
|--------|-----------|-------|--------|
| Available | Occupancy < 70% | 🟢 `#16A34A` | Green pin |
| Filling Up | 70% ≤ Occupancy ≤ 95% | 🟡 `#EAB308` | Yellow pin |
| Full | Occupancy > 95% | 🔴 `#DC2626` | Red pin |

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for emergency preparedness
</p>
