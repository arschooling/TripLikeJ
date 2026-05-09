import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final settingsDarkModeProvider =
    StateNotifierProvider<_BoolNotifier, bool>((_) => _BoolNotifier('settings_dark_mode', false));

final settingsLanguageProvider =
    StateNotifierProvider<_StringNotifier, String>((_) => _StringNotifier('settings_lang', 'ko'));

class _BoolNotifier extends StateNotifier<bool> {
  final String _key;
  _BoolNotifier(this._key, bool def) : super(def) { _load(); }

  Future<void> _load() async {
    final p = await SharedPreferences.getInstance();
    state = p.getBool(_key) ?? state;
  }

  Future<void> toggle() async {
    state = !state;
    final p = await SharedPreferences.getInstance();
    await p.setBool(_key, state);
  }

  Future<void> setValue(bool v) async {
    state = v;
    final p = await SharedPreferences.getInstance();
    await p.setBool(_key, v);
  }
}

class _StringNotifier extends StateNotifier<String> {
  final String _key;
  _StringNotifier(this._key, String def) : super(def) { _load(); }

  Future<void> _load() async {
    final p = await SharedPreferences.getInstance();
    state = p.getString(_key) ?? state;
  }

  Future<void> setValue(String v) async {
    state = v;
    final p = await SharedPreferences.getInstance();
    await p.setString(_key, v);
  }
}
