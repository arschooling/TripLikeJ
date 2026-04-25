import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/trip.dart';
import 'default_trip.dart';

class TripRepository {
  static const _key = 'trips_v3';

  Future<List<Trip>> load() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_key);
      if (raw != null) {
        final list = json.decode(raw) as List;
        return list.map((e) => Trip.fromJson(e as Map<String, dynamic>)).toList();
      }
    } catch (_) {}
    return [buildDefaultTrip()];
  }

  Future<void> save(List<Trip> trips) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_key, json.encode(trips.map((t) => t.toJson()).toList()));
    } catch (_) {}
  }
}
