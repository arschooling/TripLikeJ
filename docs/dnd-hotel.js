// Drag-and-drop reorder + hotel search
// Exposes: useDragReorder, HotelSearchSheet

// ─── Drag reorder hook ──────────────────────────────────────
// Touch long-press to drag + HTML5 drag for desktop.
// onReorder(fromIdx, toIdx) called on drop.
function useDragReorder(onReorder, enabled = true) {
  // HTML5 (desktop)
  const [dragIdx, setDragIdx] = React.useState(null);
  const [overIdx, setOverIdx] = React.useState(null);

  // Touch long-press drag
  const [td, setTd] = React.useState(null); // {from,to,dy,startY,itemH}
  const tdRef = React.useRef(null);
  const timerRef = React.useRef(null);
  const elRefs = React.useRef({});
  React.useEffect(() => {
    tdRef.current = td;
  }, [td]);

  // Prevent body scroll while touch-dragging
  React.useEffect(() => {
    if (!td) return;
    const stop = e => e.preventDefault();
    document.addEventListener('touchmove', stop, {
      passive: false
    });
    return () => document.removeEventListener('touchmove', stop);
  }, [!!td]);
  const containerProps = {};
  const itemProps = idx => {
    // 수정모드 아닐 때: 카드 롱프레스(430ms)로 드래그
    // 수정모드일 때: 핸들 터치로만 드래그 (카드 롱프레스 비활성)
    const onTouchStart = e => {
      if (enabled) return; // 수정모드에서는 핸들만 사용
      const startY = e.touches[0].clientY;
      timerRef.current = setTimeout(() => {
        const el = elRefs.current[idx];
        const itemH = el ? el.getBoundingClientRect().height : 64;
        if (window.navigator?.vibrate) window.navigator.vibrate(14);
        setTd({
          from: idx,
          to: idx,
          dy: 0,
          startY,
          itemH
        });
      }, 430);
    };
    const onTouchMove = e => {
      clearTimeout(timerRef.current);
      const d = tdRef.current;
      if (!d) return;
      const dy = e.touches[0].clientY - d.startY;
      const count = Object.keys(elRefs.current).length;
      const steps = Math.round(dy / d.itemH);
      const to = Math.max(0, Math.min(count - 1, d.from + steps));
      setTd(prev => prev ? {
        ...prev,
        dy,
        to
      } : null);
    };
    const onTouchEnd = () => {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const d = tdRef.current;
      if (d) {
        if (d.from !== d.to) onReorder(d.from, d.to);
        setTd(null);
      }
    };

    // Visual style
    let style = {};
    let isDragSource = false;
    let isDropTarget = false;
    if (td) {
      const {
        from,
        to,
        dy,
        itemH
      } = td;
      if (idx === from) {
        isDragSource = true;
        style = {
          transform: `translateY(${dy}px) scale(1.035)`,
          transition: 'transform 0s, box-shadow 0.15s, opacity 0.15s',
          zIndex: 50,
          opacity: 0.88,
          position: 'relative',
          boxShadow: '0 16px 40px rgba(0,0,0,0.24), 0 4px 8px rgba(0,0,0,0.12)'
        };
      } else {
        let shift = 0;
        if (from < to && idx > from && idx <= to) shift = -itemH;
        else if (from > to && idx >= to && idx < from) shift = itemH;
        isDropTarget = from !== to && idx === to;
        style = {
          transform: `translateY(${shift}px)`,
          // 더 자연스러운 스프링 모션
          transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
        };
      }
    } else if (enabled) {
      style = {
        opacity: dragIdx === idx ? 0.35 : 1,
        transition: 'opacity 0.15s, transform 0.15s',
        transform: overIdx === idx && dragIdx !== idx ? 'translateY(-2px)' : 'none'
      };
    }

    // HTML5 drag (desktop, gated by enabled)
    const html5 = !enabled ? {} : {
      draggable: true,
      onDragStart: e => {
        setDragIdx(idx);
        e.dataTransfer.effectAllowed = 'move';
        try {
          e.dataTransfer.setData('text/plain', String(idx));
        } catch (_) {}
        const el = e.currentTarget;
        if (el && e.dataTransfer.setDragImage) e.dataTransfer.setDragImage(el, 20, 20);
      },
      onDragOver: e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (overIdx !== idx) setOverIdx(idx);
      },
      onDragEnter: e => {
        e.preventDefault();
        setOverIdx(idx);
      },
      onDrop: e => {
        e.preventDefault();
        const from = dragIdx,
          to = idx;
        setDragIdx(null);
        setOverIdx(null);
        if (from == null || from === to) return;
        onReorder(from, to);
      },
      onDragEnd: () => {
        setDragIdx(null);
        setOverIdx(null);
      }
    };
    // 핸들 터치 시 즉시 드래그 (롱프레스 없이)
    const handleTouchStart = e => {
      clearTimeout(timerRef.current);
      const startY = e.touches[0].clientY;
      const el = elRefs.current[idx];
      const itemH = el ? el.getBoundingClientRect().height : 64;
      if (window.navigator?.vibrate) window.navigator.vibrate(14);
      setTd({ from: idx, to: idx, dy: 0, startY, itemH });
      e.stopPropagation();
    };
    return {
      ref: el => {
        elRefs.current[idx] = el;
      },
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      ...html5,
      style,
      'data-drag-over': !td && enabled && overIdx === idx && dragIdx !== null && dragIdx !== idx,
      'data-drag-source': isDragSource,
      'data-drop-target': isDropTarget,
      handleProps: { onTouchStart: handleTouchStart, onTouchMove, onTouchEnd },
    };
  };
  return {
    containerProps,
    itemProps,
    dragIdx: td ? td.from : dragIdx,
    overIdx: td ? td.to : overIdx,
    isTouchDragging: !!td,
  };
}

// ─── Drag handle component ──────────────────────────────────
function DragHandle({
  size = 18,
  color = '#7A756D',
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) {
  // 터치 영역을 아이콘보다 넓게 — 특히 왼쪽으로 확장
  return /*#__PURE__*/React.createElement("div", {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    style: {
      cursor: 'grab',
      touchAction: 'none',
      flexShrink: 0,
      padding: '10px 8px 10px 14px',   // 왼쪽 14px, 위아래 10px 터치 여유
      margin: '-10px -8px -10px -14px', // 레이아웃 변형 없이 영역만 확장
      display: 'flex',
      alignItems: 'center',
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: color,
    style: { display: 'block', pointerEvents: 'none' }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "6",
    r: "1.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "6",
    r: "1.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "12",
    r: "1.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "12",
    r: "1.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "18",
    r: "1.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "18",
    r: "1.4"
  })));
}

// ─── Sample hotel database (since we can't hit a real API) ──
// Would normally be Booking.com / Google Places API.
const SAMPLE_HOTELS = [{
  name: 'Kimpton Theta New York',
  area: 'Times Square',
  stars: 4,
  price: '$289',
  tags: ['boutique', 'central']
}, {
  name: 'The Manhattan at Times Square',
  area: 'Times Square',
  stars: 3,
  price: '$199',
  tags: ['classic', 'central']
}, {
  name: 'The Standard High Line',
  area: 'Meatpacking',
  stars: 4,
  price: '$359',
  tags: ['design', 'views']
}, {
  name: 'Ace Hotel New York',
  area: 'NoMad',
  stars: 4,
  price: '$329',
  tags: ['design', 'lobby']
}, {
  name: 'The Hoxton, Williamsburg',
  area: 'Brooklyn',
  stars: 4,
  price: '$269',
  tags: ['brooklyn', 'design']
}, {
  name: 'citizenM New York Times Square',
  area: 'Times Square',
  stars: 4,
  price: '$259',
  tags: ['modern', 'compact']
}, {
  name: 'Moxy Times Square',
  area: 'Times Square',
  stars: 3,
  price: '$229',
  tags: ['rooftop', 'young']
}, {
  name: 'The Ludlow Hotel',
  area: 'Lower East Side',
  stars: 4,
  price: '$389',
  tags: ['lounge', 'trendy']
}, {
  name: '1 Hotel Central Park',
  area: 'Midtown',
  stars: 5,
  price: '$549',
  tags: ['eco', 'luxe']
}, {
  name: 'Park Hyatt New York',
  area: 'Midtown West',
  stars: 5,
  price: '$899',
  tags: ['luxe', 'spa']
}, {
  name: 'Pod 51 Hotel',
  area: 'Midtown East',
  stars: 3,
  price: '$159',
  tags: ['budget', 'pod']
}, {
  name: 'Yotel New York',
  area: "Hell's Kitchen",
  stars: 3,
  price: '$189',
  tags: ['compact', 'tech']
}, {
  name: 'The Bowery Hotel',
  area: 'East Village',
  stars: 4,
  price: '$449',
  tags: ['boutique', 'classic']
}, {
  name: 'NoMad Hotel',
  area: 'NoMad',
  stars: 5,
  price: '$519',
  tags: ['library', 'luxe']
}, {
  name: 'Arlo SoHo',
  area: 'SoHo',
  stars: 3,
  price: '$239',
  tags: ['design', 'views']
}, {
  name: 'The Beekman, A Thompson Hotel',
  area: 'Financial District',
  stars: 5,
  price: '$479',
  tags: ['historic', 'luxe']
}];

// Simulated "found in email/calendar" hotels — matching the trip dates
const MAILBOX_HOTELS = [{
  name: 'Kimpton Theta New York',
  area: 'Times Square',
  checkin: 'May 4, 2025',
  checkout: 'May 13, 2025',
  confirmation: 'BK-8471293',
  source: 'Booking.com 예약 확인 · 2025-03-18',
  price: '$289/박 × 9박'
}];

// ─── Korean hotel brand → English mapping ───────────────────
const KOR_HOTEL_BRANDS = {
  '힐튼':'Hilton','메리어트':'Marriott','쉐라톤':'Sheraton','하얏트':'Hyatt',
  '파크하얏트':'Park Hyatt','그랜드하얏트':'Grand Hyatt','안다즈':'Andaz',
  '인터컨티넨탈':'InterContinental','홀리데이인':'Holiday Inn',
  '이비스':'Ibis','노보텔':'Novotel','소피텔':'Sofitel','풀만':'Pullman',
  '롯데':'Lotte','신라':'Shilla','웨스틴':'Westin',
  '포시즌스':'Four Seasons','리츠칼튼':'Ritz-Carlton','르메르디앙':'Le Meridien',
  '더블트리':'DoubleTree','콘래드':'Conrad','라마다':'Ramada',
  '베스트웨스턴':'Best Western','크라운플라자':'Crowne Plaza','코트야드':'Courtyard',
  '레지던스인':'Residence Inn','캔들우드':'Candlewood Suites','인디고':'Hotel Indigo',
  '목시':'Moxy','에이스':'Ace Hotel','오크우드':'Oakwood','앰배서더':'Ambassador',
};

function korToEngHotel(q) {
  let result = q;
  for (const [kor, eng] of Object.entries(KOR_HOTEL_BRANDS)) {
    if (result.includes(kor)) result = result.split(kor).join(eng);
  }
  return result;
}

// ─── Hotel search sheet ─────────────────────────────────────
function HotelSearchSheet({ COLORS, SERIF, SANS, MONO, Icon, onPick, onClose, cityBias }) {
  const [q, setQ] = React.useState('');
  const [tab, setTab] = React.useState('search');
  const [scanning, setScanning] = React.useState(false);
  const [found, setFound] = React.useState(null);
  const [searchRes, setSearchRes] = React.useState([]);
  const [searching, setSearching] = React.useState(false);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    clearTimeout(timerRef.current);
    if (!q.trim()) { setSearchRes([]); setSearching(false); return; }
    setSearching(true);
    timerRef.current = setTimeout(async () => {
      try {
        const engQ = korToEngHotel(q.trim());
        const [bLat, bLon] = cityBias || [];
        const bias = bLat ? `&lat=${bLat}&lon=${bLon}` : '';
        const j = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(engQ)}&limit=12${bias}&osm_tag=tourism:hotel`
        ).then(r => r.json());
        const feats = (j?.features || []).map(f => {
          const p = f.properties;
          return {
            name: p.name || '',
            area: [p.city, p.county, p.state].filter(Boolean)[0] || '',
            address: [p.street, p.housenumber].filter(Boolean).join(' '),
          };
        }).filter(h => h.name);
        setSearchRes(feats);
      } catch(_) {}
      setSearching(false);
    }, 400);
  }, [q]);
  const scanMailbox = () => {
    setScanning(true); setFound(null);
    let i = 0;
    const t = setInterval(() => { i++; if (i >= 4) { clearInterval(t); setScanning(false); setFound(MAILBOX_HOTELS); } }, 600);
  };

  const e = React.createElement;
  const spinStyle = { display:'inline-block', width:16, height:16, borderRadius:8, border:`2px solid transparent`, borderTopColor:COLORS.accent, animation:'hss-spin 0.7s linear infinite', flexShrink:0 };

  return e('div', {
    style: { position:'fixed', inset:0, zIndex:110, background:'rgba(0,0,0,0.35)', display:'flex', flexDirection:'column', justifyContent:'flex-end' },
    onClick: onClose,
  },
    e('style', null, '@keyframes hss-spin { to { transform:rotate(360deg); } }'),
    e('div', { onClick: ev => ev.stopPropagation(), style: { background:COLORS.bg, borderRadius:'22px 22px 0 0', maxHeight:'90%', display:'flex', flexDirection:'column' } },
      // Handle bar
      e('div', { style:{ display:'flex', justifyContent:'center', padding:'8px 0 4px' } },
        e('div', { style:{ width:36, height:4, background:COLORS.line, borderRadius:2 } })
      ),
      // Header
      e('div', { style:{ padding:'6px 20px 8px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 } },
        e('div', { style:{ fontFamily:SERIF, fontSize:24, color:COLORS.ink } }, '호텔 검색'),
        e('button', { onClick:onClose, style:{ width:28, height:28, borderRadius:14, border:'none', background:COLORS.card, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' } },
          e(Icon, { name:'x', size:14, color:COLORS.mute, stroke:2 })
        )
      ),
      // Tabs
      e('div', { style:{ padding:'0 16px 10px', display:'flex', gap:6 } },
        ...[{id:'search',label:'검색'},{id:'mailbox',label:'이메일·캘린더에서 찾기'}].map(t =>
          e('button', { key:t.id, onClick:()=>setTab(t.id),
            style:{ flex:1, border:'none', borderRadius:10, padding:'9px 10px', cursor:'pointer',
              background:tab===t.id ? COLORS.ink : COLORS.card,
              color:tab===t.id ? COLORS.bg : COLORS.ink,
              fontFamily:SANS, fontSize:12, fontWeight:500 } }, t.label)
        )
      ),
      // ── Search tab ──
      tab === 'search' ? e(React.Fragment, null,
        e('div', { style:{ padding:'0 16px 10px' } },
          e('div', { style:{ background:COLORS.card, borderRadius:10, padding:'10px 12px', display:'flex', gap:8, alignItems:'center' } },
            e(Icon, { name:'search', size:14, color:COLORS.mute, stroke:1.8 }),
            e('input', {
              autoFocus: true,
              value: q,
              onChange: ev => setQ(ev.target.value),
              placeholder: '호텔명, 지역 (한글·영어 모두 가능)',
              style: { border:'none', outline:'none', background:'transparent', flex:1, fontFamily:SANS, fontSize:13, color:COLORS.ink },
            }),
            searching && e('div', { style: spinStyle })
          )
        ),
        e('div', { style:{ flex:1, overflow:'auto', padding:'0 16px 40px' } },
          !q.trim() ? (
            e('div', { style:{ padding:'14px 4px', fontFamily:SANS, fontSize:13, color:COLORS.mute, lineHeight:1.6 } },
              '호텔 이름이나 지역을 입력하세요.', e('br', null),
              '힐튼, 메리어트 등 한글 브랜드명도 인식돼요.'
            )
          ) : searching && searchRes.length === 0 ? null :
          searchRes.length === 0 ? (
            e('div', { style:{ padding:20, fontFamily:SANS, fontSize:13, color:COLORS.mute, textAlign:'center' } }, '검색 결과가 없어요')
          ) : (
            e('div', { style:{ background:COLORS.card, borderRadius:14, overflow:'hidden' } },
              ...searchRes.map((h, i) =>
                e('button', {
                  key: i,
                  onClick: () => { onPick(h.name + (h.area ? ' (' + h.area + ')' : '')); onClose(); },
                  style: { width:'100%', border:'none', background:'transparent', padding:'12px 14px', textAlign:'left', cursor:'pointer',
                    borderBottom: i < searchRes.length-1 ? '1px solid ' + COLORS.line : 'none' },
                },
                  e('div', { style:{ fontFamily:SANS, fontSize:13.5, color:COLORS.ink, fontWeight:500 } }, h.name),
                  h.area && e('div', { style:{ marginTop:3, fontFamily:SANS, fontSize:11.5, color:COLORS.mute, display:'flex', gap:5, alignItems:'center' } },
                    e(Icon, { name:'pin', size:11, stroke:1.8 }),
                    e('span', null, [h.address, h.area].filter(Boolean).join(', '))
                  )
                )
              )
            )
          )
        )
      ) :
      // ── Mailbox tab ──
      e('div', { style:{ flex:1, overflow:'auto', padding:'0 16px 40px' } },
        !scanning && !found && e('div', { style:{ background:COLORS.card, borderRadius:14, padding:18 } },
          e('div', { style:{ fontFamily:SERIF, fontSize:18, color:COLORS.ink, lineHeight:1.3 } }, '이메일과 캘린더에서 호텔 예약을 자동으로 찾아드려요'),
          e('div', { style:{ marginTop:8, fontFamily:SANS, fontSize:12.5, color:COLORS.mute, lineHeight:1.5 } }, 'Booking.com, Agoda, Expedia 등의 확인 메일과 구글 캘린더 이벤트를 분석해요.'),
          e('button', { onClick:scanMailbox, style:{ marginTop:14, width:'100%', border:'none', cursor:'pointer', background:COLORS.ink, color:COLORS.bg, borderRadius:12, padding:'13px', fontFamily:SANS, fontSize:14, fontWeight:500, display:'flex', gap:8, alignItems:'center', justifyContent:'center' } },
            e(Icon, { name:'search', size:14, color:COLORS.bg, stroke:1.8 }), '스캔 시작'
          ),
          e('div', { style:{ marginTop:12, display:'flex', gap:6, flexWrap:'wrap' } },
            ...['Gmail','Outlook','Google Calendar','Apple Calendar'].map(s =>
              e('span', { key:s, style:{ padding:'4px 8px', borderRadius:6, background:COLORS.softer, fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.04em' } }, s)
            )
          )
        ),
        scanning && e('div', { style:{ background:COLORS.card, borderRadius:14, padding:24, textAlign:'center' } },
          e('div', { style:{ display:'inline-block', width:36, height:36, borderRadius:18, border:'2.5px solid ' + COLORS.line, borderTopColor:COLORS.accent, animation:'hss-spin 0.8s linear infinite' } }),
          e('div', { style:{ marginTop:14, fontFamily:SANS, fontSize:13, color:COLORS.ink } }, '메일함 스캔 중…'),
          e('div', { style:{ marginTop:4, fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.08em' } }, 'GMAIL · CALENDAR · BOOKING CONFIRMATIONS')
        ),
        found && e(React.Fragment, null,
          e('div', { style:{ padding:'4px 4px 10px', fontFamily:MONO, fontSize:10, color:COLORS.accent, letterSpacing:'0.12em' } }, '✓ ' + found.length + '개 예약 발견'),
          e('div', { style:{ display:'flex', flexDirection:'column', gap:8 } },
            ...found.map((h, i) =>
              e('button', { key:i, onClick:() => { onPick(h); onClose(); },
                style:{ background:COLORS.card, border:'none', borderRadius:14, padding:'14px 16px', textAlign:'left', cursor:'pointer' } },
                e('div', { style:{ fontFamily:SANS, fontSize:14, color:COLORS.ink, fontWeight:600 } }, h.name),
                e('div', { style:{ marginTop:3, fontFamily:SANS, fontSize:12, color:COLORS.mute } }, h.area),
                h.checkin && e('div', { style:{ marginTop:6, fontFamily:MONO, fontSize:10.5, color:COLORS.ink, letterSpacing:'0.05em' } }, h.checkin + ' → ' + h.checkout),
                h.confirmation && e('div', { style:{ marginTop:2, fontFamily:MONO, fontSize:10, color:COLORS.mute } }, '예약번호: ' + h.confirmation),
                h.source && e('div', { style:{ marginTop:4, fontFamily:SANS, fontSize:11, color:COLORS.mute, fontStyle:'italic' } }, h.source),
                e('div', { style:{ marginTop:10, padding:'8px 10px', background:COLORS.softer, borderRadius:8, fontFamily:SANS, fontSize:11.5, color:COLORS.ink, textAlign:'center', fontWeight:500 } }, '이 호텔로 설정하기 →')
              )
            )
          )
        )
      )
    )
  );
}
Object.assign(window, {
  useDragReorder,
  DragHandle,
  HotelSearchSheet
});
