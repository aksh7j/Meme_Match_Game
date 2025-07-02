# Meme Match - Gorbagana Testnet Mini-Game

## Overview

This is a fast-paced browser-based memory game where players match pairs of popular meme faces before time runs out. The application is built as a full-stack web application using modern React and Express.js technologies, designed specifically for the Gorbagana community.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom game-specific color variables
- **State Management**: React hooks for local game state
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API with `/api` prefix

### Development Setup
- **Hot Reload**: Vite HMR for frontend, tsx for backend development
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Type Safety**: Shared TypeScript types between frontend and backend

## Key Components

### Game Logic
- **Card Matching System**: 8 different meme types (pepe, wojak, doge, cheems, chad, stonks, distracted, gigachad)
- **Timer System**: Countdown timer with game state management
- **Score Tracking**: Match counting and completion detection
- **Visual Feedback**: Card flip animations and color-coded feedback

### UI Components
- **Game Board**: 4x4 grid layout with responsive design
- **Modal System**: Win/lose dialogs using Radix UI primitives
- **Button Components**: Consistent styling with variant support
- **Toast Notifications**: User feedback system

### Database Schema
- **Users Table**: Basic user management with username/password
- **Schema Management**: Drizzle migrations for database versioning

## Data Flow

### Game State Management
1. **Initialization**: Cards are shuffled and distributed in a 4x4 grid
2. **User Interaction**: Click events trigger card flip logic
3. **Match Detection**: Two flipped cards are compared for matching
4. **State Updates**: Game state updates trigger UI re-renders
5. **Win/Lose Conditions**: Timer expiration or all matches found

### Client-Server Communication
1. **API Requests**: Frontend makes HTTP requests to `/api` endpoints
2. **Authentication**: Session-based authentication for user management
3. **Error Handling**: Centralized error handling with user feedback
4. **Query Management**: TanStack Query handles caching and synchronization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: TypeScript ORM for database operations
- **@tanstack/react-query**: Data fetching and caching
- **express**: Web application framework
- **react**: Frontend framework

### UI Dependencies
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript/TypeScript bundler

## Deployment Strategy

### Production Build
1. **Frontend**: Vite builds optimized React application to `dist/public`
2. **Backend**: esbuild compiles TypeScript server to `dist/index.js`
3. **Static Assets**: Frontend assets served by Express in production

### Environment Configuration
- **Development**: Hot reload with Vite dev server and tsx
- **Production**: Compiled JavaScript served by Node.js
- **Database**: PostgreSQL connection via environment variables

### Hosting Considerations
- **Frontend**: Static assets can be served via CDN
- **Backend**: Node.js server deployment
- **Database**: Serverless PostgreSQL (Neon) for scalability

## Changelog

```
Changelog:
- July 01, 2025. Initial setup
- July 01, 2025. UI Improvements:
  - Upgraded fonts to Poppins and Space Grotesk for better readability
  - Implemented cleaner design with light/dark theme support
  - Improved color scheme with subtle gradients and better contrast
  - Fixed accessibility warnings for dialog components
  - Enhanced card design with hover effects and modern styling
  - Updated modals with cleaner layouts and proper visual hierarchy
- July 01, 2025. Gorbagana Faucet Integration:
  - Added GorbaganaFaucet component matching the original design
  - Implemented dark-themed faucet card with green accents
  - Added wallet connection simulation and token claiming functionality
  - Integrated faucet alongside game instructions in responsive layout
  - Created deployment files and updated project structure
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```