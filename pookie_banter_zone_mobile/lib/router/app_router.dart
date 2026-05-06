import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../presentation/screens/auth/auth_screen.dart';
import '../presentation/screens/chat/chat_home_screen.dart';
import '../presentation/screens/profile/profile_screen.dart';
import '../presentation/screens/settings/settings_screen.dart';
import '../presentation/screens/splash_screen.dart';

class AppRouter {
  static final _rootNavigatorKey = GlobalKey<NavigatorState>();
  static final _shellNavigatorKey = GlobalKey<NavigatorState>();

  static GoRouter get router => GoRouter(
        navigatorKey: _rootNavigatorKey,
        initialLocation: '/',
        routes: [
          GoRoute(
            path: '/',
            builder: (context, state) => const SplashScreen(),
          ),
          GoRoute(
            path: '/auth',
            builder: (context, state) => const AuthScreen(),
          ),
          ShellRoute(
            navigatorKey: _shellNavigatorKey,
            builder: (context, state, child) => MainShell(child: child),
            routes: [
              GoRoute(
                path: '/chat',
                builder: (context, state) => const ChatHomeScreen(),
              ),
              GoRoute(
                path: '/profile',
                builder: (context, state) => const ProfileScreen(),
              ),
              GoRoute(
                path: '/settings',
                builder: (context, state) => const SettingsScreen(),
              ),
            ],
          ),
        ],
      );
}

class MainShell extends StatefulWidget {
  final Widget child;

  const MainShell({super.key, required this.child});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _getCurrentIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    switch (location) {
      case '/chat':
        return 0;
      case '/profile':
        return 1;
      case '/settings':
        return 2;
      default:
        return 0;
    }
  }

  void _onItemTapped(int index) {
    switch (index) {
      case 0:
        context.go('/chat');
        break;
      case 1:
        context.go('/profile');
        break;
      case 2:
        context.go('/settings');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _getCurrentIndex(context),
        onTap: _onItemTapped,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.chat_bubble_outline),
            activeIcon: Icon(Icons.chat_bubble),
            label: 'Chat',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Profile',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings_outlined),
            activeIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
