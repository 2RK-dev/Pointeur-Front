# Pointeur-Front - ENI Presence Management System

This is a Next.js 15.1.6 React application with TypeScript for managing student presence and schedules at ENI (École Nationale d'Informatique). The application features room management, teacher management, schedule creation, and presence tracking with dashboard analytics.

**ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites and Installation
- **Node.js Version**: Node.js 18.x (LTS) is REQUIRED (as specified in README.md and Dockerfile)
- **Package Manager**: npm 8.x or 9.x (comes bundled with Node.js 18.x)

### Bootstrap and Development Setup
```bash
# Install dependencies (takes ~35 seconds)
npm install
# NEVER CANCEL: Set timeout to 300+ seconds minimum
```

### Build Process
**CRITICAL BUILD LIMITATIONS:**
- **Production build FAILS** due to missing Dashboard components and network dependencies
- **Google Fonts network dependency fails** in restricted environments
- **Missing components**: `Dashboard_UI/ChartPresence`, `Dashboard_UI/ChartPresenceParNiveau`, `Dashboard_UI/TopAbs`
- **Missing utilities**: `edt_utils.ts` (referenced in tests)

```bash
# Build command (WILL FAIL with current codebase)
npm run build
# NEVER CANCEL: Set timeout to 1800+ seconds (30+ minutes for Docker builds)
# Expected failure: Missing Dashboard_UI components and Google Fonts connectivity
```

### Development Server
```bash
# Start development server (WORKS - takes ~1.4 seconds to start)
npm run dev
# NEVER CANCEL: Set timeout to 300+ seconds
# Serves on: http://localhost:3000
# Network: http://10.1.0.73:3000 (container networking)
```

### Linting and Code Quality
```bash
# Run ESLint (WORKS - takes ~2 seconds)
npm run lint
# NEVER CANCEL: Set timeout to 300+ seconds
```

### Testing
```bash
# Run Jest tests (PARTIALLY WORKS - has failing tests)
npm run test
# NEVER CANCEL: Set timeout to 300+ seconds
# Expected failures: Missing edt_utils.ts file, date calculation issues in dateUtils.test.ts
```

### Docker Deployment
```bash
# Docker build (FAILS due to same build issues)
docker build -t pointeur-front .
# NEVER CANCEL: Set timeout to 3600+ seconds (60+ minutes)
# Uses npm install --force in Dockerfile due to dependency conflicts

# Docker Compose (configuration valid, but depends on external image)
docker compose up
# Note: docker-compose.yml references image 'hhh' which needs to be built separately
```

## Current Codebase Status

### What Works
- ✅ Development server starts successfully (`npm run dev`)
- ✅ Linting passes without errors (`npm run lint`) 
- ✅ Basic Next.js app structure is intact
- ✅ Dependencies install successfully with npm install
- ✅ Room management page renders (src/app/(Main)/Room/page.tsx)
- ✅ Component library (Radix UI) and styling (Tailwind CSS) configured
- ✅ TypeScript configuration functional

### What Doesn't Work
- ❌ Production build fails (missing Dashboard components)
- ❌ Tests have failures (missing files, date calculation errors)  
- ❌ Docker build fails (same build issues)
- ❌ Google Fonts connectivity in restricted environments
- ❌ Main dashboard page has missing component imports

### Required Fixes for Full Functionality
Before attempting production deployment, these issues MUST be resolved:
1. Create missing Dashboard_UI components: `ChartPresence`, `ChartPresenceParNiveau`, `TopAbs`
2. Create missing `src/lib/edt_utils.ts` file
3. Fix date calculation logic in `src/lib/dateUtils.test.ts`
4. Replace Google Fonts with local font fallback (partially implemented)

## Validation Scenarios

### Manual Testing After Changes
**ALWAYS run these validation steps after making changes:**

1. **Development Server Test:**
   ```bash
   npm run dev
   # Verify server starts and is accessible at localhost:3000
   # Test navigation between pages
   ```

2. **Room Management Workflow:**
   - Navigate to Room management page
   - Test adding a new room (fill form, submit)
   - Test editing existing room data
   - Test PDF export functionality
   - Verify table displays correctly

3. **Code Quality Checks:**
   ```bash
   npm run lint
   # Must pass with no errors before committing
   ```

4. **Component Functionality:**
   - Test sidebar navigation (expand/collapse)
   - Verify modal dialogs open/close correctly
   - Test form validation and data handling

### Build Validation (Currently Failing)
```bash
# Only attempt after fixing missing components
npm run build
# Expected time: 20-30 seconds when working
# NEVER CANCEL: Set timeout to 1800+ seconds minimum
```

## Architecture and Key Locations

### Application Structure
```
src/
├── app/(Main)/          # Main application pages
│   ├── EDT/            # Schedule (Emploi du Temps) management  
│   ├── Level/          # Level/Grade management
│   ├── Prof/           # Teacher (Professor) management
│   ├── Room/           # Room management (WORKING)
│   ├── TeachingUnit/   # Teaching unit management
│   └── page.tsx        # Dashboard (BROKEN - missing components)
├── components/         # Reusable UI components
│   ├── ui/            # Shadcn/UI component library
│   └── ...            # Custom components (Card, Modal, etc.)
├── hooks/             # React hooks (use-mobile, use-toast, withErrorHandler)
├── lib/               # Utility functions and type definitions
├── services/          # API service layer with data mappers
├── Stores/            # State management (likely Zustand stores)
├── Tools/             # Development tools and utilities  
└── Types/             # TypeScript type definitions
```

### Important Files
- `package.json` - Dependencies and npm scripts
- `tailwind.config.ts` - Tailwind CSS configuration
- `next.config.mjs` - Next.js configuration (minimal)
- `tsconfig.json` - TypeScript configuration
- `components.json` - Shadcn/UI component configuration
- `.eslintrc.json` - ESLint rules (allows unescaped entities, disables exhaustive deps)

### Frequently Modified Areas
When making changes, these areas are most commonly affected:
- **Components**: `src/components/` - UI component definitions
- **Pages**: `src/app/(Main)/` - Application page implementations  
- **Services**: `src/services/` - API integration and data handling
- **Types**: `src/Types/` - TypeScript interface definitions
- **Utilities**: `src/lib/` - Helper functions and utilities

## Common Development Tasks

### Adding New Pages
1. Create page directory under `src/app/(Main)/`
2. Add `page.tsx` with default export function
3. Update sidebar navigation in `src/components/app-sidebar.tsx`
4. Add necessary types in `src/Types/`
5. Create corresponding service in `src/services/` if needed

### Component Development
1. Use existing UI components from `src/components/ui/`
2. Follow established patterns in `src/components/`
3. Import and use `withErrorHandler` for async operations
4. Test with development server before building

### API Integration
1. Add new service in `src/services/` following existing patterns
2. Use mapper functions from `src/services/mapper.ts`
3. Define types in corresponding `src/Types/` files
4. Implement error handling with try/catch and `withErrorHandler`

## Time Expectations and Timeouts

**CRITICAL: NEVER CANCEL long-running operations. All timeouts should be generous:**

- **npm install**: ~35 seconds (set timeout: 300+ seconds)
- **npm run dev**: ~1.4 seconds to start (set timeout: 300+ seconds)  
- **npm run lint**: ~2 seconds (set timeout: 300+ seconds)
- **npm run test**: ~7 seconds with failures (set timeout: 300+ seconds)
- **npm run build**: ~20-25 seconds when working (set timeout: 1800+ seconds)
- **Docker build**: 2+ minutes when working (set timeout: 3600+ seconds)

**NEVER CANCEL** any build or test command. Wait for completion even if it takes longer than expected.

## Troubleshooting

### Build Failures
If you encounter build failures:
1. Check for missing component imports in error messages
2. Verify all Dashboard_UI components exist
3. Ensure Google Fonts are accessible or use local fallback
4. Run `npm run lint` to check for syntax errors

### Development Issues  
If development server fails to start:
1. Ensure Node.js 18.x is installed
2. Delete `node_modules` and run `npm install` again
3. Check for port 3000 conflicts
4. Verify all required dependencies are installed

### Docker Issues
If Docker build fails:
1. Build will fail until Dashboard components are created
2. Consider using `npm install --force` for dependency conflicts
3. Ensure adequate disk space for Node.js image layers
4. Check network connectivity for npm package downloads

Remember: **This codebase requires component completion before production deployment is possible.** Development workflow is functional for iterative development and testing.