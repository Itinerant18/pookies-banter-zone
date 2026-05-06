import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';
import '../services/firebase_service.dart';

class UserRepository {
  final FirebaseFirestore _firestore = FirebaseService.firestore;

  CollectionReference<Map<String, dynamic>> get _usersCollection =>
      _firestore.collection('users');

  Future<bool> userExists(String uid) async {
    final doc = await _usersCollection.doc(uid).get();
    return doc.exists;
  }

  Future<void> createUserProfile({
    required String uid,
    required String name,
    required String email,
    String? photoURL,
  }) async {
    final username = await _generateUsername(name);
    final userProfile = UserProfile(
      uid: uid,
      name: name,
      email: email,
      photoURL: photoURL,
      username: username,
      createdAt: DateTime.now(),
      lastActive: DateTime.now(),
      status: 'online',
    );
    await _usersCollection.doc(uid).set(userProfile.toFirestore());
  }

  Future<String?> _generateUsername(String displayName) async {
    String baseUsername = displayName.toLowerCase().replaceAll(' ', '_').replaceAll(RegExp(r'[^a-z0-9_]'), '');
    if (baseUsername.isEmpty) baseUsername = 'user';

    String username = baseUsername;
    for (int i = 0; i < 100; i++) {
      if (i > 0) username = '${baseUsername}_$i';
      final query = await _usersCollection.where('username', isEqualTo: username).limit(1).get();
      if (query.docs.isEmpty) return username;
    }
    return null;
  }

  Future<UserProfile?> getUserProfile(String uid) async {
    final doc = await _usersCollection.doc(uid).get();
    if (!doc.exists) return null;
    return UserProfile.fromFirestore(doc);
  }

  Future<void> updateUserProfile(UserProfile profile) async {
    await _usersCollection.doc(profile.uid).update(profile.toFirestore());
  }

  Future<void> updateOnlineStatus(String uid, bool online) async {
    await _usersCollection.doc(uid).update({
      'status': online ? 'online' : 'offline',
      'lastActive': FieldValue.serverTimestamp(),
    });
  }

  Stream<UserProfile?> userProfileStream(String uid) {
    return _usersCollection.doc(uid).snapshots().map((doc) {
      if (!doc.exists) return null;
      return UserProfile.fromFirestore(doc);
    });
  }

  Stream<List<UserProfile>> getAllUsersStream({String? excludeUid}) {
    Query<Map<String, dynamic>> query = _usersCollection;
    if (excludeUid != null) {
      query = query.where(FieldPath.documentId, isNotEqualTo: excludeUid);
    }
    return query.orderBy('lastActive', descending: true).snapshots().map((snapshot) {
      return snapshot.docs.map((doc) => UserProfile.fromFirestore(doc)).toList();
    });
  }

  Future<List<UserProfile>> searchUsers(String query, {String? excludeUid}) async {
    final snapshot = await _usersCollection.get();
    return snapshot.docs
        .where((doc) => doc.id != excludeUid)
        .map((doc) => UserProfile.fromFirestore(doc))
        .where((user) {
          final lowerQuery = query.toLowerCase();
          return (user.name?.toLowerCase().contains(lowerQuery) ?? false) ||
                 (user.username?.toLowerCase().contains(lowerQuery) ?? false);
        })
        .toList();
  }
}
