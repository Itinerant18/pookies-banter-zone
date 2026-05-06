import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class LoadingIndicator extends StatelessWidget {
  final double size;
  final Color? color;
  final String? text;

  const LoadingIndicator({
    super.key,
    this.size = 48,
    this.color,
    this.text,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SizedBox(
          width: size,
          height: size,
          child: CircularProgressIndicator(
            color: color ?? AppColors.cherryBlossomPink,
            strokeWidth: 3,
          ),
        ),
        if (text != null) ...[
          const SizedBox(height: 16),
          Text(
            text!,
            style: TextStyle(
              color: color ?? AppColors.cherryBlossomPink,
              fontSize: 16,
            ),
          ),
        ],
      ],
    );
  }
}
