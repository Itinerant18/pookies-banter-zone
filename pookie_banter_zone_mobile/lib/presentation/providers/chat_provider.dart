import 'dart:async';

import 'package:flutter/material.dart';
import '../../data/models/message_model.dart';
import '../../data/models/user_model.dart';
import '../../data/repositories/chat_repository.dart';
import '../../data/repositories/user_repository.dart';
import 'auth_provider.dart';

class ChatProvider extends ChangeNotifier {
  final ChatRepository _chatRepository = ChatRepository();
  final UserRepository _userRepository = UserRepository();

  AuthProvider? _authProvider;

  UserProfile? _matchedUser;
  String? _chatRoomId;
  List<Message> _messages = [];
  bool _isFinding = false;
  String? _error;
  bool _isRecipientTyping = false;
  bool _userListMode = false;
  List<UserProfile> _allUsers = [];
  StreamSubscription<List<Message>>? _messagesSubscription;
  StreamSubscription<bool>? _typingSubscription;

  UserProfile? get matchedUser => _matchedUser;
  String? get chatRoomId => _chatRoomId;
  List<Message> get messages => _messages;
  bool get isFinding => _isFinding;
  String? get error => _error;
  bool get isRecipientTyping => _isRecipientTyping;
  bool get userListMode => _userListMode;
  List<UserProfile> get allUsers => _allUsers;
  bool get hasActiveChat => _matchedUser != null && _chatRoomId != null;

  void update(AuthProvider authProvider) {
    _authProvider = authProvider;
    if (authProvider.currentUser != null) {
      _loadAllUsers(authProvider.currentUser!.uid);
    }
  }

  @override
  void dispose() {
    _messagesSubscription?.cancel();
    _typingSubscription?.cancel();
    super.dispose();
  }

  void _loadAllUsers(String currentUid) {
    _userRepository.getAllUsersStream(excludeUid: currentUid).listen((users) {
      _allUsers = users;
      notifyListeners();
    });
  }

  Future<void> findRandomMatch() async {
    final currentUser = _authProvider?.currentUser;
    if (currentUser == null) return;

    _isFinding = true;
    _error = null;
    _userListMode = false;
    notifyListeners();

    try {
      final match = await _chatRepository.findRandomMatch(currentUser.uid);
      if (match != null) {
        await selectUser(match);
      } else {
        _error = 'No users available';
        _isFinding = false;
        notifyListeners();
      }
    } catch (e) {
      _error = 'Failed to find a match. Please try again.';
      _isFinding = false;
      notifyListeners();
    }
  }

  Future<void> selectUser(UserProfile user) async {
    final currentUser = _authProvider?.currentUser;
    if (currentUser == null) return;

    _isFinding = true;
    _error = null;
    notifyListeners();

    try {
      _chatRoomId = _chatRepository.generateChatRoomId(currentUser.uid, user.uid);
      await _chatRepository.createChatRoomIfNotExists(_chatRoomId!, [currentUser.uid, user.uid]);
      _matchedUser = user;
      _isFinding = false;
      _userListMode = false;
      _listenToMessages();
      _listenToTyping();
      notifyListeners();
    } catch (e) {
      _error = 'Failed to start chat. Please try again.';
      _isFinding = false;
      notifyListeners();
    }
  }

  void _listenToMessages() {
    _messagesSubscription?.cancel();
    if (_chatRoomId == null || _authProvider?.currentUser == null) return;

    _messagesSubscription = _chatRepository
        .getMessagesStream(_chatRoomId!, currentUserId: _authProvider!.currentUser!.uid)
        .listen((messages) {
      _messages = messages;
      notifyListeners();
    });
  }

  void _listenToTyping() {
    _typingSubscription?.cancel();
    if (_chatRoomId == null || _matchedUser == null) return;

    _typingSubscription = _chatRepository
        .getTypingStatusStream(_chatRoomId!, _matchedUser!.uid)
        .listen((isTyping) {
      _isRecipientTyping = isTyping;
      notifyListeners();
    });
  }

  Future<bool> sendMessage(String text) async {
    final currentUser = _authProvider?.currentUser;
    if (currentUser == null || _chatRoomId == null) return false;

    try {
      final message = Message(
        chatRoomId: _chatRoomId!,
        senderId: currentUser.uid,
        message: text,
        timestamp: DateTime.now(),
        status: MessageStatus.sending,
      );
      await _chatRepository.sendMessage(message);
      return true;
    } catch (e) {
      _error = 'Failed to send message. Tap to retry.';
      notifyListeners();
      return false;
    }
  }

  Future<void> markAsTyping(bool isTyping) async {
    final currentUser = _authProvider?.currentUser;
    if (currentUser == null || _chatRoomId == null) return;

    try {
      await _chatRepository.updateTypingStatus(_chatRoomId!, currentUser.uid, isTyping);
    } catch (_) {}
  }

  Future<void> deleteMessageForMe(String messageId) async {
    final currentUser = _authProvider?.currentUser;
    if (currentUser == null || _chatRoomId == null) return;

    try {
      await _chatRepository.deleteMessageForMe(messageId, _chatRoomId!, currentUser.uid);
    } catch (e) {
      _error = 'Failed to delete message.';
      notifyListeners();
    }
  }

  Future<void> deleteMessageForEveryone(String messageId) async {
    if (_chatRoomId == null) return;

    try {
      await _chatRepository.deleteMessageForEveryone(messageId, _chatRoomId!);
    } catch (e) {
      _error = 'Failed to delete message.';
      notifyListeners();
    }
  }

  void showUserList() {
    _userListMode = true;
    _error = null;
    notifyListeners();
  }

  void goBack() {
    if (_userListMode) {
      _userListMode = false;
      if (_matchedUser != null) {
        // Return to active chat
      }
    } else if (_matchedUser != null) {
      _matchedUser = null;
      _chatRoomId = null;
      _messages = [];
      _messagesSubscription?.cancel();
      _typingSubscription?.cancel();
      _isRecipientTyping = false;
    }
    _error = null;
    notifyListeners();
  }

  Future<void> searchUsers(String query) async {
    final currentUser = _authProvider?.currentUser;
    if (currentUser == null) return;

    try {
      final users = await _userRepository.searchUsers(query, excludeUid: currentUser.uid);
      _allUsers = users;
      notifyListeners();
    } catch (e) {
      _error = 'Failed to search users.';
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
