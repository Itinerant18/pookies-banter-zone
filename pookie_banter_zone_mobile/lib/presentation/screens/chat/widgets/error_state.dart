import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../presentation/widgets/app_button.dart';

class ErrorState extends StatelessWidget {
  final String message;
  final String? subMessage;
  final VoidCallback onRetry;

  const ErrorState({
    super.key,
    required this.message,
    this.subMessage,
    required this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline,
            size: 64,
            color: isDark
                ? AppColors.errorRed.withValues(alpha: 0.7)
                : AppColors.errorRed,
          ),
          const SizedBox(height: AppSpacing.lg),
          Text(
            message,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w500,
              color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
            ),
            textAlign: TextAlign.center,
          ),
          if (subMessage != null) ...[
            const SizedBox(height: AppSpacing.sm),
            Text(
              subMessage!,
              style: TextStyle(
                fontSize: 14,
                color: isDark
                    ? AppColors.ashGray
                    : AppColors.outerSpace.withValues(alpha: 0.7),
              ),
              textAlign: TextAlign.center,
            ),
          ],
          const SizedBox(height: AppSpacing.xl),
          AppButton(
            text: 'Retry',
            onPressed: onRetry,
          ),
        ],
      ),
    );
  }
}
