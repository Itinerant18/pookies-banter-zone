import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import '../../data/repositories/auth_repository.dart';

class AuthProvider extends ChangeNotifier {
  final AuthRepository _authRepository = AuthRepository();

  User? _currentUser;
  bool _isLoading = false;
  String? _error;

  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _currentUser != null;

  StreamSubscription<User?>? _authStateSubscription;

  AuthProvider() {
    _authStateSubscription = _authRepository.authStateChanges.listen((user) {
      _currentUser = user;
      notifyListeners();
    });
  }

  @override
  void dispose() {
    _authStateSubscription?.cancel();
    super.dispose();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  Future<bool> signInWithEmail(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authRepository.signInWithEmail(email, password);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Login failed. Please check your credentials.';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> signUpWithEmail(String name, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authRepository.signUpWithEmail(name, email, password);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Registration failed. Please try again.';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> signInWithGoogle() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authRepository.signInWithGoogle();
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Google sign-in failed. Please try again.';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _authRepository.logout();
    } catch (e) {
      _error = 'Logout failed. Please try again.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> setPersistence(bool rememberMe) async {
    await _authRepository.setPersistence(rememberMe);
  }
}
