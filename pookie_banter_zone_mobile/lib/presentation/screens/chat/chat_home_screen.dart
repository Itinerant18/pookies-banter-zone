import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_spacing.dart';
import '../../../core/constants/app_strings.dart';
import '../../providers/auth_provider.dart';
import '../../providers/chat_provider.dart';
import '../../widgets/avatar_widget.dart';
import 'widgets/chat_content.dart';
import 'widgets/empty_state.dart';
import 'widgets/error_state.dart';
import 'widgets/finding_match.dart';
import 'widgets/user_list.dart';

class ChatHomeScreen extends StatefulWidget {
  const ChatHomeScreen({super.key});

  @override
  State<ChatHomeScreen> createState() => _ChatHomeScreenState();
}

class _ChatHomeScreenState extends State<ChatHomeScreen> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final chatProvider = context.watch<ChatProvider>();
    final authProvider = context.watch<AuthProvider>();
    final currentUser = authProvider.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(
              Icons.chat_bubble_outline,
              size: 28,
              color: AppColors.cherryBlossomPink,
            ),
            const SizedBox(width: 8),
            Text(
              AppStrings.appName,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Theme.of(context).brightness == Brightness.dark
                    ? AppColors.timberwolf
                    : AppColors.outerSpace,
              ),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: AppSpacing.sm),
            child: GestureDetector(
              onTap: () => _showProfileMenu(context),
              child: AvatarWidget(
                imageUrl: currentUser?.photoURL,
                fallbackText: currentUser?.displayName ?? 'U',
                size: 36,
              ),
            ),
          ),
        ],
      ),
      body: _buildBody(chatProvider),
    );
  }

  Widget _buildBody(ChatProvider chatProvider) {
    if (chatProvider.isFinding) {
      return const FindingMatch();
    }

    if (chatProvider.error != null && chatProvider.matchedUser == null) {
      return ErrorState(
        message: chatProvider.error!,
        subMessage: chatProvider.error == 'No users available'
            ? 'Try again later or browse the user list.'
            : null,
        onRetry: () {
          chatProvider.clearError();
          chatProvider.findRandomMatch();
        },
      );
    }

    if (chatProvider.userListMode) {
      return UserList(
        users: chatProvider.allUsers,
        onSelectUser: (user) => chatProvider.selectUser(user),
        searchController: _searchController,
        onSearch: (query) => chatProvider.searchUsers(query),
      );
    }

    if (chatProvider.hasActiveChat) {
      return const ChatContent();
    }

    return EmptyState(
      onFindRandomMatch: () => chatProvider.findRandomMatch(),
      onViewAllUsers: () => chatProvider.showUserList(),
    );
  }

  void _showProfileMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.person_outline),
              title: const Text('Profile'),
              onTap: () {
                Navigator.pop(context);
                context.push('/profile');
              },
            ),
            ListTile(
              leading: const Icon(Icons.settings_outlined),
              title: const Text('Settings'),
              onTap: () {
                Navigator.pop(context);
                context.push('/settings');
              },
            ),
            ListTile(
              leading: const Icon(Icons.logout, color: AppColors.errorRed),
              title: const Text('Log Out', style: TextStyle(color: AppColors.errorRed)),
              onTap: () {
                Navigator.pop(context);
                context.read<AuthProvider>().logout();
                context.go('/auth');
              },
            ),
          ],
        ),
      ),
    );
  }
}
