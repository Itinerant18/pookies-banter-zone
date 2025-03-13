# Pookie's Banter Zone 🎭

A modern real-time chat application that connects users randomly or allows them to select specific users to chat with. Built with React, TypeScript, and Firebase.

(![screencapture-192-168-0-62-8080-2025-03-13-09_44_20](https://github.com/user-attachments/assets/857e623d-b53e-4330-bcec-c44540dfac0b)
![screencapture-pookies-banter-zone-netlify-app-2025-03-13-09_48_14](https://github.com/user-attachments/assets/f646fcb5-d36b-4b8f-8729-113173e3daf0)



**Live Demo**: [https://pookies-banter-zone.netlify.app/](https://pookies-banter-zone.netlify.app/)

## Features

- **User Authentication**: Secure login and registration with Firebase Authentication
- **Random Chat Matching**: Connect with random users for spontaneous conversations
- **User Selection**: Browse and select specific users to chat with
- **Real-time Messaging**: Instant message delivery with Firebase Realtime Database
- **Typing Indicators**: See when your chat partner is typing
- **Responsive Design**: Beautiful UI that works on desktop and mobile devices
- **Dark/Light Mode**: Choose your preferred theme

## Technologies

This project leverages modern web technologies:

- **React 18**: For building the user interface
- **TypeScript**: For type safety and better developer experience
- **Vite**: For fast development and optimized builds
- **Firebase**: For authentication, database, and hosting
- **React Router**: For navigation and routing
- **React Query**: For efficient data fetching and caching
- **shadcn/ui**: For beautiful, accessible UI components
- **Tailwind CSS**: For utility-first styling
- **React Hook Form**: For form validation and handling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Itinerant18/pookies-banter-zone.git
   cd pookies-banter-zone
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
pookies-banter-zone/
├── public/              # Static assets
├── src/
│   ├── components/      # UI components
│   │   ├── chat/        # Chat-related components
│   │   └── ui/          # shadcn/ui components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and Firebase setup
│   ├── pages/           # Page components
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── .gitignore           # Git ignore file
├── index.html           # HTML entry point
├── package.json         # Project dependencies and scripts
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run build:dev` - Build the application with development settings
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Deployment

### Using Lovable

Simply open [Lovable](https://lovable.dev/projects/42839644-292f-404a-b334-91de68c3dbba) and click on Share -> Publish.

### Using Netlify or Vercel

1. Connect your GitHub repository to Netlify or Vercel
2. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy!

**Current Deployment**: The application is currently deployed at [https://pookies-banter-zone.netlify.app/](https://pookies-banter-zone.netlify.app/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Development Notes

- Firebase configuration should be set up in `.env` files (not tracked by git)
- Follow the component structure in the existing codebase for consistency
- Use Tailwind CSS for styling new components

## Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Firebase](https://firebase.google.com/) for the backend services
---
