import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../data/models/user_model.dart';
import '../../../providers/user_provider.dart';
import '../../../widgets/app_text_field.dart';
import '../../../widgets/avatar_widget.dart';

class ProfileEditSheet extends StatefulWidget {
  final UserProfile profile;

  const ProfileEditSheet({
    super.key,
    required this.profile,
  });

  @override
  State<ProfileEditSheet> createState() => _ProfileEditSheetState();
}

class _ProfileEditSheetState extends State<ProfileEditSheet> {
  late final _nameController = TextEditingController(text: widget.profile.name);
  late final _ageController = TextEditingController(
    text: widget.profile.age?.toString() ?? '',
  );
  late final _bioController = TextEditingController(text: widget.profile.bio ?? '');
  late final _interestController = TextEditingController();

  String? _selectedGender;
  final List<String> _interests = [];

  static const List<String> _genderOptions = [
    AppStrings.male,
    AppStrings.female,
    AppStrings.nonBinary,
    AppStrings.other,
    AppStrings.preferNotToSay,
  ];

  @override
  void initState() {
    super.initState();
    _selectedGender = widget.profile.gender;
    if (widget.profile.interests != null) {
      _interests.addAll(widget.profile.interests!);
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _ageController.dispose();
    _bioController.dispose();
    _interestController.dispose();
    super.dispose();
  }

  Future<void> _saveProfile() async {
    final updatedProfile = widget.profile.copyWith(
      name: _nameController.text.trim(),
      age: _ageController.text.isNotEmpty
          ? int.tryParse(_ageController.text)
          : null,
      gender: _selectedGender,
      bio: _bioController.text.trim(),
      interests: _interests.isNotEmpty ? List.from(_interests) : null,
    );

    final success = await context.read<UserProvider>().updateProfile(updatedProfile);
    if (success && mounted) {
      Navigator.pop(context);
    }
  }

  void _addInterest() {
    final text = _interestController.text.trim();
    if (text.isNotEmpty && !_interests.contains(text)) {
      setState(() {
        _interests.add(text);
      });
      _interestController.clear();
    }
  }

  void _removeInterest(String interest) {
    setState(() {
      _interests.remove(interest);
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final userProvider = context.watch<UserProvider>();

    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(
          top: Radius.circular(AppSpacing.cardRadius),
        ),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: isDark
                    ? AppColors.ashGray.withValues(alpha: 0.3)
                    : AppColors.ashGray.withValues(alpha: 0.5),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  AppStrings.editProfile,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
                  ),
                ),
                TextButton(
                  onPressed: userProvider.isLoading ? null : _saveProfile,
                  child: userProvider.isLoading
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text(AppStrings.save),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.lg),
            Stack(
              alignment: Alignment.bottomRight,
              children: [
                AvatarWidget(
                  imageUrl: widget.profile.photoURL,
                  fallbackText: widget.profile.name,
                  size: AppSpacing.largeAvatarSize,
                ),
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: AppColors.cherryBlossomPink,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.camera_alt,
                    size: 18,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.lg),
            AppTextField(
              controller: _nameController,
              labelText: AppStrings.name,
            ),
            const SizedBox(height: AppSpacing.md),
            Row(
              children: [
                Expanded(
                  child: AppTextField(
                    controller: _ageController,
                    labelText: AppStrings.age,
                    keyboardType: TextInputType.number,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    initialValue: _selectedGender,
                    hint: Text(
                      AppStrings.gender,
                      style: TextStyle(
                        color: isDark
                            ? AppColors.ashGray
                            : AppColors.outerSpace.withValues(alpha: 0.6),
                      ),
                    ),
                    items: _genderOptions.map((gender) {
                      return DropdownMenuItem(
                        value: gender,
                        child: Text(gender),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() => _selectedGender = value);
                    },
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: isDark ? AppColors.darkOuterSpace : AppColors.timberwolf,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(AppSpacing.inputRadius),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.md),
            AppTextField(
              controller: _bioController,
              labelText: '${AppStrings.bio} (${AppStrings.bioMaxLength})',
              maxLines: 3,
              maxLength: 150,
            ),
            const SizedBox(height: AppSpacing.md),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                AppStrings.interests,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: _interests.map((interest) {
                return Chip(
                  label: Text(interest),
                  deleteIcon: const Icon(Icons.close, size: 16),
                  onDeleted: () => _removeInterest(interest),
                );
              }).toList(),
            ),
            const SizedBox(height: AppSpacing.sm),
            Row(
              children: [
                Expanded(
                  child: AppTextField(
                    controller: _interestController,
                    hintText: AppStrings.addInterest,
                    textInputAction: TextInputAction.done,
                    onSubmitted: (_) => _addInterest(),
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                IconButton(
                  onPressed: _addInterest,
                  icon: const Icon(Icons.add),
                  style: IconButton.styleFrom(
                    backgroundColor: AppColors.cherryBlossomPink,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.lg),
            if (userProvider.error != null)
              Text(
                userProvider.error!,
                style: const TextStyle(color: AppColors.errorRed, fontSize: 13),
              ),
          ],
        ),
      ),
    );
  }
}
