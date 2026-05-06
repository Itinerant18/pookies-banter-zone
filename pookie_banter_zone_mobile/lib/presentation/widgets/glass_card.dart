import 'dart:ui';
import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_spacing.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final double? borderRadius;

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final radius = borderRadius ?? AppSpacing.cardRadius;

    Widget card = ClipRRect(
      borderRadius: BorderRadius.circular(radius),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: padding ?? const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(radius),
            color: isDark
                ? AppColors.darkOuterSpace.withValues(alpha: 0.7)
                : AppColors.timberwolf.withValues(alpha: 0.7),
            border: Border.all(
              color: isDark
                  ? AppColors.ashGray.withValues(alpha: 0.3)
                  : Colors.white.withValues(alpha: 0.5),
            ),
          ),
          child: child,
        ),
      ),
    );

    if (onTap != null) {
      return InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(radius),
        child: card,
      );
    }

    return card;
  }
}
