// NYC Travel App — restructured
// - Trips list (top level) -> pick a trip -> Home
// - Per-page edit (no global toggle)
// - Hotel detail page + multi-hotel schedule
// - Fully editable prep page

const COLORS = {
  bg:'#F5F2EC', card:'#FFFFFF', ink:'#1A1816', mute:'#7A756D',
  line:'rgba(26,24,22,0.08)', accent:'#C14F2E', soft:'#E9E3D7', softer:'#EFEAE0',
};
const SERIF = '"Instrument Serif", Georgia, serif';
const SANS  = '-apple-system, "SF Pro Text", system-ui, sans-serif';
const MONO  = '"JetBrains Mono", ui-monospace, monospace';

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
    case 'phone':  return <svg {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.9 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>;
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
function SwipeableRow({ children, onEdit, onDelete, disabled, isDragging, wrapStyle = {} }) {
  const [x, setX] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const startRef = React.useRef(null);
  const dragging = React.useRef(false);
  const xRef = React.useRef(0);
  const REVEAL = 116;
  const DELETE_EXTRA = 72;

  const close = () => { setX(0); xRef.current = 0; setOpen(false); };
  React.useEffect(() => { if (disabled) close(); }, [disabled]);
  // 드래그 중에는 스와이프 버튼 즉시 닫기
  React.useEffect(() => { if (isDragging) close(); }, [isDragging]);

  const onTouchStart = (e) => {
    if (disabled) return;
    startRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    dragging.current = false;
  };
  const onTouchMove = (e) => {
    if (!startRef.current) return;
    const dx = e.touches[0].clientX - startRef.current.x;
    const dy = Math.abs(e.touches[0].clientY - startRef.current.y);
    if (!dragging.current) {
      if (Math.abs(dx) < 18) return;
      if (dy > Math.abs(dx) * 0.55) { startRef.current = null; return; }
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
    if (!startRef.current || !dragging.current) { startRef.current = null; return; }
    startRef.current = null; dragging.current = false;
    const cur = xRef.current;
    if (cur < -(REVEAL + DELETE_EXTRA / 2)) {
      close();
      setTimeout(() => onDelete(), 260);
    } else if (cur < -REVEAL / 2) {
      xRef.current = -REVEAL; setX(-REVEAL); setOpen(true);
    } else {
      close();
    }
  };

  return (
    <div style={{ position:'relative', overflow:'hidden', ...wrapStyle }}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div style={{
        position:'absolute', right:0, top:0, bottom:0, width:REVEAL,
        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
      }}>
        <button onClick={(e)=>{e.stopPropagation(); close(); setTimeout(onEdit,100);}} style={{
          width:46, height:46, borderRadius:23, border:'none', cursor:'pointer',
          background:'#ffa500', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}><Icon name="edit" size={17} color="#fff" stroke={2}/></button>
        <button onClick={(e)=>{e.stopPropagation(); close(); setTimeout(onDelete,100);}} style={{
          width:46, height:46, borderRadius:23, border:'none', cursor:'pointer',
          background:'#B5451B', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}><Icon name="trash" size={17} color="#fff" stroke={2}/></button>
      </div>
      <div style={{
        transform:`translateX(${x}px)`,
        transition: dragging.current ? 'none' : 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
        willChange:'transform', position:'relative', zIndex:1,
      }}>
        {children}
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

// ─── Popup sheet (centered modal with swipe-down dismiss) ────
function BottomSheet({ open, onClose, children, title, onConfirm, confirmLabel='완료' }) {
  const [mounted, setMounted] = React.useState(open);
  const [visible, setVisible] = React.useState(false);
  const [drag, setDrag] = React.useState(0);
  const startY = React.useRef(null);

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
  const onTouchStart = (e) => { startY.current = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    if (startY.current == null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) setDrag(dy);
  };
  const onTouchEnd = () => {
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
      position:'fixed', inset:0, zIndex:600,
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'20px 18px',
      background: visible && drag < 80 ? 'rgba(20,16,14,0.42)' : 'rgba(20,16,14,0)',
      transition:'background 240ms ease',
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
  const YEARS = Array.from({ length: 10 }, (_, i) => todayObj.getFullYear() - 2 + i);
  const MONTHS = Array.from({ length: 12 }, (_, i) => i);
  const [tmpY, setTmpY] = React.useState(view.y);
  const [tmpMo, setTmpMo] = React.useState(view.mo);

  const ScrollPicker = ({ items, value, onChange, renderLabel, width=90 }) => {
    const IH = 44;
    const VISIBLE = 5;
    const ref = React.useRef(null);
    const timer = React.useRef(null);
    React.useEffect(() => {
      const el = ref.current; if (!el) return;
      const idx = items.indexOf(value);
      if (idx >= 0) el.scrollTop = idx * IH;
    }, [value]);
    const onScroll = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const el = ref.current; if (!el) return;
        const idx = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / IH)));
        el.scrollTo({ top: idx * IH, behavior: 'smooth' });
        if (items[idx] !== value) onChange(items[idx]);
      }, 100);
    };
    const PAD = IH * Math.floor(VISIBLE / 2);
    const stopProp = (e) => e.stopPropagation(); // 스크롤 시 배경 dismiss 방지
    return (
      <div style={{ position:'relative', width, height: IH * VISIBLE, overflow:'hidden' }}
        onClick={stopProp} onTouchStart={stopProp} onTouchMove={stopProp} onTouchEnd={stopProp}>
        {/* 중앙 선택 하이라이트 — 상하 구분선 */}
        <div style={{ position:'absolute', left:0, right:0, pointerEvents:'none', zIndex:2,
          top: IH * Math.floor(VISIBLE / 2),
          height: IH,
          borderTop: `1.5px solid ${COLORS.line}`,
          borderBottom: `1.5px solid ${COLORS.line}`,
        }}/>
        <div ref={ref} onScroll={onScroll}
          style={{ height:'100%', overflowY:'scroll', scrollSnapType:'y mandatory',
            scrollbarWidth:'none', msOverflowStyle:'none',
            paddingTop: PAD, paddingBottom: PAD, boxSizing:'content-box' }}
          className="wheel-col">
          {items.map((it, i) => {
            const sel = it === value;
            return (
              <div key={i} onClick={() => { onChange(it); const el = ref.current; if(el) el.scrollTo({top: i*IH, behavior:'smooth'}); }}
                style={{ height:IH, display:'flex', alignItems:'center', justifyContent:'center',
                  scrollSnapAlign:'center', fontFamily:SANS,
                  fontSize: sel ? 16 : 14,
                  color: sel ? COLORS.ink : COLORS.mute,
                  fontWeight: sel ? 600 : 400,
                  cursor:'pointer', userSelect:'none' }}>
                {renderLabel(it)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
    <BottomSheet open={open} onClose={onClose} title={title} onConfirm={confirm}>
      {/* 년/월 헤더 — 탭하면 스크롤 선택기로 전환 */}
      <div style={{ padding:'8px 16px 6px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <button onClick={() => { if (!pickingYM){ setTmpY(view.y); setTmpMo(view.mo); } setPickingYM(p=>!p); }} style={{
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
          <div style={{ display:'flex', justifyContent:'center', gap:12, padding:'4px 16px 8px' }}>
            <ScrollPicker items={YEARS} value={tmpY} onChange={setTmpY}
              renderLabel={y => `${y}년`} width={110}/>
            <ScrollPicker items={MONTHS} value={tmpMo} onChange={setTmpMo}
              renderLabel={m => MONTH_KR[m]} width={90}/>
          </div>
          <div style={{ padding:'0 16px 14px' }}>
            <button onClick={() => { setView({ y:tmpY, mo:tmpMo }); setPickingYM(false); }} style={{
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

// ─── Wheel column (scroll-snap) ──────────────────────────────
function WheelColumn({ items, value, onChange, width=70 }) {
  const ITEM_H = 40;
  const VISIBLE = 5; // odd so there's a center
  const CENTER_OFFSET = Math.floor(VISIBLE / 2);
  const ref = React.useRef(null);
  const timer = React.useRef(null);

  // Sync external value → scroll position
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const idx = items.indexOf(value);
    if (idx >= 0) el.scrollTop = idx * ITEM_H;
  }, [value, items]);

  const handleScroll = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = ref.current; if (!el) return;
      const idx = Math.round(el.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      // Snap
      el.scrollTo({ top: clamped * ITEM_H, behavior: 'smooth' });
      if (items[clamped] !== value) onChange(items[clamped]);
    }, 120);
  };

  return (
    <div style={{ position:'relative', width, height: ITEM_H * VISIBLE }}>
      <style>{`.wheel-col::-webkit-scrollbar{display:none;}`}</style>
      <div ref={ref} onScroll={handleScroll} className="wheel-col" style={{
        width:'100%', height:'100%', overflowY:'scroll',
        scrollSnapType:'y mandatory',
        scrollbarWidth:'none', msOverflowStyle:'none',
        padding: `${ITEM_H * CENTER_OFFSET}px 0`,
        boxSizing:'content-box',
      }}>
        {items.map((it, i) => {
          const isSel = it === value;
          return (
            <div key={i} style={{
              height: ITEM_H, display:'flex', alignItems:'center', justifyContent:'center',
              scrollSnapAlign:'center',
              fontFamily: SERIF, fontSize: isSel ? 26 : 20,
              color: isSel ? COLORS.ink : COLORS.mute,
              opacity: isSel ? 1 : 0.45,
              transition:'all 180ms',
              fontFeatureSettings:'"tnum"',
            }}>{it}</div>
          );
        })}
      </div>
      {/* Selection indicator */}
      <div style={{
        position:'absolute', left:0, right:0, top: ITEM_H * CENTER_OFFSET, height: ITEM_H,
        borderTop:`1px solid ${COLORS.line}`, borderBottom:`1px solid ${COLORS.line}`,
        pointerEvents:'none',
      }}/>
      {/* Fade edges */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height: ITEM_H * CENTER_OFFSET,
        background:`linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.bg}00 100%)`,
        pointerEvents:'none',
      }}/>
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height: ITEM_H * CENTER_OFFSET,
        background:`linear-gradient(0deg, ${COLORS.bg} 0%, ${COLORS.bg}00 100%)`,
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
    <BottomSheet open={open} onClose={onClose} title={title} onConfirm={confirm}>
      <div style={{ padding:'20px 20px 28px', display:'flex', justifyContent:'center', alignItems:'center', gap:10 }}>
        <WheelColumn items={hours} value={String(h).padStart(2,'0')}
          onChange={(v) => setH(+v)}/>
        <div style={{ fontFamily:SERIF, fontSize:28, color:COLORS.ink, opacity:0.4 }}>:</div>
        <WheelColumn items={mins} value={displayMin}
          onChange={(v) => setMi(+v)}/>
      </div>
    </BottomSheet>
  );
}

// ─── FX ─────────────────────────────────────────────────────
function useFxRate() {
  const [state, setState] = React.useState({ loading: true, rate: null, ts: null });
  const fetchRate = React.useCallback(() => {
    setState(s => ({ ...s, loading: true }));
    // Try several free USD→KRW feeds in sequence; first success wins.
    const sources = [
      {
        url: 'https://api.frankfurter.app/latest?from=USD&to=KRW',
        parse: j => ({ rate: j?.rates?.KRW, ts: j?.date }),
      },
      {
        url: 'https://open.er-api.com/v6/latest/USD',
        parse: j => ({ rate: j?.rates?.KRW, ts: j?.time_last_update_utc?.slice(0, 16) }),
      },
      {
        url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
        parse: j => ({ rate: j?.usd?.krw, ts: j?.date }),
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
  }, []);
  React.useEffect(() => { fetchRate(); }, [fetchRate]);
  return { ...state, refresh: fetchRate };
}

function FxCard() {
  const { loading, rate, ts, refresh } = useFxRate();
  return (
    <div style={{ background:COLORS.card, borderRadius:14, padding:'13px 14px 11px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em', textTransform:'uppercase' }}>하나은행 · 매매기준율</div>
        <button onClick={refresh} style={{ border:'none', background:'transparent', cursor:'pointer', padding:2 }}>
          <Icon name="refresh" size={12} color={COLORS.mute} stroke={1.8}/>
        </button>
      </div>
      <div style={{ marginTop:5, fontFamily:SERIF, fontSize:22, color:COLORS.ink }}>
        {loading ? '…' : rate ? `₩${Math.round(rate).toLocaleString()}` : '—'}
      </div>
      <div style={{ marginTop:1, fontFamily:SANS, fontSize:11, color:COLORS.mute }}>
        = $1 {ts && <span style={{ opacity:0.7 }}>· {ts}</span>}
      </div>
    </div>
  );
}

// ─── Timezones ──────────────────────────────────────────────
const CITIES = [
  { key:'New York', zone:'America/New_York', flag:'🇺🇸' },
  { key:'Los Angeles', zone:'America/Los_Angeles', flag:'🇺🇸' },
  { key:'Washington', zone:'America/New_York', flag:'🇺🇸' },
  { key:'London', zone:'Europe/London', flag:'🇬🇧' },
  { key:'Paris', zone:'Europe/Paris', flag:'🇫🇷' },
  { key:'Rome', zone:'Europe/Rome', flag:'🇮🇹' },
  { key:'Berlin', zone:'Europe/Berlin', flag:'🇩🇪' },
  { key:'Dubai', zone:'Asia/Dubai', flag:'🇦🇪' },
  { key:'Bangkok', zone:'Asia/Bangkok', flag:'🇹🇭' },
  { key:'Singapore', zone:'Asia/Singapore', flag:'🇸🇬' },
  { key:'Hong Kong', zone:'Asia/Hong_Kong', flag:'🇭🇰' },
  { key:'Shanghai', zone:'Asia/Shanghai', flag:'🇨🇳' },
  { key:'Tokyo', zone:'Asia/Tokyo', flag:'🇯🇵' },
  { key:'Seoul', zone:'Asia/Seoul', flag:'🇰🇷' },
  { key:'Sydney', zone:'Australia/Sydney', flag:'🇦🇺' },
  { key:'Hawaii', zone:'Pacific/Honolulu', flag:'🇺🇸' },
];

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

function TimezoneCard({ city, onClick }) {
  const [, force] = React.useReducer(x => x+1, 0);
  React.useEffect(() => { const t = setInterval(force, 30000); return () => clearInterval(t); }, []);
  return (
    <button onClick={onClick} style={{
      background:COLORS.card, borderRadius:14, padding:'13px 14px 11px',
      border:'none', cursor:'pointer', textAlign:'left', width:'100%',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em', textTransform:'uppercase' }}>시차</div>
        <Icon name="chevron-d" size={12} color={COLORS.mute} stroke={1.8}/>
      </div>
      <div style={{ marginTop:5, fontFamily:SERIF, fontSize:22, color:COLORS.ink }}>{formatDiffFromSeoul(city.zone)}</div>
      <div style={{ marginTop:1, fontFamily:SANS, fontSize:11, color:COLORS.mute, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
        {city.flag} {city.key} · {formatCityTime(city.zone)}
      </div>
    </button>
  );
}

function CityPicker({ current, onPick, onClose }) {
  const [q, setQ] = React.useState('');
  const filtered = CITIES.filter(c => c.key.toLowerCase().includes(q.toLowerCase()));
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(0,0,0,0.35)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background:COLORS.bg, borderRadius:'22px 22px 0 0', maxHeight:'82%',
        display:'flex', flexDirection:'column',
      }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'8px 0 4px' }}>
          <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
        </div>
        <div style={{ padding:'8px 20px 12px' }}>
          <div style={{ fontFamily:SERIF, fontSize:24, color:COLORS.ink }}>도시 선택</div>
        </div>
        <div style={{ padding:'0 16px 10px' }}>
          <div style={{ background:COLORS.card, borderRadius:10, padding:'10px 12px', display:'flex', gap:8, alignItems:'center' }}>
            <Icon name="search" size={14} color={COLORS.mute} stroke={1.8}/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="도시 검색"
              style={{ border:'none', outline:'none', background:'transparent', flex:1, fontFamily:SANS, fontSize:13, color:COLORS.ink }}/>
          </div>
        </div>
        <div style={{ flex:1, overflow:'auto', padding:'0 16px 40px' }}>
          <div style={{ background:COLORS.card, borderRadius:14, overflow:'hidden' }}>
            {filtered.map((c, i) => (
              <button key={c.key} onClick={() => { onPick(c); onClose(); }} style={{
                width:'100%', border:'none', background:'transparent',
                padding:'12px 14px', display:'flex', gap:10, alignItems:'center',
                borderBottom: i < filtered.length-1 ? `1px solid ${COLORS.line}` : 'none',
                cursor:'pointer', textAlign:'left',
              }}>
                <span style={{ fontSize:18 }}>{c.flag}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:SANS, fontSize:14, color:COLORS.ink }}>{c.key}</div>
                  <div style={{ fontFamily:MONO, fontSize:10.5, color:COLORS.mute, marginTop:2 }}>
                    {formatDiffFromSeoul(c.zone)} · {formatCityTime(c.zone)}
                  </div>
                </div>
                {c.key === current.key && <Icon name="check" size={16} color={COLORS.accent} stroke={2.5}/>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TRIPS SCREEN (top level) ───────────────────────────────
// ─── Trip Card with swipe-to-reveal share/delete ─────────────
function TripSwipeCard({ children, onShare, onDelete, wrapStyle = {} }) {
  const [x, setX] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const startRef = React.useRef(null);
  const dragging = React.useRef(false);
  const xRef = React.useRef(0);
  const REVEAL = 144;
  const DELETE_EXTRA = 72;

  const close = () => { setX(0); xRef.current = 0; setOpen(false); };

  const onTouchStart = (e) => {
    startRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    dragging.current = false;
  };
  const onTouchMove = (e) => {
    if (!startRef.current) return;
    const dx = e.touches[0].clientX - startRef.current.x;
    const dy = Math.abs(e.touches[0].clientY - startRef.current.y);
    if (!dragging.current) {
      if (Math.abs(dx) < 18) return;
      if (dy > Math.abs(dx) * 0.55) { startRef.current = null; return; }
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
    if (!startRef.current || !dragging.current) { startRef.current = null; return; }
    startRef.current = null; dragging.current = false;
    const cur = xRef.current;
    if (cur < -(REVEAL + DELETE_EXTRA / 2)) {
      close();
      setTimeout(() => onDelete(), 260);
    } else if (cur < -REVEAL / 2) {
      xRef.current = -REVEAL; setX(-REVEAL); setOpen(true);
    } else {
      close();
    }
  };

  return (
    <div style={{ position:'relative', overflow:'hidden', ...wrapStyle }}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div style={{
        position:'absolute', right:0, top:0, bottom:0, width:REVEAL,
        display:'flex', alignItems:'center', justifyContent:'center', gap:10,
      }}>
        <button onClick={(e) => { e.stopPropagation(); close(); setTimeout(onShare, 100); }} style={{
          width:50, height:50, borderRadius:25, border:'none', cursor:'pointer',
          background:'#4F6BED', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}><Icon name="share" size={18} color="#fff" stroke={2}/></button>
        <button onClick={(e) => { e.stopPropagation(); close(); setTimeout(onDelete, 100); }} style={{
          width:50, height:50, borderRadius:25, border:'none', cursor:'pointer',
          background:'#B5451B', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}><Icon name="trash" size={18} color="#fff" stroke={2}/></button>
      </div>
      <div style={{
        transform:`translateX(${x}px)`,
        transition: dragging.current ? 'none' : 'transform 0.28s cubic-bezier(0.25,1,0.5,1)',
        background:COLORS.card,
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Share Trip Sheet ─────────────────────────────────────────
function ShareTripSheet({ open, onClose, trip, userData, allTrips, myUid }) {
  const [memberProfiles, setMemberProfiles] = React.useState([]);
  const [contacts, setContacts]   = React.useState([]);
  const [selected, setSelected]   = React.useState(new Set());
  const [email, setEmail]         = React.useState('');
  const [msg, setMsg]             = React.useState('');
  const [loading, setLoading]     = React.useState(false);
  const [sending, setSending]     = React.useState(false);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  React.useEffect(() => {
    if (!open || !trip) return;
    setSelected(new Set()); setEmail(''); setMsg('');
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
  const canSend = selected.size > 0 || email.trim().length > 0;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:400, background:'rgba(0,0,0,0.4)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background:COLORS.bg, borderRadius:'22px 22px 0 0',
        padding:'0 20px calc(28px + env(safe-area-inset-bottom,0px))',
        maxHeight:'80vh', display:'flex', flexDirection:'column',
      }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 6px', flexShrink:0 }}>
          <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
        </div>
        <div style={{ flexShrink:0 }}>
          <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.accent, letterSpacing:'0.14em', marginBottom:4 }}>SHARE TRIP</div>
          <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink, marginBottom:16 }}>{trip.title}</div>
        </div>

        <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch' }}>
          {loading ? (
            <div style={{ textAlign:'center', padding:'20px 0', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>불러오는 중...</div>
          ) : (
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
                      <div style={{ fontFamily:SANS, fontSize:11, color:'#4F6BED', fontWeight:500,
                        background:'#EEF2FF', borderRadius:20, padding:'3px 9px', flexShrink:0 }}>동행중</div>
                    </div>
                  ))}
                  <div style={{ height:16 }}/>
                </>
              )}
              {contacts.length > 0 ? (
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
          ) : null}

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
          )}
        </div>

        <button onClick={handleSend} disabled={sending || !canSend} style={{
          flexShrink:0, marginTop:14, width:'100%', padding:'15px', border:'none', borderRadius:14,
          background: canSend ? COLORS.ink : COLORS.softer,
          color: canSend ? COLORS.bg : COLORS.mute,
          fontFamily:SANS, fontSize:14, fontWeight:500, cursor: canSend ? 'pointer' : 'default',
        }}>{sending ? '보내는 중...' : '초대 보내기'}</button>
      </div>
    </div>
  );
}

function TripsScreen({ trips, onSelect, onAdd, onShare, onDelete, loading, userData, onOpenCompanion, myUid }) {
  return (
    <div style={{ minHeight:'100vh', background:COLORS.bg,
      paddingTop:'calc(env(safe-area-inset-top) + 64px)', paddingBottom:100 }}>
      {/* 프로필 버튼 */}
      <button onClick={onOpenCompanion} style={{
        position:'fixed', top:'calc(14px + env(safe-area-inset-top,0px))', right:16, zIndex:300,
        width:38, height:38, borderRadius:19,
        background: userData?.photoURL ? 'transparent' : COLORS.softer,
        border:`2px solid ${COLORS.line}`, padding:0, cursor:'pointer', overflow:'hidden',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 1px 6px rgba(0,0,0,0.10)',
      }}>
        {userData?.photoURL
          ? <img src={userData.photoURL} alt="profile" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          : <Icon name="user" size={18} color={COLORS.mute}/>
        }
      </button>
      <div style={{ padding:'0 24px 32px' }}>
        <div style={{ fontFamily:SERIF, fontSize:30, color:COLORS.ink }}>My Trips</div>
      </div>
      {loading
        ? <div style={{ textAlign:'center', padding:60, color:COLORS.mute, fontFamily:SANS, fontSize:14 }}>로딩 중...</div>
        : <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:12 }}>
            {trips.map(t => {
              const hue = t.days?.[0]?.hero?.hue ?? 25;
              const label = t.days?.[0]?.hero?.label || t.title?.toUpperCase() || 'TRIP';
              const isShared = Array.isArray(t.members) && t.members.length > 0 && t.members[0] !== myUid;
              return (
                <TripSwipeCard key={t.id}
                  onShare={() => onShare(t)}
                  onDelete={() => onDelete(t.id)}
                  wrapStyle={{ borderRadius:20, border:`1px solid ${COLORS.line}` }}>
                  <div onClick={() => onSelect(t.id)} style={{ cursor:'pointer' }}>
                    <Photo hue={hue} label={label} height={130}/>
                    <div style={{ padding:'14px 18px 16px', position:'relative' }}>
                      <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.accent, letterSpacing:'0.14em' }}>
                        {(t.days||[]).length} DAYS{t.dates ? ' · ' + t.dates : ''}
                      </div>
                      <div style={{ marginTop:4, fontFamily:SERIF, fontSize:28, lineHeight:1.1, color:COLORS.ink, letterSpacing:'-0.015em' }}>
                        {t.title || '새 여행'}
                      </div>
                      {isShared && (
                        <div style={{
                          position:'absolute', top:14, right:16,
                          display:'flex', alignItems:'center', gap:4,
                          background:'#EEF2FF', borderRadius:20, padding:'4px 10px',
                        }}>
                          <Icon name="users" size={11} color="#4F6BED" stroke={2}/>
                          <span style={{ fontFamily:SANS, fontSize:10, color:'#4F6BED', fontWeight:500 }}>공유됨</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TripSwipeCard>
              );
            })}
            <button onClick={onAdd} style={{ marginTop:4, padding:'18px 16px', background:'transparent',
              border:`1.5px dashed ${COLORS.line}`, borderRadius:20, color:COLORS.mute, cursor:'pointer',
              display:'flex', gap:8, alignItems:'center', justifyContent:'center', fontFamily:SANS, fontSize:13.5 }}>
              <Icon name="plus" size={15} color={COLORS.mute} stroke={2}/>새 여행 추가
            </button>
          </div>
      }
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
function HomeScreen({ trip, onOpenDay, onOpenHotel, city, onPickCity,
                      onEditTrip, onReorderDays, onAddDay, onDeleteDay, onBack,
                      onAddHotel, onAddHotelFromSearch, onDeleteHotel, onReorderHotels,
                      onConvertInlineHotel, onAddItemToFirstDay, editing, setEditing,
                      userData, onOpenCompanion }) {
  const [editingTitle, setEditingTitle] = React.useState(false);
  const [datePicker, setDatePicker] = React.useState(null); // 'start' | 'end' | null
  const { itemProps: dayDragProps, isTouchDragging: isDayDragging } = useDragReorder(onReorderDays, editing);
  const { itemProps: hotelDragProps, isTouchDragging: isHotelDragging } = useDragReorder(onReorderHotels, editing);
  const featured = trip.days[0];
  const tripYear = extractTripYear(trip);

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

  const handlePickStart = (iso) => {
    const { startIso } = parseTripDates();
    // 날짜 diff 계산해서 모든 일정 날짜 이동
    if (startIso && iso && startIso !== iso) {
      const oldMs = new Date(startIso + 'T12:00:00').getTime();
      const newMs = new Date(iso       + 'T12:00:00').getTime();
      const diffDays = Math.round((newMs - oldMs) / 86400000);
      const shiftedDays = (trip.days || []).map(d => {
        const dIso = dayDateToIso(d.date, tripYear);
        if (!dIso) return d;
        const shifted = new Date(new Date(dIso + 'T12:00:00').getTime() + diffDays * 86400000);
        const newIso = shifted.toISOString().slice(0,10);
        return { ...d, date: isoToDayDate(newIso), weekday: isoToWeekday(newIso) };
      });
      // trip.dates 새 시작일로 업데이트
      const { endIso } = parseTripDates();
      const newStart = isoToDayDate(iso);
      const newEnd   = endIso ? isoToDayDate(new Date(new Date(endIso + 'T12:00:00').getTime() + diffDays * 86400000).toISOString().slice(0,10)) : '';
      onEditTrip({ days: shiftedDays, dates: newEnd ? `${newStart} — ${newEnd}` : newStart });
    }
  };

  const handlePickEnd = (iso) => {
    const { startIso } = parseTripDates();
    const newStart = startIso ? isoToDayDate(startIso) : (trip.dates?.split(/[—–-]/)[0]?.trim() || '');
    onEditTrip({ dates: `${newStart} — ${isoToDayDate(iso)}` });
  };

  const { startIso, endIso } = parseTripDates();

  return (
    <div style={{ background:COLORS.bg, minHeight:'100%', paddingBottom:110, position:'relative' }}>
      {/* 프로필 버튼 — 페이지 상단에만 고정, 스크롤하면 올라감 */}
      {onOpenCompanion && (
        <button onClick={onOpenCompanion} style={{
          position:'absolute', top:'calc(14px + env(safe-area-inset-top,0px))', right:16, zIndex:10,
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
      <div style={{ paddingTop:'calc(16px + env(safe-area-inset-top, 0px))' }}/>

      <div style={{ padding:'10px 24px 18px' }}>
        {editing && editingTitle ? (
          <input autoFocus value={trip.title} onChange={e => onEditTrip({ title: e.target.value })}
            onBlur={() => setEditingTitle(false)}
            style={{ fontFamily:SERIF, fontSize:56, lineHeight:0.95, color:COLORS.ink,
              letterSpacing:'-0.025em', fontWeight:400, border:'none', outline:'none',
              background:'transparent', width:'100%', padding:0 }}/>
        ) : (
          <div onClick={() => editing && setEditingTitle(true)} style={{
            fontFamily:SERIF, fontSize:56, lineHeight:0.95, color:COLORS.ink,
            letterSpacing:'-0.025em', fontWeight:400,
            cursor: editing ? 'text' : 'default',
          }}>{trip.title}.</div>
        )}
        <div style={{ marginTop:10, display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
          {editing ? (
            <>
              <button onClick={() => setDatePicker('start')} style={{
                border:`1.5px solid ${COLORS.line}`, borderRadius:8, padding:'4px 10px',
                background:COLORS.card, cursor:'pointer', fontFamily:SANS, fontSize:12, color:COLORS.ink,
                display:'flex', alignItems:'center', gap:5,
              }}>
                <Icon name="book" size={11} color={COLORS.mute} stroke={1.8}/>
                {startIso ? isoToDayDate(startIso) : '시작일'}
              </button>
              <span style={{ color:COLORS.mute, fontSize:13 }}>—</span>
              <button onClick={() => setDatePicker('end')} style={{
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
      </div>

      {/* Featured */}
      {featured && (
        <div style={{ padding:'4px 16px 18px' }}>
          <div style={{ background:COLORS.card, borderRadius:22, overflow:'hidden',
            boxShadow:'0 1px 2px rgba(0,0,0,0.03), 0 12px 28px rgba(0,0,0,0.05)' }}>
            <Photo hue={featured.hero.hue} label={featured.hero.label} height={170}/>
            <div style={{ padding:'16px 18px 18px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.accent, letterSpacing:'0.14em' }}>
                  DAY 01 · {featured.weekday.toUpperCase()}
                </div>
                <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute }}>{featured.date}</div>
              </div>
              <div style={{ marginTop:7, fontFamily:SERIF, fontSize:28, lineHeight:1.1, color:COLORS.ink }}>
                {featured.title}
              </div>
              <button onClick={() => onOpenDay(0)} style={{
                marginTop:16, width:'100%', border:'none', cursor:'pointer',
                background:COLORS.ink, color:COLORS.bg, borderRadius:12,
                padding:'13px 16px', fontFamily:SANS, fontSize:14, fontWeight:500,
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <span>첫날 일정 보기</span>
                <Icon name="chevron" size={16} color={COLORS.bg}/>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Days list */}
      <div style={{ padding:'8px 24px 10px', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink }}>일정</div>
        <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em' }}>
          {trip.days.length} DAYS · {trip.days.reduce((s,d)=>s+d.items.length,0)} STOPS
        </div>
      </div>
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:8 }}>
        {trip.days.map((d, i) => {
          const dp = dayDragProps(i);
          const isDropTarget = dp['data-drop-target'];
          const isDragSource = dp['data-drag-source'];
          return (
            <SwipeableRow key={i} onEdit={() => onOpenDay(i)} onDelete={() => onDeleteDay(i)} disabled={editing} isDragging={isDayDragging} wrapStyle={{ borderRadius:16 }}>
            <div ref={dp.ref} onTouchStart={dp.onTouchStart} onTouchMove={dp.onTouchMove} onTouchEnd={dp.onTouchEnd}
              onClick={() => !editing && !isDayDragging && onOpenDay(i)} style={{
              borderRadius:16,
              cursor: editing ? 'grab' : 'pointer',
              ...(dp.style || {}),
              // 드롭 타겟: 카드 모양 고스트 플레이스홀더
              ...(isDropTarget ? {
                background: 'transparent',
                border: `2px dashed ${COLORS.line}`,
              } : {
                background: COLORS.card,
                border: 'none',
              }),
            }}>
              {isDropTarget ? (
                // 카드 모양 빈 플레이스홀더 (같은 높이)
                <div style={{ height:88, borderRadius:14 }}/>
              ) : (
                <div style={{ padding:12, display:'flex', gap:12, alignItems:'center' }}>
                  <div style={{ width:64, height:64, borderRadius:10, overflow:'hidden', flexShrink:0 }}>
                    <Photo hue={d.hero.hue} height={64} small/>
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
                      <span>{d.items.length} stops</span>
                    </div>
                  </div>
                  {editing ? (
                    <>
                      <DragHandle size={14} color={COLORS.mute}/>
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
              )}
            </div>
            </SwipeableRow>
          );
        })}
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

      {/* Hotels — trip.hotels + any 'hotel' category items in days */}
      {(() => {
        const hotelList = trip.hotels || [];
        // Inline hotels: hotel items in days not already in trip.hotels
        const inlineHotels = [];
        trip.days.forEach((d, di) => {
          (d.items || []).forEach((it, ii) => {
            if (it.cat === 'hotel') {
              const exists = hotelList.some(h =>
                h.name === it.title || h.name === it.en ||
                (it._hotelRef && it._hotelRef === h.name));
              if (!exists) inlineHotels.push({
                name: it.en || it.title.replace(/\s*(체크인|체크아웃)\s*$/, ''),
                area: d.title, checkin: `${d.date}${it.time ? ' · '+it.time : ''}`,
                hue: d.hero.hue, _inline: true, _dayIdx: di,
              });
            }
          });
        });
        const total = hotelList.length + inlineHotels.length;
        return (
          <>
            <div style={{ padding:'22px 24px 8px', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink }}>숙소</div>
              <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em' }}>
                {total} STAYS
              </div>
            </div>
            <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:8 }}>
              {hotelList.map((h, i) => {
                const hp = hotelDragProps(i);
                return (
                  <SwipeableRow key={i} onEdit={() => onOpenHotel(i)} onDelete={() => onDeleteHotel(i)} disabled={editing} wrapStyle={{ borderRadius:16 }}>
                  <div {...hp} onClick={() => !editing && onOpenHotel(i)} style={{
                    background:COLORS.card, borderRadius:16, padding:12,
                    display:'flex', gap:12, alignItems:'center',
                    cursor: editing ? 'grab' : 'pointer',
                    border: hp['data-drag-over'] ? `2px solid ${COLORS.accent}` : 'none',
                    ...(hp.style || {}),
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
                        <DragHandle size={14} color={COLORS.mute}/>
                        <button onClick={(e)=>{e.stopPropagation(); onDeleteHotel(i);}} style={{
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
                );
              })}
              {inlineHotels.map((h, i) => {
                // trip.hotels에 같은 이름 있으면 그리로, 없으면 자동 추가 후 오픈
                const handleClick = () => {
                  const matchIdx = (trip.hotels||[]).findIndex(h2 => h2.name === h.name);
                  if (matchIdx >= 0) { onOpenHotel(matchIdx); }
                  else { onConvertInlineHotel(h); }
                };
                return (
                  <SwipeableRow key={'inl'+i} onEdit={handleClick} onDelete={() => {}} disabled={editing} wrapStyle={{ borderRadius:16 }}>
                  <div onClick={handleClick} style={{
                    background:COLORS.card, borderRadius:16, padding:12,
                    display:'flex', gap:12, alignItems:'center', cursor:'pointer',
                  }}>
                    <div style={{ width:64, height:64, borderRadius:10, overflow:'hidden', flexShrink:0 }}>
                      <Photo hue={h.hue ?? 25} height={64} small/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.accent, letterSpacing:'0.12em' }}>
                        STAY · {h.checkin}
                      </div>
                      <div style={{ marginTop:3, fontFamily:SERIF, fontSize:18, lineHeight:1.2, color:COLORS.ink,
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{h.name}</div>
                      <div style={{ marginTop:3, fontFamily:SANS, fontSize:11.5, color:COLORS.mute,
                        display:'flex', gap:5, alignItems:'center' }}>
                        <Icon name="pin" size={11} color={COLORS.mute} stroke={1.8}/>
                        <span>{h.area}</span>
                      </div>
                    </div>
                    <Icon name="chevron" size={16} color={COLORS.mute} stroke={1.8}/>
                  </div>
                  </SwipeableRow>
                );
              })}
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onAddHotelFromSearch} style={{
            flex:1, padding:'13px 12px', background:COLORS.ink, color:COLORS.bg,
            border:'none', borderRadius:14, cursor:'pointer',
            display:'flex', gap:7, alignItems:'center', justifyContent:'center',
            fontFamily:SANS, fontSize:13, fontWeight:500,
          }}>
            <Icon name="search" size={13} color={COLORS.bg} stroke={2}/> 숙소 검색
          </button>
          <button onClick={onAddHotel} style={{
            flex:1, padding:'13px 12px', background:'transparent',
            border:`1.5px dashed ${COLORS.line}`, borderRadius:14,
            color:COLORS.mute, cursor:'pointer',
            display:'flex', gap:7, alignItems:'center', justifyContent:'center',
            fontFamily:SANS, fontSize:13,
          }}>
            <Icon name="plus" size={13} color={COLORS.mute} stroke={2}/> 직접 추가
          </button>
        </div>
      </div>
          </>
        );
      })()}

      {/* Practical */}
      <div style={{ padding:'22px 24px 8px' }}>
        <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink }}>실용 정보</div>
      </div>
      <div style={{ padding:'0 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        <FxCard/>
        <TimezoneCard city={city} onClick={onPickCity}/>
      </div>

      {/* 날짜 달력 팝업 */}
      <DatePickerSheet
        open={datePicker === 'start'}
        title="시작 날짜"
        value={startIso}
        onClose={() => setDatePicker(null)}
        onPick={(iso) => { handlePickStart(iso); setDatePicker(null); }}
      />
      <DatePickerSheet
        open={datePicker === 'end'}
        title="종료 날짜"
        value={endIso}
        minDate={startIso}
        onClose={() => setDatePicker(null)}
        onPick={(iso) => { handlePickEnd(iso); setDatePicker(null); }}
      />
    </div>
  );
}

// ─── Day screen ─────────────────────────────────────────────
function DayScreen({ trip, dayIdx, onBack, onOpenStop, onNavDay,
                     onEditDay, onAddItem, onDeleteItem, onReorderItems, editing, setEditing }) {
  const day = trip.days[dayIdx];
  const tripYear = extractTripYear(trip);
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
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const { itemProps: itemDragProps } = useDragReorder(onReorderItems, editing);

  return (
    <div style={{ background:COLORS.bg, minHeight:'100%', paddingBottom:110 }}>
      <div style={{ position:'relative', marginTop:'calc(-1 * env(safe-area-inset-top, 0px))' }}>
        <Photo hue={day.hero.hue} label={day.hero.label} height='calc(280px + env(safe-area-inset-top, 0px))'/>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:180,
          background:'linear-gradient(180deg, rgba(0,0,0,0.28), transparent)' }}/>
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
            {editing && editingTitle ? (
              <input autoFocus value={day.title} onChange={e => onEditDay({ title: e.target.value })}
                onBlur={() => setEditingTitle(false)}
                style={{ marginTop:8, fontFamily:SERIF, fontSize:30, lineHeight:1.08, color:COLORS.ink,
                  border:'none', outline:'none', background:'transparent', width:'100%', padding:0 }}/>
            ) : (
              <div onClick={() => editing && setEditingTitle(true)} style={{
                marginTop:8, fontFamily:SERIF, fontSize:30, lineHeight:1.08, color:COLORS.ink,
                cursor: editing ? 'text' : 'default',
              }}>{day.title}</div>
            )}
            <div style={{ marginTop:2, fontFamily:SANS, fontSize:13, color:COLORS.mute, fontStyle:'italic' }}>
              {day.titleEn}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding:'48px 16px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'0 6px 12px' }}>
          <div style={{ fontFamily:SERIF, fontSize:22, color:COLORS.ink }}>타임라인</div>
          <div style={{ fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.1em' }}>
            {done.size}/{day.items.length} DONE
          </div>
        </div>

        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', left:52, top:14, bottom:14, width:1, background:COLORS.line }}/>
          {day.items.map((it, i) => {
            const meta = CAT_META[it.cat] || { icon:'pin', label:it.cat };
            const isDone = done.has(i);
            const dp = itemDragProps(i);
            return (
              <div key={i} {...dp} style={{ display:'flex', marginBottom:12, position:'relative', ...(dp.style || {}) }}>
                <div style={{ width:44, flexShrink:0, paddingTop:14,
                  fontFamily:MONO, fontSize:10.5, color:COLORS.mute,
                  textAlign:'right', paddingRight:4 }}>{it.time}</div>
                <div style={{ width:16, flexShrink:0, display:'flex', justifyContent:'center',
                  paddingTop:15, position:'relative', zIndex:2 }}>
                  <button onClick={(e)=>{e.stopPropagation(); toggle(i);}} style={{
                    width:16, height:16, borderRadius:8,
                    border:`1.5px solid ${isDone?COLORS.accent:COLORS.ink}`,
                    background: isDone?COLORS.accent:COLORS.bg, cursor:'pointer', padding:0,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    {isDone && <Icon name="check" size={10} color="#fff" stroke={3}/>}
                  </button>
                </div>
                <SwipeableRow
                  wrapStyle={{ flex:1, marginLeft:10, borderRadius:14 }}
                  disabled={editing}
                  onEdit={() => onOpenStop({ idx: i, stop: it, editing: true })}
                  onDelete={() => onDeleteItem(i)}>
                <div style={{ position:'relative' }}>
                  <button onClick={() => onOpenStop({ idx: i, stop: it, editing })} style={{
                    width:'100%', background:COLORS.card, borderRadius:14, border:'none', cursor:'pointer',
                    padding:'11px 14px 13px', textAlign:'left', opacity: isDone ? 0.5 : 1,
                  }}>
                    <div style={{ display:'flex', gap:6, alignItems:'center',
                      fontFamily:MONO, fontSize:9.5, color:COLORS.mute,
                      letterSpacing:'0.12em', textTransform:'uppercase' }}>
                      <Icon name={meta.icon} size={11} stroke={1.8}/>
                      <span>{meta.label}</span>
                      {it.duration && (<><span style={{ opacity:0.4 }}>·</span><span>{it.duration}</span></>)}
                      {it.price && (<><span style={{ opacity:0.4 }}>·</span><span>{it.price}</span></>)}
                    </div>
                    <div style={{ marginTop:3, fontFamily:SANS, fontSize:14.5, fontWeight:500,
                      color:COLORS.ink, textDecoration: isDone?'line-through':'none' }}>
                      {it.title}
                    </div>
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
                  {editing && dp['data-drag-over'] && (
                    <div style={{ position:'absolute', inset:-2, border:`2px solid ${COLORS.accent}`,
                      borderRadius:16, pointerEvents:'none' }}/>
                  )}
                </div>
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

  return (
    <div style={{ background:COLORS.bg, minHeight:'100%', paddingBottom:110 }}>
      <div style={{ position:'relative', marginTop:'calc(-1 * env(safe-area-inset-top, 0px))' }}>
        <Photo hue={draft.hue || 25} label={(draft.name || '').toUpperCase().slice(0, 20)} height='calc(240px + env(safe-area-inset-top, 0px))'/>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:180,
          background:'linear-gradient(180deg, rgba(0,0,0,0.28), transparent)' }}/>
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

// ─── Stop sheet (unchanged except pulls editing from open) ─
function StopSheet({ open, dayHue, onClose, onSave }) {
  if (!open) return null;
  const [editing, setEditing] = React.useState(!!open.editing);
  const [draft, setDraft] = React.useState(open.stop);
  const [sheetY, setSheetY] = React.useState(0);
  const sheetTouchStart = React.useRef(null);
  const sheetScrollTop = React.useRef(0);
  const sheetRef = React.useRef(null);

  React.useEffect(() => { setDraft(open.stop); setSheetY(0); setEditing(!!open.editing); }, [open]);

  // 배경 스크롤 잠금
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const searchQuery = [draft.title, draft.en, draft.loc, 'New York'].filter(Boolean).join(' ');

  // 드래그로 닫기 — 시트 스크롤이 최상단일 때만 동작
  const onDragStart = (e) => {
    sheetScrollTop.current = sheetRef.current ? sheetRef.current.scrollTop : 0;
    sheetTouchStart.current = e.touches[0].clientY;
  };
  const onDragMove = (e) => {
    if (sheetTouchStart.current === null) return;
    if (sheetScrollTop.current > 8) { sheetTouchStart.current = null; return; }
    const dy = e.touches[0].clientY - sheetTouchStart.current;
    if (dy > 0) { e.preventDefault(); setSheetY(dy); }
  };
  const onDragEnd = () => {
    if (sheetY > 100) onClose();
    else setSheetY(0);
    sheetTouchStart.current = null;
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:100,
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
      background:`rgba(0,0,0,${Math.max(0, 0.35 - sheetY / 400)})` }} onClick={onClose}>
      <div ref={sheetRef} onClick={(e)=>e.stopPropagation()}
        style={{
          background:COLORS.bg, borderRadius:'22px 22px 0 0',
          paddingBottom:40, maxHeight:'92%', overflowY:'auto', overflowX:'hidden',
          transform: `translateY(${sheetY}px)`,
          transition: sheetY === 0 ? 'transform 0.32s cubic-bezier(0.32,0.72,0,1)' : 'none',
        }}>
        {/* 드래그 핸들 — 탭 전체 영역 */}
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 6px', cursor:'grab', touchAction:'none' }}
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}>
          <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
        </div>
        {/* 사진 영역도 드래그 가능 + 수정 버튼 오버레이 */}
        <div style={{ position:'relative', touchAction:'none' }}
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}>
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
            <EditStopForm draft={draft} setDraft={setDraft}/>
          ) : (
            <>
              <div style={{ marginTop:8, fontFamily:SERIF, fontSize:28, lineHeight:1.12, color:COLORS.ink }}>
                {draft.title}
              </div>
              <div style={{ marginTop:2, fontFamily:SANS, fontSize:13.5, color:COLORS.mute, fontStyle:'italic' }}>
                {draft.en}
              </div>
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
                <button onClick={() => { onSave(draft); setEditing(false); }} style={{
                  flex:1, background:COLORS.ink, color:COLORS.bg,
                  border:'none', borderRadius:12, padding:'13px',
                  fontFamily:SANS, fontSize:14, fontWeight:500, cursor:'pointer',
                  display:'flex', gap:6, alignItems:'center', justifyContent:'center',
                }}>
                  <Icon name="save" size={14} color={COLORS.bg} stroke={1.8}/> 저장
                </button>
                <button onClick={() => setEditing(false)} style={{
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
    </div>
  );
}

function EditStopForm({ draft, setDraft }) {
  const [showHotelSearch, setShowHotelSearch] = React.useState(false);
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
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {field('time', '시간')}
        {field('cat', '카테고리', 'select')}
      </div>
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
      {field('loc', '위치')}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {field('duration', '소요 시간')}
        {field('price', '가격')}
      </div>
      {field('note', '메모', 'textarea')}
      {showHotelSearch && (
        <HotelSearchSheet
          COLORS={COLORS} SERIF={SERIF} SANS={SANS} MONO={MONO} Icon={Icon}
          onPick={(name) => {
            const m = name.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
            const hotelName = m ? m[1] : name;
            const area = m ? m[2] : '';
            setDraft({ ...draft, title: hotelName, en: hotelName, loc: area });
          }}
          onClose={() => setShowHotelSearch(false)}/>
      )}
    </div>
  );
}

// ─── Map ────────────────────────────────────────────────────
function MapScreen({ trip }) {
  const [selectedDay, setSelectedDay] = React.useState(0);
  const day = trip.days[selectedDay];
  const places = day.items.filter(it => it.loc).map(it => `${it.title} ${it.loc || ''}`.trim());
  const query = (places[0] || day.titleEn || 'New York') + ', New York';
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <div style={{ background:COLORS.bg, minHeight:'100%', paddingBottom:110 }}>
      <div style={{ paddingTop:'calc(16px + env(safe-area-inset-top, 0px))', paddingLeft:24, paddingRight:24, paddingBottom:8 }}>
        <div style={{ fontFamily:MONO, fontSize:11, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase' }}>Map</div>
        <div style={{ marginTop:4, fontFamily:SERIF, fontSize:38, color:COLORS.ink, letterSpacing:'-0.02em' }}>Google Maps.</div>
      </div>
      <div style={{ padding:'4px 16px 12px', overflowX:'auto', whiteSpace:'nowrap' }}>
        <div style={{ display:'inline-flex', gap:6 }}>
          {trip.days.map((d, i) => (
            <button key={i} onClick={() => setSelectedDay(i)} style={{
              border:'none', borderRadius:14, padding:'8px 14px', cursor:'pointer',
              background: i === selectedDay ? COLORS.ink : COLORS.card,
              color: i === selectedDay ? COLORS.bg : COLORS.ink,
              fontFamily:MONO, fontSize:11, letterSpacing:'0.08em',
            }}>D{String(d.n).padStart(2,'0')}</button>
          ))}
        </div>
      </div>
      <div style={{ padding:'0 16px' }}>
        <div style={{ background:COLORS.card, borderRadius:18, overflow:'hidden', border:`1px solid ${COLORS.line}` }}>
          <iframe key={query} src={embedUrl}
            style={{ width:'100%', height:340, border:'none', display:'block' }}
            loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Google Maps"/>
        </div>
      </div>
      <div style={{ padding:'16px 24px 6px' }}>
        <div style={{ fontFamily:SERIF, fontSize:20, color:COLORS.ink }}>
          Day {String(day.n).padStart(2,'0')} · {day.title}
        </div>
      </div>
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:6 }}>
        {day.items.filter(it => it.loc).map((it, i) => (
          <button key={i} onClick={() => window.open(mapsDirectionsUrl(`${it.title} ${it.loc} New York`), '_blank')} style={{
            background:COLORS.card, borderRadius:12, padding:'11px 14px',
            display:'flex', gap:10, alignItems:'center', cursor:'pointer', border:'none', textAlign:'left',
          }}>
            <Icon name="pin" size={14} color={COLORS.accent} stroke={2}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.ink, fontWeight:500,
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.title}</div>
              <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute,
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.loc}</div>
            </div>
            <Icon name="nav" size={14} color={COLORS.mute} stroke={1.8}/>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Food ───────────────────────────────────────────────────
function FoodScreen({ trip, onEditFood, editing, setEditing }) {
  const grouped = {};
  (trip.food || []).forEach((f, idx) => { (grouped[f.cat] = grouped[f.cat] || []).push({ ...f, idx }); });

  const addFood = () => {
    const list = [...(trip.food || []), { cat:'🍕 New', name:'새 맛집', detail:'', price:'', note:'' }];
    onEditFood(list);
  };
  const delFood = (idx) => {
    if (!confirm('이 맛집을 삭제할까요?')) return;
    onEditFood((trip.food || []).filter((_, i) => i !== idx));
  };
  const updateFood = (idx, patch) => {
    const list = [...(trip.food || [])];
    list[idx] = { ...list[idx], ...patch };
    onEditFood(list);
  };

  return (
    <div style={{ background:COLORS.bg, minHeight:'100%', paddingBottom:110 }}>
      <div style={{ paddingTop:'calc(16px + env(safe-area-inset-top, 0px))', paddingLeft:24, paddingRight:24, paddingBottom:16 }}>
        <div style={{ fontFamily:MONO, fontSize:11, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase' }}>Food Guide</div>
        <div style={{ marginTop:4, fontFamily:SERIF, fontSize:38, color:COLORS.ink, letterSpacing:'-0.02em' }}>먹어볼 것.</div>
      </div>
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:18 }}>
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <div style={{ padding:'0 4px 8px', fontFamily:MONO, fontSize:11, color:COLORS.mute, letterSpacing:'0.08em' }}>
              {cat}
            </div>
            <div style={{ background:COLORS.card, borderRadius:14, overflow:'hidden' }}>
              {items.map((f, i) => (
                <div key={f.idx} style={{
                  padding:'12px 14px', position:'relative',
                  borderBottom: i < items.length - 1 ? `1px solid ${COLORS.line}` : 'none',
                }}>
                  {editing ? (
                    <>
                      <input value={f.name} onChange={e => updateFood(f.idx, { name: e.target.value })}
                        style={{ width:'100%', border:'none', outline:'none', background:'transparent',
                          fontFamily:SANS, fontSize:14, fontWeight:500, color:COLORS.ink, padding:0 }}/>
                      <input value={f.detail} onChange={e => updateFood(f.idx, { detail: e.target.value })}
                        placeholder="상세"
                        style={{ width:'100%', marginTop:3, border:'none', outline:'none', background:'transparent',
                          fontFamily:SANS, fontSize:12, color:COLORS.mute, padding:0 }}/>
                      <button onClick={() => delFood(f.idx)} style={{
                        position:'absolute', top:8, right:8,
                        width:24, height:24, borderRadius:12, border:'none',
                        background:'rgba(193,79,46,0.12)', cursor:'pointer',
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        <Icon name="trash" size={11} color={COLORS.accent} stroke={2}/>
                      </button>
                    </>
                  ) : (
                    <button onClick={() => window.open(mapsSearchUrl(`${f.name} New York`), '_blank')} style={{
                      width:'100%', padding:0, border:'none', background:'transparent', cursor:'pointer', textAlign:'left',
                    }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8 }}>
                        <div style={{ fontFamily:SANS, fontSize:14, color:COLORS.ink, fontWeight:500 }}>{f.name}</div>
                        {f.price && <div style={{ fontFamily:MONO, fontSize:10.5, color:COLORS.accent, flexShrink:0 }}>{f.price}</div>}
                      </div>
                      <div style={{ marginTop:3, fontFamily:SANS, fontSize:12, color:COLORS.mute, lineHeight:1.4 }}>{f.detail}</div>
                      {f.note && <div style={{ marginTop:4, fontFamily:SANS, fontSize:11, color:COLORS.mute, fontStyle:'italic', opacity:0.8 }}>— {f.note}</div>}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {editing && (
          <button onClick={addFood} style={{
            padding:'14px 12px', background:'transparent',
            border:`1.5px dashed ${COLORS.line}`, borderRadius:14,
            color:COLORS.mute, cursor:'pointer',
            display:'flex', gap:8, alignItems:'center', justifyContent:'center',
            fontFamily:SANS, fontSize:13,
          }}>
            <Icon name="plus" size={14} color={COLORS.mute} stroke={2}/> 맛집 추가
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Prep (editable lists) ─────────────────────────────────
function PrepScreen({ trip, prep: prepProp, onEditPrep, editing, setEditing }) {
  const totalStops = trip.days.reduce((s,d)=>s+d.items.length,0);
  const prep = prepProp || trip.prep || { checklist: [], docs: [], pack: [] };

  // ── D-day 계산 ─────────────────────────────────────────────
  const tripYear   = extractTripYear(trip);
  const firstDate  = trip.days[0]?.date  || '';
  const lastDate   = trip.days[trip.days.length - 1]?.date || '';
  const parseDate  = (s) => {
    if (!s) return null;
    const iso = dayDateToIso(s, tripYear);
    if (!iso) return null;
    return new Date(iso + 'T12:00:00');
  };
  const depDate    = parseDate(firstDate);
  const retDate    = parseDate(lastDate);
  const today      = new Date(); today.setHours(0,0,0,0);
  let ddayLabel = '', ddayColor = COLORS.ink;
  if (depDate) {
    depDate.setHours(0,0,0,0);
    if (retDate) retDate.setHours(0,0,0,0);
    const diff = Math.round((depDate - today) / 86400000);
    if (diff > 0) {
      ddayLabel = `D-${diff}`;
      ddayColor = COLORS.accent;
    } else if (retDate && today <= retDate) {
      ddayLabel = `여행 중 ✈️`;
      ddayColor = '#2E7D32';
    } else {
      ddayLabel = `D+${Math.abs(diff)}`;
      ddayColor = COLORS.mute;
    }
  }

  const Section = ({ sectionKey, title }) => {
    const items = prep[sectionKey] || [];
    const { itemProps } = useDragReorder((from, to) => {
      const list = [...items];
      const [m] = list.splice(from, 1); list.splice(to, 0, m);
      onEditPrep({ ...prep, [sectionKey]: list });
    }, editing);
    const update = (i, v) => {
      const list = [...items]; list[i] = v;
      onEditPrep({ ...prep, [sectionKey]: list });
    };
    const del = (i) => onEditPrep({ ...prep, [sectionKey]: items.filter((_, j) => j !== i) });
    const add = () => onEditPrep({ ...prep, [sectionKey]: [...items, '새 항목'] });

    return (
      <div style={{ padding:'0 16px', marginTop:16 }}>
        <div style={{ padding:'0 4px 8px', fontFamily:MONO, fontSize:10, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase' }}>
          {title}
        </div>
        <div style={{ background:COLORS.card, borderRadius:14, overflow:'hidden' }}>
          {items.map((t, i) => {
            const dp = itemProps(i);
            return (
              <div key={i} {...dp} style={{
                display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
                borderBottom: i < items.length - 1 ? `1px solid ${COLORS.line}` : 'none',
                ...(dp.style || {}),
                outline: dp['data-drag-over'] ? `2px solid ${COLORS.accent}` : 'none',
                outlineOffset: -2,
              }}>
                <div style={{ width:16, height:16, borderRadius:8, border:`1.5px solid ${COLORS.ink}`, flexShrink:0 }}/>
                {editing ? (
                  <input value={t} onChange={e => update(i, e.target.value)}
                    style={{ flex:1, border:'none', outline:'none', background:'transparent',
                      fontFamily:SANS, fontSize:13.5, color:COLORS.ink, padding:0 }}/>
                ) : (
                  <span style={{ flex:1, fontFamily:SANS, fontSize:13.5, color:COLORS.ink }}>{t}</span>
                )}
                {editing && (
                  <>
                    <DragHandle size={13} color={COLORS.mute}/>
                    <button onClick={() => del(i)} style={{
                      width:22, height:22, borderRadius:11, border:'none',
                      background:'rgba(193,79,46,0.12)', cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <Icon name="trash" size={11} color={COLORS.accent} stroke={2}/>
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
        {editing && (
          <button onClick={add} style={{
            marginTop:6, padding:'10px 12px', background:'transparent',
            border:`1.5px dashed ${COLORS.line}`, borderRadius:12,
            color:COLORS.mute, cursor:'pointer', width:'100%',
            display:'flex', gap:8, alignItems:'center', justifyContent:'center',
            fontFamily:SANS, fontSize:12,
          }}>
            <Icon name="plus" size={12} color={COLORS.mute} stroke={2}/> 항목 추가
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={{ background:COLORS.bg, minHeight:'100%', paddingBottom:110 }}>
      <div style={{ paddingTop:'calc(16px + env(safe-area-inset-top, 0px))', paddingLeft:24, paddingRight:24, paddingBottom:16 }}>
        <div style={{ fontFamily:MONO, fontSize:11, color:COLORS.mute, letterSpacing:'0.12em', textTransform:'uppercase' }}>Preparation</div>
        <div style={{ marginTop:4, fontFamily:SERIF, fontSize:38, color:COLORS.ink, letterSpacing:'-0.02em' }}>출발 준비.</div>
      </div>
      {depDate && (
        <div style={{ padding:'0 16px', marginBottom:8 }}>
          <div style={{ background:COLORS.card, borderRadius:16,
            padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between',
            boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <div>
              <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.1em',
                textTransform:'uppercase', marginBottom:4 }}>여행 기간</div>
              <div style={{ fontFamily:SANS, fontSize:13.5, color:COLORS.ink, fontWeight:500 }}>
                {firstDate}{lastDate && lastDate !== firstDate ? ` – ${lastDate}` : ''}
              </div>
              <div style={{ fontFamily:MONO, fontSize:11, color:COLORS.mute, marginTop:3 }}>
                {trip.days.length}박 {trip.days.length}일
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.1em',
                textTransform:'uppercase', marginBottom:4 }}>D-DAY</div>
              <div style={{ fontFamily:SERIF, fontSize:32, color:ddayColor, letterSpacing:'-0.02em', lineHeight:1 }}>
                {ddayLabel}
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{ padding:'0 16px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
        {[{v:trip.days.length,l:'Days'},{v:totalStops,l:'Stops'},{v:(trip.food||[]).length,l:'Eats'}].map((s, i) => (
          <div key={i} style={{ background:COLORS.card, borderRadius:12, padding:'14px 10px', textAlign:'center' }}>
            <div style={{ fontFamily:SERIF, fontSize:28, color:COLORS.ink }}>{s.v}</div>
            <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, letterSpacing:'0.1em', textTransform:'uppercase', marginTop:2 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <Section sectionKey="checklist" title="체크리스트"/>
      <Section sectionKey="docs"      title="입국 서류"/>
      <Section sectionKey="pack"      title="챙길 물건"/>
    </div>
  );
}

// ─── Tab bar (no edit toggle) ──────────────────────────────
function TabBar({ tab, setTab, visible, editing, onToggleEdit }) {
  const tabs = [
    { id:'home', icon:'sight', label:'일정' },
    { id:'map',  icon:'map',   label:'지도' },
    { id:'food', icon:'food',  label:'맛집' },
    { id:'prep', icon:'user',  label:'준비' },
  ];
  return (
    <div style={{
      position:'fixed', left:14, right:14, bottom:'env(safe-area-inset-bottom, 0px)', zIndex:30,
      background:'rgba(255,255,255,0.88)',
      backdropFilter:'blur(20px) saturate(180%)',
      WebkitBackdropFilter:'blur(20px) saturate(180%)',
      borderRadius:26, padding:'9px 10px 11px',
      boxShadow:'0 2px 6px rgba(0,0,0,0.04), 0 10px 30px rgba(0,0,0,0.08)',
      border:`0.5px solid ${COLORS.line}`,
      display:'flex', gap:2, alignItems:'center',
      transition:'opacity 0.25s ease',
      opacity: visible ? 1 : 0,
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
      <button onClick={onToggleEdit} style={{
        width:40, height:40, borderRadius:20, border:'none', cursor:'pointer',
        background: editing ? COLORS.accent : 'transparent',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
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

// ─── Companion Sheet ──────────────────────────────────────────
function CompanionSheet({ open, onClose, authUser, userData, onUserDataUpdate, trips }) {
  const [tripCompanions, setTripCompanions] = React.useState({});
  const [expandedInvite, setExpandedInvite] = React.useState(null);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteMsg, setInviteMsg] = React.useState('');
  const [inviting, setInviting] = React.useState(false);
  const [pendingInvites, setPendingInvites] = React.useState([]);

  const tripIds = (trips || []).map(t => t.id).join(',');
  React.useEffect(() => {
    if (!open || !userData) return;
    (trips || []).forEach(t => {
      fbGetTripCompanions(t.id, authUser.uid).then(members => {
        setTripCompanions(prev => ({ ...prev, [t.id]: members }));
      });
    });
    const unsub = fbListenInvites(authUser.uid, setPendingInvites);
    return unsub;
  }, [open, tripIds]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const handleInvite = async (tripId, tripTitle) => {
    if (!inviteEmail.trim()) return;
    setInviting(true); setInviteMsg('');
    const res = await fbSendTripInvite(userData, inviteEmail, tripId, tripTitle);
    setInviting(false);
    if (res.error) setInviteMsg(res.error);
    else { setInviteMsg(`${res.toName}님께 초대를 보냈습니다!`); setInviteEmail(''); }
  };

  const handleAccept = async (inv) => {
    const tripId = await fbAcceptTripInvite(inv, authUser.uid);
    onUserDataUpdate({ ...userData, tripIds: [...(userData.tripIds || []), tripId] });
    setPendingInvites(p => p.filter(i => i.id !== inv.id));
  };

  if (!open) return null;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.4)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end' }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:COLORS.bg, borderRadius:'22px 22px 0 0',
        paddingBottom:'calc(24px + env(safe-area-inset-bottom,0px))',
        maxHeight:'88%', overflowY:'auto',
      }}>
        {/* 핸들 */}
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 6px' }}>
          <div style={{ width:36, height:4, background:COLORS.line, borderRadius:2 }}/>
        </div>

        {/* 프로필 헤더 */}
        <div style={{ padding:'12px 20px 16px', display:'flex', gap:14, alignItems:'center',
          borderBottom:`1px solid ${COLORS.line}` }}>
          {authUser.photoURL
            ? <img src={authUser.photoURL} style={{ width:52, height:52, borderRadius:26, flexShrink:0 }}/>
            : <div style={{ width:52, height:52, borderRadius:26, background:COLORS.accent,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
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

        {/* 받은 초대 */}
        {pendingInvites.length > 0 && (
          <div style={{ margin:'14px 16px 0', background:'#FFF8E1', borderRadius:14, padding:14 }}>
            <div style={{ fontFamily:MONO, fontSize:9.5, color:'#B8860B', letterSpacing:'0.1em', marginBottom:8 }}>
              📩 동행 초대 {pendingInvites.length}건
            </div>
            {pendingInvites.map(inv => (
              <div key={inv.id} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                {inv.fromPhoto
                  ? <img src={inv.fromPhoto} style={{ width:36, height:36, borderRadius:18 }}/>
                  : <div style={{ width:36, height:36, borderRadius:18, background:COLORS.accent,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontFamily:SANS, fontSize:14, color:'#fff' }}>{(inv.fromName||'?')[0]}</div>
                }
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.ink, fontWeight:500 }}>{inv.fromName}</div>
                  <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute }}>{inv.tripTitle || inv.fromEmail}</div>
                </div>
                <button onClick={() => handleAccept(inv)} style={{
                  border:'none', borderRadius:10, padding:'6px 12px', cursor:'pointer',
                  background:COLORS.ink, color:COLORS.bg, fontFamily:SANS, fontSize:12, fontWeight:500,
                }}>수락</button>
                <button onClick={() => fbRejectInvite(inv.id).then(() => setPendingInvites(p=>p.filter(i=>i.id!==inv.id)))} style={{
                  border:`1px solid ${COLORS.line}`, borderRadius:10, padding:'6px 10px', cursor:'pointer',
                  background:'transparent', fontFamily:SANS, fontSize:12, color:COLORS.mute,
                }}>거절</button>
              </div>
            ))}
          </div>
        )}

        {/* 여행별 동행인 섹션 */}
        <div style={{ padding:'12px 16px 0' }}>
          {(trips || []).length === 0 ? (
            <div style={{ padding:'24px 0', textAlign:'center', fontFamily:SANS, fontSize:13, color:COLORS.mute }}>
              여행이 없습니다.
            </div>
          ) : (trips || []).map(t => {
            const members = tripCompanions[t.id] || [];
            const isExpanded = expandedInvite === t.id;
            const hasBorder = members.length > 0 || isExpanded;
            return (
              <div key={t.id} style={{ marginBottom:12, background:COLORS.card,
                borderRadius:16, overflow:'hidden', border:`1px solid ${COLORS.line}` }}>
                {/* 여행 헤더 */}
                <div style={{ padding:'12px 14px', borderBottom: hasBorder ? `1px solid ${COLORS.line}` : 'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:SERIF, fontSize:16, color:COLORS.ink }}>{t.title || '새 여행'}</div>
                      {t.dates && <div style={{ fontFamily:MONO, fontSize:9.5, color:COLORS.mute, marginTop:1 }}>{t.dates}</div>}
                    </div>
                    <button onClick={() => {
                      if (isExpanded) { setExpandedInvite(null); setInviteEmail(''); setInviteMsg(''); }
                      else { setExpandedInvite(t.id); setInviteEmail(''); setInviteMsg(''); }
                    }} style={{
                      display:'flex', alignItems:'center', gap:4, padding:'6px 12px',
                      borderRadius:20, border:`1px solid ${COLORS.line}`, background:'transparent',
                      cursor:'pointer', fontFamily:SANS, fontSize:12, color:COLORS.mute, flexShrink:0,
                    }}>
                      <Icon name="plus" size={12} color={COLORS.mute} stroke={2.5}/>초대
                    </button>
                  </div>
                </div>

                {/* 동행인 목록 */}
                {members.length > 0 && (
                  <div style={{ padding:'0 14px' }}>
                    {members.map((c, ci) => (
                      <div key={c.uid} style={{ display:'flex', alignItems:'center', gap:10,
                        padding:'10px 0', borderBottom: ci < members.length - 1 || isExpanded ? `1px solid ${COLORS.line}` : 'none' }}>
                        {c.photoURL
                          ? <img src={c.photoURL} style={{ width:36, height:36, borderRadius:18 }}/>
                          : <div style={{ width:36, height:36, borderRadius:18, background:COLORS.softer,
                              display:'flex', alignItems:'center', justifyContent:'center',
                              fontFamily:SANS, fontSize:14, color:COLORS.mute }}>{(c.displayName||'?')[0]}</div>
                        }
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:SANS, fontSize:13, color:COLORS.ink, fontWeight:500 }}>{c.displayName}</div>
                          <div style={{ fontFamily:SANS, fontSize:11, color:COLORS.mute }}>{c.email}</div>
                        </div>
                        <div style={{ fontFamily:MONO, fontSize:10, color:'#4F6BED' }}>동행중</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 초대 입력 (펼쳐진 경우) */}
                {isExpanded && (
                  <div style={{ padding:'12px 14px 14px' }}>
                    <div style={{ fontFamily:SANS, fontSize:12, color:COLORS.mute, marginBottom:8 }}>
                      상대방이 이 앱에 먼저 가입되어 있어야 합니다.
                    </div>
                    <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                      placeholder="구글 이메일 입력"
                      onKeyDown={e => e.key === 'Enter' && handleInvite(t.id, t.title)}
                      style={{ width:'100%', padding:'11px 13px', borderRadius:11,
                        border:`1.5px solid ${COLORS.line}`, background:COLORS.bg,
                        fontFamily:SANS, fontSize:13, color:COLORS.ink, boxSizing:'border-box', outline:'none' }}/>
                    {inviteMsg && (
                      <div style={{ marginTop:6, fontFamily:SANS, fontSize:12,
                        color: inviteMsg.includes('보냈') ? COLORS.accent : '#C0392B' }}>{inviteMsg}</div>
                    )}
                    <button onClick={() => handleInvite(t.id, t.title)} disabled={inviting || !inviteEmail.trim()} style={{
                      marginTop:10, width:'100%', padding:'13px', border:'none', borderRadius:12,
                      background: inviteEmail.trim() ? COLORS.ink : COLORS.softer,
                      color: inviteEmail.trim() ? COLORS.bg : COLORS.mute,
                      fontFamily:SANS, fontSize:13, fontWeight:500, cursor:'pointer',
                    }}>{inviting ? '보내는 중...' : '초대 보내기'}</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────
// 로컬 캐시 읽기 (로그인 상태면 즉시 앱 표시용)
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

function App() {
  const _nav   = loadNav();
  const _cache = _readCache(); // 캐시된 상태 (로그인된 경우)

  // ── Firebase auth + data state ─────────────────────────────
  const [authState, setAuthState]   = React.useState(_cache?.userData ? 'in' : 'loading');
  const [authUser, setAuthUser]     = React.useState(null);
  const [userData, setUserData]     = React.useState(_cache?.userData || null);
  const [trip, setTrip]             = React.useState(_cache?.trip     || null);
  const [prep, setPrep]             = React.useState(_cache?.prep     || { checklist:[], docs:[], pack:[] });
  const [activeTripId, setActiveTripId] = React.useState(null);
  const [userTrips, setUserTrips]       = React.useState([]);
  const [tripsLoading, setTripsLoading] = React.useState(false);
  const [companionOpen, setCompanionOpen] = React.useState(false);
  const [shareTripTarget, setShareTripTarget] = React.useState(null);
  const [loginError, setLoginError] = React.useState('');
  const [loginPending, setLoginPending] = React.useState(false); // 로그인 버튼 누른 후 로딩 중
  const tripRef = React.useRef(null); // for loop-prevention

  // ── UI nav state ───────────────────────────────────────────
  const [tab, setTab]           = React.useState(_nav.tab || 'home');
  const [dayIdx, setDayIdx]     = React.useState(_nav.dayIdx ?? null);
  const [hotelIdx, setHotelIdx] = React.useState(_nav.hotelIdx ?? null);
  const [openStop, setOpenStop]   = React.useState(null);
  const [city, setCity]           = React.useState(CITIES[0]);
  const [cityPicker, setCityPicker]   = React.useState(false);
  const [hotelSheet, setHotelSheet]   = React.useState(null);
  const [scrollKey, setScrollKey]     = React.useState(0);
  const [editing, setEditing]         = React.useState(false);
  const [tabBarVisible, setTabBarVisible] = React.useState(true);
  const [saveConfirm, setSaveConfirm] = React.useState(false); // 저장 확인 다이얼로그
  const lastScrollTop    = React.useRef(0);
  const savedHomeScrollY = React.useRef(0);
  const navGoingBack     = React.useRef(false);
  const editSnapshot     = React.useRef(null); // 편집 시작 시 trip+prep 스냅샷

  // 편집 버튼 토글 핸들러
  const handleEditToggle = () => {
    if (!editing) {
      // 편집 시작 — 스냅샷 저장
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

  // ── 앱 준비되면 loginPending 해제 ────────────────────────────
  React.useEffect(() => {
    if (loginPending && authState === 'in') {
      setLoginPending(false);
    }
  }, [loginPending, authState]);

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

  // ── 여행 목록 로드 ─────────────────────────────────────────
  React.useEffect(() => {
    if (!userData?.uid) return;
    const tripIds = userData.tripIds || [userData.groupId];
    setTripsLoading(true);
    fbLoadTrips(tripIds)
      .then(trips => { setUserTrips(trips); setTripsLoading(false); })
      .catch(() => setTripsLoading(false));
  }, [userData?.uid, JSON.stringify(userData?.tripIds)]);

  // ── Firestore: shared group listener ──────────────────────
  const groupCreateRef = React.useRef(false);
  React.useEffect(() => {
    if (!activeTripId) return;
    groupCreateRef.current = false;
    setTrip(null);
    return fbListenGroup(activeTripId, (data) => {
      if (data === null) {
        if (groupCreateRef.current) return;
        groupCreateRef.current = true;
        fbSaveGroup(activeTripId, {
          title: '새 여행', dates: '', hotel: '', days: [],
          hotels: [], food: [], members: [userData.uid],
        });
        return;
      }
      setTrip(prev => {
        if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
        tripRef.current = data;
        return data;
      });
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

  React.useEffect(() => { saveNav({ tab, dayIdx, hotelIdx }); }, [tab, dayIdx, hotelIdx]);

  React.useEffect(() => {
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


  // ── Trip-level actions (Firestore) ────────────────────────
  const editTrip = (patch) => {
    setTrip(prev => ({ ...prev, ...patch }));
    if (activeTripId) fbSaveGroup(activeTripId, patch).catch(console.error);
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
    const newItem = { time:'12:00', cat:'sight', title:'새 일정', en:'New stop', loc:'', note:'' };
    const days = [...trip.days];
    days[dayIdx] = { ...days[dayIdx], items: [...days[dayIdx].items, newItem] };
    editTrip({ days });
    setOpenStop({ idx: days[dayIdx].items.length - 1, stop: newItem, editing: true });
  };
  const addItemToFirstDay = () => {
    const newItem = { time:'12:00', cat:'sight', title:'새 일정', en:'New stop', loc:'', note:'' };
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
  const saveStop = (draft) => {
    const days = [...trip.days];
    const items = [...days[dayIdx].items];
    items[openStop.idx] = draft;
    days[dayIdx] = { ...days[dayIdx], items };
    editTrip({ days });
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
        onOpenDay={(i) => { savedHomeScrollY.current = window.scrollY; setDayIdx(i); setScrollKey(k=>k+1); }}
        onOpenHotel={(i) => { savedHomeScrollY.current = window.scrollY; setHotelIdx(i); setScrollKey(k=>k+1); }}
        city={city} onPickCity={() => setCityPicker(true)}
        onEditTrip={editTrip} onReorderDays={reorderDays}
        onAddDay={addDay} onDeleteDay={deleteDay}
        onAddHotel={addHotel}
        onAddHotelFromSearch={() => setHotelSheet('new')}
        onDeleteHotel={deleteHotel}
        onReorderHotels={reorderHotels}
        onConvertInlineHotel={convertInlineHotel}
        onAddItemToFirstDay={addItemToFirstDay}
        editing={editing} setEditing={setEditing}
        userData={userData} onOpenCompanion={() => setCompanionOpen(true)}/>;
      label = 'Home';
    }
  } else if (tab === 'map')  { screen = <MapScreen trip={trip}/>; label='Map'; }
  else if (tab === 'food') { screen = <FoodScreen trip={trip} onEditFood={food => editTrip({ food })} editing={editing} setEditing={setEditing}/>; label='Food'; }
  else                      { screen = <PrepScreen trip={trip} prep={prep} onEditPrep={editPrep} editing={editing} setEditing={setEditing}/>; label='Prep'; }

  const dayHue = dayIdx !== null && trip ? trip.days[dayIdx].hero.hue : 30;

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
        onOpenCompanion={() => setCompanionOpen(true)}
        onSelect={(id) => { setActiveTripId(id); setTab('home'); setDayIdx(null); setHotelIdx(null); setEditing(false); }}
        onAdd={async () => {
          const title = prompt('여행 이름을 입력해 주세요\n(예: 뉴욕, 파리 7박)');
          if (!title) return;
          const tripId = await fbCreateNewTrip(userData.uid, title);
          setUserTrips(prev => [...prev, { id: tripId, title, dates:'', days:[], hotels:[], members:[userData.uid] }]);
          setActiveTripId(tripId);
          setTab('home'); setDayIdx(null); setHotelIdx(null);
        }}
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
      <CompanionSheet open={companionOpen} onClose={() => setCompanionOpen(false)}
        authUser={authUser} userData={userData} onUserDataUpdate={ud => setUserData(ud)}
        trips={userTrips}/>
    </>
  );

  if (!trip) return (
    <div style={{ minHeight:'100vh', background:COLORS.bg, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', gap:16 }}>
      <button onClick={() => { setActiveTripId(null); setEditing(false); }} style={{
        position:'fixed', top:'calc(env(safe-area-inset-top) + 14px)', left:16,
        background:'transparent', border:'none', padding:'4px 8px', cursor:'pointer',
        display:'flex', alignItems:'center', gap:3,
        fontFamily:SANS, fontSize:13, color:COLORS.mute,
      }}>
        <Icon name="chevron-left" size={14} color={COLORS.mute} stroke={2}/>My Trips
      </button>
      <div style={{ width:28, height:28, border:`3px solid ${COLORS.accent}`,
        borderTopColor:'transparent', borderRadius:'50%',
        animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // Figure out what "back" means in the current state, for swipe-from-edge.
  let swipeBack = null;
  if (tab === 'home') {
    if (hotelIdx !== null) swipeBack = () => { navGoingBack.current = true; setHotelIdx(null); };
    else if (dayIdx !== null) swipeBack = () => { navGoingBack.current = true; setDayIdx(null); };
  }

  return (
    <div style={{ minHeight:'100vh', fontFamily:'-apple-system, system-ui, sans-serif', background:'#F5F2EC' }}>
      {tab === 'home' && dayIdx === null && hotelIdx === null && (
        <button onClick={() => { setActiveTripId(null); setTrip(null); setEditing(false); }} style={{
          position:'fixed', top:'calc(env(safe-area-inset-top) + 14px)', left:16, zIndex:300,
          background:'transparent', border:'none', padding:'4px 8px', cursor:'pointer',
          display:'flex', alignItems:'center', gap:3,
          fontFamily:SANS, fontSize:13, color:COLORS.mute,
        }}>
          <Icon name="chevron-left" size={14} color={COLORS.mute} stroke={2}/>My Trips
        </button>
      )}
      <SwipeBackLayer onBack={swipeBack}>
        {screen}
      </SwipeBackLayer>
      <TabBar tab={tab} setTab={(t)=>{setTab(t); setDayIdx(null); setHotelIdx(null); setOpenStop(null); setEditing(false);}} visible={tabBarVisible} editing={editing} onToggleEdit={handleEditToggle}/>
      <StopSheet open={openStop} dayHue={dayHue}
        onClose={() => setOpenStop(null)} onSave={saveStop}/>
      {cityPicker && (
        <CityPicker current={city} onPick={setCity} onClose={() => setCityPicker(false)}/>
      )}
      {hotelSheet !== null && (
        <HotelSearchSheet
          COLORS={COLORS} SERIF={SERIF} SANS={SANS} MONO={MONO} Icon={Icon}
          onPick={pickHotelFromSearch}
          onClose={() => setHotelSheet(null)}/>
      )}
      <CompanionSheet
        open={companionOpen}
        onClose={() => setCompanionOpen(false)}
        authUser={authUser}
        userData={userData}
        onUserDataUpdate={(ud) => setUserData(ud)}
        trips={userTrips}/>

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

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
