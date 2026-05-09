import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/trips_provider.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';
import '../theme/tokens.dart';
import '../widgets/stop_form_sheet.dart';

class MapScreen extends ConsumerStatefulWidget {
  final int tripIndex;

  const MapScreen({super.key, required this.tripIndex});

  @override
  ConsumerState<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends ConsumerState<MapScreen> {
  int _selectedDay = 0;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final tripsAsync = ref.watch(tripsProvider);
    final trips = tripsAsync.value;
    if (trips == null || widget.tripIndex >= trips.length) {
      return const SizedBox.shrink();
    }
    final trip = trips[widget.tripIndex];

    if (trip.days.isEmpty) {
      return Center(
        child: Text('일정이 없습니다', style: AppText.sans(14, color: c.mute)),
      );
    }

    // clamp selected day
    final safeDay = _selectedDay.clamp(0, trip.days.length - 1);
    final day = trip.days[safeDay];
    final stopsWithLoc =
        day.items.where((s) => s.loc.isNotEmpty).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Day filter chips
        SizedBox(
          height: 44,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding:
                const EdgeInsets.symmetric(horizontal: AppSpacing.pagePad, vertical: 8),
            itemCount: trip.days.length,
            itemBuilder: (ctx, i) {
              final active = i == safeDay;
              return GestureDetector(
                onTap: () => setState(() => _selectedDay = i),
                child: Container(
                  margin: const EdgeInsets.only(right: 8),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: active ? c.ink : c.soft,
                    borderRadius: BorderRadius.circular(AppRadius.chip),
                  ),
                  child: Text(
                    'Day ${trip.days[i].n}',
                    style: AppText.sans(12,
                        color: active ? Colors.white : c.ink),
                  ),
                ),
              );
            },
          ),
        ),
        // Stops list
        Expanded(
          child: stopsWithLoc.isEmpty
              ? Center(
                  child: Text(
                    '장소 정보가 없습니다',
                    style: AppText.sans(14, color: c.mute),
                  ),
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(AppSpacing.pagePad),
                  itemCount: stopsWithLoc.length,
                  separatorBuilder: (_, __) => Divider(
                    color: c.line,
                    height: 1,
                  ),
                  itemBuilder: (ctx, i) {
                    final stop = stopsWithLoc[i];
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      child: Row(
                        children: [
                          // Icon
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: c.ink.withValues(alpha: 0.08),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              categoryEmoji(stop.cat),
                              style: const TextStyle(fontSize: 16),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(stop.title, style: AppText.sans(14, weight: FontWeight.w600)),
                                const SizedBox(height: 2),
                                Text(stop.loc, style: AppText.sans(12, color: c.mute)),
                              ],
                            ),
                          ),
                          GestureDetector(
                            onTap: () => _openMap(stop.loc),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: c.accent.withValues(alpha: 0.12),
                                borderRadius:
                                    BorderRadius.circular(AppRadius.chip),
                              ),
                              child: Text(
                                '지도에서 보기',
                                style: AppText.sans(11,
                                    color: c.accent,
                                    weight: FontWeight.w500),
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Future<void> _openMap(String location) async {
    final encoded = Uri.encodeComponent(location);
    final uri = Uri.parse('https://maps.google.com/?q=$encoded');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}

