class AppStrings {
  static const String appName = "Pookie's Banter Zone";

  // Auth
  static const String login = 'Sign In';
  static const String register = 'Create Account';
  static const String email = 'Email';
  static const String password = 'Password';
  static const String name = 'Name';
  static const String rememberMe = 'Remember Me';
  static const String googleSignIn = 'Continue with Google';
  static const String forgotPassword = 'Forgot Password?';
  static const String noAccount = "Don't have an account?";
  static const String haveAccount = 'Already have an account?';

  // Validation
  static const String emailInvalid = 'Please enter a valid email';
  static const String passwordMinLength = 'Password must be at least 6 characters';
  static const String nameMinLength = 'Name must be at least 2 characters';

  // Chat
  static const String findRandomMatch = 'Find Random Match';
  static const String viewAllUsers = 'View All Users';
  static const String startChatting = 'Start Chatting';
  static const String emptyStateDescription =
      'Connect with someone new or choose from available users to start a conversation.';
  static const String findingMatchTitle = 'Finding someone to chat with...';
  static const String findingMatchSubtitle =
      'This might take a moment. Creating your user profile and searching for available users...';
  static const String findingMatchTips =
      'If this takes longer than expected, please check: Your Firebase rules are updated, you\'re properly authenticated, and your database has other users.';
  static const String typeMessage = 'Type a message...';
  static const String newChat = 'New Chat';
  static const String changeUser = 'Change User';
  static const String online = 'Online';
  static const String offline = 'Offline';
  static const String typing = 'is typing...';
  static const String noMessages = 'Say hello to start the conversation!';
  static const String noUsersFound = 'No users found matching your search';

  // Profile
  static const String profile = 'Profile';
  static const String editProfile = 'Edit Profile';
  static const String age = 'Age';
  static const String gender = 'Gender';
  static const String bio = 'Bio';
  static const String bioHint = 'Tell us about yourself...';
  static const String interests = 'Interests';
  static const String addInterest = 'Add interest...';
  static const String save = 'Save';
  static const String cancel = 'Cancel';
  static const String bioMaxLength = '150';

  // Gender options
  static const String male = 'Male';
  static const String female = 'Female';
  static const String nonBinary = 'Non-binary';
  static const String other = 'Other';
  static const String preferNotToSay = 'Prefer not to say';

  // Settings
  static const String settings = 'Settings';
  static const String notifications = 'Notifications';
  static const String notificationsDescription = 'Receive app notifications';
  static const String darkMode = 'Dark Mode';
  static const String darkModeDescription = 'Toggle dark mode on/off';
  static const String language = 'Language';
  static const String languageValue = 'English';
  static const String logout = 'Log Out';
  static const String logoutConfirmTitle = 'Are you sure you want to log out?';
  static const String logoutConfirmDescription =
      'You will need to sign in again to access your account.';
  static const String logoutSuccess = 'Logged out successfully.';

  // Errors
  static const String loginFailed = 'Login failed. Please check your credentials.';
  static const String registrationFailed = 'Registration failed. Please try again.';
  static const String googleSignInFailed = 'Google sign-in failed. Please try again.';
  static const String sendMessageFailed = 'Failed to send message. Tap to retry.';
  static const String profileUpdateFailed = 'Failed to update profile. Please try again.';
  static const String networkError = 'No internet connection. Please check your network.';

  // Deleted message
  static const String deletedMessage = 'This message was deleted';
}
