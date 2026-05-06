import 'dart:async';
import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_strings.dart';

class MessageInput extends StatefulWidget {
  final void Function(String) onSend;
  final VoidCallback? onTyping;
  final VoidCallback? onStopTyping;

  const MessageInput({
    super.key,
    required this.onSend,
    this.onTyping,
    this.onStopTyping,
  });

  @override
  State<MessageInput> createState() => _MessageInputState();
}

class _MessageInputState extends State<MessageInput> {
  final _controller = TextEditingController();
  bool _hasText = false;
  Timer? _typingTimer;

  @override
  void dispose() {
    _controller.dispose();
    _typingTimer?.cancel();
    super.dispose();
  }

  void _handleSend() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    widget.onSend(text);
    _controller.clear();
    setState(() => _hasText = false);
    _stopTyping();
  }

  void _onTextChanged(String value) {
    final hasText = value.trim().isNotEmpty;
    if (_hasText != hasText) {
      setState(() => _hasText = hasText);
    }

    if (hasText) {
      widget.onTyping?.call();
      _typingTimer?.cancel();
      _typingTimer = Timer(const Duration(seconds: 2), _stopTyping);
    }
  }

  void _stopTyping() {
    widget.onStopTyping?.call();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border(
          top: BorderSide(
            color: isDark
                ? AppColors.ashGray.withValues(alpha: 0.2)
                : AppColors.ashGray.withValues(alpha: 0.3),
          ),
        ),
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Container(
                constraints: const BoxConstraints(
                  minHeight: AppSpacing.inputHeight,
                  maxHeight: AppSpacing.maxInputHeight,
                ),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkOuterSpace : AppColors.timberwolf,
                  borderRadius: BorderRadius.circular(AppSpacing.inputRadius),
                  border: Border.all(color: AppColors.ashGray),
                ),
                child: TextField(
                  controller: _controller,
                  onChanged: _onTextChanged,
                  maxLines: null,
                  textInputAction: TextInputAction.newline,
                  decoration: const InputDecoration(
                    hintText: AppStrings.typeMessage,
                    hintStyle: TextStyle(color: AppColors.ashGray),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: AppSpacing.md,
                      vertical: 12,
                    ),
                    border: InputBorder.none,
                  ),
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            AnimatedOpacity(
              opacity: _hasText ? 1.0 : 0.5,
              duration: const Duration(milliseconds: 200),
              child: GestureDetector(
                onTap: _hasText ? _handleSend : null,
                child: Container(
                  width: 48,
                  height: 48,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.cherryBlossomPink,
                  ),
                  child: const Icon(
                    Icons.send,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
