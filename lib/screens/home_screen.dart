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
    final tripsAsync = ref.watch(tripsProvider);
    final trips = tripsAsync.value;

    if (trips == null || widget.tripIndex >= trips.length) {
      return const Scaffold(
        backgroundColor: AppColors.bg,
        body: Center(
          child: CircularProgressIndicator(color: AppColors.accent),
        ),
      );
    }

    final trip = trips[widget.tripIndex];
    _titleController ??= TextEditingController(text: trip.title);
    if (!_editing) _titleController!.text = trip.title;

    return Scaffold(
      backgroundColor: AppColors.bg,
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
                        icon: const Icon(Icons.arrow_back_ios_new_rounded,
                            size: 18, color: AppColors.ink),
                        onPressed: () => Navigator.pop(context),
                      ),
                      Expanded(
                        child: _editing
                            ? TextField(
                                controller: _titleController,
                                style: AppText.serif(18),
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
                                  fillColor: AppColors.softer,
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(
                                        AppRadius.input),
                                    borderSide: BorderSide.none,
                                  ),
                                ),
                              )
                            : Text(
                                trip.title,
                                style: AppText.serif(20),
                                overflow: TextOverflow.ellipsis,
                              ),
                      ),
                      const SizedBox(width: 8),
                      EditButton(
                        editing: _editing,
                        onTap: () =>
                            setState(() => _editing = !_editing),
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
                // Bottom padding for tab bar
                SizedBox(
                    height: 80 + MediaQuery.of(context).padding.bottom),
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
    final tripsAsync = ref.watch(tripsProvider);
    final trips = tripsAsync.value;
    if (trips == null || widget.tripIndex >= trips.length) {
      return const SizedBox.shrink();
    }
    final trip = trips[widget.tripIndex];

    return ListView(
      padding: EdgeInsets.zero,
      children: [
        // Cover photo
        Stack(
          children: [
            const PhotoPlaceholder(
              hue: 25,
              label: '',
              height: 200,
            ),
            Positioned(
              left: AppSpacing.pagePad,
              bottom: 18,
              right: AppSpacing.pagePad,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(trip.title,
                      style: AppText.serif(28, color: Colors.white)),
                  if (trip.dates.isNotEmpty)
                    Text(trip.dates,
                        style: AppText.mono(10, color: Colors.white)),
                ],
              ),
            ),
          ],
        ),

        const SizedBox(height: AppSpacing.sectionGap),

        // Travelers
        if (trip.travelers.isNotEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.pagePad),
            child: Wrap(
              spacing: 6,
              children: trip.travelers
                  .split(',')
                  .map((t) => t.trim())
                  .where((t) => t.isNotEmpty)
                  .map((t) => Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppColors.soft,
                          borderRadius:
                              BorderRadius.circular(AppRadius.chip),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.person_outline_rounded,
                                size: 12, color: AppColors.mute),
                            const SizedBox(width: 4),
                            Text(t, style: AppText.sans(12)),
                          ],
                        ),
                      ))
                  .toList(),
            ),
          ),

        // ── Hotels section ─────────────────────────────────────
        Padding(
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.pagePad, AppSpacing.sectionGap, AppSpacing.pagePad, 8),
          child: Row(
            children: [
              Text('숙소', style: AppText.serif(18)),
              const Spacer(),
              if (widget.editing)
                GestureDetector(
                  onTap: () => ref
                      .read(tripsProvider.notifier)
                      .addHotel(widget.tripIndex),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: AppColors.soft,
                      borderRadius: BorderRadius.circular(AppRadius.chip),
                    ),
                    child: Text('+ 추가',
                        style: AppText.sans(12, color: AppColors.mute)),
                  ),
                ),
            ],
          ),
        ),
        if (trip.hotels.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.pagePad),
            child: Text('숙소를 추가해보세요',
                style: AppText.sans(13, color: AppColors.mute)),
          )
        else
          SizedBox(
            height: 180,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.pagePad),
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
                        tripIndex: widget.tripIndex,
                        hotelIndex: i,
                      ),
                    ),
                  ),
                  onDelete: () => ref
                      .read(tripsProvider.notifier)
                      .deleteHotel(widget.tripIndex, i),
                );
              },
            ),
          ),

        // ── Days section ────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.pagePad, AppSpacing.sectionGap, AppSpacing.pagePad, 8),
          child: Row(
            children: [
              Text('일정', style: AppText.serif(18)),
              const Spacer(),
              if (widget.editing)
                GestureDetector(
                  onTap: () => ref
                      .read(tripsProvider.notifier)
                      .addDay(widget.tripIndex),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: AppColors.soft,
                      borderRadius: BorderRadius.circular(AppRadius.chip),
                    ),
                    child: Text('+ 일정 추가',
                        style: AppText.sans(12, color: AppColors.mute)),
                  ),
                ),
            ],
          ),
        ),
        if (trip.days.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.pagePad),
            child: Text('일정을 추가해보세요',
                style: AppText.sans(13, color: AppColors.mute)),
          )
        else
          widget.editing
              ? _ReorderableDayList(tripIndex: widget.tripIndex, trip: trip)
              : _DayCardList(tripIndex: widget.tripIndex, trip: trip),

        // ── Info cards ──────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.pagePad, AppSpacing.sectionGap, AppSpacing.pagePad, 0),
          child: _FxCard(rates: _rates, loading: _loadingRates),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.pagePad, 10, AppSpacing.pagePad, 0),
          child: _TimezoneCard(),
        ),
        const SizedBox(height: 32),
      ],
    );
  }
}

// ── Hotel card (horizontal scroll) ───────────────────────────────────────

class _HotelCard extends StatelessWidget {
  final TripHotel hotel;
  final bool editing;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  const _HotelCard({
    required this.hotel,
    required this.editing,
    required this.onTap,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 160,
        margin: const EdgeInsets.only(right: 10),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.circular(AppRadius.card),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.05), blurRadius: 8)
          ],
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
                      Text(hotel.name,
                          style: AppText.serif(14),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis),
                      if (hotel.area.isNotEmpty)
                        Text(hotel.area,
                            style: AppText.mono(9, letterSpacing: 0.5)),
                      const SizedBox(height: 4),
                      Text(
                        '${hotel.checkin} → ${hotel.checkout}',
                        style: AppText.sans(11, color: AppColors.mute),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (hotel.rating != null) ...[
                        const SizedBox(height: 4),
                        Row(
                          children: List.generate(5, (i) {
                            return Icon(
                              i < hotel.rating!.floor()
                                  ? Icons.star_rounded
                                  : Icons.star_border_rounded,
                              size: 11,
                              color: AppColors.accent,
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
                top: 6,
                right: 6,
                child: GestureDetector(
                  onTap: onDelete,
                  child: Container(
                    width: 22,
                    height: 22,
                    decoration: const BoxDecoration(
                        shape: BoxShape.circle, color: AppColors.accent),
                    child: const Icon(Icons.close_rounded,
                        size: 13, color: Colors.white),
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
          day: day,
          editing: false,
          onTap: () => Navigator.push(
            context,
            CupertinoPageRoute(
              builder: (_) => DayDetailScreen(
                  tripIndex: tripIndex, dayIndex: i),
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

  const _ReorderableDayList(
      {required this.tripIndex, required this.trip});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Theme(
      data: Theme.of(context)
          .copyWith(canvasColor: Colors.transparent),
      child: ReorderableListView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: trip.days.length,
        onReorder: (oldIdx, newIdx) {
          if (newIdx > oldIdx) newIdx--;
          ref
              .read(tripsProvider.notifier)
              .reorderDays(tripIndex, oldIdx, newIdx);
        },
        itemBuilder: (ctx, i) {
          final day = trip.days[i];
          return _DayCard(
            key: ValueKey(day.n),
            day: day,
            editing: true,
            onTap: () => Navigator.push(
              context,
              CupertinoPageRoute(
                builder: (_) =>
                    DayDetailScreen(tripIndex: tripIndex, dayIndex: i),
              ),
            ),
            onDelete: () => ref
                .read(tripsProvider.notifier)
                .deleteDay(tripIndex, i),
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
    super.key,
    required this.day,
    required this.editing,
    required this.onTap,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
          AppSpacing.pagePad, 0, AppSpacing.pagePad, AppSpacing.listGap),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(AppRadius.card),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 8,
              ),
            ],
          ),
          clipBehavior: Clip.antiAlias,
          child: Row(
            children: [
              if (editing)
                GestureDetector(
                  onTap: onDelete,
                  child: Container(
                    width: 44,
                    alignment: Alignment.center,
                    child: Container(
                      width: 22,
                      height: 22,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.accent,
                      ),
                      child: const Icon(Icons.remove,
                          size: 14, color: Colors.white),
                    ),
                  ),
                ),
              ClipRRect(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(AppRadius.card),
                  bottomLeft: Radius.circular(AppRadius.card),
                ),
                child: PhotoPlaceholder(
                  hue: day.heroHue,
                  label: '',
                  height: 80,
                  small: true,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Day ${day.n}',
                      style: AppText.mono(9.5,
                          letterSpacing: 1.2,
                          color: AppColors.accent),
                    ),
                    Text(day.title, style: AppText.serif(16)),
                    if (day.date.isNotEmpty || day.weekday.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Row(
                          children: [
                            if (day.weekday.isNotEmpty) ...[
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.accent
                                      .withValues(alpha: 0.12),
                                  borderRadius: BorderRadius.circular(5),
                                ),
                                child: Text(
                                  day.weekday.toUpperCase(),
                                  style: AppText.mono(9.5,
                                      color: AppColors.accent,
                                      letterSpacing: 0.8),
                                ),
                              ),
                              const SizedBox(width: 6),
                            ],
                            if (day.date.isNotEmpty)
                              Text(
                                day.date,
                                style: AppText.sans(13,
                                    color: AppColors.ink,
                                    weight: FontWeight.w500),
                              ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
              if (editing)
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10),
                  child: Icon(Icons.drag_handle_rounded,
                      color: AppColors.mute, size: 18),
                )
              else
                const Padding(
                  padding: EdgeInsets.only(right: 12),
                  child: Icon(Icons.chevron_right_rounded,
                      color: AppColors.mute, size: 20),
                ),
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
    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadSm),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(AppRadius.card),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.04), blurRadius: 6),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text('환율', style: AppText.sans(12, color: AppColors.mute)),
              const SizedBox(width: 6),
              Text('1 USD 기준',
                  style: AppText.mono(9, letterSpacing: 0.5)),
            ],
          ),
          const SizedBox(height: 8),
          if (loading)
            Text('불러오는 중…',
                style: AppText.sans(12, color: AppColors.mute))
          else if (rates == null)
            Text('환율 정보를 가져오지 못했습니다',
                style: AppText.sans(12, color: AppColors.mute))
          else
            Row(
              children: [
                if (rates!['KRW'] != null)
                  _RateChip('KRW',
                      '₩${rates!['KRW']!.toStringAsFixed(0)}'),
                if (rates!['KRW'] != null && rates!['JPY'] != null)
                  const SizedBox(width: 10),
                if (rates!['JPY'] != null)
                  _RateChip(
                      'JPY', '¥${rates!['JPY']!.toStringAsFixed(0)}'),
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

  const _RateChip(this.currency, this.value);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding:
          const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.softer,
        borderRadius: BorderRadius.circular(AppRadius.chip),
      ),
      child: Column(
        children: [
          Text(currency, style: AppText.mono(9, letterSpacing: 1)),
          const SizedBox(height: 2),
          Text(value,
              style: AppText.mono(12,
                  color: AppColors.ink, letterSpacing: 0.5)),
        ],
      ),
    );
  }
}

// ── Timezone card ─────────────────────────────────────────────────────────

class _TimezoneCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.cardPadSm),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(AppRadius.card),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.04), blurRadius: 6),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.schedule_rounded, size: 14, color: AppColors.mute),
          const SizedBox(width: 8),
          Text('뉴욕 UTC-5',
              style: AppText.mono(10, letterSpacing: 0.5)),
          const SizedBox(width: 8),
          Container(width: 1, height: 12, color: AppColors.line),
          const SizedBox(width: 8),
          Text('서울 UTC+9',
              style: AppText.mono(10, letterSpacing: 0.5)),
        ],
      ),
    );
  }
}
