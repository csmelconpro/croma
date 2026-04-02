import { useState, useMemo } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#13151c",        // slightly lighter blue-grey
  surface: "#1c1f2e",
  surface2: "#232638",
  border: "#2a2d42",
  red: "#e8353a",
  green: "#22c55e",
  gold: "#f0c040",
  text: "#e8eaf2",
  textDim: "#6b7280",
  accent: "#f97316",
};

// ─── TEAM DATA ────────────────────────────────────────────────────────────────
const TEAMS = {
  "Deportivo Alavés":   { primary:"#1a3a6b", secondary:"#ffffff", abbr:"ALA" },
  "Athletic Club":      { primary:"#c8102e", secondary:"#ffffff", abbr:"ATH" },
  "Atlético de Madrid": { primary:"#c8102e", secondary:"#002d62", abbr:"ATM" },
  "FC Barcelona":       { primary:"#a50044", secondary:"#004d98", abbr:"BAR" },
  "Real Betis":         { primary:"#00954c", secondary:"#ffffff", abbr:"BET" },
  "RC Celta":           { primary:"#6ecef5", secondary:"#ffffff", abbr:"CEL" },
  "Elche CF":           { primary:"#007340", secondary:"#ffffff", abbr:"ELC" },
  "RCD Espanyol":       { primary:"#003da5", secondary:"#ffffff", abbr:"ESP" },
  "Getafe CF":          { primary:"#005ca9", secondary:"#ffffff", abbr:"GET" },
  "Girona FC":          { primary:"#cc0000", secondary:"#ffffff", abbr:"GIR" },
  "Levante UD":         { primary:"#004fa3", secondary:"#c8102e", abbr:"LEV" },
  "Real Madrid":        { primary:"#d4af37", secondary:"#1a1a2e", abbr:"RMA" },
  "RCD Mallorca":       { primary:"#c8102e", secondary:"#1a1a1a", abbr:"MAL" },
  "CA Osasuna":         { primary:"#c8102e", secondary:"#003da5", abbr:"OSA" },
  "Real Oviedo":        { primary:"#003da5", secondary:"#ffffff", abbr:"OVI" },
  "Rayo Vallecano":     { primary:"#cc0000", secondary:"#ffffff", abbr:"RAY" },
  "Real Sociedad":      { primary:"#003da5", secondary:"#ffffff", abbr:"RSO" },
  "Sevilla FC":         { primary:"#c8102e", secondary:"#ffffff", abbr:"SEV" },
  "Valencia CF":        { primary:"#f5a623", secondary:"#1a1a1a", abbr:"VAL" },
  "Villarreal CF":      { primary:"#f5c500", secondary:"#1a1a1a", abbr:"VIL" },
};

// ─── MINI SHIELD SVG ─────────────────────────────────────────────────────────
function Shield({ team, size = 32 }) {
  const t = TEAMS[team] || { primary:"#444", secondary:"#888", abbr:(team||"?").slice(0,3).toUpperCase() };
  const s = size;
  const abbr = t.abbr;
  // Shield shape: pointed bottom
  const shield = `M${s*0.1},${s*0.08} L${s*0.9},${s*0.08} L${s*0.9},${s*0.62} Q${s*0.9},${s*0.85} ${s*0.5},${s*0.96} Q${s*0.1},${s*0.85} ${s*0.1},${s*0.62} Z`;
  const stripe = `M${s*0.1},${s*0.08} L${s*0.5},${s*0.08} L${s*0.5},${s*0.96} Q${s*0.1},${s*0.85} ${s*0.1},${s*0.62} Z`;
  const fontSize = s * 0.22;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{flexShrink:0}}>
      <path d={shield} fill={t.primary}/>
      <path d={stripe} fill={t.secondary} opacity="0.25"/>
      <path d={shield} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <text x={s*0.5} y={s*0.62} textAnchor="middle" dominantBaseline="middle"
        fontSize={fontSize} fontWeight="800" fill="#fff"
        style={{fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif",letterSpacing:"-0.5px",textShadow:"0 1px 2px rgba(0,0,0,0.8)"}}>
        {abbr}
      </text>
    </svg>
  );
}

// ─── CROMA APP ICON ──────────────────────────────────────────────────────────
function CromaIcon({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140">
      <rect width="140" height="140" rx="34" fill="#0a0a0a"/>
      <rect x="3" y="3" width="134" height="134" rx="32" fill="none"
        stroke="#cbd5e1" strokeWidth="3.5" opacity="0.6"/>
      <text x="72" y="78" textAnchor="middle" dominantBaseline="middle"
        fontFamily="'Dela Gothic One',sans-serif"
        fontSize="100" fill="#cbd5e1">C</text>
    </svg>
  );
}

// ─── LA LIGA ICON (inspired by rotating segments + ball) ─────────────────────
// ─── CROMA APP ICON ──────────────────────────────────────────────────────────
) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 140 140" fill="none">
      <rect width="140" height="140" rx="34" fill="#0a0a0a"/>
      <rect x="3" y="3" width="134" height="134" rx="32"
        fill="none" stroke="#cbd5e1" strokeWidth="3.5" opacity="0.6"/>
      <text x="72" y="78" textAnchor="middle" dominantBaseline="middle"
        fontFamily="'Dela Gothic One',sans-serif"
        fontSize="100" fill="#cbd5e1">C</text>
    </svg>
  );
}

function LaLigaIcon({ size = 46 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.42, ballR = size * 0.18;
  // 6 arc segments, each ~50deg with 10deg gap, in our orange palette
  const segs = [
    { start: -90, end: -40, color: "#f97316" },
    { start: -30, end: 20,  color: "#fb923c" },
    { start: 30,  end: 80,  color: "#fdba74" },
    { start: 90,  end: 140, color: "#f97316" },
    { start: 150, end: 200, color: "#ea580c" },
    { start: 210, end: 260, color: "#c2410c" },
  ];
  function arcPath(startDeg, endDeg, outerR, innerR) {
    const toRad = d => (d * Math.PI) / 180;
    const x1 = cx + outerR * Math.cos(toRad(startDeg));
    const y1 = cy + outerR * Math.sin(toRad(startDeg));
    const x2 = cx + outerR * Math.cos(toRad(endDeg));
    const y2 = cy + outerR * Math.sin(toRad(endDeg));
    const ix1 = cx + innerR * Math.cos(toRad(endDeg));
    const iy1 = cy + innerR * Math.sin(toRad(endDeg));
    const ix2 = cx + innerR * Math.cos(toRad(startDeg));
    const iy2 = cy + innerR * Math.sin(toRad(startDeg));
    return `M${x1},${y1} A${outerR},${outerR} 0 0,1 ${x2},${y2} L${ix1},${iy1} A${innerR},${innerR} 0 0,0 ${ix2},${iy2} Z`;
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      <rect width={size} height={size} rx={size*0.22} fill="#1c1f2e"/>
      {segs.map((s,i) => (
        <path key={i} d={arcPath(s.start, s.end, r, r*0.48)} fill={s.color} opacity="0.95"/>
      ))}
      <circle cx={cx} cy={cy} r={ballR} fill="#0f1117"/>
      <circle cx={cx} cy={cy} r={ballR} fill="none" stroke={T.accent} strokeWidth="1.2"/>
      {/* simple pentagon patches */}
      <polygon points={`${cx},${cy-ballR*0.45} ${cx+ballR*0.42},${cy-ballR*0.14} ${cx+ballR*0.26},${cy+ballR*0.37} ${cx-ballR*0.26},${cy+ballR*0.37} ${cx-ballR*0.42},${cy-ballR*0.14}`}
        fill="none" stroke={T.accent} strokeWidth="0.8" opacity="0.7"/>
    </svg>
  );
}

function MundialIcon({ size = 46 }) {
  const cx = size/2, cy = size/2;
  const s = size;
  // Trophy shape inspired by FIFA World Cup
  const trophyBody = `M${s*0.35},${s*0.72} L${s*0.65},${s*0.72} L${s*0.6},${s*0.55} Q${s*0.7},${s*0.42} ${s*0.68},${s*0.28} Q${s*0.5},${s*0.22} ${s*0.32},${s*0.28} Q${s*0.3},${s*0.42} ${s*0.4},${s*0.55} Z`;
  const handles = `M${s*0.32},${s*0.32} Q${s*0.2},${s*0.32} ${s*0.2},${s*0.44} Q${s*0.2},${s*0.52} ${s*0.32},${s*0.5} M${s*0.68},${s*0.32} Q${s*0.8},${s*0.32} ${s*0.8},${s*0.44} Q${s*0.8},${s*0.52} ${s*0.68},${s*0.5}`;
  const base = `M${s*0.3},${s*0.75} L${s*0.7},${s*0.75} L${s*0.65},${s*0.82} L${s*0.35},${s*0.82} Z`;
  const stem = `M${s*0.43},${s*0.72} L${s*0.43},${s*0.75} M${s*0.57},${s*0.72} L${s*0.57},${s*0.75}`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <defs>
        <linearGradient id="wg2" x1="0" y1="0" x2={s} y2={s} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#166534"/>
          <stop offset="50%" stopColor="#15803d"/>
          <stop offset="100%" stopColor="#7e22ce"/>
        </linearGradient>
      </defs>
      <rect width={size} height={size} rx={size*0.22} fill="url(#wg2)"/>
      <path d={trophyBody} fill="rgba(255,255,255,0.9)"/>
      <path d={handles} stroke="rgba(255,255,255,0.8)" strokeWidth={s*0.04} fill="none" strokeLinecap="round"/>
      <path d={base} fill="rgba(255,255,255,0.85)"/>
      <line x1={s*0.43} y1={s*0.72} x2={s*0.43} y2={s*0.75} stroke="rgba(255,255,255,0.7)" strokeWidth={s*0.04}/>
      <line x1={s*0.57} y1={s*0.72} x2={s*0.57} y2={s*0.75} stroke="rgba(255,255,255,0.7)" strokeWidth={s*0.04}/>
      {/* stars */}
      <circle cx={s*0.38} cy={s*0.17} r={s*0.035} fill="rgba(255,220,50,0.9)"/>
      <circle cx={s*0.5} cy={s*0.14} r={s*0.035} fill="rgba(255,220,50,0.9)"/>
      <circle cx={s*0.62} cy={s*0.17} r={s*0.035} fill="rgba(255,220,50,0.9)"/>
    </svg>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const LALIGA_CARDS = [
  {id:1,num:"1",name:"Escudo",team:"Deportivo Alavés",section:"Regulares",owned:false},
  {id:2,num:"1 Bis",name:"Stadium Card - Mendizorroza",team:"Deportivo Alavés",section:"Regulares",owned:true},
  {id:3,num:"2",name:"Sivera - Capitán",team:"Deportivo Alavés",section:"Regulares",owned:true},
  {id:4,num:"3",name:"Raúl Fernández",team:"Deportivo Alavés",section:"Regulares",owned:false},
  {id:5,num:"4",name:"Johny",team:"Deportivo Alavés",section:"Regulares",owned:true},
  {id:6,num:"5",name:"Tenaglia",team:"Deportivo Alavés",section:"Regulares",owned:true},
  {id:7,num:"6",name:"Pacheco",team:"Deportivo Alavés",section:"Regulares",owned:true},
  {id:8,num:"7",name:"Parada",team:"Deportivo Alavés",section:"Regulares",owned:true},
  {id:9,num:"7 Bis",name:"Garcés - Actualización Plus",team:"Deportivo Alavés",section:"Plus / Bis",owned:false},
  {id:10,num:"8",name:"Moussa Diarra",team:"Deportivo Alavés",section:"Regulares",owned:true},
  {id:11,num:"9",name:"Blanco",team:"Deportivo Alavés",section:"Regulares",owned:false},
  {id:12,num:"10",name:"Guevara",team:"Deportivo Alavés",section:"Regulares",owned:false},
  {id:13,num:"11",name:"Gutidi",team:"Deportivo Alavés",section:"Regulares",owned:false},
  {id:14,num:"12",name:"Aleñá",team:"Deportivo Alavés",section:"Regulares",owned:true},
  {id:15,num:"13",name:"Pablo Ibáñez",team:"Deportivo Alavés",section:"Regulares",owned:true},
  {id:16,num:"14",name:"Denis Suárez",team:"Deportivo Alavés",section:"Regulares",owned:false},
  {id:17,num:"15",name:"Carlos Vicente",team:"Deportivo Alavés",section:"Regulares",owned:false},
  {id:18,num:"15 Bis",name:"Ángel Pérez - Actualización Plus",team:"Deportivo Alavés",section:"Plus / Bis",owned:false},
  {id:19,num:"16",name:"Toni Martínez",team:"Deportivo Alavés",section:"Regulares",owned:false},
  {id:20,num:"16 Bis",name:"Calebe - Box Serie Oro",team:"Deportivo Alavés",section:"Plus / Bis",owned:true},
  {id:21,num:"17",name:"Boyé",team:"Deportivo Alavés",section:"Regulares",owned:false},
  {id:22,num:"18",name:"Mariano",team:"Deportivo Alavés",section:"Regulares",owned:true},
  {id:23,num:"18 Bis",name:"Abde - Pocket Box Platinum",team:"Deportivo Alavés",section:"Plus / Bis",owned:true},
  {id:24,num:"19",name:"Escudo",team:"Athletic Club",section:"Regulares",owned:true},
  {id:25,num:"19 Bis",name:"Stadium Card - San Mamés",team:"Athletic Club",section:"Regulares",owned:true},
  {id:26,num:"20",name:"Unai Simón",team:"Athletic Club",section:"Regulares",owned:true},
  {id:27,num:"21",name:"Padilla",team:"Athletic Club",section:"Regulares",owned:false},
  {id:28,num:"22",name:"Areso",team:"Athletic Club",section:"Regulares",owned:false},
  {id:29,num:"22 Bis",name:"Gorosabel - Actualización Plus",team:"Athletic Club",section:"Plus / Bis",owned:false},
  {id:30,num:"23",name:"Vivian",team:"Athletic Club",section:"Regulares",owned:true},
  {id:31,num:"24",name:"Paredes",team:"Athletic Club",section:"Regulares",owned:false},
  {id:32,num:"25",name:"Laporte",team:"Athletic Club",section:"Regulares",owned:true},
  {id:33,num:"26",name:"Yuri",team:"Athletic Club",section:"Regulares",owned:true},
  {id:34,num:"27",name:"Ruiz de Galarreta",team:"Athletic Club",section:"Regulares",owned:true},
  {id:35,num:"28",name:"Jauregizar",team:"Athletic Club",section:"Regulares",owned:true},
  {id:36,num:"29",name:"Vesga",team:"Athletic Club",section:"Regulares",owned:true},
  {id:37,num:"30",name:"Unai Gómez",team:"Athletic Club",section:"Regulares",owned:true},
  {id:38,num:"30 Bis",name:"Rego - Pocket Box Platinum",team:"Athletic Club",section:"Plus / Bis",owned:true},
  {id:39,num:"31",name:"Sancet",team:"Athletic Club",section:"Regulares",owned:true},
  {id:40,num:"32",name:"Berenguer",team:"Athletic Club",section:"Regulares",owned:true},
  {id:41,num:"32 Bis",name:"Robert Navarro - Sobre Premium Oro",team:"Athletic Club",section:"Plus / Bis",owned:true},
  {id:42,num:"33",name:"Williams - Capitán",team:"Athletic Club",section:"Regulares",owned:true},
  {id:43,num:"34",name:"Maroan",team:"Athletic Club",section:"Regulares",owned:false},
  {id:44,num:"35",name:"Guruzeta",team:"Athletic Club",section:"Regulares",owned:true},
  {id:45,num:"36",name:"Nico Williams",team:"Athletic Club",section:"Regulares",owned:true},
  {id:46,num:"37",name:"Escudo",team:"Atlético de Madrid",section:"Regulares",owned:false},
  {id:47,num:"37 Bis",name:"Stadium Card - Metropolitano",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:48,num:"38",name:"Oblak",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:49,num:"39",name:"Musso",team:"Atlético de Madrid",section:"Regulares",owned:false},
  {id:50,num:"40",name:"Marcos Llorente",team:"Atlético de Madrid",section:"Regulares",owned:false},
  {id:51,num:"41",name:"Le Normand",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:52,num:"41 Bis",name:"Pubill - Actualización Plus",team:"Atlético de Madrid",section:"Plus / Bis",owned:false},
  {id:53,num:"42",name:"Lenglet",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:54,num:"42 Bis",name:"Giménez - Sobre Premium Oro",team:"Atlético de Madrid",section:"Plus / Bis",owned:true},
  {id:55,num:"43",name:"Hancko",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:56,num:"44",name:"Ruggeri",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:57,num:"44 Bis",name:"Galán - Pocket Box Platinum",team:"Atlético de Madrid",section:"Plus / Bis",owned:true},
  {id:58,num:"45",name:"Koke - Capitán",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:59,num:"46",name:"Barrios",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:60,num:"46 Bis",name:"Obed Vargas - Actualización Plus",team:"Atlético de Madrid",section:"Plus / Bis",owned:false},
  {id:61,num:"47",name:"Gallagher",team:"Atlético de Madrid",section:"Regulares",owned:false},
  {id:62,num:"47 Bis",name:"Johny Cardoso - Box Serie Oro",team:"Atlético de Madrid",section:"Plus / Bis",owned:true},
  {id:63,num:"48",name:"Álex Baena",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:64,num:"48 Bis",name:"Rodri Mendoza - Actualización Plus",team:"Atlético de Madrid",section:"Plus / Bis",owned:false},
  {id:65,num:"49",name:"Almada",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:66,num:"50",name:"Nico González",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:67,num:"51",name:"Giuliano",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:68,num:"51 Bis",name:"Raspadori - Pocket Box Platinum",team:"Atlético de Madrid",section:"Plus / Bis",owned:true},
  {id:69,num:"52",name:"Julián Álvarez",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:70,num:"53",name:"Sørloth",team:"Atlético de Madrid",section:"Regulares",owned:true},
  {id:71,num:"54",name:"Griezmann",team:"Atlético de Madrid",section:"Regulares",owned:false},
  {id:72,num:"54 Bis",name:"Lookman - Actualización Plus",team:"Atlético de Madrid",section:"Plus / Bis",owned:false},
  {id:73,num:"55",name:"Escudo",team:"FC Barcelona",section:"Regulares",owned:true},
  {id:74,num:"55 Bis",name:"Stadium Card - Spotify Nou Camp",team:"FC Barcelona",section:"Regulares",owned:false},
  {id:75,num:"56",name:"Joan García",team:"FC Barcelona",section:"Regulares",owned:true},
  {id:76,num:"57",name:"Szczęsny",team:"FC Barcelona",section:"Regulares",owned:true},
  {id:77,num:"58",name:"Koundé",team:"FC Barcelona",section:"Regulares",owned:false},
  {id:78,num:"58 Bis",name:"Joao Cancelo - Actualización Plus",team:"FC Barcelona",section:"Plus / Bis",owned:false},
  {id:79,num:"59",name:"Cubarsí",team:"FC Barcelona",section:"Regulares",owned:false},
  {id:80,num:"60",name:"Eric García",team:"FC Barcelona",section:"Regulares",owned:true},
  {id:81,num:"60 Bis",name:"Gerard Martín - Box Serie Oro",team:"FC Barcelona",section:"Plus / Bis",owned:true},
  {id:82,num:"61",name:"Araújo - Capitán",team:"FC Barcelona",section:"Regulares",owned:true},
  {id:83,num:"62",name:"Balde",team:"FC Barcelona",section:"Regulares",owned:true},
  {id:84,num:"63",name:"De Jong",team:"FC Barcelona",section:"Regulares",owned:false},
  {id:85,num:"64",name:"Gavi",team:"FC Barcelona",section:"Regulares",owned:true},
  {id:86,num:"64 Bis",name:"Casadó - Pocket Box Platinum",team:"FC Barcelona",section:"Plus / Bis",owned:true},
  {id:87,num:"65",name:"Pedri",team:"FC Barcelona",section:"Regulares",owned:false},
  {id:88,num:"66",name:"Fermín",team:"FC Barcelona",section:"Regulares",owned:true},
  {id:89,num:"67",name:"Dani Olmo",team:"FC Barcelona",section:"Regulares",owned:true},
  {id:90,num:"68",name:"Raphinha",team:"FC Barcelona",section:"Regulares",owned:false},
  {id:91,num:"69",name:"Lamine Yamal",team:"FC Barcelona",section:"Regulares",owned:true},
  {id:92,num:"70",name:"Ferran Torres",team:"FC Barcelona",section:"Regulares",owned:false},
  {id:93,num:"70 Bis",name:"Bardghji - Pocket Box Platinum",team:"FC Barcelona",section:"Plus / Bis",owned:true},
  {id:94,num:"71",name:"Lewandowski",team:"FC Barcelona",section:"Regulares",owned:false},
  {id:95,num:"72",name:"Rashford",team:"FC Barcelona",section:"Regulares",owned:true},
  {id:96,num:"73",name:"Escudo",team:"Real Betis",section:"Regulares",owned:true},
  {id:97,num:"73 Bis",name:"Stadium Card - La Cartuja",team:"Real Betis",section:"Regulares",owned:true},
  {id:98,num:"74",name:"Pau López",team:"Real Betis",section:"Regulares",owned:true},
  {id:99,num:"75",name:"Valles",team:"Real Betis",section:"Regulares",owned:true},
  {id:100,num:"76",name:"Bellerín",team:"Real Betis",section:"Regulares",owned:true},
  {id:101,num:"76 Bis",name:"Aitor Ruibal - Actualización Plus",team:"Real Betis",section:"Plus / Bis",owned:false},
  {id:102,num:"77",name:"Bartra",team:"Real Betis",section:"Regulares",owned:true},
  {id:103,num:"78",name:"Diego Llorente",team:"Real Betis",section:"Regulares",owned:true},
  {id:104,num:"79",name:"Natan",team:"Real Betis",section:"Regulares",owned:true},
  {id:105,num:"80",name:"Valentín Gómez",team:"Real Betis",section:"Regulares",owned:false},
  {id:106,num:"81",name:"Junior",team:"Real Betis",section:"Regulares",owned:true},
  {id:107,num:"82",name:"Altimira",team:"Real Betis",section:"Regulares",owned:false},
  {id:108,num:"82 Bis",name:"Deossa - Box Serie Oro",team:"Real Betis",section:"Plus / Bis",owned:true},
  {id:109,num:"83",name:"Amrabat",team:"Real Betis",section:"Regulares",owned:false},
  {id:110,num:"84",name:"Pablo Fornals",team:"Real Betis",section:"Regulares",owned:true},
  {id:111,num:"84 Bis",name:"Fidalgo - Actualización Plus",team:"Real Betis",section:"Plus / Bis",owned:false},
  {id:112,num:"85",name:"Lo Celso",team:"Real Betis",section:"Regulares",owned:false},
  {id:113,num:"85 Bis",name:"Marc Roca - Sobre Premium Oro",team:"Real Betis",section:"Plus / Bis",owned:true},
  {id:114,num:"86",name:"Isco - Capitán",team:"Real Betis",section:"Regulares",owned:true},
  {id:115,num:"87",name:"Antony",team:"Real Betis",section:"Regulares",owned:false},
  {id:116,num:"88",name:"Cucho Hernández",team:"Real Betis",section:"Regulares",owned:true},
  {id:117,num:"89",name:"Riquelme",team:"Real Betis",section:"Regulares",owned:false},
  {id:118,num:"89 Bis",name:"Pablo García - Pocket Box Platinum",team:"Real Betis",section:"Plus / Bis",owned:true},
  {id:119,num:"90",name:"Abde",team:"Real Betis",section:"Regulares",owned:true},
  {id:120,num:"91",name:"Escudo",team:"RC Celta",section:"Regulares",owned:true},
  {id:121,num:"91 Bis",name:"Stadium Card - Abanca Balaídos",team:"RC Celta",section:"Regulares",owned:true},
  {id:122,num:"92",name:"Radu",team:"RC Celta",section:"Regulares",owned:false},
  {id:123,num:"93",name:"Iván Villar",team:"RC Celta",section:"Regulares",owned:true},
  {id:124,num:"94",name:"Javi Rueda",team:"RC Celta",section:"Regulares",owned:true},
  {id:125,num:"94 Bis",name:"Álvaro Núñez - Actualización Plus",team:"RC Celta",section:"Plus / Bis",owned:false},
  {id:126,num:"95",name:"Javi Rodríguez",team:"RC Celta",section:"Regulares",owned:true},
  {id:127,num:"96",name:"Starfelt",team:"RC Celta",section:"Regulares",owned:true},
  {id:128,num:"96 Bis",name:"Yoel Lago - Pocket Box Platinum",team:"RC Celta",section:"Plus / Bis",owned:true},
  {id:129,num:"97",name:"Marcos Alonso",team:"RC Celta",section:"Regulares",owned:true},
  {id:130,num:"98",name:"Mingueza",team:"RC Celta",section:"Regulares",owned:true},
  {id:131,num:"99",name:"Carreira",team:"RC Celta",section:"Regulares",owned:true},
  {id:132,num:"100",name:"Ilaix Moriba",team:"RC Celta",section:"Regulares",owned:true},
  {id:133,num:"101",name:"Fran Beltrán",team:"RC Celta",section:"Regulares",owned:false},
  {id:134,num:"101 Bis",name:"Miguel Román - Actualización Plus",team:"RC Celta",section:"Plus / Bis",owned:false},
  {id:135,num:"102",name:"Sotelo",team:"RC Celta",section:"Regulares",owned:false},
  {id:136,num:"102 Bis",name:"Vecino - Actualización Plus",team:"RC Celta",section:"Plus / Bis",owned:false},
  {id:137,num:"103",name:"Hugo Álvarez",team:"RC Celta",section:"Regulares",owned:false},
  {id:138,num:"104",name:"Swedberg",team:"RC Celta",section:"Regulares",owned:false},
  {id:139,num:"104 Bis",name:"Fer López - Actualización Plus",team:"RC Celta",section:"Plus / Bis",owned:false},
  {id:140,num:"105",name:"Bryan Zaragoza",team:"RC Celta",section:"Regulares",owned:true},
  {id:141,num:"106",name:"Iago Aspas - Capitán",team:"RC Celta",section:"Regulares",owned:false},
  {id:142,num:"107",name:"Borja Iglesias",team:"RC Celta",section:"Regulares",owned:true},
  {id:143,num:"108",name:"Jutglà",team:"RC Celta",section:"Regulares",owned:true},
  {id:144,num:"108 Bis",name:"Pablo Durán - Pocket Box Platinum",team:"RC Celta",section:"Plus / Bis",owned:true},
  {id:145,num:"109",name:"Escudo",team:"Elche CF",section:"Regulares",owned:true},
  {id:146,num:"109 Bis",name:"Stadium Card - Martínez Valero",team:"Elche CF",section:"Regulares",owned:true},
  {id:147,num:"110",name:"Iñaki Peña",team:"Elche CF",section:"Regulares",owned:true},
  {id:148,num:"111",name:"Dituro",team:"Elche CF",section:"Regulares",owned:true},
  {id:149,num:"112",name:"Álvaro Núñez",team:"Elche CF",section:"Regulares",owned:true},
  {id:150,num:"112 Bis",name:"Héctor Fort - Pocket Box Platinum",team:"Elche CF",section:"Plus / Bis",owned:true},
  {id:151,num:"113",name:"Chust",team:"Elche CF",section:"Regulares",owned:true},
  {id:152,num:"114",name:"Bigas - Capitán",team:"Elche CF",section:"Regulares",owned:true},
  {id:153,num:"115",name:"Affengruber",team:"Elche CF",section:"Regulares",owned:true},
  {id:154,num:"116",name:"Pedrosa",team:"Elche CF",section:"Regulares",owned:true},
  {id:155,num:"117",name:"Fede Redondo",team:"Elche CF",section:"Regulares",owned:false},
  {id:156,num:"117 Bis",name:"Gonzalo Villar - Actualización Plus",team:"Elche CF",section:"Plus / Bis",owned:false},
  {id:157,num:"118",name:"Germán Valera",team:"Elche CF",section:"Regulares",owned:true},
  {id:158,num:"119",name:"Martim Neto",team:"Elche CF",section:"Regulares",owned:false},
  {id:159,num:"120",name:"Febas",team:"Elche CF",section:"Regulares",owned:true},
  {id:160,num:"121",name:"Marc Aguado",team:"Elche CF",section:"Regulares",owned:true},
  {id:161,num:"122",name:"Rodri Mendoza",team:"Elche CF",section:"Regulares",owned:true},
  {id:162,num:"122 Bis",name:"Morente - Actualización Plus",team:"Elche CF",section:"Plus / Bis",owned:false},
  {id:163,num:"123",name:"Josan",team:"Elche CF",section:"Regulares",owned:true},
  {id:164,num:"123 Bis",name:"Cepeda - Actualización Plus",team:"Elche CF",section:"Plus / Bis",owned:false},
  {id:165,num:"124",name:"Álvaro Rodríguez",team:"Elche CF",section:"Regulares",owned:true},
  {id:166,num:"125",name:"André Silva",team:"Elche CF",section:"Regulares",owned:true},
  {id:167,num:"126",name:"Rafa Mir",team:"Elche CF",section:"Regulares",owned:true},
  {id:168,num:"127",name:"Escudo",team:"RCD Espanyol",section:"Regulares",owned:false},
  {id:169,num:"127 Bis",name:"RCDE Stadium",team:"RCD Espanyol",section:"Regulares",owned:false},
  {id:170,num:"128",name:"Dmitrovic",team:"RCD Espanyol",section:"Regulares",owned:true},
  {id:171,num:"129",name:"Fortuño",team:"RCD Espanyol",section:"Regulares",owned:true},
  {id:172,num:"130",name:"El Hilali",team:"RCD Espanyol",section:"Regulares",owned:true},
  {id:173,num:"131",name:"Calero",team:"RCD Espanyol",section:"Regulares",owned:false},
  {id:174,num:"132",name:"Riedel",team:"RCD Espanyol",section:"Regulares",owned:true},
  {id:175,num:"133",name:"Cabrera",team:"RCD Espanyol",section:"Regulares",owned:false},
  {id:176,num:"134",name:"Carlos Romero",team:"RCD Espanyol",section:"Regulares",owned:true},
  {id:177,num:"135",name:"Pol Lozano",team:"RCD Espanyol",section:"Regulares",owned:true},
  {id:178,num:"136",name:"Urko",team:"RCD Espanyol",section:"Regulares",owned:true},
  {id:179,num:"137",name:"Edu Expósito",team:"RCD Espanyol",section:"Regulares",owned:true},
  {id:180,num:"138",name:"Terrats",team:"RCD Espanyol",section:"Regulares",owned:false},
  {id:181,num:"138 Bis",name:"Pickel - Box Serie Oro",team:"RCD Espanyol",section:"Plus / Bis",owned:true},
  {id:182,num:"139",name:"Antoniu Roca",team:"RCD Espanyol",section:"Regulares",owned:false},
  {id:183,num:"139 Bis",name:"Jofre - Actualización Plus",team:"RCD Espanyol",section:"Plus / Bis",owned:false},
  {id:184,num:"140",name:"Dolan",team:"RCD Espanyol",section:"Regulares",owned:true},
  {id:185,num:"141",name:"Roberto Fernández",team:"RCD Espanyol",section:"Regulares",owned:true},
  {id:186,num:"142",name:"Kike García",team:"RCD Espanyol",section:"Regulares",owned:true},
  {id:187,num:"143",name:"Puado - Capitán",team:"RCD Espanyol",section:"Regulares",owned:true},
  {id:188,num:"143 Bis",name:"Ngonge - Actualización Plus",team:"RCD Espanyol",section:"Plus / Bis",owned:false},
  {id:189,num:"144",name:"Pere Milla",team:"RCD Espanyol",section:"Regulares",owned:false},
  {id:190,num:"144 Bis",name:"Koleosho - Pocket Box Platinum",team:"RCD Espanyol",section:"Plus / Bis",owned:true},
  {id:191,num:"145",name:"Escudo",team:"Getafe CF",section:"Regulares",owned:true},
  {id:192,num:"145 Bis",name:"Stadium Card - Coliseum",team:"Getafe CF",section:"Regulares",owned:true},
  {id:193,num:"146",name:"David Soria",team:"Getafe CF",section:"Regulares",owned:true},
  {id:194,num:"147",name:"Letáček",team:"Getafe CF",section:"Regulares",owned:false},
  {id:195,num:"148",name:"Iglesias",team:"Getafe CF",section:"Regulares",owned:false},
  {id:196,num:"149",name:"Kiko Femenía",team:"Getafe CF",section:"Regulares",owned:true},
  {id:197,num:"150",name:"Djene - Capitán",team:"Getafe CF",section:"Regulares",owned:true},
  {id:198,num:"151",name:"Domingos Duarte",team:"Getafe CF",section:"Regulares",owned:true},
  {id:199,num:"152",name:"Abqar",team:"Getafe CF",section:"Regulares",owned:true},
  {id:200,num:"152 Bis",name:"Zaid Romero - Actualización Plus",team:"Getafe CF",section:"Plus / Bis",owned:false},
  {id:201,num:"153",name:"Diego Rico",team:"Getafe CF",section:"Regulares",owned:true},
  {id:202,num:"153 Bis",name:"Boselli - Actualización Plus",team:"Getafe CF",section:"Plus / Bis",owned:false},
  {id:203,num:"154",name:"Davinchi",team:"Getafe CF",section:"Regulares",owned:true},
  {id:204,num:"155",name:"Mario Martín",team:"Getafe CF",section:"Regulares",owned:true},
  {id:205,num:"156",name:"Arambarri",team:"Getafe CF",section:"Regulares",owned:true},
  {id:206,num:"157",name:"Milla",team:"Getafe CF",section:"Regulares",owned:true},
  {id:207,num:"158",name:"Neyou",team:"Getafe CF",section:"Regulares",owned:true},
  {id:208,num:"159",name:"Javi Muñoz",team:"Getafe CF",section:"Regulares",owned:false},
  {id:209,num:"160",name:"Borja Mayoral",team:"Getafe CF",section:"Regulares",owned:true},
  {id:210,num:"160 Bis",name:"Luis Vázquez - Actualización Plus",team:"Getafe CF",section:"Plus / Bis",owned:false},
  {id:211,num:"161",name:"Liso",team:"Getafe CF",section:"Regulares",owned:false},
  {id:212,num:"161 Bis",name:"Satriano - Actualización Plus",team:"Getafe CF",section:"Plus / Bis",owned:false},
  {id:213,num:"162",name:"Coba",team:"Getafe CF",section:"Regulares",owned:true},
  {id:214,num:"162 Bis",name:"Álex Xancris - Pocket Box Platinum",team:"Getafe CF",section:"Plus / Bis",owned:true},
  {id:215,num:"163",name:"Escudo",team:"Girona FC",section:"Regulares",owned:true},
  {id:216,num:"163 Bis",name:"Stadium Card - Montilivi",team:"Girona FC",section:"Regulares",owned:true},
  {id:217,num:"164",name:"Gazzaniga",team:"Girona FC",section:"Regulares",owned:true},
  {id:218,num:"165",name:"Livakovic",team:"Girona FC",section:"Regulares",owned:true},
  {id:219,num:"165 Bis",name:"Ter Stegen - Actualización Plus",team:"Girona FC",section:"Plus / Bis",owned:false},
  {id:220,num:"166",name:"Arnau",team:"Girona FC",section:"Regulares",owned:true},
  {id:221,num:"167",name:"Hugo Rincón",team:"Girona FC",section:"Regulares",owned:false},
  {id:222,num:"168",name:"Vitor Reis",team:"Girona FC",section:"Regulares",owned:true},
  {id:223,num:"169",name:"Blind",team:"Girona FC",section:"Regulares",owned:true},
  {id:224,num:"170",name:"Francés",team:"Girona FC",section:"Regulares",owned:true},
  {id:225,num:"171",name:"Álex Moreno",team:"Girona FC",section:"Regulares",owned:true},
  {id:226,num:"172",name:"Witsel",team:"Girona FC",section:"Regulares",owned:true},
  {id:227,num:"172 Bis",name:"Fran Beltrán - Actualización Plus",team:"Girona FC",section:"Plus / Bis",owned:false},
  {id:228,num:"173",name:"Ounahi",team:"Girona FC",section:"Regulares",owned:false},
  {id:229,num:"174",name:"Iván Martín",team:"Girona FC",section:"Regulares",owned:false},
  {id:230,num:"174 Bis",name:"Echeverri - Actualización Plus",team:"Girona FC",section:"Plus / Bis",owned:false},
  {id:231,num:"175",name:"Yáser Asprilla",team:"Girona FC",section:"Regulares",owned:true},
  {id:232,num:"175 Bis",name:"Lemar - Box Serie Oro",team:"Girona FC",section:"Plus / Bis",owned:true},
  {id:233,num:"176",name:"Joel Roca",team:"Girona FC",section:"Regulares",owned:true},
  {id:234,num:"176 Bis",name:"Portu - Pocket Box Platinum",team:"Girona FC",section:"Plus / Bis",owned:true},
  {id:235,num:"177",name:"Tsygankov",team:"Girona FC",section:"Regulares",owned:true},
  {id:236,num:"178",name:"Vanat",team:"Girona FC",section:"Regulares",owned:true},
  {id:237,num:"179",name:"Stuani - Capitán",team:"Girona FC",section:"Regulares",owned:false},
  {id:238,num:"180",name:"Bryan Gil",team:"Girona FC",section:"Regulares",owned:true},
  {id:239,num:"181",name:"Escudo",team:"Levante UD",section:"Regulares",owned:false},
  {id:240,num:"181 Bis",name:"Stadium Card - Ciutat de València",team:"Levante UD",section:"Regulares",owned:true},
  {id:241,num:"182",name:"Ryan",team:"Levante UD",section:"Regulares",owned:true},
  {id:242,num:"183",name:"Pablo Campos",team:"Levante UD",section:"Regulares",owned:true},
  {id:243,num:"184",name:"Toljan",team:"Levante UD",section:"Regulares",owned:true},
  {id:244,num:"185",name:"Dela",team:"Levante UD",section:"Regulares",owned:true},
  {id:245,num:"186",name:"Elgezabal",team:"Levante UD",section:"Regulares",owned:true},
  {id:246,num:"187",name:"Matías Moreno",team:"Levante UD",section:"Regulares",owned:false},
  {id:247,num:"188",name:"Manu Sánchez",team:"Levante UD",section:"Regulares",owned:true},
  {id:248,num:"189",name:"Pampín",team:"Levante UD",section:"Regulares",owned:false},
  {id:249,num:"190",name:"Oriol Rey",team:"Levante UD",section:"Regulares",owned:true},
  {id:250,num:"190 Bis",name:"Raghouber - Actualización Plus",team:"Levante UD",section:"Plus / Bis",owned:false},
  {id:251,num:"191",name:"Pablo Martínez - Capitán",team:"Levante UD",section:"Regulares",owned:true},
  {id:252,num:"192",name:"Olasagasti",team:"Levante UD",section:"Regulares",owned:false},
  {id:253,num:"193",name:"Vencedor",team:"Levante UD",section:"Regulares",owned:true},
  {id:254,num:"193 Bis",name:"Arriaga - Pocket Box Platinum",team:"Levante UD",section:"Plus / Bis",owned:true},
  {id:255,num:"194",name:"Carlos Álvarez",team:"Levante UD",section:"Regulares",owned:false},
  {id:256,num:"195",name:"Morales",team:"Levante UD",section:"Regulares",owned:true},
  {id:257,num:"195 Bis",name:"Paco Cortés - Actualización Plus",team:"Levante UD",section:"Plus / Bis",owned:false},
  {id:258,num:"196",name:"Brugé",team:"Levante UD",section:"Regulares",owned:false},
  {id:259,num:"197",name:"Iván Romero",team:"Levante UD",section:"Regulares",owned:true},
  {id:260,num:"198",name:"Etta Eyong",team:"Levante UD",section:"Regulares",owned:true},
  {id:261,num:"198 Bis",name:"Koyalipou - Box Serie Oro",team:"Levante UD",section:"Plus / Bis",owned:true},
  {id:262,num:"199",name:"Escudo",team:"Real Madrid",section:"Regulares",owned:true},
  {id:263,num:"199 Bis",name:"Stadium Card - Bernabéu",team:"Real Madrid",section:"Regulares",owned:true},
  {id:264,num:"200",name:"Courtois",team:"Real Madrid",section:"Regulares",owned:false},
  {id:265,num:"201",name:"Lunin",team:"Real Madrid",section:"Regulares",owned:true},
  {id:266,num:"202",name:"Carvajal - Capitán",team:"Real Madrid",section:"Regulares",owned:true},
  {id:267,num:"203",name:"Trent",team:"Real Madrid",section:"Regulares",owned:false},
  {id:268,num:"204",name:"Militão",team:"Real Madrid",section:"Regulares",owned:true},
  {id:269,num:"205",name:"Huijsen",team:"Real Madrid",section:"Regulares",owned:true},
  {id:270,num:"206",name:"Rüdiger",team:"Real Madrid",section:"Regulares",owned:true},
  {id:271,num:"206 Bis",name:"Asencio - Box Serie Oro",team:"Real Madrid",section:"Plus / Bis",owned:true},
  {id:272,num:"207",name:"Carreras",team:"Real Madrid",section:"Regulares",owned:true},
  {id:273,num:"207 Bis",name:"Fran García - Actualización Plus",team:"Real Madrid",section:"Plus / Bis",owned:false},
  {id:274,num:"208",name:"Tchouaméni",team:"Real Madrid",section:"Regulares",owned:true},
  {id:275,num:"208 Bis",name:"Camavinga - Sobre Premium Oro",team:"Real Madrid",section:"Plus / Bis",owned:true},
  {id:276,num:"209",name:"Fede Valverde",team:"Real Madrid",section:"Regulares",owned:true},
  {id:277,num:"210",name:"Bellingham",team:"Real Madrid",section:"Regulares",owned:true},
  {id:278,num:"211",name:"Güler",team:"Real Madrid",section:"Regulares",owned:true},
  {id:279,num:"212",name:"Mastantuono",team:"Real Madrid",section:"Regulares",owned:false},
  {id:280,num:"213",name:"Rodrygo",team:"Real Madrid",section:"Regulares",owned:true},
  {id:281,num:"214",name:"Mbappé",team:"Real Madrid",section:"Regulares",owned:true},
  {id:282,num:"215",name:"Gonzalo",team:"Real Madrid",section:"Regulares",owned:false},
  {id:283,num:"215 Bis",name:"Brahim Díaz - Pocket Box Platinum",team:"Real Madrid",section:"Plus / Bis",owned:true},
  {id:284,num:"216",name:"Vinicius",team:"Real Madrid",section:"Regulares",owned:true},
  {id:285,num:"217",name:"Escudo",team:"RCD Mallorca",section:"Regulares",owned:true},
  {id:286,num:"217 Bis",name:"Stadium Card - Son Moix",team:"RCD Mallorca",section:"Regulares",owned:true},
  {id:287,num:"218",name:"Leo Román",team:"RCD Mallorca",section:"Regulares",owned:false},
  {id:288,num:"219",name:"Bergström",team:"RCD Mallorca",section:"Regulares",owned:false},
  {id:289,num:"220",name:"Morey",team:"RCD Mallorca",section:"Regulares",owned:true},
  {id:290,num:"221",name:"Maffeo",team:"RCD Mallorca",section:"Regulares",owned:false},
  {id:291,num:"222",name:"Valjent",team:"RCD Mallorca",section:"Regulares",owned:true},
  {id:292,num:"223",name:"Raillo - Capitán",team:"RCD Mallorca",section:"Regulares",owned:true},
  {id:293,num:"224",name:"Kumbulla",team:"RCD Mallorca",section:"Regulares",owned:false},
  {id:294,num:"225",name:"Mojica",team:"RCD Mallorca",section:"Regulares",owned:true},
  {id:295,num:"225 Bis",name:"Lato - Pocket Box Platinum",team:"RCD Mallorca",section:"Plus / Bis",owned:true},
  {id:296,num:"226",name:"Samu Costa",team:"RCD Mallorca",section:"Regulares",owned:true},
  {id:297,num:"227",name:"Antonio Sánchez",team:"RCD Mallorca",section:"Regulares",owned:true},
  {id:298,num:"227 Bis",name:"Mascarell - Pocket Box Platinum",team:"RCD Mallorca",section:"Plus / Bis",owned:true},
  {id:299,num:"228",name:"Darder",team:"RCD Mallorca",section:"Regulares",owned:true},
  {id:300,num:"229",name:"Morlanes",team:"RCD Mallorca",section:"Regulares",owned:true},
  {id:301,num:"230",name:"Pablo Torre",team:"RCD Mallorca",section:"Regulares",owned:false},
  {id:302,num:"231",name:"Asano",team:"RCD Mallorca",section:"Regulares",owned:false},
  {id:303,num:"232",name:"Muriqi",team:"RCD Mallorca",section:"Regulares",owned:false},
  {id:304,num:"233",name:"Mateo Joseph",team:"RCD Mallorca",section:"Regulares",owned:true},
  {id:305,num:"233 Bis",name:"Luvumbo - Actualización Plus",team:"RCD Mallorca",section:"Plus / Bis",owned:true},
  {id:306,num:"234",name:"Jan Virgili",team:"RCD Mallorca",section:"Regulares",owned:true},
  {id:307,num:"234 Bis",name:"Abdón - Sobre Premium Oro",team:"RCD Mallorca",section:"Plus / Bis",owned:true},
  {id:308,num:"235",name:"Escudo",team:"CA Osasuna",section:"Regulares",owned:false},
  {id:309,num:"235 Bis",name:"Stadium Card - El Sadar",team:"CA Osasuna",section:"Regulares",owned:true},
  {id:310,num:"236",name:"Sergio Herrera - Capitán",team:"CA Osasuna",section:"Regulares",owned:true},
  {id:311,num:"237",name:"Aitor Fernández",team:"CA Osasuna",section:"Regulares",owned:true},
  {id:312,num:"238",name:"Rosier",team:"CA Osasuna",section:"Regulares",owned:false},
  {id:313,num:"239",name:"Boyomo",team:"CA Osasuna",section:"Regulares",owned:true},
  {id:314,num:"240",name:"Catena",team:"CA Osasuna",section:"Regulares",owned:true},
  {id:315,num:"241",name:"Herrando",team:"CA Osasuna",section:"Regulares",owned:true},
  {id:316,num:"242",name:"Juan Cruz",team:"CA Osasuna",section:"Regulares",owned:false},
  {id:317,num:"243",name:"Abel Bretones",team:"CA Osasuna",section:"Regulares",owned:true},
  {id:318,num:"243 Bis",name:"Galán - Actualización Plus",team:"CA Osasuna",section:"Plus / Bis",owned:false},
  {id:319,num:"244",name:"Torró",team:"CA Osasuna",section:"Regulares",owned:true},
  {id:320,num:"245",name:"Moncayola",team:"CA Osasuna",section:"Regulares",owned:false},
  {id:321,num:"246",name:"Moi Gómez",team:"CA Osasuna",section:"Regulares",owned:true},
  {id:322,num:"247",name:"Rubén García",team:"CA Osasuna",section:"Regulares",owned:false},
  {id:323,num:"247 Bis",name:"Iker Benito - Pocket Box Platinum",team:"CA Osasuna",section:"Plus / Bis",owned:true},
  {id:324,num:"248",name:"Aimar Oroz",team:"CA Osasuna",section:"Regulares",owned:false},
  {id:325,num:"249",name:"Víctor Muñoz",team:"CA Osasuna",section:"Regulares",owned:true},
  {id:326,num:"250",name:"Raúl García",team:"CA Osasuna",section:"Regulares",owned:true},
  {id:327,num:"251",name:"Budimir",team:"CA Osasuna",section:"Regulares",owned:true},
  {id:328,num:"252",name:"Becker",team:"CA Osasuna",section:"Regulares",owned:false},
  {id:329,num:"252 Bis",name:"Raúl Moro - Actualización Plus",team:"CA Osasuna",section:"Plus / Bis",owned:false},
  {id:330,num:"253",name:"Escudo",team:"Real Oviedo",section:"Regulares",owned:false},
  {id:331,num:"253 Bis",name:"Stadium Card - Carlos Tartiere",team:"Real Oviedo",section:"Regulares",owned:true},
  {id:332,num:"254",name:"Aarón Escandell",team:"Real Oviedo",section:"Regulares",owned:true},
  {id:333,num:"255",name:"Moldovan",team:"Real Oviedo",section:"Regulares",owned:true},
  {id:334,num:"256",name:"Nacho Vidal",team:"Real Oviedo",section:"Regulares",owned:false},
  {id:335,num:"257",name:"Eric Bailly",team:"Real Oviedo",section:"Regulares",owned:true},
  {id:336,num:"258",name:"David Carmo",team:"Real Oviedo",section:"Regulares",owned:false},
  {id:337,num:"259",name:"Dani Calvo",team:"Real Oviedo",section:"Regulares",owned:true},
  {id:338,num:"259 Bis",name:"David Costas - Pocket Box Platinum",team:"Real Oviedo",section:"Plus / Bis",owned:true},
  {id:339,num:"260",name:"Rahim Alhassane",team:"Real Oviedo",section:"Regulares",owned:false},
  {id:340,num:"261",name:"Colombatto",team:"Real Oviedo",section:"Regulares",owned:false},
  {id:341,num:"261 Bis",name:"Ejaria - Pocket Box Platinum",team:"Real Oviedo",section:"Plus / Bis",owned:true},
  {id:342,num:"262",name:"Reina",team:"Real Oviedo",section:"Regulares",owned:true},
  {id:343,num:"263",name:"Dendoncker",team:"Real Oviedo",section:"Regulares",owned:true},
  {id:344,num:"263 Bis",name:"Sibo - Actualización Plus",team:"Real Oviedo",section:"Plus / Bis",owned:false},
  {id:345,num:"264",name:"Cazorla - Capitán",team:"Real Oviedo",section:"Regulares",owned:true},
  {id:346,num:"265",name:"Ilić",team:"Real Oviedo",section:"Regulares",owned:false},
  {id:347,num:"265 Bis",name:"Nico Fonseca - Actualización Plus",team:"Real Oviedo",section:"Plus / Bis",owned:false},
  {id:348,num:"266",name:"Hassan",team:"Real Oviedo",section:"Regulares",owned:false},
  {id:349,num:"267",name:"Brekalo",team:"Real Oviedo",section:"Regulares",owned:true},
  {id:350,num:"267 Bis",name:"Thiago Fernández - Actualización Plus",team:"Real Oviedo",section:"Plus / Bis",owned:false},
  {id:351,num:"268",name:"Ilyas Chaira",team:"Real Oviedo",section:"Regulares",owned:true},
  {id:352,num:"269",name:"Fede Viñas",team:"Real Oviedo",section:"Regulares",owned:true},
  {id:353,num:"270",name:"Rondón",team:"Real Oviedo",section:"Regulares",owned:false},
  {id:354,num:"271",name:"Escudo",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:355,num:"271 Bis",name:"Stadium Card - Vallecas",team:"Rayo Vallecano",section:"Regulares",owned:false},
  {id:356,num:"272",name:"Batalla",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:357,num:"273",name:"Cárdenas",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:358,num:"274",name:"Ratiu",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:359,num:"275",name:"Balliu",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:360,num:"276",name:"Lejeune",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:361,num:"277",name:"Luiz Felipe",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:362,num:"277 Bis",name:"Nobel Mendy - Actualización Plus",team:"Rayo Vallecano",section:"Plus / Bis",owned:false},
  {id:363,num:"278",name:"Pep Chavarría",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:364,num:"279",name:"Pathé Ciss",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:365,num:"280",name:"Unai López",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:366,num:"281",name:"Óscar Valentín - Capitán",team:"Rayo Vallecano",section:"Regulares",owned:false},
  {id:367,num:"282",name:"Isi",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:368,num:"283",name:"Pedro Díaz",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:369,num:"283 Bis",name:"Gumbau - Pocket Box Platinum",team:"Rayo Vallecano",section:"Plus / Bis",owned:true},
  {id:370,num:"284",name:"Álvaro García",team:"Rayo Vallecano",section:"Regulares",owned:false},
  {id:371,num:"285",name:"Fran Pérez",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:372,num:"285 Bis",name:"Carlos Martín - Actualización Plus",team:"Rayo Vallecano",section:"Plus / Bis",owned:false},
  {id:373,num:"286",name:"Camello",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:374,num:"287",name:"De Frutos",team:"Rayo Vallecano",section:"Regulares",owned:false},
  {id:375,num:"288",name:"Alemão",team:"Rayo Vallecano",section:"Regulares",owned:true},
  {id:376,num:"288 Bis",name:"Ilias - Actualización Plus",team:"Rayo Vallecano",section:"Plus / Bis",owned:false},
  {id:377,num:"289",name:"Escudo",team:"Real Sociedad",section:"Regulares",owned:false},
  {id:378,num:"289 Bis",name:"Stadium Card - Anoeta",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:379,num:"290",name:"Remiro",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:380,num:"291",name:"Marrero",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:381,num:"292",name:"Aramburu",team:"Real Sociedad",section:"Regulares",owned:false},
  {id:382,num:"293",name:"Aritz Elustondo",team:"Real Sociedad",section:"Regulares",owned:false},
  {id:383,num:"293 Bis",name:"Jon Martín - Actualización Plus",team:"Real Sociedad",section:"Plus / Bis",owned:false},
  {id:384,num:"294",name:"Zubeldia",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:385,num:"295",name:"Caleta-Car",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:386,num:"296",name:"Sergio Gómez",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:387,num:"297",name:"Gorrotxategi",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:388,num:"298",name:"Turrientes",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:389,num:"299",name:"Pablo Marín",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:390,num:"299 Bis",name:"Yangel Herrera - Pocket Box Platinum",team:"Real Sociedad",section:"Plus / Bis",owned:true},
  {id:391,num:"300",name:"Carlos Soler",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:392,num:"301",name:"Brais Méndez",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:393,num:"302",name:"Kubo",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:394,num:"303",name:"Barrenetxea",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:395,num:"304",name:"Oyarzabal - Capitán",team:"Real Sociedad",section:"Regulares",owned:false},
  {id:396,num:"305",name:"Óskarsson",team:"Real Sociedad",section:"Regulares",owned:false},
  {id:397,num:"305 Bis",name:"Wesley - Actualización Plus",team:"Real Sociedad",section:"Plus / Bis",owned:false},
  {id:398,num:"306",name:"Guedes",team:"Real Sociedad",section:"Regulares",owned:true},
  {id:399,num:"307",name:"Escudo",team:"Sevilla FC",section:"Regulares",owned:true},
  {id:400,num:"307 Bis",name:"Stadium Card - Sánchez-Pizjuán",team:"Sevilla FC",section:"Regulares",owned:false},
  {id:401,num:"308",name:"Vlachodimos",team:"Sevilla FC",section:"Regulares",owned:true},
  {id:402,num:"309",name:"Nyland",team:"Sevilla FC",section:"Regulares",owned:false},
  {id:403,num:"310",name:"Carmona",team:"Sevilla FC",section:"Regulares",owned:true},
  {id:404,num:"311",name:"Juanlu",team:"Sevilla FC",section:"Regulares",owned:true},
  {id:405,num:"312",name:"Azpilicueta",team:"Sevilla FC",section:"Regulares",owned:false},
  {id:406,num:"313",name:"Kike Salas",team:"Sevilla FC",section:"Regulares",owned:true},
  {id:407,num:"314",name:"Marcão",team:"Sevilla FC",section:"Regulares",owned:false},
  {id:408,num:"314 Bis",name:"Oso - Actualización Plus",team:"Sevilla FC",section:"Plus / Bis",owned:false},
  {id:409,num:"315",name:"Suazo",team:"Sevilla FC",section:"Regulares",owned:true},
  {id:410,num:"316",name:"Gudelj - Capitán",team:"Sevilla FC",section:"Regulares",owned:false},
  {id:411,num:"317",name:"Agoumé",team:"Sevilla FC",section:"Regulares",owned:false},
  {id:412,num:"318",name:"Sow",team:"Sevilla FC",section:"Regulares",owned:false},
  {id:413,num:"319",name:"Batista Mendy",team:"Sevilla FC",section:"Regulares",owned:true},
  {id:414,num:"320",name:"Vargas",team:"Sevilla FC",section:"Regulares",owned:true},
  {id:415,num:"321",name:"Ejuke",team:"Sevilla FC",section:"Regulares",owned:true},
  {id:416,num:"321 Bis",name:"Alfon - Pocket Box Platinum",team:"Sevilla FC",section:"Plus / Bis",owned:true},
  {id:417,num:"322",name:"Isaac Romero",team:"Sevilla FC",section:"Regulares",owned:true},
  {id:418,num:"323",name:"Akor Adams",team:"Sevilla FC",section:"Regulares",owned:true},
  {id:419,num:"324",name:"Alexis Sánchez",team:"Sevilla FC",section:"Regulares",owned:false},
  {id:420,num:"324 Bis",name:"Maupay - Actualización Plus",team:"Sevilla FC",section:"Plus / Bis",owned:false},
  {id:421,num:"325",name:"Escudo",team:"Valencia CF",section:"Regulares",owned:true},
  {id:422,num:"325 Bis",name:"Stadium Card - Mestalla",team:"Valencia CF",section:"Regulares",owned:true},
  {id:423,num:"326",name:"Agirrezabala",team:"Valencia CF",section:"Regulares",owned:false},
  {id:424,num:"327",name:"Dimitrievski",team:"Valencia CF",section:"Regulares",owned:true},
  {id:425,num:"328",name:"Foulquier",team:"Valencia CF",section:"Regulares",owned:false},
  {id:426,num:"329",name:"Correia",team:"Valencia CF",section:"Regulares",owned:false},
  {id:427,num:"330",name:"Tárrega",team:"Valencia CF",section:"Regulares",owned:true},
  {id:428,num:"331",name:"Copete",team:"Valencia CF",section:"Regulares",owned:false},
  {id:429,num:"332",name:"Diakhaby",team:"Valencia CF",section:"Regulares",owned:true},
  {id:430,num:"332 Bis",name:"Nuñez - Actualización Plus",team:"Valencia CF",section:"Plus / Bis",owned:false},
  {id:431,num:"333",name:"Gayà - Capitán",team:"Valencia CF",section:"Regulares",owned:true},
  {id:432,num:"334",name:"Pepelu",team:"Valencia CF",section:"Regulares",owned:true},
  {id:433,num:"334 Bis",name:"Guido Rodríguez - Actualización Plus",team:"Valencia CF",section:"Plus / Bis",owned:false},
  {id:434,num:"335",name:"Santamaría",team:"Valencia CF",section:"Regulares",owned:false},
  {id:435,num:"336",name:"Javi Guerra",team:"Valencia CF",section:"Regulares",owned:false},
  {id:436,num:"336 Bis",name:"Ugrinic - Pocket Box Platinum",team:"Valencia CF",section:"Plus / Bis",owned:true},
  {id:437,num:"337",name:"André Almeida",team:"Valencia CF",section:"Regulares",owned:true},
  {id:438,num:"338",name:"Luis Rioja",team:"Valencia CF",section:"Regulares",owned:true},
  {id:439,num:"339",name:"Diego López",team:"Valencia CF",section:"Regulares",owned:false},
  {id:440,num:"340",name:"Ramazani",team:"Valencia CF",section:"Regulares",owned:true},
  {id:441,num:"340 Bis",name:"Raba - Box Serie Oro",team:"Valencia CF",section:"Plus / Bis",owned:true},
  {id:442,num:"341",name:"Danjuma",team:"Valencia CF",section:"Regulares",owned:false},
  {id:443,num:"341 Bis",name:"Sadiq - Actualización Plus",team:"Valencia CF",section:"Plus / Bis",owned:false},
  {id:444,num:"342",name:"Hugo Duro",team:"Valencia CF",section:"Regulares",owned:true},
  {id:445,num:"342 Bis",name:"Lucas Beltrán - Sobre Premium Oro",team:"Valencia CF",section:"Plus / Bis",owned:true},
  {id:446,num:"343",name:"Escudo",team:"Villarreal CF",section:"Regulares",owned:true},
  {id:447,num:"343 Bis",name:"Stadium Card - La Cerámica",team:"Villarreal CF",section:"Regulares",owned:false},
  {id:448,num:"344",name:"Luiz Junior",team:"Villarreal CF",section:"Regulares",owned:false},
  {id:449,num:"345",name:"Arnau Tenas",team:"Villarreal CF",section:"Regulares",owned:true},
  {id:450,num:"346",name:"Mouriño",team:"Villarreal CF",section:"Regulares",owned:false},
  {id:451,num:"346 Bis",name:"Freeman - Actualización Plus",team:"Villarreal CF",section:"Plus / Bis",owned:false},
  {id:452,num:"347",name:"Foyth",team:"Villarreal CF",section:"Regulares",owned:true},
  {id:453,num:"348",name:"Rafa Marín",team:"Villarreal CF",section:"Regulares",owned:true},
  {id:454,num:"349",name:"Renato Veiga",team:"Villarreal CF",section:"Regulares",owned:true},
  {id:455,num:"350",name:"Sergi Cardona",team:"Villarreal CF",section:"Regulares",owned:true},
  {id:456,num:"350 Bis",name:"Pedraza - Actualización Plus",team:"Villarreal CF",section:"Plus / Bis",owned:false},
  {id:457,num:"351",name:"Santi Comesaña",team:"Villarreal CF",section:"Regulares",owned:false},
  {id:458,num:"352",name:"Pape Gueye",team:"Villarreal CF",section:"Regulares",owned:false},
  {id:459,num:"353",name:"Parejo - Capitán",team:"Villarreal CF",section:"Regulares",owned:false},
  {id:460,num:"354",name:"Thomas",team:"Villarreal CF",section:"Regulares",owned:false},
  {id:461,num:"355",name:"Moleiro",team:"Villarreal CF",section:"Regulares",owned:true},
  {id:462,num:"355 Bis",name:"Alfon - Actualización Plus",team:"Villarreal CF",section:"Plus / Bis",owned:false},
  {id:463,num:"356",name:"Buchanan",team:"Villarreal CF",section:"Regulares",owned:false},
  {id:464,num:"356 Bis",name:"Solomon - Box Serie Oro",team:"Villarreal CF",section:"Plus / Bis",owned:true},
  {id:465,num:"357",name:"Mikautadze",team:"Villarreal CF",section:"Regulares",owned:true},
  {id:466,num:"358",name:"Pépé",team:"Villarreal CF",section:"Regulares",owned:true},
  {id:467,num:"358 Bis",name:"Ilias - Pocket Box Platinum",team:"Villarreal CF",section:"Plus / Bis",owned:true},
  {id:468,num:"359",name:"Oluwaseyi",team:"Villarreal CF",section:"Regulares",owned:true},
  {id:469,num:"360",name:"Ayoze",team:"Villarreal CF",section:"Regulares",owned:true},
  {id:470,num:"360 Bis",name:"Gerard Moreno - Pocket Box Platinum",team:"Villarreal CF",section:"Plus / Bis",owned:true},
  // ESPECIALES
  {id:500,num:"361",name:"¡Vamos! Alavés",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:501,num:"362",name:"¡Vamos! Athletic Club",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:502,num:"363",name:"¡Vamos! Atlético de Madrid",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:503,num:"364",name:"¡Vamos! FC Barcelona",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:504,num:"365",name:"¡Vamos! Real Betis",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:505,num:"366",name:"¡Vamos! RC Celta",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:506,num:"367",name:"¡Vamos! Elche CF",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:507,num:"368",name:"¡Vamos! RCD Espanyol",team:"¡Vamos!",section:"Especiales",owned:false},
  {id:508,num:"369",name:"¡Vamos! Getafe CF",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:509,num:"370",name:"¡Vamos! Girona FC",team:"¡Vamos!",section:"Especiales",owned:false},
  {id:510,num:"371",name:"¡Vamos! Levante UD",team:"¡Vamos!",section:"Especiales",owned:false},
  {id:511,num:"372",name:"¡Vamos! Real Madrid",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:512,num:"373",name:"¡Vamos! RCD Mallorca",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:513,num:"374",name:"¡Vamos! CA Osasuna",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:514,num:"375",name:"¡Vamos! Real Oviedo",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:515,num:"376",name:"¡Vamos! Rayo Vallecano",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:516,num:"377",name:"¡Vamos! Real Sociedad",team:"¡Vamos!",section:"Especiales",owned:false},
  {id:517,num:"378",name:"¡Vamos! Sevilla FC",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:518,num:"379",name:"¡Vamos! Valencia CF",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:519,num:"380",name:"¡Vamos! Villarreal CF",team:"¡Vamos!",section:"Especiales",owned:true},
  {id:520,num:"381",name:"Sivera (Guantes de Oro)",team:"Guantes de Oro",section:"Especiales",owned:true},
  {id:521,num:"382",name:"Joan García (Guantes de Oro)",team:"Guantes de Oro",section:"Especiales",owned:true},
  {id:522,num:"383",name:"David Soria (Guantes de Oro)",team:"Guantes de Oro",section:"Especiales",owned:false},
  {id:523,num:"384",name:"Sergio Herrera (Guantes de Oro)",team:"Guantes de Oro",section:"Especiales",owned:true},
  {id:524,num:"385",name:"Batalla (Guantes de Oro)",team:"Guantes de Oro",section:"Especiales",owned:true},
  {id:525,num:"386",name:"Remiro (Guantes de Oro)",team:"Guantes de Oro",section:"Especiales",owned:false},
  {id:526,num:"387",name:"Agirrezabala (Guantes de Oro)",team:"Guantes de Oro",section:"Especiales",owned:true},
  {id:530,num:"388",name:"Laporte (Kriptonita)",team:"Kriptonita",section:"Especiales",owned:true},
  {id:531,num:"389",name:"Vivian (Kriptonita)",team:"Kriptonita",section:"Especiales",owned:true},
  {id:532,num:"390",name:"Le Normand (Kriptonita)",team:"Kriptonita",section:"Especiales",owned:true},
  {id:533,num:"391",name:"Affengruber (Kriptonita)",team:"Kriptonita",section:"Especiales",owned:true},
  {id:534,num:"392",name:"Cabrera (Kriptonita)",team:"Kriptonita",section:"Especiales",owned:false},
  {id:535,num:"393",name:"Militão (Kriptonita)",team:"Kriptonita",section:"Especiales",owned:false},
  {id:536,num:"394",name:"Lejeune (Kriptonita)",team:"Kriptonita",section:"Especiales",owned:false},
  {id:537,num:"395",name:"Tárrega (Kriptonita)",team:"Kriptonita",section:"Especiales",owned:true},
  {id:538,num:"396",name:"Mouriño (Kriptonita)",team:"Kriptonita",section:"Especiales",owned:true},
  {id:540,num:"397",name:"Rego (Diamante)",team:"Diamantes",section:"Especiales",owned:true},
  {id:541,num:"398",name:"Dro (Diamante)",team:"Diamantes",section:"Especiales",owned:true},
  {id:542,num:"399",name:"Valentín Gómez (Diamante)",team:"Diamantes",section:"Especiales",owned:false},
  {id:543,num:"400",name:"Pablo García (Diamante)",team:"Diamantes",section:"Especiales",owned:true},
  {id:544,num:"401",name:"Rodri Mendoza (Diamante)",team:"Diamantes",section:"Especiales",owned:true},
  {id:545,num:"402",name:"Riedel (Diamante)",team:"Diamantes",section:"Especiales",owned:true},
  {id:546,num:"403",name:"Davinchi (Diamante)",team:"Diamantes",section:"Especiales",owned:true},
  {id:547,num:"404",name:"Liso (Diamante)",team:"Diamantes",section:"Especiales",owned:true},
  {id:548,num:"405",name:"Vitor Reis (Diamante)",team:"Diamantes",section:"Especiales",owned:true},
  {id:549,num:"406",name:"Joel Roca (Diamante)",team:"Diamantes",section:"Especiales",owned:true},
  {id:550,num:"407",name:"Carlos Álvarez (Diamante)",team:"Diamantes",section:"Especiales",owned:false},
  {id:551,num:"408",name:"Etta Eyong (Diamante)",team:"Diamantes",section:"Especiales",owned:false},
  {id:552,num:"409",name:"Fran González (Diamante)",team:"Diamantes",section:"Especiales",owned:false},
  {id:553,num:"410",name:"Gonzalo (Diamante)",team:"Diamantes",section:"Especiales",owned:true},
  {id:554,num:"411",name:"Jan Virgili (Diamante)",team:"Diamantes",section:"Especiales",owned:true},
  {id:555,num:"412",name:"Mateo Joseph (Diamante)",team:"Diamantes",section:"Especiales",owned:false},
  {id:556,num:"413",name:"Víctor Muñoz (Diamante)",team:"Diamantes",section:"Especiales",owned:true},
  {id:557,num:"414",name:"Renato Veiga (Diamante)",team:"Diamantes",section:"Especiales",owned:false},
  {id:560,num:"415",name:"Barrios (Influencer)",team:"Influencers",section:"Especiales",owned:true},
  {id:561,num:"415b",name:"Ruiz de Galarreta (Influencer Premium)",team:"Influencers",section:"Especiales",owned:true},
  {id:562,num:"416",name:"Sotelo (Influencer)",team:"Influencers",section:"Especiales",owned:true},
  {id:563,num:"416b",name:"Pablo Fornals (Influencer Premium)",team:"Influencers",section:"Especiales",owned:true},
  {id:564,num:"417",name:"Febas (Influencer)",team:"Influencers",section:"Especiales",owned:true},
  {id:565,num:"417b",name:"Pablo Torre (Influencer Premium)",team:"Influencers",section:"Especiales",owned:true},
  {id:566,num:"418",name:"Edu Expósito (Influencer)",team:"Influencers",section:"Especiales",owned:true},
  {id:567,num:"418b",name:"Pape Gueye (Influencer Premium)",team:"Influencers",section:"Especiales",owned:true},
  {id:568,num:"419",name:"Milla (Influencer)",team:"Influencers",section:"Especiales",owned:true},
  {id:569,num:"420",name:"Darder (Influencer)",team:"Influencers",section:"Especiales",owned:true},
  {id:570,num:"421",name:"Aimar Oroz (Influencer)",team:"Influencers",section:"Especiales",owned:false},
  {id:571,num:"422",name:"Cazorla (Influencer)",team:"Influencers",section:"Especiales",owned:false},
  {id:572,num:"423",name:"Unai López (Influencer)",team:"Influencers",section:"Especiales",owned:true},
  {id:580,num:"424",name:"Tenaglia (Protas)",team:"Protas",section:"Especiales",owned:false},
  {id:581,num:"425",name:"Carlos Vicente (Protas)",team:"Protas",section:"Especiales",owned:true},
  {id:582,num:"426",name:"Eric García (Protas)",team:"Protas",section:"Especiales",owned:true},
  {id:583,num:"427",name:"Cucho Hernández (Protas)",team:"Protas",section:"Especiales",owned:false},
  {id:584,num:"428",name:"Borja Iglesias (Protas)",team:"Protas",section:"Especiales",owned:true},
  {id:585,num:"429",name:"Dolan (Protas)",team:"Protas",section:"Especiales",owned:true},
  {id:586,num:"430",name:"Vanat (Protas)",team:"Protas",section:"Especiales",owned:true},
  {id:587,num:"431",name:"Manu Sánchez (Protas)",team:"Protas",section:"Especiales",owned:false},
  {id:588,num:"432",name:"Tchouaméni (Protas)",team:"Protas",section:"Especiales",owned:false},
  {id:589,num:"433",name:"Leo Román (Protas)",team:"Protas",section:"Especiales",owned:false},
  {id:590,num:"434",name:"Aarón Escandell (Protas)",team:"Protas",section:"Especiales",owned:true},
  {id:591,num:"435",name:"Hassan (Protas)",team:"Protas",section:"Especiales",owned:true},
  {id:592,num:"436",name:"Carlos Soler (Protas)",team:"Protas",section:"Especiales",owned:true},
  {id:593,num:"437",name:"Gorrotxategi (Protas)",team:"Protas",section:"Especiales",owned:false},
  {id:594,num:"438",name:"Batista Mendy (Protas)",team:"Protas",section:"Especiales",owned:true},
  {id:595,num:"439",name:"Alexis Sánchez (Protas)",team:"Protas",section:"Especiales",owned:false},
  {id:596,num:"440",name:"Danjuma (Protas)",team:"Protas",section:"Especiales",owned:false},
  {id:597,num:"441",name:"Buchanan (Protas)",team:"Protas",section:"Especiales",owned:true},
  {id:600,num:"442",name:"Unai Simón (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:601,num:"443",name:"Jauregizar (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:602,num:"444",name:"Oblak (Super Crack)",team:"Super Cracks",section:"Especiales",owned:false},
  {id:603,num:"445",name:"Marcos Llorente (Super Crack)",team:"Super Cracks",section:"Especiales",owned:false},
  {id:604,num:"446",name:"Álex Baena (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:605,num:"447",name:"Almada (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:606,num:"448",name:"Griezmann (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:607,num:"449",name:"Koundé (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:608,num:"450",name:"Balde (Super Crack)",team:"Super Cracks",section:"Especiales",owned:false},
  {id:609,num:"451",name:"Raphinha (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:610,num:"452",name:"Lewandowski (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:611,num:"453",name:"Rashford (Super Crack)",team:"Super Cracks",section:"Especiales",owned:false},
  {id:612,num:"454",name:"Isco (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:613,num:"455",name:"Lo Celso (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:614,num:"456",name:"Antony (Super Crack)",team:"Super Cracks",section:"Especiales",owned:false},
  {id:615,num:"457",name:"Courtois (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:616,num:"458",name:"Carreras (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:617,num:"459",name:"Fede Valverde (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:618,num:"460",name:"Mastantuono (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:619,num:"461",name:"Budimir (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:620,num:"462",name:"Isi (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:621,num:"463",name:"Kubo (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:622,num:"464",name:"Vargas (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:623,num:"465",name:"Javi Guerra (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:624,num:"466",name:"Moleiro (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:625,num:"467",name:"Pépé (Super Crack)",team:"Super Cracks",section:"Especiales",owned:true},
  {id:630,num:"468",name:"Card Champions",team:"Cartas Únicas",section:"Especiales",owned:false},
  {id:631,num:"469",name:"Nico Williams (Balón de Oro)",team:"Balón de Oro",section:"Especiales",owned:true},
  {id:632,num:"470",name:"Julián Álvarez (Balón de Oro)",team:"Balón de Oro",section:"Especiales",owned:false},
  {id:633,num:"471",name:"Pedri (Balón de Oro)",team:"Balón de Oro",section:"Especiales",owned:false},
  {id:634,num:"472",name:"Lamine Yamal (Balón de Oro)",team:"Balón de Oro",section:"Especiales",owned:false},
  {id:635,num:"473",name:"Vinicius (Balón de Oro)",team:"Balón de Oro",section:"Especiales",owned:false},
  {id:636,num:"474",name:"Mbappé (Balón de Oro)",team:"Balón de Oro",section:"Especiales",owned:false},
  {id:637,num:"475",name:"Carvajal (Balón de Oro Excellence)",team:"Balón de Oro",section:"Especiales",owned:false},
  {id:638,num:"476",name:"Card Atómica",team:"Cartas Únicas",section:"Especiales",owned:false},
  {id:639,num:"477",name:"Card Invencible",team:"Cartas Únicas",section:"Especiales",owned:true},
  {id:640,num:"478",name:"Campeón Card",team:"Cartas Únicas",section:"Especiales",owned:false},
  {id:650,num:"479",name:"Eduardo Coudet",team:"Entrenadores",section:"Especiales",owned:false},
  {id:651,num:"480",name:"Ernesto Valverde",team:"Entrenadores",section:"Especiales",owned:false},
  {id:652,num:"481",name:"Diego Pablo Simeone",team:"Entrenadores",section:"Especiales",owned:false},
  {id:653,num:"482",name:"Hansi Flick",team:"Entrenadores",section:"Especiales",owned:false},
  {id:654,num:"483",name:"Manuel Pellegrini",team:"Entrenadores",section:"Especiales",owned:false},
  {id:655,num:"484",name:"Claudio Giráldez",team:"Entrenadores",section:"Especiales",owned:false},
  {id:656,num:"485",name:"Eder Sarabia",team:"Entrenadores",section:"Especiales",owned:false},
  {id:657,num:"486",name:"Manolo González",team:"Entrenadores",section:"Especiales",owned:false},
  {id:658,num:"487",name:"José Bordalás",team:"Entrenadores",section:"Especiales",owned:false},
  {id:659,num:"488",name:"Michel",team:"Entrenadores",section:"Especiales",owned:false},
  {id:660,num:"489",name:"Luis Castro",team:"Entrenadores",section:"Especiales",owned:false},
  {id:661,num:"490",name:"Álvaro Arbeloa",team:"Entrenadores",section:"Especiales",owned:false},
  {id:662,num:"491",name:"Jagoba Arrasate",team:"Entrenadores",section:"Especiales",owned:false},
  {id:663,num:"492",name:"Alessio Lisci",team:"Entrenadores",section:"Especiales",owned:false},
  {id:664,num:"493",name:"Guillermo Almada",team:"Entrenadores",section:"Especiales",owned:false},
  {id:665,num:"494",name:"Íñigo Pérez",team:"Entrenadores",section:"Especiales",owned:false},
  {id:666,num:"495",name:"Pellegrino Matarazzo",team:"Entrenadores",section:"Especiales",owned:false},
  {id:667,num:"496",name:"Matías Almeyda",team:"Entrenadores",section:"Especiales",owned:false},
  {id:668,num:"497",name:"Carlos Corberán",team:"Entrenadores",section:"Especiales",owned:false},
  {id:669,num:"498",name:"Marcelino García",team:"Entrenadores",section:"Especiales",owned:false},
  {id:700,num:"499",name:"Dmitrovic - Nuevo Guantes de Oro",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:701,num:"500",name:"Ter Stegen - Nuevo Guantes de Oro",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:702,num:"501",name:"Pubill - Nuevo Kriptonita",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:703,num:"502",name:"Gerard Martín - Nuevo Kriptonita",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:704,num:"503",name:"Asencio - Nuevo Kriptonita",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:705,num:"504",name:"Selton - Nuevo Diamante",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:706,num:"505",name:"El-Abdellaoui - Nuevo Diamante",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:707,num:"506",name:"Echeverri - Nuevo Diamante",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:708,num:"507",name:"Nobel Mendy - Nuevo Diamante",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:709,num:"508",name:"Oso - Nuevo Diamante",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:710,num:"509",name:"Rodri Mendoza - Nuevo Protas",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:711,num:"510",name:"Aitor Ruibal - Nuevo Protas",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:712,num:"511",name:"Miguel Román - Nuevo Protas",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:713,num:"512",name:"Carlos Romero - Nuevo Protas",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:714,num:"513",name:"Maupay - Nuevo Protas",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:715,num:"514",name:"Giuliano - Nuevo Super Crack",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:716,num:"515",name:"Joao Cancelo - Nuevo Super Crack",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:717,num:"516",name:"Rodrygo - Nuevo Super Crack",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:718,num:"517",name:"Guedes - Nuevo Super Crack",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:719,num:"518",name:"Hansi Flick - Master Míster",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:720,num:"519",name:"Marcelino García - Master Míster",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:721,num:"520",name:"Card Fantástica",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:722,num:"521",name:"Courtois - Nuevo Balón de Oro",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:723,num:"522",name:"Pedri - Balón de Oro Autógrafo",team:"Nuevas Especiales",section:"Plus / Bis",owned:false},
  {id:800,num:"NW/1",name:"Vlachodimos (New Master)",team:"New Masters",section:"Edición Limitada",owned:true},
  {id:801,num:"NW/2",name:"Radu (New Master)",team:"New Masters",section:"Edición Limitada",owned:false},
  {id:802,num:"NW/3",name:"Trent (New Master)",team:"New Masters",section:"Edición Limitada",owned:false},
  {id:803,num:"NW/4",name:"Caleta-Car (New Master)",team:"New Masters",section:"Edición Limitada",owned:true},
  {id:804,num:"NW/5",name:"Hancko (New Master)",team:"New Masters",section:"Edición Limitada",owned:true},
  {id:805,num:"NW/6",name:"Suazo (New Master)",team:"New Masters",section:"Edición Limitada",owned:true},
  {id:806,num:"NW/7",name:"Nico González (New Master)",team:"New Masters",section:"Edición Limitada",owned:true},
  {id:807,num:"NW/8",name:"Santamaría (New Master)",team:"New Masters",section:"Edición Limitada",owned:true},
  {id:808,num:"NW/9",name:"Amrabat (New Master)",team:"New Masters",section:"Edición Limitada",owned:true},
  {id:809,num:"NW/10",name:"Mastantuono (New Master)",team:"New Masters",section:"Edición Limitada",owned:false},
  {id:810,num:"NW/11",name:"Almada (New Master)",team:"New Masters",section:"Edición Limitada",owned:false},
  {id:811,num:"NW/12",name:"Dolan (New Master)",team:"New Masters",section:"Edición Limitada",owned:false},
  {id:812,num:"NW/13",name:"Mikautadze (New Master)",team:"New Masters",section:"Edición Limitada",owned:false},
  {id:813,num:"NW/14",name:"Rashford (New Master)",team:"New Masters",section:"Edición Limitada",owned:true},
  {id:814,num:"NW/15",name:"Oluwaseyi (New Master)",team:"New Masters",section:"Edición Limitada",owned:true},
  {id:820,num:"MP",name:"Nico González (Megapack)",team:"Megapack",section:"Edición Limitada",owned:true},
  {id:821,num:"MP",name:"De Jong (Megapack)",team:"Megapack",section:"Edición Limitada",owned:true},
  {id:822,num:"MP",name:"Huijsen (Megapack)",team:"Megapack",section:"Edición Limitada",owned:true},
  {id:825,num:"TB",name:"Sancet (Tin Box Oro)",team:"Tin Box Oro",section:"Edición Limitada",owned:true},
  {id:826,num:"TB",name:"Koke (Tin Box Oro)",team:"Tin Box Oro",section:"Edición Limitada",owned:true},
  {id:827,num:"TB",name:"Güler (Tin Box Oro)",team:"Tin Box Oro",section:"Edición Limitada",owned:true},
  {id:828,num:"TB",name:"Mikautadze (Tin Box Oro)",team:"Tin Box Oro",section:"Edición Limitada",owned:true},
  {id:830,num:"PB",name:"Cazorla (Pocket Box Platinum)",team:"Pocket Box",section:"Edición Limitada",owned:true},
  {id:831,num:"PB",name:"Fermín (Pocket Box Platinum)",team:"Pocket Box",section:"Edición Limitada",owned:true},
  {id:832,num:"PB",name:"Iago Aspas (Pocket Box Platinum)",team:"Pocket Box",section:"Edición Limitada",owned:true},
  {id:833,num:"PB",name:"Muriqi (Pocket Box Platinum)",team:"Pocket Box",section:"Edición Limitada",owned:true},
  {id:835,num:"SP",name:"Williams (Sobre Premium)",team:"Sobre Premium",section:"Edición Limitada",owned:false},
  {id:836,num:"SP",name:"Williams - Firma Serigrafiada",team:"Sobre Premium",section:"Edición Limitada",owned:true},
  {id:837,num:"SP",name:"Ferran Torres (Sobre Premium)",team:"Sobre Premium",section:"Edición Limitada",owned:false},
  {id:838,num:"SP",name:"Ferran Torres - Firma Serigrafiada",team:"Sobre Premium",section:"Edición Limitada",owned:true},
  {id:839,num:"SP",name:"Oyarzabal (Sobre Premium)",team:"Sobre Premium",section:"Edición Limitada",owned:false},
  {id:840,num:"SP",name:"Oyarzabal - Firma Serigrafiada",team:"Sobre Premium",section:"Edición Limitada",owned:true},
  {id:841,num:"SP",name:"Ayoze (Sobre Premium)",team:"Sobre Premium",section:"Edición Limitada",owned:true},
  {id:842,num:"SP",name:"Ayoze - Firma Serigrafiada",team:"Sobre Premium",section:"Edición Limitada",owned:true},
  {id:845,num:"SPO",name:"Pedri (Premium Oro)",team:"Sobre Premium Oro",section:"Edición Limitada",owned:true},
  {id:846,num:"SPO",name:"Lamine Yamal (Premium Oro)",team:"Sobre Premium Oro",section:"Edición Limitada",owned:true},
  {id:847,num:"SPO",name:"Isco (Premium Oro)",team:"Sobre Premium Oro",section:"Edición Limitada",owned:true},
  {id:848,num:"SPO",name:"Joan García - Revelación Oro",team:"Sobre Premium Oro",section:"Edición Limitada",owned:true},
  {id:849,num:"SPO",name:"Hancko (Premium Oro)",team:"Sobre Premium Oro",section:"Edición Limitada",owned:true},
  {id:850,num:"SPO",name:"Bellingham (Premium Oro)",team:"Sobre Premium Oro",section:"Edición Limitada",owned:true},
  {id:851,num:"SPO",name:"De Frutos (Premium Oro)",team:"Sobre Premium Oro",section:"Edición Limitada",owned:true},
  {id:860,num:"MOM",name:"Koke (Momentum)",team:"Momentum",section:"Edición Limitada",owned:false},
  {id:861,num:"MOM",name:"Pedri (Momentum)",team:"Momentum",section:"Edición Limitada",owned:false},
  {id:862,num:"MOM",name:"Iago Aspas (Momentum)",team:"Momentum",section:"Edición Limitada",owned:false},
  {id:863,num:"MOM",name:"Etta Eyong (Momentum)",team:"Momentum",section:"Edición Limitada",owned:false},
  {id:864,num:"MOM",name:"Álvaro García (Momentum)",team:"Momentum",section:"Edición Limitada",owned:false},
  {id:865,num:"MOM",name:"Lamine Yamal / Vinicius (Maxi Momentum)",team:"Momentum",section:"Edición Limitada",owned:false},
  {id:870,num:"MIT",name:"Míticos Puro Oro",team:"Míticos",section:"Edición Limitada",owned:false},
  {id:871,num:"MIT",name:"Míticos Atleti",team:"Míticos",section:"Edición Limitada",owned:false},
  {id:875,num:"PEG",name:"Lamine Yamal (Panini Extra Gold)",team:"Panini Extra Gold",section:"Edición Limitada",owned:false},
  {id:876,num:"PEG",name:"Mbappé (Panini Extra Gold)",team:"Panini Extra Gold",section:"Edición Limitada",owned:false},
  {id:880,num:"J226",name:"Cubarsí (Jugón 226)",team:"Jugón",section:"Edición Limitada",owned:false},
  {id:881,num:"J227",name:"Sørloth (Jugón 227)",team:"Jugón",section:"Edición Limitada",owned:false},
  {id:882,num:"J228",name:"Ounahi (Jugón 228)",team:"Jugón",section:"Edición Limitada",owned:false},
];

const MUNDIAL_CARDS = [
  {id:1000,num:"1",name:"Lionel Messi – Argentina",team:"Golden Baller",section:"Golden Baller",owned:true},
  {id:1001,num:"2",name:"Vinicius Junior – Brasil",team:"Golden Baller",section:"Golden Baller",owned:true},
  {id:1002,num:"3",name:"Mohamed Salah – Egipto",team:"Golden Baller",section:"Golden Baller",owned:false},
  {id:1003,num:"4",name:"Harry Kane – Inglaterra",team:"Golden Baller",section:"Golden Baller",owned:true},
  {id:1004,num:"5",name:"Kylian Mbappe – Francia",team:"Golden Baller",section:"Golden Baller",owned:false},
  {id:1005,num:"6",name:"Son Heung-Min – Corea del Sur",team:"Golden Baller",section:"Golden Baller",owned:false},
  {id:1006,num:"7",name:"Erling Haaland – Noruega",team:"Golden Baller",section:"Golden Baller",owned:true},
  {id:1007,num:"8",name:"Cristiano Ronaldo – Portugal",team:"Golden Baller",section:"Golden Baller",owned:true},
  {id:1008,num:"9",name:"Lamine Yamal – España",team:"Golden Baller",section:"Golden Baller",owned:false},
  {id:1009,num:"10",name:"Ravan Ait-Nouri – Fan Favourite",team:"Argelia",section:"Selecciones",owned:false},
  {id:1010,num:"11",name:"Escudo",team:"Argelia",section:"Selecciones",owned:false},
  {id:1011,num:"12",name:"Riyad Mahrez – Icon",team:"Argelia",section:"Selecciones",owned:false},
  {id:1012,num:"13",name:"Alexis Quendouz",team:"Argelia",section:"Selecciones",owned:true},
  {id:1013,num:"14",name:"Ramv Bensebaini",team:"Argelia",section:"Selecciones",owned:true},
  {id:1014,num:"15",name:"Yousef Atal",team:"Argelia",section:"Selecciones",owned:true},
  {id:1015,num:"16",name:"Aissa Mandi",team:"Argelia",section:"Selecciones",owned:true},
  {id:1016,num:"17",name:"Nabil Bentaleb",team:"Argelia",section:"Selecciones",owned:false},
  {id:1017,num:"18",name:"Said Benrahma",team:"Argelia",section:"Selecciones",owned:true},
  {id:1018,num:"19",name:"Amine Gouiri",team:"Argelia",section:"Selecciones",owned:true},
  {id:1019,num:"20",name:"Mohamed Amoura",team:"Argelia",section:"Selecciones",owned:true},
  {id:1020,num:"21",name:"Baqhdad Bounedjah",team:"Argelia",section:"Selecciones",owned:true},
  {id:1021,num:"22",name:"Julián Álvarez – Fan Favourite",team:"Argentina",section:"Selecciones",owned:true},
  {id:1022,num:"23",name:"Escudo",team:"Argentina",section:"Selecciones",owned:false},
  {id:1023,num:"24",name:"Lionel Messi – Icon",team:"Argentina",section:"Selecciones",owned:true},
  {id:1024,num:"25",name:"Emiliano Martínez",team:"Argentina",section:"Selecciones",owned:true},
  {id:1025,num:"26",name:"Nahuel Molina",team:"Argentina",section:"Selecciones",owned:true},
  {id:1026,num:"27",name:"Cristian Romero",team:"Argentina",section:"Selecciones",owned:true},
  {id:1027,num:"28",name:"Nicolas Otamendi",team:"Argentina",section:"Selecciones",owned:true},
  {id:1028,num:"29",name:"Enzo Fernandez",team:"Argentina",section:"Selecciones",owned:true},
  {id:1029,num:"30",name:"Alexis Mac Allister",team:"Argentina",section:"Selecciones",owned:true},
  {id:1030,num:"31",name:"Rodrigo De Paul",team:"Argentina",section:"Selecciones",owned:true},
  {id:1031,num:"32",name:"Giuliano Simeone",team:"Argentina",section:"Selecciones",owned:true},
  {id:1032,num:"33",name:"Lautaro Martínez",team:"Argentina",section:"Selecciones",owned:true},
  {id:1033,num:"34",name:"Harry Souttar – Fan Favourite",team:"Australia",section:"Selecciones",owned:false},
  {id:1034,num:"35",name:"Escudo",team:"Australia",section:"Selecciones",owned:false},
  {id:1035,num:"36",name:"Mathew Ryan – Icon",team:"Australia",section:"Selecciones",owned:true},
  {id:1036,num:"37",name:"Alessandao Circati",team:"Australia",section:"Selecciones",owned:true},
  {id:1037,num:"38",name:"Jordan Bos",team:"Australia",section:"Selecciones",owned:true},
  {id:1038,num:"39",name:"Lewis Mill",team:"Australia",section:"Selecciones",owned:false},
  {id:1039,num:"40",name:"Milos Degenek",team:"Australia",section:"Selecciones",owned:true},
  {id:1040,num:"41",name:"Jackson Irvine",team:"Australia",section:"Selecciones",owned:false},
  {id:1041,num:"42",name:"Riley McGree",team:"Australia",section:"Selecciones",owned:false},
  {id:1042,num:"43",name:"Aiden O'Neill",team:"Australia",section:"Selecciones",owned:true},
  {id:1043,num:"44",name:"Connor Metcalfe",team:"Australia",section:"Selecciones",owned:true},
  {id:1044,num:"45",name:"Craig Goodwin",team:"Australia",section:"Selecciones",owned:true},
  {id:1045,num:"46",name:"Marko Arnautovic – Fan Favourite",team:"Austria",section:"Selecciones",owned:true},
  {id:1046,num:"47",name:"Escudo",team:"Austria",section:"Selecciones",owned:true},
  {id:1047,num:"48",name:"David Alaba – Icon",team:"Austria",section:"Selecciones",owned:true},
  {id:1048,num:"49",name:"Alexander Schlager",team:"Austria",section:"Selecciones",owned:true},
  {id:1049,num:"50",name:"Kevin Danso",team:"Austria",section:"Selecciones",owned:true},
  {id:1050,num:"51",name:"Philipp Lienhart",team:"Austria",section:"Selecciones",owned:true},
  {id:1051,num:"52",name:"Konrad Llaimer",team:"Austria",section:"Selecciones",owned:true},
  {id:1052,num:"53",name:"Nicolas Seiwald",team:"Austria",section:"Selecciones",owned:false},
  {id:1053,num:"54",name:"Marcel Sabitzer",team:"Austria",section:"Selecciones",owned:true},
  {id:1054,num:"55",name:"Florian Grillitsch",team:"Austria",section:"Selecciones",owned:true},
  {id:1055,num:"56",name:"Christoph Baumgartner",team:"Austria",section:"Selecciones",owned:true},
  {id:1056,num:"57",name:"Michael Gregoritsch",team:"Austria",section:"Selecciones",owned:true},
  {id:1057,num:"58",name:"Youri Tielemans – Fan Favourite",team:"Bélgica",section:"Selecciones",owned:false},
  {id:1058,num:"59",name:"Escudo",team:"Bélgica",section:"Selecciones",owned:true},
  {id:1059,num:"60",name:"Kevin De Bruyne – Icon",team:"Bélgica",section:"Selecciones",owned:true},
  {id:1060,num:"61",name:"Thibaut Courtois",team:"Bélgica",section:"Selecciones",owned:true},
  {id:1061,num:"62",name:"Arthur Theate",team:"Bélgica",section:"Selecciones",owned:true},
  {id:1062,num:"63",name:"Timothy Castagne",team:"Bélgica",section:"Selecciones",owned:true},
  {id:1063,num:"64",name:"Maxim De Cuyper",team:"Bélgica",section:"Selecciones",owned:true},
  {id:1064,num:"65",name:"Amadou Onana",team:"Bélgica",section:"Selecciones",owned:true},
  {id:1065,num:"66",name:"Jeremy Doku",team:"Bélgica",section:"Selecciones",owned:true},
  {id:1066,num:"67",name:"Charles De Ketelaere",team:"Bélgica",section:"Selecciones",owned:true},
  {id:1067,num:"68",name:"Leandro Trossard",team:"Bélgica",section:"Selecciones",owned:true},
  {id:1068,num:"69",name:"Romelu Lukaku",team:"Bélgica",section:"Selecciones",owned:true},
  {id:1069,num:"70",name:"Marquinhos – Fan Favourite",team:"Brasil",section:"Selecciones",owned:false},
  {id:1070,num:"71",name:"Escudo",team:"Brasil",section:"Selecciones",owned:true},
  {id:1071,num:"72",name:"Vinicius Junior – Icon",team:"Brasil",section:"Selecciones",owned:true},
  {id:1072,num:"73",name:"Alisson",team:"Brasil",section:"Selecciones",owned:false},
  {id:1073,num:"74",name:"Danilo",team:"Brasil",section:"Selecciones",owned:true},
  {id:1074,num:"75",name:"Eder Militao",team:"Brasil",section:"Selecciones",owned:true},
  {id:1075,num:"76",name:"Gabriel Magalhaes",team:"Brasil",section:"Selecciones",owned:true},
  {id:1076,num:"77",name:"Casemiro",team:"Brasil",section:"Selecciones",owned:true},
  {id:1077,num:"78",name:"Bruno Guimaraes",team:"Brasil",section:"Selecciones",owned:true},
  {id:1078,num:"79",name:"Rodrygo",team:"Brasil",section:"Selecciones",owned:true},
  {id:1079,num:"80",name:"Matheus Cunha",team:"Brasil",section:"Selecciones",owned:true},
  {id:1080,num:"81",name:"Raphinha",team:"Brasil",section:"Selecciones",owned:true},
  {id:1081,num:"82",name:"Jonathan David – Fan Favourite",team:"Canadá",section:"Selecciones",owned:true},
  {id:1082,num:"83",name:"Escudo",team:"Canadá",section:"Selecciones",owned:false},
  {id:1083,num:"84",name:"Alphonso Davies – Icon",team:"Canadá",section:"Selecciones",owned:true},
  {id:1084,num:"85",name:"Davne St. Clair",team:"Canadá",section:"Selecciones",owned:true},
  {id:1085,num:"86",name:"Richie Larvea",team:"Canadá",section:"Selecciones",owned:true},
  {id:1086,num:"87",name:"Derek Cornelius",team:"Canadá",section:"Selecciones",owned:true},
  {id:1087,num:"88",name:"Stephen Eustaquio",team:"Canadá",section:"Selecciones",owned:true},
  {id:1088,num:"89",name:"Ismael Kone",team:"Canadá",section:"Selecciones",owned:true},
  {id:1089,num:"90",name:"Jonathan Osorio",team:"Canadá",section:"Selecciones",owned:true},
  {id:1090,num:"91",name:"Jacob Shaffelburg",team:"Canadá",section:"Selecciones",owned:true},
  {id:1091,num:"92",name:"Tajon Buchanan",team:"Canadá",section:"Selecciones",owned:true},
  {id:1092,num:"93",name:"Cvle Larin",team:"Canadá",section:"Selecciones",owned:true},
  {id:1093,num:"94",name:"Vozinha – Fan Favourite",team:"Cabo Verde",section:"Selecciones",owned:true},
  {id:1094,num:"95",name:"Escudo",team:"Cabo Verde",section:"Selecciones",owned:true},
  {id:1095,num:"96",name:"Ryan Mendes – Icon",team:"Cabo Verde",section:"Selecciones",owned:true},
  {id:1096,num:"97",name:"Logan Costa",team:"Cabo Verde",section:"Selecciones",owned:true},
  {id:1097,num:"98",name:"Pico",team:"Cabo Verde",section:"Selecciones",owned:true},
  {id:1098,num:"99",name:"Steven Moreira",team:"Cabo Verde",section:"Selecciones",owned:false},
  {id:1099,num:"100",name:"Joao Paulo",team:"Cabo Verde",section:"Selecciones",owned:true},
  {id:1100,num:"101",name:"Kevin Pina",team:"Cabo Verde",section:"Selecciones",owned:true},
  {id:1101,num:"102",name:"Jamiro Monteiro",team:"Cabo Verde",section:"Selecciones",owned:false},
  {id:1102,num:"103",name:"Yannick Semedo",team:"Cabo Verde",section:"Selecciones",owned:true},
  {id:1103,num:"104",name:"Jovane Cabral",team:"Cabo Verde",section:"Selecciones",owned:true},
  {id:1104,num:"105",name:"Dailon Livramento",team:"Cabo Verde",section:"Selecciones",owned:true},
  {id:1105,num:"106",name:"Luis Díaz – Fan Favourite",team:"Colombia",section:"Selecciones",owned:true},
  {id:1106,num:"107",name:"Escudo",team:"Colombia",section:"Selecciones",owned:false},
  {id:1107,num:"108",name:"James Rodríguez – Icon",team:"Colombia",section:"Selecciones",owned:true},
  {id:1108,num:"109",name:"Camilo Vargas",team:"Colombia",section:"Selecciones",owned:true},
  {id:1109,num:"110",name:"Davinson Sánchez",team:"Colombia",section:"Selecciones",owned:false},
  {id:1110,num:"111",name:"Yerry Mina",team:"Colombia",section:"Selecciones",owned:true},
  {id:1111,num:"112",name:"Daniel Muñoz",team:"Colombia",section:"Selecciones",owned:true},
  {id:1112,num:"113",name:"Jefferson Lerma",team:"Colombia",section:"Selecciones",owned:true},
  {id:1113,num:"114",name:"Richard Rios",team:"Colombia",section:"Selecciones",owned:true},
  {id:1114,num:"115",name:"Juan Fernando Quintero",team:"Colombia",section:"Selecciones",owned:true},
  {id:1115,num:"116",name:"Jhon Arias",team:"Colombia",section:"Selecciones",owned:true},
  {id:1116,num:"117",name:"Luis Suárez",team:"Colombia",section:"Selecciones",owned:true},
  {id:1117,num:"118",name:"Ivan Perisic – Fan Favourite",team:"Croacia",section:"Selecciones",owned:true},
  {id:1118,num:"119",name:"Escudo",team:"Croacia",section:"Selecciones",owned:true},
  {id:1119,num:"120",name:"Luka Modric – Icon",team:"Croacia",section:"Selecciones",owned:true},
  {id:1120,num:"121",name:"Dominik Livakovic",team:"Croacia",section:"Selecciones",owned:true},
  {id:1121,num:"122",name:"Duje Caleta-Car",team:"Croacia",section:"Selecciones",owned:true},
  {id:1122,num:"123",name:"Josko Gvardiol",team:"Croacia",section:"Selecciones",owned:true},
  {id:1123,num:"124",name:"Josip Stanisic",team:"Croacia",section:"Selecciones",owned:true},
  {id:1124,num:"125",name:"Mateo Kovacic",team:"Croacia",section:"Selecciones",owned:true},
  {id:1125,num:"126",name:"Lovro Majer",team:"Croacia",section:"Selecciones",owned:true},
  {id:1126,num:"127",name:"Mario Pasalic",team:"Croacia",section:"Selecciones",owned:true},
  {id:1127,num:"128",name:"Ante Budimir",team:"Croacia",section:"Selecciones",owned:true},
  {id:1128,num:"129",name:"Andrej Kramaric",team:"Croacia",section:"Selecciones",owned:true},
  {id:1129,num:"130",name:"Jurien Gaari – Fan Favourite",team:"Curazao",section:"Selecciones",owned:true},
  {id:1130,num:"131",name:"Escudo",team:"Curazao",section:"Selecciones",owned:false},
  {id:1131,num:"132",name:"Leandro Bacuna – Icon",team:"Curazao",section:"Selecciones",owned:true},
  {id:1132,num:"133",name:"Eloy Room",team:"Curazao",section:"Selecciones",owned:true},
  {id:1133,num:"134",name:"Sherel Floranus",team:"Curazao",section:"Selecciones",owned:true},
  {id:1134,num:"135",name:"Roshon Van Eljma",team:"Curazao",section:"Selecciones",owned:false},
  {id:1135,num:"136",name:"Armando Obispo",team:"Curazao",section:"Selecciones",owned:true},
  {id:1136,num:"137",name:"Livano Comenencia",team:"Curazao",section:"Selecciones",owned:true},
  {id:1137,num:"138",name:"Juninho Bacuna",team:"Curazao",section:"Selecciones",owned:true},
  {id:1138,num:"139",name:"Kenji Gorre",team:"Curazao",section:"Selecciones",owned:true},
  {id:1139,num:"140",name:"Sontje Hansen",team:"Curazao",section:"Selecciones",owned:true},
  {id:1140,num:"141",name:"Jearl Margaritha",team:"Curazao",section:"Selecciones",owned:true},
  {id:1141,num:"142",name:"Moisés Caicedo – Fan Favourite",team:"Ecuador",section:"Selecciones",owned:true},
  {id:1142,num:"143",name:"Escudo",team:"Ecuador",section:"Selecciones",owned:true},
  {id:1143,num:"144",name:"Enner Valencia – Icon",team:"Ecuador",section:"Selecciones",owned:true},
  {id:1144,num:"145",name:"Hernán Galíndez",team:"Ecuador",section:"Selecciones",owned:false},
  {id:1145,num:"146",name:"Piero Hincapie",team:"Ecuador",section:"Selecciones",owned:true},
  {id:1146,num:"147",name:"Pervis Estupiñán",team:"Ecuador",section:"Selecciones",owned:true},
  {id:1147,num:"148",name:"Willian Pacho",team:"Ecuador",section:"Selecciones",owned:true},
  {id:1148,num:"149",name:"Ángelo Preciado",team:"Ecuador",section:"Selecciones",owned:true},
  {id:1149,num:"150",name:"Joel Ordóñez",team:"Ecuador",section:"Selecciones",owned:true},
  {id:1150,num:"151",name:"Alan Franco",team:"Ecuador",section:"Selecciones",owned:true},
  {id:1151,num:"152",name:"Gonzalo Plata",team:"Ecuador",section:"Selecciones",owned:false},
  {id:1152,num:"153",name:"Kevin Rodríguez",team:"Ecuador",section:"Selecciones",owned:false},
  {id:1153,num:"154",name:"Omar Marmoush – Fan Favourite",team:"Egipto",section:"Selecciones",owned:true},
  {id:1154,num:"155",name:"Escudo",team:"Egipto",section:"Selecciones",owned:true},
  {id:1155,num:"156",name:"Mohamed Salah – Icon",team:"Egipto",section:"Selecciones",owned:true},
  {id:1156,num:"157",name:"Mohamed El Shenawy",team:"Egipto",section:"Selecciones",owned:true},
  {id:1157,num:"158",name:"Mohamed Hany",team:"Egipto",section:"Selecciones",owned:true},
  {id:1158,num:"159",name:"Mohamed Abdelmonem",team:"Egipto",section:"Selecciones",owned:true},
  {id:1159,num:"160",name:"Ramy Rabia",team:"Egipto",section:"Selecciones",owned:true},
  {id:1160,num:"161",name:"Marwan Attia",team:"Egipto",section:"Selecciones",owned:true},
  {id:1161,num:"162",name:"Zizo",team:"Egipto",section:"Selecciones",owned:true},
  {id:1162,num:"163",name:"Hamdy Fathy",team:"Egipto",section:"Selecciones",owned:true},
  {id:1163,num:"164",name:"Mostafa Mohamed",team:"Egipto",section:"Selecciones",owned:false},
  {id:1164,num:"165",name:"Trezeguet",team:"Egipto",section:"Selecciones",owned:true},
  {id:1165,num:"166",name:"Jude Bellingham – Fan Favourite",team:"Inglaterra",section:"Selecciones",owned:true},
  {id:1166,num:"167",name:"Escudo",team:"Inglaterra",section:"Selecciones",owned:true},
  {id:1167,num:"168",name:"Harry Kane – Icon",team:"Inglaterra",section:"Selecciones",owned:true},
  {id:1168,num:"169",name:"Jordan Pickford",team:"Inglaterra",section:"Selecciones",owned:true},
  {id:1169,num:"170",name:"Reece James",team:"Inglaterra",section:"Selecciones",owned:true},
  {id:1170,num:"171",name:"John Stones",team:"Inglaterra",section:"Selecciones",owned:true},
  {id:1171,num:"172",name:"Declan Rice",team:"Inglaterra",section:"Selecciones",owned:true},
  {id:1172,num:"173",name:"Jordan Henderson",team:"Inglaterra",section:"Selecciones",owned:true},
  {id:1173,num:"174",name:"Phil Foden",team:"Inglaterra",section:"Selecciones",owned:true},
  {id:1174,num:"175",name:"Bukayo Saka",team:"Inglaterra",section:"Selecciones",owned:true},
  {id:1175,num:"176",name:"Cole Palmer",team:"Inglaterra",section:"Selecciones",owned:true},
  {id:1176,num:"177",name:"Marcus Rashford",team:"Inglaterra",section:"Selecciones",owned:true},
  {id:1177,num:"178",name:"Ousmane Dembele – Fan Favourite",team:"Francia",section:"Selecciones",owned:true},
  {id:1178,num:"179",name:"Escudo",team:"Francia",section:"Selecciones",owned:true},
  {id:1179,num:"180",name:"Kylian Mbappé – Icon",team:"Francia",section:"Selecciones",owned:false},
  {id:1180,num:"181",name:"Mike Maignan",team:"Francia",section:"Selecciones",owned:true},
  {id:1181,num:"182",name:"William Saliba",team:"Francia",section:"Selecciones",owned:true},
  {id:1182,num:"183",name:"Jules Kounde",team:"Francia",section:"Selecciones",owned:true},
  {id:1183,num:"184",name:"Theo Hernandez",team:"Francia",section:"Selecciones",owned:true},
  {id:1184,num:"185",name:"Aurelien Tchouameni",team:"Francia",section:"Selecciones",owned:true},
  {id:1185,num:"186",name:"Eduardo Camavinga",team:"Francia",section:"Selecciones",owned:true},
  {id:1186,num:"187",name:"Bradley Barcola",team:"Francia",section:"Selecciones",owned:false},
  {id:1187,num:"188",name:"Marcus Thuram",team:"Francia",section:"Selecciones",owned:true},
  {id:1188,num:"189",name:"Randal Kolo Muani",team:"Francia",section:"Selecciones",owned:true},
  {id:1189,num:"190",name:"Jamal Musiala – Fan Favourite",team:"Alemania",section:"Selecciones",owned:true},
  {id:1190,num:"191",name:"Escudo",team:"Alemania",section:"Selecciones",owned:true},
  {id:1191,num:"192",name:"Joshua Kimmich – Icon",team:"Alemania",section:"Selecciones",owned:false},
  {id:1192,num:"193",name:"Marc-Andre ter Stegen",team:"Alemania",section:"Selecciones",owned:true},
  {id:1193,num:"194",name:"Antonio Rudiger",team:"Alemania",section:"Selecciones",owned:true},
  {id:1194,num:"195",name:"Jonathan Tah",team:"Alemania",section:"Selecciones",owned:true},
  {id:1195,num:"196",name:"Felix Nmecha",team:"Alemania",section:"Selecciones",owned:false},
  {id:1196,num:"197",name:"Leon Goretzka",team:"Alemania",section:"Selecciones",owned:true},
  {id:1197,num:"198",name:"Florian Wirtz",team:"Alemania",section:"Selecciones",owned:true},
  {id:1198,num:"199",name:"Serge Gnabry",team:"Alemania",section:"Selecciones",owned:true},
  {id:1199,num:"200",name:"Kai Havertz",team:"Alemania",section:"Selecciones",owned:true},
  {id:1200,num:"201",name:"Leroy Sane",team:"Alemania",section:"Selecciones",owned:true},
  {id:1201,num:"202",name:"Thomas Partey – Fan Favourite",team:"Ghana",section:"Selecciones",owned:false},
  {id:1202,num:"203",name:"Escudo",team:"Ghana",section:"Selecciones",owned:false},
  {id:1203,num:"204",name:"Mohammed Kudus – Icon",team:"Ghana",section:"Selecciones",owned:false},
  {id:1204,num:"205",name:"Lawrence Ati Zigi",team:"Ghana",section:"Selecciones",owned:true},
  {id:1205,num:"206",name:"Alidu Seidu",team:"Ghana",section:"Selecciones",owned:true},
  {id:1206,num:"207",name:"Alexander Djiku",team:"Ghana",section:"Selecciones",owned:true},
  {id:1207,num:"208",name:"Gideon Mensah",team:"Ghana",section:"Selecciones",owned:true},
  {id:1208,num:"209",name:"Caleb Virenkvi",team:"Ghana",section:"Selecciones",owned:true},
  {id:1209,num:"210",name:"Abdul Issahaku Fatawu",team:"Ghana",section:"Selecciones",owned:true},
  {id:1210,num:"211",name:"Kamaldeen Sulemana",team:"Ghana",section:"Selecciones",owned:true},
  {id:1211,num:"212",name:"Jordan Avew",team:"Ghana",section:"Selecciones",owned:true},
  {id:1212,num:"213",name:"Antoine Semenyo",team:"Ghana",section:"Selecciones",owned:true},
  {id:1213,num:"214",name:"Frantzdy Pierrot – Fan Favourite",team:"Haití",section:"Selecciones",owned:true},
  {id:1214,num:"215",name:"Escudo",team:"Haití",section:"Selecciones",owned:false},
  {id:1215,num:"216",name:"Duckens Nazon – Icon",team:"Haití",section:"Selecciones",owned:false},
  {id:1216,num:"217",name:"Johny Placide",team:"Haití",section:"Selecciones",owned:true},
  {id:1217,num:"218",name:"Ricardo Ade",team:"Haití",section:"Selecciones",owned:true},
  {id:1218,num:"219",name:"Carlens Arcus",team:"Haití",section:"Selecciones",owned:true},
  {id:1219,num:"220",name:"Hannes Delcroix",team:"Haití",section:"Selecciones",owned:true},
  {id:1220,num:"221",name:"Leverton Pierre",team:"Haití",section:"Selecciones",owned:true},
  {id:1221,num:"222",name:"Danley Jean Jacques",team:"Haití",section:"Selecciones",owned:true},
  {id:1222,num:"223",name:"Jean-Ricner Bellegarde",team:"Haití",section:"Selecciones",owned:true},
  {id:1223,num:"224",name:"Ruben Providence",team:"Haití",section:"Selecciones",owned:true},
  {id:1224,num:"225",name:"Don Deedson Louicius",team:"Haití",section:"Selecciones",owned:true},
  {id:1225,num:"226",name:"Mehdi Taremi – Fan Favourite",team:"Irán",section:"Selecciones",owned:true},
  {id:1226,num:"227",name:"Escudo",team:"Irán",section:"Selecciones",owned:false},
  {id:1227,num:"228",name:"Sardar Azmoun – Icon",team:"Irán",section:"Selecciones",owned:true},
  {id:1228,num:"229",name:"Alireza Beiranvand",team:"Irán",section:"Selecciones",owned:true},
  {id:1229,num:"230",name:"Shoja Khalilzadeh",team:"Irán",section:"Selecciones",owned:false},
  {id:1230,num:"231",name:"Milad Mohammadi",team:"Irán",section:"Selecciones",owned:true},
  {id:1231,num:"232",name:"Ramin Rrezaeian",team:"Irán",section:"Selecciones",owned:false},
  {id:1232,num:"233",name:"Hossein Kanaani",team:"Irán",section:"Selecciones",owned:true},
  {id:1233,num:"234",name:"Saeid Ezatolahi",team:"Irán",section:"Selecciones",owned:true},
  {id:1234,num:"235",name:"Saman Ghoddos",team:"Irán",section:"Selecciones",owned:true},
  {id:1235,num:"236",name:"Mohammad Mohebi",team:"Irán",section:"Selecciones",owned:true},
  {id:1236,num:"237",name:"Alireza Jahanbakhsh",team:"Irán",section:"Selecciones",owned:true},
  {id:1237,num:"238",name:"Franck Kessie – Fan Favourite",team:"Costa de Marfil",section:"Selecciones",owned:false},
  {id:1238,num:"239",name:"Escudo",team:"Costa de Marfil",section:"Selecciones",owned:true},
  {id:1239,num:"240",name:"Sebastien Haller – Icon",team:"Costa de Marfil",section:"Selecciones",owned:false},
  {id:1240,num:"241",name:"Yahia Fofana",team:"Costa de Marfil",section:"Selecciones",owned:true},
  {id:1241,num:"242",name:"Ghislain Konan",team:"Costa de Marfil",section:"Selecciones",owned:true},
  {id:1242,num:"243",name:"Odilon Kossounou",team:"Costa de Marfil",section:"Selecciones",owned:true},
  {id:1243,num:"244",name:"Evan N'Dicka",team:"Costa de Marfil",section:"Selecciones",owned:true},
  {id:1244,num:"245",name:"Wilfried Singo",team:"Costa de Marfil",section:"Selecciones",owned:true},
  {id:1245,num:"246",name:"Ibrahim Sangare",team:"Costa de Marfil",section:"Selecciones",owned:true},
  {id:1246,num:"247",name:"Nicolas Pepe",team:"Costa de Marfil",section:"Selecciones",owned:true},
  {id:1247,num:"248",name:"Simon Adingra",team:"Costa de Marfil",section:"Selecciones",owned:true},
  {id:1248,num:"249",name:"Oumar Diakite",team:"Costa de Marfil",section:"Selecciones",owned:true},
  {id:1249,num:"250",name:"Takumi Minamino – Fan Favourite",team:"Japón",section:"Selecciones",owned:true},
  {id:1250,num:"251",name:"Escudo",team:"Japón",section:"Selecciones",owned:true},
  {id:1251,num:"252",name:"Takefusa Kubo – Icon",team:"Japón",section:"Selecciones",owned:false},
  {id:1252,num:"253",name:"Zion Suzuki",team:"Japón",section:"Selecciones",owned:false},
  {id:1253,num:"254",name:"Tsuvoshi Watanabe",team:"Japón",section:"Selecciones",owned:true},
  {id:1254,num:"255",name:"Kaishu Sano",team:"Japón",section:"Selecciones",owned:true},
  {id:1255,num:"256",name:"Ao Tanaka",team:"Japón",section:"Selecciones",owned:true},
  {id:1256,num:"257",name:"Daichi Kamada",team:"Japón",section:"Selecciones",owned:true},
  {id:1257,num:"258",name:"Ritsu Doan",team:"Japón",section:"Selecciones",owned:false},
  {id:1258,num:"259",name:"Keito Nakamura",team:"Japón",section:"Selecciones",owned:true},
  {id:1259,num:"260",name:"Shuto Machino",team:"Japón",section:"Selecciones",owned:true},
  {id:1260,num:"261",name:"Avase Ueda",team:"Japón",section:"Selecciones",owned:true},
  {id:1261,num:"262",name:"Vazan Al-Naimat – Fan Favourite",team:"Jordania",section:"Selecciones",owned:true},
  {id:1262,num:"263",name:"Escudo",team:"Jordania",section:"Selecciones",owned:true},
  {id:1263,num:"264",name:"Musa Al-Taamari – Icon",team:"Jordania",section:"Selecciones",owned:false},
  {id:1264,num:"265",name:"Vazeed Abulaila",team:"Jordania",section:"Selecciones",owned:true},
  {id:1265,num:"266",name:"Mohammad Abu Hashish",team:"Jordania",section:"Selecciones",owned:true},
  {id:1266,num:"267",name:"Yazan Al-Arab",team:"Jordania",section:"Selecciones",owned:false},
  {id:1267,num:"268",name:"Abdallah Nasib",team:"Jordania",section:"Selecciones",owned:true},
  {id:1268,num:"269",name:"Ibrahim Saadeh",team:"Jordania",section:"Selecciones",owned:true},
  {id:1269,num:"270",name:"Nizar Al-Rashdan",team:"Jordania",section:"Selecciones",owned:true},
  {id:1270,num:"271",name:"Noor Al-Rawabdeh",team:"Jordania",section:"Selecciones",owned:true},
  {id:1271,num:"272",name:"Mahmoud Al-Mardi",team:"Jordania",section:"Selecciones",owned:true},
  {id:1272,num:"273",name:"Ali Olwan",team:"Jordania",section:"Selecciones",owned:true},
  {id:1273,num:"274",name:"Min-jae Kim – Fan Favourite",team:"Corea del Sur",section:"Selecciones",owned:true},
  {id:1274,num:"275",name:"Escudo",team:"Corea del Sur",section:"Selecciones",owned:true},
  {id:1275,num:"276",name:"Heung-min Son – Icon",team:"Corea del Sur",section:"Selecciones",owned:false},
  {id:1276,num:"277",name:"Hyeon-woo Jo",team:"Corea del Sur",section:"Selecciones",owned:true},
  {id:1277,num:"278",name:"Young-woo Seol",team:"Corea del Sur",section:"Selecciones",owned:true},
  {id:1278,num:"279",name:"Yu-min Cho",team:"Corea del Sur",section:"Selecciones",owned:true},
  {id:1279,num:"280",name:"Tae-seok Lee",team:"Corea del Sur",section:"Selecciones",owned:true},
  {id:1280,num:"281",name:"In-beom Hwang",team:"Corea del Sur",section:"Selecciones",owned:true},
  {id:1281,num:"282",name:"Jae-sung Lee",team:"Corea del Sur",section:"Selecciones",owned:true},
  {id:1282,num:"283",name:"Kang-in Lee",team:"Corea del Sur",section:"Selecciones",owned:true},
  {id:1283,num:"284",name:"Hveon-gyu Oh",team:"Corea del Sur",section:"Selecciones",owned:true},
  {id:1284,num:"285",name:"Hee-chan Hwang",team:"Corea del Sur",section:"Selecciones",owned:true},
  {id:1285,num:"286",name:"Edson Álvarez – Fan Favourite",team:"México",section:"Selecciones",owned:true},
  {id:1286,num:"287",name:"Escudo",team:"México",section:"Selecciones",owned:false},
  {id:1287,num:"288",name:"Raúl Jiménez – Icon",team:"México",section:"Selecciones",owned:false},
  {id:1288,num:"289",name:"Luis Malagón",team:"México",section:"Selecciones",owned:false},
  {id:1289,num:"290",name:"Israel Reyes",team:"México",section:"Selecciones",owned:true},
  {id:1290,num:"291",name:"Johan Vásquez",team:"México",section:"Selecciones",owned:false},
  {id:1291,num:"292",name:"César Montes",team:"México",section:"Selecciones",owned:false},
  {id:1292,num:"293",name:"Jesús Gallardo",team:"México",section:"Selecciones",owned:true},
  {id:1293,num:"294",name:"Carlos Rodríguez",team:"México",section:"Selecciones",owned:true},
  {id:1294,num:"295",name:"Orbelín Pineda",team:"México",section:"Selecciones",owned:true},
  {id:1295,num:"296",name:"Hirving Lozano",team:"México",section:"Selecciones",owned:true},
  {id:1296,num:"297",name:"Santiago Giménez",team:"México",section:"Selecciones",owned:true},
  {id:1297,num:"298",name:"Youssef En-Nesyri – Fan Favourite",team:"Marruecos",section:"Selecciones",owned:false},
  {id:1298,num:"299",name:"Escudo",team:"Marruecos",section:"Selecciones",owned:false},
  {id:1299,num:"300",name:"Achraf Hakimi – Icon",team:"Marruecos",section:"Selecciones",owned:false},
  {id:1300,num:"301",name:"Vassine Bounou",team:"Marruecos",section:"Selecciones",owned:true},
  {id:1301,num:"302",name:"Noussair Mazraqui",team:"Marruecos",section:"Selecciones",owned:true},
  {id:1302,num:"303",name:"Navef Aguero",team:"Marruecos",section:"Selecciones",owned:true},
  {id:1303,num:"304",name:"Sofyan Amrabat",team:"Marruecos",section:"Selecciones",owned:true},
  {id:1304,num:"305",name:"Eliesse Ben Seghir",team:"Marruecos",section:"Selecciones",owned:false},
  {id:1305,num:"306",name:"Ismael Saibari",team:"Marruecos",section:"Selecciones",owned:false},
  {id:1306,num:"307",name:"Brahim Díaz",team:"Marruecos",section:"Selecciones",owned:false},
  {id:1307,num:"308",name:"Abde Ezzalzouli",team:"Marruecos",section:"Selecciones",owned:true},
  {id:1308,num:"309",name:"Avoub El Kaabi",team:"Marruecos",section:"Selecciones",owned:true},
  {id:1309,num:"310",name:"Memphis Depay – Fan Favourite",team:"Países Bajos",section:"Selecciones",owned:false},
  {id:1310,num:"311",name:"Escudo",team:"Países Bajos",section:"Selecciones",owned:false},
  {id:1311,num:"312",name:"Virgil van Dijk – Icon",team:"Países Bajos",section:"Selecciones",owned:true},
  {id:1312,num:"313",name:"Bart Verbruggen",team:"Países Bajos",section:"Selecciones",owned:true},
  {id:1313,num:"314",name:"Nathan Ake",team:"Países Bajos",section:"Selecciones",owned:false},
  {id:1314,num:"315",name:"Jeremie Frimpong",team:"Países Bajos",section:"Selecciones",owned:true},
  {id:1315,num:"316",name:"Denzel Dumfries",team:"Países Bajos",section:"Selecciones",owned:true},
  {id:1316,num:"317",name:"Tijani Reijnders",team:"Países Bajos",section:"Selecciones",owned:true},
  {id:1317,num:"318",name:"Ryan Gravenberch",team:"Países Bajos",section:"Selecciones",owned:true},
  {id:1318,num:"319",name:"Cody Gakpo",team:"Países Bajos",section:"Selecciones",owned:true},
  {id:1319,num:"320",name:"Donyell Malen",team:"Países Bajos",section:"Selecciones",owned:true},
  {id:1320,num:"321",name:"Wout Weghorst",team:"Países Bajos",section:"Selecciones",owned:true},
  {id:1321,num:"322",name:"Marko Stamenic – Fan Favourite",team:"Nueva Zelanda",section:"Selecciones",owned:false},
  {id:1322,num:"323",name:"Escudo",team:"Nueva Zelanda",section:"Selecciones",owned:true},
  {id:1323,num:"324",name:"Chris Wood – Icon",team:"Nueva Zelanda",section:"Selecciones",owned:false},
  {id:1324,num:"325",name:"Max Crogombe",team:"Nueva Zelanda",section:"Selecciones",owned:true},
  {id:1325,num:"326",name:"Michael Boxall",team:"Nueva Zelanda",section:"Selecciones",owned:true},
  {id:1326,num:"327",name:"Liberato Cacace",team:"Nueva Zelanda",section:"Selecciones",owned:true},
  {id:1327,num:"328",name:"Tim Payne",team:"Nueva Zelanda",section:"Selecciones",owned:true},
  {id:1328,num:"329",name:"Finn Surman",team:"Nueva Zelanda",section:"Selecciones",owned:false},
  {id:1329,num:"330",name:"Joe Bell",team:"Nueva Zelanda",section:"Selecciones",owned:true},
  {id:1330,num:"331",name:"Sarpreet Singh",team:"Nueva Zelanda",section:"Selecciones",owned:true},
  {id:1331,num:"332",name:"Matt Garbett",team:"Nueva Zelanda",section:"Selecciones",owned:true},
  {id:1332,num:"333",name:"Elijah Just",team:"Nueva Zelanda",section:"Selecciones",owned:true},
  {id:1333,num:"334",name:"Martin Odegaard – Fan Favourite",team:"Noruega",section:"Selecciones",owned:false},
  {id:1334,num:"335",name:"Escudo",team:"Noruega",section:"Selecciones",owned:true},
  {id:1335,num:"336",name:"Erling Haaland – Icon",team:"Noruega",section:"Selecciones",owned:false},
  {id:1336,num:"337",name:"Orjan Nyland",team:"Noruega",section:"Selecciones",owned:true},
  {id:1337,num:"338",name:"Julian Ryerson",team:"Noruega",section:"Selecciones",owned:true},
  {id:1338,num:"339",name:"Kristoffer Vassbakk Ajer",team:"Noruega",section:"Selecciones",owned:true},
  {id:1339,num:"340",name:"David Moller Wolfe",team:"Noruega",section:"Selecciones",owned:true},
  {id:1340,num:"341",name:"Sander Berge",team:"Noruega",section:"Selecciones",owned:true},
  {id:1341,num:"342",name:"Patrick Berg",team:"Noruega",section:"Selecciones",owned:true},
  {id:1342,num:"343",name:"Antonio Nusa",team:"Noruega",section:"Selecciones",owned:false},
  {id:1343,num:"344",name:"Oscar Bobb",team:"Noruega",section:"Selecciones",owned:false},
  {id:1344,num:"345",name:"Alexander Sorloth",team:"Noruega",section:"Selecciones",owned:false},
  {id:1345,num:"346",name:"Michael Amir Murillo – Fan Favourite",team:"Panamá",section:"Selecciones",owned:false},
  {id:1346,num:"347",name:"Escudo",team:"Panamá",section:"Selecciones",owned:true},
  {id:1347,num:"348",name:"Anibal Godoy – Icon",team:"Panamá",section:"Selecciones",owned:true},
  {id:1348,num:"349",name:"Orlando Mosquera",team:"Panamá",section:"Selecciones",owned:true},
  {id:1349,num:"350",name:"Andrés Andrade",team:"Panamá",section:"Selecciones",owned:false},
  {id:1350,num:"351",name:"Fidel Escobar",team:"Panamá",section:"Selecciones",owned:true},
  {id:1351,num:"352",name:"Cristian Martínez",team:"Panamá",section:"Selecciones",owned:true},
  {id:1352,num:"353",name:"Adalberto Carrasquilla",team:"Panamá",section:"Selecciones",owned:true},
  {id:1353,num:"354",name:"Edgar Barcenas",team:"Panamá",section:"Selecciones",owned:false},
  {id:1354,num:"355",name:"José Fajardo",team:"Panamá",section:"Selecciones",owned:true},
  {id:1355,num:"356",name:"Ismael Díaz",team:"Panamá",section:"Selecciones",owned:true},
  {id:1356,num:"357",name:"Jose Luiz Rodríguez",team:"Panamá",section:"Selecciones",owned:true},
  {id:1357,num:"358",name:"Gustavo Gómez – Fan Favourite",team:"Paraguay",section:"Selecciones",owned:true},
  {id:1358,num:"359",name:"Escudo",team:"Paraguay",section:"Selecciones",owned:true},
  {id:1359,num:"360",name:"Miguel Almirón – Icon",team:"Paraguay",section:"Selecciones",owned:true},
  {id:1360,num:"361",name:"Roberto Fernández",team:"Paraguay",section:"Selecciones",owned:true},
  {id:1361,num:"362",name:"Juan José Cáceres",team:"Paraguay",section:"Selecciones",owned:true},
  {id:1362,num:"363",name:"Omar Alderete",team:"Paraguay",section:"Selecciones",owned:false},
  {id:1363,num:"364",name:"Junior Alonso",team:"Paraguay",section:"Selecciones",owned:false},
  {id:1364,num:"365",name:"Andrés Cubas",team:"Paraguay",section:"Selecciones",owned:false},
  {id:1365,num:"366",name:"Mathias Villasanti",team:"Paraguay",section:"Selecciones",owned:true},
  {id:1366,num:"367",name:"Julio Enciso",team:"Paraguay",section:"Selecciones",owned:true},
  {id:1367,num:"368",name:"Ramón Sosa",team:"Paraguay",section:"Selecciones",owned:true},
  {id:1368,num:"369",name:"Antonio Sanabria",team:"Paraguay",section:"Selecciones",owned:false},
  {id:1369,num:"370",name:"Vitinha – Fan Favourite",team:"Portugal",section:"Selecciones",owned:true},
  {id:1370,num:"371",name:"Escudo",team:"Portugal",section:"Selecciones",owned:true},
  {id:1371,num:"372",name:"Cristiano Ronaldo – Icon",team:"Portugal",section:"Selecciones",owned:true},
  {id:1372,num:"373",name:"Diogo Costa",team:"Portugal",section:"Selecciones",owned:false},
  {id:1373,num:"374",name:"Ruben Dias",team:"Portugal",section:"Selecciones",owned:true},
  {id:1374,num:"375",name:"Nuno Mendes",team:"Portugal",section:"Selecciones",owned:true},
  {id:1375,num:"376",name:"Bernardo Silva",team:"Portugal",section:"Selecciones",owned:true},
  {id:1376,num:"377",name:"Bruno Fernandes",team:"Portugal",section:"Selecciones",owned:true},
  {id:1377,num:"378",name:"Ruben Neves",team:"Portugal",section:"Selecciones",owned:true},
  {id:1378,num:"379",name:"Francisco Conceicao",team:"Portugal",section:"Selecciones",owned:true},
  {id:1379,num:"380",name:"Pedro Neto",team:"Portugal",section:"Selecciones",owned:true},
  {id:1380,num:"381",name:"Rafael Leao",team:"Portugal",section:"Selecciones",owned:true},
  {id:1381,num:"382",name:"Almoez Ali – Fan Favourite",team:"Catar",section:"Selecciones",owned:true},
  {id:1382,num:"383",name:"Escudo",team:"Catar",section:"Selecciones",owned:true},
  {id:1383,num:"384",name:"Hasan Al-Haydos – Icon",team:"Catar",section:"Selecciones",owned:true},
  {id:1384,num:"385",name:"Meshaal Barsham",team:"Catar",section:"Selecciones",owned:true},
  {id:1385,num:"386",name:"Boualem Khoukhi",team:"Catar",section:"Selecciones",owned:true},
  {id:1386,num:"387",name:"Lucas Mendes",team:"Catar",section:"Selecciones",owned:true},
  {id:1387,num:"388",name:"Pedro Miguel",team:"Catar",section:"Selecciones",owned:true},
  {id:1388,num:"389",name:"Homam Al-Amin",team:"Catar",section:"Selecciones",owned:false},
  {id:1389,num:"390",name:"Ahmed Fathi",team:"Catar",section:"Selecciones",owned:true},
  {id:1390,num:"391",name:"Edmilson Junior",team:"Catar",section:"Selecciones",owned:true},
  {id:1391,num:"392",name:"Ahmed Al-Ganehi",team:"Catar",section:"Selecciones",owned:true},
  {id:1392,num:"393",name:"Akram Hassan Afif",team:"Catar",section:"Selecciones",owned:true},
  {id:1393,num:"394",name:"Feras Albrikan – Fan Favourite",team:"Arabia Saudí",section:"Selecciones",owned:false},
  {id:1394,num:"395",name:"Escudo",team:"Arabia Saudí",section:"Selecciones",owned:false},
  {id:1395,num:"396",name:"Salem Aldawsari – Icon",team:"Arabia Saudí",section:"Selecciones",owned:true},
  {id:1396,num:"397",name:"Nawaf Alaqidi",team:"Arabia Saudí",section:"Selecciones",owned:false},
  {id:1397,num:"398",name:"Hassan Altambakti",team:"Arabia Saudí",section:"Selecciones",owned:true},
  {id:1398,num:"399",name:"Jehad Thikri",team:"Arabia Saudí",section:"Selecciones",owned:true},
  {id:1399,num:"400",name:"Saud Abdulhamid",team:"Arabia Saudí",section:"Selecciones",owned:true},
  {id:1400,num:"401",name:"Nasser Aldawsari",team:"Arabia Saudí",section:"Selecciones",owned:true},
  {id:1401,num:"402",name:"Abdullah Alkhaibari",team:"Arabia Saudí",section:"Selecciones",owned:true},
  {id:1402,num:"403",name:"Musab Aljuwayr",team:"Arabia Saudí",section:"Selecciones",owned:true},
  {id:1403,num:"404",name:"Saleh Abu Alshamat",team:"Arabia Saudí",section:"Selecciones",owned:true},
  {id:1404,num:"405",name:"Saleh Alsheheri",team:"Arabia Saudí",section:"Selecciones",owned:true},
  {id:1405,num:"406",name:"Scott McTominay – Fan Favourite",team:"Escocia",section:"Selecciones",owned:true},
  {id:1406,num:"407",name:"Escudo",team:"Escocia",section:"Selecciones",owned:true},
  {id:1407,num:"408",name:"Andrew Robertson – Icon",team:"Escocia",section:"Selecciones",owned:true},
  {id:1408,num:"409",name:"Angus Gunn",team:"Escocia",section:"Selecciones",owned:true},
  {id:1409,num:"410",name:"Kieran Tierney",team:"Escocia",section:"Selecciones",owned:false},
  {id:1410,num:"411",name:"Grant Hanley",team:"Escocia",section:"Selecciones",owned:true},
  {id:1411,num:"412",name:"Billy Gilmour",team:"Escocia",section:"Selecciones",owned:true},
  {id:1412,num:"413",name:"Lewis Ferguson",team:"Escocia",section:"Selecciones",owned:false},
  {id:1413,num:"414",name:"Ryan Christie",team:"Escocia",section:"Selecciones",owned:true},
  {id:1414,num:"415",name:"John McGinn",team:"Escocia",section:"Selecciones",owned:true},
  {id:1415,num:"416",name:"Ben Gannon-Doak",team:"Escocia",section:"Selecciones",owned:true},
  {id:1416,num:"417",name:"Che Adams",team:"Escocia",section:"Selecciones",owned:true},
  {id:1417,num:"418",name:"Kalidou Koulibaly – Fan Favourite",team:"Senegal",section:"Selecciones",owned:false},
  {id:1418,num:"419",name:"Escudo",team:"Senegal",section:"Selecciones",owned:true},
  {id:1419,num:"420",name:"Sadio Mane – Icon",team:"Senegal",section:"Selecciones",owned:false},
  {id:1420,num:"421",name:"Edouard Mendy",team:"Senegal",section:"Selecciones",owned:false},
  {id:1421,num:"422",name:"Moussa Niakhate",team:"Senegal",section:"Selecciones",owned:true},
  {id:1422,num:"423",name:"El Hadji Malick Diouf",team:"Senegal",section:"Selecciones",owned:true},
  {id:1423,num:"424",name:"Idrissa Gana Gueye",team:"Senegal",section:"Selecciones",owned:true},
  {id:1424,num:"425",name:"Pape Matar Sarr",team:"Senegal",section:"Selecciones",owned:false},
  {id:1425,num:"426",name:"Iliman Ndiaye",team:"Senegal",section:"Selecciones",owned:true},
  {id:1426,num:"427",name:"Krepin Diatta",team:"Senegal",section:"Selecciones",owned:true},
  {id:1427,num:"428",name:"Ismaila Sarr",team:"Senegal",section:"Selecciones",owned:true},
  {id:1428,num:"429",name:"Nicolas Jackson",team:"Senegal",section:"Selecciones",owned:true},
  {id:1429,num:"430",name:"Lvle Foster – Fan Favourite",team:"Sudáfrica",section:"Selecciones",owned:true},
  {id:1430,num:"431",name:"Escudo",team:"Sudáfrica",section:"Selecciones",owned:false},
  {id:1431,num:"432",name:"Ronwen Williams – Icon",team:"Sudáfrica",section:"Selecciones",owned:true},
  {id:1432,num:"433",name:"Siyabonga Ngezana",team:"Sudáfrica",section:"Selecciones",owned:true},
  {id:1433,num:"434",name:"Aubrey Modiba",team:"Sudáfrica",section:"Selecciones",owned:true},
  {id:1434,num:"435",name:"Mbekezeli Mbokazi",team:"Sudáfrica",section:"Selecciones",owned:true},
  {id:1435,num:"436",name:"Khuliso Mudau",team:"Sudáfrica",section:"Selecciones",owned:true},
  {id:1436,num:"437",name:"Teboho Mokoena",team:"Sudáfrica",section:"Selecciones",owned:true},
  {id:1437,num:"438",name:"Yaya Sithole",team:"Sudáfrica",section:"Selecciones",owned:false},
  {id:1438,num:"439",name:"Themba Zwane",team:"Sudáfrica",section:"Selecciones",owned:false},
  {id:1439,num:"440",name:"Oswin Appollis",team:"Sudáfrica",section:"Selecciones",owned:true},
  {id:1440,num:"441",name:"Iqraam Rayners",team:"Sudáfrica",section:"Selecciones",owned:true},
  {id:1441,num:"442",name:"Lamine Yamal – Fan Favourite",team:"España",section:"Selecciones",owned:false},
  {id:1442,num:"443",name:"Escudo",team:"España",section:"Selecciones",owned:false},
  {id:1443,num:"444",name:"Rodri – Icon",team:"España",section:"Selecciones",owned:true},
  {id:1444,num:"445",name:"Unai Simón",team:"España",section:"Selecciones",owned:true},
  {id:1445,num:"446",name:"Robin Le Normand",team:"España",section:"Selecciones",owned:true},
  {id:1446,num:"447",name:"Dean Huijsen",team:"España",section:"Selecciones",owned:true},
  {id:1447,num:"448",name:"Marc Cucurella",team:"España",section:"Selecciones",owned:true},
  {id:1448,num:"449",name:"Martín Zubimendi",team:"España",section:"Selecciones",owned:false},
  {id:1449,num:"450",name:"Pedri",team:"España",section:"Selecciones",owned:true},
  {id:1450,num:"451",name:"Fabián Ruiz",team:"España",section:"Selecciones",owned:true},
  {id:1451,num:"452",name:"Nico Williams",team:"España",section:"Selecciones",owned:true},
  {id:1452,num:"453",name:"Mikel Oyarzabal",team:"España",section:"Selecciones",owned:true},
  {id:1453,num:"454",name:"Manuel Akanji – Fan Favourite",team:"Suiza",section:"Selecciones",owned:false},
  {id:1454,num:"455",name:"Escudo",team:"Suiza",section:"Selecciones",owned:false},
  {id:1455,num:"456",name:"Granit Xhaka – Icon",team:"Suiza",section:"Selecciones",owned:true},
  {id:1456,num:"457",name:"Gregor Kobel",team:"Suiza",section:"Selecciones",owned:false},
  {id:1457,num:"458",name:"Nico Elvedi",team:"Suiza",section:"Selecciones",owned:true},
  {id:1458,num:"459",name:"Ricardo Rodriguez",team:"Suiza",section:"Selecciones",owned:false},
  {id:1459,num:"460",name:"Silvan Widmer",team:"Suiza",section:"Selecciones",owned:false},
  {id:1460,num:"461",name:"Denis Zakaria",team:"Suiza",section:"Selecciones",owned:true},
  {id:1461,num:"462",name:"Remo Freuler",team:"Suiza",section:"Selecciones",owned:true},
  {id:1462,num:"463",name:"Breel Embolo",team:"Suiza",section:"Selecciones",owned:true},
  {id:1463,num:"464",name:"Ruben Vargas",team:"Suiza",section:"Selecciones",owned:true},
  {id:1464,num:"465",name:"Dan Ndoye",team:"Suiza",section:"Selecciones",owned:true},
  {id:1465,num:"466",name:"Ferjani Sassi – Fan Favourite",team:"Túnez",section:"Selecciones",owned:true},
  {id:1466,num:"467",name:"Escudo",team:"Túnez",section:"Selecciones",owned:true},
  {id:1467,num:"468",name:"Ellyes Skhiri – Icon",team:"Túnez",section:"Selecciones",owned:true},
  {id:1468,num:"469",name:"Aymen Dahmen",team:"Túnez",section:"Selecciones",owned:true},
  {id:1469,num:"470",name:"Montassar Talbi",team:"Túnez",section:"Selecciones",owned:true},
  {id:1470,num:"471",name:"Vassine Meriah",team:"Túnez",section:"Selecciones",owned:true},
  {id:1471,num:"472",name:"Ali Abdi",team:"Túnez",section:"Selecciones",owned:true},
  {id:1472,num:"473",name:"Aissa Laidouni",team:"Túnez",section:"Selecciones",owned:true},
  {id:1473,num:"474",name:"Hannibal Mejbri",team:"Túnez",section:"Selecciones",owned:false},
  {id:1474,num:"475",name:"Naim Sliti",team:"Túnez",section:"Selecciones",owned:true},
  {id:1475,num:"476",name:"Elias Achouri",team:"Túnez",section:"Selecciones",owned:true},
  {id:1476,num:"477",name:"Hazem Mastouri",team:"Túnez",section:"Selecciones",owned:false},
  {id:1477,num:"478",name:"Weston McKennie – Fan Favourite",team:"Estados Unidos",section:"Selecciones",owned:true},
  {id:1478,num:"479",name:"Escudo",team:"Estados Unidos",section:"Selecciones",owned:false},
  {id:1479,num:"480",name:"Christian Pulisic – Icon",team:"Estados Unidos",section:"Selecciones",owned:true},
  {id:1480,num:"481",name:"Matt Freese",team:"Estados Unidos",section:"Selecciones",owned:true},
  {id:1481,num:"482",name:"Chris Richards",team:"Estados Unidos",section:"Selecciones",owned:false},
  {id:1482,num:"483",name:"Tim Ream",team:"Estados Unidos",section:"Selecciones",owned:true},
  {id:1483,num:"484",name:"Antonee Robinson",team:"Estados Unidos",section:"Selecciones",owned:true},
  {id:1484,num:"485",name:"Tanner Tessmann",team:"Estados Unidos",section:"Selecciones",owned:true},
  {id:1485,num:"486",name:"Tvler Adams",team:"Estados Unidos",section:"Selecciones",owned:true},
  {id:1486,num:"487",name:"Timothy Weah",team:"Estados Unidos",section:"Selecciones",owned:true},
  {id:1487,num:"488",name:"Malik Tillman",team:"Estados Unidos",section:"Selecciones",owned:true},
  {id:1488,num:"489",name:"Folarin Balogun",team:"Estados Unidos",section:"Selecciones",owned:true},
  {id:1489,num:"490",name:"José María Giménez – Fan Favourite",team:"Uruguay",section:"Selecciones",owned:true},
  {id:1490,num:"491",name:"Escudo",team:"Uruguay",section:"Selecciones",owned:true},
  {id:1491,num:"492",name:"Federico Valverde – Icon",team:"Uruguay",section:"Selecciones",owned:true},
  {id:1492,num:"493",name:"Sergio Rochet",team:"Uruguay",section:"Selecciones",owned:true},
  {id:1493,num:"494",name:"Ronald Araújo",team:"Uruguay",section:"Selecciones",owned:true},
  {id:1494,num:"495",name:"Sebastián Cáceres",team:"Uruguay",section:"Selecciones",owned:false},
  {id:1495,num:"496",name:"Mathias Olivera",team:"Uruguay",section:"Selecciones",owned:true},
  {id:1496,num:"497",name:"Nahitan Nández",team:"Uruguay",section:"Selecciones",owned:true},
  {id:1497,num:"498",name:"Rodrigo Bentancur",team:"Uruguay",section:"Selecciones",owned:false},
  {id:1498,num:"499",name:"Manuel Ugarte",team:"Uruguay",section:"Selecciones",owned:true},
  {id:1499,num:"500",name:"Facundo Pellistri",team:"Uruguay",section:"Selecciones",owned:true},
  {id:1500,num:"501",name:"Darwin Núñez",team:"Uruguay",section:"Selecciones",owned:true},
  {id:1501,num:"502",name:"Abdukodir Khuasanov – Fan Favourite",team:"Uzbekistán",section:"Selecciones",owned:true},
  {id:1502,num:"503",name:"Escudo",team:"Uzbekistán",section:"Selecciones",owned:true},
  {id:1503,num:"504",name:"Eldor Shomurodov – Icon",team:"Uzbekistán",section:"Selecciones",owned:true},
  {id:1504,num:"505",name:"Utkir Yusupov",team:"Uzbekistán",section:"Selecciones",owned:true},
  {id:1505,num:"506",name:"Farrukh Sayfiev",team:"Uzbekistán",section:"Selecciones",owned:true},
  {id:1506,num:"507",name:"Sherzod Nasrullaev",team:"Uzbekistán",section:"Selecciones",owned:true},
  {id:1507,num:"508",name:"Husniddin Aliqulov",team:"Uzbekistán",section:"Selecciones",owned:true},
  {id:1508,num:"509",name:"Rustam Ashurmatov",team:"Uzbekistán",section:"Selecciones",owned:true},
  {id:1509,num:"510",name:"Khojiakbar Alijonov",team:"Uzbekistán",section:"Selecciones",owned:true},
  {id:1510,num:"511",name:"Odiljon Hamrobekov",team:"Uzbekistán",section:"Selecciones",owned:true},
  {id:1511,num:"512",name:"Otabek Shukurov",team:"Uzbekistán",section:"Selecciones",owned:true},
  {id:1512,num:"513",name:"Abbosbek Fayzullaev",team:"Uzbekistán",section:"Selecciones",owned:true},
  {id:1513,num:"514",name:"Italy - Irlanda del Norte / Gales",team:"Contenders",section:"Selecciones",owned:true},
  {id:1514,num:"515",name:"Ucrania - Suecia / Polonia",team:"Contenders",section:"Selecciones",owned:true},
  {id:1515,num:"516",name:"Turquía - Rumanía / Eslovaquia",team:"Contenders",section:"Selecciones",owned:true},
  {id:1516,num:"517",name:"Dinamarca - Macedonia / Chequia",team:"Contenders",section:"Selecciones",owned:true},
  {id:1517,num:"518",name:"Nueva Caledonia - Jamaica / R.D. Congo",team:"Contenders",section:"Selecciones",owned:true},
  {id:1518,num:"519",name:"Surinam - Bolivia / Iraq",team:"Contenders",section:"Selecciones",owned:true},
  {id:1519,num:"520",name:"Morten Hjulmand",team:"Contenders",section:"Selecciones",owned:true},
  {id:1520,num:"521",name:"Pierre-Emile Hojbjerg",team:"Contenders",section:"Selecciones",owned:true},
  {id:1521,num:"522",name:"Christian Eriksen",team:"Contenders",section:"Selecciones",owned:true},
  {id:1522,num:"523",name:"Mikkel Damsgaard",team:"Contenders",section:"Selecciones",owned:true},
  {id:1523,num:"524",name:"Rasmus Hojlund",team:"Contenders",section:"Selecciones",owned:true},
  {id:1524,num:"525",name:"Gianluigi Donnarumma",team:"Contenders",section:"Selecciones",owned:true},
  {id:1525,num:"526",name:"Alessandro Bastoni",team:"Contenders",section:"Selecciones",owned:true},
  {id:1526,num:"527",name:"Sandro Tonali",team:"Contenders",section:"Selecciones",owned:false},
  {id:1527,num:"528",name:"Nicolo Barella",team:"Contenders",section:"Selecciones",owned:true},
  {id:1528,num:"529",name:"Moises Kean",team:"Contenders",section:"Selecciones",owned:true},
  {id:1529,num:"530",name:"Andre Blake",team:"Contenders",section:"Selecciones",owned:true},
  {id:1530,num:"531",name:"Ethan Pinnock",team:"Contenders",section:"Selecciones",owned:true},
  {id:1531,num:"532",name:"Demarai Gray",team:"Contenders",section:"Selecciones",owned:true},
  {id:1532,num:"533",name:"Leon Bailey",team:"Contenders",section:"Selecciones",owned:true},
  {id:1533,num:"534",name:"Shamar Nicholson",team:"Contenders",section:"Selecciones",owned:true},
  {id:1534,num:"535",name:"Matty Cash",team:"Contenders",section:"Selecciones",owned:true},
  {id:1535,num:"536",name:"Jakub Kiwior",team:"Contenders",section:"Selecciones",owned:true},
  {id:1536,num:"537",name:"Piotr Zielinski",team:"Contenders",section:"Selecciones",owned:true},
  {id:1537,num:"538",name:"Sebastian Szymanski",team:"Contenders",section:"Selecciones",owned:true},
  {id:1538,num:"539",name:"Robert Lewandowski",team:"Contenders",section:"Selecciones",owned:true},
  {id:1539,num:"540",name:"Isak Hien",team:"Contenders",section:"Selecciones",owned:true},
  {id:1540,num:"541",name:"Dejan Kulusevski",team:"Contenders",section:"Selecciones",owned:true},
  {id:1541,num:"542",name:"Anthony Elanga",team:"Contenders",section:"Selecciones",owned:true},
  {id:1542,num:"543",name:"Viktor Gyokeres",team:"Contenders",section:"Selecciones",owned:true},
  {id:1543,num:"544",name:"Alexander Isak",team:"Contenders",section:"Selecciones",owned:true},
  {id:1544,num:"545",name:"Caglar Soyuncu",team:"Contenders",section:"Selecciones",owned:true},
  {id:1545,num:"546",name:"Hakan Calhanoglu",team:"Contenders",section:"Selecciones",owned:true},
  {id:1546,num:"547",name:"Arda Guler",team:"Contenders",section:"Selecciones",owned:true},
  {id:1547,num:"548",name:"Kenan Yildiz",team:"Contenders",section:"Selecciones",owned:true},
  {id:1548,num:"549",name:"Kerem Akturkoglu",team:"Contenders",section:"Selecciones",owned:true},
  {id:1549,num:"550",name:"Emiliano Martínez – Argentina",team:"Top Keeper",section:"Categorías Especiales",owned:true},
  {id:1550,num:"551",name:"Thibaut Courtois – Bélgica",team:"Top Keeper",section:"Categorías Especiales",owned:true},
  {id:1551,num:"552",name:"Alisson – Brasil",team:"Top Keeper",section:"Categorías Especiales",owned:false},
  {id:1552,num:"553",name:"Mike Maignan – Francia",team:"Top Keeper",section:"Categorías Especiales",owned:true},
  {id:1553,num:"554",name:"Junnosuke Suzuki – Japón",team:"Top Keeper",section:"Categorías Especiales",owned:true},
  {id:1554,num:"555",name:"Yassine Bounou – Marruecos",team:"Top Keeper",section:"Categorías Especiales",owned:true},
  {id:1555,num:"556",name:"Diogo Costa – Portugal",team:"Top Keeper",section:"Categorías Especiales",owned:true},
  {id:1556,num:"557",name:"Unai Simón – España",team:"Top Keeper",section:"Categorías Especiales",owned:true},
  {id:1557,num:"558",name:"Gregor Kobel – Suiza",team:"Top Keeper",section:"Categorías Especiales",owned:true},
  {id:1558,num:"559",name:"Eder Militao – Brasil",team:"Defensive Rock",section:"Categorías Especiales",owned:true},
  {id:1559,num:"560",name:"Alphonso Davies – Canadá",team:"Defensive Rock",section:"Categorías Especiales",owned:false},
  {id:1560,num:"561",name:"William Saliba – Francia",team:"Defensive Rock",section:"Categorías Especiales",owned:true},
  {id:1561,num:"562",name:"Antonio Rudiger – Alemania",team:"Defensive Rock",section:"Categorías Especiales",owned:true},
  {id:1562,num:"563",name:"Min-jae Kim – Corea del Sur",team:"Defensive Rock",section:"Categorías Especiales",owned:true},
  {id:1563,num:"564",name:"Achraf Hakimi – Marruecos",team:"Defensive Rock",section:"Categorías Especiales",owned:false},
  {id:1564,num:"565",name:"Virgil van Dijk – Países Bajos",team:"Defensive Rock",section:"Categorías Especiales",owned:false},
  {id:1565,num:"566",name:"Nuno Mendes – Portugal",team:"Defensive Rock",section:"Categorías Especiales",owned:false},
  {id:1566,num:"567",name:"Dean Huijsen – España",team:"Defensive Rock",section:"Categorías Especiales",owned:true},
  {id:1567,num:"568",name:"Enzo Fernández – Argentina",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1568,num:"569",name:"Kevin De Bruyne – Bélgica",team:"Midfield Maestro",section:"Categorías Especiales",owned:false},
  {id:1569,num:"570",name:"Casemiro – Brasil",team:"Midfield Maestro",section:"Categorías Especiales",owned:false},
  {id:1570,num:"571",name:"Luka Modric – Croacia",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1571,num:"572",name:"Moises Caicedo – Ecuador",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1572,num:"573",name:"Jude Bellingham – Inglaterra",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1573,num:"574",name:"Aurelien Tchouameni – Francia",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1574,num:"575",name:"Florian Wirtz – Alemania",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1575,num:"576",name:"Sofyan Amrabat – Marruecos",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1576,num:"577",name:"Tijjani Reijnders – Países Bajos",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1577,num:"578",name:"Martin Odegaard – Noruega",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1578,num:"579",name:"Vitinha – Portugal",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1579,num:"580",name:"Scott McTominay – Escocia",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1580,num:"581",name:"Rodri – España",team:"Midfield Maestro",section:"Categorías Especiales",owned:false},
  {id:1581,num:"582",name:"Pedri – España",team:"Midfield Maestro",section:"Categorías Especiales",owned:false},
  {id:1582,num:"583",name:"Granit Xhaka – Suiza",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1583,num:"584",name:"Tyler Adams – Estados Unidos",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1584,num:"585",name:"Federico Valverde – Uruguay",team:"Midfield Maestro",section:"Categorías Especiales",owned:true},
  {id:1585,num:"586",name:"Julián Álvarez – Argentina",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1586,num:"587",name:"Romelu Lukaku – Bélgica",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1587,num:"588",name:"Raphinha – Brasil",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1588,num:"589",name:"Jonathan David – Canadá",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1589,num:"590",name:"Luis Díaz – Colombia",team:"Goal Machine",section:"Categorías Especiales",owned:false},
  {id:1590,num:"591",name:"Andrej Kramaric – Croacia",team:"Goal Machine",section:"Categorías Especiales",owned:false},
  {id:1591,num:"592",name:"Enner Valencia – Ecuador",team:"Goal Machine",section:"Categorías Especiales",owned:false},
  {id:1592,num:"593",name:"Omar Marmoush – Egipto",team:"Goal Machine",section:"Categorías Especiales",owned:false},
  {id:1593,num:"594",name:"Marcus Rashford – Inglaterra",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1594,num:"595",name:"Randal Kolo Muani – Francia",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1595,num:"596",name:"Kai Havertz – Alemania",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1596,num:"597",name:"Sebastien Haller – Costa de Marfil",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1597,num:"598",name:"Raúl Jiménez – México",team:"Goal Machine",section:"Categorías Especiales",owned:false},
  {id:1598,num:"599",name:"Youssef En-Nesyri – Marruecos",team:"Goal Machine",section:"Categorías Especiales",owned:false},
  {id:1599,num:"600",name:"Cody Gakpo – Países Bajos",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1600,num:"601",name:"Chris Wood – Nueva Zelanda",team:"Goal Machine",section:"Categorías Especiales",owned:false},
  {id:1601,num:"602",name:"Alexander Sorloth – Noruega",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1602,num:"603",name:"Nicolas Jackson – Senegal",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1603,num:"604",name:"Mikel Oyarzabal – España",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1604,num:"605",name:"Breel Embolo – Suiza",team:"Goal Machine",section:"Categorías Especiales",owned:false},
  {id:1605,num:"606",name:"Christian Pulisic – Estados Unidos",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1606,num:"607",name:"Darwin Núñez – Uruguay",team:"Goal Machine",section:"Categorías Especiales",owned:true},
  {id:1607,num:"608",name:"Nico Paz – Argentina",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1608,num:"609",name:"Franco Mastantuono – Argentina",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1609,num:"610",name:"Zeno Debast – Bélgica",team:"Master Rookie",section:"Categorías Especiales",owned:false},
  {id:1610,num:"611",name:"Wesley – Brasil",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1611,num:"612",name:"Estevao Willian – Brasil",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1612,num:"613",name:"Petar Sucic – Croacia",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1613,num:"614",name:"Kendry Paez – Ecuador",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1614,num:"615",name:"Morgan Rogers – Inglaterra",team:"Master Rookie",section:"Categorías Especiales",owned:false},
  {id:1615,num:"616",name:"Desire Doue – Francia",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1616,num:"617",name:"Bradely Barcola – Francia",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1617,num:"618",name:"Nick Woltemade – Alemania",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1618,num:"619",name:"Xavi Simons – Países Bajos",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1619,num:"620",name:"Andreas Schjelderup – Noruega",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1620,num:"621",name:"Gustavo Gómez – Paraguay",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1621,num:"622",name:"Joao Neves – Portugal",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1622,num:"623",name:"Pau Cubarsí – España",team:"Master Rookie",section:"Categorías Especiales",owned:true},
  {id:1623,num:"624",name:"Official Emblem",team:"Especiales Únicas",section:"Especiales Únicas",owned:false},
  {id:1624,num:"625",name:"Maple – Mascota",team:"Mascotas",section:"Especiales Únicas",owned:true},
  {id:1625,num:"626",name:"Clutch – Mascota",team:"Mascotas",section:"Especiales Únicas",owned:true},
  {id:1626,num:"627",name:"Zavu – Mascota",team:"Mascotas",section:"Especiales Únicas",owned:true},
  {id:1627,num:"628",name:"Eternos 22 – Defensas",team:"Eternos 22",section:"Especiales Únicas",owned:true},
  {id:1628,num:"629",name:"Eternos 22 – Medios",team:"Eternos 22",section:"Especiales Únicas",owned:false},
  {id:1629,num:"630",name:"Eternos 22 – Delanteros",team:"Eternos 22",section:"Especiales Únicas",owned:false},
  {id:1630,num:"MOM",name:"Jude Bellingham – Momentum",team:"Momentum",section:"Edición Limitada",owned:false},
  {id:1631,num:"MOM",name:"Ousmane Dembélé – Momentum",team:"Momentum",section:"Edición Limitada",owned:true},
  {id:1632,num:"MOM",name:"Christian Pulisic – Momentum",team:"Momentum",section:"Edición Limitada",owned:false},
  {id:1633,num:"LE",name:"Lionel Messi – Argentina",team:"Limited Edition",section:"Edición Limitada",owned:true},
  {id:1634,num:"LE",name:"Cristiano Ronaldo – Portugal",team:"Limited Edition",section:"Edición Limitada",owned:true},
  {id:1635,num:"LE",name:"Kylian Mbappé – Francia",team:"Limited Edition",section:"Edición Limitada",owned:true},
  {id:1636,num:"LE",name:"Lamine Yamal – España",team:"Limited Edition",section:"Edición Limitada",owned:true},
  {id:1637,num:"LE",name:"Julián Álvarez – Argentina",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1638,num:"LE",name:"Lautaro Martínez – Argentina",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1639,num:"LE",name:"Nico Paz – Argentina",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1640,num:"LE",name:"Mathew Ryan – Australia",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1641,num:"LE",name:"David Alaba – Austria",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1642,num:"LE",name:"Jeremy Doku – Bélgica",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1643,num:"LE",name:"Kevin De Bruyne – Bélgica",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1644,num:"LE",name:"Romelu Lukaku – Bélgica",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1645,num:"LE",name:"Thibaut Courtois – Bélgica",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1646,num:"LE",name:"Estevao – Brasil",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1647,num:"LE",name:"Marquinhos – Brasil",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1648,num:"LE",name:"Raphinha – Brasil",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1649,num:"LE",name:"Rodrygo – Brasil",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1650,num:"LE",name:"Vinicius Junior – Brasil",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1651,num:"LE",name:"Alphonso Davies – Canadá",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1652,num:"LE",name:"Jonathan David – Canadá",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1653,num:"LE",name:"Luis Díaz – Colombia",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1654,num:"LE",name:"Josko Gvardiol – Croacia",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1655,num:"LE",name:"Luka Modric – Croacia",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1656,num:"LE",name:"Moises Caicedo – Ecuador",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1657,num:"LE",name:"Willian Pacho – Ecuador",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1658,num:"LE",name:"Mohamed Salah – Egipto",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1659,num:"LE",name:"Omar Marmoush – Egipto",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1660,num:"LE",name:"Bukayo Saka – Inglaterra",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1661,num:"LE",name:"Cole Palmer – Inglaterra",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1662,num:"LE",name:"Declan Rice – Inglaterra",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1663,num:"LE",name:"Harry Kane – Inglaterra",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1664,num:"LE",name:"Jude Bellingham – Inglaterra",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1665,num:"LE",name:"Aurelien Tchouameni – Francia",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1666,num:"LE",name:"Jules Koundé – Francia",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1667,num:"LE",name:"Florian Wirtz – Alemania",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1668,num:"LE",name:"Jamal Musiala – Alemania",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1669,num:"LE",name:"Joshua Kimmich – Alemania",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1670,num:"LE",name:"Kai Havertz – Alemania",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1671,num:"LE",name:"Nick Woltemade – Alemania",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1672,num:"LE",name:"Takefusa Kubo – Japón",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1673,num:"LE",name:"Heung-min Son – Corea del Sur",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1674,num:"LE",name:"Min-jae Kim – Corea del Sur",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1675,num:"LE",name:"Achraf Hakimi – Marruecos",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1676,num:"LE",name:"Brahim Díaz – Marruecos",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1677,num:"LE",name:"Denzel Dumfries – Países Bajos",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1678,num:"LE",name:"Virgil van Dijk – Países Bajos",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1679,num:"LE",name:"Xavi Simons – Países Bajos",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1680,num:"LE",name:"Erling Haaland – Noruega",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1681,num:"LE",name:"Martin Ødegaard – Noruega",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1682,num:"LE",name:"Joao Neves – Portugal",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1683,num:"LE",name:"Rafael Leao – Portugal",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1684,num:"LE",name:"Scott McTominay – Escocia",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1685,num:"LE",name:"Sadio Mane – Senegal",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1686,num:"LE",name:"Dean Huijsen – España",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1687,num:"LE",name:"Nico Williams – España",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1688,num:"LE",name:"Pau Cubarsí – España",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1689,num:"LE",name:"Pedri – España",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1690,num:"LE",name:"Rodri – España",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1691,num:"LE",name:"Granit Xhaka – Suiza",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1692,num:"LE",name:"Christian Pulisic – EE.UU.",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1693,num:"LE",name:"Weston McKennie – EE.UU.",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1694,num:"LE",name:"Darwin Núñez – Uruguay",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1695,num:"LE",name:"Federico Valverde – Uruguay",team:"Limited Edition",section:"Edición Limitada",owned:false},
  {id:1696,num:"LE",name:"Abdukodir Khuasanov – Uzbekistán",team:"Limited Edition",section:"Edición Limitada",owned:false},
];

const COLLECTIONS = {
  laliga: { id:"laliga", name:"La Liga 2025-26", color:"#f97316", sub:"Adrenalyn XL", cards: LALIGA_CARDS },
  mundial: { id:"mundial", name:"Mundial 2026", color:"#4ade80", sub:"Adrenalyn XL", cards: MUNDIAL_CARDS },
};
const SECTIONS_BY_COLL = {
  laliga: ["Todas","Regulares","Especiales","Plus / Bis","Edición Limitada"],
  mundial: ["Todas","Selecciones","Golden Baller","Categorías Especiales","Especiales Únicas","Edición Limitada"],
};
const SECTIONS_LIST = ["Todas","Regulares","Especiales","Plus / Bis","Edición Limitada"];

function loadData(id) {
  try { return JSON.parse(localStorage.getItem(`cc_${id}`) || "{}"); } catch { return {}; }
}
function saveData(id, map) {
  try { localStorage.setItem(`cc_${id}`, JSON.stringify(map)); } catch {}
}
// owned: map of {cardId: true/false}
// repeats: map of {cardId: number}
function loadOwned(id) {
  const d = loadData(id);
  return d.owned || d; // backwards compat
}
function loadRepeats(id) {
  const d = loadData(id);
  return d.repeats || {};
}
function saveAll(id, owned, repeats) {
  saveData(id, { owned, repeats });
}

function ProgressRing({ pct, size=64, stroke=5, color="#f97316" }) {
  const r = (size-stroke*2)/2, circ = 2*Math.PI*r, offset = circ-(pct/100)*circ;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.surface2} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 0.6s ease"}}/>
    </svg>
  );
}

// ─── CROMA APP ICON ──────────────────────────────────────────────────────────
) {
  const r = size * 0.26;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="ciGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#6b7280"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="#0a0a0a"/>
      <rect x="3" y="3" width="94" height="94" rx="22" fill="none"
        stroke="#cbd5e1" strokeWidth="2.5" opacity="0.55"/>
      <text x="51" y="57" textAnchor="middle" dominantBaseline="middle"
        fontFamily="'Dela Gothic One',sans-serif"
        fontSize="72" fill="#cbd5e1">C</text>
    </svg>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScreen({ allOwned, allRepeats, onEnter }) {
  const laligaCards = COLLECTIONS.laliga.cards;
  const laligaOwned = allOwned.laliga || {};
  const laligaCount = laligaCards.filter(c => (laligaOwned[c.id] !== undefined ? laligaOwned[c.id] : c.owned)).length;
  const laligaPct = Math.round(laligaCount / laligaCards.length * 100);
  const ORANGE = "#f97316";

  const mundialCards = COLLECTIONS.mundial.cards;
  const mundialOwned = allOwned.mundial || {};
  const mundialCount = mundialCards.filter(c => (mundialOwned[c.id] !== undefined ? mundialOwned[c.id] : c.owned)).length;
  const mundialPct = Math.round(mundialCount / mundialCards.length * 100);
  const GREEN = "#4ade80";
  const PURPLE = "#a855f7";

  // Repeats stats across all collections
  const laligaRepeats = allRepeats?.laliga || {};
  const mundialRepeats = allRepeats?.mundial || {};
  const totalRepeats = [...Object.values(laligaRepeats), ...Object.values(mundialRepeats)].reduce((a,b)=>a+b,0);
  const topRepeats = Object.entries(laligaRepeats)
    .map(([id,n])=>({card: laligaCards.find(c=>c.id===parseInt(id)), n}))
    .filter(x=>x.card&&x.n>0).sort((a,b)=>b.n-a.n).slice(0,3);

  const recentIds = Object.entries(laligaOwned).filter(([,v])=>v).map(([k])=>parseInt(k)).slice(-5).reverse();
  const recentCards = recentIds.map(id => laligaCards.find(c=>c.id===id)).filter(Boolean);

  // Team stats counting ALL sections for a given team
  const teamStats = {};
  laligaCards.filter(c => Object.keys(TEAMS).includes(c.team)).forEach(c => {
    if (!teamStats[c.team]) teamStats[c.team] = {total:0,owned:0};
    teamStats[c.team].total++;
    const own = laligaOwned[c.id] !== undefined ? laligaOwned[c.id] : c.owned;
    if (own) teamStats[c.team].owned++;
  });

  const topMissing = Object.entries(teamStats)
    .map(([t,s])=>({team:t,missing:s.total-s.owned,pct:Math.round(s.owned/s.total*100)}))
    .filter(x=>x.missing>0).sort((a,b)=>b.missing-a.missing).slice(0,4);

  const almostDone = Object.entries(teamStats)
    .map(([t,s])=>({team:t,missing:s.total-s.owned,pct:Math.round(s.owned/s.total*100)}))
    .filter(x=>x.missing>0&&x.pct>=70).sort((a,b)=>a.missing-b.missing).slice(0,4);

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,paddingBottom:32,
      fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;900&display=swap');
      `}</style>

      {/* HEADER */}
      <div style={{padding:"44px 20px 20px",background:"linear-gradient(160deg,#0c0800 0%,#13151c 100%)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <CromaIcon size={54}/>
          <div>
            <div style={{fontFamily:"'Dela Gothic One',sans-serif",fontSize:38,letterSpacing:5,color:"#cbd5e1",lineHeight:1}}>CROMA</div>
            <div style={{fontSize:10,color:"#3a3a3a",letterSpacing:3,fontWeight:600,marginTop:3}}>
              powered by <span style={{color:"#4a4a4a"}}>CardOs</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{padding:"0 16px"}}>
        <div style={{fontSize:10,letterSpacing:3,color:T.textDim,textTransform:"uppercase",marginBottom:12}}>Mis Colecciones</div>

        {/* LA LIGA */}
        <div onClick={()=>onEnter("laliga")} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:20,marginBottom:10,cursor:"pointer",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,right:0,width:"55%",height:"100%",background:`linear-gradient(90deg,transparent,${ORANGE}09)`,pointerEvents:"none"}}/>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <LaLigaIcon size={46}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1,lineHeight:1}}>La Liga 2025-26</div>
              <div style={{fontSize:11,color:T.textDim,marginBottom:10}}>Adrenalyn XL</div>
              <div style={{height:3,background:T.surface2,borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${laligaPct}%`,background:`linear-gradient(90deg,${ORANGE},#fb923c)`,borderRadius:4,transition:"width 0.6s"}}/>
              </div>
              <div style={{fontSize:11,color:T.textDim,marginTop:5}}>{laligaCount} / {laligaCards.length} cards</div>
            </div>
            <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <ProgressRing pct={laligaPct} size={60} stroke={4} color={ORANGE}/>
              <div style={{position:"absolute",fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:ORANGE,letterSpacing:1}}>{laligaPct}%</div>
            </div>
          </div>
          <div style={{marginTop:14,display:"flex",alignItems:"center",gap:6,color:T.textDim,fontSize:12,borderTop:`1px solid ${T.border}`,paddingTop:12}}>
            <span>Ver colección</span><span>→</span>
          </div>
        </div>

        {/* MUNDIAL */}
        <div onClick={()=>onEnter("mundial")} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:20,marginBottom:24,cursor:"pointer",position:"relative"}}>
          
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <MundialIcon size={46}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1,lineHeight:1}}>Mundial 2026</div>
              <div style={{fontSize:11,color:T.textDim,marginBottom:10}}>Adrenalyn XL</div>
              <div style={{height:3,background:T.surface2,borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${mundialPct}%`,background:"linear-gradient(90deg,#16a34a,#a855f7)",borderRadius:4,transition:"width 0.6s"}}/>
              </div>
              <div style={{fontSize:11,color:T.textDim,marginTop:5}}>{mundialCount} / {mundialCards.length} cards</div>
            </div>
            <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <ProgressRing pct={mundialPct} size={60} stroke={4} color="#4ade80"/>
              <div style={{position:"absolute",fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:"#4ade80",letterSpacing:1}}>{mundialPct}%</div>
            </div>
          </div>
          <div style={{marginTop:14,display:"flex",alignItems:"center",gap:6,color:T.textDim,fontSize:12,borderTop:`1px solid ${T.border}`,paddingTop:12}}>
            <span>Ver colección</span><span>→</span>
          </div>
        </div>

        {/* ÚLTIMAS */}
        {recentCards.length > 0 && (
          <div style={{marginBottom:24}}>
            <div style={{fontSize:10,letterSpacing:3,color:T.textDim,textTransform:"uppercase",marginBottom:12}}>Últimas añadidas</div>
            <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
              {recentCards.map((c,i)=>(
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",borderBottom:i<recentCards.length-1?`1px solid ${T.border}`:"none"}}>
                  {TEAMS[c.team] ? <Shield team={c.team} size={28}/> : <div style={{width:6,height:6,borderRadius:"50%",background:T.green}}/>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                    <div style={{fontSize:10,color:T.textDim}}>#{c.num} · {c.team}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CASI LOS TIENES */}
        {almostDone.length > 0 && (
          <div style={{marginBottom:24}}>
            <div style={{fontSize:10,letterSpacing:3,color:T.textDim,textTransform:"uppercase",marginBottom:12}}>Casi los tienes 🔥</div>
            <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
              {almostDone.map(({team,missing,pct},i)=>(
                <div key={team} style={{padding:"12px 16px",borderBottom:i<almostDone.length-1?`1px solid ${T.border}`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <Shield team={team} size={30}/>
                    <div style={{flex:1,fontSize:14,fontWeight:600}}>{team}</div>
                    <div style={{background:"rgba(34,197,94,0.12)",color:T.green,fontWeight:700,fontSize:11,padding:"2px 10px",borderRadius:20}}>
                      {missing===1?"¡Solo 1!":missing===2?"¡Solo 2!":`${missing} faltan`}
                    </div>
                  </div>
                  <div style={{height:2,background:T.surface2,borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#16a34a,#4ade80)",borderRadius:4}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MÁS LEJOS */}
        {topMissing.length > 0 && (
          <div style={{marginBottom:24}}>
            <div style={{fontSize:10,letterSpacing:3,color:T.textDim,textTransform:"uppercase",marginBottom:12}}>Más lejos de completar</div>
            <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
              {topMissing.map(({team,missing},i)=>(
                <div key={team} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<topMissing.length-1?`1px solid ${T.border}`:"none"}}>
                  <Shield team={team} size={30}/>
                  <div style={{flex:1,fontSize:14,fontWeight:600}}>{team}</div>
                  <div style={{background:"rgba(249,115,22,0.1)",color:ORANGE,fontWeight:700,fontSize:11,padding:"2px 10px",borderRadius:20}}>{missing} pendientes</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPETIDAS RESUMEN */}
        {(()=>{
          const totalLaliga = Object.values(allRepeats?.laliga||{}).reduce((a,b)=>a+b,0);
          const totalMundial = Object.values(allRepeats?.mundial||{}).reduce((a,b)=>a+b,0);
          const total = totalLaliga + totalMundial;
          if(total === 0) return null;
          return (
            <div>
              <div style={{fontSize:10,letterSpacing:3,color:T.textDim,textTransform:"uppercase",marginBottom:12}}>Mis repetidas 🔄</div>
              <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{fontSize:14,fontWeight:600}}>La Liga 2025-26</div>
                  <div style={{background:"rgba(240,192,64,0.12)",color:T.gold,fontWeight:700,fontSize:12,padding:"2px 10px",borderRadius:20}}>{totalLaliga} repetidas</div>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px"}}>
                  <div style={{fontSize:14,fontWeight:600}}>Mundial 2026</div>
                  <div style={{background:"rgba(240,192,64,0.12)",color:T.gold,fontWeight:700,fontSize:12,padding:"2px 10px",borderRadius:20}}>{totalMundial} repetidas</div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ─── COLLECTION ───────────────────────────────────────────────────────────────
function CollectionScreen({ collId, ownedMap, repeatsMap, onToggle, onRepeat, onBack }) {
  const coll = COLLECTIONS[collId];
  const [activeSection, setActiveSection] = useState("Todas");
  const [activeTeam, setActiveTeam] = useState("Todos");
  const [filter, setFilter] = useState("todas");
  const [search, setSearch] = useState("");

  const cards = coll.cards.map(c => ({...c, owned: ownedMap[c.id] !== undefined ? ownedMap[c.id] : c.owned}));
  const totalOwned = cards.filter(c=>c.owned).length;
  const pct = Math.round(totalOwned/cards.length*100);

  const filtered = useMemo(()=>cards.filter(c=>{
    if(activeSection!=="Todas"&&c.section!==activeSection) return false;
    if(activeTeam!=="Todos"&&c.team!==activeTeam) return false;
    if(filter==="tengo"&&!c.owned) return false;
    if(filter==="faltan"&&c.owned) return false;
    if(search&&![c.name,c.num,c.team].some(v=>v.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  }),[cards,activeSection,activeTeam,filter,search]);

  const grouped = useMemo(()=>{
    const g={};
    filtered.forEach(c=>{if(!g[c.team])g[c.team]=[];g[c.team].push(c);});
    return g;
  },[filtered]);

  const regularTeams = [...new Set(cards.filter(c=>c.section==="Regulares").map(c=>c.team))];

  const sectionStats = useMemo(()=>{
    const s={};
    (SECTIONS_BY_COLL[collId]||SECTIONS_LIST).filter(x=>x!=="Todas").forEach(sec=>{
      const arr=cards.filter(c=>c.section===sec);
      s[sec]={total:arr.length,owned:arr.filter(c=>c.owned).length};
    });
    return s;
  },[cards]);

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif",paddingBottom:80}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;900&display=swap');
        .cc{cursor:pointer;transition:background 0.12s;} .cc:active{transform:scale(0.99);}
        .pill{cursor:pointer;border:none;font-family:inherit;transition:all 0.12s;}
        input{background:${T.surface};border:1px solid ${T.border};border-radius:8px;padding:10px 14px;color:${T.text};font-size:15px;font-family:inherit;width:100%;}
        input:focus{outline:none;border-color:#555;}
        ::-webkit-scrollbar{width:3px;height:3px} ::-webkit-scrollbar-thumb{background:#333;border-radius:4px}
      `}</style>

      <div style={{background:collId==="mundial"?`linear-gradient(135deg,#16a34a18 0%,#a855f710 50%,${T.bg} 80%)`:`linear-gradient(135deg,${coll.color}20 0%,${T.bg} 70%)`,borderBottom:`1px solid ${T.border}`,padding:"16px 16px 12px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:T.text,fontSize:22,cursor:"pointer",lineHeight:1,display:"flex",alignItems:"center",gap:6}}>
            <span>←</span>
          </button>
          <div style={{flex:1}}>
            <div style={{fontSize:9,letterSpacing:2,color:T.textDim,textTransform:"uppercase"}}>{coll.sub}</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1,lineHeight:1}}>{coll.name}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:coll.color,letterSpacing:1}}>{pct}%</div>
            <div style={{fontSize:10,color:T.textDim}}>{totalOwned}/{cards.length}</div>
          </div>
        </div>
        <div style={{height:3,background:T.surface2,borderRadius:4,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:coll.color,borderRadius:4,transition:"width 0.5s"}}/>
        </div>
      </div>

      <div style={{padding:"10px 16px 0"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Buscar jugador, número o equipo..."/>
      </div>

      <div style={{display:"flex",gap:6,padding:"10px 16px 0",overflowX:"auto"}}>
        {(SECTIONS_BY_COLL[collId]||SECTIONS_LIST).map(s=>(
          <button key={s} className="pill" onClick={()=>{setActiveSection(s);setActiveTeam("Todos");}}
            style={{whiteSpace:"nowrap",padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:700,
              background:activeSection===s?coll.color:T.surface,color:activeSection===s?"#fff":T.textDim}}>
            {s}
          </button>
        ))}
      </div>

      <div style={{display:"flex",gap:6,padding:"8px 16px 0",alignItems:"center"}}>
        {[["todas","Todas"],["tengo","✅ Tengo"],["faltan","❌ Faltan"]].map(([v,l])=>(
          <button key={v} className="pill" onClick={()=>setFilter(v)}
            style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:700,
              background:filter===v?T.gold:T.surface,color:filter===v?"#000":T.textDim}}>
            {l}
          </button>
        ))}
        <span style={{marginLeft:"auto",fontSize:11,color:T.textDim}}>{filtered.length}</span>
      </div>

      {activeSection==="Regulares"&&(
        <div style={{display:"flex",gap:6,padding:"8px 16px 0",overflowX:"auto"}}>
          {["Todos",...regularTeams].map(t=>(
            <button key={t} className="pill" onClick={()=>setActiveTeam(t)}
              style={{whiteSpace:"nowrap",padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:700,
                background:activeTeam===t?(TEAMS[t]?.primary||coll.color):T.surface2,
                color:activeTeam===t?"#fff":T.textDim,
                border:`1px solid ${activeTeam===t?(TEAMS[t]?.primary||coll.color):T.border}`}}>
              {t==="Todos"?"Todos":t}
            </button>
          ))}
        </div>
      )}

      <div style={{padding:"12px 16px 0"}}>
        {Object.entries(grouped).map(([team,teamCards])=>{
          const ownedN=teamCards.filter(c=>c.owned).length;
          const tPct=Math.round(ownedN/teamCards.length*100);
          const accent=TEAMS[team]?.primary||coll.color;
          return (
            <div key={team} style={{marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:T.surface,borderRadius:"10px 10px 0 0",borderLeft:`3px solid ${accent}`}}>
                {TEAMS[team] && <Shield team={team} size={28}/>}
                <div style={{fontWeight:900,fontSize:14,flex:1}}>{team}</div>
                <div style={{height:3,width:44,background:T.surface2,borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${tPct}%`,background:accent,borderRadius:4}}/>
                </div>
                <span style={{fontSize:11,color:T.textDim}}>{ownedN}/{teamCards.length}</span>
              </div>
              <div style={{background:"#0f1118",borderRadius:"0 0 10px 10px",overflow:"hidden"}}>
                {teamCards.map((card,i)=>(
                  <div key={card.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",
                      background:card.owned?"rgba(34,197,94,0.05)":"transparent",
                      borderBottom:i<teamCards.length-1?`1px solid ${T.border}`:"none"}}>
                    {/* Checkbox */}
                    <div className="cc" onClick={()=>onToggle(collId,card.id,!card.owned)}
                      style={{width:22,height:22,borderRadius:5,border:`2px solid ${card.owned?T.green:"#2e3148"}`,
                        background:card.owned?T.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s",cursor:"pointer"}}>
                      {card.owned&&<span style={{fontSize:12,color:"#000",fontWeight:900}}>✓</span>}
                    </div>
                    {/* Nombre */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:600,color:card.owned?T.text:"#555",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{card.name}</div>
                      <div style={{fontSize:10,color:"#3a3d55",marginTop:1}}>#{card.num}</div>
                    </div>
                    {/* Repetidas counter — solo si la carta está marcada como tenida */}
                    {card.owned && (()=>{
                      const reps = repeatsMap[card.id]||0;
                      return (
                        <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                          <button onClick={e=>{e.stopPropagation();onRepeat(collId,card.id,-1);}}
                            style={{width:22,height:22,borderRadius:5,background:T.surface2,border:`1px solid ${T.border}`,
                              color:T.textDim,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",lineHeight:1}}>−</button>
                          <span style={{fontSize:13,fontWeight:700,color:reps>0?T.gold:T.textDim,minWidth:16,textAlign:"center"}}>{reps}</span>
                          <button onClick={e=>{e.stopPropagation();onRepeat(collId,card.id,1);}}
                            style={{width:22,height:22,borderRadius:5,background:T.surface2,border:`1px solid ${T.border}`,
                              color:T.textDim,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",lineHeight:1}}>+</button>
                        </div>
                      );
                    })()}
                    {!card.owned&&<span style={{fontSize:10,color:T.red,fontWeight:700,flexShrink:0}}>FALTA</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {filtered.length===0&&(
          <div style={{textAlign:"center",padding:48,color:T.textDim}}>
            <div style={{fontSize:36}}>🔍</div>
            <div style={{fontSize:15,marginTop:8}}>Sin resultados</div>
          </div>
        )}
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.bg,borderTop:`1px solid ${T.border}`,padding:"10px 8px",display:"flex",justifyContent:"space-around",zIndex:100}}>
        {Object.entries(sectionStats).map(([sec,{total,owned}])=>{
          const p=total>0?Math.round(owned/total*100):0;
          const labels={"Regulares":"Reg.","Especiales":"Esp.","Plus / Bis":"Plus","Edición Limitada":"Ed. Lim."};
          return(
            <div key={sec} style={{textAlign:"center"}}>
              <div style={{fontSize:14,fontWeight:900,color:p===100?T.green:p>50?T.gold:T.red,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1}}>{p}%</div>
              <div style={{fontSize:9,color:T.textDim}}>{labels[sec]}</div>
              <div style={{fontSize:9,color:"#2e3148"}}>{owned}/{total}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [activeCollId, setActiveCollId] = useState(null);
  const [allOwned, setAllOwned] = useState(()=>({laliga:loadOwned("laliga"),mundial:loadOwned("mundial")}));
  const [allRepeats, setAllRepeats] = useState(()=>({laliga:loadRepeats("laliga"),mundial:loadRepeats("mundial")}));

  const handleToggle = (collId, cardId, val) => {
    setAllOwned(prev => {
      const updated = {...prev[collId],[cardId]:val};
      saveAll(collId, updated, allRepeats[collId]||{});
      return {...prev,[collId]:updated};
    });
  };

  const handleRepeat = (collId, cardId, delta) => {
    setAllRepeats(prev => {
      const cur = prev[collId]||{};
      const newVal = Math.max(0, (cur[cardId]||0) + delta);
      const updated = {...cur,[cardId]:newVal};
      saveAll(collId, allOwned[collId]||{}, updated);
      return {...prev,[collId]:updated};
    });
  };

  if (screen==="collection"&&activeCollId)
    return <CollectionScreen collId={activeCollId} ownedMap={allOwned[activeCollId]||{}} repeatsMap={allRepeats[activeCollId]||{}} onToggle={handleToggle} onRepeat={handleRepeat} onBack={()=>setScreen("home")}/>;
  return <HomeScreen allOwned={allOwned} allRepeats={allRepeats} onEnter={id=>{setActiveCollId(id);setScreen("collection");}}/>;
}
