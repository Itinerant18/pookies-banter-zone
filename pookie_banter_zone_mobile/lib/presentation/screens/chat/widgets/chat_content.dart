import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/auth_provider.dart';
import '../../../providers/chat_provider.dart';
import 'message_list.dart';
import 'message_input.dart';
import 'typing_indicator.dart';
import 'user_card.dart';

class ChatContent extends StatelessWidget {
  const ChatContent({super.key});

  @override
  Widget build(BuildContext context) {
    final chatProvider = context.watch<ChatProvider>();
    final authProvider = context.watch<AuthProvider>();
    final currentUserId = authProvider.currentUser?.uid;

    if (currentUserId == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return Column(
      children: [
        if (chatProvider.matchedUser != null)
          UserCard(
            user: chatProvider.matchedUser!,
            onNewChat: () => chatProvider.goBack(),
          ),
        Expanded(
          child: chatProvider.messages.isEmpty
              ? const Center(
                  child: Text(
                    'Say hello to start the conversation!',
                    style: TextStyle(
                      color: Colors.grey,
                    ),
                  ),
                )
              : MessageList(
                  messages: chatProvider.messages,
                  currentUserId: currentUserId,
                  onDeleteForMe: (message) {
                    if (message.id != null) {
                      chatProvider.deleteMessageForMe(message.id!);
                    }
                  },
                  onDeleteForEveryone: (message) {
                    if (message.id != null) {
                      chatProvider.deleteMessageForEveryone(message.id!);
                    }
                  },
                ),
        ),
        if (chatProvider.isRecipientTyping && chatProvider.matchedUser != null)
          TypingIndicator(userName: chatProvider.matchedUser!.name ?? 'User'),
        MessageInput(
          onSend: (text) => chatProvider.sendMessage(text),
          onTyping: () => chatProvider.markAsTyping(true),
          onStopTyping: () => chatProvider.markAsTyping(false),
        ),
      ],
    );
  }
}
