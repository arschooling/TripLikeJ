import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/trip.dart';
import '../providers/trips_provider.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';
import '../theme/tokens.dart';
import '../widgets/edit_button.dart';

class PrepScreen extends ConsumerStatefulWidget {
  final int tripIndex;

  const PrepScreen({super.key, required this.tripIndex});

  @override
  ConsumerState<PrepScreen> createState() => _PrepScreenState();
}

class _PrepScreenState extends ConsumerState<PrepScreen> {
  bool _editing = false;

  // Local checkbox states (not persisted)
  final Map<String, bool> _checked = {};

  bool _isChecked(String section, int idx, String item) {
    return _checked['$section-$idx-$item'] ?? false;
  }

  void _toggle(String section, int idx, String item) {
    final key = '$section-$idx-$item';
    setState(() => _checked[key] = !(_checked[key] ?? false));
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final tripsAsync = ref.watch(tripsProvider);
    final trips = tripsAsync.value;
    if (trips == null || widget.tripIndex >= trips.length) {
      return const SizedBox.shrink();
    }
    final trip = trips[widget.tripIndex];
    final prep = trip.prep;

    final sections = [
      ('체크리스트', prep.checklist, 'checklist'),
      ('서류/예약', prep.docs, 'docs'),
      ('짐 싸기', prep.pack, 'pack'),
    ];

    final total = prep.checklist.length + prep.docs.length + prep.pack.length;
    final checked = _checked.values.where((v) => v).length;

    return Column(
      children: [
        // Header
        Padding(
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.pagePad, 8, AppSpacing.pagePad, 8),
          child: Row(
            children: [
              Text('준비물', style: AppText.serif(18)),
              const Spacer(),
              EditButton(
                editing: _editing,
                canUndo: ref.watch(canUndoProvider),
                onUndo: () => ref.read(tripsProvider.notifier).undo(),
                onTap: () {
                  setState(() => _editing = !_editing);
                },
              ),
            ],
          ),
        ),
        // Stats row
        Padding(
          padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.pagePad),
          child: Row(
            children: [
              Expanded(
                child: _StatCard(
                  label: '전체',
                  value: '$total',
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _StatCard(
                  label: '완료',
                  value: '$checked',
                  highlight: true,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        // Sections
        Expanded(
          child: ListView(
            padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.pagePad),
            children: sections.map((s) {
              final name = s.$1;
              final items = s.$2;
              final sectionKey = s.$3;
              return _PrepSection(
                name: name,
                items: items,
                sectionKey: sectionKey,
                editing: _editing,
                isChecked: (idx, item) => _isChecked(sectionKey, idx, item),
                onToggle: (idx, item) => _toggle(sectionKey, idx, item),
                onDelete: (idx) => ref
                    .read(tripsProvider.notifier)
                    .deletePrepItem(widget.tripIndex, sectionKey, idx),
                onAdd: () => _addItem(context, prep, sectionKey),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  void _addItem(BuildContext ctx, TripPrep prep, String section) {
    final c = ctx.colors;
    String text = '';
    showDialog(
      context: ctx,
      builder: (dCtx) => AlertDialog(
        backgroundColor: c.card,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.sheet)),
        title: Text('항목 추가', style: AppText.serif(16)),
        content: TextField(
          autofocus: true,
          onChanged: (v) => text = v,
          style: AppText.sans(14),
          decoration: InputDecoration(
            hintText: '항목 이름',
            hintStyle: AppText.sans(14, color: c.mute),
            filled: true,
            fillColor: c.softer,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.input),
              borderSide: BorderSide.none,
            ),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dCtx),
            child: Text('취소', style: AppText.sans(13, color: c.mute)),
          ),
          TextButton(
            onPressed: () {
              if (text.trim().isEmpty) return;
              final trips = ref.read(tripsProvider).value ?? [];
              if (widget.tripIndex >= trips.length) {
                Navigator.pop(dCtx);
                return;
              }
              final current = trips[widget.tripIndex].prep;
              TripPrep newPrep;
              switch (section) {
                case 'checklist':
                  newPrep = current.copyWith(
                      checklist: [...current.checklist, text.trim()]);
                  break;
                case 'docs':
                  newPrep = current.copyWith(
                      docs: [...current.docs, text.trim()]);
                  break;
                case 'pack':
                  newPrep = current.copyWith(
                      pack: [...current.pack, text.trim()]);
                  break;
                default:
                  newPrep = current;
              }
              ref
                  .read(tripsProvider.notifier)
                  .patchTrip(widget.tripIndex, prep: newPrep);
              Navigator.pop(dCtx);
            },
            child: Text('추가',
                style: AppText.sans(13,
                    color: c.accent, weight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final bool highlight;

  const _StatCard({
    required this.label,
    required this.value,
    this.highlight = false,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
      decoration: BoxDecoration(
        color: highlight ? c.accent.withValues(alpha: 0.1) : c.card,
        borderRadius: BorderRadius.circular(AppRadius.card),
        border: highlight
            ? Border.all(color: c.accent.withValues(alpha: 0.3))
            : null,
        boxShadow: highlight
            ? null
            : [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
      ),
      child: Column(
        children: [
          Text(
            value,
            style: AppText.serif(
                28, color: highlight ? c.accent : c.ink),
          ),
          Text(label, style: AppText.sans(12, color: c.mute)),
        ],
      ),
    );
  }
}

class _PrepSection extends StatefulWidget {
  final String name;
  final List<String> items;
  final String sectionKey;
  final bool editing;
  final bool Function(int, String) isChecked;
  final void Function(int, String) onToggle;
  final void Function(int) onDelete;
  final VoidCallback onAdd;

  const _PrepSection({
    required this.name,
    required this.items,
    required this.sectionKey,
    required this.editing,
    required this.isChecked,
    required this.onToggle,
    required this.onDelete,
    required this.onAdd,
  });

  @override
  State<_PrepSection> createState() => _PrepSectionState();
}

class _PrepSectionState extends State<_PrepSection> {
  bool _expanded = true;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section header
        GestureDetector(
          onTap: () => setState(() => _expanded = !_expanded),
          child: Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              children: [
                Text(
                  widget.name,
                  style: AppText.sans(13,
                      color: c.mute, weight: FontWeight.w500),
                ),
                const SizedBox(width: 6),
                Text(
                  '(${widget.items.length})',
                  style: AppText.mono(10, letterSpacing: 0.5),
                ),
                const Spacer(),
                Icon(
                  _expanded
                      ? Icons.keyboard_arrow_up_rounded
                      : Icons.keyboard_arrow_down_rounded,
                  size: 18,
                  color: c.mute,
                ),
              ],
            ),
          ),
        ),
        if (_expanded) ...[
          ...widget.items.asMap().entries.map((e) {
            final idx = e.key;
            final item = e.value;
            final checked = widget.isChecked(idx, item);
            return Dismissible(
              key: Key('${widget.sectionKey}-$idx-$item'),
              direction: widget.editing
                  ? DismissDirection.endToStart
                  : DismissDirection.none,
              onDismissed: (_) => widget.onDelete(idx),
              background: Container(
                alignment: Alignment.centerRight,
                color: c.accent,
                padding: const EdgeInsets.only(right: 16),
                child:
                    Icon(Icons.delete_rounded, color: Colors.white, size: 20),
              ),
              child: Container(
                margin: const EdgeInsets.only(bottom: 6),
                decoration: BoxDecoration(
                  color: c.card,
                  borderRadius: BorderRadius.circular(AppRadius.card),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.03),
                      blurRadius: 4,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
                child: ListTile(
                  dense: true,
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 0),
                  leading: GestureDetector(
                    onTap: () => widget.onToggle(idx, item),
                    child: Container(
                      width: 22,
                      height: 22,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color:
                            checked ? c.accent : Colors.transparent,
                        border: Border.all(
                          color: checked ? c.accent : c.line,
                          width: 1.5,
                        ),
                      ),
                      child: checked
                          ? const Icon(Icons.check_rounded,
                              size: 13, color: Colors.white)
                          : null,
                    ),
                  ),
                  title: Text(
                    item,
                    style: AppText.sans(
                      13,
                      color: checked ? c.mute : c.ink,
                    ),
                  ),
                  trailing: widget.editing
                      ? GestureDetector(
                          onTap: () => widget.onDelete(idx),
                          child: const Icon(Icons.remove_circle,
                              color: c.accent, size: 18),
                        )
                      : null,
                ),
              ),
            );
          }),
          if (widget.editing)
            GestureDetector(
              onTap: widget.onAdd,
              child: Container(
                margin: const EdgeInsets.only(bottom: 6),
                padding:
                    const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: c.soft,
                  borderRadius: BorderRadius.circular(AppRadius.card),
                ),
                alignment: Alignment.center,
                child: Text('+ 추가',
                    style: AppText.sans(13, color: c.mute)),
              ),
            ),
          const SizedBox(height: AppSpacing.sectionGap),
        ],
      ],
    );
  }
}
