# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Career Mentor AI Sales Assistant** browser extension that provides AI-powered sales response suggestions through a side panel interface. Built with React 19, TypeScript, and Vite, the extension helps sales professionals generate contextually appropriate responses during conversations.

## Key Technologies

- **React 19** with TypeScript and strict type checking
- **Vite** for build tooling and development server
- **CRXJS Vite Plugin** for browser extension development 
- **Tailwind CSS** for styling (v4.x)
- **TanStack Query** for data fetching and state management
- **Zod** for runtime type validation
- **date-fns** for date manipulation
- **copy-to-clipboard** for clipboard operations

## Development Commands

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)  
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Architecture Overview

The extension follows a **side panel architecture** with three main components:

### Extension Structure
- **Background Script** (`src/background.ts`): Service worker that manages side panel behavior
- **Side Panel** (`public/sidepanel.html`): Main UI entry point that loads the React app
- **React App** (`src/App.tsx`): Single-page application with conversation management

### Core Components
- **ConversationList**: Displays recent conversations with contact previews
- **ConversationView**: Shows individual conversation thread with message history
- **SuggestionCard**: Renders AI-generated response suggestions
- **ChatInput**: Handles new message input and sending

### Data Flow
The app uses a simple state-driven architecture:
1. ConversationList displays mock conversations
2. User selects conversation → switches to ConversationView
3. ConversationView shows message history and generates suggestions
4. User can send messages or copy suggestions to clipboard

## Browser Extension Configuration

**Manifest V3** extension with:
- **Side Panel**: Primary UI interface accessed via extension icon
- **Permissions**: Only `sidePanel` permission required
- **Service Worker**: Handles extension lifecycle and panel behavior

The extension is configured to open the side panel when the toolbar icon is clicked.

## TypeScript Configuration

Uses a **composite TypeScript setup**:
- `tsconfig.json`: Root config referencing app and node configs
- `tsconfig.app.json`: App-specific settings with strict linting rules
- `tsconfig.node.json`: Build tool configuration for Vite

Strict mode enabled with enhanced linting options including:
- `noUnusedLocals` and `noUnusedParameters`
- `noFallthroughCasesInSwitch`
- `noUncheckedSideEffectImports`

## Project Structure

```
src/
├── App.tsx              # Main app with conversation routing
├── main.tsx             # React app entry point
├── background.ts        # Extension service worker
├── components/
│   ├── ConversationList.tsx    # Conversation overview interface
│   ├── ConversationView.tsx    # Individual conversation thread
│   ├── SuggestionCard.tsx      # AI suggestion display
│   └── ChatInput.tsx           # Message input component
├── App.css              # Component styles
├── index.css            # Global Tailwind styles
└── assets/              # Static assets

public/
└── sidepanel.html       # Extension side panel entry point
```

## Key Implementation Notes

- **Mock Data**: Currently uses mock conversations and AI suggestions
- **State Management**: Uses React useState for local component state
- **Styling**: Tailwind CSS classes with custom component styles
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Extension Integration**: Minimal Chrome API usage focused on side panel functionality