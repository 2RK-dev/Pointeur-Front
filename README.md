# My App - Hourly Creation and Presence Detection

This is a Next.js application for hourly creation and presence detection. It allows you to perform certain actions based on the current hour and detect user presence.

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js: 18.x (LTS)
- npm: 8.x or 9.x (comes bundled with Node.js 18.x)

## Installation

1. Clone the repository:

```bash
git clone <repository_url>
```

2. Install the dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your specific configuration values.

4. Build the application:

```bash
 npm run build
```

## Usage

To start the application, run the following command:

```bash
 npm start --- -p YourPort
```

## Environment Variables

This application uses environment variables for configuration. Copy `.env.example` to `.env.local` and configure the following variables:

### Required Variables

- **`NEXT_PUBLIC_USE_MOCKS`**: Controls whether to use mock services (`true`) or real services (`false`)
  - Example: `NEXT_PUBLIC_USE_MOCKS=false`
  - Used by the service layer to switch between mock and real implementations

- **`API_BASE_URL`**: Base URL for client-side API requests
  - Example: `API_BASE_URL=http://localhost:3001/api`
  - Used by the axios HTTP client for API calls

- **`BACK_URL`**: Backend URL for server-side API calls
  - Example: `BACK_URL=http://localhost:3000`
  - Used for server-side Room service requests

### Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your specific configuration values

3. Restart the development server if running:
   ```bash
   npm run dev
   ```
