import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_spacing.dart';

class AvatarWidget extends StatelessWidget {
  final String? imageUrl;
  final String? fallbackText;
  final double size;
  final bool showOnlineIndicator;
  final bool isOnline;
  final VoidCallback? onTap;

  const AvatarWidget({
    super.key,
    this.imageUrl,
    this.fallbackText,
    this.size = AppSpacing.mediumAvatarSize,
    this.showOnlineIndicator = false,
    this.isOnline = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final initial = fallbackText?.isNotEmpty == true
        ? fallbackText![0].toUpperCase()
        : '?';

    Widget avatar = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: AppColors.cherryBlossomPink,
        border: Border.all(
          color: isDark ? AppColors.timberwolf : Colors.white,
          width: size > 60 ? 4 : 2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: imageUrl != null && imageUrl!.isNotEmpty
          ? ClipOval(
              child: CachedNetworkImage(
                imageUrl: imageUrl!,
                fit: BoxFit.cover,
                placeholder: (context, url) => Center(
                  child: Text(
                    initial,
                    style: TextStyle(
                      color: AppColors.outerSpace,
                      fontSize: size * 0.4,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                errorWidget: (context, url, error) => Center(
                  child: Text(
                    initial,
                    style: TextStyle(
                      color: AppColors.outerSpace,
                      fontSize: size * 0.4,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            )
          : Center(
              child: Text(
                initial,
                style: TextStyle(
                  color: AppColors.outerSpace,
                  fontSize: size * 0.4,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
    );

    if (showOnlineIndicator) {
      avatar = Stack(
        clipBehavior: Clip.none,
        children: [
          avatar,
          Positioned(
            bottom: 0,
            right: 0,
            child: Container(
              width: size * 0.25,
              height: size * 0.25,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isOnline ? AppColors.onlineGreen : AppColors.ashGray,
                border: Border.all(
                  color: isDark ? AppColors.timberwolf : Colors.white,
                  width: 2,
                ),
              ),
            ),
          ),
        ],
      );
    }

    if (onTap != null) {
      return GestureDetector(
        onTap: onTap,
        child: avatar,
      );
    }

    return avatar;
  }
}
