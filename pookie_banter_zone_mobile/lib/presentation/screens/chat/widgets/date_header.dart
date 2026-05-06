import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/utils/date_utils.dart';

class DateHeader extends StatelessWidget {
  final DateTime date;

  const DateHeader({
    super.key,
    required this.date,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Center(
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: AppSpacing.md),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.xs,
        ),
        decoration: BoxDecoration(
          color: isDark
              ? AppColors.darkOuterSpace
              : AppColors.timberwolf.withValues(alpha: 0.7),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          AppDateUtils.formatMessageDate(date),
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: isDark ? AppColors.ashGray : AppColors.outerSpace.withValues(alpha: 0.7),
          ),
        ),
      ),
    );
  }
}
