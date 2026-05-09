import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../l10n/app_strings.dart';
import '../providers/settings_provider.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';
import '../theme/tokens.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final c = context.colors;
    final isDark = ref.watch(settingsDarkModeProvider);
    final lang = ref.watch(settingsLanguageProvider);
    final s = AppStrings(lang);

    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top bar
            Padding(
              padding: const EdgeInsets.fromLTRB(4, 8, AppSpacing.pagePad, 0),
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: c.ink),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                  Text(s.settings, style: AppText.serif(22, color: c.ink)),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePad),
                children: [
                  // ── Appearance section ──
                  _SectionLabel(text: s.appearance, color: c.mute),
                  const SizedBox(height: 6),
                  _SettingsCard(
                    children: [
                      _ToggleRow(
                        icon: Icons.dark_mode_rounded,
                        title: s.darkMode,
                        subtitle: s.darkModeDesc,
                        value: isDark,
                        onChanged: (v) => ref
                            .read(settingsDarkModeProvider.notifier)
                            .setValue(v),
                        c: c,
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // ── Language section ──
                  _SectionLabel(text: s.language, color: c.mute),
                  const SizedBox(height: 6),
                  _SettingsCard(
                    children: [
                      _LangRow(
                        flag: '🇰🇷',
                        label: '한국어',
                        selected: lang == 'ko',
                        onTap: () => ref
                            .read(settingsLanguageProvider.notifier)
                            .setValue('ko'),
                        c: c,
                        showDivider: true,
                      ),
                      _LangRow(
                        flag: '🇺🇸',
                        label: 'English',
                        selected: lang == 'en',
                        onTap: () => ref
                            .read(settingsLanguageProvider.notifier)
                            .setValue('en'),
                        c: c,
                        showDivider: false,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String text;
  final Color color;
  const _SectionLabel({required this.text, required this.color});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 4),
      child: Text(
        text.toUpperCase(),
        style: AppText.mono(10, letterSpacing: 1.2, color: color),
      ),
    );
  }
}

class _SettingsCard extends StatelessWidget {
  final List<Widget> children;
  const _SettingsCard({required this.children});

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Container(
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(AppRadius.card),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(children: children),
    );
  }
}

class _ToggleRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;
  final AppColors c;
  const _ToggleRow({
    required this.icon, required this.title, required this.subtitle,
    required this.value, required this.onChanged, required this.c,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          Container(
            width: 36, height: 36,
            decoration: BoxDecoration(
              color: c.softer,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 18, color: c.accent),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppText.sans(14, color: c.ink, weight: FontWeight.w500)),
                Text(subtitle, style: AppText.sans(11.5, color: c.mute)),
              ],
            ),
          ),
          CupertinoSwitch(
            value: value,
            onChanged: onChanged,
            activeTrackColor: c.accent,
          ),
        ],
      ),
    );
  }
}

class _LangRow extends StatelessWidget {
  final String flag;
  final String label;
  final bool selected;
  final VoidCallback onTap;
  final AppColors c;
  final bool showDivider;
  const _LangRow({
    required this.flag, required this.label, required this.selected,
    required this.onTap, required this.c, required this.showDivider,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onTap: onTap,
          behavior: HitTestBehavior.opaque,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            child: Row(
              children: [
                Text(flag, style: const TextStyle(fontSize: 22)),
                const SizedBox(width: 14),
                Expanded(
                  child: Text(
                    label,
                    style: AppText.sans(14, color: c.ink, weight: FontWeight.w500),
                  ),
                ),
                if (selected)
                  Icon(Icons.check_rounded, size: 18, color: c.accent),
              ],
            ),
          ),
        ),
        if (showDivider)
          Divider(height: 1, thickness: 0.5, indent: 16, endIndent: 0, color: c.line),
      ],
    );
  }
}
