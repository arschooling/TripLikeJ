import 'dart:math';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/trip.dart';
import '../data/trip_repository.dart';

final tripRepositoryProvider = Provider((_) => TripRepository());

final tripsProvider = StateNotifierProvider<TripsNotifier, AsyncValue<List<Trip>>>(
  (ref) => TripsNotifier(ref.read(tripRepositoryProvider)),
);

class TripsNotifier extends StateNotifier<AsyncValue<List<Trip>>> {
  final TripRepository _repo;

  TripsNotifier(this._repo) : super(const AsyncValue.loading()) {
    _load();
  }

  TripsNotifier.preloaded(this._repo, List<Trip> trips)
      : super(AsyncValue.data(trips));

  Future<void> _load() async {
    try {
      final trips = await _repo.load();
      state = AsyncValue.data(trips);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  List<Trip> get _trips => state.value ?? [];

  void _update(List<Trip> trips) {
    state = AsyncValue.data(trips);
    _repo.save(trips);
  }

  String _newId() => 'trip-${DateTime.now().millisecondsSinceEpoch}-${Random().nextInt(999)}';

  // ── Trip CRUD ─────────────────────────────────────────────
  void addTrip() {
    final t = Trip(id: _newId(), title: '새 여행');
    _update([..._trips, t]);
  }

  void deleteTrip(int index) {
    final list = [..._trips];
    list.removeAt(index);
    _update(list);
  }

  void reorderTrips(int oldIndex, int newIndex) {
    final list = [..._trips];
    final item = list.removeAt(oldIndex);
    list.insert(newIndex, item);
    _update(list);
  }

  void updateTrip(int index, Trip Function(Trip) updater) {
    final list = [..._trips];
    list[index] = updater(list[index]);
    _update(list);
  }

  void patchTrip(int index, {
    String? title, String? subtitleKo, String? dates, String? travelers,
    List<TripHotel>? hotels, List<TripDay>? days, List<TripFood>? food, TripPrep? prep,
  }) {
    updateTrip(index, (t) => t.copyWith(
      title: title, subtitleKo: subtitleKo, dates: dates, travelers: travelers,
      hotels: hotels, days: days, food: food, prep: prep,
    ));
  }

  // ── Day actions ───────────────────────────────────────────
  void reorderDays(int tripIndex, int oldIndex, int newIndex) {
    updateTrip(tripIndex, (t) {
      final days = [...t.days];
      final item = days.removeAt(oldIndex);
      days.insert(newIndex, item);
      final renumbered = days.asMap().entries.map((e) => e.value.copyWith(n: e.key + 1)).toList();
      return t.copyWith(days: renumbered);
    });
  }

  void addDay(int tripIndex) {
    updateTrip(tripIndex, (t) {
      final n = t.days.length + 1;
      final newDay = TripDay(
        n: n, date: '', weekday: '', title: 'Day $n', titleEn: '',
        heroHue: (20 + n * 5) % 360, heroLabel: 'DAY $n',
      );
      return t.copyWith(days: [...t.days, newDay]);
    });
  }

  void deleteDay(int tripIndex, int dayIndex) {
    updateTrip(tripIndex, (t) {
      final days = [...t.days];
      days.removeAt(dayIndex);
      final renumbered = days.asMap().entries.map((e) => e.value.copyWith(n: e.key + 1)).toList();
      return t.copyWith(days: renumbered);
    });
  }

  void editDay(int tripIndex, int dayIndex, TripDay Function(TripDay) fn) {
    updateTrip(tripIndex, (t) {
      final days = [...t.days];
      days[dayIndex] = fn(days[dayIndex]);
      return t.copyWith(days: days);
    });
  }

  // ── Stop actions ──────────────────────────────────────────
  void addStop(int tripIndex, int dayIndex) {
    updateTrip(tripIndex, (t) {
      final days = [...t.days];
      final items = [...days[dayIndex].items, const TripStop(time: '12:00', cat: StopCategory.sight, title: '새 일정', en: 'New stop')];
      days[dayIndex] = days[dayIndex].copyWith(items: items);
      return t.copyWith(days: days);
    });
  }

  void deleteStop(int tripIndex, int dayIndex, int stopIndex) {
    updateTrip(tripIndex, (t) {
      final days = [...t.days];
      final items = [...days[dayIndex].items];
      items.removeAt(stopIndex);
      days[dayIndex] = days[dayIndex].copyWith(items: items);
      return t.copyWith(days: days);
    });
  }

  void reorderStops(int tripIndex, int dayIndex, int oldIndex, int newIndex) {
    updateTrip(tripIndex, (t) {
      final days = [...t.days];
      final items = [...days[dayIndex].items];
      final item = items.removeAt(oldIndex);
      items.insert(newIndex, item);
      days[dayIndex] = days[dayIndex].copyWith(items: items);
      return t.copyWith(days: days);
    });
  }

  void saveStop(int tripIndex, int dayIndex, int stopIndex, TripStop stop) {
    updateTrip(tripIndex, (t) {
      final days = [...t.days];
      final items = [...days[dayIndex].items];
      items[stopIndex] = stop;
      days[dayIndex] = days[dayIndex].copyWith(items: items);
      return t.copyWith(days: days);
    });
  }

  // ── Hotel actions ─────────────────────────────────────────
  void addHotel(int tripIndex) {
    updateTrip(tripIndex, (t) {
      final hotels = [...t.hotels, const TripHotel(name: '새 호텔', hue: 30)];
      return t.copyWith(hotels: hotels);
    });
  }

  void deleteHotel(int tripIndex, int hotelIndex) {
    updateTrip(tripIndex, (t) {
      final prev = t.hotels[hotelIndex];
      final hotels = [...t.hotels];
      hotels.removeAt(hotelIndex);
      final days = t.days.map((d) => d.copyWith(
        items: d.items.where((it) => it.hotelRef != prev.name).toList(),
      )).toList();
      return t.copyWith(hotels: hotels, days: days);
    });
  }

  void editHotel(int tripIndex, int hotelIndex, TripHotel updatedHotel) {
    updateTrip(tripIndex, (t) {
      final prev = t.hotels[hotelIndex];
      final hotels = [...t.hotels];
      hotels[hotelIndex] = updatedHotel;
      final days = _syncHotelToDays(t.days, updatedHotel, prev);
      return t.copyWith(hotels: hotels, days: days);
    });
  }

  List<TripDay> _syncHotelToDays(List<TripDay> days, TripHotel hotel, TripHotel? prev) {
    String norm(String s) => s.replaceAll(RegExp(r',\s*\d{4}\s*$'), '').trim();
    var result = days.map((d) => d.copyWith(
      items: d.items.where((it) => it.hotelRef != (prev?.name) && it.hotelRef != hotel.name).toList(),
    )).toList();

    int findDay(String dateStr) {
      if (dateStr.isEmpty) return -1;
      final target = norm(dateStr);
      return result.indexWhere((d) => norm(d.date) == target);
    }

    final inIdx = findDay(hotel.checkin);
    var outIdx = findDay(hotel.checkout);
    final nights = hotel.nights;
    if (outIdx < 0 && inIdx >= 0 && nights > 0) {
      outIdx = (inIdx + nights).clamp(0, result.length - 1);
    }

    int sortKey(TripStop s) {
      if (s.anchor == 'start') return -1;
      if (s.time.isEmpty) return 99 * 60 + 99;
      final m = RegExp(r'^(\d{1,2}):(\d{2})').firstMatch(s.time);
      return m != null ? int.parse(m[1]!) * 60 + int.parse(m[2]!) : 99 * 60 + 99;
    }

    void pushItem(int di, TripStop item) {
      if (di < 0) return;
      final items = [...result[di].items, item]..sort((a, b) => sortKey(a).compareTo(sortKey(b)));
      result[di] = result[di].copyWith(items: items);
    }

    final sleepStop = TripStop(
      time: '', cat: StopCategory.hotel,
      title: '${hotel.name} 숙박', en: hotel.name,
      loc: hotel.area, note: hotel.address, hotelRef: hotel.name,
    );

    // 체크인 날: 체크인 스탑 + 당일 귀환 앵커
    if (inIdx >= 0) {
      pushItem(inIdx, TripStop(
        time: hotel.checkinTime ?? '15:00', cat: StopCategory.hotel,
        title: '${hotel.name} 체크인', en: hotel.name,
        loc: hotel.area, note: hotel.address, hotelRef: hotel.name,
      ));
      pushItem(inIdx, sleepStop);
    }
    // 체크아웃 날: 기상 앵커(시작) + 체크아웃 스탑
    if (outIdx >= 0 && outIdx != inIdx) {
      pushItem(outIdx, sleepStop.copyWith(anchor: 'start'));
      pushItem(outIdx, TripStop(
        time: hotel.checkoutTime ?? '12:00', cat: StopCategory.hotel,
        title: '${hotel.name} 체크아웃', en: hotel.name,
        loc: hotel.area, note: hotel.address, hotelRef: hotel.name,
      ));
    }
    // 중간 날: 기상 앵커(시작) + 귀환 앵커(끝)
    if (inIdx >= 0 && outIdx > inIdx + 1) {
      for (var di = inIdx + 1; di < outIdx; di++) {
        pushItem(di, sleepStop.copyWith(anchor: 'start'));
        pushItem(di, sleepStop);
      }
    }
    return result;
  }
}
