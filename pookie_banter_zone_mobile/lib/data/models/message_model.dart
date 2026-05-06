import 'package:cloud_firestore/cloud_firestore.dart';

enum MessageStatus { sending, sent, delivered, read }

class Message {
  final String? id;
  final String chatRoomId;
  final String senderId;
  final String message;
  final DateTime timestamp;
  final MessageStatus status;
  final List<String>? deletedForUsers;
  final bool? deletedForEveryone;
  final DateTime? deletedAt;

  Message({
    this.id,
    required this.chatRoomId,
    required this.senderId,
    required this.message,
    required this.timestamp,
    this.status = MessageStatus.sending,
    this.deletedForUsers,
    this.deletedForEveryone,
    this.deletedAt,
  });

  factory Message.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return Message(
      id: doc.id,
      chatRoomId: data['chatRoomId'] as String? ?? '',
      senderId: data['senderId'] as String? ?? '',
      message: data['message'] as String? ?? '',
      timestamp: data['timestamp'] != null
          ? (data['timestamp'] as Timestamp).toDate()
          : DateTime.now(),
      status: _parseStatus(data['status'] as String? ?? 'sent'),
      deletedForUsers: data['deletedForUsers'] != null
          ? List<String>.from(data['deletedForUsers'] as List)
          : null,
      deletedForEveryone: data['deletedForEveryone'] as bool?,
      deletedAt: data['deletedAt'] != null
          ? (data['deletedAt'] as Timestamp).toDate()
          : null,
    );
  }

  static MessageStatus _parseStatus(String status) {
    switch (status) {
      case 'sending':
        return MessageStatus.sending;
      case 'sent':
        return MessageStatus.sent;
      case 'delivered':
        return MessageStatus.delivered;
      case 'read':
        return MessageStatus.read;
      default:
        return MessageStatus.sent;
    }
  }

  static String statusToString(MessageStatus status) {
    switch (status) {
      case MessageStatus.sending:
        return 'sending';
      case MessageStatus.sent:
        return 'sent';
      case MessageStatus.delivered:
        return 'delivered';
      case MessageStatus.read:
        return 'read';
    }
  }

  Map<String, dynamic> toFirestore() {
    return {
      'chatRoomId': chatRoomId,
      'senderId': senderId,
      'message': message,
      'timestamp': Timestamp.fromDate(timestamp),
      'status': statusToString(status),
      if (deletedForUsers != null) 'deletedForUsers': deletedForUsers,
      if (deletedForEveryone != null) 'deletedForEveryone': deletedForEveryone,
      if (deletedAt != null) 'deletedAt': Timestamp.fromDate(deletedAt!),
    };
  }

  Message copyWith({
    String? id,
    String? chatRoomId,
    String? senderId,
    String? message,
    DateTime? timestamp,
    MessageStatus? status,
    List<String>? deletedForUsers,
    bool? deletedForEveryone,
    DateTime? deletedAt,
  }) {
    return Message(
      id: id ?? this.id,
      chatRoomId: chatRoomId ?? this.chatRoomId,
      senderId: senderId ?? this.senderId,
      message: message ?? this.message,
      timestamp: timestamp ?? this.timestamp,
      status: status ?? this.status,
      deletedForUsers: deletedForUsers ?? this.deletedForUsers,
      deletedForEveryone: deletedForEveryone ?? this.deletedForEveryone,
      deletedAt: deletedAt ?? this.deletedAt,
    );
  }

  bool isDeletedForUser(String userId) {
    return deletedForUsers?.contains(userId) ?? false;
  }

  bool get isDeletedForAll => deletedForEveryone ?? false;
}
