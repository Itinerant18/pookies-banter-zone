import 'package:cloud_firestore/cloud_firestore.dart';

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
  final String status;
  final bool notificationsEnabled;
  final bool darkModeEnabled;

  UserProfile({
    required this.uid,
    this.name,
    this.email,
    this.photoURL,
    this.username,
    this.age,
    this.gender,
    this.bio,
    this.interests,
    this.createdAt,
    this.lastActive,
    this.status = 'offline',
    this.notificationsEnabled = true,
    this.darkModeEnabled = false,
  });

  factory UserProfile.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return UserProfile(
      uid: doc.id,
      name: data['name'] as String?,
      email: data['email'] as String?,
      photoURL: data['photoURL'] as String?,
      username: data['username'] as String?,
      age: data['age'] as int?,
      gender: data['gender'] as String?,
      bio: data['bio'] as String?,
      interests: data['interests'] != null
          ? List<String>.from(data['interests'] as List)
          : null,
      createdAt: data['createdAt'] != null
          ? (data['createdAt'] as Timestamp).toDate()
          : null,
      lastActive: data['lastActive'] != null
          ? (data['lastActive'] as Timestamp).toDate()
          : null,
      status: data['status'] as String? ?? 'offline',
      notificationsEnabled: data['notificationsEnabled'] as bool? ?? true,
      darkModeEnabled: data['darkModeEnabled'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'uid': uid,
      'name': name,
      'email': email,
      'photoURL': photoURL,
      'username': username,
      'age': age,
      'gender': gender,
      'bio': bio,
      'interests': interests,
      'createdAt': createdAt != null ? Timestamp.fromDate(createdAt!) : FieldValue.serverTimestamp(),
      'lastActive': lastActive != null ? Timestamp.fromDate(lastActive!) : FieldValue.serverTimestamp(),
      'status': status,
      'notificationsEnabled': notificationsEnabled,
      'darkModeEnabled': darkModeEnabled,
    };
  }

  UserProfile copyWith({
    String? uid,
    String? name,
    String? email,
    String? photoURL,
    String? username,
    int? age,
    String? gender,
    String? bio,
    List<String>? interests,
    DateTime? createdAt,
    DateTime? lastActive,
    String? status,
    bool? notificationsEnabled,
    bool? darkModeEnabled,
  }) {
    return UserProfile(
      uid: uid ?? this.uid,
      name: name ?? this.name,
      email: email ?? this.email,
      photoURL: photoURL ?? this.photoURL,
      username: username ?? this.username,
      age: age ?? this.age,
      gender: gender ?? this.gender,
      bio: bio ?? this.bio,
      interests: interests ?? this.interests,
      createdAt: createdAt ?? this.createdAt,
      lastActive: lastActive ?? this.lastActive,
      status: status ?? this.status,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      darkModeEnabled: darkModeEnabled ?? this.darkModeEnabled,
    );
  }
}
