import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'providers/settings_provider.dart';
import 'screens/splash_screen.dart';
import 'theme/colors.dart';

class TripLikeJApp extends ConsumerWidget {
  const TripLikeJApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = ref.watch(settingsDarkModeProvider);

    return MaterialApp(
      title: 'TripLikeJ',
      debugShowCheckedModeBanner: false,
      themeMode: isDark ? ThemeMode.dark : ThemeMode.light,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: AppColors.light.bg,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.light.accent,
          brightness: Brightness.light,
        ),
        extensions: const [AppColors.light],
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.dark.bg,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.dark.accent,
          brightness: Brightness.dark,
        ),
        extensions: const [AppColors.dark],
      ),
      home: const SplashScreen(),
    );
  }
}
