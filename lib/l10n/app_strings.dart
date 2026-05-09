class AppStrings {
  final String lang;
  const AppStrings(this.lang);

  bool get isEn => lang == 'en';

  // Navigation
  String get myTrips       => 'My Trips';
  String get schedule      => isEn ? 'Schedule' : '일정';
  String get map           => isEn ? 'Map'      : '지도';
  String get food          => isEn ? 'Food'     : '맛집';
  String get prep          => isEn ? 'Prep'     : '준비';

  // Actions
  String get edit          => isEn ? 'Edit'     : '편집';
  String get done          => isEn ? 'Done'     : '완료';
  String get cancel        => isEn ? 'Cancel'   : '취소';
  String get confirm       => isEn ? 'Confirm'  : '확인';
  String get save          => isEn ? 'Save'     : '저장';
  String get delete        => isEn ? 'Delete'   : '삭제';
  String get add           => isEn ? 'Add'      : '추가';

  // Trips list
  String get addTrip       => isEn ? '+ Add Trip'    : '+ 새 여행 추가';
  String get emptyTrips    => isEn ? 'Add your first trip!' : '여행을 추가해보세요!';

  // Settings
  String get settings      => isEn ? 'Settings'      : '설정';
  String get darkMode      => isEn ? 'Dark Mode'     : '다크 모드';
  String get darkModeDesc  => isEn ? 'Dark background for low-light use' : '어두운 배경으로 전환';
  String get language      => isEn ? 'Language'      : '언어';
  String get langKorean    => isEn ? 'Korean'        : '한국어';
  String get langEnglish   => isEn ? 'English'       : '영어';
  String get appearance    => isEn ? 'Appearance'    : '화면';

  // Home screen
  String get loading       => isEn ? 'Loading…'   : '로딩 중…';
  String get errorPrefix   => isEn ? 'Error: '    : '오류: ';
  String get noTrip        => isEn ? 'Trip not found' : '여행을 찾을 수 없어요';
  String get addDay        => isEn ? '+ Add Day'  : '+ 일 추가';
  String get addHotel      => isEn ? '+ Add Hotel': '+ 호텔 추가';
  String get noHotel       => isEn ? 'No hotel'   : '호텔 없음';
  String get night         => isEn ? 'Night'      : '박';
  String get budget        => isEn ? 'Budget'     : '예산';

  // Day detail
  String get addItem       => isEn ? '+ Add Stop'    : '+ 일정 추가';
  String get noItems       => isEn ? 'No stops yet'  : '일정을 추가해보세요';

  // Food screen
  String get addFood       => isEn ? '+ Add Restaurant' : '+ 맛집 추가';
  String get noFood        => isEn ? 'No restaurants yet' : '맛집을 추가해보세요';

  // Prep screen
  String get noPrepItems   => isEn ? 'All done!' : '모두 완료!';
}
