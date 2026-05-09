import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/trip.dart';
import '../providers/trips_provider.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';
import '../theme/tokens.dart';
import '../widgets/edit_button.dart';
import '../widgets/photo_placeholder.dart';
import '../widgets/bottom_sheet_modal.dart';
import '../widgets/stop_form_sheet.dart';

class DayDetailScreen extends ConsumerStatefulWidget {
  final int tripIndex;
  final int dayIndex;

  const DayDetailScreen({
    super.key,
    required this.tripIndex,
    required this.dayIndex,
  });

  @override
  ConsumerState<DayDetailScreen> createState() => _DayDetailScreenState();
}

class _DayDetailScreenState extends ConsumerState<DayDetailScreen> {
  bool _editing = false;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final tripsAsync = ref.watch(tripsProvider);
    final trips = tripsAsync.value;
    if (trips == null ||
        widget.tripIndex >= trips.length ||
        widget.dayIndex >= trips[widget.tripIndex].days.length) {
      return Scaffold(
        backgroundColor: c.bg,
        body: Center(child: CircularProgressIndicator(color: c.accent)),
      );
    }
    final day = trips[widget.tripIndex].days[widget.dayIndex];

    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        child: Column(
          children: [
            // Top bar
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, AppSpacing.pagePad, 0),
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(Icons.arrow_back_ios_new_rounded,
                        size: 18, color: c.ink),
                    onPressed: () => Navigator.pop(context),
                  ),
                  Expanded(
                    child: Text(
                      'Day ${day.n} — ${day.date}',
                      style: AppText.serif(20, color: c.ink),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (day.weather.isNotEmpty)
                    Container(
                      margin: const EdgeInsets.only(right: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: c.soft,
                        borderRadius: BorderRadius.circular(AppRadius.chip),
                      ),
                      child: Text(day.weather,
                          style: AppText.mono(10, letterSpacing: 0.5, color: c.mute)),
                    ),
                  EditButton(
                    editing: _editing,
                    canUndo: ref.watch(canUndoProvider),
                    onUndo: () => ref.read(tripsProvider.notifier).undo(),
                    onTap: () { setState(() => _editing = !_editing); },
                  ),
                ],
              ),
            ),
            // Hero photo
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePad),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(AppRadius.card),
                  child: PhotoPlaceholder(hue: day.heroHue, label: day.heroLabel, height: 180),
                ),
              ),
            ),
            // Day title
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePad),
              child: Text(day.title, style: AppText.serif(22, color: c.ink)),
            ),
            const SizedBox(height: 14),
            // Timeline
            Expanded(
              child: day.items.isEmpty && !_editing
                  ? Center(
                      child: Text('일정이 없습니다',
                          style: AppText.sans(14, color: c.mute)))
                  : _editing
                      ? Theme(
                          data: Theme.of(context).copyWith(canvasColor: Colors.transparent),
                          child: ReorderableListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePad),
                            itemCount: day.items.length,
                            onReorder: (oldIdx, newIdx) {
                              if (newIdx > oldIdx) newIdx--;
                              ref.read(tripsProvider.notifier)
                                  .reorderStops(widget.tripIndex, widget.dayIndex, oldIdx, newIdx);
                            },
                            footer: Padding(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              child: GestureDetector(
                                onTap: () => ref.read(tripsProvider.notifier)
                                    .addStop(widget.tripIndex, widget.dayIndex),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                  decoration: BoxDecoration(
                                    color: c.soft,
                                    borderRadius: BorderRadius.circular(AppRadius.card),
                                  ),
                                  alignment: Alignment.center,
                                  child: Text('+ 일정 추가',
                                      style: AppText.sans(13, color: c.mute)),
                                ),
                              ),
                            ),
                            itemBuilder: (ctx, i) => _StopRow(
                              key: ValueKey('${day.items[i].title}-$i'),
                              stop: day.items[i],
                              isFirst: i == 0,
                              editing: _editing,
                              onDelete: () => ref.read(tripsProvider.notifier)
                                  .deleteStop(widget.tripIndex, widget.dayIndex, i),
                              onTap: () => _editStop(context, i, day.items[i]),
                            ),
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePad),
                          itemCount: day.items.length,
                          itemBuilder: (ctx, i) => _StopRow(
                            key: ValueKey('${day.items[i].title}-$i'),
                            stop: day.items[i],
                            isFirst: i == 0,
                            editing: _editing,
                            onDelete: () {},
                            onTap: () => _editStop(context, i, day.items[i]),
                          ),
                        ),
            ),
          ],
        ),
      ),
    );
  }

  void _editStop(BuildContext ctx, int stopIndex, TripStop stop) {
    final formKey = GlobalKey<StopFormState>();
    showGeneralDialog(
      context: ctx,
      barrierDismissible: false,
      barrierColor: Colors.transparent,
      pageBuilder: (dCtx, _, __) {
        return BottomSheetModal(
          title: '일정 편집',
          onCancel: () => Navigator.pop(dCtx),
          onConfirm: () {
            final updated = formKey.currentState?.buildCurrentStop() ?? stop;
            ref.read(tripsProvider.notifier)
                .saveStop(widget.tripIndex, widget.dayIndex, stopIndex, updated);
            Navigator.pop(dCtx);
          },
          child: StopFormContent(
            key: formKey,
            initial: stop,
            onSave: (s) {
              ref.read(tripsProvider.notifier)
                  .saveStop(widget.tripIndex, widget.dayIndex, stopIndex, s);
              Navigator.pop(dCtx);
            },
          ),
        );
      },
    );
  }
}

class _StopRow extends StatelessWidget {
  final TripStop stop;
  final bool isFirst;
  final bool editing;
  final VoidCallback onDelete;
  final VoidCallback onTap;

  const _StopRow({
    super.key, required this.stop, required this.isFirst,
    required this.editing, required this.onDelete, required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          if (!isFirst)
            Divider(color: c.line, height: 1),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  width: 52,
                  child: Text(stop.time, style: AppText.mono(11.5, letterSpacing: 0.5, color: c.mute)),
                ),
                Container(
                  width: 28, height: 28,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: c.ink.withValues(alpha: 0.08),
                  ),
                  alignment: Alignment.center,
                  child: Text(categoryEmoji(stop.cat),
                      style: const TextStyle(fontSize: 13)),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(stop.title,
                          style: AppText.sans(14, weight: FontWeight.w600, color: c.ink)),
                      if (stop.en.isNotEmpty) ...[
                        const SizedBox(height: 1),
                        Text(stop.en, style: AppText.mono(10, letterSpacing: 0.5, color: c.mute)),
                      ],
                      if (stop.note != null && stop.note!.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(stop.note!, style: AppText.sans(13, color: c.mute)),
                      ],
                      if (stop.price != null || stop.duration != null) ...[
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            if (stop.price != null) _Chip(stop.price!, c),
                            if (stop.price != null && stop.duration != null)
                              const SizedBox(width: 6),
                            if (stop.duration != null) _Chip(stop.duration!, c),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),
                if (editing) ...[
                  GestureDetector(
                    onTap: onDelete,
                    child: Icon(Icons.remove_circle, color: c.accent, size: 20),
                  ),
                  const SizedBox(width: 6),
                  Icon(Icons.drag_handle_rounded, color: c.mute, size: 20),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  final String text;
  final AppColors c;
  const _Chip(this.text, this.c);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: c.softer, borderRadius: BorderRadius.circular(AppRadius.chip),
      ),
      child: Text(text, style: AppText.mono(10, letterSpacing: 0.5, color: c.mute)),
    );
  }
}
