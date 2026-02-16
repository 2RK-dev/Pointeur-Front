# Pointeur-Front - ENI Presence Management System

This is a Next.js 15.4.8 application built with React 18 and TypeScript for managing student presence and schedules at ENI (École Nationale d'Informatique). The application provides comprehensive tools for room management, teacher management, schedule creation, and presence tracking with dashboard analytics.

## Features

- **Room Management**: Full CRUD operations with PDF export functionality
- **Teacher Management**: Manage professor information and assignments
- **Schedule Management (EDT)**: Create and manage "Emploi du Temps" (timetables)
- **Level Management**: Configure and manage student levels/grades
- **Teaching Unit Management**: Organize teaching units and courses
- **Presence Tracking**: Track and monitor student attendance
- **Import/Export**: Bulk data operations for efficient management
- **Dashboard Analytics**: Visual charts and statistics for presence monitoring
- **Authentication**: Role-based access control with secure login
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS and Radix UI

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js**: 18.x (LTS) - REQUIRED
- **npm**: 8.x or 9.x (comes bundled with Node.js 18.x)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/2RK-dev/Pointeur-Front.git
cd Pointeur-Front
```

2. Install dependencies:

```bash
npm install
```

Note: Installation takes approximately 35 seconds. Do not cancel the process.

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your specific configuration values (see Environment Variables section below).

## Usage

### Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (starts in approximately 1.4 seconds).

### Production Build

Build the application for production:

```bash
npm run build
```

### Start Production Server

Start the production server:

```bash
npm start
```

Or specify a custom port:

```bash
npm start -- -p 8080
```

### Code Quality

Run ESLint to check code quality:

```bash
npm run lint
```

### Running Tests

Run Jest tests:

```bash
npm run test
```

## Environment Variables

This application uses environment variables for configuration. Copy `.env.example` to `.env.local` and configure the following variables:

### Required Variables

- **`API_BASE_URL`**: Base URL for API requests
  - Example: `API_BASE_URL=http://localhost:8888/api`
  - Used by the axios HTTP client for all API calls

### Optional Variables

- **`NEXT_PUBLIC_DEV_MODE`**: Skip authentication and block API calls (for UI development only)
  - Example: `NEXT_PUBLIC_DEV_MODE=true`
  - Default: `false`
  - When enabled, bypasses authentication and uses mock user credentials

### Setup Steps

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your specific configuration values

3. Restart the development server if running:
   ```bash
   npm run dev
   ```

## Application Structure

The application follows Next.js 15 App Router conventions:

```
src/
├── app/                    # Next.js App Router pages
│   ├── (Main)/            # Main application routes (protected)
│   │   ├── EDT/           # Schedule (Emploi du Temps) management
│   │   ├── Level/         # Level/Grade management
│   │   ├── Teacher/       # Teacher (Professor) management
│   │   ├── Room/          # Room management
│   │   ├── TeachingUnit/  # Teaching unit management
│   │   ├── import-export/ # Import/Export functionality
│   │   ├── page.tsx       # Dashboard page
│   │   ├── layout.tsx     # Main layout with sidebar
│   │   └── loading.tsx    # Loading state component
│   ├── auth/              # Authentication routes (public)
│   │   ├── login/         # Login page
│   │   └── layout.tsx     # Auth layout
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/UI component library (Radix UI based)
│   │   ├── button.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── sidebar-comp/     # Sidebar navigation components
│   │   ├── app-sidebar.tsx
│   │   ├── nav-main.tsx
│   │   └── nav-user.tsx
│   ├── auth-provider.tsx # Authentication context provider
│   └── ...               # Other custom components
├── hooks/                # Custom React hooks
│   ├── use-auth-actions.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                  # Utility functions and helpers
│   ├── utils.ts
│   ├── file-parser.ts
│   └── import-utils.ts
├── services/             # API service layer
│   ├── Auth.ts
│   ├── Room.ts
│   ├── Teacher.ts
│   ├── ScheduleItem.ts
│   ├── Level.ts
│   ├── TeachingUnit.ts
│   ├── DataTransfer.ts
│   └── mapper.ts
├── Stores/               # State management (Zustand stores)
│   ├── Auth.ts
│   ├── Room.ts
│   ├── Teacher.ts
│   ├── ScheduleItem.ts
│   ├── Level.ts
│   └── TeachingUnit.ts
├── Tools/                # Development tools and utilities
│   ├── PDF.ts
│   ├── import.tsx
│   └── ScheduleItem.ts
├── Types/                # TypeScript type definitions
│   ├── auth.ts
│   ├── Room.ts
│   ├── Teacher.ts
│   ├── ScheduleItem.ts
│   ├── LevelDTO.ts
│   ├── TeachingUnit.ts
│   └── GroupDTO.ts
└── api/                  # API layer
    ├── http/             # HTTP request handlers (Axios)
    │   ├── auth.ts
    │   ├── room.ts
    │   ├── teacher.ts
    │   ├── schedule-item.ts
    │   ├── level.ts
    │   ├── teaching-unit.ts
    │   ├── group.ts
    │   └── data-transfer.ts
    ├── schemas/          # Zod validation schemas
    │   ├── auth.ts
    │   ├── room.ts
    │   ├── teacher.ts
    │   ├── schedule-item.ts
    │   ├── level.ts
    │   ├── teaching-unit.ts
    │   ├── group.ts
    │   └── import.ts
    └── types.ts          # API type definitions
```

## Key Technologies

### Core Framework
- **Next.js 15.4.8**: React framework with App Router
- **React 18**: UI library with Server Components support
- **TypeScript**: Type-safe JavaScript

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Framer Motion**: Animation library
- **next-themes**: Dark mode support

### Data & State Management
- **Zustand**: Lightweight state management
- **Axios**: HTTP client for API requests
- **Zod**: Schema validation
- **React Hook Form**: Form management

### Tables & Data Display
- **TanStack React Table**: Powerful table component
- **date-fns**: Date manipulation and formatting

### PDF Generation
- **jsPDF**: PDF document generation
- **jsPDF AutoTable**: Table generation for PDFs
- **html2canvas**: HTML to canvas conversion

### Development Tools
- **ESLint**: Code linting
- **Jest**: Testing framework
- **TypeScript**: Static type checking

## Docker Deployment

### Using Docker

Build the Docker image:

```bash
docker build -t pointeur-front .
```

Run the container:

```bash
docker run -p 3000:3000 pointeur-front
```

Note: The Dockerfile uses Node.js 18 (LTS) as the base image.

### Using Docker Compose

Start the application with Docker Compose:

```bash
docker compose up
```

Start in detached mode:

```bash
docker compose up -d
```

Stop the application:

```bash
docker compose down
```

View logs:

```bash
docker compose logs -f
```

## Development Workflow

### Getting Started

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the existing code patterns

3. Run linting to check code quality:
   ```bash
   npm run lint
   ```

4. Test your changes with the development server:
   ```bash
   npm run dev
   ```

5. Run tests to ensure nothing breaks:
   ```bash
   npm run test
   ```

6. Build the application to verify production readiness:
   ```bash
   npm run build
   ```

7. Commit your changes with a descriptive message:
   ```bash
   git commit -m "feat: add new feature description"
   ```

8. Push your branch and create a pull request

### Code Style Guidelines

- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional components with hooks
- Implement proper error handling with try/catch blocks
- Add type definitions in `src/Types/` for new data models
- Use existing UI components from `src/components/ui/`
- Write unit tests for utility functions
- Document complex logic with comments

### Adding New Features

#### Creating a New Page

1. Create a new directory under `src/app/(Main)/YourFeature/`
2. Add `page.tsx` with your page component
3. Update the sidebar navigation in `src/components/sidebar-comp/app-sidebar.tsx`
4. Add necessary types in `src/Types/YourFeature.ts`
5. Create API service in `src/services/YourFeature.ts`
6. Create HTTP handlers in `src/api/http/your-feature.ts`
7. Add Zod schemas in `src/api/schemas/your-feature.ts`
8. Create Zustand store in `src/Stores/YourFeature.ts` if needed

#### Adding a New Component

1. Create component in `src/components/YourComponent.tsx`
2. Use TypeScript for props typing
3. Follow existing component patterns
4. Import and use UI components from `src/components/ui/`
5. Add to the appropriate export in the component directory

#### Creating an API Service

1. Define types in `src/Types/`
2. Create Zod schemas in `src/api/schemas/`
3. Implement HTTP handlers in `src/api/http/`
4. Create service layer in `src/services/` with mapper functions
5. Use the service in your components

## Authentication

The application uses a custom authentication system with the following features:

- JWT-based authentication
- Role-based access control (admin, user roles)
- Protected routes with `AuthProvider`
- Public routes (login page)
- Automatic redirect to login for unauthenticated users
- Session persistence

### Development Mode

For UI development without backend API, enable development mode:

```bash
# In .env.local
NEXT_PUBLIC_DEV_MODE=true
```

This will:
- Bypass authentication checks
- Use a mock user (username: "dev_user", role: "admin")
- Allow testing UI components without API connection

## Troubleshooting

### Installation Issues

If `npm install` fails:
1. Ensure Node.js 18.x is installed: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and `package-lock.json`
4. Run `npm install` again

### Development Server Issues

If the dev server fails to start:
1. Check if port 3000 is already in use
2. Try a different port: `npm run dev -- -p 3001`
3. Clear Next.js cache: `rm -rf .next`
4. Restart your terminal/IDE

### Build Issues

If the build fails:
1. Check for TypeScript errors: `npm run lint`
2. Ensure all environment variables are set
3. Verify all imports are correct
4. Clear `.next` directory and rebuild

### Docker Issues

If Docker build fails:
1. Ensure Docker is running
2. Check available disk space
3. Try building without cache: `docker build --no-cache -t pointeur-front .`
4. Verify network connectivity for package downloads

### Authentication Issues

If login doesn't work:
1. Verify `API_BASE_URL` is correctly set in `.env.local`
2. Check if backend API is running
3. Verify credentials are correct
4. Check browser console for errors
5. Clear browser cookies and local storage

## Performance Optimization

The application implements several performance optimizations:

- Server Components for improved initial load
- Dynamic imports for code splitting
- Image optimization with Next.js Image component
- CSS optimization with Tailwind CSS purging
- API response caching where appropriate
- Lazy loading for heavy components

## Browser Support

The application supports:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Follow the code style guidelines
4. Write or update tests as needed
5. Ensure all tests pass
6. Submit a pull request with a clear description

### Pull Request Process

1. Update the README if you change functionality
2. Ensure code passes linting: `npm run lint`
3. Add/update tests for new features
4. Update documentation for API changes
5. Request review from maintainers

## License

[Specify your license here - e.g., MIT, Apache 2.0, Proprietary]

## Support

For issues, questions, or contributions:
- Open an issue in the repository
- Contact the development team
- Check existing documentation

## Roadmap

Future enhancements planned:
- Real-time presence updates with WebSockets
- Advanced analytics and reporting
- Mobile application
- Email notifications
- Export to multiple formats (Excel, CSV, PDF)
- Multi-language support
- Dark mode improvements

## Acknowledgments

Built with:
- Next.js team for the amazing framework
- Radix UI for accessible components
- Vercel for hosting and deployment tools
- The ENI development team

---

Last updated: 2026-02-16
