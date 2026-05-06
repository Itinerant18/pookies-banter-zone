import 'dart:async';

import 'package:flutter/material.dart';
import '../../data/models/user_model.dart';
import '../../data/repositories/user_repository.dart';
import 'auth_provider.dart';

class UserProvider extends ChangeNotifier {
  final UserRepository _userRepository = UserRepository();
  AuthProvider? _authProvider;

  UserProfile? _profile;
  bool _isLoading = false;
  String? _error;

  UserProfile? get profile => _profile;
  bool get isLoading => _isLoading;
  String? get error => _error;

  StreamSubscription<UserProfile?>? _profileSubscription;

  UserProvider();

  void update(AuthProvider authProvider) {
    if (_authProvider?.currentUser?.uid != authProvider.currentUser?.uid) {
      _authProvider = authProvider;
      _profileSubscription?.cancel();
      if (authProvider.currentUser != null) {
        loadProfile(authProvider.currentUser!.uid);
      } else {
        _profile = null;
        notifyListeners();
      }
    }
  }

  @override
  void dispose() {
    _profileSubscription?.cancel();
    super.dispose();
  }

  Future<void> loadProfile(String uid) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _profileSubscription?.cancel();
      _profileSubscription = _userRepository.userProfileStream(uid).listen((profile) {
        _profile = profile;
        _isLoading = false;
        notifyListeners();
      });
    } catch (e) {
      _error = 'Failed to load profile.';
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> updateProfile(UserProfile updatedProfile) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _userRepository.updateUserProfile(updatedProfile);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Failed to update profile. Please try again.';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> updateOnlineStatus(bool online) async {
    if (_profile != null) {
      await _userRepository.updateOnlineStatus(_profile!.uid, online);
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
