import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/message_model.dart';
import '../models/user_model.dart';
import '../services/firebase_service.dart';

class ChatRepository {
  final FirebaseFirestore _firestore = FirebaseService.firestore;

  CollectionReference<Map<String, dynamic>> get _chatRoomsCollection =>
      _firestore.collection('chats');

  String generateChatRoomId(String uid1, String uid2) {
    final sorted = [uid1, uid2]..sort();
    return sorted.join('_');
  }

  Future<UserProfile?> findRandomMatch(String currentUid) async {
    final snapshot = await _firestore
        .collection('users')
        .where('status', isEqualTo: 'online')
        .where(FieldPath.documentId, isNotEqualTo: currentUid)
        .orderBy(FieldPath.documentId)
        .orderBy('lastActive', descending: true)
        .limit(50)
        .get();

    final users = snapshot.docs
        .map((doc) => UserProfile.fromFirestore(doc))
        .where((u) => u.uid != currentUid)
        .toList();

    if (users.isEmpty) return null;
    users.shuffle();
    return users.first;
  }

  Future<void> sendMessage(Message message) async {
    final chatRoomRef = _chatRoomsCollection.doc(message.chatRoomId);
    final messagesRef = chatRoomRef.collection('messages');

    await _firestore.runTransaction((transaction) async {
      transaction.set(messagesRef.doc(), message.toFirestore());
      transaction.update(chatRoomRef, {
        'lastMessageTime': Timestamp.fromDate(message.timestamp),
        'lastMessageText': message.message,
      });
    });
  }

  Stream<List<Message>> getMessagesStream(String chatRoomId, {String? currentUserId}) {
    return _chatRoomsCollection
        .doc(chatRoomId)
        .collection('messages')
        .orderBy('timestamp', descending: false)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => Message.fromFirestore(doc))
          .where((msg) {
            if (currentUserId == null) return true;
            if (msg.isDeletedForAll) return false;
            if (msg.isDeletedForUser(currentUserId)) return false;
            return true;
          })
          .toList();
    });
  }

  Future<void> markMessagesAsRead(String chatRoomId, String userId) async {
    final unreadMessages = await _chatRoomsCollection
        .doc(chatRoomId)
        .collection('messages')
        .where('senderId', isNotEqualTo: userId)
        .where('status', isEqualTo: 'sent')
        .get();

    final batch = _firestore.batch();
    for (final doc in unreadMessages.docs) {
      batch.update(doc.reference, {'status': 'read'});
    }
    await batch.commit();
  }

  Future<void> updateTypingStatus(String chatRoomId, String userId, bool isTyping) async {
    await _chatRoomsCollection.doc(chatRoomId).set({
      'typingStatus': {userId: isTyping},
    }, SetOptions(merge: true));
  }

  Stream<bool> getTypingStatusStream(String chatRoomId, String otherUserId) {
    return _chatRoomsCollection.doc(chatRoomId).snapshots().map((doc) {
      if (!doc.exists) return false;
      final data = doc.data() ?? {};
      final typingStatus = data['typingStatus'] as Map<String, dynamic>? ?? {};
      return typingStatus[otherUserId] as bool? ?? false;
    });
  }

  Future<void> deleteMessageForMe(String messageId, String chatRoomId, String userId) async {
    final messageRef = _chatRoomsCollection.doc(chatRoomId).collection('messages').doc(messageId);
    await messageRef.update({
      'deletedForUsers': FieldValue.arrayUnion([userId]),
    });
  }

  Future<void> deleteMessageForEveryone(String messageId, String chatRoomId) async {
    final messageRef = _chatRoomsCollection.doc(chatRoomId).collection('messages').doc(messageId);
    await messageRef.update({
      'deletedForEveryone': true,
      'deletedAt': FieldValue.serverTimestamp(),
    });
  }

  Future<void> createChatRoomIfNotExists(String chatRoomId, List<String> participants) async {
    final doc = await _chatRoomsCollection.doc(chatRoomId).get();
    if (!doc.exists) {
      await _chatRoomsCollection.doc(chatRoomId).set({
        'participants': participants,
        'typingStatus': {},
      });
    }
  }
}
