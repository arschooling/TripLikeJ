import 'package:flutter/material.dart';
import '../theme/colors.dart';

class FloatingTabBar extends StatelessWidget {
  final int index;
  final ValueChanged<int> onChanged;

  const FloatingTabBar({super.key, required this.index, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final tabs = [
      (icon: Icons.calendar_today_rounded, label: '일정'),
      (icon: Icons.map_rounded, label: '지도'),
      (icon: Icons.restaurant_rounded, label: '맛집'),
      (icon: Icons.checklist_rounded, label: '준비'),
    ];
    final bottom = MediaQuery.of(context).padding.bottom;

    return Positioned(
      left: 14, right: 14,
      bottom: 14 + bottom,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 9),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.92),
          borderRadius: BorderRadius.circular(26),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6, offset: const Offset(0, 2)),
            BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 30, offset: const Offset(0, 10)),
          ],
          border: Border.all(color: c.line, width: 0.5),
        ),
        child: Row(
          children: tabs.asMap().entries.map((e) {
            final active = e.key == index;
            return Expanded(
              child: GestureDetector(
                onTap: () => onChanged(e.key),
                behavior: HitTestBehavior.opaque,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(e.value.icon, size: 20, color: active ? c.ink : c.mute),
                    const SizedBox(height: 3),
                    Text(
                      e.value.label,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: active ? FontWeight.w600 : FontWeight.w400,
                        color: active ? c.ink : c.mute,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}
