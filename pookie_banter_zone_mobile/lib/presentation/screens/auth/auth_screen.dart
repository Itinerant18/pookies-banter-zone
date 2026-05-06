import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_spacing.dart';
import '../../../core/constants/app_strings.dart';
import '../../../core/utils/validators.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_text_field.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _loginFormKey = GlobalKey<FormState>();
  final _registerFormKey = GlobalKey<FormState>();

  final _loginEmailController = TextEditingController();
  final _loginPasswordController = TextEditingController();
  final _registerNameController = TextEditingController();
  final _registerEmailController = TextEditingController();
  final _registerPasswordController = TextEditingController();

  bool _rememberMe = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _loginEmailController.dispose();
    _loginPasswordController.dispose();
    _registerNameController.dispose();
    _registerEmailController.dispose();
    _registerPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_loginFormKey.currentState!.validate()) return;

    final authProvider = context.read<AuthProvider>();
    await authProvider.setPersistence(_rememberMe);
    final success = await authProvider.signInWithEmail(
      _loginEmailController.text.trim(),
      _loginPasswordController.text,
    );

    if (success && mounted) {
      context.go('/chat');
    }
  }

  Future<void> _handleRegister() async {
    if (!_registerFormKey.currentState!.validate()) return;

    final authProvider = context.read<AuthProvider>();
    await authProvider.setPersistence(_rememberMe);
    final success = await authProvider.signUpWithEmail(
      _registerNameController.text.trim(),
      _registerEmailController.text.trim(),
      _registerPasswordController.text,
    );

    if (success && mounted) {
      context.go('/chat');
    }
  }

  Future<void> _handleGoogleSignIn() async {
    final authProvider = context.read<AuthProvider>();
    final success = await authProvider.signInWithGoogle();

    if (success && mounted) {
      context.go('/chat');
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: AppSpacing.xxl),
              Container(
                width: 100,
                height: 100,
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
              const SizedBox(height: AppSpacing.lg),
              Text(
                AppStrings.appName,
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
                ),
              ),
              const SizedBox(height: AppSpacing.xxl),
              Container(
                decoration: BoxDecoration(
                  color: isDark
                      ? AppColors.darkOuterSpace
                      : AppColors.timberwolf.withValues(alpha: 0.5),
                  borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
                ),
                child: TabBar(
                  controller: _tabController,
                  indicatorSize: TabBarIndicatorSize.tab,
                  indicator: BoxDecoration(
                    color: AppColors.cherryBlossomPink,
                    borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
                  ),
                  labelColor: AppColors.outerSpace,
                  unselectedLabelColor:
                      isDark ? AppColors.timberwolf : AppColors.outerSpace,
                  tabs: const [
                    Tab(text: AppStrings.login),
                    Tab(text: AppStrings.register),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              SizedBox(
                height: 380,
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _buildLoginForm(authProvider),
                    _buildRegisterForm(authProvider),
                  ],
                ),
              ),
              if (authProvider.error != null) ...[
                const SizedBox(height: AppSpacing.sm),
                Text(
                  authProvider.error!,
                  style: const TextStyle(
                    color: AppColors.errorRed,
                    fontSize: 13,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
              const SizedBox(height: AppSpacing.md),
              _buildDivider(),
              const SizedBox(height: AppSpacing.md),
              AppButton(
                text: AppStrings.googleSignIn,
                type: AppButtonType.outline,
                onPressed: authProvider.isLoading ? null : _handleGoogleSignIn,
                icon: Icon(
                  Icons.g_mobiledata,
                  color: isDark ? AppColors.timberwolf : AppColors.outerSpace,
                  size: 24,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLoginForm(AuthProvider authProvider) {
    return Form(
      key: _loginFormKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AppTextField(
            controller: _loginEmailController,
            hintText: AppStrings.email,
            keyboardType: TextInputType.emailAddress,
            validator: Validators.validateEmail,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: AppSpacing.md),
          AppTextField(
            controller: _loginPasswordController,
            hintText: AppStrings.password,
            obscureText: true,
            validator: Validators.validatePassword,
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => _handleLogin(),
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Checkbox(
                value: _rememberMe,
                onChanged: (value) {
                  setState(() {
                    _rememberMe = value ?? true;
                  });
                },
                activeColor: AppColors.cherryBlossomPink,
              ),
              Text(
                AppStrings.rememberMe,
                style: TextStyle(
                  color: Theme.of(context).brightness == Brightness.dark
                      ? AppColors.timberwolf
                      : AppColors.outerSpace,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          AppButton(
            text: AppStrings.login,
            onPressed: _handleLogin,
            isLoading: authProvider.isLoading,
          ),
        ],
      ),
    );
  }

  Widget _buildRegisterForm(AuthProvider authProvider) {
    return Form(
      key: _registerFormKey,
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AppTextField(
              controller: _registerNameController,
              hintText: AppStrings.name,
              validator: Validators.validateName,
              textInputAction: TextInputAction.next,
            ),
            const SizedBox(height: AppSpacing.md),
            AppTextField(
              controller: _registerEmailController,
              hintText: AppStrings.email,
              keyboardType: TextInputType.emailAddress,
              validator: Validators.validateEmail,
              textInputAction: TextInputAction.next,
            ),
            const SizedBox(height: AppSpacing.md),
            AppTextField(
              controller: _registerPasswordController,
              hintText: AppStrings.password,
              obscureText: true,
              validator: Validators.validatePassword,
              textInputAction: TextInputAction.done,
              onSubmitted: (_) => _handleRegister(),
            ),
            const SizedBox(height: AppSpacing.sm),
            Row(
              children: [
                Checkbox(
                  value: _rememberMe,
                  onChanged: (value) {
                    setState(() {
                      _rememberMe = value ?? true;
                    });
                  },
                  activeColor: AppColors.cherryBlossomPink,
                ),
                Text(
                  AppStrings.rememberMe,
                  style: TextStyle(
                    color: Theme.of(context).brightness == Brightness.dark
                        ? AppColors.timberwolf
                        : AppColors.outerSpace,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.md),
            AppButton(
              text: AppStrings.register,
              onPressed: _handleRegister,
              isLoading: authProvider.isLoading,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Row(
      children: [
        Expanded(
          child: Divider(
            color: Theme.of(context).brightness == Brightness.dark
                ? AppColors.ashGray.withValues(alpha: 0.3)
                : AppColors.ashGray.withValues(alpha: 0.5),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
          child: Text(
            'OR',
            style: TextStyle(
              color: Theme.of(context).brightness == Brightness.dark
                  ? AppColors.ashGray
                  : AppColors.outerSpace.withValues(alpha: 0.6),
              fontSize: 12,
            ),
          ),
        ),
        Expanded(
          child: Divider(
            color: Theme.of(context).brightness == Brightness.dark
                ? AppColors.ashGray.withValues(alpha: 0.3)
                : AppColors.ashGray.withValues(alpha: 0.5),
          ),
        ),
      ],
    );
  }
}
