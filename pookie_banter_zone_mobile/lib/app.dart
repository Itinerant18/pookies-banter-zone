import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'presentation/providers/auth_provider.dart';
import 'presentation/providers/chat_provider.dart';
import 'presentation/providers/settings_provider.dart';
import 'presentation/providers/user_provider.dart';
import 'router/app_router.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => SettingsProvider()),
        ChangeNotifierProxyProvider<AuthProvider, UserProvider>(
          create: (_) => UserProvider(),
          update: (_, authProvider, userProvider) {
            userProvider ??= UserProvider();
            userProvider.update(authProvider);
            return userProvider;
          },
        ),
        ChangeNotifierProxyProvider<AuthProvider, ChatProvider>(
          create: (_) => ChatProvider(),
          update: (_, authProvider, chatProvider) {
            chatProvider ??= ChatProvider();
            chatProvider.update(authProvider);
            return chatProvider;
          },
        ),
      ],
      child: Consumer<SettingsProvider>(
        builder: (context, settingsProvider, child) {
          return MaterialApp.router(
            title: "Pookie's Banter Zone",
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: settingsProvider.themeMode,
            routerConfig: AppRouter.router,
          );
        },
      ),
    );
  }
}
