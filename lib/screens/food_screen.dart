import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/trip.dart';
import '../providers/trips_provider.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';
import '../theme/tokens.dart';
import '../widgets/bottom_sheet_modal.dart';
import '../widgets/edit_button.dart';

class FoodScreen extends ConsumerStatefulWidget {
  final int tripIndex;

  const FoodScreen({super.key, required this.tripIndex});

  @override
  ConsumerState<FoodScreen> createState() => _FoodScreenState();
}

class _FoodScreenState extends ConsumerState<FoodScreen> {
  bool _editing = false;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final tripsAsync = ref.watch(tripsProvider);
    final trips = tripsAsync.value;
    if (trips == null || widget.tripIndex >= trips.length) {
      return const SizedBox.shrink();
    }
    final trip = trips[widget.tripIndex];
    final food = trip.food;

    // Group by cat
    final Map<String, List<(int, TripFood)>> grouped = {};
    for (int i = 0; i < food.length; i++) {
      final cat = food[i].cat.isEmpty ? '기타' : food[i].cat;
      grouped.putIfAbsent(cat, () => []);
      grouped[cat]!.add((i, food[i]));
    }

    return Column(
      children: [
        // Header bar
        Padding(
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.pagePad, 8, AppSpacing.pagePad, 8),
          child: Row(
            children: [
              Text('맛집 가이드', style: AppText.serif(18)),
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
        Expanded(
          child: food.isEmpty && !_editing
              ? Center(
                  child: Text('맛집을 추가해보세요',
                      style: AppText.sans(14, color: c.mute)))
              : ListView(
                  padding: const EdgeInsets.all(AppSpacing.pagePad),
                  children: [
                    ...grouped.entries.map((entry) {
                      final catName = entry.key;
                      final items = entry.value;
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Section header
                          Padding(
                            padding:
                                const EdgeInsets.only(bottom: 8, top: 4),
                            child: Text(
                              catName,
                              style: AppText.mono(10,
                                  color: c.accent,
                                  letterSpacing: 1.2),
                            ),
                          ),
                          ...items.map((t) {
                            final idx = t.$1;
                            final item = t.$2;
                            return Padding(
                              padding: const EdgeInsets.only(
                                  bottom: AppSpacing.listGap),
                              child: _FoodCard(
                                food: item,
                                editing: _editing,
                                onDelete: () => ref
                                    .read(tripsProvider.notifier)
                                    .deleteFood(widget.tripIndex, idx),
                                onEdit: () => _editItem(context, idx, item),
                              ),
                            );
                          }),
                          if (_editing)
                            GestureDetector(
                              onTap: () => _addItem(context, catName),
                              child: Container(
                                margin: const EdgeInsets.only(
                                    bottom: AppSpacing.listGap),
                                padding:
                                    const EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  color: c.soft,
                                  borderRadius:
                                      BorderRadius.circular(AppRadius.card),
                                ),
                                alignment: Alignment.center,
                                child: Text('+ $catName 추가',
                                    style: AppText.sans(13,
                                        color: c.mute)),
                              ),
                            ),
                          const SizedBox(height: 8),
                        ],
                      );
                    }),
                    if (_editing)
                      GestureDetector(
                        onTap: () => _addItem(context, ''),
                        child: Container(
                          padding:
                              const EdgeInsets.symmetric(vertical: 14),
                          decoration: BoxDecoration(
                            color: c.soft,
                            borderRadius:
                                BorderRadius.circular(AppRadius.card),
                          ),
                          alignment: Alignment.center,
                          child: Text('+ 새 항목 추가',
                              style: AppText.sans(13, color: c.mute)),
                        ),
                      ),
                  ],
                ),
        ),
      ],
    );
  }

  void _addItem(BuildContext ctx, String defaultCat) {
    final blank = TripFood(cat: defaultCat, name: '');
    _showFoodForm(ctx, null, blank);
  }

  void _editItem(BuildContext ctx, int idx, TripFood item) {
    _showFoodForm(ctx, idx, item);
  }

  void _showFoodForm(BuildContext ctx, int? idx, TripFood item) {
    showGeneralDialog(
      context: ctx,
      barrierDismissible: false,
      barrierColor: Colors.transparent,
      pageBuilder: (dCtx, _, __) {
        TripFood current = item;
        return BottomSheetModal(
          title: idx == null ? '맛집 추가' : '맛집 편집',
          onCancel: () => Navigator.pop(dCtx),
          onConfirm: () {
            final trips =
                ref.read(tripsProvider).value ?? [];
            if (widget.tripIndex >= trips.length) {
              Navigator.pop(dCtx);
              return;
            }
            final newFood = [...trips[widget.tripIndex].food];
            if (idx == null) {
              newFood.add(current);
            } else {
              newFood[idx] = current;
            }
            ref
                .read(tripsProvider.notifier)
                .patchTrip(widget.tripIndex, food: newFood);
            Navigator.pop(dCtx);
          },
          child: _FoodForm(
            initial: item,
            onChanged: (f) => current = f,
          ),
        );
      },
    );
  }
}

class _FoodCard extends StatelessWidget {
  final TripFood food;
  final bool editing;
  final VoidCallback onDelete;
  final VoidCallback onEdit;

  const _FoodCard({
    required this.food,
    required this.editing,
    required this.onDelete,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return GestureDetector(
      onTap: editing ? onEdit : null,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.cardPadSm),
        decoration: BoxDecoration(
          color: c.card,
          borderRadius: BorderRadius.circular(AppRadius.card),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(food.name, style: AppText.sans(14, weight: FontWeight.w600)),
                  if (food.detail.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(food.detail,
                        style: AppText.sans(13, color: c.mute)),
                  ],
                  if (food.price.isNotEmpty) ...[
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: c.softer,
                        borderRadius:
                            BorderRadius.circular(AppRadius.chip),
                      ),
                      child: Text(food.price,
                          style: AppText.mono(10, letterSpacing: 0.5)),
                    ),
                  ],
                  if (food.note.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(food.note,
                        style: AppText.sans(12, color: c.mute)),
                  ],
                ],
              ),
            ),
            if (editing)
              GestureDetector(
                onTap: onDelete,
                child: const Padding(
                  padding: EdgeInsets.only(left: 8),
                  child: Icon(Icons.remove_circle,
                      color: c.accent, size: 20),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _FoodForm extends StatefulWidget {
  final TripFood initial;
  final void Function(TripFood) onChanged;

  const _FoodForm({required this.initial, required this.onChanged});

  @override
  State<_FoodForm> createState() => _FoodFormState();
}

class _FoodFormState extends State<_FoodForm> {
  late TextEditingController _catCtrl;
  late TextEditingController _nameCtrl;
  late TextEditingController _detailCtrl;
  late TextEditingController _priceCtrl;
  late TextEditingController _noteCtrl;

  @override
  void initState() {
    super.initState();
    _catCtrl = TextEditingController(text: widget.initial.cat);
    _nameCtrl = TextEditingController(text: widget.initial.name);
    _detailCtrl = TextEditingController(text: widget.initial.detail);
    _priceCtrl = TextEditingController(text: widget.initial.price);
    _noteCtrl = TextEditingController(text: widget.initial.note);
    _notify();
    for (final c in [_catCtrl, _nameCtrl, _detailCtrl, _priceCtrl, _noteCtrl]) {
      c.addListener(_notify);
    }
  }

  void _notify() {
    widget.onChanged(TripFood(
      cat: _catCtrl.text,
      name: _nameCtrl.text,
      detail: _detailCtrl.text,
      price: _priceCtrl.text,
      note: _noteCtrl.text,
    ));
  }

  @override
  void dispose() {
    _catCtrl.dispose();
    _nameCtrl.dispose();
    _detailCtrl.dispose();
    _priceCtrl.dispose();
    _noteCtrl.dispose();
    super.dispose();
  }

  Widget _field(BuildContext context, String label, TextEditingController ctrl, {int maxLines = 1}) {
    final c = context.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppText.sans(11, color: c.mute)),
        const SizedBox(height: 4),
        TextField(
          controller: ctrl,
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
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const SizedBox(height: 16),
        _field(context, '카테고리', _catCtrl),
        const SizedBox(height: 10),
        _field(context, '이름', _nameCtrl),
        const SizedBox(height: 10),
        _field(context, '설명', _detailCtrl),
        const SizedBox(height: 10),
        Row(children: [
          Expanded(child: _field(context, '가격', _priceCtrl)),
        ]),
        const SizedBox(height: 10),
        _field(context, '메모', _noteCtrl, maxLines: 2),
        const SizedBox(height: 8),
      ],
    );
  }
}
