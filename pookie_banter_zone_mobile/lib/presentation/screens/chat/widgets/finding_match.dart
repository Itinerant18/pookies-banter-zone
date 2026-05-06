import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_strings.dart';

class FindingMatch extends StatelessWidget {
  const FindingMatch({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: AppColors.cherryBlossomPink.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.chat_bubble_outline,
              size: 50,
              color: AppColors.cherryBlossomPink,
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          Text(
            AppStrings.findingMatchTitle,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w500,
              color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            AppStrings.findingMatchSubtitle,
            style: TextStyle(
              fontSize: 14,
              color: isDark
                  ? AppColors.ashGray
                  : AppColors.outerSpace.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.xl),
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: isDark
                  ? AppColors.darkOuterSpace
                  : AppColors.timberwolf.withValues(alpha: 0.5),
              borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
            ),
            child: Text(
              AppStrings.findingMatchTips,
              style: TextStyle(
                fontSize: 12,
                color: isDark
                    ? AppColors.ashGray
                    : AppColors.outerSpace.withValues(alpha: 0.6),
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}
