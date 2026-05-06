import 'package:flutter/material.dart';
import '../../../../core/utils/date_utils.dart';
import '../../../../data/models/message_model.dart';
import 'date_header.dart';
import 'message_bubble.dart';

class MessageList extends StatelessWidget {
  final List<Message> messages;
  final String currentUserId;
  final Function(Message) onDeleteForMe;
  final Function(Message) onDeleteForEveryone;

  const MessageList({
    super.key,
    required this.messages,
    required this.currentUserId,
    required this.onDeleteForMe,
    required this.onDeleteForEveryone,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      reverse: true,
      padding: const EdgeInsets.only(bottom: 8),
      itemCount: messages.length,
      itemBuilder: (context, index) {
        final message = messages[messages.length - 1 - index];
        final isMe = message.senderId == currentUserId;
        final previousMessage = index < messages.length - 1
            ? messages[messages.length - 2 - index]
            : null;

        final showDateHeader = AppDateUtils.shouldShowDateHeader(
          message.timestamp,
          previousMessage?.timestamp,
        );

        return Column(
          children: [
            if (showDateHeader) DateHeader(date: message.timestamp),
            MessageBubble(
              message: message,
              isMe: isMe,
              onLongPress: () => _showMessageOptions(context, message, isMe),
            ),
          ],
        );
      },
    );
  }

  void _showMessageOptions(BuildContext context, Message message, bool isMe) {
    if (message.isDeletedForAll) return;

    showModalBottomSheet(
      context: context,
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.delete_outline),
                title: const Text('Delete for me'),
                onTap: () {
                  Navigator.pop(context);
                  onDeleteForMe(message);
                },
              ),
              if (isMe)
                ListTile(
                  leading: const Icon(Icons.delete_forever_outlined, color: Colors.red),
                  title: const Text('Delete for everyone', style: TextStyle(color: Colors.red)),
                  onTap: () {
                    Navigator.pop(context);
                    onDeleteForEveryone(message);
                  },
                ),
              ListTile(
                leading: const Icon(Icons.close),
                title: const Text('Cancel'),
                onTap: () => Navigator.pop(context),
              ),
            ],
          ),
        );
      },
    );
  }
}
