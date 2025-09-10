# React + Vite Template

A modern React template for web applications and games, featuring React 18, Vite, TailwindCSS, and Material UI.

## Project Structure

```
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles (Tailwind)
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── eslint.config.js     # ESLint configuration
```

## Development Guidelines

- Modify `index.html` and `src/App.jsx` as needed
- Create new folders or files in `src/` directory as needed
- Style components using TailwindCSS utility classes
- Avoid modifying `src/main.jsx` and `src/index.css`
- Only modify `vite.config.js` if absolutely necessary

## Available Scripts
- `pnpm install` - Install dependencies
- `pnpm run dev` - Start development server
- `pnpm run lint` - Lint source files
- `pnpm run build` - Build for production

## Tech Stack

- React
- Vite
- TailwindCSS
- ESLint
- Javascript

## Installation

```bash
pnpm install
pnpm run dev
```

The app runs at `http://localhost:5173` by default.

## Deployment

Build the project and serve the generated files from `dist/` using any static hosting service:

```bash
pnpm run build
```

## Environment Variables

This template does not require specific environment variables. Add a `.env` file at the project root to extend configuration.

## Contribution Guide

1. Fork and clone the repository.
2. Create descriptive commits following existing code style.
3. Run `pnpm run lint` before submitting a pull request.

## Custom Hooks

### `useAuth`
Handles authentication logic against a placeholder API:

```javascript
const { user, login, logout } = useAuth();
```

### `useOutsideClick`
Detects clicks outside a referenced element:

```javascript
const ref = useRef();
useOutsideClick(ref, () => console.log('clicked outside'));
```

### `useForm`
Manages form state with change and reset helpers:

```javascript
const { values, handleChange, reset } = useForm({ name: '' });
```
