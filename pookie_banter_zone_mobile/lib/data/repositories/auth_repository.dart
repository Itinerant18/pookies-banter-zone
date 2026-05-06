import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import '../services/firebase_service.dart';
import 'user_repository.dart';

class AuthRepository {
  final FirebaseAuth _auth = FirebaseService.auth;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final UserRepository _userRepository = UserRepository();

  Stream<User?> get authStateChanges => _auth.authStateChanges();

  User? get currentUser => _auth.currentUser;

  Future<User?> signInWithEmail(String email, String password) async {
    final result = await _auth.signInWithEmailAndPassword(
      email: email,
      password: password,
    );
    if (result.user != null) {
      await _userRepository.updateOnlineStatus(result.user!.uid, true);
    }
    return result.user;
  }

  Future<User?> signUpWithEmail(String name, String email, String password) async {
    final result = await _auth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );
    if (result.user != null) {
      await result.user!.updateDisplayName(name);
      await _userRepository.createUserProfile(
        uid: result.user!.uid,
        name: name,
        email: email,
        photoURL: result.user!.photoURL,
      );
    }
    return result.user;
  }

  Future<User?> signInWithGoogle() async {
    try {
      UserCredential result;
      if (kIsWeb) {
        final googleProvider = GoogleAuthProvider();
        result = await _auth.signInWithPopup(googleProvider);
      } else {
        final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
        if (googleUser == null) return null;

        final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

        final credential = GoogleAuthProvider.credential(
          accessToken: googleAuth.accessToken,
          idToken: googleAuth.idToken,
        );

        result = await _auth.signInWithCredential(credential);
      }

      if (result.user != null) {
        final exists = await _userRepository.userExists(result.user!.uid);
        if (!exists) {
          await _userRepository.createUserProfile(
            uid: result.user!.uid,
            name: result.user!.displayName ?? 'User',
            email: result.user!.email ?? '',
            photoURL: result.user!.photoURL,
          );
        }
        await _userRepository.updateOnlineStatus(result.user!.uid, true);
      }
      return result.user;
    } catch (e) {
      print('Google sign in error: $e');
      rethrow;
    }
  }

  Future<void> logout() async {
    final uid = _auth.currentUser?.uid;
    if (uid != null) {
      await _userRepository.updateOnlineStatus(uid, false);
    }
    await _googleSignIn.signOut();
    await _auth.signOut();
  }

  Future<void> setPersistence(bool rememberMe) async {
    // In Flutter Firebase Auth, persistence is handled automatically.
    // For web-specific persistence, we'd need platform checks.
    // This is a no-op for mobile but kept for API compatibility.
  }
}
