import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_spacing.dart';
import '../../../core/constants/app_strings.dart';
import '../../providers/user_provider.dart';
import '../../widgets/avatar_widget.dart';
import '../../widgets/loading_indicator.dart';
import 'widgets/profile_edit_sheet.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final userProvider = context.watch<UserProvider>();
    final profile = userProvider.profile;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: const Text(AppStrings.profile),
      ),
      body: userProvider.isLoading
          ? const Center(child: LoadingIndicator())
          : profile == null
              ? const Center(child: Text('No profile found'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  child: Column(
                    children: [
                      const SizedBox(height: AppSpacing.lg),
                      AvatarWidget(
                        imageUrl: profile.photoURL,
                        fallbackText: profile.name,
                        size: AppSpacing.largeAvatarSize,
                      ),
                      const SizedBox(height: AppSpacing.md),
                      Text(
                        profile.name ?? 'Unknown',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w600,
                          color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        profile.email ?? '',
                        style: TextStyle(
                          fontSize: 14,
                          color: isDark
                              ? AppColors.ashGray
                              : AppColors.outerSpace.withValues(alpha: 0.6),
                        ),
                      ),
                      if (profile.username != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          '@${profile.username}',
                          style: TextStyle(
                            fontSize: 14,
                            color: isDark
                                ? AppColors.ashGray
                                : AppColors.outerSpace.withValues(alpha: 0.6),
                          ),
                        ),
                      ],
                      const SizedBox(height: AppSpacing.lg),
                      if (profile.age != null || profile.gender != null)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            if (profile.age != null)
                              _buildInfoChip('Age: ${profile.age}'),
                            if (profile.age != null && profile.gender != null)
                              const SizedBox(width: AppSpacing.md),
                            if (profile.gender != null)
                              _buildInfoChip(profile.gender!),
                          ],
                        ),
                      const SizedBox(height: AppSpacing.lg),
                      if (profile.bio != null && profile.bio!.isNotEmpty) ...[
                        _buildSectionTitle(AppStrings.bio),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(AppSpacing.md),
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardColor,
                            borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
                          ),
                          child: Text(
                            profile.bio!,
                            style: TextStyle(
                              fontSize: 14,
                              height: 1.5,
                              color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
                            ),
                          ),
                        ),
                      ],
                      if (profile.interests != null && profile.interests!.isNotEmpty) ...[
                        const SizedBox(height: AppSpacing.lg),
                        _buildSectionTitle(AppStrings.interests),
                        Wrap(
                          spacing: AppSpacing.sm,
                          runSpacing: AppSpacing.sm,
                          children: profile.interests!
                              .map((interest) => Chip(
                                    label: Text(interest),
                                    backgroundColor:
                                        AppColors.cherryBlossomPink.withValues(alpha: 0.2),
                                    labelStyle: TextStyle(
                                      color: isDark
                                          ? AppColors.timberwolf
                                          : AppColors.outerSpace,
                                    ),
                                  ))
                              .toList(),
                        ),
                      ],
                      const SizedBox(height: AppSpacing.lg),
                      ElevatedButton.icon(
                        onPressed: () => _showEditProfile(context, profile),
                        icon: const Icon(Icons.edit, size: 18),
                        label: const Text(AppStrings.editProfile),
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size(180, 44),
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }

  Widget _buildInfoChip(String text) {
    return Builder(
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Container(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.sm,
          ),
          decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(AppSpacing.buttonRadius),
            border: Border.all(
              color: isDark
                  ? AppColors.ashGray.withValues(alpha: 0.3)
                  : AppColors.ashGray.withValues(alpha: 0.5),
            ),
          ),
          child: Text(
            text,
            style: TextStyle(
              fontSize: 14,
              color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
            ),
          ),
        );
      },
    );
  }

  Widget _buildSectionTitle(String title) {
    return Builder(
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.sm),
          child: Align(
            alignment: Alignment.centerLeft,
            child: Text(
              title,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
              ),
            ),
          ),
        );
      },
    );
  }

  void _showEditProfile(BuildContext context, dynamic profile) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => ProfileEditSheet(profile: profile),
    );
  }
}
