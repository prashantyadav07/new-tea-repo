# Industry-Grade React Architecture - Complete Setup

## Project Structure

```
src/
├── components/
│   └── Navbar.jsx                 # Responsive navigation component
├── layouts/
│   └── MainLayout.jsx             # Layout wrapper with persistent Navbar & Footer
├── pages/
│   ├── Home.jsx                   # Landing page with hero & features
│   ├── About.jsx                  # Company information page
│   ├── Courses.jsx                # Course catalog page
│   ├── Contact.jsx                # Contact form page
│   └── NotFound.jsx               # 404 error page
├── routes/
│   └── AppRoutes.jsx              # Centralized route configuration
├── lib/
│   └── utils.js                   # Utility functions
├── assets/                        # Images, fonts, etc.
├── App.jsx                        # Root app component
├── main.jsx                       # Entry point with BrowserRouter
└── index.css                      # Global styles
```

## Key Features

### 1. **Centralized Routing** (`routes/AppRoutes.jsx`)
- Single source of truth for all application routes
- Uses react-router-dom v6 features
- MainLayout as a wrapper for consistent layout across pages

### 2. **Persistent Layout** (`layouts/MainLayout.jsx`)
- Navbar stays on top across all pages
- Footer at the bottom
- Outlet for page content
- flex layout for proper spacing

### 3. **Responsive Navbar** (`components/Navbar.jsx`)
- Desktop navigation with active link styling
- Mobile hamburger menu
- Accessibility attributes (aria-label, aria-expanded)
- lucide-react icons for menu toggle
- Smooth transitions and hover states

### 4. **Page Components**
All pages feature:
- Semantic HTML structure
- Tailwind CSS v4 for styling
- Responsive design (mobile-first)
- Consistent spacing and typography
- lucide-react icons where appropriate

#### Pages Included:
- **Home**: Hero section, features, CTAs
- **About**: Mission, values, team section
- **Courses**: Grid of course cards with ratings
- **Contact**: Form with validation, contact info
- **NotFound (404)**: Helpful error page with navigation

### 5. **Best Practices Implemented**
✅ Functional components only
✅ Proper component composition
✅ Reusable components (Navbar, MainLayout)
✅ Clean file organization
✅ Comments and documentation
✅ Accessible markup
✅ Mobile-responsive design
✅ No TypeScript (JavaScript ES6+)
✅ Tailwind CSS utility-first approach
✅ lucide-react icons integration

## Setup & Running

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The app will run at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm preview
```

### Lint Code
```bash
npm run lint
```

## Navigation Routes

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero section |
| About | `/about` | Company information |
| Courses | `/courses` | Course catalog |
| Contact | `/contact` | Contact form |
| NotFound | `*` | 404 error page |

## File Hierarchy

### Entry Point
- `main.jsx` - Renders App with BrowserRouter wrapper
- `App.jsx` - Returns AppRoutes component

### Routing
- `routes/AppRoutes.jsx` - All route definitions

### Layout
- `layouts/MainLayout.jsx` - Wrapper with Navbar + Outlet + Footer

### Pages
- `pages/Home.jsx` - Hero, features, CTAs
- `pages/About.jsx` - Mission, values, team
- `pages/Courses.jsx` - Course cards, ratings
- `pages/Contact.jsx` - Contact form, info
- `pages/NotFound.jsx` - 404 page

### Components
- `components/Navbar.jsx` - Navigation bar

## Future Expansion Points

1. **Authentication** - Add auth routes and protected page wrapper
2. **API Integration** - Use axios with API service layer
3. **State Management** - Add Context API or state library if needed
4. **Testing** - Add Jest and React Testing Library
5. **Additional Features** - Dashboard, user profile, settings
6. **Styling** - Custom Tailwind config in tailwind.config.js
7. **Utilities** - Expand utils.js with common functions

## Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Routing**: react-router-dom 7
- **Icons**: lucide-react
- **HTTP Client**: axios (pre-installed)
- **Language**: JavaScript ES6+
- **Linting**: ESLint

## Notes

- All pages are fully responsive using Tailwind CSS
- Navigation uses `NavLink` for automatic active state styling
- Mobile menu closes on link click for better UX
- Contact form includes success message feedback
- Course cards display ratings and student enrollment
- 404 page provides multiple navigation options
- Code is well-commented for team collaboration
