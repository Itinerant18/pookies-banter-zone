import 'package:flutter/material.dart';
import 'package:pookie_banter_zone_mobile/theme/app_theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pookie\'s Banter Zone',
      theme: AppTheme.darkThemeMode,
      home: const Scaffold(
        body: Center(
          child: Text(
            'Pookie\'s Banter Zone',
            style: TextStyle(fontSize: 24),
          ),
        ),
      ),
    );
  }
}
