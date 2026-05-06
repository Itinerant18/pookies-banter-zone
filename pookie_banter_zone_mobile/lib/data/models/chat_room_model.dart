import 'package:cloud_firestore/cloud_firestore.dart';

class ChatRoom {
  final String id;
  final List<String> participants;
  final DateTime? lastMessageTime;
  final String? lastMessageText;
  final Map<String, bool>? typingStatus;

  ChatRoom({
    required this.id,
    required this.participants,
    this.lastMessageTime,
    this.lastMessageText,
    this.typingStatus,
  });

  factory ChatRoom.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return ChatRoom(
      id: doc.id,
      participants: data['participants'] != null
          ? List<String>.from(data['participants'] as List)
          : [],
      lastMessageTime: data['lastMessageTime'] != null
          ? (data['lastMessageTime'] as Timestamp).toDate()
          : null,
      lastMessageText: data['lastMessageText'] as String?,
      typingStatus: data['typingStatus'] != null
          ? Map<String, bool>.from(data['typingStatus'] as Map)
          : null,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'participants': participants,
      if (lastMessageTime != null)
        'lastMessageTime': Timestamp.fromDate(lastMessageTime!),
      if (lastMessageText != null) 'lastMessageText': lastMessageText,
      if (typingStatus != null) 'typingStatus': typingStatus,
    };
  }
}
