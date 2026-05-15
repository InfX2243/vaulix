# Vaulix Project Instructions

**Project Name**: Vaulix - Security that stays with you

**Version**: 0.1.0

**Description**: A modern, privacy-first password vault with zero-knowledge encryption, built with React, TypeScript, and Vite.

## Project Overview

Vaulix is a browser-based password management application that emphasizes:
- Local-first encryption
- Zero-knowledge architecture
- User data ownership
- Clean, minimal UI
- Optional encrypted cloud sync

## Tech Stack

- **Frontend Framework**: React 18.2 with TypeScript 5
- **Build Tool**: Vite 4.4
- **Styling**: Tailwind CSS 3.3
- **UI Icons**: Lucide React
- **Encryption**: Web Crypto API (planned)
- **Storage**: IndexedDB (planned)

## Color Palette

The application uses a carefully selected color palette:

```
Primary Blue:     #1F4B99
Accent Cyan:      #4DD6FF
Dark Background:  #0B0F14
Dark Card:        #111827
Light Background: #F5F7FA
Light Text:       #94A3B8
```

These colors are configured in `tailwind.config.js` as `vaulix.*` color utilities.

## Project Structure

```
vaulix/
├── src/
│   ├── App.tsx                 # Main application component with routing
│   ├── index.css              # Global styles and Tailwind setup
│   ├── main.tsx               # React DOM entry point
│   └── components/            # (To be created) Reusable components
│       ├── LandingPage.tsx
│       ├── Dashboard.tsx
│       ├── SettingsPage.tsx
│       └── ...
├── index.html                  # HTML template
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS theme
├── postcss.config.js          # PostCSS with Tailwind
├── package.json               # Dependencies
└── README.md                  # Project documentation
```

## Development Guidelines

### Component Development

1. All components should use TypeScript with proper typing
2. Use Tailwind CSS classes for styling, preferring `vaulix-*` color utilities
3. Components should be functional and use React hooks
4. Keep components modular and reusable

### Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Use semantic HTML
- Maintain accessibility standards

### Styling Approach

- Use Tailwind CSS utility classes
- Custom CSS in `src/index.css` for global styles and component classes
- Color palette defined in `tailwind.config.js`
- Responsive breakpoints: mobile-first approach

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Key Features (MVP Phase 1)

- [x] Project scaffolding and configuration
- [x] Landing page with Create/Unlock options
- [x] Dashboard layout with sidebar navigation
- [x] Settings page placeholder
- [ ] Master password encryption (PBKDF2)
- [ ] IndexedDB vault storage
- [ ] Entry management (Add/Edit/Delete)
- [ ] Search functionality
- [ ] Password generator
- [ ] Auto-lock timer
- [ ] Export/Import functionality
- [ ] Google Drive sync integration (Phase 2)

## Next Steps

### Immediate (Phase 1)

1. **Encryption Setup**: Implement Web Crypto API integration for PBKDF2 key derivation and AES-GCM encryption
2. **Storage Layer**: Set up IndexedDB for encrypted vault persistence
3. **Component Extraction**: Extract Landing, Dashboard, and Settings into separate components
4. **Entry Management**: Implement full CRUD operations for vault entries
5. **Search & Filter**: Add search and filtering capabilities to the dashboard

### Future (Phase 2+)

1. **Google Drive Integration**: OAuth and encrypted sync functionality
2. **Password Generator**: Integrated password generation with customizable options
3. **Auto-lock**: Inactivity-based session management
4. **Advanced Security**: Fingerprinting, biometric support
5. **Notifications**: Toast notifications for user feedback

## Important Notes

- All encryption happens client-side in the browser
- No sensitive data is stored or transmitted unencrypted
- The application is designed to be privacy-first and zero-knowledge
- Use IndexedDB for persistent client-side storage only
- Master password should never be transmitted or stored unencrypted

## Deployment

The application is designed to be deployed as a static site:

- **Hosting Options**: GitHub Pages, Vercel, Netlify
- **Build Output**: `dist/` directory
- **Build Command**: `npm run build`

Recommended: Deploy from GitHub Actions on main branch push.

## Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [IndexedDB Documentation](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
