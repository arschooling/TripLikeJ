import 'package:flutter/material.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';

class DatePickerContent extends StatefulWidget {
  final DateTime? initialDate;
  final void Function(DateTime) onDateSelected;

  const DatePickerContent({
    super.key,
    this.initialDate,
    required this.onDateSelected,
  });

  @override
  State<DatePickerContent> createState() => _DatePickerContentState();
}

class _DatePickerContentState extends State<DatePickerContent> {
  late DateTime _month; // first day of displayed month
  DateTime? _selected;

  static const _weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _selected = widget.initialDate;
    _month = DateTime(
      widget.initialDate?.year ?? now.year,
      widget.initialDate?.month ?? now.month,
    );
  }

  void _prev() => setState(() => _month = DateTime(_month.year, _month.month - 1));
  void _next() => setState(() => _month = DateTime(_month.year, _month.month + 1));

  bool _isToday(DateTime d) {
    final now = DateTime.now();
    return d.year == now.year && d.month == now.month && d.day == now.day;
  }

  bool _isSelected(DateTime d) {
    return _selected != null &&
        d.year == _selected!.year &&
        d.month == _selected!.month &&
        d.day == _selected!.day;
  }

  bool _isPast(DateTime d) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    return d.isBefore(today);
  }

  List<DateTime?> _buildCalendarDays() {
    final firstOfMonth = _month;
    final startWeekday = firstOfMonth.weekday % 7; // Sunday=0
    final daysInMonth = DateTime(_month.year, _month.month + 1, 0).day;

    final cells = <DateTime?>[];
    for (int i = 0; i < startWeekday; i++) {
      cells.add(null); // padding
    }
    for (int d = 1; d <= daysInMonth; d++) {
      cells.add(DateTime(_month.year, _month.month, d));
    }
    // pad to complete final row
    while (cells.length % 7 != 0) {
      cells.add(null);
    }
    return cells;
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final days = _buildCalendarDays();
    final monthLabel =
        '${_month.year}년 ${_month.month}월';

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const SizedBox(height: 16),
        // Month nav
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _NavButton(icon: Icons.chevron_left_rounded, onTap: _prev),
            const SizedBox(width: 12),
            Text(monthLabel, style: AppText.sans(15, weight: FontWeight.w600)),
            const SizedBox(width: 12),
            _NavButton(icon: Icons.chevron_right_rounded, onTap: _next),
          ],
        ),
        const SizedBox(height: 14),
        // Weekday headers
        Row(
          children: _weekdays.asMap().entries.map((e) {
            Color col = c.mute;
            if (e.key == 0) col = c.sundayRed;
            if (e.key == 6) col = c.saturdayBlue;
            return Expanded(
              child: Center(
                child: Text(
                  e.value,
                  style: AppText.mono(9.5,
                      color: col, letterSpacing: 0.08 * 9.5),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 6),
        // Calendar grid
        GridView.count(
          crossAxisCount: 7,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 4,
          crossAxisSpacing: 0,
          children: days.map((d) {
            if (d == null) return const SizedBox.shrink();
            final selected = _isSelected(d);
            final today = _isToday(d);
            final past = _isPast(d);
            final weekday = d.weekday % 7; // 0=Sun, 6=Sat

            Color textColor = c.ink;
            if (past) textColor = c.disabledDate;
            if (weekday == 0 && !past && !selected) textColor = c.sundayRed;
            if (weekday == 6 && !past && !selected) textColor = c.saturdayBlue;
            if (selected) textColor = c.bg;

            return GestureDetector(
              onTap: past
                  ? null
                  : () {
                      setState(() => _selected = d);
                      widget.onDateSelected(d);
                    },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 30,
                    height: 30,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: selected ? c.ink : Colors.transparent,
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      '${d.day}',
                      style: AppText.sans(
                        13,
                        color: textColor,
                        weight: selected ? FontWeight.w600 : FontWeight.w400,
                      ),
                    ),
                  ),
                  if (today && !selected)
                    Container(
                      width: 3,
                      height: 3,
                      margin: const EdgeInsets.only(top: 2),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: c.accent,
                      ),
                    ),
                ],
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 8),
      ],
    );
  }
}

class _NavButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _NavButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 30,
        height: 30,
        decoration: const BoxDecoration(
          shape: BoxShape.circle,
          color: c.soft,
        ),
        alignment: Alignment.center,
        child: Icon(icon, size: 18, color: c.ink),
      ),
    );
  }
}
