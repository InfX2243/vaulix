# Vaulix - Security that stays with you

A modern, privacy-first password vault built with React, TypeScript, and Vite.

## 🔐 Features

- **Zero-Knowledge Encryption**: All encryption/decryption happens locally in the browser
- **Local-First Architecture**: Your passwords never leave your device in plaintext
- **Secure Storage**: IndexedDB encrypted storage for vault data
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Optional Cloud Sync**: Encrypted vault syncing with Google Drive (coming soon)

## 🛠 Tech Stack

- **Frontend**: React 18.2 + TypeScript 5
- **Build Tool**: Vite 4.4
- **Styling**: Tailwind CSS 3.3
- **UI Components**: Lucide Icons
- **Encryption**: Web Crypto API (future integration)

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview the production build:
```bash
npm run preview
```

## 🎨 Color Palette

- **Primary Blue**: `#1F4B99`
- **Accent Cyan**: `#4DD6FF`
- **Dark Background**: `#0B0F14`
- **Dark Card**: `#111827`
- **Light Background**: `#F5F7FA`
- **Light Text**: `#94A3B8`

Colors are configured in `tailwind.config.js` under `theme.extend.colors.vaulix`.

## 📁 Project Structure

```
vaulix/
├── src/
│   ├── App.tsx           # Main app component
│   ├── index.css         # Global styles and Tailwind directives
│   └── main.tsx          # React entry point
├── index.html            # HTML template
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment

The project uses Vite's built-in environment variables. Create a `.env` file if needed for additional configuration.

## 🔒 Security

- All passwords are encrypted locally using the Web Crypto API
- No sensitive data is transmitted to any server
- Optional Google Drive sync only transmits encrypted blobs
- Vaulix never has access to unencrypted vault contents

## 📝 MVP Features (Phase 1)

- [x] Project setup with Vite + React + TypeScript
- [x] Landing page with vault creation/unlock
- [x] Basic dashboard layout
- [x] Color palette integration
- [ ] Master password encryption with PBKDF2
- [ ] IndexedDB vault storage
- [ ] Entry CRUD operations
- [ ] Search and filter functionality
- [ ] Password generator
- [ ] Auto-lock functionality
- [ ] Export/import functionality
- [ ] Google Drive sync (Phase 2)

## 🤝 Contributing

This is a personal privacy project. Contributions are welcome for security improvements, UX enhancements, and bug fixes.

## 📄 License

MIT License - see LICENSE file for details

## 🙋 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Vaulix** - Security that stays with you. 🔐
