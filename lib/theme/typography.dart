import 'package:flutter/material.dart';
import 'colors.dart';

class AppText {
  static TextStyle serif(double size, {Color? color, FontWeight? weight, double? height}) =>
    TextStyle(
      fontFamily: 'InstrumentSerif',
      fontSize: size,
      color: color ?? AppColors.light.ink,
      fontWeight: weight ?? FontWeight.w400,
      height: height ?? 1.2,
    );

  static TextStyle sans(double size, {Color? color, FontWeight weight = FontWeight.w400, double? height}) =>
    TextStyle(
      fontSize: size,
      color: color ?? AppColors.light.ink,
      fontWeight: weight,
      height: height ?? 1.35,
    );

  static TextStyle mono(double size, {Color? color, double letterSpacing = 1.4, FontWeight weight = FontWeight.w500}) =>
    TextStyle(
      fontFamily: 'JetBrainsMono',
      fontSize: size,
      color: color ?? AppColors.light.mute,
      letterSpacing: letterSpacing,
      fontWeight: weight,
    );
}
