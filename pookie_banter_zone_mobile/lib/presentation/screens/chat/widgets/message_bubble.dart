import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/utils/date_utils.dart';
import '../../../../data/models/message_model.dart';

class MessageBubble extends StatelessWidget {
  final Message message;
  final bool isMe;
  final VoidCallback? onLongPress;

  const MessageBubble({
    super.key,
    required this.message,
    required this.isMe,
    this.onLongPress,
  });

  @override
  Widget build(BuildContext context) {
    if (message.isDeletedForAll) {
      return _buildDeletedBubble();
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: GestureDetector(
        onLongPress: onLongPress,
        child: Container(
          constraints: BoxConstraints(
            maxWidth: MediaQuery.of(context).size.width * AppSpacing.messageMaxWidth,
          ),
          margin: const EdgeInsets.symmetric(
            vertical: AppSpacing.xs,
            horizontal: AppSpacing.md,
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: 12,
            vertical: 8,
          ),
          decoration: BoxDecoration(
            color: isMe
                ? AppColors.cherryBlossomPink
                : isDark
                    ? AppColors.darkOuterSpace
                    : AppColors.timberwolf,
            borderRadius: BorderRadius.only(
              topLeft: const Radius.circular(AppSpacing.messageBubbleRadius),
              topRight: const Radius.circular(AppSpacing.messageBubbleRadius),
              bottomLeft: Radius.circular(isMe ? AppSpacing.messageBubbleRadius : 4),
              bottomRight: Radius.circular(isMe ? 4 : AppSpacing.messageBubbleRadius),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                message.message,
                style: TextStyle(
                  fontSize: 14,
                  height: 1.4,
                  color: isMe ? AppColors.outerSpace : (isDark ? AppColors.timberwolf : AppColors.outerSpace),
                ),
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    AppDateUtils.formatTime(message.timestamp),
                    style: TextStyle(
                      fontSize: 10,
                      color: isMe
                          ? AppColors.outerSpace.withValues(alpha: 0.6)
                          : (isDark
                              ? AppColors.ashGray
                              : AppColors.outerSpace.withValues(alpha: 0.5)),
                    ),
                  ),
                  if (isMe) ...[
                    const SizedBox(width: 4),
                    _buildStatusIcon(message.status),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDeletedBubble() {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 280),
        margin: const EdgeInsets.symmetric(
          vertical: AppSpacing.xs,
          horizontal: AppSpacing.md,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: const Text(
          AppStrings.deletedMessage,
          style: TextStyle(
            fontSize: 14,
            fontStyle: FontStyle.italic,
            color: AppColors.ashGray,
          ),
        ),
      ),
    );
  }

  Widget _buildStatusIcon(MessageStatus status) {
    switch (status) {
      case MessageStatus.sending:
        return Icon(
          Icons.access_time,
          size: 12,
          color: AppColors.outerSpace.withValues(alpha: 0.5),
        );
      case MessageStatus.sent:
        return const Icon(
          Icons.done,
          size: 12,
          color: AppColors.ashGray,
        );
      case MessageStatus.delivered:
        return Icon(
          Icons.done_all,
          size: 12,
          color: AppColors.outerSpace.withValues(alpha: 0.5),
        );
      case MessageStatus.read:
        return const Icon(
          Icons.done_all,
          size: 12,
          color: AppColors.cherryBlossomPink,
        );
    }
  }
}
