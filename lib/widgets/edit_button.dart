import 'package:flutter/material.dart';
import '../theme/colors.dart';

class EditButton extends StatelessWidget {
  final bool editing;
  final VoidCallback onTap;
  final bool compact;

  const EditButton({super.key, required this.editing, required this.onTap, this.compact = false});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(
          horizontal: compact ? 9 : 12,
          vertical: compact ? 5 : 6,
        ),
        decoration: BoxDecoration(
          color: editing ? AppColors.accent : const Color(0x0F1A1816),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Icon(
            editing ? Icons.check_rounded : Icons.edit_rounded,
            size: 12,
            color: editing ? Colors.white : AppColors.ink,
          ),
          const SizedBox(width: 5),
          Text(
            editing ? '완료' : '편집',
            style: TextStyle(
              fontSize: 11.5, fontWeight: FontWeight.w500,
              color: editing ? Colors.white : AppColors.ink,
            ),
          ),
        ]),
      ),
    );
  }
}
