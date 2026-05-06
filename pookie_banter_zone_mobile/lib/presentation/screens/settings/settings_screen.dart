import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_spacing.dart';
import '../../../core/constants/app_strings.dart';
import '../../providers/auth_provider.dart';
import '../../providers/settings_provider.dart';
import 'widgets/logout_dialog.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final settingsProvider = context.watch<SettingsProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: const Text(AppStrings.settings),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          children: [
            _buildSettingsCard(
              context,
              icon: Icons.notifications_outlined,
              iconColor: AppColors.cherryBlossomPink,
              title: AppStrings.notifications,
              subtitle: AppStrings.notificationsDescription,
              trailing: Switch(
                value: settingsProvider.notificationsEnabled,
                onChanged: (_) => settingsProvider.toggleNotifications(),
                activeTrackColor: AppColors.cherryBlossomPink,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            _buildSettingsCard(
              context,
              icon: Icons.dark_mode_outlined,
              iconColor: AppColors.ashGray,
              title: AppStrings.darkMode,
              subtitle: AppStrings.darkModeDescription,
              trailing: Switch(
                value: settingsProvider.darkMode,
                onChanged: (_) => settingsProvider.toggleDarkMode(),
                activeTrackColor: AppColors.cherryBlossomPink,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            _buildSettingsCard(
              context,
              icon: Icons.language_outlined,
              iconColor: AppColors.onlineGreen,
              title: AppStrings.language,
              subtitle: AppStrings.languageValue,
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                // Future: Navigate to language selector
              },
            ),
            const SizedBox(height: AppSpacing.xl),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => _showLogoutDialog(context),
                icon: const Icon(Icons.logout, color: AppColors.errorRed),
                label: const Text(
                  AppStrings.logout,
                  style: TextStyle(color: AppColors.errorRed),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: isDark
                      ? AppColors.darkOuterSpace
                      : AppColors.timberwolf.withValues(alpha: 0.5),
                  elevation: 0,
                  minimumSize: const Size(double.infinity, 56),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppSpacing.buttonRadius),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsCard(
    BuildContext context, {
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required Widget trailing,
    VoidCallback? onTap,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.sm,
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(AppSpacing.sm),
                decoration: BoxDecoration(
                  color: iconColor.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 13,
                        color: isDark
                            ? AppColors.ashGray
                            : AppColors.outerSpace.withValues(alpha: 0.6),
                      ),
                    ),
                  ],
                ),
              ),
              trailing,
            ],
          ),
        ),
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => LogoutDialog(
        onConfirm: () async {
          final authProvider = context.read<AuthProvider>();
          await authProvider.logout();
          if (context.mounted) {
            context.go('/auth');
          }
        },
      ),
    );
  }
}
