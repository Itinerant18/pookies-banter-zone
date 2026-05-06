import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_spacing.dart';

enum AppButtonType { primary, outline }

class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final AppButtonType type;
  final bool isLoading;
  final Widget? icon;
  final double? height;

  const AppButton({
    super.key,
    required this.text,
    this.onPressed,
    this.type = AppButtonType.primary,
    this.isLoading = false,
    this.icon,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final effectiveHeight = height ?? AppSpacing.buttonHeight;

    Widget buttonChild = isLoading
        ? const SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: AppColors.outerSpace,
            ),
          )
        : Row(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[
                icon!,
                const SizedBox(width: 8),
              ],
              Text(text),
            ],
          );

    if (type == AppButtonType.primary) {
      return ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          minimumSize: Size(double.infinity, effectiveHeight),
        ),
        child: buttonChild,
      );
    } else {
      return OutlinedButton(
        onPressed: isLoading ? null : onPressed,
        style: OutlinedButton.styleFrom(
          minimumSize: Size(double.infinity, effectiveHeight),
          foregroundColor: isDark ? AppColors.timberwolf : AppColors.outerSpace,
        ),
        child: buttonChild,
      );
    }
  }
}
