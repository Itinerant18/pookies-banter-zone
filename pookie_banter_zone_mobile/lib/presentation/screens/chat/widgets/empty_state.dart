import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../presentation/widgets/app_button.dart';

class EmptyState extends StatelessWidget {
  final VoidCallback onFindRandomMatch;
  final VoidCallback onViewAllUsers;

  const EmptyState({
    super.key,
    required this.onFindRandomMatch,
    required this.onViewAllUsers,
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
            Icons.chat_bubble_outline,
            size: 64,
            color: isDark
                ? AppColors.ashGray.withValues(alpha: 0.5)
                : AppColors.ashGray,
          ),
          const SizedBox(height: AppSpacing.lg),
          Text(
            AppStrings.startChatting,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w600,
              color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            AppStrings.emptyStateDescription,
            style: TextStyle(
              fontSize: 14,
              color: isDark
                  ? AppColors.ashGray
                  : AppColors.outerSpace.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.xl),
          AppButton(
            text: AppStrings.findRandomMatch,
            onPressed: onFindRandomMatch,
          ),
          const SizedBox(height: AppSpacing.md),
          AppButton(
            text: AppStrings.viewAllUsers,
            type: AppButtonType.outline,
            onPressed: onViewAllUsers,
          ),
        ],
      ),
    );
  }
}
