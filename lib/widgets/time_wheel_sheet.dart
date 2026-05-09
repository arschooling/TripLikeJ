import 'package:flutter/material.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';

class TimeWheelContent extends StatefulWidget {
  final String initialTime; // "HH:MM"
  final void Function(String) onTimeSelected;

  const TimeWheelContent({
    super.key,
    required this.initialTime,
    required this.onTimeSelected,
  });

  @override
  State<TimeWheelContent> createState() => _TimeWheelContentState();
}

class _TimeWheelContentState extends State<TimeWheelContent> {
  late FixedExtentScrollController _hourCtrl;
  late FixedExtentScrollController _minCtrl;

  late int _hour;
  late int _minIndex;

  static const _minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  @override
  void initState() {
    super.initState();
    final parts = widget.initialTime.split(':');
    _hour = int.tryParse(parts[0]) ?? 12;
    final rawMin = int.tryParse(parts.length > 1 ? parts[1] : '0') ?? 0;
    _minIndex = _closestMinuteIndex(rawMin);

    _hourCtrl = FixedExtentScrollController(initialItem: _hour);
    _minCtrl = FixedExtentScrollController(initialItem: _minIndex);
  }

  int _closestMinuteIndex(int m) {
    int best = 0;
    int bestDiff = 999;
    for (int i = 0; i < _minutes.length; i++) {
      final diff = (_minutes[i] - m).abs();
      if (diff < bestDiff) {
        bestDiff = diff;
        best = i;
      }
    }
    return best;
  }

  void _notify() {
    final time =
        '${_hour.toString().padLeft(2, '0')}:${_minutes[_minIndex].toString().padLeft(2, '0')}';
    widget.onTimeSelected(time);
  }

  @override
  void dispose() {
    _hourCtrl.dispose();
    _minCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const SizedBox(height: 16),
        SizedBox(
          height: 200,
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Center highlight lines
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(height: 1, color: c.line),
                  const SizedBox(height: 38),
                  Container(height: 1, color: c.line),
                ],
              ),
              Row(
                children: [
                  // Hours column
                  Expanded(
                    child: ListWheelScrollView.useDelegate(
                      controller: _hourCtrl,
                      itemExtent: 40,
                      physics: const FixedExtentScrollPhysics(),
                      onSelectedItemChanged: (i) {
                        setState(() => _hour = i);
                        _notify();
                      },
                      childDelegate: ListWheelChildBuilderDelegate(
                        builder: (context, i) {
                          if (i < 0 || i > 23) return null;
                          final active = i == _hour;
                          return Center(
                            child: Text(
                              i.toString().padLeft(2, '0'),
                              style: AppText.mono(
                                22,
                                color: active ? c.ink : c.mute,
                                letterSpacing: 0.5,
                              ),
                            ),
                          );
                        },
                        childCount: 24,
                      ),
                    ),
                  ),
                  // Separator
                  Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Text(
                      ':',
                      style: AppText.mono(22, color: c.ink, letterSpacing: 0),
                    ),
                  ),
                  // Minutes column
                  Expanded(
                    child: ListWheelScrollView.useDelegate(
                      controller: _minCtrl,
                      itemExtent: 40,
                      physics: const FixedExtentScrollPhysics(),
                      onSelectedItemChanged: (i) {
                        setState(() => _minIndex = i);
                        _notify();
                      },
                      childDelegate: ListWheelChildBuilderDelegate(
                        builder: (context, i) {
                          if (i < 0 || i >= _minutes.length) return null;
                          final active = i == _minIndex;
                          return Center(
                            child: Text(
                              _minutes[i].toString().padLeft(2, '0'),
                              style: AppText.mono(
                                22,
                                color: active ? c.ink : c.mute,
                                letterSpacing: 0.5,
                              ),
                            ),
                          );
                        },
                        childCount: _minutes.length,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
      ],
    );
  }
}
