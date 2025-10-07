# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Pookie's Banter Zone is a real-time chat application built with React, TypeScript, and Firebase. It enables random chat matching and direct user-to-user conversations with real-time messaging, typing indicators, and user management.

**Live Demo**: https://pookies-banter-zone.netlify.app/

## Development Commands

### Core Development
- `npm run dev` - Start development server (runs on port 8080)
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

### Package Management
- Uses npm (package-lock.json present)
- Supports Bun as alternative (bun.lockb present)

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming
- **State Management**: React Query + React Context
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Routing**: React Router with Hash routing

### Key Architectural Patterns

#### 1. Context-Based Chat System
The chat functionality is centralized through a context provider pattern:
- `ChatContextProvider` - Main chat context wrapper
- `useChatState` - State management hook
- `useChatActions` - Action handlers hook  
- `useChatSubscriptions` - Real-time Firebase subscriptions

#### 2. Firebase Integration
- **Authentication**: Google OAuth + Email/Password
- **Database**: Firestore for user data, chat rooms, messages
- **Real-time**: Firebase subscriptions for live chat
- **Structure**: 
  - `/users` - User profiles and status
  - `/chatRooms` - Chat room metadata with nested messages
  - Real-time typing indicators

#### 3. Component Organization
```
src/
├── components/
│   ├── auth/          # Login/register forms
│   ├── chat/          # Chat-specific components
│   ├── profile/       # User profile management
│   ├── settings/      # App settings
│   └── ui/            # shadcn/ui components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── lib/firebase/      # Firebase utilities
└── pages/             # Route components
```

#### 4. Message Flow Architecture
- Messages flow through Firebase Firestore real-time listeners
- Typing indicators use temporary Firebase state
- Chat rooms are dynamically created for user pairs
- Message delivery uses optimistic updates

## Firebase Configuration

### Environment Variables Required
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_DATABASE_URL
```

### Database Schema
```
/users/{userId}
  - uid: string
  - name: string
  - email: string
  - photoURL: string
  - username: string
  - status: "online" | "offline"
  - lastActive: timestamp

/chatRooms/{roomId}
  - participants: [userId1, userId2]
  - createdAt: timestamp
  /messages/{messageId}
    - senderId: string
    - text: string
    - timestamp: timestamp
  /typing/{userId}: boolean
```

## Development Guidelines

### Component Development
- Use TypeScript for all new components
- Follow shadcn/ui patterns for consistent styling
- Implement proper loading states and error handling
- Use React Query for server state management

### State Management
- Use React Context for UI state that needs to be shared across components
- Use React Query for server-side data (Firebase data)
- Custom hooks (useChatState, useChatActions, etc.) for complex logic

### Firebase Patterns
- Use Firebase Auth state listener for user authentication
- Implement real-time subscriptions for chat features
- Handle offline/online status properly
- Use Firestore security rules (configure in Firebase Console)

### Styling
- Tailwind CSS with custom configuration
- CSS variables for theming support
- Responsive design patterns
- Dark/light mode support via next-themes

## Common Development Tasks

### Adding New Chat Features
1. Extend the ChatContext interface in `src/contexts/ChatContext.tsx`
2. Implement logic in the relevant hook (`useChatActions`, `useChatState`, etc.)
3. Update the ChatContextProvider to expose new functionality
4. Add UI components in `src/components/chat/`

### Firebase Operations
- All Firebase utilities are in `src/lib/firebase/`
- Authentication: `auth.ts`
- User management: `profile.ts`
- Chat functionality: `chat.ts`
- Message handling: `messages.ts`

### Adding New Pages
1. Create component in `src/pages/`
2. Add route to `App.tsx`
3. Update navigation if needed

## Build Configuration

### Vite Setup
- Custom port: 8080
- Path alias: `@` maps to `src/`
- SWC for fast React compilation
- Component tagging for development (lovable-tagger)

### TypeScript
- Strict mode enabled
- Separate configs for app and Node.js
- Path mapping configured for clean imports

### ESLint
- TypeScript ESLint rules
- React hooks linting
- React refresh plugin
- Unused variables disabled (development convenience)

## Deployment Notes

- **Current Deployment**: Netlify
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- Uses Hash routing for SPA compatibility
- Requires Firebase environment variables in deployment platform
