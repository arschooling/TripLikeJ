import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';
import 'theme/colors.dart';

class TripLikeJApp extends StatelessWidget {
  const TripLikeJApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TripLikeJ',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: AppColors.bg,
        colorScheme: ColorScheme.fromSeed(seedColor: AppColors.accent),
      ),
      home: const SplashScreen(),
    );
  }
}
