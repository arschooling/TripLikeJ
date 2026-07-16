import 'package:flutter/material.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';
import '../theme/tokens.dart';

class BottomSheetModal extends StatefulWidget {
  final String title;
  final VoidCallback? onConfirm;
  final VoidCallback onCancel;
  final Widget child;

  const BottomSheetModal({
    super.key,
    required this.title,
    this.onConfirm,
    required this.onCancel,
    required this.child,
  });

  @override
  State<BottomSheetModal> createState() => _BottomSheetModalState();
}

class _BottomSheetModalState extends State<BottomSheetModal>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _fade;
  late Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 260),
    );
    _fade = CurvedAnimation(parent: _ctrl, curve: Curves.easeOutCubic);
    _slide = Tween<Offset>(
      begin: const Offset(0, 0.15),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOutCubic));
    _ctrl.forward();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  Future<void> _dismiss() async {
    await _ctrl.reverse();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return FadeTransition(
      opacity: _fade,
      child: GestureDetector(
        onTap: () async {
          await _dismiss();
          widget.onCancel();
        },
        behavior: HitTestBehavior.opaque,
        child: Container(
          color: Colors.black.withValues(alpha: 0.45),
          alignment: Alignment.center,
          child: SlideTransition(
            position: _slide,
            child: GestureDetector(
              onTap: () {}, // absorb taps so backdrop doesn't fire
              child: Container(
                constraints: const BoxConstraints(maxWidth: 360),
                margin: const EdgeInsets.symmetric(horizontal: 18),
                decoration: BoxDecoration(
                  color: c.card,
                  borderRadius: BorderRadius.circular(AppRadius.sheet),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.12),
                      blurRadius: 40,
                      offset: const Offset(0, 12),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Drag handle
                    Padding(
                      padding: const EdgeInsets.only(top: 12),
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: c.line,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    // Header row
                    Padding(
                      padding: const EdgeInsets.fromLTRB(18, 12, 18, 0),
                      child: Row(
                        children: [
                          GestureDetector(
                            onTap: () async {
                              await _dismiss();
                              widget.onCancel();
                            },
                            child: Text(
                              '취소',
                              style: AppText.sans(13, color: c.mute),
                            ),
                          ),
                          Expanded(
                            child: Center(
                              child: Text(
                                widget.title,
                                style: AppText.serif(15),
                              ),
                            ),
                          ),
                          GestureDetector(
                            onTap: () async {
                              await _dismiss();
                              widget.onConfirm?.call();
                            },
                            child: Text(
                              '완료',
                              style: AppText.sans(13,
                                  color: c.accent,
                                  weight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Content
                    Padding(
                      padding: const EdgeInsets.fromLTRB(18, 0, 18, 18),
                      child: widget.child,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
