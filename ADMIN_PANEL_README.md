# Admin Panel Integration

## Overview
This project now includes an integrated admin panel for managing portfolio content. The admin panel is accessible at `/admin` route and connects to a separate Laravel backend.

## Quick Start

### 1. Start the Backend (Laravel)
```bash
cd D:\Arsa\portfolio\admin-panel
php artisan serve --port=8000
```

### 2. Start the Frontend (React)
```bash
cd D:\Arsa\portfolio\3D_portfolio
npm run dev
```

### 3. Access Admin Panel
Navigate to: http://localhost:5174/admin

### 4. Login Credentials
- **Email:** admin@example.com
- **Password:** password

## Admin Panel Features

The admin panel provides management capabilities for:

### Projects
- Create, edit, and delete portfolio projects
- Manage project categories
- Toggle published status
- Upload and manage project images

### Team Members
- Add and manage team members
- Update roles and bios
- Manage social media links
- Toggle active status

## Admin Panel Location

The admin panel files are located in:
- **Frontend:** `src/admin/`
  - `AdminPanel.jsx` - Main admin interface
  - `Login.jsx` - Login page
  - `Projects.jsx` - Projects management
  - `TeamMembers.jsx` - Team members management
  - `api.js` - API client

- **Backend:** `D:\Arsa\portfolio\admin-panel/`
  - Laravel API server
  - Database migrations
  - Controllers and models

## Architecture

```
Frontend (React/Vite)
├── Main Site (http://localhost:5174/*)
│   ├── Home, Work, About, etc.
│   ├── Navigation & Footer
│   └── Public pages
│
└── Admin Panel (http://localhost:5174/admin)
    ├── Login
    ├── Dashboard
    ├── Projects Management
    └── Team Members Management
    └── No Navigation or Footer

Backend (Laravel)
└── API Server (http://localhost:8000/api)
    ├── Authentication (Sanctum)
    ├── Projects CRUD
    └── Team Members CRUD
```

## API Connection

The admin panel connects to the Laravel backend via:
- **Base URL:** `http://localhost:8000/api`
- **Authentication:** JWT tokens via Laravel Sanctum
- **CORS:** Enabled for local development

## Database

The backend uses SQLite for local development:
- **Database file:** `admin-panel/database/database.sqlite`
- **Migrations:** Located in `admin-panel/database/migrations/`
- **Seeders:** Sample data for testing

## Installation

### First Time Setup

1. **Setup Laravel Backend:**
   ```bash
   cd D:\Arsa\portfolio\admin-panel
   composer install
   php artisan migrate
   php artisan db:seed --class=AdminUserSeeder
   php artisan db:seed --class=ProjectSeeder
   php artisan db:seed --class=TeamMemberSeeder
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd D:\Arsa\portfolio\3D_portfolio
   npm install
   ```

3. **Start Both Servers:**
   ```bash
   # Terminal 1 - Backend
   cd D:\Arsa\portfolio\admin-panel
   php artisan serve --port=8000

   # Terminal 2 - Frontend
   cd D:\Arsa\portfolio\3D_portfolio
   npm run dev
   ```

## Dependencies Added

To support the admin panel, the following dependencies were added:

### Frontend (package.json)
- `react-router-dom` - Routing for /admin
- `axios` - HTTP client for API calls

### Backend (composer.json)
- `laravel/sanctum` - Authentication
- Standard Laravel 11 dependencies

## Routing Structure

The admin panel uses React Router and is integrated into the main app:

```tsx
<Routes>
  <Route path="/admin" element={<AdminPanel />} />
  <Route path="/" element={<Home />} />
  {/* Other public routes */}
</Routes>
```

## Admin Panel Styling

The admin panel has its own styling:
- Clean, professional interface
- High contrast for readability
- Responsive design
- Color-coded status indicators
- Clear action buttons (Edit, Delete, Add)

## Security Notes

- Admin panel is protected by authentication
- JWT tokens stored in localStorage
- Logout button clears authentication
- Backend API requires valid tokens for protected routes
- Never commit real credentials to git

## Troubleshooting

### Admin Panel Shows Blank Page
1. Ensure Laravel server is running on port 8000
2. Check browser console for errors
3. Verify API connectivity

### Login Fails
1. Verify admin user exists in database
2. Check Laravel logs
3. Re-run seeder: `php artisan db:seed --class=AdminUserSeeder`

### CORS Errors
1. Ensure CORS is configured in Laravel
2. Check allowed_origins in config/cors.php

## Branch Information

This feature is on the `admin-panel` branch:
- Main branch: Original portfolio site
- Admin panel branch: Portfolio + Admin Panel

To switch branches:
```bash
git checkout main          # Original site only
git checkout admin-panel   # Site + Admin Panel
```

## Documentation

For detailed backend documentation, see: `admin-panel/README.md`

## Development Notes

- The admin panel does NOT include the public site's Navigation or Footer
- It's designed as a separate interface for content management
- Public site will eventually consume data from the backend API
- Currently, the admin panel and public site are separate (no live integration yet)

## Future Work

- [ ] Integrate backend data into public site
- [ ] Add image upload functionality
- [ ] Implement project request/contact form management
- [ ] Add content text management
- [ ] Implement role-based access control
- [ ] Add activity logging
- [ ] Deploy to production with MySQL
