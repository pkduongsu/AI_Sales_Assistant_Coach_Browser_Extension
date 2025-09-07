# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a sales assistant browser extension built with React, TypeScript, and Vite. The project uses modern web technologies and is structured as a standard Vite React application.

## Key Technologies

- **React 19** with TypeScript
- **Vite** for build tooling and development
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for styling
- **Zod** for schema validation
- **CRXJS Vite Plugin** for browser extension development

## Development Commands

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
├── App.css          # Component styles
├── index.css        # Global styles
├── vite-env.d.ts    # Vite type definitions
└── assets/          # Static assets
```

## TypeScript Configuration

The project uses a composite TypeScript setup with:
- `tsconfig.json` - Root configuration that references other configs
- `tsconfig.app.json` - Application-specific TypeScript settings
- `tsconfig.node.json` - Node.js/build tool specific settings

## Browser Extension Context

This project is configured as a browser extension using the CRXJS Vite plugin. When working with extension-specific features, consider:
- Content scripts vs popup vs background scripts
- Extension manifest requirements
- Browser API limitations and permissions
- Extension-specific bundling considerations

## Dependencies of Note

- **@tanstack/react-query**: Used for server state management and caching
- **copy-to-clipboard**: Utility for clipboard operations
- **date-fns**: Date manipulation library
- **zod**: Runtime type validation

The project is currently in early development stage with a basic React setup.