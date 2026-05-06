# Flutter Mobile Application Prompt: Pookie's Banter Zone

> **Reference Project**: The web application at `pookies-banter-zone` built with React, TypeScript, Firebase, Tailwind CSS, and shadcn/ui

>

> **Goal**: Create a Flutter mobile application with identical functionality and matching design

---

## 1. Project Overview

### Project Name

`pookies_banter_zone`

### Core Functionality

A real-time chat application that allows users to connect with random users or select specific users to chat with. Features include:

- User authentication (email/password and Google Sign-in)

- Profile management with interests, bio, and photo

- Real-time messaging with typing indicators and read receipts

- Custom-themed UI with light/dark mode support

- Random user matching system

### Target Users

- Mobile users (iOS and Android) seeking social chat experiences

### Backend

Firebase (Firestore, Authentication) - **Reuse existing Firebase configuration** from the web application

---

## 2. UI/UX Specification

### Screen Structure

| Screen | Route | Description |

|--------|-------|-------------|

| Splash Screen | `/` | App logo with loading animation |

| Onboarding/Auth | `/auth` | Login/Register tabs with email/password and Google Sign-in |

| Chat Home | `/chat` | Main chat interface with random match and user list |

| Profile | `/profile` | View and edit user profile |

| Settings | `/settings` | App settings (notifications, dark mode, logout) |

### Navigation Structure

```

BottomNavigationBar (Mobile-specific)

├── Chat (Home) - MessageCircle icon

├── Profile - User icon

└── Settings - Settings icon

```

---

### Visual Design

#### Color Palette - Light Theme

| Color Name | Hex Code | Usage |

|------------|----------|-------|

| Champagne | `#F7E1D7` | Background, main surface |

| Cherry Blossom Pink | `#EDAFB8` | Primary, buttons, accents |

| Timberwolf | `#DEDBD2` | Cards, secondary surfaces |

| Outer Space | `#4A5759` | Text, foreground |

| Ash Gray | `#B0C4B1` | Borders, dividers, muted elements |

#### Color Palette - Dark Theme

| Color Name | Hex Code | Usage |

|------------|----------|-------|

| Outer Space | `#4A5759` | Background |

| Dark Outer Space | `#3B4647` | Cards, elevated surfaces |

| Timberwolf | `#DEDBD2` | Text, foreground |

| Cherry Blossom Pink | `#EDAFB8` | Primary, buttons, accents |

| Ash Gray | `#B0C4B1` | Secondary elements |

#### Typography

| Element | Size | Weight | Line Height |

|---------|------|--------|-------------|

| App Title | 24sp | Bold (700) | 1.2 |

| Screen Title | 20sp | SemiBold (600) | 1.3 |

| Body Text | 16sp | Regular (400) | 1.5 |

| Caption | 12sp | Regular (400) | 1.4 |

| Button Text | 14sp | Medium (500) | 1.0 |

| Message Text | 14sp | Regular (400) | 1.4 |

| Input Text | 16sp | Regular (400) | 1.5 |

#### Spacing System (8pt Grid)

| Token | Value |

|-------|-------|

| xs | 4px |

| sm | 8px |

| md | 16px |

| lg | 24px |

| xl | 32px |

| xxl | 48px |

#### Border Radius

| Element | Radius |

|---------|--------|

| Cards | 16px |

| Buttons | 12px |

| Input Fields | 12px |

| Avatar | Circular (50%) |

| Message Bubbles | 16px |

---

### Widget Specifications

#### 1. AppBar / Header

```

┌────────────────────────────────────────┐

│  [Logo Image]  Pookie's Banter Zone   │

│                        [Avatar ▼]      │

└────────────────────────────────────────┘

```

- **Height**: 56px + SafeArea

- **Background**: Champagne (light) / Outer Space (dark) with 80% opacity + blur effect

- **Logo**: `pookie.gif` (96x48px)

- **Avatar Dropdown**: User avatar with dropdown menu (Profile, Settings, Logout)

- **Shadow**: Subtle bottom shadow (elevation 2)

#### 2. Bottom Navigation Bar

```

┌────────────────────────────────────────┐

│                                         │

│           [Icon]  [Icon]  [Icon]       │

│          Chat   Profile  Settings       │

└────────────────────────────────────────┘

```

- **Height**: 56px + SafeArea bottom

- **Background**: Champagne (light) / Outer Space (dark)

- **Icons**: MessageCircle, User, Settings

- **Active State**: Cherry Blossom Pink with label

- **Inactive State**: Outer Space / Timberwolf (no label)

- **Transition**: Fade between states (200ms)

#### 3. Message Bubbles

**Sent Messages (Right-aligned)**

```

                              ┌────────────────────┐

                              │ Hello! How are you? │

                              └────────────────────┘

                                   10:30 AM  ✓✓

```

- **Background**: Cherry Blossom Pink (`#EDAFB8`)

- **Text Color**: Outer Space (`#4A5759`)

- **Max Width**: 75% of screen width

- **Padding**: 12px horizontal, 8px vertical

- **Corner Radius**: 16px (bottom-left radius: 4px)

- **Tail**: Bottom-right corner

**Received Messages (Left-aligned)**

```

┌────────────────────┐

│  I'm doing great!  │

└────────────────────┘

10:31 AM

```

- **Background**: Timberwolf (`#DEDBD2`)

- **Text Color**: Outer Space (`#4A5759`)

- **Max Width**: 75% of screen width

- **Padding**: 12px horizontal, 8px vertical

- **Corner Radius**: 16px (bottom-right radius: 4px)

- **Tail**: Bottom-left corner

**Status Icons**

- Sending: Clock icon (gray)

- Sent: Single checkmark (gray)

- Delivered: Double checkmark (gray)

- Read: Double checkmark (Cherry Pink)

#### 4. User Card (Match Display)

```

┌────────────────────────────────────────┐

│  ┌────┐                                 │

│  │ AV│  John Doe                        │

│  │ AV│  @johndoe                        │

│  │ ● │  Online ●│

│  └────┘                    [🔄 New Chat] │

└────────────────────────────────────────┘

```

- **Height**: Auto (min 80px)

- **Card Style**: Glass-morphism card with blur

- **Avatar**: 48x48px circular with 2px white border, shadow

- **Online Indicator**: 12px green circle (`#22C55E`), bottom-right of avatar

- **Name**: 18sp, SemiBold

- **Username**: 14sp, Muted color, preceded by @

- **Status Text**: 12sp, "Online" (green) or "Offline" (gray)

- **Button**: Outline style, "New Chat" / "Change User" text with Refresh icon

#### 5. Input Field

```

┌────────────────────────────────────────┐

│  Type a message...                     │

└────────────────────────────────────────┘

                                            [➤]

```

- **Height**: 48px (min), expands up to 120px (5 lines max)

- **Background**: Timberwolf (`#DEDBD2`)

- **Border**: 1px Ash Gray (`#B0C4B1`)

- **Border Radius**: 12px

- **Padding**: 16px horizontal

- **Placeholder Color**: Ash Gray (`#B0C4B1`)

- **Send Button**: Cherry Pink background, white icon, circular, 48x48px

#### 6. Primary Button

```

┌────────────────────────────────────────┐

│         Find Random Match              │

└────────────────────────────────────────┘

```

- **Height**: 48px

- **Background**: Cherry Blossom Pink (`#EDAFB8`)

- **Text Color**: Outer Space (`#4A5759`)

- **Border Radius**: 12px

- **Font**: 14sp, Medium (500)

- **Pressed State**: Darken by 10%

- **Disabled State**: 50% opacity

#### 7. Outline Button

```

┌────────────────────────────────────────┐

│          View All Users                │

└────────────────────────────────────────┘

```

- **Height**: 48px

- **Background**: Transparent

- **Border**: 1px Ash Gray (`#B0C4B1`)

- **Text Color**: Outer Space (`#4A5759`)

- **Border Radius**: 12px

- **Pressed State**: Light fill with Ash Gray 10%

#### 8. Empty State Card

```

┌────────────────────────────────────────┐

│                                         │

│              [Icon 64x64]              │

│           Start Chatting               │

│                                         │

│   Connect with someone new or choose   │

│   from available users to start a      │

│   conversation.                        │

│                                         │

│  ┌───────────────────────────────────┐ │

│  │      Find Random Match            │ │

│  └───────────────────────────────────┘ │

│  ┌───────────────────────────────────┐ │

│  │        View All Users             │ │

│  └───────────────────────────────────┘ │

│                                         │

└────────────────────────────────────────┘

```

- **Icon**: Centered, 64x64px PNG image

- **Title**: 24sp, SemiBold, centered

- **Description**: 14sp, Muted, centered, max 3 lines

- **Buttons**: Two buttons stacked vertically, full width

#### 9. Finding Match Loading State

```

┌────────────────────────────────────────┐

│                                         │

│              ⟳ (Spinner)               │

│         Finding someone to             │

│           chat with...                 │

│                                         │

│     This might take a moment           │

│                                         │

│   Creating your user profile and        │

│   searching for available users...      │

│                                         │

│   If this takes longer than expected,   │

│   please check:                        │

│   • Your Firebase rules are updated    │

│   • You're properly authenticated      │

│   • Your database has other users      │

│                                         │

└────────────────────────────────────────┘

```

- **Spinner**: Circular progress, Cherry Pink color, 48x48px

- **Title**: 20sp, Medium

- **Description**: 14sp, Muted

#### 10. User List Item

```

┌────────────────────────────────────────┐

│  ┌────┐  John Doe           ● Online  │

│  │ AV│  @johndoe                       │

│  └────┘                                │

└────────────────────────────────────────┘

```

- **Height**: 72px

- **Avatar**: 40x40px circular

- **Name**: 16sp, Medium

- **Username**: 12sp, Muted, preceded by @

- **Online Indicator**: 12px circle (green/gray)

- **Ripple Effect**: On tap

#### 11. Profile Avatar

```

        ┌──────────────┐

        │              │

        │     AV       │

        │              │

        └──────────────┘

           (96x96px)

```

- **Size**: 96x96px

- **Border**: 4px white

- **Shadow**: Medium elevation

- **Fallback**: Initial letter on Cherry Pink background

---

## 3. Functionality Specification

### Authentication Module

#### Login Tab

- **Email Field**: Text input, email validation (regex)

- **Password Field**: Text input, obscure text, min 6 characters

- **Remember Me**: Checkbox (default: checked)

- **Sign In Button**: Primary style, disabled when form invalid

- **Loading State**: Button shows spinner, inputs disabled

- **Error Display**: Red text below relevant field or toast

#### Register Tab

- **Name Field**: Text input, min 2 characters

- **Email Field**: Text input, email validation

- **Password Field**: Text input, min 6 characters

- **Remember Me**: Checkbox (default: checked)

- **Create Account Button**: Primary style

- **Form Validation**: Real-time validation with error messages

#### Social Login

- **Google Sign-In Button**: White background, Google logo, "Continue with Google" text

- **Persistence**: Remember me checkbox affects session persistence

  - Checked: `local` persistence (survives browser/app restart)

  - Unchecked: `session` persistence (clears on close)

#### Auth Flow

1. User enters credentials or clicks Google

2. Show loading state

3. On success: Create/update user document in Firestore, navigate to Chat

4. On error: Show error message via toast

#### User Document Structure (Firestore)

```javascript

// Collection: users

{

  uid: string,

  name: string,

  email: string,

  photoURL: string | null,

  username: string | null,

  age: number | null,

  gender: string | null,

  bio: string | null,

  interests: string[] | null,

  createdAt: timestamp,

  lastActive: timestamp,

  status: 'online' | 'offline',

  notificationsEnabled: boolean,

  darkModeEnabled: boolean

}

```

#### Username Generation

1. Start with display name (lowercase, spaces to underscores)

2. Check availability in Firestore

3. If taken, append number (e.g., `john_doe_1`)

4. Max 100 attempts before setting to null

---

### Profile Module

#### Profile View Screen

```

┌────────────────────────────────────────┐

│  [←Back]              Profile          │

├────────────────────────────────────────┤

│                                         │

│            ┌─────────┐                 │

│            │         │                  │

│            │   AV    │                  │

│            │         │                  │

│            └─────────┘                  │

│           John Doe                      │

│         john@email.com                  │

│                                         │

│  ┌─────────┐  ┌────────────┐           │

│  │  Age: 25│  │ Male       │           │

│  └─────────┘  └────────────┘           │

│                                         │

│  Bio                                    │

│  Software developer who loves coding... │

│                                         │

│  Interests                              │

│  ┌──────┐ ┌──────┐ ┌─────────┐         │

│  │Coding│ │Music │ │Traveling│         │

│  └──────┘ └──────┘ └─────────┘         │

│                                         │

│                      [✏️ Edit Profile] │

│                                         │

└────────────────────────────────────────┘

```

#### Profile Edit Dialog/Sheet

```

┌────────────────────────────────────────┐

│  Edit Profile                    [Save]│

├────────────────────────────────────────┤

│                                         │

│            ┌─────────┐  [📷]           │

│            │   AV    │                  │

│            └─────────┘                  │

│                                         │

│  Name *                                │

│  ┌─────────────────────────────────┐  │

│  │ John Doe                        │  │

│  └─────────────────────────────────┘  │

│                                         │

│  ┌──────────┐  ┌────────────────────┐  │

│  │ Age      │  │ Gender            │  │

│  │ ┌──────┐ │  │ ┌────────────────┐ │  │

│  │ │  25  │ │  │ │ Select    ▼   │ │  │

│  │ └──────┘ │  │ └────────────────┘ │  │

│  └──────────┘  └────────────────────┘  │

│                                         │

│  Bio (150)                              │

│  ┌─────────────────────────────────┐  │

│  │ Tell us about yourself...       │  │

│  │                                 │  │

│  │                                 │  │

│  └─────────────────────────────────┘  │

│  0/150                                 │

│                                         │

│  Interests                              │

│  ┌──────┐ ┌──────┐ ┌──────┐          │

│  │Coding│ │  ✕  │ │Music │ │  ✕  │   │

│  └──────┘ └──────┘ └──────┘          │

│  [Add interest...]                      │

│                                         │

└────────────────────────────────────────┘

```

#### Profile Fields

- **Avatar**: Tappable to change, shows camera icon overlay

- **Name**: Required, min 2 chars, updates Firebase Auth displayName

- **Age**: Optional, number input

- **Gender**: Optional dropdown (Male, Female, Non-binary, Other, Prefer not to say)

- **Bio**: Optional, max 150 chars with counter

- **Interests**: Optional, chip-based tags, add/remove capability

---

### Chat Module

#### Chat Home Screen - 5 States

**State 1: Empty State (Default)**

- Shown when: No active chat, no matching in progress, no error

- Components: EmptyState widget with two action buttons

- User actions: "Find Random Match" or "View All Users"

**State 2: Finding Match State**

- Shown when: Random match search in progress

- Components: FindingMatch widget with loading animation

- Timer: Optional timeout with error fallback

**State 3: Error State**

- Shown when: Chat operation fails

- Components: ErrorState widget with error message and retry button

- Variants:

  - Generic error (connection, server)

  - "No users available" variant with different messaging

**State 4: User List State**

- Shown when: User clicks "View All Users" or "Change User"

- Components:

  - Search bar (filters by name or @username)

  - Scrollable list of UsersListItem widgets

  - Pull-to-refresh capability

**State 5: Chat Active State**

- Shown when: Matched with a user, chat room exists

- Components:

  - UserCard (matched user info)

  - MessageList (conversation)

  - MessageInput (compose area)

  - Optional IndexingAlert (if Firestore indexing issue)

#### Message List Behavior

- **Date Headers**: Show date when messages span multiple days

  - Today, Yesterday, or "MMM dd, yyyy" format

- **Grouping**: Messages from same sender within 1 minute grouped

- **Auto-scroll**: Scroll to bottom on new message (if already at bottom)

- **Read Receipts**: Mark messages as read when visible in viewport

- **Typing Indicator**: Show when recipient is typing

#### Message Bubble Interactions

- **Long Press**: Show context menu

  - Delete for me

  - Delete for everyone (only if sender, within time limit)

- **Deleted Message**: Show italic "This message was deleted" placeholder

- **Status**: Show sending → sent → delivered → read progression

#### Typing Indicator

```

┌────────────────────────────────────────┐

│  ● ● ●  John is typing...             │

└────────────────────────────────────────┘

```

- Three animated dots

- Text: "[Name] is typing..."

- Debounce: Start typing after 500ms of input

- Stop: After 2 seconds of no input

#### Chat Room ID Generation

```javascript
// Sort UIDs alphabetically, join with underscore

const chatRoomId = [uid1, uid2].sort().join("_");

// Example: 'abc123_xyz789'
```

---

### Settings Module

#### Settings Screen

```

┌────────────────────────────────────────┐

│  [←Back]           Settings            │

├────────────────────────────────────────┤

│                                         │

│  ┌─────────────────────────────────┐  │

│  │ 🔔 Notifications                │  │

│  │ Receive app notifications       │  │

│  │                           [○━━]│  │

│  └─────────────────────────────────┘  │

│                                         │

│  ┌─────────────────────────────────┐  │

│  │ 🌙 Dark Mode                    │  │

│  │ Toggle dark mode on/off         │  │

│  │                           [━━●○]│  │

│  └─────────────────────────────────┘  │

│                                         │

│  ┌─────────────────────────────────┐  │

│  │ 🌐 Language                     │  │

│  │ English                         │  │

│  └─────────────────────────────────┘  │

│                                         │

│                                         │

│  ┌─────────────────────────────────┐  │

│  │      🔴 Log Out                  │  │

│  └─────────────────────────────────┘  │

│                                         │

└────────────────────────────────────────┘

```

#### Settings Items

1. **Notifications Toggle**

   - Icon: Bell

   - Title: "Notifications"

   - Description: "Receive app notifications"

   - Type: Switch toggle

   - Default: true

1. **Dark Mode Toggle**

   - Icon: Moon

   - Title: "Dark Mode"

   - Description: "Toggle dark mode on/off"

   - Type: Switch toggle

   - Default: System preference or false

1. **Language Display**

   - Icon: Globe

   - Title: "Language"

   - Value: Current language (e.g., "English")

   - Type: Display only (future: navigates to language selector)

1. **Logout Button**

   - Style: Full-width, destructive (red text)

   - Action: Opens confirmation dialog

#### Logout Confirmation Dialog

```

┌────────────────────────────────────────┐

│                                         │

│      Are you sure you want to          │

│           log out?                     │

│                                         │

│  You will need to sign in again to     │

│  access your account.                   │

│                                         │

│  ┌─────────────┐ ┌─────────────────┐   │

│  │   Cancel    │ │  Yes, log out  │   │

│  └─────────────┘ └─────────────────┘   │

│                                         │

└────────────────────────────────────────┘

```

---

## 4. State Management

### Provider Structure

```dart

// Main providers wrapper

MultiProvider(

  providers: [

    ChangeNotifierProvider(create: (_) => AuthProvider()),

    ChangeNotifierProxyProvider<AuthProvider, UserProvider>(...),

    ChangeNotifierProxyProvider<AuthProvider, ChatProvider>(...),

    ChangeNotifierProxyProvider<AuthProvider, SettingsProvider>(...),

  ],

  child: App(),

)

```

### AuthProvider

- `User? currentUser` - Firebase user

- `bool isLoading` - Auth state loading

- `bool isAuthenticated` - Derived getter

- `Future<void> signInWithEmail(...)`

- `Future<void> signUpWithEmail(...)`

- `Future<void> signInWithGoogle()`

- `Future<void> logout()`

### UserProvider

- `UserProfile? profile` - Current user profile

- `bool isLoading` - Profile loading state

- `Future<void> loadProfile()`

- `Future<void> updateProfile(...)`

- `Future<void> updateOnlineStatus(bool online)`

### ChatProvider

- `User? matchedUser` - Current chat partner

- `String? chatRoomId` - Current chat room

- `List<Message> messages` - Messages in current chat

- `bool isFinding` - Match search in progress

- `String? error` - Error state

- `bool isRecipientTyping` - Typing indicator state

- `bool userListMode` - Show user list state

- `bool indexingError` - Firestore indexing error

- `Future<void> findRandomMatch()`

- `Future<void> selectUser(User)`

- `Future<void> sendMessage(String)`

- `Future<void> markAsTyping(bool)`

- `void showUserList()`

- `void goBack()`

### SettingsProvider

- `bool notificationsEnabled`

- `bool darkMode`

- `Future<void> toggleNotifications()`

- `Future<void> toggleDarkMode()`

- `void applyTheme()`

---

## 5. Technical Specification

### Required Packages

```yaml

dependencies:

  flutter:

    sdk: flutter

 

  # Firebase

  firebase_core: ^2.24.0

  firebase_auth: ^4.16.0

  cloud_firestore: ^4.14.0

 

  # State Management

  provider: ^6.1.1

 

  # Navigation

  go_router: ^13.2.0

 

  # UI Components

  cupertino_icons: ^1.0.6

  cached_network_image: ^3.3.1

  shimmer: ^3.0.0

 

  # Image Picker

  image_picker: ^1.0.7

 

  # Utils

  intl: ^0.19.0

  shared_preferences: ^2.2.2

  google_sign_in: ^6.2.1

```

### Data Models

```dart

class UserProfile {

  final String uid;

  final String? name;

  final String? email;

  final String? photoURL;

  final String? username;

  final int? age;

  final String? gender;

  final String? bio;

  final List<String>? interests;

  final DateTime? createdAt;

  final DateTime? lastActive;

  final String status; // 'online' | 'offline'

  final bool notificationsEnabled;

  final bool darkModeEnabled;

}

 

class Message {

  final String? id;

  final String chatRoomId;

  final String senderId;

  final String message;

  final DateTime timestamp;

  final MessageStatus status; // 'sending' | 'sent' | 'delivered' | 'read'

  final List<String>? deletedForUsers;

  final bool? deletedForEveryone;

  final DateTime? deletedAt;

}

 

enum MessageStatus { sending, sent, delivered, read }

```

### Firebase Configuration

#### Firestore Collections

```

users/{uid}           - User profiles

chats/{chatRoomId}/

  └── messages/{msgId} - Messages per chat room

```

#### Firestore Indexes

Create composite indexes for:

- `messages`: (chatRoomId ASC, timestamp ASC)

- `users`: (status ASC, lastActive DESC)

#### Security Rules

```javascript

// Reuse existing rules from web app

rules_version = '2';

service cloud.firestore {

  match /databases/{database}/documents {

    // User can read/write own document

    match /users/{userId} {

      allow read: if request.auth != null;

      allow write: if request.auth.uid == userId;

    }

   

    // Chat room messages

    match /chats/{chatRoomId}/messages/{messageId} {

      allow read, write: if request.auth != null

        && chatRoomId.hasAny([request.auth.uid]);

    }

  }

}

```

### Project Structure

```

lib/

├── main.dart                     # App entry point

├── app.dart                      # MaterialApp configuration

│

├── core/

│   ├── constants/

│   │   ├── app_colors.dart       # Color constants

│   │   ├── app_strings.dart      # String constants

│   │   └── app_spacing.dart      # Spacing constants

│   ├── theme/

│   │   ├── app_theme.dart        # Light/Dark themes

│   │   └── text_styles.dart       # Text styles

│   └── utils/

│       ├── date_utils.dart       # Date formatting

│       └── validators.dart       # Form validation

│

├── data/

│   ├── models/

│   │   ├── user_model.dart

│   │   ├── message_model.dart

│   │   └── chat_room_model.dart

│   ├── repositories/

│   │   ├── auth_repository.dart

│   │   ├── user_repository.dart

│   │   └── chat_repository.dart

│   └── services/

│       └── firebase_service.dart

│

├── presentation/

│   ├── providers/

│   │   ├── auth_provider.dart

│   │   ├── user_provider.dart

│   │   ├── chat_provider.dart

│   │   └── settings_provider.dart

│   │

│   ├── screens/

│   │   ├── splash_screen.dart

│   │   ├── auth/

│   │   │   └── auth_screen.dart

│   │   ├── chat/

│   │   │   ├── chat_home_screen.dart

│   │   │   └── widgets/

│   │   │       ├── empty_state.dart

│   │   │       ├── finding_match.dart

│   │   │       ├── error_state.dart

│   │   │       ├── user_list.dart

│   │   │       ├── user_card.dart

│   │   │       ├── chat_content.dart

│   │   │       ├── message_list.dart

│   │   │       ├── message_bubble.dart

│   │   │       ├── message_input.dart

│   │   │       ├── typing_indicator.dart

│   │   │       ├── date_header.dart

│   │   │       └── message_status.dart

│   │   ├── profile/

│   │   │   ├── profile_screen.dart

│   │   │   └── widgets/

│   │   │       ├── profile_view.dart

│   │   │       └── profile_edit_sheet.dart

│   │   └── settings/

│   │       ├── settings_screen.dart

│   │       └── widgets/

│   │           ├── settings_toggle.dart

│   │           └── logout_dialog.dart

│   │

│   └── widgets/

│       ├── app_button.dart

│       ├── app_text_field.dart

│       ├── app_card.dart

│       ├── avatar_widget.dart

│       ├── loading_indicator.dart

│       └── glass_card.dart

│

└── router/

    └── app_router.dart

```

### Assets Structure

```

assets/

├── images/

│   ├── pookie.gif              # App logo/header

│   ├── Start Chatting.png      # Empty state icon

│   ├── shuffle.png             # Random match icon

│   ├── user.png                # Profile icon

│   ├── user 2.o.png            # Profile active icon

│   ├── messages.png            # Chat icon

│   ├── settings.png            # Settings icon

│   ├── setting 2.o.png         # Settings active icon

│   ├── Logout.png              # Logout icon

│   ├── notification-bell.png   # Notifications icon

│   └── dark-mode.png           # Dark mode icon

└── fonts/

    └── (System fonts - no custom fonts needed)

```

### Platform Configuration

#### Android (android/app/build.gradle)

```gradle

android {

    defaultConfig {

        minSdkVersion 21

        targetSdkVersion 34

    }

}

 

dependencies {

    implementation platform('com.google.firebase:firebase-bom:xxx')

    implementation 'com.google.firebase:firebase-analytics'

    implementation 'com.google.firebase:firebase-auth'

    implementation 'com.google.firebase:firebase-firestore'

}

```

#### iOS (ios/Runner/Info.plist)

```xml

<key>NSCameraUsageDescription</key>

<string>Camera access is needed to take profile photos</string>

<key>NSPhotoLibraryUsageDescription</key>

<string>Photo library access is needed to select profile photos</string>

```

#### Google Sign-In (ios/Runner/Info.plist)

```xml

<key>CFBundleURLTypes</key>

<array>

    <dict>

        <key>CFBundleURLSchemes</key>

        <array>

            <string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>

        </array>

    </dict>

</array>

```

---

## 6. Screen Layouts (ASCII Wireframes)

### Chat Home Screen - Empty State

```

┌────────────────────────────────────────┐

│  [Logo]  Pookie's Banter Zone  [AV▼]  │

├────────────────────────────────────────┤

│                                         │

│                                         │

│              [Icon 64]                 │

│           Start Chatting               │

│                                         │

│   Connect with someone new or choose   │

│   from available users to start a      │

│   conversation.                        │

│                                         │

│  ┌─────────────────────────────────┐  │

│  │      Find Random Match          │  │

│  └─────────────────────────────────┘  │

│                                         │

│  ┌─────────────────────────────────┐  │

│  │        View All Users           │  │

│  └─────────────────────────────────┘  │

│                                         │

│                                         │

├────────────────────────────────────────┤

│          [💬]  [👤]  [⚙️]              │

│         Chat  Profile  Settings        │

└────────────────────────────────────────┘

```

### Chat Home Screen - Active Chat

```

┌────────────────────────────────────────┐

│  [Logo]  Pookie's Banter Zone  [AV▼]  │

├────────────────────────────────────────┤

│                                         │

│  ┌─────────────────────────────────┐  │

│  │ [AV●] John Doe                  │  │

│  │      @johndoe                   │  │

│  │      Online ●         [New Chat]│  │

│  └─────────────────────────────────┘  │

│                                         │

│  ┌─────────────────────────────────┐  │

│  │                                 │  │

│  │        Received message         │  │

│  │        bubble here              │  │

│  │  10:30 AM                      │  │

│  │                                 │  │

│  │                    Sent bubble │  │

│  │                    here ✓✓     │  │

│  │                    10:31 AM   │  │

│  │                                 │  │

│  │  ● ● ● John is typing...       │  │

│  │                                 │  │

│  └─────────────────────────────────┘  │

│                                         │

│  ┌─────────────────────────────────┐  │

│  │  Type a message...         [➤] │  │

│  └─────────────────────────────────┘  │

│                                         │

├────────────────────────────────────────┤

│          [💬]  [👤]  [⚙️]              │

│         Chat  Profile  Settings        │

└────────────────────────────────────────┘

```

### Profile Screen

```

┌────────────────────────────────────────┐

│  [←Back]            Profile            │

├────────────────────────────────────────┤

│                                         │

│            ┌─────────┐                 │

│            │         │                  │

│            │   AV    │                  │

│            │         │                  │

│            └─────────┘                  │

│           John Doe                      │

│         john@email.com                  │

│                                         │

│  ┌─────────┐  ┌────────────────┐       │

│  │ Age: 25 │  │ Male           │       │

│  └─────────┘  └────────────────┘       │

│                                         │

│  ┌─────────────────────────────────┐  │

│  │ Bio                             │  │

│  │ Software developer who loves    │  │

│  │ coding and technology.         │  │

│  └─────────────────────────────────┘  │

│                                         │

│  Interests                             │

│  ┌──────┐ ┌──────┐ ┌───────┐         │

│  │Coding│ │Music │ │Travel │         │

│  └──────┘ └──────┘ └───────┘         │

│                                         │

│                      ┌───────────────┐│

│                      │ ✏️ Edit Profile││

│                      └───────────────┘│

│                                         │

├────────────────────────────────────────┤

│          [💬]  [👤]  [⚙️]              │

│         Chat  Profile  Settings        │

└────────────────────────────────────────┘

```

### Settings Screen

```

┌────────────────────────────────────────┐

│  [←Back]            Settings            │

├────────────────────────────────────────┤

│                                         │

│  ┌─────────────────────────────────┐  │

│  │ 🔔  Notifications               │  │

│  │    Receive app notifications    │  │

│  │                          [●──] │  │

│  └─────────────────────────────────┘  │

│                                         │

│  ┌─────────────────────────────────┐  │

│  │ 🌙  Dark Mode                   │  │

│  │    Toggle dark mode on/off      │  │

│  │                          [──●] │  │

│  └─────────────────────────────────┘  │

│                                         │

│  ┌─────────────────────────────────┐  │

│  │ 🌐  Language                    │  │

│  │    English                       │  │

│  └─────────────────────────────────┘  │

│                                         │

│                                         │

│  ┌─────────────────────────────────┐  │

│  │       🔴 Log Out                │  │

│  └─────────────────────────────────┘  │

│                                         │

├────────────────────────────────────────┤

│          [💬]  [👤]  [⚙️]              │

│         Chat  Profile  Settings        │

└────────────────────────────────────────┘

```

---

## 7. Animations & Transitions

| Interaction | Animation | Duration | Curve |

|-------------|-----------|----------|-------|

| Page navigation | Slide + Fade | 300ms | easeInOut |

| Button press | Scale to 0.95 | 100ms | easeOut |

| Button release | Scale to 1.0 | 100ms | easeOut |

| Loading spinner | Rotate | Continuous | linear |

| Typing indicator | Bounce dots | 600ms | easeInOut |

| Message appear | Fade + Slide up | 200ms | easeOut |

| Message delete | Fade out | 200ms | easeOut |

| Card press | Ripple effect | 200ms | - |

| Theme toggle | Cross-fade colors | 300ms | easeInOut |

| Pull to refresh | Material refresh | - | - |

| Dialog appear | Scale + Fade | 250ms | easeOut |

| Bottom sheet | Slide up | 300ms | easeOut |

| Tab switch | Cross-fade | 200ms | easeInOut |

---

## 8. Error Handling

### Toast Notifications

| Error | Message | Type |

|-------|---------|------|

| Login failed | "Login failed. Please check your credentials." | Error |

| Registration failed | "Registration failed. Please try again." | Error |

| Google sign-in failed | "Google sign-in failed. Please try again." | Error |

| Message send failed | "Failed to send message. Tap to retry." | Error |

| Profile update failed | "Failed to update profile. Please try again." | Error |

| Network error | "No internet connection. Please check your network." | Warning |

| Logout success | "Logged out successfully." | Success |

### Loading States

- Full screen loading for initial auth check

- Inline loading for buttons (spinner inside button)

- Skeleton/shimmer loading for lists

### Empty States

| State | Message | Action |

|-------|---------|--------|

| No users available | "No users found matching your search" | None |

| No messages | "Say hello to start the conversation!" | None |

| No profile | "Complete your profile to help others find you" | Edit button |

---

## 9. Testing Requirements

### Unit Tests

- AuthRepository methods

- UserRepository methods

- ChatRepository methods

- Date/time formatting utilities

- Form validators

### Widget Tests

- AuthScreen (login/register tabs)

- ChatHomeScreen (all states)

- ProfileScreen (view/edit)

- SettingsScreen (toggles)

- MessageBubble component

- UserCard component

### Integration Tests

- Complete login flow

- Complete registration flow

- Send message flow

- Profile update flow

- Theme toggle flow

---

## 10. Deployment Notes

### Android

1. Build: `flutter build apk --release`

2. Sign with release key

3. Upload to Google Play Store

### iOS

1. Build: `flutter build ios --release`

2. Open in Xcode for signing

3. Submit to App Store Connect

### Firebase Setup

- Ensure same Firebase project is used

- Download and add `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)

- Enable required auth providers in Firebase Console

---

## Summary Checklist

### Must Have (MVP)

- [ ] Email/password authentication

- [ ] Google sign-in

- [ ] User profile view and edit

- [ ] Chat with random match

- [ ] Chat with selected user

- [ ] Send/receive messages

- [ ] Message status (sent/delivered/read)

- [ ] Typing indicator

- [ ] Delete message for me

- [ ] Light/dark theme toggle

- [ ] Logout

### Nice to Have

- [ ] Push notifications

- [ ] Profile photo upload

- [ ] Interest-based matching

- [ ] Message search

- [ ] Read receipts customization

- [ ] Language selection

---

> **Created**: 2026-05-05

> **Source Project**: pookies-banter-zone (React/Web)

> **Target Platform**: Flutter (iOS & Android)
