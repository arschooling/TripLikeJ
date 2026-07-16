import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/trip.dart';
import '../providers/trips_provider.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';
import '../theme/tokens.dart';
import '../widgets/edit_button.dart';
import '../widgets/photo_placeholder.dart';
import '../widgets/bottom_sheet_modal.dart';
import '../widgets/date_picker_sheet.dart';
import '../widgets/time_wheel_sheet.dart';

class HotelDetailScreen extends ConsumerStatefulWidget {
  final int tripIndex;
  final int hotelIndex;

  const HotelDetailScreen({
    super.key,
    required this.tripIndex,
    required this.hotelIndex,
  });

  @override
  ConsumerState<HotelDetailScreen> createState() =>
      _HotelDetailScreenState();
}

class _HotelDetailScreenState extends ConsumerState<HotelDetailScreen> {
  bool _editing = false;

  // Edit controllers
  late TextEditingController _nameCtrl;
  late TextEditingController _areaCtrl;
  late TextEditingController _checkinCtrl;
  late TextEditingController _checkoutCtrl;
  late TextEditingController _checkinTimeCtrl;
  late TextEditingController _checkoutTimeCtrl;
  late TextEditingController _nightsCtrl;
  late TextEditingController _priceCtrl;
  late TextEditingController _addressCtrl;
  late TextEditingController _phoneCtrl;
  late TextEditingController _noteCtrl;
  late TextEditingController _ratingCtrl;
  late TextEditingController _amenityInputCtrl;
  late List<String> _amenities;

  TripHotel? _original;

  void _initControllers(TripHotel hotel) {
    _nameCtrl = TextEditingController(text: hotel.name);
    _areaCtrl = TextEditingController(text: hotel.area);
    _checkinCtrl = TextEditingController(text: hotel.checkin);
    _checkoutCtrl = TextEditingController(text: hotel.checkout);
    _checkinTimeCtrl =
        TextEditingController(text: hotel.checkinTime ?? '15:00');
    _checkoutTimeCtrl =
        TextEditingController(text: hotel.checkoutTime ?? '12:00');
    _nightsCtrl = TextEditingController(text: '${hotel.nights}');
    _priceCtrl = TextEditingController(text: hotel.price ?? '');
    _addressCtrl = TextEditingController(text: hotel.address ?? '');
    _phoneCtrl = TextEditingController(text: hotel.phone ?? '');
    _noteCtrl = TextEditingController(text: hotel.note ?? '');
    _ratingCtrl =
        TextEditingController(text: hotel.rating?.toString() ?? '');
    _amenityInputCtrl = TextEditingController();
    _amenities = [...hotel.amenities];
  }

  void _disposeControllers() {
    _nameCtrl.dispose();
    _areaCtrl.dispose();
    _checkinCtrl.dispose();
    _checkoutCtrl.dispose();
    _checkinTimeCtrl.dispose();
    _checkoutTimeCtrl.dispose();
    _nightsCtrl.dispose();
    _priceCtrl.dispose();
    _addressCtrl.dispose();
    _phoneCtrl.dispose();
    _noteCtrl.dispose();
    _ratingCtrl.dispose();
    _amenityInputCtrl.dispose();
  }

  TripHotel _buildHotel(TripHotel original) => original.copyWith(
        name: _nameCtrl.text,
        area: _areaCtrl.text,
        checkin: _checkinCtrl.text,
        checkout: _checkoutCtrl.text,
        checkinTime: _checkinTimeCtrl.text.isEmpty
            ? null
            : _checkinTimeCtrl.text,
        checkoutTime: _checkoutTimeCtrl.text.isEmpty
            ? null
            : _checkoutTimeCtrl.text,
        nights: int.tryParse(_nightsCtrl.text) ?? original.nights,
        price: _priceCtrl.text.isEmpty ? null : _priceCtrl.text,
        address: _addressCtrl.text.isEmpty ? null : _addressCtrl.text,
        phone: _phoneCtrl.text.isEmpty ? null : _phoneCtrl.text,
        note: _noteCtrl.text.isEmpty ? null : _noteCtrl.text,
        rating: double.tryParse(_ratingCtrl.text),
        amenities: _amenities,
      );

  @override
  void dispose() {
    if (_original != null) {
      _disposeControllers();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    final tripsAsync = ref.watch(tripsProvider);
    final trips = tripsAsync.value;
    if (trips == null ||
        widget.tripIndex >= trips.length ||
        widget.hotelIndex >= trips[widget.tripIndex].hotels.length) {
      return Scaffold(
        backgroundColor: c.bg,
        body: Center(child: CircularProgressIndicator(color: c.accent)),
      );
    }
    final hotel = trips[widget.tripIndex].hotels[widget.hotelIndex];

    // Initialize controllers on first access
    if (_original == null) {
      _original = hotel;
      _initControllers(hotel);
    }

    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        child: Column(
          children: [
            // Hero photo + overlay
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(0),
                    bottomRight: Radius.circular(0),
                  ),
                  child: PhotoPlaceholder(
                    hue: hotel.hue,
                    label: '',
                    height: 200,
                  ),
                ),
                // Back button
                Positioned(
                  left: 8,
                  top: 8,
                  child: GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.black.withValues(alpha: 0.35),
                      ),
                      child: const Icon(Icons.arrow_back_ios_new_rounded,
                          size: 16, color: Colors.white),
                    ),
                  ),
                ),
                // Edit button
                Positioned(
                  right: AppSpacing.pagePad,
                  top: 8,
                  child: EditButton(
                    editing: _editing,
                    onTap: () {
                      if (_editing) {
                        // Save
                        final updated = _buildHotel(hotel);
                        ref
                            .read(tripsProvider.notifier)
                            .editHotel(widget.tripIndex, widget.hotelIndex,
                                updated);
                      }
                      setState(() => _editing = !_editing);
                    },
                  ),
                ),
                // Title overlay
                Positioned(
                  left: AppSpacing.pagePad,
                  bottom: 14,
                  right: AppSpacing.pagePad,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(hotel.name,
                          style: AppText.serif(22, color: Colors.white)),
                      if (hotel.area.isNotEmpty)
                        Text(hotel.area,
                            style: AppText.mono(10, color: Colors.white)),
                    ],
                  ),
                ),
              ],
            ),
            // Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(AppSpacing.pagePad),
                child: _editing
                    ? _EditContent(
                        nameCtrl: _nameCtrl,
                        areaCtrl: _areaCtrl,
                        checkinCtrl: _checkinCtrl,
                        checkoutCtrl: _checkoutCtrl,
                        checkinTimeCtrl: _checkinTimeCtrl,
                        checkoutTimeCtrl: _checkoutTimeCtrl,
                        nightsCtrl: _nightsCtrl,
                        priceCtrl: _priceCtrl,
                        addressCtrl: _addressCtrl,
                        phoneCtrl: _phoneCtrl,
                        noteCtrl: _noteCtrl,
                        ratingCtrl: _ratingCtrl,
                        amenities: _amenities,
                        amenityInputCtrl: _amenityInputCtrl,
                        onAmenitiesChanged: (a) =>
                            setState(() => _amenities = a),
                        onPickCheckin: () => _pickDate(context, true),
                        onPickCheckout: () => _pickDate(context, false),
                        onPickCheckinTime: () =>
                            _pickTime(context, _checkinTimeCtrl),
                        onPickCheckoutTime: () =>
                            _pickTime(context, _checkoutTimeCtrl),
                      )
                    : _ViewContent(hotel: hotel),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _pickDate(BuildContext ctx, bool isCheckin) {
    showGeneralDialog(
      context: ctx,
      barrierDismissible: false,
      barrierColor: Colors.transparent,
      pageBuilder: (dCtx, _, __) => BottomSheetModal(
        title: isCheckin ? '체크인 날짜' : '체크아웃 날짜',
        onCancel: () => Navigator.pop(dCtx),
        onConfirm: () => Navigator.pop(dCtx),
        child: DatePickerContent(
          initialDate: null,
          onDateSelected: (d) {
            final str =
                '${d.month}월 ${d.day}일, ${d.year}';
            setState(() {
              if (isCheckin) {
                _checkinCtrl.text = str;
              } else {
                _checkoutCtrl.text = str;
              }
            });
          },
        ),
      ),
    );
  }

  void _pickTime(BuildContext ctx, TextEditingController ctrl) {
    showGeneralDialog(
      context: ctx,
      barrierDismissible: false,
      barrierColor: Colors.transparent,
      pageBuilder: (dCtx, _, __) => BottomSheetModal(
        title: '시간 선택',
        onCancel: () => Navigator.pop(dCtx),
        onConfirm: () => Navigator.pop(dCtx),
        child: TimeWheelContent(
          initialTime: ctrl.text.isEmpty ? '15:00' : ctrl.text,
          onTimeSelected: (t) => setState(() => ctrl.text = t),
        ),
      ),
    );
  }
}

class _ViewContent extends StatelessWidget {
  final TripHotel hotel;

  const _ViewContent({required this.hotel});

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(hotel.name, style: AppText.serif(22)),
        if (hotel.area.isNotEmpty) ...[
          const SizedBox(height: 2),
          Text(hotel.area, style: AppText.mono(10)),
        ],
        SizedBox(height: 12),
        // Checkin/Checkout
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: c.card,
            borderRadius: BorderRadius.circular(AppRadius.card),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 6,
              ),
            ],
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('체크인',
                        style: AppText.sans(11, color: c.mute)),
                    Text(hotel.checkin, style: AppText.sans(13)),
                    if (hotel.checkinTime != null)
                      Text(hotel.checkinTime!,
                          style: AppText.mono(10, letterSpacing: 0.5)),
                  ],
                ),
              ),
              Icon(Icons.arrow_forward_rounded,
                  size: 16, color: c.mute),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text('체크아웃',
                        style: AppText.sans(11, color: c.mute)),
                    Text(hotel.checkout, style: AppText.sans(13)),
                    if (hotel.checkoutTime != null)
                      Text(hotel.checkoutTime!,
                          style: AppText.mono(10, letterSpacing: 0.5)),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),
        // Chips row
        Row(
          children: [
            _Chip('${hotel.nights}박'),
            if (hotel.price != null) ...[
              const SizedBox(width: 6),
              _Chip(hotel.price!),
            ],
            if (hotel.rating != null) ...[
              const SizedBox(width: 6),
              _StarRating(hotel.rating!),
            ],
          ],
        ),
        if (hotel.address != null && hotel.address!.isNotEmpty) ...[
          const SizedBox(height: 12),
          _InfoRow(Icons.location_on_rounded, hotel.address!),
        ],
        if (hotel.phone != null && hotel.phone!.isNotEmpty) ...[
          SizedBox(height: 6),
          _InfoRow(Icons.phone_rounded, hotel.phone!),
        ],
        if (hotel.amenities.isNotEmpty) ...[
          SizedBox(height: 14),
          Text('편의시설', style: AppText.sans(12, color: c.mute)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: hotel.amenities
                .map((a) => Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: c.soft,
                        borderRadius: BorderRadius.circular(AppRadius.chip),
                      ),
                      child: Text(a, style: AppText.sans(12)),
                    ))
                .toList(),
          ),
        ],
        if (hotel.note != null && hotel.note!.isNotEmpty) ...[
          SizedBox(height: 14),
          Text('메모', style: AppText.sans(12, color: c.mute)),
          SizedBox(height: 4),
          Text(hotel.note!, style: AppText.sans(13, color: c.mute)),
        ],
      ],
    );
  }
}

class _EditContent extends StatelessWidget {
  final TextEditingController nameCtrl;
  final TextEditingController areaCtrl;
  final TextEditingController checkinCtrl;
  final TextEditingController checkoutCtrl;
  final TextEditingController checkinTimeCtrl;
  final TextEditingController checkoutTimeCtrl;
  final TextEditingController nightsCtrl;
  final TextEditingController priceCtrl;
  final TextEditingController addressCtrl;
  final TextEditingController phoneCtrl;
  final TextEditingController noteCtrl;
  final TextEditingController ratingCtrl;
  final List<String> amenities;
  final TextEditingController amenityInputCtrl;
  final void Function(List<String>) onAmenitiesChanged;
  final VoidCallback onPickCheckin;
  final VoidCallback onPickCheckout;
  final VoidCallback onPickCheckinTime;
  final VoidCallback onPickCheckoutTime;

  const _EditContent({
    required this.nameCtrl,
    required this.areaCtrl,
    required this.checkinCtrl,
    required this.checkoutCtrl,
    required this.checkinTimeCtrl,
    required this.checkoutTimeCtrl,
    required this.nightsCtrl,
    required this.priceCtrl,
    required this.addressCtrl,
    required this.phoneCtrl,
    required this.noteCtrl,
    required this.ratingCtrl,
    required this.amenities,
    required this.amenityInputCtrl,
    required this.onAmenitiesChanged,
    required this.onPickCheckin,
    required this.onPickCheckout,
    required this.onPickCheckinTime,
    required this.onPickCheckoutTime,
  });

  Widget _field(BuildContext context, String label, TextEditingController ctrl,
      {TextInputType? keyboardType, int maxLines = 1, VoidCallback? onTap, bool readOnly = false}) {
    final c = context.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppText.sans(11, color: c.mute)),
        const SizedBox(height: 4),
        TextField(
          controller: ctrl,
          keyboardType: keyboardType,
          maxLines: maxLines,
          readOnly: readOnly || onTap != null,
          onTap: onTap,
          style: AppText.sans(14, color: c.ink),
          decoration: InputDecoration(
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            filled: true,
            fillColor: c.softer,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.input),
              borderSide: BorderSide.none,
            ),
            isDense: true,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _field(context, '호텔명', nameCtrl),
        const SizedBox(height: 10),
        _field(context, '지역', areaCtrl),
        const SizedBox(height: 10),
        Row(children: [
          Expanded(
              child: _field(context, '체크인 날짜', checkinCtrl,
                  onTap: onPickCheckin, readOnly: true)),
          const SizedBox(width: 10),
          Expanded(
              child: _field(context, '체크인 시간', checkinTimeCtrl,
                  onTap: onPickCheckinTime, readOnly: true)),
        ]),
        const SizedBox(height: 10),
        Row(children: [
          Expanded(
              child: _field(context, '체크아웃 날짜', checkoutCtrl,
                  onTap: onPickCheckout, readOnly: true)),
          const SizedBox(width: 10),
          Expanded(
              child: _field(context, '체크아웃 시간', checkoutTimeCtrl,
                  onTap: onPickCheckoutTime, readOnly: true)),
        ]),
        const SizedBox(height: 10),
        Row(children: [
          Expanded(
              child: _field(context, '숙박일수', nightsCtrl,
                  keyboardType: TextInputType.number)),
          const SizedBox(width: 10),
          Expanded(child: _field(context, '가격', priceCtrl)),
        ]),
        const SizedBox(height: 10),
        _field(context, '주소', addressCtrl),
        const SizedBox(height: 10),
        _field(context, '전화번호', phoneCtrl, keyboardType: TextInputType.phone),
        const SizedBox(height: 10),
        _field(context, '평점 (0-5)', ratingCtrl,
            keyboardType:
                const TextInputType.numberWithOptions(decimal: true)),
        SizedBox(height: 14),
        // Amenities
        Text('편의시설', style: AppText.sans(12, color: c.mute)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 6,
          runSpacing: 6,
          children: amenities
              .asMap()
              .entries
              .map((e) => GestureDetector(
                    onTap: () {
                      final list = [...amenities];
                      list.removeAt(e.key);
                      onAmenitiesChanged(list);
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: c.soft,
                        borderRadius: BorderRadius.circular(AppRadius.chip),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(e.value, style: AppText.sans(12)),
                          SizedBox(width: 4),
                          Icon(Icons.close_rounded,
                              size: 12, color: c.mute),
                        ],
                      ),
                    ),
                  ))
              .toList(),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: amenityInputCtrl,
                style: AppText.sans(13),
                decoration: InputDecoration(
                  hintText: '편의시설 추가 (예: WiFi)',
                  hintStyle: AppText.sans(13, color: c.mute),
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 10),
                  filled: true,
                  fillColor: c.softer,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.input),
                    borderSide: BorderSide.none,
                  ),
                  isDense: true,
                ),
              ),
            ),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: () {
                final text = amenityInputCtrl.text.trim();
                if (text.isNotEmpty) {
                  onAmenitiesChanged([...amenities, text]);
                  amenityInputCtrl.clear();
                }
              },
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: c.ink,
                  borderRadius: BorderRadius.circular(AppRadius.input),
                ),
                child: Text('+',
                    style: AppText.sans(14,
                        color: Colors.white, weight: FontWeight.w600)),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        _field(context, '메모', noteCtrl, maxLines: 3),
        const SizedBox(height: 20),
      ],
    );
  }
}

class _Chip extends StatelessWidget {
  final String text;

  const _Chip(this.text);

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: c.soft,
        borderRadius: BorderRadius.circular(AppRadius.chip),
      ),
      child: Text(text, style: AppText.mono(10, letterSpacing: 0.5)),
    );
  }
}

class _StarRating extends StatelessWidget {
  final double rating;

  const _StarRating(this.rating);

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (i) {
        final filled = i < rating.floor();
        final half = !filled && i < rating;
        return Icon(
          half
              ? Icons.star_half_rounded
              : filled
                  ? Icons.star_rounded
                  : Icons.star_border_rounded,
          size: 14,
          color: c.accent,
        );
      }),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;

  const _InfoRow(this.icon, this.text);

  @override
  Widget build(BuildContext context) {
    final c = context.colors;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 14, color: c.mute),
        SizedBox(width: 6),
        Expanded(
            child: Text(text, style: AppText.sans(13, color: c.mute))),
      ],
    );
  }
}
