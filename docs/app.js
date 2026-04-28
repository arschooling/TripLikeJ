function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// NYC Travel App — restructured
// - Trips list (top level) -> pick a trip -> Home
// - Per-page edit (no global toggle)
// - Hotel detail page + multi-hotel schedule
// - Fully editable prep page

const COLORS = {
  bg: '#F5F2EC',
  card: '#FFFFFF',
  ink: '#1A1816',
  mute: '#7A756D',
  line: 'rgba(26,24,22,0.08)',
  accent: '#C14F2E',
  soft: '#E9E3D7',
  softer: '#EFEAE0'
};
const SERIF = '"Instrument Serif", Georgia, serif';
const SANS = '-apple-system, "SF Pro Text", system-ui, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
// 탭바 위에 시트가 뜨도록 하는 bottom 오프셋

const CAT_META = {
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
const Icon = ({
  name,
  size = 16,
  color = 'currentColor',
  stroke = 1.6
}) => {
  const p = {
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
    case 'car':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M5 12L7 7h10l2 5"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "2",
        y: "12",
        width: "20",
        height: "6",
        rx: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "7",
        cy: "21",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "17",
        cy: "21",
        r: "2"
      }));
    case 'bus':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "3",
        width: "18",
        height: "15",
        rx: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 9h18M7 18v2M17 18v2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "7.5",
        cy: "13.5",
        r: "1.5"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "16.5",
        cy: "13.5",
        r: "1.5"
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
    case 'sparkle':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M12 3 9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5z"
      }));
    case 'wallet':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("rect", {
        x: "2",
        y: "5",
        width: "20",
        height: "14",
        rx: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 12h.01"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M2 10h20"
      }));
    case 'minus':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M5 12h14"
      }));
    case 'calculator':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("rect", {
        x: "4",
        y: "2",
        width: "16",
        height: "20",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 6h8M8 10h2M12 10h2M16 10h.01M8 14h2M12 14h2M16 14h2M8 18h2M12 18h2M16 18h2"
      }));
    case 'bell':
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M13.73 21a2 2 0 0 1-3.46 0"
      }));
    default:
      return null;
  }
};

// ─── Photo placeholder ──────────────────────────────────────
function Photo({
  hue = 20,
  label = '',
  height = 180,
  small = false
}) {
  const bg = `oklch(0.88 0.035 ${hue})`,
    bg2 = `oklch(0.80 0.045 ${hue})`;
  const ink = `oklch(0.36 0.04 ${hue})`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height,
      background: `repeating-linear-gradient(135deg, ${bg} 0 14px, ${bg2} 14px 15px), linear-gradient(180deg, ${bg} 0%, ${bg2} 100%)`,
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
      background: `radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.35), transparent 60%)`
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
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function mapsDirectionsUrl(destination) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=transit`;
}

// ─── Edit button (small pencil) ─────────────────────────────
function EditBtn({
  editing,
  onClick,
  compact
}) {
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
function SwipeableRow({
  children,
  onEdit,
  onDelete,
  disabled,
  isDragging,
  wrapStyle = {},
  editIcon,
  editBg,
  editLabel,
  deleteLabel
}) {
  const [x, setX] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const startRef = React.useRef(null);
  const dragging = React.useRef(false);
  const xRef = React.useRef(0);
  const REVEAL = onEdit ? 104 : 58;
  const DELETE_EXTRA = 72;
  const close = () => {
    setX(0);
    xRef.current = 0;
    setOpen(false);
  };
  React.useEffect(() => {
    if (disabled) close();
  }, [disabled]);
  // 드래그 중에는 스와이프 버튼 즉시 닫기
  React.useEffect(() => {
    if (isDragging) close();
  }, [isDragging]);
  const onTouchStart = e => {
    if (disabled) return;
    startRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    dragging.current = false;
  };
  const onTouchMove = e => {
    if (!startRef.current) return;
    const dx = e.touches[0].clientX - startRef.current.x;
    const dy = Math.abs(e.touches[0].clientY - startRef.current.y);
    if (!dragging.current) {
      if (Math.abs(dx) < 18) return;
      if (dy > Math.abs(dx) * 0.55) return; // 세로 스크롤 — startRef 유지, 탭 감지 보존
      dragging.current = true;
    }
    const base = open ? -REVEAL : 0;
    const raw = base + dx;
    const clamped = open ? Math.max(-(REVEAL + DELETE_EXTRA + 16), Math.min(0, raw)) : Math.max(-REVEAL, Math.min(0, raw));
    xRef.current = clamped;
    setX(clamped);
  };
  const onTouchEnd = () => {
    if (!startRef.current) return;
    const wasDragging = dragging.current;
    startRef.current = null;
    dragging.current = false;
    if (!wasDragging) return; // 탭 — 브라우저 click 이벤트로 처리

    const cur = xRef.current;
    if (cur < -(REVEAL + DELETE_EXTRA / 2)) {
      close();
      setTimeout(() => onDelete(), 260);
    } else if (cur < -REVEAL / 2) {
      xRef.current = -REVEAL;
      setX(-REVEAL);
      setOpen(true);
    } else {
      close();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      ...wrapStyle
    },
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    onTouchEnd: onTouchEnd
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      width: `calc(100% + ${REVEAL}px)`,
      transform: `translateX(${x}px)`,
      transition: dragging.current ? 'none' : 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
      willChange: 'transform',
      WebkitTapHighlightColor: 'transparent'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      width: REVEAL,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }, onEdit && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      close();
      setTimeout(onEdit, 100);
    },
    style: {
      width: editLabel ? 46 : 38,
      height: editLabel ? 34 : 38,
      borderRadius: editLabel ? 9 : 19,
      border: 'none',
      cursor: 'pointer',
      background: editBg || '#ffa500',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2
    }
  }, editLabel ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 10,
      fontWeight: 600,
      color: '#fff'
    }
  }, editLabel) : /*#__PURE__*/React.createElement(Icon, {
    name: editIcon || 'edit',
    size: 14,
    color: "#fff",
    stroke: 2
  })), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      close();
      setTimeout(onDelete, 100);
    },
    style: {
      width: deleteLabel ? 46 : 38,
      height: deleteLabel ? 34 : 38,
      borderRadius: deleteLabel ? 9 : 19,
      border: 'none',
      cursor: 'pointer',
      background: '#B5451B',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2
    }
  }, deleteLabel ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 10,
      fontWeight: 600,
      color: '#fff'
    }
  }, deleteLabel) : /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 14,
    color: "#fff",
    stroke: 2
  })))));
}

// ─── Swipe-back edge gesture wrapper ─────────────────────────
function SwipeBackLayer({
  onBack,
  children
}) {
  const [dx, setDx] = React.useState(0);
  const [slidingOut, setSlidingOut] = React.useState(false);
  const startRef = React.useRef(null);
  const draggingRef = React.useRef(false);
  const dxRef = React.useRef(0);
  const containerRef = React.useRef(null);
  const canBackRef = React.useRef(!!onBack);
  const slidingRef = React.useRef(false);
  const onBackRef = React.useRef(onBack);
  React.useEffect(() => {
    canBackRef.current = !!onBack;
    onBackRef.current = onBack;
  }, [onBack]);
  React.useEffect(() => {
    slidingRef.current = slidingOut;
  }, [slidingOut]);
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = e => {
      if (!canBackRef.current || slidingRef.current) return;
      const t = e.touches[0];
      if (t.clientX > 28) return;
      startRef.current = {
        x: t.clientX,
        y: t.clientY,
        t: Date.now()
      };
      draggingRef.current = false;
    };
    const onTouchMove = e => {
      if (!startRef.current) return;
      const t = e.touches[0];
      const dX = t.clientX - startRef.current.x;
      const dY = Math.abs(t.clientY - startRef.current.y);
      if (!draggingRef.current) {
        if (dY > Math.abs(dX) + 8) {
          startRef.current = null;
          return;
        }
        if (dX > 6) draggingRef.current = true;else return;
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
      if (v > 90 || v > 40 && elapsed < 280) {
        slidingRef.current = true;
        setSlidingOut(true);
        setDx(window.innerWidth || 400);
        setTimeout(() => {
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
    return () => {
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
      transform: `translateX(${dx}px)`,
      transition: dx === 0 || slidingOut ? 'transform 220ms cubic-bezier(0.22,1,0.36,1)' : 'none',
      willChange: 'transform'
    }
  }, children), dx > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      background: `linear-gradient(90deg, rgba(0,0,0,${Math.min(0.15, dx / 1000)}), transparent 35%)`
    }
  }));
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
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);
  return kbh;
}

// ─── Popup sheet (centered modal with swipe-down dismiss) ────
function BottomSheet({
  open,
  onClose,
  children,
  title,
  onConfirm,
  confirmLabel = '완료'
}) {
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
      const t = setTimeout(() => {
        setMounted(false);
        setDrag(0);
      }, 260);
      return () => clearTimeout(t);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  if (!mounted) return null;

  // Touch handlers on the whole popup; drag only engages on gesture.
  const onTouchStart = e => {
    startY.current = e.touches[0].clientY;
  };
  const onTouchMove = e => {
    if (startY.current == null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) setDrag(dy);
  };
  const onTouchEnd = () => {
    if (drag > 80) onClose();else setDrag(0);
    startY.current = null;
  };
  // Also handle mouse drag on the handle area for desktop testing
  const onMouseDown = e => {
    startY.current = e.clientY;
    const move = ev => {
      const dy = ev.clientY - startY.current;
      if (dy > 0) setDrag(dy);
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      if (drag > 80) onClose();else setDrag(0);
      startY.current = null;
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  // portal로 document.body에 직접 렌더링 → transform 부모의 영향 없이 정확히 viewport 중앙에 표시
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `20px 18px ${20 + kbh}px`,
      background: visible && drag < 80 ? 'rgba(20,16,14,0.42)' : 'rgba(20,16,14,0)',
      transition: 'background 240ms ease, padding 0.2s ease'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    onTouchEnd: onTouchEnd,
    style: {
      background: COLORS.bg,
      width: '100%',
      maxWidth: 360,
      borderRadius: 22,
      boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 14px rgba(0,0,0,0.08)',
      transform: visible ? `translateY(${drag}px) scale(${Math.max(0.94, 1 - drag / 600)})` : 'translateY(40px) scale(0.94)',
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
function DatePickerSheet({
  open,
  value,
  onClose,
  onPick,
  minDate,
  title = '날짜 선택'
}) {
  const parseIso = s => {
    const m = (s || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return null;
    return {
      y: +m[1],
      mo: +m[2] - 1,
      d: +m[3]
    };
  };
  const todayObj = new Date();
  const initial = parseIso(value) || parseIso(minDate) || {
    y: todayObj.getFullYear(),
    mo: todayObj.getMonth(),
    d: todayObj.getDate()
  };
  const [view, setView] = React.useState({
    y: initial.y,
    mo: initial.mo
  });
  const [selected, setSelected] = React.useState(parseIso(value));
  const [pickingYM, setPickingYM] = React.useState(false); // 년/월 선택 모드

  React.useEffect(() => {
    if (open) {
      const s = parseIso(value) || initial;
      setView({
        y: s.y,
        mo: s.mo
      });
      setSelected(parseIso(value));
      setPickingYM(false);
    }
  }, [open, value]);
  const MONTH_KR = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];
  const min = parseIso(minDate);
  const isBefore = (y1, mo1, d1, mn) => {
    if (!mn) return false;
    if (y1 !== mn.y) return y1 < mn.y;
    if (mo1 !== mn.mo) return mo1 < mn.mo;
    return d1 < mn.d;
  };
  const confirm = () => {
    if (!selected) {
      onClose();
      return;
    }
    const iso = `${selected.y}-${String(selected.mo + 1).padStart(2, '0')}-${String(selected.d).padStart(2, '0')}`;
    onPick(iso);
    onClose();
  };

  // ── 년/월 스크롤 선택기 ────────────────────────────────────
  const YEARS = Array.from({
    length: 10
  }, (_, i) => todayObj.getFullYear() - 2 + i);
  const MONTHS = Array.from({
    length: 12
  }, (_, i) => i);
  const [tmpY, setTmpY] = React.useState(view.y);
  const [tmpMo, setTmpMo] = React.useState(view.mo);
  const ScrollPicker = ({
    items,
    value,
    onChange,
    renderLabel,
    width = 90
  }) => {
    const IH = 44;
    const VISIBLE = 5;
    const ref = React.useRef(null);
    const timer = React.useRef(null);
    React.useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const idx = items.indexOf(value);
      if (idx >= 0) el.scrollTop = idx * IH;
    }, [value]);
    const onScroll = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const el = ref.current;
        if (!el) return;
        const idx = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / IH)));
        el.scrollTo({
          top: idx * IH,
          behavior: 'smooth'
        });
        if (items[idx] !== value) onChange(items[idx]);
      }, 100);
    };
    const PAD = IH * Math.floor(VISIBLE / 2);
    const stopProp = e => e.stopPropagation(); // 스크롤 시 배경 dismiss 방지
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width,
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
        borderTop: `1.5px solid ${COLORS.line}`,
        borderBottom: `1.5px solid ${COLORS.line}`
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
    }, items.map((it, i) => {
      const sel = it === value;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        onClick: () => {
          onChange(it);
          const el = ref.current;
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
  const Calendar = () => {
    const firstDow = new Date(view.y, view.mo, 1).getDay();
    const daysInMo = new Date(view.y, view.mo + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMo; d++) cells.push(d);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 14px 2px',
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)'
      }
    }, DOW.map((w, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        textAlign: 'center',
        fontFamily: MONO,
        fontSize: 9.5,
        letterSpacing: '0.08em',
        color: i === 0 ? COLORS.accent : i === 6 ? 'oklch(60% 0.06 250)' : COLORS.mute,
        padding: '4px 0'
      }
    }, w))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 14px 14px',
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)'
      }
    }, cells.map((d, i) => {
      if (d === null) return /*#__PURE__*/React.createElement("div", {
        key: i
      });
      const dow = (firstDow + d - 1) % 7;
      const isSel = selected && selected.y === view.y && selected.mo === view.mo && selected.d === d;
      const isToday = todayObj.getFullYear() === view.y && todayObj.getMonth() === view.mo && todayObj.getDate() === d;
      const disabled = isBefore(view.y, view.mo, d, min);
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        disabled: disabled,
        onClick: () => setSelected({
          y: view.y,
          mo: view.mo,
          d
        }),
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
    onClick: () => {
      if (!pickingYM) {
        setTmpY(view.y);
        setTmpMo(view.mo);
      }
      setPickingYM(p => !p);
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
    onClick: () => {
      let {
        y,
        mo
      } = view;
      mo--;
      if (mo < 0) {
        mo = 11;
        y--;
      }
      setView({
        y,
        mo
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
    onClick: () => {
      let {
        y,
        mo
      } = view;
      mo++;
      if (mo > 11) {
        mo = 0;
        y++;
      }
      setView({
        y,
        mo
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
    renderLabel: y => `${y}년`,
    width: 110
  }), /*#__PURE__*/React.createElement(ScrollPicker, {
    items: MONTHS,
    value: tmpMo,
    onChange: setTmpMo,
    renderLabel: m => MONTH_KR[m],
    width: 90
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 14px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
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

// ─── Compact scroll wheel ────────────────────────────────────
function CompactWheel({
  items,
  value,
  onChange,
  renderLabel = x => x,
  width = 100
}) {
  const IH = 44,
    VIS = 5;
  const ref = React.useRef(null);
  const timer = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = items.indexOf(value);
    if (idx >= 0) el.scrollTop = idx * IH;
  }, [value, items]);
  const onScroll = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const idx = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / IH)));
      el.scrollTo({
        top: idx * IH,
        behavior: 'smooth'
      });
      if (items[idx] !== value) onChange(items[idx]);
    }, 100);
  };
  const PAD = IH * Math.floor(VIS / 2);
  const stopProp = e => e.stopPropagation();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width,
      height: IH * VIS,
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
      top: IH * Math.floor(VIS / 2),
      height: IH,
      borderTop: `1.5px solid ${COLORS.line}`,
      borderBottom: `1.5px solid ${COLORS.line}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onScroll: onScroll,
    className: "wheel-col",
    style: {
      height: '100%',
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      paddingTop: PAD,
      paddingBottom: PAD,
      boxSizing: 'content-box'
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      height: IH,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      scrollSnapAlign: 'center',
      fontFamily: SANS,
      fontSize: it === value ? 16 : 14,
      color: it === value ? COLORS.ink : COLORS.mute,
      fontWeight: it === value ? 600 : 400,
      cursor: 'pointer'
    }
  }, renderLabel(it)))));
}

// ─── Time Picker ────────────────────────────────────────────
function TimeField({
  value,
  onChange
}) {
  const [open, setOpen] = React.useState(false);
  const HOURS = Array.from({
    length: 24
  }, (_, i) => i);
  const MINS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const parse = v => {
    const m = (v || '').match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return {
      h: 9,
      mn: 0
    };
    const h = parseInt(m[1]) % 24;
    const raw = parseInt(m[2]);
    const mn = MINS.reduce((best, x) => Math.abs(x - raw) < Math.abs(best - raw) ? x : best, 0);
    return {
      h,
      mn
    };
  };
  const {
    h,
    mn
  } = parse(value);
  const emit = (newH, newMn) => onChange(`${String(newH).padStart(2, '0')}:${String(newMn).padStart(2, '0')}`);
  if (!open) return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(true),
    style: {
      width: '100%',
      padding: '8px 10px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
      background: COLORS.card,
      fontFamily: MONO,
      fontSize: 14,
      color: COLORS.ink,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, value || '09:00');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      padding: '4px 0'
    }
  }, /*#__PURE__*/React.createElement(CompactWheel, {
    items: HOURS,
    value: h,
    onChange: v => emit(v, mn),
    renderLabel: x => String(x).padStart(2, '0'),
    width: 80
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 24,
      fontWeight: 600,
      color: COLORS.ink,
      lineHeight: 1,
      userSelect: 'none'
    }
  }, ":"), /*#__PURE__*/React.createElement(CompactWheel, {
    items: MINS,
    value: mn,
    onChange: v => emit(h, v),
    renderLabel: x => String(x).padStart(2, '0'),
    width: 80
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(false),
    style: {
      width: '100%',
      marginTop: 4,
      padding: '7px',
      borderRadius: 8,
      border: 'none',
      background: COLORS.softer,
      fontFamily: SANS,
      fontSize: 12,
      color: COLORS.mute,
      cursor: 'pointer'
    }
  }, "\uC644\uB8CC"));
}

// ─── Date Range Picker ───────────────────────────────────────
function DateRangeSheet({
  open,
  startIso,
  endIso,
  onClose,
  onPick
}) {
  const parseIso = s => {
    const m = (s || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? {
      y: +m[1],
      mo: +m[2] - 1,
      d: +m[3]
    } : null;
  };
  const toIso = o => o ? `${o.y}-${String(o.mo + 1).padStart(2, '0')}-${String(o.d).padStart(2, '0')}` : null;
  const cmp = (a, b) => !a || !b ? 0 : a.y !== b.y ? a.y < b.y ? -1 : 1 : a.mo !== b.mo ? a.mo < b.mo ? -1 : 1 : a.d !== b.d ? a.d < b.d ? -1 : 1 : 0;
  const today = new Date();
  const [view, setView] = React.useState({
    y: today.getFullYear(),
    mo: today.getMonth()
  });
  const [start, setStart] = React.useState(null);
  const [end, setEnd] = React.useState(null);
  const [picking, setPicking] = React.useState('start');
  const [showYM, setShowYM] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const s = parseIso(startIso),
      e = parseIso(endIso);
    setStart(s);
    setEnd(e);
    setView(s ? {
      y: s.y,
      mo: s.mo
    } : {
      y: today.getFullYear(),
      mo: today.getMonth()
    });
    setPicking('start');
    setShowYM(false);
  }, [open]);
  const handleDay = d => {
    const clicked = {
      y: view.y,
      mo: view.mo,
      d
    };
    if (picking === 'start') {
      setStart(clicked);
      setEnd(null);
      setPicking('end');
    } else {
      if (cmp(clicked, start) < 0) {
        setStart(clicked);
        setEnd(null);
      } else {
        setEnd(clicked);
      }
    }
  };
  const prevMonth = () => {
    let {
      y,
      mo
    } = view;
    mo--;
    if (mo < 0) {
      mo = 11;
      y--;
    }
    setView({
      y,
      mo
    });
  };
  const nextMonth = () => {
    let {
      y,
      mo
    } = view;
    mo++;
    if (mo > 11) {
      mo = 0;
      y++;
    }
    setView({
      y,
      mo
    });
  };
  const MONTH_KR = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];
  const firstDow = new Date(view.y, view.mo, 1).getDay();
  const daysInMo = new Date(view.y, view.mo + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMo; d++) cells.push(d);
  const isSt = d => start && start.y === view.y && start.mo === view.mo && start.d === d;
  const isEn = d => end && end.y === view.y && end.mo === view.mo && end.d === d;
  const inRng = d => {
    if (!start || !end) return false;
    const c = {
      y: view.y,
      mo: view.mo,
      d
    };
    return cmp(c, start) > 0 && cmp(c, end) < 0;
  };
  const fmtDate = o => o ? `${o.y}. ${o.mo + 1}. ${o.d}.` : null;
  const YEARS_LIST = Array.from({
    length: 12
  }, (_, i) => today.getFullYear() - 2 + i);
  const MONTHS_LIST = Array.from({
    length: 12
  }, (_, i) => i);
  return /*#__PURE__*/React.createElement(BottomSheet, {
    open: open,
    onClose: onClose,
    title: "\uAE30\uAC04 \uC120\uD0DD",
    onConfirm: () => {
      if (!start) {
        onClose();
        return;
      }
      onPick(toIso(start), toIso(end));
      onClose();
    }
  }, !showYM && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '4px 16px 14px',
      display: 'flex',
      borderRadius: 14,
      border: `1px solid ${COLORS.line}`,
      overflow: 'hidden'
    }
  }, ['start', 'end'].map((k, ki) => {
    const val = k === 'start' ? start : end;
    const active = picking === k;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => {
        setPicking(k);
        setShowYM(false);
      },
      style: {
        flex: 1,
        padding: '10px 14px',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        background: active ? COLORS.ink : 'transparent',
        borderRight: ki === 0 ? `1px solid ${COLORS.line}` : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: '0.12em',
        marginBottom: 3,
        color: active ? 'rgba(255,255,255,0.5)' : COLORS.mute
      }
    }, k === 'start' ? 'START' : 'END'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 14,
        fontWeight: 500,
        color: active ? '#fff' : val ? COLORS.ink : COLORS.mute
      }
    }, fmtDate(val) || '—'));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      marginBottom: 10,
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: prevMonth,
    style: {
      width: 34,
      height: 34,
      borderRadius: 17,
      border: 'none',
      cursor: 'pointer',
      background: COLORS.softer,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-l",
    size: 13,
    color: COLORS.ink,
    stroke: 2.5
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowYM(p => !p),
    style: {
      flex: 1,
      border: 'none',
      cursor: 'pointer',
      borderRadius: 10,
      background: showYM ? COLORS.softer : 'transparent',
      padding: '6px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 15,
      fontWeight: 600,
      color: COLORS.ink,
      letterSpacing: '-0.01em'
    }
  }, view.y, "\uB144 ", MONTH_KR[view.mo]), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-d",
    size: 11,
    color: COLORS.mute,
    stroke: 2.5,
    style: {
      transform: showYM ? 'rotate(180deg)' : 'none',
      transition: 'transform 0.2s'
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: nextMonth,
    style: {
      width: 34,
      height: 34,
      borderRadius: 17,
      border: 'none',
      cursor: 'pointer',
      background: COLORS.softer,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron",
    size: 13,
    color: COLORS.ink,
    stroke: 2.5
  }))), showYM ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 16,
      padding: '0 16px 16px'
    }
  }, /*#__PURE__*/React.createElement(CompactWheel, {
    items: YEARS_LIST,
    value: view.y,
    onChange: y => setView(v => ({
      ...v,
      y
    })),
    renderLabel: y => `${y}년`,
    width: 130
  }), /*#__PURE__*/React.createElement(CompactWheel, {
    items: MONTHS_LIST,
    value: view.mo,
    onChange: mo => setView(v => ({
      ...v,
      mo
    })),
    renderLabel: m => MONTH_KR[m],
    width: 90
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      padding: '0 14px 2px'
    }
  }, DOW.map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      textAlign: 'center',
      fontFamily: MONO,
      fontSize: 9.5,
      letterSpacing: '0.08em',
      padding: '2px 0 6px',
      color: i === 0 ? COLORS.accent : i === 6 ? 'oklch(60% 0.06 250)' : COLORS.mute
    }
  }, w))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      padding: '0 14px 16px'
    }
  }, cells.map((d, i) => {
    if (d === null) return /*#__PURE__*/React.createElement("div", {
      key: i
    });
    const col = (firstDow + d - 1) % 7;
    const st = isSt(d),
      en = isEn(d),
      rng = inRng(d);
    const hasStrip = st || en || rng,
      isSel = st || en;
    const isToday = today.getFullYear() === view.y && today.getMonth() === view.mo && today.getDate() === d;
    const isL = st || rng && col === 0,
      isR = en || rng && col === 6;
    const stripR = !hasStrip ? '0' : isL && isR ? '50%' : isL ? '50% 0 0 50%' : isR ? '0 50% 50% 0' : '0';
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => handleDay(d),
      style: {
        aspectRatio: '1/1',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        margin: '1px 0',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hasStrip ? 'rgba(193,79,46,0.10)' : 'transparent',
        borderRadius: stripR
      }
    }, isSel && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: '3px',
        borderRadius: '50%',
        background: COLORS.ink,
        zIndex: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        zIndex: 1,
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: isSel ? 600 : 400,
        color: isSel ? '#fff' : col === 0 ? COLORS.accent : COLORS.ink
      }
    }, d), isToday && !isSel && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: 3,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 3,
        height: 3,
        borderRadius: '50%',
        background: COLORS.accent,
        zIndex: 1
      }
    }));
  }))));
}

// ─── Wheel column (scroll-snap) ──────────────────────────────
function WheelColumn({
  items,
  value,
  onChange,
  width = 70
}) {
  const ITEM_H = 40;
  const VISIBLE = 5; // odd so there's a center
  const CENTER_OFFSET = Math.floor(VISIBLE / 2);
  const ref = React.useRef(null);
  const timer = React.useRef(null);

  // Sync external value → scroll position
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = items.indexOf(value);
    if (idx >= 0) el.scrollTop = idx * ITEM_H;
  }, [value, items]);
  const handleScroll = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const idx = Math.round(el.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
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
      width,
      height: ITEM_H * VISIBLE
    }
  }, /*#__PURE__*/React.createElement("style", null, `.wheel-col::-webkit-scrollbar{display:none;}`), /*#__PURE__*/React.createElement("div", {
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
      padding: `${ITEM_H * CENTER_OFFSET}px 0`,
      boxSizing: 'content-box'
    }
  }, items.map((it, i) => {
    const isSel = it === value;
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
      borderTop: `1px solid ${COLORS.line}`,
      borderBottom: `1px solid ${COLORS.line}`,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: ITEM_H * CENTER_OFFSET,
      background: `linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.bg}00 100%)`,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: ITEM_H * CENTER_OFFSET,
      background: `linear-gradient(0deg, ${COLORS.bg} 0%, ${COLORS.bg}00 100%)`,
      pointerEvents: 'none'
    }
  }));
}

// ─── Time wheel picker ───────────────────────────────────────
function TimeWheelSheet({
  open,
  value,
  onClose,
  onPick,
  title = '시간 선택'
}) {
  const parse = v => {
    const m = (v || '').match(/^(\d{1,2}):(\d{2})/);
    if (!m) return {
      h: 15,
      m: 0
    };
    return {
      h: Math.max(0, Math.min(23, +m[1])),
      m: Math.max(0, Math.min(59, +m[2]))
    };
  };
  const [h, setH] = React.useState(parse(value).h);
  const [mi, setMi] = React.useState(parse(value).m);
  React.useEffect(() => {
    if (open) {
      const p = parse(value);
      setH(p.h);
      setMi(p.m);
    }
  }, [open, value]);
  const hours = React.useMemo(() => Array.from({
    length: 24
  }, (_, i) => String(i).padStart(2, '0')), []);
  // 5-minute grain is the sweet spot for quick selection
  const mins = React.useMemo(() => Array.from({
    length: 12
  }, (_, i) => String(i * 5).padStart(2, '0')), []);
  const confirm = () => {
    const time = `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`;
    onPick(time);
    onClose();
  };

  // Snap minutes to nearest 5 for display, but internal state can be any int
  const displayMin = String(Math.round(mi / 5) * 5 % 60).padStart(2, '0');
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
    onChange: v => setH(+v)
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
    onChange: v => setMi(+v)
  })));
}

// ─── 공통 픽커 바텀 시트 ─────────────────────────────────────
function PickerSheet({
  open,
  onClose,
  title,
  items,
  getKey,
  filterFn,
  renderRow,
  onPick,
  selectedKey
}) {
  const [q, setQ] = React.useState('');
  const [entered, setEntered] = React.useState(false);
  const inputRef = React.useRef(null);
  const touchY = React.useRef(null);
  const kbh = useKeyboardHeight();
  React.useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    setQ('');
    setEntered(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, [open]);
  React.useEffect(() => {
    if (open && entered) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open, entered]);
  const filtered = React.useMemo(() => q ? items.filter(item => filterFn(item, q)) : items, [items, q, filterFn]);
  if (!open) return null;
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 600,
      background: `rgba(0,0,0,${entered ? 0.35 : 0})`,
      transition: 'background 0.3s'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    onTouchStart: e => {
      touchY.current = e.touches[0].clientY;
    },
    onTouchEnd: e => {
      if (e.changedTouches[0].clientY - (touchY.current || 0) > 80) onClose();
    },
    style: {
      position: 'fixed',
      bottom: kbh,
      left: 0,
      right: 0,
      background: COLORS.bg,
      borderRadius: '22px 22px 0 0',
      maxHeight: kbh > 0 ? `calc(100vh - ${kbh + 16}px)` : '82%',
      display: 'flex',
      flexDirection: 'column',
      transform: `translateY(${entered ? 0 : '100vh'})`,
      transition: 'transform 0.34s cubic-bezier(0.32,0.72,0,1), bottom 0.22s ease, max-height 0.22s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 0 4px',
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
      padding: '2px 16px 10px',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 22,
      color: COLORS.ink,
      marginBottom: 10
    }
  }, title), /*#__PURE__*/React.createElement("div", {
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
    ref: inputRef,
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "\uAC80\uC0C9",
    style: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      flex: 1,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink
    }
  }), q && /*#__PURE__*/React.createElement("button", {
    onClick: () => setQ(''),
    style: {
      border: 'none',
      background: 'transparent',
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 12,
    color: COLORS.mute,
    stroke: 2
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '0 16px calc(24px + env(safe-area-inset-bottom,0px))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 14,
      overflow: 'hidden'
    }
  }, filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute,
      textAlign: 'center'
    }
  }, "\uAC80\uC0C9 \uACB0\uACFC \uC5C6\uC74C"), filtered.map((item, i) => {
    const k = getKey(item);
    const sel = k === selectedKey;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => {
        onPick(item);
        onClose();
      },
      style: {
        width: '100%',
        border: 'none',
        background: sel ? COLORS.softer : 'transparent',
        padding: '12px 14px',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.line}` : 'none',
        cursor: 'pointer',
        textAlign: 'left'
      }
    }, renderRow(item, sel), sel && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16,
      color: COLORS.accent,
      stroke: 2.5
    }));
  }))))), document.body);
}

// ─── FX ─────────────────────────────────────────────────────
const FX_CURRENCIES = [{
  code: 'USD',
  sym: '$',
  name: '미국 달러'
}, {
  code: 'EUR',
  sym: '€',
  name: '유로'
}, {
  code: 'JPY',
  sym: '¥',
  name: '일본 엔'
}, {
  code: 'GBP',
  sym: '£',
  name: '영국 파운드'
}, {
  code: 'CNY',
  sym: '¥',
  name: '중국 위안'
}, {
  code: 'HKD',
  sym: 'HK$',
  name: '홍콩 달러'
}, {
  code: 'TWD',
  sym: 'NT$',
  name: '대만 달러'
}, {
  code: 'SGD',
  sym: 'S$',
  name: '싱가포르 달러'
}, {
  code: 'THB',
  sym: '฿',
  name: '태국 바트'
}, {
  code: 'AUD',
  sym: 'A$',
  name: '호주 달러'
}, {
  code: 'CAD',
  sym: 'C$',
  name: '캐나다 달러'
}, {
  code: 'CHF',
  sym: 'Fr',
  name: '스위스 프랑'
}, {
  code: 'AED',
  sym: 'AED',
  name: 'UAE 디르함'
}, {
  code: 'MYR',
  sym: 'RM',
  name: '말레이시아 링깃'
}, {
  code: 'VND',
  sym: '₫',
  name: '베트남 동'
}, {
  code: 'PHP',
  sym: '₱',
  name: '필리핀 페소'
}, {
  code: 'MXN',
  sym: 'MX$',
  name: '멕시코 페소'
}];
function useFxRate(currency) {
  const [state, setState] = React.useState({
    loading: true,
    rate: null,
    ts: null
  });
  const fetchRate = React.useCallback(() => {
    setState(s => ({
      ...s,
      loading: true
    }));
    const cur = currency.toLowerCase();
    const sources = [{
      url: `https://api.frankfurter.app/latest?from=${currency}&to=KRW`,
      parse: j => ({
        rate: j?.rates?.KRW,
        ts: j?.date
      })
    }, {
      url: `https://open.er-api.com/v6/latest/${currency}`,
      parse: j => ({
        rate: j?.rates?.KRW,
        ts: j?.time_last_update_utc?.slice(0, 16)
      })
    }, {
      url: `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${cur}.json`,
      parse: j => ({
        rate: j?.[cur]?.krw,
        ts: j?.date
      })
    }];
    const tryNext = i => {
      if (i >= sources.length) {
        setState({
          loading: false,
          rate: null,
          ts: null
        });
        return;
      }
      fetch(sources[i].url).then(r => r.json()).then(j => {
        const {
          rate,
          ts
        } = sources[i].parse(j);
        if (rate) setState({
          loading: false,
          rate,
          ts: ts || null
        });else tryNext(i + 1);
      }).catch(() => tryNext(i + 1));
    };
    tryNext(0);
  }, [currency]);
  React.useEffect(() => {
    fetchRate();
  }, [fetchRate]);
  return {
    ...state,
    refresh: fetchRate
  };
}
function FxCard() {
  const [curCode, setCurCode] = React.useState('USD');
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const cur = FX_CURRENCIES.find(c => c.code === curCode) || FX_CURRENCIES[0];
  const {
    loading,
    rate,
    ts,
    refresh
  } = useFxRate(cur.code);
  const fxFilterFn = React.useCallback((item, q) => {
    const ql = q.toLowerCase();
    return item.code.toLowerCase().includes(ql) || item.name.includes(q);
  }, []);
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
  }, "\uD658\uC728"), /*#__PURE__*/React.createElement("button", {
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
  }, loading ? '…' : rate ? `₩${Math.round(rate).toLocaleString()}` : '—'), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 11,
      color: COLORS.mute
    }
  }, "= ", cur.sym, "1 ", ts && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.6
    }
  }, "\xB7 ", ts)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPickerOpen(true),
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      padding: '2px 0',
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.ink,
      fontWeight: 600
    }
  }, cur.code, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-d",
    size: 10,
    color: COLORS.mute,
    stroke: 1.8
  }))), /*#__PURE__*/React.createElement(PickerSheet, {
    open: pickerOpen,
    onClose: () => setPickerOpen(false),
    title: "\uD1B5\uD654 \uC120\uD0DD",
    items: FX_CURRENCIES,
    getKey: c => c.code,
    filterFn: fxFilterFn,
    selectedKey: cur.code,
    onPick: c => setCurCode(c.code),
    renderRow: c => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 14,
        fontWeight: 600,
        color: COLORS.ink,
        minWidth: 42
      }
    }, c.code), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 13,
        color: COLORS.ink
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 10.5,
        color: COLORS.mute,
        marginTop: 1
      }
    }, c.sym, "1")))
  }));
}

// ─── Timezones ──────────────────────────────────────────────
const CITIES = [{
  key: 'New York',
  kor: '뉴욕',
  zone: 'America/New_York',
  flag: '🇺🇸',
  lat: 40.71,
  lon: -74.01
}, {
  key: 'Los Angeles',
  kor: '로스앤젤레스',
  zone: 'America/Los_Angeles',
  flag: '🇺🇸',
  lat: 34.05,
  lon: -118.24
}, {
  key: 'Washington',
  kor: '워싱턴',
  zone: 'America/New_York',
  flag: '🇺🇸',
  lat: 38.91,
  lon: -77.04
}, {
  key: 'London',
  kor: '런던',
  zone: 'Europe/London',
  flag: '🇬🇧',
  lat: 51.51,
  lon: -0.13
}, {
  key: 'Paris',
  kor: '파리',
  zone: 'Europe/Paris',
  flag: '🇫🇷',
  lat: 48.85,
  lon: 2.35
}, {
  key: 'Rome',
  kor: '로마',
  zone: 'Europe/Rome',
  flag: '🇮🇹',
  lat: 41.90,
  lon: 12.50
}, {
  key: 'Berlin',
  kor: '베를린',
  zone: 'Europe/Berlin',
  flag: '🇩🇪',
  lat: 52.52,
  lon: 13.40
}, {
  key: 'Dubai',
  kor: '두바이',
  zone: 'Asia/Dubai',
  flag: '🇦🇪',
  lat: 25.20,
  lon: 55.27
}, {
  key: 'Bangkok',
  kor: '방콕',
  zone: 'Asia/Bangkok',
  flag: '🇹🇭',
  lat: 13.75,
  lon: 100.52
}, {
  key: 'Singapore',
  kor: '싱가포르',
  zone: 'Asia/Singapore',
  flag: '🇸🇬',
  lat: 1.35,
  lon: 103.82
}, {
  key: 'Hong Kong',
  kor: '홍콩',
  zone: 'Asia/Hong_Kong',
  flag: '🇭🇰',
  lat: 22.32,
  lon: 114.17
}, {
  key: 'Shanghai',
  kor: '상하이',
  zone: 'Asia/Shanghai',
  flag: '🇨🇳',
  lat: 31.23,
  lon: 121.47
}, {
  key: 'Tokyo',
  kor: '도쿄',
  zone: 'Asia/Tokyo',
  flag: '🇯🇵',
  lat: 35.68,
  lon: 139.69
}, {
  key: 'Seoul',
  kor: '서울',
  zone: 'Asia/Seoul',
  flag: '🇰🇷',
  lat: 37.57,
  lon: 126.98
}, {
  key: 'Sydney',
  kor: '시드니',
  zone: 'Australia/Sydney',
  flag: '🇦🇺',
  lat: -33.87,
  lon: 151.21
}, {
  key: 'Hawaii',
  kor: '하와이',
  zone: 'Pacific/Honolulu',
  flag: '🇺🇸',
  lat: 21.31,
  lon: -157.86
}];

// WMO 날씨 코드 → 설명 + 이모지
const WMO = {
  0: ['맑음', '☀️'],
  1: ['구름 조금', '🌤'],
  2: ['구름 많음', '⛅'],
  3: ['흐림', '☁️'],
  45: ['안개', '🌫'],
  48: ['안개', '🌫'],
  51: ['가벼운 이슬비', '🌦'],
  53: ['이슬비', '🌦'],
  55: ['짙은 이슬비', '🌧'],
  61: ['가벼운 비', '🌧'],
  63: ['비', '🌧'],
  65: ['강한 비', '🌧'],
  71: ['가벼운 눈', '🌨'],
  73: ['눈', '🌨'],
  75: ['강한 눈', '❄️'],
  77: ['싸락눈', '🌨'],
  80: ['소나기', '🌦'],
  81: ['소나기', '🌦'],
  82: ['강한 소나기', '⛈'],
  85: ['눈 소나기', '🌨'],
  86: ['강한 눈 소나기', '🌨'],
  95: ['뇌우', '⛈'],
  96: ['뇌우', '⛈'],
  99: ['뇌우·우박', '⛈']
};
const wmoInfo = code => WMO[code] || ['—', '🌡'];
function useWeather(lat, lon, zone) {
  const [state, setState] = React.useState({
    loading: true,
    data: null
  });
  React.useEffect(() => {
    let alive = true;
    setState({
      loading: true,
      data: null
    });
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` + `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m` + `&daily=weather_code,temperature_2m_max,temperature_2m_min` + `&timezone=${encodeURIComponent(zone)}&forecast_days=5`;
    fetch(url).then(r => r.json()).then(j => {
      if (alive) setState({
        loading: false,
        data: j
      });
    }).catch(() => {
      if (alive) setState({
        loading: false,
        data: null
      });
    });
    return () => {
      alive = false;
    };
  }, [lat, lon]);
  return state;
}
const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'];
function WeatherCard({
  city
}) {
  const {
    loading,
    data
  } = useWeather(city.lat, city.lon, city.zone);
  const cur = data?.current;
  const daily = data?.daily;
  const skeleton = /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 14,
      padding: '13px 14px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.mute,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, "\uB0A0\uC528"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, loading ? '불러오는 중…' : '정보 없음'));
  if (loading || !cur) return skeleton;
  const [desc, emoji] = wmoInfo(cur.weather_code);
  const forecast = daily?.time?.slice(0, 5).map((d, i) => ({
    label: i === 0 ? '오늘' : DAY_KO[new Date(d + 'T12:00:00').getDay()],
    emoji: wmoInfo(daily.weather_code[i])[1],
    max: Math.round(daily.temperature_2m_max[i]),
    min: Math.round(daily.temperature_2m_min[i])
  })) || [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 14,
      padding: '13px 14px 12px'
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
  }, "\uB0A0\uC528"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 11,
      color: COLORS.mute
    }
  }, city.flag, " ", city.key)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 36,
      lineHeight: 1
    }
  }, emoji), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 36,
      color: COLORS.ink,
      lineHeight: 1,
      letterSpacing: '-0.02em'
    }
  }, Math.round(cur.temperature_2m), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22
    }
  }, "\xB0")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 12,
      color: COLORS.mute,
      marginTop: 3
    }
  }, desc))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      paddingBottom: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      color: COLORS.mute
    }
  }, "\uCCB4\uAC10 ", Math.round(cur.apparent_temperature), "\xB0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      color: COLORS.mute,
      marginTop: 3
    }
  }, "\uC2B5\uB3C4 ", cur.relative_humidity_2m, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      color: COLORS.mute,
      marginTop: 3
    }
  }, "\uBC14\uB78C ", Math.round(cur.wind_speed_10m), "\u339E/h"))), forecast.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      paddingTop: 10,
      borderTop: `1px solid ${COLORS.line}`,
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, forecast.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.label,
    style: {
      flex: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      marginBottom: 3
    }
  }, f.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      marginBottom: 3
    }
  }, f.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      color: COLORS.ink,
      fontWeight: 600
    }
  }, f.max, "\xB0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.mute
    }
  }, f.min, "\xB0")))));
}
function zoneOffsetMin(zone, d = new Date()) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const parts = dtf.formatToParts(d).reduce((a, p) => {
    a[p.type] = p.value;
    return a;
  }, {});
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return Math.round((asUTC - d.getTime()) / 60000);
}
function formatDiffFromSeoul(zone) {
  const now = new Date();
  const diff = (zoneOffsetMin(zone, now) - zoneOffsetMin('Asia/Seoul', now)) / 60;
  const sign = diff > 0 ? '+' : diff < 0 ? '−' : '±';
  return `${sign}${Math.abs(diff)}h`;
}
function formatCityTime(zone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
}
function formatCityDateWeekday(zone) {
  const d = new Date();
  const date = new Intl.DateTimeFormat('ko-KR', {
    timeZone: zone,
    month: 'long',
    day: 'numeric'
  }).format(d);
  const weekday = new Intl.DateTimeFormat('ko-KR', {
    timeZone: zone,
    weekday: 'short'
  }).format(d);
  return `${date} (${weekday})`;
}
function TimezoneCard({
  city,
  onPick
}) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    const t = setInterval(force, 30000);
    return () => clearInterval(t);
  }, []);
  const cityFilterFn = React.useCallback((item, q) => {
    const ql = q.toLowerCase();
    return item.key.toLowerCase().includes(ql) || item.kor.includes(q);
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPickerOpen(true),
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 22,
      color: COLORS.ink,
      flexShrink: 0
    }
  }, formatDiffFromSeoul(city.zone)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.04em'
    }
  }, formatCityDateWeekday(city.zone)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 16,
      color: COLORS.ink,
      letterSpacing: '0.04em'
    }
  }, formatCityTime(city.zone)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      fontFamily: SANS,
      fontSize: 11,
      color: COLORS.mute,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, city.flag, " ", city.key)), /*#__PURE__*/React.createElement(PickerSheet, {
    open: pickerOpen,
    onClose: () => setPickerOpen(false),
    title: "\uB3C4\uC2DC \uC120\uD0DD",
    items: CITIES,
    getKey: c => c.key,
    filterFn: cityFilterFn,
    selectedKey: city.key,
    onPick: c => onPick(c),
    renderRow: c => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
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
    }, formatDiffFromSeoul(c.zone), " \xB7 ", formatCityTime(c.zone))))
  }));
}

// ─── TRIPS SCREEN (top level) ───────────────────────────────
// ─── Trip Card with swipe-to-reveal share/delete ─────────────
function TripSwipeCard({
  children,
  onShare,
  onDelete,
  wrapStyle = {}
}) {
  const [x, setX] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const startRef = React.useRef(null);
  const dragging = React.useRef(false);
  const xRef = React.useRef(0);
  const REVEAL = 144;
  const DELETE_EXTRA = 72;
  const close = () => {
    setX(0);
    xRef.current = 0;
    setOpen(false);
  };
  const onTouchStart = e => {
    startRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    dragging.current = false;
  };
  const onTouchMove = e => {
    if (!startRef.current) return;
    const dx = e.touches[0].clientX - startRef.current.x;
    const dy = Math.abs(e.touches[0].clientY - startRef.current.y);
    if (!dragging.current) {
      if (Math.abs(dx) < 8) return;
      if (dy > Math.abs(dx) * 0.6) return;
      dragging.current = true;
    }
    const base = open ? -REVEAL : 0;
    const raw = base + dx;
    const clamped = open ? Math.max(-(REVEAL + DELETE_EXTRA + 16), Math.min(0, raw)) : Math.max(-REVEAL, Math.min(0, raw));
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
      close();
      setTimeout(() => onDelete(), 260);
    } else if (cur < -REVEAL / 2) {
      xRef.current = -REVEAL;
      setX(-REVEAL);
      setOpen(true);
    } else {
      close();
    }
  };
  const onTouchCancel = () => {
    startRef.current = null;
    dragging.current = false;
    close();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    },
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    onTouchEnd: onTouchEnd,
    onTouchCancel: onTouchCancel
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
    onClick: e => {
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
      background: '#ffa500',
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
    onClick: e => {
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
      transform: `translateX(${x}px)`,
      transition: dragging.current ? 'none' : 'transform 0.28s cubic-bezier(0.25,1,0.5,1)',
      background: COLORS.card,
      position: 'relative',
      zIndex: 1,
      overflow: 'hidden',
      ...wrapStyle
    }
  }, children));
}

// ─── Share Trip Sheet ─────────────────────────────────────────
function ShareTripSheet({
  open,
  onClose,
  trip,
  userData,
  allTrips,
  myUid
}) {
  const [memberProfiles, setMemberProfiles] = React.useState([]);
  const [contacts, setContacts] = React.useState([]);
  const [selected, setSelected] = React.useState(new Set());
  const [email, setEmail] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [removing, setRemoving] = React.useState(null);
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);
  React.useEffect(() => {
    if (!open || !trip) return;
    setSelected(new Set());
    setEmail('');
    setMsg('');
    setMemberProfiles([]);
    setContacts([]);
    const currentMembers = new Set(trip.members || []);
    const memberUids = [...currentMembers].filter(uid => uid !== myUid);
    const candidateUids = new Set();
    (allTrips || []).forEach(t => {
      (t.members || []).forEach(uid => {
        if (uid !== myUid && !currentMembers.has(uid)) candidateUids.add(uid);
      });
    });
    setLoading(true);
    Promise.all([memberUids.length ? window.fbGetUsersById(memberUids) : Promise.resolve([]), candidateUids.size ? window.fbGetUsersById([...candidateUids]) : Promise.resolve([])]).then(([members, candidates]) => {
      setMemberProfiles(members);
      setContacts(candidates);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [open, trip && trip.id]);
  const handleRemove = async c => {
    if (!confirm(`"${c.displayName}"님을 이 여행에서 제외할까요?`)) return;
    setRemoving(c.uid);
    await window.fbRemoveTripMember(trip.id, c.uid);
    setMemberProfiles(prev => prev.filter(m => m.uid !== c.uid));
    setRemoving(null);
  };
  const toggleSelect = uid => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);else next.add(uid);
      return next;
    });
  };
  const handleSend = async () => {
    if (!trip) return;
    const hasEmail = email.trim().length > 0;
    if (!selected.size && !hasEmail) return;
    setSending(true);
    setMsg('');
    const results = [];
    for (const uid of selected) {
      const c = contacts.find(x => x.uid === uid);
      if (c?.email) results.push(await fbSendTripInvite(userData, c.email, trip.id, trip.title));
    }
    if (hasEmail) results.push(await fbSendTripInvite(userData, email.trim(), trip.id, trip.title));
    setSending(false);
    const errors = results.filter(r => r.error);
    const ok = results.filter(r => r.success);
    if (ok.length) {
      setMsg(`${ok.map(r => r.toName).join(', ')}님께 초대를 보냈습니다!`);
      setSelected(new Set());
      setEmail('');
    } else if (errors.length) {
      setMsg(errors[0].error);
    }
  };
  if (!open || !trip) return null;
  const canSend = selected.size > 0 || email.trim().length > 0;
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
    onClick: e => e.stopPropagation(),
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
  }, "\uD604\uC7AC \uB3D9\uD589\uC778"), memberProfiles.map(c => /*#__PURE__*/React.createElement("div", {
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
    onClick: e => {
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
  })))), /*#__PURE__*/React.createElement("div", {
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
  }, "\uC774\uC804 \uB3D9\uD589\uC778"), contacts.map(c => {
    const isSel = selected.has(c.uid);
    return /*#__PURE__*/React.createElement("div", {
      key: c.uid,
      onClick: () => toggleSelect(c.uid),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 14,
        marginBottom: 6,
        background: isSel ? '#EEF2FF' : COLORS.card,
        border: `1.5px solid ${isSel ? '#4F6BED' : 'transparent'}`,
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
        border: `2px solid ${isSel ? '#4F6BED' : COLORS.line}`,
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
    onChange: e => setEmail(e.target.value),
    placeholder: "\uAD6C\uAE00 \uC774\uBA54\uC77C \uC785\uB825",
    onKeyDown: e => e.key === 'Enter' && handleSend(),
    style: {
      width: '100%',
      padding: '13px 14px',
      borderRadius: 14,
      border: `1.5px solid ${COLORS.line}`,
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
function TripsScreen({
  trips,
  onSelect,
  onAdd,
  onRestore,
  onShare,
  onDelete,
  loading,
  userData,
  onOpenCompanion,
  myUid,
  onOpenNotifs,
  unreadCount
}) {
  const [restoring, setRestoring] = React.useState(false);
  const [restoreErr, setRestoreErr] = React.useState('');
  const handleRestore = async () => {
    if (restoring || !onRestore) return;
    setRestoring(true);
    setRestoreErr('');
    try {
      await onRestore();
    } catch (e) {
      setRestoreErr('복원 실패. 다시 시도해 주세요.');
      setRestoring(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: COLORS.bg,
      paddingBottom: 100,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onOpenCompanion,
    style: {
      position: 'absolute',
      top: 'calc(16px + env(safe-area-inset-top,0px))',
      right: 20,
      zIndex: 10,
      width: 38,
      height: 38,
      borderRadius: 19,
      background: userData?.photoURL ? 'transparent' : COLORS.softer,
      border: `2px solid ${COLORS.line}`,
      padding: 0,
      cursor: 'pointer',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 1px 6px rgba(0,0,0,0.10)'
    }
  }, userData?.photoURL ? /*#__PURE__*/React.createElement("img", {
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
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenNotifs,
    style: {
      position: 'absolute',
      top: 'calc(18px + env(safe-area-inset-top,0px))',
      right: 68,
      zIndex: 10,
      width: 34,
      height: 34,
      borderRadius: 0,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 20,
    color: COLORS.ink,
    stroke: 1.8
  }), unreadCount > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      minWidth: 15,
      height: 15,
      borderRadius: 8,
      background: '#E03C31',
      padding: '0 3px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: MONO,
      fontSize: 9,
      color: '#fff',
      fontWeight: 700,
      boxSizing: 'border-box'
    }
  }, unreadCount > 9 ? '9+' : unreadCount)), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 'calc(16px + env(safe-area-inset-top,0px))',
      paddingLeft: 20,
      paddingRight: 112,
      paddingBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 34,
      color: COLORS.ink,
      letterSpacing: '-0.02em'
    }
  }, "My Trips", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'monospace',
      fontSize: 11,
      color: COLORS.mute,
      marginLeft: 8
    }
  }, "v186"))), loading ? /*#__PURE__*/React.createElement("div", {
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
  }, trips.map(t => {
    const hue = t.hue ?? t.days?.[0]?.hero?.hue ?? 25;
    const label = t.days?.[0]?.hero?.label || t.title?.toUpperCase() || 'TRIP';
    const isShared = Array.isArray(t.members) && t.members.length > 0 && t.members[0] !== myUid;
    return /*#__PURE__*/React.createElement(TripSwipeCard, {
      key: t.id,
      onShare: () => onShare(t),
      onDelete: () => onDelete(t.id),
      wrapStyle: {
        borderRadius: 16,
        border: `1px solid ${COLORS.line}`
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onSelect(t.id),
      style: {
        display: 'block',
        width: '100%',
        background: 'none',
        border: 'none',
        padding: 0,
        margin: 0,
        textAlign: 'left',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent'
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
  }), (trips.length === 0 || trips.every(t => !(t.days || []).length)) && onRestore && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '28px 20px',
      background: COLORS.card,
      borderRadius: 16,
      border: `1px solid ${COLORS.line}`,
      textAlign: 'center',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 24,
      color: COLORS.ink,
      marginBottom: 6
    }
  }, "New York"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute,
      marginBottom: 18
    }
  }, "10\uC77C \uB274\uC695 \uC77C\uC815\uC744 \uBCF5\uC6D0\uD569\uB2C8\uB2E4"), restoreErr && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 12,
      color: COLORS.accent,
      marginBottom: 10
    }
  }, restoreErr), /*#__PURE__*/React.createElement("button", {
    onClick: handleRestore,
    disabled: restoring,
    style: {
      padding: '12px 28px',
      background: restoring ? COLORS.mute : COLORS.ink,
      border: 'none',
      borderRadius: 12,
      color: COLORS.bg,
      fontFamily: SANS,
      fontSize: 13,
      fontWeight: 500,
      cursor: restoring ? 'default' : 'pointer',
      opacity: restoring ? 0.7 : 1
    }
  }, restoring ? '복원 중...' : '뉴욕 일정 복원하기')), /*#__PURE__*/React.createElement("button", {
    onClick: onAdd,
    style: {
      marginTop: 4,
      padding: '18px 16px',
      background: 'transparent',
      border: `1.5px dashed ${COLORS.line}`,
      borderRadius: 16,
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
const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
  const year = m[3] ? parseInt(m[3], 10) : tripYear || new Date().getFullYear();
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
function HomeScreen({
  trip,
  onOpenDay,
  onOpenHotel,
  onOpenHotelSheet,
  city,
  onPickCity,
  onEditTrip,
  onReorderDays,
  onAddDay,
  onDeleteDay,
  onBack,
  onAddHotel,
  onAddHotelFromSearch,
  onAddHotelViaStop,
  onDeleteHotel,
  onReorderHotels,
  onConvertInlineHotel,
  onAddItemToFirstDay,
  editing,
  setEditing,
  userData,
  onOpenCompanion,
  onLoadSample,
  onOpenNotifs,
  unreadCount
}) {
  const [editingTitle, setEditingTitle] = React.useState(false);
  const [dateRangeOpen, setDateRangeOpen] = React.useState(false);
  const [sampleLoading, setSampleLoading] = React.useState(false);
  const [sampleErr, setSampleErr] = React.useState('');
  const handleLoadSample = async () => {
    if (!onLoadSample || sampleLoading) return;
    setSampleLoading(true);
    setSampleErr('');
    try {
      await onLoadSample();
    } catch (e) {
      setSampleErr('저장 실패. 네트워크 확인 후 다시 시도해 주세요.');
    } finally {
      setSampleLoading(false);
    }
  };
  const {
    itemProps: dayDragProps,
    isTouchDragging: isDayDragging
  } = useDragReorder(onReorderDays, editing);
  const {
    itemProps: hotelDragProps,
    isTouchDragging: isHotelDragging
  } = useDragReorder(onReorderHotels, editing);
  const tripYear = extractTripYear(trip);
  const todayIso = new Date().toISOString().slice(0, 10);
  const featuredIdx = (() => {
    const isos = trip.days.map(d => dayDateToIso(d.date, tripYear) || '');
    const todayIdx = isos.findIndex(iso => iso === todayIso);
    if (todayIdx >= 0) return todayIdx; // 여행 중: 오늘
    const future = isos.findIndex(iso => iso > todayIso);
    if (future === 0 || isos.every(iso => !iso)) return 0; // 여행 전: 첫째 날
    if (future < 0) return trip.days.length - 1; // 여행 후: 마지막 날
    return future - 1; // 사이 공백: 가장 가까운 지난 날
  })();
  const featured = trip.days[featuredIdx];

  // trip.dates 파싱: "May 4 — May 13, 2025"
  const parseTripDates = () => {
    const str = trip.dates || '';
    const parts = str.split(/\s*[—–-]\s*/);
    const startStr = parts[0]?.trim() || '';
    const endStr = parts[1]?.trim() || '';
    // 연도가 없으면 tripYear 붙이기
    const addYear = s => /\d{4}/.test(s) ? s : s ? `${s}, ${tripYear}` : '';
    return {
      startIso: dayDateToIso(addYear(startStr), tripYear),
      endIso: dayDateToIso(addYear(endStr), tripYear)
    };
  };
  const handlePickRange = (newStartIso, newEndIso) => {
    const {
      startIso: oldStart
    } = parseTripDates();
    let days = trip.days;
    let hotels = trip.hotels || [];
    // 시작일 변경 시 모든 일정 날짜 + 숙소 날짜 동시 이동
    if (newStartIso && oldStart && oldStart !== newStartIso) {
      const diffDays = Math.round((new Date(newStartIso + 'T12:00:00').getTime() - new Date(oldStart + 'T12:00:00').getTime()) / 86400000);
      const shiftIso = iso => {
        if (!iso) return iso;
        const d = new Date(new Date(iso + 'T12:00:00').getTime() + diffDays * 86400000);
        return d.toISOString().slice(0, 10);
      };
      const shiftHotelDate = dateStr => {
        if (!dateStr) return dateStr;
        const iso = dayDateToIso(dateStr, tripYear);
        if (!iso) return dateStr;
        const newIso = shiftIso(iso);
        const m = newIso.match(/^(\d{4})-(\d{2})-(\d{2})/);
        return m ? `${MONTH_NAMES_SHORT[parseInt(m[2], 10) - 1]} ${parseInt(m[3], 10)}` : dateStr;
      };
      days = (trip.days || []).map(d => {
        const dIso = dayDateToIso(d.date, tripYear);
        if (!dIso) return d;
        const iso = shiftIso(dIso);
        return {
          ...d,
          date: isoToDayDate(iso),
          weekday: isoToWeekday(iso)
        };
      });
      hotels = hotels.map(h => ({
        ...h,
        checkin: shiftHotelDate(h.checkin),
        checkout: shiftHotelDate(h.checkout)
      }));
    }
    const newStart = newStartIso ? isoToDayDate(newStartIso) : '';
    const newEnd = newEndIso ? isoToDayDate(newEndIso) : '';
    onEditTrip({
      days,
      hotels,
      dates: newEnd ? `${newStart} — ${newEnd}` : newStart
    });
  };
  const {
    startIso,
    endIso
  } = parseTripDates();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      minHeight: '100vh',
      paddingBottom: 110,
      position: 'relative'
    }
  }, onBack && /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      position: 'absolute',
      top: 'calc(16px + env(safe-area-inset-top,0px))',
      left: 14,
      zIndex: 10,
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
    name: "chevron-l",
    size: 14,
    color: COLORS.mute,
    stroke: 2
  }), "My Trips"), onOpenCompanion && /*#__PURE__*/React.createElement("button", {
    onClick: onOpenCompanion,
    style: {
      position: 'absolute',
      top: 'calc(16px + env(safe-area-inset-top,0px))',
      right: 20,
      zIndex: 10,
      width: 38,
      height: 38,
      borderRadius: 19,
      background: userData?.photoURL ? 'transparent' : COLORS.softer,
      border: `2px solid ${COLORS.line}`,
      padding: 0,
      cursor: 'pointer',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 1px 6px rgba(0,0,0,0.10)'
    }
  }, userData?.photoURL ? /*#__PURE__*/React.createElement("img", {
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
  })), onOpenNotifs && /*#__PURE__*/React.createElement("button", {
    onClick: onOpenNotifs,
    style: {
      position: 'absolute',
      top: 'calc(18px + env(safe-area-inset-top,0px))',
      right: 68,
      zIndex: 10,
      width: 34,
      height: 34,
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 20,
    color: COLORS.ink,
    stroke: 1.8
  }), unreadCount > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 2,
      right: 2,
      width: 8,
      height: 8,
      borderRadius: 4,
      background: '#E03C31'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 'calc(52px + env(safe-area-inset-top, 0px))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 24px 18px'
    }
  }, editing && editingTitle ? /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: trip.title,
    onChange: e => onEditTrip({
      title: e.target.value
    }),
    onBlur: () => setEditingTitle(false),
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
    onClick: () => editing && setEditingTitle(true),
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
    onClick: () => setDateRangeOpen(true),
    style: {
      border: `1.5px solid ${COLORS.line}`,
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
    onClick: () => setDateRangeOpen(true),
    style: {
      border: `1.5px solid ${COLORS.line}`,
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
    hue: featured.hero?.hue ?? 25,
    label: featured.hero?.label,
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
  }, "DAY ", String(featured.n).padStart(2, '0'), " \xB7 ", featured.weekday.toUpperCase()), /*#__PURE__*/React.createElement("div", {
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
    onClick: () => onOpenDay(featuredIdx),
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
  }, /*#__PURE__*/React.createElement("span", null, featuredIdx === 0 ? '첫날 일정 보기' : `Day ${featured.n} 일정 보기`), /*#__PURE__*/React.createElement(Icon, {
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
  }, trip.days.length, " DAYS \xB7 ", trip.days.reduce((s, d) => s + (d.items?.length || 0), 0), " STOPS")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, trip.days.map((d, i) => {
    const dp = dayDragProps(i);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      ref: dp.ref,
      style: dp.style || {}
    }, /*#__PURE__*/React.createElement(SwipeableRow, {
      onEdit: () => onOpenDay(i),
      onDelete: () => onDeleteDay(i),
      disabled: editing,
      isDragging: isDayDragging,
      wrapStyle: {
        borderRadius: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      onTouchStart: dp.onTouchStart,
      onTouchMove: dp.onTouchMove,
      onTouchEnd: dp.onTouchEnd,
      onClick: () => !editing && !isDayDragging && onOpenDay(i),
      style: {
        borderRadius: 16,
        cursor: editing ? 'grab' : 'pointer',
        background: COLORS.card
      }
    }, /*#__PURE__*/React.createElement("div", {
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
      hue: d.hero?.hue ?? 25,
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
    }), /*#__PURE__*/React.createElement("span", null, d.items?.length ?? 0, " stops"))), editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DragHandle, {
      size: 14,
      color: COLORS.mute
    }), !isDayDragging && /*#__PURE__*/React.createElement("button", {
      onClick: e => {
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
    })))));
  }), (() => {
    const hasItems = trip.days.some(d => d.items?.length > 0);
    if ((trip.days.length === 0 || !hasItems) && onLoadSample) return /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '8px 0 4px',
        padding: '24px 20px',
        background: COLORS.card,
        borderRadius: 16,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SERIF,
        fontSize: 20,
        color: COLORS.ink,
        marginBottom: 6
      }
    }, "New York"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 13,
        color: COLORS.mute,
        marginBottom: 12
      }
    }, "\uC77C\uC815 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC635\uB2C8\uB2E4"), sampleErr && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 12,
        color: COLORS.accent,
        marginBottom: 10
      }
    }, sampleErr), /*#__PURE__*/React.createElement("button", {
      onClick: handleLoadSample,
      disabled: sampleLoading,
      style: {
        padding: '11px 24px',
        background: sampleLoading ? COLORS.mute : COLORS.ink,
        border: 'none',
        borderRadius: 12,
        color: COLORS.bg,
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: 500,
        cursor: sampleLoading ? 'default' : 'pointer',
        opacity: sampleLoading ? 0.7 : 1
      }
    }, sampleLoading ? '불러오는 중...' : '뉴욕 일정 불러오기'));
    return null;
  })(), !editing && /*#__PURE__*/React.createElement("button", {
    onClick: onAddDay,
    style: {
      padding: '16px 12px',
      background: 'transparent',
      border: `1.5px dashed ${COLORS.line}`,
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
      border: `1.5px dashed ${COLORS.line}`,
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
  }), " \uC77C\uCC28 \uCD94\uAC00")), (() => {
    const hotelList = (trip.hotels || []).map((h, idx) => ({
      ...h,
      _idx: idx
    })).sort((a, b) => (a.checkin || '') < (b.checkin || '') ? -1 : (a.checkin || '') > (b.checkin || '') ? 1 : 0);
    const total = hotelList.length;
    const openHotel = idx => onOpenHotelSheet ? onOpenHotelSheet(idx) : onOpenHotel(idx);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '22px 24px 8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SERIF,
        fontSize: 22,
        color: COLORS.ink
      }
    }, "\uC219\uC18C"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center'
      }
    }, !editing && /*#__PURE__*/React.createElement("button", {
      onClick: () => onAddHotelViaStop ? onAddHotelViaStop() : onOpenHotelSheet ? onOpenHotelSheet('new') : onAddHotel(),
      style: {
        width: 28,
        height: 28,
        borderRadius: 14,
        border: 'none',
        background: COLORS.softer,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14,
      color: COLORS.mute,
      stroke: 2
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 10,
        color: COLORS.mute,
        letterSpacing: '0.1em'
      }
    }, total, " STAYS"))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, hotelList.map((h, i) => {
      const hp = hotelDragProps(h._idx);
      return /*#__PURE__*/React.createElement("div", {
        key: h._idx,
        ref: hp.ref,
        style: hp.style || {}
      }, /*#__PURE__*/React.createElement(SwipeableRow, {
        onEdit: () => openHotel(h._idx),
        onDelete: () => onDeleteHotel(h._idx),
        disabled: editing,
        wrapStyle: {
          borderRadius: 16
        }
      }, /*#__PURE__*/React.createElement("div", {
        onTouchStart: hp.onTouchStart,
        onTouchMove: hp.onTouchMove,
        onTouchEnd: hp.onTouchEnd,
        onClick: () => !editing && openHotel(h._idx),
        style: {
          background: COLORS.card,
          borderRadius: 16,
          padding: 12,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          cursor: editing ? 'grab' : 'pointer',
          border: hp['data-drag-over'] ? `2px solid ${COLORS.accent}` : 'none'
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
        hue: h.hue ?? 25,
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
        onClick: e => {
          e.stopPropagation();
          onDeleteHotel(h._idx);
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
    })));
  })(), /*#__PURE__*/React.createElement("div", {
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
    onPick: onPickCity
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 16px 0'
    }
  }, /*#__PURE__*/React.createElement(WeatherCard, {
    city: city
  })), /*#__PURE__*/React.createElement(DateRangeSheet, {
    open: dateRangeOpen,
    startIso: startIso,
    endIso: endIso,
    onClose: () => setDateRangeOpen(false),
    onPick: (s, e) => {
      handlePickRange(s, e);
      setDateRangeOpen(false);
    }
  }));
}

// ─── Day screen ─────────────────────────────────────────────
function DayScreen({
  trip,
  dayIdx,
  onBack,
  onOpenStop,
  onNavDay,
  onEditDay,
  onAddItem,
  onDeleteItem,
  onReorderItems,
  editing,
  setEditing
}) {
  const day = trip.days[dayIdx] || {
    n: dayIdx + 1,
    title: '',
    date: '',
    weekday: '',
    hero: {
      hue: 25,
      label: ''
    },
    items: []
  };
  const tripYear = extractTripYear(trip);
  const [travelTimes, setTravelTimes] = React.useState({});
  React.useEffect(() => {
    const items = day.items || [];
    const pending = items.reduce((acc, it, i) => {
      if (i > 0 && it.coords && items[i - 1].coords) acc.push(i);
      return acc;
    }, []);
    if (!pending.length) {
      setTravelTimes({});
      return;
    }
    let alive = true;
    const results = {};
    Promise.all(pending.map(async i => {
      const [lat1, lon1] = items[i - 1].coords;
      const [lat2, lon2] = items[i].coords;
      try {
        const r = await (await fetch(`https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`)).json();
        if (r.routes?.[0]) {
          const {
            duration,
            distance
          } = r.routes[0];
          results[i] = {
            drive: Math.max(1, Math.round(duration / 60)),
            walk: Math.max(1, Math.round(distance / 83.33))
          };
        }
      } catch (_) {}
    })).then(() => {
      if (alive) setTravelTimes(results);
    });
    return () => {
      alive = false;
    };
  }, [dayIdx, (day.items || []).map(it => it.coords ? it.coords.join(',') : '').join('|')]);
  const fmtMin = m => m >= 60 ? `${Math.floor(m / 60)}시간${m % 60 ? ` ${m % 60}분` : ''}` : `${m}분`;
  const [done, setDone] = React.useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('done_' + trip.title + '_' + dayIdx) || '[]'));
    } catch (e) {
      return new Set();
    }
  });
  const toggle = i => setDone(s => {
    const n = new Set(s);
    n.has(i) ? n.delete(i) : n.add(i);
    localStorage.setItem('done_' + trip.title + '_' + dayIdx, JSON.stringify([...n]));
    return n;
  });
  const [editingTitle, setEditingTitle] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [nearbyStop, setNearbyStop] = React.useState(null);
  const [nearbyTab, setNearbyTab] = React.useState('hotspot');
  const {
    itemProps: itemDragProps
  } = useDragReorder(onReorderItems, editing);
  const heroHue = day.hero?.hue ?? 25;
  const heroBg = `oklch(0.88 0.035 ${heroHue})`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      minHeight: '100vh',
      paddingBottom: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: heroBg
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    hue: heroHue,
    label: day.hero?.label,
    height: 'calc(280px + env(safe-area-inset-top, 0px))'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 'calc(180px + env(safe-area-inset-top, 0px))',
      background: 'linear-gradient(180deg, rgba(0,0,0,0.22), transparent)'
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
    onClick: () => setEditing(e => !e)
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
    onClick: () => setDatePickerOpen(true),
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
  }), day.weekday && day.date ? `${day.weekday} · ${day.date}` : '날짜 설정') : /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 11,
      color: COLORS.mute
    }
  }, day.weekday, day.weekday && day.date ? ' · ' : '', day.date)), editing && editingTitle ? /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: day.title,
    onChange: e => onEditDay({
      title: e.target.value
    }),
    onBlur: () => setEditingTitle(false),
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
    onClick: () => editing && setEditingTitle(true),
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
  }, done.size, "/", day.items?.length ?? 0, " DONE")), /*#__PURE__*/React.createElement("div", {
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
  }), (day.items || []).map((it, i) => {
    const meta = CAT_META[it.cat] || {
      icon: 'pin',
      label: it.cat
    };
    const isDone = done.has(i);
    const dp = itemDragProps(i);
    return /*#__PURE__*/React.createElement("div", _extends({
      key: i
    }, dp, {
      style: {
        display: 'flex',
        marginBottom: 12,
        position: 'relative',
        ...(dp.style || {})
      }
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
      onClick: e => {
        e.stopPropagation();
        toggle(i);
      },
      style: {
        width: 16,
        height: 16,
        borderRadius: 8,
        border: `1.5px solid ${isDone ? COLORS.accent : COLORS.ink}`,
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
      onEdit: () => onOpenStop({
        idx: i,
        stop: it,
        editing: true
      }),
      onDelete: () => onDeleteItem(i)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, !editing && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 5,
        display: 'flex',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        setNearbyTab('food');
        setNearbyStop(it);
      },
      style: {
        width: 26,
        height: 26,
        borderRadius: 13,
        border: 'none',
        background: 'rgba(26,24,22,0.06)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "food",
      size: 13,
      color: COLORS.mute,
      stroke: 1.8
    })), /*#__PURE__*/React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        setNearbyTab('hotspot');
        setNearbyStop(it);
      },
      style: {
        width: 26,
        height: 26,
        borderRadius: 13,
        border: 'none',
        background: 'rgba(26,24,22,0.06)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkle",
      size: 13,
      color: COLORS.mute,
      stroke: 1.8
    }))), /*#__PURE__*/React.createElement("button", {
      onClick: () => onOpenStop({
        idx: i,
        stop: it,
        editing
      }),
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
    }, travelTimes[i] && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginBottom: 7,
        fontFamily: MONO,
        fontSize: 9,
        color: COLORS.mute,
        letterSpacing: '0.06em'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 3,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "car",
      size: 11,
      stroke: 1.8
    }), fmtMin(travelTimes[i].drive)), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 3,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "walk",
      size: 11,
      stroke: 1.8
    }), fmtMin(travelTimes[i].walk))), /*#__PURE__*/React.createElement("div", {
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
    }), /*#__PURE__*/React.createElement("span", null, meta.label), it.price && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
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
      onClick: e => {
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
    }))), dp['data-drag-over'] && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: -2,
        border: `2px dashed rgba(193,79,46,0.45)`,
        borderRadius: 16,
        pointerEvents: 'none',
        background: 'rgba(193,79,46,0.04)'
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
      border: `1.5px dashed ${COLORS.line}`,
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
    onClick: () => onNavDay(day.n - 2),
    style: {
      flex: 1,
      background: COLORS.card,
      border: `1px solid ${COLORS.line}`,
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
    onClick: () => onNavDay(day.n),
    style: {
      flex: 1,
      background: COLORS.card,
      border: `1px solid ${COLORS.line}`,
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
    onClose: () => setDatePickerOpen(false),
    onPick: iso => {
      const display = isoToDayDate(iso);
      const weekday = isoToWeekday(iso);
      onEditDay({
        date: display,
        weekday
      });
      setDatePickerOpen(false);
    }
  }), /*#__PURE__*/React.createElement(NearbySheet, {
    stop: nearbyStop,
    initialTab: nearbyTab,
    onClose: () => setNearbyStop(null)
  }));
}

// ─── Hotel Detail page ──────────────────────────────────────
function HotelDetailScreen({
  hotel,
  onBack,
  onEdit,
  onOpenSearch,
  editing,
  setEditing
}) {
  const [draft, setDraft] = React.useState(hotel);
  React.useEffect(() => setDraft(hotel), [hotel]);
  const save = () => {
    onEdit(draft);
    setEditing(false);
  };
  const addr = draft.name + ' ' + (draft.address || draft.area || '');

  // Date conversion: "May 4" ↔ "YYYY-MM-DD". Year is taken from current date
  // (this app uses May-based demo data; real users would type their trip year).
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateToIso = txt => {
    if (!txt) return '';
    // Accept "May 4", "May 4, 2025", or already ISO
    if (/^\d{4}-\d{2}-\d{2}/.test(txt)) return txt.slice(0, 10);
    const m = txt.match(/([A-Za-z]+)\s+(\d{1,2})(?:,\s*(\d{4}))?/);
    if (!m) return '';
    const mi = MONTHS.findIndex(x => x.toLowerCase() === m[1].slice(0, 3).toLowerCase());
    if (mi < 0) return '';
    const year = m[3] || new Date().getFullYear();
    return `${year}-${String(mi + 1).padStart(2, '0')}-${String(m[2]).padStart(2, '0')}`;
  };
  const isoToDisplay = iso => {
    if (!iso) return '';
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return iso;
    return `${MONTHS[parseInt(m[2], 10) - 1]} ${parseInt(m[3], 10)}`;
  };
  const [pickerOpen, setPickerOpen] = React.useState(null); // {key, type}

  const field = (key, label, placeholder, type = 'text') => {
    const isDate = type === 'date';
    const isTime = type === 'time';
    const shown = isDate ? draft[key] ? draft[key] : '' : draft[key] || '';
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
      onClick: () => setPickerOpen({
        key,
        type
      }),
      style: {
        width: '100%',
        padding: '10px 12px',
        borderRadius: 8,
        border: `1px solid ${COLORS.line}`,
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
      onChange: e => setDraft({
        ...draft,
        [key]: e.target.value
      }),
      placeholder: placeholder,
      style: {
        width: '100%',
        padding: '9px 11px',
        borderRadius: 8,
        border: `1px solid ${COLORS.line}`,
        background: COLORS.card,
        fontFamily: SANS,
        fontSize: 13,
        color: COLORS.ink,
        boxSizing: 'border-box'
      }
    }));
  };
  const hotelHue = draft.hue || 25;
  const hotelBg = `oklch(0.88 0.035 ${hotelHue})`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      minHeight: '100vh',
      paddingBottom: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: hotelBg
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    hue: hotelHue,
    label: (draft.name || '').toUpperCase().slice(0, 20),
    height: 'calc(240px + env(safe-area-inset-top, 0px))'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 'calc(180px + env(safe-area-inset-top, 0px))',
      background: 'linear-gradient(180deg, rgba(0,0,0,0.22), transparent)'
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
    onClick: () => setEditing(true)
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
    onChange: e => setDraft({
      ...draft,
      name: e.target.value
    }),
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
    onChange: e => setDraft({
      ...draft,
      note: e.target.value
    }),
    rows: 3,
    style: {
      width: '100%',
      padding: '9px 11px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
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
    value: `${draft.checkin || '—'}${draft.checkinTime ? ' ' + draft.checkinTime : ''} → ${draft.checkout || '—'}${draft.checkoutTime ? ' ' + draft.checkoutTime : ''}${draft.nights ? ` · ${draft.nights}박` : ''}`
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
  }].filter(Boolean).map((r, i, arr) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '13px 16px',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.line}` : 'none'
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
  }, r.value)))))), draft.amenities && draft.amenities.length > 0 && /*#__PURE__*/React.createElement("div", {
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
  }, draft.amenities.map((a, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      padding: '6px 10px',
      borderRadius: 8,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 12,
      color: COLORS.ink
    }
  }, a)))), draft.note && /*#__PURE__*/React.createElement("div", {
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
    onClick: () => window.open(mapsDirectionsUrl(addr), '_blank'),
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
    onClick: () => window.open(mapsSearchUrl(addr), '_blank'),
    style: {
      width: 60,
      background: COLORS.card,
      border: `1px solid ${COLORS.line}`,
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
    onPick: iso => setDraft({
      ...draft,
      [pickerOpen.key]: isoToDisplay(iso)
    }),
    onClose: () => setPickerOpen(null)
  }), /*#__PURE__*/React.createElement(TimeWheelSheet, {
    open: !!pickerOpen && pickerOpen.type === 'time',
    value: pickerOpen ? draft[pickerOpen.key] || '' : '',
    title: pickerOpen && pickerOpen.key === 'checkinTime' ? '체크인 시간' : '체크아웃 시간',
    onPick: t => setDraft({
      ...draft,
      [pickerOpen.key]: t
    }),
    onClose: () => setPickerOpen(null)
  }));
}

// ─── Nearby suggestions sheet ────────────────────────────────
function haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000,
    toR = Math.PI / 180;
  const dLat = (lat2 - lat1) * toR,
    dLon = (lon2 - lon1) * toR;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * toR) * Math.cos(lat2 * toR) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function NearbySheet({
  stop,
  initialTab,
  onClose
}) {
  const [tab, setTab] = React.useState('hotspot');
  const [hotspots, setHotspots] = React.useState(null);
  const [food, setFood] = React.useState(null);
  const [photos, setPhotos] = React.useState({});
  const [entered, setEntered] = React.useState(false);
  const [sheetY, setSheetY] = React.useState(0);
  const sheetRef = React.useRef(null);
  const sheetYRef = React.useRef(0);
  const dragRef = React.useRef({
    active: false
  });

  // 열릴 때마다 리셋 + 슬라이드업 애니
  React.useEffect(() => {
    if (!stop) {
      setEntered(false);
      return;
    }
    setTab(initialTab || 'hotspot');
    setHotspots(null);
    setFood(null);
    setPhotos({});
    setSheetY(0);
    sheetYRef.current = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, [stop, initialTab]);

  // 두 타입 병렬 fetch
  React.useEffect(() => {
    if (!stop) return;
    const ctrl = new AbortController();
    (async () => {
      try {
        let lat, lon;
        if (stop.coords) {
          [lat, lon] = stop.coords;
        } else {
          const q = encodeURIComponent([stop.title, stop.en, stop.loc].filter(Boolean).join(' '));
          const geo = await fetch(`https://photon.komoot.io/api/?q=${q}&limit=1`, {
            signal: ctrl.signal
          }).then(r => r.json());
          const f = geo.features?.[0];
          if (!f) {
            setHotspots([]);
            setFood([]);
            return;
          }
          [lon, lat] = f.geometry.coordinates;
        }
        const parse = d => {
          const seen = new Set();
          return (d.elements || []).reduce((acc, e) => {
            const nm = e.tags?.name || e.tags?.['name:en'] || '';
            if (!nm || seen.has(nm) || !e.lat) return acc;
            seen.add(nm);
            acc.push({
              name: nm,
              type: e.tags?.amenity || e.tags?.tourism || e.tags?.historic || e.tags?.leisure || '',
              wikipedia: e.tags?.wikipedia || '',
              dist: haversineM(lat, lon, e.lat, e.lon),
              lat: e.lat,
              lon: e.lon
            });
            return acc;
          }, []).sort((a, b) => a.dist - b.dist);
        };
        const hQ = `[out:json][timeout:10];(node["tourism"~"attraction|museum|viewpoint|gallery|theme_park|zoo"](around:900,${lat},${lon});node["historic"~"monument|castle|ruins|memorial"](around:900,${lat},${lon});node["leisure"~"park|garden"](around:900,${lat},${lon}););out 30;`;
        const fQ = `[out:json][timeout:10];(node["amenity"~"restaurant|cafe|bar|fast_food|pub|biergarten|food_court"](around:600,${lat},${lon}););out 30;`;
        const base = 'https://overpass-api.de/api/interpreter?data=';
        const [hR, fR] = await Promise.all([fetch(base + encodeURIComponent(hQ), {
          signal: ctrl.signal
        }).then(r => r.json()), fetch(base + encodeURIComponent(fQ), {
          signal: ctrl.signal
        }).then(r => r.json())]);
        setHotspots(parse(hR));
        setFood(parse(fR));
      } catch (e) {
        if (!ctrl.signal.aborted) {
          setHotspots([]);
          setFood([]);
        }
      }
    })();
    return () => ctrl.abort();
  }, [stop]);

  // Wikipedia 사진 fetch
  React.useEffect(() => {
    [...(hotspots || []), ...(food || [])].forEach(item => {
      if (!item.wikipedia || item.name in photos) return;
      setPhotos(p => ({
        ...p,
        [item.name]: null
      }));
      const title = item.wikipedia.replace(/^[a-z-]+:/, '').replace(/ /g, '_');
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`).then(r => r.json()).then(d => {
        if (d.thumbnail?.source) setPhotos(p => ({
          ...p,
          [item.name]: d.thumbnail.source
        }));
      }).catch(() => {});
    });
  }, [hotspots, food]);

  // 드래그-투-클로즈
  React.useEffect(() => {
    const el = sheetRef.current;
    if (!el || !stop) return;
    const onStart = e => {
      dragRef.current = {
        active: true,
        startY: e.touches[0].clientY,
        st: el.scrollTop
      };
    };
    const onMove = e => {
      if (!dragRef.current.active) return;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      if (dragRef.current.st > 8 || dy <= 0) {
        dragRef.current.active = false;
        return;
      }
      e.preventDefault();
      sheetYRef.current = Math.max(0, dy);
      setSheetY(sheetYRef.current);
    };
    const onEnd = () => {
      dragRef.current.active = false;
      if (sheetYRef.current > 110) onClose();else {
        sheetYRef.current = 0;
        setSheetY(0);
      }
    };
    el.addEventListener('touchstart', onStart, {
      passive: true
    });
    el.addEventListener('touchmove', onMove, {
      passive: false
    });
    el.addEventListener('touchend', onEnd, {
      passive: true
    });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, [stop]);
  if (!stop) return null;
  const TYPE_KO = {
    restaurant: '레스토랑',
    cafe: '카페',
    bar: '바',
    fast_food: '패스트푸드',
    pub: '펍',
    biergarten: '비어가든',
    food_court: '푸드코트',
    attraction: '명소',
    museum: '박물관',
    viewpoint: '전망대',
    gallery: '갤러리',
    theme_park: '테마파크',
    zoo: '동물원',
    park: '공원',
    garden: '정원',
    monument: '기념비',
    castle: '성',
    ruins: '유적',
    memorial: '기념관',
    historic: '유적지'
  };
  const fmtDist = m => m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(1)}km`;
  const currentData = tab === 'hotspot' ? hotspots : food;
  const loading = currentData === null;
  const renderItem = item => {
    const photoUrl = photos[item.name];
    const hue = item.name.split('').reduce((h, c) => h * 31 + c.charCodeAt(0) & 0xffff, 0) % 360;
    return /*#__PURE__*/React.createElement("button", {
      key: item.name,
      onClick: () => window.open(mapsSearchUrl(item.name), '_blank'),
      style: {
        width: '100%',
        padding: '10px 16px',
        border: 'none',
        borderBottom: `1px solid ${COLORS.line}`,
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 58,
        height: 58,
        borderRadius: 12,
        flexShrink: 0,
        overflow: 'hidden'
      }
    }, photoUrl ? /*#__PURE__*/React.createElement("img", {
      src: photoUrl,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      },
      loading: "lazy"
    }) : /*#__PURE__*/React.createElement(Photo, {
      hue: hue,
      height: 58,
      small: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 13.5,
        fontWeight: 500,
        color: COLORS.ink,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, item.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 10,
        color: COLORS.mute,
        marginTop: 3
      }
    }, TYPE_KO[item.type] || item.type || '—', " \xB7 ", fmtDist(item.dist))), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron",
      size: 14,
      color: COLORS.line,
      stroke: 2
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      background: `rgba(0,0,0,${Math.max(0, 0.32 - sheetY / 500)})`
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    ref: sheetRef,
    onClick: e => e.stopPropagation(),
    style: {
      background: COLORS.bg,
      borderRadius: '22px 22px 0 0',
      maxHeight: '74%',
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingBottom: 'calc(20px + env(safe-area-inset-bottom,0px))',
      transform: `translateY(${entered ? sheetY : window.innerHeight}px)`,
      transition: sheetY ? 'none' : 'transform 0.34s cubic-bezier(0.32,0.72,0,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 0 2px'
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
      padding: '10px 18px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 19,
      color: COLORS.ink,
      flex: 1,
      minWidth: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, stop.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      background: COLORS.softer,
      borderRadius: 12,
      padding: 3,
      gap: 2,
      flexShrink: 0
    }
  }, [{
    v: 'hotspot',
    label: '핫플'
  }, {
    v: 'food',
    label: '음식점'
  }].map(({
    v,
    label
  }) => /*#__PURE__*/React.createElement("button", {
    key: v,
    onClick: () => setTab(v),
    style: {
      padding: '7px 13px',
      border: 'none',
      borderRadius: 9,
      cursor: 'pointer',
      background: tab === v ? COLORS.card : 'transparent',
      fontFamily: SANS,
      fontSize: 12,
      fontWeight: 600,
      color: tab === v ? COLORS.ink : COLORS.mute,
      boxShadow: tab === v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
    }
  }, label)))), loading && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, "\uC8FC\uBCC0 \uC7A5\uC18C\uB97C \uCC3E\uB294 \uC911..."), !loading && currentData.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, "\uC8FC\uBCC0\uC5D0 ", tab === 'hotspot' ? '핫플이' : '음식점이', " \uC5C6\uC5B4\uC694"), !loading && currentData.length > 0 && /*#__PURE__*/React.createElement("div", null, currentData.map(renderItem))));
}

// ─── Stop sheet (unchanged except pulls editing from open) ─
function StopSheet({
  open,
  dayHue,
  onClose,
  onSave,
  cityBias
}) {
  if (!open) return null;
  const [editing, setEditing] = React.useState(!!open.editing);
  const [draft, setDraft] = React.useState(open.stop);
  const committed = React.useRef(open.stop);
  const [sheetY, setSheetY] = React.useState(0);
  const [entered, setEntered] = React.useState(false);
  const sheetRef = React.useRef(null);
  const sheetYRef = React.useRef(0);
  const dragRef = React.useRef({
    active: false,
    startY: 0,
    startScrollTop: 0
  });
  const scrollBeforeKbRef = React.useRef(null);
  React.useEffect(() => {
    setDraft(open.stop);
    committed.current = open.stop;
    setSheetY(0);
    sheetYRef.current = 0;
    setEditing(!!open.editing);
    setEntered(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, [open]);

  // 배경 스크롤 차단
  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // 시트 전체 드래그로 닫기 (passive:false 로 preventDefault 가능하게)
  React.useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const onStart = e => {
      dragRef.current = {
        active: true,
        startY: e.touches[0].clientY,
        startScrollTop: el.scrollTop
      };
    };
    const onMove = e => {
      if (!dragRef.current.active) return;
      const {
        startY,
        startScrollTop
      } = dragRef.current;
      const dy = e.touches[0].clientY - startY;
      if (startScrollTop > 8 || dy <= 0) {
        dragRef.current.active = false;
        return;
      }
      e.preventDefault();
      const newY = Math.max(0, dy);
      sheetYRef.current = newY;
      setSheetY(newY);
    };
    const onEnd = () => {
      dragRef.current.active = false;
      const topPos = sheetRef.current ? sheetRef.current.getBoundingClientRect().top : 0;
      if (topPos > window.innerHeight / 2) {
        onClose();
      } else {
        sheetYRef.current = 0;
        setSheetY(0);
      }
    };
    el.addEventListener('touchstart', onStart, {
      passive: true
    });
    el.addEventListener('touchmove', onMove, {
      passive: false
    });
    el.addEventListener('touchend', onEnd, {
      passive: true
    });
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
        if (scrollBeforeKbRef.current === null) scrollBeforeKbRef.current = sheetRef.current.scrollTop;
        const el = document.activeElement;
        if (!el || el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') return;
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
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      background: `rgba(0,0,0,${Math.max(0, 0.35 - sheetY / 400)})`
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `translateY(${entered ? sheetY : window.innerHeight}px)`,
      transition: sheetY ? 'none' : 'transform 0.34s cubic-bezier(0.32,0.72,0,1)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: sheetRef,
    onClick: e => e.stopPropagation(),
    style: {
      background: COLORS.bg,
      borderRadius: '22px 22px 0 0',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
      maxHeight: 'calc(100dvh - env(safe-area-inset-top, 44px))',
      overflowY: 'auto',
      overflowX: 'hidden'
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
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    hue: dayHue,
    label: (draft.en || '').toUpperCase(),
    height: 180
  }), !editing && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
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
    setDraft: setDraft,
    cityBias: cityBias
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
    value: draft.time + (draft.duration ? ` · ${draft.duration}` : '')
  }, draft.note && {
    icon: 'book',
    label: '메모',
    value: draft.note
  }].filter(Boolean).map((r, i, arr) => /*#__PURE__*/React.createElement("div", {
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
      borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.line}` : 'none'
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
  }, r.value)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: 'flex',
      gap: 8
    }
  }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onSave(draft);
      committed.current = draft;
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
    onClick: () => {
      if (open.hotelOnly) {
        onClose();
      } else {
        setDraft(committed.current);
        setEditing(false);
      }
    },
    style: {
      width: 80,
      background: COLORS.card,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 12,
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink
    }
  }, "\uCDE8\uC18C")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => window.open(mapsDirectionsUrl(searchQuery), '_blank'),
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
    onClick: () => window.open(mapsSearchUrl(searchQuery), '_blank'),
    style: {
      width: 60,
      background: COLORS.card,
      border: `1px solid ${COLORS.line}`,
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
  }))))))));
}

// ─── Hotel Sheet (bottom sheet for add / view / edit hotel) ──
function HotelSheet({
  open,
  onClose,
  hotel,
  trip,
  tripDays,
  onSave,
  onDelete
}) {
  if (!open) return null;
  const isNew = !hotel;
  const blank = {
    name: '',
    area: '',
    address: '',
    checkin: '',
    checkinTime: '15:00',
    checkout: '',
    checkoutTime: '12:00',
    nights: '',
    price: '',
    phone: '',
    confirmation: '',
    note: '',
    hue: 30
  };
  const [editing, setEditing] = React.useState(isNew);
  const [draft, setDraft] = React.useState(hotel ? {
    ...hotel
  } : blank);
  const committed = React.useRef(draft);
  const [sheetY, setSheetY] = React.useState(0);
  const [entered, setEntered] = React.useState(false);
  const sheetRef = React.useRef(null);
  const sheetYRef = React.useRef(0);
  const dragRef = React.useRef({
    active: false,
    startY: 0,
    startScrollTop: 0
  });
  const scrollBeforeKbRef = React.useRef(null);
  const [searchQ, setSearchQ] = React.useState('');
  const [searchRes, setSearchRes] = React.useState([]);
  const [showSearch, setShowSearch] = React.useState(false);
  const [timePicker, setTimePicker] = React.useState(null);
  const searchTimer = React.useRef(null);
  const searchFocused = React.useRef(false);
  React.useEffect(() => {
    const d = hotel ? {
      ...hotel
    } : blank;
    setDraft(d);
    committed.current = d;
    setEditing(isNew);
    setSheetY(0);
    sheetYRef.current = 0;
    setEntered(false);
    setSearchQ('');
    setSearchRes([]);
    setShowSearch(false);
    setTimePicker(null);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, [open]);
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  React.useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const onStart = e => {
      dragRef.current = {
        active: true,
        startY: e.touches[0].clientY,
        startScrollTop: el.scrollTop
      };
    };
    const onMove = e => {
      if (!dragRef.current.active) return;
      const {
        startY,
        startScrollTop
      } = dragRef.current;
      const dy = e.touches[0].clientY - startY;
      if (startScrollTop > 8 || dy <= 0) {
        dragRef.current.active = false;
        return;
      }
      e.preventDefault();
      sheetYRef.current = Math.max(0, dy);
      setSheetY(sheetYRef.current);
    };
    const onEnd = () => {
      dragRef.current.active = false;
      const top = sheetRef.current ? sheetRef.current.getBoundingClientRect().top : 0;
      if (top > window.innerHeight / 2) onClose();else {
        sheetYRef.current = 0;
        setSheetY(0);
      }
    };
    el.addEventListener('touchstart', onStart, {
      passive: true
    });
    el.addEventListener('touchmove', onMove, {
      passive: false
    });
    el.addEventListener('touchend', onEnd, {
      passive: true
    });
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
        if (scrollBeforeKbRef.current === null) scrollBeforeKbRef.current = sheetRef.current.scrollTop;
        const el = document.activeElement;
        if (!el || el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') return;
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
    if (diff > 0) setDraft(prev => ({
      ...prev,
      nights: String(diff)
    }));
  }, [draft.checkin, draft.checkout]);
  React.useEffect(() => {
    clearTimeout(searchTimer.current);
    if (!searchQ.trim()) {
      setSearchRes([]);
      setShowSearch(false);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      try {
        const j = await (await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQ)}&limit=8&lang=en&osm_tag=tourism:hotel`)).json();
        const feats = j?.features || [];
        setSearchRes(feats);
        if (feats.length && searchFocused.current) setShowSearch(true);
      } catch (_) {}
    }, 350);
  }, [searchQ]);
  const save = () => {
    onSave(draft);
    committed.current = {
      ...draft
    };
    setEditing(false);
  };
  const hue = draft.hue || 25;
  const dayOptions = (tripDays || []).map(d => d.date).filter(Boolean);
  const field = (key, label, placeholder = '') => /*#__PURE__*/React.createElement("div", {
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
  }, label), /*#__PURE__*/React.createElement("input", {
    value: draft[key] || '',
    onChange: e => setDraft({
      ...draft,
      [key]: e.target.value
    }),
    placeholder: placeholder,
    style: {
      width: '100%',
      padding: '9px 11px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
      background: COLORS.bg,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink,
      boxSizing: 'border-box'
    }
  }));
  const dateField = (key, label) => /*#__PURE__*/React.createElement("div", {
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
  }, label), dayOptions.length > 0 ? /*#__PURE__*/React.createElement("select", {
    value: draft[key] || '',
    onChange: e => setDraft({
      ...draft,
      [key]: e.target.value
    }),
    style: {
      width: '100%',
      padding: '9px 11px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
      background: COLORS.bg,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\uB0A0\uC9DC \uC120\uD0DD"), dayOptions.map(d => /*#__PURE__*/React.createElement("option", {
    key: d,
    value: d
  }, d))) : /*#__PURE__*/React.createElement("input", {
    value: draft[key] || '',
    onChange: e => setDraft({
      ...draft,
      [key]: e.target.value
    }),
    placeholder: "May 4",
    style: {
      width: '100%',
      padding: '9px 11px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
      background: COLORS.bg,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink,
      boxSizing: 'border-box'
    }
  }));
  const rows = [draft.area && {
    icon: 'pin',
    label: '지역',
    value: draft.area
  }, (draft.checkin || draft.checkout) && {
    icon: 'clock',
    label: '일정',
    value: `${draft.checkin || '—'} 체크인  →  ${draft.checkout || '—'} 체크아웃`
  }, (draft.checkinTime || draft.checkoutTime) && {
    icon: 'clock',
    label: '시간',
    value: `체크인 ${draft.checkinTime || '15:00'}  ·  체크아웃 ${draft.checkoutTime || '12:00'}`
  }, draft.nights && {
    icon: 'hotel',
    label: '박수',
    value: `${draft.nights}박`
  }, draft.address && {
    icon: 'map',
    label: '주소',
    value: draft.address
  }, draft.phone && {
    icon: 'phone',
    label: '전화',
    value: draft.phone
  }, draft.price && {
    icon: 'wallet',
    label: '요금',
    value: draft.price
  }, draft.confirmation && {
    icon: 'book',
    label: '예약번호',
    value: draft.confirmation
  }, draft.note && {
    icon: 'book',
    label: '메모',
    value: draft.note
  }].filter(Boolean);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      background: `rgba(0,0,0,${Math.max(0, 0.35 - sheetY / 400)})`
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `translateY(${entered ? sheetY : window.innerHeight}px)`,
      transition: sheetY ? 'none' : 'transform 0.34s cubic-bezier(0.32,0.72,0,1)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: sheetRef,
    onClick: e => e.stopPropagation(),
    style: {
      background: COLORS.bg,
      borderRadius: '22px 22px 0 0',
      paddingBottom: 40,
      maxHeight: '92%',
      overflowY: 'auto',
      overflowX: 'hidden'
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
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    hue: hue,
    label: (draft.name || '').toUpperCase().slice(0, 20),
    height: 160
  }), !editing && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
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
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.accent,
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    }
  }, "HOTEL", draft.nights ? ` · ${draft.nights}박` : ''), !editing && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: SERIF,
      fontSize: 28,
      lineHeight: 1.12,
      color: COLORS.ink
    }
  }, draft.name || '새 숙소'), !editing && draft.area && /*#__PURE__*/React.createElement("div", {
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
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "\u2605 ", draft.rating))), editing ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
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
  }, "\uC219\uC18C \uC774\uB984"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: searchQ !== '' ? searchQ : draft.name || '',
    onChange: e => {
      const v = e.target.value;
      setSearchQ(v);
      setDraft({
        ...draft,
        name: v
      });
    },
    onFocus: () => {
      searchFocused.current = true;
      if (searchRes.length) setShowSearch(true);
    },
    onBlur: () => {
      searchFocused.current = false;
      setTimeout(() => setShowSearch(false), 150);
    },
    placeholder: "\uC219\uC18C \uAC80\uC0C9...",
    style: {
      width: '100%',
      padding: '9px 36px 9px 11px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
      background: COLORS.bg,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink,
      boxSizing: 'border-box'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 13,
    color: COLORS.mute,
    stroke: 2
  }))), showSearch && searchRes.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      right: 0,
      zIndex: 50,
      background: COLORS.bg,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
    }
  }, searchRes.map((f, i) => {
    const p = f.properties;
    const hName = p.name || '';
    const city = p.city || p.county || p.state || '';
    const addr = [p.street, p.housenumber].filter(Boolean).join(' ');
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onMouseDown: e => e.preventDefault(),
      onClick: () => {
        setDraft({
          ...draft,
          name: hName,
          area: city,
          address: addr || hName,
          phone: p.phone || ''
        });
        setSearchQ('');
        setSearchRes([]);
        setShowSearch(false);
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '9px 12px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        borderBottom: i < searchRes.length - 1 ? `1px solid ${COLORS.line}` : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 13,
        color: COLORS.ink,
        fontWeight: 500
      }
    }, hName), city && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 11.5,
        color: COLORS.mute,
        marginTop: 1
      }
    }, [addr, city].filter(Boolean).join(', ')));
  }))), /*#__PURE__*/React.createElement("div", {
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
  }, dateField('checkin', '체크인 날짜'), dateField('checkout', '체크아웃 날짜')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      marginBottom: 10
    }
  }, ['checkin', 'checkout'].map(k => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginBottom: 4
    }
  }, k === 'checkin' ? '체크인 시간' : '체크아웃 시간'), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTimePicker(k),
    style: {
      width: '100%',
      padding: '9px 11px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
      background: COLORS.bg,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink,
      cursor: 'pointer',
      textAlign: 'left',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", null, draft[k === 'checkin' ? 'checkinTime' : 'checkoutTime'] || (k === 'checkin' ? '15:00' : '12:00')), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-d",
    size: 12,
    color: COLORS.mute,
    stroke: 2
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginBottom: 4
    }
  }, "\uBC15\uC218"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '9px 11px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
      background: COLORS.bg,
      fontFamily: SANS,
      fontSize: 13,
      color: draft.nights ? COLORS.ink : COLORS.mute
    }
  }, draft.nights ? `${draft.nights}박` : '날짜 선택 후 자동')), field('price', '요금')), field('phone', '전화'), field('confirmation', '예약번호'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
    onChange: e => setDraft({
      ...draft,
      note: e.target.value
    }),
    rows: 3,
    style: {
      width: '100%',
      padding: '9px 11px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
      background: COLORS.bg,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink,
      boxSizing: 'border-box',
      resize: 'none'
    }
  })))) : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'column'
    }
  }, rows.map((r, i, arr) => /*#__PURE__*/React.createElement("div", {
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
      borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.line}` : 'none'
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
  }, r.value))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: 'flex',
      gap: 8
    }
  }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: save,
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
  }), " \uC800\uC7A5"), !isNew && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDraft({
        ...committed.current
      });
      setEditing(false);
    },
    style: {
      width: 80,
      background: COLORS.card,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 12,
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink
    }
  }, "\uCDE8\uC18C")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => window.open(mapsSearchUrl([draft.name, draft.area].filter(Boolean).join(' ')), '_blank'),
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
  }), " \uC9C0\uB3C4"), /*#__PURE__*/React.createElement("button", {
    onClick: onDelete,
    style: {
      width: 60,
      background: COLORS.card,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 12,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash",
    size: 16,
    color: COLORS.accent,
    stroke: 1.8
  })))))), timePicker && /*#__PURE__*/React.createElement("div", {
    onClick: () => setTimePicker(null),
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.3)',
      zIndex: 10,
      display: 'flex',
      alignItems: 'flex-end',
      borderRadius: '22px 22px 0 0',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      background: COLORS.bg,
      borderRadius: '18px 18px 0 0',
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 0 4px'
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
      padding: '4px 20px 10px',
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.mute,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, timePicker === 'checkin' ? '체크인 시간' : '체크아웃 시간'), (timePicker === 'checkin' ? ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'] : ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00']).map(t => {
    const k = timePicker === 'checkin' ? 'checkinTime' : 'checkoutTime';
    const sel = draft[k] === t;
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: () => {
        setDraft({
          ...draft,
          [k]: t
        });
        setTimePicker(null);
      },
      style: {
        display: 'flex',
        width: '100%',
        padding: '13px 20px',
        border: 'none',
        background: sel ? `${COLORS.ink}0f` : 'transparent',
        fontFamily: SANS,
        fontSize: 15,
        color: COLORS.ink,
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${COLORS.line}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: sel ? 600 : 400
      }
    }, t), sel && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14,
      color: COLORS.accent,
      stroke: 2.5
    }));
  })))));
}
function LocationField({
  value,
  onChange,
  cityBias
}) {
  const [query, setQuery] = React.useState(value || '');
  const [results, setResults] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const timer = React.useRef(null);
  const focusedRef = React.useRef(false);
  React.useEffect(() => {
    setQuery(value || '');
  }, [value]);
  const doSearch = async q => {
    if (!q.trim()) {
      setResults([]);
      setShow(false);
      return;
    }
    try {
      const [bLat, bLon] = cityBias || [];
      const bias = bLat ? `&lat=${bLat}&lon=${bLon}` : '';
      const j = await (await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=en${bias}`)).json();
      const feats = j?.features || [];
      setResults(feats);
      if (feats.length && focusedRef.current) setShow(true);
    } catch (_) {}
  };
  React.useEffect(() => {
    clearTimeout(timer.current);
    if (!query.trim()) {
      setResults([]);
      setShow(false);
      return;
    }
    timer.current = setTimeout(() => doSearch(query), 350);
  }, [query]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => {
      setQuery(e.target.value);
      onChange(e.target.value, null);
    },
    onFocus: () => {
      focusedRef.current = true;
      setFocused(true);
      if (results.length) setShow(true);
    },
    onBlur: () => {
      focusedRef.current = false;
      setFocused(false);
      setTimeout(() => setShow(false), 150);
    },
    onKeyDown: e => e.key === 'Enter' && doSearch(query),
    placeholder: "\uC704\uCE58 \uAC80\uC0C9...",
    style: {
      width: '100%',
      padding: '8px 34px 8px 10px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink,
      boxSizing: 'border-box'
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onMouseDown: e => e.preventDefault(),
    onClick: () => doSearch(query),
    style: {
      position: 'absolute',
      right: 6,
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 4,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 13,
    color: COLORS.mute,
    stroke: 2
  }))), show && results.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      right: 0,
      zIndex: 300,
      background: COLORS.bg,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
    }
  }, results.map((f, i) => {
    const p = f.properties;
    const name = p.name || p.street || query;
    const addr = [p.street, p.city || p.county].filter(Boolean).join(', ');
    const [lon, lat] = f.geometry.coordinates;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onMouseDown: e => e.preventDefault(),
      onClick: () => {
        const loc = addr ? `${name}, ${addr}` : name;
        setQuery(loc);
        setShow(false);
        onChange(loc, [lat, lon]);
      },
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        width: '100%',
        padding: '9px 12px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        borderBottom: i < results.length - 1 ? `1px solid ${COLORS.line}` : 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 13,
      color: COLORS.accent,
      stroke: 1.8
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
    }, name), addr && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 11,
        color: COLORS.mute,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, addr)));
  })));
}
function EditStopForm({
  draft,
  setDraft,
  cityBias
}) {
  const [showHotelSearch, setShowHotelSearch] = React.useState(false);
  const [timeOpen, setTimeOpen] = React.useState(false);
  const field = (key, label, type = 'text') => /*#__PURE__*/React.createElement("label", {
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
    onChange: e => setDraft({
      ...draft,
      [key]: e.target.value
    }),
    rows: 3,
    style: {
      width: '100%',
      padding: '8px 10px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink,
      boxSizing: 'border-box',
      resize: 'vertical'
    }
  }) : type === 'select' ? /*#__PURE__*/React.createElement("select", {
    value: draft[key] || 'sight',
    onChange: e => setDraft({
      ...draft,
      [key]: e.target.value
    }),
    style: {
      width: '100%',
      padding: '8px 10px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink,
      boxSizing: 'border-box'
    }
  }, Object.entries(CAT_META).map(([k, v]) => /*#__PURE__*/React.createElement("option", {
    key: k,
    value: k
  }, v.label))) : /*#__PURE__*/React.createElement("input", {
    value: draft[key] || '',
    onChange: e => setDraft({
      ...draft,
      [key]: e.target.value
    }),
    style: {
      width: '100%',
      padding: '8px 10px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink,
      boxSizing: 'border-box'
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, field('title', '제목'), field('en', '영문명'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("label", {
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
  }, "\uC2DC\uAC04"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setTimeOpen(true),
    style: {
      width: '100%',
      padding: '8px 10px',
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
      background: COLORS.card,
      fontFamily: MONO,
      fontSize: 14,
      color: COLORS.ink,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, draft.time || '09:00')), field('cat', '카테고리', 'select')), /*#__PURE__*/React.createElement(TimeWheelSheet, {
    open: timeOpen,
    value: draft.time || '09:00',
    onClose: () => setTimeOpen(false),
    onPick: v => {
      setDraft({
        ...draft,
        time: v
      });
      setTimeOpen(false);
    }
  }), draft.cat === 'hotel' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowHotelSearch(true),
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
  }), "\uD638\uD154 \uAC80\uC0C9\uD574\uC11C \uCC44\uC6B0\uAE30"), /*#__PURE__*/React.createElement("label", {
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
  }, "\uC704\uCE58"), /*#__PURE__*/React.createElement(LocationField, {
    value: draft.loc || '',
    cityBias: cityBias,
    onChange: (loc, coords) => setDraft({
      ...draft,
      loc,
      ...(coords ? {
        coords
      } : {})
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, field('price', '가격')), field('note', '메모', 'textarea'), showHotelSearch && /*#__PURE__*/React.createElement(HotelSearchSheet, {
    COLORS: COLORS,
    SERIF: SERIF,
    SANS: SANS,
    MONO: MONO,
    Icon: Icon,
    onPick: result => {
      if (typeof result === 'string') {
        const m = result.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
        setDraft({
          ...draft,
          title: m ? m[1] : result,
          en: m ? m[1] : result,
          loc: m ? m[2] : ''
        });
      } else {
        // Gmail 스캔 결과 객체
        setDraft({
          ...draft,
          title: result.name,
          en: result.name,
          loc: result.area || '',
          note: [result.confirmation ? `예약번호: ${result.confirmation}` : '', result.source || ''].filter(Boolean).join(' · ')
        });
      }
    },
    onClose: () => setShowHotelSearch(false)
  }));
}

// ─── Geocoding cache ─────────────────────────────────────────
const GEO_CACHE = {};

// ─── Place search sheet ───────────────────────────────────────
function PlaceSearchSheet({
  open,
  item,
  cityBias,
  onClose,
  onPick
}) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const timerRef = React.useRef(null);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);
  React.useEffect(() => {
    clearTimeout(timerRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const [bLat, bLon] = cityBias || [];
        const bias = bLat ? `&lat=${bLat}&lon=${bLon}` : '';
        const j = await (await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lang=en${bias}`)).json();
        setResults(j?.features || []);
      } catch (_) {
        setResults([]);
      }
      setLoading(false);
    }, 350);
  }, [query]);
  const formatAddr = props => {
    const parts = [props.street, props.city || props.county, props.country].filter(Boolean);
    return parts.join(', ');
  };
  return /*#__PURE__*/React.createElement(BottomSheet, {
    open: open,
    onClose: onClose,
    title: "\uC7A5\uC18C \uAC80\uC0C9"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 16px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: COLORS.softer,
      borderRadius: 12,
      padding: '10px 14px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15,
    color: COLORS.mute,
    stroke: 2
  }), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "\uC7A5\uC18C \uC774\uB984\uC73C\uB85C \uAC80\uC0C9...",
    style: {
      flex: 1,
      border: 'none',
      background: 'transparent',
      outline: 'none',
      fontFamily: SANS,
      fontSize: 14,
      color: COLORS.ink
    }
  }), query ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setQuery(''),
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 13,
    color: COLORS.mute,
    stroke: 2
  })) : null)), loading && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '16px 0',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, "\uAC80\uC0C9 \uC911..."), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 8px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, results.map((f, i) => {
    const p = f.properties;
    const name = p.name || p.street || query;
    const addr = formatAddr(p);
    const [lon, lat] = f.geometry.coordinates;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => onPick({
        name,
        addr,
        coords: [lat, lon]
      }),
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: '10px 10px',
        borderRadius: 10,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 2,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 14,
      color: COLORS.accent,
      stroke: 1.8
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: 500,
        color: COLORS.ink,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, name), addr ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 11,
        color: COLORS.mute,
        marginTop: 2,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, addr) : null));
  }), !loading && query && results.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '20px 0',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, "\uACB0\uACFC \uC5C6\uC74C")));
}

// ─── Map ─────────────────────────────────────────────────────
function MapScreen({
  trip,
  onEditItem
}) {
  const makeOrdered = dayIdx => trip.days[dayIdx].items.map((it, ii) => ({
    ...it,
    _origIdx: ii
  })).filter(it => it.loc);
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
    if (a.type === 'DAY') return {
      selDay: a.v,
      ordered: makeOrdered(a.v)
    };
    if (a.type === 'REORDER') {
      const o = [...s.ordered];
      o.splice(a.to, 0, o.splice(a.from, 1)[0]);
      return {
        ...s,
        ordered: o
      };
    }
    if (a.type === 'UPDATE_ITEM') {
      const o = [...s.ordered];
      o[a.idx] = {
        ...o[a.idx],
        ...a.patch
      };
      return {
        ...s,
        ordered: o
      };
    }
    return s;
  }, null, () => {
    const i = getTodayDayIdx();
    return {
      selDay: i,
      ordered: makeOrdered(i)
    };
  });
  const {
    selDay,
    ordered
  } = state;
  const day = trip.days[selDay];
  const {
    itemProps
  } = useDragReorder((from, to) => dispatch({
    type: 'REORDER',
    from,
    to
  }), true);
  const [openStop, setOpenStop] = React.useState(null);
  const [travelTimes, setTravelTimes] = React.useState({});
  const [routeTip, setRouteTip] = React.useState(null);
  const fmtMin = m => m >= 60 ? `${Math.floor(m / 60)}시간${m % 60 ? ` ${m % 60}분` : ''}` : `${m}분`;
  const computeRouteTip = (pts, times) => {
    if (pts.length < 2) return null;
    const toMin = t => {
      const m = (t || '').match(/^(\d{1,2}):(\d{2})/);
      return m ? +m[1] * 60 + +m[2] : null;
    };
    const dist2 = (a, b) => {
      const dl = a.pos[0] - b.pos[0],
        dn = a.pos[1] - b.pos[1];
      return dl * dl + dn * dn;
    };

    // 앵커 식별: 숙소 / 점심 / 저녁
    const hotel = pts.find(p => p.cat === 'hotel') || null;
    const foods = pts.filter(p => p.cat === 'food');
    // 점심: 시간이 있으면 10:00~15:00, 없으면 첫 번째 food
    const lunch = foods.find(p => {
      const m = toMin(p.time);
      return m && m >= 600 && m <= 900;
    }) || foods[0] || null;
    // 저녁: 시간이 있으면 17:00 이후, 없으면 두 번째 food
    const dinner = foods.find(p => {
      const m = toMin(p.time);
      return m && m >= 1020;
    }) || (foods.length > 1 ? foods[foods.length - 1] : null);
    const dinnerIsLunch = dinner && lunch && dinner === lunch;

    // nearest-neighbor: 숙소가 있으면 숙소부터 출발
    const startIdx = hotel ? pts.indexOf(hotel) : 0;
    const n = pts.length;
    const visited = Array(n).fill(false);
    const order = [startIdx];
    visited[startIdx] = true;
    for (let step = 1; step < n; step++) {
      let best = -1,
        bestD = Infinity;
      const last = order[order.length - 1];
      for (let j = 0; j < n; j++) {
        if (!visited[j]) {
          const d = dist2(pts[last], pts[j]);
          if (d < bestD) {
            bestD = d;
            best = j;
          }
        }
      }
      visited[best] = true;
      order.push(best);
    }
    const isOptimal = order.every((v, i) => v === i);
    const totalTransit = Object.values(times).reduce((s, t) => s + (t.transit || 0), 0);
    const longestLeg = Object.entries(times).sort((a, b) => (b[1].transit || 0) - (a[1].transit || 0))[0];

    // 숙소 귀환 여부: 숙소가 있고 마지막 아이템이 숙소가 아닌 경우
    const returnsToHotel = hotel ? pts[pts.length - 1].cat === 'hotel' : null;
    return {
      pts,
      order,
      isOptimal,
      totalTransit,
      longestLeg,
      times,
      hotel,
      lunch,
      dinner: dinnerIsLunch ? null : dinner,
      returnsToHotel
    };
  };
  const city = trip.title || 'New York';
  const CITY_BIAS_MAP = {
    'new york': [40.758, -73.985],
    'paris': [48.856, 2.352],
    'london': [51.507, -0.127],
    'tokyo': [35.690, 139.692],
    'seoul': [37.563, 126.997],
    'los angeles': [34.052, -118.244]
  };
  const cityBias = CITY_BIAS_MAP[city.toLowerCase()];
  const mapDiv = React.useRef(null);
  const mapInst = React.useRef(null);
  const layers = React.useRef([]);
  React.useEffect(() => {
    setTravelTimes({});
    setRouteTip(null);
  }, [selDay]);

  // 날짜 바뀌면 지도 재초기화
  React.useEffect(() => {
    if (!window.L || !mapDiv.current) return;
    if (mapInst.current) {
      mapInst.current.remove();
      mapInst.current = null;
    }
    layers.current = [];
    const map = window.L.map(mapDiv.current, {
      zoomControl: true,
      attributionControl: false
    });
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);
    map.setView([40.7128, -74.006], 12);
    mapInst.current = map;
    return () => {
      if (mapInst.current) {
        mapInst.current.remove();
        mapInst.current = null;
      }
    };
  }, [selDay]);

  // 순서 바뀌면 마커·루트만 업데이트
  const mapKey = ordered.map(s => `${s.title}|${s.coords ? s.coords.join(',') : ''}`).join('~');
  React.useEffect(() => {
    if (!window.L) return;
    setRouteTip(null);
    let cancelled = false;
    (async () => {
      // 이전 레이어 제거
      layers.current.forEach(l => {
        try {
          l.remove();
        } catch (_) {}
      });
      layers.current = [];
      if (!ordered.length || !mapInst.current) return;
      const [bLat, bLon] = cityBias || [];
      const bias = bLat ? `&lat=${bLat}&lon=${bLon}` : '';
      const geocode = async query => {
        if (GEO_CACHE[query]) return GEO_CACHE[query];
        try {
          const j = await (await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1&lang=en${bias}`)).json();
          const f = j?.features?.[0];
          if (f) {
            const [lon, lat] = f.geometry.coordinates;
            GEO_CACHE[query] = [lat, lon];
            return GEO_CACHE[query];
          }
        } catch (_) {}
        return null;
      };
      const delay = ms => new Promise(r => setTimeout(r, ms));
      const pts = [];
      for (let si = 0; si < ordered.length; si++) {
        if (cancelled) return;
        const s = ordered[si];
        let pos = s.coords || null;
        if (!pos) {
          const queries = [s.loc ? `${s.title}, ${s.loc}, ${city}` : null, `${s.title}, ${city}`, s.title].filter((q, i, a) => q && a.indexOf(q) === i);
          for (const q of queries) {
            if (cancelled) return;
            pos = await geocode(q);
            if (pos) break;
            await delay(80);
          }
        }
        if (pos) {
          pts.push({
            pos,
            title: s.title,
            cat: s.cat || '',
            time: s.time || ''
          });
          if (!cancelled && mapInst.current) {
            const num = pts.length;
            const m = window.L.marker(pos, {
              icon: window.L.divIcon({
                className: '',
                html: `<div style="width:26px;height:26px;border-radius:50%;background:#C14F2E;color:#fff;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:11px;font-weight:700;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)">${num}</div>`,
                iconSize: [26, 26],
                iconAnchor: [13, 13]
              })
            }).addTo(mapInst.current).bindPopup(`<b>${s.title}</b>`);
            layers.current.push(m);
          }
        }
        if (si < ordered.length - 1) await delay(120);
      }
      if (cancelled || !mapInst.current || !pts.length) return;
      if (pts.length > 1) {
        try {
          const coords = pts.map(p => `${p.pos[1]},${p.pos[0]}`).join(';');
          const rd = await (await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)).json();
          if (!cancelled && rd.routes?.[0]) {
            const route = window.L.geoJSON(rd.routes[0].geometry, {
              style: {
                color: '#C14F2E',
                weight: 3.5,
                opacity: 0.85
              }
            }).addTo(mapInst.current);
            layers.current.push(route);
            const times = {};
            (rd.routes[0].legs || []).forEach((leg, li) => {
              times[li + 1] = {
                transit: Math.max(1, Math.round(leg.duration / 60)),
                walk: Math.max(1, Math.round(leg.distance / 83.33))
              };
            });
            if (!cancelled) {
              setTravelTimes(times);
              setRouteTip(computeRouteTip(pts, times));
            }
          }
        } catch (_) {
          const line = window.L.polyline(pts.map(p => p.pos), {
            color: '#C14F2E',
            weight: 3,
            opacity: 0.7,
            dashArray: '8 5'
          }).addTo(mapInst.current);
          layers.current.push(line);
          if (!cancelled) setRouteTip(computeRouteTip(pts, {}));
        }
      }
      if (!cancelled && mapInst.current) mapInst.current.fitBounds(window.L.latLngBounds(pts.map(p => p.pos)), {
        padding: [40, 40]
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [selDay, mapKey]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      minHeight: '100vh',
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
  }, "Route.")), /*#__PURE__*/React.createElement("div", {
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
  }, trip.days.map((d, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => dispatch({
      type: 'DAY',
      v: i
    }),
    style: {
      border: 'none',
      borderRadius: 14,
      padding: '8px 14px',
      cursor: 'pointer',
      background: i === selDay ? COLORS.ink : COLORS.card,
      color: i === selDay ? COLORS.bg : COLORS.ink,
      fontFamily: MONO,
      fontSize: 11,
      letterSpacing: '0.08em'
    }
  }, "D", String(d.n).padStart(2, '0'))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: mapDiv,
    style: {
      borderRadius: 18,
      overflow: 'hidden',
      border: `1px solid ${COLORS.line}`,
      height: 340,
      background: COLORS.softer
    }
  })), /*#__PURE__*/React.createElement("div", {
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
      gap: 0
    }
  }, ordered.flatMap((it, i) => {
    const p = itemProps(i);
    const card = /*#__PURE__*/React.createElement("div", _extends({
      key: it.title + i
    }, p, {
      style: {
        ...p.style,
        background: p.style?.background || COLORS.card,
        borderRadius: 12,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 6
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpenStop({
        idx: it._origIdx,
        stop: it,
        editing: false
      }),
      style: {
        flex: 1,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        padding: '11px 0 11px 14px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 22,
        height: 22,
        borderRadius: 11,
        flexShrink: 0,
        background: COLORS.accent,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: MONO,
        fontSize: 10,
        fontWeight: 700
      }
    }, i + 1), /*#__PURE__*/React.createElement("div", {
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
    }, it.loc))), /*#__PURE__*/React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        window.open(mapsDirectionsUrl(`${it.title} ${it.loc} ${city}`), '_blank');
      },
      style: {
        padding: '11px 14px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "nav",
      size: 16,
      color: COLORS.accent,
      stroke: 1.8
    })));
    const connector = travelTimes[i] ? /*#__PURE__*/React.createElement("div", {
      key: `tt-${i}`,
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        padding: '3px 0 9px',
        fontFamily: MONO,
        fontSize: 9.5,
        color: COLORS.mute,
        letterSpacing: '0.06em'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: COLORS.line,
        marginLeft: 16
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 4,
        alignItems: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bus",
      size: 12,
      stroke: 1.8
    }), fmtMin(travelTimes[i].transit)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.line
      }
    }, "\xB7"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 4,
        alignItems: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "walk",
      size: 12,
      stroke: 1.8
    }), fmtMin(travelTimes[i].walk)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: COLORS.line,
        marginRight: 16
      }
    })) : null;
    return connector ? [connector, card] : [card];
  })), routeTip && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px 6px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 16,
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, "\uD83D\uDCA1"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.accent,
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    }
  }, "Route Tip"), routeTip.totalTransit > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.mute
    }
  }, "\uCD1D \uC774\uB3D9 ", fmtMin(routeTip.totalTransit))), (routeTip.hotel || routeTip.lunch || routeTip.dinner) && /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      borderRadius: 10,
      padding: '10px 12px',
      marginBottom: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 7
    }
  }, routeTip.hotel && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "hotel",
    size: 13,
    color: COLORS.mute,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      width: 28
    }
  }, "\uC219\uC18C"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 12.5,
      color: COLORS.ink,
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, routeTip.hotel.title)), routeTip.lunch && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "food",
    size: 13,
    color: COLORS.mute,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      width: 28
    }
  }, "\uC810\uC2EC"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 12.5,
      color: COLORS.ink,
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, routeTip.lunch.title), routeTip.lunch.time && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.mute,
      flexShrink: 0
    }
  }, routeTip.lunch.time)), routeTip.dinner && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "food",
    size: 13,
    color: COLORS.mute,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      width: 28
    }
  }, "\uC800\uB141"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 12.5,
      color: COLORS.ink,
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, routeTip.dinner.title), routeTip.dinner.time && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: COLORS.mute,
      flexShrink: 0
    }
  }, routeTip.dinner.time))), routeTip.isOptimal ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, "\uD83C\uDF89"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 13,
      fontWeight: 600,
      color: COLORS.ink
    }
  }, "\uC644\uBCBD\uD55C \uB3D9\uC120\uC774\uC5D0\uC694!")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute,
      lineHeight: 1.6
    }
  }, routeTip.hotel ? `${routeTip.hotel.title}을 기점으로 이동 거리를 최소화한 최적 순서입니다.` : '이동 거리를 최소화한 최적의 순서입니다.')) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.ink,
      marginBottom: 6,
      lineHeight: 1.55
    }
  }, routeTip.hotel ? `${routeTip.hotel.title}을 기점으로 경유지 순서를 조정하면 더 효율적이에요.` : '방문 순서를 조정하면 이동 거리를 줄일 수 있어요.'), /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      borderRadius: 10,
      padding: '10px 12px',
      fontFamily: MONO,
      fontSize: 11,
      color: COLORS.ink,
      lineHeight: 1.8,
      wordBreak: 'break-word'
    }
  }, routeTip.order.map((idx, i) => {
    const p = routeTip.pts[idx];
    const isAnchor = p.cat === 'hotel' || p.cat === 'food';
    return /*#__PURE__*/React.createElement("span", {
      key: idx
    }, i > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.mute
      }
    }, " \u2192 "), /*#__PURE__*/React.createElement("span", {
      style: {
        color: isAnchor ? COLORS.accent : COLORS.ink,
        fontWeight: isAnchor ? 600 : 400
      }
    }, p.title));
  }))), routeTip.hotel && routeTip.returnsToHotel === false && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      paddingTop: 10,
      borderTop: `1px solid ${COLORS.line}`,
      display: 'flex',
      gap: 7,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      flexShrink: 0
    }
  }, "\uD83C\uDFE8"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 12.5,
      color: COLORS.mute,
      lineHeight: 1.55
    }
  }, "\uB9C8\uC9C0\uB9C9\uC5D0", ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLORS.ink,
      fontWeight: 500
    }
  }, routeTip.hotel.title), "\uB85C \uB3CC\uC544\uC624\uB294 \uACBD\uB85C\uB97C \uD655\uC778\uD558\uC138\uC694.")), routeTip.longestLeg && (() => {
    const legIdx = parseInt(routeTip.longestLeg[0]) - 1;
    const from = routeTip.pts[legIdx],
      to = routeTip.pts[legIdx + 1];
    if (!from || !to) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        paddingTop: 10,
        borderTop: `1px solid ${COLORS.line}`,
        fontFamily: SANS,
        fontSize: 12,
        color: COLORS.mute,
        lineHeight: 1.55
      }
    }, "\uAC00\uC7A5 \uAE34 \uAD6C\uAC04", ' ', /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.ink,
        fontWeight: 500
      }
    }, from.title), ' → ', /*#__PURE__*/React.createElement("span", {
      style: {
        color: COLORS.ink,
        fontWeight: 500
      }
    }, to.title), ` · 약 ${fmtMin(routeTip.longestLeg[1].transit)}`);
  })())), /*#__PURE__*/React.createElement(StopSheet, {
    open: openStop,
    dayHue: day?.hero?.hue ?? 25,
    cityBias: cityBias,
    onClose: () => setOpenStop(null),
    onSave: draft => {
      const orderedIdx = ordered.findIndex(o => o._origIdx === openStop.idx);
      if (orderedIdx >= 0) dispatch({
        type: 'UPDATE_ITEM',
        idx: orderedIdx,
        patch: draft
      });
      if (onEditItem) onEditItem(selDay, openStop.idx, draft);
      setOpenStop(null);
    }
  }));
}

// ─── Food ───────────────────────────────────────────────────
function FoodCatItems({
  catItems,
  allFood,
  onEditFood,
  editing
}) {
  const reorder = (from, to) => {
    const globalFrom = catItems[from].idx;
    const globalTo = catItems[to].idx;
    const newFood = [...allFood];
    newFood.splice(globalTo, 0, newFood.splice(globalFrom, 1)[0]);
    onEditFood(newFood);
  };
  const delFood = globalIdx => onEditFood(allFood.filter((_, i) => i !== globalIdx));
  const updateFood = (globalIdx, patch) => {
    const list = [...allFood];
    list[globalIdx] = {
      ...list[globalIdx],
      ...patch
    };
    onEditFood(list);
  };
  const {
    itemProps,
    isTouchDragging
  } = useDragReorder(reorder, true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, catItems.map((f, i) => {
    const dp = itemProps(i);
    return /*#__PURE__*/React.createElement("div", {
      key: f.idx,
      ref: dp.ref,
      onTouchStart: dp.onTouchStart,
      onTouchMove: dp.onTouchMove,
      onTouchEnd: dp.onTouchEnd,
      style: {
        position: 'relative',
        ...(dp.style || {})
      }
    }, /*#__PURE__*/React.createElement(SwipeableRow, {
      onEdit: () => {},
      onDelete: () => delFood(f.idx),
      isDragging: isTouchDragging,
      wrapStyle: {
        borderBottom: i < catItems.length - 1 ? `1px solid ${COLORS.line}` : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 14px',
        position: 'relative'
      }
    }, editing ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        paddingRight: 32
      }
    }, /*#__PURE__*/React.createElement("input", {
      value: f.name,
      onChange: e => updateFood(f.idx, {
        name: e.target.value
      }),
      placeholder: "\uB9DB\uC9D1 \uC774\uB984",
      style: {
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontFamily: SANS,
        fontSize: 14,
        fontWeight: 500,
        color: COLORS.ink,
        padding: 0,
        width: '100%'
      }
    }), /*#__PURE__*/React.createElement("input", {
      value: f.detail || '',
      onChange: e => updateFood(f.idx, {
        detail: e.target.value
      }),
      placeholder: "\uC0C1\uC138 \uC124\uBA85",
      style: {
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontFamily: SANS,
        fontSize: 12,
        color: COLORS.mute,
        padding: 0,
        width: '100%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("input", {
      value: f.price || '',
      onChange: e => updateFood(f.idx, {
        price: e.target.value
      }),
      placeholder: "\uAC00\uACA9",
      style: {
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontFamily: MONO,
        fontSize: 11,
        color: COLORS.accent,
        padding: 0,
        width: 60
      }
    }), /*#__PURE__*/React.createElement("input", {
      value: f.note || '',
      onChange: e => updateFood(f.idx, {
        note: e.target.value
      }),
      placeholder: "\uBA54\uBAA8",
      style: {
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontFamily: SANS,
        fontSize: 11,
        color: COLORS.mute,
        padding: 0,
        flex: 1
      }
    }))) : /*#__PURE__*/React.createElement("button", {
      onClick: () => window.open(mapsSearchUrl(f.name), '_blank'),
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
    }, f.price)), f.detail && /*#__PURE__*/React.createElement("div", {
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
    }, "\u2014 ", f.note)), editing && /*#__PURE__*/React.createElement("button", {
      onClick: () => delFood(f.idx),
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
    })))), dp['data-drag-over'] && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        border: `2px dashed rgba(193,79,46,0.45)`,
        pointerEvents: 'none',
        background: 'rgba(193,79,46,0.04)'
      }
    }));
  }));
}
function FoodScreen({
  trip,
  onEditFood,
  editing,
  setEditing
}) {
  const [query, setQuery] = React.useState('');
  const [newCatInput, setNewCatInput] = React.useState(false);
  const [newCatName, setNewCatName] = React.useState('');
  const [addSelCat, setAddSelCat] = React.useState(null); // which cat is showing inline add

  const allFood = trip.food || [];
  const cats = [...new Set(allFood.map(f => f.cat).filter(Boolean))];
  const qLow = query.toLowerCase();
  const matchesQuery = f => !query || (f.name || '').toLowerCase().includes(qLow) || (f.detail || '').toLowerCase().includes(qLow) || (f.note || '').toLowerCase().includes(qLow);

  // Group: if searching, flat list; otherwise by category
  const grouped = {};
  allFood.forEach((f, idx) => {
    if (!matchesQuery(f)) return;
    const key = f.cat || '기타';
    (grouped[key] = grouped[key] || []).push({
      ...f,
      idx
    });
  });
  const groupEntries = Object.entries(grouped);
  const totalFiltered = groupEntries.reduce((s, [, items]) => s + items.length, 0);
  const addFood = cat => {
    onEditFood([...allFood, {
      cat,
      name: '새 맛집',
      detail: '',
      price: '',
      note: ''
    }]);
    setAddSelCat(null);
  };
  const delFood = idx => {
    if (!confirm('이 맛집을 삭제할까요?')) return;
    onEditFood(allFood.filter((_, i) => i !== idx));
  };
  const updateFood = (idx, patch) => {
    const list = [...allFood];
    list[idx] = {
      ...list[idx],
      ...patch
    };
    onEditFood(list);
  };
  const renameCat = (oldCat, newCat) => {
    if (!newCat.trim() || newCat === oldCat) return;
    onEditFood(allFood.map(f => f.cat === oldCat ? {
      ...f,
      cat: newCat
    } : f));
  };
  const deleteCat = cat => {
    if (!confirm(`"${cat}" 카테고리와 모든 맛집을 삭제할까요?`)) return;
    onEditFood(allFood.filter(f => f.cat !== cat));
  };
  const addCategory = () => {
    const name = newCatName.trim();
    if (!name) return;
    addFood(name);
    setNewCatName('');
    setNewCatInput(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      minHeight: '100vh',
      paddingBottom: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
      paddingLeft: 24,
      paddingRight: 24,
      paddingBottom: 12
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
  }, "Eat List.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 16px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14,
    color: COLORS.mute,
    stroke: 2,
    style: {
      position: 'absolute',
      left: 28,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "\uB9DB\uC9D1 \uAC80\uC0C9...",
    style: {
      width: '100%',
      boxSizing: 'border-box',
      paddingLeft: 36,
      paddingRight: 12,
      paddingTop: 9,
      paddingBottom: 9,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 12,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 13.5,
      color: COLORS.ink,
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, groupEntries.map(([cat, items]) => /*#__PURE__*/React.createElement("div", {
    key: cat
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
      paddingLeft: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 10.5,
      color: COLORS.mute,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      flex: 1
    }
  }, cat), editing && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const n = prompt('카테고리 이름 변경:', cat);
      if (n) renameCat(cat, n);
    },
    style: {
      padding: '3px 8px',
      border: `1px solid ${COLORS.line}`,
      borderRadius: 8,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 11,
      color: COLORS.mute
    }
  }, "\uC774\uB984 \uBCC0\uACBD"), /*#__PURE__*/React.createElement("button", {
    onClick: () => deleteCat(cat),
    style: {
      width: 24,
      height: 24,
      borderRadius: 12,
      border: 'none',
      background: 'rgba(193,79,46,0.10)',
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
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 14,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(FoodCatItems, {
    catItems: items,
    allFood: allFood,
    onEditFood: onEditFood,
    editing: editing
  }), addSelCat === cat ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 14px',
      borderTop: `1px solid ${COLORS.line}`
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => addFood(cat),
    style: {
      flex: 1,
      padding: '8px 0',
      border: 'none',
      borderRadius: 10,
      background: COLORS.accent,
      color: '#fff',
      fontFamily: SANS,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "\uCD94\uAC00"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddSelCat(null),
    style: {
      padding: '8px 12px',
      border: 'none',
      borderRadius: 10,
      background: COLORS.softer,
      color: COLORS.mute,
      fontFamily: SANS,
      fontSize: 13,
      cursor: 'pointer'
    }
  }, "\uCDE8\uC18C")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddSelCat(cat),
    style: {
      width: '100%',
      padding: '10px 14px',
      background: 'transparent',
      border: 'none',
      borderTop: `1px solid ${COLORS.line}`,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
      color: COLORS.mute,
      fontFamily: SANS,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 13,
    color: COLORS.mute,
    stroke: 2
  }), " \uB9DB\uC9D1 \uCD94\uAC00")))), totalFiltered === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '32px 0',
      textAlign: 'center',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, query ? '검색 결과가 없어요' : cats.length === 0 ? '카테고리를 만들어 맛집을 추가해 보세요' : '맛집을 추가해 보세요'), newCatInput ? /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      addCategory();
    },
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: newCatName,
    onChange: e => setNewCatName(e.target.value),
    placeholder: "\uCE74\uD14C\uACE0\uB9AC \uC774\uB984",
    style: {
      flex: 1,
      padding: '11px 14px',
      border: `1px solid ${COLORS.line}`,
      borderRadius: 12,
      fontFamily: SANS,
      fontSize: 13.5,
      background: COLORS.card,
      color: COLORS.ink,
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    style: {
      padding: '11px 16px',
      border: 'none',
      borderRadius: 12,
      background: COLORS.ink,
      color: '#fff',
      fontFamily: SANS,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "\uCD94\uAC00"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setNewCatInput(false);
      setNewCatName('');
    },
    style: {
      padding: '11px 12px',
      border: 'none',
      borderRadius: 12,
      background: COLORS.softer,
      color: COLORS.mute,
      fontFamily: SANS,
      fontSize: 13,
      cursor: 'pointer'
    }
  }, "\uCDE8\uC18C")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setNewCatInput(true),
    style: {
      width: '100%',
      padding: '12px 16px',
      border: `1.5px dashed ${COLORS.line}`,
      borderRadius: 14,
      background: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      color: COLORS.mute,
      fontFamily: SANS,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    color: COLORS.mute,
    stroke: 2
  }), " \uCE74\uD14C\uACE0\uB9AC \uCD94\uAC00")));
}

// ─── Prep (editable lists with categories) ────────────────────
function normalizePrepCats(raw) {
  if (raw?.cats) return raw;
  const result = [];
  if (raw?.checklist?.length) result.push({
    id: 'cat_checklist',
    name: '체크리스트',
    items: raw.checklist
  });
  if (raw?.docs?.length) result.push({
    id: 'cat_docs',
    name: '입국 서류',
    items: raw.docs
  });
  if (raw?.pack?.length) result.push({
    id: 'cat_pack',
    name: '챙길 물건',
    items: raw.pack
  });
  if (!result.length) result.push({
    id: 'cat_1',
    name: '체크리스트',
    items: []
  });
  return {
    cats: result
  };
}
function PrepCatItems({
  ci,
  cat,
  cats,
  save,
  editing,
  editingItem,
  setEditingItem
}) {
  const reorder = (from, to) => {
    const next = cats.map((c, i) => {
      if (i !== ci) return c;
      const items = [...c.items];
      items.splice(to, 0, items.splice(from, 1)[0]);
      return {
        ...c,
        items
      };
    });
    save(next);
  };
  const {
    itemProps,
    isTouchDragging
  } = useDragReorder(reorder, true);
  const deleteItem = ii => {
    const next = cats.map((c, i) => i !== ci ? c : {
      ...c,
      items: c.items.filter((_, j) => j !== ii)
    });
    save(next);
  };
  const updateItem = (ii, val) => {
    const next = cats.map((c, i) => i !== ci ? c : {
      ...c,
      items: c.items.map((x, j) => j === ii ? val : x)
    });
    save(next);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, (cat.items || []).map((item, ii) => {
    const isEditingThis = editingItem?.ci === ci && editingItem?.ii === ii;
    const dp = itemProps(ii);
    return /*#__PURE__*/React.createElement("div", {
      key: ii,
      ref: dp.ref,
      onTouchStart: dp.onTouchStart,
      onTouchMove: dp.onTouchMove,
      onTouchEnd: dp.onTouchEnd,
      style: {
        position: 'relative',
        ...(dp.style || {})
      }
    }, /*#__PURE__*/React.createElement(SwipeableRow, {
      onEdit: () => setEditingItem({
        ci,
        ii
      }),
      onDelete: () => deleteItem(ii),
      isDragging: isTouchDragging,
      wrapStyle: {
        borderBottom: ii < cat.items.length - 1 ? `1px solid ${COLORS.line}` : 'none',
        borderTopLeftRadius: ii === 0 ? 14 : 0,
        borderTopRightRadius: ii === 0 ? 14 : 0,
        borderBottomLeftRadius: ii === cat.items.length - 1 ? 14 : 0,
        borderBottomRightRadius: ii === cat.items.length - 1 ? 14 : 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: COLORS.card
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 16,
        height: 16,
        borderRadius: 8,
        border: `1.5px solid ${COLORS.line}`,
        flexShrink: 0
      }
    }), editing || isEditingThis ? /*#__PURE__*/React.createElement("input", {
      autoFocus: isEditingThis,
      value: item,
      onChange: e => updateItem(ii, e.target.value),
      onBlur: () => {
        if (isEditingThis) setEditingItem(null);
      },
      onKeyDown: e => {
        if (e.key === 'Enter' || e.key === 'Escape') setEditingItem(null);
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
    }, item), editing && !isEditingThis && /*#__PURE__*/React.createElement("button", {
      onClick: () => deleteItem(ii),
      style: {
        width: 22,
        height: 22,
        borderRadius: 11,
        border: 'none',
        background: 'rgba(193,79,46,0.12)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 11,
      color: COLORS.accent,
      stroke: 2
    })))), dp['data-drag-over'] && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        border: `2px dashed rgba(193,79,46,0.45)`,
        borderRadius: 0,
        pointerEvents: 'none',
        background: 'rgba(193,79,46,0.04)'
      }
    }));
  }));
}
function PrepScreen({
  trip,
  prep: prepProp,
  onEditPrep,
  editing,
  setEditing
}) {
  const rawPrep = prepProp || trip.prep || {};
  const prep = normalizePrepCats(rawPrep);
  const cats = prep.cats || [];
  const [renamingCat, setRenamingCat] = React.useState(null);
  const [addInputCat, setAddInputCat] = React.useState(null);
  const [addInputText, setAddInputText] = React.useState('');
  const [editingItem, setEditingItem] = React.useState(null); // { ci, ii }

  const save = newCats => onEditPrep({
    ...prep,
    cats: newCats
  });
  const addCat = () => {
    const id = 'cat_' + Date.now();
    const newCats = [...cats, {
      id,
      name: '새 카테고리',
      items: []
    }];
    save(newCats);
    setTimeout(() => setRenamingCat(newCats.length - 1), 50);
  };
  const deleteCat = i => {
    if (!confirm(`"${cats[i].name}" 카테고리를 삭제할까요?`)) return;
    const next = cats.filter((_, j) => j !== i);
    if (!next.length) next.push({
      id: 'cat_1',
      name: '체크리스트',
      items: []
    });
    save(next);
  };
  const renameCat = (i, name) => {
    const next = [...cats];
    next[i] = {
      ...next[i],
      name
    };
    save(next);
  };
  const addItem = ci => {
    if (!addInputText.trim()) return;
    const next = [...cats];
    next[ci] = {
      ...next[ci],
      items: [...(next[ci].items || []), addInputText.trim()]
    };
    save(next);
    setAddInputText('');
    setAddInputCat(null);
  };
  const updateItem = (ci, ii, val) => {
    const next = [...cats];
    const items = [...next[ci].items];
    items[ii] = val;
    next[ci] = {
      ...next[ci],
      items
    };
    save(next);
  };
  const deleteItem = (ci, ii) => {
    const next = [...cats];
    next[ci] = {
      ...next[ci],
      items: next[ci].items.filter((_, j) => j !== ii)
    };
    save(next);
  };

  // D-day
  const tripYear = extractTripYear(trip);
  const firstDate = trip.days[0]?.date || '';
  const lastDate = trip.days[trip.days.length - 1]?.date || '';
  const parseDate = s => {
    if (!s) return null;
    const iso = dayDateToIso(s, tripYear);
    return iso ? new Date(iso + 'T12:00:00') : null;
  };
  const depDate = parseDate(firstDate);
  const retDate = parseDate(lastDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let ddayLabel = '',
    ddayColor = COLORS.ink;
  if (depDate) {
    depDate.setHours(0, 0, 0, 0);
    if (retDate) retDate.setHours(0, 0, 0, 0);
    const diff = Math.round((depDate - today) / 86400000);
    if (diff > 0) {
      ddayLabel = `D-${diff}`;
      ddayColor = COLORS.accent;
    } else if (retDate && today <= retDate) {
      ddayLabel = '여행 중 ✈️';
      ddayColor = '#2E7D32';
    } else {
      ddayLabel = `D+${Math.abs(diff)}`;
      ddayColor = COLORS.mute;
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      minHeight: '100vh',
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
  }, "Pack & Go.")), depDate && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 16,
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
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
  }, firstDate, lastDate && lastDate !== firstDate ? ` – ${lastDate}` : ''), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      color: COLORS.mute,
      marginTop: 3
    }
  }, trip.days.length, "\uC77C")), /*#__PURE__*/React.createElement("div", {
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
  }, ddayLabel)))), cats.map((cat, ci) => /*#__PURE__*/React.createElement("div", {
    key: cat.id,
    style: {
      padding: '0 16px',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
      paddingLeft: 2
    }
  }, editing && renamingCat === ci ? /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: cat.name,
    onChange: e => renameCat(ci, e.target.value),
    onBlur: () => setRenamingCat(null),
    onKeyDown: e => e.key === 'Enter' && setRenamingCat(null),
    style: {
      flex: 1,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 8,
      padding: '4px 8px',
      fontFamily: MONO,
      fontSize: 10.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      background: COLORS.card,
      color: COLORS.ink,
      outline: 'none'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: MONO,
      fontSize: 10.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: COLORS.mute
    }
  }, cat.name), editing && renamingCat !== ci && /*#__PURE__*/React.createElement("button", {
    onClick: () => setRenamingCat(ci),
    style: {
      width: 22,
      height: 22,
      borderRadius: 11,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 12,
    color: COLORS.mute,
    stroke: 2
  })), editing && /*#__PURE__*/React.createElement("button", {
    onClick: () => deleteCat(ci),
    style: {
      width: 22,
      height: 22,
      borderRadius: 11,
      border: 'none',
      background: 'rgba(193,79,46,0.10)',
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
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 14
    }
  }, (cat.items || []).length === 0 && addInputCat !== ci && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, "\uD56D\uBAA9\uC774 \uC5C6\uC5B4\uC694"), /*#__PURE__*/React.createElement(PrepCatItems, {
    ci: ci,
    cat: cat,
    cats: cats,
    save: save,
    editing: editing,
    editingItem: editingItem,
    setEditingItem: setEditingItem
  }), addInputCat === ci ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 14px',
      borderTop: cat.items?.length ? `1px solid ${COLORS.line}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 16,
      height: 16,
      borderRadius: 8,
      border: `1.5px solid ${COLORS.line}`,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: addInputText,
    onChange: e => setAddInputText(e.target.value),
    placeholder: "\uD56D\uBAA9 \uC785\uB825...",
    onKeyDown: e => {
      if (e.key === 'Enter') addItem(ci);
      if (e.key === 'Escape') {
        setAddInputCat(null);
        setAddInputText('');
      }
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
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => addItem(ci),
    style: {
      padding: '4px 10px',
      border: 'none',
      borderRadius: 8,
      background: COLORS.accent,
      color: '#fff',
      fontFamily: SANS,
      fontSize: 12,
      cursor: 'pointer'
    }
  }, "\uCD94\uAC00")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setAddInputCat(ci);
      setAddInputText('');
    },
    style: {
      width: '100%',
      padding: '10px 14px',
      background: 'transparent',
      border: 'none',
      borderTop: cat.items?.length ? `1px solid ${COLORS.line}` : 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
      color: COLORS.mute,
      fontFamily: SANS,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 13,
    color: COLORS.mute,
    stroke: 2
  }), " \uD56D\uBAA9 \uCD94\uAC00")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 20px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: addCat,
    style: {
      width: '100%',
      padding: '12px 16px',
      border: `1.5px dashed ${COLORS.line}`,
      borderRadius: 14,
      background: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      color: COLORS.mute,
      fontFamily: SANS,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    color: COLORS.mute,
    stroke: 2
  }), " \uCE74\uD14C\uACE0\uB9AC \uCD94\uAC00")));
}

// ─── Budget Screen ─────────────────────────────────────────
const BUDGET_OUT_CATS_DEFAULT = ['교통', '숙박', '식비', '쇼핑', '관광', '기타'];
const BUDGET_IN_CATS_DEFAULT = ['환전', '지원금', '기타'];

// 원화 환산 환율 (대략적 기준)
const KRW_RATES = {
  KRW: 1,
  USD: 1350,
  EUR: 1480,
  JPY: 9.2,
  CNY: 188,
  HKD: 173,
  TWD: 43,
  SGD: 1010,
  THB: 38,
  VND: 0.055,
  PHP: 23,
  IDR: 0.088,
  MYR: 308,
  INR: 16,
  AUD: 890,
  NZD: 820,
  GBP: 1720,
  CHF: 1530,
  SEK: 128,
  NOK: 122,
  DKK: 198,
  CAD: 1000,
  MXN: 73,
  BRL: 272,
  AED: 368,
  SAR: 360,
  TRY: 42,
  CZK: 62,
  HUF: 3.7,
  PLN: 345
};
const CURRENCY_SYMBOL = {
  KRW: '₩',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  CNY: '¥',
  HKD: 'HK$',
  TWD: 'NT$',
  SGD: 'S$',
  THB: '฿',
  VND: '₫',
  PHP: '₱',
  IDR: 'Rp',
  MYR: 'RM',
  INR: '₹',
  AUD: 'A$',
  NZD: 'NZ$',
  GBP: '£',
  CHF: 'Fr',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  CAD: 'C$',
  MXN: '$',
  BRL: 'R$',
  AED: 'AED',
  SAR: 'SAR',
  TRY: '₺',
  CZK: 'Kč',
  HUF: 'Ft',
  PLN: 'zł'
};
const toKrw = (amt, cur) => amt * (KRW_RATES[cur] || 1);
const fmtAmt = (n, cur) => {
  const sym = CURRENCY_SYMBOL[cur] || cur;
  return sym + n.toLocaleString('ko-KR', {
    maximumFractionDigits: cur === 'KRW' ? 0 : 2
  });
};
function BudgetCalcSheet({
  open,
  onClose,
  onEnter
}) {
  const [display, setDisplay] = React.useState('0');
  const [prevVal, setPrevVal] = React.useState(null);
  const [op, setOp] = React.useState(null);
  const [waitNew, setWaitNew] = React.useState(false);
  const [entered, setEntered] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    setDisplay('0');
    setPrevVal(null);
    setOp(null);
    setWaitNew(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, [open]);
  if (!open) return null;
  const compute = (a, b, o) => {
    if (o === '+') return a + b;
    if (o === '−') return a - b;
    if (o === '×') return a * b;
    if (o === '÷') return b !== 0 ? a / b : 0;
    return b;
  };
  const pressDigit = d => {
    if (waitNew) {
      setDisplay(d === '.' ? '0.' : d);
      setWaitNew(false);
      return;
    }
    if (d === '.' && display.includes('.')) return;
    setDisplay(display === '0' && d !== '.' ? d : display + d);
  };
  const pressOp = newOp => {
    const cur = parseFloat(display) || 0;
    if (prevVal !== null && !waitNew) {
      const r = compute(prevVal, cur, op);
      setDisplay(String(Math.round(r * 100) / 100));
      setPrevVal(r);
    } else {
      setPrevVal(cur);
    }
    setOp(newOp);
    setWaitNew(true);
  };
  const pressEqual = () => {
    const cur = parseFloat(display) || 0;
    if (prevVal !== null && op) {
      const r = compute(prevVal, cur, op);
      setDisplay(String(Math.round(r * 100) / 100));
    }
    setPrevVal(null);
    setOp(null);
    setWaitNew(true);
  };
  const pressClear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOp(null);
    setWaitNew(false);
  };
  const pressBack = () => {
    if (waitNew || display.length <= 1) {
      setDisplay('0');
      setWaitNew(false);
    } else setDisplay(display.slice(0, -1) || '0');
  };
  const displayNum = parseFloat(display) || 0;
  const fmtDisp = display.includes('.') ? display : Number(display).toLocaleString('ko-KR');
  const KS = (bg, color, extra = {}) => ({
    flex: 1,
    padding: '17px 0',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    fontFamily: MONO,
    fontSize: 20,
    fontWeight: 600,
    background: bg,
    color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...extra
  });
  const isOp = o => op === o;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 310,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      background: 'rgba(0,0,0,0.4)'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: COLORS.bg,
      borderRadius: '22px 22px 0 0',
      paddingBottom: 'env(safe-area-inset-bottom,0px)',
      transform: `translateY(${entered ? 0 : window.innerHeight}px)`,
      transition: 'transform 0.34s cubic-bezier(0.32,0.72,0,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 0 4px'
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
      padding: '8px 20px 14px',
      textAlign: 'right',
      minHeight: 64
    }
  }, op && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 16,
      color: COLORS.mute,
      marginRight: 8
    }
  }, op), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SERIF,
      fontSize: 44,
      color: COLORS.ink,
      letterSpacing: '-0.02em'
    }
  }, fmtDisp)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: pressClear,
    style: KS(COLORS.softer, COLORS.mute)
  }, "C"), /*#__PURE__*/React.createElement("button", {
    onClick: pressBack,
    style: KS(COLORS.softer, COLORS.mute)
  }, "\u232B"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDisplay(String(Math.round((parseFloat(display) || 0) / 100 * 100) / 100));
      setWaitNew(true);
    },
    style: KS(COLORS.softer, COLORS.mute)
  }, "%"), /*#__PURE__*/React.createElement("button", {
    onClick: () => pressOp('÷'),
    style: KS(isOp('÷') ? COLORS.accent : 'rgba(193,79,46,0.12)', isOp('÷') ? '#fff' : COLORS.accent)
  }, "\xF7")), [['7', '8', '9', '×'], ['4', '5', '6', '−'], ['1', '2', '3', '+']].map(row => /*#__PURE__*/React.createElement("div", {
    key: row[0],
    style: {
      display: 'flex',
      gap: 8
    }
  }, row.slice(0, 3).map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => pressDigit(d),
    style: KS(COLORS.card, COLORS.ink)
  }, d)), /*#__PURE__*/React.createElement("button", {
    onClick: () => pressOp(row[3]),
    style: KS(isOp(row[3]) ? COLORS.accent : 'rgba(193,79,46,0.12)', isOp(row[3]) ? '#fff' : COLORS.accent)
  }, row[3]))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => pressDigit('0'),
    style: KS(COLORS.card, COLORS.ink, {
      flex: 2
    })
  }, "0"), /*#__PURE__*/React.createElement("button", {
    onClick: () => pressDigit('.'),
    style: KS(COLORS.card, COLORS.ink)
  }, "."), /*#__PURE__*/React.createElement("button", {
    onClick: pressEqual,
    style: KS(COLORS.accent, '#fff')
  }, "="))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px 16px',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onEnter('in', displayNum);
      onClose();
    },
    style: {
      flex: 1,
      padding: '14px 0',
      border: `1px solid ${COLORS.line}`,
      borderRadius: 14,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 13,
      fontWeight: 600,
      color: COLORS.ink,
      cursor: 'pointer'
    }
  }, "\uC218\uC785\uC73C\uB85C \uC785\uB825"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onEnter('out', displayNum);
      onClose();
    },
    style: {
      flex: 1,
      padding: '14px 0',
      border: 'none',
      borderRadius: 14,
      background: COLORS.accent,
      fontFamily: SANS,
      fontSize: 13,
      fontWeight: 600,
      color: '#fff',
      cursor: 'pointer'
    }
  }, "\uC9C0\uCD9C\uB85C \uC785\uB825"))));
}
function SplitSheet({
  open,
  onClose,
  totalKrw,
  defaultN,
  onEnter
}) {
  const [n, setN] = React.useState(String(defaultN));
  const [entered, setEntered] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    setN(String(defaultN));
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, [open, defaultN]);
  if (!open) return null;
  const count = Math.max(1, parseInt(n) || 1);
  const perPerson = Math.round(totalKrw / count);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 310,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      background: 'rgba(0,0,0,0.4)'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: COLORS.bg,
      borderRadius: '22px 22px 0 0',
      padding: '0 16px',
      paddingBottom: 'calc(20px + env(safe-area-inset-bottom,0px))',
      transform: `translateY(${entered ? 0 : window.innerHeight}px)`,
      transition: 'transform 0.34s cubic-bezier(0.32,0.72,0,1)'
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
      fontFamily: SERIF,
      fontSize: 20,
      color: COLORS.ink,
      padding: '6px 4px 14px'
    }
  }, "1/N \uBD84\uD560"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 14,
      padding: '14px 16px',
      marginBottom: 12
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
  }, "\uACF5\uB3D9 \uC9C0\uCD9C \uCD1D\uC561 (\u20A9 \uD658\uC0B0)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 26,
      color: COLORS.ink
    }
  }, fmtAmt(totalKrw, 'KRW'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: COLORS.card,
      borderRadius: 14,
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 8
    }
  }, "\uC778\uC6D0 \uC218"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(String(Math.max(1, count - 1))),
    style: {
      width: 30,
      height: 30,
      borderRadius: 15,
      border: `1px solid ${COLORS.line}`,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 18,
      color: COLORS.ink,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "\u2212"), /*#__PURE__*/React.createElement("input", {
    value: n,
    onChange: e => setN(e.target.value.replace(/[^0-9]/g, '')),
    style: {
      width: 36,
      textAlign: 'center',
      border: 'none',
      outline: 'none',
      fontFamily: MONO,
      fontSize: 22,
      fontWeight: 700,
      color: COLORS.ink,
      background: 'transparent'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(String(count + 1)),
    style: {
      width: 30,
      height: 30,
      borderRadius: 15,
      border: `1px solid ${COLORS.line}`,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 18,
      color: COLORS.ink,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "+"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 22,
      color: COLORS.mute
    }
  }, "="), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1.3,
      background: COLORS.ink,
      borderRadius: 14,
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: 'rgba(255,255,255,0.5)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 4
    }
  }, "1\uC778\uB2F9"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 22,
      color: '#fff',
      letterSpacing: '-0.01em'
    }
  }, fmtAmt(perPerson, 'KRW')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onEnter('in', perPerson);
      onClose();
    },
    style: {
      flex: 1,
      padding: '14px 0',
      border: `1px solid ${COLORS.line}`,
      borderRadius: 14,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 13,
      fontWeight: 600,
      color: COLORS.ink,
      cursor: 'pointer'
    }
  }, "\uC218\uC785\uC73C\uB85C \uC785\uB825"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onEnter('out', perPerson);
      onClose();
    },
    style: {
      flex: 1,
      padding: '14px 0',
      border: 'none',
      borderRadius: 14,
      background: COLORS.accent,
      fontFamily: SANS,
      fontSize: 13,
      fontWeight: 600,
      color: '#fff',
      cursor: 'pointer'
    }
  }, "\uC9C0\uCD9C\uB85C \uC785\uB825"))));
}
function BudgetScreen({
  trip,
  onEditBudget,
  onSheetChange
}) {
  const budget = trip.budget || {};
  const entries = budget.entries || [];
  const outCats = budget.outCats || BUDGET_OUT_CATS_DEFAULT;
  const inCats = budget.inCats || BUDGET_IN_CATS_DEFAULT;
  const [addOpen, setAddOpen] = React.useState(false);
  const [editIdx, setEditIdx] = React.useState(null);
  const [delConfirm, setDelConfirm] = React.useState(false);
  const [form, setForm] = React.useState({
    type: 'out',
    amount: '',
    cat: '식비',
    note: '',
    date: ''
  });
  const [addingCat, setAddingCat] = React.useState(false);
  const [newCatVal, setNewCatVal] = React.useState('');
  const [calcOpen, setCalcOpen] = React.useState(false);
  const [splitOpen, setSplitOpen] = React.useState(false);
  const sheetTouchY = React.useRef(null);
  React.useEffect(() => {
    onSheetChange?.(addOpen || editIdx !== null);
  }, [addOpen, editIdx]);

  // KRW 환산 합계 (총 금액 표시용)
  const krwTotalOut = entries.filter(e => e.type === 'out').reduce((s, e) => s + toKrw(e.amount, e.currency || 'KRW'), 0);
  const krwTotalIn = entries.filter(e => e.type === 'in').reduce((s, e) => s + toKrw(e.amount, e.currency || 'KRW'), 0);

  // 통화별 수입/지출 원액
  const byCurrency = {};
  entries.forEach(e => {
    const cur = e.currency || 'KRW';
    if (!byCurrency[cur]) byCurrency[cur] = {
      out: 0,
      inc: 0
    };
    if (e.type === 'out') byCurrency[cur].out += e.amount;else byCurrency[cur].inc += e.amount;
  });

  // 공동/개인 KRW 합계 (지출/수입 각각)
  const hasShared = entries.some(e => (e.scope || 'personal') === 'shared');
  const krwSharedOut = entries.filter(e => e.type === 'out' && (e.scope || 'personal') === 'shared').reduce((s, e) => s + toKrw(e.amount, e.currency || 'KRW'), 0);
  const krwPersonalOut = entries.filter(e => e.type === 'out' && (e.scope || 'personal') === 'personal').reduce((s, e) => s + toKrw(e.amount, e.currency || 'KRW'), 0);
  const krwSharedIn = entries.filter(e => e.type === 'in' && (e.scope || 'personal') === 'shared').reduce((s, e) => s + toKrw(e.amount, e.currency || 'KRW'), 0);
  const krwPersonalIn = entries.filter(e => e.type === 'in' && (e.scope || 'personal') === 'personal').reduce((s, e) => s + toKrw(e.amount, e.currency || 'KRW'), 0);
  const currentCats = form.type === 'out' ? outCats : inCats;
  const openAdd = type => {
    const cats = type === 'out' ? outCats : inCats;
    setForm({
      type,
      amount: '',
      cat: cats[0] || '',
      note: '',
      date: '',
      currency: 'KRW',
      scope: 'personal'
    });
    setEditIdx(null);
    setDelConfirm(false);
    setAddingCat(false);
    setNewCatVal('');
    setAddOpen(true);
  };
  const openAddWithAmount = (type, amount) => {
    const cats = type === 'out' ? outCats : inCats;
    setForm({
      type,
      amount: String(Math.round(amount)),
      cat: cats[0] || '',
      note: '',
      date: '',
      currency: 'KRW',
      scope: 'personal'
    });
    setEditIdx(null);
    setDelConfirm(false);
    setAddingCat(false);
    setNewCatVal('');
    setAddOpen(true);
  };
  const openEdit = idx => {
    const e = entries[idx];
    setForm({
      type: e.type,
      amount: String(e.amount),
      cat: e.cat,
      note: e.note || '',
      date: e.date || '',
      currency: e.currency || 'KRW',
      scope: e.scope || 'personal'
    });
    setEditIdx(idx);
    setDelConfirm(false);
    setAddingCat(false);
    setNewCatVal('');
    setAddOpen(true);
  };
  const addCustomCat = () => {
    const name = newCatVal.trim();
    if (!name) return;
    const key = form.type === 'out' ? 'outCats' : 'inCats';
    const cur = form.type === 'out' ? outCats : inCats;
    if (cur.includes(name)) {
      setForm(f => ({
        ...f,
        cat: name
      }));
      setAddingCat(false);
      setNewCatVal('');
      return;
    }
    const next = [...cur, name];
    onEditBudget({
      [key]: next
    });
    setForm(f => ({
      ...f,
      cat: name
    }));
    setAddingCat(false);
    setNewCatVal('');
  };
  const saveEntry = () => {
    const amt = parseFloat(form.amount);
    if (!amt || isNaN(amt)) return;
    const cur = form.currency || 'KRW';
    const entry = {
      id: editIdx !== null ? entries[editIdx].id : Date.now().toString(),
      type: form.type,
      amount: amt,
      cat: form.cat,
      note: form.note,
      currency: cur,
      scope: form.scope || 'shared',
      date: form.date || new Date().toISOString().slice(0, 10)
    };
    const updated = editIdx !== null ? entries.map((e, i) => i === editIdx ? entry : e) : [...entries, entry];
    onEditBudget({
      entries: updated
    });
    setAddOpen(false);
  };
  const deleteEntry = () => {
    onEditBudget({
      entries: entries.filter((_, i) => i !== editIdx)
    });
    setAddOpen(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.bg,
      minHeight: '100vh',
      paddingBottom: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
      paddingLeft: 24,
      paddingRight: 24,
      paddingBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      color: COLORS.mute,
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    }
  }, "Travel Budget"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: SERIF,
      fontSize: 38,
      color: COLORS.ink,
      letterSpacing: '-0.02em'
    }
  }, "Budget.")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 16px 14px',
      background: COLORS.ink,
      borderRadius: 20,
      padding: '22px 22px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 0
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: 'rgba(255,255,255,0.4)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 6
    }
  }, "\uCD1D \uC218\uC785"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 32,
      color: '#7EC88A',
      letterSpacing: '-0.02em',
      lineHeight: 1
    }
  }, fmtAmt(Math.round(krwTotalIn), 'KRW'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: 'rgba(255,255,255,0.4)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 6
    }
  }, "\uCD1D \uC9C0\uCD9C"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 32,
      color: '#E07B6A',
      letterSpacing: '-0.02em',
      lineHeight: 1
    }
  }, fmtAmt(Math.round(krwTotalOut), 'KRW')))), Object.keys(byCurrency).length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      paddingTop: 14,
      borderTop: '1px solid rgba(255,255,255,0.08)'
    }
  }, Object.entries(byCurrency).map(([cur, {
    out,
    inc
  }]) => /*#__PURE__*/React.createElement("div", {
    key: cur,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 0,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: 'rgba(255,255,255,0.3)',
      letterSpacing: '0.06em',
      marginBottom: 3
    }
  }, cur, " \uC218\uC785"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 14,
      color: inc > 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.18)',
      fontWeight: inc > 0 ? 600 : 400
    }
  }, inc > 0 ? fmtAmt(inc, cur) : '—')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: 'rgba(255,255,255,0.3)',
      letterSpacing: '0.06em',
      marginBottom: 3
    }
  }, cur, " \uC9C0\uCD9C"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 14,
      color: out > 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.18)',
      fontWeight: out > 0 ? 600 : 400
    }
  }, out > 0 ? fmtAmt(out, cur) : '—'))))), hasShared && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      paddingTop: 14,
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 0
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: 'rgba(255,255,255,0.4)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 10
    }
  }, "\uAC1C\uC778"), krwPersonalIn > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: 'rgba(255,255,255,0.3)',
      marginBottom: 3
    }
  }, "\uC218\uC785"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 14,
      color: 'rgba(255,255,255,0.82)',
      fontWeight: 600
    }
  }, fmtAmt(Math.round(krwPersonalIn), 'KRW'))), krwPersonalOut > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: 'rgba(255,255,255,0.3)',
      marginBottom: 3
    }
  }, "\uC9C0\uCD9C"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 14,
      color: 'rgba(255,255,255,0.82)',
      fontWeight: 600
    }
  }, fmtAmt(Math.round(krwPersonalOut), 'KRW')))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: 'rgba(255,255,255,0.4)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, "\uACF5\uB3D9"), krwSharedOut > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: () => setSplitOpen(true),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      fontSize: 15,
      lineHeight: 1,
      opacity: 0.75
    }
  }, "\u2797")), krwSharedIn > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: 'rgba(255,255,255,0.3)',
      marginBottom: 3
    }
  }, "\uC218\uC785"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 14,
      color: 'rgba(255,255,255,0.82)',
      fontWeight: 600
    }
  }, fmtAmt(Math.round(krwSharedIn), 'KRW'))), krwSharedOut > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: 'rgba(255,255,255,0.3)',
      marginBottom: 3
    }
  }, "\uC9C0\uCD9C"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 14,
      color: 'rgba(255,255,255,0.82)',
      fontWeight: 600
    }
  }, fmtAmt(Math.round(krwSharedOut), 'KRW')))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 16px',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => openAdd('in'),
    style: {
      flex: 1,
      padding: '12px 0',
      background: COLORS.card,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 14,
      fontFamily: SANS,
      fontSize: 14,
      fontWeight: 600,
      color: COLORS.ink,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    color: COLORS.ink,
    stroke: 2.5
  }), " \uC218\uC785 \uCD94\uAC00"), /*#__PURE__*/React.createElement("button", {
    onClick: () => openAdd('out'),
    style: {
      flex: 1,
      padding: '12px 0',
      background: COLORS.accent,
      border: 'none',
      borderRadius: 14,
      fontFamily: SANS,
      fontSize: 14,
      fontWeight: 600,
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "minus",
    size: 14,
    color: "#fff",
    stroke: 2.5
  }), " \uC9C0\uCD9C \uCD94\uAC00"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setCalcOpen(true),
    style: {
      width: 46,
      padding: '12px 0',
      background: COLORS.card,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 14,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calculator",
    size: 16,
    color: COLORS.ink,
    stroke: 1.8
  }))), entries.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '60px 0',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 22,
      color: COLORS.ink,
      marginBottom: 8
    }
  }, "\uC544\uC9C1 \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 13.5,
      color: COLORS.mute
    }
  }, "\uC5EC\uD589 \uC218\uC785\uACFC \uC9C0\uCD9C\uC744 \uAE30\uB85D\uD574 \uBCF4\uC138\uC694")) : (() => {
    const indexed = [...entries].map((e, i) => ({
      ...e,
      _i: i
    }));
    // 날짜별 그룹핑 (최근 날짜 위)
    const byDate = {};
    indexed.forEach(e => {
      const d = e.date || '날짜 없음';
      if (!byDate[d]) byDate[d] = [];
      byDate[d].push(e);
    });
    const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 16px'
      }
    }, sortedDates.map(date => /*#__PURE__*/React.createElement("div", {
      key: date,
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 10,
        color: COLORS.mute,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '4px 2px 8px'
      }
    }, date), /*#__PURE__*/React.createElement("div", {
      style: {
        background: COLORS.card,
        borderRadius: 14,
        overflow: 'hidden'
      }
    }, byDate[date].map((e, i) => /*#__PURE__*/React.createElement(SwipeableRow, {
      key: e.id || e._i,
      onEdit: () => openEdit(e._i),
      onDelete: () => onEditBudget({
        entries: entries.filter((_, j) => j !== e._i)
      }),
      wrapStyle: {
        borderBottom: i < byDate[date].length - 1 ? `1px solid ${COLORS.line}` : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      },
      onClick: () => openEdit(e._i)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 13,
        color: COLORS.ink,
        marginBottom: 2,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, e.cat, e.note ? ` · ${e.note}` : ''), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5
      }
    }, (e.scope || 'personal') === 'shared' && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9,
        color: '#4F6BED',
        background: 'rgba(79,107,237,0.1)',
        borderRadius: 4,
        padding: '1px 5px',
        letterSpacing: '0.05em'
      }
    }, "\uACF5\uB3D9"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9.5,
        color: COLORS.mute
      }
    }, e.type === 'in' ? '수입' : '지출'))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 14,
        fontWeight: 600,
        flexShrink: 0,
        color: e.type === 'in' ? '#3A9B4C' : '#C14F2E'
      }
    }, e.type === 'in' ? '+' : '-', fmtAmt(e.amount, e.currency || 'KRW')))))))));
  })(), addOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(0,0,0,0.38)'
    },
    onClick: () => setAddOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: COLORS.bg,
      borderRadius: '22px 22px 0 0',
      padding: '20px 18px',
      paddingBottom: 'calc(24px + env(safe-area-inset-bottom,0px))'
    },
    onClick: e => e.stopPropagation(),
    onTouchStart: e => {
      sheetTouchY.current = e.touches[0].clientY;
    },
    onTouchEnd: e => {
      if (e.changedTouches[0].clientY - (sheetTouchY.current || 0) > 80) setAddOpen(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      background: COLORS.line,
      borderRadius: 2,
      margin: '-10px auto 14px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      gap: 6,
      background: COLORS.softer,
      borderRadius: 14,
      padding: 4
    }
  }, [{
    v: 'in',
    label: '수입'
  }, {
    v: 'out',
    label: '지출'
  }].map(({
    v,
    label
  }) => /*#__PURE__*/React.createElement("button", {
    key: v,
    onClick: () => {
      const cats = v === 'out' ? outCats : inCats;
      setForm(f => ({
        ...f,
        type: v,
        cat: cats[0] || ''
      }));
    },
    style: {
      flex: 1,
      padding: '9px 0',
      border: 'none',
      borderRadius: 10,
      cursor: 'pointer',
      background: form.type === v ? COLORS.card : 'transparent',
      fontFamily: SANS,
      fontSize: 14,
      fontWeight: 600,
      color: form.type === v ? COLORS.ink : COLORS.mute
    }
  }, label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      background: COLORS.softer,
      borderRadius: 14,
      padding: 4
    }
  }, [{
    v: 'personal',
    label: '개인'
  }, {
    v: 'shared',
    label: '공동'
  }].map(({
    v,
    label
  }) => /*#__PURE__*/React.createElement("button", {
    key: v,
    onClick: () => setForm(f => ({
      ...f,
      scope: v
    })),
    style: {
      padding: '9px 12px',
      border: 'none',
      borderRadius: 10,
      cursor: 'pointer',
      background: (form.scope || 'personal') === v ? COLORS.card : 'transparent',
      fontFamily: SANS,
      fontSize: 13,
      fontWeight: 600,
      color: (form.scope || 'personal') === v ? COLORS.ink : COLORS.mute
    }
  }, label)))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    inputMode: "decimal",
    value: (() => {
      if (!form.amount) return '';
      const parts = form.amount.split('.');
      const intStr = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.length > 1 ? intStr + '.' + parts[1] : intStr;
    })(),
    onChange: e => {
      const raw = e.target.value.replace(/[^0-9.]/g, '');
      const dotCount = (raw.match(/\./g) || []).length;
      if (dotCount <= 1) setForm(f => ({
        ...f,
        amount: raw
      }));
    },
    placeholder: "\uAE08\uC561",
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '13px 16px',
      marginBottom: 12,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 12,
      background: COLORS.card,
      fontFamily: MONO,
      fontSize: 24,
      color: COLORS.ink,
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, addingCat ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: newCatVal,
    onChange: e => setNewCatVal(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') addCustomCat();
      if (e.key === 'Escape') {
        setAddingCat(false);
        setNewCatVal('');
      }
    },
    placeholder: "\uC0C8 \uD56D\uBAA9 \uC774\uB984",
    style: {
      flex: 1,
      padding: '11px 14px',
      border: `1px solid ${COLORS.line}`,
      borderRadius: 12,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 14,
      color: COLORS.ink,
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: addCustomCat,
    style: {
      padding: '11px 16px',
      border: 'none',
      borderRadius: 12,
      background: COLORS.ink,
      color: '#fff',
      fontFamily: SANS,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "\uCD94\uAC00"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setAddingCat(false);
      setNewCatVal('');
    },
    style: {
      padding: '11px 12px',
      border: 'none',
      borderRadius: 12,
      background: COLORS.softer,
      color: COLORS.mute,
      fontFamily: SANS,
      fontSize: 13,
      cursor: 'pointer'
    }
  }, "\uCDE8\uC18C")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: form.cat,
    onChange: e => setForm(f => ({
      ...f,
      cat: e.target.value
    })),
    style: {
      flex: 1,
      padding: '11px 14px',
      border: `1px solid ${COLORS.line}`,
      borderRadius: 12,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 14,
      color: COLORS.ink,
      outline: 'none',
      appearance: 'none',
      WebkitAppearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23aaa' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 14px center'
    }
  }, currentCats.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddingCat(true),
    style: {
      padding: '11px 14px',
      border: `1px solid ${COLORS.line}`,
      borderRadius: 12,
      background: COLORS.card,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    color: COLORS.mute,
    stroke: 2
  })))), /*#__PURE__*/React.createElement("select", {
    value: form.currency || 'KRW',
    onChange: e => setForm(f => ({
      ...f,
      currency: e.target.value
    })),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '11px 14px',
      marginBottom: 12,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 12,
      background: COLORS.card,
      fontFamily: MONO,
      fontSize: 13,
      color: COLORS.ink,
      outline: 'none',
      appearance: 'none',
      WebkitAppearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23aaa' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 14px center'
    }
  }, [['KRW', '₩  KRW — 한국 원'], ['USD', '$  USD — 미국 달러'], ['EUR', '€  EUR — 유로'], ['JPY', '¥  JPY — 일본 엔'], ['CNY', '¥  CNY — 중국 위안'], ['HKD', 'HK$  HKD — 홍콩 달러'], ['TWD', 'NT$  TWD — 대만 달러'], ['SGD', 'S$  SGD — 싱가포르 달러'], ['THB', '฿  THB — 태국 바트'], ['VND', '₫  VND — 베트남 동'], ['PHP', '₱  PHP — 필리핀 페소'], ['IDR', 'Rp  IDR — 인도네시아 루피아'], ['MYR', 'RM  MYR — 말레이시아 링깃'], ['INR', '₹  INR — 인도 루피'], ['AUD', 'A$  AUD — 호주 달러'], ['NZD', 'NZ$  NZD — 뉴질랜드 달러'], ['GBP', '£  GBP — 영국 파운드'], ['CHF', 'Fr  CHF — 스위스 프랑'], ['SEK', 'kr  SEK — 스웨덴 크로나'], ['NOK', 'kr  NOK — 노르웨이 크로네'], ['DKK', 'kr  DKK — 덴마크 크로네'], ['CAD', 'C$  CAD — 캐나다 달러'], ['MXN', '$  MXN — 멕시코 페소'], ['BRL', 'R$  BRL — 브라질 헤알'], ['AED', 'AED — UAE 디르함'], ['SAR', 'SAR — 사우디 리얄'], ['TRY', '₺  TRY — 터키 리라'], ['CZK', 'Kč  CZK — 체코 코루나'], ['HUF', 'Ft  HUF — 헝가리 포린트'], ['PLN', 'zł  PLN — 폴란드 즐로티']].map(([code, label]) => /*#__PURE__*/React.createElement("option", {
    key: code,
    value: code
  }, label))), /*#__PURE__*/React.createElement("input", {
    value: form.note,
    onChange: e => setForm(f => ({
      ...f,
      note: e.target.value
    })),
    placeholder: "\uBA54\uBAA8 (\uC120\uD0DD)",
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '11px 16px',
      marginBottom: 10,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 12,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 14,
      color: COLORS.ink,
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: form.date,
    onChange: e => setForm(f => ({
      ...f,
      date: e.target.value
    })),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '11px 16px',
      marginBottom: 16,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 12,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 14,
      color: COLORS.ink,
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, editIdx !== null && !delConfirm && /*#__PURE__*/React.createElement("button", {
    onClick: () => setDelConfirm(true),
    style: {
      padding: '13px 18px',
      border: 'none',
      borderRadius: 14,
      background: COLORS.softer,
      fontFamily: SANS,
      fontSize: 14,
      color: COLORS.mute,
      cursor: 'pointer'
    }
  }, "\uC0AD\uC81C"), editIdx !== null && delConfirm && /*#__PURE__*/React.createElement("button", {
    onClick: deleteEntry,
    style: {
      padding: '13px 18px',
      border: 'none',
      borderRadius: 14,
      background: '#C14F2E',
      fontFamily: SANS,
      fontSize: 14,
      fontWeight: 600,
      color: '#fff',
      cursor: 'pointer'
    }
  }, "\uD655\uC778"), /*#__PURE__*/React.createElement("button", {
    onClick: saveEntry,
    style: {
      flex: 1,
      padding: '13px 0',
      border: 'none',
      borderRadius: 14,
      background: COLORS.accent,
      fontFamily: SANS,
      fontSize: 15,
      fontWeight: 600,
      color: '#fff',
      cursor: 'pointer'
    }
  }, editIdx !== null ? '수정' : '저장')))), /*#__PURE__*/React.createElement(BudgetCalcSheet, {
    open: calcOpen,
    onClose: () => setCalcOpen(false),
    onEnter: (type, amount) => openAddWithAmount(type, amount)
  }), /*#__PURE__*/React.createElement(SplitSheet, {
    open: splitOpen,
    onClose: () => setSplitOpen(false),
    totalKrw: Math.round(krwSharedOut),
    defaultN: Math.max(2, (trip.members || []).length),
    onEnter: (type, amount) => openAddWithAmount(type, amount)
  }));
}

// ─── Tab bar (no edit toggle) ──────────────────────────────
function TabBar({
  tab,
  setTab,
  visible,
  editing,
  canEdit,
  onToggleEdit
}) {
  const tabs = [{
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
  }, {
    id: 'budget',
    icon: 'wallet',
    label: '여비'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      left: 14,
      right: 14,
      bottom: 0,
      zIndex: 30,
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: 26,
      padding: '12px 10px 14px',
      border: `0.5px solid ${COLORS.line}`,
      display: 'flex',
      gap: 2,
      alignItems: 'center',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(80px)',
      pointerEvents: visible ? 'auto' : 'none'
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
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
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '0.5px',
      height: 28,
      background: COLORS.line,
      margin: '0 2px'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onToggleEdit,
    disabled: !canEdit && !editing,
    style: {
      width: 40,
      height: 40,
      borderRadius: 20,
      border: 'none',
      cursor: canEdit ? 'pointer' : 'default',
      background: editing ? COLORS.accent : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      opacity: !canEdit && !editing ? 0.3 : 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: editing ? 'check' : 'edit',
    size: 17,
    color: editing ? '#fff' : COLORS.mute,
    stroke: 1.8
  })));
}

// ─── APP ───────────────────────────────────────────────────
const NAV_KEY = 'nav_state';
function loadNav() {
  try {
    const s = sessionStorage.getItem(NAV_KEY);
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
const SPLASH_PLACES = ['✈ New York', '🗼 Paris', '🗾 Tokyo', '🌉 San Francisco', '🏝 Bali', '🎡 London'];
function SplashScreen({
  visible
}) {
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
    onTransitionEnd: () => setHiding(false)
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
const PLANE_BODY = 'M22.07 9.64c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 2.59 4.49L21 11.67c.81-.23 1.28-1.05 1.07-1.85z';
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
function LoginScreen({
  errorMsg,
  onLoginStart
}) {
  const [loading, setLoading] = React.useState(false);
  const [errLocal, setErrLocal] = React.useState('');
  const handleLogin = async () => {
    setLoading(true);
    setErrLocal('');
    if (onLoginStart) onLoginStart();
    try {
      await fbSignIn();
      // popup success — auth listener will transition the screen
    } catch (e) {
      console.error('Login error:', e);
      setLoading(false);
      if (e.code === 'auth/popup-blocked') {
        // 팝업 차단 시 redirect 방식으로 전환
        try {
          await fbSignInRedirect();
        } catch (e2) {
          setErrLocal('로그인 실패: ' + (e2.message || e2.code));
        }
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
  }, [...'Trip'].map((ch, i) => /*#__PURE__*/React.createElement("span", {
    key: 't' + i,
    style: {
      display: 'inline-block',
      animation: `charPop 0.65s cubic-bezier(0.34,1.56,0.64,1) ${0.82 + i * 0.055}s both`
    }
  }, ch)), /*#__PURE__*/React.createElement("br", null), [...'Like J.'].map((ch, i) => /*#__PURE__*/React.createElement("span", {
    key: 'l' + i,
    style: {
      display: 'inline-block',
      animation: `charPop 0.65s cubic-bezier(0.34,1.56,0.64,1) ${0.82 + (4 + i) * 0.055 + 0.04}s both`
    }
  }, ch === ' ' ? ' ' : ch))), /*#__PURE__*/React.createElement("div", {
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
      border: `1.5px solid ${COLORS.line}`,
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

// ─── Notifications ───────────────────────────────────────────
function NotificationsScreen({
  open,
  onClose,
  authUser,
  notifications
}) {
  const [visible, setVisible] = React.useState(false); // DOM에 마운트 여부
  const [entered, setEntered] = React.useState(false); // 슬라이드 인 완료 여부

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
  const fmtMsg = n => {
    const name = n.fromName || '누군가';
    const trip = n.tripTitle ? `"${n.tripTitle}"` : '여행';
    if (n.type === 'invite_received') return `${name}님이 ${trip}에 초대했습니다.`;
    if (n.type === 'invite_accepted') return `${name}님이 ${trip} 초대를 수락했습니다.`;
    if (n.type === 'trip_edited') return `${name}님이 ${trip} 일정을 수정했습니다.`;
    if (n.type === 'contact_added') return `${name}님이 동행인으로 추가했습니다.`;
    if (n.type === 'contact_accepted') return `${name}님이 동행인 요청을 수락했습니다.`;
    return '새 알림';
  };
  const fmtTime = ts => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = (Date.now() - d) / 1000;
    if (diff < 60) return '방금';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };
  const typeColor = type => ({
    invite_received: '#4F6BED',
    invite_accepted: '#2E9E5B',
    trip_edited: '#E07B39',
    contact_added: '#9B59B6',
    contact_accepted: '#2E9E5B'
  })[type] || COLORS.mute;
  const typeIcon = type => ({
    invite_received: 'users',
    invite_accepted: 'check',
    trip_edited: 'edit',
    contact_added: 'user',
    contact_accepted: 'check'
  })[type] || 'bell';
  const deleteNotif = id => {
    if (authUser?.uid && typeof fbDeleteNotification === 'function') fbDeleteNotification(authUser.uid, id).catch(() => {});
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 230,
      background: COLORS.bg,
      overflowY: 'auto',
      overflowX: 'hidden',
      transform: `translateX(${entered ? 0 : 100}%)`,
      transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
      paddingBottom: 'calc(32px + env(safe-area-inset-bottom,0px))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      background: COLORS.bg,
      zIndex: 5,
      paddingTop: 'calc(env(safe-area-inset-top,0px) + 14px)',
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 14,
      borderBottom: `1px solid ${COLORS.line}`,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 36,
      height: 36,
      borderRadius: 18,
      border: 'none',
      background: COLORS.softer,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-l",
    size: 17,
    color: COLORS.ink,
    stroke: 2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 22,
      color: COLORS.ink
    }
  }, "Notifications")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 0'
    }
  }, notifications.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 0',
      textAlign: 'center',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, "\uC54C\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, notifications.map(n => {
    const color = typeColor(n.type);
    return /*#__PURE__*/React.createElement(SwipeableRow, {
      key: n.id,
      onDelete: () => deleteNotif(n.id),
      deleteLabel: "\uC0AD\uC81C",
      wrapStyle: {
        borderRadius: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: n.read ? COLORS.card : `${color}12`,
        borderRadius: 14,
        padding: '13px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        border: `1.5px solid ${n.read ? 'transparent' : color + '30'}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 18,
        flexShrink: 0,
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: typeIcon(n.type),
      size: 16,
      color: color,
      stroke: 2
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 13.5,
        color: COLORS.ink,
        lineHeight: 1.45
      }
    }, fmtMsg(n)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 10,
        color: COLORS.mute,
        marginTop: 3
      }
    }, fmtTime(n.createdAt))), !n.read && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 7,
        height: 7,
        borderRadius: 4,
        background: color,
        flexShrink: 0,
        marginTop: 6
      }
    })));
  }))));
}

// ─── Companions ───────────────────────────────────────────────
function CompanionsScreen({
  open,
  onClose,
  authUser,
  userData,
  trips
}) {
  const [contacts, setContacts] = React.useState([]);
  const [sentInvites, setSentInvites] = React.useState([]);
  const [receivedInvites, setReceivedInvites] = React.useState([]);
  const [inviteUsers, setInviteUsers] = React.useState({});
  const [tripCompanions, setTripCompanions] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [removing, setRemoving] = React.useState(null);
  const [addTripFor, setAddTripFor] = React.useState(null);
  const tripIds = (trips || []).map(t => t.id).join(',');
  React.useEffect(() => {
    if (!open || !authUser) return;
    document.body.style.overflow = 'hidden';
    setLoading(true);
    fbGetContacts(authUser.uid).then(setContacts).catch(() => setContacts([]));
    Promise.all((trips || []).map(t => fbGetTripCompanions(t.id, authUser.uid).then(m => ({
      id: t.id,
      members: m
    })).catch(() => ({
      id: t.id,
      members: []
    })))).then(results => {
      const map = {};
      results.forEach(r => {
        map[r.id] = r.members;
      });
      setTripCompanions(map);
      setLoading(false);
    });
    let unsubSent = () => {};
    if (typeof fbListenSentInvites === 'function') {
      unsubSent = fbListenSentInvites(authUser.uid, async invites => {
        setSentInvites(invites);
        const uids = [...new Set(invites.map(i => i.toUid).filter(Boolean))];
        if (uids.length) {
          fbGetUsersById(uids).then(users => {
            const m = {};
            users.forEach(u => {
              m[u.uid] = u;
            });
            setInviteUsers(m);
          }).catch(() => {});
        }
      });
    }

    // 받은 연락처 요청 리스너
    let unsubReceived = () => {};
    if (typeof fbListenInvites === 'function') {
      unsubReceived = fbListenInvites(authUser.uid, invites => {
        setReceivedInvites(invites.filter(inv => inv.type === 'contact'));
      });
    }
    return () => {
      unsubSent();
      unsubReceived();
      document.body.style.overflow = '';
    };
  }, [open, authUser?.uid, tripIds]);
  if (!open) return null;
  const removeContact = async (c, skipConfirm = false) => {
    if (!skipConfirm && !confirm(`${c.displayName}님을 동행인에서 삭제할까요?\n모든 여행에서도 제거됩니다.`)) return;
    setRemoving(`contact:${c.uid}`);
    try {
      await fbRemoveContact(authUser.uid, c.uid);
      await Promise.all((trips || []).map(t => (tripCompanions[t.id] || []).some(m => m.uid === c.uid) ? fbRemoveTripMember(t.id, c.uid) : Promise.resolve()));
      setContacts(prev => prev.filter(x => x.uid !== c.uid));
      setTripCompanions(prev => {
        const next = {
          ...prev
        };
        Object.keys(next).forEach(tid => {
          next[tid] = next[tid].filter(m => m.uid !== c.uid);
        });
        return next;
      });
    } catch (e) {
      alert('삭제 실패. 다시 시도해 주세요.');
    }
    setRemoving(null);
  };
  const removeFromTrip = async (tripId, uid, displayName) => {
    if (!confirm(`${displayName}님을 이 여행에서 제거할까요?`)) return;
    setRemoving(`trip:${tripId}:${uid}`);
    try {
      await fbRemoveTripMember(tripId, uid);
      setTripCompanions(prev => ({
        ...prev,
        [tripId]: (prev[tripId] || []).filter(m => m.uid !== uid)
      }));
    } catch (e) {
      alert('제거 실패.');
    }
    setRemoving(null);
  };
  const addToTrip = async (contact, tripId) => {
    const trip = (trips || []).find(t => t.id === tripId);
    const res = await fbSendTripInvite({
      uid: authUser.uid,
      displayName: authUser.displayName,
      email: authUser.email,
      photoURL: authUser.photoURL || ''
    }, contact.email, tripId, trip?.title || '');
    if (res.error) {
      alert(res.error);
      return;
    }
    setAddTripFor(null);
    alert(`${contact.displayName}님께 초대를 보냈습니다!`);
  };
  const Avatar = ({
    u,
    size = 40
  }) => u?.photoURL ? /*#__PURE__*/React.createElement("img", {
    src: u.photoURL,
    style: {
      width: size,
      height: size,
      borderRadius: size / 2,
      objectFit: 'cover',
      flexShrink: 0
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: size / 2,
      background: COLORS.softer,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: SANS,
      fontSize: size * 0.4,
      color: COLORS.mute
    }
  }, (u?.displayName || '?')[0]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 220,
      background: COLORS.bg,
      overflowY: 'auto',
      paddingBottom: 'calc(32px + env(safe-area-inset-bottom,0px))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      background: COLORS.bg,
      zIndex: 5,
      paddingTop: 'calc(env(safe-area-inset-top,0px) + 14px)',
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 14,
      borderBottom: `1px solid ${COLORS.line}`,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 36,
      height: 36,
      borderRadius: 18,
      border: 'none',
      background: COLORS.softer,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-l",
    size: 17,
    color: COLORS.ink,
    stroke: 2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 22,
      color: COLORS.ink
    }
  }, "Companions")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 0'
    }
  }, loading && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 0',
      textAlign: 'center',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, "\uBD88\uB7EC\uC624\uB294 \uC911..."), !loading && /*#__PURE__*/React.createElement(React.Fragment, null, sentInvites.filter(inv => inv.tripId).length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.1em',
      marginBottom: 10
    }
  }, "\uB300\uAE30 \uC911 \xB7 ", sentInvites.filter(inv => inv.tripId).length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, sentInvites.filter(inv => inv.tripId).map(inv => {
    const u = inviteUsers[inv.toUid];
    return /*#__PURE__*/React.createElement(SwipeableRow, {
      key: inv.id,
      onEdit: async () => {
        try {
          await fbCancelInvite(inv.id);
          const fromUser = {
            uid: authUser.uid,
            displayName: authUser.displayName,
            email: authUser.email,
            photoURL: authUser.photoURL || ''
          };
          await fbSendTripInvite(fromUser, inv.toEmail, inv.tripId, inv.tripTitle || '');
        } catch (e) {
          alert('재신청 실패.');
        }
      },
      editLabel: "\uC7AC\uC2E0\uCCAD",
      editBg: "#ffa500",
      onDelete: async () => {
        if (!confirm('초대를 취소할까요?')) return;
        try {
          await fbCancelInvite(inv.id);
        } catch (e) {
          alert('취소 실패.');
        }
      },
      deleteLabel: "\uCDE8\uC18C",
      wrapStyle: {
        borderRadius: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: COLORS.card,
        borderRadius: 14,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      u: u || {
        displayName: inv.toEmail
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 13.5,
        fontWeight: 500,
        color: COLORS.ink
      }
    }, u?.displayName || inv.toEmail), inv.tripTitle && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 11.5,
        color: COLORS.mute,
        marginTop: 1
      }
    }, inv.tripTitle)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9.5,
        color: '#B8860B',
        background: '#FFF8E1',
        borderRadius: 8,
        padding: '3px 8px'
      }
    }, "\uB300\uAE30 \uC911")));
  }))), receivedInvites.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.1em',
      marginBottom: 10
    }
  }, "\uBC1B\uC740 \uC694\uCCAD \xB7 ", receivedInvites.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, receivedInvites.map(inv => /*#__PURE__*/React.createElement("div", {
    key: inv.id,
    style: {
      background: COLORS.card,
      borderRadius: 14,
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    u: {
      displayName: inv.fromName,
      photoURL: inv.fromPhoto
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 13.5,
      fontWeight: 500,
      color: COLORS.ink
    }
  }, inv.fromName || '?'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 11.5,
      color: COLORS.mute,
      marginTop: 1
    }
  }, "\uB3D9\uD589\uC778 \uC694\uCCAD")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: async () => {
      await fbAcceptContactInvite(inv, authUser.uid);
      setReceivedInvites(p => p.filter(i => i.id !== inv.id));
      fbGetContacts(authUser.uid).then(setContacts).catch(() => {});
    },
    style: {
      border: 'none',
      borderRadius: 9,
      padding: '6px 12px',
      cursor: 'pointer',
      background: COLORS.ink,
      color: COLORS.bg,
      fontFamily: SANS,
      fontSize: 12,
      fontWeight: 500
    }
  }, "\uC218\uB77D"), /*#__PURE__*/React.createElement("button", {
    onClick: async () => {
      await fbRejectInvite(inv.id).catch(() => {});
      setReceivedInvites(p => p.filter(i => i.id !== inv.id));
    },
    style: {
      border: `1px solid ${COLORS.line}`,
      borderRadius: 9,
      padding: '6px 10px',
      cursor: 'pointer',
      background: 'transparent',
      fontFamily: SANS,
      fontSize: 12,
      color: COLORS.mute
    }
  }, "\uAC70\uC808")))))), (() => {
    const pendingReceivedUids = new Set(receivedInvites.map(inv => inv.fromUid).filter(Boolean));
    const pendingInvMap = {};
    sentInvites.filter(inv => inv.type === 'contact' && !inv.tripId).forEach(inv => {
      pendingInvMap[inv.toUid] = inv;
    });
    const displayContacts = contacts.filter(c => !pendingReceivedUids.has(c.uid));
    const total = displayContacts.length;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9.5,
        color: COLORS.mute,
        letterSpacing: '0.1em',
        marginBottom: 10
      }
    }, "\uB3D9\uD589\uC778 \xB7 ", total), total === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '32px 0',
        textAlign: 'center',
        fontFamily: SANS,
        fontSize: 13,
        color: COLORS.mute
      }
    }, "\uC544\uC9C1 \uB3D9\uD589\uC778\uC774 \uC5C6\uC5B4\uC694") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, displayContacts.map(c => {
      const pendingInv = pendingInvMap[c.uid];
      return /*#__PURE__*/React.createElement(SwipeableRow, {
        key: c.uid,
        onEdit: pendingInv ? async () => {
          try {
            await fbCancelInvite(pendingInv.id);
            await fbAddContact(authUser.uid, pendingInv.toEmail);
          } catch (e) {
            alert('재신청 실패.');
          }
        } : undefined,
        editLabel: pendingInv ? '재신청' : undefined,
        editBg: "#ffa500",
        onDelete: async () => {
          if (!confirm(`${c.displayName}님을 동행인에서 삭제할까요?\n모든 여행에서도 제거됩니다.`)) return;
          if (pendingInv) await fbCancelInvite(pendingInv.id).catch(() => {});
          await removeContact(c, true);
        },
        wrapStyle: {
          borderRadius: 14
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          background: COLORS.card,
          borderRadius: 14,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }
      }, /*#__PURE__*/React.createElement(Avatar, {
        u: c
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontSize: 13.5,
          fontWeight: 500,
          color: COLORS.ink
        }
      }, c.displayName), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontSize: 12,
          color: COLORS.mute,
          marginTop: 1
        }
      }, c.email)), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 4
        }
      }, pendingInv && /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: MONO,
          fontSize: 9,
          color: '#B8860B',
          background: '#FFF8E1',
          borderRadius: 6,
          padding: '2px 6px'
        }
      }, "\uBBF8\uC218\uB77D"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }
      }, (trips || []).filter(t => (tripCompanions[t.id] || []).some(m => m.uid === c.uid)).map(t => /*#__PURE__*/React.createElement("div", {
        key: t.id,
        style: {
          fontFamily: MONO,
          fontSize: 9,
          color: '#4F6BED',
          background: '#EEF2FF',
          borderRadius: 6,
          padding: '2px 6px'
        }
      }, t.title || '여행'))))));
    })));
  })(), (trips || []).length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.1em',
      marginBottom: 10
    }
  }, "\uC5EC\uD589\uBCC4"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, (trips || []).map(t => {
    const members = tripCompanions[t.id] || [];
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        background: COLORS.card,
        borderRadius: 16,
        border: `1px solid ${COLORS.line}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 10,
        overflow: 'hidden',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Photo, {
      hue: t.hue ?? 25,
      height: 36,
      small: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SERIF,
        fontSize: 15,
        color: COLORS.ink
      }
    }, t.title || '새 여행'), t.dates && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9.5,
        color: COLORS.mute,
        marginTop: 1
      }
    }, t.dates)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9.5,
        color: COLORS.accent
      }
    }, members.length, "\uBA85")), members.length > 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 12px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, members.map(m => /*#__PURE__*/React.createElement(SwipeableRow, {
      key: m.uid,
      onDelete: () => removeFromTrip(t.id, m.uid, m.displayName),
      wrapStyle: {
        borderRadius: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: COLORS.softer,
        borderRadius: 10,
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      u: m,
      size: 28
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 12.5,
        fontWeight: 500,
        color: COLORS.ink
      }
    }, m.displayName)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 9,
        color: COLORS.mute
      }
    }, "\u2190 \uC2A4\uC640\uC774\uD504"))))) : /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 16px 12px',
        fontFamily: SANS,
        fontSize: 12,
        color: COLORS.mute
      }
    }, "\uB3D9\uD589\uC778 \uC5C6\uC74C"));
  }))))), addTripFor && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 300,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    },
    onClick: () => setAddTripFor(null)
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: COLORS.bg,
      borderRadius: 20,
      padding: '22px 20px',
      width: '100%',
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 18,
      color: COLORS.ink,
      marginBottom: 4
    }
  }, addTripFor.displayName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute,
      marginBottom: 16
    }
  }, "\uC5B4\uB290 \uC5EC\uD589\uC5D0 \uCD94\uAC00\uD560\uAE4C\uC694?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, (trips || []).map(t => {
    const alreadyIn = (tripCompanions[t.id] || []).some(m => m.uid === addTripFor.uid);
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => !alreadyIn && addToTrip(addTripFor, t.id),
      style: {
        padding: '11px 14px',
        borderRadius: 12,
        cursor: alreadyIn ? 'default' : 'pointer',
        border: `1.5px solid ${alreadyIn ? COLORS.line : COLORS.ink}`,
        background: alreadyIn ? COLORS.softer : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 8,
        overflow: 'hidden',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Photo, {
      hue: t.hue ?? 25,
      height: 28,
      small: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontFamily: SANS,
        fontSize: 13,
        color: alreadyIn ? COLORS.mute : COLORS.ink
      }
    }, t.title || '여행'), alreadyIn && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO,
        fontSize: 9.5,
        color: COLORS.mute
      }
    }, "\uC774\uBBF8 \uCC38\uC5EC \uC911"));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAddTripFor(null),
    style: {
      marginTop: 14,
      width: '100%',
      padding: '11px',
      borderRadius: 12,
      border: `1px solid ${COLORS.line}`,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 13,
      color: COLORS.mute
    }
  }, "\uCDE8\uC18C"))));
}
function AddCompanionSheet({
  open,
  onClose,
  authUser,
  userData,
  trips,
  onUserDataUpdate,
  defaultTripId
}) {
  const [selTrip, setSelTrip] = React.useState(null);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteMsg, setInviteMsg] = React.useState('');
  const [inviting, setInviting] = React.useState(false);
  const [pendingInvites, setPendingInvites] = React.useState([]);
  React.useEffect(() => {
    if (!open || !authUser) return;
    setSelTrip(defaultTripId || null);
    setInviteEmail('');
    setInviteMsg('');
    const unsub = fbListenInvites(authUser.uid, setPendingInvites);
    return unsub;
  }, [open]);
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);
  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteMsg('');
    if (!selTrip) {
      const res = await fbAddContact(authUser.uid, inviteEmail);
      setInviting(false);
      if (res.error) setInviteMsg(res.error);else {
        setInviteMsg(`${res.toName}님이 동행인으로 추가되었습니다!`);
        setInviteEmail('');
      }
      return;
    }
    const trip = (trips || []).find(t => t.id === selTrip);
    await fbAddContact(authUser.uid, inviteEmail).catch(() => {});
    const res = await fbSendTripInvite({
      uid: authUser.uid,
      displayName: authUser.displayName,
      email: authUser.email,
      photoURL: authUser.photoURL || ''
    }, inviteEmail, selTrip, trip?.title || '');
    setInviting(false);
    if (res.error) setInviteMsg(res.error);else {
      setInviteMsg(`${res.toName}님께 초대를 보냈습니다!`);
      setInviteEmail('');
    }
  };
  const handleAccept = async inv => {
    if (inv.type === 'contact') {
      await fbAcceptContactInvite(inv, authUser.uid);
      setPendingInvites(p => p.filter(i => i.id !== inv.id));
      return;
    }
    const tripId = await fbAcceptTripInvite(inv, authUser.uid);
    onUserDataUpdate({
      ...userData,
      tripIds: [...(userData.tripIds || []), tripId]
    });
    setPendingInvites(p => p.filter(i => i.id !== inv.id));
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 210,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: COLORS.bg,
      borderRadius: '22px 22px 0 0',
      paddingBottom: 'calc(28px + env(safe-area-inset-bottom,0px))',
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
      padding: '6px 20px 16px',
      borderBottom: `1px solid ${COLORS.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SERIF,
      fontSize: 24,
      color: COLORS.ink
    }
  }, "\uB3D9\uD589\uC778 \uCD94\uAC00"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 12.5,
      color: COLORS.mute,
      marginTop: 4
    }
  }, "\uC774\uBA54\uC77C\uB85C \uB3D9\uD589\uC778\uC744 \uCD94\uAC00\uD574\uC694")), pendingInvites.length > 0 && /*#__PURE__*/React.createElement("div", {
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
  }, "\uD83D\uDCE9 \uB3D9\uD589 \uCD08\uB300 ", pendingInvites.length, "\uAC74"), pendingInvites.map(inv => /*#__PURE__*/React.createElement("div", {
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
      width: 34,
      height: 34,
      borderRadius: 17
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 17,
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
  }, inv.type === 'contact' ? '동행인 요청' : inv.tripTitle || inv.fromEmail)), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleAccept(inv),
    style: {
      border: 'none',
      borderRadius: 9,
      padding: '6px 12px',
      cursor: 'pointer',
      background: COLORS.ink,
      color: COLORS.bg,
      fontFamily: SANS,
      fontSize: 12,
      fontWeight: 500
    }
  }, "\uC218\uB77D"), /*#__PURE__*/React.createElement("button", {
    onClick: () => fbRejectInvite(inv.id).then(() => setPendingInvites(p => p.filter(i => i.id !== inv.id))),
    style: {
      border: `1px solid ${COLORS.line}`,
      borderRadius: 9,
      padding: '6px 10px',
      cursor: 'pointer',
      background: 'transparent',
      fontFamily: SANS,
      fontSize: 12,
      color: COLORS.mute
    }
  }, "\uAC70\uC808")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.1em',
      marginBottom: 8
    }
  }, "\uC5EC\uD589 \uC120\uD0DD (\uC120\uD0DD\uC0AC\uD56D)"), /*#__PURE__*/React.createElement("select", {
    value: selTrip || '',
    onChange: e => setSelTrip(e.target.value || null),
    style: {
      width: '100%',
      padding: '11px 14px',
      borderRadius: 12,
      border: `1.5px solid ${COLORS.line}`,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 13.5,
      color: COLORS.ink,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\uC5EC\uD589 \uC5C6\uC774 \uB3D9\uD589\uC778 \uCD94\uAC00"), (trips || []).map(t => /*#__PURE__*/React.createElement("option", {
    key: t.id,
    value: t.id
  }, t.title || '여행'))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      fontFamily: MONO,
      fontSize: 9.5,
      color: COLORS.mute,
      letterSpacing: '0.1em',
      marginBottom: 8
    }
  }, "\uC774\uBA54\uC77C\uB85C \uCD08\uB300"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 12,
      color: COLORS.mute,
      marginBottom: 10
    }
  }, "\uC0C1\uB300\uBC29\uC774 \uC774 \uC571\uC5D0 \uBA3C\uC800 \uAC00\uC785\uB418\uC5B4 \uC788\uC5B4\uC57C \uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("input", {
    value: inviteEmail,
    onChange: e => setInviteEmail(e.target.value),
    placeholder: "\uAD6C\uAE00 \uC774\uBA54\uC77C \uC785\uB825",
    onKeyDown: e => e.key === 'Enter' && handleInvite(),
    style: {
      width: '100%',
      padding: '12px 14px',
      borderRadius: 12,
      border: `1.5px solid ${COLORS.line}`,
      background: COLORS.card,
      fontFamily: SANS,
      fontSize: 13.5,
      color: COLORS.ink,
      boxSizing: 'border-box',
      outline: 'none'
    }
  }), inviteMsg && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: SANS,
      fontSize: 12,
      color: inviteMsg.includes('추가') || inviteMsg.includes('보냈') ? '#2E7D32' : COLORS.accent
    }
  }, inviteMsg), /*#__PURE__*/React.createElement("button", {
    onClick: handleInvite,
    disabled: inviting || !inviteEmail.trim(),
    style: {
      marginTop: 12,
      width: '100%',
      padding: '14px',
      border: 'none',
      borderRadius: 14,
      background: inviteEmail.trim() ? COLORS.ink : COLORS.softer,
      color: inviteEmail.trim() ? COLORS.bg : COLORS.mute,
      fontFamily: SANS,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, inviting ? '처리 중...' : selTrip ? '초대 보내기' : '동행인 추가'))));
}
function ProfileSheet({
  open,
  onClose,
  authUser,
  trips,
  onAddCompanion,
  onViewCompanions
}) {
  if (!open || !authUser) return null;
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
    onClick: e => e.stopPropagation(),
    style: {
      background: COLORS.bg,
      borderRadius: '22px 22px 0 0',
      maxHeight: '88%',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 'calc(24px + env(safe-area-inset-bottom,0px))'
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
      padding: '12px 20px 16px',
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      borderBottom: `1px solid ${COLORS.line}`,
      flexShrink: 0
    }
  }, authUser.photoURL ? /*#__PURE__*/React.createElement("img", {
    src: authUser.photoURL,
    style: {
      width: 52,
      height: 52,
      borderRadius: 26,
      objectFit: 'cover',
      flexShrink: 0
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 26,
      background: COLORS.accent,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
    onClick: () => {
      fbSignOut();
      onClose();
    },
    style: {
      border: `1px solid ${COLORS.line}`,
      borderRadius: 10,
      padding: '7px 12px',
      background: 'transparent',
      fontFamily: SANS,
      fontSize: 12,
      color: COLORS.mute,
      cursor: 'pointer'
    }
  }, "\uB85C\uADF8\uC544\uC6C3")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: 'auto',
      flex: 1,
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: COLORS.card,
      borderRadius: 14,
      border: `1px solid ${COLORS.line}`,
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 20,
      background: COLORS.softer,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 18,
    color: COLORS.mute,
    stroke: 1.8
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 14,
      fontWeight: 500,
      color: COLORS.ink
    }
  }, "\uB3D9\uD589\uC778"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontSize: 11.5,
      color: COLORS.mute,
      marginTop: 2
    }
  }, "\uD568\uAED8\uD558\uB294 \uC5EC\uD589 \uCE5C\uAD6C")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onClose();
      setTimeout(onViewCompanions, 100);
    },
    style: {
      padding: '7px 13px',
      borderRadius: 10,
      border: `1px solid ${COLORS.line}`,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 12,
      color: COLORS.ink
    }
  }, "\uBCF4\uAE30"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onClose();
      setTimeout(() => onAddCompanion(null), 100);
    },
    style: {
      padding: '7px 13px',
      borderRadius: 10,
      border: 'none',
      background: COLORS.ink,
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 12,
      fontWeight: 600,
      color: '#fff'
    }
  }, "\uCD94\uAC00"))))));
}
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

// Firestore 문서에 누락된 필드를 채워주는 정규화 함수
function normalizeTrip(data, id) {
  if (!data) return null;
  return {
    title: '',
    dates: '',
    hotel: '',
    days: [],
    hotels: [],
    food: [],
    members: [],
    ...data,
    id: id || data.id,
    days: Array.isArray(data.days) ? data.days : [],
    hotels: Array.isArray(data.hotels) ? data.hotels : [],
    food: Array.isArray(data.food) ? data.food : [],
    members: Array.isArray(data.members) ? data.members : []
  };
}
function App() {
  const _nav = loadNav();
  const _cache = _readCache(); // 캐시된 상태 (로그인된 경우)

  // ── Firebase auth + data state ─────────────────────────────
  const [authState, setAuthState] = React.useState(_cache?.userData ? 'in' : 'loading');
  const [authUser, setAuthUser] = React.useState(null);
  const [userData, setUserData] = React.useState(_cache?.userData || null);
  const [trip, setTrip] = React.useState(normalizeTrip(_cache?.trip));
  const [prep, setPrep] = React.useState(_cache?.prep || {
    checklist: [],
    docs: [],
    pack: []
  });
  const [activeTripId, setActiveTripId] = React.useState(_nav.activeTripId || null);
  const [userTrips, setUserTrips] = React.useState([]);
  const [tripsLoading, setTripsLoading] = React.useState(false);
  const [profileSheetOpen, setProfileSheetOpen] = React.useState(false);
  const [addCompanionOpen, setAddCompanionOpen] = React.useState(null); // null=closed, false=open(no trip), tripId=open(with trip)
  const [companionsScreenOpen, setCompanionsScreenOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifs, setNotifs] = React.useState([]);
  const notifyTripEditTimer = React.useRef(null);
  const [shareTripTarget, setShareTripTarget] = React.useState(null);
  const [loginError, setLoginError] = React.useState('');
  const [loginPending, setLoginPending] = React.useState(false); // 로그인 버튼 누른 후 로딩 중
  const tripRef = React.useRef(null); // for loop-prevention

  // ── UI nav state ───────────────────────────────────────────
  const [tab, setTab] = React.useState(_nav.tab || 'home');
  const [dayIdx, setDayIdx] = React.useState(_nav.dayIdx ?? null);
  const [hotelIdx, setHotelIdx] = React.useState(_nav.hotelIdx ?? null);
  const [slideDir, setSlideDir] = React.useState(null);
  const [slideKey, setSlideKey] = React.useState(0);
  const [openStop, setOpenStop] = React.useState(null);
  const [city, setCity] = React.useState(CITIES[0]);
  const [hotelSheet, setHotelSheet] = React.useState(null);
  const [hotelDetailSheet, setHotelDetailSheet] = React.useState(null); // null=closed, 'new'=add, number=idx
  const [scrollKey, setScrollKey] = React.useState(0);
  const [editing, setEditing] = React.useState(false);
  const [tabBarVisible, setTabBarVisible] = React.useState(true);
  const [budgetSheetOpen, setBudgetSheetOpen] = React.useState(false);
  const [saveConfirm, setSaveConfirm] = React.useState(false); // 저장 확인 다이얼로그
  const lastScrollTop = React.useRef(0);
  const savedHomeScrollY = React.useRef(0);
  const navGoingBack = React.useRef(false);
  const editSnapshot = React.useRef(null); // 편집 시작 시 trip+prep 스냅샷

  // 편집 버튼 토글 핸들러
  const handleEditToggle = () => {
    if (!editing) {
      if (!canEdit) return;
      editSnapshot.current = JSON.stringify({
        trip,
        prep
      });
      setEditing(true);
    } else {
      const changed = editSnapshot.current !== JSON.stringify({
        trip,
        prep
      });
      if (changed) {
        setSaveConfirm(true); // 변경 있으면 확인 다이얼로그
      } else {
        setEditing(false); // 변경 없으면 그냥 닫기
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
    return fbOnAuth(async fbUser => {
      if (fbUser) {
        setAuthUser(fbUser);
        const fallback = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || '여행자',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || '',
          groupId: fbUser.uid
        };
        // fallback 즉시 세팅 → 바로 앱 화면 표시
        setUserData(fallback);
        setLoginError('');
        localStorage.setItem('tlj_authed', '1');
        setAuthState('in');
        // Firestore는 백그라운드에서 실제 데이터로 업데이트
        fbGetOrCreateUser(fbUser).then(setUserData).catch(() => {});
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
    });
  }, []);

  // ── 알림 리스너 ────────────────────────────────────────────
  React.useEffect(() => {
    if (!authUser?.uid || typeof fbListenNotifications !== 'function') return;
    const CUTOFF = 30 * 24 * 60 * 60 * 1000;
    if (typeof fbPruneOldNotifications === 'function') fbPruneOldNotifications(authUser.uid).catch(() => {});
    return fbListenNotifications(authUser.uid, all => {
      const now = Date.now();
      setNotifs(all.filter(n => {
        const ts = n.createdAt?.toDate ? n.createdAt.toDate() : new Date(n.createdAt || 0);
        return now - ts.getTime() < CUTOFF;
      }));
    });
  }, [authUser?.uid]);

  // ── 여행 목록 로드 ─────────────────────────────────────────
  React.useEffect(() => {
    if (!userData?.uid) return;
    const tripIds = userData.tripIds || [userData.groupId];
    setTripsLoading(true);
    fbLoadTrips(tripIds).then(async trips => {
      const normalized = trips.map(t => normalizeTrip(t, t.id));
      // days가 없는 여행은 TRIP_DEFAULT로 자동 복구
      for (let i = 0; i < normalized.length; i++) {
        if ((normalized[i].days || []).length === 0) {
          const def = JSON.parse(JSON.stringify(window.TRIP_DEFAULT));
          const patch = {
            title: def.title || 'New York',
            dates: def.dates || '',
            hotel: def.hotel || '',
            days: def.days || [],
            hotels: def.hotels || [],
            food: def.food || []
          };
          // 로컬 상태 먼저 업데이트 (Firestore 실패해도 화면에 데이터 보임)
          normalized[i] = normalizeTrip({
            ...normalized[i],
            ...patch
          }, normalized[i].id);
          fbSaveGroup(normalized[i].id, patch).catch(e => console.warn('auto-restore save failed', e));
        }
      }
      setUserTrips(normalized);
      setTripsLoading(false);
    }).catch(() => setTripsLoading(false));
  }, [userData?.uid, JSON.stringify(userData?.tripIds)]);

  // ── Firestore: shared group listener ──────────────────────
  const groupCreateRef = React.useRef(false);
  React.useEffect(() => {
    if (!activeTripId) return;
    groupCreateRef.current = false;
    return fbListenGroup(activeTripId, data => {
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
    return fbListenPrep(authUser.uid, p => {
      // preps 문서가 없거나 비어있으면 TRIP_DEFAULT.prep으로 초기화
      const hasData = p && (p.checklist?.length || p.docs?.length || p.pack?.length);
      if (!hasData) {
        const def = window.TRIP_DEFAULT?.prep || {
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
  }, [authUser?.uid]);
  React.useEffect(() => {
    saveNav({
      tab,
      dayIdx,
      hotelIdx,
      activeTripId
    });
  }, [tab, dayIdx, hotelIdx, activeTripId]);

  // 스크롤 위치 저장
  React.useEffect(() => {
    const save = () => {
      try {
        sessionStorage.setItem('tlj_scrollY', String(Math.round(window.scrollY)));
      } catch (_) {}
    };
    window.addEventListener('scroll', save, {
      passive: true
    });
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
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Tab animation hooks ───────────────────────────────────────
  const TAB_ORDER = ['home', 'map', 'food', 'prep', 'budget'];
  const tabRef = React.useRef(tab);
  const swipeBackRef = React.useRef(null);
  const slideDirRef = React.useRef(null);
  React.useEffect(() => {
    tabRef.current = tab;
  }, [tab]);
  const changeTab = React.useCallback(newTab => {
    const oldIdx = TAB_ORDER.indexOf(tabRef.current);
    const newIdx = TAB_ORDER.indexOf(newTab);
    if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
      const dir = newIdx > oldIdx ? 'from-right' : 'from-left';
      slideDirRef.current = dir;
      setSlideDir(dir);
      setSlideKey(k => k + 1);
    }
    setTab(newTab);
    setDayIdx(null);
    setHotelIdx(null);
    setOpenStop(null);
    setEditing(false);
  }, []);

  // ── Trip-level actions (Firestore) ────────────────────────
  const editTrip = patch => {
    setTrip(prev => ({
      ...prev,
      ...patch
    }));
    if (activeTripId) fbSaveGroup(activeTripId, patch).catch(console.error);
    // 동행인에게 일정 수정 알림 (60초 디바운스)
    if (activeTripId && authUser && typeof fbNotifyTripEdit === 'function') {
      clearTimeout(notifyTripEditTimer.current);
      notifyTripEditTimer.current = setTimeout(() => {
        fbNotifyTripEdit(activeTripId, authUser.uid, authUser.displayName || '', authUser.photoURL || '', trip?.title || '').catch(() => {});
      }, 60000);
    }
  };
  const editPrep = newPrep => {
    setPrep(newPrep);
    if (authUser?.uid) fbSavePrep(authUser.uid, newPrep).catch(console.error);
  };
  const deleteTrip = async tripId => {
    const t = userTrips.find(x => x.id === tripId);
    const isOwner = !t?.members || t.members[0] === userData?.uid;
    const msg = isOwner ? `"${t?.title || '여행'}"을(를) 삭제할까요?\n삭제하면 복구할 수 없습니다.` : `"${t?.title || '여행'}"에서 나갈까요?`;
    if (!confirm(msg)) return;
    await fbDeleteTrip(tripId, userData.uid);
    setUserTrips(prev => prev.filter(x => x.id !== tripId));
    setUserData(prev => ({
      ...prev,
      tripIds: (prev.tripIds || []).filter(id => id !== tripId)
    }));
  };

  // ── Day actions ────────────────────────────────────────
  const reorderDays = (from, to) => {
    const days = [...trip.days];
    const [m] = days.splice(from, 1);
    days.splice(to, 0, m);
    editTrip({
      days: days.map((d, i) => ({
        ...d,
        n: i + 1
      }))
    });
  };
  const addDay = () => {
    const n = trip.days.length + 1;
    const newDay = {
      n,
      date: '',
      weekday: '',
      title: `Day ${n}`,
      titleEn: '',
      hero: {
        hue: 20 + n * 5,
        label: `DAY ${n}`
      },
      weather: '',
      items: []
    };
    editTrip({
      days: [...trip.days, newDay]
    });
  };
  const deleteDay = i => {
    if (!confirm(`Day ${trip.days[i].n} 일정을 삭제할까요?`)) return;
    const days = trip.days.filter((_, j) => j !== i).map((d, k) => ({
      ...d,
      n: k + 1
    }));
    editTrip({
      days
    });
  };
  const editDay = patch => {
    const days = [...trip.days];
    days[dayIdx] = {
      ...days[dayIdx],
      ...patch
    };
    editTrip({
      days
    });
  };

  // ── Stop actions ───────────────────────────────────────
  const reorderItems = (from, to) => {
    const days = [...trip.days];
    const items = [...days[dayIdx].items];
    const [m] = items.splice(from, 1);
    items.splice(to, 0, m);
    days[dayIdx] = {
      ...days[dayIdx],
      items
    };
    editTrip({
      days
    });
  };
  const addItem = () => {
    const newItem = {
      time: '12:00',
      cat: 'sight',
      title: '새 일정',
      en: 'New stop',
      loc: '',
      note: ''
    };
    const days = [...trip.days];
    days[dayIdx] = {
      ...days[dayIdx],
      items: [...days[dayIdx].items, newItem]
    };
    editTrip({
      days
    });
    setOpenStop({
      idx: days[dayIdx].items.length - 1,
      stop: newItem,
      editing: true
    });
  };
  const addItemToFirstDay = () => {
    const newItem = {
      time: '12:00',
      cat: 'sight',
      title: '새 일정',
      en: 'New stop',
      loc: '',
      note: ''
    };
    const days = [...trip.days];
    days[0] = {
      ...days[0],
      items: [...days[0].items, newItem]
    };
    editTrip({
      days
    });
    setDayIdx(0);
    setScrollKey(k => k + 1);
    setOpenStop({
      idx: days[0].items.length - 1,
      stop: newItem,
      editing: true
    });
  };
  const deleteItem = i => {
    if (!confirm('이 일정을 삭제할까요?')) return;
    const days = [...trip.days];
    days[dayIdx] = {
      ...days[dayIdx],
      items: days[dayIdx].items.filter((_, j) => j !== i)
    };
    editTrip({
      days
    });
  };
  const sortByTime = items => {
    const toMin = t => {
      const m = (t || '').match(/^(\d{1,2}):(\d{2})/);
      return m ? +m[1] * 60 + +m[2] : Infinity;
    };
    return [...items].sort((a, b) => toMin(a.time) - toMin(b.time));
  };
  const saveStop = draft => {
    if (openStop.hotelOnly) {
      const hotelName = draft.en || (draft.title || '').replace(/\s*(체크인|체크아웃|숙박|입실|퇴실)\s*$/, '').trim() || '새 호텔';
      const newHotel = {
        name: hotelName,
        area: draft.loc || '',
        address: draft.note || '',
        checkinTime: draft.time || '15:00',
        hue: 30
      };
      const hotels = [...(trip.hotels || []), newHotel];
      const days = syncHotelToDays(trip.days, newHotel, null);
      editTrip({
        hotels,
        days
      });
      setOpenStop(null);
      return;
    }
    const days = [...trip.days];
    const items = [...days[dayIdx].items];
    let savedDraft = {
      ...draft
    };
    let hotels = [...(trip.hotels || [])];
    if (draft.cat === 'hotel') {
      // 호텔 이름: en 우선, 없으면 타이틀에서 한국어 접미사 제거
      const hotelName = draft.en || (draft.title || '').replace(/\s*(체크인|체크아웃|숙박|입실|퇴실)\s*$/, '').trim() || '숙소';
      if (draft._hotelRef) {
        // 기존 호텔 항목에 위치·메모·시간 역방향 동기화
        const hIdx = hotels.findIndex(h => h.name === draft._hotelRef);
        if (hIdx >= 0) {
          const prev = hotels[hIdx];
          const t = draft.title || '';
          const isIn = t.includes('체크인') || t.includes('입실');
          const isOut = t.includes('체크아웃') || t.includes('퇴실');
          hotels[hIdx] = {
            ...prev,
            area: draft.loc || prev.area,
            address: draft.note || prev.address,
            ...(isIn && draft.time ? {
              checkinTime: draft.time
            } : {}),
            ...(isOut && draft.time ? {
              checkoutTime: draft.time
            } : {})
          };
        }
      } else {
        // _hotelRef 없음 → 숙소 항목 자동 생성 후 스탑에 링크
        if (!hotels.find(h => h.name === hotelName)) {
          const day = days[dayIdx];
          const t2 = draft.title || '';
          const isIn = t2.includes('체크인') || t2.includes('입실');
          hotels.push({
            name: hotelName,
            area: draft.loc || '',
            address: draft.note || '',
            checkin: day.date || '',
            nights: 1,
            hue: 25,
            ...(isIn && draft.time ? {
              checkinTime: draft.time
            } : {})
          });
        }
        savedDraft = {
          ...draft,
          _hotelRef: hotelName
        };
      }
    }
    items[openStop.idx] = savedDraft;
    days[dayIdx] = {
      ...days[dayIdx],
      items: sortByTime(items)
    };
    editTrip({
      days,
      hotels
    });
    setOpenStop(null);
  };

  // ── Hotel ↔ Days sync ─────────────────────────────────
  // When a hotel has checkin/checkout dates+times, ensure day timelines
  // contain corresponding 'hotel' category items. Match day by date string.
  const normalizeDate = s => (s || '').replace(/,\s*\d{4}\s*$/, '').trim(); // strip year
  const syncHotelToDays = (days, hotel, prevHotel) => {
    if (!hotel) return days;
    let result = [...days];
    // Remove any existing items tagged as this hotel (by _hotelRef name)
    const prevName = prevHotel?.name;
    if (prevName) {
      result = result.map(d => ({
        ...d,
        items: d.items.filter(it => !(it._hotelRef === prevName))
      }));
    }
    // Also strip items tagged to the NEW name (in case of re-sync/rename collisions)
    result = result.map(d => ({
      ...d,
      items: d.items.filter(it => !(it._hotelRef === hotel.name))
    }));
    const findDay = dateStr => {
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
      const items = [...result[di].items, item].sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));
      result[di] = {
        ...result[di],
        items
      };
    };
    if (inIdx >= 0) {
      push(inIdx, {
        time: hotel.checkinTime || '15:00',
        cat: 'hotel',
        title: `${hotel.name} 체크인`,
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
        title: `${hotel.name} 체크아웃`,
        en: hotel.name,
        loc: hotel.area || '',
        note: hotel.address || '',
        _hotelRef: hotel.name
      });
    }
    // Intermediate nights: days strictly between checkin and checkout
    if (inIdx >= 0 && outIdx > inIdx + 1) {
      for (let di = inIdx + 1; di < outIdx; di++) {
        push(di, {
          time: '',
          cat: 'hotel',
          title: `${hotel.name} 숙박`,
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
  const editHotel = patch => {
    const hotels = [...(trip.hotels || [])];
    const prev = hotels[hotelIdx];
    const next = {
      ...prev,
      ...patch
    };
    hotels[hotelIdx] = next;
    const days = syncHotelToDays(trip.days, next, prev);
    editTrip({
      hotels,
      days
    });
  };
  const deleteHotel = i => {
    if (!confirm(`"${trip.hotels[i].name}" 숙소를 삭제할까요?`)) return;
    const prev = trip.hotels[i];
    const hotels = (trip.hotels || []).filter((_, j) => j !== i);
    // remove hotel items from days
    const days = trip.days.map(d => ({
      ...d,
      items: d.items.filter(it => it._hotelRef !== prev.name)
    }));
    editTrip({
      hotels,
      days
    });
  };
  const convertInlineHotel = h => {
    // 인라인 숙소를 trip.hotels에 추가하고 상세 화면 오픈
    const checkinDate = (h.checkin || '').split(' · ')[0];
    const newHotel = {
      name: h.name,
      area: h.area,
      checkin: checkinDate,
      nights: 1,
      hue: h.hue || 25
    };
    const hotels = [...(trip.hotels || []), newHotel];
    editTrip({
      hotels
    });
    savedHomeScrollY.current = window.scrollY;
    setHotelIdx(hotels.length - 1);
    setScrollKey(k => k + 1);
  };
  const reorderHotels = (from, to) => {
    const hotels = [...(trip.hotels || [])];
    const [moved] = hotels.splice(from, 1);
    hotels.splice(to, 0, moved);
    editTrip({
      hotels
    });
  };
  const addHotel = () => {
    const newHotel = {
      name: '새 호텔',
      area: '',
      checkin: '',
      checkout: '',
      nights: 1,
      hue: 30
    };
    const hotels = [...(trip.hotels || []), newHotel];
    editTrip({
      hotels
    });
    setHotelIdx(hotels.length - 1);
  };
  const addHotelViaStop = () => {
    setOpenStop({
      idx: -1,
      stop: {
        time: '15:00',
        cat: 'hotel',
        title: '',
        en: '',
        loc: '',
        note: ''
      },
      editing: true,
      hotelOnly: true
    });
  };
  const pickHotelFromSearch = name => {
    // name may be "Hotel Name (Area)"
    const m = name.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    const parsed = m ? {
      name: m[1],
      area: m[2]
    } : {
      name
    };
    if (hotelSheet === 'new') {
      const newHotel = {
        ...parsed,
        nights: 1,
        hue: 30
      };
      const hotels = [...(trip.hotels || []), newHotel];
      editTrip({
        hotels
      });
      setHotelIdx(hotels.length - 1);
    } else if (typeof hotelSheet === 'number') {
      const hotels = [...(trip.hotels || [])];
      const prev = hotels[hotelSheet];
      const next = {
        ...prev,
        ...parsed
      };
      hotels[hotelSheet] = next;
      const days = syncHotelToDays(trip.days, next, prev);
      editTrip({
        hotels,
        days
      });
    }
  };

  // ── HotelDetailSheet actions ───────────────────────────
  const saveHotelDetailSheet = draft => {
    if (hotelDetailSheet === 'new') {
      const newHotel = {
        hue: 30,
        ...draft
      };
      const hotels = [...(trip.hotels || []), newHotel];
      const days = syncHotelToDays(trip.days, newHotel, null);
      editTrip({
        hotels,
        days
      });
    } else if (typeof hotelDetailSheet === 'number') {
      const hotels = [...(trip.hotels || [])];
      const prev = hotels[hotelDetailSheet];
      const next = {
        ...prev,
        ...draft
      };
      hotels[hotelDetailSheet] = next;
      const days = syncHotelToDays(trip.days, next, prev);
      editTrip({
        hotels,
        days
      });
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
      screen = /*#__PURE__*/React.createElement(HotelDetailScreen, {
        hotel: trip.hotels[hotelIdx],
        onBack: () => {
          navGoingBack.current = true;
          setHotelIdx(null);
        },
        onEdit: editHotel,
        onOpenSearch: () => setHotelSheet(hotelIdx),
        editing: editing,
        setEditing: setEditing
      });
      label = 'Hotel';
    } else if (dayIdx !== null && trip) {
      screen = /*#__PURE__*/React.createElement(DayScreen, {
        trip: trip,
        dayIdx: dayIdx,
        onBack: () => {
          navGoingBack.current = true;
          setDayIdx(null);
        },
        onOpenStop: setOpenStop,
        onNavDay: i => {
          setDayIdx(i);
          setOpenStop(null);
          setScrollKey(k => k + 1);
        },
        onEditDay: editDay,
        onAddItem: addItem,
        onDeleteItem: deleteItem,
        onReorderItems: reorderItems,
        editing: editing,
        setEditing: setEditing
      });
      label = `Day ${dayIdx + 1}`;
    } else {
      screen = /*#__PURE__*/React.createElement(HomeScreen, {
        trip: trip,
        onBack: () => {
          setActiveTripId(null);
          setTrip(null);
          setEditing(false);
        },
        onOpenDay: i => {
          savedHomeScrollY.current = window.scrollY;
          setDayIdx(i);
          setScrollKey(k => k + 1);
        },
        onOpenHotel: i => {
          savedHomeScrollY.current = window.scrollY;
          setHotelIdx(i);
          setScrollKey(k => k + 1);
        },
        onOpenHotelSheet: i => setHotelDetailSheet(i),
        city: city,
        onPickCity: setCity,
        onEditTrip: editTrip,
        onReorderDays: reorderDays,
        onAddDay: addDay,
        onDeleteDay: deleteDay,
        onAddHotel: addHotel,
        onAddHotelViaStop: addHotelViaStop,
        onAddHotelFromSearch: () => setHotelSheet('new'),
        onDeleteHotel: deleteHotel,
        onReorderHotels: reorderHotels,
        onConvertInlineHotel: convertInlineHotel,
        onAddItemToFirstDay: addItemToFirstDay,
        editing: editing,
        setEditing: setEditing,
        userData: userData,
        onOpenCompanion: () => setProfileSheetOpen(true),
        onOpenNotifs: () => setNotifOpen(true),
        unreadCount: unreadCount,
        onLoadSample: async () => {
          const def = JSON.parse(JSON.stringify(window.TRIP_DEFAULT));
          const patch = {
            title: def.title || '내 여행',
            dates: def.dates || '',
            hotel: def.hotel || '',
            days: def.days || [],
            hotels: def.hotels || [],
            food: def.food || []
          };
          // Firestore에 저장 (실패 시 오류를 그대로 throw → HomeScreen에서 처리)
          await window.fbSaveGroup(activeTripId, patch);
          // 리스너를 기다리지 않고 로컬 상태 즉시 업데이트
          setTrip(prev => normalizeTrip({
            ...prev,
            ...patch
          }, activeTripId));
        }
      });
      label = 'Home';
    }
  } else if (tab === 'map') {
    const editMapItem = (dayIdx, itemIdx, patch) => {
      const days = trip.days.map((d, di) => di !== dayIdx ? d : {
        ...d,
        items: d.items.map((it, ii) => ii !== itemIdx ? it : {
          ...it,
          ...patch
        })
      });
      editTrip({
        days
      });
    };
    screen = /*#__PURE__*/React.createElement(MapScreen, {
      trip: trip,
      onEditItem: editMapItem
    });
    label = 'Map';
  } else if (tab === 'food') {
    screen = /*#__PURE__*/React.createElement(FoodScreen, {
      trip: trip,
      onEditFood: food => editTrip({
        food
      }),
      editing: editing,
      setEditing: setEditing
    });
    label = 'Food';
  } else if (tab === 'budget') {
    screen = /*#__PURE__*/React.createElement(BudgetScreen, {
      trip: trip,
      onEditBudget: b => editTrip({
        budget: {
          ...(trip.budget || {}),
          ...b
        }
      }),
      onSheetChange: setBudgetSheetOpen
    });
    label = 'Budget';
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
  const dayHue = dayIdx !== null && trip ? trip.days[dayIdx]?.hero?.hue ?? 30 : 30;

  // ── Auth gating ───────────────────────────────────────────
  // 로그인 버튼 누른 후 데이터 준비될 때까지 스플래시 표시
  const showSplash = loginPending && (authState !== 'in' || trip === null);
  if (showSplash) return /*#__PURE__*/React.createElement(SplashScreen, {
    visible: true
  });
  if (authState === 'loading') return null;
  if (authState === 'out') return /*#__PURE__*/React.createElement(LoginScreen, {
    errorMsg: loginError,
    onLoginStart: () => setLoginPending(true)
  });

  // ── 여행 목록 화면 ─────────────────────────────────────────
  if (!activeTripId) return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TripsScreen, {
    trips: userTrips,
    loading: tripsLoading,
    userData: userData,
    myUid: authUser?.uid,
    onOpenCompanion: () => setProfileSheetOpen(true),
    onOpenNotifs: () => setNotifOpen(true),
    unreadCount: unreadCount,
    onSelect: id => {
      const found = userTrips.find(t => t.id === id);
      let tripToShow = found;
      // days 없으면 TRIP_DEFAULT로 즉시 채워서 표시
      if (found && !found.days?.length) {
        const def = JSON.parse(JSON.stringify(window.TRIP_DEFAULT));
        tripToShow = normalizeTrip({
          ...found,
          title: def.title || found.title,
          dates: def.dates || '',
          hotel: def.hotel || '',
          days: def.days || [],
          hotels: def.hotels || [],
          food: def.food || []
        }, id);
        fbSaveGroup(id, {
          title: tripToShow.title,
          dates: tripToShow.dates,
          hotel: tripToShow.hotel,
          days: tripToShow.days,
          hotels: tripToShow.hotels,
          food: tripToShow.food
        }).catch(() => {});
      }
      if (tripToShow) {
        tripRef.current = tripToShow;
        setTrip(tripToShow);
      }
      setActiveTripId(id);
      setTab('home');
      setDayIdx(null);
      setHotelIdx(null);
      setEditing(false);
      // Firestore에서 직접 읽어 최신 데이터로 보장 (days 있을 때만 반영)
      fbLoadTrips([id]).then(trips => {
        if (!trips || !trips.length) return;
        const fresh = normalizeTrip(trips[0], id);
        if (fresh.days?.length) {
          tripRef.current = fresh;
          setTrip(fresh);
        }
      }).catch(() => {});
    },
    onAdd: async () => {
      const title = prompt('여행 이름을 입력해 주세요\n(예: 뉴욕, 파리 7박)');
      if (!title) return;
      const {
        tripId,
        hue
      } = await fbCreateNewTrip(userData.uid, title);
      setUserTrips(prev => [...prev, {
        id: tripId,
        title,
        dates: '',
        days: [],
        hotels: [],
        members: [userData.uid],
        hue
      }]);
      setActiveTripId(tripId);
      setTab('home');
      setDayIdx(null);
      setHotelIdx(null);
    },
    onRestore: async () => {
      const def = JSON.parse(JSON.stringify(window.TRIP_DEFAULT));
      const patch = {
        title: def.title || 'New York',
        dates: def.dates || '',
        hotel: def.hotel || '',
        days: def.days || [],
        hotels: def.hotels || [],
        food: def.food || []
      };
      const hue = def.days?.[0]?.hero?.hue ?? 25;
      const {
        tripId
      } = await window.fbCreateNewTrip(userData.uid, patch.title);
      await window.fbSaveGroup(tripId, patch);
      const newTrip = normalizeTrip({
        ...patch,
        members: [userData.uid],
        hue
      }, tripId);
      setUserTrips(prev => [...prev, newTrip]);
      setActiveTripId(tripId);
      setTrip(newTrip);
      setTab('home');
      setDayIdx(null);
      setHotelIdx(null);
      setEditing(false);
    },
    onShare: t => setShareTripTarget(t),
    onDelete: deleteTrip
  }), /*#__PURE__*/React.createElement(ShareTripSheet, {
    open: !!shareTripTarget,
    onClose: () => setShareTripTarget(null),
    trip: shareTripTarget,
    userData: userData,
    allTrips: userTrips,
    myUid: authUser?.uid
  }), /*#__PURE__*/React.createElement(ProfileSheet, {
    open: profileSheetOpen,
    onClose: () => setProfileSheetOpen(false),
    authUser: authUser,
    trips: userTrips,
    onAddCompanion: tripId => setAddCompanionOpen(tripId || false),
    onViewCompanions: () => {
      setProfileSheetOpen(false);
      setCompanionsScreenOpen(true);
    }
  }), /*#__PURE__*/React.createElement(AddCompanionSheet, {
    open: addCompanionOpen !== null,
    onClose: () => setAddCompanionOpen(null),
    authUser: authUser,
    userData: userData,
    trips: userTrips,
    defaultTripId: addCompanionOpen || null,
    onUserDataUpdate: ud => setUserData(ud)
  }), /*#__PURE__*/React.createElement(CompanionsScreen, {
    open: companionsScreenOpen,
    onClose: () => setCompanionsScreenOpen(false),
    authUser: authUser,
    userData: userData,
    trips: userTrips
  }), /*#__PURE__*/React.createElement(NotificationsScreen, {
    open: notifOpen,
    onClose: () => setNotifOpen(false),
    authUser: authUser,
    notifications: notifs
  }));
  if (!trip || !trip.days?.length) return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTripId(null);
      setTrip(null);
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
      fontSize: 15,
      color: '#fff'
    }
  }, "\u2190 My Trips"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#C0392B',
      borderRadius: 16,
      padding: '20px 24px',
      maxWidth: 320,
      textAlign: 'center',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 14,
      color: '#fff',
      lineHeight: 2.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      marginBottom: 4
    }
  }, "\uC77C\uC815 \uC5C6\uC74C"), /*#__PURE__*/React.createElement("div", null, "tripId: ", activeTripId ? activeTripId.slice(0, 12) + '…' : 'none'), /*#__PURE__*/React.createElement("div", null, "trip: ", trip ? 'exists, days=' + (trip.days?.length || 0) : 'null'), /*#__PURE__*/React.createElement("div", null, "userTrips: ", userTrips.length, "\uAC1C"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      marginTop: 4,
      opacity: 0.8
    }
  }, "v162"))), /*#__PURE__*/React.createElement("button", {
    onClick: async () => {
      try {
        const ts = await fbLoadTrips([activeTripId]);
        if (ts?.[0] && (ts[0].days || []).length > 0) {
          const t = normalizeTrip(ts[0], activeTripId);
          tripRef.current = t;
          setTrip(t);
          return;
        }
        const def = JSON.parse(JSON.stringify(window.TRIP_DEFAULT));
        const patch = {
          title: def.title || 'New York',
          dates: def.dates || '',
          hotel: def.hotel || '',
          days: def.days || [],
          hotels: def.hotels || [],
          food: def.food || []
        };
        await fbSaveGroup(activeTripId, patch);
        const restored = normalizeTrip({
          ...patch
        }, activeTripId);
        tripRef.current = restored;
        setTrip(restored);
      } catch (e) {
        const def = JSON.parse(JSON.stringify(window.TRIP_DEFAULT));
        const restored = normalizeTrip({
          ...def
        }, activeTripId);
        tripRef.current = restored;
        setTrip(restored);
      }
    },
    style: {
      padding: '16px 32px',
      background: '#C0392B',
      border: 'none',
      borderRadius: 14,
      color: '#fff',
      fontFamily: SANS,
      fontSize: 16,
      fontWeight: 700,
      cursor: 'pointer',
      width: '100%',
      maxWidth: 280
    }
  }, "\uC77C\uC815 \uBD88\uB7EC\uC624\uAE30 / \uBCF5\uC6D0"));

  // Figure out what "back" means in the current state, for swipe-from-edge.
  let swipeBack = null;
  if (tab === 'home') {
    if (hotelIdx !== null) swipeBack = () => {
      navGoingBack.current = true;
      setHotelIdx(null);
    };else if (dayIdx !== null) swipeBack = () => {
      navGoingBack.current = true;
      setDayIdx(null);
    };
  }
  swipeBackRef.current = swipeBack;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      fontFamily: '-apple-system, system-ui, sans-serif',
      background: '#F5F2EC'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    key: slideKey,
    style: {
      animation: slideDir ? `tab${slideDir === 'from-right' ? 'SlideFromRight' : 'SlideFromLeft'} 0.28s cubic-bezier(0.22,1,0.36,1)` : 'none'
    },
    onAnimationEnd: () => setSlideDir(null)
  }, /*#__PURE__*/React.createElement(SwipeBackLayer, {
    onBack: swipeBack
  }, screen))), /*#__PURE__*/React.createElement(TabBar, {
    tab: tab,
    setTab: changeTab,
    visible: tabBarVisible && !openStop && !profileSheetOpen && !hotelSheet && !hotelDetailSheet && !saveConfirm && !budgetSheetOpen,
    editing: editing,
    canEdit: canEdit,
    onToggleEdit: handleEditToggle
  }), /*#__PURE__*/React.createElement(StopSheet, {
    open: openStop,
    dayHue: dayHue,
    onClose: () => setOpenStop(null),
    onSave: saveStop
  }), /*#__PURE__*/React.createElement(HotelSheet, {
    open: hotelDetailSheet !== null,
    onClose: () => setHotelDetailSheet(null),
    hotel: typeof hotelDetailSheet === 'number' ? trip?.hotels?.[hotelDetailSheet] || null : null,
    trip: trip,
    tripDays: trip?.days,
    onSave: saveHotelDetailSheet,
    onDelete: deleteHotelDetailSheet
  }), hotelSheet !== null && /*#__PURE__*/React.createElement(HotelSearchSheet, {
    COLORS: COLORS,
    SERIF: SERIF,
    SANS: SANS,
    MONO: MONO,
    Icon: Icon,
    onPick: pickHotelFromSearch,
    onClose: () => setHotelSheet(null)
  }), /*#__PURE__*/React.createElement(ProfileSheet, {
    open: profileSheetOpen,
    onClose: () => setProfileSheetOpen(false),
    authUser: authUser,
    trips: userTrips,
    onAddCompanion: tripId => setAddCompanionOpen(tripId || false),
    onViewCompanions: () => {
      setProfileSheetOpen(false);
      setCompanionsScreenOpen(true);
    }
  }), /*#__PURE__*/React.createElement(AddCompanionSheet, {
    open: addCompanionOpen !== null,
    onClose: () => setAddCompanionOpen(null),
    authUser: authUser,
    userData: userData,
    trips: userTrips,
    defaultTripId: addCompanionOpen || null,
    onUserDataUpdate: ud => setUserData(ud)
  }), /*#__PURE__*/React.createElement(CompanionsScreen, {
    open: companionsScreenOpen,
    onClose: () => setCompanionsScreenOpen(false),
    authUser: authUser,
    userData: userData,
    trips: userTrips
  }), /*#__PURE__*/React.createElement(NotificationsScreen, {
    open: notifOpen,
    onClose: () => setNotifOpen(false),
    authUser: authUser,
    notifications: notifs
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
    onClick: () => setSaveConfirm(false),
    style: {
      flex: 1,
      padding: '13px',
      border: `1.5px solid ${COLORS.line}`,
      borderRadius: 14,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: SANS,
      fontSize: 14,
      color: COLORS.mute
    }
  }, "\uACC4\uC18D \uC218\uC815"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
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
