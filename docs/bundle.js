// Real NYC trip data, parsed from the uploaded itinerary
window.TRIP_DEFAULT = {
  title: 'New York',
  subtitleKo: '뉴욕 · 10일',
  dates: 'May 4 — May 13, 2025',
  travelers: 'Solo trip',
  hotel: 'Kimpton Theta New York (Times Square)',
  hotels: [
    {
      name: 'Kimpton Theta New York',
      area: 'Times Square',
      checkin: 'May 4, 2025',
      checkinTime: '15:00',
      checkout: 'May 9, 2025',
      checkoutTime: '12:00',
      nights: 5,
      price: '$289/박',
      address: '125 W 48th St, New York, NY 10036',
      phone: '+1 212-354-2323',
      confirmation: '73378565985208',
      amenities: ['Free WiFi', 'Fitness Center', 'Pet Friendly', 'Bar', '24h Front Desk'],
      note: '타임스퀘어에서 도보 3분. 체크인 15시, 체크아웃 12시. 프론트에서 룸 업그레이드 요청 가능.',
      rating: 4.3,
      hue: 25,
    },
    {
      name: 'Royal Sonesta Washington DC Capitol Hill',
      area: 'Capitol Hill, D.C.',
      checkin: 'May 9, 2025',
      checkinTime: '16:00',
      checkout: 'May 11, 2025',
      checkoutTime: '11:00',
      nights: 2,
      address: '20 Massachusetts Ave NW, Washington, DC 20001',
      phone: '+1 202-888-1850',
      confirmation: '73392131862879',
      amenities: ['Free WiFi', 'Fitness Center', 'Restaurant', 'Bar', 'Pet Friendly', 'Valet Parking'],
      note: '체크인 16시, 체크아웃 11시. 캐피톨 힐 인근. 발레파킹 가능.',
      rating: 4.0,
      hue: 200,
    },
    {
      name: 'Hotel RIU Plaza Manhattan Times Square',
      area: 'Times Square',
      checkin: 'May 11, 2025',
      checkinTime: '15:00',
      checkout: 'May 14, 2025',
      checkoutTime: '12:00',
      nights: 3,
      address: '145 W 47th St, New York, NY 10036',
      phone: '+1 646-864-1100',
      confirmation: '73382367193804',
      amenities: ['Free WiFi', 'Fitness Center', 'Restaurant', 'Bar', 'Free Breakfast', 'Business Center'],
      note: '체크인 15시, 체크아웃 12시. 조식 포함. 타임스퀘어 도보 1분.',
      rating: 4.0,
      hue: 40,
    },
  ],
  days: [
    {
      n: 1, date: 'May 4', weekday: 'Mon',
      title: '도착, 타임스퀘어',
      titleEn: 'Arrival & Midtown',
      hero: { hue: 25, label: 'TIMES SQUARE' },
      weather: '맑음 · 18°',
      items: [
        { time: '10:00', cat: 'flight', title: 'JFK 공항 도착',   en: 'Arrive at JFK Airport', loc: 'JFK International',
          note: '지하철로 이동\n맨해튼까지 60분\nair train(엘리베이터level 2)-jamaica station(빨간색방향)-내려서 엘리베이터로L2층(Concourse)- 에어트레인 이용료8.25달러결제-표지판: 머리 위에 있는 \'Subway E J Z\'-엘리베이터 위치: 보통 계단 옆쪽이나 구석에 \'Elevator to E Train\' 표지판-엘리베이터\'Lower Level (E Train Platform)\' 버튼-(탑승전3달러결제)E선 열차 탑승-방향 확인: \'Manhattan Bound\' 또는 \'World Trade Center\' 행이라고 적힌 전광판-E선(파란색 동그라미)-40분 걸려50th Street 역 도착-지상' },
        { time: '14:00', cat: 'hotel',  title: '호텔 짐 맡기기',    en: 'Kimpton Theta New York', loc: 'Times Square by IHG',
          note: '체크인/프론트에 짐 맡기기\n"Hi, I\'m a bit early for check-in. Is it possible to leave my luggage here for a while?"' },
        { time: '14:30', cat: 'food',   title: '점심: 피자 or 타코', en: "Joe's Pizza / Los Tacos No.1", loc: 'Midtown',
          note: "Joe's Pizza (뉴욕 정통 조각 피자)\nLos Tacos No.1 (타코 맛집)", price: '$' },
        { time: '15:30', cat: 'sight',  title: '뉴욕 공립 도서관',   en: 'New York Public Library', loc: '5th Ave @ 42nd',
          note: '도서관 입구의 두마리 사자상(인내, 용기)\n1층 아스토 홀(Astor Hall)\n1층 treasures exhibition트레저스 엑시비션:구텐바르크 성경, 토마스 제퍼슨의 \'독립선언서\' 사본, 찰스디킨스의 필기구..\n맥그로우 로툰다(McGraw Rotunda): 로즈 메인 리딩 룸 들어가기전 웅장한 중앙 홀\n3층 Rose Main Reading Room(인셉션, 투모로우 배경) \n로즈 메인 리딩 룸 이용 팁:리딩 룸 입구는 두 곳입니다. 하나는 관광객용(사진만 찍고 나가는 곳), 하나는 이용자용(Study & Research)입니다\n입구에서 보안 요원이 "Visiting or Studying?"이라고 물을 수 있습니다. 이때 "Studying" 혹은 "Reading"이라고 답하고 \n안쪽으로 들어가 빈자리에 앉으시면 됩니다. I\'m here for quiet study/reading이라고 대답하기\n퇴실은 5시 45분쯤', duration: '1h 30m' },
        { time: '17:30', cat: 'hotel',  title: '호텔 체크인',       en: 'Hotel Check-in', loc: 'Kimpton Theta', _hotelRef: 'Kimpton Theta New York' },
        { time: '19:30', cat: 'show',   title: 'Top View 야경 버스', en: 'Top View Night Bus Tour', loc: "M&M's World 앞",
          note: "타임스퀘어 (M&M's World 앞출발)\n타임스퀘어-크라이슬러,공립도서관-플랫아이언-워싱턴스퀘어파크-브루클린브릿지(90분)", price: '$29–44', duration: '90m' },
        { time: '21:30', cat: 'food',   title: '저녁: Chick-fil-A',  en: 'Chick-fil-A', loc: 'Midtown',
          note: 'Chick-fil-A칙필레버거: Chick-fil-A Chicken Sandwich meal, deluxe(+토마토치즈양배추), \n감자튀김 찍어먹을 소스부탁 can i get all the sauces, please?\n칙필레미니사이즈소스:8oz(2.9달러+tax=3.25달러)', price: '$' },
      ],
    },
    {
      n: 2, date: 'May 5', weekday: 'Tue',
      title: '자유의 여신상, 덤보',
      titleEn: 'Liberty & Downtown',
      hero: { hue: 210, label: 'LIBERTY CRUISE' },
      weather: '흐림 · 16°',
      items: [
        { time: '09:30', cat: 'ferry',  title: '다운타운 리버티 크루즈', en: 'Downtown Liberty Cruise', loc: 'Pier 16 · 167 John St',
          note: '호텔에서 지하철타고 풀턴 스트리트 서브웨이 스테이션\npier16탑승(Pier 16,167 John St, New York, NY 10038):자유의여신상-브루클린 브릿지뷰(60분)\n스케줄: 오전 10시, 11시 30분, 13시, 14시 30분', price: '₩27,945', duration: '60m' },
        { time: '11:30', cat: 'walk',   title: '배터리 파크',          en: 'Battery Park', loc: 'Lower Manhattan',
          note: '자유의 여신상 보이는 공원' },
        { time: '12:15', cat: 'sight',  title: '월스트리트',           en: 'Wall Street', loc: 'Financial District',
          note: '황소상, 뉴욕 증권거래소 구경' },
        { time: '13:30', cat: 'food',   title: '점심',                en: 'Lunch — FiDi', loc: 'Financial District', price: '$$' },
        { time: '14:30', cat: 'sight',  title: '9/11 메모리얼 & Oculus', en: '9/11 Memorial + One WTC', loc: '180 Greenwich St',
          note: '세계무역센터 부지 및 911메모리얼 파크\n911메모리얼파크:쌍둥이 빌딩 자리에 만들어진 추모공원\n원월드트레이드센터(무너진 건물을 대신해 그 옆에 새로 생긴 미국에서 가장 높은 빌딩)\n오큘러스(기차역, 쇼핑몰)' },
        { time: '16:00', cat: 'view',   title: '덤보 — 맨해튼 브리지 뷰', en: 'DUMBO / 35 Washington St', loc: 'Brooklyn',
          note: '주소: 35 Washington St, Brooklyn, NY11201\nWTC 근처의 Chambers St Station (또는 Fulton St Station)에서 A 또는 C 라인 Downtown & Brooklyn 방면 열차-High St - Brooklyn Bridge Station에서 내리기' },
        { time: '16:30', cat: 'food',   title: "Juliana's Pizza",      en: "Juliana's Pizza", loc: 'DUMBO',
          note: '줄리아나 피자: 하프앤하프, 마리게리타+화이트조합', price: '$$' },
        { time: '17:30', cat: 'walk',   title: '브루클린 브리지 도보',  en: 'Brooklyn Bridge Walk', loc: 'Brooklyn → Manhattan',
          note: '워싱턴 스트리트에서 위쪽(남쪽) 언덕 방향으로 2분만→구글 맵에 "Brooklyn Bridge Underpass" 혹은 "Washington St Stairway"라고 검색\n계단을 따라 올라가면 바로 브루클린 브릿지의 보행자 전용도로Wooden Walkway연결\n맨해튼 스카이라인 보면서 30-40분 걷기\nCity Hall 역에서 N, R, W선 (노란색 라인) 탑승 42 St - Times Sq 역 하차(15분 소요)', duration: '40m' },
        { time: '19:30', cat: 'food',   title: '저녁',                 en: 'Dinner', loc: 'Midtown' },
      ],
    },
    {
      n: 3, date: 'May 6', weekday: 'Wed',
      title: 'MoMA와 록펠러',
      titleEn: 'MoMA & Rockefeller',
      hero: { hue: 45, label: 'ROCKEFELLER PLAZA' },
      weather: '맑음 · 19°',
      items: [
        { time: '10:00', cat: 'sight',  title: 'MoMA',                 en: 'Museum of Modern Art', loc: '11 W 53rd St',
          note: '오픈런 입장→무료 한국어 오디오 가이드(모마 내 와이파이 접속)\n5층부터 내려오기*(5층: 고흐의 별이 빛나는 밤, 피카소의 아비뇽의 여인들, 모네의 수련)\n4층 앤디워홀의 캠벨 수프 캔\n1층 야외정원Abby Aldrich Rockefeller Sculpture Garden\n굿즈 구입: 모자', duration: '2h 30m' },
        { time: '13:00', cat: 'food',   title: "Gallagher's 스테이크",  en: "Gallagher's Steakhouse", loc: 'Midtown',
          note: '갤러거 스테이크 하우스\nLunch Special Menu 3-Course Lunch Menu로 운영되며, 에피타이저 + 메인(Sliced Filet Mignon) + 디저트가 포함\n물은 tap water(수돗물 무료), bottled water(유료) 선택\n에피타이저는 시저샐러드, 클램차우더수프/메인은 Sliced Filet Mignon, 10 oz. Filet Mignon/디저트는 뉴욕치즈케이크, 아이스크림\n식사후 영수증 요청→팁 선택→최종금액을 적어 서명과 함께 카드를 두면→결제 후 카드 돌려줌 ', price: '$$$$', duration: '1h 30m' },
        { time: '15:00', cat: 'walk',   title: '5번가 산책',           en: '5th Avenue Stroll', loc: '5th Ave',
          note: '세인트 패트릭 대성당 내부관람, 웅장한 고딕양식' },
        { time: '16:00', cat: 'sight',  title: '그랜드 센트럴',         en: 'Grand Central Terminal', loc: '89 E 42nd St',
          note: '세계 최대 기차역' },
        { time: '17:00', cat: 'walk',   title: '록펠러 플라자',         en: 'Rockefeller Center Plaza', loc: 'Midtown',
          note: '탑오브더락 입장전 주변구경' },
        { time: '18:30', cat: 'view',   title: 'Top of the Rock',      en: 'Top of the Rock Observatory', loc: 'Rockefeller Center',
          note: '일몰 1시간 전 입장(+야경 감상), 엠파이어빌딩 뷰', price: '₩64,490' },
        { time: '21:00', cat: 'food',   title: '저녁',                 en: 'Dinner', loc: 'Midtown' },
      ],
    },
    {
      n: 4, date: 'May 7', weekday: 'Thu',
      title: '메트로폴리탄, 클로이스터',
      titleEn: 'The Met & Cloisters',
      hero: { hue: 340, label: 'THE MET · 5TH AVE' },
      weather: '맑음 · 21°',
      items: [
        { time: '10:00', cat: 'sight',  title: 'The Met',               en: 'Metropolitan Museum of Art', loc: '1000 5th Ave',
          note: '10시 개장과 동시 입장추천, 200만점의 작품이 있어 선택과 집중이 핵심\n정문에 도착하면 줄이 두갈래 \'General Admission\' 혹은 \'Timed Entry\' 줄에 서세요. (예약자는 줄이 훨씬 빨리 빠짐)\n보안검색(가방검사)후 입구의 검표 직원에게 휴대폰의 QR 코드를 보여주면 바로 입장 가능\n1층 이집트 미술(The Egyptian Art): 로비 오른쪽, 덴두르 신전Temple of Dendur은 꼭 봐야함, 나는 전설이다 배경\n1층 아메리카 윙(The American Wing)\n2층 유럽 회화 (European Paintings): 고흐, 모네, 르누아르, 베르메르 걸작\n4층 루프탑 가든(The Cantor Roof Garden): 전망대 겸 카페\n박물관계단(미드 가십걸)에서 사진 찍기', price: '$30', duration: '3h' },
        { time: '13:30', cat: 'food',   title: '점심',                  en: 'Lunch', loc: 'UES' },
        { time: '15:00', cat: 'sight',  title: 'The Met Cloisters',     en: 'Met Cloisters', loc: 'Fort Tryon Park',
          note: '메트 정문에서 나와 81가(81st St)를 따라 서쪽(센트럴 파크 방향)으로 쭉 가로지르기\n→자연사 박물관 옆에 있는 81 St-Museum of Natural History 역→지하철 탑승 (A선 Blue)\nA선(Uptown & 207 St 방향)ⁿ-A선(익스프레스)타기 →190 St 역(엘리베이터 타고 올라오기)\n지하철에서 내리면 개찰구 쪽 말고, Fort Tryon Park라고 써진 이정표를 따라가서 아주 큰 엘리베이터를 타기\n엘베로 지상 도착하면 바로 공원 입구와 연결→공원 길 걷기 Margaret Corbin Drive여기서부터 클로이스터스 성채까지 약 10~15분\n메트로폴리탄 미술관의 분관, 프랑스식수도원건물, 메트 당일 티켓있으면 무료관람\n폰트브로아 수도원 중정Cuxa Cloister - ★필수 코스:클로이스터스 상징\n폰트브로아 수도원 중정 (Cuxa Cloister) - ★필수 코스\n유니콘 태피스트리 방 (The Unicorn Tapestries) - ★최고의 걸작\n메로드 제단화 (Mérode Altarpiece) & 장식 예술\n허드슨 강 뷰 테라스 (Bonnefont Cloister & Trie Cloister)\n다시 호텔(킴튼 세타)로 돌아올 때는 A선 지하철을 타고 한 번에 42 St-Port Authority Bus Terminal역 하차' },
        { time: '18:30', cat: 'food',   title: '저녁',                  en: 'Dinner', loc: 'Midtown' },
      ],
    },
    {
      n: 5, date: 'May 8', weekday: 'Fri',
      title: '자연사 박물관, 센트럴파크',
      titleEn: 'AMNH & Central Park',
      hero: { hue: 120, label: 'CENTRAL PARK' },
      weather: '맑음 · 22°',
      items: [
        { time: '09:30', cat: 'sight',  title: '자연사 박물관',          en: 'American Museum of Natural History', loc: 'Upper West Side',
          note: '1층 밀스타인 해양 생물관:천장에 매달린 실물 크기의 대왕고래(Blue Whale)모형\n77가(77th St) 쪽 출구로 나오시는 것이 좋습니다.', price: '$25', duration: '2h' },
        { time: '12:30', cat: 'food',   title: '점심: 피크닉 준비',       en: 'Levain + Chipotle (to go)', loc: 'UWS',
          note: 'levain bakery르뱅쿠키\nchipotle치폴레: 보울 포장', price: '$' },
        { time: '13:30', cat: 'walk',   title: '센트럴 파크',            en: 'Central Park', loc: 'Manhattan',
          note: '십 미도우sheep meadow잔디밭: 피크닉\n더몰: 십 미도우 바로 옆, 느티나무 가로수길\n베데스타 테라스Bethesda Terrace&분수: 더 몰 끝부분, 계단 아래 분수 천장 타일 장식\n체리힐Cherry Hill\n보우브리지Bow Bridge: 하얀색 곡선 다리, 로맨틱한 포토존', duration: '3h' },
        { time: '18:00', cat: 'food',   title: 'The Halal Guys',        en: 'The Halal Guys', loc: '53rd & 6th Ave',
          note: '할랄 가이즈The Halal Guys, 화이트 소스는 듬뿍, 레드 소스는 조금', price: '$' },
      ],
    },
    {
      n: 6, date: 'May 9', weekday: 'Sat',
      title: '워싱턴 D.C. 이동',
      titleEn: 'Travel to D.C.',
      hero: { hue: 200, label: 'WASHINGTON D.C.' },
      weather: '맑음 · 20°',
      items: [
        { time: '09:00', cat: 'flight', title: 'D.C.로 이동',            en: 'Travel to Washington D.C.', loc: 'NYC → D.C.' },
        { time: '13:00', cat: 'hotel',  title: 'D.C. 호텔 체크인',       en: 'D.C. Hotel', loc: 'Washington D.C.',
          note: '짐 맡기기 또는 체크인', _hotelRef: 'D.C. Hotel' },
        { time: '14:30', cat: 'sight',  title: '국립 자연사 박물관',      en: 'National Museum of Natural History', loc: 'The Mall, D.C.',
          note: '무료 입장' },
        { time: '19:00', cat: 'food',   title: '저녁',                   en: 'Dinner', loc: 'D.C.' },
      ],
    },
    {
      n: 7, date: 'May 10', weekday: 'Sun',
      title: '워싱턴 기념물 투어',
      titleEn: 'D.C. Monuments',
      hero: { hue: 50, label: 'THE NATIONAL MALL' },
      weather: '맑음 · 24°',
      items: [
        { time: '09:00', cat: 'sight',  title: '워싱턴 기념탑',           en: 'Washington Monument', loc: 'The Mall',
          note: '공식 사이트 예약 (30일 전 오전 10시 ET, 수수료 $1)', price: '$1' },
        { time: '10:30', cat: 'sight',  title: '2차 세계대전 기념관',      en: 'WWII Memorial', loc: 'The Mall',
          note: '편한 신발 필수' },
        { time: '11:15', cat: 'sight',  title: '리플렉팅 풀 & 링컨 기념관', en: 'Reflecting Pool & Lincoln Memorial', loc: 'The Mall',
          note: '물병 챙기기' },
        { time: '12:30', cat: 'sight',  title: '한국전쟁 기념관',          en: 'Korean War Veterans Memorial', loc: 'The Mall',
          note: '선글라스' },
        { time: '13:30', cat: 'food',   title: '점심',                   en: 'Lunch', loc: 'D.C.',
          note: '모자 · 선크림' },
        { time: '15:00', cat: 'sight',  title: '국립 항공우주 박물관',     en: 'National Air and Space Museum', loc: 'The Mall' },
        { time: '17:30', cat: 'sight',  title: '국회 의사당',             en: 'U.S. Capitol Building', loc: 'D.C.' },
      ],
    },
    {
      n: 8, date: 'May 11', weekday: 'Mon',
      title: '뉴욕 복귀, 브라이언트 파크',
      titleEn: 'Back to NYC',
      hero: { hue: 100, label: 'BRYANT PARK' },
      weather: '부분 흐림 · 19°',
      items: [
        { time: '09:30', cat: 'walk',   title: 'D.C. 오전 일정',          en: 'Morning in D.C.', loc: 'D.C.' },
        { time: '13:00', cat: 'flight', title: '뉴욕으로 이동',            en: 'Travel back to NYC', loc: 'D.C. → NYC' },
        { time: '17:30', cat: 'walk',   title: '브라이언트 파크',          en: 'Bryant Park', loc: 'Midtown',
          note: '느긋한 오후' },
        { time: '19:00', cat: 'food',   title: '북창동 순두부',            en: 'Bookchang-dong Soondubu', loc: 'K-Town',
          note: '순두부찌개 + LA갈비', price: '$$' },
      ],
    },
    {
      n: 9, date: 'May 12', weekday: 'Tue',
      title: 'Vessel, 하이라인, 빌리지',
      titleEn: 'Hudson Yards & Village',
      hero: { hue: 280, label: 'THE VESSEL' },
      weather: '맑음 · 22°',
      items: [
        { time: '09:00', cat: 'view',   title: 'Vessel',                en: 'Vessel · Hudson Yards', loc: '34 St–Hudson Yards',
          note: '호텔에서 7번가/42가 방향으로 5분만 걸어가면 Times Sq-42 St 역\n7번 노선(보라색)을 타고 종점인 34 St-Hudson Yards 역에서 하차 (한 정거장, 3분 소요)\n황금빛 벌집 모양\n쇼핑몰The Shops at Hudson Yards 4층 창가에서 베슬을 위에서 내려다보는 구도 사진(화장실 이용 추천!)' },
        { time: '09:45', cat: 'walk',   title: 'The High Line',         en: 'The High Line', loc: 'Chelsea',
          note: '공중정원, 버려진 철길\n베슬 바로 옆에 하이라인 시작점 입구', duration: '1h' },
        { time: '11:00', cat: 'view',   title: 'Little Island',          en: 'Little Island', loc: 'Hudson River',
          note: '허드슨 강 위에 뜬 콘크리트 튤립섬\n인공섬, 섬꼭대기 전망대에서 엠파이어 스테이트 빌딩과 원 월드 트레이드 센터 뷰' },
        { time: '12:30', cat: 'food',   title: 'Chelsea Market 점심',    en: 'Chelsea Market', loc: '75 9th Ave',
          note: '로스 타코스Los Tacos No.1\n랍스터 플레이스 Lobster Place', price: '$$' },
        { time: '14:30', cat: 'walk',   title: '그리니치 빌리지',         en: 'Greenwich Village', loc: 'West Village',
          note: '뉴욕감성골목, 로맨틱한 분위기, 여유로운 산책\n미드의 배경지:프렌즈, 섹스앤더시티\n워싱턴 스퀘어 파크에서 매그놀리아 바나나 푸딩먹기' },
        { time: '16:00', cat: 'shop',   title: 'Harry Potter Store',     en: 'Harry Potter NY', loc: 'Flatiron',
          note: '화장실 있음' },
        { time: '16:45', cat: 'shop',   title: 'Fishs Eddy',             en: 'Fishs Eddy', loc: 'Flatiron',
          note: '귀여운 소품샵(자유여신상 컵)', price: '$$' },
        { time: '19:00', cat: 'food',   title: '저녁',                   en: 'Dinner', loc: 'Midtown' },
        { time: '20:00', cat: 'show',   title: '재즈 or 뮤지컬',          en: 'Jazz Show or Musical', loc: 'Broadway',
          note: '현장구매또는TKTS또는뮤지컬로타리에서 예매(알라딘 / 라이온킹 / 위키드 / 시카고)', price: '$$$' },
      ],
    },
    {
      n: 10, date: 'May 13', weekday: 'Wed',
      title: '마지막 날, 쇼핑',
      titleEn: 'Souvenirs & Farewell',
      hero: { hue: 0, label: 'TIMES SQUARE' },
      weather: '맑음 · 20°',
      items: [
        { time: '09:30', cat: 'shop',   title: '타임스퀘어 기념품',       en: 'Times Square Souvenirs', loc: 'Midtown',
          note: "Disney Store, M&M, Hershey's Chocolate World에서 기념품사기" },
        { time: '11:30', cat: 'walk',   title: '센트럴파크 벨베데어',      en: 'Central Park — Belvedere Castle', loc: 'Central Park',
          note: '벨베데레성Belvedere Castle' },
        { time: '13:00', cat: 'food',   title: '점심',                   en: 'Lunch', loc: 'Midtown' },
        { time: '14:30', cat: 'walk',   title: '브라이언트 파크',         en: 'Bryant Park', loc: 'Midtown' },
        { time: '15:30', cat: 'shop',   title: 'Whole Foods',            en: 'Whole Foods Market', loc: 'Midtown' },
        { time: '16:15', cat: 'shop',   title: 'CVS',                    en: 'CVS Pharmacy', loc: 'Midtown',
          note: '리스테린 쿨민트필름3개세트$6.99, NATROL멜라토닌젤리5mg60개$11', price: '$' },
        { time: '16:45', cat: 'shop',   title: 'Target',                 en: 'Target', loc: 'Midtown',
          note: '너즈젤리, 소화제TUMS$7', price: '$' },
        { time: '17:30', cat: 'shop',   title: "Trader Joe's",           en: "Trader Joe's", loc: 'Midtown',
          note: '프레첼$4.20, 핸드크림, 손소독제, 레몬커드$3.99, 버터아몬드씬$3.3, 메이플피칸그래놀라시리얼, 엑스트라버진올리브오일스프레이', price: '$' },
        { time: '19:30', cat: 'food',   title: '마지막 저녁',             en: 'Farewell Dinner', loc: 'Midtown' },
      ],
    },
  ],

  // Preparation (from sheet 1)
  prep: {
    checklist: [
      '항공권 예매', '숙소 예매', 'ESTA 신청', '짐 싸기',
      '로밍/유심 준비', 'Uber 앱 설치', '여행자 보험', '빅버스 예매',
      '공항 셔틀 예매',
    ],
    docs: [
      'ESTA 승인', '왕복 항공권', '호텔 바우처', '재직증명서(영문)',
    ],
    pack: [
      '피크닉 매트', '물티슈', '휴대용 비데', '위생 장갑',
    ],
  },

  // Food guide (from sheet 3)
  food: [
    { cat: '🍕 Pizza',    name: "Joe's Pizza",             detail: '클래식 NY 슬라이스',                                    price: '$',       note: '맨해튼 여러 지점' },
    { cat: '🍕 Pizza',    name: "Juliana's Pizza",          detail: 'Half-and-half: Margherita + White',                      price: '$$',      note: '덤보, 브루클린' },
    { cat: '🥯 Bagel',    name: 'Essa Bagel',               detail: 'Everything bagel + cream cheese + smoked salmon',        price: '$18–25',  note: '' },
    { cat: '🥯 Bagel',    name: 'Apollo Bagels',            detail: '갓 구운 베이글',                                         price: '$',       note: '' },
    { cat: '🥯 Bagel',    name: 'Pop Up Bagel',             detail: '베이글 3개 $13 (크림치즈 1개 포함)',                     price: '$13',     note: '' },
    { cat: '🌮 Tacos',    name: 'Los Tacos No.1',           detail: 'NYC 최고 타코 · al pastor 또는 carne asada',             price: '$$',      note: '첼시 마켓 외' },
    { cat: '🍔 Burger',   name: 'Chick-fil-A',              detail: 'Deluxe Meal · "Can I get all the sauces, please?"',      price: '$12–15',  note: '일요일 휴무' },
    { cat: '🍔 Burger',   name: "Tony Dragon's Grille",     detail: 'Tony Burger $13 / Beef & Portobello $14 · 위생장갑 요청', price: '$13–14',  note: '10AM–6PM (푸드트럭)' },
    { cat: '🥩 Steak',    name: "Gallagher's Steakhouse",   detail: '3코스 런치: 애피 + Sliced Filet Mignon + NY 치즈케익',   price: '$$$$',    note: '구글 예약 필요' },
    { cat: '🌯 Fast',     name: 'Chipotle',                 detail: '보울: 라이스 + 빈 + 단백질 + 토핑 올 + 과카 (+$3)',       price: '$21.50',  note: '라이스에 고수 있음' },
    { cat: '🌯 Fast',     name: 'The Halal Guys',           detail: '라이스 플레이트 or 랩 · 화이트 많이, 레드 조금',          price: '$',       note: '53rd & 6th Ave' },
    { cat: '🦞 Seafood',  name: 'Lobster Place',            detail: '신선한 랍스터 롤',                                       price: '$$',      note: '첼시 마켓 내부' },
    { cat: '🍲 Korean',   name: '북창동 순두부',             detail: '순두부찌개 + LA갈비',                                    price: '$$',      note: 'K-타운' },
    { cat: '🍪 Dessert',  name: 'Levain Bakery',            detail: '초코칩 월넛 쿠키 (수상작) · 레몬도 추천',                 price: '$',       note: '뜨끈하고 큼직' },
    { cat: '🍪 Dessert',  name: 'Magnolia Bakery',          detail: '바나나 푸딩 → 워싱턴 스퀘어 파크',                        price: '$',       note: '' },
    { cat: '🍪 Dessert',  name: "Junior's Cheesecake",      detail: '오리지널 NY 치즈케익',                                   price: '$',       note: '타임스퀘어/그랜드센트럴' },
    { cat: '☕ Dessert',  name: "Ralph's Coffee",           detail: '말차 라떼',                                              price: '$',       note: '랄프로렌 플래그십 내부' },
  ],
};

"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// NYC Travel App — restructured
// - Trips list (top level) -> pick a trip -> Home
// - Per-page edit (no global toggle)
// - Hotel detail page + multi-hotel schedule
// - Fully editable prep page

var COLORS = {
  bg: '#F5F2EC',
  card: '#FFFFFF',
  ink: '#1A1816',
  mute: '#7A756D',
  line: 'rgba(26,24,22,0.08)',
  accent: '#C14F2E',
  soft: '#E9E3D7',
  softer: '#EFEAE0'
};
var SERIF = '"Instrument Serif", Georgia, serif';
var SANS = '-apple-system, "SF Pro Text", system-ui, sans-serif';
var MONO = '"JetBrains Mono", ui-monospace, monospace';
var CAT_META = {
  flight: {
    icon: 'flight',
    label: 'Flight'
  },
  hotel: {
    icon: 'hotel',
    label: 'Stay'
  },
  walk: {
    icon: 'walk',
    label: 'Walk'
  },
  food: {
    icon: 'food',
    label: 'Eat'
  },
  view: {
    icon: 'view',
    label: 'View'
  },
  ferry: {
    icon: 'ferry',
    label: 'Ferry'
  },
  sight: {
    icon: 'sight',
    label: 'Sight'
  },
  shop: {
    icon: 'shop',
    label: 'Shop'
  },
  show: {
    icon: 'show',
    label: 'Show'
  },
  bar: {
    icon: 'bar',
    label: 'Bar'
  }
};

// ─── Persistence: session nav only (data in Firestore) ───────

// ─── Icons ──────────────────────────────────────────────────
var Icon = function Icon(_ref) {
  var name = _ref.name,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? 16 : _ref$size,
    _ref$color = _ref.color,
    color = _ref$color === void 0 ? 'currentColor' : _ref$color,
    _ref$stroke = _ref.stroke,
    stroke = _ref$stroke === void 0 ? 1.6 : _ref$stroke;
  var p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  switch (name) {
    case 'flight':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l4 5-3 3h2l3 2 5 4 .5-.8Z"
      }));
    case 'hotel':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M3 21V8l9-5 9 5v13"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 21v-6h6v6"
      }));
    case 'walk':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "13",
        cy: "4",
        r: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m15 21-3-5-3 2-2-4 5-4 4 4 3 1"
      }));
    case 'food':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M4 2v10a4 4 0 0 0 8 0V2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 2v20"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M17 2c-1.5 0-3 1-3 4v8h3v8"
      }));
    case 'view':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M2 22V9l10-7 10 7v13"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 22v-8h6v8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 2v5"
      }));
    case 'ferry':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M2 20a3 3 0 0 0 3-1 3 3 0 0 1 5 0 3 3 0 0 0 5 0 3 3 0 0 1 5 0 3 3 0 0 0 2 1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 18 3 9h18l-1 9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 3v6"
      }));
    case 'sight':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M4 21V8l8-5 8 5v13"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 3v18"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 13h16"
      }));
    case 'shop':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 6h18"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 10a4 4 0 0 1-8 0"
      }));
    case 'show':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("rect", {
        x: "2",
        y: "6",
        width: "20",
        height: "14",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m16 2-4 4-4-4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 12v4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 14h4"
      }));
    case 'bar':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M8 22h8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 16v6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 3h16l-8 11z"
      }));
    case 'map':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 3v15"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M15 6v15"
      }));
    case 'clock':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 7v5l3 2"
      }));
    case 'chevron':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "m9 6 6 6-6 6"
      }));
    case 'chevron-l':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "m15 6-6 6 6 6"
      }));
    case 'chevron-d':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "m6 9 6 6 6-6"
      }));
    case 'search':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "11",
        r: "7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m20 20-3-3"
      }));
    case 'heart':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"
      }));
    case 'user':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "8",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 21a8 8 0 0 1 16 0"
      }));
    case 'more':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "5",
        cy: "12",
        r: "1.2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "1.2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "19",
        cy: "12",
        r: "1.2"
      }));
    case 'pin':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M12 22s8-8 8-13a8 8 0 1 0-16 0c0 5 8 13 8 13z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "9",
        r: "3"
      }));
    case 'check':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "m5 12 5 5L20 7"
      }));
    case 'sun':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
      }));
    case 'cloud':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M18 18a4 4 0 0 0 0-8 6 6 0 0 0-11.5-1.5A4 4 0 0 0 6 18z"
      }));
    case 'book':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
      }));
    case 'edit':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"
      }));
    case 'trash':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M3 6h18"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
      }));
    case 'plus':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M12 5v14M5 12h14"
      }));
    case 'x':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M18 6 6 18M6 6l12 12"
      }));
    case 'share':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "5",
        r: "3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "12",
        r: "3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "19",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"
      }));
    case 'users':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "7",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M23 21v-2a4 4 0 0 0-3-3.87"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 3.13a4 4 0 0 1 0 7.75"
      }));
    case 'save':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M17 21v-8H7v8M7 3v5h8"
      }));
    case 'refresh':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M3 12a9 9 0 0 1 15-6.7L21 8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21 3v5h-5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21 12a9 9 0 0 1-15 6.7L3 16"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 21v-5h5"
      }));
    case 'globe':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 12h18"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
      }));
    case 'nav':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "m3 11 19-8-8 19-2-8z"
      }));
    case 'phone':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.9 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"
      }));
    default:
      return null;
  }
};

// ─── Photo placeholder ──────────────────────────────────────
function Photo(_ref2) {
  var _ref2$hue = _ref2.hue,
    hue = _ref2$hue === void 0 ? 20 : _ref2$hue,
    _ref2$label = _ref2.label,
    label = _ref2$label === void 0 ? '' : _ref2$label,
    _ref2$height = _ref2.height,
    height = _ref2$height === void 0 ? 180 : _ref2$height,
    _ref2$small = _ref2.small,
    small = _ref2$small === void 0 ? false : _ref2$small;
  var bg = "oklch(0.88 0.035 ".concat(hue, ")"),
    bg2 = "oklch(0.80 0.045 ".concat(hue, ")");
  var ink = "oklch(0.36 0.04 ".concat(hue, ")");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: height,
      background: "repeating-linear-gradient(135deg, ".concat(bg, " 0 14px, ").concat(bg2, " 14px 15px), linear-gradient(180deg, ").concat(bg, " 0%, ").concat(bg2, " 100%)"),
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end',
      padding: small ? 8 : 14,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: "radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.35), transparent 60%)"
    }
  }), label && !small && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      letterSpacing: '0.14em',
      color: ink,
      opacity: 0.72,
      textTransform: 'uppercase',
      position: 'relative'
    }
  }, label));
}

// ─── Google Maps URLs ───────────────────────────────────────
function mapsSearchUrl(query) {
  return "https://www.google.com/maps/search/?api=1&query=".concat(encodeURIComponent(query));
}
function mapsDirectionsUrl(destination) {
  return "https://www.google.com/maps/dir/?api=1&destination=".concat(encodeURIComponent(destination), "&travelmode=transit");
}

// ─── Edit button (small pencil) ─────────────────────────────
function EditBtn(_ref3) {
  var editing = _ref3.editing,
    onClick = _ref3.onClick,
    compact = _ref3.compact;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      border: 'none',
      cursor: 'pointer',
      background: editing ? COLORS.accent : 'rgba(26,24,22,0.06)',
      color: editing ? '#fff' : COLORS.ink,
      borderRadius: 14,
      padding: compact ? '5px 9px' : '6px 12px',
      display: 'flex',
      gap: 5,
      alignItems: 'center',
      fontFamily: SANS,
      fontSize: 11.5,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: editing ? 'check' : 'edit',
    size: 12,
    color: editing ? '#fff' : COLORS.ink,
    stroke: 2
  }), editing ? '완료' : '편집');
}

// ─── Swipeable row (swipe-left to reveal edit/delete) ────────
function SwipeableRow(_ref4) {
  var children = _ref4.children,
    onEdit = _ref4.onEdit,
    onDelete = _ref4.onDelete,
    disabled = _ref4.disabled,
    isDragging = _ref4.isDragging,
    _ref4$wrapStyle = _ref4.wrapStyle,
    wrapStyle = _ref4$wrapStyle === void 0 ? {} : _ref4$wrapStyle;
  var _React$useState = React.useState(0),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    x = _React$useState2[0],
    setX = _React$useState2[1];
  var _React$useState3 = React.useState(false),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    open = _React$useState4[0],
    setOpen = _React$useState4[1];
  var startRef = React.useRef(null);
  var dragging = React.useRef(false);
  var xRef = React.useRef(0);
  var REVEAL = 116;
  var DELETE_EXTRA = 72;
  var close = function close() {
    setX(0);
    xRef.current = 0;
    setOpen(false);
  };
  React.useEffect(function () {
    if (disabled) close();
  }, [disabled]);
  // 드래그 중에는 스와이프 버튼 즉시 닫기
  React.useEffect(function () {
    if (isDragging) close();
  }, [isDragging]);
  var onTouchStart = function onTouchStart(e) {
    if (disabled) return;
    startRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    dragging.current = false;
  };
  var onTouchMove = function onTouchMove(e) {
    if (!startRef.current) return;
    var dx = e.touches[0].clientX - startRef.current.x;
    var dy = Math.abs(e.touches[0].clientY - startRef.current.y);
    if (!dragging.current) {
      if (Math.abs(dx) < 18) return;
      if (dy > Math.abs(dx) * 0.55) {
        startRef.current = null;
        return;
      }
      dragging.current = true;
    }
    var base = open ? -REVEAL : 0;
    var raw = base + dx;
    var clamped = open ? Math.max(-(REVEAL + DELETE_EXTRA + 16), Math.min(0, raw)) : Math.max(-REVEAL, Math.min(0, raw));
    xRef.current = clamped;
    setX(clamped);
  };
  var onTouchEnd = function onTouchEnd() {
    if (!startRef.current || !dragging.current) {
      startRef.current = null;
      return;
    }
    startRef.current = null;
    dragging.current = false;
    var cur = xRef.current;
    if (cur < -(REVEAL + DELETE_EXTRA / 2)) {
      close();
      setTimeout(function () {
        return onDelete();
      }, 260);
    } else if (cur < -REVEAL / 2) {
      xRef.current = -REVEAL;
      setX(-REVEAL);
      setOpen(true);
    } else {
      close();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: _objectSpread({
      position: 'relative',
      overflow: 'hidden'
    }, wrapStyle),
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    onTouchEnd: onTouchEnd
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: REVEAL,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      e.stopPropagation();
      close();
      setTimeout(onEdit, 100);
    },
    style: {
      width: 46,
      height: 46,
      borderRadius: 23,
      border: 'none',
      cursor: 'pointer',
      background: '#ffa500',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 17,
    color: "#fff",
    stroke: 2
  })), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      e.stopPropagation();
      close();
      setTimeout(onDelete, 100);
    },
    style: {
      width: 46,
      height: 46,
      borderRadius: 23,
      border: 'none',
      cursor: 'pointer',
      background: '#B5451B',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 17,
    color: "#fff",
    stroke: 2
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      transform: "translateX(".concat(x, "px)"),
      transition: dragging.current ? 'none' : 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
      willChange: 'transform',
      position: 'relative',
      zIndex: 1
    }
  }, children));
}

// ─── Swipe-back edge gesture wrapper ─────────────────────────
function SwipeBackLayer(_ref5) {
  var onBack = _ref5.onBack,
    children = _ref5.children;
  var _React$useState5 = React.useState(0),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    dx = _React$useState6[0],
    setDx = _React$useState6[1];
  var _React$useState7 = React.useState(false),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    slidingOut = _React$useState8[0],
    setSlidingOut = _React$useState8[1];
  var startRef = React.useRef(null);
  var draggingRef = React.useRef(false);
  var dxRef = React.useRef(0);
  var containerRef = React.useRef(null);
  var canBackRef = React.useRef(!!onBack);
  var slidingRef = React.useRef(false);
  var onBackRef = React.useRef(onBack);
  React.useEffect(function () {
    canBackRef.current = !!onBack;
    onBackRef.current = onBack;
  }, [onBack]);
  React.useEffect(function () {
    slidingRef.current = slidingOut;
  }, [slidingOut]);
  React.useEffect(function () {
    var el = containerRef.current;
    if (!el) return;
    var onTouchStart = function onTouchStart(e) {
      if (!canBackRef.current || slidingRef.current) return;
      var t = e.touches[0];
      if (t.clientX > 28) return;
      startRef.current = {
        x: t.clientX,
        y: t.clientY,
        t: Date.now()
      };
      draggingRef.current = false;
    };
    var onTouchMove = function onTouchMove(e) {
      if (!startRef.current) return;
      var t = e.touches[0];
      var dX = t.clientX - startRef.current.x;
      var dY = Math.abs(t.clientY - startRef.current.y);
      if (!draggingRef.current) {
        if (dY > Math.abs(dX) + 8) {
          startRef.current = null;
          return;
        }
        if (dX > 6) draggingRef.current = true;else return;
      }
      e.preventDefault();
      var v = Math.max(0, dX);
      dxRef.current = v;
      setDx(v);
    };
    var onTouchEnd = function onTouchEnd() {
      if (!startRef.current) return;
      var elapsed = Date.now() - startRef.current.t;
      var v = dxRef.current;
      startRef.current = null;
      draggingRef.current = false;
      if (v > 90 || v > 40 && elapsed < 280) {
        slidingRef.current = true;
        setSlidingOut(true);
        setDx(window.innerWidth || 400);
        setTimeout(function () {
          if (onBackRef.current) onBackRef.current();
          setDx(0);
          setSlidingOut(false);
          slidingRef.current = false;
          dxRef.current = 0;
        }, 220);
      } else {
        setDx(0);
        dxRef.current = 0;
      }
    };
    el.addEventListener('touchstart', onTouchStart, {
      passive: true
    });
    el.addEventListener('touchmove', onTouchMove, {
      passive: false
    });
    el.addEventListener('touchend', onTouchEnd, {
      passive: true
    });
    return function () {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    style: {
      position: 'relative',
      overflowX: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: "translateX(".concat(dx, "px)"),
      transition: dx === 0 || slidingOut ? 'transform 220ms cubic-bezier(0.22,1,0.36,1)' : 'none',
      willChange: 'transform'
    }
  }, children), dx > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      background: "linear-gradient(90deg, rgba(0,0,0,".concat(Math.min(0.15, dx / 1000), "), transparent 35%)")
    }
  }));
}

// ─── Popup sheet (centered modal with swipe-down dismiss) ────
function BottomSheet(_ref6) {
  var open = _ref6.open,
    onClose = _ref6.onClose,
    children = _ref6.children,
    title = _ref6.title,
    onConfirm = _ref6.onConfirm,
    _ref6$confirmLabel = _ref6.confirmLabel,
    confirmLabel = _ref6$confirmLabel === void 0 ? '완료' : _ref6$confirmLabel;
  var _React$useState9 = React.useState(open),
    _React$useState0 = _slicedToArray(_React$useState9, 2),
    mounted = _React$useState0[0],
    setMounted = _React$useState0[1];
  var _React$useState1 = React.useState(false),
    _React$useState10 = _slicedToArray(_React$useState1, 2),
    visible = _React$useState10[0],
    setVisible = _React$useState10[1];
  var _React$useState11 = React.useState(0),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    drag = _React$useState12[0],
    setDrag = _React$useState12[1];
  var startY = React.useRef(null);
  React.useEffect(function () {
    if (open) {
      setMounted(true);
      setDrag(0);
      // 배경 스크롤 잠금
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () {
        return setVisible(true);
      });
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      var t = setTimeout(function () {
        setMounted(false);
        setDrag(0);
      }, 260);
      return function () {
        return clearTimeout(t);
      };
    }
    return function () {
      document.body.style.overflow = '';
    };
  }, [open]);
  if (!mounted) return null;

  // Touch handlers on the whole popup; drag only engages on gesture.
  var onTouchStart = function onTouchStart(e) {
    startY.current = e.touches[0].clientY;
  };
  var onTouchMove = function onTouchMove(e) {
    if (startY.current == null) return;
    var dy = e.touches[0].clientY - startY.current;
    if (dy > 0) setDrag(dy);
  };
  var onTouchEnd = function onTouchEnd() {
    if (drag > 80) onClose();else setDrag(0);
    startY.current = null;
  };
  // Also handle mouse drag on the handle area for desktop testing
  var onMouseDown = function onMouseDown(e) {
    startY.current = e.clientY;
    var move = function move(ev) {
      var dy = ev.clientY - startY.current;
      if (dy > 0) setDrag(dy);
    };
    var _up = function up() {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', _up);
      if (drag > 80) onClose();else setDrag(0);
      startY.current = null;
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', _up);
  };

  // portal로 document.body에 직접 렌더링 → transform 부모의 영향 없이 정확히 viewport 중앙에 표시
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 18px',
      background: visible && drag < 80 ? 'rgba(20,16,14,0.42)' : 'rgba(20,16,14,0)',
      transition: 'background 240ms ease'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    onTouchEnd: onTouchEnd,
    style: {
      background: COLORS.bg,
      width: '100%',
      maxWidth: 360,
      borderRadius: 22,
      boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 14px rgba(0,0,0,0.08)',
      transform: visible ? "translateY(".concat(drag, "px) scale(").concat(Math.max(0.94, 1 - drag / 600), ")") : 'translateY(40px) scale(0.94)',
      opacity: visible ? Math.max(0, 1 - drag / 240) : 0,
      transition: drag === 0 ? 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease' : 'none',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onMouseDown: onMouseDown,
    style: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: 10,
      cursor: 'grab'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      background: COLORS.line,
      borderRadius: 2
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 18px 4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute,
      padding: '4px 2px'
    }
  }, "\uCDE8\uC18C"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 15,
      color: COLORS.ink
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 13,
      fontWeight: 600,
      color: COLORS.accent,
      padding: '4px 2px'
    }
  }, confirmLabel)), children)), document.body);
}

// ─── Custom date picker (year/month scroll + calendar) ────────
function DatePickerSheet(_ref7) {
  var open = _ref7.open,
    value = _ref7.value,
    onClose = _ref7.onClose,
    onPick = _ref7.onPick,
    minDate = _ref7.minDate,
    _ref7$title = _ref7.title,
    title = _ref7$title === void 0 ? '날짜 선택' : _ref7$title;
  var parseIso = function parseIso(s) {
    var m = (s || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return null;
    return {
      y: +m[1],
      mo: +m[2] - 1,
      d: +m[3]
    };
  };
  var todayObj = new Date();
  var initial = parseIso(value) || parseIso(minDate) || {
    y: todayObj.getFullYear(),
    mo: todayObj.getMonth(),
    d: todayObj.getDate()
  };
  var _React$useState13 = React.useState({
      y: initial.y,
      mo: initial.mo
    }),
    _React$useState14 = _slicedToArray(_React$useState13, 2),
    view = _React$useState14[0],
    setView = _React$useState14[1];
  var _React$useState15 = React.useState(parseIso(value)),
    _React$useState16 = _slicedToArray(_React$useState15, 2),
    selected = _React$useState16[0],
    setSelected = _React$useState16[1];
  var _React$useState17 = React.useState(false),
    _React$useState18 = _slicedToArray(_React$useState17, 2),
    pickingYM = _React$useState18[0],
    setPickingYM = _React$useState18[1]; // 년/월 선택 모드

  React.useEffect(function () {
    if (open) {
      var s = parseIso(value) || initial;
      setView({
        y: s.y,
        mo: s.mo
      });
      setSelected(parseIso(value));
      setPickingYM(false);
    }
  }, [open, value]);
  var MONTH_KR = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  var DOW = ['일', '월', '화', '수', '목', '금', '토'];
  var min = parseIso(minDate);
  var isBefore = function isBefore(y1, mo1, d1, mn) {
    if (!mn) return false;
    if (y1 !== mn.y) return y1 < mn.y;
    if (mo1 !== mn.mo) return mo1 < mn.mo;
    return d1 < mn.d;
  };
  var confirm = function confirm() {
    if (!selected) {
      onClose();
      return;
    }
    var iso = "".concat(selected.y, "-").concat(String(selected.mo + 1).padStart(2, '0'), "-").concat(String(selected.d).padStart(2, '0'));
    onPick(iso);
    onClose();
  };

  // ── 년/월 스크롤 선택기 ────────────────────────────────────
  var YEARS = Array.from({
    length: 10
  }, function (_, i) {
    return todayObj.getFullYear() - 2 + i;
  });
  var MONTHS = Array.from({
    length: 12
  }, function (_, i) {
    return i;
  });
  var _React$useState19 = React.useState(view.y),
    _React$useState20 = _slicedToArray(_React$useState19, 2),
    tmpY = _React$useState20[0],
    setTmpY = _React$useState20[1];
  var _React$useState21 = React.useState(view.mo),
    _React$useState22 = _slicedToArray(_React$useState21, 2),
    tmpMo = _React$useState22[0],
    setTmpMo = _React$useState22[1];
  var ScrollPicker = function ScrollPicker(_ref8) {
    var items = _ref8.items,
      value = _ref8.value,
      onChange = _ref8.onChange,
      renderLabel = _ref8.renderLabel,
      _ref8$width = _ref8.width,
      width = _ref8$width === void 0 ? 90 : _ref8$width;
    var IH = 44;
    var VISIBLE = 5;
    var ref = React.useRef(null);
    var timer = React.useRef(null);
    React.useEffect(function () {
      var el = ref.current;
      if (!el) return;
      var idx = items.indexOf(value);
      if (idx >= 0) el.scrollTop = idx * IH;
    }, [value]);
    var onScroll = function onScroll() {
      clearTimeout(timer.current);
      timer.current = setTimeout(function () {
        var el = ref.current;
        if (!el) return;
        var idx = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / IH)));
        el.scrollTo({
          top: idx * IH,
          behavior: 'smooth'
        });
        if (items[idx] !== value) onChange(items[idx]);
      }, 100);
    };
    var PAD = IH * Math.floor(VISIBLE / 2);
    var stopProp = function stopProp(e) {
      return e.stopPropagation();
    }; // 스크롤 시 배경 dismiss 방지
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: width,
        height: IH * VISIBLE,
        overflow: 'hidden'
      },
      onClick: stopProp,
      onTouchStart: stopProp,
      onTouchMove: stopProp,
      onTouchEnd: stopProp
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        pointerEvents: 'none',
        zIndex: 2,
        top: IH * Math.floor(VISIBLE / 2),
        height: IH,
        borderTop: "1.5px solid ".concat(COLORS.line),
        borderBottom: "1.5px solid ".concat(COLORS.line)
      }
    }), /*#__PURE__*/React.createElement("div", {
      ref: ref,
      onScroll: onScroll,
      style: {
        height: '100%',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        paddingTop: PAD,
        paddingBottom: PAD,
        boxSizing: 'content-box'
      },
      className: "wheel-col"
    }, items.map(function (it, i) {
      var sel = it === value;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        onClick: function onClick() {
          onChange(it);
          var el = ref.current;
          if (el) el.scrollTo({
            top: i * IH,
            behavior: 'smooth'
          });
        },
        style: {
          height: IH,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          scrollSnapAlign: 'center',
          fontFamily: SANS,
          fontSize: sel ? 16 : 14,
          color: sel ? COLORS.ink : COLORS.mute,
          fontWeight: sel ? 600 : 400,
          cursor: 'pointer',
          userSelect: 'none'
        }
      }, renderLabel(it));
    })));
  };

  // ── 달력 그리드 ───────────────────────────────────────────
  var Calendar = function Calendar() {
    var firstDow = new Date(view.y, view.mo, 1).getDay();
    var daysInMo = new Date(view.y, view.mo + 1, 0).getDate();
    var cells = [];
    for (var i = 0; i < firstDow; i++) cells.push(null);
    for (var d = 1; d <= daysInMo; d++) cells.push(d);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 14px 2px',
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)'
      }
    }, DOW.map(function (w, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          textAlign: 'center',
          fontFamily: MONO,
          fontSize: 9.5,
          letterSpacing: '0.08em',
          color: i === 0 ? COLORS.accent : i === 6 ? 'oklch(60% 0.06 250)' : COLORS.mute,
          padding: '4px 0'
        }
      }, w);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 14px 14px',
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)'
      }
    }, cells.map(function (d, i) {
      if (d === null) return /*#__PURE__*/React.createElement("div", {
        key: i
      });
      var dow = (firstDow + d - 1) % 7;
      var isSel = selected && selected.y === view.y && selected.mo === view.mo && selected.d === d;
      var isToday = todayObj.getFullYear() === view.y && todayObj.getMonth() === view.mo && todayObj.getDate() === d;
      var disabled = isBefore(view.y, view.mo, d, min);
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        disabled: disabled,
        onClick: function onClick() {
          return setSelected({
            y: view.y,
            mo: view.mo,
            d: d
          });
        },
        style: {
          aspectRatio: '1/1',
          border: 'none',
          cursor: disabled ? 'default' : 'pointer',
          borderRadius: '50%',
          margin: 1,
          background: isSel ? COLORS.ink : 'transparent',
          color: disabled ? 'oklch(82% 0.01 50)' : isSel ? '#fff' : dow === 0 ? COLORS.accent : COLORS.ink,
          fontFamily: SANS,
          fontSize: 13,
          fontWeight: isSel ? 600 : 400,
          position: 'relative',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 140ms'
        }
      }, d, isToday && !isSel && /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          bottom: 4,
          width: 3,
          height: 3,
          borderRadius: '50%',
          background: COLORS.accent
        }
      }));
    })));
  };
  return /*#__PURE__*/React.createElement(BottomSheet, {
    open: open,
    onClose: onClose,
    title: title,
    onConfirm: confirm
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 16px 6px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      if (!pickingYM) {
        setTmpY(view.y);
        setTmpMo(view.mo);
      }
      setPickingYM(function (p) {
        return !p;
      });
    },
    style: {
      border: 'none',
      background: COLORS.softer,
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: SERIF,
      fontSize: 17,
      color: COLORS.ink,
      padding: '5px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, view.y, "\uB144 ", MONTH_KR[view.mo], /*#__PURE__*/React.createElement(Icon, {
    name: pickingYM ? 'chevron-d' : 'chevron-d',
    size: 12,
    color: COLORS.mute,
    stroke: 2.5
  })), !pickingYM && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      var y = view.y,
        mo = view.mo;
      mo--;
      if (mo < 0) {
        mo = 11;
        y--;
      }
      setView({
        y: y,
        mo: mo
      });
    },
    style: {
      width: 30,
      height: 30,
      borderRadius: 15,
      border: 'none',
      cursor: 'pointer',
      background: COLORS.card,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-l",
    size: 14,
    color: COLORS.ink,
    stroke: 2
  })), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      var y = view.y,
        mo = view.mo;
      mo++;
      if (mo > 11) {
        mo = 0;
        y++;
      }
      setView({
        y: y,
        mo: mo
      });
    },
    style: {
      width: 30,
      height: 30,
      borderRadius: 15,
      border: 'none',
      cursor: 'pointer',
      background: COLORS.card,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron",
    size: 14,
    color: COLORS.ink,
    stroke: 2
  })))), pickingYM ?
  /*#__PURE__*/
  /* 년/월 스크롤 선택 */
  React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 12,
      padding: '4px 16px 8px'
    }
  }, /*#__PURE__*/React.createElement(ScrollPicker, {
    items: YEARS,
    value: tmpY,
    onChange: setTmpY,
    renderLabel: function renderLabel(y) {
      return "".concat(y, "\uB144");
    },
    width: 110
  }), /*#__PURE__*/React.createElement(ScrollPicker, {
    items: MONTHS,
    value: tmpMo,
    onChange: setTmpMo,
    renderLabel: function renderLabel(m) {
      return MONTH_KR[m];
    },
    width: 90
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 14px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setView({
        y: tmpY,
        mo: tmpMo
      });
      setPickingYM(false);
    },
    style: {
      width: '100%',
      padding: '13px',
      border: 'none',
      borderRadius: 14,
      background: COLORS.ink,
      color: '#fff',
      fontFamily: SANS,
      fontSize: 14,
      fontWeight: 500,
      cursor: 'pointer'
    }
  }, "\uC774 \uB2EC \uB2EC\uB825 \uBCF4\uAE30"))) : /*#__PURE__*/React.createElement(Calendar, null));
}

// ─── Wheel column (scroll-snap) ──────────────────────────────
function WheelColumn(_ref9) {
  var items = _ref9.items,
    value = _ref9.value,
    onChange = _ref9.onChange,
    _ref9$width = _ref9.width,
    width = _ref9$width === void 0 ? 70 : _ref9$width;
  var ITEM_H = 40;
  var VISIBLE = 5; // odd so there's a center
  var CENTER_OFFSET = Math.floor(VISIBLE / 2);
  var ref = React.useRef(null);
  var timer = React.useRef(null);

  // Sync external value → scroll position
  React.useEffect(function () {
    var el = ref.current;
    if (!el) return;
    var idx = items.indexOf(value);
    if (idx >= 0) el.scrollTop = idx * ITEM_H;
  }, [value, items]);
  var handleScroll = function handleScroll() {
    clearTimeout(timer.current);
    timer.current = setTimeout(function () {
      var el = ref.current;
      if (!el) return;
      var idx = Math.round(el.scrollTop / ITEM_H);
      var clamped = Math.max(0, Math.min(items.length - 1, idx));
      // Snap
      el.scrollTo({
        top: clamped * ITEM_H,
        behavior: 'smooth'
      });
      if (items[clamped] !== value) onChange(items[clamped]);
    }, 120);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: width,
      height: ITEM_H * VISIBLE
    }
  }, /*#__PURE__*/React.createElement("style", null, ".wheel-col::-webkit-scrollbar{display:none;}"), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onScroll: handleScroll,
    className: "wheel-col",
    style: {
      width: '100%',
      height: '100%',
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      padding: "".concat(ITEM_H * CENTER_OFFSET, "px 0"),
      boxSizing: 'content-box'
    }
  }, items.map(function (it, i) {
    var isSel = it === value;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        height: ITEM_H,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scrollSnapAlign: 'center',
        fontFamily: SERIF,
        fontSize: isSel ? 26 : 20,
        color: isSel ? COLORS.ink : COLORS.mute,
        opacity: isSel ? 1 : 0.45,
        transition: 'all 180ms',
        fontFeatureSettings: '"tnum"'
      }
    }, it);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: ITEM_H * CENTER_OFFSET,
      height: ITEM_H,
      borderTop: "1px solid ".concat(COLORS.line),
      borderBottom: "1px solid ".concat(COLORS.line),
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: ITEM_H * CENTER_OFFSET,
      background: "linear-gradient(180deg, ".concat(COLORS.bg, " 0%, ").concat(COLORS.bg, "00 100%)"),
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: ITEM_H * CENTER_OFFSET,
      background: "linear-gradient(0deg, ".concat(COLORS.bg, " 0%, ").concat(COLORS.bg, "00 100%)"),
      pointerEvents: 'none'
    }
  }));
}

// ─── Time wheel picker ───────────────────────────────────────
function TimeWheelSheet(_ref0) {
  var open = _ref0.open,
    value = _ref0.value,
    onClose = _ref0.onClose,
    onPick = _ref0.onPick,
    _ref0$title = _ref0.title,
    title = _ref0$title === void 0 ? '시간 선택' : _ref0$title;
  var parse = function parse(v) {
    var m = (v || '').match(/^(\d{1,2}):(\d{2})/);
    if (!m) return {
      h: 15,
      m: 0
    };
    return {
      h: Math.max(0, Math.min(23, +m[1])),
      m: Math.max(0, Math.min(59, +m[2]))
    };
  };
  var _React$useState23 = React.useState(parse(value).h),
    _React$useState24 = _slicedToArray(_React$useState23, 2),
    h = _React$useState24[0],
    setH = _React$useState24[1];
  var _React$useState25 = React.useState(parse(value).m),
    _React$useState26 = _slicedToArray(_React$useState25, 2),
    mi = _React$useState26[0],
    setMi = _React$useState26[1];
  React.useEffect(function () {
    if (open) {
      var p = parse(value);
      setH(p.h);
      setMi(p.m);
    }
  }, [open, value]);
  var hours = React.useMemo(function () {
    return Array.from({
      length: 24
    }, function (_, i) {
      return String(i).padStart(2, '0');
    });
  }, []);
  // 5-minute grain is the sweet spot for quick selection
  var mins = React.useMemo(function () {
    return Array.from({
      length: 12
    }, function (_, i) {
      return String(i * 5).padStart(2, '0');
    });
  }, []);
  var confirm = function confirm() {
    var time = "".concat(String(h).padStart(2, '0'), ":").concat(String(mi).padStart(2, '0'));
    onPick(time);
    onClose();
  };

  // Snap minutes to nearest 5 for display, but internal state can be any int
  var displayMin = String(Math.round(mi / 5) * 5 % 60).padStart(2, '0');
  return /*#__PURE__*/React.createElement(BottomSheet, {
    open: open,
    onClose: onClose,
    title: title,
    onConfirm: confirm
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 20px 28px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(WheelColumn, {
    items: hours,
    value: String(h).padStart(2, '0'),
    onChange: function onChange(v) {
      return setH(+v);
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 28,
      color: COLORS.ink,
      opacity: 0.4
    }
  }, ":"), /*#__PURE__*/React.createElement(WheelColumn, {
    items: mins,
    value: displayMin,
    onChange: function onChange(v) {
      return setMi(+v);
    }
  })));
}

// ─── FX ─────────────────────────────────────────────────────
function useFxRate() {
  var _React$useState27 = React.useState({
      loading: true,
      rate: null,
      ts: null
    }),
    _React$useState28 = _slicedToArray(_React$useState27, 2),
    state = _React$useState28[0],
    setState = _React$useState28[1];
  var fetchRate = React.useCallback(function () {
    setState(function (s) {
      return _objectSpread(_objectSpread({}, s), {}, {
        loading: true
      });
    });
    // Try several free USD→KRW feeds in sequence; first success wins.
    var sources = [{
      url: 'https://api.frankfurter.app/latest?from=USD&to=KRW',
      parse: function parse(j) {
        var _j$rates;
        return {
          rate: j === null || j === void 0 || (_j$rates = j.rates) === null || _j$rates === void 0 ? void 0 : _j$rates.KRW,
          ts: j === null || j === void 0 ? void 0 : j.date
        };
      }
    }, {
      url: 'https://open.er-api.com/v6/latest/USD',
      parse: function parse(j) {
        var _j$rates2, _j$time_last_update_u;
        return {
          rate: j === null || j === void 0 || (_j$rates2 = j.rates) === null || _j$rates2 === void 0 ? void 0 : _j$rates2.KRW,
          ts: j === null || j === void 0 || (_j$time_last_update_u = j.time_last_update_utc) === null || _j$time_last_update_u === void 0 ? void 0 : _j$time_last_update_u.slice(0, 16)
        };
      }
    }, {
      url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      parse: function parse(j) {
        var _j$usd;
        return {
          rate: j === null || j === void 0 || (_j$usd = j.usd) === null || _j$usd === void 0 ? void 0 : _j$usd.krw,
          ts: j === null || j === void 0 ? void 0 : j.date
        };
      }
    }];
    var _tryNext = function tryNext(i) {
      if (i >= sources.length) {
        setState({
          loading: false,
          rate: null,
          ts: null
        });
        return;
      }
      fetch(sources[i].url).then(function (r) {
        return r.json();
      }).then(function (j) {
        var _sources$i$parse = sources[i].parse(j),
          rate = _sources$i$parse.rate,
          ts = _sources$i$parse.ts;
        if (rate) setState({
          loading: false,
          rate: rate,
          ts: ts || null
        });else _tryNext(i + 1);
      }).catch(function () {
        return _tryNext(i + 1);
      });
    };
    _tryNext(0);
  }, []);
  React.useEffect(function () {
    fetchRate();
  }, [fetchRate]);
  return _objectSpread(_objectSpread({}, state), {}, {
    refresh: fetchRate
  });
}
function FxCard() {
  var _useFxRate = useFxRate(),
    loading = _useFxRate.loading,
    rate = _useFxRate.rate,
    ts = _useFxRate.ts,
    refresh = _useFxRate.refresh;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 14,
      padding: '13px 14px 11px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.mute,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, "\uD558\uB098\uC740\uD589 \xB7 \uB9E4\uB9E4\uAE30\uC900\uC728"), /*#__PURE__*/React.createElement("button", {
    onClick: refresh,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      padding: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh",
    size: 12,
    color: COLORS.mute,
    stroke: 1.8
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      fontFamily: SERIF,
      fontSize: 22,
      color: COLORS.ink
    }
  }, loading ? '…' : rate ? "\u20A9".concat(Math.round(rate).toLocaleString()) : '—'), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 1,
      fontFamily: SANS,
      fontSize: 11,
      color: COLORS.mute
    }
  }, "= $1 ", ts && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, "\xB7 ", ts)));
}

// ─── Timezones ──────────────────────────────────────────────
var CITIES = [{
  key: 'New York',
  zone: 'America/New_York',
  flag: '🇺🇸'
}, {
  key: 'Los Angeles',
  zone: 'America/Los_Angeles',
  flag: '🇺🇸'
}, {
  key: 'Washington',
  zone: 'America/New_York',
  flag: '🇺🇸'
}, {
  key: 'London',
  zone: 'Europe/London',
  flag: '🇬🇧'
}, {
  key: 'Paris',
  zone: 'Europe/Paris',
  flag: '🇫🇷'
}, {
  key: 'Rome',
  zone: 'Europe/Rome',
  flag: '🇮🇹'
}, {
  key: 'Berlin',
  zone: 'Europe/Berlin',
  flag: '🇩🇪'
}, {
  key: 'Dubai',
  zone: 'Asia/Dubai',
  flag: '🇦🇪'
}, {
  key: 'Bangkok',
  zone: 'Asia/Bangkok',
  flag: '🇹🇭'
}, {
  key: 'Singapore',
  zone: 'Asia/Singapore',
  flag: '🇸🇬'
}, {
  key: 'Hong Kong',
  zone: 'Asia/Hong_Kong',
  flag: '🇭🇰'
}, {
  key: 'Shanghai',
  zone: 'Asia/Shanghai',
  flag: '🇨🇳'
}, {
  key: 'Tokyo',
  zone: 'Asia/Tokyo',
  flag: '🇯🇵'
}, {
  key: 'Seoul',
  zone: 'Asia/Seoul',
  flag: '🇰🇷'
}, {
  key: 'Sydney',
  zone: 'Australia/Sydney',
  flag: '🇦🇺'
}, {
  key: 'Hawaii',
  zone: 'Pacific/Honolulu',
  flag: '🇺🇸'
}];
function zoneOffsetMin(zone) {
  var d = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  var dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  var parts = dtf.formatToParts(d).reduce(function (a, p) {
    a[p.type] = p.value;
    return a;
  }, {});
  var asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return Math.round((asUTC - d.getTime()) / 60000);
}
function formatDiffFromSeoul(zone) {
  var now = new Date();
  var diff = (zoneOffsetMin(zone, now) - zoneOffsetMin('Asia/Seoul', now)) / 60;
  var sign = diff > 0 ? '+' : diff < 0 ? '−' : '±';
  return "".concat(sign).concat(Math.abs(diff), "h");
}
function formatCityTime(zone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
}
function TimezoneCard(_ref1) {
  var city = _ref1.city,
    onClick = _ref1.onClick;
  var _React$useReducer = React.useReducer(function (x) {
      return x + 1;
    }, 0),
    _React$useReducer2 = _slicedToArray(_React$useReducer, 2),
    force = _React$useReducer2[1];
  React.useEffect(function () {
    var t = setInterval(force, 30000);
    return function () {
      return clearInterval(t);
    };
  }, []);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      background: COLORS.card,
      borderRadius: 14,
      padding: '13px 14px 11px',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.mute,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, "\uC2DC\uCC28"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-d",
    size: 12,
    color: COLORS.mute,
    stroke: 1.8
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      fontFamily: SERIF,
      fontSize: 22,
      color: COLORS.ink
    }
  }, formatDiffFromSeoul(city.zone)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 1,
      fontFamily: SANS,
      fontSize: 11,
      color: COLORS.mute,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, city.flag, " ", city.key, " \xB7 ", formatCityTime(city.zone)));
}
function CityPicker(_ref10) {
  var current = _ref10.current,
    onPick = _ref10.onPick,
    onClose = _ref10.onClose;
  var _React$useState29 = React.useState(''),
    _React$useState30 = _slicedToArray(_React$useState29, 2),
    q = _React$useState30[0],
    setQ = _React$useState30[1];
  var filtered = CITIES.filter(function (c) {
    return c.key.toLowerCase().includes(q.toLowerCase());
  });
  React.useEffect(function () {
    document.body.style.overflow = 'hidden';
    return function () {
      document.body.style.overflow = '';
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0,0,0,0.35)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    style: {
      background: COLORS.bg,
      borderRadius: '22px 22px 0 0',
      maxHeight: '82%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '8px 0 4px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      background: COLORS.line,
      borderRadius: 2
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 20px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 24,
      color: COLORS.ink
    }
  }, "\uB3C4\uC2DC \uC120\uD0DD")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 10,
      padding: '10px 12px',
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14,
    color: COLORS.mute,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: function onChange(e) {
      return setQ(e.target.value);
    },
    placeholder: "\uB3C4\uC2DC \uAC80\uC0C9",
    style: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      flex: 1,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: '0 16px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 14,
      overflow: 'hidden'
    }
  }, filtered.map(function (c, i) {
    return /*#__PURE__*/React.createElement("button", {
      key: c.key,
      onClick: function onClick() {
        onPick(c);
        onClose();
      },
      style: {
        width: '100%',
        border: 'none',
        background: 'transparent',
        padding: '12px 14px',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        borderBottom: i < filtered.length - 1 ? "1px solid ".concat(COLORS.line) : 'none',
        cursor: 'pointer',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, c.flag), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 14,
        color: COLORS.ink
      }
    }, c.key), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 10.5,
        color: COLORS.mute,
        marginTop: 2
      }
    }, formatDiffFromSeoul(c.zone), " \xB7 ", formatCityTime(c.zone))), c.key === current.key && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16,
      color: COLORS.accent,
      stroke: 2.5
    }));
  })))));
}

// ─── TRIPS SCREEN (top level) ───────────────────────────────
// ─── Trip Card with swipe-to-reveal share/delete ─────────────
function TripSwipeCard(_ref11) {
  var children = _ref11.children,
    onShare = _ref11.onShare,
    onDelete = _ref11.onDelete,
    onTap = _ref11.onTap,
    _ref11$wrapStyle = _ref11.wrapStyle,
    wrapStyle = _ref11$wrapStyle === void 0 ? {} : _ref11$wrapStyle;
  var _React$useState31 = React.useState(0),
    _React$useState32 = _slicedToArray(_React$useState31, 2),
    x = _React$useState32[0],
    setX = _React$useState32[1];
  var _React$useState33 = React.useState(false),
    _React$useState34 = _slicedToArray(_React$useState33, 2),
    open = _React$useState34[0],
    setOpen = _React$useState34[1];
  var startRef = React.useRef(null);
  var dragging = React.useRef(false);
  var xRef = React.useRef(0);
  var tappedRef = React.useRef(false);
  var REVEAL = 144;
  var DELETE_EXTRA = 72;
  var close = function close() {
    setX(0);
    xRef.current = 0;
    setOpen(false);
  };
  var onTouchStart = function onTouchStart(e) {
    startRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    dragging.current = false;
    tappedRef.current = false;
  };
  var onTouchMove = function onTouchMove(e) {
    if (!startRef.current) return;
    var dx = e.touches[0].clientX - startRef.current.x;
    var dy = Math.abs(e.touches[0].clientY - startRef.current.y);
    if (!dragging.current) {
      if (Math.abs(dx) < 8) return;
      if (dy > Math.abs(dx) * 0.6) {
        startRef.current = null;
        return;
      }
      dragging.current = true;
    }
    var base = open ? -REVEAL : 0;
    var raw = base + dx;
    var clamped = open ? Math.max(-(REVEAL + DELETE_EXTRA + 16), Math.min(0, raw)) : Math.max(-REVEAL, Math.min(0, raw));
    xRef.current = clamped;
    setX(clamped);
  };
  var onTouchEnd = function onTouchEnd() {
    if (!startRef.current) return;
    if (!dragging.current) {
      // 탭 감지: 드래그 없이 손가락 뗌
      startRef.current = null;
      if (!open && onTap) {
        tappedRef.current = true;
        onTap();
      }
      return;
    }
    startRef.current = null;
    dragging.current = false;
    var cur = xRef.current;
    if (cur < -(REVEAL + DELETE_EXTRA / 2)) {
      close();
      setTimeout(function () {
        return onDelete();
      }, 260);
    } else if (cur < -REVEAL / 2) {
      xRef.current = -REVEAL;
      setX(-REVEAL);
      setOpen(true);
    } else {
      close();
    }
  };
  // 브라우저 synthetic click이 onTap 이후 중복 발생하는 것 방지
  var onClickCapture = function onClickCapture(e) {
    if (tappedRef.current) {
      tappedRef.current = false;
      e.stopPropagation();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: _objectSpread({
      position: 'relative',
      overflow: 'hidden'
    }, wrapStyle),
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    onTouchEnd: onTouchEnd,
    onClickCapture: onClickCapture
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: REVEAL,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      e.stopPropagation();
      close();
      setTimeout(onShare, 100);
    },
    style: {
      width: 50,
      height: 50,
      borderRadius: 25,
      border: 'none',
      cursor: 'pointer',
      background: '#4F6BED',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "share",
    size: 18,
    color: "#fff",
    stroke: 2
  })), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      e.stopPropagation();
      close();
      setTimeout(onDelete, 100);
    },
    style: {
      width: 50,
      height: 50,
      borderRadius: 25,
      border: 'none',
      cursor: 'pointer',
      background: '#B5451B',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 18,
    color: "#fff",
    stroke: 2
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      transform: "translateX(".concat(x, "px)"),
      transition: dragging.current ? 'none' : 'transform 0.28s cubic-bezier(0.25,1,0.5,1)',
      background: COLORS.card
    }
  }, children));
}

// ─── Share Trip Sheet ─────────────────────────────────────────
function ShareTripSheet(_ref12) {
  var open = _ref12.open,
    onClose = _ref12.onClose,
    trip = _ref12.trip,
    userData = _ref12.userData,
    allTrips = _ref12.allTrips,
    myUid = _ref12.myUid;
  var _React$useState35 = React.useState([]),
    _React$useState36 = _slicedToArray(_React$useState35, 2),
    memberProfiles = _React$useState36[0],
    setMemberProfiles = _React$useState36[1];
  var _React$useState37 = React.useState([]),
    _React$useState38 = _slicedToArray(_React$useState37, 2),
    contacts = _React$useState38[0],
    setContacts = _React$useState38[1];
  var _React$useState39 = React.useState(new Set()),
    _React$useState40 = _slicedToArray(_React$useState39, 2),
    selected = _React$useState40[0],
    setSelected = _React$useState40[1];
  var _React$useState41 = React.useState(''),
    _React$useState42 = _slicedToArray(_React$useState41, 2),
    email = _React$useState42[0],
    setEmail = _React$useState42[1];
  var _React$useState43 = React.useState(''),
    _React$useState44 = _slicedToArray(_React$useState43, 2),
    msg = _React$useState44[0],
    setMsg = _React$useState44[1];
  var _React$useState45 = React.useState(false),
    _React$useState46 = _slicedToArray(_React$useState45, 2),
    loading = _React$useState46[0],
    setLoading = _React$useState46[1];
  var _React$useState47 = React.useState(false),
    _React$useState48 = _slicedToArray(_React$useState47, 2),
    sending = _React$useState48[0],
    setSending = _React$useState48[1];
  var _React$useState49 = React.useState(null),
    _React$useState50 = _slicedToArray(_React$useState49, 2),
    removing = _React$useState50[0],
    setRemoving = _React$useState50[1];
  React.useEffect(function () {
    if (open) {
      document.body.style.overflow = 'hidden';
      return function () {
        document.body.style.overflow = '';
      };
    }
  }, [open]);
  React.useEffect(function () {
    if (!open || !trip) return;
    setSelected(new Set());
    setEmail('');
    setMsg('');
    setMemberProfiles([]);
    setContacts([]);
    var currentMembers = new Set(trip.members || []);
    var memberUids = _toConsumableArray(currentMembers).filter(function (uid) {
      return uid !== myUid;
    });
    var candidateUids = new Set();
    (allTrips || []).forEach(function (t) {
      (t.members || []).forEach(function (uid) {
        if (uid !== myUid && !currentMembers.has(uid)) candidateUids.add(uid);
      });
    });
    setLoading(true);
    Promise.all([memberUids.length ? window.fbGetUsersById(memberUids) : Promise.resolve([]), candidateUids.size ? window.fbGetUsersById(_toConsumableArray(candidateUids)) : Promise.resolve([])]).then(function (_ref13) {
      var _ref14 = _slicedToArray(_ref13, 2),
        members = _ref14[0],
        candidates = _ref14[1];
      setMemberProfiles(members);
      setContacts(candidates);
      setLoading(false);
    }).catch(function () {
      return setLoading(false);
    });
  }, [open, trip && trip.id]);
  var handleRemove = /*#__PURE__*/function () {
    var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(c) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (confirm("\"".concat(c.displayName, "\"\uB2D8\uC744 \uC774 \uC5EC\uD589\uC5D0\uC11C \uC81C\uC678\uD560\uAE4C\uC694?"))) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            setRemoving(c.uid);
            _context.n = 2;
            return window.fbRemoveTripMember(trip.id, c.uid);
          case 2:
            setMemberProfiles(function (prev) {
              return prev.filter(function (m) {
                return m.uid !== c.uid;
              });
            });
            setRemoving(null);
          case 3:
            return _context.a(2);
        }
      }, _callee);
    }));
    return function handleRemove(_x) {
      return _ref15.apply(this, arguments);
    };
  }();
  var toggleSelect = function toggleSelect(uid) {
    setSelected(function (prev) {
      var next = new Set(prev);
      if (next.has(uid)) next.delete(uid);else next.add(uid);
      return next;
    });
  };
  var handleSend = /*#__PURE__*/function () {
    var _ref16 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var hasEmail, results, _iterator, _step, _loop, errors, ok, _t2, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            if (trip) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2);
          case 1:
            hasEmail = email.trim().length > 0;
            if (!(!selected.size && !hasEmail)) {
              _context3.n = 2;
              break;
            }
            return _context3.a(2);
          case 2:
            setSending(true);
            setMsg('');
            results = [];
            _iterator = _createForOfIteratorHelper(selected);
            _context3.p = 3;
            _loop = /*#__PURE__*/_regenerator().m(function _loop() {
              var uid, c, _t;
              return _regenerator().w(function (_context2) {
                while (1) switch (_context2.n) {
                  case 0:
                    uid = _step.value;
                    c = contacts.find(function (x) {
                      return x.uid === uid;
                    });
                    if (!(c !== null && c !== void 0 && c.email)) {
                      _context2.n = 2;
                      break;
                    }
                    _t = results;
                    _context2.n = 1;
                    return fbSendTripInvite(userData, c.email, trip.id, trip.title);
                  case 1:
                    _t.push.call(_t, _context2.v);
                  case 2:
                    return _context2.a(2);
                }
              }, _loop);
            });
            _iterator.s();
          case 4:
            if ((_step = _iterator.n()).done) {
              _context3.n = 6;
              break;
            }
            return _context3.d(_regeneratorValues(_loop()), 5);
          case 5:
            _context3.n = 4;
            break;
          case 6:
            _context3.n = 8;
            break;
          case 7:
            _context3.p = 7;
            _t2 = _context3.v;
            _iterator.e(_t2);
          case 8:
            _context3.p = 8;
            _iterator.f();
            return _context3.f(8);
          case 9:
            if (!hasEmail) {
              _context3.n = 11;
              break;
            }
            _t3 = results;
            _context3.n = 10;
            return fbSendTripInvite(userData, email.trim(), trip.id, trip.title);
          case 10:
            _t3.push.call(_t3, _context3.v);
          case 11:
            setSending(false);
            errors = results.filter(function (r) {
              return r.error;
            });
            ok = results.filter(function (r) {
              return r.success;
            });
            if (ok.length) {
              setMsg("".concat(ok.map(function (r) {
                return r.toName;
              }).join(', '), "\uB2D8\uAED8 \uCD08\uB300\uB97C \uBCF4\uB0C8\uC2B5\uB2C8\uB2E4!"));
              setSelected(new Set());
              setEmail('');
            } else if (errors.length) {
              setMsg(errors[0].error);
            }
          case 12:
            return _context3.a(2);
        }
      }, _callee2, null, [[3, 7, 8, 9]]);
    }));
    return function handleSend() {
      return _ref16.apply(this, arguments);
    };
  }();
  if (!open || !trip) return null;
  var canSend = selected.size > 0 || email.trim().length > 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 400,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    style: {
      background: COLORS.bg,
      borderRadius: '22px 22px 0 0',
      padding: '0 20px calc(28px + env(safe-area-inset-bottom,0px))',
      maxHeight: '80vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 0 6px',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      background: COLORS.line,
      borderRadius: 2
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.accent,
      letterSpacing: '0.14em',
      marginBottom: 4
    }
  }, "SHARE TRIP"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 22,
      color: COLORS.ink,
      marginBottom: 16
    }
  }, trip.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    }
  }, loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '20px 0',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, "\uBD88\uB7EC\uC624\uB294 \uC911...") : /*#__PURE__*/React.createElement(React.Fragment, null, memberProfiles.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 11,
      color: COLORS.mute,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 8
    }
  }, "\uD604\uC7AC \uB3D9\uD589\uC778"), memberProfiles.map(function (c) {
    return /*#__PURE__*/React.createElement("div", {
      key: c.uid,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 14,
        marginBottom: 6,
        background: COLORS.card
      }
    }, c.photoURL ? /*#__PURE__*/React.createElement("img", {
      src: c.photoURL,
      alt: "",
      style: {
        width: 38,
        height: 38,
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: '#C8C3B8',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        fontSize: 15,
        color: '#fff',
        fontWeight: 600
      }
    }, (c.displayName || '?')[0].toUpperCase()), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 14,
        color: COLORS.ink,
        fontWeight: 500,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, c.displayName), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 12,
        color: COLORS.mute,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, c.email)), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick(e) {
        e.stopPropagation();
        handleRemove(c);
      },
      disabled: removing === c.uid,
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 4,
        color: COLORS.mute,
        opacity: removing === c.uid ? 0.4 : 1,
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 16,
      color: COLORS.mute,
      stroke: 2
    })));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  })), contacts.length > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 11,
      color: COLORS.mute,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 8
    }
  }, "\uC774\uC804 \uB3D9\uD589\uC778"), contacts.map(function (c) {
    var isSel = selected.has(c.uid);
    return /*#__PURE__*/React.createElement("div", {
      key: c.uid,
      onClick: function onClick() {
        return toggleSelect(c.uid);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 14,
        marginBottom: 6,
        background: isSel ? '#EEF2FF' : COLORS.card,
        border: "1.5px solid ".concat(isSel ? '#4F6BED' : 'transparent'),
        cursor: 'pointer'
      }
    }, c.photoURL ? /*#__PURE__*/React.createElement("img", {
      src: c.photoURL,
      alt: "",
      style: {
        width: 38,
        height: 38,
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: '#C8C3B8',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        fontSize: 15,
        color: '#fff',
        fontWeight: 600
      }
    }, (c.displayName || '?')[0].toUpperCase()), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 14,
        color: COLORS.ink,
        fontWeight: 500,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, c.displayName), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 12,
        color: COLORS.mute,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, c.email)), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 22,
        height: 22,
        borderRadius: '50%',
        flexShrink: 0,
        border: "2px solid ".concat(isSel ? '#4F6BED' : COLORS.line),
        background: isSel ? '#4F6BED' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, isSel && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 12,
      color: "#fff",
      stroke: 3
    })));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 11,
      color: COLORS.mute,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 8
    }
  }, contacts.length > 0 ? '새로운 동행인' : '동행인 초대'), /*#__PURE__*/React.createElement("input", {
    value: email,
    onChange: function onChange(e) {
      return setEmail(e.target.value);
    },
    placeholder: "\uAD6C\uAE00 \uC774\uBA54\uC77C \uC785\uB825",
    onKeyDown: function onKeyDown(e) {
      return e.key === 'Enter' && handleSend();
    },
    style: {
      width: '100%',
      padding: '13px 14px',
      borderRadius: 14,
      border: "1.5px solid ".concat(COLORS.line),
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 14,
      color: COLORS.ink,
      boxSizing: 'border-box',
      outline: 'none'
    }
  }), msg && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: SANS,
      fontSize: 13,
      color: msg.includes('보냈') ? COLORS.accent : '#C0392B'
    }
  }, msg))), /*#__PURE__*/React.createElement("button", {
    onClick: handleSend,
    disabled: sending || !canSend,
    style: {
      flexShrink: 0,
      marginTop: 14,
      width: '100%',
      padding: '15px',
      border: 'none',
      borderRadius: 14,
      background: canSend ? COLORS.ink : COLORS.softer,
      color: canSend ? COLORS.bg : COLORS.mute,
      fontFamily: SANS,
      fontSize: 14,
      fontWeight: 500,
      cursor: canSend ? 'pointer' : 'default'
    }
  }, sending ? '보내는 중...' : '초대 보내기')));
}
function TripsScreen(_ref17) {
  var trips = _ref17.trips,
    onSelect = _ref17.onSelect,
    onAdd = _ref17.onAdd,
    _onShare = _ref17.onShare,
    _onDelete = _ref17.onDelete,
    loading = _ref17.loading,
    userData = _ref17.userData,
    onOpenCompanion = _ref17.onOpenCompanion,
    myUid = _ref17.myUid;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: COLORS.bg,
      paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
      paddingBottom: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      padding: '0 20px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 34,
      color: COLORS.ink,
      letterSpacing: '-0.02em'
    }
  }, "My Trips"), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenCompanion,
    style: {
      width: 38,
      height: 38,
      borderRadius: 19,
      marginBottom: 2,
      background: userData !== null && userData !== void 0 && userData.photoURL ? 'transparent' : COLORS.softer,
      border: "2px solid ".concat(COLORS.line),
      padding: 0,
      cursor: 'pointer',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, userData !== null && userData !== void 0 && userData.photoURL ? /*#__PURE__*/React.createElement("img", {
    src: userData.photoURL,
    alt: "profile",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 18,
    color: COLORS.mute
  }))), loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 60,
      color: COLORS.mute,
      fontFamily: SANS,
      fontSize: 14
    }
  }, "\uB85C\uB529 \uC911...") : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, trips.map(function (t) {
    var _t$days$0$hero$hue, _t$days, _t$days2, _t$title;
    var hue = (_t$days$0$hero$hue = (_t$days = t.days) === null || _t$days === void 0 || (_t$days = _t$days[0]) === null || _t$days === void 0 || (_t$days = _t$days.hero) === null || _t$days === void 0 ? void 0 : _t$days.hue) !== null && _t$days$0$hero$hue !== void 0 ? _t$days$0$hero$hue : 25;
    var label = ((_t$days2 = t.days) === null || _t$days2 === void 0 || (_t$days2 = _t$days2[0]) === null || _t$days2 === void 0 || (_t$days2 = _t$days2.hero) === null || _t$days2 === void 0 ? void 0 : _t$days2.label) || ((_t$title = t.title) === null || _t$title === void 0 ? void 0 : _t$title.toUpperCase()) || 'TRIP';
    var isShared = Array.isArray(t.members) && t.members.length > 0 && t.members[0] !== myUid;
    return /*#__PURE__*/React.createElement(TripSwipeCard, {
      key: t.id,
      onTap: function onTap() {
        return onSelect(t.id);
      },
      onShare: function onShare() {
        return _onShare(t);
      },
      onDelete: function onDelete() {
        return _onDelete(t.id);
      },
      wrapStyle: {
        borderRadius: 20,
        border: "1px solid ".concat(COLORS.line)
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: function onClick() {
        return onSelect(t.id);
      },
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Photo, {
      hue: hue,
      label: label,
      height: 130
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 18px 16px',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 10,
        color: COLORS.accent,
        letterSpacing: '0.14em'
      }
    }, (t.days || []).length, " DAYS", t.dates ? ' · ' + t.dates : ''), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        fontFamily: SERIF,
        fontSize: 28,
        lineHeight: 1.1,
        color: COLORS.ink,
        letterSpacing: '-0.015em'
      }
    }, t.title || '새 여행'), isShared && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 14,
        right: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: '#EEF2FF',
        borderRadius: 20,
        padding: '4px 10px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "users",
      size: 11,
      color: "#4F6BED",
      stroke: 2
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS,
        fontSize: 10,
        color: '#4F6BED',
        fontWeight: 500
      }
    }, "\uACF5\uC720\uB428")))));
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onAdd,
    style: {
      marginTop: 4,
      padding: '18px 16px',
      background: 'transparent',
      border: "1.5px dashed ".concat(COLORS.line),
      borderRadius: 20,
      color: COLORS.mute,
      cursor: 'pointer',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: SANS,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15,
    color: COLORS.mute,
    stroke: 2
  }), "\uC0C8 \uC5EC\uD589 \uCD94\uAC00")));
}

// ─── 날짜 변환 유틸 (앱 전역) ─────────────────────────────────
var MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function extractTripYear(trip) {
  var m = (trip.dates || '').match(/(\d{4})/);
  if (m) return parseInt(m[1], 10);
  return new Date().getFullYear();
}
function dayDateToIso(txt, tripYear) {
  if (!txt) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(txt)) return txt.slice(0, 10);
  var m = txt.match(/([A-Za-z]+)\s+(\d{1,2})(?:,?\s*(\d{4}))?/);
  if (!m) return '';
  var mi = MONTH_NAMES_SHORT.findIndex(function (x) {
    return x.toLowerCase() === m[1].slice(0, 3).toLowerCase();
  });
  if (mi < 0) return '';
  var year = m[3] ? parseInt(m[3], 10) : tripYear || new Date().getFullYear();
  return "".concat(year, "-").concat(String(mi + 1).padStart(2, '0'), "-").concat(String(m[2]).padStart(2, '0'));
}
function isoToDayDate(iso) {
  if (!iso) return '';
  var m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return "".concat(MONTH_NAMES_SHORT[parseInt(m[2], 10) - 1], " ").concat(parseInt(m[3], 10), ", ").concat(m[1]);
}
function isoToWeekday(iso) {
  if (!iso) return '';
  var d = new Date(iso + 'T12:00:00');
  return WEEKDAY_NAMES[d.getDay()];
}

// ─── Home ───────────────────────────────────────────────────
function HomeScreen(_ref18) {
  var trip = _ref18.trip,
    onOpenDay = _ref18.onOpenDay,
    onOpenHotel = _ref18.onOpenHotel,
    city = _ref18.city,
    onPickCity = _ref18.onPickCity,
    onEditTrip = _ref18.onEditTrip,
    onReorderDays = _ref18.onReorderDays,
    onAddDay = _ref18.onAddDay,
    onDeleteDay = _ref18.onDeleteDay,
    onBack = _ref18.onBack,
    onAddHotel = _ref18.onAddHotel,
    onAddHotelFromSearch = _ref18.onAddHotelFromSearch,
    onDeleteHotel = _ref18.onDeleteHotel,
    onReorderHotels = _ref18.onReorderHotels,
    onConvertInlineHotel = _ref18.onConvertInlineHotel,
    onAddItemToFirstDay = _ref18.onAddItemToFirstDay,
    editing = _ref18.editing,
    setEditing = _ref18.setEditing,
    userData = _ref18.userData,
    onOpenCompanion = _ref18.onOpenCompanion;
  var _React$useState51 = React.useState(false),
    _React$useState52 = _slicedToArray(_React$useState51, 2),
    editingTitle = _React$useState52[0],
    setEditingTitle = _React$useState52[1];
  var _React$useState53 = React.useState(null),
    _React$useState54 = _slicedToArray(_React$useState53, 2),
    datePicker = _React$useState54[0],
    setDatePicker = _React$useState54[1]; // 'start' | 'end' | null
  var _useDragReorder = useDragReorder(onReorderDays, editing),
    dayDragProps = _useDragReorder.itemProps,
    isDayDragging = _useDragReorder.isTouchDragging;
  var _useDragReorder2 = useDragReorder(onReorderHotels, editing),
    hotelDragProps = _useDragReorder2.itemProps,
    isHotelDragging = _useDragReorder2.isTouchDragging;
  var featured = trip.days[0];
  var tripYear = extractTripYear(trip);

  // trip.dates 파싱: "May 4 — May 13, 2025"
  var parseTripDates = function parseTripDates() {
    var _parts$, _parts$2;
    var str = trip.dates || '';
    var parts = str.split(/\s*[—–-]\s*/);
    var startStr = ((_parts$ = parts[0]) === null || _parts$ === void 0 ? void 0 : _parts$.trim()) || '';
    var endStr = ((_parts$2 = parts[1]) === null || _parts$2 === void 0 ? void 0 : _parts$2.trim()) || '';
    // 연도가 없으면 tripYear 붙이기
    var addYear = function addYear(s) {
      return /\d{4}/.test(s) ? s : s ? "".concat(s, ", ").concat(tripYear) : '';
    };
    return {
      startIso: dayDateToIso(addYear(startStr), tripYear),
      endIso: dayDateToIso(addYear(endStr), tripYear)
    };
  };
  var handlePickStart = function handlePickStart(iso) {
    var _parseTripDates = parseTripDates(),
      startIso = _parseTripDates.startIso;
    // 날짜 diff 계산해서 모든 일정 날짜 이동
    if (startIso && iso && startIso !== iso) {
      var oldMs = new Date(startIso + 'T12:00:00').getTime();
      var newMs = new Date(iso + 'T12:00:00').getTime();
      var diffDays = Math.round((newMs - oldMs) / 86400000);
      var shiftedDays = (trip.days || []).map(function (d) {
        var dIso = dayDateToIso(d.date, tripYear);
        if (!dIso) return d;
        var shifted = new Date(new Date(dIso + 'T12:00:00').getTime() + diffDays * 86400000);
        var newIso = shifted.toISOString().slice(0, 10);
        return _objectSpread(_objectSpread({}, d), {}, {
          date: isoToDayDate(newIso),
          weekday: isoToWeekday(newIso)
        });
      });
      // trip.dates 새 시작일로 업데이트
      var _parseTripDates2 = parseTripDates(),
        _endIso = _parseTripDates2.endIso;
      var newStart = isoToDayDate(iso);
      var newEnd = _endIso ? isoToDayDate(new Date(new Date(_endIso + 'T12:00:00').getTime() + diffDays * 86400000).toISOString().slice(0, 10)) : '';
      onEditTrip({
        days: shiftedDays,
        dates: newEnd ? "".concat(newStart, " \u2014 ").concat(newEnd) : newStart
      });
    }
  };
  var handlePickEnd = function handlePickEnd(iso) {
    var _trip$dates;
    var _parseTripDates3 = parseTripDates(),
      startIso = _parseTripDates3.startIso;
    var newStart = startIso ? isoToDayDate(startIso) : ((_trip$dates = trip.dates) === null || _trip$dates === void 0 || (_trip$dates = _trip$dates.split(/[—–-]/)[0]) === null || _trip$dates === void 0 ? void 0 : _trip$dates.trim()) || '';
    onEditTrip({
      dates: "".concat(newStart, " \u2014 ").concat(isoToDayDate(iso))
    });
  };
  var _parseTripDates4 = parseTripDates(),
    startIso = _parseTripDates4.startIso,
    endIso = _parseTripDates4.endIso;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      minHeight: '100%',
      paddingBottom: 110,
      position: 'relative'
    }
  }, onOpenCompanion && /*#__PURE__*/React.createElement("button", {
    onClick: onOpenCompanion,
    style: {
      position: 'absolute',
      top: 'calc(14px + env(safe-area-inset-top,0px))',
      right: 16,
      zIndex: 10,
      width: 38,
      height: 38,
      borderRadius: 19,
      background: userData !== null && userData !== void 0 && userData.photoURL ? 'transparent' : COLORS.softer,
      border: "2px solid ".concat(COLORS.line),
      padding: 0,
      cursor: 'pointer',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 1px 6px rgba(0,0,0,0.10)'
    }
  }, userData !== null && userData !== void 0 && userData.photoURL ? /*#__PURE__*/React.createElement("img", {
    src: userData.photoURL,
    alt: "profile",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 18,
    color: COLORS.mute
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 24px 18px'
    }
  }, editing && editingTitle ? /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: trip.title,
    onChange: function onChange(e) {
      return onEditTrip({
        title: e.target.value
      });
    },
    onBlur: function onBlur() {
      return setEditingTitle(false);
    },
    style: {
      fontFamily: SERIF,
      fontSize: 56,
      lineHeight: 0.95,
      color: COLORS.ink,
      letterSpacing: '-0.025em',
      fontWeight: 400,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      width: '100%',
      padding: 0
    }
  }) : /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return editing && setEditingTitle(true);
    },
    style: {
      fontFamily: SERIF,
      fontSize: 56,
      lineHeight: 0.95,
      color: COLORS.ink,
      letterSpacing: '-0.025em',
      fontWeight: 400,
      cursor: editing ? 'text' : 'default'
    }
  }, trip.title, "."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setDatePicker('start');
    },
    style: {
      border: "1.5px solid ".concat(COLORS.line),
      borderRadius: 8,
      padding: '4px 10px',
      background: COLORS.card,
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 12,
      color: COLORS.ink,
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 11,
    color: COLORS.mute,
    stroke: 1.8
  }), startIso ? isoToDayDate(startIso) : '시작일'), /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.mute,
      fontSize: 13
    }
  }, "\u2014"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setDatePicker('end');
    },
    style: {
      border: "1.5px solid ".concat(COLORS.line),
      borderRadius: 8,
      padding: '4px 10px',
      background: COLORS.card,
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 12,
      color: COLORS.ink,
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 11,
    color: COLORS.mute,
    stroke: 1.8
  }), endIso ? isoToDayDate(endIso) : '종료일')) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, trip.dates), /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.mute,
      opacity: 0.4,
      fontSize: 13
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, trip.days.length, " days"))), featured && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 16px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 22,
      overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 12px 28px rgba(0,0,0,0.05)'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    hue: featured.hero.hue,
    label: featured.hero.label,
    height: 170
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.accent,
      letterSpacing: '0.14em'
    }
  }, "DAY 01 \xB7 ", featured.weekday.toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 11,
      color: COLORS.mute
    }
  }, featured.date)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 7,
      fontFamily: SERIF,
      fontSize: 28,
      lineHeight: 1.1,
      color: COLORS.ink
    }
  }, featured.title), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return onOpenDay(0);
    },
    style: {
      marginTop: 16,
      width: '100%',
      border: 'none',
      cursor: 'pointer',
      background: COLORS.ink,
      color: COLORS.bg,
      borderRadius: 12,
      padding: '13px 16px',
      fontFamily: SANS,
      fontSize: 14,
      fontWeight: 500,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uCCAB\uB0A0 \uC77C\uC815 \uBCF4\uAE30"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron",
    size: 16,
    color: COLORS.bg
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 24px 10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 22,
      color: COLORS.ink
    }
  }, "\uC77C\uC815"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.mute,
      letterSpacing: '0.1em'
    }
  }, trip.days.length, " DAYS \xB7 ", trip.days.reduce(function (s, d) {
    return s + d.items.length;
  }, 0), " STOPS")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, trip.days.map(function (d, i) {
    var dp = dayDragProps(i);
    var isDropTarget = dp['data-drop-target'];
    var isDragSource = dp['data-drag-source'];
    return /*#__PURE__*/React.createElement(SwipeableRow, {
      key: i,
      onEdit: function onEdit() {
        return onOpenDay(i);
      },
      onDelete: function onDelete() {
        return onDeleteDay(i);
      },
      disabled: editing,
      isDragging: isDayDragging,
      wrapStyle: {
        borderRadius: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      ref: dp.ref,
      onTouchStart: dp.onTouchStart,
      onTouchMove: dp.onTouchMove,
      onTouchEnd: dp.onTouchEnd,
      onClick: function onClick() {
        return !editing && !isDayDragging && onOpenDay(i);
      },
      style: _objectSpread(_objectSpread({
        borderRadius: 16,
        cursor: editing ? 'grab' : 'pointer'
      }, dp.style || {}), isDropTarget ? {
        background: 'transparent',
        border: "2px dashed ".concat(COLORS.line)
      } : {
        background: COLORS.card,
        border: 'none'
      })
    }, isDropTarget ?
    /*#__PURE__*/
    // 카드 모양 빈 플레이스홀더 (같은 높이)
    React.createElement("div", {
      style: {
        height: 88,
        borderRadius: 14
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 12,
        display: 'flex',
        gap: 12,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 64,
        height: 64,
        borderRadius: 10,
        overflow: 'hidden',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Photo, {
      hue: d.hero.hue,
      height: 64,
      small: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 10,
        color: COLORS.mute,
        letterSpacing: '0.12em'
      }
    }, "DAY ", String(d.n).padStart(2, '0')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 11,
        color: COLORS.mute
      }
    }, d.date, " \xB7 ", d.weekday)), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3,
        fontFamily: SERIF,
        fontSize: 18,
        lineHeight: 1.2,
        color: COLORS.ink,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, d.title), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3,
        fontFamily: SANS,
        fontSize: 11.5,
        color: COLORS.mute,
        display: 'flex',
        gap: 5,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 11,
      color: COLORS.mute,
      stroke: 1.8
    }), /*#__PURE__*/React.createElement("span", null, d.items.length, " stops"))), editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DragHandle, {
      size: 14,
      color: COLORS.mute
    }), !isDayDragging && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick(e) {
        e.stopPropagation();
        onDeleteDay(i);
      },
      style: {
        width: 26,
        height: 26,
        borderRadius: 13,
        border: 'none',
        background: 'rgba(193,79,46,0.12)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 12,
      color: COLORS.accent,
      stroke: 2
    }))) : /*#__PURE__*/React.createElement(Icon, {
      name: "chevron",
      size: 16,
      color: COLORS.mute,
      stroke: 1.8
    }))));
  }), !editing && /*#__PURE__*/React.createElement("button", {
    onClick: onAddDay,
    style: {
      padding: '16px 12px',
      background: 'transparent',
      border: "1.5px dashed ".concat(COLORS.line),
      borderRadius: 16,
      color: COLORS.mute,
      cursor: 'pointer',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: SANS,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    color: COLORS.mute,
    stroke: 2
  }), " \uC77C\uC815 \uCD94\uAC00"), editing && /*#__PURE__*/React.createElement("button", {
    onClick: onAddDay,
    style: {
      padding: '16px 12px',
      background: 'transparent',
      border: "1.5px dashed ".concat(COLORS.line),
      borderRadius: 16,
      color: COLORS.mute,
      cursor: 'pointer',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: SANS,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    color: COLORS.mute,
    stroke: 2
  }), " \uC77C\uCC28 \uCD94\uAC00")), function () {
    var hotelList = trip.hotels || [];
    // Inline hotels: hotel items in days not already in trip.hotels
    var inlineHotels = [];
    trip.days.forEach(function (d, di) {
      (d.items || []).forEach(function (it, ii) {
        if (it.cat === 'hotel') {
          var exists = hotelList.some(function (h) {
            return h.name === it.title || h.name === it.en || it._hotelRef && it._hotelRef === h.name;
          });
          if (!exists) inlineHotels.push({
            name: it.en || it.title.replace(/\s*(체크인|체크아웃)\s*$/, ''),
            area: d.title,
            checkin: "".concat(d.date).concat(it.time ? ' · ' + it.time : ''),
            hue: d.hero.hue,
            _inline: true,
            _dayIdx: di
          });
        }
      });
    });
    var total = hotelList.length + inlineHotels.length;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '22px 24px 8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SERIF,
        fontSize: 22,
        color: COLORS.ink
      }
    }, "\uC219\uC18C"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 10,
        color: COLORS.mute,
        letterSpacing: '0.1em'
      }
    }, total, " STAYS")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, hotelList.map(function (h, i) {
      var _h$hue;
      var hp = hotelDragProps(i);
      return /*#__PURE__*/React.createElement(SwipeableRow, {
        key: i,
        onEdit: function onEdit() {
          return onOpenHotel(i);
        },
        onDelete: function onDelete() {
          return onDeleteHotel(i);
        },
        disabled: editing,
        wrapStyle: {
          borderRadius: 16
        }
      }, /*#__PURE__*/React.createElement("div", _extends({}, hp, {
        onClick: function onClick() {
          return !editing && onOpenHotel(i);
        },
        style: _objectSpread({
          background: COLORS.card,
          borderRadius: 16,
          padding: 12,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          cursor: editing ? 'grab' : 'pointer',
          border: hp['data-drag-over'] ? "2px solid ".concat(COLORS.accent) : 'none'
        }, hp.style || {})
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 64,
          height: 64,
          borderRadius: 10,
          overflow: 'hidden',
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement(Photo, {
        hue: (_h$hue = h.hue) !== null && _h$hue !== void 0 ? _h$hue : 25,
        height: 64,
        small: true
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: MONO,
          fontSize: 9.5,
          color: COLORS.accent,
          letterSpacing: '0.12em'
        }
      }, "STAY \xB7 ", h.checkin, " \u2192 ", h.checkout), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 3,
          fontFamily: SERIF,
          fontSize: 18,
          lineHeight: 1.2,
          color: COLORS.ink,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, h.name), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 3,
          fontFamily: SANS,
          fontSize: 11.5,
          color: COLORS.mute,
          display: 'flex',
          gap: 5,
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "pin",
        size: 11,
        color: COLORS.mute,
        stroke: 1.8
      }), /*#__PURE__*/React.createElement("span", null, h.area), h.nights && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        style: {
          opacity: 0.4
        }
      }, "\xB7"), /*#__PURE__*/React.createElement("span", null, h.nights, "\uBC15")), h.price && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        style: {
          opacity: 0.4
        }
      }, "\xB7"), /*#__PURE__*/React.createElement("span", null, h.price)))), editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DragHandle, {
        size: 14,
        color: COLORS.mute
      }), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick(e) {
          e.stopPropagation();
          onDeleteHotel(i);
        },
        style: {
          width: 26,
          height: 26,
          borderRadius: 13,
          border: 'none',
          background: 'rgba(193,79,46,0.12)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "trash",
        size: 12,
        color: COLORS.accent,
        stroke: 2
      }))) : /*#__PURE__*/React.createElement(Icon, {
        name: "chevron",
        size: 16,
        color: COLORS.mute,
        stroke: 1.8
      })));
    }), inlineHotels.map(function (h, i) {
      var _h$hue2;
      // trip.hotels에 같은 이름 있으면 그리로, 없으면 자동 추가 후 오픈
      var handleClick = function handleClick() {
        var matchIdx = (trip.hotels || []).findIndex(function (h2) {
          return h2.name === h.name;
        });
        if (matchIdx >= 0) {
          onOpenHotel(matchIdx);
        } else {
          onConvertInlineHotel(h);
        }
      };
      return /*#__PURE__*/React.createElement(SwipeableRow, {
        key: 'inl' + i,
        onEdit: handleClick,
        onDelete: function onDelete() {},
        disabled: editing,
        wrapStyle: {
          borderRadius: 16
        }
      }, /*#__PURE__*/React.createElement("div", {
        onClick: handleClick,
        style: {
          background: COLORS.card,
          borderRadius: 16,
          padding: 12,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 64,
          height: 64,
          borderRadius: 10,
          overflow: 'hidden',
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement(Photo, {
        hue: (_h$hue2 = h.hue) !== null && _h$hue2 !== void 0 ? _h$hue2 : 25,
        height: 64,
        small: true
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: MONO,
          fontSize: 9.5,
          color: COLORS.accent,
          letterSpacing: '0.12em'
        }
      }, "STAY \xB7 ", h.checkin), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 3,
          fontFamily: SERIF,
          fontSize: 18,
          lineHeight: 1.2,
          color: COLORS.ink,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, h.name), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 3,
          fontFamily: SANS,
          fontSize: 11.5,
          color: COLORS.mute,
          display: 'flex',
          gap: 5,
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "pin",
        size: 11,
        color: COLORS.mute,
        stroke: 1.8
      }), /*#__PURE__*/React.createElement("span", null, h.area))), /*#__PURE__*/React.createElement(Icon, {
        name: "chevron",
        size: 16,
        color: COLORS.mute,
        stroke: 1.8
      })));
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onAddHotelFromSearch,
      style: {
        flex: 1,
        padding: '13px 12px',
        background: COLORS.ink,
        color: COLORS.bg,
        border: 'none',
        borderRadius: 14,
        cursor: 'pointer',
        display: 'flex',
        gap: 7,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: 500
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 13,
      color: COLORS.bg,
      stroke: 2
    }), " \uC219\uC18C \uAC80\uC0C9"), /*#__PURE__*/React.createElement("button", {
      onClick: onAddHotel,
      style: {
        flex: 1,
        padding: '13px 12px',
        background: 'transparent',
        border: "1.5px dashed ".concat(COLORS.line),
        borderRadius: 14,
        color: COLORS.mute,
        cursor: 'pointer',
        display: 'flex',
        gap: 7,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 13,
      color: COLORS.mute,
      stroke: 2
    }), " \uC9C1\uC811 \uCD94\uAC00"))));
  }(), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 24px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 22,
      color: COLORS.ink
    }
  }, "\uC2E4\uC6A9 \uC815\uBCF4")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(FxCard, null), /*#__PURE__*/React.createElement(TimezoneCard, {
    city: city,
    onClick: onPickCity
  })), /*#__PURE__*/React.createElement(DatePickerSheet, {
    open: datePicker === 'start',
    title: "\uC2DC\uC791 \uB0A0\uC9DC",
    value: startIso,
    onClose: function onClose() {
      return setDatePicker(null);
    },
    onPick: function onPick(iso) {
      handlePickStart(iso);
      setDatePicker(null);
    }
  }), /*#__PURE__*/React.createElement(DatePickerSheet, {
    open: datePicker === 'end',
    title: "\uC885\uB8CC \uB0A0\uC9DC",
    value: endIso,
    minDate: startIso,
    onClose: function onClose() {
      return setDatePicker(null);
    },
    onPick: function onPick(iso) {
      handlePickEnd(iso);
      setDatePicker(null);
    }
  }));
}

// ─── Day screen ─────────────────────────────────────────────
function DayScreen(_ref19) {
  var trip = _ref19.trip,
    dayIdx = _ref19.dayIdx,
    onBack = _ref19.onBack,
    onOpenStop = _ref19.onOpenStop,
    onNavDay = _ref19.onNavDay,
    onEditDay = _ref19.onEditDay,
    onAddItem = _ref19.onAddItem,
    onDeleteItem = _ref19.onDeleteItem,
    onReorderItems = _ref19.onReorderItems,
    editing = _ref19.editing,
    setEditing = _ref19.setEditing;
  var day = trip.days[dayIdx];
  var tripYear = extractTripYear(trip);
  var _React$useState55 = React.useState(function () {
      try {
        return new Set(JSON.parse(localStorage.getItem('done_' + trip.title + '_' + dayIdx) || '[]'));
      } catch (e) {
        return new Set();
      }
    }),
    _React$useState56 = _slicedToArray(_React$useState55, 2),
    done = _React$useState56[0],
    setDone = _React$useState56[1];
  var toggle = function toggle(i) {
    return setDone(function (s) {
      var n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      localStorage.setItem('done_' + trip.title + '_' + dayIdx, JSON.stringify(_toConsumableArray(n)));
      return n;
    });
  };
  var _React$useState57 = React.useState(false),
    _React$useState58 = _slicedToArray(_React$useState57, 2),
    editingTitle = _React$useState58[0],
    setEditingTitle = _React$useState58[1];
  var _React$useState59 = React.useState(false),
    _React$useState60 = _slicedToArray(_React$useState59, 2),
    datePickerOpen = _React$useState60[0],
    setDatePickerOpen = _React$useState60[1];
  var _useDragReorder3 = useDragReorder(onReorderItems, editing),
    itemDragProps = _useDragReorder3.itemProps;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      minHeight: '100%',
      paddingBottom: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 'calc(-1 * env(safe-area-inset-top, 0px))'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    hue: day.hero.hue,
    label: day.hero.label,
    height: "calc(280px + env(safe-area-inset-top, 0px))"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 180,
      background: 'linear-gradient(180deg, rgba(0,0,0,0.28), transparent)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      position: 'absolute',
      top: 'calc(16px + env(safe-area-inset-top, 0px))',
      left: 16,
      zIndex: 5,
      width: 38,
      height: 38,
      borderRadius: 19,
      border: 'none',
      background: 'rgba(255,255,255,0.88)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-l",
    size: 18,
    color: COLORS.ink,
    stroke: 2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(16px + env(safe-area-inset-top, 0px))',
      right: 16,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement(EditBtn, {
    editing: editing,
    onClick: function onClick() {
      return setEditing(function (e) {
        return !e;
      });
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: -30,
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      borderRadius: 20,
      padding: '18px 20px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.accent,
      letterSpacing: '0.14em'
    }
  }, "DAY ", String(day.n).padStart(2, '0'), " / ", String(trip.days.length).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.line
    }
  }, "\xB7"), editing ? /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setDatePickerOpen(true);
    },
    style: {
      border: 'none',
      background: COLORS.softer,
      borderRadius: 8,
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 11,
      color: COLORS.ink,
      padding: '3px 8px',
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 11,
    color: COLORS.mute,
    stroke: 1.8
  }), day.weekday && day.date ? "".concat(day.weekday, " \xB7 ").concat(day.date) : '날짜 설정') : /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 11,
      color: COLORS.mute
    }
  }, day.weekday, day.weekday && day.date ? ' · ' : '', day.date)), editing && editingTitle ? /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: day.title,
    onChange: function onChange(e) {
      return onEditDay({
        title: e.target.value
      });
    },
    onBlur: function onBlur() {
      return setEditingTitle(false);
    },
    style: {
      marginTop: 8,
      fontFamily: SERIF,
      fontSize: 30,
      lineHeight: 1.08,
      color: COLORS.ink,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      width: '100%',
      padding: 0
    }
  }) : /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return editing && setEditingTitle(true);
    },
    style: {
      marginTop: 8,
      fontFamily: SERIF,
      fontSize: 30,
      lineHeight: 1.08,
      color: COLORS.ink,
      cursor: editing ? 'text' : 'default'
    }
  }, day.title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute,
      fontStyle: 'italic'
    }
  }, day.titleEn)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: '0 6px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 22,
      color: COLORS.ink
    }
  }, "\uD0C0\uC784\uB77C\uC778"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.mute,
      letterSpacing: '0.1em'
    }
  }, done.size, "/", day.items.length, " DONE")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 52,
      top: 14,
      bottom: 14,
      width: 1,
      background: COLORS.line
    }
  }), day.items.map(function (it, i) {
    var meta = CAT_META[it.cat] || {
      icon: 'pin',
      label: it.cat
    };
    var isDone = done.has(i);
    var dp = itemDragProps(i);
    return /*#__PURE__*/React.createElement("div", _extends({
      key: i
    }, dp, {
      style: _objectSpread({
        display: 'flex',
        marginBottom: 12,
        position: 'relative'
      }, dp.style || {})
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        flexShrink: 0,
        paddingTop: 14,
        fontFamily: MONO,
        fontSize: 10.5,
        color: COLORS.mute,
        textAlign: 'right',
        paddingRight: 4
      }
    }, it.time), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 16,
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 15,
        position: 'relative',
        zIndex: 2
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick(e) {
        e.stopPropagation();
        toggle(i);
      },
      style: {
        width: 16,
        height: 16,
        borderRadius: 8,
        border: "1.5px solid ".concat(isDone ? COLORS.accent : COLORS.ink),
        background: isDone ? COLORS.accent : COLORS.bg,
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, isDone && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 10,
      color: "#fff",
      stroke: 3
    }))), /*#__PURE__*/React.createElement(SwipeableRow, {
      wrapStyle: {
        flex: 1,
        marginLeft: 10,
        borderRadius: 14
      },
      disabled: editing,
      onEdit: function onEdit() {
        return onOpenStop({
          idx: i,
          stop: it,
          editing: true
        });
      },
      onDelete: function onDelete() {
        return onDeleteItem(i);
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onOpenStop({
          idx: i,
          stop: it,
          editing: editing
        });
      },
      style: {
        width: '100%',
        background: COLORS.card,
        borderRadius: 14,
        border: 'none',
        cursor: 'pointer',
        padding: '11px 14px 13px',
        textAlign: 'left',
        opacity: isDone ? 0.5 : 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        fontFamily: MONO,
        fontSize: 9.5,
        color: COLORS.mute,
        letterSpacing: '0.12em',
        textTransform: 'uppercase'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: meta.icon,
      size: 11,
      stroke: 1.8
    }), /*#__PURE__*/React.createElement("span", null, meta.label), it.duration && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: 0.4
      }
    }, "\xB7"), /*#__PURE__*/React.createElement("span", null, it.duration)), it.price && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: 0.4
      }
    }, "\xB7"), /*#__PURE__*/React.createElement("span", null, it.price))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3,
        fontFamily: SANS,
        fontSize: 14.5,
        fontWeight: 500,
        color: COLORS.ink,
        textDecoration: isDone ? 'line-through' : 'none'
      }
    }, it.title), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 1,
        fontFamily: SANS,
        fontSize: 11.5,
        color: COLORS.mute,
        fontStyle: 'italic'
      }
    }, it.en), it.note && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        padding: '7px 9px',
        borderRadius: 8,
        background: COLORS.softer,
        fontFamily: SANS,
        fontSize: 11.5,
        color: COLORS.mute,
        lineHeight: 1.45
      }
    }, it.note)), editing && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 8,
        right: 8,
        display: 'flex',
        gap: 6,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 13,
        background: 'rgba(26,24,22,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab'
      }
    }, /*#__PURE__*/React.createElement(DragHandle, {
      size: 13,
      color: COLORS.mute
    })), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick(e) {
        e.stopPropagation();
        onDeleteItem(i);
      },
      style: {
        width: 26,
        height: 26,
        borderRadius: 13,
        border: 'none',
        background: 'rgba(193,79,46,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 13,
      color: COLORS.accent,
      stroke: 2
    }))), editing && dp['data-drag-over'] && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: -2,
        border: "2px solid ".concat(COLORS.accent),
        borderRadius: 16,
        pointerEvents: 'none'
      }
    }))));
  }), editing && /*#__PURE__*/React.createElement("button", {
    onClick: onAddItem,
    style: {
      marginLeft: 60,
      marginTop: 6,
      padding: '11px 14px',
      width: 'calc(100% - 60px)',
      background: 'transparent',
      border: "1.5px dashed ".concat(COLORS.line),
      borderRadius: 14,
      color: COLORS.mute,
      cursor: 'pointer',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: SANS,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    color: COLORS.mute,
    stroke: 2
  }), "\uC77C\uC815 \uCD94\uAC00"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 0',
      display: 'flex',
      gap: 10
    }
  }, day.n > 1 && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return onNavDay(day.n - 2);
    },
    style: {
      flex: 1,
      background: COLORS.card,
      border: "1px solid ".concat(COLORS.line),
      borderRadius: 12,
      padding: '11px 14px',
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.12em'
    }
  }, "\u2190 PREV"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink
    }
  }, "Day ", String(day.n - 1).padStart(2, '0'))), day.n < trip.days.length && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return onNavDay(day.n);
    },
    style: {
      flex: 1,
      background: COLORS.card,
      border: "1px solid ".concat(COLORS.line),
      borderRadius: 12,
      padding: '11px 14px',
      cursor: 'pointer',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.12em'
    }
  }, "NEXT \u2192"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink
    }
  }, "Day ", String(day.n + 1).padStart(2, '0')))), /*#__PURE__*/React.createElement(DatePickerSheet, {
    open: datePickerOpen,
    title: "\uB0A0\uC9DC \uC124\uC815",
    value: dayDateToIso(day.date, tripYear),
    onClose: function onClose() {
      return setDatePickerOpen(false);
    },
    onPick: function onPick(iso) {
      var display = isoToDayDate(iso);
      var weekday = isoToWeekday(iso);
      onEditDay({
        date: display,
        weekday: weekday
      });
      setDatePickerOpen(false);
    }
  }));
}

// ─── Hotel Detail page ──────────────────────────────────────
function HotelDetailScreen(_ref20) {
  var hotel = _ref20.hotel,
    onBack = _ref20.onBack,
    onEdit = _ref20.onEdit,
    onOpenSearch = _ref20.onOpenSearch,
    editing = _ref20.editing,
    setEditing = _ref20.setEditing;
  var _React$useState61 = React.useState(hotel),
    _React$useState62 = _slicedToArray(_React$useState61, 2),
    draft = _React$useState62[0],
    setDraft = _React$useState62[1];
  React.useEffect(function () {
    return setDraft(hotel);
  }, [hotel]);
  var save = function save() {
    onEdit(draft);
    setEditing(false);
  };
  var addr = draft.name + ' ' + (draft.address || draft.area || '');

  // Date conversion: "May 4" ↔ "YYYY-MM-DD". Year is taken from current date
  // (this app uses May-based demo data; real users would type their trip year).
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var dateToIso = function dateToIso(txt) {
    if (!txt) return '';
    // Accept "May 4", "May 4, 2025", or already ISO
    if (/^\d{4}-\d{2}-\d{2}/.test(txt)) return txt.slice(0, 10);
    var m = txt.match(/([A-Za-z]+)\s+(\d{1,2})(?:,\s*(\d{4}))?/);
    if (!m) return '';
    var mi = MONTHS.findIndex(function (x) {
      return x.toLowerCase() === m[1].slice(0, 3).toLowerCase();
    });
    if (mi < 0) return '';
    var year = m[3] || new Date().getFullYear();
    return "".concat(year, "-").concat(String(mi + 1).padStart(2, '0'), "-").concat(String(m[2]).padStart(2, '0'));
  };
  var isoToDisplay = function isoToDisplay(iso) {
    if (!iso) return '';
    var m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return iso;
    return "".concat(MONTHS[parseInt(m[2], 10) - 1], " ").concat(parseInt(m[3], 10));
  };
  var _React$useState63 = React.useState(null),
    _React$useState64 = _slicedToArray(_React$useState63, 2),
    pickerOpen = _React$useState64[0],
    setPickerOpen = _React$useState64[1]; // {key, type}

  var field = function field(key, label, placeholder) {
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'text';
    var isDate = type === 'date';
    var isTime = type === 'time';
    var shown = isDate ? draft[key] ? draft[key] : '' : draft[key] || '';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9.5,
        color: COLORS.mute,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: 4
      }
    }, label), isDate || isTime ? /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return setPickerOpen({
          key: key,
          type: type
        });
      },
      style: {
        width: '100%',
        padding: '10px 12px',
        borderRadius: 8,
        border: "1px solid ".concat(COLORS.line),
        background: COLORS.card,
        cursor: 'pointer',
        fontFamily: SANS,
        fontSize: 13,
        color: shown ? COLORS.ink : COLORS.mute,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'left',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("span", null, shown || placeholder), /*#__PURE__*/React.createElement(Icon, {
      name: isDate ? 'book' : 'clock',
      size: 13,
      color: COLORS.mute,
      stroke: 1.8
    })) : /*#__PURE__*/React.createElement("input", {
      value: draft[key] || '',
      onChange: function onChange(e) {
        return setDraft(_objectSpread(_objectSpread({}, draft), {}, _defineProperty({}, key, e.target.value)));
      },
      placeholder: placeholder,
      style: {
        width: '100%',
        padding: '9px 11px',
        borderRadius: 8,
        border: "1px solid ".concat(COLORS.line),
        background: COLORS.card,
        fontFamily: SANS,
        fontSize: 13,
        color: COLORS.ink,
        boxSizing: 'border-box'
      }
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      minHeight: '100%',
      paddingBottom: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 'calc(-1 * env(safe-area-inset-top, 0px))'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    hue: draft.hue || 25,
    label: (draft.name || '').toUpperCase().slice(0, 20),
    height: "calc(240px + env(safe-area-inset-top, 0px))"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 180,
      background: 'linear-gradient(180deg, rgba(0,0,0,0.28), transparent)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      position: 'absolute',
      top: 'calc(16px + env(safe-area-inset-top, 0px))',
      left: 16,
      zIndex: 5,
      width: 38,
      height: 38,
      borderRadius: 19,
      border: 'none',
      background: 'rgba(255,255,255,0.88)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-l",
    size: 18,
    color: COLORS.ink,
    stroke: 2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(16px + env(safe-area-inset-top, 0px))',
      right: 16,
      zIndex: 5,
      display: 'flex',
      gap: 8
    }
  }, editing && /*#__PURE__*/React.createElement("button", {
    onClick: onOpenSearch,
    style: {
      border: 'none',
      background: COLORS.ink,
      color: '#fff',
      borderRadius: 14,
      padding: '6px 12px',
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 11.5,
      fontWeight: 500,
      display: 'flex',
      gap: 5,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 12,
    color: "#fff",
    stroke: 2
  }), "\uAC80\uC0C9"), editing ? /*#__PURE__*/React.createElement("button", {
    onClick: save,
    style: {
      border: 'none',
      background: COLORS.accent,
      color: '#fff',
      borderRadius: 14,
      padding: '6px 12px',
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 11.5,
      fontWeight: 500,
      display: 'flex',
      gap: 5,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "save",
    size: 12,
    color: "#fff",
    stroke: 2
  }), " \uC800\uC7A5") : /*#__PURE__*/React.createElement(EditBtn, {
    editing: false,
    onClick: function onClick() {
      return setEditing(true);
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 20px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.accent,
      letterSpacing: '0.14em'
    }
  }, "HOTEL \xB7 ", draft.nights || '—', "\uBC15"), editing ? /*#__PURE__*/React.createElement("input", {
    value: draft.name,
    onChange: function onChange(e) {
      return setDraft(_objectSpread(_objectSpread({}, draft), {}, {
        name: e.target.value
      }));
    },
    style: {
      marginTop: 6,
      width: '100%',
      fontFamily: SERIF,
      fontSize: 30,
      lineHeight: 1.08,
      color: COLORS.ink,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      padding: 0
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: SERIF,
      fontSize: 30,
      lineHeight: 1.08,
      color: COLORS.ink
    }
  }, draft.name), draft.area && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute,
      display: 'flex',
      gap: 5,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin",
    size: 12,
    stroke: 1.8
  }), " ", draft.area, draft.rating && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.4
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "\u2605 ", draft.rating)))), editing ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 14,
      padding: '14px 16px'
    }
  }, field('area', '지역'), field('address', '주소'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, field('checkin', '체크인 날짜', 'May 4', 'date'), field('checkout', '체크아웃 날짜', 'May 13', 'date')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, field('checkinTime', '체크인 시간', '15:00', 'time'), field('checkoutTime', '체크아웃 시간', '12:00', 'time')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, field('nights', '박', '9'), field('price', '요금')), field('phone', '전화'), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginBottom: 4
    }
  }, "\uBA54\uBAA8"), /*#__PURE__*/React.createElement("textarea", {
    value: draft.note || '',
    onChange: function onChange(e) {
      return setDraft(_objectSpread(_objectSpread({}, draft), {}, {
        note: e.target.value
      }));
    },
    rows: 3,
    style: {
      width: '100%',
      padding: '9px 11px',
      borderRadius: 8,
      border: "1px solid ".concat(COLORS.line),
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink,
      boxSizing: 'border-box',
      resize: 'vertical'
    }
  })))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 14,
      overflow: 'hidden'
    }
  }, [{
    icon: 'clock',
    label: '기간',
    value: "".concat(draft.checkin || '—').concat(draft.checkinTime ? ' ' + draft.checkinTime : '', " \u2192 ").concat(draft.checkout || '—').concat(draft.checkoutTime ? ' ' + draft.checkoutTime : '').concat(draft.nights ? " \xB7 ".concat(draft.nights, "\uBC15") : '')
  }, draft.address && {
    icon: 'pin',
    label: '주소',
    value: draft.address
  }, draft.phone && {
    icon: 'phone',
    label: '전화',
    value: draft.phone
  }, draft.price && {
    icon: 'book',
    label: '요금',
    value: draft.price
  }, draft.confirmation && {
    icon: 'save',
    label: '예약번호',
    value: draft.confirmation
  }].filter(Boolean).map(function (r, i, arr) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        padding: '13px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        borderBottom: i < arr.length - 1 ? "1px solid ".concat(COLORS.line) : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        paddingTop: 2
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: r.icon,
      size: 15,
      color: COLORS.mute,
      stroke: 1.8
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9.5,
        color: COLORS.mute,
        letterSpacing: '0.12em',
        textTransform: 'uppercase'
      }
    }, r.label), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 2,
        fontFamily: SANS,
        fontSize: 13.5,
        color: COLORS.ink,
        lineHeight: 1.45
      }
    }, r.value)));
  }))), draft.amenities && draft.amenities.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.mute,
      letterSpacing: '0.12em'
    }
  }, "\uC2DC\uC124"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, draft.amenities.map(function (a, i) {
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        padding: '6px 10px',
        borderRadius: 8,
        background: COLORS.card,
        fontFamily: SANS,
        fontSize: 12,
        color: COLORS.ink
      }
    }, a);
  }))), draft.note && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.softer,
      borderRadius: 12,
      padding: '14px 16px',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute,
      lineHeight: 1.5
    }
  }, draft.note)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 0',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return window.open(mapsDirectionsUrl(addr), '_blank');
    },
    style: {
      flex: 1,
      background: COLORS.ink,
      color: COLORS.bg,
      border: 'none',
      borderRadius: 12,
      padding: '13px',
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 14,
      fontWeight: 500,
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "nav",
    size: 14,
    color: COLORS.bg,
    stroke: 1.8
  }), " \uAE38\uCC3E\uAE30"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return window.open(mapsSearchUrl(addr), '_blank');
    },
    style: {
      width: 60,
      background: COLORS.card,
      border: "1px solid ".concat(COLORS.line),
      borderRadius: 12,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map",
    size: 16,
    color: COLORS.ink,
    stroke: 1.8
  })))), /*#__PURE__*/React.createElement(DatePickerSheet, {
    open: !!pickerOpen && pickerOpen.type === 'date',
    value: pickerOpen ? dateToIso(draft[pickerOpen.key]) : '',
    minDate: pickerOpen && pickerOpen.key === 'checkout' ? dateToIso(draft.checkin) : null,
    title: pickerOpen && pickerOpen.key === 'checkin' ? '체크인 날짜' : '체크아웃 날짜',
    onPick: function onPick(iso) {
      return setDraft(_objectSpread(_objectSpread({}, draft), {}, _defineProperty({}, pickerOpen.key, isoToDisplay(iso))));
    },
    onClose: function onClose() {
      return setPickerOpen(null);
    }
  }), /*#__PURE__*/React.createElement(TimeWheelSheet, {
    open: !!pickerOpen && pickerOpen.type === 'time',
    value: pickerOpen ? draft[pickerOpen.key] || '' : '',
    title: pickerOpen && pickerOpen.key === 'checkinTime' ? '체크인 시간' : '체크아웃 시간',
    onPick: function onPick(t) {
      return setDraft(_objectSpread(_objectSpread({}, draft), {}, _defineProperty({}, pickerOpen.key, t)));
    },
    onClose: function onClose() {
      return setPickerOpen(null);
    }
  }));
}

// ─── Stop sheet (unchanged except pulls editing from open) ─
function StopSheet(_ref21) {
  var open = _ref21.open,
    dayHue = _ref21.dayHue,
    onClose = _ref21.onClose,
    onSave = _ref21.onSave;
  if (!open) return null;
  var _React$useState65 = React.useState(!!open.editing),
    _React$useState66 = _slicedToArray(_React$useState65, 2),
    editing = _React$useState66[0],
    setEditing = _React$useState66[1];
  var _React$useState67 = React.useState(open.stop),
    _React$useState68 = _slicedToArray(_React$useState67, 2),
    draft = _React$useState68[0],
    setDraft = _React$useState68[1];
  var _React$useState69 = React.useState(0),
    _React$useState70 = _slicedToArray(_React$useState69, 2),
    sheetY = _React$useState70[0],
    setSheetY = _React$useState70[1];
  var sheetTouchStart = React.useRef(null);
  var sheetScrollTop = React.useRef(0);
  var sheetRef = React.useRef(null);
  React.useEffect(function () {
    setDraft(open.stop);
    setSheetY(0);
    setEditing(!!open.editing);
  }, [open]);

  // 배경 스크롤 잠금
  React.useEffect(function () {
    var prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return function () {
      document.body.style.overflow = prev;
    };
  }, []);
  var searchQuery = [draft.title, draft.en, draft.loc, 'New York'].filter(Boolean).join(' ');

  // 드래그로 닫기 — 시트 스크롤이 최상단일 때만 동작
  var onDragStart = function onDragStart(e) {
    sheetScrollTop.current = sheetRef.current ? sheetRef.current.scrollTop : 0;
    sheetTouchStart.current = e.touches[0].clientY;
  };
  var onDragMove = function onDragMove(e) {
    if (sheetTouchStart.current === null) return;
    if (sheetScrollTop.current > 8) {
      sheetTouchStart.current = null;
      return;
    }
    var dy = e.touches[0].clientY - sheetTouchStart.current;
    if (dy > 0) {
      e.preventDefault();
      setSheetY(dy);
    }
  };
  var onDragEnd = function onDragEnd() {
    if (sheetY > 100) onClose();else setSheetY(0);
    sheetTouchStart.current = null;
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      background: "rgba(0,0,0,".concat(Math.max(0, 0.35 - sheetY / 400), ")")
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    ref: sheetRef,
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    style: {
      background: COLORS.bg,
      borderRadius: '22px 22px 0 0',
      paddingBottom: 40,
      maxHeight: '92%',
      overflowY: 'auto',
      overflowX: 'hidden',
      transform: "translateY(".concat(sheetY, "px)"),
      transition: sheetY === 0 ? 'transform 0.32s cubic-bezier(0.32,0.72,0,1)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 0 6px',
      cursor: 'grab',
      touchAction: 'none'
    },
    onTouchStart: onDragStart,
    onTouchMove: onDragMove,
    onTouchEnd: onDragEnd
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      background: COLORS.line,
      borderRadius: 2
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      touchAction: 'none'
    },
    onTouchStart: onDragStart,
    onTouchMove: onDragMove,
    onTouchEnd: onDragEnd
  }, /*#__PURE__*/React.createElement(Photo, {
    hue: dayHue,
    label: (draft.en || '').toUpperCase(),
    height: 180
  }), !editing && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      e.stopPropagation();
      setEditing(true);
    },
    style: {
      position: 'absolute',
      top: 12,
      right: 12,
      zIndex: 5,
      border: 'none',
      background: 'rgba(255,255,255,0.92)',
      borderRadius: 14,
      padding: '7px 13px',
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 12,
      fontWeight: 500,
      color: COLORS.ink,
      display: 'flex',
      gap: 5,
      alignItems: 'center',
      boxShadow: '0 1px 6px rgba(0,0,0,0.12)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 12,
    color: COLORS.ink,
    stroke: 2
  }), " \uC218\uC815")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.mute,
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: (CAT_META[draft.cat] || {
      icon: 'pin'
    }).icon,
    size: 12,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("span", null, (CAT_META[draft.cat] || {
    label: draft.cat
  }).label), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.4
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, draft.time)), editing ? /*#__PURE__*/React.createElement(EditStopForm, {
    draft: draft,
    setDraft: setDraft
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: SERIF,
      fontSize: 28,
      lineHeight: 1.12,
      color: COLORS.ink
    }
  }, draft.title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontFamily: SANS,
      fontSize: 13.5,
      color: COLORS.mute,
      fontStyle: 'italic'
    }
  }, draft.en), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'column'
    }
  }, [draft.loc && {
    icon: 'pin',
    label: '위치',
    value: draft.loc
  }, {
    icon: 'clock',
    label: '시간',
    value: draft.time + (draft.duration ? " \xB7 ".concat(draft.duration) : '')
  }, draft.note && {
    icon: 'book',
    label: '메모',
    value: draft.note
  }].filter(Boolean).map(function (r, i, arr) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: COLORS.card,
        padding: '13px 16px',
        borderTopLeftRadius: i === 0 ? 12 : 0,
        borderTopRightRadius: i === 0 ? 12 : 0,
        borderBottomLeftRadius: i === arr.length - 1 ? 12 : 0,
        borderBottomRightRadius: i === arr.length - 1 ? 12 : 0,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        borderBottom: i < arr.length - 1 ? "1px solid ".concat(COLORS.line) : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        paddingTop: 2
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: r.icon,
      size: 15,
      color: COLORS.mute,
      stroke: 1.8
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9.5,
        color: COLORS.mute,
        letterSpacing: '0.12em',
        textTransform: 'uppercase'
      }
    }, r.label), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 2,
        fontFamily: SANS,
        fontSize: 13.5,
        color: COLORS.ink,
        lineHeight: 1.45,
        whiteSpace: 'pre-wrap'
      }
    }, r.value)));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: 'flex',
      gap: 8
    }
  }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      onSave(draft);
      setEditing(false);
    },
    style: {
      flex: 1,
      background: COLORS.ink,
      color: COLORS.bg,
      border: 'none',
      borderRadius: 12,
      padding: '13px',
      fontFamily: SANS,
      fontSize: 14,
      fontWeight: 500,
      cursor: 'pointer',
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "save",
    size: 14,
    color: COLORS.bg,
    stroke: 1.8
  }), " \uC800\uC7A5"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setEditing(false);
    },
    style: {
      width: 80,
      background: COLORS.card,
      border: "1px solid ".concat(COLORS.line),
      borderRadius: 12,
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink
    }
  }, "\uCDE8\uC18C")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return window.open(mapsDirectionsUrl(searchQuery), '_blank');
    },
    style: {
      flex: 1,
      background: COLORS.ink,
      color: COLORS.bg,
      border: 'none',
      borderRadius: 12,
      padding: '13px',
      fontFamily: SANS,
      fontSize: 14,
      fontWeight: 500,
      cursor: 'pointer',
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "nav",
    size: 14,
    color: COLORS.bg,
    stroke: 1.8
  }), " \uAE38\uCC3E\uAE30"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return window.open(mapsSearchUrl(searchQuery), '_blank');
    },
    style: {
      width: 60,
      background: COLORS.card,
      border: "1px solid ".concat(COLORS.line),
      borderRadius: 12,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map",
    size: 16,
    color: COLORS.ink,
    stroke: 1.8
  })))))));
}
function EditStopForm(_ref22) {
  var draft = _ref22.draft,
    setDraft = _ref22.setDraft;
  var _React$useState71 = React.useState(false),
    _React$useState72 = _slicedToArray(_React$useState71, 2),
    showHotelSearch = _React$useState72[0],
    setShowHotelSearch = _React$useState72[1];
  var field = function field(key, label) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'text';
    return /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9.5,
        color: COLORS.mute,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: 4
      }
    }, label), type === 'textarea' ? /*#__PURE__*/React.createElement("textarea", {
      value: draft[key] || '',
      onChange: function onChange(e) {
        return setDraft(_objectSpread(_objectSpread({}, draft), {}, _defineProperty({}, key, e.target.value)));
      },
      rows: 3,
      style: {
        width: '100%',
        padding: '8px 10px',
        borderRadius: 8,
        border: "1px solid ".concat(COLORS.line),
        background: COLORS.card,
        fontFamily: SANS,
        fontSize: 13,
        color: COLORS.ink,
        boxSizing: 'border-box',
        resize: 'vertical'
      }
    }) : type === 'select' ? /*#__PURE__*/React.createElement("select", {
      value: draft[key] || 'sight',
      onChange: function onChange(e) {
        return setDraft(_objectSpread(_objectSpread({}, draft), {}, _defineProperty({}, key, e.target.value)));
      },
      style: {
        width: '100%',
        padding: '8px 10px',
        borderRadius: 8,
        border: "1px solid ".concat(COLORS.line),
        background: COLORS.card,
        fontFamily: SANS,
        fontSize: 13,
        color: COLORS.ink,
        boxSizing: 'border-box'
      }
    }, Object.entries(CAT_META).map(function (_ref23) {
      var _ref24 = _slicedToArray(_ref23, 2),
        k = _ref24[0],
        v = _ref24[1];
      return /*#__PURE__*/React.createElement("option", {
        key: k,
        value: k
      }, v.label);
    })) : /*#__PURE__*/React.createElement("input", {
      value: draft[key] || '',
      onChange: function onChange(e) {
        return setDraft(_objectSpread(_objectSpread({}, draft), {}, _defineProperty({}, key, e.target.value)));
      },
      style: {
        width: '100%',
        padding: '8px 10px',
        borderRadius: 8,
        border: "1px solid ".concat(COLORS.line),
        background: COLORS.card,
        fontFamily: SANS,
        fontSize: 13,
        color: COLORS.ink,
        boxSizing: 'border-box'
      }
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, field('title', '제목'), field('en', '영문명'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, field('time', '시간'), field('cat', '카테고리', 'select')), draft.cat === 'hotel' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return setShowHotelSearch(true);
    },
    style: {
      marginTop: 10,
      width: '100%',
      border: 'none',
      cursor: 'pointer',
      background: COLORS.ink,
      color: COLORS.bg,
      borderRadius: 10,
      padding: '11px',
      fontFamily: SANS,
      fontSize: 13,
      fontWeight: 500,
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 13,
    color: COLORS.bg,
    stroke: 2
  }), "\uD638\uD154 \uAC80\uC0C9\uD574\uC11C \uCC44\uC6B0\uAE30"), field('loc', '위치'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, field('duration', '소요 시간'), field('price', '가격')), field('note', '메모', 'textarea'), showHotelSearch && /*#__PURE__*/React.createElement(HotelSearchSheet, {
    COLORS: COLORS,
    SERIF: SERIF,
    SANS: SANS,
    MONO: MONO,
    Icon: Icon,
    onPick: function onPick(name) {
      var m = name.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
      var hotelName = m ? m[1] : name;
      var area = m ? m[2] : '';
      setDraft(_objectSpread(_objectSpread({}, draft), {}, {
        title: hotelName,
        en: hotelName,
        loc: area
      }));
    },
    onClose: function onClose() {
      return setShowHotelSearch(false);
    }
  }));
}

// ─── Map ────────────────────────────────────────────────────
function MapScreen(_ref25) {
  var trip = _ref25.trip;
  var _React$useState73 = React.useState(0),
    _React$useState74 = _slicedToArray(_React$useState73, 2),
    selectedDay = _React$useState74[0],
    setSelectedDay = _React$useState74[1];
  var day = trip.days[selectedDay];
  var places = day.items.filter(function (it) {
    return it.loc;
  }).map(function (it) {
    return "".concat(it.title, " ").concat(it.loc || '').trim();
  });
  var query = (places[0] || day.titleEn || 'New York') + ', New York';
  var embedUrl = "https://www.google.com/maps?q=".concat(encodeURIComponent(query), "&output=embed");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      minHeight: '100%',
      paddingBottom: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
      paddingLeft: 24,
      paddingRight: 24,
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      color: COLORS.mute,
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    }
  }, "Map"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: SERIF,
      fontSize: 38,
      color: COLORS.ink,
      letterSpacing: '-0.02em'
    }
  }, "Google Maps.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 16px 12px',
      overflowX: 'auto',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 6
    }
  }, trip.days.map(function (d, i) {
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: function onClick() {
        return setSelectedDay(i);
      },
      style: {
        border: 'none',
        borderRadius: 14,
        padding: '8px 14px',
        cursor: 'pointer',
        background: i === selectedDay ? COLORS.ink : COLORS.card,
        color: i === selectedDay ? COLORS.bg : COLORS.ink,
        fontFamily: MONO,
        fontSize: 11,
        letterSpacing: '0.08em'
      }
    }, "D", String(d.n).padStart(2, '0'));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 18,
      overflow: 'hidden',
      border: "1px solid ".concat(COLORS.line)
    }
  }, /*#__PURE__*/React.createElement("iframe", {
    key: query,
    src: embedUrl,
    style: {
      width: '100%',
      height: 340,
      border: 'none',
      display: 'block'
    },
    loading: "lazy",
    referrerPolicy: "no-referrer-when-downgrade",
    title: "Google Maps"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 24px 6px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 20,
      color: COLORS.ink
    }
  }, "Day ", String(day.n).padStart(2, '0'), " \xB7 ", day.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, day.items.filter(function (it) {
    return it.loc;
  }).map(function (it, i) {
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: function onClick() {
        return window.open(mapsDirectionsUrl("".concat(it.title, " ").concat(it.loc, " New York")), '_blank');
      },
      style: {
        background: COLORS.card,
        borderRadius: 12,
        padding: '11px 14px',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        cursor: 'pointer',
        border: 'none',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 14,
      color: COLORS.accent,
      stroke: 2
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 13,
        color: COLORS.ink,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, it.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 11,
        color: COLORS.mute,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, it.loc)), /*#__PURE__*/React.createElement(Icon, {
      name: "nav",
      size: 14,
      color: COLORS.mute,
      stroke: 1.8
    }));
  })));
}

// ─── Food ───────────────────────────────────────────────────
function FoodScreen(_ref26) {
  var trip = _ref26.trip,
    onEditFood = _ref26.onEditFood,
    editing = _ref26.editing,
    setEditing = _ref26.setEditing;
  var grouped = {};
  (trip.food || []).forEach(function (f, idx) {
    (grouped[f.cat] = grouped[f.cat] || []).push(_objectSpread(_objectSpread({}, f), {}, {
      idx: idx
    }));
  });
  var addFood = function addFood() {
    var list = [].concat(_toConsumableArray(trip.food || []), [{
      cat: '🍕 New',
      name: '새 맛집',
      detail: '',
      price: '',
      note: ''
    }]);
    onEditFood(list);
  };
  var delFood = function delFood(idx) {
    if (!confirm('이 맛집을 삭제할까요?')) return;
    onEditFood((trip.food || []).filter(function (_, i) {
      return i !== idx;
    }));
  };
  var updateFood = function updateFood(idx, patch) {
    var list = _toConsumableArray(trip.food || []);
    list[idx] = _objectSpread(_objectSpread({}, list[idx]), patch);
    onEditFood(list);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      minHeight: '100%',
      paddingBottom: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
      paddingLeft: 24,
      paddingRight: 24,
      paddingBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      color: COLORS.mute,
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    }
  }, "Food Guide"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: SERIF,
      fontSize: 38,
      color: COLORS.ink,
      letterSpacing: '-0.02em'
    }
  }, "\uBA39\uC5B4\uBCFC \uAC83.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, Object.entries(grouped).map(function (_ref27) {
    var _ref28 = _slicedToArray(_ref27, 2),
      cat = _ref28[0],
      items = _ref28[1];
    return /*#__PURE__*/React.createElement("div", {
      key: cat
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 4px 8px',
        fontFamily: MONO,
        fontSize: 11,
        color: COLORS.mute,
        letterSpacing: '0.08em'
      }
    }, cat), /*#__PURE__*/React.createElement("div", {
      style: {
        background: COLORS.card,
        borderRadius: 14,
        overflow: 'hidden'
      }
    }, items.map(function (f, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: f.idx,
        style: {
          padding: '12px 14px',
          position: 'relative',
          borderBottom: i < items.length - 1 ? "1px solid ".concat(COLORS.line) : 'none'
        }
      }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
        value: f.name,
        onChange: function onChange(e) {
          return updateFood(f.idx, {
            name: e.target.value
          });
        },
        style: {
          width: '100%',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: SANS,
          fontSize: 14,
          fontWeight: 500,
          color: COLORS.ink,
          padding: 0
        }
      }), /*#__PURE__*/React.createElement("input", {
        value: f.detail,
        onChange: function onChange(e) {
          return updateFood(f.idx, {
            detail: e.target.value
          });
        },
        placeholder: "\uC0C1\uC138",
        style: {
          width: '100%',
          marginTop: 3,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: SANS,
          fontSize: 12,
          color: COLORS.mute,
          padding: 0
        }
      }), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          return delFood(f.idx);
        },
        style: {
          position: 'absolute',
          top: 8,
          right: 8,
          width: 24,
          height: 24,
          borderRadius: 12,
          border: 'none',
          background: 'rgba(193,79,46,0.12)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "trash",
        size: 11,
        color: COLORS.accent,
        stroke: 2
      }))) : /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          return window.open(mapsSearchUrl("".concat(f.name, " New York")), '_blank');
        },
        style: {
          width: '100%',
          padding: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          textAlign: 'left'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontSize: 14,
          color: COLORS.ink,
          fontWeight: 500
        }
      }, f.name), f.price && /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: MONO,
          fontSize: 10.5,
          color: COLORS.accent,
          flexShrink: 0
        }
      }, f.price)), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 3,
          fontFamily: SANS,
          fontSize: 12,
          color: COLORS.mute,
          lineHeight: 1.4
        }
      }, f.detail), f.note && /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 4,
          fontFamily: SANS,
          fontSize: 11,
          color: COLORS.mute,
          fontStyle: 'italic',
          opacity: 0.8
        }
      }, "\u2014 ", f.note)));
    })));
  }), editing && /*#__PURE__*/React.createElement("button", {
    onClick: addFood,
    style: {
      padding: '14px 12px',
      background: 'transparent',
      border: "1.5px dashed ".concat(COLORS.line),
      borderRadius: 14,
      color: COLORS.mute,
      cursor: 'pointer',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: SANS,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    color: COLORS.mute,
    stroke: 2
  }), " \uB9DB\uC9D1 \uCD94\uAC00")));
}

// ─── Prep (editable lists) ─────────────────────────────────
function PrepScreen(_ref29) {
  var _trip$days$, _trip$days;
  var trip = _ref29.trip,
    prepProp = _ref29.prep,
    onEditPrep = _ref29.onEditPrep,
    editing = _ref29.editing,
    setEditing = _ref29.setEditing;
  var totalStops = trip.days.reduce(function (s, d) {
    return s + d.items.length;
  }, 0);
  var prep = prepProp || trip.prep || {
    checklist: [],
    docs: [],
    pack: []
  };

  // ── D-day 계산 ─────────────────────────────────────────────
  var tripYear = extractTripYear(trip);
  var firstDate = ((_trip$days$ = trip.days[0]) === null || _trip$days$ === void 0 ? void 0 : _trip$days$.date) || '';
  var lastDate = ((_trip$days = trip.days[trip.days.length - 1]) === null || _trip$days === void 0 ? void 0 : _trip$days.date) || '';
  var parseDate = function parseDate(s) {
    if (!s) return null;
    var iso = dayDateToIso(s, tripYear);
    if (!iso) return null;
    return new Date(iso + 'T12:00:00');
  };
  var depDate = parseDate(firstDate);
  var retDate = parseDate(lastDate);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var ddayLabel = '',
    ddayColor = COLORS.ink;
  if (depDate) {
    depDate.setHours(0, 0, 0, 0);
    if (retDate) retDate.setHours(0, 0, 0, 0);
    var diff = Math.round((depDate - today) / 86400000);
    if (diff > 0) {
      ddayLabel = "D-".concat(diff);
      ddayColor = COLORS.accent;
    } else if (retDate && today <= retDate) {
      ddayLabel = "\uC5EC\uD589 \uC911 \u2708\uFE0F";
      ddayColor = '#2E7D32';
    } else {
      ddayLabel = "D+".concat(Math.abs(diff));
      ddayColor = COLORS.mute;
    }
  }
  var Section = function Section(_ref30) {
    var sectionKey = _ref30.sectionKey,
      title = _ref30.title;
    var items = prep[sectionKey] || [];
    var _useDragReorder4 = useDragReorder(function (from, to) {
        var list = _toConsumableArray(items);
        var _list$splice = list.splice(from, 1),
          _list$splice2 = _slicedToArray(_list$splice, 1),
          m = _list$splice2[0];
        list.splice(to, 0, m);
        onEditPrep(_objectSpread(_objectSpread({}, prep), {}, _defineProperty({}, sectionKey, list)));
      }, editing),
      itemProps = _useDragReorder4.itemProps;
    var update = function update(i, v) {
      var list = _toConsumableArray(items);
      list[i] = v;
      onEditPrep(_objectSpread(_objectSpread({}, prep), {}, _defineProperty({}, sectionKey, list)));
    };
    var del = function del(i) {
      return onEditPrep(_objectSpread(_objectSpread({}, prep), {}, _defineProperty({}, sectionKey, items.filter(function (_, j) {
        return j !== i;
      }))));
    };
    var add = function add() {
      return onEditPrep(_objectSpread(_objectSpread({}, prep), {}, _defineProperty({}, sectionKey, [].concat(_toConsumableArray(items), ['새 항목']))));
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 16px',
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 4px 8px',
        fontFamily: MONO,
        fontSize: 10,
        color: COLORS.mute,
        letterSpacing: '0.12em',
        textTransform: 'uppercase'
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        background: COLORS.card,
        borderRadius: 14,
        overflow: 'hidden'
      }
    }, items.map(function (t, i) {
      var dp = itemProps(i);
      return /*#__PURE__*/React.createElement("div", _extends({
        key: i
      }, dp, {
        style: _objectSpread(_objectSpread({
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 14px',
          borderBottom: i < items.length - 1 ? "1px solid ".concat(COLORS.line) : 'none'
        }, dp.style || {}), {}, {
          outline: dp['data-drag-over'] ? "2px solid ".concat(COLORS.accent) : 'none',
          outlineOffset: -2
        })
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 16,
          height: 16,
          borderRadius: 8,
          border: "1.5px solid ".concat(COLORS.ink),
          flexShrink: 0
        }
      }), editing ? /*#__PURE__*/React.createElement("input", {
        value: t,
        onChange: function onChange(e) {
          return update(i, e.target.value);
        },
        style: {
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: SANS,
          fontSize: 13.5,
          color: COLORS.ink,
          padding: 0
        }
      }) : /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1,
          fontFamily: SANS,
          fontSize: 13.5,
          color: COLORS.ink
        }
      }, t), editing && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DragHandle, {
        size: 13,
        color: COLORS.mute
      }), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          return del(i);
        },
        style: {
          width: 22,
          height: 22,
          borderRadius: 11,
          border: 'none',
          background: 'rgba(193,79,46,0.12)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "trash",
        size: 11,
        color: COLORS.accent,
        stroke: 2
      }))));
    })), editing && /*#__PURE__*/React.createElement("button", {
      onClick: add,
      style: {
        marginTop: 6,
        padding: '10px 12px',
        background: 'transparent',
        border: "1.5px dashed ".concat(COLORS.line),
        borderRadius: 12,
        color: COLORS.mute,
        cursor: 'pointer',
        width: '100%',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 12,
      color: COLORS.mute,
      stroke: 2
    }), " \uD56D\uBAA9 \uCD94\uAC00"));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      minHeight: '100%',
      paddingBottom: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
      paddingLeft: 24,
      paddingRight: 24,
      paddingBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      color: COLORS.mute,
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    }
  }, "Preparation"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: SERIF,
      fontSize: 38,
      color: COLORS.ink,
      letterSpacing: '-0.02em'
    }
  }, "\uCD9C\uBC1C \uC900\uBE44.")), depDate && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 16,
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 4
    }
  }, "\uC5EC\uD589 \uAE30\uAC04"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 13.5,
      color: COLORS.ink,
      fontWeight: 500
    }
  }, firstDate, lastDate && lastDate !== firstDate ? " \u2013 ".concat(lastDate) : ''), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      color: COLORS.mute,
      marginTop: 3
    }
  }, trip.days.length, "\uBC15 ", trip.days.length, "\uC77C")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 4
    }
  }, "D-DAY"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 32,
      color: ddayColor,
      letterSpacing: '-0.02em',
      lineHeight: 1
    }
  }, ddayLabel)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 8
    }
  }, [{
    v: trip.days.length,
    l: 'Days'
  }, {
    v: totalStops,
    l: 'Stops'
  }, {
    v: (trip.food || []).length,
    l: 'Eats'
  }].map(function (s, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: COLORS.card,
        borderRadius: 12,
        padding: '14px 10px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SERIF,
        fontSize: 28,
        color: COLORS.ink
      }
    }, s.v), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9.5,
        color: COLORS.mute,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginTop: 2
      }
    }, s.l));
  })), /*#__PURE__*/React.createElement(Section, {
    sectionKey: "checklist",
    title: "\uCCB4\uD06C\uB9AC\uC2A4\uD2B8"
  }), /*#__PURE__*/React.createElement(Section, {
    sectionKey: "docs",
    title: "\uC785\uAD6D \uC11C\uB958"
  }), /*#__PURE__*/React.createElement(Section, {
    sectionKey: "pack",
    title: "\uCC59\uAE38 \uBB3C\uAC74"
  }));
}

// ─── Tab bar (no edit toggle) ──────────────────────────────
function TabBar(_ref31) {
  var tab = _ref31.tab,
    setTab = _ref31.setTab,
    visible = _ref31.visible,
    editing = _ref31.editing,
    onToggleEdit = _ref31.onToggleEdit;
  var tabs = [{
    id: 'home',
    icon: 'sight',
    label: '일정'
  }, {
    id: 'map',
    icon: 'map',
    label: '지도'
  }, {
    id: 'food',
    icon: 'food',
    label: '맛집'
  }, {
    id: 'prep',
    icon: 'user',
    label: '준비'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      left: 14,
      right: 14,
      bottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 30,
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: 26,
      padding: '9px 10px 11px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04), 0 10px 30px rgba(0,0,0,0.08)',
      border: "0.5px solid ".concat(COLORS.line),
      display: 'flex',
      gap: 2,
      alignItems: 'center',
      transition: 'opacity 0.25s ease',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none'
    }
  }, tabs.map(function (t) {
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: function onClick() {
        return setTab(t.id);
      },
      style: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '6px 4px',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 20,
      color: tab === t.id ? COLORS.ink : COLORS.mute,
      stroke: tab === t.id ? 2 : 1.7
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 10,
        fontWeight: tab === t.id ? 600 : 400,
        color: tab === t.id ? COLORS.ink : COLORS.mute
      }
    }, t.label));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '0.5px',
      height: 28,
      background: COLORS.line,
      margin: '0 2px'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onToggleEdit,
    style: {
      width: 40,
      height: 40,
      borderRadius: 20,
      border: 'none',
      cursor: 'pointer',
      background: editing ? COLORS.accent : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: editing ? 'check' : 'edit',
    size: 17,
    color: editing ? '#fff' : COLORS.mute,
    stroke: 1.8
  })));
}

// ─── APP ───────────────────────────────────────────────────
var NAV_KEY = 'nav_state';
function loadNav() {
  try {
    var s = sessionStorage.getItem(NAV_KEY);
    return s ? JSON.parse(s) : {};
  } catch (e) {
    return {};
  }
}
function saveNav(state) {
  try {
    sessionStorage.setItem(NAV_KEY, JSON.stringify(state));
  } catch (e) {}
}

// ─── Splash Screen (로그인 후 로딩 중 표시) ──────────────────
var SPLASH_PLACES = ['✈ New York', '🗼 Paris', '🗾 Tokyo', '🌉 San Francisco', '🏝 Bali', '🎡 London'];
function SplashScreen(_ref32) {
  var visible = _ref32.visible;
  var _React$useState75 = React.useState(0),
    _React$useState76 = _slicedToArray(_React$useState75, 2),
    idx = _React$useState76[0],
    setIdx = _React$useState76[1];
  var _React$useState77 = React.useState(0),
    _React$useState78 = _slicedToArray(_React$useState77, 2),
    animKey = _React$useState78[0],
    setAnimKey = _React$useState78[1];
  var _React$useState79 = React.useState(false),
    _React$useState80 = _slicedToArray(_React$useState79, 2),
    hiding = _React$useState80[0],
    setHiding = _React$useState80[1];
  React.useEffect(function () {
    var t = setInterval(function () {
      setIdx(function (i) {
        return (i + 1) % SPLASH_PLACES.length;
      });
      setAnimKey(function (k) {
        return k + 1;
      });
    }, 700);
    return function () {
      return clearInterval(t);
    };
  }, []);
  React.useEffect(function () {
    if (!visible) setHiding(true);
  }, [visible]);
  if (!visible && !hiding) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: '#F5F2EC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      opacity: hiding ? 0 : 1,
      transition: hiding ? 'opacity 0.3s ease' : 'none'
    },
    onTransitionEnd: function onTransitionEnd() {
      return setHiding(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Instrument Serif',Georgia,serif",
      fontSize: 34,
      color: '#1A1816',
      letterSpacing: '-0.5px',
      animation: 'splashIn 0.5s ease both'
    }
  }, "Trip Like J"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      height: 22,
      overflow: 'hidden',
      fontFamily: '-apple-system,sans-serif',
      fontSize: 13,
      color: '#7A756D',
      letterSpacing: '0.04em',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    key: animKey,
    style: {
      display: 'block',
      animation: 'destSlide 0.45s cubic-bezier(0.22,1,0.36,1) both'
    }
  }, SPLASH_PLACES[idx])), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: 2,
      background: '#C14F2E',
      animation: 'barGrow 2.2s cubic-bezier(0.4,0,0.2,1) forwards',
      borderRadius: '0 2px 2px 0'
    }
  }));
}

// ─── Takeoff Icon ─────────────────────────────────────────────
// 비행기 동체 (땅선 제외)
var PLANE_BODY = 'M22.07 9.64c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 2.59 4.49L21 11.67c.81-.23 1.28-1.05 1.07-1.85z';
function TakeoffIcon() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 72,
      height: 72,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      width: 72,
      height: 72,
      borderRadius: 18,
      background: COLORS.accent,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transformOrigin: 'center center',
      animation: 'runwaySpring 0.6s linear 0.93s both'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "47",
    height: "47",
    viewBox: "0 0 24 24",
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2.5",
    y: "20.1",
    width: "19",
    height: "2",
    rx: "1",
    fill: "white"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 3,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      animation: 'planeFly 0.95s linear 0s both'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "47",
    height: "47",
    viewBox: "0 0 24 24",
    style: {
      display: 'block',
      transform: 'translate(-23.5px,-23.5px)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    fill: "white",
    d: PLANE_BODY
  })))));
}

// ─── Login Screen ────────────────────────────────────────────
function LoginScreen(_ref33) {
  var errorMsg = _ref33.errorMsg,
    onLoginStart = _ref33.onLoginStart;
  var _React$useState81 = React.useState(false),
    _React$useState82 = _slicedToArray(_React$useState81, 2),
    loading = _React$useState82[0],
    setLoading = _React$useState82[1];
  var _React$useState83 = React.useState(''),
    _React$useState84 = _slicedToArray(_React$useState83, 2),
    errLocal = _React$useState84[0],
    setErrLocal = _React$useState84[1];
  var handleLogin = /*#__PURE__*/function () {
    var _ref34 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var _t4, _t5;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            setLoading(true);
            setErrLocal('');
            if (onLoginStart) onLoginStart();
            _context4.p = 1;
            _context4.n = 2;
            return fbSignIn();
          case 2:
            _context4.n = 9;
            break;
          case 3:
            _context4.p = 3;
            _t4 = _context4.v;
            console.error('Login error:', _t4);
            setLoading(false);
            if (!(_t4.code === 'auth/popup-blocked')) {
              _context4.n = 8;
              break;
            }
            _context4.p = 4;
            _context4.n = 5;
            return fbSignInRedirect();
          case 5:
            _context4.n = 7;
            break;
          case 6:
            _context4.p = 6;
            _t5 = _context4.v;
            setErrLocal('로그인 실패: ' + (_t5.message || _t5.code));
          case 7:
            _context4.n = 9;
            break;
          case 8:
            if (_t4.code === 'auth/unauthorized-domain') {
              setErrLocal('이 도메인이 Firebase에 등록되지 않았습니다. Firebase 콘솔 → Authentication → Settings → Authorized domains에 현재 주소를 추가해주세요.');
            } else if (_t4.code === 'auth/popup-closed-by-user') {
              setErrLocal('');
            } else {
              setErrLocal(_t4.message || '로그인 중 오류가 발생했습니다.');
            }
          case 9:
            return _context4.a(2);
        }
      }, _callee3, null, [[4, 6], [1, 3]]);
    }));
    return function handleLogin() {
      return _ref34.apply(this, arguments);
    };
  }();
  var displayErr = errorMsg || errLocal;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: COLORS.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 36px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(TakeoffIcon, null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 56,
      color: COLORS.ink,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
      marginBottom: 14
    }
  }, _toConsumableArray('Trip').map(function (ch, i) {
    return /*#__PURE__*/React.createElement("span", {
      key: 't' + i,
      style: {
        display: 'inline-block',
        animation: "charPop 0.65s cubic-bezier(0.34,1.56,0.64,1) ".concat(0.82 + i * 0.055, "s both")
      }
    }, ch);
  }), /*#__PURE__*/React.createElement("br", null), _toConsumableArray('Like J.').map(function (ch, i) {
    return /*#__PURE__*/React.createElement("span", {
      key: 'l' + i,
      style: {
        display: 'inline-block',
        animation: "charPop 0.65s cubic-bezier(0.34,1.56,0.64,1) ".concat(0.82 + (4 + i) * 0.055 + 0.04, "s both")
      }
    }, ch === ' ' ? ' ' : ch);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 15,
      color: COLORS.mute,
      marginBottom: 56,
      lineHeight: 1.5,
      animation: 'charPop 0.55s cubic-bezier(0.34,1.56,0.64,1) 1.38s both'
    }
  }, "\uC5EC\uD589 \uC77C\uC815\uC744 J\uCC98\uB7FC \uB9CC\uB4E4\uACE0 \uAC04\uD3B8\uD558\uAC8C \uACF5\uC720\uD574 \uBCF4\uC138\uC694."), /*#__PURE__*/React.createElement("button", {
    onClick: handleLogin,
    disabled: loading,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 28px',
      background: loading ? COLORS.softer : '#fff',
      border: "1.5px solid ".concat(COLORS.line),
      borderRadius: 16,
      cursor: 'pointer',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      width: '100%',
      maxWidth: 300,
      fontFamily: SANS,
      fontSize: 15,
      fontWeight: 500,
      color: COLORS.ink,
      justifyContent: 'center',
      transition: 'opacity 0.2s',
      opacity: loading ? 0.6 : 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 48 48"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#EA4335",
    d: "M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#4285F4",
    d: "M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FBBC05",
    d: "M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#34A853",
    d: "M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.96 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
  })), loading ? '로그인 중...' : 'Google로 로그인'), displayErr && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      padding: '12px 16px',
      background: '#FEF2F2',
      borderRadius: 12,
      fontFamily: SANS,
      fontSize: 13,
      color: '#C0392B',
      maxWidth: 300,
      textAlign: 'center',
      lineHeight: 1.5
    }
  }, displayErr));
}

// ─── Companion Sheet ──────────────────────────────────────────
function CompanionSheet(_ref35) {
  var open = _ref35.open,
    onClose = _ref35.onClose,
    authUser = _ref35.authUser,
    userData = _ref35.userData,
    onUserDataUpdate = _ref35.onUserDataUpdate,
    trips = _ref35.trips;
  var _React$useState85 = React.useState({}),
    _React$useState86 = _slicedToArray(_React$useState85, 2),
    tripCompanions = _React$useState86[0],
    setTripCompanions = _React$useState86[1];
  var _React$useState87 = React.useState(null),
    _React$useState88 = _slicedToArray(_React$useState87, 2),
    expandedInvite = _React$useState88[0],
    setExpandedInvite = _React$useState88[1];
  var _React$useState89 = React.useState(''),
    _React$useState90 = _slicedToArray(_React$useState89, 2),
    inviteEmail = _React$useState90[0],
    setInviteEmail = _React$useState90[1];
  var _React$useState91 = React.useState(''),
    _React$useState92 = _slicedToArray(_React$useState91, 2),
    inviteMsg = _React$useState92[0],
    setInviteMsg = _React$useState92[1];
  var _React$useState93 = React.useState(false),
    _React$useState94 = _slicedToArray(_React$useState93, 2),
    inviting = _React$useState94[0],
    setInviting = _React$useState94[1];
  var _React$useState95 = React.useState([]),
    _React$useState96 = _slicedToArray(_React$useState95, 2),
    pendingInvites = _React$useState96[0],
    setPendingInvites = _React$useState96[1];
  var tripIds = (trips || []).map(function (t) {
    return t.id;
  }).join(',');
  React.useEffect(function () {
    if (!open || !userData) return;
    (trips || []).forEach(function (t) {
      fbGetTripCompanions(t.id, authUser.uid).then(function (members) {
        setTripCompanions(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, t.id, members));
        });
      });
    });
    var unsub = fbListenInvites(authUser.uid, setPendingInvites);
    return unsub;
  }, [open, tripIds]);
  React.useEffect(function () {
    if (open) {
      document.body.style.overflow = 'hidden';
      return function () {
        document.body.style.overflow = '';
      };
    }
  }, [open]);
  var handleInvite = /*#__PURE__*/function () {
    var _ref36 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(tripId, tripTitle) {
      var res;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            if (inviteEmail.trim()) {
              _context5.n = 1;
              break;
            }
            return _context5.a(2);
          case 1:
            setInviting(true);
            setInviteMsg('');
            _context5.n = 2;
            return fbSendTripInvite(userData, inviteEmail, tripId, tripTitle);
          case 2:
            res = _context5.v;
            setInviting(false);
            if (res.error) setInviteMsg(res.error);else {
              setInviteMsg("".concat(res.toName, "\uB2D8\uAED8 \uCD08\uB300\uB97C \uBCF4\uB0C8\uC2B5\uB2C8\uB2E4!"));
              setInviteEmail('');
            }
          case 3:
            return _context5.a(2);
        }
      }, _callee4);
    }));
    return function handleInvite(_x2, _x3) {
      return _ref36.apply(this, arguments);
    };
  }();
  var handleAccept = /*#__PURE__*/function () {
    var _ref37 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(inv) {
      var tripId;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _context6.n = 1;
            return fbAcceptTripInvite(inv, authUser.uid);
          case 1:
            tripId = _context6.v;
            onUserDataUpdate(_objectSpread(_objectSpread({}, userData), {}, {
              tripIds: [].concat(_toConsumableArray(userData.tripIds || []), [tripId])
            }));
            setPendingInvites(function (p) {
              return p.filter(function (i) {
                return i.id !== inv.id;
              });
            });
          case 2:
            return _context6.a(2);
        }
      }, _callee5);
    }));
    return function handleAccept(_x4) {
      return _ref37.apply(this, arguments);
    };
  }();
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    style: {
      background: COLORS.bg,
      borderRadius: '22px 22px 0 0',
      paddingBottom: 'calc(24px + env(safe-area-inset-bottom,0px))',
      maxHeight: '88%',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 0 6px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      background: COLORS.line,
      borderRadius: 2
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px 16px',
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      borderBottom: "1px solid ".concat(COLORS.line)
    }
  }, authUser.photoURL ? /*#__PURE__*/React.createElement("img", {
    src: authUser.photoURL,
    style: {
      width: 52,
      height: 52,
      borderRadius: 26,
      flexShrink: 0
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 26,
      background: COLORS.accent,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontFamily: SANS,
      fontSize: 20,
      color: '#fff',
      fontWeight: 600
    }
  }, (authUser.displayName || '?')[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 18,
      color: COLORS.ink
    }
  }, authUser.displayName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 12,
      color: COLORS.mute,
      marginTop: 2
    }
  }, authUser.email)), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      fbSignOut();
      onClose();
    },
    style: {
      border: "1px solid ".concat(COLORS.line),
      borderRadius: 10,
      padding: '7px 12px',
      background: 'transparent',
      fontFamily: SANS,
      fontSize: 12,
      color: COLORS.mute,
      cursor: 'pointer'
    }
  }, "\uB85C\uADF8\uC544\uC6C3")), pendingInvites.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '14px 16px 0',
      background: '#FFF8E1',
      borderRadius: 14,
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: '#B8860B',
      letterSpacing: '0.1em',
      marginBottom: 8
    }
  }, "\uD83D\uDCE9 \uB3D9\uD589 \uCD08\uB300 ", pendingInvites.length, "\uAC74"), pendingInvites.map(function (inv) {
    return /*#__PURE__*/React.createElement("div", {
      key: inv.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8
      }
    }, inv.fromPhoto ? /*#__PURE__*/React.createElement("img", {
      src: inv.fromPhoto,
      style: {
        width: 36,
        height: 36,
        borderRadius: 18
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 18,
        background: COLORS.accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        fontSize: 14,
        color: '#fff'
      }
    }, (inv.fromName || '?')[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 13,
        color: COLORS.ink,
        fontWeight: 500
      }
    }, inv.fromName), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 11,
        color: COLORS.mute
      }
    }, inv.tripTitle || inv.fromEmail)), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return handleAccept(inv);
      },
      style: {
        border: 'none',
        borderRadius: 10,
        padding: '6px 12px',
        cursor: 'pointer',
        background: COLORS.ink,
        color: COLORS.bg,
        fontFamily: SANS,
        fontSize: 12,
        fontWeight: 500
      }
    }, "\uC218\uB77D"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return fbRejectInvite(inv.id).then(function () {
          return setPendingInvites(function (p) {
            return p.filter(function (i) {
              return i.id !== inv.id;
            });
          });
        });
      },
      style: {
        border: "1px solid ".concat(COLORS.line),
        borderRadius: 10,
        padding: '6px 10px',
        cursor: 'pointer',
        background: 'transparent',
        fontFamily: SANS,
        fontSize: 12,
        color: COLORS.mute
      }
    }, "\uAC70\uC808"));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px 0'
    }
  }, (trips || []).length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 0',
      textAlign: 'center',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, "\uC5EC\uD589\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : (trips || []).map(function (t) {
    var members = tripCompanions[t.id] || [];
    var isExpanded = expandedInvite === t.id;
    var hasBorder = members.length > 0 || isExpanded;
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        marginBottom: 12,
        background: COLORS.card,
        borderRadius: 16,
        overflow: 'hidden',
        border: "1px solid ".concat(COLORS.line)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 14px',
        borderBottom: hasBorder ? "1px solid ".concat(COLORS.line) : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SERIF,
        fontSize: 16,
        color: COLORS.ink
      }
    }, t.title || '새 여행'), t.dates && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9.5,
        color: COLORS.mute,
        marginTop: 1
      }
    }, t.dates)), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        if (isExpanded) {
          setExpandedInvite(null);
          setInviteEmail('');
          setInviteMsg('');
        } else {
          setExpandedInvite(t.id);
          setInviteEmail('');
          setInviteMsg('');
        }
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 12px',
        borderRadius: 20,
        border: "1px solid ".concat(COLORS.line),
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: SANS,
        fontSize: 12,
        color: COLORS.mute,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 12,
      color: COLORS.mute,
      stroke: 2.5
    }), "\uCD08\uB300"))), members.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 14px'
      }
    }, members.map(function (c, ci) {
      return /*#__PURE__*/React.createElement("div", {
        key: c.uid,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 0',
          borderBottom: ci < members.length - 1 || isExpanded ? "1px solid ".concat(COLORS.line) : 'none'
        }
      }, c.photoURL ? /*#__PURE__*/React.createElement("img", {
        src: c.photoURL,
        style: {
          width: 36,
          height: 36,
          borderRadius: 18
        }
      }) : /*#__PURE__*/React.createElement("div", {
        style: {
          width: 36,
          height: 36,
          borderRadius: 18,
          background: COLORS.softer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: SANS,
          fontSize: 14,
          color: COLORS.mute
        }
      }, (c.displayName || '?')[0]), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontSize: 13,
          color: COLORS.ink,
          fontWeight: 500
        }
      }, c.displayName), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontSize: 11,
          color: COLORS.mute
        }
      }, c.email)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: MONO,
          fontSize: 10,
          color: '#4F6BED'
        }
      }, "\uB3D9\uD589\uC911"));
    })), isExpanded && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 14px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 12,
        color: COLORS.mute,
        marginBottom: 8
      }
    }, "\uC0C1\uB300\uBC29\uC774 \uC774 \uC571\uC5D0 \uBA3C\uC800 \uAC00\uC785\uB418\uC5B4 \uC788\uC5B4\uC57C \uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("input", {
      value: inviteEmail,
      onChange: function onChange(e) {
        return setInviteEmail(e.target.value);
      },
      placeholder: "\uAD6C\uAE00 \uC774\uBA54\uC77C \uC785\uB825",
      onKeyDown: function onKeyDown(e) {
        return e.key === 'Enter' && handleInvite(t.id, t.title);
      },
      style: {
        width: '100%',
        padding: '11px 13px',
        borderRadius: 11,
        border: "1.5px solid ".concat(COLORS.line),
        background: COLORS.bg,
        fontFamily: SANS,
        fontSize: 13,
        color: COLORS.ink,
        boxSizing: 'border-box',
        outline: 'none'
      }
    }), inviteMsg && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6,
        fontFamily: SANS,
        fontSize: 12,
        color: inviteMsg.includes('보냈') ? COLORS.accent : '#C0392B'
      }
    }, inviteMsg), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return handleInvite(t.id, t.title);
      },
      disabled: inviting || !inviteEmail.trim(),
      style: {
        marginTop: 10,
        width: '100%',
        padding: '13px',
        border: 'none',
        borderRadius: 12,
        background: inviteEmail.trim() ? COLORS.ink : COLORS.softer,
        color: inviteEmail.trim() ? COLORS.bg : COLORS.mute,
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer'
      }
    }, inviting ? '보내는 중...' : '초대 보내기')));
  }))));
}

// ─── App ─────────────────────────────────────────────────────
// 로컬 캐시 읽기 (로그인 상태면 즉시 앱 표시용)
function _readCache() {
  if (!localStorage.getItem('tlj_authed')) return null;
  try {
    return {
      userData: JSON.parse(localStorage.getItem('tlj_userData') || 'null'),
      trip: JSON.parse(localStorage.getItem('tlj_trip') || 'null'),
      prep: JSON.parse(localStorage.getItem('tlj_prep') || 'null')
    };
  } catch (e) {
    return null;
  }
}
function App() {
  var _nav$dayIdx, _nav$hotelIdx;
  var _nav = loadNav();
  var _cache = _readCache(); // 캐시된 상태 (로그인된 경우)

  // ── Firebase auth + data state ─────────────────────────────
  var _React$useState97 = React.useState(_cache !== null && _cache !== void 0 && _cache.userData ? 'in' : 'loading'),
    _React$useState98 = _slicedToArray(_React$useState97, 2),
    authState = _React$useState98[0],
    setAuthState = _React$useState98[1];
  var _React$useState99 = React.useState(null),
    _React$useState100 = _slicedToArray(_React$useState99, 2),
    authUser = _React$useState100[0],
    setAuthUser = _React$useState100[1];
  var _React$useState101 = React.useState((_cache === null || _cache === void 0 ? void 0 : _cache.userData) || null),
    _React$useState102 = _slicedToArray(_React$useState101, 2),
    userData = _React$useState102[0],
    setUserData = _React$useState102[1];
  var _React$useState103 = React.useState((_cache === null || _cache === void 0 ? void 0 : _cache.trip) || null),
    _React$useState104 = _slicedToArray(_React$useState103, 2),
    trip = _React$useState104[0],
    setTrip = _React$useState104[1];
  var _React$useState105 = React.useState((_cache === null || _cache === void 0 ? void 0 : _cache.prep) || {
      checklist: [],
      docs: [],
      pack: []
    }),
    _React$useState106 = _slicedToArray(_React$useState105, 2),
    prep = _React$useState106[0],
    setPrep = _React$useState106[1];
  var _React$useState107 = React.useState(null),
    _React$useState108 = _slicedToArray(_React$useState107, 2),
    activeTripId = _React$useState108[0],
    setActiveTripId = _React$useState108[1];
  var _React$useState109 = React.useState([]),
    _React$useState110 = _slicedToArray(_React$useState109, 2),
    userTrips = _React$useState110[0],
    setUserTrips = _React$useState110[1];
  var _React$useState111 = React.useState(false),
    _React$useState112 = _slicedToArray(_React$useState111, 2),
    tripsLoading = _React$useState112[0],
    setTripsLoading = _React$useState112[1];
  var _React$useState113 = React.useState(false),
    _React$useState114 = _slicedToArray(_React$useState113, 2),
    companionOpen = _React$useState114[0],
    setCompanionOpen = _React$useState114[1];
  var _React$useState115 = React.useState(null),
    _React$useState116 = _slicedToArray(_React$useState115, 2),
    shareTripTarget = _React$useState116[0],
    setShareTripTarget = _React$useState116[1];
  var _React$useState117 = React.useState(''),
    _React$useState118 = _slicedToArray(_React$useState117, 2),
    loginError = _React$useState118[0],
    setLoginError = _React$useState118[1];
  var _React$useState119 = React.useState(false),
    _React$useState120 = _slicedToArray(_React$useState119, 2),
    loginPending = _React$useState120[0],
    setLoginPending = _React$useState120[1]; // 로그인 버튼 누른 후 로딩 중
  var tripRef = React.useRef(null); // for loop-prevention

  // ── UI nav state ───────────────────────────────────────────
  var _React$useState121 = React.useState(_nav.tab || 'home'),
    _React$useState122 = _slicedToArray(_React$useState121, 2),
    tab = _React$useState122[0],
    _setTab = _React$useState122[1];
  var _React$useState123 = React.useState((_nav$dayIdx = _nav.dayIdx) !== null && _nav$dayIdx !== void 0 ? _nav$dayIdx : null),
    _React$useState124 = _slicedToArray(_React$useState123, 2),
    dayIdx = _React$useState124[0],
    setDayIdx = _React$useState124[1];
  var _React$useState125 = React.useState((_nav$hotelIdx = _nav.hotelIdx) !== null && _nav$hotelIdx !== void 0 ? _nav$hotelIdx : null),
    _React$useState126 = _slicedToArray(_React$useState125, 2),
    hotelIdx = _React$useState126[0],
    setHotelIdx = _React$useState126[1];
  var _React$useState127 = React.useState(null),
    _React$useState128 = _slicedToArray(_React$useState127, 2),
    openStop = _React$useState128[0],
    setOpenStop = _React$useState128[1];
  var _React$useState129 = React.useState(CITIES[0]),
    _React$useState130 = _slicedToArray(_React$useState129, 2),
    city = _React$useState130[0],
    setCity = _React$useState130[1];
  var _React$useState131 = React.useState(false),
    _React$useState132 = _slicedToArray(_React$useState131, 2),
    cityPicker = _React$useState132[0],
    setCityPicker = _React$useState132[1];
  var _React$useState133 = React.useState(null),
    _React$useState134 = _slicedToArray(_React$useState133, 2),
    hotelSheet = _React$useState134[0],
    setHotelSheet = _React$useState134[1];
  var _React$useState135 = React.useState(0),
    _React$useState136 = _slicedToArray(_React$useState135, 2),
    scrollKey = _React$useState136[0],
    setScrollKey = _React$useState136[1];
  var _React$useState137 = React.useState(false),
    _React$useState138 = _slicedToArray(_React$useState137, 2),
    editing = _React$useState138[0],
    setEditing = _React$useState138[1];
  var _React$useState139 = React.useState(true),
    _React$useState140 = _slicedToArray(_React$useState139, 2),
    tabBarVisible = _React$useState140[0],
    setTabBarVisible = _React$useState140[1];
  var _React$useState141 = React.useState(false),
    _React$useState142 = _slicedToArray(_React$useState141, 2),
    saveConfirm = _React$useState142[0],
    setSaveConfirm = _React$useState142[1]; // 저장 확인 다이얼로그
  var lastScrollTop = React.useRef(0);
  var savedHomeScrollY = React.useRef(0);
  var navGoingBack = React.useRef(false);
  var editSnapshot = React.useRef(null); // 편집 시작 시 trip+prep 스냅샷

  // 편집 버튼 토글 핸들러
  var handleEditToggle = function handleEditToggle() {
    if (!editing) {
      // 편집 시작 — 스냅샷 저장
      editSnapshot.current = JSON.stringify({
        trip: trip,
        prep: prep
      });
      setEditing(true);
    } else {
      var changed = editSnapshot.current !== JSON.stringify({
        trip: trip,
        prep: prep
      });
      if (changed) {
        setSaveConfirm(true); // 변경 있으면 확인 다이얼로그
      } else {
        setEditing(false); // 변경 없으면 그냥 닫기
      }
    }
  };

  // ── 앱 준비되면 loginPending 해제 ────────────────────────────
  React.useEffect(function () {
    if (loginPending && authState === 'in') {
      setLoginPending(false);
    }
  }, [loginPending, authState]);

  // ── 로컬 캐시 저장 (새로고침 시 즉시 표시용) ──────────────────
  React.useEffect(function () {
    if (userData) localStorage.setItem('tlj_userData', JSON.stringify(userData));
  }, [userData]);
  React.useEffect(function () {
    if (trip) localStorage.setItem('tlj_trip', JSON.stringify(trip));
  }, [trip]);
  React.useEffect(function () {
    if (prep) localStorage.setItem('tlj_prep', JSON.stringify(prep));
  }, [prep]);

  // ── Firebase auth listener ─────────────────────────────────
  React.useEffect(function () {
    return fbOnAuth(/*#__PURE__*/function () {
      var _ref38 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(fbUser) {
        var fallback;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              if (fbUser) {
                setAuthUser(fbUser);
                fallback = {
                  uid: fbUser.uid,
                  displayName: fbUser.displayName || '여행자',
                  email: fbUser.email || '',
                  photoURL: fbUser.photoURL || '',
                  groupId: fbUser.uid
                }; // fallback 즉시 세팅 → 바로 앱 화면 표시
                setUserData(fallback);
                setLoginError('');
                localStorage.setItem('tlj_authed', '1');
                setAuthState('in');
                // Firestore는 백그라운드에서 실제 데이터로 업데이트
                fbGetOrCreateUser(fbUser).then(setUserData).catch(function () {});
              } else {
                setAuthUser(null);
                setUserData(null);
                setTrip(null);
                setActiveTripId(null);
                setUserTrips([]);
                setPrep({
                  checklist: [],
                  docs: [],
                  pack: []
                });
                localStorage.removeItem('tlj_authed');
                localStorage.removeItem('tlj_userData');
                localStorage.removeItem('tlj_trip');
                localStorage.removeItem('tlj_prep');
                setAuthState('out');
              }
            case 1:
              return _context7.a(2);
          }
        }, _callee6);
      }));
      return function (_x5) {
        return _ref38.apply(this, arguments);
      };
    }());
  }, []);

  // ── 여행 목록 로드 ─────────────────────────────────────────
  React.useEffect(function () {
    if (!(userData !== null && userData !== void 0 && userData.uid)) return;
    var tripIds = userData.tripIds || [userData.groupId];
    setTripsLoading(true);
    fbLoadTrips(tripIds).then(function (trips) {
      setUserTrips(trips);
      setTripsLoading(false);
    }).catch(function () {
      return setTripsLoading(false);
    });
  }, [userData === null || userData === void 0 ? void 0 : userData.uid, JSON.stringify(userData === null || userData === void 0 ? void 0 : userData.tripIds)]);

  // ── Firestore: shared group listener ──────────────────────
  var groupCreateRef = React.useRef(false);
  React.useEffect(function () {
    if (!activeTripId) return;
    groupCreateRef.current = false;
    // userTrips에 이미 있는 데이터로 즉시 표시, Firestore는 실시간 업데이트용
    var cached = userTrips.find(function (t) {
      return t.id === activeTripId;
    });
    if (cached) {
      tripRef.current = cached;
      setTrip(cached);
    } else setTrip(null);
    return fbListenGroup(activeTripId, function (data) {
      if (data === null) {
        if (groupCreateRef.current) return;
        groupCreateRef.current = true;
        fbSaveGroup(activeTripId, {
          title: '새 여행',
          dates: '',
          hotel: '',
          days: [],
          hotels: [],
          food: [],
          members: [userData.uid]
        });
        return;
      }
      setTrip(function (prev) {
        if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
        tripRef.current = data;
        return data;
      });
    });
  }, [activeTripId]);

  // ── Firestore: private prep listener ──────────────────────
  React.useEffect(function () {
    if (!(authUser !== null && authUser !== void 0 && authUser.uid)) return;
    return fbListenPrep(authUser.uid, function (p) {
      var _p$checklist, _p$docs, _p$pack;
      // preps 문서가 없거나 비어있으면 TRIP_DEFAULT.prep으로 초기화
      var hasData = p && (((_p$checklist = p.checklist) === null || _p$checklist === void 0 ? void 0 : _p$checklist.length) || ((_p$docs = p.docs) === null || _p$docs === void 0 ? void 0 : _p$docs.length) || ((_p$pack = p.pack) === null || _p$pack === void 0 ? void 0 : _p$pack.length));
      if (!hasData) {
        var _window$TRIP_DEFAULT;
        var def = ((_window$TRIP_DEFAULT = window.TRIP_DEFAULT) === null || _window$TRIP_DEFAULT === void 0 ? void 0 : _window$TRIP_DEFAULT.prep) || {
          checklist: [],
          docs: [],
          pack: []
        };
        fbSavePrep(authUser.uid, def).catch(console.error);
        setPrep(def);
      } else {
        setPrep(p);
      }
    });
  }, [authUser === null || authUser === void 0 ? void 0 : authUser.uid]);
  React.useEffect(function () {
    saveNav({
      tab: tab,
      dayIdx: dayIdx,
      hotelIdx: hotelIdx
    });
  }, [tab, dayIdx, hotelIdx]);
  React.useEffect(function () {
    if (navGoingBack.current) {
      // 뒤로가기: 저장된 홈 스크롤 위치 복원
      var target = savedHomeScrollY.current || 0;
      requestAnimationFrame(function () {
        window.scrollTo(0, target);
        lastScrollTop.current = target;
      });
      navGoingBack.current = false;
    } else {
      window.scrollTo(0, 0);
      lastScrollTop.current = 0;
    }
    setTabBarVisible(true);
    setEditing(false);
  }, [scrollKey, tab, dayIdx, hotelIdx]);
  React.useEffect(function () {
    var handleScroll = function handleScroll() {
      var st = window.scrollY;
      var diff = st - lastScrollTop.current;
      if (Math.abs(diff) > 4) {
        setTabBarVisible(diff < 0 || st < 60);
      }
      lastScrollTop.current = st;
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return function () {
      return window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ── Trip-level actions (Firestore) ────────────────────────
  var editTrip = function editTrip(patch) {
    setTrip(function (prev) {
      return _objectSpread(_objectSpread({}, prev), patch);
    });
    if (activeTripId) fbSaveGroup(activeTripId, patch).catch(console.error);
  };
  var editPrep = function editPrep(newPrep) {
    setPrep(newPrep);
    if (authUser !== null && authUser !== void 0 && authUser.uid) fbSavePrep(authUser.uid, newPrep).catch(console.error);
  };
  var deleteTrip = /*#__PURE__*/function () {
    var _ref39 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(tripId) {
      var t, isOwner, msg;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            t = userTrips.find(function (x) {
              return x.id === tripId;
            });
            isOwner = !(t !== null && t !== void 0 && t.members) || t.members[0] === (userData === null || userData === void 0 ? void 0 : userData.uid);
            msg = isOwner ? "\"".concat((t === null || t === void 0 ? void 0 : t.title) || '여행', "\"\uC744(\uB97C) \uC0AD\uC81C\uD560\uAE4C\uC694?\n\uC0AD\uC81C\uD558\uBA74 \uBCF5\uAD6C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.") : "\"".concat((t === null || t === void 0 ? void 0 : t.title) || '여행', "\"\uC5D0\uC11C \uB098\uAC08\uAE4C\uC694?");
            if (confirm(msg)) {
              _context8.n = 1;
              break;
            }
            return _context8.a(2);
          case 1:
            _context8.n = 2;
            return fbDeleteTrip(tripId, userData.uid);
          case 2:
            setUserTrips(function (prev) {
              return prev.filter(function (x) {
                return x.id !== tripId;
              });
            });
            setUserData(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                tripIds: (prev.tripIds || []).filter(function (id) {
                  return id !== tripId;
                })
              });
            });
          case 3:
            return _context8.a(2);
        }
      }, _callee7);
    }));
    return function deleteTrip(_x6) {
      return _ref39.apply(this, arguments);
    };
  }();

  // ── Day actions ────────────────────────────────────────
  var reorderDays = function reorderDays(from, to) {
    var days = _toConsumableArray(trip.days);
    var _days$splice = days.splice(from, 1),
      _days$splice2 = _slicedToArray(_days$splice, 1),
      m = _days$splice2[0];
    days.splice(to, 0, m);
    editTrip({
      days: days.map(function (d, i) {
        return _objectSpread(_objectSpread({}, d), {}, {
          n: i + 1
        });
      })
    });
  };
  var addDay = function addDay() {
    var n = trip.days.length + 1;
    var newDay = {
      n: n,
      date: '',
      weekday: '',
      title: "Day ".concat(n),
      titleEn: '',
      hero: {
        hue: 20 + n * 5,
        label: "DAY ".concat(n)
      },
      weather: '',
      items: []
    };
    editTrip({
      days: [].concat(_toConsumableArray(trip.days), [newDay])
    });
  };
  var deleteDay = function deleteDay(i) {
    if (!confirm("Day ".concat(trip.days[i].n, " \uC77C\uC815\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?"))) return;
    var days = trip.days.filter(function (_, j) {
      return j !== i;
    }).map(function (d, k) {
      return _objectSpread(_objectSpread({}, d), {}, {
        n: k + 1
      });
    });
    editTrip({
      days: days
    });
  };
  var editDay = function editDay(patch) {
    var days = _toConsumableArray(trip.days);
    days[dayIdx] = _objectSpread(_objectSpread({}, days[dayIdx]), patch);
    editTrip({
      days: days
    });
  };

  // ── Stop actions ───────────────────────────────────────
  var reorderItems = function reorderItems(from, to) {
    var days = _toConsumableArray(trip.days);
    var items = _toConsumableArray(days[dayIdx].items);
    var _items$splice = items.splice(from, 1),
      _items$splice2 = _slicedToArray(_items$splice, 1),
      m = _items$splice2[0];
    items.splice(to, 0, m);
    days[dayIdx] = _objectSpread(_objectSpread({}, days[dayIdx]), {}, {
      items: items
    });
    editTrip({
      days: days
    });
  };
  var addItem = function addItem() {
    var newItem = {
      time: '12:00',
      cat: 'sight',
      title: '새 일정',
      en: 'New stop',
      loc: '',
      note: ''
    };
    var days = _toConsumableArray(trip.days);
    days[dayIdx] = _objectSpread(_objectSpread({}, days[dayIdx]), {}, {
      items: [].concat(_toConsumableArray(days[dayIdx].items), [newItem])
    });
    editTrip({
      days: days
    });
    setOpenStop({
      idx: days[dayIdx].items.length - 1,
      stop: newItem,
      editing: true
    });
  };
  var addItemToFirstDay = function addItemToFirstDay() {
    var newItem = {
      time: '12:00',
      cat: 'sight',
      title: '새 일정',
      en: 'New stop',
      loc: '',
      note: ''
    };
    var days = _toConsumableArray(trip.days);
    days[0] = _objectSpread(_objectSpread({}, days[0]), {}, {
      items: [].concat(_toConsumableArray(days[0].items), [newItem])
    });
    editTrip({
      days: days
    });
    setDayIdx(0);
    setScrollKey(function (k) {
      return k + 1;
    });
    setOpenStop({
      idx: days[0].items.length - 1,
      stop: newItem,
      editing: true
    });
  };
  var deleteItem = function deleteItem(i) {
    if (!confirm('이 일정을 삭제할까요?')) return;
    var days = _toConsumableArray(trip.days);
    days[dayIdx] = _objectSpread(_objectSpread({}, days[dayIdx]), {}, {
      items: days[dayIdx].items.filter(function (_, j) {
        return j !== i;
      })
    });
    editTrip({
      days: days
    });
  };
  var saveStop = function saveStop(draft) {
    var days = _toConsumableArray(trip.days);
    var items = _toConsumableArray(days[dayIdx].items);
    items[openStop.idx] = draft;
    days[dayIdx] = _objectSpread(_objectSpread({}, days[dayIdx]), {}, {
      items: items
    });
    editTrip({
      days: days
    });
    setOpenStop(null);
  };

  // ── Hotel ↔ Days sync ─────────────────────────────────
  // When a hotel has checkin/checkout dates+times, ensure day timelines
  // contain corresponding 'hotel' category items. Match day by date string.
  var normalizeDate = function normalizeDate(s) {
    return (s || '').replace(/,\s*\d{4}\s*$/, '').trim();
  }; // strip year
  var syncHotelToDays = function syncHotelToDays(days, hotel, prevHotel) {
    if (!hotel) return days;
    var result = _toConsumableArray(days);
    // Remove any existing items tagged as this hotel (by _hotelRef name)
    var prevName = prevHotel === null || prevHotel === void 0 ? void 0 : prevHotel.name;
    if (prevName) {
      result = result.map(function (d) {
        return _objectSpread(_objectSpread({}, d), {}, {
          items: d.items.filter(function (it) {
            return !(it._hotelRef === prevName);
          })
        });
      });
    }
    // Also strip items tagged to the NEW name (in case of re-sync/rename collisions)
    result = result.map(function (d) {
      return _objectSpread(_objectSpread({}, d), {}, {
        items: d.items.filter(function (it) {
          return !(it._hotelRef === hotel.name);
        })
      });
    });
    var findDay = function findDay(dateStr) {
      if (!dateStr) return -1;
      var target = normalizeDate(dateStr);
      return result.findIndex(function (d) {
        return normalizeDate(d.date) === target;
      });
    };
    var inIdx = findDay(hotel.checkin);
    // If checkout not given but nights is, derive checkout day from trip.days
    var outIdx = findDay(hotel.checkout);
    var nights = parseInt(hotel.nights, 10);
    if (outIdx < 0 && inIdx >= 0 && nights > 0) {
      outIdx = Math.min(inIdx + nights, result.length - 1);
    }
    var push = function push(di, item) {
      if (di < 0) return;
      var items = [].concat(_toConsumableArray(result[di].items), [item]).sort(function (a, b) {
        return (a.time || '99:99').localeCompare(b.time || '99:99');
      });
      result[di] = _objectSpread(_objectSpread({}, result[di]), {}, {
        items: items
      });
    };
    if (inIdx >= 0) {
      push(inIdx, {
        time: hotel.checkinTime || '15:00',
        cat: 'hotel',
        title: "".concat(hotel.name, " \uCCB4\uD06C\uC778"),
        en: hotel.name,
        loc: hotel.area || '',
        note: hotel.address || '',
        _hotelRef: hotel.name
      });
    }
    if (outIdx >= 0 && outIdx !== inIdx) {
      push(outIdx, {
        time: hotel.checkoutTime || '12:00',
        cat: 'hotel',
        title: "".concat(hotel.name, " \uCCB4\uD06C\uC544\uC6C3"),
        en: hotel.name,
        loc: hotel.area || '',
        note: hotel.address || '',
        _hotelRef: hotel.name
      });
    }
    // Intermediate nights: days strictly between checkin and checkout
    if (inIdx >= 0 && outIdx > inIdx + 1) {
      for (var di = inIdx + 1; di < outIdx; di++) {
        push(di, {
          time: '',
          cat: 'hotel',
          title: "".concat(hotel.name, " \uC219\uBC15"),
          en: hotel.name,
          loc: hotel.area || '',
          note: hotel.address || '',
          _hotelRef: hotel.name
        });
      }
    }
    return result;
  };

  // ── Hotel actions ──────────────────────────────────────
  var editHotel = function editHotel(patch) {
    var hotels = _toConsumableArray(trip.hotels || []);
    var prev = hotels[hotelIdx];
    var next = _objectSpread(_objectSpread({}, prev), patch);
    hotels[hotelIdx] = next;
    var days = syncHotelToDays(trip.days, next, prev);
    editTrip({
      hotels: hotels,
      days: days
    });
  };
  var deleteHotel = function deleteHotel(i) {
    if (!confirm("\"".concat(trip.hotels[i].name, "\" \uC219\uC18C\uB97C \uC0AD\uC81C\uD560\uAE4C\uC694?"))) return;
    var prev = trip.hotels[i];
    var hotels = (trip.hotels || []).filter(function (_, j) {
      return j !== i;
    });
    // remove hotel items from days
    var days = trip.days.map(function (d) {
      return _objectSpread(_objectSpread({}, d), {}, {
        items: d.items.filter(function (it) {
          return it._hotelRef !== prev.name;
        })
      });
    });
    editTrip({
      hotels: hotels,
      days: days
    });
  };
  var convertInlineHotel = function convertInlineHotel(h) {
    // 인라인 숙소를 trip.hotels에 추가하고 상세 화면 오픈
    var checkinDate = (h.checkin || '').split(' · ')[0];
    var newHotel = {
      name: h.name,
      area: h.area,
      checkin: checkinDate,
      nights: 1,
      hue: h.hue || 25
    };
    var hotels = [].concat(_toConsumableArray(trip.hotels || []), [newHotel]);
    editTrip({
      hotels: hotels
    });
    savedHomeScrollY.current = window.scrollY;
    setHotelIdx(hotels.length - 1);
    setScrollKey(function (k) {
      return k + 1;
    });
  };
  var reorderHotels = function reorderHotels(from, to) {
    var hotels = _toConsumableArray(trip.hotels || []);
    var _hotels$splice = hotels.splice(from, 1),
      _hotels$splice2 = _slicedToArray(_hotels$splice, 1),
      moved = _hotels$splice2[0];
    hotels.splice(to, 0, moved);
    editTrip({
      hotels: hotels
    });
  };
  var addHotel = function addHotel() {
    var newHotel = {
      name: '새 호텔',
      area: '',
      checkin: '',
      checkout: '',
      nights: 1,
      hue: 30
    };
    var hotels = [].concat(_toConsumableArray(trip.hotels || []), [newHotel]);
    editTrip({
      hotels: hotels
    });
    setHotelIdx(hotels.length - 1);
  };
  var pickHotelFromSearch = function pickHotelFromSearch(name) {
    // name may be "Hotel Name (Area)"
    var m = name.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    var parsed = m ? {
      name: m[1],
      area: m[2]
    } : {
      name: name
    };
    if (hotelSheet === 'new') {
      var newHotel = _objectSpread(_objectSpread({}, parsed), {}, {
        nights: 1,
        hue: 30
      });
      var hotels = [].concat(_toConsumableArray(trip.hotels || []), [newHotel]);
      editTrip({
        hotels: hotels
      });
      setHotelIdx(hotels.length - 1);
    } else if (typeof hotelSheet === 'number') {
      var _hotels = _toConsumableArray(trip.hotels || []);
      var prev = _hotels[hotelSheet];
      var next = _objectSpread(_objectSpread({}, prev), parsed);
      _hotels[hotelSheet] = next;
      var days = syncHotelToDays(trip.days, next, prev);
      editTrip({
        hotels: _hotels,
        days: days
      });
    }
  };

  // ── Render ─────────────────────────────────────────────
  var screen, label;
  if (tab === 'home') {
    if (hotelIdx !== null && trip) {
      screen = /*#__PURE__*/React.createElement(HotelDetailScreen, {
        hotel: trip.hotels[hotelIdx],
        onBack: function onBack() {
          navGoingBack.current = true;
          setHotelIdx(null);
        },
        onEdit: editHotel,
        onOpenSearch: function onOpenSearch() {
          return setHotelSheet(hotelIdx);
        },
        editing: editing,
        setEditing: setEditing
      });
      label = 'Hotel';
    } else if (dayIdx !== null && trip) {
      screen = /*#__PURE__*/React.createElement(DayScreen, {
        trip: trip,
        dayIdx: dayIdx,
        onBack: function onBack() {
          navGoingBack.current = true;
          setDayIdx(null);
        },
        onOpenStop: setOpenStop,
        onNavDay: function onNavDay(i) {
          setDayIdx(i);
          setOpenStop(null);
          setScrollKey(function (k) {
            return k + 1;
          });
        },
        onEditDay: editDay,
        onAddItem: addItem,
        onDeleteItem: deleteItem,
        onReorderItems: reorderItems,
        editing: editing,
        setEditing: setEditing
      });
      label = "Day ".concat(dayIdx + 1);
    } else {
      screen = /*#__PURE__*/React.createElement(HomeScreen, {
        trip: trip,
        onOpenDay: function onOpenDay(i) {
          savedHomeScrollY.current = window.scrollY;
          setDayIdx(i);
          setScrollKey(function (k) {
            return k + 1;
          });
        },
        onOpenHotel: function onOpenHotel(i) {
          savedHomeScrollY.current = window.scrollY;
          setHotelIdx(i);
          setScrollKey(function (k) {
            return k + 1;
          });
        },
        city: city,
        onPickCity: function onPickCity() {
          return setCityPicker(true);
        },
        onEditTrip: editTrip,
        onReorderDays: reorderDays,
        onAddDay: addDay,
        onDeleteDay: deleteDay,
        onAddHotel: addHotel,
        onAddHotelFromSearch: function onAddHotelFromSearch() {
          return setHotelSheet('new');
        },
        onDeleteHotel: deleteHotel,
        onReorderHotels: reorderHotels,
        onConvertInlineHotel: convertInlineHotel,
        onAddItemToFirstDay: addItemToFirstDay,
        editing: editing,
        setEditing: setEditing,
        userData: userData,
        onOpenCompanion: function onOpenCompanion() {
          return setCompanionOpen(true);
        }
      });
      label = 'Home';
    }
  } else if (tab === 'map') {
    screen = /*#__PURE__*/React.createElement(MapScreen, {
      trip: trip
    });
    label = 'Map';
  } else if (tab === 'food') {
    screen = /*#__PURE__*/React.createElement(FoodScreen, {
      trip: trip,
      onEditFood: function onEditFood(food) {
        return editTrip({
          food: food
        });
      },
      editing: editing,
      setEditing: setEditing
    });
    label = 'Food';
  } else {
    screen = /*#__PURE__*/React.createElement(PrepScreen, {
      trip: trip,
      prep: prep,
      onEditPrep: editPrep,
      editing: editing,
      setEditing: setEditing
    });
    label = 'Prep';
  }
  var dayHue = dayIdx !== null && trip ? trip.days[dayIdx].hero.hue : 30;

  // ── Auth gating ───────────────────────────────────────────
  // 로그인 버튼 누른 후 데이터 준비될 때까지 스플래시 표시
  var showSplash = loginPending && (authState !== 'in' || trip === null);
  if (showSplash) return /*#__PURE__*/React.createElement(SplashScreen, {
    visible: true
  });
  if (authState === 'loading') return null;
  if (authState === 'out') return /*#__PURE__*/React.createElement(LoginScreen, {
    errorMsg: loginError,
    onLoginStart: function onLoginStart() {
      return setLoginPending(true);
    }
  });

  // ── 여행 목록 화면 ─────────────────────────────────────────
  if (!activeTripId) return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TripsScreen, {
    trips: userTrips,
    loading: tripsLoading,
    userData: userData,
    myUid: authUser === null || authUser === void 0 ? void 0 : authUser.uid,
    onOpenCompanion: function onOpenCompanion() {
      return setCompanionOpen(true);
    },
    onSelect: function onSelect(id) {
      setActiveTripId(id);
      _setTab('home');
      setDayIdx(null);
      setHotelIdx(null);
      setEditing(false);
    },
    onAdd: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      var title, tripId;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            title = prompt('여행 이름을 입력해 주세요\n(예: 뉴욕, 파리 7박)');
            if (title) {
              _context9.n = 1;
              break;
            }
            return _context9.a(2);
          case 1:
            _context9.n = 2;
            return fbCreateNewTrip(userData.uid, title);
          case 2:
            tripId = _context9.v;
            setUserTrips(function (prev) {
              return [].concat(_toConsumableArray(prev), [{
                id: tripId,
                title: title,
                dates: '',
                days: [],
                hotels: [],
                members: [userData.uid]
              }]);
            });
            setActiveTripId(tripId);
            _setTab('home');
            setDayIdx(null);
            setHotelIdx(null);
          case 3:
            return _context9.a(2);
        }
      }, _callee8);
    })),
    onShare: function onShare(t) {
      return setShareTripTarget(t);
    },
    onDelete: deleteTrip
  }), /*#__PURE__*/React.createElement(ShareTripSheet, {
    open: !!shareTripTarget,
    onClose: function onClose() {
      return setShareTripTarget(null);
    },
    trip: shareTripTarget,
    userData: userData,
    allTrips: userTrips,
    myUid: authUser === null || authUser === void 0 ? void 0 : authUser.uid
  }), /*#__PURE__*/React.createElement(CompanionSheet, {
    open: companionOpen,
    onClose: function onClose() {
      return setCompanionOpen(false);
    },
    authUser: authUser,
    userData: userData,
    onUserDataUpdate: function onUserDataUpdate(ud) {
      return setUserData(ud);
    },
    trips: userTrips
  }));
  if (!trip) return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: COLORS.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setActiveTripId(null);
      setEditing(false);
    },
    style: {
      position: 'fixed',
      top: 'calc(env(safe-area-inset-top) + 14px)',
      left: 16,
      background: 'transparent',
      border: 'none',
      padding: '4px 8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 14,
    color: COLORS.mute,
    stroke: 2
  }), "My Trips"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      border: "3px solid ".concat(COLORS.accent),
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }
  }), /*#__PURE__*/React.createElement("style", null, "@keyframes spin{to{transform:rotate(360deg)}}"));

  // Figure out what "back" means in the current state, for swipe-from-edge.
  var swipeBack = null;
  if (tab === 'home') {
    if (hotelIdx !== null) swipeBack = function swipeBack() {
      navGoingBack.current = true;
      setHotelIdx(null);
    };else if (dayIdx !== null) swipeBack = function swipeBack() {
      navGoingBack.current = true;
      setDayIdx(null);
    };
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      fontFamily: '-apple-system, system-ui, sans-serif',
      background: '#F5F2EC'
    }
  }, tab === 'home' && dayIdx === null && hotelIdx === null && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setActiveTripId(null);
      setTrip(null);
      setEditing(false);
    },
    style: {
      position: 'fixed',
      top: 'calc(env(safe-area-inset-top) + 14px)',
      left: 16,
      zIndex: 300,
      background: 'transparent',
      border: 'none',
      padding: '4px 8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 14,
    color: COLORS.mute,
    stroke: 2
  }), "My Trips"), /*#__PURE__*/React.createElement(SwipeBackLayer, {
    onBack: swipeBack
  }, screen), /*#__PURE__*/React.createElement(TabBar, {
    tab: tab,
    setTab: function setTab(t) {
      _setTab(t);
      setDayIdx(null);
      setHotelIdx(null);
      setOpenStop(null);
      setEditing(false);
    },
    visible: tabBarVisible,
    editing: editing,
    onToggleEdit: handleEditToggle
  }), /*#__PURE__*/React.createElement(StopSheet, {
    open: openStop,
    dayHue: dayHue,
    onClose: function onClose() {
      return setOpenStop(null);
    },
    onSave: saveStop
  }), cityPicker && /*#__PURE__*/React.createElement(CityPicker, {
    current: city,
    onPick: setCity,
    onClose: function onClose() {
      return setCityPicker(false);
    }
  }), hotelSheet !== null && /*#__PURE__*/React.createElement(HotelSearchSheet, {
    COLORS: COLORS,
    SERIF: SERIF,
    SANS: SANS,
    MONO: MONO,
    Icon: Icon,
    onPick: pickHotelFromSearch,
    onClose: function onClose() {
      return setHotelSheet(null);
    }
  }), /*#__PURE__*/React.createElement(CompanionSheet, {
    open: companionOpen,
    onClose: function onClose() {
      return setCompanionOpen(false);
    },
    authUser: authUser,
    userData: userData,
    onUserDataUpdate: function onUserDataUpdate(ud) {
      return setUserData(ud);
    },
    trips: userTrips
  }), saveConfirm && ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 700,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      borderRadius: 22,
      padding: '28px 24px 20px',
      width: '100%',
      maxWidth: 320,
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 22,
      color: COLORS.ink,
      marginBottom: 8
    }
  }, "\uC218\uC815\uC744 \uC644\uB8CC\uD560\uAE4C\uC694?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 13.5,
      color: COLORS.mute,
      marginBottom: 24,
      lineHeight: 1.5
    }
  }, "\uBCC0\uACBD\uB41C \uB0B4\uC6A9\uC774 \uC800\uC7A5\uB429\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setSaveConfirm(false);
    },
    style: {
      flex: 1,
      padding: '13px',
      border: "1.5px solid ".concat(COLORS.line),
      borderRadius: 14,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 14,
      color: COLORS.mute
    }
  }, "\uACC4\uC18D \uC218\uC815"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setSaveConfirm(false);
      setEditing(false);
    },
    style: {
      flex: 1,
      padding: '13px',
      border: 'none',
      borderRadius: 14,
      background: COLORS.ink,
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 14,
      fontWeight: 600,
      color: '#fff'
    }
  }, "\uC800\uC7A5")))), document.body));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));