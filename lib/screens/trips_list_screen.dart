import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../l10n/app_strings.dart';
import '../providers/settings_provider.dart';
import '../providers/trips_provider.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';
import '../theme/tokens.dart';
import '../version.dart';
import '../widgets/photo_placeholder.dart';
import '../widgets/edit_button.dart';
import 'home_screen.dart';
import 'settings_screen.dart';

class TripsListScreen extends ConsumerStatefulWidget {
  const TripsListScreen({super.key});

  @override
  ConsumerState<TripsListScreen> createState() => _TripsListScreenState();
}

class _TripsListScreenState extends ConsumerState<TripsListScreen> {
  bool _editing = false;

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final tripsAsync = ref.watch(tripsProvider);
    final lang = ref.watch(settingsLanguageProvider);
    final s = AppStrings(lang);

    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        child: tripsAsync.when(
          loading: () =>
              Center(child: CircularProgressIndicator(color: c.accent)),
          error: (e, _) => Center(
            child: Text('${s.errorPrefix}$e', style: AppText.sans(14, color: c.mute)),
          ),
          data: (trips) => Column(
            children: [
              // Top bar
              Padding(
                padding: const EdgeInsets.fromLTRB(
                    AppSpacing.pagePad, 18, AppSpacing.pagePad, 0),
                child: Row(
                  children: [
                    Text('My Trips', style: AppText.serif(22, color: c.ink)),
                    const SizedBox(width: 8),
                    Text(appVersion, style: AppText.mono(9, letterSpacing: 0.8, color: c.mute)),
                    const Spacer(),
                    // Settings / profile button
                    GestureDetector(
                      onTap: () => Navigator.push(
                        context,
                        CupertinoPageRoute(builder: (_) => const SettingsScreen()),
                      ),
                      child: Container(
                        width: 34,
                        height: 34,
                        margin: const EdgeInsets.only(right: 8),
                        decoration: BoxDecoration(
                          color: c.softer,
                          shape: BoxShape.circle,
                          border: Border.all(color: c.line, width: 1),
                        ),
                        child: Icon(Icons.person_rounded, size: 18, color: c.mute),
                      ),
                    ),
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
              const SizedBox(height: 18),
              Expanded(
                child: trips.isEmpty
                    ? Center(
                        child: Text(
                          s.emptyTrips,
                          style: AppText.sans(14, color: c.mute),
                        ),
                      )
                    : _editing
                        ? Theme(
                            data: Theme.of(context).copyWith(
                              canvasColor: Colors.transparent,
                            ),
                            child: ReorderableListView.builder(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: AppSpacing.pagePad),
                              itemCount: trips.length,
                              onReorder: (oldIndex, newIndex) {
                                if (newIndex > oldIndex) newIndex--;
                                ref
                                    .read(tripsProvider.notifier)
                                    .reorderTrips(oldIndex, newIndex);
                              },
                              itemBuilder: (ctx, i) => _TripCard(
                                key: ValueKey(trips[i].id),
                                tripIndex: i,
                                editing: _editing,
                                onDelete: () => ref
                                    .read(tripsProvider.notifier)
                                    .deleteTrip(i),
                                onTap: () => _openTrip(i),
                              ),
                            ),
                          )
                        : ListView.builder(
                            padding: const EdgeInsets.symmetric(
                                horizontal: AppSpacing.pagePad),
                            itemCount: trips.length,
                            itemBuilder: (ctx, i) => _TripCard(
                              key: ValueKey(trips[i].id),
                              tripIndex: i,
                              editing: _editing,
                              onDelete: () => ref
                                  .read(tripsProvider.notifier)
                                  .deleteTrip(i),
                              onTap: () => _openTrip(i),
                            ),
                          ),
              ),
              // Add button
              Padding(
                padding: const EdgeInsets.fromLTRB(
                    AppSpacing.pagePad, 12, AppSpacing.pagePad, 18),
                child: GestureDetector(
                  onTap: () =>
                      ref.read(tripsProvider.notifier).addTrip(),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                      color: c.soft,
                      borderRadius: BorderRadius.circular(AppRadius.card),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      s.addTrip,
                      style: AppText.sans(14, color: c.ink, weight: FontWeight.w500),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _openTrip(int index) {
    Navigator.push(
      context,
      CupertinoPageRoute(builder: (_) => HomeScreen(tripIndex: index)),
    );
  }
}

class _TripCard extends ConsumerWidget {
  final int tripIndex;
  final bool editing;
  final VoidCallback onDelete;
  final VoidCallback onTap;

  const _TripCard({
    super.key,
    required this.tripIndex,
    required this.editing,
    required this.onDelete,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final c = context.colors;
    final tripsAsync = ref.watch(tripsProvider);
    final trips = tripsAsync.value;
    if (trips == null || tripIndex >= trips.length) return const SizedBox.shrink();
    final trip = trips[tripIndex];

    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.listGap),
      child: GestureDetector(
        onTap: editing ? null : onTap,
        child: Container(
          decoration: BoxDecoration(
            color: c.card,
            borderRadius: BorderRadius.circular(AppRadius.card),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 8,
                offset: const Offset(0, 2),
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
                    height: 44,
                    alignment: Alignment.center,
                    child: Container(
                      width: 22,
                      height: 22,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: c.accent,
                      ),
                      child: const Icon(Icons.remove, size: 14, color: Colors.white),
                    ),
                  ),
                ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    PhotoPlaceholder(
                      hue: 25,
                      label: trip.subtitleKo,
                      height: 120,
                    ),
                    Padding(
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(trip.title, style: AppText.serif(22, color: c.ink)),
                          if (trip.subtitleKo.isNotEmpty) ...[
                            const SizedBox(height: 2),
                            Text(trip.subtitleKo,
                                style: AppText.sans(13, color: c.mute)),
                          ],
                          if (trip.dates.isNotEmpty) ...[
                            const SizedBox(height: 4),
                            Text(trip.dates,
                                style: AppText.mono(10, color: c.mute)),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              if (editing)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Icon(Icons.drag_handle_rounded,
                      color: c.mute, size: 20),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
