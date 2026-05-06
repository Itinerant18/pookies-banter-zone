import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../data/models/user_model.dart';
import '../../../../presentation/widgets/avatar_widget.dart';

class UserList extends StatelessWidget {
  final List<UserProfile> users;
  final Function(UserProfile) onSelectUser;
  final TextEditingController searchController;
  final Function(String) onSearch;

  const UserList({
    super.key,
    required this.users,
    required this.onSelectUser,
    required this.searchController,
    required this.onSearch,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: TextField(
            controller: searchController,
            onChanged: onSearch,
            decoration: InputDecoration(
              hintText: 'Search users...',
              prefixIcon: const Icon(Icons.search),
              filled: true,
              fillColor: isDark ? AppColors.darkOuterSpace : AppColors.timberwolf,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppSpacing.inputRadius),
                borderSide: BorderSide.none,
              ),
            ),
          ),
        ),
        Expanded(
          child: users.isEmpty
              ? Center(
                  child: Text(
                    AppStrings.noUsersFound,
                    style: TextStyle(
                      color: isDark ? AppColors.ashGray : AppColors.outerSpace.withValues(alpha: 0.6),
                    ),
                  ),
                )
              : ListView.builder(
                  itemCount: users.length,
                  itemBuilder: (context, index) {
                    final user = users[index];
                    return _UserListItem(
                      user: user,
                      onTap: () => onSelectUser(user),
                    );
                  },
                ),
        ),
      ],
    );
  }
}

class _UserListItem extends StatelessWidget {
  final UserProfile user;
  final VoidCallback onTap;

  const _UserListItem({
    required this.user,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isOnline = user.status == 'online';

    return ListTile(
      leading: AvatarWidget(
        imageUrl: user.photoURL,
        fallbackText: user.name,
        size: AppSpacing.smallAvatarSize,
        showOnlineIndicator: true,
        isOnline: isOnline,
      ),
      title: Text(
        user.name ?? 'Unknown',
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
        ),
      ),
      subtitle: user.username != null
          ? Text(
              '@${user.username}',
              style: TextStyle(
                fontSize: 12,
                color: isDark
                    ? AppColors.ashGray
                    : AppColors.outerSpace.withValues(alpha: 0.6),
              ),
            )
          : null,
      trailing: Container(
        width: 12,
        height: 12,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: isOnline ? AppColors.onlineGreen : AppColors.ashGray,
        ),
      ),
      onTap: onTap,
    );
  }
}
