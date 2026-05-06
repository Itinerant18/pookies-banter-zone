import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_strings.dart';

class LogoutDialog extends StatelessWidget {
  final VoidCallback onConfirm;

  const LogoutDialog({
    super.key,
    required this.onConfirm,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
      ),
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      title: Text(
        AppStrings.logoutConfirmTitle,
        textAlign: TextAlign.center,
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
        ),
      ),
      content: Text(
        AppStrings.logoutConfirmDescription,
        textAlign: TextAlign.center,
        style: TextStyle(
          fontSize: 14,
          color: isDark
              ? AppColors.ashGray
              : AppColors.outerSpace.withValues(alpha: 0.7),
        ),
      ),
      actionsAlignment: MainAxisAlignment.center,
      actions: [
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () => Navigator.pop(context),
                style: OutlinedButton.styleFrom(
                  foregroundColor: isDark ? AppColors.timberwolf : AppColors.outerSpace,
                ),
                child: const Text(AppStrings.cancel),
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  onConfirm();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.errorRed,
                  foregroundColor: Colors.white,
                ),
                child: const Text('Yes, log out'),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
