import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../data/models/user_model.dart';
import '../../../../presentation/widgets/avatar_widget.dart';
import '../../../../presentation/widgets/glass_card.dart';

class UserCard extends StatelessWidget {
  final UserProfile user;
  final VoidCallback onNewChat;

  const UserCard({
    super.key,
    required this.user,
    required this.onNewChat,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isOnline = user.status == 'online';

    return GlassCard(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Row(
        children: [
          AvatarWidget(
            imageUrl: user.photoURL,
            fallbackText: user.name,
            size: AppSpacing.mediumAvatarSize,
            showOnlineIndicator: true,
            isOnline: isOnline,
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  user.name ?? 'Unknown',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
                  ),
                ),
                if (user.username != null) ...[
                  const SizedBox(height: 2),
                  Text(
                    '@${user.username}',
                    style: TextStyle(
                      fontSize: 14,
                      color: isDark
                          ? AppColors.ashGray
                          : AppColors.outerSpace.withValues(alpha: 0.6),
                    ),
                  ),
                ],
                const SizedBox(height: 4),
                Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isOnline ? AppColors.onlineGreen : AppColors.ashGray,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      isOnline ? AppStrings.online : AppStrings.offline,
                      style: TextStyle(
                        fontSize: 12,
                        color: isOnline
                            ? AppColors.onlineGreen
                            : isDark
                                ? AppColors.ashGray
                                : AppColors.outerSpace.withValues(alpha: 0.5),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          OutlinedButton.icon(
            onPressed: onNewChat,
            icon: const Icon(Icons.refresh, size: 16),
            label: Text(
              AppStrings.newChat,
              style: TextStyle(
                color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
              ),
            ),
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: AppColors.ashGray),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppSpacing.buttonRadius),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
