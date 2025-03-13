# Pookie's Banter Zone 🎭

## Introduction

Pookie's Banter Zone is a feature-rich, real-time chat application designed to connect users in a fun and interactive way. Whether you want to meet new people randomly or chat with specific users, this platform provides a seamless and engaging experience.

Built with modern web technologies including React, TypeScript, and Firebase, this application demonstrates best practices in front-end development and real-time data synchronization.

![Login Screen](https://github.com/user-attachments/assets/857e623d-b53e-4330-bcec-c44540dfac0b)
![Chat Interface](https://github.com/user-attachments/assets/f646fcb5-d36b-4b8f-8729-113173e3daf0)

**Live Demo**: [https://pookies-banter-zone.netlify.app/](https://pookies-banter-zone.netlify.app/)

## ✨ Features

### User Authentication
- **Secure Login/Registration**: Firebase Authentication for secure user management
- **Profile Management**: Update your profile information and preferences
- **Persistent Sessions**: Stay logged in across browser sessions

### Chat Functionality
- **Random Chat Matching**: Connect with random users for spontaneous conversations
- **User Selection**: Browse and select specific users to chat with
- **Real-time Messaging**: Instant message delivery with Firebase Realtime Database
- **Typing Indicators**: See when your chat partner is typing
- **Message History**: Access previous conversations with users

### User Experience
- **Responsive Design**: Beautiful UI that works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Choose your preferred theme for comfortable viewing
- **Intuitive Navigation**: Easy-to-use interface with clear navigation paths
- **Loading States**: Elegant loading indicators during data fetching
- **Error Handling**: User-friendly error messages and recovery options

## 🛠️ Technologies

This project leverages a modern tech stack to deliver a robust and performant user experience:

### Frontend
- **React 18**: Component-based UI architecture
- **TypeScript**: Static typing for enhanced code quality and developer experience
- **Vite**: Lightning-fast build tool and development server
- **React Router**: Client-side routing and navigation
- **React Query**: Data fetching, caching, and state management
- **shadcn/ui**: Beautifully designed, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **React Hook Form**: Form validation and handling with minimal re-renders

### Backend Services
- **Firebase Authentication**: User management and authentication
- **Firebase Realtime Database**: Real-time data synchronization
- **Firebase Cloud Functions**: Serverless backend functionality
- **Firebase Hosting**: Optional deployment platform

### Development Tools
- **ESLint**: Code quality and consistency
- **TypeScript**: Type checking and enhanced IDE support
- **Netlify**: Continuous deployment and hosting

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16 or higher ([download](https://nodejs.org/))
- **npm** or **yarn**: Latest version recommended
- **Git**: For cloning the repository ([download](https://git-scm.com/))

### Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/Itinerant18/pookies-banter-zone.git
   cd pookies-banter-zone
   ```

2. **Install dependencies**:
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
   - Enable Authentication (Email/Password method)
   - Set up Realtime Database
   - Create a `.env` file in the project root with your Firebase configuration:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_FIREBASE_DATABASE_URL=your_database_url
     ```

4. **Start the development server**:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

### Firebase Database Structure

The application uses the following database structure:

```
/users
  /userId
    - displayName: string
    - email: string
    - photoURL: string
    - status: string
    - lastActive: timestamp

/chatRooms
  /roomId
    - participants: [userId1, userId2]
    - createdAt: timestamp
    /messages
      /messageId
        - senderId: string
        - text: string
        - timestamp: timestamp
    /typing
      /userId: boolean
```

## 📋 Project Structure

```
pookies-banter-zone/
├── public/                  # Static assets
│   ├── favicon.ico          # Site favicon
│   └── assets/              # Images and other assets
├── src/
│   ├── components/          # UI components
│   │   ├── chat/            # Chat-related components
│   │   │   ├── ChatContainer.tsx     # Main chat container
│   │   │   ├── ChatContent.tsx       # Chat messages display
│   │   │   ├── ChatContextProvider.tsx # Chat context provider
│   │   │   ├── EmptyState.tsx        # Empty state UI
│   │   │   ├── ErrorState.tsx        # Error state UI
│   │   │   ├── FindingMatch.tsx      # Finding match UI
│   │   │   ├── MessageBubble.tsx     # Individual message component
│   │   │   ├── MessageInput.tsx      # Message input component
│   │   │   └── UsersList.tsx         # Users list component
│   │   ├── ui/              # shadcn/ui components
│   │   └── Layout.tsx       # Main layout component
│   ├── contexts/            # React contexts
│   │   └── ChatContext.tsx  # Chat context definition
│   ├── hooks/               # Custom React hooks
│   │   ├── useChatActions.ts    # Chat action hooks
│   │   ├── useChatState.ts      # Chat state hooks
│   │   └── useChatSubscriptions.ts # Chat subscription hooks
│   ├── lib/                 # Utility functions and Firebase setup
│   │   ├── firebase/        # Firebase configuration
│   │   │   ├── auth.ts      # Auth configuration
│   │   │   ├── database.ts  # Database configuration
│   │   │   ├── index.ts     # Firebase exports
│   │   │   └── messages.ts  # Message type definitions
│   │   └── utils/           # Utility functions
│   ├── pages/               # Page components
│   │   ├── Chat.tsx         # Chat page
│   │   ├── Index.tsx        # Landing/login page
│   │   ├── NotFound.tsx     # 404 page
│   │   ├── Profile.tsx      # User profile page
│   │   └── Settings.tsx     # Settings page
│   ├── App.tsx              # Main application component
│   ├── App.css              # Global styles
│   ├── index.css            # Tailwind imports
│   └── main.tsx             # Application entry point
├── .gitignore               # Git ignore file
├── index.html               # HTML entry point
├── package.json             # Project dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Build the application for production
- `npm run build:dev` - Build the application with development settings
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🌐 Deployment

### Deployment Options

The application can be deployed using various services:

### Using Netlify

1. Connect your GitHub repository to Netlify
2. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set up environment variables in the Netlify dashboard
4. Deploy!

### Using Vercel

1. Connect your GitHub repository to Vercel
2. The platform will automatically detect Vite settings
3. Configure environment variables in the Vercel dashboard
4. Deploy!

### Using Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase: `firebase init`
4. Select Hosting and configure settings
5. Build the app: `npm run build`
6. Deploy to Firebase: `firebase deploy`

**Current Deployment**: The application is currently deployed at [https://pookies-banter-zone.netlify.app/](https://pookies-banter-zone.netlify.app/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and structure
- Write clean, maintainable, and testable code
- Add appropriate comments and documentation
- Test your changes thoroughly before submitting a PR
- Update the README if necessary

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Development Notes

### Best Practices

- **Firebase Configuration**: Should be set up in `.env` files (not tracked by git)
- **Component Structure**: Follow the existing component structure for consistency
- **Styling**: Use Tailwind CSS for styling new components
- **State Management**: Use React Query for server state and React Context for UI state
- **Error Handling**: Implement proper error handling and user feedback
- **Performance**: Be mindful of re-renders and unnecessary computations

### Common Issues

- **Firebase Connection**: If you encounter issues with Firebase connection, check your `.env` configuration
- **Tailwind Classes**: If Tailwind classes aren't applying, ensure your component is within the Tailwind scope
- **TypeScript Errors**: Run `npm run lint` to identify and fix TypeScript errors

## 🙏 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Firebase](https://firebase.google.com/) for the backend services
- [React](https://reactjs.org/) for the UI library
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Vite](https://vitejs.dev/) for the build tool
- [TypeScript](https://www.typescriptlang.org/) for the type system

---

## Contact

For questions or feedback about this project, please open an issue on GitHub.
