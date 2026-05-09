import 'package:flutter/material.dart';

class AppColors extends ThemeExtension<AppColors> {
  final Color bg;
  final Color card;
  final Color ink;
  final Color mute;
  final Color line;
  final Color accent;
  final Color soft;
  final Color softer;
  final Color sundayRed;
  final Color saturdayBlue;
  final Color disabledDate;

  const AppColors({
    required this.bg,
    required this.card,
    required this.ink,
    required this.mute,
    required this.line,
    required this.accent,
    required this.soft,
    required this.softer,
    required this.sundayRed,
    required this.saturdayBlue,
    required this.disabledDate,
  });

  static const light = AppColors(
    bg:           Color(0xFFF5F2EC),
    card:         Color(0xFFFFFFFF),
    ink:          Color(0xFF1A1816),
    mute:         Color(0xFF7A756D),
    line:         Color(0x141A1816),
    accent:       Color(0xFFC14F2E),
    soft:         Color(0xFFE9E3D7),
    softer:       Color(0xFFEFEAE0),
    sundayRed:    Color(0xFFC14F2E),
    saturdayBlue: Color(0xFF7B8FB8),
    disabledDate: Color(0xFFCFCAC0),
  );

  static const dark = AppColors(
    bg:           Color(0xFF1C1917),
    card:         Color(0xFF252220),
    ink:          Color(0xFFF0EDE7),
    mute:         Color(0xFF9B9690),
    line:         Color(0x1AFFFFFF),
    accent:       Color(0xFF911D06),
    soft:         Color(0xFF2E2A26),
    softer:       Color(0xFF282420),
    sundayRed:    Color(0xFF911D06),
    saturdayBlue: Color(0xFF8B9FC8),
    disabledDate: Color(0xFF6B6660),
  );

  @override
  AppColors copyWith({
    Color? bg, Color? card, Color? ink, Color? mute, Color? line,
    Color? accent, Color? soft, Color? softer,
    Color? sundayRed, Color? saturdayBlue, Color? disabledDate,
  }) {
    return AppColors(
      bg: bg ?? this.bg, card: card ?? this.card, ink: ink ?? this.ink,
      mute: mute ?? this.mute, line: line ?? this.line, accent: accent ?? this.accent,
      soft: soft ?? this.soft, softer: softer ?? this.softer,
      sundayRed: sundayRed ?? this.sundayRed, saturdayBlue: saturdayBlue ?? this.saturdayBlue,
      disabledDate: disabledDate ?? this.disabledDate,
    );
  }

  @override
  AppColors lerp(ThemeExtension<AppColors>? other, double t) {
    if (other is! AppColors) return this;
    return AppColors(
      bg:           Color.lerp(bg,           other.bg,           t)!,
      card:         Color.lerp(card,         other.card,         t)!,
      ink:          Color.lerp(ink,          other.ink,          t)!,
      mute:         Color.lerp(mute,         other.mute,         t)!,
      line:         Color.lerp(line,         other.line,         t)!,
      accent:       Color.lerp(accent,       other.accent,       t)!,
      soft:         Color.lerp(soft,         other.soft,         t)!,
      softer:       Color.lerp(softer,       other.softer,       t)!,
      sundayRed:    Color.lerp(sundayRed,    other.sundayRed,    t)!,
      saturdayBlue: Color.lerp(saturdayBlue, other.saturdayBlue, t)!,
      disabledDate: Color.lerp(disabledDate, other.disabledDate, t)!,
    );
  }
}

extension AppContextColors on BuildContext {
  AppColors get colors => Theme.of(this).extension<AppColors>()!;
}
