# Pookie's Banter Zone - Flutter

A real-time chat application built with Flutter, matching the web application functionality.

## Features

- Email/Password & Google Sign-In authentication
- Real-time messaging with Firestore
- User profiles with interests, bio, and photo
- Random user matching system
- Light/Dark theme toggle
- Typing indicators and read receipts
- Message deletion (for me / for everyone)

## Firebase Setup

This app reuses the existing Firebase project from the web application.

### Android

1. Download `google-services.json` from Firebase Console
2. Place it in `android/app/google-services.json`

### iOS

1. Download `GoogleService-Info.plist` from Firebase Console
2. Place it in `ios/Runner/GoogleService-Info.plist`
3. Update `CFBundleURLSchemes` in `ios/Runner/Info.plist` with your actual Google client ID

## Running the App

```bash
flutter pub get
flutter run
```

## Build

```bash
# Android
flutter build apk --release

# iOS
flutter build ios --release

# Web
flutter build web
```

## Project Structure

```
lib/
├── main.dart              # Entry point with Firebase init
├── app.dart               # MaterialApp with Provider setup
├── core/                  # Constants, theme, utils
├── data/                  # Models, repositories, Firebase service
├── presentation/          # Providers, screens, widgets
└── router/                # GoRouter configuration
```
