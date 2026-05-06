import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class AppTextField extends StatelessWidget {
  final TextEditingController? controller;
  final String? hintText;
  final String? labelText;
  final bool obscureText;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;
  final int? maxLines;
  final int? maxLength;
  final Widget? suffixIcon;
  final Widget? prefixIcon;
  final TextInputAction? textInputAction;
  final void Function(String)? onSubmitted;

  const AppTextField({
    super.key,
    this.controller,
    this.hintText,
    this.labelText,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.validator,
    this.onChanged,
    this.maxLines = 1,
    this.maxLength,
    this.suffixIcon,
    this.prefixIcon,
    this.textInputAction,
    this.onSubmitted,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      validator: validator,
      onChanged: onChanged,
      maxLines: maxLines,
      maxLength: maxLength,
      textInputAction: textInputAction,
      onFieldSubmitted: onSubmitted,
      style: const TextStyle(fontSize: 16),
      decoration: InputDecoration(
        hintText: hintText,
        labelText: labelText,
        suffixIcon: suffixIcon,
        prefixIcon: prefixIcon,
        hintStyle: TextStyle(
          color: Theme.of(context).brightness == Brightness.dark
              ? AppColors.ashGray
              : AppColors.ashGray.withValues(alpha: 0.7),
        ),
      ),
    );
  }
}
