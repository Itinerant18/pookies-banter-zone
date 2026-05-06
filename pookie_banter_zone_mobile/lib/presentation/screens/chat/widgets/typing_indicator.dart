import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_spacing.dart';

class TypingIndicator extends StatefulWidget {
  final String userName;

  const TypingIndicator({
    super.key,
    required this.userName,
  });

  @override
  State<TypingIndicator> createState() => _TypingIndicatorState();
}

class _TypingIndicatorState extends State<TypingIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.xs,
      ),
      child: Row(
        children: [
          _AnimatedDot(controller: _controller, index: 0),
          const SizedBox(width: 4),
          _AnimatedDot(controller: _controller, index: 1),
          const SizedBox(width: 4),
          _AnimatedDot(controller: _controller, index: 2),
          const SizedBox(width: 8),
          Text(
            '${widget.userName} is typing...',
            style: TextStyle(
              fontSize: 12,
              color: isDark ? AppColors.ashGray : AppColors.outerSpace.withValues(alpha: 0.6),
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }
}

class _AnimatedDot extends StatelessWidget {
  final AnimationController controller;
  final int index;

  const _AnimatedDot({
    required this.controller,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    final animation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: controller,
        curve: Interval(
          index * 0.2,
          index * 0.2 + 0.6,
          curve: Curves.easeInOut,
        ),
      ),
    );

    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        return Container(
          width: 6,
          height: 6 + (animation.value * 4),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: AppColors.cherryBlossomPink.withValues(
              alpha: 0.5 + (animation.value * 0.5),
            ),
          ),
        );
      },
    );
  }
}
