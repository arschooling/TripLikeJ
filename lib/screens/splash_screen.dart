import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/trips_provider.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';
import 'trips_list_screen.dart';

const _destinations = [
  'New York', 'Tokyo', 'Rome', 'Paris', 'Barcelona',
  'Bangkok', 'London', 'Sydney', 'Istanbul', 'Seoul',
];

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _fade;
  int _destIndex = 0;
  bool _navigated = false;
  bool _minTimeElapsed = false;
  bool _dataReady = false;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 150),
    )..addStatusListener(_onStatus);
    _fade = CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut);
    _ctrl.forward();

    // 최소 4초 표시 — 10개 도시 전체 순환 (도시당 400ms)
    Future.delayed(const Duration(milliseconds: 4000), () {
      if (!mounted) return;
      _minTimeElapsed = true;
      _tryNavigate();
    });
  }

  void _onStatus(AnimationStatus status) {
    if (status == AnimationStatus.completed) {
      Future.delayed(const Duration(milliseconds: 100), () {
        if (mounted) _ctrl.reverse();
      });
    } else if (status == AnimationStatus.dismissed) {
      if (mounted) {
        setState(() => _destIndex = (_destIndex + 1) % _destinations.length);
        _ctrl.forward();
      }
    }
  }

  void _tryNavigate() {
    if (_minTimeElapsed && _dataReady && !_navigated) _goToMain();
  }

  void _goToMain() {
    if (_navigated || !mounted) return;
    _navigated = true;
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (_, __, ___) => const TripsListScreen(),
        transitionDuration: const Duration(milliseconds: 500),
        transitionsBuilder: (_, anim, __, child) =>
            FadeTransition(opacity: anim, child: child),
      ),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    ref.listen(tripsProvider, (_, next) {
      if (next.hasValue) {
        _dataReady = true;
        _tryNavigate();
      }
    });

    if (!_dataReady && ref.read(tripsProvider).hasValue) {
      _dataReady = true;
    }

    return Scaffold(
      backgroundColor: c.bg,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Spacer(),
            Text('Trip Like J', style: AppText.serif(38)),
            const SizedBox(height: 16),
            FadeTransition(
              opacity: _fade,
              child: Text(
                _destinations[_destIndex],
                style: AppText.mono(11, letterSpacing: 2.5, color: c.mute),
              ),
            ),
            const Spacer(),
            Padding(
              padding: const EdgeInsets.only(bottom: 48),
              child: SizedBox(
                width: 32,
                height: 32,
                child: CircularProgressIndicator(
                  strokeWidth: 1.5,
                  color: c.accent.withValues(alpha: 0.5),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
