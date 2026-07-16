import 'package:flutter/material.dart';
import '../theme/typography.dart';

class PhotoPlaceholder extends StatelessWidget {
  final double hue;
  final String label;
  final double height;
  final bool small;

  const PhotoPlaceholder({
    super.key,
    this.hue = 20,
    this.label = '',
    required this.height,
    this.small = false,
  });

  Color _hsl(double l, double s, double h) =>
    HSLColor.fromAHSL(1, h, s.clamp(0.0, 1.0), l.clamp(0.0, 1.0)).toColor();

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg   = _hsl(isDark ? 0.62 : 0.88, 0.35, hue);
    final bg2  = _hsl(isDark ? 0.54 : 0.80, 0.45, hue);
    final inkC = _hsl(0.36, 0.35, hue);

    return SizedBox(
      width: double.infinity,
      height: height,
      child: Stack(
        fit: StackFit.expand,
        children: [
          CustomPaint(painter: _DiagonalPainter(bg, bg2)),
          Container(
            decoration: BoxDecoration(
              gradient: RadialGradient(
                center: const Alignment(-0.4, -0.5),
                radius: 0.8,
                colors: [Colors.white.withValues(alpha: 0.35), Colors.transparent],
              ),
            ),
          ),
          if (label.isNotEmpty && !small)
            Positioned(
              left: 14,
              bottom: 14,
              child: Text(
                label,
                style: AppText.mono(10, color: inkC, letterSpacing: 0.14 * 10),
              ),
            ),
        ],
      ),
    );
  }
}

class _DiagonalPainter extends CustomPainter {
  final Color bg;
  final Color bg2;
  const _DiagonalPainter(this.bg, this.bg2);

  @override
  void paint(Canvas canvas, Size size) {
    final basePaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter, end: Alignment.bottomCenter,
        colors: [bg, bg2],
      ).createShader(Offset.zero & size);
    canvas.drawRect(Offset.zero & size, basePaint);

    final stripePaint = Paint()..color = bg;
    var x = -size.height;
    while (x < size.width + size.height) {
      final path = Path()
        ..moveTo(x, 0)
        ..lineTo(x + 14, 0)
        ..lineTo(x + 14 + size.height, size.height)
        ..lineTo(x + size.height, size.height)
        ..close();
      canvas.drawPath(path, stripePaint);
      x += 15 * 2;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter old) => false;
}
