import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: AppColors.cherryBlossomPink,
        onPrimary: AppColors.outerSpace,
        secondary: AppColors.ashGray,
        onSecondary: AppColors.outerSpace,
        surface: AppColors.champagne,
        onSurface: AppColors.outerSpace,
        error: AppColors.errorRed,
        onError: Colors.white,
      ),
      scaffoldBackgroundColor: AppColors.champagne,
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.champagne,
        foregroundColor: AppColors.outerSpace,
        elevation: 2,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: AppColors.outerSpace,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.champagne,
        selectedItemColor: AppColors.cherryBlossomPink,
        unselectedItemColor: AppColors.outerSpace,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      cardTheme: CardThemeData(
        color: AppColors.timberwolf,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.timberwolf,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.ashGray),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.ashGray),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.cherryBlossomPink, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.cherryBlossomPink,
          foregroundColor: AppColors.outerSpace,
          minimumSize: const Size(double.infinity, 48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.outerSpace,
          minimumSize: const Size(double.infinity, 48),
          side: const BorderSide(color: AppColors.ashGray),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.cherryBlossomPink.withValues(alpha: 0.2),
        labelStyle: const TextStyle(color: AppColors.outerSpace),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.cherryBlossomPink,
        onPrimary: AppColors.outerSpace,
        secondary: AppColors.ashGray,
        onSecondary: AppColors.timberwolf,
        surface: AppColors.outerSpace,
        onSurface: AppColors.timberwolf,
        error: AppColors.errorRed,
        onError: Colors.white,
      ),
      scaffoldBackgroundColor: AppColors.outerSpace,
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.outerSpace,
        foregroundColor: AppColors.timberwolf,
        elevation: 2,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: AppColors.timberwolf,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.outerSpace,
        selectedItemColor: AppColors.cherryBlossomPink,
        unselectedItemColor: AppColors.timberwolf,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      cardTheme: CardThemeData(
        color: AppColors.darkOuterSpace,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.darkOuterSpace,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.ashGray),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.ashGray),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.cherryBlossomPink, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.cherryBlossomPink,
          foregroundColor: AppColors.outerSpace,
          minimumSize: const Size(double.infinity, 48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.timberwolf,
          minimumSize: const Size(double.infinity, 48),
          side: const BorderSide(color: AppColors.ashGray),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.cherryBlossomPink.withValues(alpha: 0.3),
        labelStyle: const TextStyle(color: AppColors.timberwolf),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }
}
