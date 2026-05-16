enum StopCategory {
  flight, hotel, walk, food, view, ferry, sight, shop, show, bar;

  String get label {
    const labels = {
      StopCategory.flight: 'Flight', StopCategory.hotel: 'Stay',
      StopCategory.walk: 'Walk', StopCategory.food: 'Eat',
      StopCategory.view: 'View', StopCategory.ferry: 'Ferry',
      StopCategory.sight: 'Sight', StopCategory.shop: 'Shop',
      StopCategory.show: 'Show', StopCategory.bar: 'Bar',
    };
    return labels[this] ?? name;
  }

  static StopCategory fromString(String s) {
    return StopCategory.values.firstWhere(
      (e) => e.name == s,
      orElse: () => StopCategory.sight,
    );
  }
}

class TripStop {
  final String time;
  final StopCategory cat;
  final String title;
  final String en;
  final String loc;
  final String? note;
  final String? price;
  final String? duration;
  final String? hotelRef;
  final String? anchor; // 'start' → 하루 시작 앵커 (정렬 최선두)

  const TripStop({
    required this.time,
    required this.cat,
    required this.title,
    this.en = '',
    this.loc = '',
    this.note,
    this.price,
    this.duration,
    this.hotelRef,
    this.anchor,
  });

  TripStop copyWith({
    String? time, StopCategory? cat, String? title, String? en,
    String? loc, String? note, String? price, String? duration,
    String? hotelRef, String? anchor,
  }) => TripStop(
    time: time ?? this.time,
    cat: cat ?? this.cat,
    title: title ?? this.title,
    en: en ?? this.en,
    loc: loc ?? this.loc,
    note: note ?? this.note,
    price: price ?? this.price,
    duration: duration ?? this.duration,
    hotelRef: hotelRef ?? this.hotelRef,
    anchor: anchor ?? this.anchor,
  );

  Map<String, dynamic> toJson() => {
    'time': time, 'cat': cat.name, 'title': title, 'en': en, 'loc': loc,
    if (note != null) 'note': note,
    if (price != null) 'price': price,
    if (duration != null) 'duration': duration,
    if (hotelRef != null) '_hotelRef': hotelRef,
    if (anchor != null) '_anchor': anchor,
  };

  factory TripStop.fromJson(Map<String, dynamic> j) => TripStop(
    time: j['time'] ?? '',
    cat: StopCategory.fromString(j['cat'] ?? 'sight'),
    title: j['title'] ?? '',
    en: j['en'] ?? '',
    loc: j['loc'] ?? '',
    note: j['note'],
    price: j['price'],
    duration: j['duration'],
    hotelRef: j['_hotelRef'],
    anchor: j['_anchor'],
  );
}

class TripDay {
  final int n;
  final String date;
  final String weekday;
  final String title;
  final String titleEn;
  final double heroHue;
  final String heroLabel;
  final String weather;
  final List<TripStop> items;

  const TripDay({
    required this.n,
    required this.date,
    required this.weekday,
    required this.title,
    this.titleEn = '',
    required this.heroHue,
    required this.heroLabel,
    this.weather = '',
    this.items = const [],
  });

  TripDay copyWith({
    int? n, String? date, String? weekday, String? title, String? titleEn,
    double? heroHue, String? heroLabel, String? weather, List<TripStop>? items,
  }) => TripDay(
    n: n ?? this.n, date: date ?? this.date, weekday: weekday ?? this.weekday,
    title: title ?? this.title, titleEn: titleEn ?? this.titleEn,
    heroHue: heroHue ?? this.heroHue, heroLabel: heroLabel ?? this.heroLabel,
    weather: weather ?? this.weather, items: items ?? this.items,
  );

  Map<String, dynamic> toJson() => {
    'n': n, 'date': date, 'weekday': weekday, 'title': title, 'titleEn': titleEn,
    'hero': {'hue': heroHue, 'label': heroLabel},
    'weather': weather, 'items': items.map((s) => s.toJson()).toList(),
  };

  factory TripDay.fromJson(Map<String, dynamic> j) => TripDay(
    n: j['n'] ?? 1,
    date: j['date'] ?? '',
    weekday: j['weekday'] ?? '',
    title: j['title'] ?? '',
    titleEn: j['titleEn'] ?? '',
    heroHue: ((j['hero']?['hue'] ?? 25) as num).toDouble(),
    heroLabel: j['hero']?['label'] ?? '',
    weather: j['weather'] ?? '',
    items: ((j['items'] ?? []) as List).map((e) => TripStop.fromJson(e)).toList(),
  );
}

class TripHotel {
  final String name;
  final String area;
  final String checkin;
  final String checkout;
  final String? checkinTime;
  final String? checkoutTime;
  final int nights;
  final String? price;
  final String? address;
  final String? phone;
  final List<String> amenities;
  final String? note;
  final double? rating;
  final double hue;

  const TripHotel({
    required this.name,
    this.area = '',
    this.checkin = '',
    this.checkout = '',
    this.checkinTime,
    this.checkoutTime,
    this.nights = 1,
    this.price,
    this.address,
    this.phone,
    this.amenities = const [],
    this.note,
    this.rating,
    this.hue = 25,
  });

  TripHotel copyWith({
    String? name, String? area, String? checkin, String? checkout,
    String? checkinTime, String? checkoutTime, int? nights, String? price,
    String? address, String? phone, List<String>? amenities, String? note,
    double? rating, double? hue,
  }) => TripHotel(
    name: name ?? this.name, area: area ?? this.area,
    checkin: checkin ?? this.checkin, checkout: checkout ?? this.checkout,
    checkinTime: checkinTime ?? this.checkinTime,
    checkoutTime: checkoutTime ?? this.checkoutTime,
    nights: nights ?? this.nights, price: price ?? this.price,
    address: address ?? this.address, phone: phone ?? this.phone,
    amenities: amenities ?? this.amenities, note: note ?? this.note,
    rating: rating ?? this.rating, hue: hue ?? this.hue,
  );

  Map<String, dynamic> toJson() => {
    'name': name, 'area': area, 'checkin': checkin, 'checkout': checkout,
    if (checkinTime != null) 'checkinTime': checkinTime,
    if (checkoutTime != null) 'checkoutTime': checkoutTime,
    'nights': nights,
    if (price != null) 'price': price,
    if (address != null) 'address': address,
    if (phone != null) 'phone': phone,
    'amenities': amenities,
    if (note != null) 'note': note,
    if (rating != null) 'rating': rating,
    'hue': hue,
  };

  factory TripHotel.fromJson(Map<String, dynamic> j) => TripHotel(
    name: j['name'] ?? '',
    area: j['area'] ?? '',
    checkin: j['checkin'] ?? '',
    checkout: j['checkout'] ?? '',
    checkinTime: j['checkinTime'],
    checkoutTime: j['checkoutTime'],
    nights: j['nights'] ?? 1,
    price: j['price'],
    address: j['address'],
    phone: j['phone'],
    amenities: ((j['amenities'] ?? []) as List).cast<String>(),
    note: j['note'],
    rating: j['rating'] != null ? (j['rating'] as num).toDouble() : null,
    hue: ((j['hue'] ?? 25) as num).toDouble(),
  );
}

class TripFood {
  final String cat;
  final String name;
  final String detail;
  final String price;
  final String note;

  const TripFood({
    required this.cat,
    required this.name,
    this.detail = '',
    this.price = '',
    this.note = '',
  });

  TripFood copyWith({String? cat, String? name, String? detail, String? price, String? note}) =>
    TripFood(
      cat: cat ?? this.cat, name: name ?? this.name,
      detail: detail ?? this.detail, price: price ?? this.price, note: note ?? this.note,
    );

  Map<String, dynamic> toJson() => {'cat': cat, 'name': name, 'detail': detail, 'price': price, 'note': note};
  factory TripFood.fromJson(Map<String, dynamic> j) => TripFood(
    cat: j['cat'] ?? '', name: j['name'] ?? '',
    detail: j['detail'] ?? '', price: j['price'] ?? '', note: j['note'] ?? '',
  );
}

class PrepCat {
  final String id;
  final String name;
  final List<String> items;

  const PrepCat({required this.id, required this.name, this.items = const []});

  PrepCat copyWith({String? name, List<String>? items}) =>
      PrepCat(id: id, name: name ?? this.name, items: items ?? this.items);

  Map<String, dynamic> toJson() => {'id': id, 'name': name, 'items': items};

  factory PrepCat.fromJson(Map<String, dynamic> j) => PrepCat(
        id: (j['id'] as String?) ?? 'cat_${DateTime.now().millisecondsSinceEpoch}',
        name: (j['name'] as String?) ?? '카테고리',
        items: ((j['items'] ?? []) as List).cast<String>(),
      );
}

class TripPrep {
  final List<PrepCat> cats;

  const TripPrep({this.cats = const []});

  TripPrep copyWith({List<PrepCat>? cats}) => TripPrep(cats: cats ?? this.cats);

  Map<String, dynamic> toJson() => {'cats': cats.map((c) => c.toJson()).toList()};

  factory TripPrep.fromJson(Map<String, dynamic> j) {
    if (j['cats'] != null) {
      return TripPrep(
        cats: (j['cats'] as List)
            .map((c) => PrepCat.fromJson(c as Map<String, dynamic>))
            .toList(),
      );
    }
    final result = <PrepCat>[];
    final cl = ((j['checklist'] ?? []) as List).cast<String>();
    final dl = ((j['docs'] ?? []) as List).cast<String>();
    final pl = ((j['pack'] ?? []) as List).cast<String>();
    if (cl.isNotEmpty) result.add(PrepCat(id: 'cat_checklist', name: '체크리스트', items: cl));
    if (dl.isNotEmpty) result.add(PrepCat(id: 'cat_docs', name: '입국 서류', items: dl));
    if (pl.isNotEmpty) result.add(PrepCat(id: 'cat_pack', name: '챙길 물건', items: pl));
    if (result.isEmpty) result.add(PrepCat(id: 'cat_1', name: '체크리스트', items: []));
    return TripPrep(cats: result);
  }
}

class Trip {
  final String id;
  final String title;
  final String subtitleKo;
  final String dates;
  final String travelers;
  final List<TripHotel> hotels;
  final List<TripDay> days;
  final List<TripFood> food;
  final TripPrep prep;

  const Trip({
    required this.id,
    required this.title,
    this.subtitleKo = '',
    this.dates = '',
    this.travelers = '',
    this.hotels = const [],
    this.days = const [],
    this.food = const [],
    this.prep = const TripPrep(),
  });

  Trip copyWith({
    String? id, String? title, String? subtitleKo, String? dates, String? travelers,
    List<TripHotel>? hotels, List<TripDay>? days, List<TripFood>? food, TripPrep? prep,
  }) => Trip(
    id: id ?? this.id, title: title ?? this.title,
    subtitleKo: subtitleKo ?? this.subtitleKo, dates: dates ?? this.dates,
    travelers: travelers ?? this.travelers, hotels: hotels ?? this.hotels,
    days: days ?? this.days, food: food ?? this.food, prep: prep ?? this.prep,
  );

  Map<String, dynamic> toJson() => {
    'id': id, 'title': title, 'subtitleKo': subtitleKo, 'dates': dates, 'travelers': travelers,
    'hotels': hotels.map((h) => h.toJson()).toList(),
    'days': days.map((d) => d.toJson()).toList(),
    'food': food.map((f) => f.toJson()).toList(),
    'prep': prep.toJson(),
  };

  factory Trip.fromJson(Map<String, dynamic> j) => Trip(
    id: j['id'] ?? '',
    title: j['title'] ?? '',
    subtitleKo: j['subtitleKo'] ?? '',
    dates: j['dates'] ?? '',
    travelers: j['travelers'] ?? '',
    hotels: ((j['hotels'] ?? []) as List).map((e) => TripHotel.fromJson(e)).toList(),
    days: ((j['days'] ?? []) as List).map((e) => TripDay.fromJson(e)).toList(),
    food: ((j['food'] ?? []) as List).map((e) => TripFood.fromJson(e)).toList(),
    prep: TripPrep.fromJson(j['prep'] ?? {}),
  );
}
