// NYC Travel App — restructured
// - Trips list (top level) -> pick a trip -> Home
// - Per-page edit (no global toggle)
// - Hotel detail page + multi-hotel schedule
// - Fully editable prep page

// iOS PWA 햅틱 (checkbox trick)
function haptic(style = 'light') {
  try {
    const el = document.createElement('input');
    el.type = 'checkbox';
    el.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
    document.body.appendChild(el);
    el.focus(); el.click();
    document.body.removeChild(el);
  } catch(e) {}
}

const COLORS = {
  bg:'#F5F2EC', card:'#FFFFFF', ink:'#1A1816', mute:'#7A756D',
  line:'rgba(26,24,22,0.08)', accent:'#C14F2E', soft:'#E9E3D7', softer:'#EFEAE0',
};
const SERIF = '"Instrument Serif", Georgia, serif';
const SANS  = '-apple-system, "SF Pro Text", system-ui, sans-serif';
const MONO  = '"JetBrains Mono", ui-monospace, monospace';
// 기존 여행 hue와 겹치지 않는 hue 선택
function pickUniqueHue(existingHues) {
  if (!existingHues || !existingHues.length) return Math.floor(Math.random() * 360);
  const MIN_DIST = 40;
  const candidates = [];
  for (let h = 0; h < 360; h += 8) {
    const minDist = Math.min(...existingHues.map(e => {
      const d = Math.abs(h - e); return Math.min(d, 360 - d);
    }));
    if (minDist >= MIN_DIST) candidates.push({ h, minDist });
  }
  if (!candidates.length) {
    // 모든 색이 꽉 찼으면 가장 멀리 떨어진 것 선택
    const all = [];
    for (let h = 0; h < 360; h += 8) {
      const minDist = Math.min(...existingHues.map(e => { const d=Math.abs(h-e); return Math.min(d,360-d); }));
      all.push({ h, minDist });
    }
    all.sort((a,b) => b.minDist - a.minDist);
    return all[0].h;
  }
  candidates.sort((a,b) => b.minDist - a.minDist);
  const top = candidates.filter(c => c.minDist >= candidates[0].minDist - 5);
  return top[Math.floor(Math.random() * top.length)].h;
}

// 탭바 위에 시트가 뜨도록 하는 bottom 오프셋

const CAT_META = {
  flight:{icon:'flight',label:'Flight'}, hotel:{icon:'hotel',label:'Stay'},
  walk:{icon:'walk',label:'Walk'}, food:{icon:'food',label:'Eat'},
  view:{icon:'view',label:'View'}, ferry:{icon:'ferry',label:'Ferry'},
  sight:{icon:'sight',label:'Sight'}, shop:{icon:'shop',label:'Shop'},
  show:{icon:'show',label:'Show'}, bar:{icon:'bar',label:'Bar'},
};

// ─── Persistence: session nav only (data in Firestore) ───────

// ─── Icons ──────────────────────────────────────────────────
const Icon = ({ name, size=16, color='currentColor', stroke=1.6 }) => {
  const p = { width:size, height:size, viewBox:'0 0 24 24', fill:'none',
              stroke:color, strokeWidth:stroke, strokeLinecap:'round', strokeLinejoin:'round' };
  switch (name) {
    case 'flight': return <svg {...p}><path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l4 5-3 3h2l3 2 5 4 .5-.8Z"/></svg>;
    case 'hotel':  return <svg {...p}><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21v-6h6v6"/></svg>;
    case 'walk':   return <svg {...p}><circle cx="13" cy="4" r="2"/><path d="m15 21-3-5-3 2-2-4 5-4 4 4 3 1"/></svg>;
    case 'food':   return <svg {...p}><path d="M4 2v10a4 4 0 0 0 8 0V2"/><path d="M8 2v20"/><path d="M17 2c-1.5 0-3 1-3 4v8h3v8"/></svg>;
    case 'view':   return <svg {...p}><path d="M2 22V9l10-7 10 7v13"/><path d="M9 22v-8h6v8"/><path d="M12 2v5"/></svg>;
    case 'ferry':  return <svg {...p}><path d="M2 20a3 3 0 0 0 3-1 3 3 0 0 1 5 0 3 3 0 0 0 5 0 3 3 0 0 1 5 0 3 3 0 0 0 2 1"/><path d="M4 18 3 9h18l-1 9"/><path d="M12 3v6"/></svg>;
    case 'sight':  return <svg {...p}><path d="M4 21V8l8-5 8 5v13"/><path d="M12 3v18"/><path d="M4 13h16"/></svg>;
    case 'shop':   return <svg {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
    case 'show':   return <svg {...p}><rect x="2" y="6" width="20" height="14" rx="2"/><path d="m16 2-4 4-4-4"/><path d="M12 12v4"/><path d="M10 14h4"/></svg>;
    case 'bar':    return <svg {...p}><path d="M8 22h8"/><path d="M12 16v6"/><path d="M4 3h16l-8 11z"/></svg>;
    case 'car':    return <svg {...p}><path d="M5 12L7 7h10l2 5"/><rect x="2" y="12" width="20" height="6" rx="2"/><circle cx="7" cy="21" r="2"/><circle cx="17" cy="21" r="2"/></svg>;
    case 'bus':    return <svg {...p}><rect x="3" y="3" width="18" height="15" rx="3"/><path d="M3 9h18M7 18v2M17 18v2"/><circle cx="7.5" cy="13.5" r="1.5"/><circle cx="16.5" cy="13.5" r="1.5"/></svg>;
    case 'map':    return <svg {...p}><path d="M3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"/><path d="M9 3v15"/><path d="M15 6v15"/></svg>;
    case 'clock':  return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'chevron':return <svg {...p}><path d="m9 6 6 6-6 6"/></svg>;
    case 'chevron-l': return <svg {...p}><path d="m15 6-6 6 6 6"/></svg>;
    case 'chevron-d': return <svg {...p}><path d="m6 9 6 6 6-6"/></svg>;
    case 'search': return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>;
    case 'heart':  return <svg {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>;
    case 'user':   return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case 'more':   return <svg {...p}><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></svg>;
    case 'pin':    return <svg {...p}><path d="M12 22s8-8 8-13a8 8 0 1 0-16 0c0 5 8 13 8 13z"/><circle cx="12" cy="9" r="3"/></svg>;
    case 'check':  return <svg {...p}><path d="m5 12 5 5L20 7"/></svg>;
    case 'sun':    return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>;
    case 'cloud':  return <svg {...p}><path d="M18 18a4 4 0 0 0 0-8 6 6 0 0 0-11.5-1.5A4 4 0 0 0 6 18z"/></svg>;
    case 'book':   return <svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
    case 'edit':   return <svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>;
    case 'trash':  return <svg {...p}><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>;
    case 'plus':   return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'x':      return <svg {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case 'share':  return <svg {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>;
    case 'users':  return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'save':   return <svg {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>;
    case 'refresh':return <svg {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>;
    case 'globe':  return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case 'nav':    return <svg {...p}><path d="m3 11 19-8-8 19-2-8z"/></svg>;
    case 'phone':   return <svg {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.9 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>;
    case 'sparkle': return <svg {...p}><path d="M12 3 9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5z"/></svg>;
    case 'wallet':  return <svg {...p}><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M16 12h.01"/><path d="M2 10h20"/></svg>;
    case 'minus':      return <svg {...p}><path d="M5 12h14"/></svg>;
    case 'calculator': return <svg {...p}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h2M12 10h2M16 10h.01M8 14h2M12 14h2M16 14h2M8 18h2M12 18h2M16 18h2"/></svg>;
    case 'bell':       return <svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
    default: return null;
  }
};

// ─── Photo placeholder ──────────────────────────────────────
function Photo({ hue=20, label='', height=180, small=false }) {
  const bg=`oklch(0.88 0.035 ${hue})`, bg2=`oklch(0.80 0.045 ${hue})`;
  const ink=`oklch(0.36 0.04 ${hue})`;
  return (
    <div style={{
      width:'100%', height,
      background:`repeating-linear-gradient(135deg, ${bg} 0 14px, ${bg2} 14px 15px), linear-gradient(180deg, ${bg} 0%, ${bg2} 100%)`,
      position:'relative', overflow:'hidden',
      display:'flex', alignItems:'flex-end', padding:small?8:14, boxSizing:'border-box',
    }}>
      <div style={{ position:'absolute', inset:0,
        background:`radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.35), transparent 60%)` }}/>
      {label && !small && <div style={{
        fontFamily:MONO, fontSize:10, letterSpacing:'0.14em',
        color:ink, opacity:0.72, textTransform:'uppercase', position:'relative',
      }}>{label}</div>}
    </div>
  );
}

// ─── Google Maps URLs ───────────────────────────────────────
function mapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function mapsDirectionsUrl(destination) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=transit`;
}

// ─── Edit button (small pencil) ─────────────────────────────
function EditBtn({ editing, onClick, compact }) {
  return (
    <button onClick={onClick} style={{
      border:'none', cursor:'pointer',
      background: editing ? COLORS.accent : 'rgba(26,24,22,0.06)',
      color: editing ? '#fff' : COLORS.ink,
      borderRadius: 14, padding: compact ? '5px 9px' : '6px 12px',
      display:'flex', gap:5, alignItems:'center',
      fontFamily:SANS, fontSize:11.5, fontWeight:500,
    }}>
      <Icon name={editing ? 'check' : 'edit'} size={12}
        color={editing ? '#fff' : COLORS.ink} stroke={2}/>
      {editing ? '완료' : '편집'}
    </button>
  );
}

// ─── Swipeable row (swipe-left to reveal edit/delete) ────────
function SwipeableRow({ children, onEdit, onDelete, disabled, isDragging, wrapStyle = {}, editIcon, editBg, editLabel, deleteLabel, cardSwipe }) {
  const [x, setX]             = React.useState(0);
  const [open, setOpen]       = React.useState(false);
  const [flying, setFlying]   = React.useState(false);  // 날아가는 중
  const [collapseH, setCollapseH] = React.useState(null); // null=auto, px=고정, 0=접힘
  const outerRef  = React.useRef(null);
  const startRef  = React.useRef(null);
  const dragging  = React.useRef(false);
  const xRef      = React.useRef(0);
  const REVEAL     = editLabel ? 130 : onEdit ? 104 : deleteLabel ? 65 : 58;
  const DELETE_EXTRA = 72;

  const close = () => { setX(0); xRef.current = 0; setOpen(false); };
  React.useEffect(() => { if (disabled) close(); }, [disabled]);
  React.useEffect(() => { if (isDragging) close(); }, [isDragging]);

  // 카드를 화면 밖으로 날린 뒤 높이를 접고 onDelete 호출
  const flyOff = () => {
    if (flying) return;
    const h = outerRef.current?.offsetHeight || 0;
    if (h) setCollapseH(h); // 현재 높이 고정 (접기 시작점)
    setFlying(true);
    const w = window.innerWidth || 400;
    setX(-w); xRef.current = -w;
    // ① 카드 날아감(260ms) → ② 높이 접힘(160ms) → ③ onDelete
    setTimeout(() => {
      setCollapseH(0);
      setTimeout(() => onDelete?.(), 160);
    }, 260);
  };

  const onTouchStart = (e) => {
    if (disabled || flying) return;
    startRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    dragging.current = false;
  };
  const onTouchMove = (e) => {
    if (!startRef.current || flying) return;
    const dx = e.touches[0].clientX - startRef.current.x;
    const dy = Math.abs(e.touches[0].clientY - startRef.current.y);
    if (!dragging.current) {
      if (Math.abs(dx) < 18) return;
      if (dy > Math.abs(dx) * 0.55) return;
      dragging.current = true;
    }
    const base = open ? -REVEAL : 0;
    const raw = base + dx;
    const clamped = open
      ? Math.max(-(REVEAL + DELETE_EXTRA + 16), Math.min(0, raw))
      : Math.max(-REVEAL, Math.min(0, raw));
    xRef.current = clamped;
    setX(clamped);
  };
  const onTouchEnd = () => {
    if (!startRef.current) return;
    const wasDragging = dragging.current;
    startRef.current = null; dragging.current = false;
    if (!wasDragging) return;

    const cur = xRef.current;
    if (cur < -(REVEAL + DELETE_EXTRA / 2)) {
      flyOff(); // 충분히 당겼으면 날려버리기
    } else if (cur < -REVEAL / 2) {
      xRef.current = -REVEAL; setX(-REVEAL); setOpen(true);
    } else {
      close();
    }
  };

  const flyTransition  = 'transform 0.26s cubic-bezier(0.4,0,1,1)';
  const snapTransition = 'transform 0.28s cubic-bezier(0.22,1,0.36,1)';

  // 높이 접힘 래퍼 스타일
  const collapseStyle = collapseH !== null ? {
    height: collapseH,
    overflow: 'hidden',
    transition: collapseH === 0 ? 'height 0.16s ease-in' : 'none',
  } : {};

  if (cardSwipe) {
    return (
      // 높이 접힘용 래퍼 (overflow:hidden은 접힐 때만)
      // flex:1을 여기에 적용해야 부모 flex row에서 남은 너비를 차지함
      <div ref={outerRef} style={{ flex: wrapStyle.flex, ...collapseStyle }}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        {/* overflow 없음 → 카드가 컨테이너 밖으로 자유롭게 이동 */}
        <div style={{ position:'relative', ...wrapStyle, flex: undefined }}>
          {/* 버튼들: 카드 뒤에, 날아가는 동안 숨김 */}
          {!flying && (
            <div style={{
              position:'absolute', right:0, top:0, bottom:0,
              display:'flex', alignItems:'center', justifyContent:'flex-end',
              gap:8, paddingRight:10,
            }}>
              {onEdit && (
                <button onClick={(e)=>{e.stopPropagation(); close(); setTimeout(onEdit,100);}} style={{
                  minWidth: editLabel ? 56 : 38, height: editLabel ? 36 : 38,
                  borderRadius: editLabel ? 10 : 19, border:'none', cursor:'pointer',
                  background: editBg || '#ffa500', flexShrink:0, padding: editLabel ? '0 12px' : 0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {editLabel
                    ? <span style={{ fontFamily:'system-ui,sans-serif', fontSize:11, fontWeight:600, color:'#fff' }}>{editLabel}</span>
                    : <Icon name={editIcon||'edit'} size={14} color="#fff" stroke={2}/>}
                </button>
              )}
              <button onClick={(e)=>{e.stopPropagation(); flyOff();}} style={{
                minWidth: deleteLabel ? 48 : 38, height: deleteLabel ? 36 : 38,
                borderRadius: deleteLabel ? 10 : 19, border:'none', cursor:'pointer',
                background:'#B5451B', flexShrink:0, padding: deleteLabel ? '0 12px' : 0,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                {deleteLabel
                  ? <span style={{ fontFamily:'system-ui,sans-serif', fontSize:11, fontWeight:600, color:'#fff' }}>{deleteLabel}</span>
                  : <Icon name="trash" size={14} color="#fff" stroke={2}/>}
              </button>
            </div>
          )}
          {/* 카드: position:relative + zIndex:1 → 이웃 카드 위에 표시되며 프레임 밖으로 이동 */}
          <div style={{
            position:'relative', zIndex:1,
            transform:`translateX(${x}px)`,
            transition: flying ? flyTransition : dragging.current ? 'none' : snapTransition,
            willChange:'transform', WebkitTapHighlightColor:'transparent',
          }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={outerRef} style={collapseStyle}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div style={{ position:'relative', overflow:'hidden', ...wrapStyle }}>
        <div style={{
          display:'flex', width:`calc(100% + ${REVEAL}px)`,
          transform:`translateX(${x}px)`,
          transition: flying ? flyTransition : dragging.current ? 'none' : snapTransition,
          willChange:'transform',
          WebkitTapHighlightColor:'transparent',
        }}>
          <div style={{ flex:1, minWidth:0 }}>
            {children}
          </div>
          <div style={{
            width:REVEAL, flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          }}>
            {onEdit && (
              <button onClick={(e)=>{e.stopPropagation(); close(); setTimeout(onEdit,100);}} style={{
                width: editLabel ? 46 : 38, height: editLabel ? 34 : 38,
                borderRadius: editLabel ? 9 : 19,
                border:'none', cursor:'pointer',
                background: editBg || '#ffa500', flexShrink:0,
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2,
              }}>
                {editLabel
                  ? <span style={{ fontFamily:SANS, fontSize:10, fontWeight:600, color:'#fff' }}>{editLabel}</span>
                  : <Icon name={editIcon||'edit'} size={14} color="#fff" stroke={2}/>}
              </button>
            )}
            <button onClick={(e)=>{e.stopPropagation(); flyOff();}} style={{
              width: deleteLabel ? 46 : 38, height: deleteLabel ? 34 : 38,
              borderRadius: deleteLabel ? 9 : 19,
              border:'none', cursor:'pointer',
              background:'#B5451B', flexShrink:0,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2,
            }}>
              {deleteLabel
                ? <span style={{ fontFamily:SANS, fontSize:10, fontWeight:600, color:'#fff' }}>{deleteLabel}</span>
                : <Icon name="trash" size={14} color="#fff" stroke={2}/>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Swipe-back edge gesture wrapper ─────────────────────────
function SwipeBackLayer({ onBack, children }) {
  const [dx, setDx] = React.useState(0);
  const [slidingOut, setSlidingOut] = React.useState(false);
  const startRef = React.useRef(null);
  const draggingRef = React.useRef(false);
  const dxRef = React.useRef(0);
  const containerRef = React.useRef(null);
  const canBackRef = React.useRef(!!onBack);
  const slidingRef = React.useRef(false);
  const onBackRef = React.useRef(onBack);

  React.useEffect(() => { canBackRef.current = !!onBack; onBackRef.current = onBack; }, [onBack]);
  React.useEffect(() => { slidingRef.current = slidingOut; }, [slidingOut]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e) => {
      if (!canBackRef.current || slidingRef.current) return;
      const t = e.touches[0];
      if (t.clientX > 28) return;
      startRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
      draggingRef.current = false;
    };
    const onTouchMove = (e) => {
      if (!startRef.current) return;
      const t = e.touches[0];
      const dX = t.clientX - startRef.current.x;
      const dY = Math.abs(t.clientY - startRef.current.y);
      if (!draggingRef.current) {
        if (dY > Math.abs(dX) + 8) { startRef.current = null; return; }
        if (dX > 6) draggingRef.current = true;
        else return;
      }
      e.preventDefault();
      const v = Math.max(0, dX);
      dxRef.current = v;
      setDx(v);
    };
    const onTouchEnd = () => {
      if (!startRef.current) return;
      const elapsed = Date.now() - startRef.current.t;
      const v = dxRef.current;
      startRef.current = null;
      draggingRef.current = false;
      if (v > 90 || (v > 40 && elapsed < 280)) {
        slidingRef.current = true;
        setSlidingOut(true);
        setDx(window.innerWidth || 400);
        setTimeout(() => {
          if (onBackRef.current) onBackRef.current();
          setDx(0); setSlidingOut(false); slidingRef.current = false; dxRef.current = 0;
        }, 220);
      } else {
        setDx(0); dxRef.current = 0;
      }
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position:'relative', overflowX:'hidden' }}>
      <div style={{
        transform: `translateX(${dx}px)`,
        transition: (dx === 0 || slidingOut) ? 'transform 220ms cubic-bezier(0.22,1,0.36,1)' : 'none',
        willChange: 'transform',
      }}>
        {children}
      </div>
      {dx > 0 && (
        <div style={{
          position:'fixed', inset:0, pointerEvents:'none',
          background:`linear-gradient(90deg, rgba(0,0,0,${Math.min(0.15, dx/1000)}), transparent 35%)`,
        }}/>
      )}
    </div>
  );
}

// ─── 키보드 높이 감지 (iOS visualViewport) ───────────────────
function useKeyboardHeight() {
  const [kbh, setKbh] = React.useState(0);
  React.useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setKbh(Math.max(0, window.innerHeight - vv.height));
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => { vv.removeEventListener('resize', update); vv.removeEventListener('scroll', update); };
  }, []);
  return kbh;
}

// ─── Popup sheet (centered modal with swipe-down dismiss) ────
function BottomSheet({ open, onClose, children, title, onConfirm, confirmLabel='완료', noDragClose=false }) {
  const [mounted, setMounted] = React.useState(open);
  const [visible, setVisible] = React.useState(false);
  const [drag, setDrag] = React.useState(0);
  const startY = React.useRef(null);
  const kbh = useKeyboardHeight();

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      setDrag(0);
      // 배경 스크롤 잠금
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      const t = setTimeout(() => { setMounted(false); setDrag(0); }, 260);
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!mounted) return null;

  // Touch handlers on the whole popup; drag only engages on gesture.
  const onTouchStart = (e) => { if (noDragClose) return; startY.current = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    if (noDragClose || startY.current == null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) setDrag(dy);
  };
  const onTouchEnd = () => {
    if (noDragClose) return;
    if (drag > 80) onClose();
    else setDrag(0);
    startY.current = null;
  };
  // Also handle mouse drag on the handle area for desktop testing
  const onMouseDown = (e) => {
    startY.current = e.clientY;
    const move = (ev) => {
      const dy = ev.clientY - startY.current;
      if (dy > 0) setDrag(dy);
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      if (drag > 80) onClose(); else setDrag(0);
      startY.current = null;
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  // portal로 document.body에 직접 렌더링 → transform 부모의 영향 없이 정확히 viewport 중앙에 표시
  return ReactDOM.createPortal(
    <div style={{
      position:'fixed', inset:0, zIndex:1200,
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:`20px 18px ${20 + kbh}px`,
      background: visible && drag < 80 ? 'rgba(20,16,14,0.42)' : 'rgba(20,16,14,0)',
      transition:'background 240ms ease, padding 0.2s ease',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{
          background:COLORS.bg, width:'100%', maxWidth:360,
          borderRadius:22,
          boxShadow:'0 24px 60px rgba(0,0,0,0.22), 0 4px 14px rgba(0,0,0,0.08)',
          transform: visible
            ? `translateY(${drag}px) scale(${Math.max(0.94, 1 - drag/600)})`
            : 'translateY(40px) scale(0.94)',
          opacity: visible ? Math.max(0, 1 - drag/240) : 0,
          transition: drag === 0
            ? 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease'
            : 'none',
          overflow:'hidden',
      }}>
        <div onMouseDown={onMouseDown}
          style={{ display:'flex', justifyContent:'center', paddingTop:10, cursor:'grab' }}>
          <div style={{ width:40, height:4, background:COLORS.line, borderRadius:2 }}/>
        </div>
        <div style={{ padding:'10px 18px 4px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={onClose} style={{
            border:'none', background:'transparent', cursor:'pointer',
            fontFamily:SANS, fontSize:13, color:COLORS.mute, padding:'4px 2px',
          }}>취소</button>
          <div style={{ fontFamily:SERIF, fontSize:15, color:COLORS.ink }}>{title}</div>
          <button onClick={onConfirm} style={{
            border:'none', background:'transparent', cursor:'pointer',
            fontFamily:SANS, fontSize:13, fontWeight:600, color:COLORS.accent, padding:'4px 2px',
          }}>{confirmLabel}</button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

// ─── Custom date picker (year/month scroll + calendar) ────────
function DatePickerSheet({ open, value, onClose, onPick, minDate, title='날짜 선택' }) {
  const parseIso = (s) => {
    const m = (s || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return null;
    return { y: +m[1], mo: +m[2]-1, d: +m[3] };
  };
  const todayObj = new Date();
  const initial = parseIso(value) || parseIso(minDate) || { y: todayObj.getFullYear(), mo: todayObj.getMonth(), d: todayObj.getDate() };

  const [view, setView]     = React.useState({ y: initial.y, mo: initial.mo });
  const [selected, setSelected] = React.useState(parseIso(value));
  const [pickingYM, setPickingYM] = React.useState(false); // 년/월 선택 모드

  React.useEffect(() => {
    if (open) {
      const s = parseIso(value) || initial;
      setView({ y: s.y, mo: s.mo });
      setSelected(parseIso(value));
      setPickingYM(false);
    }
  }, [open, value]);

  const MONTH_KR = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const DOW = ['일','월','화','수','목','금','토'];
  const min = parseIso(minDate);

  const isBefore = (y1, mo1, d1, mn) => {
    if (!mn) return false;
    if (y1 !== mn.y) return y1 < mn.y;
    if (mo1 !== mn.mo) return mo1 < mn.mo;
    return d1 < mn.d;
  };

  const confirm = () => {
    if (!selected) { onClose(); return; }
    const iso = `${selected.y}-${String(selected.mo+1).padStart(2,'0')}-${String(selected.d).padStart(2,'0')}`;
    onPick(iso); onClose();
  };

  // ── 년/월 스크롤 선택기 ────────────────────────────────────
  const YEAR_STRS = React.useMemo(() => Array.from({ length: 10 }, (_, i) => String(todayObj.getFullYear() - 2 + i)), []);
  const [tmpY,  setTmpY]  = React.useState(String(view.y));
  const [tmpMo, setTmpMo] = React.useState(MONTH_KR[view.mo]);

  // ── 달력 그리드 ───────────────────────────────────────────
  const Calendar = () => {
    const firstDow  = new Date(view.y, view.mo, 1).getDay();
    const daysInMo  = new Date(view.y, view.mo+1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMo; d++) cells.push(d);
    return (
      <>
        <div style={{ padding:'0 14px 2px', display:'grid', gridTemplateColumns:'repeat(7, 1fr)' }}>
          {DOW.map((w, i) => (
            <div key={i} style={{ textAlign:'center', fontFamily:MONO, fontSize:9.5, letterSpacing:'0.08em',
              color: i===0 ? COLORS.accent : i===6 ? 'oklch(60% 0.06 250)' : COLORS.mute, padding:'4px 0' }}>{w}</div>
          ))}
        </div>
        <div style={{ padding:'0 14px 14px', display:'grid', gridTemplateColumns:'repeat(7, 1fr)' }}>
          {cells.map((d, i) => {
            if (d === null) return <div key={i}/>;
            const dow    = (firstDow + d - 1) % 7;
            const isSel  = selected && selected.y===view.y && selected.mo===view.mo && selected.d===d;
            const isToday= todayObj.getFullYear()===view.y && todayObj.getMonth()===view.mo && todayObj.getDate()===d;
            const disabled = isBefore(view.y, view.mo, d, min);
            return (
              <button key={i} disabled={disabled}
                onClick={() => setSelected({ y:view.y, mo:view.mo, d })}
                style={{ aspectRatio:'1/1', border:'none', cursor:disabled?'default':'pointer',
                  borderRadius:'50%', margin:1, background:isSel?COLORS.ink:'transparent',
                  color: disabled?'oklch(82% 0.01 50)': isSel?'#fff': dow===0?COLORS.accent: COLORS.ink,
                  fontFamily:SANS, fontSize:13, fontWeight:isSel?600:400,
                  position:'relative', padding:0, display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'background 140ms' }}>
                {d}
                {isToday && !isSel && (
                  <span style={{ position:'absolute', bottom:4, width:3, height:3, borderRadius:'50%', background:COLORS.accent }}/>
                )}
              </button>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={title} onConfirm={confirm} noDragClose={pickingYM}>
      {/* 년/월 헤더 — 탭하면 스크롤 선택기로 전환 */}
      <div style={{ padding:'8px 16px 6px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <button onClick={() => { if (!pickingYM){ setTmpY(String(view.y)); setTmpMo(MONTH_KR[view.mo]); } setPickingYM(p=>!p); }} style={{
          border:'none', background:COLORS.softer, borderRadius:10, cursor:'pointer',
          fontFamily:SERIF, fontSize:17, color:COLORS.ink, padding:'5px 12px',
          display:'flex', alignItems:'center', gap:6,
        }}>
          {view.y}년 {MONTH_KR[view.mo]}
          <Icon name={pickingYM?'chevron-d':'chevron-d'} size={12} color={COLORS.mute} stroke={2.5}/>
        </button>
        {!pickingYM && (
          <div style={{ display:'flex', gap:4 }}>
            <button onClick={() => { let {y,mo}=view; mo--; if(mo<0){mo=11;y--;} setView({y,mo}); }} style={{
              width:30, height:30, borderRadius:15, border:'none', cursor:'pointer',
              background:COLORS.card, display:'flex', alignItems:'center', justifyContent:'center',
            }}><Icon name="chevron-l" size={14} color={COLORS.ink} stroke={2}/></button>
            <button onClick={() => { let {y,mo}=view; mo++; if(mo>11){mo=0;y++;} setView({y,mo}); }} style={{
              width:30, height:30, borderRadius:15, border:'none', cursor:'pointer',
              background:COLORS.card, display:'flex', alignItems:'center', justifyContent:'center',
            }}><Icon name="chevron" size={14} color={COLORS.ink} stroke={2}/></button>
          </div>
        )}
      </div>

      {pickingYM ? (
        /* 년/월 스크롤 선택 */
        <div>
          <div style={{ display:'flex', justifyContent:'center', gap:12, padding:'4px 16px 8px', touchAction:'none' }}>
            <WheelColumn items={YEAR_STRS} value={tmpY} onChange={setTmpY} width={100} compact={true}/>
            <WheelColumn items={MONTH_KR} value={tmpMo} onChange={setTmpMo} width={80} compact={true} loop={true}/>
          </div>
          <div style={{ padding:'0 16px 14px' }}>
            <button onClick={() => { setView({ y:+tmpY, mo:MONTH_KR.indexOf(tmpMo) }); setPickingYM(false); }} style={{
              width:'100%', padding:'13px', border:'none', borderRadius:14,
              background:COLORS.ink, color:'#fff',
              fontFamily:SANS, fontSize:14, fontWeight:500, cursor:'pointer',
            }}>이 달 달력 보기</button>
          </div>
        </div>
      ) : (
        <Calendar/>
      )}
    </BottomSheet>
  );
}

// ─── Time Picker ────────────────────────────────────────────
function TimeField({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const MINS_RAW = [0,5,10,15,20,25,30,35,40,45,50,55];
  const HOUR_STRS = React.useMemo(() => Array.from({length:24}, (_,i) => String(i).padStart(2,'0')), []);
  const MIN_STRS  = React.useMemo(() => MINS_RAW.map(x => String(x).padStart(2,'0')), []);
  const parse = (v) => {
    const m = (v||'').match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return { h:'09', mn:'00' };
    const h = String(parseInt(m[1]) % 24).padStart(2,'0');
    const raw = parseInt(m[2]);
    const mn = String(MINS_RAW.reduce((best, x) => Math.abs(x-raw) < Math.abs(best-raw) ? x : best, 0)).padStart(2,'0');
    return { h, mn };
  };
  const { h, mn } = parse(value);
  const emit = (newH, newMn) => onChange(`${newH}:${newMn}`);
  if (!open) return (
    <button type="button" onClick={() => setOpen(true)} style={{
      width:'100%', padding:'8px 10px', borderRadius:8,
      border:`1px solid ${COLORS.line}`, background:COLORS.card,
      fontFamily:MONO, fontSize:14, color:COLORS.ink, cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      {value || '09:00'}
    </button>
  );
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4, padding:'4px 0', touchAction:'none' }}>
        <WheelColumn items={HOUR_STRS} value={h} onChange={v => emit(v, mn)} width={75} compact={true} loop={true}/>
        <div style={{ fontFamily:MONO, fontSize:24, fontWeight:600, color:COLORS.ink,
          lineHeight:1, userSelect:'none' }}>:</div>
        <WheelColumn items={MIN_STRS} value={mn} onChange={v => emit(h, v)} width={75} compact={true} loop={true}/>
      </div>
      <button type="button" onClick={() => setOpen(false)} style={{
        width:'100%', marginTop:4, padding:'7px', borderRadius:8, border:'none',
        background:COLORS.softer, fontFamily:SANS, fontSize:12,
        color:COLORS.mute, cursor:'pointer',
      }}>완료</button>
    </div>
  );
}

// ─── Date Range Picker ───────────────────────────────────────
function DateRangeSheet({ open, startIso, endIso, onClose, onPick }) {
  const parseIso = s => { const m=(s||'').match(/^(\d{4})-(\d{2})-(\d{2})/); return m?{y:+m[1],mo:+m[2]-1,d:+m[3]}:null; };
  const toIso = o => o?`${o.y}-${String(o.mo+1).padStart(2,'0')}-${String(o.d).padStart(2,'0')}`:null;
  const cmp = (a,b) => !a||!b?0:a.y!==b.y?(a.y<b.y?-1:1):a.mo!==b.mo?(a.mo<b.mo?-1:1):a.d!==b.d?(a.d<b.d?-1:1):0;

  const today = new Date();
  const [view,    setView]    = React.useState({y:today.getFullYear(), mo:today.getMonth()});
  const [start,   setStart]   = React.useState(null);
  const [end,     setEnd]     = React.useState(null);
  const [picking, setPicking] = React.useState('start');
  const [showYM,  setShowYM]  = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const s = parseIso(startIso), e = parseIso(endIso);
    setStart(s); setEnd(e);
    setView(s ? {y:s.y, mo:s.mo} : {y:today.getFullYear(), mo:today.getMonth()});
    setPicking('start'); setShowYM(false);
  }, [open]);

  const handleDay = d => {
    const clicked = {y:view.y, mo:view.mo, d};
    if (picking === 'start') { setStart(clicked); setEnd(null); setPicking('end'); }
    else {
      if (cmp(clicked, start) < 0) { setStart(clicked); setEnd(null); }
      else { setEnd(clicked); }
    }
  };

  const prevMonth = () => { let {y,mo}=view; mo--; if(mo<0){mo=11;y--;} setView({y,mo}); };
  const nextMonth = () => { let {y,mo}=view; mo++; if(mo>11){mo=0;y++;} setView({y,mo}); };

  const MONTH_KR = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const DOW = ['일','월','화','수','목','금','토'];

  const firstDow = new Date(view.y, view.mo, 1).getDay();
  const daysInMo = new Date(view.y, view.mo+1, 0).getDate();
  const cells = [];
  for (let i=0; i<firstDow; i++) cells.push(null);
  for (let d=1; d<=daysInMo; d++) cells.push(d);

  const isSt  = d => start && start.y===view.y && start.mo===view.mo && start.d===d;
  const isEn  = d => end   && end.y===view.y   && end.mo===view.mo   && end.d===d;
  const inRng = d => { if(!start||!end) return false; const c={y:view.y,mo:view.mo,d}; return cmp(c,start)>0 && cmp(c,end)<0; };
  const fmtDate = o => o ? `${o.y}. ${o.mo+1}. ${o.d}.` : null;

  const YEARS_LIST  = Array.from({length:12}, (_,i) => String(today.getFullYear()-2+i));

  return (
    <BottomSheet open={open} onClose={onClose} title="기간 선택" noDragClose={showYM}
      onConfirm={() => { if(!start){onClose();return;} onPick(toIso(start),toIso(end)); onClose(); }}>

      {/* 시작/종료 상태 바 */}
      {!showYM && <div style={{margin:'4px 16px 14px', display:'flex', borderRadius:14, border:`1px solid ${COLORS.line}`, overflow:'hidden'}}>
        {['start','end'].map((k,ki) => {
          const val = k==='start' ? start : end;
          const active = picking===k;
          return (
            <button key={k} onClick={()=>{ setPicking(k); setShowYM(false); }} style={{
              flex:1, padding:'10px 14px', border:'none', cursor:'pointer', textAlign:'left',
              background: active ? COLORS.ink : 'transparent',
              borderRight: ki===0 ? `1px solid ${COLORS.line}` : 'none',
            }}>
              <div style={{fontFamily:MONO, fontSize:9, letterSpacing:'0.12em', marginBottom:3,
                color: active ? 'rgba(255,255,255,0.5)' : COLORS.mute}}>
                {k==='start' ? 'START' : 'END'}
              </div>
              <div style={{fontFamily:SANS, fontSize:14, fontWeight:500,
                color: active ? '#fff' : val ? COLORS.ink : COLORS.mute}}>
                {fmtDate(val) || '—'}
              </div>
            </button>
          );
        })}
      </div>}

      {/* 월 네비게이션 헤더 */}
      <div style={{display:'flex', alignItems:'center', padding:'0 16px', marginBottom:10, gap:8}}>
        <button onClick={prevMonth} style={{width:34,height:34,borderRadius:17,border:'none',cursor:'pointer',background:COLORS.softer,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Icon name="chevron-l" size={13} color={COLORS.ink} stroke={2.5}/>
        </button>
        <button onClick={()=>setShowYM(p=>!p)} style={{
          flex:1, border:'none', cursor:'pointer', borderRadius:10,
          background: showYM ? COLORS.softer : 'transparent',
          padding:'6px 0', display:'flex', alignItems:'center', justifyContent:'center', gap:5,
        }}>
          <span style={{fontFamily:SANS, fontSize:15, fontWeight:600, color:COLORS.ink, letterSpacing:'-0.01em'}}>
            {view.y}년 {MONTH_KR[view.mo]}
          </span>
          <Icon name="chevron-d" size={11} color={COLORS.mute} stroke={2.5}
            style={{transform: showYM ? 'rotate(180deg)' : 'none', transition:'transform 0.2s'}}/>
        </button>
        <button onClick={nextMonth} style={{width:34,height:34,borderRadius:17,border:'none',cursor:'pointer',background:COLORS.softer,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Icon name="chevron" size={13} color={COLORS.ink} stroke={2.5}/>
        </button>
      </div>

      {showYM ? (
        <div style={{display:'flex', justifyContent:'center', gap:16, padding:'0 16px 16px', touchAction:'none'}}>
          <WheelColumn items={YEARS_LIST} value={String(view.y)} onChange={y => setView(v => ({...v, y:+y}))} width={110} compact={true}/>
          <WheelColumn items={MONTH_KR} value={MONTH_KR[view.mo]} onChange={m => setView(v => ({...v, mo:MONTH_KR.indexOf(m)}))} width={90} compact={true} loop={true}/>
        </div>
      ) : (
        <>
          {/* 요일 헤더 */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:'0 14px 2px'}}>
            {DOW.map((w,i) => (
              <div key={i} style={{textAlign:'center', fontFamily:MONO, fontSize:9.5, letterSpacing:'0.08em', padding:'2px 0 6px',
                color: i===0 ? COLORS.accent : i===6 ? 'oklch(60% 0.06 250)' : COLORS.mute}}>{w}</div>
            ))}
          </div>
          {/* 날짜 그리드 */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:'0 14px 16px'}}>
            {cells.map((d,i) => {
              if (d===null) return <div key={i}/>;
              const col=(firstDow+d-1)%7;
              const st=isSt(d), en=isEn(d), rng=inRng(d);
              const hasStrip=st||en||rng, isSel=st||en;
              const isToday=today.getFullYear()===view.y&&today.getMonth()===view.mo&&today.getDate()===d;
              const isL=st||(rng&&col===0), isR=en||(rng&&col===6);
              const stripR=!hasStrip?'0':isL&&isR?'50%':isL?'50% 0 0 50%':isR?'0 50% 50% 0':'0';
              return (
                <button key={i} onClick={()=>handleDay(d)} style={{
                  aspectRatio:'1/1', border:'none', cursor:'pointer', padding:0, margin:'1px 0',
                  position:'relative', display:'flex', alignItems:'center', justifyContent:'center',
                  background: hasStrip ? 'rgba(193,79,46,0.10)' : 'transparent', borderRadius:stripR,
                }}>
                  {isSel&&<div style={{position:'absolute',inset:'3px',borderRadius:'50%',background:COLORS.ink,zIndex:0}}/>}
                  <span style={{position:'relative',zIndex:1,fontFamily:SANS,fontSize:13,fontWeight:isSel?600:400,
                    color:isSel?'#fff':col===0?COLORS.accent:COLORS.ink}}>{d}</span>
                  {isToday&&!isSel&&<span style={{position:'absolute',bottom:3,left:'50%',transform:'translateX(-50%)',width:3,height:3,borderRadius:'50%',background:COLORS.accent,zIndex:1}}/>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </BottomSheet>
  );
}

// ─── Wheel column (scroll-snap) ──────────────────────────────
function WheelColumn({ items, value, onChange, width=70, loop=false, compact=false }) {
  const ITEM_H = 40;
  const VISIBLE = compact ? 5 : 5; // compact: center + 2 peek above/below
  const CENTER_OFFSET = Math.floor(VISIBLE / 2);
  const ref = React.useRef(null);
  const timer = React.useRef(null);
  const jumping = React.useRef(false);
  const scrolling = React.useRef(false);
  const rafCancel = React.useRef(false);
  const internalChange = React.useRef(false);

  // loop 모드: 아이템 3배 반복, 중간 set에서 시작
  const dispItems = React.useMemo(
    () => loop ? [...items, ...items, ...items] : items,
    [items, loop]
  );
  const loopOff = loop ? items.length : 0;

  // Refs for stable access inside touch/timer closures
  const itemsRef    = React.useRef(items);   itemsRef.current    = items;
  const valueRef    = React.useRef(value);   valueRef.current    = value;
  const onChangeRef = React.useRef(onChange); onChangeRef.current = onChange;
  const loopRef     = React.useRef(loop);    loopRef.current     = loop;

  // Sync external value → scroll position (skip when changed internally by snap)
  React.useEffect(() => {
    if (internalChange.current) { internalChange.current = false; return; }
    const el = ref.current; if (!el) return;
    const idx = itemsRef.current.indexOf(value);
    if (idx >= 0) el.scrollTop = (loopOff + idx) * ITEM_H;
  }, [value, loopOff]);

  // Snap helper – snaps to nearest item and fires onChange
  const snapAndFire = React.useCallback((el, targetTop) => {
    scrolling.current = true;
    const its = itemsRef.current;
    const raw = Math.round(targetTop / ITEM_H);
    if (loopRef.current) {
      const total    = its.length * 3;
      const clamped  = Math.max(0, Math.min(total - 1, raw));
      // Fire onChange immediately so highlight follows scroll animation
      const earlyIdx = ((clamped % its.length) + its.length) % its.length;
      if (its[earlyIdx] !== valueRef.current) { internalChange.current = true; haptic(); onChangeRef.current(its[earlyIdx]); }
      el.scrollTo({ top: clamped * ITEM_H, behavior: 'smooth' });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const finalRaw = Math.round(el.scrollTop / ITEM_H);
        const realIdx  = ((finalRaw % its.length) + its.length) % its.length;
        if (finalRaw < its.length || finalRaw >= 2 * its.length) {
          jumping.current = true;
          setTimeout(() => { el.scrollTop = (its.length + realIdx) * ITEM_H; jumping.current = false; scrolling.current = false; }, 180);
        } else {
          scrolling.current = false;
        }
      }, 350);
    } else {
      const clamped = Math.max(0, Math.min(its.length - 1, raw));
      // Fire onChange immediately so highlight follows scroll animation
      if (its[clamped] !== valueRef.current) { internalChange.current = true; haptic(); onChangeRef.current(its[clamped]); }
      el.scrollTo({ top: clamped * ITEM_H, behavior: 'smooth' });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { scrolling.current = false; }, 350);
    }
  }, []);

  // Manual touch scroll (parent has touch-action:none, so native scroll is disabled)
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    let startY = null, startTop = 0, lastY = 0, lastT = 0, vel = 0;
    const onStart = e => {
      rafCancel.current = true;      // stop any running RAF decel
      el.scrollTop = el.scrollTop;   // cancel any running smooth scroll
      clearTimeout(timer.current);
      scrolling.current = false;
      startY = lastY = e.touches[0].clientY;
      startTop = el.scrollTop;
      lastT = Date.now(); vel = 0;
    };
    const onMove = e => {
      e.preventDefault(); // 페이지 스크롤 차단
      if (startY === null) return;
      const y = e.touches[0].clientY;
      const dt = Math.max(1, Date.now() - lastT);
      vel = (lastY - y) / dt;
      lastY = y; lastT = Date.now();
      el.scrollTop = startTop + (startY - y);
    };
    const onEnd = () => {
      if (startY === null) return;
      startY = null;
      let v = vel * 120;
      if (Math.abs(v) < 1) { snapAndFire(el, el.scrollTop); return; }
      scrolling.current = true;
      rafCancel.current = false;
      const decel = () => {
        if (rafCancel.current) return; // new touch started, abandon
        v *= 0.88;
        el.scrollTop += v;
        if (Math.abs(v) > 0.5) requestAnimationFrame(decel);
        else { snapAndFire(el, el.scrollTop); }
      };
      requestAnimationFrame(decel);
    };
    el.addEventListener('touchstart', onStart, { passive: false });
    el.addEventListener('touchmove',  onMove,  { passive: false });
    el.addEventListener('touchend',   onEnd,   { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove',  onMove);
      el.removeEventListener('touchend',   onEnd);
    };
  }, [snapAndFire]);

  const handleScroll = () => {
    if (jumping.current || scrolling.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = ref.current; if (!el) return;
      const raw = Math.round(el.scrollTop / ITEM_H);
      if (loop) {
        el.scrollTo({ top: raw * ITEM_H, behavior: 'smooth' });
        const realIdx = ((raw % items.length) + items.length) % items.length;
        if (items[realIdx] !== value) { haptic(); onChange(items[realIdx]); }
        if (raw < items.length || raw >= 2 * items.length) {
          jumping.current = true;
          setTimeout(() => {
            if (el) el.scrollTop = (items.length + realIdx) * ITEM_H;
            jumping.current = false;
          }, 180);
        }
      } else {
        const clamped = Math.max(0, Math.min(items.length - 1, raw));
        el.scrollTo({ top: clamped * ITEM_H, behavior: 'smooth' });
        if (items[clamped] !== value) { haptic(); onChange(items[clamped]); }
      }
    }, 120);
  };

  return (
    <div style={{ position:'relative', width, height: ITEM_H * VISIBLE, overflow:'hidden' }}>
      <style>{`.wheel-col::-webkit-scrollbar{display:none;}`}</style>
      <div ref={ref} onScroll={handleScroll} className="wheel-col" style={{
        width:'100%', height:'100%', overflowY:'scroll',
        scrollbarWidth:'none', msOverflowStyle:'none',
      }}>
        <div style={{ height: ITEM_H * CENTER_OFFSET, flexShrink:0 }}/>
        {dispItems.map((it, i) => {
          const isSel = it === value;
          return (
            <div key={i} style={{
              height: ITEM_H, display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily: SERIF, fontSize: isSel ? 26 : 20,
              color: isSel ? COLORS.ink : COLORS.mute,
              opacity: isSel ? 1 : 0.45,
              transition:'all 180ms',
              fontFeatureSettings:'"tnum"',
            }}>{it}</div>
          );
        })}
        <div style={{ height: ITEM_H * CENTER_OFFSET, flexShrink:0 }}/>
      </div>
      {/* Selection indicator */}
      {compact ? (
        <div style={{
          position:'absolute', left:0, right:0, top: ITEM_H * CENTER_OFFSET, height: ITEM_H,
          background:'rgba(0,0,0,0.06)', borderRadius:10,
          pointerEvents:'none',
        }}/>
      ) : (
        <div style={{
          position:'absolute', left:0, right:0, top: ITEM_H * CENTER_OFFSET, height: ITEM_H,
          borderTop:`1px solid ${COLORS.line}`, borderBottom:`1px solid ${COLORS.line}`,
          pointerEvents:'none',
        }}/>
      )}
      {/* Fade edges */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height: ITEM_H * CENTER_OFFSET,
        background: `linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.bg}88 55%, ${COLORS.bg}00 100%)`,
        pointerEvents:'none',
      }}/>
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height: ITEM_H * CENTER_OFFSET,
        background: `linear-gradient(0deg, ${COLORS.bg} 0%, ${COLORS.bg}88 55%, ${COLORS.bg}00 100%)`,
        pointerEvents:'none',
      }}/>
    </div>
  );
}

// ─── Time wheel picker ───────────────────────────────────────
function TimeWheelSheet({ open, value, onClose, onPick, title='시간 선택' }) {
  const parse = (v) => {
    const m = (v || '').match(/^(\d{1,2}):(\d{2})/);
    if (!m) return { h: 15, m: 0 };
    return { h: Math.max(0, Math.min(23, +m[1])), m: Math.max(0, Math.min(59, +m[2])) };
  };
  const [h, setH] = React.useState(parse(value).h);
  const [mi, setMi] = React.useState(parse(value).m);
  React.useEffect(() => { if (open) { const p = parse(value); setH(p.h); setMi(p.m); } }, [open, value]);

  const hours = React.useMemo(() => Array.from({length:24}, (_, i) => String(i).padStart(2,'0')), []);
  // 5-minute grain is the sweet spot for quick selection
  const mins  = React.useMemo(() => Array.from({length:12}, (_, i) => String(i*5).padStart(2,'0')), []);

  const confirm = () => {
    const time = `${String(h).padStart(2,'0')}:${String(mi).padStart(2,'0')}`;
    onPick(time);
    onClose();
  };

  // Snap minutes to nearest 5 for display, but internal state can be any int
  const displayMin = String(Math.round(mi/5)*5 % 60).padStart(2,'0');

  return (
    <BottomSheet open={open} onClose={onClose} title={title} onConfirm={confirm} noDragClose={true}>
      <div style={{ padding:'20px 20px 28px', display:'flex', justifyContent:'center', alignItems:'center', gap:10, touchAction:'none' }}>
        <WheelColumn items={hours} value={String(h).padStart(2,'0')}
          onChange={(v) => setH(+v)} compact={true} loop={true} width={80}/>
        <div style={{ fontFamily:SERIF, fontSize:28, color:COLORS.ink, opacity:0.4 }}>:</div>
        <WheelColumn items={mins} value={displayMin}
          onChange={(v) => setMi(+v)} compact={true} loop={true} width={80}/>
      </div>
    </BottomSheet>
  );
}

// ─── 공통 픽커 바텀 시트 ─────────────────────────────────────
function PickerSheet({ open, onClose, title, items, getKey, filterFn, renderRow, onPick, selectedKey }) {
  const [q, setQ]           = React.useState('');
  const [entered, setEntered] = React.useState(false);
  const inputRef = React.useRef(null);
  const touchY   = React.useRef(null);
  const kbh = useKeyboardHeight();

  React.useEffect(() => {
    if (!open) { setEntered(false); return; }
    setQ('');
    setEntered(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, [open]);

  React.useEffect(() => {
    if (open && entered) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open, entered]);

  const filtered = React.useMemo(() =>
    q ? items.filter(item => filterFn(item, q)) : items,
  [items, q, filterFn]);

  if (!open) return null;
  return ReactDOM.createPortal(
    <div style={{ position:'fixed', inset:0, zIndex:600,
      background:`rgba(0,0,0,${entered ? 0.35 : 0})`,
      transition:'background 0.3s',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        onTouchStart={e => { touchY.current = e.touches[0].clientY; }}
        onTouchEnd={e => { if (e.changedTouches[0].clientY - (touchY.current||0) > 80) onClose(); }}
        style={{
          position:'fixed', bottom:kbh, left:0, right:0,
          background:COLORS.bg, borderRadius:'22px 22px 0 0',
          maxHeight: kbh > 0 ? `calc(100vh - ${kbh + 16}px)` : '82%',
          display:'flex', flexDirection:'column',
          transform:`translateY(${entered ? 0 : '100vh'})`,
          transition:'transform 0.34s cubic-bezier(0.32,0.72,0,1), bottom 0.22s ease, max-height 0.22s ease',
        }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 4px', flexShrink:0 }}>
          <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
        </div>
        <div style={{ padding:'2px 16px 10px', flexShrink:0 }}>
          <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink, marginBottom:10 }}>{title}</div>
          <div style={{ background:COLORS.card, borderRadius:10, padding:'10px 12px',
            display:'flex', gap:8, alignItems:'center' }}>
            <Icon name="search" size={14} color={COLORS.mute} stroke={1.8}/>
            <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="검색"
              style={{ border:'none', outline:'none', background:'transparent', flex:1,
                fontFamily:SANS, fontSize:13, color:COLORS.ink }}/>
            {q && <button onClick={() => setQ('')}
              style={{ border:'none', background:'transparent', padding:0, cursor:'pointer' }}>
              <Icon name="x" size={12} color={COLORS.mute} stroke={2}/>
            </button>}
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'0 16px calc(80px + env(safe-area-inset-bottom,0px))' }}>
          <div style={{ background:COLORS.card, borderRadius:14, overflow:'hidden' }}>
            {filtered.length === 0 && (
              <div style={{ padding:'20px', fontFamily:SANS, fontSize:13, color:COLORS.mute, textAlign:'center' }}>검색 결과 없음</div>
            )}
            {filtered.map((item, i) => {
              const k = getKey(item);
              const sel = k === selectedKey;
              return (
                <button key={k} onClick={() => { onPick(item); onClose(); }} style={{
                  width:'100%', border:'none',
                  background: sel ? COLORS.softer : 'transparent',
                  padding:'12px 14px', display:'flex', gap:10, alignItems:'center',
                  borderBottom: i < filtered.length-1 ? `1px solid ${COLORS.line}` : 'none',
                  cursor:'pointer', textAlign:'left',
                }}>
                  {renderRow(item, sel)}
                  {sel && <Icon name="check" size={16} color={COLORS.accent} stroke={2.5}/>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── FX ─────────────────────────────────────────────────────
const FX_CURRENCIES = [
  { code:'USD', sym:'$',   name:'미국 달러' },
  { code:'EUR', sym:'€',   name:'유로' },
  { code:'JPY', sym:'¥',   name:'일본 엔' },
  { code:'GBP', sym:'£',   name:'영국 파운드' },
  { code:'CNY', sym:'¥',   name:'중국 위안' },
  { code:'HKD', sym:'HK$', name:'홍콩 달러' },
  { code:'TWD', sym:'NT$', name:'대만 달러' },
  { code:'SGD', sym:'S$',  name:'싱가포르 달러' },
  { code:'THB', sym:'฿',   name:'태국 바트' },
  { code:'AUD', sym:'A$',  name:'호주 달러' },
  { code:'CAD', sym:'C$',  name:'캐나다 달러' },
  { code:'CHF', sym:'Fr',  name:'스위스 프랑' },
  { code:'AED', sym:'AED', name:'UAE 디르함' },
  { code:'MYR', sym:'RM',  name:'말레이시아 링깃' },
  { code:'VND', sym:'₫',   name:'베트남 동' },
  { code:'PHP', sym:'₱',   name:'필리핀 페소' },
  { code:'MXN', sym:'MX$', name:'멕시코 페소' },
];

function useFxRate(currency) {
  const [state, setState] = React.useState({ loading: true, rate: null, ts: null });
  const fetchRate = React.useCallback(() => {
    setState(s => ({ ...s, loading: true }));
    const cur = currency.toLowerCase();
    const sources = [
      {
        url: `https://api.frankfurter.app/latest?from=${currency}&to=KRW`,
        parse: j => ({ rate: j?.rates?.KRW, ts: j?.date }),
      },
      {
        url: `https://open.er-api.com/v6/latest/${currency}`,
        parse: j => ({ rate: j?.rates?.KRW, ts: j?.time_last_update_utc?.slice(0, 16) }),
      },
      {
        url: `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${cur}.json`,
        parse: j => ({ rate: j?.[cur]?.krw, ts: j?.date }),
      },
    ];
    const tryNext = (i) => {
      if (i >= sources.length) { setState({ loading:false, rate:null, ts:null }); return; }
      fetch(sources[i].url).then(r => r.json()).then(j => {
        const { rate, ts } = sources[i].parse(j);
        if (rate) setState({ loading:false, rate, ts: ts || null });
        else tryNext(i+1);
      }).catch(() => tryNext(i+1));
    };
    tryNext(0);
  }, [currency]);
  React.useEffect(() => { fetchRate(); }, [fetchRate]);
  return { ...state, refresh: fetchRate };
}

function FxCard({ curCode, onSetCurCode }) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const cur = FX_CURRENCIES.find(c => c.code === curCode) || FX_CURRENCIES[0];
  const { loading, rate, ts, refresh } = useFxRate(cur.code);

  const fxFilterFn = React.useCallback((item, q) => {
    const ql = q.toLowerCase();
    return item.code.toLowerCase().includes(ql) || item.name.includes(q);
  }, []);

  return (
    <div style={{ background:COLORS.card, borderRadius:14, padding:'13px 14px 11px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em', textTransform:'uppercase' }}>환율</div>
        <button onClick={refresh} style={{ border:'none', background:'transparent', cursor:'pointer', padding:2 }}>
          <Icon name="refresh" size={12} color={COLORS.mute} stroke={1.8}/>
        </button>
      </div>
      <div style={{ marginTop:5, display:'flex', alignItems:'flex-end', gap:6 }}>
        <div style={{ fontFamily:SERIF, fontSize:30, color:COLORS.ink, lineHeight:1 }}>
          {loading ? '…' : rate ? `₩${Math.round(rate).toLocaleString()}` : '—'}
        </div>
        <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute, paddingBottom:4 }}>
          = {cur.sym}1
        </div>
      </div>
      <div style={{ marginTop:4, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute, opacity:0.6 }}>
          {ts || ''}
        </div>
        <button onClick={() => setPickerOpen(true)} style={{
          border:'none', background:'transparent', cursor:'pointer', padding:'2px 0',
          display:'flex', alignItems:'center', gap:3,
          fontFamily:MONO, fontSize:10, color:COLORS.ink, fontWeight:600,
        }}>
          {cur.code}
          <Icon name="chevron-d" size={10} color={COLORS.mute} stroke={1.8}/>
        </button>
      </div>
      <PickerSheet
        open={pickerOpen} onClose={() => setPickerOpen(false)}
        title="통화 선택"
        items={FX_CURRENCIES}
        getKey={c => c.code}
        filterFn={fxFilterFn}
        selectedKey={cur.code}
        onPick={c => onSetCurCode(c.code)}
        renderRow={(c) => (
          <>
            <div style={{ fontFamily:MONO, fontSize:14, fontWeight:600, color:COLORS.ink, minWidth:42 }}>{c.code}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.ink }}>{c.name}</div>
              <div style={{ fontFamily:MONO, fontSize:10.5, color:COLORS.mute, marginTop:1 }}>{c.sym}1</div>
            </div>
          </>
        )}
      />
    </div>
  );
}

// ─── Timezones ──────────────────────────────────────────────
const CITIES = [
  { key:'New York',    kor:'뉴욕',       zone:'America/New_York',    flag:'🇺🇸', lat:40.71,  lon:-74.01,  currency:'USD' },
  { key:'Los Angeles', kor:'로스앤젤레스',zone:'America/Los_Angeles', flag:'🇺🇸', lat:34.05,  lon:-118.24, currency:'USD' },
  { key:'Washington',  kor:'워싱턴',     zone:'America/New_York',    flag:'🇺🇸', lat:38.91,  lon:-77.04,  currency:'USD' },
  { key:'London',      kor:'런던',       zone:'Europe/London',       flag:'🇬🇧', lat:51.51,  lon:-0.13,   currency:'EUR' },
  { key:'Paris',       kor:'파리',       zone:'Europe/Paris',        flag:'🇫🇷', lat:48.85,  lon:2.35,    currency:'EUR' },
  { key:'Rome',        kor:'로마',       zone:'Europe/Rome',         flag:'🇮🇹', lat:41.90,  lon:12.50,   currency:'EUR' },
  { key:'Berlin',      kor:'베를린',     zone:'Europe/Berlin',       flag:'🇩🇪', lat:52.52,  lon:13.40,   currency:'EUR' },
  { key:'Dubai',       kor:'두바이',     zone:'Asia/Dubai',          flag:'🇦🇪', lat:25.20,  lon:55.27,   currency:'USD' },
  { key:'Bangkok',     kor:'방콕',       zone:'Asia/Bangkok',        flag:'🇹🇭', lat:13.75,  lon:100.52,  currency:'USD' },
  { key:'Singapore',   kor:'싱가포르',   zone:'Asia/Singapore',      flag:'🇸🇬', lat:1.35,   lon:103.82,  currency:'USD' },
  { key:'Hong Kong',   kor:'홍콩',       zone:'Asia/Hong_Kong',      flag:'🇭🇰', lat:22.32,  lon:114.17,  currency:'USD' },
  { key:'Shanghai',    kor:'상하이',     zone:'Asia/Shanghai',       flag:'🇨🇳', lat:31.23,  lon:121.47,  currency:'CNY' },
  { key:'Tokyo',       kor:'도쿄',       zone:'Asia/Tokyo',          flag:'🇯🇵', lat:35.68,  lon:139.69,  currency:'JPY' },
  { key:'Seoul',       kor:'서울',       zone:'Asia/Seoul',          flag:'🇰🇷', lat:37.57,  lon:126.98,  currency:'USD' },
  { key:'Sydney',      kor:'시드니',     zone:'Australia/Sydney',    flag:'🇦🇺', lat:-33.87, lon:151.21,  currency:'USD' },
  { key:'Hawaii',      kor:'하와이',     zone:'Pacific/Honolulu',    flag:'🇺🇸', lat:21.31,  lon:-157.86, currency:'USD' },
];

// 여행 제목에서 도시 자동 감지
function detectCityFromTitle(title) {
  if (!title) return null;
  const lower = title.toLowerCase();
  // 긴 키 먼저 매칭 (e.g. 'new york' before 'york')
  const sorted = [...CITIES].sort((a, b) => b.key.length - a.key.length);
  return sorted.find(c =>
    lower.includes(c.key.toLowerCase()) || lower.includes(c.kor)
  ) || null;
}

// 여행 제목에서 통화 자동 감지 (달러/유로/엔/위안/페소)
function detectCurrencyFromTitle(title) {
  if (!title) return 'USD';
  const city = detectCityFromTitle(title);
  if (city?.currency) return city.currency;
  const t = title.toLowerCase();
  if (/japan|일본|osaka|교토|오사카|나고야/.test(t)) return 'JPY';
  if (/china|중국|beijing|베이징|guangzhou|광저우/.test(t)) return 'CNY';
  if (/mexico|멕시코/.test(t)) return 'MXN';
  if (/europe|유럽|france|프랑스|italy|이탈리아|florence|피렌체|venice|베네치아|milan|밀라노|germany|독일|spain|스페인|barcelona|마드리드|madrid|netherlands|amsterdam|amsterdam|portugal|lisbon|리스본|greece|athens|아테네|vienna|빈|switzerland|취리히|prague|프라하|budapest|부다페스트/.test(t)) return 'EUR';
  return 'USD';
}

// WMO 날씨 코드 → 설명 + 이모지
const WMO = {
  0:  ['맑음',        '☀️'],
  1:  ['구름 조금',   '🌤'],
  2:  ['구름 많음',   '⛅'],
  3:  ['흐림',        '☁️'],
  45: ['안개',        '🌫'],
  48: ['안개',        '🌫'],
  51: ['가벼운 이슬비','🌦'],
  53: ['이슬비',      '🌦'],
  55: ['짙은 이슬비', '🌧'],
  61: ['가벼운 비',   '🌧'],
  63: ['비',          '🌧'],
  65: ['강한 비',     '🌧'],
  71: ['가벼운 눈',   '🌨'],
  73: ['눈',          '🌨'],
  75: ['강한 눈',     '❄️'],
  77: ['싸락눈',      '🌨'],
  80: ['소나기',      '🌦'],
  81: ['소나기',      '🌦'],
  82: ['강한 소나기', '⛈'],
  85: ['눈 소나기',   '🌨'],
  86: ['강한 눈 소나기','🌨'],
  95: ['뇌우',        '⛈'],
  96: ['뇌우',        '⛈'],
  99: ['뇌우·우박',   '⛈'],
};
const wmoInfo = (code) => WMO[code] || ['—', '🌡'];

function useWeather(lat, lon, zone) {
  const [state, setState] = React.useState({ loading:true, data:null });
  React.useEffect(() => {
    let alive = true;
    setState({ loading:true, data:null });
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
      `&timezone=${encodeURIComponent(zone)}&forecast_days=5`;
    fetch(url).then(r => r.json())
      .then(j => { if (alive) setState({ loading:false, data:j }); })
      .catch(()  => { if (alive) setState({ loading:false, data:null }); });
    return () => { alive = false; };
  }, [lat, lon]);
  return state;
}

const DAY_KO = ['일','월','화','수','목','금','토'];

function WeatherCard({ city }) {
  const { loading, data } = useWeather(city.lat, city.lon, city.zone);
  const cur = data?.current;
  const daily = data?.daily;

  const skeleton = (
    <div style={{ background:COLORS.card, borderRadius:14, padding:'13px 14px 12px' }}>
      <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em', textTransform:'uppercase' }}>날씨</div>
      <div style={{ marginTop:10, fontFamily:SANS, fontSize:13, color:COLORS.mute }}>{loading ? '불러오는 중…' : '정보 없음'}</div>
    </div>
  );
  if (loading || !cur) return skeleton;

  const [desc, emoji] = wmoInfo(cur.weather_code);
  const forecast = daily?.time?.slice(0,5).map((d,i) => ({
    label: i === 0 ? '오늘' : DAY_KO[new Date(d+'T12:00:00').getDay()],
    emoji: wmoInfo(daily.weather_code[i])[1],
    max: Math.round(daily.temperature_2m_max[i]),
    min: Math.round(daily.temperature_2m_min[i]),
  })) || [];

  return (
    <div style={{ background:COLORS.card, borderRadius:14, padding:'13px 14px 12px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em', textTransform:'uppercase' }}>날씨</div>
        <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute }}>{city.flag} {city.key}</div>
      </div>
      {/* 현재 기온 */}
      <div style={{ marginTop:10, display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:36, lineHeight:1 }}>{emoji}</span>
          <div>
            <div style={{ fontFamily:SERIF, fontSize:36, color:COLORS.ink, lineHeight:1, letterSpacing:'-0.02em' }}>
              {Math.round(cur.temperature_2m)}<span style={{ fontSize:22 }}>°</span>
            </div>
            <div style={{ fontFamily:SANS, fontSize:12, color:COLORS.mute, marginTop:3 }}>{desc}</div>
          </div>
        </div>
        <div style={{ textAlign:'right', paddingBottom:2 }}>
          <div style={{ fontFamily:MONO, fontSize:11, color:COLORS.mute }}>체감 {Math.round(cur.apparent_temperature)}°</div>
          <div style={{ fontFamily:MONO, fontSize:11, color:COLORS.mute, marginTop:3 }}>습도 {cur.relative_humidity_2m}%</div>
          <div style={{ fontFamily:MONO, fontSize:11, color:COLORS.mute, marginTop:3 }}>바람 {Math.round(cur.wind_speed_10m)}㎞/h</div>
        </div>
      </div>
      {/* 5일 예보 */}
      {forecast.length > 0 && (
        <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${COLORS.line}`,
          display:'flex', justifyContent:'space-between' }}>
          {forecast.map(f => (
            <div key={f.label} style={{ flex:1, textAlign:'center' }}>
              <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, marginBottom:3 }}>{f.label}</div>
              <div style={{ fontSize:16, marginBottom:3 }}>{f.emoji}</div>
              <div style={{ fontFamily:MONO, fontSize:11, color:COLORS.ink, fontWeight:600 }}>{f.max}°</div>
              <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute }}>{f.min}°</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function zoneOffsetMin(zone, d = new Date()) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: zone, hour12: false,
    year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', second:'2-digit',
  });
  const parts = dtf.formatToParts(d).reduce((a, p) => { a[p.type]=p.value; return a; }, {});
  const asUTC = Date.UTC(+parts.year, +parts.month-1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return Math.round((asUTC - d.getTime()) / 60000);
}
function formatDiffFromSeoul(zone) {
  const now = new Date();
  const diff = (zoneOffsetMin(zone, now) - zoneOffsetMin('Asia/Seoul', now)) / 60;
  const sign = diff > 0 ? '+' : diff < 0 ? '−' : '±';
  return `${sign}${Math.abs(diff)}h`;
}
function formatCityTime(zone) {
  return new Intl.DateTimeFormat('en-US', { timeZone: zone, hour:'2-digit', minute:'2-digit', hour12: false }).format(new Date());
}
function formatCityDateWeekday(zone) {
  const d = new Date();
  const date = new Intl.DateTimeFormat('ko-KR', { timeZone: zone, month:'long', day:'numeric' }).format(d);
  const weekday = new Intl.DateTimeFormat('ko-KR', { timeZone: zone, weekday:'short' }).format(d);
  return `${date} (${weekday})`;
}

function TimezoneCard({ city, onPick }) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [, force] = React.useReducer(x => x+1, 0);

  React.useEffect(() => { const t = setInterval(force, 30000); return () => clearInterval(t); }, []);

  const cityFilterFn = React.useCallback((item, q) => {
    const ql = q.toLowerCase();
    return item.key.toLowerCase().includes(ql) || item.kor.includes(q);
  }, []);

  return (
    <div>
      <button onClick={() => setPickerOpen(true)} style={{
        background:COLORS.card, borderRadius:14, padding:'13px 14px 11px',
        border:'none', cursor:'pointer', textAlign:'left', width:'100%',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em', textTransform:'uppercase' }}>시차</div>
          <Icon name="chevron-d" size={12} color={COLORS.mute} stroke={1.8}/>
        </div>
        <div style={{ marginTop:5, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:SERIF, fontSize:30, color:COLORS.ink, flexShrink:0, lineHeight:1 }}>{formatDiffFromSeoul(city.zone)}</div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2 }}>
            <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.04em' }}>{formatCityDateWeekday(city.zone)}</div>
            <div style={{ fontFamily:MONO, fontSize:16, color:COLORS.ink, letterSpacing:'0.04em' }}>{formatCityTime(city.zone)}</div>
          </div>
        </div>
        <div style={{ marginTop:5, fontFamily:SANS, fontSize:11, color:COLORS.mute, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {city.flag} {city.key}
        </div>
      </button>
      <PickerSheet
        open={pickerOpen} onClose={() => setPickerOpen(false)}
        title="도시 선택"
        items={CITIES}
        getKey={c => c.key}
        filterFn={cityFilterFn}
        selectedKey={city.key}
        onPick={c => onPick(c)}
        renderRow={(c) => (
          <>
            <span style={{ fontSize:18 }}>{c.flag}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:SANS, fontSize:14, color:COLORS.ink }}>{c.key}</div>
              <div style={{ fontFamily:MONO, fontSize:10.5, color:COLORS.mute, marginTop:2 }}>
                {formatDiffFromSeoul(c.zone)} · {formatCityTime(c.zone)}
              </div>
            </div>
          </>
        )}
      />
    </div>
  );
}


// ─── TRIPS SCREEN (top level) ───────────────────────────────
// ─── Trip Card with swipe-to-reveal share/delete ─────────────
function TripSwipeCard({ children, onShare, onDelete, wrapStyle = {} }) {
  const [x, setX]           = React.useState(0);
  const [open, setOpen]     = React.useState(false);
  const [flying, setFlying] = React.useState(false);
  const [collapseH, setCollapseH] = React.useState(null);
  const outerRef  = React.useRef(null);
  const startRef  = React.useRef(null);
  const dragging  = React.useRef(false);
  const xRef      = React.useRef(0);
  const REVEAL = 144;
  const DELETE_EXTRA = 72;

  const close = () => { setX(0); xRef.current = 0; setOpen(false); };

  const flyOff = () => {
    if (flying) return;
    const h = outerRef.current?.offsetHeight || 0;
    if (h) setCollapseH(h);
    setFlying(true);
    const w = window.innerWidth || 400;
    setX(-w); xRef.current = -w;
    setTimeout(() => {
      setCollapseH(0);
      setTimeout(() => onDelete?.(), 160);
    }, 260);
  };

  const onTouchStart = (e) => {
    if (flying) return;
    startRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    dragging.current = false;
  };
  const onTouchMove = (e) => {
    if (!startRef.current || flying) return;
    const dx = e.touches[0].clientX - startRef.current.x;
    const dy = Math.abs(e.touches[0].clientY - startRef.current.y);
    if (!dragging.current) {
      if (Math.abs(dx) < 8) return;
      if (dy > Math.abs(dx) * 0.6) return;
      dragging.current = true;
    }
    const base = open ? -REVEAL : 0;
    const raw = base + dx;
    const clamped = open
      ? Math.max(-(REVEAL + DELETE_EXTRA + 16), Math.min(0, raw))
      : Math.max(-REVEAL, Math.min(0, raw));
    xRef.current = clamped;
    setX(clamped);
  };
  const onTouchEnd = () => {
    if (!startRef.current) return;
    const wasDragging = dragging.current;
    startRef.current = null;
    dragging.current = false;
    if (!wasDragging) {
      if (open) close();
      return;
    }
    const cur = xRef.current;
    if (cur < -(REVEAL + DELETE_EXTRA / 2)) {
      flyOff();
    } else if (cur < -REVEAL / 2) {
      xRef.current = -REVEAL; setX(-REVEAL); setOpen(true);
    } else {
      close();
    }
  };
  const onTouchCancel = () => { startRef.current = null; dragging.current = false; close(); };

  const flyTransition = 'transform 0.26s cubic-bezier(0.4,0,1,1)';
  const collapseStyle = collapseH !== null ? {
    height: collapseH, overflow:'hidden',
    transition: collapseH === 0 ? 'height 0.16s ease-in' : 'none',
  } : {};

  return (
    <div ref={outerRef} style={collapseStyle}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd} onTouchCancel={onTouchCancel}>
      <div style={{ position:'relative' }}>
        {!flying && (
          <div style={{
            position:'absolute', right:0, top:0, bottom:0, width:REVEAL,
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          }}>
            <button onClick={(e) => { e.stopPropagation(); close(); setTimeout(onShare, 100); }} style={{
              width:50, height:50, borderRadius:25, border:'none', cursor:'pointer',
              background:'#ffa500', flexShrink:0,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}><Icon name="share" size={18} color="#fff" stroke={2}/></button>
            <button onClick={(e) => { e.stopPropagation(); flyOff(); }} style={{
              width:50, height:50, borderRadius:25, border:'none', cursor:'pointer',
              background:'#B5451B', flexShrink:0,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}><Icon name="trash" size={18} color="#fff" stroke={2}/></button>
          </div>
        )}
        <div style={{
          transform:`translateX(${x}px)`,
          transition: flying ? flyTransition : dragging.current ? 'none' : 'transform 0.28s cubic-bezier(0.25,1,0.5,1)',
          background:COLORS.card,
          position:'relative', zIndex:1,
          overflow:'hidden',
          ...wrapStyle,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Share Trip Sheet ─────────────────────────────────────────
function ShareTripSheet({ open, onClose, trip, userData, allTrips, myUid }) {
  const [mode, setMode]           = React.useState('edit'); // 'edit' | 'copy'
  const [memberProfiles, setMemberProfiles] = React.useState([]);
  const [contacts, setContacts]   = React.useState([]);
  const [selected, setSelected]   = React.useState(new Set());
  const [email, setEmail]         = React.useState('');
  const [msg, setMsg]             = React.useState('');
  const [loading, setLoading]     = React.useState(false);
  const [sending, setSending]     = React.useState(false);
  const [removing, setRemoving]   = React.useState(null);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  React.useEffect(() => {
    if (!open || !trip) return;
    setMode('edit'); setSelected(new Set()); setEmail(''); setMsg('');
    setMemberProfiles([]); setContacts([]);

    const currentMembers = new Set(trip.members || []);
    const memberUids = [...currentMembers].filter(uid => uid !== myUid);

    const candidateUids = new Set();
    (allTrips || []).forEach(t => {
      (t.members || []).forEach(uid => {
        if (uid !== myUid && !currentMembers.has(uid)) candidateUids.add(uid);
      });
    });

    setLoading(true);
    Promise.all([
      memberUids.length ? window.fbGetUsersById(memberUids) : Promise.resolve([]),
      candidateUids.size ? window.fbGetUsersById([...candidateUids]) : Promise.resolve([]),
    ]).then(([members, candidates]) => {
      setMemberProfiles(members);
      setContacts(candidates);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [open, trip && trip.id]);

  React.useEffect(() => {
    setEmail(''); setMsg(''); setSelected(new Set());
  }, [mode]);

  const handleRemove = async (c) => {
    if (!confirm(`"${c.displayName}"님을 이 여행에서 제외할까요?`)) return;
    setRemoving(c.uid);
    await window.fbRemoveTripMember(trip.id, c.uid);
    setMemberProfiles(prev => prev.filter(m => m.uid !== c.uid));
    setRemoving(null);
  };

  const toggleSelect = (uid) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid); else next.add(uid);
      return next;
    });
  };

  const handleSend = async () => {
    if (!trip) return;
    const hasEmail = email.trim().length > 0;

    if (mode === 'copy') {
      if (!hasEmail) return;
      setSending(true); setMsg('');
      const result = await fbSendTripCopy(userData, email.trim(), trip);
      setSending(false);
      if (result.success) {
        setMsg(`${result.toName}님께 일정을 보냈습니다!`);
        setEmail('');
      } else {
        setMsg(result.error || '오류가 발생했습니다.');
      }
      return;
    }

    // edit mode
    if (!selected.size && !hasEmail) return;
    setSending(true); setMsg('');

    const results = [];
    for (const uid of selected) {
      const c = contacts.find(x => x.uid === uid);
      if (c?.email) results.push(await fbSendTripInvite(userData, c.email, trip.id, trip.title));
    }
    if (hasEmail) results.push(await fbSendTripInvite(userData, email.trim(), trip.id, trip.title));

    setSending(false);
    const errors = results.filter(r => r.error);
    const ok     = results.filter(r => r.success);
    if (ok.length) {
      setMsg(`${ok.map(r => r.toName).join(', ')}님께 초대를 보냈습니다!`);
      setSelected(new Set()); setEmail('');
    } else if (errors.length) {
      setMsg(errors[0].error);
    }
  };

  if (!open || !trip) return null;
  const canSend = mode === 'copy'
    ? email.trim().length > 0
    : selected.size > 0 || email.trim().length > 0;

  const ModeTab = ({ id, emoji, label, desc }) => {
    const active = mode === id;
    return (
      <div onClick={() => setMode(id)} style={{
        flex:1, padding:'10px 8px', borderRadius:12, cursor:'pointer',
        background: active ? COLORS.ink : COLORS.softer,
        border:`1.5px solid ${active ? COLORS.ink : 'transparent'}`,
        textAlign:'center', transition:'all 0.18s',
      }}>
        <div style={{ fontSize:18, marginBottom:2 }}>{emoji}</div>
        <div style={{ fontFamily:SANS, fontSize:12, fontWeight:600,
          color: active ? COLORS.bg : COLORS.ink, marginBottom:2 }}>{label}</div>
        <div style={{ fontFamily:SANS, fontSize:10.5, color: active ? 'rgba(255,255,255,0.65)' : COLORS.mute,
          lineHeight:1.3 }}>{desc}</div>
      </div>
    );
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:400, background:'rgba(0,0,0,0.4)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background:COLORS.bg, borderRadius:'22px 22px 0 0',
        padding:'0 20px calc(28px + env(safe-area-inset-bottom,0px))',
        maxHeight:'85vh', display:'flex', flexDirection:'column',
      }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 6px', flexShrink:0 }}>
          <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
        </div>
        <div style={{ flexShrink:0 }}>
          <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.accent, letterSpacing:'0.14em', marginBottom:4 }}>SHARE TRIP</div>
          <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink, marginBottom:14 }}>{trip.title}</div>

          {/* Mode selector */}
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            <ModeTab id="edit" emoji="👥" label="함께 편집"
              desc="같은 일정을 실시간으로 함께 수정해요"/>
            <ModeTab id="copy" emoji="📋" label="일정 복사 보내기"
              desc="내 일정을 그대로 복사해서 상대방에게 보내요"/>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch' }}>
          {loading ? (
            <div style={{ textAlign:'center', padding:'20px 0', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>불러오는 중...</div>
          ) : mode === 'edit' ? (
            <>
              {memberProfiles.length > 0 && (
                <>
                  <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute, letterSpacing:'0.08em',
                    textTransform:'uppercase', marginBottom:8 }}>현재 동행인</div>
                  {memberProfiles.map(c => (
                    <div key={c.uid} style={{
                      display:'flex', alignItems:'center', gap:12,
                      padding:'10px 12px', borderRadius:14, marginBottom:6,
                      background:COLORS.card,
                    }}>
                      {c.photoURL
                        ? <img src={c.photoURL} alt="" style={{ width:38, height:38, borderRadius:'50%', objectFit:'cover', flexShrink:0 }}/>
                        : <div style={{ width:38, height:38, borderRadius:'50%', background:'#C8C3B8', flexShrink:0,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontFamily:SANS, fontSize:15, color:'#fff', fontWeight:600 }}>
                            {(c.displayName||'?')[0].toUpperCase()}
                          </div>
                      }
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontFamily:SANS, fontSize:14, color:COLORS.ink, fontWeight:500,
                          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.displayName}</div>
                        <div style={{ fontFamily:SANS, fontSize:12, color:COLORS.mute,
                          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.email}</div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); handleRemove(c); }}
                        disabled={removing === c.uid}
                        style={{ background:'none', border:'none', cursor:'pointer', padding:4,
                          color: COLORS.mute, opacity: removing === c.uid ? 0.4 : 1,
                          display:'flex', alignItems:'center', flexShrink:0 }}>
                        <Icon name="x" size={16} color={COLORS.mute} stroke={2}/>
                      </button>
                    </div>
                  ))}
                  <div style={{ height:16 }}/>
                </>
              )}
              {contacts.length > 0 && (
                <>
                  <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute, letterSpacing:'0.08em',
                    textTransform:'uppercase', marginBottom:8 }}>이전 동행인</div>
                  {contacts.map(c => {
                    const isSel = selected.has(c.uid);
                    return (
                      <div key={c.uid} onClick={() => toggleSelect(c.uid)} style={{
                        display:'flex', alignItems:'center', gap:12,
                        padding:'10px 12px', borderRadius:14, marginBottom:6,
                        background: isSel ? '#EEF2FF' : COLORS.card,
                        border:`1.5px solid ${isSel ? '#4F6BED' : 'transparent'}`,
                        cursor:'pointer',
                      }}>
                        {c.photoURL
                          ? <img src={c.photoURL} alt="" style={{ width:38, height:38, borderRadius:'50%', objectFit:'cover', flexShrink:0 }}/>
                          : <div style={{ width:38, height:38, borderRadius:'50%', background:'#C8C3B8', flexShrink:0,
                              display:'flex', alignItems:'center', justifyContent:'center',
                              fontFamily:SANS, fontSize:15, color:'#fff', fontWeight:600 }}>
                              {(c.displayName||'?')[0].toUpperCase()}
                            </div>
                        }
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontFamily:SANS, fontSize:14, color:COLORS.ink, fontWeight:500,
                            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.displayName}</div>
                          <div style={{ fontFamily:SANS, fontSize:12, color:COLORS.mute,
                            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.email}</div>
                        </div>
                        <div style={{ width:22, height:22, borderRadius:'50%', flexShrink:0,
                          border:`2px solid ${isSel ? '#4F6BED' : COLORS.line}`,
                          background: isSel ? '#4F6BED' : 'transparent',
                          display:'flex', alignItems:'center', justifyContent:'center' }}>
                          {isSel && <Icon name="check" size={12} color="#fff" stroke={3}/>}
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ height:16 }}/>
                </>
              )}
              <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute, letterSpacing:'0.08em',
                textTransform:'uppercase', marginBottom:8 }}>
                {contacts.length > 0 ? '새로운 동행인' : '동행인 초대'}
              </div>
              <input
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="구글 이메일 입력"
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                style={{ width:'100%', padding:'13px 14px', borderRadius:14,
                  border:`1.5px solid ${COLORS.line}`, background:COLORS.card,
                  fontFamily:SANS, fontSize:14, color:COLORS.ink, boxSizing:'border-box', outline:'none' }}/>
              {msg && (
                <div style={{ marginTop:8, fontFamily:SANS, fontSize:13,
                  color: msg.includes('보냈') ? COLORS.accent : '#C0392B' }}>{msg}</div>
              )}
            </>
          ) : (
            /* copy mode */
            <>
              <div style={{ background:COLORS.softer, borderRadius:14, padding:'12px 14px', marginBottom:16 }}>
                <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.ink, lineHeight:1.5 }}>
                  이메일 주소를 입력하면 상대방 앱에 알림이 전송됩니다. 상대방이 수락하면 이 일정의 복사본이 상대방의 <strong>My Trips</strong>에 추가됩니다.
                </div>
              </div>
              <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute, letterSpacing:'0.08em',
                textTransform:'uppercase', marginBottom:8 }}>받는 사람 이메일</div>
              <input
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="구글 이메일 입력"
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                style={{ width:'100%', padding:'13px 14px', borderRadius:14,
                  border:`1.5px solid ${COLORS.line}`, background:COLORS.card,
                  fontFamily:SANS, fontSize:14, color:COLORS.ink, boxSizing:'border-box', outline:'none' }}/>
              {msg && (
                <div style={{ marginTop:8, fontFamily:SANS, fontSize:13,
                  color: msg.includes('보냈') ? COLORS.accent : '#C0392B' }}>{msg}</div>
              )}
            </>
          )}
        </div>

        <button onClick={handleSend} disabled={sending || !canSend} style={{
          flexShrink:0, marginTop:14, width:'100%', padding:'15px', border:'none', borderRadius:14,
          background: canSend ? COLORS.ink : COLORS.softer,
          color: canSend ? COLORS.bg : COLORS.mute,
          fontFamily:SANS, fontSize:14, fontWeight:500, cursor: canSend ? 'pointer' : 'default',
        }}>{sending ? '보내는 중...' : mode === 'copy' ? '일정 보내기' : '초대 보내기'}</button>
      </div>
    </div>
  );
}

function TripsScreen({ trips, onSelect, onAdd, onRestore, onShare, onDelete, loading, userData, onOpenCompanion, myUid, onOpenNotifs, unreadCount }) {
  const [restoring, setRestoring] = React.useState(false);
  const [restoreErr, setRestoreErr] = React.useState('');
  const [expandedTripId, setExpandedTripId] = React.useState(null);
  const [tripMembersCache, setTripMembersCache] = React.useState({});

  const toggleTripExpand = async (tripId, memberUids) => {
    if (expandedTripId === tripId) { setExpandedTripId(null); return; }
    setExpandedTripId(tripId);
    if (!tripMembersCache[tripId] && memberUids.length) {
      const profiles = await window.fbGetUsersById(memberUids).catch(() => []);
      setTripMembersCache(prev => ({ ...prev, [tripId]: profiles }));
    }
  };
  const handleRestore = async () => {
    if (restoring || !onRestore) return;
    setRestoring(true); setRestoreErr('');
    try { await onRestore(); }
    catch (e) { setRestoreErr('복원 실패. 다시 시도해 주세요.'); setRestoring(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:COLORS.bg, paddingBottom:87, position:'relative' }}>
      {/* 프로필 버튼 */}
      <button onClick={onOpenCompanion} style={{
        position:'absolute', top:'calc(16px + env(safe-area-inset-top,0px))', right:20, zIndex:10,
        width:38, height:38, borderRadius:19,
        background: userData?.photoURL ? 'transparent' : COLORS.softer,
        border:`2px solid ${COLORS.line}`,
        padding:0, cursor:'pointer', overflow:'hidden',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 1px 6px rgba(0,0,0,0.10)',
      }}>
        {userData?.photoURL
          ? <img src={userData.photoURL} alt="profile" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          : <Icon name="user" size={18} color={COLORS.mute}/>
        }
      </button>
      {/* 알림 벨 버튼 */}
      <button onClick={onOpenNotifs} style={{
        position:'absolute', top:'calc(18px + env(safe-area-inset-top,0px))', right:68, zIndex:10,
        width:34, height:34, borderRadius:0,
        background:'transparent', border:'none',
        padding:0, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon name="bell" size={20} color={COLORS.ink} stroke={1.8}/>
        {unreadCount > 0 && (
          <div style={{
            position:'absolute', top:0, right:0,
            minWidth:15, height:15, borderRadius:8,
            background:'#E03C31', padding:'0 3px',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:MONO, fontSize:9, color:'#fff', fontWeight:700,
            boxSizing:'border-box',
          }}>{unreadCount > 9 ? '9+' : unreadCount}</div>
        )}
      </button>
      <div style={{
        paddingTop:'calc(16px + env(safe-area-inset-top,0px))',
        paddingLeft:20, paddingRight:112, paddingBottom:16,
      }}>
        <div style={{ fontFamily:SERIF, fontSize:34, color:COLORS.ink, letterSpacing:'-0.02em' }}>My Trips<span style={{fontFamily:'monospace',fontSize:11,color:COLORS.mute,marginLeft:8}}>v374</span></div>
      </div>
      {loading
        ? <div style={{ textAlign:'center', padding:60, color:COLORS.mute, fontFamily:SANS, fontSize:14 }}>로딩 중...</div>
        : <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:12 }}>
            {[...trips].sort((a, b) => (b.sampleId ? 1 : 0) - (a.sampleId ? 1 : 0)).map(t => {
              const hue = t.hue ?? t.days?.[0]?.hero?.hue ?? 25;
              const label = t.days?.[0]?.hero?.label || t.title?.toUpperCase() || 'TRIP';
              const companionCount = (t.members || []).filter(uid => uid !== myUid).length;
              const isSample = !!t.sampleId;
              return (
                <TripSwipeCard key={t.id}
                  onShare={() => onShare(t)}
                  onDelete={() => onDelete(t.id)}
                  wrapStyle={{ borderRadius:16, border:`1px solid ${COLORS.line}` }}>
                  <div style={{ background:COLORS.card, borderRadius:16, overflow:'hidden' }}>
                    <button onClick={() => onSelect(t.id)} style={{
                      display:'block', width:'100%', background:'none', border:'none',
                      padding:0, margin:0, textAlign:'left', cursor:'pointer',
                      WebkitTapHighlightColor:'transparent',
                    }}>
                      <Photo hue={hue} label={label} height={130}/>
                      <div style={{ padding:'14px 18px 16px', position:'relative' }}>
                        <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.accent, letterSpacing:'0.14em' }}>
                          {(t.days||[]).length} DAYS{t.dates ? ' · ' + t.dates : ''}
                        </div>
                        <div style={{ marginTop:4, fontFamily:SERIF, fontSize:28, lineHeight:1.1, color:COLORS.ink, letterSpacing:'-0.015em' }}>
                          {t.title || '새 여행'}
                        </div>
                        {isSample && (
                          <div style={{ position:'absolute', top:14, right:16 }}>
                            <div style={{
                              display:'flex', alignItems:'center', gap:3,
                              background:'#FFF5EB', borderRadius:20, padding:'4px 10px',
                              border:'1px solid rgba(193,79,46,0.15)',
                            }}>
                              <Icon name="sparkle" size={10} color={COLORS.accent} stroke={1.8}/>
                              <span style={{ fontFamily:SANS, fontSize:10, color:COLORS.accent, fontWeight:500 }}>샘플</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                    {/* 동행인 드롭다운 탭 */}
                    {companionCount > 0 && (() => {
                      const companionUids = (t.members||[]).filter(uid => uid !== myUid);
                      const isExp = expandedTripId === t.id;
                      const profiles = tripMembersCache[t.id] || [];
                      return (
                        <>
                          <button onClick={() => toggleTripExpand(t.id, companionUids)} style={{
                            width:'100%', border:'none', borderTop:`1px solid ${COLORS.line}`,
                            background:'none', cursor:'pointer', padding:'9px 18px',
                            display:'flex', alignItems:'center', gap:8,
                            WebkitTapHighlightColor:'transparent',
                          }}>
                            <Icon name="users" size={12} color={`oklch(0.45 0.07 ${hue})`} stroke={2}/>
                            <span style={{ fontFamily:MONO, fontSize:9.5, color:`oklch(0.45 0.07 ${hue})`, letterSpacing:'0.06em' }}>
                              동행인 {companionCount}명
                            </span>
                            <Icon name="chevron-d" size={11} color={COLORS.mute} stroke={2}
                              style={{ marginLeft:'auto', transform: isExp ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}/>
                          </button>
                          {isExp && (
                            <div style={{ padding:'0 12px 12px', display:'flex', flexDirection:'column', gap:6 }}>
                              {profiles.length === 0
                                ? companionUids.map(uid => (
                                    <div key={uid} style={{ background:COLORS.softer, borderRadius:10, padding:'9px 12px',
                                      display:'flex', alignItems:'center', gap:10 }}>
                                      <div style={{ width:30, height:30, borderRadius:15, background:COLORS.line, flexShrink:0 }}/>
                                      <div style={{ fontFamily:SANS, fontSize:12, color:COLORS.mute }}>불러오는 중...</div>
                                    </div>
                                  ))
                                : profiles.map(p => (
                                    <div key={p.uid} style={{ background:COLORS.softer, borderRadius:10, padding:'9px 12px',
                                      display:'flex', alignItems:'center', gap:10 }}>
                                      {p.photoURL
                                        ? <img src={p.photoURL} style={{ width:30, height:30, borderRadius:15, objectFit:'cover', flexShrink:0 }}/>
                                        : <div style={{ width:30, height:30, borderRadius:15, background:`oklch(0.82 0.05 ${hue})`, flexShrink:0,
                                            display:'flex', alignItems:'center', justifyContent:'center',
                                            fontFamily:SANS, fontSize:13, color:`oklch(0.4 0.08 ${hue})`, fontWeight:600 }}>
                                            {(p.displayName||'?')[0].toUpperCase()}
                                          </div>
                                      }
                                      <div style={{ flex:1, minWidth:0 }}>
                                        <div style={{ fontFamily:SANS, fontSize:13, fontWeight:500, color:COLORS.ink,
                                          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.displayName}</div>
                                        {p.email && <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute, marginTop:1,
                                          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.email}</div>}
                                      </div>
                                    </div>
                                  ))
                              }
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </TripSwipeCard>
              );
            })}
            {(trips.length === 0 || trips.every(t => !(t.days||[]).length)) && onRestore && (
              <div style={{ padding:'28px 20px', background:COLORS.card, borderRadius:16,
                border:`1px solid ${COLORS.line}`, textAlign:'center', marginBottom:4 }}>
                <div style={{ fontFamily:SERIF, fontSize:24, color:COLORS.ink, marginBottom:6 }}>New York</div>
                <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.mute, marginBottom:18 }}>
                  10일 뉴욕 일정을 복원합니다
                </div>
                {restoreErr && <div style={{ fontFamily:SANS, fontSize:12, color:COLORS.accent, marginBottom:10 }}>{restoreErr}</div>}
                <button onClick={handleRestore} disabled={restoring} style={{
                  padding:'12px 28px', background: restoring ? COLORS.mute : COLORS.ink,
                  border:'none', borderRadius:12, color:COLORS.bg,
                  fontFamily:SANS, fontSize:13, fontWeight:500,
                  cursor: restoring ? 'default' : 'pointer', opacity: restoring ? 0.7 : 1,
                }}>{restoring ? '복원 중...' : '뉴욕 일정 복원하기'}</button>
              </div>
            )}
            <button onClick={onAdd} style={{ marginTop:4, padding:'18px 16px', background:'transparent',
              border:`1.5px dashed ${COLORS.line}`, borderRadius:16, color:COLORS.mute, cursor:'pointer',
              display:'flex', gap:8, alignItems:'center', justifyContent:'center', fontFamily:SANS, fontSize:13.5 }}>
              <Icon name="plus" size={15} color={COLORS.mute} stroke={2}/>새 여행 추가
            </button>
          </div>
      }
      <div style={{ textAlign:'center', paddingTop:20 }}>
        <div className="arshooling-text" style={{ fontFamily:'Adam, serif', fontSize:15, letterSpacing:'0.18em' }}>ARSHOOLING</div>
      </div>
    </div>
  );
}

// ─── 날짜 변환 유틸 (앱 전역) ─────────────────────────────────
const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function extractTripYear(trip) {
  const m = (trip.dates || '').match(/(\d{4})/);
  if (m) return parseInt(m[1], 10);
  return new Date().getFullYear();
}
function dayDateToIso(txt, tripYear) {
  if (!txt) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(txt)) return txt.slice(0, 10);
  const m = txt.match(/([A-Za-z]+)\s+(\d{1,2})(?:,?\s*(\d{4}))?/);
  if (!m) return '';
  const mi = MONTH_NAMES_SHORT.findIndex(x => x.toLowerCase() === m[1].slice(0, 3).toLowerCase());
  if (mi < 0) return '';
  const year = m[3] ? parseInt(m[3], 10) : (tripYear || new Date().getFullYear());
  return `${year}-${String(mi + 1).padStart(2, '0')}-${String(m[2]).padStart(2, '0')}`;
}
function isoToDayDate(iso) {
  if (!iso) return '';
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${MONTH_NAMES_SHORT[parseInt(m[2], 10) - 1]} ${parseInt(m[3], 10)}, ${m[1]}`;
}
function isoToWeekday(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return WEEKDAY_NAMES[d.getDay()];
}

// ─── Home ───────────────────────────────────────────────────
function HomeScreen({ trip, onOpenDay, onOpenHotel, onOpenHotelSheet, city, onPickCity,
                      curCode, onSetCurCode,
                      onEditTrip, onReorderDays, onAddDay, onDeleteDay, onBack,
                      onAddHotel, onAddHotelFromSearch, onAddHotelViaStop, onDeleteHotel, onReorderHotels,
                      onConvertInlineHotel, onAddItemToFirstDay, editing, setEditing,
                      userData, onOpenCompanion, onLoadSample, onOpenNotifs, unreadCount }) {
  const [editingTitle, setEditingTitle] = React.useState(false);
  const [dateRangeOpen, setDateRangeOpen] = React.useState(false);
  React.useEffect(() => { if (!editing) setEditingTitle(false); }, [editing]);
  const [sampleLoading, setSampleLoading] = React.useState(false);
  const [sampleErr, setSampleErr] = React.useState('');
  const handleLoadSample = async () => {
    if (!onLoadSample || sampleLoading) return;
    setSampleLoading(true); setSampleErr('');
    try { await onLoadSample(); }
    catch (e) { setSampleErr('저장 실패. 네트워크 확인 후 다시 시도해 주세요.'); }
    finally { setSampleLoading(false); }
  };
  const { itemProps: dayDragProps, isTouchDragging: isDayDragging } = useDragReorder(onReorderDays, editing);
  const { itemProps: hotelDragProps, isTouchDragging: isHotelDragging } = useDragReorder(onReorderHotels, editing);
  const tripYear = extractTripYear(trip);
  const todayIso = new Date().toISOString().slice(0, 10);
  const calcFeaturedIdx = () => {
    const isos = trip.days.map(d => dayDateToIso(d.date, tripYear) || '');
    const todayIdx = isos.findIndex(iso => iso === todayIso);
    if (todayIdx >= 0) return todayIdx;
    const future = isos.findIndex(iso => iso > todayIso);
    if (future === 0 || isos.every(iso => !iso)) return 0;
    if (future < 0) return trip.days.length - 1;
    return future - 1;
  };
  const [featuredIdx, setFeaturedIdx] = React.useState(calcFeaturedIdx);
  const [featuredAnim, setFeaturedAnim] = React.useState({ key: 0, dir: 0 });
  const featuredTouchRef = React.useRef({ x: 0, y: 0 });
  React.useEffect(() => { setFeaturedIdx(calcFeaturedIdx()); }, [trip.days.length]);
  // 슬라이더 상태
  const [fOffset, setFOffset] = React.useState(0);
  const [fWidth, setFWidth]   = React.useState(window.innerWidth);  // 측정된 실제 너비
  const fOffsetRef = React.useRef(0);
  const fGesture   = React.useRef({ on:false, startX:0, startY:0, drag:false });
  const fVelSamples = React.useRef([]);
  const fWrapRef   = React.useRef(null);
  const fTrackRef  = React.useRef(null);
  const fW = () => fWrapRef.current?.offsetWidth || fWidth;

  // 마운트 후 실제 너비 측정 (다른 화면 갔다 돌아올 때도 정확히 반영)
  React.useLayoutEffect(() => {
    if (fWrapRef.current) setFWidth(fWrapRef.current.offsetWidth);
  }, []);

  const fTrans = (dur, ease) => {
    if (fTrackRef.current)
      fTrackRef.current.style.transition = `transform ${dur}ms ${ease}`;
  };
  const fSetNone = () => { if (fTrackRef.current) fTrackRef.current.style.transition = 'none'; };
  const fSet = (v) => { fOffsetRef.current = v; setFOffset(v); };

  const changeFeatured = (newIdx) => {
    if (newIdx < 0 || newIdx >= trip.days.length || newIdx === featuredIdx) return;
    fTrans(320, 'cubic-bezier(0.4,0,0.2,1)');
    setFeaturedIdx(newIdx);
    fSet(0);
  };
  const onFStart = e => {
    fGesture.current = { on:true, startX:e.touches[0].clientX, startY:e.touches[0].clientY, drag:false };
    fVelSamples.current = [];
  };
  const onFMove = e => {
    const g = fGesture.current;
    if (!g.on) return;
    const x = e.touches[0].clientX;
    const dx = x - g.startX;
    const dy = Math.abs(e.touches[0].clientY - g.startY);
    if (!g.drag) {
      if (dy > Math.abs(dx) + 8) { g.on = false; return; }
      if (Math.abs(dx) > 6) g.drag = true;
    }
    if (!g.drag) return;
    // 속도 샘플 기록 (최근 6개 유지)
    const now = Date.now();
    fVelSamples.current.push({ x, t: now });
    if (fVelSamples.current.length > 6) fVelSamples.current.shift();
    fSetNone();
    const w = fW();
    // 첫/마지막 카드에서 약한 저항감 (rubber band)
    let limited;
    if (dx < 0 && featuredIdx >= trip.days.length - 1)
      limited = dx * 0.18;
    else if (dx > 0 && featuredIdx <= 0)
      limited = dx * 0.18;
    else
      limited = dx < 0 ? Math.max(dx, -w * 1.1) : Math.min(dx, w * 1.1);
    fSet(limited);
  };
  const onFEnd = () => {
    const g = fGesture.current;
    fGesture.current = { ...g, on:false, drag:false };
    if (!g.drag) return;
    const w = fW();
    const cur = fOffsetRef.current;
    // 최근 샘플로 속도 계산 (px/ms)
    const samples = fVelSamples.current;
    let vel = 0;
    if (samples.length >= 2) {
      const a = samples[0], b = samples[samples.length - 1];
      const dt = b.t - a.t;
      if (dt > 0) vel = (b.x - a.x) / dt;
    }
    const byDist  = Math.abs(cur) > w * 0.2;
    const byFlick = Math.abs(vel) > 0.25;  // 0.25 px/ms 이상이면 빠른 스와이프
    const toNext  = (cur < 0 && (byDist || byFlick)) && featuredIdx < trip.days.length - 1;
    const toPrev  = (cur > 0 && (byDist || byFlick)) && featuredIdx > 0;
    // 이동 거리에 비례한 애니메이션 속도 (빠른 스와이프 = 짧은 duration)
    const remaining = toNext ? w + cur : toPrev ? w - cur : Math.abs(cur);
    const dur = Math.min(360, Math.max(180, remaining * 0.9));
    fTrans(dur, 'cubic-bezier(0.25,0.46,0.45,0.94)');
    if (toNext) {
      fSet(-w);
      setTimeout(() => { fSetNone(); setFeaturedIdx(i => i + 1); fSet(0); }, dur + 20);
    } else if (toPrev) {
      fSet(w);
      setTimeout(() => { fSetNone(); setFeaturedIdx(i => i - 1); fSet(0); }, dur + 20);
    } else {
      // 스냅백: 스프링 느낌
      fTrans(380, 'cubic-bezier(0.22,1,0.36,1)');
      fSet(0);
    }
  };
  const featured = trip.days[featuredIdx];

  // trip.dates 파싱: "May 4 — May 13, 2025"
  const parseTripDates = () => {
    const str = trip.dates || '';
    const parts = str.split(/\s*[—–-]\s*/);
    const startStr = parts[0]?.trim() || '';
    const endStr   = parts[1]?.trim() || '';
    // 연도가 없으면 tripYear 붙이기
    const addYear = (s) => /\d{4}/.test(s) ? s : s ? `${s}, ${tripYear}` : '';
    return {
      startIso: dayDateToIso(addYear(startStr), tripYear),
      endIso:   dayDateToIso(addYear(endStr),   tripYear),
    };
  };

  const handlePickRange = (newStartIso, newEndIso) => {
    const { startIso: oldStart } = parseTripDates();
    let days = trip.days;
    let hotels = trip.hotels || [];
    // 시작일 변경 시 모든 일정 날짜 + 숙소 날짜 동시 이동
    if (newStartIso && oldStart && oldStart !== newStartIso) {
      const diffDays = Math.round(
        (new Date(newStartIso+'T12:00:00').getTime() - new Date(oldStart+'T12:00:00').getTime()) / 86400000
      );
      const shiftIso = (iso) => {
        if (!iso) return iso;
        const d = new Date(new Date(iso+'T12:00:00').getTime() + diffDays*86400000);
        return d.toISOString().slice(0,10);
      };
      const shiftHotelDate = (dateStr) => {
        if (!dateStr) return dateStr;
        const iso = dayDateToIso(dateStr, tripYear);
        if (!iso) return dateStr;
        const newIso = shiftIso(iso);
        const m = newIso.match(/^(\d{4})-(\d{2})-(\d{2})/);
        return m ? `${MONTH_NAMES_SHORT[parseInt(m[2],10)-1]} ${parseInt(m[3],10)}` : dateStr;
      };
      days = (trip.days || []).map(d => {
        const dIso = dayDateToIso(d.date, tripYear);
        if (!dIso) return d;
        const iso = shiftIso(dIso);
        return { ...d, date: isoToDayDate(iso), weekday: isoToWeekday(iso) };
      });
      hotels = hotels.map(h => ({
        ...h,
        checkin:  shiftHotelDate(h.checkin),
        checkout: shiftHotelDate(h.checkout),
      }));
    }
    const newStart = newStartIso ? isoToDayDate(newStartIso) : '';
    const newEnd   = newEndIso   ? isoToDayDate(newEndIso)   : '';
    onEditTrip({ days, hotels, dates: newEnd ? `${newStart} — ${newEnd}` : newStart });
  };

  const { startIso, endIso } = parseTripDates();

  return (
    <div style={{ background:COLORS.bg, minHeight:'100vh', paddingBottom:87, position:'relative' }}>
      {/* My Trips 뒤로 버튼 */}
      {onBack && (
        <button onClick={onBack} style={{
          position:'absolute', top:'calc(16px + env(safe-area-inset-top,0px))', left:14, zIndex:10,
          background:'transparent', border:'none', padding:'4px 8px', cursor:'pointer',
          display:'flex', alignItems:'center', gap:3,
          fontFamily:SANS, fontSize:13, color:COLORS.mute,
        }}>
          <Icon name="chevron-l" size={14} color={COLORS.mute} stroke={2}/>My Trips
        </button>
      )}
      {/* 프로필 버튼 — 페이지 상단에만 고정, 스크롤하면 올라감 */}
      {onOpenCompanion && (
        <button onClick={onOpenCompanion} style={{
          position:'absolute', top:'calc(16px + env(safe-area-inset-top,0px))', right:20, zIndex:10,
          width:38, height:38, borderRadius:19,
          background: userData?.photoURL ? 'transparent' : COLORS.softer,
          border:`2px solid ${COLORS.line}`,
          padding:0, cursor:'pointer', overflow:'hidden',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 1px 6px rgba(0,0,0,0.10)',
        }}>
          {userData?.photoURL
            ? <img src={userData.photoURL} alt="profile" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
            : <Icon name="user" size={18} color={COLORS.mute}/>
          }
        </button>
      )}
      {onOpenNotifs && (
        <button onClick={onOpenNotifs} style={{
          position:'absolute', top:'calc(18px + env(safe-area-inset-top,0px))', right:68, zIndex:10,
          width:34, height:34,
          background:'transparent', border:'none',
          padding:0, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon name="bell" size={20} color={COLORS.ink} stroke={1.8}/>
          {unreadCount > 0 && (
            <div style={{
              position:'absolute', top:2, right:2,
              width:8, height:8, borderRadius:4,
              background:'#E03C31',
            }}/>
          )}
        </button>
      )}
      <div style={{ paddingTop:'calc(52px + env(safe-area-inset-top, 0px))' }}/>

      <div style={{ padding:'10px 24px 18px' }}>
        {editing && editingTitle ? (
          <input autoFocus value={trip.title} onChange={e => onEditTrip({ title: e.target.value })}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
            style={{ fontFamily:SERIF, fontSize:56, lineHeight:0.95, color:COLORS.ink,
              letterSpacing:'-0.025em', fontWeight:400, border:'none', outline:'none',
              background:'transparent', width:'100%', padding:'8px 14px',
              borderRadius:12, boxSizing:'border-box' }}/>
        ) : (
          <div onClick={() => editing && setEditingTitle(true)} style={{
            fontFamily:SERIF, fontSize:56, lineHeight:0.95, color:COLORS.ink,
            letterSpacing:'-0.025em', fontWeight:400,
            cursor: editing ? 'text' : 'default',
            ...(editing ? {
              background: COLORS.card,
              border: `1.5px solid ${COLORS.line}`,
              borderRadius: 12,
              padding: '8px 14px',
            } : {}),
          }}>{trip.title}{!editing && '.'}</div>
        )}
        <div style={{ marginTop:10, display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
          {editing ? (
            <>
              <button onClick={() => setDateRangeOpen(true)} style={{
                border:`1.5px solid ${COLORS.line}`, borderRadius:8, padding:'4px 10px',
                background:COLORS.card, cursor:'pointer', fontFamily:SANS, fontSize:12, color:COLORS.ink,
                display:'flex', alignItems:'center', gap:5,
              }}>
                <Icon name="book" size={11} color={COLORS.mute} stroke={1.8}/>
                {startIso ? isoToDayDate(startIso) : '시작일'}
              </button>
              <span style={{ color:COLORS.mute, fontSize:13 }}>—</span>
              <button onClick={() => setDateRangeOpen(true)} style={{
                border:`1.5px solid ${COLORS.line}`, borderRadius:8, padding:'4px 10px',
                background:COLORS.card, cursor:'pointer', fontFamily:SANS, fontSize:12, color:COLORS.ink,
                display:'flex', alignItems:'center', gap:5,
              }}>
                <Icon name="book" size={11} color={COLORS.mute} stroke={1.8}/>
                {endIso ? isoToDayDate(endIso) : '종료일'}
              </button>
            </>
          ) : (
            <span style={{ fontFamily:SANS, fontSize:13, color:COLORS.mute }}>{trip.dates}</span>
          )}
          <span style={{ color:COLORS.mute, opacity:0.4, fontSize:13 }}>·</span>
          <span style={{ fontFamily:SANS, fontSize:13, color:COLORS.mute }}>{trip.days.length} days</span>
        </div>
        {/* 색깔 선택 (수정 모드) */}
        {editing && (
          <div style={{ marginTop:12, display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
            {[20, 45, 90, 140, 200, 240, 280, 320, 350, 0].map(h => {
              const sel = (trip.hue ?? 25) === h;
              return (
                <button key={h} onClick={() => onEditTrip({ hue: h })} style={{
                  width: sel ? 30 : 24, height: sel ? 30 : 24,
                  borderRadius: '50%', padding: 0, cursor: 'pointer', flexShrink: 0,
                  background: `oklch(0.78 0.07 ${h})`,
                  border: sel ? `3px solid ${COLORS.ink}` : `2px solid rgba(0,0,0,0.08)`,
                  boxShadow: sel ? '0 0 0 2px rgba(0,0,0,0.12)' : 'none',
                  transition: 'all 0.15s',
                }}/>
              );
            })}
          </div>
        )}
      </div>

      {/* Featured */}
      {featured && (
        /* 클립 컨테이너: 화면 전체 너비, 오버플로만 숨김 */
        <div ref={fWrapRef}
          onTouchStart={onFStart} onTouchMove={onFMove} onTouchEnd={onFEnd}
          style={{ overflow:'hidden', position:'relative' }}>
          {/* 트랙: 모든 날 + 각 날의 여백이 함께 이동 */}
          <div ref={fTrackRef} style={{
            display:'flex',
            /* px 기반 translation: CSS % 기준값 불안정 문제 방지 */
            transform: `translateX(${-(featuredIdx * fW()) + fOffset}px)`,
            willChange: 'transform',
          }}>
            {trip.days.map((d, i) => (
              /* border-box: padding 포함한 전체 너비 = fW() → 슬라이드 1칸 = 화면 너비 */
              <div key={i} style={{ width:fW(), flexShrink:0, boxSizing:'border-box', padding:'4px 16px 18px' }}>
                <div style={{
                  borderRadius:22, overflow:'hidden',
                  boxShadow:'0 1px 2px rgba(0,0,0,0.03), 0 12px 28px rgba(0,0,0,0.05)',
                  background:COLORS.card,
                }}>
                  <Photo hue={(i === 0 ? (trip.hue ?? d.hero?.hue) : d.hero?.hue) ?? 25} label={d.hero?.label} height={170}/>
                  <div style={{ padding:'16px 18px 18px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                      <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.accent, letterSpacing:'0.14em' }}>
                        DAY {String(d.n).padStart(2,'0')} · {d.weekday.toUpperCase()}
                      </div>
                      <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute }}>{d.date}</div>
                    </div>
                    <div style={{ marginTop:7, fontFamily:SERIF, fontSize:28, lineHeight:1.1, color:COLORS.ink }}>
                      {d.title}
                    </div>
                    <button onClick={() => !fGesture.current.drag && onOpenDay(i)} style={{
                      marginTop:16, width:'100%', border:'none', cursor:'pointer',
                      background:COLORS.ink, color:COLORS.bg, borderRadius:12,
                      padding:'13px 16px', fontFamily:SANS, fontSize:14, fontWeight:500,
                      display:'flex', justifyContent:'space-between', alignItems:'center',
                    }}>
                      <span>{i === 0 ? '첫날 일정 보기' : `Day ${d.n} 일정 보기`}</span>
                      <Icon name="chevron" size={16} color={COLORS.bg}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Days list */}
      <div style={{ padding:'8px 24px 10px', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink }}>일정</div>
        <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em' }}>
          {trip.days.length} DAYS · {trip.days.reduce((s,d)=>s+(d.items?.length||0),0)} STOPS
        </div>
      </div>
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:8 }}>
        {trip.days.map((d, i) => {
          const dp = dayDragProps(i);
          return (
            <div key={i} ref={dp.ref} style={dp.style || {}}>
            <SwipeableRow cardSwipe onEdit={() => onOpenDay(i)} onDelete={() => onDeleteDay(i)} disabled={editing} isDragging={isDayDragging} wrapStyle={{ borderRadius:16 }}>
            <div onTouchStart={dp.onTouchStart} onTouchMove={dp.onTouchMove} onTouchEnd={dp.onTouchEnd}
              onClick={() => !editing && !isDayDragging && onOpenDay(i)} style={{
              borderRadius:16,
              cursor: editing ? 'grab' : 'pointer',
              background: COLORS.card,
            }}>
              <div style={{ padding:12, display:'flex', gap:12, alignItems:'center' }}>
                  <div style={{ width:64, height:64, borderRadius:10, overflow:'hidden', flexShrink:0 }}>
                    <Photo hue={(i === 0 ? (trip.hue ?? d.hero?.hue) : d.hero?.hue) ?? 25} height={64} small/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'baseline' }}>
                      <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.12em' }}>
                        DAY {String(d.n).padStart(2,'0')}
                      </div>
                      <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute }}>
                        {d.date} · {d.weekday}
                      </div>
                    </div>
                    <div style={{ marginTop:3, fontFamily:SERIF, fontSize:18, lineHeight:1.2, color:COLORS.ink,
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.title}</div>
                    <div style={{ marginTop:3, fontFamily:SANS, fontSize:11.5, color:COLORS.mute,
                      display:'flex', gap:5, alignItems:'center' }}>
                      <Icon name="pin" size={11} color={COLORS.mute} stroke={1.8}/>
                      <span>{d.items?.length ?? 0} stops</span>
                    </div>
                  </div>
                  {editing ? (
                    <>
                      <DragHandle size={14} color={COLORS.mute} {...dp.handleProps}/>
                      {/* 드래그 중엔 삭제 버튼 숨김 */}
                      {!isDayDragging && (
                        <button onClick={(e)=>{e.stopPropagation(); onDeleteDay(i);}} style={{
                          width:26, height:26, borderRadius:13, border:'none',
                          background:'rgba(193,79,46,0.12)', cursor:'pointer',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          <Icon name="trash" size={12} color={COLORS.accent} stroke={2}/>
                        </button>
                      )}
                    </>
                  ) : (
                    <Icon name="chevron" size={16} color={COLORS.mute} stroke={1.8}/>
                  )}
                </div>
            </div>
            </SwipeableRow>
            </div>
          );
        })}
        {(() => {
          return null;
        })()}
        {!editing && (
          <button onClick={onAddDay} style={{
            padding:'16px 12px', background:'transparent',
            border:`1.5px dashed ${COLORS.line}`, borderRadius:16,
            color:COLORS.mute, cursor:'pointer',
            display:'flex', gap:8, alignItems:'center', justifyContent:'center',
            fontFamily:SANS, fontSize:13,
          }}>
            <Icon name="plus" size={14} color={COLORS.mute} stroke={2}/> 일정 추가
          </button>
        )}
        {editing && (
          <button onClick={onAddDay} style={{
            padding:'16px 12px', background:'transparent',
            border:`1.5px dashed ${COLORS.line}`, borderRadius:16,
            color:COLORS.mute, cursor:'pointer',
            display:'flex', gap:8, alignItems:'center', justifyContent:'center',
            fontFamily:SANS, fontSize:13,
          }}>
            <Icon name="plus" size={14} color={COLORS.mute} stroke={2}/> 일차 추가
          </button>
        )}
      </div>

      {/* Hotels */}
      {(() => {
        const hotelList = (trip.hotels || [])
          .map((h, idx) => ({ ...h, _idx: idx }))
          .sort((a, b) => (a.checkin || '') < (b.checkin || '') ? -1 : (a.checkin || '') > (b.checkin || '') ? 1 : 0);
        const total = hotelList.length;
        const openHotel = (idx) => onOpenHotelSheet ? onOpenHotelSheet(idx) : onOpenHotel(idx);
        return (
          <>
            <div style={{ padding:'22px 24px 8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink }}>숙소</div>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                {!editing && (
                  <button onClick={() => onAddHotelViaStop ? onAddHotelViaStop() : onOpenHotelSheet ? onOpenHotelSheet('new') : onAddHotel()} style={{
                    width:28, height:28, borderRadius:14, border:'none',
                    background:COLORS.softer, cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon name="plus" size={14} color={COLORS.mute} stroke={2}/>
                  </button>
                )}
                <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em' }}>
                  {total} STAYS
                </div>
              </div>
            </div>
            <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:8 }}>
              {hotelList.map((h, i) => {
                const hp = hotelDragProps(h._idx);
                return (
                  <div key={h._idx} ref={hp.ref} style={hp.style || {}}>
                  <SwipeableRow cardSwipe onEdit={() => openHotel(h._idx)} onDelete={() => onDeleteHotel(h._idx)} disabled={editing} wrapStyle={{ borderRadius:16 }}>
                  <div onTouchStart={hp.onTouchStart} onTouchMove={hp.onTouchMove} onTouchEnd={hp.onTouchEnd} onClick={() => !editing && openHotel(h._idx)} style={{
                    background:COLORS.card, borderRadius:16, padding:12,
                    display:'flex', gap:12, alignItems:'center',
                    cursor: editing ? 'grab' : 'pointer',
                    border: hp['data-drag-over'] ? `2px solid ${COLORS.accent}` : 'none',
                  }}>
                    <div style={{ width:64, height:64, borderRadius:10, overflow:'hidden', flexShrink:0 }}>
                      <Photo hue={h.hue ?? 25} height={64} small/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.accent, letterSpacing:'0.12em' }}>
                        STAY · {h.checkin} → {h.checkout}
                      </div>
                      <div style={{ marginTop:3, fontFamily:SERIF, fontSize:18, lineHeight:1.2, color:COLORS.ink,
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{h.name}</div>
                      <div style={{ marginTop:3, fontFamily:SANS, fontSize:11.5, color:COLORS.mute,
                        display:'flex', gap:5, alignItems:'center' }}>
                        <Icon name="pin" size={11} color={COLORS.mute} stroke={1.8}/>
                        <span>{h.area}</span>
                        {h.nights && <><span style={{opacity:0.4}}>·</span><span>{h.nights}박</span></>}
                        {h.price && <><span style={{opacity:0.4}}>·</span><span>{h.price}</span></>}
                      </div>
                    </div>
                    {editing ? (
                      <>
                        <DragHandle size={14} color={COLORS.mute} {...hp.handleProps}/>
                        <button onClick={(e)=>{e.stopPropagation(); onDeleteHotel(h._idx);}} style={{
                          width:26, height:26, borderRadius:13, border:'none',
                          background:'rgba(193,79,46,0.12)', cursor:'pointer',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          <Icon name="trash" size={12} color={COLORS.accent} stroke={2}/>
                        </button>
                      </>
                    ) : (
                      <Icon name="chevron" size={16} color={COLORS.mute} stroke={1.8}/>
                    )}
                  </div>
                  </SwipeableRow>
                  </div>
                );
              })}
      </div>
          </>
        );
      })()}

      {/* Practical */}
      <div style={{ padding:'22px 24px 8px' }}>
        <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink }}>실용 정보</div>
      </div>
      <div style={{ padding:'0 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        <FxCard curCode={curCode} onSetCurCode={onSetCurCode}/>
        <TimezoneCard city={city} onPick={onPickCity}/>
      </div>
      <div style={{ padding:'8px 16px 0' }}>
        <WeatherCard city={city}/>
      </div>
      <div style={{ textAlign:'center', paddingTop:16 }}>
        <div className="arshooling-text" style={{ fontFamily:'Adam, serif', fontSize:15, letterSpacing:'0.18em' }}>ARSHOOLING</div>
      </div>

      {/* 날짜 달력 팝업 */}
      <DateRangeSheet
        open={dateRangeOpen}
        startIso={startIso}
        endIso={endIso}
        onClose={() => setDateRangeOpen(false)}
        onPick={(s, e) => { handlePickRange(s, e); setDateRangeOpen(false); }}
      />
    </div>
  );
}

// ─── Day screen ─────────────────────────────────────────────
function DayScreen({ trip, dayIdx, onBack, onOpenStop, onNavDay,
                     onEditDay, onAddItem, onDeleteItem, onReorderItems, editing, setEditing }) {
  const day = trip.days[dayIdx] || { n: dayIdx+1, title:'', date:'', weekday:'', hero:{ hue:25, label:'' }, items:[] };
  const tripYear = extractTripYear(trip);
  const [travelTimes, setTravelTimes] = React.useState({});

  React.useEffect(() => {
    const items = day.items || [];
    const coordsKey = items.map(it => it.coords ? it.coords.join(',') : '').join('|');
    const cacheKey = `tt_day_${trip.title}_${dayIdx}_${coordsKey}`;
    const pending = items.reduce((acc, it, i) => {
      if (i > 0 && it.coords && items[i-1].coords) acc.push(i);
      return acc;
    }, []);
    if (!pending.length) { setTravelTimes({}); return; }

    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) { setTravelTimes(JSON.parse(cached)); return; }
    } catch(_) {}

    let alive = true;
    const results = {};
    Promise.all(pending.map(async (i) => {
      const [lat1, lon1] = items[i-1].coords;
      const [lat2, lon2] = items[i].coords;
      try {
        const r = await (await fetch(
          `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`
        )).json();
        if (r.routes?.[0]) {
          const { duration, distance } = r.routes[0];
          results[i] = {
            drive: Math.max(1, Math.round(duration / 60)),
            walk: Math.max(1, Math.round(distance / 83.33)),
          };
        }
      } catch(_) {}
    })).then(() => {
      if (!alive) return;
      setTravelTimes(results);
      try { localStorage.setItem(cacheKey, JSON.stringify(results)); } catch(_) {}
    });
    return () => { alive = false; };
  }, [dayIdx, (day.items||[]).map(it => it.coords ? it.coords.join(',') : '').join('|')]);

  const fmtMin = (m) => m >= 60 ? `${Math.floor(m/60)}시간${m%60 ? ` ${m%60}분` : ''}` : `${m}분`;

  const [done, setDone] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('done_' + trip.title + '_' + dayIdx) || '[]')); }
    catch(e) { return new Set(); }
  });
  const toggle = (i) => setDone(s => {
    const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i);
    localStorage.setItem('done_' + trip.title + '_' + dayIdx, JSON.stringify([...n]));
    return n;
  });
  const [editingTitle, setEditingTitle] = React.useState(false);
  const [inlineItemTitle, setInlineItemTitle] = React.useState(null);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [nearbyStop, setNearbyStop] = React.useState(null);
  const [nearbyTab, setNearbyTab]   = React.useState('hotspot');
  const { itemProps: itemDragProps } = useDragReorder(onReorderItems, editing);

  const heroHue = (dayIdx === 0 ? (trip.hue ?? day.hero?.hue) : day.hero?.hue) ?? 25;
  const heroBg  = `oklch(0.88 0.035 ${heroHue})`;
  return (
    <div style={{ background:COLORS.bg, minHeight:'100vh', paddingBottom:110 }}>
      <div style={{ position:'relative', background: heroBg }}>
        <Photo hue={heroHue} label={day.hero?.label} height={'calc(280px + env(safe-area-inset-top, 0px))'}/>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'calc(180px + env(safe-area-inset-top, 0px))',
          background:'linear-gradient(180deg, rgba(0,0,0,0.22), transparent)' }}/>
        <button onClick={onBack} style={{
          position:'absolute', top:'calc(16px + env(safe-area-inset-top, 0px))', left:16, zIndex:5,
          width:38, height:38, borderRadius:19, border:'none',
          background:'rgba(255,255,255,0.88)',
          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
        }}>
          <Icon name="chevron-l" size={18} color={COLORS.ink} stroke={2}/>
        </button>
        <div style={{ position:'absolute', top:'calc(16px + env(safe-area-inset-top, 0px))', right:16, zIndex:5 }}>
          <EditBtn editing={editing} onClick={() => setEditing(e => !e)}/>
        </div>

        <div style={{ position:'absolute', left:0, right:0, bottom:-30, padding:'0 16px' }}>
          <div style={{ background:COLORS.bg, borderRadius:20, padding:'18px 20px 18px' }}>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.accent, letterSpacing:'0.14em' }}>
                DAY {String(day.n).padStart(2,'0')} / {String(trip.days.length).padStart(2,'0')}
              </div>
              <span style={{ color:COLORS.line }}>·</span>
              {editing ? (
                <button onClick={() => setDatePickerOpen(true)} style={{
                  border:'none', background:COLORS.softer, borderRadius:8, cursor:'pointer',
                  fontFamily:SANS, fontSize:11, color:COLORS.ink,
                  padding:'3px 8px', display:'flex', alignItems:'center', gap:5,
                }}>
                  <Icon name="book" size={11} color={COLORS.mute} stroke={1.8}/>
                  {day.weekday && day.date ? `${day.weekday} · ${day.date}` : '날짜 설정'}
                </button>
              ) : (
                <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute }}>
                  {day.weekday}{day.weekday && day.date ? ' · ' : ''}{day.date}
                </div>
              )}
            </div>
            {editing ? (
              <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:6 }}>
                <input value={day.title} onChange={e => onEditDay({ title: e.target.value })}
                  placeholder="날 제목"
                  style={{ width:'100%', padding:'8px 10px', borderRadius:8, boxSizing:'border-box',
                    border:`1px solid ${COLORS.line}`, background:COLORS.card,
                    fontFamily:SERIF, fontSize:20, color:COLORS.ink, outline:'none' }}/>
                <input value={day.titleEn || ''} onChange={e => onEditDay({ titleEn: e.target.value })}
                  placeholder="Subtitle (English)"
                  style={{ width:'100%', padding:'8px 10px', borderRadius:8, boxSizing:'border-box',
                    border:`1px solid ${COLORS.line}`, background:COLORS.card,
                    fontFamily:SANS, fontSize:13, fontStyle:'italic', color:COLORS.mute, outline:'none' }}/>
              </div>
            ) : (
              <>
                <div style={{ marginTop:8, fontFamily:SERIF, fontSize:30, lineHeight:1.08, color:COLORS.ink }}>
                  {day.title}
                </div>
                {day.titleEn && (
                  <div style={{ marginTop:2, fontFamily:SANS, fontSize:13, color:COLORS.mute, fontStyle:'italic' }}>
                    {day.titleEn}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding:'48px 16px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'0 6px 12px' }}>
          <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink }}>타임라인</div>
          <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em' }}>
            {done.size}/{day.items?.length ?? 0} DONE
          </div>
        </div>

        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', left:40, top:14, bottom:14, width:1, background:COLORS.line }}/>
          {(day.items || []).map((it, i) => {
            const meta = CAT_META[it.cat] || { icon:'pin', label:it.cat };
            const isDone = done.has(i);
            const dp = itemDragProps(i);
            return (
              <div key={i} {...dp} style={{ display:'flex', alignItems:'flex-start', marginBottom:12, position:'relative', ...(dp.style || {}) }}>
                {/* 시간 — marginTop으로 카드 첫째 줄에 맞춤 */}
                <div style={{ width:32, flexShrink:0, marginTop:11,
                  fontFamily:MONO, fontSize:10.5, color:COLORS.mute,
                  textAlign:'right', paddingRight:4 }}>{it.time}</div>
                {/* 체크박스: 타임라인 선 가로 중간(x=40)에 독립 배치 — 슬라이드 시 카드에 가려짐 */}
                <button onClick={(e)=>{e.stopPropagation(); toggle(i);}} style={{
                  width:16, height:16, borderRadius:8, flexShrink:0, marginTop:11,
                  boxSizing:'border-box',
                  border:`1.5px solid ${isDone?COLORS.accent:COLORS.ink}`,
                  background: isDone?COLORS.accent:COLORS.bg, cursor:'pointer', padding:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {isDone && <Icon name="check" size={10} color="#fff" stroke={3}/>}
                </button>
                <SwipeableRow
                  cardSwipe
                  wrapStyle={{ flex:1, marginLeft:12, borderRadius:14 }}
                  disabled={editing}
                  onEdit={() => onOpenStop({ idx: i, stop: it, editing: true })}
                  onDelete={() => onDeleteItem(i)}>
                {/* 카드 본체 */}
                <div style={{ position:'relative' }}>
                  {!editing && (
                    <div style={{ position:'absolute', top:8, right:8, zIndex:5, display:'flex', gap:4 }}>
                      <button onClick={(e)=>{ e.stopPropagation(); setNearbyTab('hotspot'); setNearbyStop(it); }} style={{
                        width:26, height:26, borderRadius:13, border:'none',
                        background:'rgba(26,24,22,0.06)', cursor:'pointer',
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        <Icon name="sparkle" size={13} color={COLORS.mute} stroke={1.8}/>
                      </button>
                      <button onClick={(e)=>{ e.stopPropagation(); setNearbyTab('food'); setNearbyStop(it); }} style={{
                        width:26, height:26, borderRadius:13, border:'none',
                        background:'rgba(26,24,22,0.06)', cursor:'pointer',
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        <Icon name="food" size={13} color={COLORS.mute} stroke={1.8}/>
                      </button>
                    </div>
                  )}
                  <button onClick={() => onOpenStop({ idx: i, stop: it, editing })} style={{
                    width:'100%', background:COLORS.card, borderRadius:14, border:'none', cursor:'pointer',
                    padding:'11px 14px 13px', textAlign:'left',
                  }}>
                  {/* opacity는 배경이 아닌 콘텐츠에만 적용 → 버튼 배경이 불투명하게 유지됨 */}
                  <div style={{ opacity: isDone ? 0.45 : 1 }}>
                    {travelTimes[i] && (
                      <div style={{ display:'flex', gap:10, marginBottom:7,
                        fontFamily:MONO, fontSize:9, color:COLORS.mute, letterSpacing:'0.06em' }}>
                        <span style={{ display:'flex', gap:3, alignItems:'center' }}>
                          <Icon name="car" size={11} stroke={1.8}/>
                          {fmtMin(travelTimes[i].drive)}
                        </span>
                        <span style={{ display:'flex', gap:3, alignItems:'center' }}>
                          <Icon name="walk" size={11} stroke={1.8}/>
                          {fmtMin(travelTimes[i].walk)}
                        </span>
                      </div>
                    )}
                    <div style={{ display:'flex', gap:6, alignItems:'center',
                      fontFamily:MONO, fontSize:9.5, color:COLORS.mute,
                      letterSpacing:'0.12em', textTransform:'uppercase' }}>
                      <Icon name={meta.icon} size={11} stroke={1.8}/>
                      <span>{meta.label}</span>
                      {it.price && (<><span style={{ opacity:0.4 }}>·</span><span>{it.price}</span></>)}
                    </div>
                    {editing && inlineItemTitle?.idx === i ? (
                      <input autoFocus value={inlineItemTitle.title}
                        onChange={e => setInlineItemTitle({ idx: i, title: e.target.value })}
                        onBlur={() => {
                          const items = [...(day.items || [])];
                          items[i] = { ...items[i], title: inlineItemTitle.title };
                          onEditDay({ items });
                          setInlineItemTitle(null);
                        }}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') e.target.blur(); }}
                        onClick={e => e.stopPropagation()}
                        style={{ width:'100%', marginTop:3, padding:'2px 0', border:'none',
                          borderBottom:`1px solid ${COLORS.ink}`, background:'transparent',
                          fontFamily:SANS, fontSize:14.5, fontWeight:500, color:COLORS.ink,
                          outline:'none', boxSizing:'border-box' }}/>
                    ) : (
                      <div
                        onClick={editing ? (e) => { e.stopPropagation(); setInlineItemTitle({ idx: i, title: it.title }); } : undefined}
                        style={{ marginTop:3, fontFamily:SANS, fontSize:14.5, fontWeight:500,
                          color:COLORS.ink, textDecoration: isDone?'line-through':'none',
                          ...(editing ? { cursor:'text', borderBottom:`1px dashed ${COLORS.line}` } : {}) }}>
                        {it.title}
                      </div>
                    )}
                    <div style={{ marginTop:1, fontFamily:SANS, fontSize:11.5, color:COLORS.mute, fontStyle:'italic' }}>
                      {it.en}
                    </div>
                    {it.note && (
                      <div style={{ marginTop:8, padding:'7px 9px', borderRadius:8,
                        background:COLORS.softer,
                        fontFamily:SANS, fontSize:11.5, color:COLORS.mute, lineHeight:1.45 }}>
                        {it.note}
                      </div>
                    )}
                  </div>{/* /opacity wrapper */}
                  </button>
                  {editing && (
                    <div style={{ position:'absolute', top:8, right:8, display:'flex', gap:6, alignItems:'center' }}>
                      <div style={{ width:26, height:26, borderRadius:13, background:'rgba(26,24,22,0.06)',
                        display:'flex', alignItems:'center', justifyContent:'center', cursor:'grab' }}>
                        <DragHandle size={13} color={COLORS.mute}/>
                      </div>
                      <button onClick={(e)=>{e.stopPropagation(); onDeleteItem(i);}} style={{
                        width:26, height:26, borderRadius:13, border:'none',
                        background:'rgba(193,79,46,0.12)',
                        display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
                      }}>
                        <Icon name="trash" size={13} color={COLORS.accent} stroke={2}/>
                      </button>
                    </div>
                  )}
                  {dp['data-drag-over'] && (
                    <div style={{ position:'absolute', inset:-2, border:`2px dashed rgba(193,79,46,0.45)`,
                      borderRadius:16, pointerEvents:'none', background:'rgba(193,79,46,0.04)' }}/>
                  )}
                </div>{/* /카드 본체 */}
                </SwipeableRow>
              </div>
            );
          })}
          {editing && (
            <button onClick={onAddItem} style={{
              marginLeft:60, marginTop:6, padding:'11px 14px',
              width:'calc(100% - 60px)', background:'transparent',
              border:`1.5px dashed ${COLORS.line}`, borderRadius:14,
              color:COLORS.mute, cursor:'pointer',
              display:'flex', gap:8, alignItems:'center', justifyContent:'center',
              fontFamily:SANS, fontSize:13,
            }}>
              <Icon name="plus" size={14} color={COLORS.mute} stroke={2}/>
              일정 추가
            </button>
          )}
        </div>
      </div>

      {/* Day nav */}
      <div style={{ padding:'16px 16px 0', display:'flex', gap:10 }}>
        {day.n > 1 && (
          <button onClick={() => onNavDay(day.n - 2)} style={{
            flex:1, background:COLORS.card, border:`1px solid ${COLORS.line}`,
            borderRadius:12, padding:'11px 14px', cursor:'pointer', textAlign:'left',
          }}>
            <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em' }}>← PREV</div>
            <div style={{ marginTop:2, fontFamily:SANS, fontSize:13, color:COLORS.ink }}>
              Day {String(day.n - 1).padStart(2,'0')}
            </div>
          </button>
        )}
        {day.n < trip.days.length && (
          <button onClick={() => onNavDay(day.n)} style={{
            flex:1, background:COLORS.card, border:`1px solid ${COLORS.line}`,
            borderRadius:12, padding:'11px 14px', cursor:'pointer', textAlign:'right',
          }}>
            <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em' }}>NEXT →</div>
            <div style={{ marginTop:2, fontFamily:SANS, fontSize:13, color:COLORS.ink }}>
              Day {String(day.n + 1).padStart(2,'0')}
            </div>
          </button>
        )}
      </div>
      <DatePickerSheet
        open={datePickerOpen}
        title="날짜 설정"
        value={dayDateToIso(day.date, tripYear)}
        onClose={() => setDatePickerOpen(false)}
        onPick={(iso) => {
          const display = isoToDayDate(iso);
          const weekday = isoToWeekday(iso);
          onEditDay({ date: display, weekday });
          setDatePickerOpen(false);
        }}
      />
      <NearbySheet stop={nearbyStop} initialTab={nearbyTab} onClose={() => setNearbyStop(null)}/>
    </div>
  );
}

// ─── Hotel Detail page ──────────────────────────────────────
function HotelDetailScreen({ hotel, onBack, onEdit, onOpenSearch, editing, setEditing }) {
  const [draft, setDraft] = React.useState(hotel);
  React.useEffect(() => setDraft(hotel), [hotel]);

  const save = () => { onEdit(draft); setEditing(false); };
  const addr = draft.name + ' ' + (draft.address || draft.area || '');

  // Date conversion: "May 4" ↔ "YYYY-MM-DD". Year is taken from current date
  // (this app uses May-based demo data; real users would type their trip year).
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dateToIso = (txt) => {
    if (!txt) return '';
    // Accept "May 4", "May 4, 2025", or already ISO
    if (/^\d{4}-\d{2}-\d{2}/.test(txt)) return txt.slice(0, 10);
    const m = txt.match(/([A-Za-z]+)\s+(\d{1,2})(?:,\s*(\d{4}))?/);
    if (!m) return '';
    const mi = MONTHS.findIndex(x => x.toLowerCase() === m[1].slice(0,3).toLowerCase());
    if (mi < 0) return '';
    const year = m[3] || new Date().getFullYear();
    return `${year}-${String(mi+1).padStart(2,'0')}-${String(m[2]).padStart(2,'0')}`;
  };
  const isoToDisplay = (iso) => {
    if (!iso) return '';
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return iso;
    return `${MONTHS[parseInt(m[2],10)-1]} ${parseInt(m[3],10)}`;
  };

  const [pickerOpen, setPickerOpen] = React.useState(null); // {key, type}

  const field = (key, label, placeholder, type='text') => {
    const isDate = type === 'date';
    const isTime = type === 'time';
    const shown = isDate
      ? (draft[key] ? draft[key] : '')
      : (draft[key] || '');
    return (
      <div style={{ marginBottom:10 }}>
        <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>{label}</div>
        {(isDate || isTime) ? (
          <button onClick={() => setPickerOpen({ key, type })}
            style={{ width:'100%', padding:'10px 12px', borderRadius:8,
              border:`1px solid ${COLORS.line}`, background:COLORS.card, cursor:'pointer',
              fontFamily:SANS, fontSize:13, color: shown ? COLORS.ink : COLORS.mute,
              display:'flex', alignItems:'center', justifyContent:'space-between',
              textAlign:'left', boxSizing:'border-box',
            }}>
            <span>{shown || placeholder}</span>
            <Icon name={isDate ? 'book' : 'clock'} size={13} color={COLORS.mute} stroke={1.8}/>
          </button>
        ) : (
          <input value={draft[key] || ''} onChange={e => setDraft({...draft, [key]: e.target.value})}
            placeholder={placeholder}
            style={{ width:'100%', padding:'9px 11px', borderRadius:8, border:`1px solid ${COLORS.line}`,
              background:COLORS.card, fontFamily:SANS, fontSize:13, color:COLORS.ink, boxSizing:'border-box' }}/>
        )}
      </div>
    );
  };

  const hotelHue = draft.hue || 25;
  const hotelBg  = `oklch(0.88 0.035 ${hotelHue})`;
  return (
    <div style={{ background:COLORS.bg, minHeight:'100vh', paddingBottom:110 }}>
      <div style={{ position:'relative', background: hotelBg }}>
        <Photo hue={hotelHue} label={(draft.name || '').toUpperCase().slice(0, 20)} height={'calc(240px + env(safe-area-inset-top, 0px))'}/>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'calc(180px + env(safe-area-inset-top, 0px))',
          background:'linear-gradient(180deg, rgba(0,0,0,0.22), transparent)' }}/>
        <button onClick={onBack} style={{
          position:'absolute', top:'calc(16px + env(safe-area-inset-top, 0px))', left:16, zIndex:5,
          width:38, height:38, borderRadius:19, border:'none',
          background:'rgba(255,255,255,0.88)',
          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
        }}>
          <Icon name="chevron-l" size={18} color={COLORS.ink} stroke={2}/>
        </button>
        <div style={{ position:'absolute', top:'calc(16px + env(safe-area-inset-top, 0px))', right:16, zIndex:5, display:'flex', gap:8 }}>
          {editing && (
            <button onClick={onOpenSearch} style={{
              border:'none', background:COLORS.ink, color:'#fff',
              borderRadius:14, padding:'6px 12px', cursor:'pointer',
              fontFamily:SANS, fontSize:11.5, fontWeight:500,
              display:'flex', gap:5, alignItems:'center',
            }}>
              <Icon name="search" size={12} color="#fff" stroke={2}/>
              검색
            </button>
          )}
          {editing ? (
            <button onClick={save} style={{
              border:'none', background:COLORS.accent, color:'#fff',
              borderRadius:14, padding:'6px 12px', cursor:'pointer',
              fontFamily:SANS, fontSize:11.5, fontWeight:500,
              display:'flex', gap:5, alignItems:'center',
            }}>
              <Icon name="save" size={12} color="#fff" stroke={2}/> 저장
            </button>
          ) : (
            <EditBtn editing={false} onClick={() => setEditing(true)}/>
          )}
        </div>
      </div>

      <div style={{ padding:'22px 20px 8px' }}>
        <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.accent, letterSpacing:'0.14em' }}>
          HOTEL · {draft.nights || '—'}박
        </div>
        {editing ? (
          <input value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})}
            style={{ marginTop:6, width:'100%', fontFamily:SERIF, fontSize:30, lineHeight:1.08,
              color:COLORS.ink, border:'none', outline:'none', background:'transparent', padding:0 }}/>
        ) : (
          <div style={{ marginTop:6, fontFamily:SERIF, fontSize:30, lineHeight:1.08, color:COLORS.ink }}>
            {draft.name}
          </div>
        )}
        {draft.area && (
          <div style={{ marginTop:4, fontFamily:SANS, fontSize:13, color:COLORS.mute, display:'flex', gap:5, alignItems:'center' }}>
            <Icon name="pin" size={12} stroke={1.8}/> {draft.area}
            {draft.rating && <><span style={{ opacity:0.4 }}>·</span><span>★ {draft.rating}</span></>}
          </div>
        )}
      </div>

      {/* Edit form or info */}
      {editing ? (
        <div style={{ padding:'12px 16px 0' }}>
          <div style={{ background:COLORS.card, borderRadius:14, padding:'14px 16px' }}>
            {field('area', '지역')}
            {field('address', '주소')}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {field('checkin', '체크인 날짜', 'May 4', 'date')}
              {field('checkout', '체크아웃 날짜', 'May 13', 'date')}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {field('checkinTime', '체크인 시간', '15:00', 'time')}
              {field('checkoutTime', '체크아웃 시간', '12:00', 'time')}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {field('nights', '박', '9')}
              {field('price', '요금')}
            </div>
            {field('phone', '전화')}
            <div style={{ marginBottom:10 }}>
              <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>메모</div>
              <textarea value={draft.note || ''} onChange={e => setDraft({...draft, note: e.target.value})}
                rows={3}
                style={{ width:'100%', padding:'9px 11px', borderRadius:8, border:`1px solid ${COLORS.line}`,
                  background:COLORS.card, fontFamily:SANS, fontSize:13, color:COLORS.ink,
                  boxSizing:'border-box', resize:'vertical' }}/>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ padding:'14px 16px 0' }}>
            <div style={{ background:COLORS.card, borderRadius:14, overflow:'hidden' }}>
              {[
                { icon:'clock', label:'기간',
                  value: `${draft.checkin || '—'}${draft.checkinTime ? ' ' + draft.checkinTime : ''} → ${draft.checkout || '—'}${draft.checkoutTime ? ' ' + draft.checkoutTime : ''}${draft.nights ? ` · ${draft.nights}박` : ''}` },
                draft.address && { icon:'pin', label:'주소', value: draft.address },
                draft.phone && { icon:'phone', label:'전화', value: draft.phone },
                draft.price && { icon:'book', label:'요금', value: draft.price },
                draft.confirmation && { icon:'save', label:'예약번호', value: draft.confirmation },
              ].filter(Boolean).map((r, i, arr) => (
                <div key={i} style={{
                  padding:'13px 16px', display:'flex', gap:12, alignItems:'flex-start',
                  borderBottom: i < arr.length-1 ? `1px solid ${COLORS.line}` : 'none',
                }}>
                  <div style={{ paddingTop:2 }}>
                    <Icon name={r.icon} size={15} color={COLORS.mute} stroke={1.8}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute,
                      letterSpacing:'0.12em', textTransform:'uppercase' }}>{r.label}</div>
                    <div style={{ marginTop:2, fontFamily:SANS, fontSize:13.5, color:COLORS.ink, lineHeight:1.45 }}>
                      {r.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {draft.amenities && draft.amenities.length > 0 && (
            <div style={{ padding:'16px 20px 0' }}>
              <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.12em' }}>시설</div>
              <div style={{ marginTop:8, display:'flex', flexWrap:'wrap', gap:6 }}>
                {draft.amenities.map((a, i) => (
                  <span key={i} style={{ padding:'6px 10px', borderRadius:8, background:COLORS.card,
                    fontFamily:SANS, fontSize:12, color:COLORS.ink }}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {draft.note && (
            <div style={{ padding:'16px 16px 0' }}>
              <div style={{ background:COLORS.softer, borderRadius:12, padding:'14px 16px',
                fontFamily:SANS, fontSize:13, color:COLORS.mute, lineHeight:1.5 }}>
                {draft.note}
              </div>
            </div>
          )}

          <div style={{ padding:'16px 16px 0', display:'flex', gap:8 }}>
            <button onClick={() => window.open(mapsDirectionsUrl(addr), '_blank')} style={{
              flex:1, background:COLORS.ink, color:COLORS.bg,
              border:'none', borderRadius:12, padding:'13px', cursor:'pointer',
              fontFamily:SANS, fontSize:14, fontWeight:500,
              display:'flex', gap:6, alignItems:'center', justifyContent:'center',
            }}>
              <Icon name="nav" size={14} color={COLORS.bg} stroke={1.8}/> 길찾기
            </button>
            <button onClick={() => window.open(mapsSearchUrl(addr), '_blank')} style={{
              width:60, background:COLORS.card, border:`1px solid ${COLORS.line}`,
              borderRadius:12, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon name="map" size={16} color={COLORS.ink} stroke={1.8}/>
            </button>
          </div>
        </>
      )}

      <DatePickerSheet
        open={!!pickerOpen && pickerOpen.type === 'date'}
        value={pickerOpen ? dateToIso(draft[pickerOpen.key]) : ''}
        minDate={pickerOpen && pickerOpen.key === 'checkout' ? dateToIso(draft.checkin) : null}
        title={pickerOpen && pickerOpen.key === 'checkin' ? '체크인 날짜' : '체크아웃 날짜'}
        onPick={(iso) => setDraft({ ...draft, [pickerOpen.key]: isoToDisplay(iso) })}
        onClose={() => setPickerOpen(null)}/>
      <TimeWheelSheet
        open={!!pickerOpen && pickerOpen.type === 'time'}
        value={pickerOpen ? (draft[pickerOpen.key] || '') : ''}
        title={pickerOpen && pickerOpen.key === 'checkinTime' ? '체크인 시간' : '체크아웃 시간'}
        onPick={(t) => setDraft({ ...draft, [pickerOpen.key]: t })}
        onClose={() => setPickerOpen(null)}/>
    </div>
  );
}

// ─── Nearby suggestions sheet ────────────────────────────────
function haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000, toR = Math.PI/180;
  const dLat = (lat2-lat1)*toR, dLon = (lon2-lon1)*toR;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*toR)*Math.cos(lat2*toR)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// 캐시 헬퍼: localStorage에 TTL 포함 저장/읽기
const NC_PLACES_TTL = 24 * 60 * 60 * 1000;  // 장소 목록 24시간
const NC_PHOTO_TTL  =  7 * 24 * 60 * 60 * 1000;  // 사진 URL 7일
function ncGet(key, ttl) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    const { t, d } = JSON.parse(raw);
    if (Date.now() - t > ttl) { localStorage.removeItem(key); return undefined; }
    return d;
  } catch { return undefined; }
}
function ncSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })); } catch(_) {}
}

function NearbySheet({ stop, initialTab, onClose }) {
  const [tab, setTab] = React.useState('hotspot');
  const [hotspots, setHotspots] = React.useState(null);
  const [food, setFood]         = React.useState(null);
  const [photos, setPhotos]     = React.useState({});
  const [entered, setEntered]   = React.useState(false);
  const [sheetY, setSheetY]     = React.useState(0);
  const sheetRef  = React.useRef(null);
  const sheetYRef = React.useRef(0);
  const dragRef   = React.useRef({ active:false });

  // 열릴 때마다 리셋 + 슬라이드업 애니
  React.useEffect(() => {
    if (!stop) { setEntered(false); return; }
    setTab(initialTab || 'hotspot');
    setHotspots(null); setFood(null); setPhotos({});
    setSheetY(0); sheetYRef.current = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, [stop, initialTab]);

  // 두 타입 병렬 fetch (캐시 우선)
  React.useEffect(() => {
    if (!stop) return;
    const ctrl = new AbortController();
    // 캐시 키: 좌표가 있으면 좌표 기반, 없으면 타이틀 기반
    const stopKey = stop.coords
      ? `${stop.coords[0].toFixed(3)}_${stop.coords[1].toFixed(3)}`
      : (stop.title || '').replace(/\s+/g, '_');
    const cacheKey = `nearby_places_${stopKey}`;
    const cached = ncGet(cacheKey, NC_PLACES_TTL);
    if (cached) {
      setHotspots(cached.hotspots);
      setFood(cached.food);
      return;
    }
    (async () => {
      try {
        let lat, lon;
        if (stop.coords) { [lat, lon] = stop.coords; }
        else {
          const q = encodeURIComponent([stop.title, stop.en, stop.loc].filter(Boolean).join(' '));
          const geo = await fetch(`https://photon.komoot.io/api/?q=${q}&limit=1`, { signal:ctrl.signal }).then(r=>r.json());
          const f = geo.features?.[0];
          if (!f) { setHotspots([]); setFood([]); return; }
          [lon, lat] = f.geometry.coordinates;
        }
        const parse = (d) => {
          const seen = new Set();
          return (d.elements||[]).reduce((acc, e) => {
            const nm = e.tags?.name || e.tags?.['name:en'] || '';
            if (!nm || seen.has(nm) || !e.lat) return acc;
            seen.add(nm);
            acc.push({
              name: nm,
              type: e.tags?.amenity || e.tags?.tourism || e.tags?.historic || e.tags?.leisure || '',
              wikipedia: e.tags?.wikipedia || '',
              image: e.tags?.image || '',   // ① OSM 직접 첨부 이미지
              dist: haversineM(lat, lon, e.lat, e.lon),
              lat: e.lat, lon: e.lon,
            });
            return acc;
          }, []).sort((a,b) => a.dist - b.dist);
        };
        const hQ = `[out:json][timeout:10];(node["tourism"~"attraction|museum|viewpoint|gallery|theme_park|zoo"](around:900,${lat},${lon});node["historic"~"monument|castle|ruins|memorial"](around:900,${lat},${lon});node["leisure"~"park|garden"](around:900,${lat},${lon}););out 30;`;
        const fQ = `[out:json][timeout:10];(node["amenity"~"restaurant|cafe|bar|fast_food|pub|biergarten|food_court"](around:600,${lat},${lon}););out 30;`;
        const base = 'https://overpass-api.de/api/interpreter?data=';
        const [hR, fR] = await Promise.all([
          fetch(base + encodeURIComponent(hQ), { signal:ctrl.signal }).then(r=>r.json()),
          fetch(base + encodeURIComponent(fQ), { signal:ctrl.signal }).then(r=>r.json()),
        ]);
        const hotspotsParsed = parse(hR);
        const foodParsed = parse(fR);
        ncSet(cacheKey, { hotspots: hotspotsParsed, food: foodParsed });  // 캐시 저장
        setHotspots(hotspotsParsed);
        setFood(foodParsed);
      } catch(e) { if (!ctrl.signal.aborted) { setHotspots([]); setFood([]); } }
    })();
    return () => ctrl.abort();
  }, [stop]);

  // 사진 fetch: ① OSM image → ② Wikipedia 태그 → ③ Wikipedia/Commons 이름 검색
  React.useEffect(() => {
    [...(hotspots||[]), ...(food||[])].forEach(async (item) => {
      if (item.name in photos) return;
      const photoKey = `nearby_photo_${item.name}`;
      const cachedUrl = ncGet(photoKey, NC_PHOTO_TTL);
      if (cachedUrl !== undefined) {
        setPhotos(p => ({...p, [item.name]: cachedUrl || null}));
        return;
      }
      setPhotos(p => ({...p, [item.name]: null}));

      let url = '';

      // ① OSM image 태그 (API 호출 없음)
      if (item.image) {
        url = item.image;
      }

      // ② Wikipedia 태그로 섬네일
      if (!url && item.wikipedia) {
        try {
          const t = item.wikipedia.replace(/^[a-z-]+:/, '').replace(/ /g, '_');
          const d = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`).then(r=>r.json());
          if (d.thumbnail?.source) url = d.thumbnail.source;
        } catch(_) {}
      }

      // ③ Wikipedia/Commons: 검색+이미지를 1번 요청으로 (generator=search)
      if (!url) {
        try {
          const res = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(item.name)}&gsrlimit=1&prop=pageimages&format=json&pithumbsize=600&origin=*`
          ).then(r=>r.json());
          const page = Object.values(res.query?.pages || {})[0];
          if (page?.thumbnail?.source) url = page.thumbnail.source;
        } catch(_) {}
      }

      ncSet(photoKey, url);
      if (url) setPhotos(p => ({...p, [item.name]: url}));
    });
  }, [hotspots, food]);

  // 드래그-투-클로즈
  React.useEffect(() => {
    const el = sheetRef.current;
    if (!el || !stop) return;
    const onStart = (e) => { dragRef.current = { active:true, startY:e.touches[0].clientY, st:el.scrollTop }; };
    const onMove  = (e) => {
      if (!dragRef.current.active) return;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      if (dragRef.current.st > 8 || dy <= 0) { dragRef.current.active = false; return; }
      e.preventDefault();
      sheetYRef.current = Math.max(0, dy);
      setSheetY(sheetYRef.current);
    };
    const onEnd = () => {
      dragRef.current.active = false;
      if (sheetYRef.current > 110) onClose();
      else { sheetYRef.current = 0; setSheetY(0); }
    };
    el.addEventListener('touchstart', onStart, { passive:true });
    el.addEventListener('touchmove',  onMove,  { passive:false });
    el.addEventListener('touchend',   onEnd,   { passive:true });
    return () => { el.removeEventListener('touchstart',onStart); el.removeEventListener('touchmove',onMove); el.removeEventListener('touchend',onEnd); };
  }, [stop]);

  if (!stop) return null;

  const TYPE_KO = {
    restaurant:'레스토랑', cafe:'카페', bar:'바', fast_food:'패스트푸드', pub:'펍',
    biergarten:'비어가든', food_court:'푸드코트',
    attraction:'명소', museum:'박물관', viewpoint:'전망대', gallery:'갤러리',
    theme_park:'테마파크', zoo:'동물원', park:'공원', garden:'정원',
    monument:'기념비', castle:'성', ruins:'유적', memorial:'기념관', historic:'유적지',
  };
  const fmtDist = m => m < 1000 ? `${Math.round(m)}m` : `${(m/1000).toFixed(1)}km`;
  const currentData = tab === 'hotspot' ? hotspots : food;
  const loading = currentData === null;

  const renderItem = (item) => {
    const photoUrl = photos[item.name];
    const hue = item.name.split('').reduce((h,c) => (h*31 + c.charCodeAt(0)) & 0xffff, 0) % 360;
    return (
      <button key={item.name} onClick={() => window.open(mapsSearchUrl(item.name), '_blank')}
        style={{ width:'100%', padding:'10px 16px', border:'none', borderBottom:`1px solid ${COLORS.line}`,
          background:'transparent', cursor:'pointer', textAlign:'left',
          display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:58, height:58, borderRadius:12, flexShrink:0, overflow:'hidden' }}>
          {photoUrl
            ? <img src={photoUrl} style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy"/>
            : <Photo hue={hue} height={58} small/>}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:SANS, fontSize:13.5, fontWeight:500, color:COLORS.ink,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</div>
          <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, marginTop:3 }}>
            {TYPE_KO[item.type] || item.type || '—'} · {fmtDist(item.dist)}
          </div>
        </div>
        <Icon name="chevron" size={14} color={COLORS.line} stroke={2}/>
      </button>
    );
  };

  return ReactDOM.createPortal(
    <div style={{ position:'fixed', inset:0, zIndex:1100,
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
      background:`rgba(0,0,0,${Math.max(0, 0.32 - sheetY/500)})` }} onClick={onClose}>
      <div ref={sheetRef} onClick={e=>e.stopPropagation()}
        style={{ background:COLORS.bg, borderRadius:'22px 22px 0 0', maxHeight:'74%',
          overflowY:'auto', overflowX:'hidden',
          paddingBottom:'calc(20px + env(safe-area-inset-bottom,0px))',
          transform:`translateY(${entered ? sheetY : window.innerHeight}px)`,
          transition: sheetY ? 'none' : 'transform 0.34s cubic-bezier(0.32,0.72,0,1)' }}>
        {/* 핸들 */}
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 2px' }}>
          <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
        </div>
        {/* 헤더 + 탭 */}
        <div style={{ padding:'10px 18px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <div style={{ fontFamily:SERIF, fontSize:19, color:COLORS.ink, flex:1, minWidth:0,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{stop.title}</div>
          <div style={{ display:'flex', background:COLORS.softer, borderRadius:12, padding:3, gap:2, flexShrink:0 }}>
            {[{v:'hotspot',label:'핫플'},{v:'food',label:'음식점'}].map(({v,label}) => (
              <button key={v} onClick={() => setTab(v)}
                style={{ padding:'7px 13px', border:'none', borderRadius:9, cursor:'pointer',
                  background: tab===v ? COLORS.card : 'transparent',
                  fontFamily:SANS, fontSize:12, fontWeight:600,
                  color: tab===v ? COLORS.ink : COLORS.mute,
                  boxShadow: tab===v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        {/* 목록 */}
        {loading && (
          <div style={{ padding:'40px 20px', textAlign:'center', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>
            주변 장소를 찾는 중...
          </div>
        )}
        {!loading && currentData.length === 0 && (
          <div style={{ padding:'40px 20px', textAlign:'center', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>
            주변에 {tab==='hotspot'?'핫플이':'음식점이'} 없어요
          </div>
        )}
        {!loading && currentData.length > 0 && (
          <div>{currentData.map(renderItem)}</div>
        )}
      </div>
    </div>,
    document.body
  );
}

// ─── Stop sheet (unchanged except pulls editing from open) ─
function StopSheet({ open, dayHue, onClose, onSave, cityBias, onRegisterEdit, onTabBarToggle }) {
  if (!open) return null;
  const [editing, setEditing] = React.useState(!!open.editing);
  // 탭바 수정 버튼과 연동
  React.useEffect(() => {
    onRegisterEdit?.(() => setEditing(e => !e));
    return () => onRegisterEdit?.(null);
  }, []);
  const [draft, setDraft] = React.useState(open.stop);
  const committed = React.useRef(open.stop);
  const [sheetY, setSheetY] = React.useState(0);
  const [sheetUp, setSheetUp] = React.useState(0);
  const [entered, setEntered] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const sheetRef = React.useRef(null);
  const sheetYRef = React.useRef(0);
  const sheetUpRef = React.useRef(0);
  const expandedRef = React.useRef(false);
  const dragRef = React.useRef({ active: false, startY: 0 });
  const scrollBeforeKbRef = React.useRef(null);

  React.useEffect(() => {
    setDraft(open.stop); committed.current = open.stop;
    setSheetY(0); sheetYRef.current = 0;
    setSheetUp(0); sheetUpRef.current = 0;
    setExpanded(false); expandedRef.current = false;
    setEditing(!!open.editing);
    setClosing(false);
    setEntered(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, [open]);

  // 배경 스크롤 차단
  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  // 시트 드래그 + 탭바 탭 토글
  React.useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const onStart = (e) => {
      dragRef.current = { active: true, startY: e.touches[0].clientY };
    };
    const onMove = (e) => {
      if (!dragRef.current.active) return;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      e.preventDefault();
      if (expandedRef.current) {
        // 확장 상태: 아래로만 드래그 허용
        if (dy > 0) { sheetYRef.current = dy; setSheetY(dy); }
      } else {
        if (dy < 0) {
          // 위로: 손가락 따라 확장
          const up = Math.min(Math.abs(dy), window.innerHeight * 0.2);
          sheetUpRef.current = up; setSheetUp(up);
        } else {
          sheetUpRef.current = 0; setSheetUp(0);
          sheetYRef.current = dy; setSheetY(dy);
        }
      }
    };
    const onEnd = (e) => {
      dragRef.current.active = false;
      const dy = Math.abs((e.changedTouches[0]?.clientY ?? 0) - dragRef.current.startY);
      // 탭(거의 안 움직임) → 탭바 토글
      if (dy < 8) {
        onTabBarToggle?.();
        sheetYRef.current = 0; setSheetY(0);
        sheetUpRef.current = 0; setSheetUp(0);
        return;
      }
      const curUp = sheetUpRef.current;
      const cur = sheetYRef.current;
      if (curUp > 60) {
        // 위로 충분히 → 확장 고정
        expandedRef.current = true; setExpanded(true);
        sheetUpRef.current = 0; setSheetUp(0);
      } else if (cur > 100) {
        if (expandedRef.current) {
          // 확장 상태에서 내리면 → 원래 크기
          expandedRef.current = false; setExpanded(false);
          sheetYRef.current = 0; setSheetY(0);
        } else {
          setClosing(true);
          setTimeout(() => onClose(), 340);
        }
      } else {
        sheetUpRef.current = 0; setSheetUp(0);
        sheetYRef.current = 0; setSheetY(0);
      }
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, [open]);

  React.useEffect(() => {
    const vv = window.visualViewport;
    if (!vv || !sheetRef.current) return;
    const adjust = () => {
      const kbh = Math.max(0, window.innerHeight - vv.height);
      if (kbh > 80) {
        if (scrollBeforeKbRef.current === null)
          scrollBeforeKbRef.current = sheetRef.current.scrollTop;
        const el = document.activeElement;
        if (!el || (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA')) return;
        const rect = el.getBoundingClientRect();
        const gap = rect.bottom - (vv.height - 12);
        if (gap > 0) sheetRef.current.scrollTop += gap;
      } else {
        if (scrollBeforeKbRef.current !== null) {
          sheetRef.current.scrollTop = scrollBeforeKbRef.current;
          scrollBeforeKbRef.current = null;
        }
      }
    };
    vv.addEventListener('resize', adjust);
    return () => vv.removeEventListener('resize', adjust);
  }, [open]);

  const searchQuery = [draft.title, draft.en, draft.loc, 'New York'].filter(Boolean).join(' ');

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000,
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
      background:`rgba(0,0,0,${Math.max(0, 0.35 - sheetY / 400)})` }} onClick={onClose}>
      {/* transform wrapper — sheet + filler 같이 움직임 */}
      <div style={{
        transform: `translateY(${closing ? window.innerHeight : (entered ? sheetY : window.innerHeight)}px)`,
        transition: (closing || (!sheetY && entered)) ? 'transform 0.34s cubic-bezier(0.32,0.72,0,1)' : 'none',
        display:'flex', flexDirection:'column',
      }}>
      <div ref={sheetRef} onClick={(e)=>e.stopPropagation()}
        style={{
          background:COLORS.bg, borderRadius:'22px 22px 0 0',
          paddingBottom:'calc(env(safe-area-inset-bottom, 0px) + 60px)',
          height: expanded ? 'auto' : `calc(80dvh + ${sheetUp}px)`,
          maxHeight: expanded ? 'calc(100dvh - var(--sat, 44px) - 8px)' : undefined,
          overflowY:'hidden',
          overflowX:'hidden',
          transition: sheetUp > 0 ? 'none' : 'max-height 0.36s cubic-bezier(0.32,0.72,0,1)',
        }}>
        {/* 드래그 핸들 */}
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 6px' }}>
          <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
        </div>
        {/* 사진 영역 + 수정 버튼 오버레이 */}
        <div style={{ position:'relative' }}>
          <Photo hue={dayHue} label={(draft.en||'').toUpperCase()} height={180}/>
          {!editing && (
            <button onClick={(e) => { e.stopPropagation(); setEditing(true); }} style={{
              position:'absolute', top:12, right:12, zIndex:5,
              border:'none', background:'rgba(255,255,255,0.92)', borderRadius:14,
              padding:'7px 13px', cursor:'pointer',
              fontFamily:SANS, fontSize:12, fontWeight:500, color:COLORS.ink,
              display:'flex', gap:5, alignItems:'center',
              boxShadow:'0 1px 6px rgba(0,0,0,0.12)',
            }}>
              <Icon name="edit" size={12} color={COLORS.ink} stroke={2}/> 수정
            </button>
          )}
        </div>
        <div style={{ padding:'18px 20px 0' }}>
          <div style={{ display:'flex', gap:6, alignItems:'center',
            fontFamily:MONO, fontSize:10, color:COLORS.mute,
            letterSpacing:'0.12em', textTransform:'uppercase' }}>
            <Icon name={(CAT_META[draft.cat]||{icon:'pin'}).icon} size={12} stroke={1.8}/>
            <span>{(CAT_META[draft.cat]||{label:draft.cat}).label}</span>
            <span style={{ opacity:0.4 }}>·</span>
            <span>{draft.time}</span>
          </div>

          {editing ? (
            <EditStopForm draft={draft} setDraft={setDraft} cityBias={cityBias}/>
          ) : (
            <>
              {/* 타이틀 / 부제 — 뷰 모드에서는 읽기 전용 */}
              <div style={{ marginTop:8 }}>
                <div style={{ fontFamily:SERIF, fontSize:28, lineHeight:1.12, color:COLORS.ink }}>
                  {draft.title}
                </div>
              </div>
              {draft.en && (
                <div style={{ marginTop:4, fontFamily:SANS, fontSize:13.5, fontStyle:'italic', color:COLORS.mute }}>
                  {draft.en}
                </div>
              )}
              <div style={{ marginTop:16, display:'flex', flexDirection:'column' }}>
                {[
                  draft.loc && { icon:'pin', label:'위치', value: draft.loc },
                  { icon:'clock', label:'시간', value: draft.time + (draft.duration ? ` · ${draft.duration}` : '') },
                  draft.note && { icon:'book', label:'메모', value: draft.note },
                ].filter(Boolean).map((r, i, arr) => (
                  <div key={i} style={{
                    background:COLORS.card, padding:'13px 16px',
                    borderTopLeftRadius: i===0 ? 12 : 0, borderTopRightRadius: i===0 ? 12 : 0,
                    borderBottomLeftRadius: i===arr.length-1 ? 12 : 0, borderBottomRightRadius: i===arr.length-1 ? 12 : 0,
                    display:'flex', gap:12, alignItems:'flex-start',
                    borderBottom: i<arr.length-1 ? `1px solid ${COLORS.line}` : 'none',
                  }}>
                    <div style={{ paddingTop:2 }}>
                      <Icon name={r.icon} size={15} color={COLORS.mute} stroke={1.8}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute,
                        letterSpacing:'0.12em', textTransform:'uppercase' }}>{r.label}</div>
                      <div style={{ marginTop:2, fontFamily:SANS, fontSize:13.5, color:COLORS.ink,
                        lineHeight:1.45, whiteSpace:'pre-wrap' }}>{r.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ marginTop:14, display:'flex', gap:8 }}>
            {editing ? (
              <>
                <button onClick={() => { onSave(draft); committed.current = draft; setEditing(false); }} style={{
                  flex:1, background:COLORS.ink, color:COLORS.bg,
                  border:'none', borderRadius:12, padding:'13px',
                  fontFamily:SANS, fontSize:14, fontWeight:500, cursor:'pointer',
                  display:'flex', gap:6, alignItems:'center', justifyContent:'center',
                }}>
                  <Icon name="save" size={14} color={COLORS.bg} stroke={1.8}/> 저장
                </button>
                <button onClick={() => { if (open.hotelOnly) { onClose(); } else { setDraft(committed.current); setEditing(false); } }} style={{
                  width:80, background:COLORS.card, border:`1px solid ${COLORS.line}`,
                  borderRadius:12, cursor:'pointer',
                  fontFamily:SANS, fontSize:13, color:COLORS.ink,
                }}>취소</button>
              </>
            ) : (
              <>
                <button onClick={() => window.open(mapsDirectionsUrl(searchQuery), '_blank')} style={{
                  flex:1, background:COLORS.ink, color:COLORS.bg,
                  border:'none', borderRadius:12, padding:'13px',
                  fontFamily:SANS, fontSize:14, fontWeight:500, cursor:'pointer',
                  display:'flex', gap:6, alignItems:'center', justifyContent:'center',
                }}>
                  <Icon name="nav" size={14} color={COLORS.bg} stroke={1.8}/> 길찾기
                </button>
                <button onClick={() => window.open(mapsSearchUrl(searchQuery), '_blank')} style={{
                  width:60, background:COLORS.card, border:`1px solid ${COLORS.line}`,
                  borderRadius:12, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <Icon name="map" size={16} color={COLORS.ink} stroke={1.8}/>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* 시트 하단 ~ 키보드 상단 사이 검은 배경 가리기 */}
      </div>{/* wrapper 닫기 */}
    </div>
  );
}

// ─── Hotel Sheet (bottom sheet for add / view / edit hotel) ──
function HotelSheet({ open, onClose, hotel, trip, tripDays, onSave, onDelete }) {
  if (!open) return null;
  const isNew = !hotel;
  const blank = { name:'', area:'', address:'', checkin:'', checkinTime:'15:00', checkout:'', checkoutTime:'12:00', nights:'', price:'', phone:'', confirmation:'', note:'', hue:30 };
  const [editing, setEditing] = React.useState(isNew);
  const [draft, setDraft] = React.useState(hotel ? { ...hotel } : blank);
  const committed = React.useRef(draft);
  const [sheetY, setSheetY] = React.useState(0);
  const [entered, setEntered] = React.useState(false);
  const sheetRef = React.useRef(null);
  const sheetYRef = React.useRef(0);
  const dragRef = React.useRef({ active:false, startY:0, startScrollTop:0 });
  const scrollBeforeKbRef = React.useRef(null);
  const [searchQ, setSearchQ] = React.useState('');
  const [searchRes, setSearchRes] = React.useState([]);
  const [showSearch, setShowSearch] = React.useState(false);
  const [timePicker, setTimePicker] = React.useState(null);
  const searchTimer = React.useRef(null);
  const searchFocused = React.useRef(false);

  React.useEffect(() => {
    const d = hotel ? { ...hotel } : blank;
    setDraft(d); committed.current = d;
    setEditing(isNew);
    setSheetY(0); sheetYRef.current = 0;
    setEntered(false);
    setSearchQ(''); setSearchRes([]); setShowSearch(false); setTimePicker(null);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, [open]);

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  React.useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const onStart = e => { dragRef.current = { active:true, startY:e.touches[0].clientY, startScrollTop:el.scrollTop }; };
    const onMove = e => {
      if (!dragRef.current.active) return;
      const { startY, startScrollTop } = dragRef.current;
      const dy = e.touches[0].clientY - startY;
      if (startScrollTop > 8 || dy <= 0) { dragRef.current.active = false; return; }
      e.preventDefault();
      sheetYRef.current = Math.max(0, dy); setSheetY(sheetYRef.current);
    };
    const onEnd = () => {
      dragRef.current.active = false;
      const top = sheetRef.current ? sheetRef.current.getBoundingClientRect().top : 0;
      if (top > window.innerHeight / 2) onClose();
      else { sheetYRef.current = 0; setSheetY(0); }
    };
    el.addEventListener('touchstart', onStart, { passive:true });
    el.addEventListener('touchmove', onMove, { passive:false });
    el.addEventListener('touchend', onEnd, { passive:true });
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchmove', onMove); el.removeEventListener('touchend', onEnd); };
  }, [open]);

  React.useEffect(() => {
    const vv = window.visualViewport;
    if (!vv || !sheetRef.current) return;
    const adjust = () => {
      const kbh = Math.max(0, window.innerHeight - vv.height);
      if (kbh > 80) {
        if (scrollBeforeKbRef.current === null)
          scrollBeforeKbRef.current = sheetRef.current.scrollTop;
        const el = document.activeElement;
        if (!el || (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA')) return;
        const rect = el.getBoundingClientRect();
        const gap = rect.bottom - (vv.height - 12);
        if (gap > 0) sheetRef.current.scrollTop += gap;
      } else {
        if (scrollBeforeKbRef.current !== null) {
          sheetRef.current.scrollTop = scrollBeforeKbRef.current;
          scrollBeforeKbRef.current = null;
        }
      }
    };
    vv.addEventListener('resize', adjust);
    return () => vv.removeEventListener('resize', adjust);
  }, [open]);

  React.useEffect(() => {
    if (!draft.checkin || !draft.checkout) return;
    const yr = trip ? extractTripYear(trip) : new Date().getFullYear();
    const a = dayDateToIso(draft.checkin, yr);
    const b = dayDateToIso(draft.checkout, yr);
    if (!a || !b) return;
    const diff = Math.round((new Date(b) - new Date(a)) / 86400000);
    if (diff > 0) setDraft(prev => ({ ...prev, nights: String(diff) }));
  }, [draft.checkin, draft.checkout]);

  React.useEffect(() => {
    clearTimeout(searchTimer.current);
    if (!searchQ.trim()) { setSearchRes([]); setShowSearch(false); return; }
    searchTimer.current = setTimeout(async () => {
      try {
        const engQ = (typeof korToEngHotel === 'function') ? korToEngHotel(searchQ.trim()) : searchQ.trim();
        const destEntry = (typeof CITY_DB !== 'undefined') ? CITY_DB.find(c => c.zone === trip?.timezone) : null;
        const bias = destEntry ? `&lat=${destEntry.lat}&lon=${destEntry.lon}` : '';
        const j = await (await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(engQ)}&limit=8${bias}&osm_tag=tourism:hotel`
        )).json();
        const feats = j?.features || [];
        setSearchRes(feats);
        if (feats.length && searchFocused.current) setShowSearch(true);
      } catch(_) {}
    }, 350);
  }, [searchQ]);

  const save = () => { onSave(draft); committed.current = { ...draft }; setEditing(false); };
  const hue = draft.hue || 25;
  const dayOptions = (tripDays || []).map(d => d.date).filter(Boolean);

  const field = (key, label, placeholder = '') => (
    <div style={{ marginBottom:10 }}>
      <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>{label}</div>
      <input value={draft[key]||''} onChange={e => setDraft({...draft, [key]:e.target.value})} placeholder={placeholder}
        style={{ width:'100%', padding:'9px 11px', borderRadius:8, border:`1px solid ${COLORS.line}`,
          background:COLORS.bg, fontFamily:SANS, fontSize:13, color:COLORS.ink, boxSizing:'border-box' }}/>
    </div>
  );

  const dateField = (key, label) => (
    <div style={{ marginBottom:10 }}>
      <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>{label}</div>
      {dayOptions.length > 0 ? (
        <select value={draft[key]||''} onChange={e => setDraft({...draft, [key]:e.target.value})}
          style={{ width:'100%', padding:'9px 11px', borderRadius:8, border:`1px solid ${COLORS.line}`,
            background:COLORS.bg, fontFamily:SANS, fontSize:13, color:COLORS.ink, boxSizing:'border-box' }}>
          <option value=''>날짜 선택</option>
          {dayOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      ) : (
        <input value={draft[key]||''} onChange={e => setDraft({...draft, [key]:e.target.value})} placeholder="May 4"
          style={{ width:'100%', padding:'9px 11px', borderRadius:8, border:`1px solid ${COLORS.line}`,
            background:COLORS.bg, fontFamily:SANS, fontSize:13, color:COLORS.ink, boxSizing:'border-box' }}/>
      )}
    </div>
  );

  const rows = [
    draft.area && { icon:'pin', label:'지역', value: draft.area },
    (draft.checkin || draft.checkout) && { icon:'clock', label:'일정', value: `${draft.checkin || '—'} 체크인  →  ${draft.checkout || '—'} 체크아웃` },
    (draft.checkinTime || draft.checkoutTime) && { icon:'clock', label:'시간', value: `체크인 ${draft.checkinTime || '15:00'}  ·  체크아웃 ${draft.checkoutTime || '12:00'}` },
    draft.nights && { icon:'hotel', label:'박수', value: `${draft.nights}박` },
    draft.address && { icon:'map', label:'주소', value: draft.address },
    draft.phone && { icon:'phone', label:'전화', value: draft.phone },
    draft.price && { icon:'wallet', label:'요금', value: draft.price },
    draft.confirmation && { icon:'book', label:'예약번호', value: draft.confirmation },
    draft.note && { icon:'book', label:'메모', value: draft.note },
  ].filter(Boolean);

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000,
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
      background:`rgba(0,0,0,${Math.max(0, 0.35 - sheetY / 400)})` }} onClick={onClose}>
      <div style={{ transform:`translateY(${entered ? sheetY : window.innerHeight}px)`,
        transition: sheetY ? 'none' : 'transform 0.34s cubic-bezier(0.32,0.72,0,1)',
        display:'flex', flexDirection:'column', position:'relative' }}>
        <div ref={sheetRef} onClick={e => e.stopPropagation()}
          style={{ background:COLORS.bg, borderRadius:'22px 22px 0 0', paddingBottom:40,
            maxHeight: '92%',
            overflowY:'auto', overflowX:'hidden' }}>
          <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 6px' }}>
            <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
          </div>
          <div style={{ position:'relative' }}>
            <Photo hue={hue} label={(draft.name||'').toUpperCase().slice(0,20)} height={160}/>
            {!editing && (
              <button onClick={e => { e.stopPropagation(); setEditing(true); }} style={{
                position:'absolute', top:12, right:12, zIndex:5,
                border:'none', background:'rgba(255,255,255,0.92)', borderRadius:14,
                padding:'7px 13px', cursor:'pointer',
                fontFamily:SANS, fontSize:12, fontWeight:500, color:COLORS.ink,
                display:'flex', gap:5, alignItems:'center', boxShadow:'0 1px 6px rgba(0,0,0,0.12)',
              }}>
                <Icon name="edit" size={12} color={COLORS.ink} stroke={2}/> 수정
              </button>
            )}
          </div>
          <div style={{ padding:'18px 20px 0' }}>
            <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.accent, letterSpacing:'0.12em', textTransform:'uppercase' }}>
              HOTEL{draft.nights ? ` · ${draft.nights}박` : ''}
            </div>
            {!editing && (
              <div style={{ marginTop:6, fontFamily:SERIF, fontSize:28, lineHeight:1.12, color:COLORS.ink }}>
                {draft.name || '새 숙소'}
              </div>
            )}
            {!editing && draft.area && (
              <div style={{ marginTop:4, fontFamily:SANS, fontSize:13, color:COLORS.mute, display:'flex', gap:5, alignItems:'center' }}>
                <Icon name="pin" size={12} stroke={1.8}/> {draft.area}
                {draft.rating && <><span style={{ opacity:0.4 }}>·</span><span>★ {draft.rating}</span></>}
              </div>
            )}

            {editing ? (
              <div style={{ marginTop:14 }}>
                <div style={{ position:'relative', marginBottom:10 }}>
                  <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>숙소 이름</div>
                  <div style={{ position:'relative' }}>
                    <input
                      value={searchQ !== '' ? searchQ : (draft.name || '')}
                      onChange={e => { const v=e.target.value; setSearchQ(v); setDraft({...draft, name:v}); }}
                      onFocus={() => { searchFocused.current=true; if(searchRes.length) setShowSearch(true); }}
                      onBlur={() => { searchFocused.current=false; setTimeout(()=>setShowSearch(false),150); }}
                      placeholder="숙소 검색..."
                      style={{ width:'100%', padding:'9px 36px 9px 11px', borderRadius:8,
                        border:`1px solid ${COLORS.line}`, background:COLORS.bg,
                        fontFamily:SANS, fontSize:13, color:COLORS.ink, boxSizing:'border-box' }}/>
                    <div style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                      <Icon name="search" size={13} color={COLORS.mute} stroke={2}/>
                    </div>
                  </div>
                  {showSearch && searchRes.length > 0 && (
                    <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, zIndex:50,
                      background:COLORS.bg, border:`1px solid ${COLORS.line}`, borderRadius:10,
                      overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.12)' }}>
                      {searchRes.map((f, i) => {
                        const p = f.properties;
                        const hName = p.name || '';
                        const city = p.city || p.county || p.state || '';
                        const addr = [p.street, p.housenumber].filter(Boolean).join(' ');
                        return (
                          <button key={i}
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => {
                              setDraft({...draft, name:hName, area:city, address:addr || hName, phone:p.phone||''});
                              setSearchQ(''); setSearchRes([]); setShowSearch(false);
                            }}
                            style={{ display:'flex', flexDirection:'column', width:'100%', padding:'9px 12px',
                              border:'none', background:'transparent', cursor:'pointer', textAlign:'left',
                              borderBottom: i < searchRes.length-1 ? `1px solid ${COLORS.line}` : 'none' }}>
                            <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.ink, fontWeight:500 }}>{hName}</div>
                            {city && <div style={{ fontFamily:SANS, fontSize:11.5, color:COLORS.mute, marginTop:1 }}>{[addr, city].filter(Boolean).join(', ')}</div>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ background:COLORS.card, borderRadius:14, padding:'14px 16px' }}>
                  {field('area', '지역')}
                  {field('address', '주소')}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {dateField('checkin', '체크인 날짜')}
                    {dateField('checkout', '체크아웃 날짜')}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                    {['checkin','checkout'].map(k => (
                      <div key={k}>
                        <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>
                          {k==='checkin'?'체크인 시간':'체크아웃 시간'}
                        </div>
                        <button onClick={()=>setTimePicker(k)} style={{ width:'100%', padding:'9px 11px',
                          borderRadius:8, border:`1px solid ${COLORS.line}`, background:COLORS.bg,
                          fontFamily:SANS, fontSize:13, color:COLORS.ink, cursor:'pointer', textAlign:'left',
                          display:'flex', justifyContent:'space-between', alignItems:'center', boxSizing:'border-box' }}>
                          <span>{draft[k==='checkin'?'checkinTime':'checkoutTime'] || (k==='checkin'?'15:00':'12:00')}</span>
                          <Icon name="chevron-d" size={12} color={COLORS.mute} stroke={2}/>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <div>
                      <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>박수</div>
                      <div style={{ padding:'9px 11px', borderRadius:8, border:`1px solid ${COLORS.line}`,
                        background:COLORS.bg, fontFamily:SANS, fontSize:13,
                        color: draft.nights ? COLORS.ink : COLORS.mute }}>
                        {draft.nights ? `${draft.nights}박` : '날짜 선택 후 자동'}
                      </div>
                    </div>
                    {field('price', '요금')}
                  </div>
                  {field('phone', '전화')}
                  {field('confirmation', '예약번호')}
                  <div>
                    <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>메모</div>
                    <textarea value={draft.note||''} onChange={e=>setDraft({...draft,note:e.target.value})} rows={3}
                      style={{ width:'100%', padding:'9px 11px', borderRadius:8, border:`1px solid ${COLORS.line}`,
                        background:COLORS.bg, fontFamily:SANS, fontSize:13, color:COLORS.ink,
                        boxSizing:'border-box', resize:'none' }}/>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginTop:16, display:'flex', flexDirection:'column' }}>
                {rows.map((r, i, arr) => (
                  <div key={i} style={{
                    background:COLORS.card, padding:'13px 16px',
                    borderTopLeftRadius:i===0?12:0, borderTopRightRadius:i===0?12:0,
                    borderBottomLeftRadius:i===arr.length-1?12:0, borderBottomRightRadius:i===arr.length-1?12:0,
                    display:'flex', gap:12, alignItems:'flex-start',
                    borderBottom:i<arr.length-1?`1px solid ${COLORS.line}`:'none',
                  }}>
                    <div style={{ paddingTop:2 }}><Icon name={r.icon} size={15} color={COLORS.mute} stroke={1.8}/></div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase' }}>{r.label}</div>
                      <div style={{ marginTop:2, fontFamily:SANS, fontSize:13.5, color:COLORS.ink, lineHeight:1.45, whiteSpace:'pre-wrap' }}>{r.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop:14, display:'flex', gap:8 }}>
              {editing ? (
                <>
                  <button onClick={save} style={{
                    flex:1, background:COLORS.ink, color:COLORS.bg,
                    border:'none', borderRadius:12, padding:'13px',
                    fontFamily:SANS, fontSize:14, fontWeight:500, cursor:'pointer',
                    display:'flex', gap:6, alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon name="save" size={14} color={COLORS.bg} stroke={1.8}/> 저장
                  </button>
                  {!isNew && (
                    <button onClick={() => { setDraft({ ...committed.current }); setEditing(false); }} style={{
                      width:80, background:COLORS.card, border:`1px solid ${COLORS.line}`,
                      borderRadius:12, cursor:'pointer', fontFamily:SANS, fontSize:13, color:COLORS.ink,
                    }}>취소</button>
                  )}
                </>
              ) : (
                <>
                  <button onClick={() => window.open(mapsSearchUrl([draft.name, draft.area].filter(Boolean).join(' ')), '_blank')} style={{
                    flex:1, background:COLORS.ink, color:COLORS.bg,
                    border:'none', borderRadius:12, padding:'13px',
                    fontFamily:SANS, fontSize:14, fontWeight:500, cursor:'pointer',
                    display:'flex', gap:6, alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon name="nav" size={14} color={COLORS.bg} stroke={1.8}/> 지도
                  </button>
                  <button onClick={onDelete} style={{
                    width:60, background:COLORS.card, border:`1px solid ${COLORS.line}`,
                    borderRadius:12, cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon name="trash" size={16} color={COLORS.accent} stroke={1.8}/>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        {timePicker && (
          <div onClick={() => setTimePicker(null)} style={{
            position:'absolute', inset:0, background:'rgba(0,0,0,0.3)', zIndex:10,
            display:'flex', alignItems:'flex-end', borderRadius:'22px 22px 0 0', overflow:'hidden',
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              width:'100%', background:COLORS.bg, borderRadius:'18px 18px 0 0', paddingBottom:40,
            }}>
              <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 4px' }}>
                <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
              </div>
              <div style={{ padding:'4px 20px 10px', fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                {timePicker==='checkin'?'체크인 시간':'체크아웃 시간'}
              </div>
              {(timePicker==='checkin'
                ? ['12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']
                : ['09:00','10:00','11:00','12:00','13:00','14:00']
              ).map(t => {
                const k = timePicker==='checkin' ? 'checkinTime' : 'checkoutTime';
                const sel = draft[k] === t;
                return (
                  <button key={t} onClick={() => { setDraft({...draft, [k]:t}); setTimePicker(null); }}
                    style={{ display:'flex', width:'100%', padding:'13px 20px', border:'none',
                      background: sel ? `${COLORS.ink}0f` : 'transparent',
                      fontFamily:SANS, fontSize:15, color:COLORS.ink, cursor:'pointer',
                      alignItems:'center', justifyContent:'space-between',
                      borderBottom:`1px solid ${COLORS.line}` }}>
                    <span style={{ fontWeight: sel ? 600 : 400 }}>{t}</span>
                    {sel && <Icon name="check" size={14} color={COLORS.accent} stroke={2.5}/>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LocationField({ value, onChange, cityBias }) {
  const [query, setQuery]     = React.useState(value || '');
  const [results, setResults] = React.useState([]);
  const [show, setShow]       = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const timer = React.useRef(null);
  const focusedRef = React.useRef(false);

  React.useEffect(() => { setQuery(value || ''); }, [value]);

  const doSearch = async (q) => {
    if (!q.trim()) { setResults([]); setShow(false); return; }
    try {
      const [bLat, bLon] = cityBias || [];
      const bias = bLat ? `&lat=${bLat}&lon=${bLon}` : '';
      const j = await (await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=en${bias}`
      )).json();
      const feats = j?.features || [];
      setResults(feats);
      if (feats.length && focusedRef.current) setShow(true);
    } catch(_) {}
  };

  React.useEffect(() => {
    clearTimeout(timer.current);
    if (!query.trim()) { setResults([]); setShow(false); return; }
    timer.current = setTimeout(() => doSearch(query), 350);
  }, [query]);

  return (
    <div style={{ position:'relative' }}>
      <div style={{ position:'relative' }}>
        <input value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value, null); }}
          onFocus={() => { focusedRef.current = true; setFocused(true); if (results.length) setShow(true); }}
          onBlur={() => { focusedRef.current = false; setFocused(false); setTimeout(() => setShow(false), 150); }}
          onKeyDown={e => e.key === 'Enter' && doSearch(query)}
          placeholder="위치 검색..."
          style={{ width:'100%', padding:'8px 34px 8px 10px', borderRadius:8,
            border:`1px solid ${COLORS.line}`, background:COLORS.card,
            fontFamily:SANS, fontSize:13, color:COLORS.ink, boxSizing:'border-box' }}/>
        <button
          type="button"
          onMouseDown={e => e.preventDefault()}
          onClick={() => doSearch(query)}
          style={{ position:'absolute', right:6, top:'50%', transform:'translateY(-50%)',
            background:'none', border:'none', cursor:'pointer', padding:4,
            display:'flex', alignItems:'center' }}>
          <Icon name="search" size={13} color={COLORS.mute} stroke={2}/>
        </button>
      </div>
      {show && results.length > 0 && (
        <div style={{
          position:'absolute', top:'calc(100% + 4px)', left:0, right:0, zIndex:300,
          background:COLORS.bg, border:`1px solid ${COLORS.line}`, borderRadius:10,
          overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.12)',
        }}>
          {results.map((f, i) => {
            const p = f.properties;
            const name = p.name || p.street || query;
            const addr = [p.street, p.city || p.county].filter(Boolean).join(', ');
            const [lon, lat] = f.geometry.coordinates;
            return (
              <button key={i}
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  const loc = addr ? `${name}, ${addr}` : name;
                  setQuery(loc); setShow(false);
                  onChange(loc, [lat, lon]);
                }}
                style={{
                  display:'flex', gap:10, alignItems:'center', width:'100%',
                  padding:'9px 12px', border:'none', background:'transparent',
                  cursor:'pointer', textAlign:'left',
                  borderBottom: i < results.length-1 ? `1px solid ${COLORS.line}` : 'none',
                }}>
                <Icon name="pin" size={13} color={COLORS.accent} stroke={1.8}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.ink, fontWeight:500,
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{name}</div>
                  {addr && <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute,
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{addr}</div>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EditStopForm({ draft, setDraft, cityBias }) {
  const [showHotelSearch, setShowHotelSearch] = React.useState(false);
  const [timeOpen, setTimeOpen] = React.useState(false);
  const field = (key, label, type='text') => (
    <label style={{ display:'block', marginTop:10 }}>
      <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>
        {label}
      </div>
      {type === 'textarea' ? (
        <textarea value={draft[key] || ''} onChange={e => setDraft({...draft, [key]: e.target.value})}
          rows={3} style={{ width:'100%', padding:'8px 10px', borderRadius:8,
          border:`1px solid ${COLORS.line}`, background:COLORS.card,
          fontFamily:SANS, fontSize:13, color:COLORS.ink, boxSizing:'border-box', resize:'vertical' }}/>
      ) : type === 'select' ? (
        <select value={draft[key] || 'sight'} onChange={e => setDraft({...draft, [key]: e.target.value})}
          style={{ width:'100%', padding:'8px 10px', borderRadius:8,
          border:`1px solid ${COLORS.line}`, background:COLORS.card,
          fontFamily:SANS, fontSize:13, color:COLORS.ink, boxSizing:'border-box' }}>
          {Object.entries(CAT_META).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
        </select>
      ) : (
        <input value={draft[key] || ''} onChange={e => setDraft({...draft, [key]: e.target.value})}
          style={{ width:'100%', padding:'8px 10px', borderRadius:8,
          border:`1px solid ${COLORS.line}`, background:COLORS.card,
          fontFamily:SANS, fontSize:13, color:COLORS.ink, boxSizing:'border-box' }}/>
      )}
    </label>
  );
  return (
    <div style={{ marginTop:10 }}>
      {field('title', '제목')}
      {field('en', '영문명')}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, alignItems:'end' }}>
        <label style={{ display:'block', marginTop:10 }}>
          <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>시간</div>
          <button type="button" onClick={() => setTimeOpen(true)} style={{
            width:'100%', padding:'8px 10px', borderRadius:8,
            border:`1px solid ${COLORS.line}`, background:COLORS.card,
            fontFamily:MONO, fontSize:14, color:COLORS.ink, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>{draft.time || '09:00'}</button>
        </label>
        {field('cat', '카테고리', 'select')}
      </div>
      <TimeWheelSheet open={timeOpen} value={draft.time || '09:00'}
        onClose={() => setTimeOpen(false)}
        onPick={v => { setDraft({...draft, time: v}); setTimeOpen(false); }}/>
      {draft.cat === 'hotel' && (
        <button type="button" onClick={() => setShowHotelSearch(true)} style={{
          marginTop:10, width:'100%', border:'none', cursor:'pointer',
          background:COLORS.ink, color:COLORS.bg, borderRadius:10,
          padding:'11px', fontFamily:SANS, fontSize:13, fontWeight:500,
          display:'flex', gap:6, alignItems:'center', justifyContent:'center',
        }}>
          <Icon name="search" size={13} color={COLORS.bg} stroke={2}/>
          호텔 검색해서 채우기
        </button>
      )}
      <label style={{ display:'block', marginTop:10 }}>
        <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>위치</div>
        <LocationField
          value={draft.loc || ''}
          cityBias={cityBias}
          onChange={(loc, coords) => setDraft({ ...draft, loc, ...(coords ? { coords } : {}) })}
        />
      </label>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {field('price', '가격')}
      </div>
      {field('note', '메모', 'textarea')}
      {showHotelSearch && (
        <HotelSearchSheet
          COLORS={COLORS} SERIF={SERIF} SANS={SANS} MONO={MONO} Icon={Icon}
          cityBias={cityBias}
          onPick={(result) => {
            if (typeof result === 'string') {
              const m = result.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
              setDraft({ ...draft, title: m ? m[1] : result, en: m ? m[1] : result, loc: m ? m[2] : '' });
            } else {
              setDraft({
                ...draft,
                title: result.name,
                en: result.name,
                loc: result.area || '',
                note: [
                  result.confirmation ? `예약번호: ${result.confirmation}` : '',
                  result.source || '',
                ].filter(Boolean).join(' · '),
              });
            }
          }}
          onClose={() => setShowHotelSearch(false)}/>
      )}
    </div>
  );
}

// ─── Geocoding cache ─────────────────────────────────────────
const GEO_CACHE = {};

// ─── Route tip 계산 (MapScreen 밖으로 추출) ───────────────────
function computeRouteTip(pts, times) {
  if (pts.length < 2) return null;
  const toMin = t => { const m=(t||'').match(/^(\d{1,2}):(\d{2})/); return m ? +m[1]*60 + +m[2] : null; };
  const dist2 = (a, b) => { const dl=a.pos[0]-b.pos[0],dn=a.pos[1]-b.pos[1]; return dl*dl+dn*dn; };
  const hotel  = pts.find(p => p.cat === 'hotel') || null;
  const foods  = pts.filter(p => p.cat === 'food');
  const lunch  = foods.find(p => { const m=toMin(p.time); return m && m>=600 && m<=900; }) || foods[0] || null;
  const dinner = foods.find(p => { const m=toMin(p.time); return m && m>=1020; }) || (foods.length>1 ? foods[foods.length-1] : null);
  const dinnerIsLunch = dinner && lunch && dinner === lunch;
  const startIdx = hotel ? pts.indexOf(hotel) : 0;
  const n = pts.length;
  const visited = Array(n).fill(false);
  const order = [startIdx]; visited[startIdx] = true;
  for (let step=1; step<n; step++) {
    let best=-1, bestD=Infinity;
    const last=order[order.length-1];
    for (let j=0; j<n; j++) { if (!visited[j]) { const d=dist2(pts[last],pts[j]); if (d<bestD){bestD=d;best=j;} } }
    visited[best]=true; order.push(best);
  }
  const isOptimal = order.every((v,i) => v===i);
  const totalTransit = Object.values(times).reduce((s,t) => s+(t.transit||0), 0);
  const longestLeg   = Object.entries(times).sort((a,b)=>(b[1].transit||0)-(a[1].transit||0))[0];
  const returnsToHotel = hotel ? pts[pts.length-1].cat==='hotel' : null;
  return { pts, order, isOptimal, totalTransit, longestLeg, times,
           hotel, lunch, dinner: dinnerIsLunch ? null : dinner, returnsToHotel };
}

// ─── 백그라운드 프리패치: 모든 날 경로 + 이동시간 ────────────
async function prefetchRoutes(trip) {
  if (!trip?.days?.length) return;
  try {
    const delay = ms => new Promise(r => setTimeout(r, ms));
    const city = trip.title || '';
    const CITY_BIAS_MAP = {
      'new york':[40.758,-73.985],'paris':[48.856,2.352],'london':[51.507,-0.127],
      'tokyo':[35.690,139.692],'seoul':[37.563,126.997],'los angeles':[34.052,-118.244],
      'rome':[41.900,12.500],'florence':[43.769,11.256],'barcelona':[41.387,2.170],
      'amsterdam':[52.370,4.895],'berlin':[52.520,13.405],'prague':[50.088,14.420],
    };
    const cityBias = CITY_BIAS_MAP[city.toLowerCase().split(/[^a-z]/)[0]];
    const bias = cityBias ? `&lat=${cityBias[0]}&lon=${cityBias[1]}` : '';

    const geocode = async (query) => {
      if (GEO_CACHE[query]) return GEO_CACHE[query];
      try {
        const j = await (await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1&lang=en${bias}`
        )).json();
        const f = j?.features?.[0];
        if (f) { const [lon,lat]=f.geometry.coordinates; GEO_CACHE[query]=[lat,lon]; return [lat,lon]; }
      } catch(_) {}
      return null;
    };

    for (let dayIdx = 0; dayIdx < trip.days.length; dayIdx++) {
      try {
        const day = trip.days[dayIdx];
        const ordered = (day.items||[]).filter(it => it.loc).map((it,ii) => ({...it, _origIdx:ii}));
        if (!ordered.length) continue;

        // ① MapScreen 경로 캐시
        const mapKey = ordered.map(s => `${s.title}|${s.coords ? s.coords.join(',') : ''}`).join('~');
        const routeCacheKey = `route_${trip.title}_${dayIdx}_${mapKey}`;
        let alreadyCached = false;
        try { alreadyCached = !!localStorage.getItem(routeCacheKey); } catch(_) {}
        if (!alreadyCached) {
          const pts = [];
          for (const s of ordered) {
            let pos = s.coords || null;
            if (!pos) {
              const queries = [s.loc ? `${s.title}, ${s.loc}, ${city}` : null, `${s.title}, ${city}`, s.title].filter(Boolean);
              for (const q of queries) { pos = await geocode(q); if (pos) break; await delay(80); }
            }
            if (pos) pts.push({ pos, title:s.title, cat:s.cat||'', time:s.time||'' });
            await delay(60);
          }
          if (pts.length > 1) {
            try {
              const coords = pts.map(p => `${p.pos[1]},${p.pos[0]}`).join(';');
              const rd = await (await fetch(
                `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
              )).json();
              if (rd.routes?.[0]) {
                const times = {};
                (rd.routes[0].legs||[]).forEach((leg,li) => {
                  times[li+1] = { transit:Math.max(1,Math.round(leg.duration/60)), walk:Math.max(1,Math.round(leg.distance/83.33)) };
                });
                try {
                  const tip = computeRouteTip(pts, times);
                  const geometry = rd.routes[0].geometry;
                  localStorage.setItem(routeCacheKey, JSON.stringify({ pts, times, tip, geometry }));
                } catch(_) {}
              }
            } catch(_) {}
          }
          await delay(400); // 날짜 간 간격
        }

        // ② DayScreen 이동시간 캐시 (coords 있는 항목만)
        const items = day.items || [];
        const coordsKey = items.map(it => it.coords ? it.coords.join(',') : '').join('|');
        const ttCacheKey = `tt_day_${trip.title}_${dayIdx}_${coordsKey}`;
        const pending = items.reduce((acc,it,i) => { if (i>0 && it.coords && items[i-1].coords) acc.push(i); return acc; }, []);
        let ttCached = false;
        try { ttCached = !!localStorage.getItem(ttCacheKey); } catch(_) {}
        if (pending.length && !ttCached) {
          const results = {};
          for (const i of pending) {
            try {
              const [lat1,lon1]=items[i-1].coords, [lat2,lon2]=items[i].coords;
              const r = await (await fetch(
                `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`
              )).json();
              if (r.routes?.[0]) {
                const {duration,distance}=r.routes[0];
                results[i]={drive:Math.max(1,Math.round(duration/60)),walk:Math.max(1,Math.round(distance/83.33))};
              }
            } catch(_) {}
            await delay(120);
          }
          try { localStorage.setItem(ttCacheKey, JSON.stringify(results)); } catch(_) {}
          await delay(200);
        }
      } catch(_) {}
    }

    // ③ NearbySheet 장소 목록 프리패치 (coords 있는 스탑만, 사진 제외)
    const allStops = trip.days.flatMap(d => (d.items||[]).filter(it => it.coords));
    const overpassBase = 'https://overpass-api.de/api/interpreter?data=';
    const parseOverpass = (d, lat, lon) => {
      const seen = new Set();
      return (d.elements||[]).reduce((acc, e) => {
        const nm = e.tags?.name || e.tags?.['name:en'] || '';
        if (!nm || seen.has(nm) || !e.lat) return acc;
        seen.add(nm);
        acc.push({
          name: nm,
          type: e.tags?.amenity || e.tags?.tourism || e.tags?.historic || e.tags?.leisure || '',
          wikipedia: e.tags?.wikipedia || '',
          image: e.tags?.image || '',
          dist: haversineM(lat, lon, e.lat, e.lon),
          lat: e.lat, lon: e.lon,
        });
        return acc;
      }, []).sort((a,b) => a.dist - b.dist);
    };
    for (const s of allStops) {
      try {
        const [lat, lon] = s.coords;
        const stopKey = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
        const cacheKey = `nearby_places_${stopKey}`;
        if (ncGet(cacheKey, NC_PLACES_TTL) !== undefined) continue; // 이미 캐시됨
        const hQ = `[out:json][timeout:10];(node["tourism"~"attraction|museum|viewpoint|gallery|theme_park|zoo"](around:900,${lat},${lon});node["historic"~"monument|castle|ruins|memorial"](around:900,${lat},${lon});node["leisure"~"park|garden"](around:900,${lat},${lon}););out 30;`;
        const fQ = `[out:json][timeout:10];(node["amenity"~"restaurant|cafe|bar|fast_food|pub|biergarten|food_court"](around:600,${lat},${lon}););out 30;`;
        const [hR, fR] = await Promise.all([
          fetch(overpassBase + encodeURIComponent(hQ)).then(r=>r.json()),
          fetch(overpassBase + encodeURIComponent(fQ)).then(r=>r.json()),
        ]);
        ncSet(cacheKey, { hotspots: parseOverpass(hR, lat, lon), food: parseOverpass(fR, lat, lon) });
        await delay(2000); // Overpass 부담 최소화
      } catch(_) {}
    }
  } catch(_) {}
}

// ─── Place search sheet ───────────────────────────────────────
function PlaceSearchSheet({ open, item, cityBias, onClose, onPick }) {
  const [query, setQuery]     = React.useState('');
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const timerRef = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) { setQuery(''); setResults([]); setTimeout(() => inputRef.current?.focus(), 300); }
  }, [open]);

  React.useEffect(() => {
    clearTimeout(timerRef.current);
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const [bLat, bLon] = cityBias || [];
        const bias = bLat ? `&lat=${bLat}&lon=${bLon}` : '';
        const j = await (await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lang=en${bias}`
        )).json();
        setResults(j?.features || []);
      } catch(_) { setResults([]); }
      setLoading(false);
    }, 350);
  }, [query]);

  const formatAddr = (props) => {
    const parts = [props.street, props.city || props.county, props.country].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="장소 검색">
      <div style={{ padding:'4px 16px 12px' }}>
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          background:COLORS.softer, borderRadius:12, padding:'10px 14px',
        }}>
          <Icon name="search" size={15} color={COLORS.mute} stroke={2}/>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="장소 이름으로 검색..."
            style={{ flex:1, border:'none', background:'transparent', outline:'none',
              fontFamily:SANS, fontSize:14, color:COLORS.ink }}/>
          {query ? <button onClick={() => setQuery('')} style={{ border:'none', background:'none', cursor:'pointer', padding:0 }}>
            <Icon name="x" size={13} color={COLORS.mute} stroke={2}/>
          </button> : null}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign:'center', padding:'16px 0', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>검색 중...</div>
      )}

      <div style={{ padding:'0 8px 20px', display:'flex', flexDirection:'column', gap:2 }}>
        {results.map((f, i) => {
          const p = f.properties;
          const name = p.name || p.street || query;
          const addr = formatAddr(p);
          const [lon, lat] = f.geometry.coordinates;
          return (
            <button key={i} onClick={() => onPick({ name, addr, coords:[lat, lon] })} style={{
              display:'flex', gap:12, alignItems:'flex-start',
              padding:'10px 10px', borderRadius:10, border:'none', background:'transparent',
              cursor:'pointer', textAlign:'left', width:'100%',
            }}>
              <div style={{ marginTop:2, flexShrink:0 }}>
                <Icon name="pin" size={14} color={COLORS.accent} stroke={1.8}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:SANS, fontSize:13, fontWeight:500, color:COLORS.ink,
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{name}</div>
                {addr ? <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute, marginTop:2,
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{addr}</div> : null}
              </div>
            </button>
          );
        })}
        {!loading && query && results.length === 0 && (
          <div style={{ textAlign:'center', padding:'20px 0', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>결과 없음</div>
        )}
      </div>
    </BottomSheet>
  );
}

// ─── Map ─────────────────────────────────────────────────────
function MapScreen({ trip, onEditItem }) {
  const makeOrdered = (dayIdx) =>
    trip.days[dayIdx].items
      .map((it, ii) => ({ ...it, _origIdx: ii }))
      .filter(it => it.loc);

  const getTodayDayIdx = () => {
    const yr = extractTripYear(trip);
    const todayIso = new Date().toISOString().slice(0, 10);
    const isos = trip.days.map(d => dayDateToIso(d.date, yr) || '');
    const todayIdx = isos.findIndex(iso => iso === todayIso);
    if (todayIdx >= 0) return todayIdx;
    const future = isos.findIndex(iso => iso > todayIso);
    if (future === 0 || isos.every(iso => !iso)) return 0;
    if (future < 0) return trip.days.length - 1;
    return future - 1;
  };

  const [state, dispatch] = React.useReducer((s, a) => {
    if (a.type === 'DAY') return { selDay: a.v, ordered: makeOrdered(a.v) };
    if (a.type === 'REORDER') {
      const o = [...s.ordered]; o.splice(a.to, 0, o.splice(a.from, 1)[0]);
      return { ...s, ordered: o };
    }
    if (a.type === 'UPDATE_ITEM') {
      const o = [...s.ordered];
      o[a.idx] = { ...o[a.idx], ...a.patch };
      return { ...s, ordered: o };
    }
    return s;
  }, null, () => { const i = getTodayDayIdx(); return { selDay: i, ordered: makeOrdered(i) }; });

  const { selDay, ordered } = state;
  const day = trip.days[selDay];
  const { itemProps } = useDragReorder((from, to) => dispatch({ type:'REORDER', from, to }), false);

  const [openStop, setOpenStop] = React.useState(null);
  const [travelTimes, setTravelTimes] = React.useState({});
  const [routeTip, setRouteTip] = React.useState(null);
  const fmtMin = (m) => m >= 60 ? `${Math.floor(m/60)}시간${m%60 ? ` ${m%60}분` : ''}` : `${m}분`;

  const heroHue = (selDay === 0 ? (trip.hue ?? day?.hero?.hue) : day?.hero?.hue) ?? 25;
  const city = trip.title || 'New York';
  const CITY_BIAS_MAP = {
    'new york':[40.758,-73.985],'paris':[48.856,2.352],'london':[51.507,-0.127],
    'tokyo':[35.690,139.692],'seoul':[37.563,126.997],'los angeles':[34.052,-118.244],
  };
  const cityBias = CITY_BIAS_MAP[city.toLowerCase()];

  const mapDiv  = React.useRef(null);
  const mapInst = React.useRef(null);
  const layers  = React.useRef([]);

  // 날짜 바뀌면 지도 재초기화
  React.useEffect(() => {
    if (!window.L || !mapDiv.current) return;
    if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; }
    layers.current = [];
    const map = window.L.map(mapDiv.current, { zoomControl:true, attributionControl:false });
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(map);
    map.setView([40.7128, -74.006], 12);
    mapInst.current = map;
    return () => { if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; } };
  }, [selDay]);

  // 순서 바뀌면 마커·루트만 업데이트
  const mapKey = ordered.map(s => `${s.title}|${s.coords ? s.coords.join(',') : ''}`).join('~');
  React.useEffect(() => {
    if (!window.L) return;
    setRouteTip(null);
    let cancelled = false;
    const cacheKey = `route_${trip.title}_${selDay}_${mapKey}`;

    const drawFromPts = (pts, times) => {
      if (!mapInst.current || !pts.length) return;
      layers.current.forEach(l => { try { l.remove(); } catch(_) {} });
      layers.current = [];
      pts.forEach((p, idx) => {
        const m = window.L.marker(p.pos, { icon: window.L.divIcon({
          className: '',
          html: `<div style="width:26px;height:26px;border-radius:50%;background:#C14F2E;color:#fff;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:11px;font-weight:700;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)">${idx+1}</div>`,
          iconSize:[26,26], iconAnchor:[13,13],
        }) }).addTo(mapInst.current).bindPopup(`<b>${p.title}</b>`);
        layers.current.push(m);
      });
    };

    (async () => {
      // 이전 레이어 제거
      layers.current.forEach(l => { try { l.remove(); } catch(_) {} });
      layers.current = [];
      if (!ordered.length || !mapInst.current) return;

      // 캐시 확인
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { pts, times, tip, geometry } = JSON.parse(cached);
          if (pts?.length) {
            drawFromPts(pts, times);
            // 캐시된 route geometry로 선 그리기
            if (geometry) {
              const route = window.L.geoJSON(geometry, {
                style: { color:'#C14F2E', weight:3.5, opacity:0.85 },
              }).addTo(mapInst.current);
              layers.current.push(route);
            } else {
              const line = window.L.polyline(pts.map(p => p.pos), {
                color:'#C14F2E', weight:3, opacity:0.7, dashArray:'8 5',
              }).addTo(mapInst.current);
              layers.current.push(line);
            }
            mapInst.current.fitBounds(window.L.latLngBounds(pts.map(p => p.pos)), { padding:[40,40] });
            if (!cancelled) { setTravelTimes(times || {}); setRouteTip(tip || null); }
            return;
          }
        }
      } catch(_) {}

      const [bLat, bLon] = cityBias || [];
      const bias = bLat ? `&lat=${bLat}&lon=${bLon}` : '';

      const geocode = async (query) => {
        if (GEO_CACHE[query]) return GEO_CACHE[query];
        try {
          const j = await (await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1&lang=en${bias}`
          )).json();
          const f = j?.features?.[0];
          if (f) {
            const [lon, lat] = f.geometry.coordinates;
            GEO_CACHE[query] = [lat, lon];
            return GEO_CACHE[query];
          }
        } catch(_) {}
        return null;
      };
      const delay = ms => new Promise(r => setTimeout(r, ms));

      const pts = [];
      for (let si = 0; si < ordered.length; si++) {
        if (cancelled) return;
        const s = ordered[si];
        let pos = s.coords || null;
        if (!pos) {
          const queries = [
            s.loc ? `${s.title}, ${s.loc}, ${city}` : null,
            `${s.title}, ${city}`,
            s.title,
          ].filter((q, i, a) => q && a.indexOf(q) === i);
          for (const q of queries) {
            if (cancelled) return;
            pos = await geocode(q);
            if (pos) break;
            await delay(80);
          }
        }
        if (pos) {
          pts.push({ pos, title: s.title, cat: s.cat || '', time: s.time || '' });
          if (!cancelled && mapInst.current) {
            const num = pts.length;
            const m = window.L.marker(pos, { icon: window.L.divIcon({
              className: '',
              html: `<div style="width:26px;height:26px;border-radius:50%;background:#C14F2E;color:#fff;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:11px;font-weight:700;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)">${num}</div>`,
              iconSize:[26,26], iconAnchor:[13,13],
            }) }).addTo(mapInst.current).bindPopup(`<b>${s.title}</b>`);
            layers.current.push(m);
          }
        }
        if (si < ordered.length - 1) await delay(120);
      }
      if (cancelled || !mapInst.current || !pts.length) return;

      if (pts.length > 1) {
        try {
          const coords = pts.map(p => `${p.pos[1]},${p.pos[0]}`).join(';');
          const rd = await (await fetch(
            `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
          )).json();
          if (!cancelled && rd.routes?.[0]) {
            const route = window.L.geoJSON(rd.routes[0].geometry, {
              style: { color:'#C14F2E', weight:3.5, opacity:0.85 },
            }).addTo(mapInst.current);
            layers.current.push(route);
            const times = {};
            (rd.routes[0].legs || []).forEach((leg, li) => {
              times[li + 1] = {
                transit: Math.max(1, Math.round(leg.duration / 60)),
                walk: Math.max(1, Math.round(leg.distance / 83.33)),
              };
            });
            if (!cancelled) {
              const tip = computeRouteTip(pts, times);
              const geometry = rd.routes[0].geometry;
              setTravelTimes(times);
              setRouteTip(tip);
              try { localStorage.setItem(cacheKey, JSON.stringify({ pts, times, tip, geometry })); } catch(_) {}
            }
          }
        } catch(_) {
          const line = window.L.polyline(pts.map(p => p.pos), {
            color:'#C14F2E', weight:3, opacity:0.7, dashArray:'8 5',
          }).addTo(mapInst.current);
          layers.current.push(line);
          if (!cancelled) {
            const tip = computeRouteTip(pts, {});
            setRouteTip(tip);
            try { localStorage.setItem(cacheKey, JSON.stringify({ pts, times:{}, tip })); } catch(_) {}
          }
        }
      }
      if (!cancelled && mapInst.current)
        mapInst.current.fitBounds(window.L.latLngBounds(pts.map(p => p.pos)), { padding:[40,40] });
    })();
    return () => { cancelled = true; };
  }, [selDay, mapKey]);

  return (
    <div style={{ background:COLORS.bg, minHeight:'100vh', paddingBottom:110 }}>
      <div style={{ paddingTop:'calc(16px + env(safe-area-inset-top, 0px))', paddingLeft:24, paddingRight:24, paddingBottom:8 }}>
        <div style={{ fontFamily:MONO, fontSize:11, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase' }}>Map</div>
        <div style={{ marginTop:4, fontFamily:SERIF, fontSize:38, color:COLORS.ink, letterSpacing:'-0.02em' }}>Route.</div>
      </div>
      <div style={{ padding:'4px 16px 12px', overflowX:'auto', whiteSpace:'nowrap' }}>
        <div style={{ display:'inline-flex', gap:6 }}>
          {trip.days.map((d, i) => (
            <button key={i} onClick={() => dispatch({ type:'DAY', v:i })} style={{
              border:'none', borderRadius:14, padding:'8px 14px', cursor:'pointer',
              background: i === selDay ? COLORS.ink : COLORS.card,
              color: i === selDay ? COLORS.bg : COLORS.ink,
              fontFamily:MONO, fontSize:11, letterSpacing:'0.08em',
            }}>D{String(d.n).padStart(2,'0')}</button>
          ))}
        </div>
      </div>
      <div style={{ padding:'0 16px' }}>
        <div ref={mapDiv} style={{
          borderRadius:18, overflow:'hidden', border:`1px solid ${COLORS.line}`,
          height:340, background:COLORS.softer,
        }}/>
      </div>
      <div style={{ padding:'16px 24px 6px' }}>
        <div style={{ fontFamily:SERIF, fontSize:20, color:COLORS.ink }}>
          Day {String(day.n).padStart(2,'0')} · {day.title}
        </div>
      </div>
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:0 }}>
        {ordered.flatMap((it, i) => {
          const p = itemProps(i);
          const card = (
            <div key={it.title + i} {...p} style={{
              ...p.style,
              background: p.style?.background || COLORS.card,
              borderRadius:12, display:'flex', gap:10, alignItems:'center',
              overflow:'hidden', marginBottom:6,
            }}>
              <button onClick={() => setOpenStop({ idx: it._origIdx, stop: it, editing: false })}
                style={{
                  flex:1, display:'flex', gap:10, alignItems:'center',
                  padding:'11px 0 11px 14px', border:'none', background:'transparent',
                  cursor:'pointer', textAlign:'left', minWidth:0,
                }}>
                <div style={{
                  width:22, height:22, borderRadius:11, flexShrink:0,
                  background:COLORS.accent, color:'#fff',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:MONO, fontSize:10, fontWeight:700,
                }}>{i+1}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.ink, fontWeight:500,
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.title}</div>
                  <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute,
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.loc}</div>
                </div>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); window.open(mapsDirectionsUrl(`${it.title} ${it.loc} ${city}`), '_blank'); }}
                style={{ padding:'11px 14px', border:'none', background:'transparent', cursor:'pointer', flexShrink:0 }}>
                <Icon name="nav" size={16} color={COLORS.accent} stroke={1.8}/>
              </button>
            </div>
          );
          const connector = travelTimes[i] ? (
            <div key={`tt-${i}`} style={{
              display:'flex', justifyContent:'center', alignItems:'center', gap:16,
              padding:'3px 0 9px',
              fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.06em',
            }}>
              <div style={{ flex:1, height:1, background:COLORS.line, marginLeft:16 }}/>
              <span style={{ display:'flex', gap:4, alignItems:'center', flexShrink:0 }}>
                <Icon name="bus" size={12} stroke={1.8}/>{fmtMin(travelTimes[i].transit)}
              </span>
              <span style={{ color:COLORS.line }}>·</span>
              <span style={{ display:'flex', gap:4, alignItems:'center', flexShrink:0 }}>
                <Icon name="walk" size={12} stroke={1.8}/>{fmtMin(travelTimes[i].walk)}
              </span>
              <div style={{ flex:1, height:1, background:COLORS.line, marginRight:16 }}/>
            </div>
          ) : null;
          return connector ? [connector, card] : [card];
        })}
      </div>

      {/* Route Tip 박스 */}
      {routeTip && (
        <div style={{ padding:'14px 16px 6px' }}>
          <div style={{ background:COLORS.card, borderRadius:16, padding:'14px 16px' }}>

            {/* 헤더 + 총 이동 시간 */}
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:12 }}>
              <span style={{ fontSize:15 }}>💡</span>
              <span style={{ fontFamily:MONO, fontSize:10, color:COLORS.accent, letterSpacing:'0.12em', textTransform:'uppercase' }}>Route Tip</span>
              {routeTip.totalTransit > 0 && (
                <span style={{ marginLeft:'auto', fontFamily:MONO, fontSize:10, color:COLORS.mute }}>
                  총 이동 {fmtMin(routeTip.totalTransit)}
                </span>
              )}
            </div>

            {/* 앵커 카드: 숙소 / 점심 / 저녁 */}
            {(routeTip.hotel || routeTip.lunch || routeTip.dinner) && (
              <div style={{ background:COLORS.bg, borderRadius:10, padding:'10px 12px', marginBottom:12,
                display:'flex', flexDirection:'column', gap:7 }}>
                {routeTip.hotel && (
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <Icon name="hotel" size={13} color={COLORS.mute} stroke={1.8}/>
                    <span style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, width:28 }}>숙소</span>
                    <span style={{ fontFamily:SANS, fontSize:12.5, color:COLORS.ink, flex:1,
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{routeTip.hotel.title}</span>
                  </div>
                )}
                {routeTip.lunch && (
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <Icon name="food" size={13} color={COLORS.mute} stroke={1.8}/>
                    <span style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, width:28 }}>점심</span>
                    <span style={{ fontFamily:SANS, fontSize:12.5, color:COLORS.ink, flex:1,
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{routeTip.lunch.title}</span>
                    {routeTip.lunch.time && <span style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, flexShrink:0 }}>{routeTip.lunch.time}</span>}
                  </div>
                )}
                {routeTip.dinner && (
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <Icon name="food" size={13} color={COLORS.mute} stroke={1.8}/>
                    <span style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, width:28 }}>저녁</span>
                    <span style={{ fontFamily:SANS, fontSize:12.5, color:COLORS.ink, flex:1,
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{routeTip.dinner.title}</span>
                    {routeTip.dinner.time && <span style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, flexShrink:0 }}>{routeTip.dinner.time}</span>}
                  </div>
                )}
              </div>
            )}

            {/* 최적 여부 */}
            {routeTip.isOptimal ? (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                  <span style={{ fontSize:16 }}>🎉</span>
                  <span style={{ fontFamily:SANS, fontSize:13, fontWeight:600, color:COLORS.ink }}>완벽한 동선이에요!</span>
                </div>
                <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.mute, lineHeight:1.6 }}>
                  {routeTip.hotel
                    ? `${routeTip.hotel.title}을 기점으로 이동 거리를 최소화한 최적 순서입니다.`
                    : '이동 거리를 최소화한 최적의 순서입니다.'}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.ink, marginBottom:6, lineHeight:1.55 }}>
                  {routeTip.hotel
                    ? `${routeTip.hotel.title}을 기점으로 경유지 순서를 조정하면 더 효율적이에요.`
                    : '방문 순서를 조정하면 이동 거리를 줄일 수 있어요.'}
                </div>
                <div style={{ background:COLORS.bg, borderRadius:10, padding:'10px 12px',
                  fontFamily:MONO, fontSize:11, color:COLORS.ink, lineHeight:1.8, wordBreak:'break-word' }}>
                  {routeTip.order.map((idx, i) => {
                    const p = routeTip.pts[idx];
                    const isAnchor = p.cat === 'hotel' || p.cat === 'food';
                    return (
                      <span key={idx}>
                        {i > 0 && <span style={{ color:COLORS.mute }}> → </span>}
                        <span style={{ color: isAnchor ? COLORS.accent : COLORS.ink, fontWeight: isAnchor ? 600 : 400 }}>
                          {p.title}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 숙소 미귀환 경고 */}
            {routeTip.hotel && routeTip.returnsToHotel === false && (
              <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${COLORS.line}`,
                display:'flex', gap:7, alignItems:'flex-start' }}>
                <span style={{ fontSize:13, flexShrink:0 }}>🏨</span>
                <span style={{ fontFamily:SANS, fontSize:12.5, color:COLORS.mute, lineHeight:1.55 }}>
                  마지막에{' '}
                  <span style={{ color:COLORS.ink, fontWeight:500 }}>{routeTip.hotel.title}</span>
                  로 돌아오는 경로를 확인하세요.
                </span>
              </div>
            )}

            {/* 가장 긴 구간 */}
            {routeTip.longestLeg && (() => {
              const legIdx = parseInt(routeTip.longestLeg[0]) - 1;
              const from = routeTip.pts[legIdx], to = routeTip.pts[legIdx+1];
              if (!from || !to) return null;
              return (
                <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${COLORS.line}`,
                  fontFamily:SANS, fontSize:12, color:COLORS.mute, lineHeight:1.55 }}>
                  가장 긴 구간{' '}
                  <span style={{ color:COLORS.ink, fontWeight:500 }}>{from.title}</span>
                  {' → '}
                  <span style={{ color:COLORS.ink, fontWeight:500 }}>{to.title}</span>
                  {` · 약 ${fmtMin(routeTip.longestLeg[1].transit)}`}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <StopSheet
        open={openStop}
        dayHue={heroHue}
        cityBias={cityBias}
        onClose={() => setOpenStop(null)}
        onSave={(draft) => {
          const orderedIdx = ordered.findIndex(o => o._origIdx === openStop.idx);
          if (orderedIdx >= 0) dispatch({ type:'UPDATE_ITEM', idx: orderedIdx, patch: draft });
          if (onEditItem) onEditItem(selDay, openStop.idx, draft);
          setOpenStop(null);
        }}
      />
    </div>
  );
}

// ─── Food ───────────────────────────────────────────────────
function FoodCatItems({ catItems, allFood, onEditFood, editing }) {
  const reorder = (from, to) => {
    const globalFrom = catItems[from].idx;
    const globalTo   = catItems[to].idx;
    const newFood = [...allFood];
    newFood.splice(globalTo, 0, newFood.splice(globalFrom, 1)[0]);
    onEditFood(newFood);
  };
  const delFood = (globalIdx) => onEditFood(allFood.filter((_, i) => i !== globalIdx));
  const updateFood = (globalIdx, patch) => {
    const list = [...allFood]; list[globalIdx] = { ...list[globalIdx], ...patch }; onEditFood(list);
  };
  const { itemProps, isTouchDragging } = useDragReorder(reorder, false);
  return (
    <>
      {catItems.map((f, i) => {
        const dp = itemProps(i);
        return (
          <div key={f.idx} ref={dp.ref} onTouchStart={dp.onTouchStart} onTouchMove={dp.onTouchMove} onTouchEnd={dp.onTouchEnd}
            style={{ position:'relative', ...(dp.style||{}) }}>
            <SwipeableRow
              cardSwipe
              onDelete={() => delFood(f.idx)}
              isDragging={isTouchDragging}
              wrapStyle={{ borderRadius:14, marginBottom:6 }}
            >
              <div style={{ padding:'12px 14px', position:'relative', background:COLORS.card, borderRadius:14 }}>
                {editing ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:4, paddingRight:32 }}>
                    <input value={f.name} onChange={e => updateFood(f.idx, { name: e.target.value })}
                      placeholder="맛집 이름"
                      style={{ border:'none', outline:'none', background:'transparent',
                        fontFamily:SANS, fontSize:14, fontWeight:500, color:COLORS.ink, padding:0, width:'100%' }}/>
                    <input value={f.detail||''} onChange={e => updateFood(f.idx, { detail: e.target.value })}
                      placeholder="상세 설명"
                      style={{ border:'none', outline:'none', background:'transparent',
                        fontFamily:SANS, fontSize:12, color:COLORS.mute, padding:0, width:'100%' }}/>
                    <div style={{ display:'flex', gap:8 }}>
                      <input value={f.price||''} onChange={e => updateFood(f.idx, { price: e.target.value })}
                        placeholder="가격"
                        style={{ border:'none', outline:'none', background:'transparent',
                          fontFamily:MONO, fontSize:11, color:COLORS.accent, padding:0, width:60 }}/>
                      <input value={f.note||''} onChange={e => updateFood(f.idx, { note: e.target.value })}
                        placeholder="메모"
                        style={{ border:'none', outline:'none', background:'transparent',
                          fontFamily:SANS, fontSize:11, color:COLORS.mute, padding:0, flex:1 }}/>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => window.open(mapsSearchUrl(f.name), '_blank')}
                    style={{ width:'100%', padding:0, border:'none', background:'transparent', cursor:'pointer', textAlign:'left' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8 }}>
                      <div style={{ fontFamily:SANS, fontSize:14, color:COLORS.ink, fontWeight:500 }}>{f.name}</div>
                      {f.price && <div style={{ fontFamily:MONO, fontSize:10.5, color:COLORS.accent, flexShrink:0 }}>{f.price}</div>}
                    </div>
                    {f.detail && <div style={{ marginTop:3, fontFamily:SANS, fontSize:12, color:COLORS.mute, lineHeight:1.4 }}>{f.detail}</div>}
                    {f.note && <div style={{ marginTop:4, fontFamily:SANS, fontSize:11, color:COLORS.mute, fontStyle:'italic', opacity:0.8 }}>— {f.note}</div>}
                  </button>
                )}
                {editing && (
                  <button onClick={() => delFood(f.idx)} style={{
                    position:'absolute', top:8, right:8, width:24, height:24, borderRadius:12,
                    border:'none', background:'rgba(193,79,46,0.12)', cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="trash" size={11} color={COLORS.accent} stroke={2}/>
                  </button>
                )}
              </div>
            </SwipeableRow>
            {dp['data-drag-over'] && (
              <div style={{ position:'absolute', inset:0, border:`2px dashed rgba(193,79,46,0.45)`,
                pointerEvents:'none', background:'rgba(193,79,46,0.04)' }}/>
            )}
          </div>
        );
      })}
    </>
  );
}

function FoodScreen({ trip, onEditFood, editing, setEditing }) {
  const [query,       setQuery]       = React.useState('');
  const [newCatInput, setNewCatInput] = React.useState(false);
  const [newCatName,  setNewCatName]  = React.useState('');
  const [addSelCat,   setAddSelCat]   = React.useState(null); // which cat is showing inline add

  const allFood = trip.food || [];
  const cats = [...new Set(allFood.map(f => f.cat).filter(Boolean))];

  const qLow = query.toLowerCase();
  const matchesQuery = (f) => !query
    || (f.name||'').toLowerCase().includes(qLow)
    || (f.detail||'').toLowerCase().includes(qLow)
    || (f.note||'').toLowerCase().includes(qLow);

  // Group: if searching, flat list; otherwise by category
  const grouped = {};
  allFood.forEach((f, idx) => {
    if (!matchesQuery(f)) return;
    const key = f.cat || '기타';
    (grouped[key] = grouped[key] || []).push({ ...f, idx });
  });
  const groupEntries = Object.entries(grouped);
  const totalFiltered = groupEntries.reduce((s, [,items]) => s + items.length, 0);

  const addFood = (cat) => {
    onEditFood([...allFood, { cat, name:'새 맛집', detail:'', price:'', note:'' }]);
    setAddSelCat(null);
  };
  const delFood = (idx) => {
    if (!confirm('이 맛집을 삭제할까요?')) return;
    onEditFood(allFood.filter((_, i) => i !== idx));
  };
  const updateFood = (idx, patch) => {
    const list = [...allFood]; list[idx] = { ...list[idx], ...patch }; onEditFood(list);
  };
  const renameCat = (oldCat, newCat) => {
    if (!newCat.trim() || newCat === oldCat) return;
    onEditFood(allFood.map(f => f.cat === oldCat ? { ...f, cat: newCat } : f));
  };
  const deleteCat = (cat) => {
    if (!confirm(`"${cat}" 카테고리와 모든 맛집을 삭제할까요?`)) return;
    onEditFood(allFood.filter(f => f.cat !== cat));
  };
  const addCategory = () => {
    const name = newCatName.trim();
    if (!name) return;
    addFood(name);
    setNewCatName(''); setNewCatInput(false);
  };

  return (
    <div style={{ background:COLORS.bg, minHeight:'100vh', paddingBottom:110 }}>
      {/* 헤더 */}
      <div style={{ paddingTop:'calc(16px + env(safe-area-inset-top, 0px))', paddingLeft:24, paddingRight:24, paddingBottom:12 }}>
        <div style={{ fontFamily:MONO, fontSize:11, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase' }}>Food Guide</div>
        <div style={{ marginTop:4, fontFamily:SERIF, fontSize:38, color:COLORS.ink, letterSpacing:'-0.02em' }}>Eat List.</div>
      </div>

      {/* 검색창 */}
      <div style={{ padding:'0 16px 16px', position:'relative' }}>
        <Icon name="search" size={14} color={COLORS.mute} stroke={2}
          style={{ position:'absolute', left:28, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="맛집 검색..."
          style={{ width:'100%', boxSizing:'border-box',
            paddingLeft:36, paddingRight:12, paddingTop:9, paddingBottom:9,
            border:`1px solid ${COLORS.line}`, borderRadius:12,
            background:COLORS.card, fontFamily:SANS, fontSize:13.5, color:COLORS.ink, outline:'none' }}/>
      </div>

      {/* 카테고리별 목록 */}
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:20 }}>
        {groupEntries.map(([cat, items]) => (
          <div key={cat}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, paddingLeft:2 }}>
              <span style={{ fontFamily:MONO, fontSize:10.5, color:COLORS.mute, letterSpacing:'0.1em', textTransform:'uppercase', flex:1 }}>{cat}</span>
              {editing && (
                <>
                  <button onClick={() => { const n = prompt('카테고리 이름 변경:', cat); if (n) renameCat(cat, n); }}
                    style={{ padding:'3px 8px', border:`1px solid ${COLORS.line}`, borderRadius:8,
                      background:'transparent', cursor:'pointer', fontFamily:SANS, fontSize:11, color:COLORS.mute }}>이름 변경</button>
                  <button onClick={() => deleteCat(cat)} style={{
                    width:24, height:24, borderRadius:12, border:'none', background:'rgba(193,79,46,0.10)',
                    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="trash" size={11} color={COLORS.accent} stroke={2}/>
                  </button>
                </>
              )}
            </div>
            <div>
              <FoodCatItems catItems={items} allFood={allFood} onEditFood={onEditFood} editing={editing}/>
              {/* 항목 추가 */}
              {addSelCat === cat ? (
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px',
                  borderTop: `1px solid ${COLORS.line}` }}>
                  <button onClick={() => addFood(cat)} style={{
                    flex:1, padding:'8px 0', border:'none', borderRadius:10,
                    background:COLORS.accent, color:'#fff', fontFamily:SANS, fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    추가
                  </button>
                  <button onClick={() => setAddSelCat(null)} style={{
                    padding:'8px 12px', border:'none', borderRadius:10,
                    background:COLORS.softer, color:COLORS.mute, fontFamily:SANS, fontSize:13, cursor:'pointer' }}>
                    취소
                  </button>
                </div>
              ) : (
                <button onClick={() => setAddSelCat(cat)} style={{
                  width:'100%', padding:'10px 14px', background:'transparent', border:'none',
                  borderTop:`1px solid ${COLORS.line}`,
                  display:'flex', alignItems:'center', gap:8, cursor:'pointer',
                  color:COLORS.mute, fontFamily:SANS, fontSize:13 }}>
                  <Icon name="plus" size={13} color={COLORS.mute} stroke={2}/> 맛집 추가
                </button>
              )}
            </div>
          </div>
        ))}

        {/* 빈 상태 */}
        {totalFiltered === 0 && (
          <div style={{ padding:'32px 0', textAlign:'center', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>
            {query ? '검색 결과가 없어요' : cats.length === 0 ? '카테고리를 만들어 맛집을 추가해 보세요' : '맛집을 추가해 보세요'}
          </div>
        )}

        {/* 카테고리 추가 */}
        {newCatInput ? (
          <form onSubmit={e => { e.preventDefault(); addCategory(); }}
            style={{ display:'flex', gap:8, alignItems:'center' }}>
            <input autoFocus value={newCatName} onChange={e => setNewCatName(e.target.value)}
              placeholder="카테고리 이름"
              style={{ flex:1, padding:'11px 14px', border:`1px solid ${COLORS.line}`, borderRadius:12,
                fontFamily:SANS, fontSize:13.5, background:COLORS.card, color:COLORS.ink, outline:'none' }}/>
            <button type="submit" style={{ padding:'11px 16px', border:'none', borderRadius:12,
              background:COLORS.ink, color:'#fff', fontFamily:SANS, fontSize:13, fontWeight:600, cursor:'pointer' }}>추가</button>
            <button type="button" onClick={() => { setNewCatInput(false); setNewCatName(''); }}
              style={{ padding:'11px 12px', border:'none', borderRadius:12,
                background:COLORS.softer, color:COLORS.mute, fontFamily:SANS, fontSize:13, cursor:'pointer' }}>취소</button>
          </form>
        ) : (
          <button onClick={() => setNewCatInput(true)} style={{
            width:'100%', padding:'12px 16px', border:`1.5px dashed ${COLORS.line}`, borderRadius:14,
            background:'transparent', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            color:COLORS.mute, fontFamily:SANS, fontSize:13 }}>
            <Icon name="plus" size={14} color={COLORS.mute} stroke={2}/> 카테고리 추가
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Prep (editable lists with categories) ────────────────────
function normalizePrepCats(raw) {
  if (raw?.cats) return raw;
  const result = [];
  if (raw?.checklist?.length) result.push({ id:'cat_checklist', name:'체크리스트', items: raw.checklist });
  if (raw?.docs?.length)      result.push({ id:'cat_docs',      name:'입국 서류',   items: raw.docs });
  if (raw?.pack?.length)      result.push({ id:'cat_pack',      name:'챙길 물건',   items: raw.pack });
  if (!result.length)         result.push({ id:'cat_1', name:'체크리스트', items:[] });
  return { cats: result };
}

function PrepCatItems({ ci, cat, cats, save, editing, editingItem, setEditingItem, getItemDragProps, prepDrag, emptyDropRef }) {
  const deleteItem = (ii) => {
    const next = cats.map((c, i) => i !== ci ? c : { ...c, items: c.items.filter((_, j) => j !== ii) });
    save(next);
  };
  const updateItem = (ii, val) => {
    const next = cats.map((c, i) => i !== ci ? c : { ...c, items: c.items.map((x, j) => j === ii ? val : x) });
    save(next);
  };
  const storageKey = 'prep_done_' + cat.id;
  const [checked, setChecked] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(storageKey) || '[]')); }
    catch(e) { return new Set(); }
  });
  const toggle = (ii) => setChecked(s => {
    const n = new Set(s);
    n.has(ii) ? n.delete(ii) : n.add(ii);
    localStorage.setItem(storageKey, JSON.stringify([...n]));
    return n;
  });
  return (
    <>
      {(cat.items || []).map((item, ii) => {
        const isEditingThis = editingItem?.ci === ci && editingItem?.ii === ii;
        const dp = getItemDragProps(ii);
        const isDone = checked.has(ii);
        return (
          <div key={ii} ref={dp.ref} onTouchStart={dp.onTouchStart} onTouchMove={dp.onTouchMove} onTouchEnd={dp.onTouchEnd}
            style={{ position:'relative', marginBottom:6, ...(dp.style||{}) }}>
            <SwipeableRow
              cardSwipe
              onEdit={() => setEditingItem({ ci, ii })}
              onDelete={() => deleteItem(ii)}
              isDragging={!!prepDrag}
              wrapStyle={{ borderRadius:14 }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
                background:COLORS.card, borderRadius:14 }}>
                <button onClick={() => toggle(ii)} style={{
                  width:18, height:18, borderRadius:9, border:'none', padding:0, cursor:'pointer', flexShrink:0,
                  background: isDone ? COLORS.accent : 'transparent',
                  boxShadow: isDone ? 'none' : `inset 0 0 0 1.5px ${COLORS.line}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {isDone && <Icon name="check" size={11} color="#fff" stroke={3}/>}
                </button>
                {(editing || isEditingThis) ? (
                  <input autoFocus={isEditingThis} value={item}
                    onChange={e => updateItem(ii, e.target.value)}
                    onBlur={() => { if (isEditingThis) setEditingItem(null); }}
                    onKeyDown={e => { if (e.key==='Enter' || e.key==='Escape') setEditingItem(null); }}
                    style={{ flex:1, border:'none', outline:'none', background:'transparent',
                      fontFamily:SANS, fontSize:13.5, color:COLORS.ink, padding:0 }}/>
                ) : (
                  <span style={{ flex:1, fontFamily:SANS, fontSize:13.5, color:COLORS.ink,
                    textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.5 : 1 }}>{item}</span>
                )}
                {editing && !isEditingThis && (
                  <button onClick={() => deleteItem(ii)} style={{
                    width:22, height:22, borderRadius:11, border:'none',
                    background:'rgba(193,79,46,0.12)', cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon name="trash" size={11} color={COLORS.accent} stroke={2}/>
                  </button>
                )}
              </div>
            </SwipeableRow>
            {dp['data-drag-over'] && (
              <div style={{ position:'absolute', inset:0, border:`2px dashed rgba(193,79,46,0.45)`,
                borderRadius:14, pointerEvents:'none', background:'rgba(193,79,46,0.04)' }}/>
            )}
          </div>
        );
      })}
    </>
  );
}

function PrepScreen({ trip, prep: prepProp, onEditPrep, editing, setEditing }) {
  const rawPrep = prepProp || trip.prep || {};
  const prep    = normalizePrepCats(rawPrep);
  const cats    = prep.cats || [];

  const [renamingCat,  setRenamingCat]  = React.useState(null);
  const [addInputCat,  setAddInputCat]  = React.useState(null);
  const [addInputText, setAddInputText] = React.useState('');
  const [editingItem,  setEditingItem]  = React.useState(null); // { ci, ii }

  const save = (newCats) => onEditPrep({ ...prep, cats: newCats });

  // ── Cross-category drag ───────────────────────────────────────
  const [prepDrag, setPrepDrag] = React.useState(null);
  // prepDrag = { fromCi, fromIi, toCi, toIi, fingerY, startY, itemH } | null
  const prepDragRef = React.useRef(null);
  const prepTimer = React.useRef(null);
  const prepItemEls = React.useRef({});
  const prepItemRects = React.useRef({}); // 드래그 시작 시 스냅샷

  React.useEffect(() => { prepDragRef.current = prepDrag; }, [prepDrag]);

  // Block page scroll while dragging
  React.useEffect(() => {
    if (!prepDrag) return;
    const stop = e => e.preventDefault();
    document.addEventListener('touchmove', stop, { passive: false });
    return () => document.removeEventListener('touchmove', stop);
  }, [!!prepDrag]);

  const findPrepTarget = (y) => {
    // 드래그 시작 시 저장한 스냅샷 사용 (시각적 이동 무시)
    const rects = prepItemRects.current;
    for (let ci = 0; ci < cats.length; ci++) {
      const items = cats[ci].items || [];
      for (let ii = 0; ii < items.length; ii++) {
        const rect = rects[`${ci}_${ii}`]; if (!rect) continue;
        if (y >= rect.top && y < rect.bottom) {
          return { ci, ii: y < rect.top + rect.height / 2 ? ii : ii + 1 };
        }
      }
      // 카테고리 마지막 항목 아래 빈 공간
      if (items.length > 0) {
        const lastRect = rects[`${ci}_${items.length - 1}`];
        if (lastRect) {
          const nextFirstRect = rects[`${ci + 1}_0`];
          const nextTop = nextFirstRect ? nextFirstRect.top : Infinity;
          if (y > lastRect.bottom && y < nextTop) return { ci, ii: items.length };
        }
      }
      // 빈 카테고리
      if (items.length === 0) {
        const rect = rects[`${ci}_empty`]; if (!rect) continue;
        if (y >= rect.top && y <= rect.bottom) return { ci, ii: 0 };
      }
    }
    return null;
  };

  const makePrepItemProps = (ci, ii) => ({
    ref: el => { prepItemEls.current[`${ci}_${ii}`] = el; },
    style: (() => {
      if (!prepDrag) return {};
      const { fromCi, fromIi, toCi, toIi, fingerY, startY, itemH } = prepDrag;
      if (ci === fromCi && ii === fromIi) {
        return {
          transform: `translateY(${fingerY - startY}px) scale(1.035)`,
          zIndex: 50, opacity: 0.88, position: 'relative',
          boxShadow: '0 16px 40px rgba(0,0,0,0.24)', transition: 'none',
        };
      }
      let shift = 0;
      if (fromCi === toCi && fromCi === ci) {
        if (fromIi < toIi && ii > fromIi && ii <= toIi) shift = -itemH;
        else if (fromIi > toIi && ii >= toIi && ii < fromIi) shift = itemH;
      } else {
        if (ci === fromCi && ii > fromIi) shift = -itemH;
        if (ci === toCi && ii >= toIi) shift = itemH;
      }
      return { transform: `translateY(${shift}px)`, transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1)', position: 'relative' };
    })(),
    onTouchStart: e => {
      if (prepDragRef.current) return;
      const startY = e.touches[0].clientY;
      prepTimer.current = setTimeout(() => {
        const el = prepItemEls.current[`${ci}_${ii}`];
        const itemH = el ? el.getBoundingClientRect().height : 48;
        // 모든 항목 위치 스냅샷 저장
        const rects = {};
        Object.keys(prepItemEls.current).forEach(key => {
          const el = prepItemEls.current[key];
          if (el) rects[key] = el.getBoundingClientRect();
        });
        prepItemRects.current = rects;
        if (window.navigator?.vibrate) window.navigator.vibrate(14);
        setPrepDrag({ fromCi: ci, fromIi: ii, toCi: ci, toIi: ii, fingerY: startY, startY, itemH });
      }, 430);
    },
    onTouchMove: e => {
      clearTimeout(prepTimer.current);
      const d = prepDragRef.current; if (!d) return;
      const y = e.touches[0].clientY;
      const target = findPrepTarget(y);
      setPrepDrag(prev => prev ? {
        ...prev, fingerY: y,
        toCi: target ? target.ci : prev.toCi,
        toIi: target ? target.ii : prev.toIi,
      } : null);
    },
    onTouchEnd: () => {
      clearTimeout(prepTimer.current);
      const d = prepDragRef.current;
      if (d) {
        const { fromCi, fromIi, toCi, toIi } = d;
        if (fromCi !== toCi || fromIi !== toIi) {
          const newCats = cats.map(c => ({ ...c, items: [...(c.items || [])] }));
          const [item] = newCats[fromCi].items.splice(fromIi, 1);
          let adjIi = (fromCi === toCi && fromIi < toIi) ? Math.max(0, toIi - 1) : toIi;
          newCats[toCi].items.splice(Math.min(adjIi, newCats[toCi].items.length), 0, item);
          save(newCats);
        }
        setPrepDrag(null);
      }
    },
    'data-drag-over': !!(prepDrag && prepDrag.toCi === ci && prepDrag.toIi === ii && !(prepDrag.fromCi === ci && prepDrag.fromIi === ii)),
  });

  // This is passed to PrepCatItems as getItemDragProps
  const getItemDragProps = (ci) => (ii) => makePrepItemProps(ci, ii);

  const addCat = () => {
    const id = 'cat_' + Date.now();
    const newCats = [...cats, { id, name:'새 카테고리', items:[] }];
    save(newCats);
    setTimeout(() => setRenamingCat(newCats.length - 1), 50);
  };
  const deleteCat = (i) => {
    if (!confirm(`"${cats[i].name}" 카테고리를 삭제할까요?`)) return;
    const next = cats.filter((_, j) => j !== i);
    if (!next.length) next.push({ id:'cat_1', name:'체크리스트', items:[] });
    save(next);
  };
  const renameCat = (i, name) => { const next=[...cats]; next[i]={...next[i],name}; save(next); };
  const addItem = (ci) => {
    if (!addInputText.trim()) return;
    const next=[...cats];
    next[ci]={...next[ci],items:[...(next[ci].items||[]),addInputText.trim()]};
    save(next); setAddInputText(''); setAddInputCat(null);
  };
  const updateItem = (ci, ii, val) => {
    const next=[...cats]; const items=[...next[ci].items]; items[ii]=val;
    next[ci]={...next[ci],items}; save(next);
  };
  const deleteItem = (ci, ii) => {
    const next=[...cats];
    next[ci]={...next[ci],items:next[ci].items.filter((_,j)=>j!==ii)};
    save(next);
  };

  // D-day
  const tripYear = extractTripYear(trip);
  const firstDate = trip.days[0]?.date || '';
  const lastDate  = trip.days[trip.days.length - 1]?.date || '';
  const parseDate = (s) => {
    if (!s) return null;
    const iso = dayDateToIso(s, tripYear);
    return iso ? new Date(iso + 'T12:00:00') : null;
  };
  const depDate = parseDate(firstDate);
  const retDate = parseDate(lastDate);
  const today   = new Date(); today.setHours(0,0,0,0);
  let ddayLabel = '', ddayColor = COLORS.ink;
  if (depDate) {
    depDate.setHours(0,0,0,0);
    if (retDate) retDate.setHours(0,0,0,0);
    const diff = Math.round((depDate - today) / 86400000);
    if (diff > 0)                          { ddayLabel = `D-${diff}`;          ddayColor = COLORS.accent; }
    else if (retDate && today <= retDate)  { ddayLabel = '여행 중 ✈️';         ddayColor = '#2E7D32'; }
    else                                   { ddayLabel = `D+${Math.abs(diff)}`; ddayColor = COLORS.mute; }
  }

  return (
    <div style={{ background:COLORS.bg, minHeight:'100vh', paddingBottom:110 }}>
      {/* 헤더 */}
      <div style={{ paddingTop:'calc(16px + env(safe-area-inset-top, 0px))', paddingLeft:24, paddingRight:24, paddingBottom:16 }}>
        <div style={{ fontFamily:MONO, fontSize:11, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase' }}>Preparation</div>
        <div style={{ marginTop:4, fontFamily:SERIF, fontSize:38, color:COLORS.ink, letterSpacing:'-0.02em' }}>Pack & Go.</div>
      </div>

      {/* D-day 카드 */}
      {depDate && (
        <div style={{ padding:'0 16px', marginBottom:20 }}>
          <div style={{ background:COLORS.card, borderRadius:16, padding:'14px 18px',
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>여행 기간</div>
              <div style={{ fontFamily:SANS, fontSize:13.5, color:COLORS.ink, fontWeight:500 }}>
                {firstDate}{lastDate && lastDate !== firstDate ? ` – ${lastDate}` : ''}
              </div>
              <div style={{ fontFamily:MONO, fontSize:11, color:COLORS.mute, marginTop:3 }}>{trip.days.length}일</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>D-DAY</div>
              <div style={{ fontFamily:SERIF, fontSize:32, color:ddayColor, letterSpacing:'-0.02em', lineHeight:1 }}>{ddayLabel}</div>
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 목록 — 전부 표시 */}
      {cats.map((cat, ci) => (
        <div key={cat.id} style={{ padding:'0 16px', marginBottom:20 }}>
          {/* 카테고리 헤더 */}
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8, paddingLeft:2 }}>
            {editing && renamingCat === ci ? (
              <input autoFocus value={cat.name}
                onChange={e => renameCat(ci, e.target.value)}
                onBlur={() => setRenamingCat(null)}
                onKeyDown={e => e.key === 'Enter' && setRenamingCat(null)}
                style={{ flex:1, border:`1px solid ${COLORS.line}`, borderRadius:8,
                  padding:'4px 8px', fontFamily:MONO, fontSize:10.5, letterSpacing:'0.12em',
                  textTransform:'uppercase', background:COLORS.card, color:COLORS.ink, outline:'none' }}/>
            ) : (
              <span style={{ flex:1, fontFamily:MONO, fontSize:10.5, letterSpacing:'0.12em',
                textTransform:'uppercase', color:COLORS.mute }}>
                {cat.name}
              </span>
            )}
            {editing && renamingCat !== ci && (
              <button onClick={() => setRenamingCat(ci)} style={{
                width:22, height:22, borderRadius:11, border:'none', background:'transparent',
                cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon name="edit" size={12} color={COLORS.mute} stroke={2}/>
              </button>
            )}
            {editing && (
              <button onClick={() => deleteCat(ci)} style={{
                width:22, height:22, borderRadius:11, border:'none', background:'rgba(193,79,46,0.10)',
                cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon name="trash" size={12} color={COLORS.accent} stroke={2}/>
              </button>
            )}
          </div>

          {/* 아이템 목록 */}
          <div style={{ background:COLORS.card, borderRadius:14 }}>
            {(cat.items || []).length === 0 && addInputCat !== ci && (
              <div ref={el => { prepItemEls.current[`${ci}_empty`] = el; }}
                style={{ padding:'14px 16px', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>
                항목이 없어요
              </div>
            )}
            <PrepCatItems ci={ci} cat={cat} cats={cats} save={save} editing={editing}
              editingItem={editingItem} setEditingItem={setEditingItem}
              getItemDragProps={getItemDragProps(ci)}
              prepDrag={prepDrag}
              emptyDropRef={el => { prepItemEls.current[`${ci}_empty`] = el; }}/>
            {/* 항목 추가 */}
            {addInputCat === ci ? (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px',
                borderTop: cat.items?.length ? `1px solid ${COLORS.line}` : 'none' }}>
                <div style={{ width:16, height:16, borderRadius:8, border:`1.5px solid ${COLORS.line}`, flexShrink:0 }}/>
                <input autoFocus value={addInputText} onChange={e => setAddInputText(e.target.value)}
                  placeholder="항목 입력..."
                  onKeyDown={e => { if (e.key==='Enter') addItem(ci); if (e.key==='Escape') { setAddInputCat(null); setAddInputText(''); }}}
                  style={{ flex:1, border:'none', outline:'none', background:'transparent',
                    fontFamily:SANS, fontSize:13.5, color:COLORS.ink, padding:0 }}/>
                <button onClick={() => addItem(ci)} style={{
                  padding:'4px 10px', border:'none', borderRadius:8,
                  background:COLORS.accent, color:'#fff', fontFamily:SANS, fontSize:12, cursor:'pointer' }}>추가</button>
              </div>
            ) : (
              <button onClick={() => { setAddInputCat(ci); setAddInputText(''); }} style={{
                width:'100%', padding:'10px 14px', background:'transparent', border:'none',
                borderTop: cat.items?.length ? `1px solid ${COLORS.line}` : 'none',
                display:'flex', alignItems:'center', gap:8, cursor:'pointer',
                color:COLORS.mute, fontFamily:SANS, fontSize:13 }}>
                <Icon name="plus" size={13} color={COLORS.mute} stroke={2}/> 항목 추가
              </button>
            )}
          </div>
        </div>
      ))}

      {/* 카테고리 추가 */}
      <div style={{ padding:'0 16px 20px' }}>
        <button onClick={addCat} style={{
          width:'100%', padding:'12px 16px', border:`1.5px dashed ${COLORS.line}`, borderRadius:14,
          background:'transparent', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          color:COLORS.mute, fontFamily:SANS, fontSize:13 }}>
          <Icon name="plus" size={14} color={COLORS.mute} stroke={2}/> 카테고리 추가
        </button>
      </div>
    </div>
  );
}

// ─── Budget Screen ─────────────────────────────────────────
const BUDGET_OUT_CATS_DEFAULT = ['교통','숙박','식비','쇼핑','관광','기타'];
const BUDGET_IN_CATS_DEFAULT  = ['환전','지원금','기타'];

// 원화 환산 환율 (대략적 기준)
const KRW_RATES = {
  KRW:1, USD:1350, EUR:1480, JPY:9.2, CNY:188, HKD:173, TWD:43, SGD:1010,
  THB:38, VND:0.055, PHP:23, IDR:0.088, MYR:308, INR:16, AUD:890, NZD:820,
  GBP:1720, CHF:1530, SEK:128, NOK:122, DKK:198, CAD:1000, MXN:73,
  BRL:272, AED:368, SAR:360, TRY:42, CZK:62, HUF:3.7, PLN:345,
};
const CURRENCY_SYMBOL = {
  KRW:'₩', USD:'$', EUR:'€', JPY:'¥', CNY:'¥', HKD:'HK$', TWD:'NT$',
  SGD:'S$', THB:'฿', VND:'₫', PHP:'₱', IDR:'Rp', MYR:'RM', INR:'₹',
  AUD:'A$', NZD:'NZ$', GBP:'£', CHF:'Fr', SEK:'kr', NOK:'kr', DKK:'kr',
  CAD:'C$', MXN:'$', BRL:'R$', AED:'AED', SAR:'SAR', TRY:'₺',
  CZK:'Kč', HUF:'Ft', PLN:'zł',
};
const toKrw = (amt, cur) => amt * (KRW_RATES[cur] || 1);
const fmtAmt = (n, cur) => {
  const sym = CURRENCY_SYMBOL[cur] || cur;
  return sym + n.toLocaleString('ko-KR', { maximumFractionDigits: cur==='KRW'?0:2 });
};

function BudgetCalcSheet({ open, onClose, onEnter, onTabBarToggle }) {
  const [display, setDisplay] = React.useState('0');
  const [prevVal, setPrevVal] = React.useState(null);
  const [op, setOp]           = React.useState(null);
  const [waitNew, setWaitNew] = React.useState(false);
  const [entered, setEntered] = React.useState(false);
  const [sheetY,  setSheetY]  = React.useState(0);
  const [sheetUp, setSheetUp] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const sheetYRef  = React.useRef(0);
  const sheetUpRef = React.useRef(0);
  const expandedRef = React.useRef(false);
  const sheetRef  = React.useRef(null);
  const dragRef   = React.useRef({ active: false, startY: 0 });

  React.useEffect(() => {
    if (!open) { setEntered(false); setSheetY(0); sheetYRef.current = 0; setSheetUp(0); sheetUpRef.current = 0; setExpanded(false); expandedRef.current = false; setClosing(false); return; }
    setDisplay('0'); setPrevVal(null); setOp(null); setWaitNew(false);
    setSheetY(0); sheetYRef.current = 0;
    setSheetUp(0); sheetUpRef.current = 0;
    setExpanded(false); expandedRef.current = false;
    setClosing(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, [open]);

  React.useEffect(() => {
    const el = sheetRef.current;
    if (!el || !entered) return;
    const onStart = e => { dragRef.current = { active: true, startY: e.touches[0].clientY }; };
    const onMove = e => {
      if (!dragRef.current.active) return;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      e.preventDefault();
      if (expandedRef.current) {
        if (dy > 0) { sheetYRef.current = dy; setSheetY(dy); }
      } else {
        if (dy < 0) {
          const up = Math.min(Math.abs(dy), window.innerHeight * 0.2);
          sheetUpRef.current = up; setSheetUp(up);
        } else {
          sheetUpRef.current = 0; setSheetUp(0);
          sheetYRef.current = dy; setSheetY(dy);
        }
      }
    };
    const onEnd = e => {
      dragRef.current.active = false;
      const dy = Math.abs((e.changedTouches[0]?.clientY ?? 0) - dragRef.current.startY);
      if (dy < 8) { onTabBarToggle?.(); sheetYRef.current=0; setSheetY(0); sheetUpRef.current=0; setSheetUp(0); return; }
      const curUp = sheetUpRef.current;
      const cur = sheetYRef.current;
      if (curUp > 60) {
        expandedRef.current = true; setExpanded(true);
        sheetUpRef.current = 0; setSheetUp(0);
      } else if (cur > 100) {
        if (expandedRef.current) { expandedRef.current = false; setExpanded(false); sheetYRef.current=0; setSheetY(0); }
        else { setClosing(true); setTimeout(() => onClose(), 340); }
      } else { sheetUpRef.current=0; setSheetUp(0); sheetYRef.current=0; setSheetY(0); }
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove',  onMove,  { passive: false });
    el.addEventListener('touchend',   onEnd,   { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove',  onMove);
      el.removeEventListener('touchend',   onEnd);
    };
  }, [entered]);

  if (!open) return null;

  const compute = (a, b, o) => {
    if (o==='+') return a+b; if (o==='−') return a-b;
    if (o==='×') return a*b; if (o==='÷') return b!==0 ? a/b : 0;
    return b;
  };
  const pressDigit = (d) => {
    if (waitNew) { setDisplay(d==='.' ? '0.' : d); setWaitNew(false); return; }
    if (d==='.' && display.includes('.')) return;
    setDisplay(display==='0' && d!=='.' ? d : display+d);
  };
  const pressOp = (newOp) => {
    const cur = parseFloat(display)||0;
    if (prevVal!==null && !waitNew) {
      const r = compute(prevVal, cur, op);
      setDisplay(String(Math.round(r*100)/100)); setPrevVal(r);
    } else { setPrevVal(cur); }
    setOp(newOp); setWaitNew(true);
  };
  const pressEqual = () => {
    const cur = parseFloat(display)||0;
    if (prevVal!==null && op) {
      const r = compute(prevVal, cur, op);
      setDisplay(String(Math.round(r*100)/100));
    }
    setPrevVal(null); setOp(null); setWaitNew(true);
  };
  const pressClear = () => { setDisplay('0'); setPrevVal(null); setOp(null); setWaitNew(false); };
  const pressBack  = () => {
    if (waitNew || display.length<=1) { setDisplay('0'); setWaitNew(false); }
    else setDisplay(display.slice(0,-1)||'0');
  };

  const displayNum = parseFloat(display)||0;
  const fmtDisp = display.includes('.')
    ? display
    : Number(display).toLocaleString('ko-KR');

  const KS = (bg, color, extra={}) => ({
    flex:1, padding:'17px 0', border:'none', borderRadius:14, cursor:'pointer',
    fontFamily:MONO, fontSize:20, fontWeight:600, background:bg, color,
    display:'flex', alignItems:'center', justifyContent:'center', ...extra,
  });
  const isOp = (o) => op===o;

  return ReactDOM.createPortal(
    <div style={{ position:'fixed', inset:0, zIndex:309,
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
      background:`rgba(0,0,0,${Math.max(0, (entered?0.35:0) - sheetY/400)})`,
    }} onClick={onClose}>
      <div style={{
        transform:`translateY(${closing ? window.innerHeight : (entered ? sheetY : window.innerHeight)}px)`,
        transition: (closing || (!sheetY && entered)) ? 'transform 0.34s cubic-bezier(0.32,0.72,0,1)' : 'none',
      }}>
      <div ref={sheetRef} onClick={e=>e.stopPropagation()} style={{
        background:COLORS.bg, borderRadius:'22px 22px 0 0',
        paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 60px)',
        maxHeight: expanded ? 'calc(100dvh - var(--sat,44px) - 8px)' : `calc(92dvh + ${sheetUp}px)`,
        overflowY:'hidden', overflowX:'hidden',
        transition: sheetUp > 0 ? 'none' : 'max-height 0.36s cubic-bezier(0.32,0.72,0,1)',
        boxShadow:'0 -4px 24px rgba(0,0,0,0.12)',

      }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 4px' }}>
          <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
        </div>
        {/* 디스플레이 */}
        <div style={{ padding:'8px 20px 14px', textAlign:'right', minHeight:64 }}>
          {op && <span style={{ fontFamily:MONO, fontSize:16, color:COLORS.mute, marginRight:8 }}>{op}</span>}
          <span style={{ fontFamily:SERIF, fontSize:44, color:COLORS.ink, letterSpacing:'-0.02em' }}>{fmtDisp}</span>
        </div>
        {/* 키패드 */}
        <div style={{ padding:'0 14px', display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={pressClear} style={KS(COLORS.softer, COLORS.mute)}>C</button>
            <button onClick={pressBack}  style={KS(COLORS.softer, COLORS.mute)}>⌫</button>
            <button onClick={() => { setDisplay(String(Math.round((parseFloat(display)||0)/100*100)/100)); setWaitNew(true); }}
              style={KS(COLORS.softer, COLORS.mute)}>%</button>
            <button onClick={() => pressOp('÷')}
              style={KS(isOp('÷') ? COLORS.accent : 'rgba(193,79,46,0.12)', isOp('÷') ? '#fff' : COLORS.accent)}>÷</button>
          </div>
          {[['7','8','9','×'],['4','5','6','−'],['1','2','3','+']].map(row => (
            <div key={row[0]} style={{ display:'flex', gap:8 }}>
              {row.slice(0,3).map(d => (
                <button key={d} onClick={() => pressDigit(d)} style={KS(COLORS.card, COLORS.ink)}>{d}</button>
              ))}
              <button onClick={() => pressOp(row[3])}
                style={KS(isOp(row[3]) ? COLORS.accent : 'rgba(193,79,46,0.12)', isOp(row[3]) ? '#fff' : COLORS.accent)}>{row[3]}</button>
            </div>
          ))}
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => pressDigit('0')} style={KS(COLORS.card, COLORS.ink, { flex:2 })}>0</button>
            <button onClick={() => pressDigit('.')} style={KS(COLORS.card, COLORS.ink)}>.</button>
            <button onClick={pressEqual} style={KS(COLORS.accent, '#fff')}>=</button>
          </div>
        </div>
        {/* 입력 버튼 */}
        <div style={{ padding:'12px 14px 16px', display:'flex', gap:8 }}>
          <button onClick={() => { onEnter('in', displayNum); onClose(); }} style={{
            flex:1, padding:'14px 0', border:`1px solid ${COLORS.line}`, borderRadius:14,
            background:COLORS.card, fontFamily:SANS, fontSize:13, fontWeight:600, color:COLORS.ink, cursor:'pointer',
          }}>수입으로 입력</button>
          <button onClick={() => { onEnter('out', displayNum); onClose(); }} style={{
            flex:1, padding:'14px 0', border:'none', borderRadius:14,
            background:COLORS.accent, fontFamily:SANS, fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer',
          }}>지출로 입력</button>
        </div>
      </div>
      </div>
    </div>,
    document.body
  );
}

function SplitSheet({ open, onClose, totalKrw, defaultN, onEnter, onTabBarToggle }) {
  const [n, setN]         = React.useState(String(defaultN));
  const [entered, setEntered] = React.useState(false);
  const [sheetY, setSheetY]   = React.useState(0);
  const [sheetUp, setSheetUp] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [closing, setClosing]   = React.useState(false);
  const sheetYRef   = React.useRef(0);
  const sheetUpRef  = React.useRef(0);
  const expandedRef = React.useRef(false);
  const sheetRef    = React.useRef(null);
  const dragRef     = React.useRef({ active: false, startY: 0 });

  React.useEffect(() => {
    if (!open) { setEntered(false); setSheetY(0); sheetYRef.current=0; setSheetUp(0); sheetUpRef.current=0; setExpanded(false); expandedRef.current=false; setClosing(false); return; }
    setN(String(defaultN));
    setSheetY(0); sheetYRef.current=0; setSheetUp(0); sheetUpRef.current=0;
    setExpanded(false); expandedRef.current=false; setClosing(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, [open, defaultN]);

  React.useEffect(() => {
    const el = sheetRef.current;
    if (!el || !entered) return;
    const onStart = e => { dragRef.current = { active: true, startY: e.touches[0].clientY }; };
    const onMove = e => {
      if (!dragRef.current.active) return;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      e.preventDefault();
      if (expandedRef.current) {
        if (dy > 0) { sheetYRef.current = dy; setSheetY(dy); }
      } else {
        if (dy < 0) { const up = Math.min(Math.abs(dy), window.innerHeight*0.2); sheetUpRef.current=up; setSheetUp(up); }
        else { sheetUpRef.current=0; setSheetUp(0); sheetYRef.current=dy; setSheetY(dy); }
      }
    };
    const onEnd = e => {
      dragRef.current.active = false;
      const dy = Math.abs((e.changedTouches[0]?.clientY ?? 0) - dragRef.current.startY);
      if (dy < 8) { onTabBarToggle?.(); sheetYRef.current=0; setSheetY(0); sheetUpRef.current=0; setSheetUp(0); return; }
      const curUp = sheetUpRef.current; const cur = sheetYRef.current;
      if (curUp > 60) { expandedRef.current=true; setExpanded(true); sheetUpRef.current=0; setSheetUp(0); }
      else if (cur > 100) {
        if (expandedRef.current) { expandedRef.current=false; setExpanded(false); sheetYRef.current=0; setSheetY(0); }
        else { setClosing(true); setTimeout(() => onClose(), 340); }
      } else { sheetUpRef.current=0; setSheetUp(0); sheetYRef.current=0; setSheetY(0); }
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove',  onMove,  { passive: false });
    el.addEventListener('touchend',   onEnd,   { passive: true });
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchmove', onMove); el.removeEventListener('touchend', onEnd); };
  }, [entered]);

  if (!open) return null;

  const count = Math.max(1, parseInt(n)||1);
  const perPerson = Math.round(totalKrw / count);

  return ReactDOM.createPortal(
    <div style={{ position:'fixed', inset:0, zIndex:310,
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
      background:`rgba(0,0,0,${Math.max(0,(entered?0.4:0)-sheetY/400)})` }} onClick={onClose}>
      <div style={{
        transform:`translateY(${closing ? window.innerHeight : (entered ? sheetY : window.innerHeight)}px)`,
        transition: (closing || (!sheetY && entered)) ? 'transform 0.34s cubic-bezier(0.32,0.72,0,1)' : 'none',
      }}>
      <div ref={sheetRef} onClick={e=>e.stopPropagation()} style={{
        background:COLORS.bg, borderRadius:'22px 22px 0 0', padding:'0 16px',
        paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 60px)',
        maxHeight: expanded ? 'calc(100dvh - var(--sat,44px) - 8px)' : `calc(80dvh + ${sheetUp}px)`,
        overflowY:'hidden', overflowX:'hidden',
        transition: sheetUp > 0 ? 'none' : 'max-height 0.36s cubic-bezier(0.32,0.72,0,1)',
      }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 6px' }}>
          <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
        </div>
        <div style={{ fontFamily:SERIF, fontSize:20, color:COLORS.ink, padding:'6px 4px 14px' }}>1/N 분할</div>
        <div style={{ background:COLORS.card, borderRadius:14, padding:'14px 16px', marginBottom:12 }}>
          <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>공동 지출 총액 (₩ 환산)</div>
          <div style={{ fontFamily:SERIF, fontSize:26, color:COLORS.ink }}>{fmtAmt(totalKrw, 'KRW')}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <div style={{ flex:1, background:COLORS.card, borderRadius:14, padding:'14px 16px' }}>
            <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8 }}>인원 수</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12 }}>
              <button onClick={() => setN(String(Math.max(1,count-1)))} style={{
                width:30, height:30, borderRadius:15, border:`1px solid ${COLORS.line}`,
                background:'transparent', cursor:'pointer', fontFamily:SANS, fontSize:18, color:COLORS.ink,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>−</button>
              <input value={n} onChange={e => setN(e.target.value.replace(/[^0-9]/g,''))}
                style={{ width:36, textAlign:'center', border:'none', outline:'none',
                  fontFamily:MONO, fontSize:22, fontWeight:700, color:COLORS.ink, background:'transparent' }}/>
              <button onClick={() => setN(String(count+1))} style={{
                width:30, height:30, borderRadius:15, border:`1px solid ${COLORS.line}`,
                background:'transparent', cursor:'pointer', fontFamily:SANS, fontSize:18, color:COLORS.ink,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>+</button>
            </div>
          </div>
          <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.mute }}>=</div>
          <div style={{ flex:1.3, background:COLORS.ink, borderRadius:14, padding:'14px 16px' }}>
            <div style={{ fontFamily:MONO, fontSize:9.5, color:'rgba(255,255,255,0.5)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>1인당</div>
            <div style={{ fontFamily:SERIF, fontSize:22, color:'#fff', letterSpacing:'-0.01em' }}>{fmtAmt(perPerson, 'KRW')}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => { onEnter('in', perPerson); onClose(); }} style={{
            flex:1, padding:'14px 0', border:`1px solid ${COLORS.line}`, borderRadius:14,
            background:COLORS.card, fontFamily:SANS, fontSize:13, fontWeight:600, color:COLORS.ink, cursor:'pointer',
          }}>수입으로 입력</button>
          <button onClick={() => { onEnter('out', perPerson); onClose(); }} style={{
            flex:1, padding:'14px 0', border:'none', borderRadius:14,
            background:COLORS.accent, fontFamily:SANS, fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer',
          }}>지출로 입력</button>
        </div>
      </div>
      </div>
    </div>,
    document.body
  );
}

function BudgetScreen({ trip, onEditBudget, onSheetChange, onTabBarToggle }) {
  const budget  = trip.budget || {};
  const entries = budget.entries || [];
  const outCats = budget.outCats || BUDGET_OUT_CATS_DEFAULT;
  const inCats  = budget.inCats  || BUDGET_IN_CATS_DEFAULT;

  const [addOpen,    setAddOpen]    = React.useState(false);
  const [editIdx,    setEditIdx]    = React.useState(null);
  const [delConfirm, setDelConfirm] = React.useState(false);
  const [form, setForm] = React.useState({ type:'out', amount:'', cat:'식비', note:'', date:'' });
  const [addingCat,  setAddingCat]  = React.useState(false);
  const [newCatVal,  setNewCatVal]  = React.useState('');
  const [calcOpen,      setCalcOpen]      = React.useState(false);
  const [splitOpen,     setSplitOpen]     = React.useState(false);
  const [sheetEntered,  setSheetEntered]  = React.useState(false);
  const [datePickOpen,  setDatePickOpen]  = React.useState(false);

  const closeSheet = () => {
    setAddOpen(false); setEditIdx(null); setDelConfirm(false);
    if (!calcOpen && !splitOpen) onSheetChange?.(false);
  };

  const reorderEntries = (from, to) => {
    const newEntries = [...entries];
    newEntries.splice(to, 0, newEntries.splice(from, 1)[0]);
    onEditBudget({ entries: newEntries });
  };
  const { itemProps: entryDragProps, isTouchDragging: isEntryDragging } = useDragReorder(reorderEntries, false);

  const sheetOpen = addOpen || editIdx !== null;
  React.useEffect(() => {
    if (sheetOpen) {
      requestAnimationFrame(() => requestAnimationFrame(() => setSheetEntered(true)));
    } else {
      setSheetEntered(false);
    }
  }, [sheetOpen]);

  // onSheetChange는 각 open/close 함수에서 직접 동기 호출 (탭바 딜레이 방지)

  // KRW 환산 합계 (총 금액 표시용)
  const krwTotalOut = entries.filter(e=>e.type==='out').reduce((s,e)=>s+toKrw(e.amount,e.currency||'KRW'),0);
  const krwTotalIn  = entries.filter(e=>e.type==='in' ).reduce((s,e)=>s+toKrw(e.amount,e.currency||'KRW'),0);

  // 통화별 수입/지출 원액
  const byCurrency = {};
  entries.forEach(e => {
    const cur = e.currency || 'KRW';
    if (!byCurrency[cur]) byCurrency[cur] = { out: 0, inc: 0 };
    if (e.type==='out') byCurrency[cur].out += e.amount;
    else                byCurrency[cur].inc += e.amount;
  });

  // 공동/개인 KRW 합계 (지출/수입 각각)
  const hasShared = entries.some(e => (e.scope||'personal')==='shared');
  const krwSharedOut   = entries.filter(e=>e.type==='out'&&(e.scope||'personal')==='shared').reduce((s,e)=>s+toKrw(e.amount,e.currency||'KRW'),0);
  const krwPersonalOut = entries.filter(e=>e.type==='out'&&(e.scope||'personal')==='personal').reduce((s,e)=>s+toKrw(e.amount,e.currency||'KRW'),0);
  const krwSharedIn    = entries.filter(e=>e.type==='in' &&(e.scope||'personal')==='shared').reduce((s,e)=>s+toKrw(e.amount,e.currency||'KRW'),0);
  const krwPersonalIn  = entries.filter(e=>e.type==='in' &&(e.scope||'personal')==='personal').reduce((s,e)=>s+toKrw(e.amount,e.currency||'KRW'),0);

  const currentCats = form.type === 'out' ? outCats : inCats;

  const openAdd = (type) => {
    const cats = type === 'out' ? outCats : inCats;
    setForm({ type, amount:'', cat: cats[0] || '', note:'', date:'', currency:'KRW', scope:'personal' });
    setEditIdx(null); setDelConfirm(false); setAddingCat(false); setNewCatVal('');
    setAddOpen(true);
    onSheetChange?.(true);
  };
  const openAddWithAmount = (type, amount) => {
    const cats = type === 'out' ? outCats : inCats;
    setForm({ type, amount: String(Math.round(amount)), cat: cats[0] || '', note:'', date:'', currency:'KRW', scope:'personal' });
    setEditIdx(null); setDelConfirm(false); setAddingCat(false); setNewCatVal('');
    setAddOpen(true);
    onSheetChange?.(true);
  };
  const openEdit = (idx) => {
    const e = entries[idx];
    setForm({ type:e.type, amount:String(e.amount), cat:e.cat, note:e.note||'', date:e.date||'', currency:e.currency||'KRW', scope:e.scope||'personal' });
    setEditIdx(idx); setDelConfirm(false); setAddingCat(false); setNewCatVal('');
    setAddOpen(true);
    onSheetChange?.(true);
  };

  const addCustomCat = () => {
    const name = newCatVal.trim();
    if (!name) return;
    const key = form.type === 'out' ? 'outCats' : 'inCats';
    const cur  = form.type === 'out' ? outCats : inCats;
    if (cur.includes(name)) { setForm(f => ({...f, cat: name})); setAddingCat(false); setNewCatVal(''); return; }
    const next = [...cur, name];
    onEditBudget({ [key]: next });
    setForm(f => ({...f, cat: name}));
    setAddingCat(false); setNewCatVal('');
  };
  const saveEntry = () => {
    const amt = parseFloat(form.amount);
    if (!amt || isNaN(amt)) return;
    const cur = form.currency || 'KRW';
    const entry = {
      id: editIdx !== null ? entries[editIdx].id : Date.now().toString(),
      type: form.type, amount: amt, cat: form.cat,
      note: form.note, currency: cur,
      scope: form.scope || 'shared',
      date: form.date || new Date().toISOString().slice(0,10),
    };
    const updated = editIdx !== null
      ? entries.map((e,i) => i===editIdx ? entry : e)
      : [...entries, entry];
    onEditBudget({ entries: updated });
    setAddOpen(false);
  };
  const deleteEntry = () => {
    onEditBudget({ entries: entries.filter((_,i) => i!==editIdx) });
    setAddOpen(false);
  };



  return (
    <div style={{ background:COLORS.bg, minHeight:'100vh', paddingBottom:110 }}>
      {/* 헤더 */}
      <div style={{ paddingTop:'calc(16px + env(safe-area-inset-top, 0px))', paddingLeft:24, paddingRight:24, paddingBottom:12 }}>
        <div style={{ fontFamily:MONO, fontSize:11, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase' }}>Travel Budget</div>
        <div style={{ marginTop:4, fontFamily:SERIF, fontSize:38, color:COLORS.ink, letterSpacing:'-0.02em' }}>Budget.</div>
      </div>

      {/* 요약 카드 */}
      <div style={{ margin:'0 16px 14px', background:COLORS.ink, borderRadius:20, padding:'22px 22px 20px' }}>
        {/* 총 수입(왼쪽) / 총 지출(오른쪽) — 핵심 포인트 색상 */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:10, color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6 }}>총 수입</div>
            <div style={{ fontFamily:SERIF, fontSize:32, color:'#7EC88A', letterSpacing:'-0.02em', lineHeight:1 }}>
              {fmtAmt(Math.round(krwTotalIn), 'KRW')}
            </div>
          </div>
          <div>
            <div style={{ fontFamily:MONO, fontSize:10, color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6 }}>총 지출</div>
            <div style={{ fontFamily:SERIF, fontSize:32, color:'#E07B6A', letterSpacing:'-0.02em', lineHeight:1 }}>
              {fmtAmt(Math.round(krwTotalOut), 'KRW')}
            </div>
          </div>
        </div>

        {/* 통화별 수입/지출 — 흰색 계열만 */}
        {Object.keys(byCurrency).length > 0 && (
          <div style={{ marginTop:16, paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
            {Object.entries(byCurrency).map(([cur, { out, inc }]) => (
              <div key={cur} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, marginBottom:8 }}>
                <div>
                  <div style={{ fontFamily:MONO, fontSize:9.5, color:'rgba(255,255,255,0.3)', letterSpacing:'0.06em', marginBottom:3 }}>{cur} 수입</div>
                  <div style={{ fontFamily:MONO, fontSize:14, color: inc > 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.18)', fontWeight: inc>0?600:400 }}>
                    {inc > 0 ? fmtAmt(inc, cur) : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily:MONO, fontSize:9.5, color:'rgba(255,255,255,0.3)', letterSpacing:'0.06em', marginBottom:3 }}>{cur} 지출</div>
                  <div style={{ fontFamily:MONO, fontSize:14, color: out > 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.18)', fontWeight: out>0?600:400 }}>
                    {out > 0 ? fmtAmt(out, cur) : '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 개인(왼쪽) / 공동(오른쪽) + ➗ 버튼 */}
        {hasShared && (
          <div style={{ marginTop:16, paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.08)',
            display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>
            {/* 개인 */}
            <div>
              <div style={{ fontFamily:MONO, fontSize:10, color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>개인</div>
              {krwPersonalIn > 0 && (
                <div style={{ marginBottom:7 }}>
                  <div style={{ fontFamily:MONO, fontSize:9.5, color:'rgba(255,255,255,0.3)', marginBottom:3 }}>수입</div>
                  <div style={{ fontFamily:MONO, fontSize:14, color:'rgba(255,255,255,0.82)', fontWeight:600 }}>{fmtAmt(Math.round(krwPersonalIn),'KRW')}</div>
                </div>
              )}
              {krwPersonalOut > 0 && (
                <div>
                  <div style={{ fontFamily:MONO, fontSize:9.5, color:'rgba(255,255,255,0.3)', marginBottom:3 }}>지출</div>
                  <div style={{ fontFamily:MONO, fontSize:14, color:'rgba(255,255,255,0.82)', fontWeight:600 }}>{fmtAmt(Math.round(krwPersonalOut),'KRW')}</div>
                </div>
              )}
            </div>
            {/* 공동 + ➗ */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
                <div style={{ fontFamily:MONO, fontSize:10, color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em', textTransform:'uppercase' }}>공동</div>
                {krwSharedOut > 0 && (
                  <button onClick={() => { setSplitOpen(true); onSheetChange?.(true); }} style={{
                    background:'none', border:'none', cursor:'pointer', padding:0,
                    fontSize:15, lineHeight:1, opacity:0.75,
                  }}>➗</button>
                )}
              </div>
              {krwSharedIn > 0 && (
                <div style={{ marginBottom:7 }}>
                  <div style={{ fontFamily:MONO, fontSize:9.5, color:'rgba(255,255,255,0.3)', marginBottom:3 }}>수입</div>
                  <div style={{ fontFamily:MONO, fontSize:14, color:'rgba(255,255,255,0.82)', fontWeight:600 }}>{fmtAmt(Math.round(krwSharedIn),'KRW')}</div>
                </div>
              )}
              {krwSharedOut > 0 && (
                <div>
                  <div style={{ fontFamily:MONO, fontSize:9.5, color:'rgba(255,255,255,0.3)', marginBottom:3 }}>지출</div>
                  <div style={{ fontFamily:MONO, fontSize:14, color:'rgba(255,255,255,0.82)', fontWeight:600 }}>{fmtAmt(Math.round(krwSharedOut),'KRW')}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 추가 버튼 */}
      <div style={{ padding:'0 16px 16px', display:'flex', gap:8 }}>
        <button onClick={() => openAdd('in')} style={{
          flex:1, padding:'12px 0', background:COLORS.card, border:`1px solid ${COLORS.line}`, borderRadius:14,
          fontFamily:SANS, fontSize:14, fontWeight:600, color:COLORS.ink, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:6,
        }}>
          <Icon name="plus" size={14} color={COLORS.ink} stroke={2.5}/> 수입 추가
        </button>
        <button onClick={() => openAdd('out')} style={{
          flex:1, padding:'12px 0', background:COLORS.accent, border:'none', borderRadius:14,
          fontFamily:SANS, fontSize:14, fontWeight:600, color:'#fff', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:6,
        }}>
          <Icon name="minus" size={14} color="#fff" stroke={2.5}/> 지출 추가
        </button>
        <button onClick={() => { setCalcOpen(true); onSheetChange?.(true); }} style={{
          width:46, padding:'12px 0', background:COLORS.card, border:`1px solid ${COLORS.line}`, borderRadius:14,
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <Icon name="calculator" size={16} color={COLORS.ink} stroke={1.8}/>
        </button>
      </div>

      {/* 내역 목록 — 날짜별 그룹 */}
      {entries.length === 0 ? (
        <div style={{ padding:'60px 0', textAlign:'center' }}>
          <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink, marginBottom:8 }}>아직 기록이 없어요</div>
          <div style={{ fontFamily:SANS, fontSize:13.5, color:COLORS.mute }}>여행 수입과 지출을 기록해 보세요</div>
        </div>
      ) : (() => {
        const indexed = [...entries].map((e,i) => ({ ...e, _i:i }));
        // 날짜별 그룹핑 (최근 날짜 위)
        const byDate = {};
        indexed.forEach(e => {
          const d = e.date || '날짜 없음';
          if (!byDate[d]) byDate[d] = [];
          byDate[d].push(e);
        });
        const sortedDates = Object.keys(byDate).sort((a,b) => b.localeCompare(a));
        return (
          <div style={{ padding:'0 16px' }}>
            {sortedDates.map(date => (
              <div key={date} style={{ marginBottom:16 }}>
                <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em',
                  textTransform:'uppercase', padding:'4px 2px 8px' }}>{date}</div>
                <div>
                  {byDate[date].map((e, i) => {
                    const dp = entryDragProps(e._i);
                    return (
                    <div key={e.id||e._i} ref={dp.ref} data-entry-idx={e._i} onTouchStart={dp.onTouchStart} onTouchMove={dp.onTouchMove} onTouchEnd={dp.onTouchEnd}
                      style={{ position:'relative', marginBottom:6, ...(dp.style||{}) }}>
                    <SwipeableRow
                      cardSwipe
                      isDragging={isEntryDragging}
                      onEdit={() => openEdit(e._i)}
                      onDelete={() => onEditBudget({ entries: entries.filter((_,j) => j !== e._i) })}
                      wrapStyle={{ borderRadius:14 }}>
                      <div style={{
                        padding:'12px 14px', cursor:'pointer', display:'flex', alignItems:'center', gap:12,
                        background:COLORS.card, borderRadius:14,
                      }} onClick={() => openEdit(e._i)}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.ink, marginBottom:2,
                            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                            {e.cat}{e.note ? ` · ${e.note}` : ''}
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                            {(e.scope||'personal')==='shared' && (
                              <div style={{ fontFamily:MONO, fontSize:9, color:'#4F6BED', background:'rgba(79,107,237,0.1)',
                                borderRadius:4, padding:'1px 5px', letterSpacing:'0.05em' }}>공동</div>
                            )}
                            <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute }}>
                              {e.type==='in' ? '수입' : '지출'}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontFamily:MONO, fontSize:14, fontWeight:600, flexShrink:0,
                          color: e.type==='in' ? '#3A9B4C' : '#C14F2E' }}>
                          {e.type==='in' ? '+' : '-'}{fmtAmt(e.amount, e.currency||'KRW')}
                        </div>
                      </div>
                    </SwipeableRow>
                    </div>
                  );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* 입력/수정 시트 */}
      {(sheetOpen || sheetEntered) && ReactDOM.createPortal(
        <div style={{ position:'fixed', inset:0, zIndex:200,
          display:'flex', flexDirection:'column', justifyContent:'flex-end',
          background:`rgba(0,0,0,${sheetEntered ? 0.35 : 0})`,
          transition:'background 0.34s cubic-bezier(0.32,0.72,0,1)',
        }} onClick={closeSheet}>
          <div style={{
            transform:`translateY(${sheetEntered ? 0 : window.innerHeight}px)`,
            transition:'transform 0.34s cubic-bezier(0.32,0.72,0,1)',
          }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:COLORS.bg, borderRadius:'22px 22px 0 0',
            paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 80px)',
            maxHeight:'calc(100dvh - var(--sat,44px) - 8px)',
            overflowY:'auto', overflowX:'hidden',
          }}>
            <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 6px' }}>
              <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
            </div>
            <div style={{ padding:'0 18px' }}>
            {/* 수입/지출 토글 + 공동/개인 */}
            <div style={{ display:'flex', gap:8, marginBottom:14 }}>
              <div style={{ flex:1, display:'flex', gap:6, background:COLORS.softer, borderRadius:14, padding:4 }}>
                {[{v:'in',label:'수입'},{v:'out',label:'지출'}].map(({v,label}) => (
                  <button key={v} onClick={() => { const cats = v==='out'?outCats:inCats; setForm(f => ({ ...f, type:v, cat:cats[0]||'' })); }}
                    style={{ flex:1, padding:'9px 0', border:'none', borderRadius:10, cursor:'pointer',
                      background: form.type===v ? COLORS.card : 'transparent',
                      fontFamily:SANS, fontSize:14, fontWeight:600,
                      color: form.type===v ? COLORS.ink : COLORS.mute }}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display:'flex', gap:4, background:COLORS.softer, borderRadius:14, padding:4 }}>
                {[{v:'personal',label:'개인'},{v:'shared',label:'공동'}].map(({v,label}) => (
                  <button key={v} onClick={() => setForm(f => ({...f, scope:v}))}
                    style={{ padding:'9px 12px', border:'none', borderRadius:10, cursor:'pointer',
                      background: (form.scope||'personal')===v ? COLORS.card : 'transparent',
                      fontFamily:SANS, fontSize:13, fontWeight:600,
                      color: (form.scope||'personal')===v ? COLORS.ink : COLORS.mute }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* 금액 */}
            <input type="text" inputMode="decimal"
              value={(() => {
                if (!form.amount) return '';
                const parts = form.amount.split('.');
                const intStr = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                return parts.length > 1 ? intStr + '.' + parts[1] : intStr;
              })()}
              onChange={e => {
                const raw = e.target.value.replace(/[^0-9.]/g, '');
                const dotCount = (raw.match(/\./g) || []).length;
                if (dotCount <= 1) setForm(f => ({...f, amount: raw}));
              }}
              placeholder="금액"
              style={{ width:'100%', boxSizing:'border-box', padding:'13px 16px', marginBottom:12,
                border:`1px solid ${COLORS.line}`, borderRadius:12, background:COLORS.card,
                fontFamily:MONO, fontSize:24, color:COLORS.ink, outline:'none' }}/>
            {/* 카테고리 드롭다운 */}
            <div style={{ marginBottom:12 }}>
              {addingCat ? (
                <div style={{ display:'flex', gap:6 }}>
                  <input autoFocus value={newCatVal} onChange={e => setNewCatVal(e.target.value)}
                    onKeyDown={e => { if (e.key==='Enter') addCustomCat(); if (e.key==='Escape') { setAddingCat(false); setNewCatVal(''); }}}
                    placeholder="새 항목 이름"
                    style={{ flex:1, padding:'11px 14px', border:`1px solid ${COLORS.line}`, borderRadius:12,
                      background:COLORS.card, fontFamily:SANS, fontSize:14, color:COLORS.ink, outline:'none' }}/>
                  <button onClick={addCustomCat} style={{ padding:'11px 16px', border:'none', borderRadius:12,
                    background:COLORS.ink, color:'#fff', fontFamily:SANS, fontSize:13, fontWeight:600, cursor:'pointer' }}>추가</button>
                  <button onClick={() => { setAddingCat(false); setNewCatVal(''); }} style={{ padding:'11px 12px', border:'none', borderRadius:12,
                    background:COLORS.softer, color:COLORS.mute, fontFamily:SANS, fontSize:13, cursor:'pointer' }}>취소</button>
                </div>
              ) : (
                <div style={{ display:'flex', gap:6 }}>
                  <select value={form.cat} onChange={e => setForm(f => ({...f, cat: e.target.value}))}
                    style={{ flex:1, padding:'11px 14px', border:`1px solid ${COLORS.line}`, borderRadius:12,
                      background:COLORS.card, fontFamily:SANS, fontSize:14, color:COLORS.ink,
                      outline:'none', appearance:'none', WebkitAppearance:'none',
                      backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23aaa' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center' }}>
                    {currentCats.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={() => setAddingCat(true)} style={{ padding:'11px 14px', border:`1px solid ${COLORS.line}`,
                    borderRadius:12, background:COLORS.card, cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="plus" size={14} color={COLORS.mute} stroke={2}/>
                  </button>
                </div>
              )}
            </div>
            {/* 통화 선택 */}
            <select value={form.currency||'KRW'} onChange={e => setForm(f => ({...f, currency: e.target.value}))}
              style={{ width:'100%', boxSizing:'border-box', padding:'11px 14px', marginBottom:12,
                border:`1px solid ${COLORS.line}`, borderRadius:12, background:COLORS.card,
                fontFamily:MONO, fontSize:13, color:COLORS.ink, outline:'none',
                appearance:'none', WebkitAppearance:'none',
                backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23aaa' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center' }}>
              {[
                ['KRW','₩  KRW — 한국 원'],
                ['USD','$  USD — 미국 달러'],
                ['EUR','€  EUR — 유로'],
                ['JPY','¥  JPY — 일본 엔'],
                ['CNY','¥  CNY — 중국 위안'],
                ['HKD','HK$  HKD — 홍콩 달러'],
                ['TWD','NT$  TWD — 대만 달러'],
                ['SGD','S$  SGD — 싱가포르 달러'],
                ['THB','฿  THB — 태국 바트'],
                ['VND','₫  VND — 베트남 동'],
                ['PHP','₱  PHP — 필리핀 페소'],
                ['IDR','Rp  IDR — 인도네시아 루피아'],
                ['MYR','RM  MYR — 말레이시아 링깃'],
                ['INR','₹  INR — 인도 루피'],
                ['AUD','A$  AUD — 호주 달러'],
                ['NZD','NZ$  NZD — 뉴질랜드 달러'],
                ['GBP','£  GBP — 영국 파운드'],
                ['CHF','Fr  CHF — 스위스 프랑'],
                ['SEK','kr  SEK — 스웨덴 크로나'],
                ['NOK','kr  NOK — 노르웨이 크로네'],
                ['DKK','kr  DKK — 덴마크 크로네'],
                ['CAD','C$  CAD — 캐나다 달러'],
                ['MXN','$  MXN — 멕시코 페소'],
                ['BRL','R$  BRL — 브라질 헤알'],
                ['AED','AED — UAE 디르함'],
                ['SAR','SAR — 사우디 리얄'],
                ['TRY','₺  TRY — 터키 리라'],
                ['CZK','Kč  CZK — 체코 코루나'],
                ['HUF','Ft  HUF — 헝가리 포린트'],
                ['PLN','zł  PLN — 폴란드 즐로티'],
              ].map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
            {/* 메모 */}
            <input value={form.note} onChange={e => setForm(f => ({...f, note:e.target.value}))}
              placeholder="메모 (선택)"
              style={{ width:'100%', boxSizing:'border-box', padding:'11px 16px', marginBottom:10,
                border:`1px solid ${COLORS.line}`, borderRadius:12, background:COLORS.card,
                fontFamily:SANS, fontSize:14, color:COLORS.ink, outline:'none' }}/>
            {/* 날짜 */}
            <button type="button" onClick={() => setDatePickOpen(true)} style={{
              width:'100%', boxSizing:'border-box', padding:'11px 16px', marginBottom:16,
              border:`1px solid ${COLORS.line}`, borderRadius:12, background:COLORS.card,
              fontFamily:SANS, fontSize:14, color: form.date ? COLORS.ink : COLORS.mute,
              textAlign:'left', cursor:'pointer',
            }}>{form.date || '날짜 선택'}</button>
            <DatePickerSheet open={datePickOpen} value={form.date}
              onClose={() => setDatePickOpen(false)}
              onPick={d => setForm(f => ({...f, date:d}))}
              title="날짜 선택"/>
            {/* 액션 버튼 */}
            <div style={{ display:'flex', gap:8 }}>
              {editIdx !== null && !delConfirm && (
                <button onClick={() => setDelConfirm(true)} style={{
                  padding:'13px 18px', border:'none', borderRadius:14, background:COLORS.softer,
                  fontFamily:SANS, fontSize:14, color:COLORS.mute, cursor:'pointer' }}>
                  삭제
                </button>
              )}
              {editIdx !== null && delConfirm && (
                <button onClick={deleteEntry} style={{
                  padding:'13px 18px', border:'none', borderRadius:14, background:'#C14F2E',
                  fontFamily:SANS, fontSize:14, fontWeight:600, color:'#fff', cursor:'pointer' }}>
                  확인
                </button>
              )}
              <button onClick={saveEntry} style={{
                flex:1, padding:'13px 0', border:'none', borderRadius:14, background:COLORS.accent,
                fontFamily:SANS, fontSize:15, fontWeight:600, color:'#fff', cursor:'pointer' }}>
                {editIdx !== null ? '수정' : '저장'}
              </button>
            </div>
            </div>{/* padding wrapper */}
          </div>{/* sheetRef */}
          </div>{/* transform wrapper */}
        </div>,
        document.body
      )}
      <BudgetCalcSheet open={calcOpen} onClose={() => { setCalcOpen(false); if (!sheetOpen && !splitOpen) onSheetChange?.(false); }}
        onEnter={(type, amount) => { setCalcOpen(false); openAddWithAmount(type, amount); }}
        onTabBarToggle={onTabBarToggle}/>
      <SplitSheet open={splitOpen} onClose={() => { setSplitOpen(false); if (!sheetOpen && !calcOpen) onSheetChange?.(false); }}
        totalKrw={Math.round(krwSharedOut)}
        defaultN={Math.max(2, (trip.members||[]).length)}
        onEnter={(type, amount) => openAddWithAmount(type, amount)}
        onTabBarToggle={onTabBarToggle}/>
    </div>
  );
}

// ─── Tab bar (no edit toggle) ──────────────────────────────
function TabBar({ tab, setTab, visible, editing, canEdit, onToggleEdit }) {
  const tabs = [
    { id:'home',   icon:'sight',  label:'일정' },
    { id:'map',    icon:'map',    label:'지도' },
    { id:'food',   icon:'food',   label:'맛집' },
    { id:'prep',   icon:'user',   label:'준비' },
    { id:'budget', icon:'wallet', label:'여비' },
  ];
  return (
    <div style={{
      position:'fixed', left:14, right:14,
      bottom:0,
      zIndex:1050,
      background:'rgba(255,255,255,0.88)',
      backdropFilter:'blur(20px) saturate(180%)',
      WebkitBackdropFilter:'blur(20px) saturate(180%)',
      borderRadius:26,
      padding:'12px 10px 14px',
      border:`0.5px solid ${COLORS.line}`,
      display:'flex', gap:2, alignItems:'center',
      transition:'opacity 0.25s ease, transform 0.25s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(80px)',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          flex:1, background:'transparent', border:'none', cursor:'pointer',
          padding:'6px 4px',
          display:'flex', flexDirection:'column', gap:3, alignItems:'center',
        }}>
          <Icon name={t.icon} size={20}
            color={tab === t.id ? COLORS.ink : COLORS.mute}
            stroke={tab === t.id ? 2 : 1.7}/>
          <div style={{ fontFamily:SANS, fontSize:10,
            fontWeight: tab === t.id ? 600 : 400,
            color: tab === t.id ? COLORS.ink : COLORS.mute }}>{t.label}</div>
        </button>
      ))}
      <div style={{ width:'0.5px', height:28, background:COLORS.line, margin:'0 2px' }}/>
      <button onClick={onToggleEdit} disabled={!canEdit && !editing} style={{
        width:40, height:40, borderRadius:20, border:'none', cursor: canEdit ? 'pointer' : 'default',
        background: editing ? COLORS.accent : 'transparent',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        opacity: (!canEdit && !editing) ? 0.3 : 1,
      }}>
        <Icon name={editing ? 'check' : 'edit'} size={17} color={editing ? '#fff' : COLORS.mute} stroke={1.8}/>
      </button>
    </div>
  );
}

// ─── APP ───────────────────────────────────────────────────
const NAV_KEY = 'nav_state';
function loadNav() {
  try { const s = sessionStorage.getItem(NAV_KEY); return s ? JSON.parse(s) : {}; } catch(e) { return {}; }
}
function saveNav(state) {
  try { sessionStorage.setItem(NAV_KEY, JSON.stringify(state)); } catch(e) {}
}

// ─── Splash Screen (로그인 후 로딩 중 표시) ──────────────────
const SPLASH_PLACES = ['✈ New York','🗼 Paris','🗾 Tokyo','🌉 San Francisco','🏝 Bali','🎡 London'];
function SplashScreen({ visible }) {
  const [idx, setIdx] = React.useState(0);
  const [animKey, setAnimKey] = React.useState(0);
  const [hiding, setHiding] = React.useState(false);

  React.useEffect(() => {
    const t = setInterval(() => {
      setIdx(i => (i + 1) % SPLASH_PLACES.length);
      setAnimKey(k => k + 1);
    }, 700);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    if (!visible) setHiding(true);
  }, [visible]);

  if (!visible && !hiding) return null;

  return (
    <div style={{
      position:'fixed', inset:0, background:'#F5F2EC',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      zIndex:9999,
      opacity: hiding ? 0 : 1,
      transition: hiding ? 'opacity 0.3s ease' : 'none',
    }} onTransitionEnd={() => setHiding(false)}>
      <div style={{
        fontFamily:"'Instrument Serif',Georgia,serif",
        fontSize:34, color:'#1A1816', letterSpacing:'-0.5px',
        animation:'splashIn 0.5s ease both',
      }}>Trip Like J</div>
      <div style={{
        marginTop:14, height:22, overflow:'hidden',
        fontFamily:'-apple-system,sans-serif',
        fontSize:13, color:'#7A756D', letterSpacing:'0.04em', textAlign:'center',
      }}>
        <span key={animKey} style={{ display:'block', animation:'destSlide 0.45s cubic-bezier(0.22,1,0.36,1) both' }}>
          {SPLASH_PLACES[idx]}
        </span>
      </div>
      <div style={{
        position:'absolute', bottom:0, left:0, height:2,
        background:'#C14F2E',
        animation:'barGrow 2.2s cubic-bezier(0.4,0,0.2,1) forwards',
        borderRadius:'0 2px 2px 0',
      }}/>
    </div>
  );
}

// ─── Takeoff Icon ─────────────────────────────────────────────
// 비행기 동체 (땅선 제외)
const PLANE_BODY = 'M22.07 9.64c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 2.59 4.49L21 11.67c.81-.23 1.28-1.05 1.07-1.85z';

function TakeoffIcon() {
  return (
    <div style={{ position:'relative', width:72, height:72, marginBottom:32 }}>

      {/* 아이콘 박스 — 처음부터 중앙 고정, zIndex:1 */}
      <div style={{
        position:'relative', zIndex:1,
        width:72, height:72, borderRadius:18, background:COLORS.accent,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        {/* 땅선 — SVG rect를 scaleX로 늘렸다 줄임 */}
        <div style={{ transformOrigin:'center center', animation:'runwaySpring 0.6s linear 0.93s both' }}>
          <svg width="47" height="47" viewBox="0 0 24 24" style={{ display:'block' }}>
            <rect x="2.5" y="20.1" width="19" height="2" rx="1" fill="white"/>
          </svg>
        </div>
      </div>

      {/* 흰 비행기 — 30% 확대 (36→47px), 중앙 정렬 보정 */}
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        zIndex:3, pointerEvents:'none',
      }}>
        <div style={{ animation:'planeFly 0.95s linear 0s both' }}>
          <svg width="47" height="47" viewBox="0 0 24 24"
            style={{ display:'block', transform:'translate(-23.5px,-23.5px)' }}>
            <path fill="white" d={PLANE_BODY}/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Login Screen ────────────────────────────────────────────
function LoginScreen({ errorMsg, onLoginStart }) {
  const [loading, setLoading] = React.useState(false);
  const [errLocal, setErrLocal] = React.useState('');

  const handleLogin = async () => {
    setLoading(true); setErrLocal('');
    if (onLoginStart) onLoginStart();
    try {
      await fbSignIn();
      // popup success — auth listener will transition the screen
    } catch(e) {
      console.error('Login error:', e);
      setLoading(false);
      if (e.code === 'auth/popup-blocked') {
        // 팝업 차단 시 redirect 방식으로 전환
        try { await fbSignInRedirect(); } catch(e2) { setErrLocal('로그인 실패: ' + (e2.message || e2.code)); }
      } else if (e.code === 'auth/unauthorized-domain') {
        setErrLocal('이 도메인이 Firebase에 등록되지 않았습니다. Firebase 콘솔 → Authentication → Settings → Authorized domains에 현재 주소를 추가해주세요.');
      } else if (e.code === 'auth/popup-closed-by-user') {
        setErrLocal('');
      } else {
        setErrLocal(e.message || '로그인 중 오류가 발생했습니다.');
      }
    }
  };

  const displayErr = errorMsg || errLocal;

  return (
    <div style={{ minHeight:'100vh', background:COLORS.bg, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', padding:'48px 36px', textAlign:'center' }}>
      <TakeoffIcon/>
      <div style={{ fontFamily:SERIF, fontSize:56, color:COLORS.ink, letterSpacing:'-0.02em', lineHeight:1.1, marginBottom:14 }}>
        {[...'Trip'].map((ch, i) => (
          <span key={'t'+i} style={{ display:'inline-block',
            animation:`charPop 0.65s cubic-bezier(0.34,1.56,0.64,1) ${0.82 + i*0.055}s both` }}>{ch}</span>
        ))}
        <br/>
        {[...'Like J.'].map((ch, i) => (
          <span key={'l'+i} style={{ display:'inline-block',
            animation:`charPop 0.65s cubic-bezier(0.34,1.56,0.64,1) ${0.82 + (4+i)*0.055 + 0.04}s both` }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </div>
      <div style={{ fontFamily:SANS, fontSize:15, color:COLORS.mute, marginBottom:56, lineHeight:1.5,
        animation:'charPop 0.55s cubic-bezier(0.34,1.56,0.64,1) 1.38s both' }}>
        여행 일정을 J처럼 만들고 간편하게 공유해 보세요.
      </div>
      <button onClick={handleLogin} disabled={loading}
        style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 28px',
          background: loading ? COLORS.softer : '#fff',
          border:`1.5px solid ${COLORS.line}`, borderRadius:16, cursor:'pointer',
          boxShadow:'0 2px 12px rgba(0,0,0,0.08)', width:'100%', maxWidth:300,
          fontFamily:SANS, fontSize:15, fontWeight:500, color:COLORS.ink,
          justifyContent:'center', transition:'opacity 0.2s', opacity: loading ? 0.6 : 1,
        }}>
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.96 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        {loading ? '로그인 중...' : 'Google로 로그인'}
      </button>
      {displayErr && (
        <div style={{ marginTop:20, padding:'12px 16px', background:'#FEF2F2', borderRadius:12,
          fontFamily:SANS, fontSize:13, color:'#C0392B', maxWidth:300, textAlign:'center', lineHeight:1.5 }}>
          {displayErr}
        </div>
      )}
    </div>
  );
}

// ─── Notifications ───────────────────────────────────────────
function NotificationsScreen({ open, onClose, authUser, notifications, onGoToCompanions, onGoToTrip }) {
  const [visible, setVisible] = React.useState(false);  // DOM에 마운트 여부
  const [entered, setEntered] = React.useState(false);  // 슬라이드 인 완료 여부

  React.useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    } else {
      setEntered(false);
      // 슬라이드 아웃 애니메이션(300ms) 후 언마운트
      const t = setTimeout(() => setVisible(false), 320);
      return () => clearTimeout(t);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open || !authUser?.uid) return;
    if (typeof fbMarkAllRead === 'function') fbMarkAllRead(authUser.uid).catch(() => {});
  }, [open, authUser?.uid]);

  if (!visible) return null;

  const fmtMsg = (n) => {
    const name = n.fromName || '누군가';
    const trip = n.tripTitle ? `"${n.tripTitle}"` : '여행';
    if (n.type === 'invite_received')    return `${name}님이 ${trip}에 초대했습니다.`;
    if (n.type === 'invite_accepted')    return `${name}님이 ${trip} 초대를 수락했습니다.`;
    if (n.type === 'trip_edited')        return `${name}님이 ${trip} 일정을 수정했습니다.`;
    if (n.type === 'contact_added')      return `${name}님이 동행인으로 추가했습니다.`;
    if (n.type === 'contact_accepted')   return `${name}님이 동행인 요청을 수락했습니다.`;
    if (n.type === 'trip_copy_received') return `${name}님이 ${trip} 일정을 보냈습니다.`;
    return '새 알림';
  };

  const fmtTime = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = (Date.now() - d) / 1000;
    if (diff < 60)    return '방금';
    if (diff < 3600)  return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };

  const typeColor = (type) => ({
    invite_received:    '#4F6BED',
    invite_accepted:    '#2E9E5B',
    trip_edited:        '#E07B39',
    contact_added:      '#9B59B6',
    contact_accepted:   '#2E9E5B',
    trip_copy_received: '#E07B39',
  }[type] || COLORS.mute);

  const typeIcon = (type) => ({
    invite_received:    'users',
    invite_accepted:    'check',
    trip_edited:        'edit',
    contact_added:      'user',
    contact_accepted:   'check',
    trip_copy_received: 'copy',
  }[type] || 'bell');

  const deleteNotif = (id) => {
    if (authUser?.uid && typeof fbDeleteNotification === 'function')
      fbDeleteNotification(authUser.uid, id).catch(() => {});
  };

  const COMPANION_TYPES = new Set(['contact_added', 'contact_accepted', 'invite_received', 'trip_copy_received']);
  const TRIP_TYPES      = new Set(['invite_accepted', 'trip_edited']);

  const handleNotifTap = (n) => {
    if (COMPANION_TYPES.has(n.type)) {
      onClose();
      onGoToCompanions?.();
    } else if (TRIP_TYPES.has(n.type) && n.tripId) {
      onClose();
      onGoToTrip?.(n.tripId);
    }
  };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:230, background:COLORS.bg,
      overflowY:'auto', overflowX:'hidden',
      transform:`translateX(${entered ? 0 : 100}%)`,
      transition:'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
      paddingBottom:'calc(32px + env(safe-area-inset-bottom,0px))',
    }}>
      <div style={{
        position:'sticky', top:0, background:COLORS.bg, zIndex:5,
        paddingTop:'calc(env(safe-area-inset-top,0px) + 14px)',
        paddingLeft:16, paddingRight:16, paddingBottom:14,
        borderBottom:`1px solid ${COLORS.line}`,
        display:'flex', alignItems:'center', gap:12,
      }}>
        <button onClick={onClose} style={{
          width:36, height:36, borderRadius:18, border:'none', background:COLORS.softer,
          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0,
        }}>
          <Icon name="chevron-l" size={17} color={COLORS.ink} stroke={2}/>
        </button>
        <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink }}>Notifications</div>
      </div>

      <div style={{ padding:'16px 16px 0' }}>
        {notifications.length === 0 ? (
          <div style={{ padding:'48px 0', textAlign:'center', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>
            알림이 없습니다
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {notifications.map(n => {
              const color = typeColor(n.type);
              return (
                <SwipeableRow key={n.id}
                  onDelete={() => deleteNotif(n.id)}
                  deleteLabel="삭제"
                  wrapStyle={{ borderRadius:14 }}>
                  <div onClick={() => handleNotifTap(n)} style={{
                    background: n.read ? COLORS.card : `${color}12`,
                    borderRadius:14, padding:'13px 14px',
                    display:'flex', alignItems:'flex-start', gap:12,
                    border:`1.5px solid ${n.read ? 'transparent' : color+'30'}`,
                    cursor: (COMPANION_TYPES.has(n.type) || (TRIP_TYPES.has(n.type) && n.tripId)) ? 'pointer' : 'default',
                  }}>
                    <div style={{
                      width:36, height:36, borderRadius:18, flexShrink:0,
                      background:`${color}20`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <Icon name={typeIcon(n.type)} size={16} color={color} stroke={2}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:SANS, fontSize:13.5, color:COLORS.ink, lineHeight:1.45 }}>{fmtMsg(n)}</div>
                      <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, marginTop:3 }}>{fmtTime(n.createdAt)}</div>
                    </div>
                    {!n.read && (
                      <div style={{ width:7, height:7, borderRadius:4, background:color, flexShrink:0, marginTop:6 }}/>
                    )}
                  </div>
                </SwipeableRow>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Companions ───────────────────────────────────────────────
function CompanionsScreen({ open, onClose, authUser, userData, trips, onUserDataUpdate }) {
  const [contacts, setContacts]         = React.useState([]);
  const [sentInvites, setSentInvites]   = React.useState([]);
  const [receivedInvites, setReceivedInvites] = React.useState([]);
  const [inviteUsers, setInviteUsers]   = React.useState({});
  const [tripCompanions, setTripCompanions] = React.useState({});
  const [loading, setLoading]           = React.useState(false);
  const [removing, setRemoving]         = React.useState(null);
  const [addTripFor, setAddTripFor]     = React.useState(null);
  // ── 드래그로 여행 추가 ──────────────────────────────────────
  const [dragContact, setDragContact]   = React.useState(null);
  const [dragPos, setDragPos]           = React.useState({x:0, y:0});
  const [dragOverTripId, setDragOverTripId] = React.useState(null);
  const dragContactRef    = React.useRef(null);
  const dragOverTripIdRef = React.useRef(null);
  const tripCardRefs      = React.useRef({});
  const longPressRef      = React.useRef(null);
  const tripsRef          = React.useRef(trips);
  tripsRef.current        = trips;
  const tripCompanionsRef = React.useRef(tripCompanions);
  tripCompanionsRef.current = tripCompanions;

  React.useEffect(() => {
    if (!dragContact) return;
    const onMove = (e) => {
      e.preventDefault();
      const t = e.touches[0];
      setDragPos({x: t.clientX, y: t.clientY});
      let over = null;
      Object.entries(tripCardRefs.current).forEach(([id, el]) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (t.clientX >= r.left && t.clientX <= r.right && t.clientY >= r.top && t.clientY <= r.bottom) over = id;
      });
      dragOverTripIdRef.current = over;
      setDragOverTripId(over);
    };
    const onEnd = async () => {
      const contact = dragContactRef.current;
      const overId  = dragOverTripIdRef.current;
      setDragContact(null); dragContactRef.current = null;
      setDragOverTripId(null); dragOverTripIdRef.current = null;
      if (overId && contact) {
        const trip = (tripsRef.current||[]).find(t => t.id === overId);
        const already = (tripCompanionsRef.current[overId]||[]).some(m => m.uid === contact.uid);
        if (already) return;
        const fromUser = {uid:authUser.uid, displayName:authUser.displayName, email:authUser.email, photoURL:authUser.photoURL||''};
        try {
          // 이미 동행인으로 연결된 상태 → 수락 없이 바로 여행 공유
          await fbAddTripMember(fromUser, contact.uid, overId, trip?.title||'');
        } catch(e) { /* groups 쓰기 실패 — 무시 */ }
        setTripCompanions(prev => ({
          ...prev,
          [overId]: [...(prev[overId]||[]), contact],
        }));
      }
    };
    window.addEventListener('touchmove', onMove, {passive:false});
    window.addEventListener('touchend', onEnd);
    return () => { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
  }, [!!dragContact]);

  const startLongPress = (e, contact) => {
    const touch = e.touches[0];
    longPressRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(25);
      dragContactRef.current = contact;
      setDragContact(contact);
      setDragPos({x: touch.clientX, y: touch.clientY});
    }, 450);
  };
  const cancelLongPress = () => clearTimeout(longPressRef.current);

  const tripIds = (trips||[]).map(t=>t.id).join(',');
  React.useEffect(() => {
    if (!open || !authUser) return;
    document.body.style.overflow = 'hidden';
    setLoading(true);

    fbGetContacts(authUser.uid).then(setContacts).catch(() => setContacts([]));

    Promise.all((trips||[]).map(t =>
      fbGetTripCompanions(t.id, authUser.uid)
        .then(m => ({ id:t.id, members:m }))
        .catch(() => ({ id:t.id, members:[] }))
    )).then(results => {
      const map = {};
      results.forEach(r => { map[r.id] = r.members; });
      setTripCompanions(map);
      setLoading(false);
    });

    let unsubSent = () => {};
    if (typeof fbListenSentInvites === 'function') {
      unsubSent = fbListenSentInvites(authUser.uid, async (invites) => {
        setSentInvites(invites);
        const uids = [...new Set(invites.map(i => i.toUid).filter(Boolean))];
        if (uids.length) {
          fbGetUsersById(uids).then(users => {
            const m = {};
            users.forEach(u => { m[u.uid] = u; });
            setInviteUsers(m);
          }).catch(() => {});
        }
      });
    }

    // 받은 연락처 요청 리스너
    let unsubReceived = () => {};
    if (typeof fbListenInvites === 'function') {
      unsubReceived = fbListenInvites(authUser.uid, (invites) => {
        setReceivedInvites(invites);
      });
    }

    return () => { unsubSent(); unsubReceived(); document.body.style.overflow = ''; };
  }, [open, authUser?.uid, tripIds]);

  if (!open) return null;

  const removeContact = async (c, skipConfirm = false) => {
    if (!skipConfirm && !confirm(`${c.displayName}님을 동행인에서 삭제할까요?\n모든 여행에서도 제거됩니다.`)) return;
    setRemoving(`contact:${c.uid}`);
    try {
      await fbRemoveContact(authUser.uid, c.uid);
      await Promise.all((trips||[]).map(t =>
        (tripCompanions[t.id]||[]).some(m => m.uid === c.uid)
          ? fbRemoveTripMember(t.id, c.uid) : Promise.resolve()
      ));
      setContacts(prev => prev.filter(x => x.uid !== c.uid));
      setTripCompanions(prev => {
        const next = {...prev};
        Object.keys(next).forEach(tid => { next[tid] = next[tid].filter(m => m.uid !== c.uid); });
        return next;
      });
    } catch(e) { alert('삭제 실패. 다시 시도해 주세요.'); }
    setRemoving(null);
  };

  const removeFromTrip = async (tripId, uid, displayName) => {
    if (!confirm(`${displayName}님을 이 여행에서 제거할까요?`)) return;
    setRemoving(`trip:${tripId}:${uid}`);
    try {
      await fbRemoveTripMember(tripId, uid);
      setTripCompanions(prev => ({ ...prev, [tripId]: (prev[tripId]||[]).filter(m => m.uid !== uid) }));
    } catch(e) { alert('제거 실패.'); }
    setRemoving(null);
  };

  const addToTrip = async (contact, tripId) => {
    const trip = (trips||[]).find(t => t.id === tripId);
    const res = await fbSendTripInvite(
      { uid:authUser.uid, displayName:authUser.displayName, email:authUser.email, photoURL:authUser.photoURL||'' },
      contact.email, tripId, trip?.title || ''
    );
    if (res.error) { alert(res.error); return; }
    setAddTripFor(null);
    alert(`${contact.displayName}님께 초대를 보냈습니다!`);
  };

  const Avatar = ({ u, size=40 }) => u?.photoURL
    ? <img src={u.photoURL} style={{ width:size, height:size, borderRadius:size/2, objectFit:'cover', flexShrink:0 }}/>
    : <div style={{ width:size, height:size, borderRadius:size/2, background:COLORS.softer, flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:SANS, fontSize:size*0.4, color:COLORS.mute }}>{(u?.displayName||'?')[0]}</div>;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:220, background:COLORS.bg, overflowY:'scroll', overflowX:'clip',
      paddingBottom:'calc(32px + env(safe-area-inset-bottom,0px))' }}>
      <div style={{
        position:'sticky', top:0, background:COLORS.bg, zIndex:5,
        paddingTop:'calc(env(safe-area-inset-top,0px) + 14px)',
        paddingLeft:16, paddingRight:16, paddingBottom:14,
        borderBottom:`1px solid ${COLORS.line}`,
        display:'flex', alignItems:'center', gap:12,
      }}>
        <button onClick={onClose} style={{
          width:36, height:36, borderRadius:18, border:'none', background:COLORS.softer,
          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0,
        }}>
          <Icon name="chevron-l" size={17} color={COLORS.ink} stroke={2}/>
        </button>
        <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink }}>Companions</div>
      </div>

      <div style={{ padding:'16px 16px 0' }}>
        {loading && (
          <div style={{ padding:'48px 0', textAlign:'center', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>
            불러오는 중...
          </div>
        )}

        {!loading && (
          <>
            {/* 대기 중 — 여행 초대만 */}
            {sentInvites.filter(inv => inv.tripId).length > 0 && (
              <div style={{ marginBottom:20 }}>
                <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.1em', marginBottom:10 }}>
                  대기 중 · {sentInvites.filter(inv => inv.tripId).length}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {sentInvites.filter(inv => inv.tripId).map(inv => {
                    const u = inviteUsers[inv.toUid];
                    return (
                      <SwipeableRow key={inv.id}
                        cardSwipe
                        onEdit={async () => {
                          try {
                            await fbCancelInvite(inv.id);
                            const fromUser = { uid:authUser.uid, displayName:authUser.displayName, email:authUser.email, photoURL:authUser.photoURL||'' };
                            await fbSendTripInvite(fromUser, inv.toEmail, inv.tripId, inv.tripTitle||'');
                          } catch(e) { alert('재신청 실패.'); }
                        }}
                        editLabel="재신청" editBg="#4F6BED"
                        onDelete={async () => {
                          try { await fbCancelInvite(inv.id); } catch(e) { alert('취소 실패.'); }
                        }}
                        deleteLabel="취소"
                        wrapStyle={{ borderRadius:14 }}>
                        <div style={{ background:COLORS.card, borderRadius:14, padding:'12px 14px',
                          display:'flex', alignItems:'center', gap:12 }}>
                          <Avatar u={u || { displayName: inv.toEmail }}/>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontFamily:SANS, fontSize:13.5, fontWeight:500, color:COLORS.ink }}>
                              {u?.displayName || inv.toEmail}
                            </div>
                            {inv.tripTitle && (
                              <div style={{ fontFamily:SANS, fontSize:11.5, color:COLORS.mute, marginTop:1 }}>
                                {inv.tripTitle}
                              </div>
                            )}
                          </div>
                          <div style={{ fontFamily:MONO, fontSize:9.5, color:'#B8860B',
                            background:'#FFF8E1', borderRadius:8, padding:'3px 8px' }}>대기 중</div>
                        </div>
                      </SwipeableRow>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 받은 요청 */}
            {receivedInvites.length > 0 && (
              <div style={{ marginBottom:20 }}>
                <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.1em', marginBottom:10 }}>
                  받은 요청 · {receivedInvites.length}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {receivedInvites.map(inv => (
                    <div key={inv.id} style={{ background:COLORS.card, borderRadius:14, padding:'12px 14px',
                      display:'flex', alignItems:'center', gap:12 }}>
                      <Avatar u={{ displayName: inv.fromName, photoURL: inv.fromPhoto }}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontFamily:SANS, fontSize:13.5, fontWeight:500, color:COLORS.ink }}>{inv.fromName || '?'}</div>
                        <div style={{ fontFamily:SANS, fontSize:11.5, color:COLORS.mute, marginTop:1 }}>
                          {inv.type === 'trip_copy' ? `일정 복사: ${inv.tripTitle || ''}` : inv.tripId ? `여행 초대: ${inv.tripTitle || ''}` : '동행인 요청'}
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={async () => {
                          if (inv.type === 'trip_copy') {
                            const tripId = await fbAcceptTripCopy(inv, authUser.uid);
                            onUserDataUpdate?.({ ...userData, tripIds: [...(userData.tripIds||[]), tripId] });
                          } else if (inv.tripId) {
                            const tripId = await fbAcceptTripInvite(inv, authUser.uid);
                            onUserDataUpdate?.({ ...userData, tripIds: [...(userData.tripIds||[]), tripId] });
                          } else {
                            await fbAcceptContactInvite(inv, authUser.uid);
                            fbGetContacts(authUser.uid).then(setContacts).catch(() => {});
                          }
                          setReceivedInvites(p => p.filter(i => i.id !== inv.id));
                        }} style={{
                          border:'none', borderRadius:9, padding:'6px 12px', cursor:'pointer',
                          background:COLORS.ink, color:COLORS.bg, fontFamily:SANS, fontSize:12, fontWeight:500,
                        }}>수락</button>
                        <button onClick={async () => {
                          await fbRejectInvite(inv.id).catch(() => {});
                          setReceivedInvites(p => p.filter(i => i.id !== inv.id));
                        }} style={{
                          border:`1px solid ${COLORS.line}`, borderRadius:9, padding:'6px 10px', cursor:'pointer',
                          background:'transparent', fontFamily:SANS, fontSize:12, color:COLORS.mute,
                        }}>거절</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 동행인 목록 — 받은 요청 대기 중인 사람 제외, 미수락(contact invite pending) 포함 */}
            {(() => {
              const pendingReceivedUids = new Set(receivedInvites.map(inv => inv.fromUid).filter(Boolean));
              const pendingInvMap = {};
              sentInvites.filter(inv => inv.type === 'contact' && !inv.tripId)
                .forEach(inv => { pendingInvMap[inv.toUid] = inv; });
              const displayContacts = contacts.filter(c => !pendingReceivedUids.has(c.uid));
              const total = displayContacts.length;
              return (
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.1em', marginBottom:10 }}>
                    동행인 · {total}
                  </div>
                  {total === 0 ? (
                    <div style={{ padding:'32px 0', textAlign:'center', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>
                      아직 동행인이 없어요
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {displayContacts.map(c => {
                        const pendingInv = pendingInvMap[c.uid];
                        return (
                          <div key={c.uid} style={{ opacity: dragContact && dragContact.uid !== c.uid ? 0.45 : 1, transition:'opacity 0.15s' }}>
                          <SwipeableRow
                            cardSwipe
                            disabled={!!dragContact}
                            onEdit={pendingInv ? async () => {
                              try {
                                await fbCancelInvite(pendingInv.id);
                                const res = await fbAddContact(authUser.uid, pendingInv.toEmail);
                                if (res?.error) alert(res.error);
                              } catch(e) { alert('재신청 실패.'); }
                            } : undefined}
                            editLabel={pendingInv ? '재신청' : undefined} editBg="#4F6BED"
                            onDelete={async () => {
                              if (pendingInv) await fbCancelInvite(pendingInv.id).catch(() => {});
                              await removeContact(c, true);
                            }}
                            deleteLabel="삭제"
                            wrapStyle={{ borderRadius:14 }}>
                            <div style={{ background: dragContact?.uid === c.uid ? COLORS.softer : COLORS.card, borderRadius:14, padding:'12px 14px',
                              display:'flex', alignItems:'center', gap:12 }}
                              onTouchStart={(e) => startLongPress(e, c)}
                              onTouchMove={cancelLongPress}
                              onTouchEnd={cancelLongPress}>
                              <Avatar u={c}/>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontFamily:SANS, fontSize:13.5, fontWeight:500, color:COLORS.ink }}>{c.displayName}</div>
                                <div style={{ fontFamily:SANS, fontSize:12, color:COLORS.mute, marginTop:1 }}>{c.email}</div>
                              </div>
                              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                                {pendingInv && (
                                  <div style={{ fontFamily:MONO, fontSize:9, color:'#B8860B',
                                    background:'#FFF8E1', borderRadius:6, padding:'2px 6px' }}>미수락</div>
                                )}
                                {(() => {
                                  const sharedCount = (trips||[]).filter(t => (tripCompanions[t.id]||[]).some(m => m.uid === c.uid)).length;
                                  return sharedCount > 0 ? (
                                    <div style={{ fontFamily:MONO, fontSize:9, color:'#4F6BED',
                                      background:'#EEF2FF', borderRadius:6, padding:'2px 6px' }}>{sharedCount}개 여행</div>
                                  ) : null;
                                })()}
                              </div>
                            </div>
                          </SwipeableRow>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 여행별 동행인 */}
            {(trips||[]).length > 0 && (
              <>
                <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.1em', marginBottom:10 }}>
                  여행별
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {(trips||[]).map(t => {
                    const members = tripCompanions[t.id] || [];
                    const isDropTarget = dragOverTripId === t.id;
                    return (
                      <div key={t.id} ref={el => tripCardRefs.current[t.id] = el}
                        style={{ background: isDropTarget ? '#EEF2FF' : COLORS.card, borderRadius:16,
                          border:`${isDropTarget ? 2 : 1}px solid ${isDropTarget ? '#4F6BED' : COLORS.line}`,
                          transition:'border-color 0.12s, background 0.12s' }}>
                        <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:36, height:36, borderRadius:10, overflow:'hidden', flexShrink:0 }}>
                            <Photo hue={t.hue ?? 25} height={36} small/>
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontFamily:SERIF, fontSize:15, color:COLORS.ink }}>{t.title||'새 여행'}</div>
                            {t.dates && <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, marginTop:1 }}>{t.dates}</div>}
                          </div>
                          <div style={{ fontFamily:MONO, fontSize:9.5, color: isDropTarget ? '#4F6BED' : COLORS.accent }}>
                            {isDropTarget ? '여기에 추가' : `${members.length}명`}
                          </div>
                        </div>
                        {members.length > 0 ? (
                          <div style={{ padding:'0 12px 12px', display:'flex', flexDirection:'column', gap:6 }}>
                            {members.map(m => (
                              <SwipeableRow key={m.uid}
                                onDelete={() => removeFromTrip(t.id, m.uid, m.displayName)}
                                wrapStyle={{ borderRadius:10 }}>
                                <div style={{ background:COLORS.softer, borderRadius:10, padding:'8px 12px',
                                  display:'flex', alignItems:'center', gap:10 }}>
                                  <Avatar u={m} size={28}/>
                                  <div style={{ flex:1, minWidth:0 }}>
                                    <div style={{ fontFamily:SANS, fontSize:12.5, fontWeight:500, color:COLORS.ink }}>{m.displayName}</div>
                                  </div>
                                  <div style={{ fontFamily:MONO, fontSize:9, color:COLORS.mute }}>← 스와이프</div>
                                </div>
                              </SwipeableRow>
                            ))}
                          </div>
                        ) : (
                          <div style={{ padding:'0 16px 12px', fontFamily:SANS, fontSize:12, color:COLORS.mute }}>동행인 없음</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* 여행 참여 picker */}
      {addTripFor && (
        <div style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,0.4)',
          display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}
          onClick={() => setAddTripFor(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:COLORS.bg, borderRadius:20, padding:'22px 20px', width:'100%', maxWidth:320,
          }}>
            <div style={{ fontFamily:SERIF, fontSize:18, color:COLORS.ink, marginBottom:4 }}>{addTripFor.displayName}</div>
            <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.mute, marginBottom:16 }}>어느 여행에 추가할까요?</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {(trips||[]).map(t => {
                const alreadyIn = (tripCompanions[t.id]||[]).some(m => m.uid === addTripFor.uid);
                return (
                  <button key={t.id} onClick={() => !alreadyIn && addToTrip(addTripFor, t.id)} style={{
                    padding:'11px 14px', borderRadius:12, cursor: alreadyIn ? 'default' : 'pointer',
                    border:`1.5px solid ${alreadyIn ? COLORS.line : COLORS.ink}`,
                    background: alreadyIn ? COLORS.softer : 'transparent',
                    display:'flex', alignItems:'center', gap:10, textAlign:'left',
                  }}>
                    <div style={{ width:28, height:28, borderRadius:8, overflow:'hidden', flexShrink:0 }}>
                      <Photo hue={t.hue ?? 25} height={28} small/>
                    </div>
                    <div style={{ flex:1, fontFamily:SANS, fontSize:13, color: alreadyIn ? COLORS.mute : COLORS.ink }}>
                      {t.title||'여행'}
                    </div>
                    {alreadyIn && <span style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute }}>이미 참여 중</span>}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setAddTripFor(null)} style={{
              marginTop:14, width:'100%', padding:'11px', borderRadius:12,
              border:`1px solid ${COLORS.line}`, background:'transparent', cursor:'pointer',
              fontFamily:SANS, fontSize:13, color:COLORS.mute,
            }}>취소</button>
          </div>
        </div>
      )}

      {/* 드래그 고스트 카드 */}
      {dragContact && (
        <div style={{
          position:'fixed', zIndex:9999, pointerEvents:'none',
          left: dragPos.x - 120, top: dragPos.y - 28,
          width: 240, background: COLORS.card, borderRadius:14,
          padding:'10px 14px', display:'flex', alignItems:'center', gap:10,
          boxShadow:'0 12px 32px rgba(0,0,0,0.22)',
          transform:'scale(1.05)', opacity:0.96,
        }}>
          <Avatar u={dragContact} size={32}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:SANS, fontSize:13, fontWeight:500, color:COLORS.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{dragContact.displayName}</div>
            <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute }}>여행 카드에 올려 추가</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 새 여행 만들기 위저드 ────────────────────────────────────

function greedyRoute(places) {
  if (!places.length) return [];
  const result = [places[0]];
  const rem = places.slice(1);
  while (rem.length) {
    const last = result[result.length - 1];
    let best = 0, bestDist = Infinity;
    rem.forEach((p, i) => {
      const dist = Math.hypot(p.lat - last.lat, p.lon - last.lon);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    result.push(rem.splice(best, 1)[0]);
  }
  return result;
}

// 황금각(137.5°) 기반으로 겹치지 않는 hue 배열 생성
const DAY_HUES = Array.from({ length: 20 }, (_, i) => Math.round((25 + i * 137.508) % 360));
// [25,163,300,77,215,352,130,267,44,182,319,96,234,11,149,286,63,200,338,115]

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
const DURATION_BY_TYPE = {
  museum:180, gallery:120, theme_park:480, zoo:150, aquarium:120,
  ruins:120, castle:120, monument:60, viewpoint:45,
  cathedral:60, church:60, park:90, beach:180, marketplace:60, attraction:90,
};
function getPlaceDuration(type) { return DURATION_BY_TYPE[type] || 90; }
function minToTime(min) {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function generateTripData({ cities, startIso, endIso, hotels, arrAirport, depAirport, selectedPlaces, selectedDest }) {
  const startDate  = new Date(startIso + 'T12:00:00');
  const dayCount   = Math.round((new Date(endIso+'T12:00:00') - startDate) / 86400000) + 1;
  const citiesList = cities.filter(Boolean);
  const hasArr     = !!(arrAirport && arrAirport.trim());
  const hasDep     = !!(depAirport && depAirport.trim());
  const getHotel   = n => hotels.find(h => h.name && n >= h.from && n <= h.to) || null;

  // 도시별 장소 분리 → 각각 최적 경로 → 순차 합치기
  const routedPlaces = [];
  const hasCityIdx = selectedPlaces.some(p => p.cityIdx != null);
  if (hasCityIdx) {
    citiesList.forEach((_, ci) => {
      greedyRoute(selectedPlaces.filter(p => (p.cityIdx ?? 0) === ci)).forEach(p => routedPlaces.push(p));
    });
  } else {
    greedyRoute([...selectedPlaces]).forEach(p => routedPlaces.push(p));
  }

  // 하루 시간 상수
  const DAY_START  = 9 * 60 + 30;   // 09:30
  const DAY_END    = 20 * 60;        // 20:00
  const LUNCH_AT   = 12 * 60 + 30;  // 12:30
  const DINNER_AT  = 18 * 60 + 30;  // 18:30
  const LUNCH_DUR  = 90;
  const DINNER_DUR = 90;

  // 관광 가능 날짜 범위
  const sStart = hasArr ? 2 : 1;
  const sEnd   = hasDep ? dayCount - 1 : dayCount;
  const sCount = Math.max(0, sEnd - sStart + 1);

  // 날짜별 장소 배분
  const dayItems = Array.from({ length: dayCount }, () => []);
  let pIdx = 0;

  for (let d = 0; d < sCount && pIdx < routedPlaces.length; d++) {
    const dayIdx = sStart - 1 + d;
    let t = DAY_START;
    let lunchDone = false, dinnerDone = false;
    let prev = null;

    outer: while (pIdx < routedPlaces.length) {
      const p = routedPlaces[pIdx];
      const dur = getPlaceDuration(p.type);
      const km  = (prev && prev.lat && p.lat) ? haversineKm(prev.lat, prev.lon, p.lat, p.lon) : 0;
      const transit = km >= 2;
      const travelMin = km === 0 ? 0 : transit ? 30 : Math.max(5, Math.round(km / 5 * 60));

      // 점심 삽입
      if (!lunchDone && t + travelMin >= LUNCH_AT) {
        const lt = Math.max(t, LUNCH_AT);
        dayItems[dayIdx].push({ time:minToTime(lt), title:'점심', loc:'', done:false });
        t = lt + LUNCH_DUR;
        lunchDone = true;
        continue;
      }

      // 이 장소가 오늘 안에 들어오는지 확인 (저녁 시간 확보)
      const reserve = dinnerDone ? 0 : DINNER_DUR;
      if (t + travelMin + dur > DAY_END - reserve) break outer;

      // 대중교통 이동 항목
      if (transit && prev) {
        dayItems[dayIdx].push({ time:minToTime(t), title:'대중교통 이동', loc:'', done:false });
      }
      t += travelMin;

      dayItems[dayIdx].push({ time:minToTime(t), title:p.name, loc:p.name, done:false, lat:p.lat, lon:p.lon });
      t += dur;
      prev = p;
      pIdx++;

      // 저녁 삽입
      if (!dinnerDone && t >= DINNER_AT) {
        dayItems[dayIdx].push({ time:minToTime(Math.max(t, DINNER_AT)), title:'저녁', loc:'', done:false });
        t = Math.max(t, DINNER_AT) + DINNER_DUR;
        dinnerDone = true;
        break outer;
      }
    }

    // 저녁 미삽입 시 추가
    if (!dinnerDone && dayItems[dayIdx].some(it => it.title !== '점심')) {
      const dt = Math.max(t, DINNER_AT);
      if (dt < DAY_END) dayItems[dayIdx].push({ time:minToTime(dt), title:'저녁', loc:'', done:false });
    }
  }

  // 날짜 배열 빌드
  const days = Array.from({ length: dayCount }, (_, i) => {
    const n     = i + 1;
    const d     = new Date(startDate);
    d.setDate(d.getDate() + i);
    const iso   = d.toISOString().slice(0, 10);
    const hotel = getHotel(n);
    const prev  = n > 1 ? getHotel(n - 1) : null;
    const items = [...dayItems[i]];

    if (n === 1 && hasArr)
      items.push({ time:'14:00', title:arrAirport.trim(), loc:'', done:false });

    if (hotel && (!prev || prev.name !== hotel.name))
      items.push({ time:n===1 ? '16:00' : '15:00', title:`체크인 · ${hotel.name}`, loc:hotel.name, done:false });

    if (n === dayCount) {
      if (hotel)  items.push({ time:'10:00', title:`체크아웃 · ${hotel.name}`, loc:hotel.name, done:false });
      if (hasDep) items.push({ time:'13:00', title:depAirport.trim(), loc:'', done:false });
    }

    items.sort((a, b) => a.time.localeCompare(b.time));
    return {
      n, date:isoToDayDate(iso), weekday:isoToWeekday(iso),
      title:`Day ${n}`, titleEn:`Day ${n}`,
      hero:{ hue:DAY_HUES[i % DAY_HUES.length], label:`DAY ${String(n).padStart(2,'0')}` },
      weather:'', items,
    };
  });

  return {
    title: citiesList.join(' · ') || 'New Trip',
    dates: `${isoToDayDate(startIso)} – ${isoToDayDate(endIso)}`,
    hue:   DAY_HUES[0],
    days, hotels:[], food:[],
    timezone: selectedDest?.zone || null,
    defaultCurrency: selectedDest?.currency || 'KRW',
  };
}

function MiniCalendar({ startIso, endIso, onRange, actionRef, onPickingChange }) {
  const today = new Date();
  const [vy, setVy] = React.useState(today.getFullYear());
  const [vm, setVm] = React.useState(today.getMonth());
  const [picking, setPicking] = React.useState(false);
  const [pickY, setPickY] = React.useState(String(today.getFullYear()));
  const [pickM, setPickM] = React.useState(String(today.getMonth()));
  const wheelContainerRef = React.useRef(null);
  const todayIso = today.toISOString().slice(0, 10);
  const toIso    = (y, m, d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const dim      = new Date(vy, vm + 1, 0).getDate();
  const firstDow = new Date(vy, vm, 1).getDay();
  const prevMo   = () => vm === 0 ? (setVy(y=>y-1), setVm(11)) : setVm(m=>m-1);
  const nextMo   = () => vm === 11 ? (setVy(y=>y+1), setVm(0)) : setVm(m=>m+1);
  const tap = d => {
    const iso = toIso(vy, vm, d);
    if (iso < todayIso) return;
    if (!startIso || (startIso && endIso)) onRange(iso, '');
    else if (iso <= startIso) onRange(iso, startIso);
    else onRange(startIso, iso);
  };
  const cells = [...Array(firstDow).fill(null), ...Array.from({length:dim},(_,i)=>i+1)];
  const thisYear = today.getFullYear();
  const yearItems  = React.useMemo(() => Array.from({ length: 8 }, (_, i) => String(thisYear - 1 + i)), [thisYear]);
  const monthItems = React.useMemo(() => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], []);

  const openPicker = () => {
    setPickY(String(vy));
    setPickM(String(vm));
    setPicking(true);
  };
  const confirmPicker = React.useCallback(() => {
    setVy(+pickY);
    setVm(+pickM);
    setPicking(false);
  }, [pickY, pickM]);

  // 부모에서 "다음" 누를 때 picker 닫기용 ref
  if (actionRef) actionRef.current = { isPicking: () => picking, confirm: confirmPicker };
  React.useEffect(() => { onPickingChange?.(picking); }, [picking]);

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        {picking ? (
          <div style={{ width:32 }}/>
        ) : (
          <button onClick={prevMo} style={{ background:'none', border:'none', cursor:'pointer', fontSize:20, padding:'0 10px', color:COLORS.ink }}>‹</button>
        )}
        {picking ? (
          <div style={{ flex:1 }}/>
        ) : (
          <button onClick={openPicker} style={{
            background:'none', border:'none', cursor:'pointer',
            fontFamily:SANS, fontSize:14, fontWeight:600, color:COLORS.ink,
            display:'flex', alignItems:'center', gap:4,
          }}>
            {`${MONTH_NAMES_SHORT[vm]} ${vy}`}
          </button>
        )}
        {picking ? (
          <div style={{ width:32 }}/>
        ) : (
          <button onClick={nextMo} style={{ background:'none', border:'none', cursor:'pointer', fontSize:20, padding:'0 10px', color:COLORS.ink }}>›</button>
        )}
      </div>

      {picking ? (
        <div ref={wheelContainerRef} style={{ display:'flex', justifyContent:'center', gap:8, touchAction:'none' }}>
          <WheelColumn items={yearItems} value={pickY} onChange={setPickY} width={80} compact={true}/>
          <WheelColumn items={monthItems} value={monthItems[+pickM]} onChange={v => setPickM(String(monthItems.indexOf(v)))} width={80} loop={true} compact={true}/>
        </div>
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', textAlign:'center', marginBottom:4 }}>
            {['S','M','T','W','T','F','S'].map((w,i) => (
              <div key={i} style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, paddingBottom:4 }}>{w}</div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
            {cells.map((d, i) => {
              if (!d) return <div key={i}/>;
              const iso     = toIso(vy, vm, d);
              const isStart = iso === startIso;
              const isEnd   = iso === endIso;
              const inRange = startIso && endIso && iso > startIso && iso < endIso;
              const past    = iso < todayIso;
              const isToday = iso === todayIso;
              return (
                <button key={i} onClick={() => tap(d)} style={{
                  padding:'7px 0', border:'none', cursor: past ? 'default' : 'pointer',
                  borderRadius: (isStart || isEnd) ? 8 : inRange ? 2 : 8,
                  background: (isStart || isEnd) ? COLORS.ink : inRange ? COLORS.softer : 'transparent',
                  color: (isStart || isEnd) ? COLORS.bg : past ? COLORS.line : isToday ? COLORS.accent : COLORS.ink,
                  fontFamily:SANS, fontSize:13, fontWeight:(isStart||isEnd) ? 600 : 400,
                }}>{d}</button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

const CITY_DB = [
  { key:'japan',       kor:'일본',       eng:'Japan',          flag:'🇯🇵', zone:'Asia/Tokyo',           currency:'JPY', lat:35.6762,  lon:139.6503  },
  { key:'france',      kor:'프랑스',     eng:'France',         flag:'🇫🇷', zone:'Europe/Paris',         currency:'EUR', lat:48.8566,  lon:2.3522    },
  { key:'usa',         kor:'미국',       eng:'USA',            flag:'🇺🇸', zone:'America/New_York',     currency:'USD', lat:40.7128,  lon:-74.0060  },
  { key:'uk',          kor:'영국',       eng:'United Kingdom', flag:'🇬🇧', zone:'Europe/London',        currency:'GBP', lat:51.5074,  lon:-0.1278   },
  { key:'thailand',    kor:'태국',       eng:'Thailand',       flag:'🇹🇭', zone:'Asia/Bangkok',         currency:'THB', lat:13.7563,  lon:100.5018  },
  { key:'indonesia',   kor:'인도네시아', eng:'Indonesia',      flag:'🇮🇩', zone:'Asia/Makassar',        currency:'IDR', lat:-8.3405,  lon:115.0920  },
  { key:'singapore',   kor:'싱가포르',   eng:'Singapore',      flag:'🇸🇬', zone:'Asia/Singapore',       currency:'SGD', lat:1.3521,   lon:103.8198  },
  { key:'spain',       kor:'스페인',     eng:'Spain',          flag:'🇪🇸', zone:'Europe/Madrid',        currency:'EUR', lat:40.4168,  lon:-3.7038   },
  { key:'italy',       kor:'이탈리아',   eng:'Italy',          flag:'🇮🇹', zone:'Europe/Rome',          currency:'EUR', lat:41.9028,  lon:12.4964   },
  { key:'czechia',     kor:'체코',       eng:'Czech Republic', flag:'🇨🇿', zone:'Europe/Prague',        currency:'CZK', lat:50.0755,  lon:14.4378   },
  { key:'australia',   kor:'호주',       eng:'Australia',      flag:'🇦🇺', zone:'Australia/Sydney',     currency:'AUD', lat:-33.8688, lon:151.2093  },
  { key:'uae',         kor:'아랍에미리트',eng:'UAE',            flag:'🇦🇪', zone:'Asia/Dubai',           currency:'AED', lat:25.2048,  lon:55.2708   },
  { key:'turkey',      kor:'터키',       eng:'Turkey',         flag:'🇹🇷', zone:'Europe/Istanbul',      currency:'TRY', lat:41.0082,  lon:28.9784   },
  { key:'vietnam',     kor:'베트남',     eng:'Vietnam',        flag:'🇻🇳', zone:'Asia/Ho_Chi_Minh',    currency:'VND', lat:21.0285,  lon:105.8542  },
  { key:'taiwan',      kor:'대만',       eng:'Taiwan',         flag:'🇹🇼', zone:'Asia/Taipei',          currency:'TWD', lat:25.0330,  lon:121.5654  },
  { key:'hongkong',    kor:'홍콩',       eng:'Hong Kong',      flag:'🇭🇰', zone:'Asia/Hong_Kong',       currency:'HKD', lat:22.3193,  lon:114.1694  },
  { key:'maldives',    kor:'몰디브',     eng:'Maldives',       flag:'🇲🇻', zone:'Indian/Maldives',      currency:'USD', lat:3.2028,   lon:73.2207   },
  { key:'netherlands', kor:'네덜란드',   eng:'Netherlands',    flag:'🇳🇱', zone:'Europe/Amsterdam',     currency:'EUR', lat:52.3676,  lon:4.9041    },
  { key:'greece',      kor:'그리스',     eng:'Greece',         flag:'🇬🇷', zone:'Europe/Athens',        currency:'EUR', lat:37.9838,  lon:23.7275   },
  { key:'malaysia',    kor:'말레이시아', eng:'Malaysia',       flag:'🇲🇾', zone:'Asia/Kuala_Lumpur',    currency:'MYR', lat:3.1390,   lon:101.6869  },
  { key:'mexico',      kor:'멕시코',     eng:'Mexico',         flag:'🇲🇽', zone:'America/Mexico_City',  currency:'MXN', lat:19.4326,  lon:-99.1332  },
  { key:'canada',      kor:'캐나다',     eng:'Canada',         flag:'🇨🇦', zone:'America/Toronto',      currency:'CAD', lat:43.6532,  lon:-79.3832  },
  { key:'germany',     kor:'독일',       eng:'Germany',        flag:'🇩🇪', zone:'Europe/Berlin',        currency:'EUR', lat:52.5200,  lon:13.4050   },
  { key:'portugal',    kor:'포르투갈',   eng:'Portugal',       flag:'🇵🇹', zone:'Europe/Lisbon',        currency:'EUR', lat:38.7169,  lon:-9.1395   },
  { key:'switzerland', kor:'스위스',     eng:'Switzerland',    flag:'🇨🇭', zone:'Europe/Zurich',        currency:'CHF', lat:47.3769,  lon:8.5417    },
  { key:'austria',     kor:'오스트리아', eng:'Austria',        flag:'🇦🇹', zone:'Europe/Vienna',        currency:'EUR', lat:48.2082,  lon:16.3738   },
  { key:'croatia',     kor:'크로아티아', eng:'Croatia',        flag:'🇭🇷', zone:'Europe/Zagreb',        currency:'EUR', lat:45.8150,  lon:15.9819   },
  { key:'cambodia',    kor:'캄보디아',   eng:'Cambodia',       flag:'🇰🇭', zone:'Asia/Phnom_Penh',      currency:'KHR', lat:11.5564,  lon:104.9282  },
  { key:'philippines', kor:'필리핀',     eng:'Philippines',    flag:'🇵🇭', zone:'Asia/Manila',          currency:'PHP', lat:14.5995,  lon:120.9842  },
  { key:'newzealand',  kor:'뉴질랜드',   eng:'New Zealand',    flag:'🇳🇿', zone:'Pacific/Auckland',     currency:'NZD', lat:-36.8485, lon:174.7633  },
  { key:'morocco',     kor:'모로코',     eng:'Morocco',        flag:'🇲🇦', zone:'Africa/Casablanca',    currency:'MAD', lat:33.5731,  lon:-7.5898   },
  { key:'peru',        kor:'페루',       eng:'Peru',           flag:'🇵🇪', zone:'America/Lima',         currency:'PEN', lat:-12.0464, lon:-77.0428  },
  { key:'hawaii',      kor:'하와이',     eng:'Hawaii',         flag:'🇺🇸', zone:'Pacific/Honolulu',     currency:'USD', lat:21.3069,  lon:-157.8583 },
  { key:'korea',       kor:'한국',       eng:'Korea',          flag:'🇰🇷', zone:'Asia/Seoul',           currency:'KRW', lat:37.5665,  lon:126.9780  },
  { key:'china',       kor:'중국',       eng:'China',          flag:'🇨🇳', zone:'Asia/Shanghai',        currency:'CNY', lat:39.9042,  lon:116.4074  },
  { key:'india',       kor:'인도',       eng:'India',          flag:'🇮🇳', zone:'Asia/Kolkata',         currency:'INR', lat:28.6139,  lon:77.2090   },
  { key:'brazil',      kor:'브라질',     eng:'Brazil',         flag:'🇧🇷', zone:'America/Sao_Paulo',    currency:'BRL', lat:-23.5505, lon:-46.6333  },
  // 유럽
  { key:'norway',      kor:'노르웨이',   eng:'Norway',         flag:'🇳🇴', zone:'Europe/Oslo',          currency:'NOK', lat:59.9139,  lon:10.7522   },
  { key:'sweden',      kor:'스웨덴',     eng:'Sweden',         flag:'🇸🇪', zone:'Europe/Stockholm',     currency:'SEK', lat:59.3293,  lon:18.0686   },
  { key:'denmark',     kor:'덴마크',     eng:'Denmark',        flag:'🇩🇰', zone:'Europe/Copenhagen',    currency:'DKK', lat:55.6761,  lon:12.5683   },
  { key:'finland',     kor:'핀란드',     eng:'Finland',        flag:'🇫🇮', zone:'Europe/Helsinki',      currency:'EUR', lat:60.1699,  lon:24.9384   },
  { key:'iceland',     kor:'아이슬란드', eng:'Iceland',        flag:'🇮🇸', zone:'Atlantic/Reykjavik',   currency:'ISK', lat:64.1265,  lon:-21.8174  },
  { key:'ireland',     kor:'아일랜드',   eng:'Ireland',        flag:'🇮🇪', zone:'Europe/Dublin',        currency:'EUR', lat:53.3498,  lon:-6.2603   },
  { key:'belgium',     kor:'벨기에',     eng:'Belgium',        flag:'🇧🇪', zone:'Europe/Brussels',      currency:'EUR', lat:50.8503,  lon:4.3517    },
  { key:'luxembourg',  kor:'룩셈부르크', eng:'Luxembourg',     flag:'🇱🇺', zone:'Europe/Luxembourg',    currency:'EUR', lat:49.6116,  lon:6.1319    },
  { key:'poland',      kor:'폴란드',     eng:'Poland',         flag:'🇵🇱', zone:'Europe/Warsaw',        currency:'PLN', lat:52.2297,  lon:21.0122   },
  { key:'hungary',     kor:'헝가리',     eng:'Hungary',        flag:'🇭🇺', zone:'Europe/Budapest',      currency:'HUF', lat:47.4979,  lon:19.0402   },
  { key:'slovakia',    kor:'슬로바키아', eng:'Slovakia',       flag:'🇸🇰', zone:'Europe/Bratislava',    currency:'EUR', lat:48.1486,  lon:17.1077   },
  { key:'slovenia',    kor:'슬로베니아', eng:'Slovenia',       flag:'🇸🇮', zone:'Europe/Ljubljana',     currency:'EUR', lat:46.0569,  lon:14.5058   },
  { key:'romania',     kor:'루마니아',   eng:'Romania',        flag:'🇷🇴', zone:'Europe/Bucharest',     currency:'RON', lat:44.4268,  lon:26.1025   },
  { key:'bulgaria',    kor:'불가리아',   eng:'Bulgaria',       flag:'🇧🇬', zone:'Europe/Sofia',         currency:'BGN', lat:42.6977,  lon:23.3219   },
  { key:'serbia',      kor:'세르비아',   eng:'Serbia',         flag:'🇷🇸', zone:'Europe/Belgrade',      currency:'RSD', lat:44.8176,  lon:20.4633   },
  { key:'bosnia',      kor:'보스니아',   eng:'Bosnia',         flag:'🇧🇦', zone:'Europe/Sarajevo',      currency:'BAM', lat:43.8563,  lon:18.4131   },
  { key:'montenegro',  kor:'몬테네그로', eng:'Montenegro',     flag:'🇲🇪', zone:'Europe/Podgorica',     currency:'EUR', lat:42.4304,  lon:19.2594   },
  { key:'albania',     kor:'알바니아',   eng:'Albania',        flag:'🇦🇱', zone:'Europe/Tirane',        currency:'ALL', lat:41.3275,  lon:19.8187   },
  { key:'northmacedonia', kor:'북마케도니아', eng:'North Macedonia', flag:'🇲🇰', zone:'Europe/Skopje', currency:'MKD', lat:41.9981, lon:21.4254   },
  { key:'estonia',     kor:'에스토니아', eng:'Estonia',        flag:'🇪🇪', zone:'Europe/Tallinn',       currency:'EUR', lat:59.4370,  lon:24.7536   },
  { key:'latvia',      kor:'라트비아',   eng:'Latvia',         flag:'🇱🇻', zone:'Europe/Riga',          currency:'EUR', lat:56.9496,  lon:24.1052   },
  { key:'lithuania',   kor:'리투아니아', eng:'Lithuania',      flag:'🇱🇹', zone:'Europe/Vilnius',       currency:'EUR', lat:54.6872,  lon:25.2797   },
  { key:'russia',      kor:'러시아',     eng:'Russia',         flag:'🇷🇺', zone:'Europe/Moscow',        currency:'RUB', lat:55.7558,  lon:37.6173   },
  { key:'ukraine',     kor:'우크라이나', eng:'Ukraine',        flag:'🇺🇦', zone:'Europe/Kiev',          currency:'UAH', lat:50.4501,  lon:30.5234   },
  { key:'malta',       kor:'몰타',       eng:'Malta',          flag:'🇲🇹', zone:'Europe/Malta',         currency:'EUR', lat:35.8997,  lon:14.5147   },
  { key:'cyprus',      kor:'키프로스',   eng:'Cyprus',         flag:'🇨🇾', zone:'Asia/Nicosia',         currency:'EUR', lat:35.1856,  lon:33.3823   },
  { key:'monaco',      kor:'모나코',     eng:'Monaco',         flag:'🇲🇨', zone:'Europe/Monaco',        currency:'EUR', lat:43.7384,  lon:7.4246    },
  { key:'andorra',     kor:'안도라',     eng:'Andorra',        flag:'🇦🇩', zone:'Europe/Andorra',       currency:'EUR', lat:42.5063,  lon:1.5218    },
  { key:'georgia',     kor:'조지아',     eng:'Georgia',        flag:'🇬🇪', zone:'Asia/Tbilisi',         currency:'GEL', lat:41.6938,  lon:44.8015   },
  { key:'armenia',     kor:'아르메니아', eng:'Armenia',        flag:'🇦🇲', zone:'Asia/Yerevan',         currency:'AMD', lat:40.1872,  lon:44.5152   },
  { key:'azerbaijan',  kor:'아제르바이잔',eng:'Azerbaijan',    flag:'🇦🇿', zone:'Asia/Baku',            currency:'AZN', lat:40.4093,  lon:49.8671   },
  // 중동
  { key:'israel',      kor:'이스라엘',   eng:'Israel',         flag:'🇮🇱', zone:'Asia/Jerusalem',       currency:'ILS', lat:31.7683,  lon:35.2137   },
  { key:'jordan',      kor:'요르단',     eng:'Jordan',         flag:'🇯🇴', zone:'Asia/Amman',           currency:'JOD', lat:31.9539,  lon:35.9106   },
  { key:'lebanon',     kor:'레바논',     eng:'Lebanon',        flag:'🇱🇧', zone:'Asia/Beirut',          currency:'LBP', lat:33.8886,  lon:35.4955   },
  { key:'saudi',       kor:'사우디아라비아', eng:'Saudi Arabia', flag:'🇸🇦', zone:'Asia/Riyadh',       currency:'SAR', lat:24.7136,  lon:46.6753   },
  { key:'qatar',       kor:'카타르',     eng:'Qatar',          flag:'🇶🇦', zone:'Asia/Qatar',           currency:'QAR', lat:25.2854,  lon:51.5310   },
  { key:'kuwait',      kor:'쿠웨이트',   eng:'Kuwait',         flag:'🇰🇼', zone:'Asia/Kuwait',          currency:'KWD', lat:29.3759,  lon:47.9774   },
  { key:'bahrain',     kor:'바레인',     eng:'Bahrain',        flag:'🇧🇭', zone:'Asia/Bahrain',         currency:'BHD', lat:26.0667,  lon:50.5577   },
  { key:'oman',        kor:'오만',       eng:'Oman',           flag:'🇴🇲', zone:'Asia/Muscat',          currency:'OMR', lat:23.5880,  lon:58.3829   },
  { key:'iran',        kor:'이란',       eng:'Iran',           flag:'🇮🇷', zone:'Asia/Tehran',          currency:'IRR', lat:35.6892,  lon:51.3890   },
  // 아시아
  { key:'myanmar',     kor:'미얀마',     eng:'Myanmar',        flag:'🇲🇲', zone:'Asia/Rangoon',         currency:'MMK', lat:16.8661,  lon:96.1951   },
  { key:'laos',        kor:'라오스',     eng:'Laos',           flag:'🇱🇦', zone:'Asia/Vientiane',       currency:'LAK', lat:17.9757,  lon:102.6331  },
  { key:'mongolia',    kor:'몽골',       eng:'Mongolia',       flag:'🇲🇳', zone:'Asia/Ulaanbaatar',     currency:'MNT', lat:47.8864,  lon:106.9057  },
  { key:'nepal',       kor:'네팔',       eng:'Nepal',          flag:'🇳🇵', zone:'Asia/Kathmandu',       currency:'NPR', lat:27.7172,  lon:85.3240   },
  { key:'srilanka',    kor:'스리랑카',   eng:'Sri Lanka',      flag:'🇱🇰', zone:'Asia/Colombo',         currency:'LKR', lat:6.9271,   lon:79.8612   },
  { key:'bangladesh',  kor:'방글라데시', eng:'Bangladesh',     flag:'🇧🇩', zone:'Asia/Dhaka',           currency:'BDT', lat:23.8103,  lon:90.4125   },
  { key:'pakistan',    kor:'파키스탄',   eng:'Pakistan',       flag:'🇵🇰', zone:'Asia/Karachi',         currency:'PKR', lat:33.6844,  lon:73.0479   },
  { key:'bhutan',      kor:'부탄',       eng:'Bhutan',         flag:'🇧🇹', zone:'Asia/Thimphu',         currency:'BTN', lat:27.4712,  lon:89.6339   },
  { key:'macau',       kor:'마카오',     eng:'Macau',          flag:'🇲🇴', zone:'Asia/Macau',           currency:'MOP', lat:22.1987,  lon:113.5439  },
  { key:'kazakhstan',  kor:'카자흐스탄', eng:'Kazakhstan',     flag:'🇰🇿', zone:'Asia/Almaty',          currency:'KZT', lat:51.1801,  lon:71.4460   },
  { key:'uzbekistan',  kor:'우즈베키스탄',eng:'Uzbekistan',   flag:'🇺🇿', zone:'Asia/Tashkent',        currency:'UZS', lat:41.2995,  lon:69.2401   },
  { key:'kyrgyzstan',  kor:'키르기스스탄',eng:'Kyrgyzstan',   flag:'🇰🇬', zone:'Asia/Bishkek',         currency:'KGS', lat:42.8746,  lon:74.5698   },
  // 아프리카
  { key:'egypt',       kor:'이집트',     eng:'Egypt',          flag:'🇪🇬', zone:'Africa/Cairo',         currency:'EGP', lat:30.0444,  lon:31.2357   },
  { key:'southafrica', kor:'남아프리카공화국', eng:'South Africa', flag:'🇿🇦', zone:'Africa/Johannesburg', currency:'ZAR', lat:-25.7479, lon:28.2293  },
  { key:'kenya',       kor:'케냐',       eng:'Kenya',          flag:'🇰🇪', zone:'Africa/Nairobi',       currency:'KES', lat:-1.2921,  lon:36.8219   },
  { key:'tanzania',    kor:'탄자니아',   eng:'Tanzania',       flag:'🇹🇿', zone:'Africa/Dar_es_Salaam', currency:'TZS', lat:-6.7924,  lon:39.2083   },
  { key:'ethiopia',    kor:'에티오피아', eng:'Ethiopia',       flag:'🇪🇹', zone:'Africa/Addis_Ababa',   currency:'ETB', lat:9.0320,   lon:38.7469   },
  { key:'tunisia',     kor:'튀니지',     eng:'Tunisia',        flag:'🇹🇳', zone:'Africa/Tunis',         currency:'TND', lat:36.8065,  lon:10.1815   },
  { key:'ghana',       kor:'가나',       eng:'Ghana',          flag:'🇬🇭', zone:'Africa/Accra',         currency:'GHS', lat:5.6037,   lon:-0.1870   },
  { key:'nigeria',     kor:'나이지리아', eng:'Nigeria',        flag:'🇳🇬', zone:'Africa/Lagos',         currency:'NGN', lat:6.5244,   lon:3.3792    },
  { key:'senegal',     kor:'세네갈',     eng:'Senegal',        flag:'🇸🇳', zone:'Africa/Dakar',         currency:'XOF', lat:14.7167,  lon:-17.4677  },
  { key:'mauritius',   kor:'모리셔스',   eng:'Mauritius',      flag:'🇲🇺', zone:'Indian/Mauritius',     currency:'MUR', lat:-20.1609, lon:57.4977   },
  { key:'seychelles',  kor:'세이셸',     eng:'Seychelles',     flag:'🇸🇨', zone:'Indian/Mahe',          currency:'SCR', lat:-4.6796,  lon:55.4920   },
  { key:'madagascar',  kor:'마다가스카르',eng:'Madagascar',    flag:'🇲🇬', zone:'Indian/Antananarivo',  currency:'MGA', lat:-18.9137, lon:47.5361   },
  { key:'zimbabwe',    kor:'짐바브웨',   eng:'Zimbabwe',       flag:'🇿🇼', zone:'Africa/Harare',        currency:'USD', lat:-17.8252, lon:31.0335   },
  { key:'zambia',      kor:'잠비아',     eng:'Zambia',         flag:'🇿🇲', zone:'Africa/Lusaka',        currency:'ZMW', lat:-15.4167, lon:28.2833   },
  { key:'algeria',     kor:'알제리',     eng:'Algeria',        flag:'🇩🇿', zone:'Africa/Algiers',       currency:'DZD', lat:36.7372,  lon:3.0865    },
  { key:'uganda',      kor:'우간다',     eng:'Uganda',         flag:'🇺🇬', zone:'Africa/Kampala',       currency:'UGX', lat:0.3476,   lon:32.5825   },
  // 아메리카
  { key:'argentina',   kor:'아르헨티나', eng:'Argentina',      flag:'🇦🇷', zone:'America/Argentina/Buenos_Aires', currency:'ARS', lat:-34.6037, lon:-58.3816 },
  { key:'chile',       kor:'칠레',       eng:'Chile',          flag:'🇨🇱', zone:'America/Santiago',     currency:'CLP', lat:-33.4489, lon:-70.6693  },
  { key:'colombia',    kor:'콜롬비아',   eng:'Colombia',       flag:'🇨🇴', zone:'America/Bogota',       currency:'COP', lat:4.7110,   lon:-74.0721  },
  { key:'ecuador',     kor:'에콰도르',   eng:'Ecuador',        flag:'🇪🇨', zone:'America/Guayaquil',    currency:'USD', lat:-0.1807,  lon:-78.4678  },
  { key:'bolivia',     kor:'볼리비아',   eng:'Bolivia',        flag:'🇧🇴', zone:'America/La_Paz',       currency:'BOB', lat:-16.5000, lon:-68.1500  },
  { key:'uruguay',     kor:'우루과이',   eng:'Uruguay',        flag:'🇺🇾', zone:'America/Montevideo',   currency:'UYU', lat:-34.9011, lon:-56.1645  },
  { key:'paraguay',    kor:'파라과이',   eng:'Paraguay',       flag:'🇵🇾', zone:'America/Asuncion',     currency:'PYG', lat:-25.2637, lon:-57.5759  },
  { key:'venezuela',   kor:'베네수엘라', eng:'Venezuela',      flag:'🇻🇪', zone:'America/Caracas',      currency:'VES', lat:10.4806,  lon:-66.9036  },
  { key:'cuba',        kor:'쿠바',       eng:'Cuba',           flag:'🇨🇺', zone:'America/Havana',       currency:'CUP', lat:23.1136,  lon:-82.3666  },
  { key:'dominican',   kor:'도미니카공화국', eng:'Dominican Republic', flag:'🇩🇴', zone:'America/Santo_Domingo', currency:'DOP', lat:18.4861, lon:-69.9312 },
  { key:'jamaica',     kor:'자메이카',   eng:'Jamaica',        flag:'🇯🇲', zone:'America/Jamaica',      currency:'JMD', lat:17.9988,  lon:-76.7932  },
  { key:'costarica',   kor:'코스타리카', eng:'Costa Rica',     flag:'🇨🇷', zone:'America/Costa_Rica',   currency:'CRC', lat:9.9281,   lon:-84.0907  },
  { key:'panama',      kor:'파나마',     eng:'Panama',         flag:'🇵🇦', zone:'America/Panama',       currency:'USD', lat:8.9943,   lon:-79.5188  },
  { key:'guatemala',   kor:'과테말라',   eng:'Guatemala',      flag:'🇬🇹', zone:'America/Guatemala',    currency:'GTQ', lat:14.6349,  lon:-90.5069  },
  // 오세아니아
  { key:'fiji',        kor:'피지',       eng:'Fiji',           flag:'🇫🇯', zone:'Pacific/Fiji',         currency:'FJD', lat:-18.1248, lon:178.4501  },
  { key:'samoa',       kor:'사모아',     eng:'Samoa',          flag:'🇼🇸', zone:'Pacific/Apia',         currency:'WST', lat:-13.8506, lon:-171.7513 },
  { key:'palau',       kor:'팔라우',     eng:'Palau',          flag:'🇵🇼', zone:'Pacific/Palau',        currency:'USD', lat:7.5149,   lon:134.5825  },
  { key:'guam',        kor:'괌',         eng:'Guam',           flag:'🇬🇺', zone:'Pacific/Guam',         currency:'USD', lat:13.4443,  lon:144.7937  },
  { key:'saipan',      kor:'사이판',     eng:'Saipan',         flag:'🇲🇵', zone:'Pacific/Saipan',       currency:'USD', lat:15.1778,  lon:145.7553  },
];

const CITIES_BY_KEY = {
  japan:       [{kor:'도쿄',eng:'Tokyo'},{kor:'오사카',eng:'Osaka'},{kor:'교토',eng:'Kyoto'},{kor:'삿포로',eng:'Sapporo'},{kor:'후쿠오카',eng:'Fukuoka'},{kor:'나고야',eng:'Nagoya'},{kor:'나라',eng:'Nara'},{kor:'고베',eng:'Kobe'},{kor:'히로시마',eng:'Hiroshima'},{kor:'오키나와',eng:'Okinawa'},{kor:'하코다테',eng:'Hakodate'},{kor:'아사히카와',eng:'Asahikawa'},{kor:'가나자와',eng:'Kanazawa'},{kor:'마쓰야마',eng:'Matsuyama'},{kor:'나가사키',eng:'Nagasaki'},{kor:'구마모토',eng:'Kumamoto'},{kor:'센다이',eng:'Sendai'},{kor:'닛코',eng:'Nikko'},{kor:'하코네',eng:'Hakone'},{kor:'시즈오카',eng:'Shizuoka'},{kor:'오이타',eng:'Oita'},{kor:'미야자키',eng:'Miyazaki'},{kor:'아오모리',eng:'Aomori'}],
  france:      [{kor:'파리',eng:'Paris'},{kor:'니스',eng:'Nice'},{kor:'마르세유',eng:'Marseille'},{kor:'리옹',eng:'Lyon'},{kor:'보르도',eng:'Bordeaux'},{kor:'스트라스부르',eng:'Strasbourg'},{kor:'몽생미셸',eng:'Mont Saint-Michel'},{kor:'칸',eng:'Cannes'},{kor:'모나코',eng:'Monaco'},{kor:'낭트',eng:'Nantes'},{kor:'툴루즈',eng:'Toulouse'},{kor:'릴',eng:'Lille'},{kor:'렌',eng:'Rennes'},{kor:'엑상프로방스',eng:'Aix-en-Provence'},{kor:'아비뇽',eng:'Avignon'},{kor:'앙티브',eng:'Antibes'},{kor:'몽펠리에',eng:'Montpellier'},{kor:'샤모니',eng:'Chamonix'}],
  usa:         [{kor:'뉴욕',eng:'New York'},{kor:'로스앤젤레스',eng:'Los Angeles'},{kor:'샌프란시스코',eng:'San Francisco'},{kor:'시카고',eng:'Chicago'},{kor:'라스베가스',eng:'Las Vegas'},{kor:'마이애미',eng:'Miami'},{kor:'보스턴',eng:'Boston'},{kor:'워싱턴',eng:'Washington DC'},{kor:'시애틀',eng:'Seattle'},{kor:'샌디에이고',eng:'San Diego'},{kor:'뉴올리언스',eng:'New Orleans'},{kor:'내슈빌',eng:'Nashville'},{kor:'포틀랜드',eng:'Portland'},{kor:'덴버',eng:'Denver'},{kor:'피닉스',eng:'Phoenix'},{kor:'샬럿',eng:'Charlotte'},{kor:'애틀랜타',eng:'Atlanta'},{kor:'필라델피아',eng:'Philadelphia'},{kor:'오스틴',eng:'Austin'},{kor:'미니애폴리스',eng:'Minneapolis'},{kor:'그랜드캐니언',eng:'Grand Canyon'},{kor:'옐로스톤',eng:'Yellowstone'},{kor:'요세미티',eng:'Yosemite'}],
  uk:          [{kor:'런던',eng:'London'},{kor:'에든버러',eng:'Edinburgh'},{kor:'맨체스터',eng:'Manchester'},{kor:'옥스퍼드',eng:'Oxford'},{kor:'캠브리지',eng:'Cambridge'},{kor:'바스',eng:'Bath'},{kor:'요크',eng:'York'},{kor:'리버풀',eng:'Liverpool'},{kor:'버밍엄',eng:'Birmingham'},{kor:'글래스고',eng:'Glasgow'},{kor:'브리스톨',eng:'Bristol'},{kor:'카디프',eng:'Cardiff'},{kor:'코츠월즈',eng:'Cotswolds'},{kor:'스코틀랜드 하이랜드',eng:'Scottish Highlands'},{kor:'브라이턴',eng:'Brighton'},{kor:'윈저',eng:'Windsor'}],
  thailand:    [{kor:'방콕',eng:'Bangkok'},{kor:'치앙마이',eng:'Chiang Mai'},{kor:'푸켓',eng:'Phuket'},{kor:'파타야',eng:'Pattaya'},{kor:'코사무이',eng:'Koh Samui'},{kor:'아유타야',eng:'Ayutthaya'},{kor:'크라비',eng:'Krabi'},{kor:'코창',eng:'Koh Chang'},{kor:'코피피',eng:'Koh Phi Phi'},{kor:'파이',eng:'Pai'},{kor:'수코타이',eng:'Sukhothai'},{kor:'치앙라이',eng:'Chiang Rai'},{kor:'후아힌',eng:'Hua Hin'},{kor:'코리페',eng:'Koh Lipe'}],
  indonesia:   [{kor:'발리',eng:'Bali'},{kor:'자카르타',eng:'Jakarta'},{kor:'롬복',eng:'Lombok'},{kor:'코모도',eng:'Komodo'},{kor:'요그야카르타',eng:'Yogyakarta'},{kor:'수라바야',eng:'Surabaya'},{kor:'메단',eng:'Medan'},{kor:'마나도',eng:'Manado'},{kor:'라부안바조',eng:'Labuan Bajo'},{kor:'길리섬',eng:'Gili Islands'},{kor:'발리쿠파팡',eng:'Balikpapan'},{kor:'플로레스',eng:'Flores'}],
  singapore:   [{kor:'싱가포르',eng:'Singapore'},{kor:'센토사',eng:'Sentosa'},{kor:'마리나베이',eng:'Marina Bay'},{kor:'차이나타운',eng:'Chinatown'},{kor:'리틀인디아',eng:'Little India'}],
  spain:       [{kor:'바르셀로나',eng:'Barcelona'},{kor:'마드리드',eng:'Madrid'},{kor:'세비야',eng:'Seville'},{kor:'그라나다',eng:'Granada'},{kor:'발렌시아',eng:'Valencia'},{kor:'빌바오',eng:'Bilbao'},{kor:'말라가',eng:'Malaga'},{kor:'산세바스티안',eng:'San Sebastian'},{kor:'코르도바',eng:'Córdoba'},{kor:'팜플로나',eng:'Pamplona'},{kor:'톨레도',eng:'Toledo'},{kor:'살라망카',eng:'Salamanca'},{kor:'이비사',eng:'Ibiza'},{kor:'마요르카',eng:'Mallorca'},{kor:'테네리페',eng:'Tenerife'},{kor:'알리칸테',eng:'Alicante'},{kor:'산티아고데콤포스텔라',eng:'Santiago de Compostela'},{kor:'세고비아',eng:'Segovia'}],
  italy:       [{kor:'로마',eng:'Rome'},{kor:'밀라노',eng:'Milan'},{kor:'베네치아',eng:'Venice'},{kor:'피렌체',eng:'Florence'},{kor:'나폴리',eng:'Naples'},{kor:'아말피',eng:'Amalfi'},{kor:'시칠리아',eng:'Sicily'},{kor:'볼로냐',eng:'Bologna'},{kor:'토리노',eng:'Turin'},{kor:'친퀘테레',eng:'Cinque Terre'},{kor:'소렌토',eng:'Sorrento'},{kor:'시에나',eng:'Siena'},{kor:'아시시',eng:'Assisi'},{kor:'베로나',eng:'Verona'},{kor:'트리에스테',eng:'Trieste'},{kor:'페루자',eng:'Perugia'},{kor:'팔레르모',eng:'Palermo'},{kor:'카타니아',eng:'Catania'},{kor:'바리',eng:'Bari'},{kor:'레체',eng:'Lecce'},{kor:'제노바',eng:'Genoa'},{kor:'파르마',eng:'Parma'},{kor:'코모호수',eng:'Lake Como'},{kor:'포지타노',eng:'Positano'}],
  australia:   [{kor:'시드니',eng:'Sydney'},{kor:'멜버른',eng:'Melbourne'},{kor:'브리즈번',eng:'Brisbane'},{kor:'골드코스트',eng:'Gold Coast'},{kor:'케언즈',eng:'Cairns'},{kor:'퍼스',eng:'Perth'},{kor:'애들레이드',eng:'Adelaide'},{kor:'다윈',eng:'Darwin'},{kor:'호바트',eng:'Hobart'},{kor:'울루루',eng:'Uluru'},{kor:'그레이트배리어리프',eng:'Great Barrier Reef'},{kor:'포트더글라스',eng:'Port Douglas'},{kor:'블루마운틴',eng:'Blue Mountains'},{kor:'바이런베이',eng:'Byron Bay'}],
  uae:         [{kor:'두바이',eng:'Dubai'},{kor:'아부다비',eng:'Abu Dhabi'},{kor:'샤르자',eng:'Sharjah'},{kor:'라스알카이마',eng:'Ras Al Khaimah'},{kor:'후자이라',eng:'Fujairah'}],
  turkey:      [{kor:'이스탄불',eng:'Istanbul'},{kor:'카파도키아',eng:'Cappadocia'},{kor:'안탈리아',eng:'Antalya'},{kor:'이즈미르',eng:'Izmir'},{kor:'보드룸',eng:'Bodrum'},{kor:'에페소',eng:'Ephesus'},{kor:'파묵칼레',eng:'Pamukkale'},{kor:'트로이',eng:'Troy'},{kor:'앙카라',eng:'Ankara'},{kor:'알라냐',eng:'Alanya'},{kor:'페티예',eng:'Fethiye'},{kor:'마르마리스',eng:'Marmaris'},{kor:'트라브존',eng:'Trabzon'}],
  vietnam:     [{kor:'하노이',eng:'Hanoi'},{kor:'호치민',eng:'Ho Chi Minh'},{kor:'다낭',eng:'Da Nang'},{kor:'호이안',eng:'Hoi An'},{kor:'나트랑',eng:'Nha Trang'},{kor:'하롱베이',eng:'Ha Long Bay'},{kor:'후에',eng:'Hue'},{kor:'달랏',eng:'Da Lat'},{kor:'푸꾸옥',eng:'Phu Quoc'},{kor:'사파',eng:'Sapa'},{kor:'무이네',eng:'Mui Ne'},{kor:'꼰다오',eng:'Con Dao'},{kor:'하지앙',eng:'Ha Giang'}],
  taiwan:      [{kor:'타이베이',eng:'Taipei'},{kor:'타이중',eng:'Taichung'},{kor:'타이난',eng:'Tainan'},{kor:'가오슝',eng:'Kaohsiung'},{kor:'화롄',eng:'Hualien'},{kor:'지우펀',eng:'Jiufen'},{kor:'예류',eng:'Yehliu'},{kor:'선저우',eng:'Alishan'},{kor:'타이둥',eng:'Taitung'},{kor:'루강',eng:'Lukang'},{kor:'핑시',eng:'Pingxi'}],
  hongkong:    [{kor:'홍콩',eng:'Hong Kong'},{kor:'란타우섬',eng:'Lantau Island'},{kor:'빅토리아피크',eng:'Victoria Peak'},{kor:'마카오',eng:'Macau'}],
  maldives:    [{kor:'말레',eng:'Male'},{kor:'마푸시',eng:'Maafushi'},{kor:'바아환초',eng:'Baa Atoll'},{kor:'아리환초',eng:'Ari Atoll'},{kor:'라무환초',eng:'Lamu Atoll'},{kor:'북말레환초',eng:'North Malé Atoll'}],
  netherlands: [{kor:'암스테르담',eng:'Amsterdam'},{kor:'로테르담',eng:'Rotterdam'},{kor:'헤이그',eng:'The Hague'},{kor:'위트레흐트',eng:'Utrecht'},{kor:'잔세스칸스',eng:'Zaanse Schans'},{kor:'하를럼',eng:'Haarlem'},{kor:'마스트리흐트',eng:'Maastricht'},{kor:'에인트호번',eng:'Eindhoven'},{kor:'레이던',eng:'Leiden'},{kor:'호른',eng:'Hoorn'},{kor:'델프트',eng:'Delft'}],
  greece:      [{kor:'아테네',eng:'Athens'},{kor:'산토리니',eng:'Santorini'},{kor:'미코노스',eng:'Mykonos'},{kor:'테살로니키',eng:'Thessaloniki'},{kor:'크레타',eng:'Crete'},{kor:'로도스',eng:'Rhodes'},{kor:'코르푸',eng:'Corfu'},{kor:'파트라',eng:'Patras'},{kor:'낙소스',eng:'Naxos'},{kor:'파로스',eng:'Paros'},{kor:'자킨토스',eng:'Zakynthos'},{kor:'케팔로니아',eng:'Kefalonia'},{kor:'델포이',eng:'Delphi'},{kor:'올림피아',eng:'Olympia'}],
  malaysia:    [{kor:'쿠알라룸푸르',eng:'Kuala Lumpur'},{kor:'페낭',eng:'Penang'},{kor:'코타키나발루',eng:'Kota Kinabalu'},{kor:'말라카',eng:'Malacca'},{kor:'랑카위',eng:'Langkawi'},{kor:'쿠칭',eng:'Kuching'},{kor:'조호르바루',eng:'Johor Bahru'},{kor:'이포',eng:'Ipoh'},{kor:'캐머런하이랜드',eng:'Cameron Highlands'},{kor:'티오만섬',eng:'Tioman Island'}],
  mexico:      [{kor:'멕시코시티',eng:'Mexico City'},{kor:'칸쿤',eng:'Cancun'},{kor:'과달라하라',eng:'Guadalajara'},{kor:'오아하카',eng:'Oaxaca'},{kor:'툴룸',eng:'Tulum'},{kor:'플라야델카르멘',eng:'Playa del Carmen'},{kor:'메리다',eng:'Mérida'},{kor:'산크리스토발',eng:'San Cristóbal'},{kor:'케레타로',eng:'Querétaro'},{kor:'과나후아토',eng:'Guanajuato'},{kor:'푸에블라',eng:'Puebla'},{kor:'바하칼리포르니아',eng:'Baja California'},{kor:'이슬라무헤레스',eng:'Isla Mujeres'}],
  canada:      [{kor:'밴쿠버',eng:'Vancouver'},{kor:'토론토',eng:'Toronto'},{kor:'몬트리올',eng:'Montreal'},{kor:'퀘벡시티',eng:'Quebec City'},{kor:'밴프',eng:'Banff'},{kor:'캘거리',eng:'Calgary'},{kor:'오타와',eng:'Ottawa'},{kor:'빅토리아',eng:'Victoria'},{kor:'할리팩스',eng:'Halifax'},{kor:'나이아가라폭포',eng:'Niagara Falls'},{kor:'휘슬러',eng:'Whistler'},{kor:'재스퍼',eng:'Jasper'},{kor:'에드먼턴',eng:'Edmonton'},{kor:'위니펙',eng:'Winnipeg'}],
  germany:     [{kor:'베를린',eng:'Berlin'},{kor:'뮌헨',eng:'Munich'},{kor:'함부르크',eng:'Hamburg'},{kor:'프랑크푸르트',eng:'Frankfurt'},{kor:'쾰른',eng:'Cologne'},{kor:'드레스덴',eng:'Dresden'},{kor:'하이델베르크',eng:'Heidelberg'},{kor:'로텐부르크',eng:'Rothenburg'},{kor:'뉘른베르크',eng:'Nuremberg'},{kor:'슈투트가르트',eng:'Stuttgart'},{kor:'뒤셀도르프',eng:'Düsseldorf'},{kor:'라이프치히',eng:'Leipzig'},{kor:'브레멘',eng:'Bremen'},{kor:'퓌센',eng:'Füssen'},{kor:'뤼데스하임',eng:'Rüdesheim'},{kor:'바이마르',eng:'Weimar'},{kor:'뤼베크',eng:'Lübeck'}],
  portugal:    [{kor:'리스본',eng:'Lisbon'},{kor:'포르투',eng:'Porto'},{kor:'알가르브',eng:'Algarve'},{kor:'신트라',eng:'Sintra'},{kor:'코임브라',eng:'Coimbra'},{kor:'오비도스',eng:'Óbidos'},{kor:'에보라',eng:'Évora'},{kor:'라고스',eng:'Lagos'},{kor:'알부페이라',eng:'Albufeira'},{kor:'아소레스',eng:'Azores'},{kor:'마데이라',eng:'Madeira'},{kor:'카스카이스',eng:'Cascais'}],
  switzerland: [{kor:'취리히',eng:'Zurich'},{kor:'루체른',eng:'Lucerne'},{kor:'제네바',eng:'Geneva'},{kor:'인터라켄',eng:'Interlaken'},{kor:'베른',eng:'Bern'},{kor:'체르마트',eng:'Zermatt'},{kor:'그린델발트',eng:'Grindelwald'},{kor:'로잔',eng:'Lausanne'},{kor:'바젤',eng:'Basel'},{kor:'장크트갈렌',eng:'St. Gallen'},{kor:'루가노',eng:'Lugano'},{kor:'다보스',eng:'Davos'},{kor:'몽트뢰',eng:'Montreux'}],
  austria:     [{kor:'빈',eng:'Vienna'},{kor:'잘츠부르크',eng:'Salzburg'},{kor:'인스브루크',eng:'Innsbruck'},{kor:'그라츠',eng:'Graz'},{kor:'할슈타트',eng:'Hallstatt'},{kor:'린츠',eng:'Linz'},{kor:'클라겐푸르트',eng:'Klagenfurt'},{kor:'장크트볼프강',eng:'St. Wolfgang'},{kor:'마이어호펜',eng:'Mayrhofen'},{kor:'바트이슐',eng:'Bad Ischl'}],
  croatia:     [{kor:'두브로브니크',eng:'Dubrovnik'},{kor:'스플리트',eng:'Split'},{kor:'자그레브',eng:'Zagreb'},{kor:'흐바르',eng:'Hvar'},{kor:'플리트비체',eng:'Plitvice'},{kor:'로빈',eng:'Rovinj'},{kor:'코르쿨라',eng:'Korčula'},{kor:'자다르',eng:'Zadar'},{kor:'풀라',eng:'Pula'},{kor:'브라치섬',eng:'Brač'}],
  cambodia:    [{kor:'씨엠립',eng:'Siem Reap'},{kor:'프놈펜',eng:'Phnom Penh'},{kor:'시하누크빌',eng:'Sihanoukville'},{kor:'캄폿',eng:'Kampot'},{kor:'케프',eng:'Kep'},{kor:'바탐방',eng:'Battambang'}],
  philippines: [{kor:'마닐라',eng:'Manila'},{kor:'세부',eng:'Cebu'},{kor:'보라카이',eng:'Boracay'},{kor:'팔라완',eng:'Palawan'},{kor:'다바오',eng:'Davao'},{kor:'바기오',eng:'Baguio'},{kor:'시아르가오',eng:'Siargao'},{kor:'엘니도',eng:'El Nido'},{kor:'코론',eng:'Coron'},{kor:'딜리만',eng:'Dumaguete'},{kor:'일로일로',eng:'Iloilo'},{kor:'바타네스',eng:'Batanes'}],
  newzealand:  [{kor:'오클랜드',eng:'Auckland'},{kor:'퀸스타운',eng:'Queenstown'},{kor:'크라이스트처치',eng:'Christchurch'},{kor:'웰링턴',eng:'Wellington'},{kor:'로토루아',eng:'Rotorua'},{kor:'더니든',eng:'Dunedin'},{kor:'와나카',eng:'Wanaka'},{kor:'해밀턴',eng:'Hamilton'},{kor:'피오르드랜드',eng:'Fiordland'},{kor:'아벨태즈먼',eng:'Abel Tasman'},{kor:'밀퍼드사운드',eng:'Milford Sound'}],
  morocco:     [{kor:'마라케시',eng:'Marrakech'},{kor:'페스',eng:'Fes'},{kor:'카사블랑카',eng:'Casablanca'},{kor:'쉐프샤우엔',eng:'Chefchaouen'},{kor:'에사우이라',eng:'Essaouira'},{kor:'라바트',eng:'Rabat'},{kor:'메크네스',eng:'Meknes'},{kor:'탕헤르',eng:'Tangier'},{kor:'와르자자트',eng:'Ouarzazate'},{kor:'사하라사막',eng:'Sahara Desert'},{kor:'아이트벤하두',eng:'Aït Benhaddou'}],
  peru:        [{kor:'리마',eng:'Lima'},{kor:'쿠스코',eng:'Cusco'},{kor:'마추픽추',eng:'Machu Picchu'},{kor:'아레키파',eng:'Arequipa'},{kor:'티티카카호수',eng:'Lake Titicaca'},{kor:'이카',eng:'Ica'},{kor:'트루히요',eng:'Trujillo'},{kor:'와라즈',eng:'Huaraz'},{kor:'이키토스',eng:'Iquitos'}],
  hawaii:      [{kor:'호놀룰루',eng:'Honolulu'},{kor:'마우이',eng:'Maui'},{kor:'카우아이',eng:'Kauai'},{kor:'빅아일랜드',eng:'Big Island'},{kor:'몰로카이',eng:'Molokai'},{kor:'라나이',eng:'Lanai'},{kor:'와이키키',eng:'Waikiki'},{kor:'노스쇼어',eng:'North Shore'}],
  korea:       [{kor:'서울',eng:'Seoul'},{kor:'부산',eng:'Busan'},{kor:'제주',eng:'Jeju'},{kor:'경주',eng:'Gyeongju'},{kor:'인천',eng:'Incheon'},{kor:'전주',eng:'Jeonju'},{kor:'강릉',eng:'Gangneung'},{kor:'춘천',eng:'Chuncheon'},{kor:'속초',eng:'Sokcho'},{kor:'여수',eng:'Yeosu'},{kor:'광주',eng:'Gwangju'},{kor:'대구',eng:'Daegu'},{kor:'대전',eng:'Daejeon'},{kor:'안동',eng:'Andong'},{kor:'평창',eng:'Pyeongchang'},{kor:'통영',eng:'Tongyeong'}],
  china:       [{kor:'베이징',eng:'Beijing'},{kor:'상하이',eng:'Shanghai'},{kor:'청두',eng:'Chengdu'},{kor:'시안',eng:"Xi'an"},{kor:'구이린',eng:'Guilin'},{kor:'항저우',eng:'Hangzhou'},{kor:'쑤저우',eng:'Suzhou'},{kor:'장자제',eng:'Zhangjiajie'},{kor:'샤먼',eng:'Xiamen'},{kor:'리장',eng:'Lijiang'},{kor:'충칭',eng:'Chongqing'},{kor:'광저우',eng:'Guangzhou'},{kor:'하얼빈',eng:'Harbin'},{kor:'황산',eng:'Huangshan'},{kor:'쿤밍',eng:'Kunming'},{kor:'시솽반나',eng:'Xishuangbanna'},{kor:'둔황',eng:'Dunhuang'},{kor:'우전',eng:'Wuzhen'}],
  india:       [{kor:'뭄바이',eng:'Mumbai'},{kor:'델리',eng:'Delhi'},{kor:'아그라',eng:'Agra'},{kor:'자이푸르',eng:'Jaipur'},{kor:'고아',eng:'Goa'},{kor:'바라나시',eng:'Varanasi'},{kor:'첸나이',eng:'Chennai'},{kor:'콜카타',eng:'Kolkata'},{kor:'케랄라',eng:'Kerala'},{kor:'우다이푸르',eng:'Udaipur'},{kor:'조드푸르',eng:'Jodhpur'},{kor:'다르질링',eng:'Darjeeling'},{kor:'아우랑가바드',eng:'Aurangabad'},{kor:'하이데라바드',eng:'Hyderabad'},{kor:'암리차르',eng:'Amritsar'},{kor:'심라',eng:'Shimla'},{kor:'마날리',eng:'Manali'}],
  brazil:      [{kor:'상파울루',eng:'São Paulo'},{kor:'리우데자네이루',eng:'Rio de Janeiro'},{kor:'살바도르',eng:'Salvador'},{kor:'이과수',eng:'Iguazu'},{kor:'포르탈레자',eng:'Fortaleza'},{kor:'마나우스',eng:'Manaus'},{kor:'플로리아노폴리스',eng:'Florianópolis'},{kor:'벨루오리존치',eng:'Belo Horizonte'},{kor:'레시페',eng:'Recife'},{kor:'나탈',eng:'Natal'},{kor:'봉보니토',eng:'Bonito'},{kor:'파라티',eng:'Paraty'}],
  norway:      [{kor:'오슬로',eng:'Oslo'},{kor:'베르겐',eng:'Bergen'},{kor:'트롬소',eng:'Tromsø'},{kor:'플롬',eng:'Flam'},{kor:'오레순',eng:'Ålesund'},{kor:'스타방에르',eng:'Stavanger'},{kor:'트론헤임',eng:'Trondheim'},{kor:'게이랑에르',eng:'Geiranger'},{kor:'로포텐',eng:'Lofoten'},{kor:'송네피오르',eng:'Sognefjord'},{kor:'보도',eng:'Bodø'}],
  sweden:      [{kor:'스톡홀름',eng:'Stockholm'},{kor:'예테보리',eng:'Gothenburg'},{kor:'말뫼',eng:'Malmö'},{kor:'웁살라',eng:'Uppsala'},{kor:'비스비',eng:'Visby'},{kor:'키루나',eng:'Kiruna'},{kor:'예블레',eng:'Gävle'},{kor:'린셰핑',eng:'Linköping'},{kor:'칼마르',eng:'Kalmar'}],
  denmark:     [{kor:'코펜하겐',eng:'Copenhagen'},{kor:'오르후스',eng:'Aarhus'},{kor:'오덴세',eng:'Odense'},{kor:'알보르',eng:'Aalborg'},{kor:'에스비에르',eng:'Esbjerg'},{kor:'론네',eng:'Rønne'},{kor:'스케겐',eng:'Skagen'}],
  finland:     [{kor:'헬싱키',eng:'Helsinki'},{kor:'로바니에미',eng:'Rovaniemi'},{kor:'탐페레',eng:'Tampere'},{kor:'투르쿠',eng:'Turku'},{kor:'오울루',eng:'Oulu'},{kor:'사리셀카',eng:'Saariselkä'},{kor:'레비',eng:'Levi'},{kor:'포르보',eng:'Porvoo'}],
  iceland:     [{kor:'레이캬비크',eng:'Reykjavik'},{kor:'아쿠레이리',eng:'Akureyri'},{kor:'블루라군',eng:'Blue Lagoon'},{kor:'비크',eng:'Vik'},{kor:'호픈',eng:'Höfn'},{kor:'스나이페들스네스',eng:'Snæfellsnes'},{kor:'아이야피야틀라이외쿠들',eng:'Eyjafjallajökull'},{kor:'스카프타펠',eng:'Skaftafell'},{kor:'미바튼호수',eng:'Lake Mývatn'}],
  ireland:     [{kor:'더블린',eng:'Dublin'},{kor:'코크',eng:'Cork'},{kor:'갤웨이',eng:'Galway'},{kor:'킬라니',eng:'Killarney'},{kor:'리머릭',eng:'Limerick'},{kor:'워터퍼드',eng:'Waterford'},{kor:'도니골',eng:'Donegal'},{kor:'클리프스오브모허',eng:'Cliffs of Moher'},{kor:'아란섬',eng:'Aran Islands'}],
  belgium:     [{kor:'브뤼셀',eng:'Brussels'},{kor:'브뤼헤',eng:'Bruges'},{kor:'겐트',eng:'Ghent'},{kor:'안트베르펜',eng:'Antwerp'},{kor:'리에주',eng:'Liège'},{kor:'나뮈르',eng:'Namur'},{kor:'딘낭',eng:'Dinant'},{kor:'이프르',eng:'Ypres'},{kor:'메헬렌',eng:'Mechelen'}],
  poland:      [{kor:'바르샤바',eng:'Warsaw'},{kor:'크라쿠프',eng:'Krakow'},{kor:'그단스크',eng:'Gdansk'},{kor:'브로츠와프',eng:'Wroclaw'},{kor:'포즈난',eng:'Poznań'},{kor:'아우슈비츠',eng:'Auschwitz'},{kor:'자코파네',eng:'Zakopane'},{kor:'루블린',eng:'Lublin'},{kor:'비아워비에자',eng:'Białowieża'},{kor:'토룬',eng:'Toruń'}],
  hungary:     [{kor:'부다페스트',eng:'Budapest'},{kor:'에게르',eng:'Eger'},{kor:'페치',eng:'Pécs'},{kor:'죄르',eng:'Győr'},{kor:'발라톤호수',eng:'Lake Balaton'},{kor:'케스테이',eng:'Keszthely'},{kor:'디요르',eng:'Debrecen'},{kor:'솜보르',eng:'Sopron'}],
  czechia:     [{kor:'프라하',eng:'Prague'},{kor:'체스키크룸로프',eng:'Cesky Krumlov'},{kor:'브르노',eng:'Brno'},{kor:'올로모우츠',eng:'Olomouc'},{kor:'카를로비바리',eng:'Karlovy Vary'},{kor:'플젠',eng:'Plzeň'},{kor:'쿠트나호라',eng:'Kutná Hora'},{kor:'리베레츠',eng:'Liberec'}],
  romania:     [{kor:'부쿠레슈티',eng:'Bucharest'},{kor:'브라쇼프',eng:'Brasov'},{kor:'시기쇼아라',eng:'Sighisoara'},{kor:'시나이아',eng:'Sinaia'},{kor:'클루지나포카',eng:'Cluj-Napoca'},{kor:'시비우',eng:'Sibiu'},{kor:'마라무레슈',eng:'Maramureș'},{kor:'콘스탄차',eng:'Constanța'}],
  bulgaria:    [{kor:'소피아',eng:'Sofia'},{kor:'플로브디프',eng:'Plovdiv'},{kor:'바르나',eng:'Varna'},{kor:'벨리코투르노보',eng:'Veliko Tarnovo'},{kor:'부르가스',eng:'Burgas'},{kor:'릴라수도원',eng:'Rila Monastery'},{kor:'소조폴',eng:'Sozopol'}],
  serbia:      [{kor:'베오그라드',eng:'Belgrade'},{kor:'노비사드',eng:'Novi Sad'},{kor:'니시',eng:'Niš'},{kor:'수보티차',eng:'Subotica'}],
  montenegro:  [{kor:'코토르',eng:'Kotor'},{kor:'부드바',eng:'Budva'},{kor:'포드고리차',eng:'Podgorica'},{kor:'울치니',eng:'Ulcinj'},{kor:'두르미토르',eng:'Durmitor'},{kor:'헤르체그노비',eng:'Herceg Novi'}],
  albania:     [{kor:'티라나',eng:'Tirana'},{kor:'베라트',eng:'Berat'},{kor:'지로카스터',eng:'Gjirokastër'},{kor:'사란다',eng:'Sarandë'},{kor:'쉬코더르',eng:'Shkodër'},{kor:'코르차',eng:'Korçë'}],
  georgia:     [{kor:'트빌리시',eng:'Tbilisi'},{kor:'바투미',eng:'Batumi'},{kor:'카즈베기',eng:'Kazbegi'},{kor:'쿠타이시',eng:'Kutaisi'},{kor:'시그나기',eng:'Sighnaghi'},{kor:'메스티아',eng:'Mestia'},{kor:'보르조미',eng:'Borjomi'}],
  armenia:     [{kor:'예레반',eng:'Yerevan'},{kor:'가르니',eng:'Garni'},{kor:'딜리잔',eng:'Dilijan'},{kor:'게가르트',eng:'Geghard'},{kor:'세반호수',eng:'Lake Sevan'},{kor:'짐부르',eng:'Gyumri'}],
  azerbaijan:  [{kor:'바쿠',eng:'Baku'},{kor:'셰키',eng:'Sheki'},{kor:'가바라',eng:'Gabala'},{kor:'간자',eng:'Ganja'},{kor:'랑카란',eng:'Lankaran'},{kor:'구사르',eng:'Qusar'}],
  israel:      [{kor:'텔아비브',eng:'Tel Aviv'},{kor:'예루살렘',eng:'Jerusalem'},{kor:'하이파',eng:'Haifa'},{kor:'에일라트',eng:'Eilat'},{kor:'사해',eng:'Dead Sea'},{kor:'나사렛',eng:'Nazareth'},{kor:'마사다',eng:'Masada'},{kor:'아크레',eng:'Acre'}],
  jordan:      [{kor:'암만',eng:'Amman'},{kor:'페트라',eng:'Petra'},{kor:'아카바',eng:'Aqaba'},{kor:'와디럼',eng:'Wadi Rum'},{kor:'제라시',eng:'Jerash'},{kor:'마다바',eng:'Madaba'},{kor:'사해',eng:'Dead Sea Jordan'}],
  saudi:       [{kor:'리야드',eng:'Riyadh'},{kor:'제다',eng:'Jeddah'},{kor:'알울라',eng:'AlUla'},{kor:'메디나',eng:'Medina'},{kor:'아브하',eng:'Abha'},{kor:'타부크',eng:'Tabuk'}],
  qatar:       [{kor:'도하',eng:'Doha'},{kor:'알와크라',eng:'Al Wakrah'},{kor:'알호르',eng:'Al Khor'}],
  oman:        [{kor:'무스카트',eng:'Muscat'},{kor:'니즈와',eng:'Nizwa'},{kor:'살랄라',eng:'Salalah'},{kor:'수르',eng:'Sur'},{kor:'무산담',eng:'Musandam'},{kor:'와히바사막',eng:'Wahiba Sands'}],
  egypt:       [{kor:'카이로',eng:'Cairo'},{kor:'룩소르',eng:'Luxor'},{kor:'아스완',eng:'Aswan'},{kor:'알렉산드리아',eng:'Alexandria'},{kor:'샤름엘셰이크',eng:'Sharm el-Sheikh'},{kor:'후르가다',eng:'Hurghada'},{kor:'아부심벨',eng:'Abu Simbel'},{kor:'시나이',eng:'Sinai'},{kor:'다합',eng:'Dahab'},{kor:'마르사알람',eng:'Marsa Alam'}],
  southafrica: [{kor:'케이프타운',eng:'Cape Town'},{kor:'요하네스버그',eng:'Johannesburg'},{kor:'더반',eng:'Durban'},{kor:'가든루트',eng:'Garden Route'},{kor:'스텔렌보스',eng:'Stellenbosch'},{kor:'크루거국립공원',eng:'Kruger National Park'},{kor:'포트엘리자베스',eng:'Port Elizabeth'},{kor:'블룸폰테인',eng:'Bloemfontein'},{kor:'더반',eng:'Durban'}],
  kenya:       [{kor:'나이로비',eng:'Nairobi'},{kor:'몸바사',eng:'Mombasa'},{kor:'마사이마라',eng:'Maasai Mara'},{kor:'암보셀리',eng:'Amboseli'},{kor:'삼부루',eng:'Samburu'},{kor:'라무',eng:'Lamu'},{kor:'츠보국립공원',eng:'Tsavo National Park'},{kor:'나쿠루호수',eng:'Lake Nakuru'}],
  tanzania:    [{kor:'다르에스살람',eng:'Dar es Salaam'},{kor:'잔지바르',eng:'Zanzibar'},{kor:'세렝게티',eng:'Serengeti'},{kor:'킬리만자로',eng:'Kilimanjaro'},{kor:'응고롱고로',eng:'Ngorongoro'},{kor:'아루샤',eng:'Arusha'},{kor:'빅토리아호수',eng:'Lake Victoria'}],
  mauritius:   [{kor:'포르루이',eng:'Port Louis'},{kor:'그랑바이',eng:'Grand Baie'},{kor:'플리크앙플락',eng:'Flic en Flac'},{kor:'블루베이',eng:'Blue Bay'},{kor:'마헤부르',eng:'Mahébourg'},{kor:'퀴르피프',eng:'Curepipe'}],
  seychelles:  [{kor:'마헤',eng:'Mahe'},{kor:'프라슬랑',eng:'Praslin'},{kor:'라디그',eng:'La Digue'},{kor:'실루에트',eng:'Silhouette'},{kor:'알다브라',eng:'Aldabra'},{kor:'드니섬',eng:'Denis Island'}],
  myanmar:     [{kor:'양곤',eng:'Yangon'},{kor:'바간',eng:'Bagan'},{kor:'만달레이',eng:'Mandalay'},{kor:'인레호수',eng:'Inle Lake'},{kor:'응웨사웅',eng:'Ngwe Saung'},{kor:'차욱피유',eng:'Chauk Phyu'},{kor:'케마핀',eng:'Kalaw'}],
  laos:        [{kor:'루앙프라방',eng:'Luang Prabang'},{kor:'비엔티안',eng:'Vientiane'},{kor:'방비엥',eng:'Vang Vieng'},{kor:'팍세',eng:'Pakse'},{kor:'시판돈',eng:'Si Phan Don'},{kor:'퐁살리',eng:'Phongsali'}],
  mongolia:    [{kor:'울란바토르',eng:'Ulaanbaatar'},{kor:'고비사막',eng:'Gobi Desert'},{kor:'테렐지',eng:'Terelj'},{kor:'홉스굴호수',eng:'Khövsgöl Lake'},{kor:'카라코룸',eng:'Karakorum'},{kor:'에르덴조',eng:'Erdene Zuu'}],
  nepal:       [{kor:'카트만두',eng:'Kathmandu'},{kor:'포카라',eng:'Pokhara'},{kor:'치트완',eng:'Chitwan'},{kor:'룸비니',eng:'Lumbini'},{kor:'나가르코트',eng:'Nagarkot'},{kor:'반디푸르',eng:'Bandipur'},{kor:'에베레스트베이스캠프',eng:'Everest Base Camp'}],
  srilanka:    [{kor:'콜롬보',eng:'Colombo'},{kor:'캔디',eng:'Kandy'},{kor:'시기리야',eng:'Sigiriya'},{kor:'갈레',eng:'Galle'},{kor:'엘라',eng:'Ella'},{kor:'누와라엘리야',eng:'Nuwara Eliya'},{kor:'아누라다푸라',eng:'Anuradhapura'},{kor:'폴론나루와',eng:'Polonnaruwa'},{kor:'트링코말리',eng:'Trincomalee'}],
  bhutan:      [{kor:'팀부',eng:'Thimphu'},{kor:'파로',eng:'Paro'},{kor:'푸나카',eng:'Punakha'},{kor:'범탕',eng:'Bumthang'},{kor:'완두에포당',eng:'Wangdue Phodrang'}],
  macau:       [{kor:'마카오반도',eng:'Macau Peninsula'},{kor:'타이파',eng:'Taipa'},{kor:'코타이',eng:'Cotai'},{kor:'콜로안',eng:'Coloane'}],
  argentina:   [{kor:'부에노스아이레스',eng:'Buenos Aires'},{kor:'바릴로체',eng:'Bariloche'},{kor:'이과수',eng:'Iguazu'},{kor:'파타고니아',eng:'Patagonia'},{kor:'멘도사',eng:'Mendoza'},{kor:'살타',eng:'Salta'},{kor:'코르도바',eng:'Córdoba'},{kor:'엘칼라파테',eng:'El Calafate'},{kor:'우수아이아',eng:'Ushuaia'},{kor:'투쿠만',eng:'Tucumán'},{kor:'마르델플라타',eng:'Mar del Plata'}],
  chile:       [{kor:'산티아고',eng:'Santiago'},{kor:'발파라이소',eng:'Valparaiso'},{kor:'아타카마',eng:'Atacama'},{kor:'파타고니아',eng:'Patagonia'},{kor:'부활절섬',eng:'Easter Island'},{kor:'푸에르토나탈레스',eng:'Puerto Natales'},{kor:'토레스델파이네',eng:'Torres del Paine'},{kor:'비냐델마르',eng:'Viña del Mar'},{kor:'칠로에',eng:'Chiloé'}],
  colombia:    [{kor:'보고타',eng:'Bogota'},{kor:'메데진',eng:'Medellin'},{kor:'카르타헤나',eng:'Cartagena'},{kor:'칼리',eng:'Cali'},{kor:'바란키야',eng:'Barranquilla'},{kor:'산안드레스',eng:'San Andrés'},{kor:'레티시아',eng:'Leticia'},{kor:'커피의길',eng:'Coffee Region'}],
  ecuador:     [{kor:'키토',eng:'Quito'},{kor:'과야킬',eng:'Guayaquil'},{kor:'갈라파고스',eng:'Galapagos'},{kor:'쿠엥카',eng:'Cuenca'},{kor:'아마존',eng:'Amazon Ecuador'},{kor:'바뇨스',eng:'Baños'}],
  cuba:        [{kor:'아바나',eng:'Havana'},{kor:'트리니다드',eng:'Trinidad'},{kor:'바라데로',eng:'Varadero'},{kor:'시엔푸에고스',eng:'Cienfuegos'},{kor:'산티아고데쿠바',eng:'Santiago de Cuba'},{kor:'비냘레스',eng:'Viñales'}],
  costarica:   [{kor:'산호세',eng:'San Jose'},{kor:'마누엘안토니오',eng:'Manuel Antonio'},{kor:'아레날',eng:'Arenal'},{kor:'몬테베르데',eng:'Monteverde'},{kor:'토르투게로',eng:'Tortuguero'},{kor:'코코스섬',eng:'Cocos Island'},{kor:'오사반도',eng:'Osa Peninsula'}],
  panama:      [{kor:'파나마시티',eng:'Panama City'},{kor:'보카스델토로',eng:'Bocas del Toro'},{kor:'파나마운하',eng:'Panama Canal'},{kor:'엘바예',eng:'El Valle'},{kor:'산블라스',eng:'San Blas'}],
  dominican:   [{kor:'산토도밍고',eng:'Santo Domingo'},{kor:'푼타카나',eng:'Punta Cana'},{kor:'라스테레나스',eng:'Las Terrenas'},{kor:'사마나',eng:'Samaná'},{kor:'카바레테',eng:'Cabarete'},{kor:'바라호나',eng:'Barahona'}],
  fiji:        [{kor:'나디',eng:'Nadi'},{kor:'수바',eng:'Suva'},{kor:'마나섬',eng:'Mana Island'},{kor:'마로마나섬',eng:'Mamanuca Islands'},{kor:'야사와섬',eng:'Yasawa Islands'},{kor:'비티레부',eng:'Viti Levu'}],
  guam:        [{kor:'투몬',eng:'Tumon'},{kor:'아가냐',eng:'Hagåtña'},{kor:'탈로포포',eng:'Talofofo'},{kor:'리티디안비치',eng:'Ritidian Beach'}],
  saipan:      [{kor:'가라판',eng:'Garapan'},{kor:'마나가하섬',eng:'Managaha Island'},{kor:'라우라우비치',eng:'Lau Lau Beach'},{kor:'타포차우산',eng:'Mt. Tapochau'}],
  palau:       [{kor:'코로르',eng:'Koror'},{kor:'록아일랜드',eng:'Rock Islands'},{kor:'펠렐리우',eng:'Peleliu'},{kor:'응게룰무드',eng:'Ngermid'},{kor:'젤리피시레이크',eng:'Jellyfish Lake'}],
};

function NewTripSheet({ open, onClose, onSubmit }) {
  const isKorean = React.useMemo(() => navigator.language.startsWith('ko'), []);
  const TOTAL    = 6;
  const HP_STEP  = 6;

  const [step,         setStep]         = React.useState(1);
  const [selectedDest, setSelectedDest] = React.useState(null); // step 1: 나라
  const [destQuery,    setDestQuery]    = React.useState('');
  const destInputRef  = React.useRef(null);
  const miniCalRef    = React.useRef(null);
  const [calPicking,   setCalPicking]   = React.useState(false);
  const [cities,       setCities]       = React.useState(['']);
  const [cityDrag,     setCityDrag]     = React.useState(null);
  const cityCardRefs = React.useRef({});
  const cityDragRef  = React.useRef(null);
  cityDragRef.current = cityDrag;
  const [startIso,     setStartIso]     = React.useState('');
  const [endIso,       setEndIso]       = React.useState('');
  const [hotels,       setHotels]       = React.useState([{ name:'', from:1, to:1 }]);
  const [skipHotel,    setSkipHotel]    = React.useState(false);
  const [arrAirport,   setArrAirport]   = React.useState('');
  const [depAirport,   setDepAirport]   = React.useState('인천국제공항');
  const [places,       setPlaces]       = React.useState([]);
  const [loading,      setLoading]      = React.useState(false);
  const [selected,     setSelected]     = React.useState(new Set());
  const [cityStep,     setCityStep]     = React.useState(0);
  const [showMore,     setShowMore]     = React.useState(false);
  const [kbOffset,     setKbOffset]     = React.useState(0);

  // 키보드 올라올 때 팝업 위치 조정
  React.useEffect(() => {
    if (!open) { setKbOffset(0); return; }
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKbOffset(kb);
    };
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    update();
    return () => { vv.removeEventListener('resize', update); vv.removeEventListener('scroll', update); };
  }, [open]);

  // 도시 카드 드래그 리오더
  React.useEffect(() => {
    if (!cityDrag) return;
    const onMove = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      e.preventDefault();
      setCityDrag(prev => prev ? { ...prev, currentY: touch.clientY } : null);
    };
    const onEnd = () => {
      const drag = cityDragRef.current;
      if (!drag) return;
      const delta = drag.currentY - drag.startY;
      const ds = drag.snapshots[drag.idx];
      const dcY = ds ? ds.top + ds.height / 2 + delta : drag.startY + delta;
      let hIdx = 0;
      for (let j = 0; j < drag.len; j++) {
        if (j === drag.idx) continue;
        const sn = drag.snapshots[j];
        if (sn && dcY > sn.top + sn.height / 2) hIdx++;
      }
      if (hIdx !== drag.idx) {
        setCities(prev => {
          const arr = [...prev];
          const [rm] = arr.splice(drag.idx, 1);
          arr.splice(hIdx, 0, rm);
          return arr;
        });
      }
      setCityDrag(null);
    };
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
    return () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [!!cityDrag]);

  const dayCount = startIso && endIso
    ? Math.round((new Date(endIso+'T12:00:00') - new Date(startIso+'T12:00:00')) / 86400000) + 1
    : 0;

  React.useEffect(() => {
    if (!open) return;
    setStep(1); setSelectedDest(null); setDestQuery(''); setCities(['']); setStartIso(''); setEndIso('');
    setHotels([{ name:'', from:1, to:1 }]); setSkipHotel(false);
    setArrAirport(''); setDepAirport('인천국제공항');
    setPlaces([]); setLoading(false); setSelected(new Set());
    setCityStep(0); setShowMore(false);
  }, [open]);

  React.useEffect(() => {
    if (dayCount > 0)
      setHotels(prev => prev.map((h, i) => i === prev.length - 1 ? { ...h, to: dayCount } : h));
  }, [dayCount]);

  // 장소 로딩 (다중 도시 + 행정경계 bbox + 타입 추출 + 자동 전체 선택)
  React.useEffect(() => {
    if (step !== HP_STEP || !open) return;
    const validCities = cities.filter(c => c.trim());
    if (!validCities.length) return;
    setLoading(true); setPlaces([]); setSelected(new Set());
    (async () => {
      try {
        const allPlaces = [];
        for (let ci = 0; ci < validCities.length; ci++) {
          const city = validCities[ci];
          // Nominatim으로 도시 행정 경계(bounding box) 가져오기
          const geo = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=3&addressdetails=0`,
            { headers: { 'User-Agent': 'TripLikeJ/1.0' } }
          ).then(r => r.json());
          // 도시·지역 유형 우선 선택
          const PRIO = ['city','town','village','borough','suburb','quarter','neighbourhood','island','region','state'];
          const f = geo.find(g => PRIO.includes(g.type) || PRIO.includes(g.class)) || geo[0];
          if (!f) continue;
          const lat = parseFloat(f.lat), lon = parseFloat(f.lon);
          // bounding box 사용 (Nominatim: [south, north, west, east])
          let areaQ;
          if (f.boundingbox) {
            const [s, n, w, e] = f.boundingbox.map(Number);
            // 너무 좁은 bbox(관광지 단일 노드 등)면 반경으로 대체
            const broad = (n - s) > 0.04 && (e - w) > 0.04;
            areaQ = broad ? `(${s},${w},${n},${e})` : `(around:10000,${lat},${lon})`;
          } else {
            areaQ = `(around:10000,${lat},${lon})`;
          }
          const q = `[out:json][timeout:30];(node["tourism"~"attraction|museum|viewpoint|gallery|theme_park|zoo|aquarium"]${areaQ};node["historic"~"monument|castle|ruins|memorial"]${areaQ};node["leisure"~"park|garden"]${areaQ};way["tourism"~"attraction|museum|theme_park|zoo|aquarium"]${areaQ};way["historic"~"monument|castle|ruins"]${areaQ};);out center 50;`;
          const ov = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(q)}`).then(r => r.json());
          const list = (ov.elements || []).filter(e => e.tags?.name).map(e => {
            const tags = e.tags;
            const type = tags.tourism || tags.historic || tags.leisure || 'attraction';
            const elat = e.lat ?? e.center?.lat;
            const elon = e.lon ?? e.center?.lon;
            return {
              id: `${ci}_${e.id}`, name: tags['name:en'] || tags.name,
              lat: elat, lon: elon, wikipedia: tags.wikipedia, photo: null,
              type, cityIdx: ci,
            };
          }).filter(p => p.lat && p.lon);
          allPlaces.push(...list);
        }
        setPlaces(allPlaces);
        setSelected(new Set()); // 기본 미선택 — 사용자가 직접 선택
        setLoading(false);
        // 사진 비동기 로드: wikipedia 태그 → 이름 검색 fallback
        allPlaces.forEach(async (p) => {
          try {
            let photo = null;
            if (p.wikipedia) {
              const t = p.wikipedia.replace(/^[a-z-]+:/, '').replace(/ /g, '_');
              const d = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`).then(r => r.json());
              photo = d.thumbnail?.source || null;
            }
            if (!photo) {
              const sr = await fetch(
                `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(p.name)}&gsrlimit=1&prop=pageimages&format=json&pithumbsize=400&origin=*`
              ).then(r => r.json());
              const pages = sr.query?.pages;
              if (pages) photo = Object.values(pages)[0]?.thumbnail?.source || null;
            }
            if (photo) setPlaces(prev => prev.map(pl => pl.id === p.id ? { ...pl, photo } : pl));
          } catch (_) {}
        });
      } catch (_) { setLoading(false); }
    })();
  }, [step]);

  if (!open) return null;

  const validCities = cities.filter(c => c.trim());
  const isLastCity  = cityStep >= validCities.length - 1;

  const canNext = step===1 ? !!(selectedDest || destQuery.trim()) : step===2 ? cities.some(c=>c.trim()) : step===3 ? (!!(startIso&&endIso) || calPicking) : true;

  // 장소 우선순위 정렬 (wikipedia 유무 + 유형 중요도)
  const PLACE_TYPE_SCORE = { museum:6, zoo:5, aquarium:5, theme_park:5, castle:4, ruins:4, monument:3, gallery:3, viewpoint:3, park:2, garden:2, attraction:1 };
  const sortByPriority = (arr) => [...arr].sort((a,b) => {
    const as = (a.wikipedia?10:0) + (PLACE_TYPE_SCORE[a.type]||1);
    const bs = (b.wikipedia?10:0) + (PLACE_TYPE_SCORE[b.type]||1);
    return bs - as;
  });

  const TITLES = { 1:'어느 나라로 가요?', 2:'도시를 알려줘요', 3:'언제 가요?', 4:'어느 공항으로?', 5:'숙소는요?' };
  const currentCityName = validCities[cityStep] || '';
  const stepTitle = step < HP_STEP ? TITLES[step] : (currentCityName ? `${currentCityName}에서 가고 싶은 곳` : '가고 싶은 곳을 골라요');

  const handleNext = () => {
    if (step === 1) {
      if (!selectedDest && destQuery.trim()) {
        setSelectedDest({ key:'custom', kor:destQuery.trim(), eng:destQuery.trim(), flag:'🌍', zone:null, currency:'USD', lat:0, lon:0 });
      }
      setCities(['']);
    }
    if (step < TOTAL) {
      // 날짜 step에서 년/월 picker가 열려 있으면 달력으로만 돌아오기
      if (step === 3 && miniCalRef.current?.isPicking?.()) {
        miniCalRef.current.confirm();
        return;
      }
      setStep(s => s + 1); return;
    }
    // step === HP_STEP: 도시별 순차 진행
    if (!isLastCity) {
      setCityStep(s => s + 1);
      setShowMore(false);
      return;
    }
    // 모든 도시 완료 → 여행 생성
    const selPlaces = places.filter(p => selected.has(p.id));
    const resolvedDest = selectedDest || (destQuery.trim() ? { key:'custom', kor:destQuery.trim(), eng:destQuery.trim(), flag:'🌍', zone:null, currency:'USD', lat:0, lon:0 } : null);
    const tripData = generateTripData({
      cities: cities.filter(Boolean), startIso, endIso,
      hotels: skipHotel ? [] : hotels.filter(h => h.name.trim()),
      arrAirport, depAirport,
      selectedPlaces: selPlaces, selectedDest: resolvedDest,
    });
    onSubmit(tripData);
    onClose();
  };

  const handleBack = () => {
    if (step === HP_STEP && cityStep > 0) {
      setCityStep(s => s - 1);
      setShowMore(false);
      return;
    }
    setStep(s => s - 1);
  };

  const togglePlace = id => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return ReactDOM.createPortal(
    <div style={{ position:'fixed', top:0, left:0, right:0, bottom:kbOffset, zIndex:1100, display:'flex', alignItems:'flex-end', justifyContent:'center', background:'rgba(0,0,0,0.4)', padding:'20px' }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
        onMouseDown={e => { if (!e.target.closest('input,textarea,select')) e.preventDefault(); }}
        style={{
        background:COLORS.bg, borderRadius:22, width:'100%', maxWidth:380,
        maxHeight:'82vh',
        display:'flex', flexDirection:'column',
        boxShadow:'0 12px 48px rgba(0,0,0,0.22)',
        transition:'max-height 0.2s ease',
      }}>
        {/* 헤더 */}
        <div style={{ padding:'18px 20px 0', flexShrink:0 }}>
          <div style={{ display:'flex', gap:4, marginBottom:14 }}>
            {Array.from({length:TOTAL}, (_,i) => (
              <div key={i} style={{ height:3, flex:1, borderRadius:2, background: i < step ? COLORS.ink : COLORS.line, transition:'background 0.2s' }}/>
            ))}
          </div>
          {/* step 6: 도시별 서브 점 표시 */}
          {step === HP_STEP && validCities.length > 1 && (
            <div style={{ display:'flex', gap:5, marginBottom:10 }}>
              {validCities.map((_, i) => (
                <div key={i} style={{ width:6, height:6, borderRadius:'50%', background: i <= cityStep ? COLORS.ink : COLORS.line, transition:'background 0.2s' }}/>
              ))}
            </div>
          )}
          <div style={{ fontFamily:SERIF, fontSize:20, color:COLORS.ink }}>{stepTitle}</div>
        </div>
        {/* 컨텐츠 */}
        <div style={{ overflowY:'auto', flex:1, padding:'14px 20px' }}>

          {/* Step 1: 나라 검색 — inline ghost text autocomplete */}
          {step === 1 && (() => {
            const qRaw = destQuery.trim();
            const q = qRaw.toLowerCase();
            // 단일 최우선 매치 (ghost text용)
            const ghostMatch = qRaw.length === 0 ? null :
              CITY_DB.find(c => c.kor.startsWith(qRaw) && c.kor !== qRaw) ||
              CITY_DB.find(c => c.eng.toLowerCase().startsWith(q) && c.eng.toLowerCase() !== q) ||
              null;
            const ghostIsKor = ghostMatch && ghostMatch.kor.startsWith(qRaw);
            const ghostFull  = ghostMatch ? (ghostIsKor ? ghostMatch.kor : ghostMatch.eng) : '';
            const ghostSuffix = ghostFull ? ghostFull.slice(qRaw.length) : '';

            // 타이핑된 글자 폭 측정 (ghost tap 영역 위치 계산용)
            let typedPx = 16 + qRaw.length * 14; // 기본 추정
            try {
              const cv = document.createElement('canvas');
              const cx = cv.getContext('2d');
              cx.font = `15px ${SANS}, sans-serif`;
              typedPx = 16 + cx.measureText(qRaw).width;
            } catch(_) {}

            const acceptGhost = () => {
              if (!ghostMatch) return;
              setDestQuery(ghostIsKor ? ghostMatch.kor : ghostMatch.eng);
              setSelectedDest(ghostMatch);
            };

            return (
              <div>
                {/* 입력창 + ghost 레이어 */}
                <div style={{ position:'relative', borderRadius:14, background:COLORS.card, border:`1.5px solid ${COLORS.line}` }}>
                  {/* ghost 레이어 (입력창 뒤) */}
                  {ghostSuffix && (
                    <div aria-hidden="true" style={{
                      position:'absolute', inset:0,
                      padding:'12px 40px 12px 16px',
                      display:'flex', alignItems:'center',
                      pointerEvents:'none', overflow:'hidden',
                      fontFamily:SANS, fontSize:15, lineHeight:'normal',
                      borderRadius:14,
                    }}>
                      <span style={{ color:'transparent', whiteSpace:'pre' }}>{qRaw}</span>
                      <span style={{ color:COLORS.mute, opacity:0.55, whiteSpace:'pre' }}>{ghostSuffix}</span>
                    </div>
                  )}
                  {/* 실제 입력 (배경 투명) */}
                  <input
                    ref={destInputRef}
                    autoFocus
                    value={destQuery}
                    onChange={e => {
                      const val = e.target.value;
                      setDestQuery(val);
                      const exact = CITY_DB.find(c => c.kor === val.trim() || c.eng.toLowerCase() === val.trim().toLowerCase());
                      setSelectedDest(exact || null);
                    }}
                    onInput={e => {
                      const val = e.target.value;
                      setDestQuery(val);
                      const exact = CITY_DB.find(c => c.kor === val.trim() || c.eng.toLowerCase() === val.trim().toLowerCase());
                      setSelectedDest(exact || null);
                    }}
                    placeholder={ghostSuffix ? '' : '나라 이름 (한글 또는 영어)'}
                    style={{
                      width:'100%', boxSizing:'border-box',
                      padding:'12px 40px 12px 16px',
                      border:'none', borderRadius:14, outline:'none',
                      background:'transparent',
                      fontFamily:SANS, fontSize:15, color:COLORS.ink,
                      position:'relative', zIndex:1,
                    }}
                  />
                  {/* ghost 탭 영역 (타이핑 끝 ~ 오른쪽) */}
                  {ghostSuffix && (
                    <div onMouseDown={e => { e.preventDefault(); acceptGhost(); }} style={{
                      position:'absolute', top:0, bottom:0,
                      left: typedPx, right: 36,
                      zIndex:2, cursor:'pointer',
                    }}/>
                  )}
                  {/* × 버튼 */}
                  {destQuery.length > 0 && (
                    <button onClick={() => { setDestQuery(''); setSelectedDest(null); }} style={{
                      position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                      background:'none', border:'none', cursor:'pointer',
                      color:COLORS.mute, fontSize:18, lineHeight:1, padding:4, zIndex:3,
                    }}>×</button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Step 2: 도시 이름 */}
          {step === 2 && (() => {
            // 드래그 hoverIdx 계산
            const dragDelta = cityDrag ? cityDrag.currentY - cityDrag.startY : 0;
            const draggedSnap = cityDrag ? cityDrag.snapshots[cityDrag.idx] : null;
            const draggedCenterY = draggedSnap ? draggedSnap.top + draggedSnap.height / 2 + dragDelta : 0;
            let hoverIdx = cityDrag ? cityDrag.idx : null;
            if (cityDrag) {
              hoverIdx = 0;
              for (let j = 0; j < cities.length; j++) {
                if (j === cityDrag.idx) continue;
                const sn = cityDrag.snapshots[j];
                if (sn && draggedCenterY > sn.top + sn.height / 2) hoverIdx++;
              }
            }
            const draggedCardH = cityDrag ? ((draggedSnap?.height || 54) + 10) : 0;
            return (
              <div>
                <div style={{ position:'relative' }}>
                  {cities.map((city, i) => {
                    const cityList = selectedDest ? (CITIES_BY_KEY[selectedDest.key] || []) : [];
                    const qRaw = city;
                    const q = qRaw.toLowerCase();
                    const cityGhostMatch = qRaw.length === 0 ? null :
                      cityList.find(c => c.kor.startsWith(qRaw) && c.kor !== qRaw) ||
                      cityList.find(c => c.eng.toLowerCase().startsWith(q) && c.eng.toLowerCase() !== q) ||
                      null;
                    const cityGhostIsKor = cityGhostMatch && cityGhostMatch.kor.startsWith(qRaw);
                    const cityGhostFull  = cityGhostMatch ? (cityGhostIsKor ? cityGhostMatch.kor : cityGhostMatch.eng) : '';
                    const cityGhostSuffix = cityGhostFull ? cityGhostFull.slice(qRaw.length) : '';
                    let cityTypedPx = 16 + qRaw.length * 14;
                    try { const cv=document.createElement('canvas'); const cx=cv.getContext('2d'); cx.font=`15px ${SANS},sans-serif`; cityTypedPx=16+cx.measureText(qRaw).width; } catch(_){}
                    const acceptCityGhost = () => {
                      if (!cityGhostMatch) return;
                      setCities(prev => prev.map((c,j) => j===i ? (cityGhostIsKor ? cityGhostMatch.kor : cityGhostMatch.eng) : c));
                    };
                    const isDragging = cityDrag && cityDrag.idx === i;
                    let translateY = 0;
                    if (cityDrag) {
                      if (isDragging) {
                        translateY = dragDelta;
                      } else if (hoverIdx < cityDrag.idx) {
                        if (i >= hoverIdx && i < cityDrag.idx) translateY = draggedCardH;
                      } else if (hoverIdx > cityDrag.idx) {
                        if (i > cityDrag.idx && i <= hoverIdx) translateY = -draggedCardH;
                      }
                    }
                    return (
                      <div
                        key={i}
                        ref={el => { cityCardRefs.current[i] = el; }}
                        style={{
                          display:'flex', gap:8, marginBottom:10, alignItems:'center',
                          transform:`translateY(${translateY}px)`,
                          transition: isDragging ? 'none' : 'transform 0.22s cubic-bezier(0.22,1,0.36,1)',
                          zIndex: isDragging ? 50 : 1,
                          position:'relative',
                        }}
                      >
                        {cities.length > 1 && (
                          <div
                            onTouchStart={e => {
                              e.preventDefault();
                              const touch = e.touches[0];
                              const snapshots = {};
                              cities.forEach((_, j) => {
                                const el = cityCardRefs.current[j];
                                if (el) snapshots[j] = el.getBoundingClientRect();
                              });
                              setCityDrag({ idx:i, startY:touch.clientY, currentY:touch.clientY, snapshots, len:cities.length });
                            }}
                            style={{
                              flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                              width:28, height:44, cursor:'grab', touchAction:'none',
                            }}
                          >
                            <svg width="12" height="18" viewBox="0 0 12 18" fill="none">
                              {[[2,2],[8,2],[2,7],[8,7],[2,12],[8,12]].map(([cx,cy]) =>
                                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill={COLORS.mute} opacity="0.55"/>
                              )}
                            </svg>
                          </div>
                        )}
                        <div style={{
                          flex:1, position:'relative', borderRadius:14,
                          background:COLORS.card, border:`1.5px solid ${COLORS.line}`,
                          boxShadow: isDragging ? '0 10px 32px rgba(0,0,0,0.18)' : 'none',
                          transition: isDragging ? 'none' : 'box-shadow 0.22s ease',
                        }}>
                          {cityGhostSuffix && (
                            <div aria-hidden="true" style={{ position:'absolute', inset:0, padding:'12px 40px 12px 16px', display:'flex', alignItems:'center', pointerEvents:'none', overflow:'hidden', fontFamily:SANS, fontSize:15, lineHeight:'normal', borderRadius:14 }}>
                              <span style={{ color:'transparent', whiteSpace:'pre' }}>{qRaw}</span>
                              <span style={{ color:COLORS.mute, opacity:0.55, whiteSpace:'pre' }}>{cityGhostSuffix}</span>
                            </div>
                          )}
                          <input value={city} autoFocus={i===0 && !cityDrag}
                            onChange={e => setCities(prev => prev.map((c,j) => j===i ? e.target.value : c))}
                            onKeyDown={e => { if (e.key==='Enter' && city.trim()) setStep(3); }}
                            placeholder={cityGhostSuffix ? '' : (i===0 ? '도시 이름 (한글 또는 영어)' : `도시 ${i+1}`)}
                            style={{ width:'100%', boxSizing:'border-box', padding:'12px 40px 12px 16px', border:'none', borderRadius:14, outline:'none', background:'transparent', fontFamily:SANS, fontSize:15, color:COLORS.ink, position:'relative', zIndex:1 }}
                          />
                          {cityGhostSuffix && (
                            <div onMouseDown={e => { e.preventDefault(); acceptCityGhost(); }} style={{ position:'absolute', top:0, bottom:0, left:cityTypedPx, right:8, zIndex:2, cursor:'pointer' }}/>
                          )}
                          {city.length > 0 && (
                            <button onClick={() => setCities(prev => prev.map((c,j) => j===i ? '' : c))} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:COLORS.mute, fontSize:18, lineHeight:1, padding:4, zIndex:3 }}>×</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onMouseDown={e => e.preventDefault()} onClick={() => setCities(prev=>[...prev,''])} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:COLORS.mute, fontFamily:SANS, fontSize:13, padding:'6px 0', marginTop:4 }}>
                  <span style={{ fontSize:18, lineHeight:1 }}>+</span> 도시 추가
                </button>
              </div>
            );
          })()}

          {/* Step 3: 기간 */}
          {step === 3 && (
            <div>
              {startIso && endIso && dayCount > 0 && (
                <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.accent, marginBottom:12, textAlign:'center', fontWeight:600 }}>
                  {dayCount-1}박 {dayCount}일
                </div>
              )}
              <MiniCalendar startIso={startIso} endIso={endIso} onRange={(s,e) => { setStartIso(s); setEndIso(e); }} actionRef={miniCalRef} onPickingChange={setCalPicking}/>
            </div>
          )}

          {/* Step 4: 공항 */}
          {step === 4 && (
            <div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>출발 공항</div>
                <input value={depAirport} autoFocus onChange={e=>setDepAirport(e.target.value)}
                  placeholder="예) 인천국제공항"
                  style={{ width:'100%', boxSizing:'border-box', border:'none', borderBottom:`1.5px solid ${COLORS.line}`, outline:'none', background:'transparent', fontFamily:SANS, fontSize:15, color:COLORS.ink, padding:'8px 0' }}
                />
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>도착 공항</div>
                <input value={arrAirport} onChange={e=>setArrAirport(e.target.value)}
                  placeholder="예) 나리타 국제공항"
                  style={{ width:'100%', boxSizing:'border-box', border:'none', borderBottom:`1.5px solid ${COLORS.line}`, outline:'none', background:'transparent', fontFamily:SANS, fontSize:15, color:COLORS.ink, padding:'8px 0' }}
                />
              </div>
              <div style={{ fontFamily:SANS, fontSize:12, color:COLORS.mute, lineHeight:1.5 }}>
                비행기를 이용하지 않는다면 넘어가세요.
              </div>
            </div>
          )}

          {/* Step 5: 숙소 */}
          {step === 5 && (
            <div>
              {!skipHotel && hotels.map((h, i) => (
                <div key={i} style={{ background:COLORS.card, borderRadius:14, padding:'12px 14px', marginBottom:10, border:`1px solid ${COLORS.line}` }}>
                  <input value={h.name} autoFocus={i===0}
                    onChange={e => setHotels(prev => prev.map((hh,j) => j===i ? {...hh,name:e.target.value} : hh))}
                    placeholder="숙소 이름"
                    style={{ width:'100%', boxSizing:'border-box', border:'none', borderBottom:`1px solid ${COLORS.line}`, outline:'none', background:'transparent', fontFamily:SANS, fontSize:14, color:COLORS.ink, padding:'4px 0 8px', marginBottom:10 }}
                  />
                  {dayCount > 1 && (
                    <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:SANS, fontSize:12, color:COLORS.mute }}>
                      <span>Day</span>
                      <input type="number" min={1} max={dayCount} value={h.from}
                        onChange={e => setHotels(prev => prev.map((hh,j) => j===i ? {...hh,from:Math.max(1,Math.min(dayCount,+e.target.value||1))} : hh))}
                        style={{ width:40, textAlign:'center', border:`1px solid ${COLORS.line}`, borderRadius:6, padding:'3px 4px', fontFamily:SANS, fontSize:12, outline:'none' }}
                      />
                      <span>~</span>
                      <input type="number" min={1} max={dayCount} value={h.to}
                        onChange={e => setHotels(prev => prev.map((hh,j) => j===i ? {...hh,to:Math.max(1,Math.min(dayCount,+e.target.value||1))} : hh))}
                        style={{ width:40, textAlign:'center', border:`1px solid ${COLORS.line}`, borderRadius:6, padding:'3px 4px', fontFamily:SANS, fontSize:12, outline:'none' }}
                      />
                      {hotels.length > 1 && (
                        <button onClick={() => setHotels(prev=>prev.filter((_,j)=>j!==i))} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:COLORS.mute, fontSize:18 }}>×</button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {!skipHotel && (
                <button onClick={() => setHotels(prev=>[...prev,{name:'',from:1,to:dayCount||1}])} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:COLORS.mute, fontFamily:SANS, fontSize:13, padding:'4px 0', marginBottom:14 }}>
                  <span style={{ fontSize:18 }}>+</span> 숙소 추가
                </button>
              )}
              <button onClick={() => setSkipHotel(s=>!s)} style={{ width:'100%', padding:'10px', border:`1px solid ${skipHotel?COLORS.accent:COLORS.line}`, borderRadius:12, background:'transparent', fontFamily:SANS, fontSize:13, color:skipHotel?COLORS.accent:COLORS.mute, cursor:'pointer' }}>
                {skipHotel ? '✓ 아직 못 정했어요' : '아직 못 정했어요'}
              </button>
            </div>
          )}

          {/* Step 6: 장소 확인 (자동 전체 선택, 탭으로 제외) */}
          {step === HP_STEP && (() => {
            const INITIAL = 8;
            const cityPlaces = sortByPriority(places.filter(p => p.cityIdx === cityStep));
            const visible   = showMore ? cityPlaces : cityPlaces.slice(0, INITIAL);
            const hiddenCnt = cityPlaces.length - INITIAL;
            const selCount  = cityPlaces.filter(p => selected.has(p.id)).length;
            return (
              <div>
                {loading && (
                  <div style={{ textAlign:'center', padding:'48px 0', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>
                    장소 불러오는 중...
                  </div>
                )}
                {!loading && cityPlaces.length === 0 && (
                  <div style={{ textAlign:'center', padding:'48px 0', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>
                    장소를 찾을 수 없어요
                  </div>
                )}
                {!loading && cityPlaces.length > 0 && (
                  <div style={{ fontFamily:SANS, fontSize:12, color:COLORS.mute, marginBottom:12 }}>
                    {selCount > 0 ? `${selCount}곳 선택됨` : '가고 싶은 곳을 골라보세요'}
                  </div>
                )}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {visible.map(p => {
                    const sel = selected.has(p.id);
                    return (
                      <button key={p.id} onClick={() => togglePlace(p.id)} style={{
                        border: sel ? `2px solid ${COLORS.accent}` : `1.5px solid ${COLORS.line}`,
                        borderRadius:14, padding:0, cursor:'pointer',
                        background: COLORS.card,
                        overflow:'hidden', textAlign:'left',
                        transition:'border 0.12s, transform 0.1s',
                        transform: sel ? 'scale(1)' : 'scale(0.97)',
                        opacity: sel ? 1 : 0.72,
                      }}>
                        <div style={{ height:88, position:'relative', background: p.photo ? 'transparent' : COLORS.softer }}>
                          {p.photo && <img src={p.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} loading="lazy"/>}
                          {sel && (
                            <div style={{ position:'absolute', top:7, right:7, width:20, height:20, borderRadius:'50%', background:COLORS.accent, display:'flex', alignItems:'center', justifyContent:'center' }}>
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M2 5l2.5 2.5L8 2.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div style={{ padding:'7px 9px 9px', fontFamily:SANS, fontSize:11.5, color:COLORS.ink, lineHeight:1.35, fontWeight: sel ? 600 : 400 }}>{p.name}</div>
                      </button>
                    );
                  })}
                </div>
                {!loading && !showMore && hiddenCnt > 0 && (
                  <button onMouseDown={e=>e.preventDefault()} onClick={() => setShowMore(true)}
                    style={{ marginTop:14, width:'100%', padding:'11px 0', borderRadius:12, border:`1.5px solid ${COLORS.line}`, background:'transparent', fontFamily:SANS, fontSize:13, color:COLORS.mute, cursor:'pointer' }}>
                    더 보기 +{hiddenCnt}개
                  </button>
                )}
              </div>
            );
          })()}

        </div>
        {/* 푸터 */}
        <div style={{ padding:'10px 20px 20px', display:'flex', gap:8, flexShrink:0, borderTop:`1px solid ${COLORS.line}` }}>
          {(step > 1 || (step === HP_STEP && cityStep > 0))
            ? <button onMouseDown={e=>e.preventDefault()} onClick={handleBack} style={{ padding:'11px 18px', borderRadius:12, border:`1px solid ${COLORS.line}`, background:'transparent', fontFamily:SANS, fontSize:14, color:COLORS.ink, cursor:'pointer' }}>이전</button>
            : <button onClick={onClose} style={{ padding:'11px 18px', borderRadius:12, border:`1px solid ${COLORS.line}`, background:'transparent', fontFamily:SANS, fontSize:14, color:COLORS.mute, cursor:'pointer' }}>취소</button>
          }
          <button onMouseDown={e=>e.preventDefault()} onClick={handleNext} disabled={!canNext} style={{
            flex:1, padding:'11px 0', borderRadius:12, border:'none',
            background: canNext ? COLORS.ink : COLORS.softer,
            color:       canNext ? COLORS.bg : COLORS.mute,
            fontFamily:SANS, fontSize:14, fontWeight:600,
            cursor: canNext ? 'pointer' : 'default',
            transition:'background 0.2s, color 0.15s',
          }}>{step === TOTAL ? (isLastCity ? '완료' : '다음 도시') : '다음'}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function AddCompanionSheet({ open, onClose, authUser, userData, trips, onUserDataUpdate, defaultTripId }) {
  const [selTrip,        setSelTrip]        = React.useState(null);
  const [inviteEmail,    setInviteEmail]    = React.useState('');
  const [inviteMsg,      setInviteMsg]      = React.useState('');
  const [inviting,       setInviting]       = React.useState(false);
  const [pendingInvites, setPendingInvites] = React.useState([]);

  React.useEffect(() => {
    if (!open || !authUser) return;
    setSelTrip(defaultTripId || null);
    setInviteEmail(''); setInviteMsg('');
    const unsub = fbListenInvites(authUser.uid, setPendingInvites);
    return unsub;
  }, [open]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true); setInviteMsg('');
    if (!selTrip) {
      const res = await fbAddContact(authUser.uid, inviteEmail);
      setInviting(false);
      if (res.error) setInviteMsg(res.error);
      else { setInviteMsg(`${res.toName}님이 동행인으로 추가되었습니다!`); setInviteEmail(''); }
      return;
    }
    const trip = (trips||[]).find(t => t.id === selTrip);
    await fbAddContact(authUser.uid, inviteEmail).catch(() => {});
    const res = await fbSendTripInvite(
      { uid:authUser.uid, displayName:authUser.displayName, email:authUser.email, photoURL:authUser.photoURL||'' },
      inviteEmail, selTrip, trip?.title || ''
    );
    setInviting(false);
    if (res.error) setInviteMsg(res.error);
    else { setInviteMsg(`${res.toName}님께 초대를 보냈습니다!`); setInviteEmail(''); }
  };

  const handleAccept = async (inv) => {
    if (inv.type === 'contact') {
      await fbAcceptContactInvite(inv, authUser.uid);
      setPendingInvites(p => p.filter(i => i.id !== inv.id));
      return;
    }
    if (inv.type === 'trip_copy') {
      const tripId = await fbAcceptTripCopy(inv, authUser.uid);
      onUserDataUpdate({ ...userData, tripIds: [...(userData.tripIds||[]), tripId] });
      setPendingInvites(p => p.filter(i => i.id !== inv.id));
      return;
    }
    const tripId = await fbAcceptTripInvite(inv, authUser.uid);
    onUserDataUpdate({ ...userData, tripIds: [...(userData.tripIds||[]), tripId] });
    setPendingInvites(p => p.filter(i => i.id !== inv.id));
  };

  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, zIndex:210, background:'rgba(0,0,0,0.4)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background:COLORS.bg, borderRadius:'22px 22px 0 0',
        paddingBottom:'calc(28px + env(safe-area-inset-bottom,0px))',
        maxHeight:'88%', overflowY:'auto',
      }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 6px' }}>
          <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
        </div>
        <div style={{ padding:'6px 20px 16px', borderBottom:`1px solid ${COLORS.line}` }}>
          <div style={{ fontFamily:SERIF, fontSize:24, color:COLORS.ink }}>동행인 추가</div>
          <div style={{ fontFamily:SANS, fontSize:12.5, color:COLORS.mute, marginTop:4 }}>
            이메일로 동행인을 추가해요
          </div>
        </div>

        {pendingInvites.length > 0 && (
          <div style={{ margin:'14px 16px 0', background:'#FFF8E1', borderRadius:14, padding:14 }}>
            <div style={{ fontFamily:MONO, fontSize:9.5, color:'#B8860B', letterSpacing:'0.1em', marginBottom:8 }}>
              📩 동행 초대 {pendingInvites.length}건
            </div>
            {pendingInvites.map(inv => (
              <div key={inv.id} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                {inv.fromPhoto
                  ? <img src={inv.fromPhoto} style={{ width:34, height:34, borderRadius:17 }}/>
                  : <div style={{ width:34, height:34, borderRadius:17, background:COLORS.accent,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontFamily:SANS, fontSize:14, color:'#fff' }}>{(inv.fromName||'?')[0]}</div>
                }
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.ink, fontWeight:500 }}>{inv.fromName}</div>
                  <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute }}>
                    {inv.type === 'contact' ? '동행인 요청' : (inv.tripTitle || inv.fromEmail)}
                  </div>
                </div>
                <button onClick={() => handleAccept(inv)} style={{
                  border:'none', borderRadius:9, padding:'6px 12px', cursor:'pointer',
                  background:COLORS.ink, color:COLORS.bg, fontFamily:SANS, fontSize:12, fontWeight:500,
                }}>수락</button>
                <button onClick={() => fbRejectInvite(inv.id).then(() => setPendingInvites(p=>p.filter(i=>i.id!==inv.id)))} style={{
                  border:`1px solid ${COLORS.line}`, borderRadius:9, padding:'6px 10px', cursor:'pointer',
                  background:'transparent', fontFamily:SANS, fontSize:12, color:COLORS.mute,
                }}>거절</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ padding:'16px 16px 0' }}>
          <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.1em', marginBottom:8 }}>
            여행 선택 (선택사항)
          </div>
          <select value={selTrip||''} onChange={e => setSelTrip(e.target.value || null)}
            style={{ width:'100%', padding:'11px 14px', borderRadius:12,
              border:`1.5px solid ${COLORS.line}`, background:COLORS.card,
              fontFamily:SANS, fontSize:13.5, color:COLORS.ink, boxSizing:'border-box' }}>
            <option value=''>여행 없이 동행인 추가</option>
            {(trips||[]).map(t => (
              <option key={t.id} value={t.id}>{t.title||'여행'}</option>
            ))}
          </select>

          <div style={{ marginTop:16, fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.1em', marginBottom:8 }}>
            이메일로 초대
          </div>
          <div style={{ fontFamily:SANS, fontSize:12, color:COLORS.mute, marginBottom:10 }}>
            상대방이 이 앱에 먼저 가입되어 있어야 합니다.
          </div>
          <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
            placeholder="구글 이메일 입력"
            onKeyDown={e => e.key === 'Enter' && handleInvite()}
            style={{ width:'100%', padding:'12px 14px', borderRadius:12,
              border:`1.5px solid ${COLORS.line}`, background:COLORS.card,
              fontFamily:SANS, fontSize:13.5, color:COLORS.ink, boxSizing:'border-box', outline:'none' }}/>
          {inviteMsg && (
            <div style={{ marginTop:8, fontFamily:SANS, fontSize:12,
              color: inviteMsg.includes('추가') || inviteMsg.includes('보냈') ? '#2E7D32' : COLORS.accent }}>
              {inviteMsg}
            </div>
          )}
          <button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()} style={{
            marginTop:12, width:'100%', padding:'14px', border:'none', borderRadius:14,
            background: inviteEmail.trim() ? COLORS.ink : COLORS.softer,
            color: inviteEmail.trim() ? COLORS.bg : COLORS.mute,
            fontFamily:SANS, fontSize:14, fontWeight:600, cursor:'pointer',
          }}>
            {inviting ? '처리 중...' : selTrip ? '초대 보내기' : '동행인 추가'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileSheet({ open, onClose, authUser, trips, onAddCompanion, onViewCompanions, onDeleteAccount }) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState('');

  React.useEffect(() => { if (!open) { setConfirmDelete(false); setDeleting(false); setDeleteError(''); } }, [open]);

  if (!open || !authUser) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      const tripIds = (trips || []).map(t => t.id).filter(Boolean);
      await fbDeleteAccount(authUser.uid, tripIds);
      onDeleteAccount();
    } catch(e) {
      setDeleting(false);
      if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') {
        setDeleteError('');
        setConfirmDelete(false);
      } else {
        setDeleteError('오류가 발생했어요. 다시 시도해 주세요.');
      }
    }
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.4)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background:COLORS.bg, borderRadius:'22px 22px 0 0',
        maxHeight:'88%', display:'flex', flexDirection:'column',
        paddingBottom:'calc(24px + env(safe-area-inset-bottom,0px))',
      }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 6px', flexShrink:0 }}>
          <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
        </div>
        <div style={{ padding:'12px 20px 16px', display:'flex', gap:14, alignItems:'center',
          borderBottom:`1px solid ${COLORS.line}`, flexShrink:0 }}>
          {authUser.photoURL
            ? <img src={authUser.photoURL} style={{ width:52, height:52, borderRadius:26, objectFit:'cover', flexShrink:0 }}/>
            : <div style={{ width:52, height:52, borderRadius:26, background:COLORS.accent, flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:SANS, fontSize:20, color:'#fff', fontWeight:600 }}>
                {(authUser.displayName||'?')[0]}
              </div>
          }
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:SERIF, fontSize:18, color:COLORS.ink }}>{authUser.displayName}</div>
            <div style={{ fontFamily:SANS, fontSize:12, color:COLORS.mute, marginTop:2 }}>{authUser.email}</div>
          </div>
          <button onClick={() => { fbSignOut(); onClose(); }} style={{
            border:`1px solid ${COLORS.line}`, borderRadius:10, padding:'7px 12px',
            background:'transparent', fontFamily:SANS, fontSize:12, color:COLORS.mute, cursor:'pointer',
          }}>로그아웃</button>
        </div>
        <div style={{ overflowY:'auto', flex:1, padding:'14px 16px' }}>
          {/* 동행인 카드 */}
          <div style={{
            background:COLORS.card, borderRadius:14, border:`1px solid ${COLORS.line}`,
            padding:'14px 16px', display:'flex', alignItems:'center', gap:12, marginBottom:10,
          }}>
            <div style={{ width:40, height:40, borderRadius:20, background:COLORS.softer, flexShrink:0,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="users" size={18} color={COLORS.mute} stroke={1.8}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:SANS, fontSize:14, fontWeight:500, color:COLORS.ink }}>동행인</div>
              <div style={{ fontFamily:SANS, fontSize:11.5, color:COLORS.mute, marginTop:2 }}>함께하는 여행 친구</div>
            </div>
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              <button onClick={() => { onClose(); setTimeout(onViewCompanions, 100); }} style={{
                padding:'7px 13px', borderRadius:10, border:`1px solid ${COLORS.line}`,
                background:'transparent', cursor:'pointer',
                fontFamily:SANS, fontSize:12, color:COLORS.ink,
              }}>보기</button>
              <button onClick={() => { onClose(); setTimeout(() => onAddCompanion(null), 100); }} style={{
                padding:'7px 13px', borderRadius:10, border:'none',
                background:COLORS.ink, cursor:'pointer',
                fontFamily:SANS, fontSize:12, fontWeight:600, color:'#fff',
              }}>추가</button>
            </div>
          </div>

          {/* 계정 탈퇴 */}
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} style={{
              width:'100%', marginTop:4, padding:'12px 0',
              background:'transparent', border:'none', cursor:'pointer',
              fontFamily:SANS, fontSize:12, color:COLORS.mute,
              textAlign:'center',
            }}>계정 탈퇴</button>
          ) : (
            <div style={{
              background:'#FFF5F5', borderRadius:14, border:'1px solid #FFCDD2',
              padding:'16px', marginTop:4,
            }}>
              <div style={{ fontFamily:SANS, fontSize:13, fontWeight:600, color:'#C62828', marginBottom:6 }}>
                정말 탈퇴할까요?
              </div>
              <div style={{ fontFamily:SANS, fontSize:12, color:'#B71C1C', lineHeight:1.5, marginBottom:14 }}>
                모든 여행 데이터가 영구 삭제되며 복구할 수 없어요.
                Google 계정으로 재인증 후 진행됩니다.
              </div>
              {deleteError && (
                <div style={{ fontFamily:SANS, fontSize:11.5, color:'#C62828', marginBottom:10 }}>{deleteError}</div>
              )}
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => { setConfirmDelete(false); setDeleteError(''); }} style={{
                  flex:1, padding:'10px 0', borderRadius:10,
                  border:`1px solid ${COLORS.line}`, background:'transparent',
                  fontFamily:SANS, fontSize:13, color:COLORS.ink, cursor:'pointer',
                }}>취소</button>
                <button onClick={handleDelete} disabled={deleting} style={{
                  flex:1, padding:'10px 0', borderRadius:10,
                  border:'none', background:'#C62828',
                  fontFamily:SANS, fontSize:13, fontWeight:600, color:'#fff',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.7 : 1,
                }}>{deleting ? '삭제 중...' : '탈퇴하기'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function _readCache() {
  if (!localStorage.getItem('tlj_authed')) return null;
  try {
    return {
      userData: JSON.parse(localStorage.getItem('tlj_userData') || 'null'),
      trip    : JSON.parse(localStorage.getItem('tlj_trip')     || 'null'),
      prep    : JSON.parse(localStorage.getItem('tlj_prep')     || 'null'),
    };
  } catch(e) { return null; }
}

// Firestore 문서에 누락된 필드를 채워주는 정규화 함수
function normalizeTrip(data, id) {
  if (!data) return null;
  return {
    title: '', dates: '', hotel: '',
    days: [], hotels: [], food: [], members: [],
    ...data,
    id: id || data.id,
    days:    Array.isArray(data.days)    ? data.days    : [],
    hotels:  Array.isArray(data.hotels)  ? data.hotels  : [],
    food:    Array.isArray(data.food)    ? data.food    : [],
    members: Array.isArray(data.members) ? data.members : [],
  };
}

function App() {
  const _nav   = loadNav();
  const _cache = _readCache(); // 캐시된 상태 (로그인된 경우)

  // ── Firebase auth + data state ─────────────────────────────
  const [authState, setAuthState]   = React.useState(_cache?.userData ? 'in' : 'loading');
  const [authUser, setAuthUser]     = React.useState(null);
  const [userData, setUserData]     = React.useState(_cache?.userData || null);
  const [trip, setTrip]             = React.useState(normalizeTrip(_cache?.trip));
  const [prep, setPrep]             = React.useState(_cache?.prep     || { checklist:[], docs:[], pack:[] });
  const [activeTripId, setActiveTripId] = React.useState(_nav.activeTripId || null);
  const [userTrips, setUserTrips]       = React.useState([]);
  const [tripsLoading, setTripsLoading] = React.useState(false);
  const [tripsReady,   setTripsReady]   = React.useState(false);
  const [profileSheetOpen,     setProfileSheetOpen]     = React.useState(false);
  const [addCompanionOpen,     setAddCompanionOpen]     = React.useState(null); // null=closed, false=open(no trip), tripId=open(with trip)
  const [companionsScreenOpen, setCompanionsScreenOpen] = React.useState(false);
  const [notifOpen, setNotifOpen]               = React.useState(false);
  const [notifs, setNotifs]                     = React.useState([]);
  const notifyTripEditTimer                     = React.useRef(null);
  const updateSampleTimer                       = React.useRef(null);
  const [shareTripTarget, setShareTripTarget] = React.useState(null);
  const [loginError, setLoginError] = React.useState('');
  const [loginPending, setLoginPending] = React.useState(false); // 로그인 버튼 누른 후 로딩 중
  const tripRef = React.useRef(null); // for loop-prevention

  // ── UI nav state ───────────────────────────────────────────
  const [tab, setTab]           = React.useState(_nav.tab || 'home');
  const [dayIdx, setDayIdx]     = React.useState(_nav.dayIdx ?? null);
  const [hotelIdx, setHotelIdx] = React.useState(_nav.hotelIdx ?? null);
  const [slideDir,  setSlideDir]  = React.useState(null);
  const [slideKey,  setSlideKey]  = React.useState(0);
  const [openStop, setOpenStop]   = React.useState(null);
  const [city, setCity]           = React.useState(CITIES[0]);
  const [curCode, setCurCode]     = React.useState('USD');
  const [hotelSheet, setHotelSheet]       = React.useState(null);
  const [hotelDetailSheet, setHotelDetailSheet] = React.useState(null); // null=closed, 'new'=add, number=idx
  const [scrollKey, setScrollKey]     = React.useState(0);
  const [editing, setEditing]         = React.useState(false);
  const [tabBarVisible, setTabBarVisible] = React.useState(true);
  const [tabBarPeeking, setTabBarPeeking] = React.useState(false);
  const [budgetSheetOpen, setBudgetSheetOpen] = React.useState(false);
  const [newTripSheetOpen, setNewTripSheetOpen] = React.useState(false);
  const [saveConfirm, setSaveConfirm] = React.useState(false); // 저장 확인 다이얼로그
  const lastScrollTop    = React.useRef(0);
  const savedHomeScrollY = React.useRef(0);
  const navGoingBack     = React.useRef(false);
  const editSnapshot     = React.useRef(null); // 편집 시작 시 trip+prep 스냅샷

  // 편집 버튼 토글 핸들러
  const stopSheetEditRef = React.useRef(null); // StopSheet의 setEditing 연결용

  const handleEditToggle = () => {
    // StopSheet가 열려있으면 팝업 편집 모드 토글
    if (openStop && stopSheetEditRef.current) {
      stopSheetEditRef.current();
      return;
    }
    if (!editing) {
      if (!canEdit) return;
      editSnapshot.current = JSON.stringify({ trip, prep });
      setEditing(true);
    } else {
      const changed = editSnapshot.current !== JSON.stringify({ trip, prep });
      if (changed) {
        setSaveConfirm(true); // 변경 있으면 확인 다이얼로그
      } else {
        setEditing(false);    // 변경 없으면 그냥 닫기
      }
    }
  };

  // ── 앱 준비되면 loginPending 해제 (trips 로딩 완료 후) ────────
  React.useEffect(() => {
    if (loginPending && authState === 'in' && tripsReady) {
      setLoginPending(false);
    }
  }, [loginPending, authState, tripsReady]);

  // ── 로컬 캐시 저장 (새로고침 시 즉시 표시용) ──────────────────
  React.useEffect(() => {
    if (userData) localStorage.setItem('tlj_userData', JSON.stringify(userData));
  }, [userData]);
  React.useEffect(() => {
    if (trip) localStorage.setItem('tlj_trip', JSON.stringify(trip));
  }, [trip]);
  React.useEffect(() => {
    if (prep) localStorage.setItem('tlj_prep', JSON.stringify(prep));
  }, [prep]);

  // ── Firebase auth listener ─────────────────────────────────
  React.useEffect(() => {
    return fbOnAuth(async (fbUser) => {
      if (fbUser) {
        setAuthUser(fbUser);
        const fallback = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || '여행자',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || '',
          groupId: fbUser.uid,
        };
        // fallback 즉시 세팅 → 바로 앱 화면 표시
        setUserData(fallback);
        setLoginError('');
        localStorage.setItem('tlj_authed', '1');
        setAuthState('in');
        // Firestore는 백그라운드에서 실제 데이터로 업데이트
        fbGetOrCreateUser(fbUser).then(setUserData).catch(() => {});
      } else {
        setAuthUser(null); setUserData(null);
        setTrip(null); setActiveTripId(null); setUserTrips([]);
        setPrep({ checklist:[], docs:[], pack:[] });
        localStorage.removeItem('tlj_authed');
        localStorage.removeItem('tlj_userData');
        localStorage.removeItem('tlj_trip');
        localStorage.removeItem('tlj_prep');
        setAuthState('out');
      }
    });
  }, []);

  // ── 알림 리스너 ────────────────────────────────────────────
  React.useEffect(() => {
    if (!authUser?.uid || typeof fbListenNotifications !== 'function') return;
    const CUTOFF = 30 * 24 * 60 * 60 * 1000;
    if (typeof fbPruneOldNotifications === 'function')
      fbPruneOldNotifications(authUser.uid).catch(() => {});
    return fbListenNotifications(authUser.uid, (all) => {
      const now = Date.now();
      setNotifs(all.filter(n => {
        const ts = n.createdAt?.toDate ? n.createdAt.toDate() : new Date(n.createdAt || 0);
        return now - ts.getTime() < CUTOFF;
      }));
    });
  }, [authUser?.uid]);

  // ── 여행 목록 로드 + 샘플 싱크 ────────────────────────────
  React.useEffect(() => {
    if (!userData?.uid) return;
    const uid = userData.uid;
    const email = userData.email || '';
    const tripIds = userData.tripIds || [userData.groupId];
    setTripsLoading(true);

    // 샘플 싱크: rome만 자동 추가 (nyc는 오너 전용)
    const SAMPLES = ['rome'];
    const syncAll = (typeof fbSyncSample === 'function')
      ? Promise.all(SAMPLES.map(sid => fbSyncSample(uid, email, sid).catch(() => null)))
      : Promise.resolve([null, null]);

    syncAll.then(syncResults => {
      // 샘플 tripId 수집 (isNew 여부 무관 — effect 재실행 시에도 누락 방지)
      const newIds = syncResults
        .filter(r => r?.tripId && !tripIds.includes(r.tripId))
        .map(r => r.tripId);
      const allIds = [...tripIds, ...newIds];
      return fbLoadTrips(allIds).then(async trips => {
        const normalized = trips.map(t => normalizeTrip(t, t.id));
        // days가 없는 여행은 TRIP_DEFAULT로 자동 복구 — 오너 계정 전용
        const isOwner = (email) => email === 'arjungtaeng@gmail.com';
        if (isOwner(userData?.email)) {
          for (let i = 0; i < normalized.length; i++) {
            if ((normalized[i].days || []).length === 0 && !normalized[i].sampleId) {
              const def = JSON.parse(JSON.stringify(window.TRIP_DEFAULT));
              const patch = {
                title : def.title  || 'New York',
                dates : def.dates  || '',
                hotel : def.hotel  || '',
                days  : def.days   || [],
                hotels: def.hotels || [],
                food  : def.food   || [],
              };
              normalized[i] = normalizeTrip({ ...normalized[i], ...patch }, normalized[i].id);
              fbSaveGroup(normalized[i].id, patch).catch(e => console.warn('auto-restore save failed', e));
            }
          }
        }
        // 업데이트된 샘플 반영
        syncResults.forEach(r => {
          if (r?.updated && r.tripId && r.tripData) {
            const idx = normalized.findIndex(t => t.id === r.tripId);
            if (idx >= 0) normalized[idx] = normalizeTrip({ ...normalized[idx], ...r.tripData, sampleId: normalized[idx].sampleId }, r.tripId);
          }
        });
        setUserTrips(normalized);
        setTripsLoading(false);
        setTripsReady(true);
        // userData.tripIds에 샘플 ID 반영 → effect 재실행 시 allIds 누락 방지
        if (newIds.length > 0) {
          setUserData(prev => ({
            ...prev,
            tripIds: [...new Set([...(prev.tripIds || []), ...newIds])],
          }));
        }
      });
    }).catch(() => { setTripsLoading(false); setTripsReady(true); });
  }, [userData?.uid, JSON.stringify(userData?.tripIds)]);

  // ── Firestore: shared group listener ──────────────────────
  const groupCreateRef = React.useRef(false);
  React.useEffect(() => {
    if (!activeTripId) return;
    groupCreateRef.current = false;
    return fbListenGroup(activeTripId, (data) => {
      if (data === null) return;
      const incoming = normalizeTrip(data, activeTripId);
      // 기존에 days 있는데 Firestore가 빈 데이터 주면 무시 (쓰기 진행 중)
      if (incoming.days.length === 0 && (tripRef.current?.days?.length || 0) > 0) return;
      tripRef.current = incoming;
      setTrip(incoming);
    });
  }, [activeTripId]);

  // ── Firestore: private prep listener ──────────────────────
  React.useEffect(() => {
    if (!authUser?.uid) return;
    return fbListenPrep(authUser.uid, (p) => {
      // preps 문서가 없거나 비어있으면 TRIP_DEFAULT.prep으로 초기화
      const hasData = p && (p.checklist?.length || p.docs?.length || p.pack?.length);
      if (!hasData) {
        const def = (window.TRIP_DEFAULT?.prep) || { checklist: [], docs: [], pack: [] };
        fbSavePrep(authUser.uid, def).catch(console.error);
        setPrep(def);
      } else {
        setPrep(p);
      }
    });
  }, [authUser?.uid]);

  // 여행 제목 바뀌면 시차 도시 · 환율 자동 감지
  React.useEffect(() => {
    const detected = detectCityFromTitle(trip?.title);
    if (detected) setCity(detected);
    setCurCode(detectCurrencyFromTitle(trip?.title));
  }, [trip?.title]);

  // 백그라운드 프리패치: 지도·경로·이동시간을 미리 캐싱
  // → Map 탭 클릭 시 즉시 표시, DayScreen 타임라인도 즉시 표시
  React.useEffect(() => {
    if (!trip?.days?.length) return;
    // 3초 후 idle하게 시작 (초기 렌더 블록 방지)
    const t = setTimeout(() => { prefetchRoutes(trip); }, 3000);
    return () => clearTimeout(t);
  }, [trip?.title, trip?.days?.length]);

  React.useEffect(() => { saveNav({ tab, dayIdx, hotelIdx, activeTripId }); }, [tab, dayIdx, hotelIdx, activeTripId]);

  // 스크롤 위치 저장
  React.useEffect(() => {
    const save = () => {
      try { sessionStorage.setItem('tlj_scrollY', String(Math.round(window.scrollY))); } catch(_) {}
    };
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, []);

  // 새로고침 복원: scrollKey effect가 먼저 0으로 리셋하므로 skipScrollReset으로 막음
  const skipScrollReset = React.useRef(!!_nav.activeTripId);
  React.useEffect(() => {
    if (!_nav.activeTripId) return;
    const savedY = parseInt(sessionStorage.getItem('tlj_scrollY') || '0', 10);
    if (!savedY) return;
    requestAnimationFrame(() => {
      window.scrollTo(0, savedY);
      lastScrollTop.current = savedY;
    });
  }, []);

  React.useEffect(() => {
    if (skipScrollReset.current) {
      skipScrollReset.current = false;
      return;
    }
    if (navGoingBack.current) {
      // 뒤로가기: 저장된 홈 스크롤 위치 복원
      const target = savedHomeScrollY.current || 0;
      requestAnimationFrame(() => {
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

  React.useEffect(() => {
    const handleScroll = () => {
      const st = window.scrollY;
      const diff = st - lastScrollTop.current;
      if (Math.abs(diff) > 4) {
        setTabBarVisible(diff < 0 || st < 60);
      }
      lastScrollTop.current = st;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── 팝업 닫힐 때 tabBarPeeking 리셋 ─────────────────────────────
  React.useEffect(() => {
    const popupOpen = profileSheetOpen || hotelSheet !== null || hotelDetailSheet !== null || !!openStop;
    if (!popupOpen) setTabBarPeeking(false);
  }, [profileSheetOpen, hotelSheet, hotelDetailSheet, openStop]);

  // ── Tab animation hooks ───────────────────────────────────────
  const TAB_ORDER = ['home', 'map', 'food', 'prep', 'budget'];
  const tabRef       = React.useRef(tab);
  const swipeBackRef = React.useRef(null);
  const slideDirRef  = React.useRef(null);
  React.useEffect(() => { tabRef.current = tab; }, [tab]);

  const changeTab = React.useCallback((newTab) => {
    const oldIdx = TAB_ORDER.indexOf(tabRef.current);
    const newIdx = TAB_ORDER.indexOf(newTab);
    if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
      const dir = newIdx > oldIdx ? 'from-right' : 'from-left';
      slideDirRef.current = dir;
      setSlideDir(dir);
      setSlideKey(k => k + 1);
    }
    setTab(newTab); setDayIdx(null); setHotelIdx(null); setOpenStop(null); setEditing(false);
  }, []);

  // ── Trip-level actions (Firestore) ────────────────────────
  const editTrip = (patch) => {
    const next = { ...(tripRef.current || trip), ...patch };
    setTrip(prev => ({ ...prev, ...patch }));
    // My Trips 목록도 즉시 반영 (색상 등 변경 시 카드가 바로 업데이트)
    if (activeTripId) setUserTrips(prev => prev.map(t => t.id === activeTripId ? { ...t, ...patch } : t));
    if (activeTripId) fbSaveGroup(activeTripId, patch).catch(console.error);
    // 오너가 샘플 여행(sampleId 있는 것만)을 수정하면 samples/{sampleId} 업데이트
    const currentSampleId = (tripRef.current || trip)?.sampleId;
    if (activeTripId && authUser?.email === 'arjungtaeng@gmail.com' && currentSampleId && typeof fbUpdateSample === 'function') {
      clearTimeout(updateSampleTimer.current);
      updateSampleTimer.current = setTimeout(() => {
        fbUpdateSample(currentSampleId, next).catch(() => {});
      }, 5000);
    }
    // 동행인에게 일정 수정 알림 (60초 디바운스)
    if (activeTripId && authUser && typeof fbNotifyTripEdit === 'function') {
      clearTimeout(notifyTripEditTimer.current);
      notifyTripEditTimer.current = setTimeout(() => {
        fbNotifyTripEdit(activeTripId, authUser.uid, authUser.displayName || '', authUser.photoURL || '', trip?.title || '').catch(() => {});
      }, 60000);
    }
  };
  const editPrep = (newPrep) => {
    setPrep(newPrep);
    if (authUser?.uid) fbSavePrep(authUser.uid, newPrep).catch(console.error);
  };

  const deleteTrip = async (tripId) => {
    const t = userTrips.find(x => x.id === tripId);
    const isOwner = !t?.members || t.members[0] === userData?.uid;
    const msg = isOwner
      ? `"${t?.title || '여행'}"을(를) 삭제할까요?\n삭제하면 복구할 수 없습니다.`
      : `"${t?.title || '여행'}"에서 나갈까요?`;
    if (!confirm(msg)) return;
    // 샘플 여행 삭제 시 복구 방지 플래그
    if (t?.sampleId && userData?.uid && typeof fbMarkSampleDeleted === 'function') {
      fbMarkSampleDeleted(userData.uid, t.sampleId).catch(() => {});
    }
    await fbDeleteTrip(tripId, userData.uid);
    setUserTrips(prev => prev.filter(x => x.id !== tripId));
    setUserData(prev => ({ ...prev, tripIds: (prev.tripIds || []).filter(id => id !== tripId) }));
  };

  // ── Day actions ────────────────────────────────────────
  const reorderDays = (from, to) => {
    const days = [...trip.days]; const [m] = days.splice(from, 1); days.splice(to, 0, m);
    editTrip({ days: days.map((d, i) => ({ ...d, n: i + 1 })) });
  };
  const addDay = () => {
    const n = trip.days.length + 1;
    const newDay = { n, date:'', weekday:'', title:`Day ${n}`, titleEn:'',
      hero:{ hue: 20 + n*5, label:`DAY ${n}` }, weather:'', items:[] };
    editTrip({ days: [...trip.days, newDay] });
  };
  const deleteDay = (i) => {
    if (!confirm(`Day ${trip.days[i].n} 일정을 삭제할까요?`)) return;
    const days = trip.days.filter((_, j) => j !== i).map((d, k) => ({ ...d, n: k + 1 }));
    editTrip({ days });
  };
  const editDay = (patch) => {
    const days = [...trip.days]; days[dayIdx] = { ...days[dayIdx], ...patch };
    editTrip({ days });
  };

  // ── Stop actions ───────────────────────────────────────
  const reorderItems = (from, to) => {
    const days = [...trip.days];
    const items = [...days[dayIdx].items];
    const [m] = items.splice(from, 1); items.splice(to, 0, m);
    days[dayIdx] = { ...days[dayIdx], items };
    editTrip({ days });
  };
  const addItem = () => {
    const newItem = { time:'12:00', cat:'sight', title:'새 일정', en:'', loc:'', note:'' };
    const days = [...trip.days];
    days[dayIdx] = { ...days[dayIdx], items: [...days[dayIdx].items, newItem] };
    editTrip({ days });
    setOpenStop({ idx: days[dayIdx].items.length - 1, stop: newItem, editing: true });
  };
  const addItemToFirstDay = () => {
    const newItem = { time:'12:00', cat:'sight', title:'새 일정', en:'', loc:'', note:'' };
    const days = [...trip.days];
    days[0] = { ...days[0], items: [...days[0].items, newItem] };
    editTrip({ days });
    setDayIdx(0);
    setScrollKey(k => k + 1);
    setOpenStop({ idx: days[0].items.length - 1, stop: newItem, editing: true });
  };
  const deleteItem = (i) => {
    if (!confirm('이 일정을 삭제할까요?')) return;
    const days = [...trip.days];
    days[dayIdx] = { ...days[dayIdx], items: days[dayIdx].items.filter((_, j) => j !== i) };
    editTrip({ days });
  };
  const sortByTime = (items) => {
    const toMin = t => { const m = (t||'').match(/^(\d{1,2}):(\d{2})/); return m ? +m[1]*60 + +m[2] : Infinity; };
    return [...items].sort((a, b) => toMin(a.time) - toMin(b.time));
  };

  const saveStop = (draft) => {
    if (openStop.hotelOnly) {
      const hotelName = draft.en
        || (draft.title || '').replace(/\s*(체크인|체크아웃|숙박|입실|퇴실)\s*$/, '').trim()
        || '새 호텔';
      const newHotel = {
        name: hotelName, area: draft.loc || '',
        address: draft.note || '',
        checkinTime: draft.time || '15:00',
        hue: 30,
      };
      const hotels = [...(trip.hotels || []), newHotel];
      const days = syncHotelToDays(trip.days, newHotel, null);
      editTrip({ hotels, days });
      setOpenStop(null);
      return;
    }
    const days = [...trip.days];
    const items = [...days[dayIdx].items];
    // en 자동 채움: 비어있으면 loc → title 순으로
    let savedDraft = { ...draft, en: draft.en || draft.loc || draft.title || '' };
    let hotels = [...(trip.hotels || [])];

    if (draft.cat === 'hotel') {
      // 호텔 이름: en 우선, 없으면 타이틀에서 한국어 접미사 제거
      const hotelName = draft.en
        || (draft.title || '').replace(/\s*(체크인|체크아웃|숙박|입실|퇴실)\s*$/, '').trim()
        || '숙소';

      if (draft._hotelRef) {
        // 기존 호텔 항목에 위치·메모·시간 역방향 동기화
        const hIdx = hotels.findIndex(h => h.name === draft._hotelRef);
        if (hIdx >= 0) {
          const prev = hotels[hIdx];
          const t = draft.title || '';
          const isIn  = t.includes('체크인') || t.includes('입실');
          const isOut = t.includes('체크아웃') || t.includes('퇴실');
          hotels[hIdx] = {
            ...prev,
            area:    draft.loc  || prev.area,
            address: draft.note || prev.address,
            ...(isIn  && draft.time ? { checkinTime:  draft.time } : {}),
            ...(isOut && draft.time ? { checkoutTime: draft.time } : {}),
          };
        }
      } else {
        // _hotelRef 없음 → 숙소 항목 자동 생성 후 스탑에 링크
        if (!hotels.find(h => h.name === hotelName)) {
          const day = days[dayIdx];
          const t2 = draft.title || '';
          const isIn = t2.includes('체크인') || t2.includes('입실');
          hotels.push({
            name: hotelName, area: draft.loc || '',
            address: draft.note || '', checkin: day.date || '',
            nights: 1, hue: 25,
            ...(isIn && draft.time ? { checkinTime: draft.time } : {}),
          });
        }
        savedDraft = { ...draft, _hotelRef: hotelName };
      }
    }

    items[openStop.idx] = savedDraft;
    days[dayIdx] = { ...days[dayIdx], items: sortByTime(items) };
    editTrip({ days, hotels });
    setOpenStop(null);
  };

  // ── Hotel ↔ Days sync ─────────────────────────────────
  // When a hotel has checkin/checkout dates+times, ensure day timelines
  // contain corresponding 'hotel' category items. Match day by date string.
  const normalizeDate = (s) => (s || '').replace(/,\s*\d{4}\s*$/, '').trim(); // strip year
  const syncHotelToDays = (days, hotel, prevHotel) => {
    if (!hotel) return days;
    let result = [...days];
    // Remove any existing items tagged as this hotel (by _hotelRef name)
    const prevName = prevHotel?.name;
    if (prevName) {
      result = result.map(d => ({
        ...d,
        items: d.items.filter(it => !(it._hotelRef === prevName)),
      }));
    }
    // Also strip items tagged to the NEW name (in case of re-sync/rename collisions)
    result = result.map(d => ({
      ...d,
      items: d.items.filter(it => !(it._hotelRef === hotel.name)),
    }));

    const findDay = (dateStr) => {
      if (!dateStr) return -1;
      const target = normalizeDate(dateStr);
      return result.findIndex(d => normalizeDate(d.date) === target);
    };
    const inIdx = findDay(hotel.checkin);
    // If checkout not given but nights is, derive checkout day from trip.days
    let outIdx = findDay(hotel.checkout);
    const nights = parseInt(hotel.nights, 10);
    if (outIdx < 0 && inIdx >= 0 && nights > 0) {
      outIdx = Math.min(inIdx + nights, result.length - 1);
    }

    const push = (di, item) => {
      if (di < 0) return;
      const items = [...result[di].items, item]
        .sort((a,b) => (a.time||'99:99').localeCompare(b.time||'99:99'));
      result[di] = { ...result[di], items };
    };

    if (inIdx >= 0) {
      push(inIdx, {
        time: hotel.checkinTime || '15:00', cat: 'hotel',
        title: `${hotel.name} 체크인`, en: hotel.name,
        loc: hotel.area || '', note: hotel.address || '',
        _hotelRef: hotel.name,
      });
    }
    if (outIdx >= 0 && outIdx !== inIdx) {
      push(outIdx, {
        time: hotel.checkoutTime || '12:00', cat: 'hotel',
        title: `${hotel.name} 체크아웃`, en: hotel.name,
        loc: hotel.area || '', note: hotel.address || '',
        _hotelRef: hotel.name,
      });
    }
    // Intermediate nights: days strictly between checkin and checkout
    if (inIdx >= 0 && outIdx > inIdx + 1) {
      for (let di = inIdx + 1; di < outIdx; di++) {
        push(di, {
          time: '', cat: 'hotel',
          title: `${hotel.name} 숙박`, en: hotel.name,
          loc: hotel.area || '', note: hotel.address || '',
          _hotelRef: hotel.name,
        });
      }
    }
    return result;
  };

  // ── Hotel actions ──────────────────────────────────────
  const editHotel = (patch) => {
    const hotels = [...(trip.hotels || [])];
    const prev = hotels[hotelIdx];
    const next = { ...prev, ...patch };
    hotels[hotelIdx] = next;
    const days = syncHotelToDays(trip.days, next, prev);
    editTrip({ hotels, days });
  };
  const deleteHotel = (i) => {
    if (!confirm(`"${trip.hotels[i].name}" 숙소를 삭제할까요?`)) return;
    const prev = trip.hotels[i];
    const hotels = (trip.hotels || []).filter((_, j) => j !== i);
    // remove hotel items from days
    const days = trip.days.map(d => ({
      ...d, items: d.items.filter(it => it._hotelRef !== prev.name),
    }));
    editTrip({ hotels, days });
  };
  const convertInlineHotel = (h) => {
    // 인라인 숙소를 trip.hotels에 추가하고 상세 화면 오픈
    const checkinDate = (h.checkin || '').split(' · ')[0];
    const newHotel = { name: h.name, area: h.area, checkin: checkinDate, nights: 1, hue: h.hue || 25 };
    const hotels = [...(trip.hotels || []), newHotel];
    editTrip({ hotels });
    savedHomeScrollY.current = window.scrollY;
    setHotelIdx(hotels.length - 1);
    setScrollKey(k => k + 1);
  };
  const reorderHotels = (from, to) => {
    const hotels = [...(trip.hotels || [])];
    const [moved] = hotels.splice(from, 1);
    hotels.splice(to, 0, moved);
    editTrip({ hotels });
  };
  const addHotel = () => {
    const newHotel = { name:'새 호텔', area:'', checkin:'', checkout:'', nights:1, hue: 30 };
    const hotels = [...(trip.hotels || []), newHotel];
    editTrip({ hotels });
    setHotelIdx(hotels.length - 1);
  };
  const addHotelViaStop = () => {
    setOpenStop({
      idx: -1,
      stop: { time:'15:00', cat:'hotel', title:'', en:'', loc:'', note:'' },
      editing: true,
      hotelOnly: true,
    });
  };
  const pickHotelFromSearch = (name) => {
    // name may be "Hotel Name (Area)"
    const m = name.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    const parsed = m ? { name: m[1], area: m[2] } : { name };
    if (hotelSheet === 'new') {
      const newHotel = { ...parsed, nights:1, hue:30 };
      const hotels = [...(trip.hotels || []), newHotel];
      editTrip({ hotels });
      setHotelIdx(hotels.length - 1);
    } else if (typeof hotelSheet === 'number') {
      const hotels = [...(trip.hotels || [])];
      const prev = hotels[hotelSheet];
      const next = { ...prev, ...parsed };
      hotels[hotelSheet] = next;
      const days = syncHotelToDays(trip.days, next, prev);
      editTrip({ hotels, days });
    }
  };

  // ── HotelDetailSheet actions ───────────────────────────
  const saveHotelDetailSheet = (draft) => {
    if (hotelDetailSheet === 'new') {
      const newHotel = { hue:30, ...draft };
      const hotels = [...(trip.hotels || []), newHotel];
      const days = syncHotelToDays(trip.days, newHotel, null);
      editTrip({ hotels, days });
    } else if (typeof hotelDetailSheet === 'number') {
      const hotels = [...(trip.hotels || [])];
      const prev = hotels[hotelDetailSheet];
      const next = { ...prev, ...draft };
      hotels[hotelDetailSheet] = next;
      const days = syncHotelToDays(trip.days, next, prev);
      editTrip({ hotels, days });
    }
    setHotelDetailSheet(null);
  };
  const deleteHotelDetailSheet = () => {
    if (typeof hotelDetailSheet === 'number') deleteHotel(hotelDetailSheet);
    setHotelDetailSheet(null);
  };

  // ── Permission check ───────────────────────────────────
  const myRole = (trip?.permissions || {})[authUser?.uid];
  const canEdit = myRole !== 'view';
  const unreadCount = notifs.filter(n => !n.read).length;

  // ── Render ─────────────────────────────────────────────
  let screen, label;
  if (tab === 'home') {
    if (hotelIdx !== null && trip) {
      screen = <HotelDetailScreen hotel={trip.hotels[hotelIdx]}
        onBack={() => { navGoingBack.current = true; setHotelIdx(null); }}
        onEdit={editHotel}
        onOpenSearch={() => setHotelSheet(hotelIdx)}
        editing={editing} setEditing={setEditing}/>;
      label = 'Hotel';
    } else if (dayIdx !== null && trip) {
      screen = <DayScreen trip={trip} dayIdx={dayIdx}
        onBack={() => { navGoingBack.current = true; setDayIdx(null); }}
        onOpenStop={setOpenStop}
        onNavDay={(i) => { setDayIdx(i); setOpenStop(null); setScrollKey(k=>k+1); }}
        onEditDay={editDay} onAddItem={addItem} onDeleteItem={deleteItem}
        onReorderItems={reorderItems}
        editing={editing} setEditing={setEditing}/>;
      label = `Day ${dayIdx + 1}`;
    } else {
      screen = <HomeScreen trip={trip}
        onBack={() => { setActiveTripId(null); setTrip(null); setEditing(false); }}
        onOpenDay={(i) => { savedHomeScrollY.current = window.scrollY; setDayIdx(i); setScrollKey(k=>k+1); }}
        onOpenHotel={(i) => { savedHomeScrollY.current = window.scrollY; setHotelIdx(i); setScrollKey(k=>k+1); }}
        onOpenHotelSheet={(i) => setHotelDetailSheet(i)}
        city={city} onPickCity={setCity}
        curCode={curCode} onSetCurCode={setCurCode}
        onEditTrip={editTrip} onReorderDays={reorderDays}
        onAddDay={addDay} onDeleteDay={deleteDay}
        onAddHotel={addHotel}
        onAddHotelViaStop={addHotelViaStop}
        onAddHotelFromSearch={() => setHotelSheet('new')}
        onDeleteHotel={deleteHotel}
        onReorderHotels={reorderHotels}
        onConvertInlineHotel={convertInlineHotel}
        onAddItemToFirstDay={addItemToFirstDay}
        editing={editing} setEditing={setEditing}
        userData={userData} onOpenCompanion={() => setProfileSheetOpen(true)}
        onOpenNotifs={() => setNotifOpen(true)} unreadCount={unreadCount}
        onLoadSample={async () => {
          const def = JSON.parse(JSON.stringify(window.TRIP_DEFAULT));
          const patch = {
            title : def.title  || '내 여행',
            dates : def.dates  || '',
            hotel : def.hotel  || '',
            days  : def.days   || [],
            hotels: def.hotels || [],
            food  : def.food   || [],
          };
          // Firestore에 저장 (실패 시 오류를 그대로 throw → HomeScreen에서 처리)
          await window.fbSaveGroup(activeTripId, patch);
          // 리스너를 기다리지 않고 로컬 상태 즉시 업데이트
          setTrip(prev => normalizeTrip({ ...prev, ...patch }, activeTripId));
        }}/>;
      label = 'Home';
    }
  } else if (tab === 'map')  {
    if (trip) {
      const editMapItem = (dayIdx, itemIdx, patch) => {
        const days = trip.days.map((d, di) =>
          di !== dayIdx ? d : { ...d, items: d.items.map((it, ii) => ii !== itemIdx ? it : { ...it, ...patch }) }
        );
        editTrip({ days });
      };
      screen = <MapScreen trip={trip} onEditItem={editMapItem}/>;
    }
    label = 'Map';
  }
  else if (tab === 'food')   { screen = <FoodScreen trip={trip} onEditFood={food => editTrip({ food })} editing={editing} setEditing={setEditing}/>; label='Food'; }
  else if (tab === 'budget') { screen = <BudgetScreen trip={trip} onEditBudget={b => editTrip({ budget: { ...(trip.budget||{}), ...b } })} onSheetChange={v => { setBudgetSheetOpen(v); if (!v) setTabBarVisible(true); }} onTabBarToggle={() => setTabBarVisible(v => !v)}/>; label='Budget'; }
  else                       { screen = <PrepScreen trip={trip} prep={prep} onEditPrep={editPrep} editing={editing} setEditing={setEditing}/>; label='Prep'; }

  const dayHue = dayIdx !== null && trip
    ? ((dayIdx === 0 ? (trip.hue ?? trip.days[0]?.hero?.hue) : trip.days[dayIdx]?.hero?.hue) ?? 30)
    : 30;

  // ── Auth gating ───────────────────────────────────────────
  // 로그인 버튼 누른 후 데이터 준비될 때까지 스플래시 표시
  const showSplash = loginPending && (authState !== 'in' || trip === null);
  if (showSplash) return <SplashScreen visible={true}/>;
  if (authState === 'loading') return null;
  if (authState === 'out') return <LoginScreen errorMsg={loginError} onLoginStart={() => setLoginPending(true)}/>;

  // ── 여행 목록 화면 ─────────────────────────────────────────
  if (!activeTripId) return (
    <>
      <TripsScreen
        trips={userTrips}
        loading={tripsLoading}
        userData={userData}
        myUid={authUser?.uid}
        onOpenCompanion={() => setProfileSheetOpen(true)}
        onOpenNotifs={() => setNotifOpen(true)} unreadCount={unreadCount}
        onSelect={(id) => {
          const found = userTrips.find(t => t.id === id);
          let tripToShow = found;
          // days 없으면 샘플 또는 TRIP_DEFAULT로 즉시 채워서 표시
          if (found && !(found.days?.length)) {
            const localSrc = found.sampleId === 'rome' ? window.ROME_DEFAULT
                           : found.sampleId === 'nyc'  ? window.TRIP_DEFAULT
                           : window.TRIP_DEFAULT;
            const def = JSON.parse(JSON.stringify(localSrc));
            tripToShow = normalizeTrip({ ...found,
              title : found.title || def.title,
              dates : def.dates  || '',
              hotel : def.hotel  || '',
              days  : def.days   || [],
              hotels: def.hotels || [],
              food  : def.food   || [],
              budget: def.budget || {},
            }, id);
            fbSaveGroup(id, { title: tripToShow.title, dates: tripToShow.dates,
              hotel: tripToShow.hotel, days: tripToShow.days,
              hotels: tripToShow.hotels, food: tripToShow.food,
              budget: tripToShow.budget }).catch(() => {});
          }
          if (tripToShow) { tripRef.current = tripToShow; setTrip(tripToShow); }
          setActiveTripId(id); setTab('home'); setDayIdx(null); setHotelIdx(null); setEditing(false);
          // Firestore에서 직접 읽어 최신 데이터로 보장 (days 있을 때만 반영)
          // 샘플 여행은 budget이 비어있으면 로컬 기본값으로 채워서 저장
          fbLoadTrips([id]).then(trips => {
            if (!trips || !trips.length) return;
            let fresh = normalizeTrip(trips[0], id);
            if (!fresh.days?.length) return;
            if (!(fresh.budget?.entries?.length) && found.sampleId) {
              const localSrc = found.sampleId === 'rome' ? window.ROME_DEFAULT : window.TRIP_DEFAULT;
              const def = JSON.parse(JSON.stringify(localSrc));
              if (def.budget?.entries?.length) {
                fresh = { ...fresh, budget: def.budget };
                fbSaveGroup(id, { budget: fresh.budget }).catch(() => {});
              }
            }
            tripRef.current = fresh; setTrip(fresh);
          }).catch(() => {});
        }}
        onAdd={() => setNewTripSheetOpen(true)}
        onRestore={null}
        onShare={(t) => setShareTripTarget(t)}
        onDelete={deleteTrip}
      />
      <ShareTripSheet
        open={!!shareTripTarget}
        onClose={() => setShareTripTarget(null)}
        trip={shareTripTarget}
        userData={userData}
        allTrips={userTrips}
        myUid={authUser?.uid}
      />
      <ProfileSheet open={profileSheetOpen} onClose={() => setProfileSheetOpen(false)}
        authUser={authUser} trips={userTrips}
        onAddCompanion={(tripId) => setAddCompanionOpen(tripId || false)}
        onViewCompanions={() => { setProfileSheetOpen(false); setCompanionsScreenOpen(true); }}
        onDeleteAccount={() => {
          ['tlj_authed','tlj_userData','tlj_trip','tlj_prep','tlj_nav'].forEach(k => localStorage.removeItem(k));
          setAuthState('out'); setAuthUser(null); setUserData(null);
          setProfileSheetOpen(false);
        }}/>
      <AddCompanionSheet open={addCompanionOpen !== null} onClose={() => setAddCompanionOpen(null)}
        authUser={authUser} userData={userData} trips={userTrips}
        defaultTripId={addCompanionOpen || null}
        onUserDataUpdate={ud => setUserData(ud)}/>
      <CompanionsScreen open={companionsScreenOpen} onClose={() => setCompanionsScreenOpen(false)}
        authUser={authUser} userData={userData} trips={userTrips} onUserDataUpdate={ud => setUserData(ud)}/>
      <NotificationsScreen open={notifOpen} onClose={() => setNotifOpen(false)}
        authUser={authUser} notifications={notifs}
        onGoToCompanions={() => { setNotifOpen(false); setCompanionsScreenOpen(true); }}
        onGoToTrip={(tripId) => { setNotifOpen(false); setActiveTripId(tripId); setTab('home'); setDayIdx(null); }}/>
      <NewTripSheet
        open={newTripSheetOpen}
        onClose={() => setNewTripSheetOpen(false)}
        onSubmit={async (tripData) => {
          const existingHues = (userTrips||[]).map(t => t.hue ?? t.days?.[0]?.hero?.hue).filter(h => h != null);
          const hue = pickUniqueHue(existingHues);
          const { tripId } = await fbCreateNewTrip(userData.uid, tripData.title, hue);
          await fbSaveGroup(tripId, { ...tripData, hue }).catch(() => {});
          setUserTrips(prev => [...prev, { id: tripId, ...tripData, hue, members:[userData.uid] }]);
          setActiveTripId(tripId);
          setTab('home'); setDayIdx(null); setHotelIdx(null);
        }}/>
    </>
  );

  if (!trip || !(trip.days?.length)) return (
    <div style={{ minHeight:'100vh', background:'#1a1a1a', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', gap:16, padding:24 }}>
      <button onClick={() => { setActiveTripId(null); setTrip(null); setEditing(false); }} style={{
        position:'fixed', top:'calc(env(safe-area-inset-top) + 14px)', left:16,
        background:'transparent', border:'none', padding:'4px 8px', cursor:'pointer',
        display:'flex', alignItems:'center', gap:3,
        fontFamily:SANS, fontSize:15, color:'#fff',
      }}>
        ← My Trips
      </button>
      <div style={{ background:'#C0392B', borderRadius:16, padding:'20px 24px', maxWidth:320, textAlign:'center', width:'100%' }}>
        <div style={{ fontFamily:MONO, fontSize:14, color:'#fff', lineHeight:2.2 }}>
          <div style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>일정 없음</div>
          <div>tripId: {activeTripId ? activeTripId.slice(0,12)+'…' : 'none'}</div>
          <div>trip: {trip ? 'exists, days='+( trip.days?.length||0) : 'null'}</div>
          <div>userTrips: {userTrips.length}개</div>
          <div style={{ fontSize:11, marginTop:4, opacity:0.8 }}>v162</div>
        </div>
      </div>
      <button onClick={async () => {
        try {
          const ts = await fbLoadTrips([activeTripId]);
          if (ts?.[0] && (ts[0].days||[]).length > 0) {
            const t = normalizeTrip(ts[0], activeTripId);
            tripRef.current = t; setTrip(t); return;
          }
          const def = JSON.parse(JSON.stringify(window.TRIP_DEFAULT));
          const patch = { title: def.title||'New York', dates: def.dates||'', hotel: def.hotel||'',
            days: def.days||[], hotels: def.hotels||[], food: def.food||[] };
          await fbSaveGroup(activeTripId, patch);
          const restored = normalizeTrip({ ...patch }, activeTripId);
          tripRef.current = restored; setTrip(restored);
        } catch(e) {
          const def = JSON.parse(JSON.stringify(window.TRIP_DEFAULT));
          const restored = normalizeTrip({ ...def }, activeTripId);
          tripRef.current = restored; setTrip(restored);
        }
      }} style={{
        padding:'16px 32px', background:'#C0392B', border:'none', borderRadius:14,
        color:'#fff', fontFamily:SANS, fontSize:16, fontWeight:700, cursor:'pointer',
        width:'100%', maxWidth:280,
      }}>일정 불러오기 / 복원</button>
    </div>
  );

  // Figure out what "back" means in the current state, for swipe-from-edge.
  let swipeBack = null;
  if (tab === 'home') {
    if (hotelIdx !== null) swipeBack = () => { navGoingBack.current = true; setHotelIdx(null); };
    else if (dayIdx !== null) swipeBack = () => { navGoingBack.current = true; setDayIdx(null); };
  }
  swipeBackRef.current = swipeBack;

  return (
    <div style={{ minHeight:'100vh', fontFamily:'-apple-system, system-ui, sans-serif', background:'#F5F2EC' }}>
      <div style={{ overflowX:'hidden' }}>
        <div key={slideKey}
          style={{ animation: slideDir ? `tab${slideDir === 'from-right' ? 'SlideFromRight' : 'SlideFromLeft'} 0.28s cubic-bezier(0.22,1,0.36,1)` : 'none' }}
          onAnimationEnd={() => setSlideDir(null)}>
          <SwipeBackLayer onBack={swipeBack}>{screen}</SwipeBackLayer>
        </div>
      </div>
      <TabBar tab={tab} setTab={changeTab}
        visible={tabBarVisible && !saveConfirm}
        editing={openStop ? false : editing} canEdit={canEdit} onToggleEdit={handleEditToggle}/>
      <StopSheet open={openStop} dayHue={dayHue}
        onClose={() => { setOpenStop(null); setTabBarPeeking(false); }}
        onSave={saveStop}
        onRegisterEdit={fn => { stopSheetEditRef.current = fn; }}
        onTabBarToggle={() => setTabBarVisible(v => !v)}/>
      <HotelSheet
        open={hotelDetailSheet !== null}
        onClose={() => setHotelDetailSheet(null)}
        hotel={typeof hotelDetailSheet === 'number' ? (trip?.hotels?.[hotelDetailSheet] || null) : null}
        trip={trip}
        tripDays={trip?.days}
        onSave={saveHotelDetailSheet}
        onDelete={deleteHotelDetailSheet}
      />

      {hotelSheet !== null && (
        <HotelSearchSheet
          COLORS={COLORS} SERIF={SERIF} SANS={SANS} MONO={MONO} Icon={Icon}
          cityBias={(() => { const c = CITY_DB.find(d => d.zone === trip?.timezone); return c ? [c.lat, c.lon] : null; })()}
          onPick={pickHotelFromSearch}
          onClose={() => setHotelSheet(null)}/>
      )}
      <ProfileSheet open={profileSheetOpen} onClose={() => setProfileSheetOpen(false)}
        authUser={authUser} trips={userTrips}
        onAddCompanion={(tripId) => setAddCompanionOpen(tripId || false)}
        onViewCompanions={() => { setProfileSheetOpen(false); setCompanionsScreenOpen(true); }}
        onDeleteAccount={() => {
          ['tlj_authed','tlj_userData','tlj_trip','tlj_prep','tlj_nav'].forEach(k => localStorage.removeItem(k));
          setAuthState('out'); setAuthUser(null); setUserData(null);
          setProfileSheetOpen(false);
        }}/>
      <AddCompanionSheet open={addCompanionOpen !== null} onClose={() => setAddCompanionOpen(null)}
        authUser={authUser} userData={userData} trips={userTrips}
        defaultTripId={addCompanionOpen || null}
        onUserDataUpdate={ud => setUserData(ud)}/>
      <NewTripSheet
        open={newTripSheetOpen}
        onClose={() => setNewTripSheetOpen(false)}
        onSubmit={async (tripData) => {
          const existingHues = (userTrips||[]).map(t => t.hue ?? t.days?.[0]?.hero?.hue).filter(h => h != null);
          const hue = pickUniqueHue(existingHues);
          const { tripId } = await fbCreateNewTrip(userData.uid, tripData.title, hue);
          await fbSaveGroup(tripId, { ...tripData, hue }).catch(() => {});
          setUserTrips(prev => [...prev, { id: tripId, ...tripData, hue, members:[userData.uid] }]);
          setActiveTripId(tripId);
          setTab('home'); setDayIdx(null); setHotelIdx(null);
        }}/>
      <CompanionsScreen open={companionsScreenOpen} onClose={() => setCompanionsScreenOpen(false)}
        authUser={authUser} userData={userData} trips={userTrips} onUserDataUpdate={ud => setUserData(ud)}/>
      <NotificationsScreen open={notifOpen} onClose={() => setNotifOpen(false)}
        authUser={authUser} notifications={notifs}
        onGoToCompanions={() => { setNotifOpen(false); setCompanionsScreenOpen(true); }}
        onGoToTrip={(tripId) => { setNotifOpen(false); setActiveTripId(tripId); setTab('home'); setDayIdx(null); }}/>

      {/* 저장 확인 다이얼로그 */}
      {saveConfirm && ReactDOM.createPortal(
        <div style={{ position:'fixed', inset:0, zIndex:700,
          background:'rgba(0,0,0,0.45)',
          display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
          <div style={{ background:COLORS.bg, borderRadius:22, padding:'28px 24px 20px',
            width:'100%', maxWidth:320, textAlign:'center',
            boxShadow:'0 20px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink, marginBottom:8 }}>
              수정을 완료할까요?
            </div>
            <div style={{ fontFamily:SANS, fontSize:13.5, color:COLORS.mute, marginBottom:24, lineHeight:1.5 }}>
              변경된 내용이 저장됩니다.
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setSaveConfirm(false)} style={{
                flex:1, padding:'13px', border:`1.5px solid ${COLORS.line}`,
                borderRadius:14, background:'transparent', cursor:'pointer',
                fontFamily:SANS, fontSize:14, color:COLORS.mute,
              }}>계속 수정</button>
              <button onClick={() => { setSaveConfirm(false); setEditing(false); }} style={{
                flex:1, padding:'13px', border:'none',
                borderRadius:14, background:COLORS.ink, cursor:'pointer',
                fontFamily:SANS, fontSize:14, fontWeight:600, color:'#fff',
              }}>저장</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// CSS 안전영역 변수 초기화 — StopSheet 최대 높이 + 드래그 핸들 제한에 사용
(function(){
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;top:env(safe-area-inset-top,0px);left:0;width:0;height:0;pointer-events:none';
  document.body.appendChild(d);
  document.documentElement.style.setProperty('--sat', Math.max(0, d.getBoundingClientRect().top) + 'px');
  document.body.removeChild(d);
})();
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
