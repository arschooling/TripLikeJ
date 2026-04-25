import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'colors.dart';

class AppText {
  static TextStyle serif(double size, {Color? color, FontWeight? weight, double? height}) =>
    GoogleFonts.instrumentSerif(
      fontSize: size,
      color: color ?? AppColors.ink,
      fontWeight: weight ?? FontWeight.w400,
      height: height ?? 1.2,
    );

  static TextStyle sans(double size, {Color? color, FontWeight weight = FontWeight.w400, double? height}) =>
    TextStyle(
      fontSize: size,
      color: color ?? AppColors.ink,
      fontWeight: weight,
      height: height ?? 1.35,
    );

  static TextStyle mono(double size, {Color? color, double letterSpacing = 1.4, FontWeight weight = FontWeight.w500}) =>
    GoogleFonts.jetBrainsMono(
      fontSize: size,
      color: color ?? AppColors.mute,
      letterSpacing: letterSpacing,
      fontWeight: weight,
    );
}
