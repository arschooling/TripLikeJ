import 'package:flutter/material.dart';
import '../theme/colors.dart';

class EditButton extends StatelessWidget {
  final bool editing;
  final VoidCallback onTap;
  final bool compact;
  final bool canUndo;
  final VoidCallback? onUndo;

  const EditButton({
    super.key,
    required this.editing,
    required this.onTap,
    this.compact = false,
    this.canUndo = false,
    this.onUndo,
  });

  static bool _isMobile(BuildContext context) {
    final p = Theme.of(context).platform;
    return p == TargetPlatform.android || p == TargetPlatform.iOS;
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final isMobile = _isMobile(context);
    final showUndoBtn = !isMobile && canUndo && onUndo != null;

    final editBtn = GestureDetector(
      onTap: onTap,
      // 모바일: 꾹 누르면 되돌리기
      onLongPress: (isMobile && canUndo && onUndo != null) ? onUndo : null,
      child: Container(
        padding: EdgeInsets.symmetric(
          horizontal: compact ? 9 : 12,
          vertical: compact ? 5 : 6,
        ),
        decoration: BoxDecoration(
          color: editing ? c.accent : Color(0x0F1A1816),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Icon(
            editing ? Icons.check_rounded : Icons.edit_rounded,
            size: 12,
            color: editing ? Colors.white : c.ink,
          ),
          const SizedBox(width: 5),
          Text(
            editing ? '완료' : '편집',
            style: TextStyle(
              fontSize: 11.5,
              fontWeight: FontWeight.w500,
              color: editing ? Colors.white : c.ink,
            ),
          ),
        ]),
      ),
    );

    if (showUndoBtn) {
      // 데스크탑: ↩ 버튼을 편집 버튼 왼쪽에 표시
      return Row(mainAxisSize: MainAxisSize.min, children: [
        GestureDetector(
          onTap: onUndo,
          child: Container(
            padding: EdgeInsets.symmetric(
              horizontal: compact ? 7 : 10,
              vertical: compact ? 5 : 6,
            ),
            decoration: BoxDecoration(
              color: const Color(0x0F1A1816),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Text('↩', style: TextStyle(fontSize: 13)),
          ),
        ),
        const SizedBox(width: 6),
        editBtn,
      ]);
    }

    return editBtn;
  }
}
