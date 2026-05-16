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
  final Map<String, bool> _checked = {};
  bool _addingCat = false;
  final _catNameCtrl = TextEditingController();

  @override
  void dispose() {
    _catNameCtrl.dispose();
    super.dispose();
  }

  bool _isChecked(String catId, int idx) => _checked['$catId-$idx'] ?? false;

  void _toggle(String catId, int idx) {
    final key = '$catId-$idx';
    setState(() => _checked[key] = !(_checked[key] ?? false));
  }

  void _confirmAddCat() {
    final name = _catNameCtrl.text.trim();
    if (name.isEmpty) {
      setState(() => _addingCat = false);
      return;
    }
    ref.read(tripsProvider.notifier).addPrepCat(widget.tripIndex, name);
    _catNameCtrl.clear();
    setState(() => _addingCat = false);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final trips = ref.watch(tripsProvider).value;
    if (trips == null || widget.tripIndex >= trips.length) return const SizedBox.shrink();
    final trip = trips[widget.tripIndex];
    final cats = trip.prep.cats;

    final totalItems = cats.fold(0, (s, cat) => s + cat.items.length);
    final checkedItems = _checked.values.where((v) => v).length;

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(AppSpacing.pagePad, 8, AppSpacing.pagePad, 8),
          child: Row(
            children: [
              Text('준비물', style: AppText.serif(18)),
              const Spacer(),
              EditButton(
                editing: _editing,
                canUndo: ref.watch(canUndoProvider),
                onUndo: () => ref.read(tripsProvider.notifier).undo(),
                onTap: () => setState(() => _editing = !_editing),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePad),
          child: Row(
            children: [
              Expanded(child: _StatCard(label: '전체', value: '$totalItems')),
              const SizedBox(width: 10),
              Expanded(child: _StatCard(label: '완료', value: '$checkedItems', highlight: true)),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Expanded(
          child: Column(
            children: [
              Expanded(
                child: ReorderableListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePad),
                  buildDefaultDragHandles: false,
                  onReorder: (oldIndex, newIndex) =>
                      ref.read(tripsProvider.notifier).reorderPrepCats(widget.tripIndex, oldIndex, newIndex),
                  itemCount: cats.length,
                  itemBuilder: (ctx, i) {
                    final cat = cats[i];
                    return ReorderableDelayedDragStartListener(
                      key: ValueKey(cat.id),
                      index: i,
                      child: _PrepCatSection(
                        cat: cat,
                        editing: _editing,
                        isChecked: (idx) => _isChecked(cat.id, idx),
                        onToggle: (idx) => _toggle(cat.id, idx),
                        onDelete: () => ref.read(tripsProvider.notifier).deletePrepCat(widget.tripIndex, i),
                        onRename: (name) => ref.read(tripsProvider.notifier).renamePrepCat(widget.tripIndex, i, name),
                        onAddItem: (item) => ref.read(tripsProvider.notifier).addPrepCatItem(widget.tripIndex, i, item),
                        onDeleteItem: (ii) => ref.read(tripsProvider.notifier).deletePrepCatItem(widget.tripIndex, i, ii),
                      ),
                    );
                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(AppSpacing.pagePad, 8, AppSpacing.pagePad, 18),
                child: _addingCat ? _buildAddCatInput(c) : _buildAddCatButton(c),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAddCatButton(dynamic c) {
    return GestureDetector(
      onTap: () {
        _catNameCtrl.clear();
        setState(() => _addingCat = true);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(AppRadius.card),
          border: Border.all(color: c.line, width: 1.5),
        ),
        alignment: Alignment.center,
        child: Text('+ 카테고리 추가', style: AppText.sans(13, color: c.mute)),
      ),
    );
  }

  Widget _buildAddCatInput(dynamic c) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(AppRadius.card),
        border: Border.all(color: c.accent.withValues(alpha: 0.4)),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _catNameCtrl,
              autofocus: true,
              style: AppText.sans(14),
              decoration: InputDecoration(
                hintText: '카테고리 이름',
                hintStyle: AppText.sans(14, color: c.mute),
                border: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.zero,
              ),
              onSubmitted: (_) => _confirmAddCat(),
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: () => setState(() {
              _addingCat = false;
              _catNameCtrl.clear();
            }),
            child: Text('취소', style: AppText.sans(13, color: c.mute)),
          ),
          const SizedBox(width: 12),
          GestureDetector(
            onTap: _confirmAddCat,
            child: Text('추가', style: AppText.sans(13, color: c.accent, weight: FontWeight.w600)),
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
  const _StatCard({required this.label, required this.value, this.highlight = false});

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
      decoration: BoxDecoration(
        color: highlight ? c.accent.withValues(alpha: 0.1) : c.card,
        borderRadius: BorderRadius.circular(AppRadius.card),
        border: highlight ? Border.all(color: c.accent.withValues(alpha: 0.3)) : null,
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
          Text(value, style: AppText.serif(28, color: highlight ? c.accent : c.ink)),
          Text(label, style: AppText.sans(12, color: c.mute)),
        ],
      ),
    );
  }
}

class _PrepCatSection extends StatefulWidget {
  final PrepCat cat;
  final bool editing;
  final bool Function(int) isChecked;
  final void Function(int) onToggle;
  final VoidCallback onDelete;
  final void Function(String) onRename;
  final void Function(String) onAddItem;
  final void Function(int) onDeleteItem;

  const _PrepCatSection({
    required this.cat,
    required this.editing,
    required this.isChecked,
    required this.onToggle,
    required this.onDelete,
    required this.onRename,
    required this.onAddItem,
    required this.onDeleteItem,
  });

  @override
  State<_PrepCatSection> createState() => _PrepCatSectionState();
}

class _PrepCatSectionState extends State<_PrepCatSection> {
  bool _expanded = true;
  bool _addingItem = false;
  final _itemCtrl = TextEditingController();

  @override
  void dispose() {
    _itemCtrl.dispose();
    super.dispose();
  }

  void _addItem() {
    final text = _itemCtrl.text.trim();
    if (text.isEmpty) {
      setState(() => _addingItem = false);
      return;
    }
    widget.onAddItem(text);
    _itemCtrl.clear();
    setState(() => _addingItem = false);
  }

  void _rename(BuildContext ctx) {
    final c = ctx.colors;
    final ctrl = TextEditingController(text: widget.cat.name);
    showDialog(
      context: ctx,
      builder: (dCtx) => AlertDialog(
        backgroundColor: c.card,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.sheet)),
        title: Text('카테고리 이름 변경', style: AppText.serif(16)),
        content: TextField(
          controller: ctrl,
          autofocus: true,
          style: AppText.sans(14),
          decoration: InputDecoration(
            hintStyle: AppText.sans(14, color: c.mute),
            filled: true,
            fillColor: c.softer,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.input),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          ),
          onSubmitted: (_) {
            final name = ctrl.text.trim();
            if (name.isNotEmpty) widget.onRename(name);
            Navigator.pop(dCtx);
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dCtx),
            child: Text('취소', style: AppText.sans(13, color: c.mute)),
          ),
          TextButton(
            onPressed: () {
              final name = ctrl.text.trim();
              if (name.isNotEmpty) widget.onRename(name);
              Navigator.pop(dCtx);
            },
            child: Text('저장', style: AppText.sans(13, color: c.accent, weight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GestureDetector(
          onTap: () => setState(() => _expanded = !_expanded),
          onLongPress: widget.editing ? () => _rename(context) : null,
          child: Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              children: [
                Icon(
                  _expanded ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded,
                  size: 18,
                  color: c.mute,
                ),
                const SizedBox(width: 4),
                Text(
                  widget.cat.name.toUpperCase(),
                  style: AppText.sans(15, color: c.mute, weight: FontWeight.w600),
                ),
                const SizedBox(width: 6),
                Text('(${widget.cat.items.length})', style: AppText.mono(10, letterSpacing: 0.5)),
                const Spacer(),
                if (widget.editing) ...[
                  GestureDetector(
                    onTap: () => _rename(context),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: Icon(Icons.edit_rounded, size: 16, color: c.mute),
                    ),
                  ),
                  GestureDetector(
                    onTap: widget.onDelete,
                    child: Padding(
                      padding: const EdgeInsets.only(left: 4),
                      child: Icon(Icons.remove_circle, color: c.accent, size: 18),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
        if (_expanded) ...[
          ...widget.cat.items.asMap().entries.map((e) {
            final idx = e.key;
            final item = e.value;
            final checked = widget.isChecked(idx);
            return Dismissible(
              key: Key('${widget.cat.id}-$idx-$item'),
              direction: widget.editing ? DismissDirection.endToStart : DismissDirection.none,
              onDismissed: (_) => widget.onDeleteItem(idx),
              background: Container(
                alignment: Alignment.centerRight,
                color: c.accent,
                padding: const EdgeInsets.only(right: 16),
                child: const Icon(Icons.delete_rounded, color: Colors.white, size: 20),
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
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 0),
                  leading: GestureDetector(
                    onTap: () => widget.onToggle(idx),
                    child: Container(
                      width: 22,
                      height: 22,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: checked ? c.accent : Colors.transparent,
                        border: Border.all(
                          color: checked ? c.accent : c.line,
                          width: 1.5,
                        ),
                      ),
                      child: checked
                          ? const Icon(Icons.check_rounded, size: 13, color: Colors.white)
                          : null,
                    ),
                  ),
                  title: Text(item, style: AppText.sans(13, color: checked ? c.mute : c.ink)),
                  trailing: widget.editing
                      ? GestureDetector(
                          onTap: () => widget.onDeleteItem(idx),
                          child: Icon(Icons.remove_circle, color: c.accent, size: 18),
                        )
                      : null,
                ),
              ),
            );
          }),
          if (_addingItem)
            Container(
              margin: const EdgeInsets.only(bottom: 6),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: c.card,
                borderRadius: BorderRadius.circular(AppRadius.card),
              ),
              child: Row(
                children: [
                  Container(
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: c.line, width: 1.5),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextField(
                      controller: _itemCtrl,
                      autofocus: true,
                      style: AppText.sans(13),
                      decoration: InputDecoration(
                        hintText: '항목 입력...',
                        hintStyle: AppText.sans(13, color: c.mute),
                        border: InputBorder.none,
                        isDense: true,
                        contentPadding: EdgeInsets.zero,
                      ),
                      onSubmitted: (_) => _addItem(),
                    ),
                  ),
                  GestureDetector(
                    onTap: () => setState(() {
                      _addingItem = false;
                      _itemCtrl.clear();
                    }),
                    child: Text('취소', style: AppText.sans(12, color: c.mute)),
                  ),
                  const SizedBox(width: 10),
                  GestureDetector(
                    onTap: _addItem,
                    child: Text('추가', style: AppText.sans(12, color: c.accent, weight: FontWeight.w600)),
                  ),
                ],
              ),
            )
          else
            GestureDetector(
              onTap: () {
                _itemCtrl.clear();
                setState(() => _addingItem = true);
              },
              child: Container(
                margin: const EdgeInsets.only(bottom: 6),
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: c.soft,
                  borderRadius: BorderRadius.circular(AppRadius.card),
                ),
                alignment: Alignment.center,
                child: Text('+ 추가', style: AppText.sans(13, color: c.mute)),
              ),
            ),
          const SizedBox(height: AppSpacing.sectionGap),
        ],
      ],
    );
  }
}
