import 'package:flutter/material.dart';
import '../models/trip.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';
import '../theme/tokens.dart';
import 'bottom_sheet_modal.dart';
import 'time_wheel_sheet.dart';

class StopFormContent extends StatefulWidget {
  final TripStop initial;
  final void Function(TripStop) onSave;

  const StopFormContent({
    super.key,
    required this.initial,
    required this.onSave,
  });

  @override
  State<StopFormContent> createState() => StopFormState();
}

class StopFormState extends State<StopFormContent> {
  late String _time;
  late StopCategory _cat;
  late TextEditingController _titleCtrl;
  late TextEditingController _enCtrl;
  late TextEditingController _locCtrl;
  late TextEditingController _noteCtrl;
  late TextEditingController _priceCtrl;
  late TextEditingController _durationCtrl;

  @override
  void initState() {
    super.initState();
    _time = widget.initial.time;
    _cat = widget.initial.cat;
    _titleCtrl = TextEditingController(text: widget.initial.title);
    _enCtrl = TextEditingController(text: widget.initial.en);
    _locCtrl = TextEditingController(text: widget.initial.loc);
    _noteCtrl = TextEditingController(text: widget.initial.note ?? '');
    _priceCtrl = TextEditingController(text: widget.initial.price ?? '');
    _durationCtrl = TextEditingController(text: widget.initial.duration ?? '');
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _enCtrl.dispose();
    _locCtrl.dispose();
    _noteCtrl.dispose();
    _priceCtrl.dispose();
    _durationCtrl.dispose();
    super.dispose();
  }

  TripStop buildCurrentStop() => widget.initial.copyWith(
        time: _time,
        cat: _cat,
        title: _titleCtrl.text,
        en: _enCtrl.text,
        loc: _locCtrl.text,
        note: _noteCtrl.text.isEmpty ? null : _noteCtrl.text,
        price: _priceCtrl.text.isEmpty ? null : _priceCtrl.text,
        duration: _durationCtrl.text.isEmpty ? null : _durationCtrl.text,
      );

  TripStop _buildStop() => buildCurrentStop();

  Future<void> _pickTime() async {
    final result = await showGeneralDialog<String>(
      context: context,
      barrierDismissible: false,
      barrierColor: Colors.transparent,
      pageBuilder: (ctx, _, __) => _TimePickerDialog(
        initialTime: _time.isEmpty ? '12:00' : _time,
      ),
    );
    if (result != null && mounted) {
      setState(() => _time = result);
    }
  }

  Widget _field(BuildContext context, String label, TextEditingController ctrl,
      {TextInputType? keyboardType, int maxLines = 1}) {
    final c = context.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppText.sans(11, color: c.mute)),
        const SizedBox(height: 4),
        TextField(
          controller: ctrl,
          keyboardType: keyboardType,
          maxLines: maxLines,
          style: AppText.sans(14, color: c.ink),
          decoration: InputDecoration(
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            filled: true,
            fillColor: c.softer,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.input),
              borderSide: BorderSide.none,
            ),
            isDense: true,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return SingleChildScrollView(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 16),
          // Time picker
          Row(
            children: [
              Text('시간', style: AppText.sans(11, color: c.mute)),
              const SizedBox(width: 12),
              GestureDetector(
                onTap: _pickTime,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: c.softer,
                    borderRadius: BorderRadius.circular(AppRadius.input),
                  ),
                  child: Text(
                    _time.isEmpty ? '--:--' : _time,
                    style: AppText.mono(14, color: c.ink, letterSpacing: 1),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          // Category chips
          Text('카테고리', style: AppText.sans(11, color: c.mute)),
          const SizedBox(height: 6),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: StopCategory.values.map((cat) {
                final active = cat == _cat;
                return GestureDetector(
                  onTap: () => setState(() => _cat = cat),
                  child: Container(
                    margin: const EdgeInsets.only(right: 6),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: active ? c.ink : c.softer,
                      borderRadius: BorderRadius.circular(AppRadius.chip),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          categoryEmoji(cat),
                          style: const TextStyle(fontSize: 13),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          cat.label,
                          style: AppText.sans(12,
                              color: active ? Colors.white : c.ink),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 14),
          _field(context, '제목', _titleCtrl),
          const SizedBox(height: 10),
          _field(context, '영문명', _enCtrl),
          const SizedBox(height: 10),
          _field(context, '장소', _locCtrl),
          const SizedBox(height: 10),
          _field(context, '메모', _noteCtrl, maxLines: 2),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(child: _field(context, '가격', _priceCtrl)),
              const SizedBox(width: 10),
              Expanded(child: _field(context, '소요시간', _durationCtrl)),
            ],
          ),
          const SizedBox(height: 8),
          // Save button
          SizedBox(
            width: double.infinity,
            child: GestureDetector(
              onTap: () {
                widget.onSave(_buildStop());
              },
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 14),
                decoration: BoxDecoration(
                  color: c.accent,
                  borderRadius: BorderRadius.circular(AppRadius.button),
                ),
                alignment: Alignment.center,
                child: Text(
                  '저장',
                  style: AppText.sans(14,
                      color: Colors.white, weight: FontWeight.w600),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TimePickerDialog extends StatefulWidget {
  final String initialTime;
  const _TimePickerDialog({required this.initialTime});

  @override
  State<_TimePickerDialog> createState() => _TimePickerDialogState();
}

class _TimePickerDialogState extends State<_TimePickerDialog> {
  late String _selected;

  @override
  void initState() {
    super.initState();
    _selected = widget.initialTime;
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return BottomSheetModal(
      title: '시간 선택',
      onCancel: () => Navigator.pop(context),
      onConfirm: () => Navigator.pop(context, _selected),
      child: TimeWheelContent(
        initialTime: widget.initialTime,
        onTimeSelected: (t) => setState(() => _selected = t),
      ),
    );
  }
}

String categoryEmoji(StopCategory cat) {
  switch (cat) {
    case StopCategory.flight:
      return '✈️';
    case StopCategory.hotel:
      return '🏨';
    case StopCategory.walk:
      return '🚶';
    case StopCategory.food:
      return '🍽';
    case StopCategory.view:
      return '🌅';
    case StopCategory.ferry:
      return '⛴';
    case StopCategory.sight:
      return '🏛';
    case StopCategory.shop:
      return '🛍';
    case StopCategory.show:
      return '🎭';
    case StopCategory.bar:
      return '🍸';
  }
}
