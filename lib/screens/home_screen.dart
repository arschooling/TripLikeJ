import 'dart:convert';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import '../models/trip.dart';
import '../providers/trips_provider.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';
import '../theme/tokens.dart';
import '../widgets/edit_button.dart';
import '../widgets/floating_tab_bar.dart';
import '../widgets/photo_placeholder.dart';
import 'day_detail_screen.dart';
import 'hotel_detail_screen.dart';
import 'map_screen.dart';
import 'food_screen.dart';
import 'prep_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  final int tripIndex;

  const HomeScreen({super.key, required this.tripIndex});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _tab = 0;
  bool _editing = false;
  final Set<int> _visitedTabs = {0};
  TextEditingController? _titleController;

  @override
  void dispose() {
    _titleController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final tripsAsync = ref.watch(tripsProvider);
    final trips = tripsAsync.value;

    if (trips == null || widget.tripIndex >= trips.length) {
      return Scaffold(
        backgroundColor: c.bg,
        body: Center(
          child: CircularProgressIndicator(color: c.accent),
        ),
      );
    }

    final trip = trips[widget.tripIndex];
    _titleController ??= TextEditingController(text: trip.title);
    if (!_editing) _titleController!.text = trip.title;

    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            Column(
              children: [
                // Top bar
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                      8, 8, AppSpacing.pagePad, 0),
                  child: Row(
                    children: [
                      IconButton(
                        icon: Icon(Icons.arrow_back_ios_new_rounded,
                            size: 18, color: c.ink),
                        onPressed: () => Navigator.pop(context),
                      ),
                      Expanded(
                        child: _editing
                            ? TextField(
                                controller: _titleController,
                                style: AppText.serif(18, color: c.ink),
                                onSubmitted: (v) {
                                  ref
                                      .read(tripsProvider.notifier)
                                      .patchTrip(widget.tripIndex,
                                          title: v);
                                },
                                decoration: InputDecoration(
                                  isDense: true,
                                  contentPadding:
                                      const EdgeInsets.symmetric(
                                          horizontal: 8, vertical: 6),
                                  filled: true,
                                  fillColor: c.softer,
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(
                                        AppRadius.input),
                                    borderSide: BorderSide.none,
                                  ),
                                ),
                              )
                            : Text(
                                trip.title,
                                style: AppText.serif(20, color: c.ink),
                                overflow: TextOverflow.ellipsis,
                              ),
                      ),
                      const SizedBox(width: 8),
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
                // Tabs content
                Expanded(
                  child: IndexedStack(
                    index: _tab,
                    children: [
                      _visitedTabs.contains(0)
                          ? _ScheduleTab(tripIndex: widget.tripIndex, editing: _editing)
                          : const SizedBox.shrink(),
                      _visitedTabs.contains(1)
                          ? MapScreen(tripIndex: widget.tripIndex)
                          : const SizedBox.shrink(),
                      _visitedTabs.contains(2)
                          ? FoodScreen(tripIndex: widget.tripIndex)
                          : const SizedBox.shrink(),
                      _visitedTabs.contains(3)
                          ? PrepScreen(tripIndex: widget.tripIndex)
                          : const SizedBox.shrink(),
                    ],
                  ),
                ),
                SizedBox(height: 80 + MediaQuery.of(context).padding.bottom),
              ],
            ),
            FloatingTabBar(
              index: _tab,
              onChanged: (i) => setState(() {
                _tab = i;
                _visitedTabs.add(i);
              }),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Schedule Tab ──────────────────────────────────────────────────────────

class _ScheduleTab extends ConsumerStatefulWidget {
  final int tripIndex;
  final bool editing;

  const _ScheduleTab({required this.tripIndex, required this.editing});

  @override
  ConsumerState<_ScheduleTab> createState() => _ScheduleTabState();
}

class _ScheduleTabState extends ConsumerState<_ScheduleTab> {
  static Map<String, double>? _cachedRates;
  static DateTime? _cacheExpiry;
  static const _cacheTtl = Duration(hours: 6);

  Map<String, double>? _rates;
  bool _loadingRates = false;

  @override
  void initState() {
    super.initState();
    final isFresh = _cachedRates != null &&
        _cacheExpiry != null &&
        DateTime.now().isBefore(_cacheExpiry!);
    if (isFresh) {
      _rates = _cachedRates;
    } else {
      _fetchRates();
    }
  }

  Future<void> _fetchRates() async {
    setState(() => _loadingRates = true);
    try {
      final response = await http
          .get(Uri.parse('https://v6.frankfurter.app/latest?from=USD&to=KRW,JPY'))
          .timeout(const Duration(seconds: 10));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final rates = Map<String, dynamic>.from(data['rates'] as Map);
        final parsed = rates.map((k, v) => MapEntry(k, (v as num).toDouble()));
        _cachedRates = parsed;
        _cacheExpiry = DateTime.now().add(_cacheTtl);
        setState(() {
          _rates = parsed;
          _loadingRates = false;
        });
      } else {
        setState(() => _loadingRates = false);
      }
    } catch (_) {
      setState(() => _loadingRates = false);
    }
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

    return ListView(
      padding: EdgeInsets.zero,
      children: [
        Stack(
          children: [
            const PhotoPlaceholder(hue: 25, label: '', height: 200),
            Positioned(
              left: AppSpacing.pagePad, bottom: 18, right: AppSpacing.pagePad,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(trip.title, style: AppText.serif(28, color: Colors.white)),
                  if (trip.dates.isNotEmpty)
                    Text(trip.dates, style: AppText.mono(10, color: Colors.white)),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sectionGap),
        if (trip.travelers.isNotEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePad),
            child: Wrap(
              spacing: 6,
              children: trip.travelers
                  .split(',')
                  .map((t) => t.trim())
                  .where((t) => t.isNotEmpty)
                  .map((t) => Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: c.soft,
                          borderRadius: BorderRadius.circular(AppRadius.chip),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.person_outline_rounded, size: 12, color: c.mute),
                            const SizedBox(width: 4),
                            Text(t, style: AppText.sans(12, color: c.ink)),
                          ],
                        ),
                      ))
                  .toList(),
            ),
          ),
        // ── Hotels ─────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.pagePad, AppSpacing.sectionGap, AppSpacing.pagePad, 8),
          child: Row(
            children: [
              Text('숙소', style: AppText.serif(18, color: c.ink)),
              const Spacer(),
              if (widget.editing)
                GestureDetector(
                  onTap: () => ref.read(tripsProvider.notifier).addHotel(widget.tripIndex),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: c.soft,
                      borderRadius: BorderRadius.circular(AppRadius.chip),
                    ),
                    child: Text('+ 추가', style: AppText.sans(12, color: c.mute)),
                  ),
                ),
            ],
          ),
        ),
        if (trip.hotels.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePad),
            child: Text('숙소를 추가해보세요', style: AppText.sans(13, color: c.mute)),
          )
        else
          SizedBox(
            height: 180,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePad),
              itemCount: trip.hotels.length,
              itemBuilder: (ctx, i) {
                final hotel = trip.hotels[i];
                return _HotelCard(
                  hotel: hotel,
                  editing: widget.editing,
                  onTap: () => Navigator.push(
                    context,
                    CupertinoPageRoute(
                      builder: (_) => HotelDetailScreen(
                        tripIndex: widget.tripIndex, hotelIndex: i),
                    ),
                  ),
                  onDelete: () => ref
                      .read(tripsProvider.notifier)
                      .deleteHotel(widget.tripIndex, i),
                );
              },
            ),
          ),
        // ── Days ────────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.pagePad, AppSpacing.sectionGap, AppSpacing.pagePad, 8),
          child: Row(
            children: [
              Text('일정', style: AppText.serif(18, color: c.ink)),
              const Spacer(),
              if (widget.editing)
                GestureDetector(
                  onTap: () => ref.read(tripsProvider.notifier).addDay(widget.tripIndex),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: c.soft,
                      borderRadius: BorderRadius.circular(AppRadius.chip),
                    ),
                    child: Text('+ 일정 추가', style: AppText.sans(12, color: c.mute)),
                  ),
                ),
            ],
          ),
        ),
        if (trip.days.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePad),
            child: Text('일정을 추가해보세요', style: AppText.sans(13, color: c.mute)),
          )
        else
          widget.editing
              ? _ReorderableDayList(tripIndex: widget.tripIndex, trip: trip)
              : _DayCardList(tripIndex: widget.tripIndex, trip: trip),
        // ── Info cards ─────────────────────────────────────
        Padding(
          padding: const EdgeInsets.fromLTRB(AppSpacing.pagePad, AppSpacing.sectionGap, AppSpacing.pagePad, 0),
          child: _FxCard(rates: _rates, loading: _loadingRates),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(AppSpacing.pagePad, 10, AppSpacing.pagePad, 0),
          child: _TimezoneCard(),
        ),
        const SizedBox(height: 32),
      ],
    );
  }
}

// ── Hotel card ────────────────────────────────────────────────────────────

class _HotelCard extends StatelessWidget {
  final TripHotel hotel;
  final bool editing;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  const _HotelCard({
    required this.hotel, required this.editing,
    required this.onTap, required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 160,
        margin: const EdgeInsets.only(right: 10),
        decoration: BoxDecoration(
          color: c.card,
          borderRadius: BorderRadius.circular(AppRadius.card),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 8)],
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                PhotoPlaceholder(hue: hotel.hue, label: '', height: 90),
                Padding(
                  padding: const EdgeInsets.all(10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(hotel.name, style: AppText.serif(14, color: c.ink),
                          maxLines: 1, overflow: TextOverflow.ellipsis),
                      if (hotel.area.isNotEmpty)
                        Text(hotel.area, style: AppText.mono(9, letterSpacing: 0.5, color: c.mute)),
                      const SizedBox(height: 4),
                      Text('${hotel.checkin} → ${hotel.checkout}',
                          style: AppText.sans(11, color: c.mute),
                          maxLines: 1, overflow: TextOverflow.ellipsis),
                      if (hotel.rating != null) ...[
                        const SizedBox(height: 4),
                        Row(
                          children: List.generate(5, (i) {
                            return Icon(
                              i < hotel.rating!.floor()
                                  ? Icons.star_rounded : Icons.star_border_rounded,
                              size: 11, color: c.accent,
                            );
                          }),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
            if (editing)
              Positioned(
                top: 6, right: 6,
                child: GestureDetector(
                  onTap: onDelete,
                  child: Container(
                    width: 22, height: 22,
                    decoration: BoxDecoration(shape: BoxShape.circle, color: c.accent),
                    child: const Icon(Icons.close_rounded, size: 13, color: Colors.white),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ── Day cards ─────────────────────────────────────────────────────────────

class _DayCardList extends StatelessWidget {
  final int tripIndex;
  final Trip trip;
  const _DayCardList({required this.tripIndex, required this.trip});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: trip.days.asMap().entries.map((e) {
        final i = e.key;
        final day = e.value;
        return _DayCard(
          key: ValueKey(day.n),
          day: day, editing: false,
          onTap: () => Navigator.push(
            context,
            CupertinoPageRoute(
              builder: (_) => DayDetailScreen(tripIndex: tripIndex, dayIndex: i),
            ),
          ),
          onDelete: () {},
        );
      }).toList(),
    );
  }
}

class _ReorderableDayList extends ConsumerWidget {
  final int tripIndex;
  final Trip trip;
  const _ReorderableDayList({required this.tripIndex, required this.trip});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Theme(
      data: Theme.of(context).copyWith(canvasColor: Colors.transparent),
      child: ReorderableListView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: trip.days.length,
        onReorder: (oldIdx, newIdx) {
          if (newIdx > oldIdx) newIdx--;
          ref.read(tripsProvider.notifier).reorderDays(tripIndex, oldIdx, newIdx);
        },
        itemBuilder: (ctx, i) {
          final day = trip.days[i];
          return _DayCard(
            key: ValueKey(day.n),
            day: day, editing: true,
            onTap: () => Navigator.push(
              context,
              CupertinoPageRoute(
                builder: (_) => DayDetailScreen(tripIndex: tripIndex, dayIndex: i),
              ),
            ),
            onDelete: () => ref.read(tripsProvider.notifier).deleteDay(tripIndex, i),
          );
        },
      ),
    );
  }
}

class _DayCard extends StatelessWidget {
  final TripDay day;
  final bool editing;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  const _DayCard({
    super.key, required this.day, required this.editing,
    required this.onTap, required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final wdLower = day.weekday.toLowerCase();
    final wdColor = wdLower == 'sat'
        ? c.saturdayBlue
        : wdLower == 'sun' ? c.sundayRed : c.mute;

    return Padding(
      padding: const EdgeInsets.fromLTRB(
          AppSpacing.pagePad, 0, AppSpacing.pagePad, AppSpacing.listGap),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          decoration: BoxDecoration(
            color: c.card,
            borderRadius: BorderRadius.circular(AppRadius.card),
            boxShadow: [
              BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8),
            ],
          ),
          clipBehavior: Clip.antiAlias,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              if (editing)
                GestureDetector(
                  onTap: onDelete,
                  child: Container(
                    width: 44,
                    alignment: Alignment.center,
                    child: Container(
                      width: 22, height: 22,
                      decoration: BoxDecoration(shape: BoxShape.circle, color: c.accent),
                      child: const Icon(Icons.remove, size: 14, color: Colors.white),
                    ),
                  ),
                ),
              Container(
                width: 64, height: 64,
                margin: const EdgeInsets.all(12),
                decoration: BoxDecoration(borderRadius: BorderRadius.circular(10)),
                clipBehavior: Clip.antiAlias,
                child: PhotoPlaceholder(hue: day.heroHue, label: '', height: 64, small: true),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('Day ${day.n.toString().padLeft(2, '0')}',
                        style: AppText.mono(9.5, color: c.mute, letterSpacing: 1.0)),
                    Text(day.title, style: AppText.serif(16, color: c.ink)),
                    if (day.items.isNotEmpty)
                      Text('${day.items.length} stops',
                          style: AppText.sans(11, color: c.mute)),
                  ],
                ),
              ),
              if (editing)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  child: Icon(Icons.drag_handle_rounded, color: c.mute, size: 18),
                )
              else
                Builder(builder: (ctx) {
                  final parts = day.date.split(' ');
                  final month = parts.isNotEmpty ? parts[0].toUpperCase() : '';
                  final dayNum = parts.length > 1 ? parts[1].replaceAll(',', '') : '';
                  return SizedBox(
                    width: 60,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (day.weekday.isNotEmpty)
                          Text(day.weekday.toUpperCase(),
                              textAlign: TextAlign.center,
                              style: AppText.mono(13, color: wdColor, letterSpacing: 1.0)),
                        if (dayNum.isNotEmpty)
                          Text(dayNum, textAlign: TextAlign.center,
                              style: AppText.mono(24, color: wdColor, letterSpacing: 0,
                                  weight: FontWeight.w700)),
                        if (month.isNotEmpty)
                          Text(month, textAlign: TextAlign.center,
                              style: AppText.mono(10, color: c.mute, letterSpacing: 1.0)),
                      ],
                    ),
                  );
                }),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Exchange Rate card ────────────────────────────────────────────────────

class _FxCard extends StatelessWidget {
  final Map<String, double>? rates;
  final bool loading;
  const _FxCard({required this.rates, required this.loading});

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadSm),
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(AppRadius.card),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text('환율', style: AppText.sans(12, color: c.mute)),
              const SizedBox(width: 6),
              Text('1 USD 기준', style: AppText.mono(9, letterSpacing: 0.5, color: c.mute)),
            ],
          ),
          const SizedBox(height: 8),
          if (loading)
            Text('불러오는 중…', style: AppText.sans(12, color: c.mute))
          else if (rates == null)
            Text('환율 정보를 가져오지 못했습니다', style: AppText.sans(12, color: c.mute))
          else
            Row(
              children: [
                if (rates!['KRW'] != null)
                  _RateChip('KRW', '₩${rates!['KRW']!.toStringAsFixed(0)}', c),
                if (rates!['KRW'] != null && rates!['JPY'] != null)
                  const SizedBox(width: 10),
                if (rates!['JPY'] != null)
                  _RateChip('JPY', '¥${rates!['JPY']!.toStringAsFixed(0)}', c),
              ],
            ),
        ],
      ),
    );
  }
}

class _RateChip extends StatelessWidget {
  final String currency;
  final String value;
  final AppColors c;
  const _RateChip(this.currency, this.value, this.c);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: c.softer, borderRadius: BorderRadius.circular(AppRadius.chip),
      ),
      child: Column(
        children: [
          Text(currency, style: AppText.mono(9, letterSpacing: 1, color: c.mute)),
          const SizedBox(height: 2),
          Text(value, style: AppText.mono(12, color: c.ink, letterSpacing: 0.5)),
        ],
      ),
    );
  }
}

// ── Timezone card ─────────────────────────────────────────────────────────

class _TimezoneCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadSm),
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(AppRadius.card),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6)],
      ),
      child: Row(
        children: [
          Icon(Icons.schedule_rounded, size: 14, color: c.mute),
          const SizedBox(width: 8),
          Text('뉴욕 UTC-5', style: AppText.mono(10, letterSpacing: 0.5, color: c.ink)),
          const SizedBox(width: 8),
          Container(width: 1, height: 12, color: c.line),
          const SizedBox(width: 8),
          Text('서울 UTC+9', style: AppText.mono(10, letterSpacing: 0.5, color: c.ink)),
        ],
      ),
    );
  }
}
