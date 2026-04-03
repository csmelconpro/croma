import { useState, useMemo } from "react";
import LALIGA_CARDS from './data/laliga.js';
import MUNDIAL_CARDS from './data/mundial.js';

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  dark:  { bg:"#0f1014", surface:"#16181f", surface2:"#1e2028", border:"#252836", red:"#e8353a", green:"#22c55e", gold:"#f0c040", text:"#f0f1f5", textDim:"#6b7280", accent:"#f97316", logoColor:"#ffffff" },
  light: { bg:"#f4f4f8", surface:"#ffffff",  surface2:"#ebebf0", border:"#dde0ea", red:"#dc2626", green:"#16a34a", gold:"#ca8a04", text:"#0f1014", textDim:"#6b7280", accent:"#f97316", logoColor:"#0f1014" },
};

// ─── TEAMS ────────────────────────────────────────────────────────────────────
const TEAMS = {
  "Deportivo Alavés":   {p:"#1a3a6b",s:"#ffffff",abbr:"ALA",shape:"half"},
  "Athletic Club":      {p:"#c8102e",s:"#ffffff",abbr:"ATH",shape:"stripes"},
  "Atlético de Madrid": {p:"#c8102e",s:"#002d62",abbr:"ATM",shape:"half"},
  "FC Barcelona":       {p:"#a50044",s:"#004d98",abbr:"BAR",shape:"stripes"},
  "Real Betis":         {p:"#00954c",s:"#ffffff",abbr:"BET",shape:"half"},
  "RC Celta":           {p:"#6ecef5",s:"#ffffff",abbr:"CEL",shape:"plain"},
  "Elche CF":           {p:"#007340",s:"#ffffff",abbr:"ELC",shape:"plain"},
  "RCD Espanyol":       {p:"#003da5",s:"#ffffff",abbr:"ESP",shape:"plain"},
  "Getafe CF":          {p:"#005ca9",s:"#ffffff",abbr:"GET",shape:"plain"},
  "Girona FC":          {p:"#cc0000",s:"#ffffff",abbr:"GIR",shape:"plain"},
  "Levante UD":         {p:"#004fa3",s:"#c8102e",abbr:"LEV",shape:"half"},
  "Real Madrid":        {p:"#0a1628",s:"#d4af37",abbr:"RMA",shape:"royal"},
  "RCD Mallorca":       {p:"#c8102e",s:"#1a1a1a",abbr:"MAL",shape:"plain"},
  "CA Osasuna":         {p:"#c8102e",s:"#003da5",abbr:"OSA",shape:"half"},
  "Real Oviedo":        {p:"#003da5",s:"#ffffff",abbr:"OVI",shape:"plain"},
  "Rayo Vallecano":     {p:"#cc0000",s:"#ffffff",abbr:"RAY",shape:"diagonal"},
  "Real Sociedad":      {p:"#003da5",s:"#ffffff",abbr:"RSO",shape:"plain"},
  "Sevilla FC":         {p:"#c8102e",s:"#ffffff",abbr:"SEV",shape:"plain"},
  "Valencia CF":        {p:"#f5a623",s:"#1a1a1a",abbr:"VAL",shape:"plain"},
  "Villarreal CF":      {p:"#f5c500",s:"#1a1a1a",abbr:"VIL",shape:"plain"},
};

// ─── PES-STYLE SHIELD ────────────────────────────────────────────────────────
function Shield({ team, size = 32 }) {
  const t = TEAMS[team] || { p:"#444", s:"#888", abbr:(team||"?").slice(0,3).toUpperCase(), shape:"plain" };
  const w = size, h = size;
  const shield = `M${w*.1},${h*.08} L${w*.9},${h*.08} L${w*.9},${h*.6} Q${w*.9},${h*.84} ${w*.5},${h*.95} Q${w*.1},${h*.84} ${w*.1},${h*.6} Z`;

  let inner = null;
  if (t.shape === "half") {
    inner = <path d={`M${w*.5},${h*.08} L${w*.9},${h*.08} L${w*.9},${h*.6} Q${w*.9},${h*.84} ${w*.5},${h*.95} Z`} fill={t.s} opacity="0.3"/>;
  } else if (t.shape === "stripes") {
    inner = <>
      <rect x={w*.28} y={h*.08} width={w*.15} height={h*.87} fill={t.s} opacity="0.25" clipPath="url(#sh)"/>
      <rect x={w*.57} y={h*.08} width={w*.15} height={h*.87} fill={t.s} opacity="0.25" clipPath="url(#sh)"/>
    </>;
  } else if (t.shape === "diagonal") {
    inner = <path d={`M${w*.1},${h*.08} L${w*.9},${h*.08} L${w*.1},${h*.7} Z`} fill={t.s} opacity="0.2"/>;
  } else if (t.shape === "royal") {
    inner = <>
      <path d={`M${w*.5},${h*.08} L${w*.9},${h*.08} L${w*.9},${h*.6} Q${w*.9},${h*.84} ${w*.5},${h*.95} Z`} fill={t.s} opacity="0.12"/>
      <line x1={w*.5} y1={h*.08} x2={w*.5} y2={h*.95} stroke={t.s} strokeWidth={w*.04} opacity="0.4"/>
    </>;
  }

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{flexShrink:0}}>
      <defs>
        <clipPath id="sh">
          <path d={shield}/>
        </clipPath>
      </defs>
      <path d={shield} fill={t.p}/>
      {inner}
      <path d={shield} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <text x={w*.5} y={h*.6} textAnchor="middle" dominantBaseline="middle"
        fontSize={w*.19} fontWeight="800" fill="#fff"
        style={{fontFamily:"'Inter','Arial',sans-serif",letterSpacing:"-0.5px"}}>
        {t.abbr}
      </text>
    </svg>
  );
}

// ─── LOGOS ────────────────────────────────────────────────────────────────────
function CromaLogo({ height = 48, color = "#ffffff" }) {
  return (
    <svg height={height} viewBox="0 0 581 664" style={{flexShrink:0}}>
      <path fill={color} d="m246.4 571c-5.5-0.4-12.3-1.4-15-2.3-2.7-0.8-6.9-1.8-9.4-2.1-4.3-0.6-11.9-2.7-24.5-6.7-3.3-1.1-7.8-2.4-10-3-2.2-0.5-5.5-1.9-7.3-3-1.8-1-4-1.9-4.9-1.9-0.8 0-2.6-0.9-4-2-1.4-1.1-3.2-2-4-2-1.3 0-8.4-3.6-18.8-9.6-2.2-1.3-5.3-3.1-6.9-4-3.6-2-20.6-15-25.8-19.6-10.8-9.8-15.9-15.2-15.4-16.4 0.8-2 3.4-1.7 9.1 1.1 2.7 1.3 5.5 2.4 6.2 2.5 1.5 0 13.6 4.6 17.8 6.7 1.6 0.8 7.4 2.1 13 2.9 5.5 0.7 13.2 2 17 2.8 16.7 3.3 64.6 2.7 69.7-0.9 1.2-0.8 3.4-1.5 4.8-1.5 3.4 0 27.9-5.9 31-7.5 1.4-0.7 4.5-1.8 7-2.5 4-1 17.7-7.6 39.6-18.9 11.5-6 30.6-18.9 39.9-27.1 5-4.4 13.8-13.2 19.1-19.3 5.6-6.2 8.4-6.8 13.2-3 2 1.7 5.1 3.7 6.7 4.7 1.6 0.9 5 2.8 7.5 4.2 2.5 1.5 5.4 3.1 6.5 3.8 1.1 0.6 4.8 3 8.3 5.4 3.5 2.3 6.6 4.2 6.9 4.2 0.4 0 2.1 1.1 3.9 2.5 1.8 1.4 3.7 2.5 4.1 2.5 0.5 0 1.8 0.7 2.9 1.5 1 0.8 4.1 2.9 6.9 4.7 18.1 11.4 18.4 11.9 12.1 19.2-5.6 6.6-35.4 36.1-38.6 38.3-1.4 0.9-2.7 2-3 2.3-1.4 1.9-17.3 12.2-24.5 16-2.2 1.1-5.9 3.2-8.3 4.6-4.2 2.6-9.6 4.9-19.8 8.4-2.8 1-6 2.3-7 2.9-2.4 1.4-26.1 7.1-29.5 7.1-1.4 0-6.1 0.9-10.5 2-4.8 1.1-14.8 2.3-25.7 3-19.2 1.1-24.8 1.1-40.3 0zm-71.4-106.9c-2.5-0.4-5-1-5.6-1.3-0.6-0.4-5-1.2-9.9-1.8-4.8-0.6-10-1.7-11.6-2.6-1.5-0.8-4-1.4-5.4-1.4-1.4 0-5-1.1-7.8-2.4-2.9-1.4-7.1-2.9-9.5-3.5-2.4-0.5-5.1-1.5-6-2.3-0.9-0.8-2.8-2-4.2-2.7-3-1.5-6.2-3.3-15.7-8.9-3.9-2.3-7.4-4.2-7.8-4.2-0.3 0-1.8-0.8-3.3-1.9-1.5-1-4.7-3.1-7.2-4.7-9.9-6.3-28.2-21.1-32-25.9-1.7-2.1-3.1-5.4-3.5-8.2-0.4-2.7-1.2-5.7-1.8-6.8-3.4-6.1-7.1-42.9-5.7-57.7 1.8-20.7 3.9-34.7 5.3-37 0.9-1.2 2-5 2.5-8.3 0.5-3.3 1.9-8.5 3.1-11.5 1.1-3 2.1-6.1 2.1-7 0-0.8 0.6-2.7 1.4-4.2 0.8-1.5 1.7-4.1 2.1-5.8 0.8-3.9 10-24.2 12.9-28.6 1.2-1.7 4.1-6.3 6.6-10.3 7.2-11.4 20.5-27.4 29.3-35.3 4.4-4 9-8.2 10.1-9.3 2.7-2.7 12.4-10.6 15.6-12.8 14.5-9.8 18-12 27-16.9 12.4-6.8 31.5-14.8 35.3-14.8 1 0 3.2-0.7 5-1.7 1.8-0.9 4.9-2 6.9-2.5 2.1-0.4 5.7-1.3 8-1.8 2.4-0.6 9-1.8 14.7-2.6 5.7-0.8 11.2-1.9 12.3-2.5 5.3-2.8 50.2-3.5 65.3-1 21.5 3.6 41.6 8.4 45 10.8 1.1 0.7 3.1 1.3 4.6 1.3 3 0 35.9 15.6 35.9 16.9 0 0.5 1 1.2 2.3 1.5 8.4 2.2 54.1 43 62.2 55.6 1.3 1.9 3.7 5 5.5 6.9 3.9 4.2 3.6 6.8-1 9.8-1.9 1.2-3.9 2.6-4.5 3.1-0.6 0.4-4.1 2.2-8 4-3.9 1.8-7.7 3.7-8.5 4.2-2.7 1.7-34.1 17-34.8 17-0.4 0-2.5 0.9-4.7 2.1-5.7 3.1-13.4 5.2-16.4 4.4-1.5-0.3-7.4-5.5-14.1-12.3-16.7-17.1-16.7-17.1-42-30.4-4.7-2.5-10.3-4.8-12.5-5.2-2.2-0.4-5.9-1.7-8.3-2.7-4.8-2.2-16.1-3.9-31.1-4.6-12.9-0.5-33.1 2.4-47.1 6.9-19.3 6.1-41.5 18.7-54.3 30.7-8.1 7.7-18.1 19.6-22.3 26.6-1.6 2.8-3.5 5.9-4.1 7-4.2 7-7.5 13.4-8 15.5-0.3 1.4-1.5 4.5-2.6 7-1 2.4-2.2 6.3-2.5 8.5-0.3 2.2-1.1 5-1.9 6.2-0.8 1.2-1.8 4.8-2.3 8.1-0.4 3.3-1.6 7.7-2.6 9.7-2.7 5.7-2.4 31.7 0.5 44.4 1.1 5.2 2.1 10.3 2.1 11.4 0 1.7 2.1 6.8 7 17.2 9.5 20.1 9 19.1 15.5 28.5 5.3 7.6 6 8.4 9.5 12.4 6.2 6.9 8.3 9.1 16 15.6 4.1 3.5 8.3 7.1 9.2 7.9 2.2 1.9 2.3 3.7 0.2 4.5-1.8 0.7-3.9 0.6-10.4-0.3zm177-72c-4.7-1-13.1-5.3-16.9-8.6-15.6-13.9-16.4-41.3-1.7-56.1 2.8-2.7 7.8-6.3 11.1-7.9 5.4-2.7 7-2.9 16.5-3 9.7 0 10.9 0.2 16.5 3 10.9 5.5 19.5 20 19.5 32.8-0.1 21.6-14.6 38.5-34.5 40-3.9 0.3-8.6 0.2-10.5-0.2zm16.5-16c13.8-6.2 16.6-30.4 4.8-41.2-5.1-4.7-12.4-6.1-19.5-3.6-5 1.8-8.4 5.1-11.6 11.2-2.1 4.1-2.6 6.4-2.6 12.5 0 8.2 2 13.4 6.7 17.8 5.4 5.1 15.2 6.5 22.2 3.3zm-76 11.3c-1.7-2.5-5.1-8.5-7.6-13.3-5-9.1-6.5-10.2-12.5-8.7-2.3 0.6-2.3 1-2.6 12.9l-0.3 12.2-6.1 0.3c-4.2 0.2-6.6-0.1-7.5-1.1-1.1-1.1-1.4-7.6-1.2-34.4 0-18.2 0.4-34 0.7-35.1 0.8-2.6 4.8-3.2 20.6-3.2 10.1 0 13.6 0.4 18 2 7.7 2.8 10.1 4.8 13.3 11.1 2.5 4.7 2.8 6.2 2.4 11.9-0.5 8.3-2.6 12.2-8.7 16.6-2.8 2-5 4.3-5 5.1 0 0.8 2.8 5.9 6.2 11.4 8.7 13.9 9.3 15 7.9 15.9-0.7 0.4-4.2 0.8-7.9 0.9l-6.7 0.2zm-1.1-39.4c2-1.9 2.6-3.3 2.6-7 0-8.5-4.2-11.3-16.1-10.8l-7.4 0.3-0.3 8.9c-0.2 4.9-0.1 9.5 0.2 10.3 0.5 1.2 2.5 1.4 9.5 1.1 7.8-0.3 9.2-0.7 11.5-2.8zm123.6 43.1l-3.5-0.6-0.3-36c-0.1-21 0.1-36.3 0.7-36.8 0.5-0.6 4-0.7 8.1-0.2 5.6 0.5 7.8 1.2 9.4 2.9 2.3 2.5 12.9 21.4 16.2 29.1 1.2 2.7 2.8 5 3.5 5 0.6 0 2.8-3.2 4.8-7 8.6-16.8 14.4-27.1 15.9-28.3 2.2-1.8 15.6-1.7 17.1 0.1 0.8 1.1 1 10.4 0.6 34.9-0.2 18.4-0.7 34.2-1.1 35-0.7 1.9-11 3.6-12.5 2.1-0.5-0.5-1-11.2-1.2-23.6-0.2-17.3-0.5-22.7-1.5-22.7-0.6 0-3 3.6-5.2 7.9-2.2 4.4-5.5 10.4-7.3 13.3-1.8 2.9-4.2 7-5.3 9-1.4 2.8-2.5 3.7-3.9 3.5-3-0.4-9-9-15.8-22.5-3.4-6.7-6.6-12.1-7-12-0.4 0.2-1 10.4-1.3 22.7-0.3 13.6-1 23-1.6 23.8-1.1 1.3-3 1.4-8.8 0.4zm139.1-5.4c-1.6-3.4-3.1-7-3.4-7.9-0.9-2.6-7.6-4-17.8-3.8-10.7 0.3-11.9 1-14.5 9-1 3-2.2 6-2.8 6.7-1.3 1.9-14.6 1.7-14.6-0.2 0-1.4 9.2-26.7 15-41 0.5-1.1 2.9-7.7 5.5-14.5 6.6-17.9 6.1-17.4 14.8-16.6 4 0.4 7.7 1.2 8.3 1.9 0.7 0.6 1.9 3.2 2.7 5.7 2.8 7.8 7.4 20.4 9.5 25.5 1.1 2.7 4.3 11 7.1 18.5 2.9 7.4 5.9 15.1 6.7 17.1 0.9 2 1.3 4.2 0.9 4.8-0.4 0.6-3.7 1.1-7.6 1.1h-7.1zm-9.4-26.2c0.3-0.8-1.1-5.4-3-10.3-1.9-4.8-3.7-10-4.1-11.5-0.3-1.6-1-2.8-1.5-2.8-0.5 0-2.1 3.9-3.6 8.8-1.5 4.8-3.4 10-4.2 11.5-2.4 4.9-1.2 5.7 7.8 5.7 6 0 8.2-0.4 8.6-1.4z"/>
    </svg>
  );
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
function LaLigaIcon({ size = 46 }) {
  const s = size;
  const body    = `M${s*.32},${s*.68} L${s*.68},${s*.68} L${s*.63},${s*.5} Q${s*.72},${s*.36} ${s*.7},${s*.2} Q${s*.5},${s*.14} ${s*.3},${s*.2} Q${s*.28},${s*.36} ${s*.37},${s*.5} Z`;
  const handles = `M${s*.32},${s*.28} Q${s*.16},${s*.28} ${s*.16},${s*.42} Q${s*.16},${s*.54} ${s*.32},${s*.52} M${s*.68},${s*.28} Q${s*.84},${s*.28} ${s*.84},${s*.42} Q${s*.84},${s*.54} ${s*.68},${s*.52}`;
  const base1   = `M${s*.28},${s*.73} L${s*.72},${s*.73} L${s*.69},${s*.79} L${s*.31},${s*.79} Z`;
  const base2   = `M${s*.22},${s*.79} L${s*.78},${s*.79} L${s*.78},${s*.86} L${s*.22},${s*.86} Z`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <defs>
        <radialGradient id="llBg2" cx="35%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#facc15"/>
          <stop offset="35%" stopColor="#f97316"/>
          <stop offset="70%" stopColor="#ea580c"/>
          <stop offset="100%" stopColor="#dc2626"/>
        </radialGradient>
      </defs>
      <rect width={size} height={size} rx={size*0.22} fill="url(#llBg2)"/>
      <path d={body}    fill="rgba(255,255,255,0.92)"/>
      <path d={handles} stroke="rgba(255,255,255,0.88)" strokeWidth={s*.045} fill="none" strokeLinecap="round"/>
      <path d={base1}   fill="rgba(255,255,255,0.92)"/>
      <path d={base2}   fill="rgba(255,255,255,0.85)"/>
      <line x1={s*.44} y1={s*.68} x2={s*.44} y2={s*.73} stroke="rgba(255,255,255,0.7)" strokeWidth={s*.04}/>
      <line x1={s*.56} y1={s*.68} x2={s*.56} y2={s*.73} stroke="rgba(255,255,255,0.7)" strokeWidth={s*.04}/>
      <polygon points={`${s*.5},${s*.07} ${s*.52},${s*.12} ${s*.57},${s*.12} ${s*.53},${s*.15} ${s*.55},${s*.2} ${s*.5},${s*.17} ${s*.45},${s*.2} ${s*.47},${s*.15} ${s*.43},${s*.12} ${s*.48},${s*.12}`}
        fill="rgba(255,220,50,0.95)"/>
    </svg>
  );
}


function MundialIcon({ size = 46 }) {
  const s = size;
  const tB = `M${s*.35},${s*.72} L${s*.65},${s*.72} L${s*.6},${s*.55} Q${s*.7},${s*.42} ${s*.68},${s*.28} Q${s*.5},${s*.22} ${s*.32},${s*.28} Q${s*.3},${s*.42} ${s*.4},${s*.55} Z`;
  const hd = `M${s*.32},${s*.32} Q${s*.2},${s*.32} ${s*.2},${s*.44} Q${s*.2},${s*.52} ${s*.32},${s*.5} M${s*.68},${s*.32} Q${s*.8},${s*.32} ${s*.8},${s*.44} Q${s*.8},${s*.52} ${s*.68},${s*.5}`;
  const bs = `M${s*.3},${s*.75} L${s*.7},${s*.75} L${s*.65},${s*.82} L${s*.35},${s*.82} Z`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2={s} y2={s} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#166534"/><stop offset="50%" stopColor="#15803d"/><stop offset="100%" stopColor="#7e22ce"/>
        </linearGradient>
      </defs>
      <rect width={size} height={size} rx={size*.22} fill="url(#wg)"/>
      <path d={tB} fill="rgba(255,255,255,0.9)"/>
      <path d={hd} stroke="rgba(255,255,255,0.8)" strokeWidth={s*.04} fill="none" strokeLinecap="round"/>
      <path d={bs} fill="rgba(255,255,255,0.85)"/>
      <line x1={s*.43} y1={s*.72} x2={s*.43} y2={s*.75} stroke="rgba(255,255,255,0.7)" strokeWidth={s*.04}/>
      <line x1={s*.57} y1={s*.72} x2={s*.57} y2={s*.75} stroke="rgba(255,255,255,0.7)" strokeWidth={s*.04}/>
      <circle cx={s*.38} cy={s*.17} r={s*.035} fill="rgba(255,220,50,0.9)"/>
      <circle cx={s*.5}  cy={s*.14} r={s*.035} fill="rgba(255,220,50,0.9)"/>
      <circle cx={s*.62} cy={s*.17} r={s*.035} fill="rgba(255,220,50,0.9)"/>
    </svg>
  );
}

function ProgressRing({ pct, size=60, stroke=4, color="#f97316" }) {
  const r=(size-stroke*2)/2, circ=2*Math.PI*r, offset=circ-(pct/100)*circ;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.5s"}}/>
    </svg>
  );
}

// ─── COLLECTIONS ─────────────────────────────────────────────────────────────
const COLLECTIONS = {
  laliga:  { id:"laliga",  name:"La Liga 2025-26", color:"#f97316", sub:"Trading Cards", cards: LALIGA_CARDS,  pricePerPack: 1.0, cardsPerPack: 6 },
  mundial: { id:"mundial", name:"Mundial 2026",     color:"#4ade80", sub:"Trading Cards", cards: MUNDIAL_CARDS, pricePerPack: 1.0, cardsPerPack: 6 },
};

const SECTIONS_BY_COLL = {
  laliga:  ["Todas","Regulares","Especiales","Plus","Bis","Edición Limitada"],
  mundial: ["Todas","Selecciones","Golden Baller","Categorías Especiales","Especiales Únicas","Edición Limitada"],
};

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const LS = {
  loadOwned:  id => { try { const d=JSON.parse(localStorage.getItem(`cc_${id}`)||"{}"); return d.owned||d; } catch { return {}; } },
  loadRepeats:id => { try { const d=JSON.parse(localStorage.getItem(`cc_${id}`)||"{}"); return d.repeats||{}; } catch { return {}; } },
  saveAll:    (id,owned,repeats) => { try { localStorage.setItem(`cc_${id}`,JSON.stringify({owned,repeats})); } catch {} },
  loadTheme:  () => { try { return localStorage.getItem('croma_theme')||'dark'; } catch { return 'dark'; } },
  saveTheme:  t => { try { localStorage.setItem('croma_theme',t); } catch {} },
  loadShowCost: () => { try { return localStorage.getItem('croma_showcost')==='true'; } catch { return false; } },
  savShowCost:v => { try { localStorage.setItem('croma_showcost',v?'true':'false'); } catch {} },
};

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
const ACHIEVEMENTS = {
  laliga: [
    { id:"l25", label:"25% completado", icon:"🥉", desc:"La Liga al 25%", threshold:25 },
    { id:"l50", label:"Mitad del camino", icon:"🥈", desc:"La Liga al 50%", threshold:50 },
    { id:"l75", label:"¡Ya casi!", icon:"🥇", desc:"La Liga al 75%", threshold:75 },
    { id:"l100",label:"¡COLECCIÓN COMPLETA!", icon:"🏆", desc:"La Liga al 100%", threshold:100 },
  ],
  mundial: [
    { id:"m25", label:"25% completado", icon:"🥉", desc:"Mundial al 25%", threshold:25 },
    { id:"m50", label:"Mitad del camino", icon:"🥈", desc:"Mundial al 50%", threshold:50 },
    { id:"m75", label:"¡Ya casi!", icon:"🥇", desc:"Mundial al 75%", threshold:75 },
    { id:"m100",label:"¡COLECCIÓN COMPLETA!", icon:"🏆", desc:"Mundial al 100%", threshold:100 },
  ],
};

function getPct(cards, ownedMap) {
  const count = cards.filter(c => ownedMap[c.id] !== undefined ? ownedMap[c.id] : c.owned).length;
  return Math.round(count/cards.length*100);
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
function SectionLabel({ children, T }) {
  return <div style={{fontSize:13,letterSpacing:2,color:T.textDim,textTransform:"uppercase",marginBottom:12,fontWeight:700}}>{children}</div>;
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScreen({ allOwned, allRepeats, onEnter, onNav, T, theme, toggleTheme, showCost, toggleCost }) {
  const laligaCards = COLLECTIONS.laliga.cards;
  const mundialCards = COLLECTIONS.mundial.cards;
  const laligaOwned = allOwned.laliga||{};
  const mundialOwned = allOwned.mundial||{};
  const laligaPct = getPct(laligaCards, laligaOwned);
  const mundialPct = getPct(mundialCards, mundialOwned);

  // Team stats for both collections
  const buildStats = (cards, ownedMap, filterSections) => {
    const s = {};
    cards.filter(c => filterSections.includes(c.section) && c.team && c.team !== "Contenders").forEach(c => {
      if (!s[c.team]) s[c.team] = {total:0,owned:0};
      s[c.team].total++;
      if (ownedMap[c.id]!==undefined ? ownedMap[c.id] : c.owned) s[c.team].owned++;
    });
    return s;
  };

  const laligaStats = buildStats(laligaCards, laligaOwned, ["Regulares"]);
  const mundialStats = buildStats(mundialCards, mundialOwned, ["Selecciones"]);
  const allStats = {...laligaStats, ...mundialStats};

  const almostDone = Object.entries(allStats)
    .map(([t,s])=>({team:t,missing:s.total-s.owned,pct:Math.round(s.owned/s.total*100)}))
    .filter(x=>x.missing>0&&x.pct>=80).sort((a,b)=>a.missing-b.missing).slice(0,5);

  const topMissing = Object.entries(allStats)
    .map(([t,s])=>({team:t,missing:s.total-s.owned,pct:Math.round(s.owned/s.total*100)}))
    .filter(x=>x.missing>0).sort((a,b)=>b.missing-a.missing).slice(0,5);

  // Recent cards (laliga only for now)
  const recentIds = Object.entries(laligaOwned).filter(([,v])=>v).map(([k])=>parseInt(k)).slice(-4).reverse();
  const recentCards = recentIds.map(id=>laligaCards.find(c=>c.id===id)).filter(Boolean);

  // Achievements earned
  const earnedAchievements = [
    ...ACHIEVEMENTS.laliga.filter(a => laligaPct >= a.threshold),
    ...ACHIEVEMENTS.mundial.filter(a => mundialPct >= a.threshold),
  ];

  // Cost estimate
  const laligaMissing = laligaCards.filter(c => !(laligaOwned[c.id]!==undefined ? laligaOwned[c.id] : c.owned)).length;
  const mundialMissing = mundialCards.filter(c => !(mundialOwned[c.id]!==undefined ? mundialOwned[c.id] : c.owned)).length;
  const estPacksLaliga = Math.ceil(laligaMissing / COLLECTIONS.laliga.cardsPerPack * 2.5);
  const estPacksMundial = Math.ceil(mundialMissing / COLLECTIONS.mundial.cardsPerPack * 2.5);
  const estCostLaliga = (estPacksLaliga * COLLECTIONS.laliga.pricePerPack).toFixed(0);
  const estCostMundial = (estPacksMundial * COLLECTIONS.mundial.pricePerPack).toFixed(0);

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,paddingBottom:80,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* HEADER */}
      <div style={{padding:"56px 20px 32px",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <CromaLogo height={90} color={T.logoColor}/>
      </div>

      <div style={{padding:"0 16px"}}>
        {/* COLLECTIONS */}
        <div style={{height:1,background:T.border,marginBottom:24}}/>
        <SectionLabel T={T}>Mis Colecciones</SectionLabel>
        {Object.values(COLLECTIONS).map(coll => {
          const ownedMap = coll.id==="laliga" ? laligaOwned : mundialOwned;
          const pct = coll.id==="laliga" ? laligaPct : mundialPct;
          const count = coll.cards.filter(c => ownedMap[c.id]!==undefined ? ownedMap[c.id] : c.owned).length;
          const isLL = coll.id==="laliga";
          const grad = isLL ? "linear-gradient(90deg,#fbbf24,#dc2626)" : "linear-gradient(90deg,#16a34a,#a855f7)";
          return (
            <div key={coll.id} onClick={()=>onEnter(coll.id)}
              style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:20,marginBottom:10,cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                {isLL ? <LaLigaIcon size={46}/> : <MundialIcon size={46}/>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:800,fontSize:18,color:T.text,lineHeight:1}}>{coll.name}</div>
                  <div style={{fontSize:11,color:T.textDim,marginBottom:10}}>{coll.sub}</div>
                  <div style={{height:3,background:T.surface2,borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:grad,borderRadius:4,transition:"width 0.6s"}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
                    <div style={{fontSize:11,color:T.textDim}}>{count} / {coll.cards.length} cards</div>
                    {showCost && <div style={{fontSize:10,color:T.gold}}>~{isLL?estCostLaliga:estCostMundial}€ para completar</div>}
                  </div>
                </div>
                <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <ProgressRing pct={pct} size={60} stroke={4} color={coll.color}/>
                  <div style={{position:"absolute",fontWeight:800,fontSize:14,color:coll.color}}>{pct}%</div>
                </div>
              </div>
              <div style={{marginTop:14,fontSize:12,color:T.textDim,borderTop:`1px solid ${T.border}`,paddingTop:12}}>Ver colección →</div>
            </div>
          );
        })}

        {/* CASI + LEJOS en paralelo */}
        <div style={{height:1,background:T.border,marginBottom:24,marginTop:8}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
          <div>
            <SectionLabel T={T}>Casi 🔥</SectionLabel>
            <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
              {almostDone.length===0
                ? <div style={{padding:16,fontSize:11,color:T.textDim,textAlign:"center"}}>—</div>
                : almostDone.map(({team,missing,pct},i)=>(
                  <div key={team} onClick={()=>onNav('stats')} style={{padding:"10px 12px",borderBottom:i<almostDone.length-1?`1px solid ${T.border}`:"none",cursor:"pointer"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                      <Shield team={team} size={20}/>
                      <div style={{flex:1,fontSize:11,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:T.text}}>{team}</div>
                    </div>
                    <div style={{fontSize:10,color:T.green,fontWeight:700,marginBottom:3}}>{missing===1?"¡Solo 1!":missing===2?"¡Solo 2!":`${missing} faltan`}</div>
                    <div style={{height:2,background:T.surface2,borderRadius:4}}>
                      <div style={{height:"100%",width:`${pct}%`,background:T.green,borderRadius:4}}/>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div>
            <SectionLabel T={T}>Lejos 📦</SectionLabel>
            <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
              {topMissing.length===0
                ? <div style={{padding:16,fontSize:11,color:T.textDim,textAlign:"center"}}>—</div>
                : topMissing.map(({team,missing,pct},i)=>(
                  <div key={team} onClick={()=>onNav('stats')} style={{padding:"10px 12px",borderBottom:i<topMissing.length-1?`1px solid ${T.border}`:"none",cursor:"pointer"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                      <Shield team={team} size={20}/>
                      <div style={{flex:1,fontSize:11,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:T.text}}>{team}</div>
                    </div>
                    <div style={{fontSize:10,color:T.red,fontWeight:700,marginBottom:3}}>{missing} pendientes</div>
                    <div style={{height:2,background:T.surface2,borderRadius:4}}>
                      <div style={{height:"100%",width:`${pct}%`,background:T.red,borderRadius:4}}/>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* AÑADIDAS RECIENTEMENTE + LOGROS en paralelo */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
          <div>
            <SectionLabel T={T}>Recientes 🕐</SectionLabel>
            <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
              {recentCards.length===0
                ? <div style={{padding:16,fontSize:11,color:T.textDim,textAlign:"center"}}>Sin cartas</div>
                : recentCards.map((c,i)=>(
                  <div key={c.id} style={{padding:"10px 12px",borderBottom:i<recentCards.length-1?`1px solid ${T.border}`:"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      {TEAMS[c.team] && <Shield team={c.team} size={20}/>}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:11,fontWeight:700,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                        <div style={{fontSize:9,color:T.textDim}}>#{c.num}</div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div>
            <SectionLabel T={T}>Logros 🏆</SectionLabel>
            <div onClick={()=>onNav('achievements')} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",cursor:"pointer"}}>
              {earnedAchievements.length===0
                ? <div style={{padding:16,fontSize:11,color:T.textDim,textAlign:"center"}}>¡Sigue coleccionando!</div>
                : earnedAchievements.slice(0,4).map((a,i)=>(
                  <div key={a.id} style={{padding:"10px 12px",borderBottom:i<Math.min(earnedAchievements.length,4)-1?`1px solid ${T.border}`:"none",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:18}}>{a.icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11,fontWeight:700,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.label}</div>
                      <div style={{fontSize:9,color:T.textDim}}>{a.desc}</div>
                    </div>
                  </div>
                ))
              }
              <div style={{padding:"8px 12px",fontSize:10,color:T.accent,fontWeight:700,textAlign:"center",borderTop:`1px solid ${T.border}`}}>Ver todos →</div>
            </div>
          </div>
        </div>

        {/* COST TOGGLE */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,marginBottom:24}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:T.text}}>Coste estimado de la colección</div>
            <div style={{fontSize:10,color:T.textDim}}>Estimación basada en sobres a 1€</div>
          </div>
          <div onClick={toggleCost}
            style={{width:44,height:24,borderRadius:12,background:showCost?T.accent:T.surface2,cursor:"pointer",position:"relative",transition:"background 0.2s"}}>
            <div style={{position:"absolute",top:2,left:showCost?22:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
          </div>
        </div>
        {/* THEME TOGGLE - bottom right */}
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
          <button onClick={toggleTheme}
            style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:20,padding:"6px 14px",
              fontSize:12,color:T.textDim,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
            {theme==='dark'?'☀️ Modo claro':'🌙 Modo oscuro'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ACHIEVEMENTS SCREEN ──────────────────────────────────────────────────────
function AchievementsScreen({ allOwned, onBack, T }) {
  const laligaPct = getPct(COLLECTIONS.laliga.cards, allOwned.laliga||{});
  const mundialPct = getPct(COLLECTIONS.mundial.cards, allOwned.mundial||{});

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,paddingBottom:80,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
      <div style={{padding:"56px 16px 16px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:T.text,fontSize:22,cursor:"pointer"}}>←</button>
          <div style={{fontWeight:800,fontSize:22,color:T.text}}>Logros 🏆</div>
        </div>
      </div>
      <div style={{padding:"16px"}}>
        {Object.entries(ACHIEVEMENTS).map(([collId, achs])=>{
          const pct = collId==="laliga" ? laligaPct : mundialPct;
          return (
            <div key={collId} style={{marginBottom:24}}>
              <div style={{fontSize:13,letterSpacing:2,color:T.textDim,textTransform:"uppercase",fontWeight:700,marginBottom:12}}>
                {COLLECTIONS[collId].name}
              </div>
              {achs.map(a=>{
                const earned = pct >= a.threshold;
                return (
                  <div key={a.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:T.surface,border:`1px solid ${earned?T.gold:T.border}`,borderRadius:12,marginBottom:8,opacity:earned?1:0.45}}>
                    <div style={{fontSize:32,width:44,textAlign:"center"}}>{a.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,fontWeight:800,color:earned?T.text:T.textDim}}>{a.label}</div>
                      <div style={{fontSize:11,color:T.textDim,marginTop:2}}>{a.desc}</div>
                      <div style={{height:3,background:T.surface2,borderRadius:4,overflow:"hidden",marginTop:8}}>
                        <div style={{height:"100%",width:`${Math.min(pct/a.threshold*100,100)}%`,background:earned?T.gold:T.textDim,borderRadius:4,transition:"width 0.5s"}}/>
                      </div>
                    </div>
                    {earned && <div style={{color:T.gold,fontSize:20}}>✓</div>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── REPEATS SCREEN ───────────────────────────────────────────────────────────
function RepeatsScreen({ allOwned, allRepeats, onBack, T }) {
  const [activeCollId, setActiveCollId] = useState("laliga");
  const coll = COLLECTIONS[activeCollId];
  const ownedMap = allOwned[activeCollId]||{};
  const repeatsMap = allRepeats[activeCollId]||{};

  const repeatedCards = coll.cards
    .filter(c => { const owned=ownedMap[c.id]!==undefined?ownedMap[c.id]:c.owned; return owned && (repeatsMap[c.id]||0)>0; })
    .map(c => ({...c, reps: repeatsMap[c.id]||0}))
    .sort((a,b)=>b.reps-a.reps);
  const total = repeatedCards.reduce((a,c)=>a+c.reps,0);

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,paddingBottom:80,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
      <div style={{padding:"56px 16px 16px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:T.text,fontSize:22,cursor:"pointer"}}>←</button>
          <div style={{flex:1,fontWeight:800,fontSize:22,color:T.text}}>Mis repetidas 🔄</div>
          {total>0 && <div style={{background:"rgba(240,192,64,0.12)",color:T.gold,fontWeight:700,fontSize:12,padding:"3px 12px",borderRadius:20}}>{total} total</div>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {Object.values(COLLECTIONS).map(c=>{
            const isActive = activeCollId===c.id;
            const collRepeats = Object.values(allRepeats[c.id]||{}).reduce((a,b)=>a+b,0);
            return (
              <div key={c.id} onClick={()=>setActiveCollId(c.id)}
                style={{background:T.surface,border:`2px solid ${isActive?c.color:T.border}`,borderRadius:16,padding:16,cursor:"pointer",textAlign:"center",transition:"border-color 0.2s"}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
                  {c.id==="laliga" ? <LaLigaIcon size={64}/> : <MundialIcon size={64}/>}
                </div>
                <div style={{fontWeight:800,fontSize:15,color:T.text,marginBottom:2}}>{c.name}</div>
                <div style={{fontSize:11,color:T.textDim}}>{c.sub}</div>
                {collRepeats>0 && <div style={{marginTop:6,background:"rgba(240,192,64,0.12)",color:T.gold,fontWeight:700,fontSize:11,padding:"2px 10px",borderRadius:12,display:"inline-block"}}>{collRepeats} repetidas</div>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{padding:"12px 16px"}}>
        {repeatedCards.length===0
          ? <div style={{textAlign:"center",padding:48,color:T.textDim}}><div style={{fontSize:40}}>🔄</div><div style={{fontSize:15,marginTop:8,fontWeight:600}}>Sin repetidas aquí</div></div>
          : repeatedCards.map((card,i)=>(
            <div key={card.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
              {TEAMS[card.team] && <Shield team={card.team} size={30}/>}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{card.name}</div>
                <div style={{fontSize:11,color:T.textDim}}>#{card.num} · {card.team}</div>
              </div>
              <div style={{background:"rgba(240,192,64,0.15)",color:T.gold,fontWeight:800,fontSize:14,padding:"4px 14px",borderRadius:20}}>×{card.reps}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── STATS SCREEN ─────────────────────────────────────────────────────────────
function StatsScreen({ allOwned, onBack, T }) {
  const [activeCollId, setActiveCollId] = useState("laliga");
  const [sortBy, setSortBy] = useState("missing");
  const coll = COLLECTIONS[activeCollId];
  const ownedMap = allOwned[activeCollId]||{};
  const TEAM_SECS = { laliga:["Regulares"], mundial:["Selecciones"] };
  const SPEC_SECS = { laliga:["Especiales","Plus","Bis"], mundial:["Golden Baller","Categorías Especiales","Especiales Únicas"] };

  const buildList = (secs) => {
    const s={};
    coll.cards.filter(c=>secs.includes(c.section)&&c.team&&c.team!=="Contenders").forEach(c=>{
      if(!s[c.team])s[c.team]={total:0,owned:0};
      s[c.team].total++;
      if(ownedMap[c.id]!==undefined?ownedMap[c.id]:c.owned)s[c.team].owned++;
    });
    return Object.entries(s).map(([team,d])=>({team,total:d.total,owned:d.owned,missing:d.total-d.owned,pct:Math.round(d.owned/d.total*100)}))
      .sort((a,b)=>sortBy==="missing"?b.missing-a.missing:sortBy==="owned"?b.pct-a.pct:a.team.localeCompare(b.team));
  };

  const teamList = useMemo(()=>buildList(TEAM_SECS[activeCollId]||[]),[activeCollId,ownedMap,sortBy]);
  const specList = useMemo(()=>buildList(SPEC_SECS[activeCollId]||[]),[activeCollId,ownedMap]);

  const renderRow = (item,i,arr,color) => {
    // Color gradient based on % — red < 40%, gold 40-79%, green 80%+
    const pctColor = item.pct===100 ? T.green : item.pct>=80 ? T.green : item.pct>=40 ? T.gold : T.red;
    const barGrad = item.pct===100
      ? T.green
      : item.pct>=80 ? `linear-gradient(90deg,${T.gold},${T.green})`
      : item.pct>=40 ? `linear-gradient(90deg,${T.red},${T.gold})`
      : T.red;
    return (
      <div key={item.team} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none"}}>
        <Shield team={item.team} size={32}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.team}</div>
          <div style={{height:3,background:T.surface2,borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${item.pct}%`,background:barGrad,borderRadius:4}}/>
          </div>
        </div>
        <div style={{textAlign:"right",minWidth:60}}>
          <div style={{fontSize:13,fontWeight:800,color:pctColor}}>{item.pct}%</div>
          <div style={{fontSize:10,color:T.textDim}}>{item.owned}/{item.total}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,paddingBottom:80,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
      <div style={{padding:"56px 16px 16px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:T.text,fontSize:22,cursor:"pointer"}}>←</button>
          <div style={{flex:1,fontWeight:800,fontSize:22,color:T.text}}>Estadísticas 📊</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          {Object.values(COLLECTIONS).map(c=>{
            const isActive = activeCollId===c.id;
            const om = allOwned[c.id]||{};
            const pct = Math.round(c.cards.filter(card=>om[card.id]!==undefined?om[card.id]:card.owned).length/c.cards.length*100);
            return (
              <div key={c.id} onClick={()=>setActiveCollId(c.id)}
                style={{background:T.surface,border:`2px solid ${isActive?c.color:T.border}`,borderRadius:14,padding:12,cursor:"pointer",textAlign:"center",transition:"border-color 0.2s"}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
                  {c.id==="laliga" ? <LaLigaIcon size={52}/> : <MundialIcon size={52}/>}
                </div>
                <div style={{fontWeight:800,fontSize:13,color:T.text}}>{c.name}</div>
                <div style={{fontSize:11,color:c.color,fontWeight:700,marginTop:2}}>{pct}%</div>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:8}}>
          {[["missing","Más faltan"],["owned","Más completos"],["name","A-Z"]].map(([v,l])=>(
            <button key={v} onClick={()=>setSortBy(v)}
              style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",border:"none",fontFamily:"'Inter',sans-serif",
                background:sortBy===v?T.accent:T.surface2,color:sortBy===v?"#fff":T.textDim}}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"12px 16px"}}>
        <div style={{fontSize:11,letterSpacing:2,color:T.textDim,textTransform:"uppercase",fontWeight:700,marginBottom:8}}>
          {activeCollId==="laliga"?"Equipos":"Selecciones"}
        </div>
        {teamList.map((item,i,arr)=>renderRow(item,i,arr,coll.color))}
        {specList.length>0 && <>
          <div style={{fontSize:11,letterSpacing:2,color:T.textDim,textTransform:"uppercase",fontWeight:700,marginBottom:8,marginTop:20}}>Especiales ⭐</div>
          {specList.map((item,i,arr)=>renderRow(item,i,arr,T.gold))}
        </>}
      </div>
    </div>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ allOwned, onBack, T }) {
  const laligaPct = getPct(COLLECTIONS.laliga.cards, allOwned.laliga||{});
  const mundialPct = getPct(COLLECTIONS.mundial.cards, allOwned.mundial||{});
  const totalCards = Object.values(COLLECTIONS).reduce((a,c)=>a+c.cards.length,0);
  const totalOwned = Object.values(COLLECTIONS).reduce((a,c)=>{
    const om = allOwned[c.id]||{};
    return a + c.cards.filter(card=>om[card.id]!==undefined?om[card.id]:card.owned).length;
  },0);

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,paddingBottom:80,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
      <div style={{padding:"56px 16px 16px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:T.text,fontSize:22,cursor:"pointer"}}>←</button>
          <div style={{fontWeight:800,fontSize:22,color:T.text}}>Mi Perfil</div>
        </div>
      </div>
      <div style={{padding:"24px 16px"}}>
        {/* Profile card */}
        <div style={{background:`linear-gradient(135deg,${T.surface},${T.surface2})`,border:`1px solid ${T.border}`,borderRadius:20,padding:24,marginBottom:20,textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:`linear-gradient(135deg,#f97316,#a855f7)`,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>
            👤
          </div>
          <div style={{fontWeight:800,fontSize:22,color:T.text,marginBottom:4}}>Coleccionista</div>
          <div style={{fontSize:13,color:T.textDim,marginBottom:16}}>Miembro de CROMA</div>
          <div style={{display:"flex",justifyContent:"center",gap:32}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontWeight:800,fontSize:24,color:T.accent}}>{totalOwned}</div>
              <div style={{fontSize:11,color:T.textDim}}>Cards totales</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontWeight:800,fontSize:24,color:T.green}}>{Math.round(totalOwned/totalCards*100)}%</div>
              <div style={{fontSize:11,color:T.textDim}}>Completado</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontWeight:800,fontSize:24,color:T.gold}}>{Object.keys(COLLECTIONS).length}</div>
              <div style={{fontSize:11,color:T.textDim}}>Colecciones</div>
            </div>
          </div>
        </div>

        {/* Collections progress */}
        {Object.values(COLLECTIONS).map(coll=>{
          const pct = coll.id==="laliga" ? laligaPct : mundialPct;
          return (
            <div key={coll.id} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontWeight:700,fontSize:14,color:T.text}}>{coll.name}</div>
                <div style={{fontWeight:800,fontSize:14,color:coll.color}}>{pct}%</div>
              </div>
              <div style={{height:6,background:T.surface2,borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:coll.color,borderRadius:4,transition:"width 0.6s"}}/>
              </div>
            </div>
          );
        })}

        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:16,textAlign:"center",marginTop:8}}>
          <div style={{fontSize:13,color:T.textDim,marginBottom:8}}>Sistema de usuarios próximamente</div>
          <div style={{fontSize:11,color:T.textDim,opacity:0.6}}>Podrás crear tu cuenta, sincronizar tu colección y conectar con otros coleccionistas</div>
        </div>
      </div>
    </div>
  );
}

// ─── COLLECTION SCREEN ────────────────────────────────────────────────────────
function CollectionScreen({ collId, ownedMap, repeatsMap, onToggle, onRepeat, onBack, T }) {
  const coll = COLLECTIONS[collId];
  const [activeSection, setActiveSection] = useState("Todas");
  const [activeTeam, setActiveTeam] = useState("Todos");
  const [filter, setFilter] = useState("todas");
  const [search, setSearch] = useState("");

  const cards = coll.cards.map(c=>({...c, owned: ownedMap[c.id]!==undefined?ownedMap[c.id]:c.owned}));
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
  const sections = SECTIONS_BY_COLL[collId]||["Todas"];
  const sectionStats = useMemo(()=>{
    const s={};
    sections.filter(x=>x!=="Todas").forEach(sec=>{
      const arr=cards.filter(c=>c.section===sec);
      s[sec]={total:arr.length,owned:arr.filter(c=>c.owned).length};
    });
    return s;
  },[cards]);

  const isLL = collId==="laliga";
  const headerGrad = isLL
    ? `linear-gradient(135deg,#dc262618 0%,#f9731610 50%,${T.bg} 80%)`
    : `linear-gradient(135deg,#16a34a18 0%,#a855f710 50%,${T.bg} 80%)`;

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,paddingBottom:80,fontFamily:"'Inter',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .pill{cursor:pointer;border:none;font-family:'Inter',sans-serif;transition:all 0.12s;}
        input{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:10px 14px;color:${T.text};font-size:14px;font-family:'Inter',sans-serif;width:100%;outline:none;}
        input:focus{border-color:${T.accent};}
      `}</style>
      <div style={{background:headerGrad,borderBottom:`1px solid ${T.border}`,padding:"56px 16px 12px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:T.text,fontSize:22,cursor:"pointer"}}>←</button>
          <div style={{flex:1}}>
            <div style={{fontSize:9,letterSpacing:2,color:T.textDim,textTransform:"uppercase",fontWeight:600}}>{coll.sub}</div>
            <div style={{fontWeight:800,fontSize:20,color:T.text,lineHeight:1.2}}>{coll.name}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontWeight:900,fontSize:26,color:coll.color}}>{pct}%</div>
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
        {sections.map(s=>(
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
                background:activeTeam===t?(TEAMS[t]?.p||coll.color):T.surface2,
                color:activeTeam===t?"#fff":T.textDim,
                border:`1px solid ${activeTeam===t?(TEAMS[t]?.p||coll.color):T.border}`}}>
              {t}
            </button>
          ))}
        </div>
      )}
      <div style={{padding:"12px 16px 0"}}>
        {Object.entries(grouped).map(([team,teamCards])=>{
          const ownedN=teamCards.filter(c=>c.owned).length;
          const tPct=Math.round(ownedN/teamCards.length*100);
          const accent=TEAMS[team]?.p||coll.color;
          return (
            <div key={team} style={{marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:T.surface,borderRadius:"10px 10px 0 0",borderLeft:`3px solid ${accent}`}}>
                {TEAMS[team] && <Shield team={team} size={28}/>}
                <div style={{fontWeight:800,fontSize:14,flex:1,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{team}</div>
                <div style={{height:3,width:44,background:T.surface2,borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${tPct}%`,background:accent,borderRadius:4}}/>
                </div>
                <span style={{fontSize:11,color:T.textDim,flexShrink:0}}>{ownedN}/{teamCards.length}</span>
              </div>
              <div style={{background:T.surface2,borderRadius:"0 0 10px 10px",overflow:"hidden"}}>
                {teamCards.map((card,i)=>{
                  const reps=repeatsMap[card.id]||0;
                  return (
                    <div key={card.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
                        background:card.owned?"rgba(34,197,94,0.04)":"transparent",
                        borderBottom:i<teamCards.length-1?`1px solid ${T.border}`:"none"}}>
                      <div onClick={()=>onToggle(collId,card.id,!card.owned)}
                        style={{width:22,height:22,borderRadius:5,border:`2px solid ${card.owned?T.green:T.border}`,
                          background:card.owned?T.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",transition:"all 0.15s"}}>
                        {card.owned&&<span style={{fontSize:12,color:"#000",fontWeight:900}}>✓</span>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:600,color:card.owned?T.text:T.textDim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{card.name}</div>
                        <div style={{fontSize:10,color:T.textDim,marginTop:1}}>#{card.num}</div>
                      </div>
                      {card.owned ? (
                        <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                          {reps>0&&<div style={{background:"rgba(240,192,64,0.15)",color:T.gold,fontWeight:700,fontSize:10,padding:"1px 7px",borderRadius:10}}>×{reps}</div>}
                          <button onClick={e=>{e.stopPropagation();onRepeat(collId,card.id,-1);}}
                            style={{width:20,height:20,borderRadius:4,background:T.surface,border:`1px solid ${T.border}`,color:T.textDim,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>−</button>
                          <span style={{fontSize:12,fontWeight:700,color:reps>0?T.gold:T.textDim,minWidth:12,textAlign:"center"}}>{reps}</span>
                          <button onClick={e=>{e.stopPropagation();onRepeat(collId,card.id,1);}}
                            style={{width:20,height:20,borderRadius:4,background:T.surface,border:`1px solid ${T.border}`,color:T.textDim,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>+</button>
                        </div>
                      ) : (
                        <span style={{fontSize:10,color:T.red,fontWeight:700,flexShrink:0}}>FALTA</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{textAlign:"center",padding:48,color:T.textDim}}><div style={{fontSize:36}}>🔍</div><div style={{fontSize:15,marginTop:8}}>Sin resultados</div></div>}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.bg,borderTop:`1px solid ${T.border}`,padding:"10px 8px",display:"flex",justifyContent:"space-around",zIndex:100}}>
        {Object.entries(sectionStats).map(([sec,{total,owned}])=>{
          const p=total>0?Math.round(owned/total*100):0;
          const lbl={"Regulares":"Reg.","Especiales":"Esp.","Plus":"Plus","Bis":"Bis","Edición Limitada":"Ed.Lim.","Selecciones":"Selec.","Golden Baller":"Golden","Categorías Especiales":"Categ.","Especiales Únicas":"Únicas"};
          return <div key={sec} style={{textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:800,color:p===100?T.green:p>50?T.gold:T.red}}>{p}%</div>
            <div style={{fontSize:9,color:T.textDim}}>{lbl[sec]||sec}</div>
          </div>;
        })}
      </div>
    </div>
  );
}

// ─── NAV BAR ──────────────────────────────────────────────────────────────────
function NavBar({ screen, onNav, T }) {
  const items = [
    { id:"home",        label:"Inicio",    icon:"🏠" },
    { id:"stats",       label:"Stats",     icon:"📊" },
    { id:"repeats",     label:"Repetidas", icon:"🔄" },
    { id:"profile",     label:"Perfil",    icon:"👤" },
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.surface,borderTop:`1px solid ${T.border}`,
      display:"flex",justifyContent:"space-around",padding:"10px 0 20px",zIndex:200}}>
      {items.map(item=>(
        <button key={item.id} onClick={()=>onNav(item.id)}
          style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,fontFamily:"'Inter',sans-serif",minWidth:60}}>
          <span style={{fontSize:22}}>{item.icon}</span>
          <span style={{fontSize:10,fontWeight:600,color:screen===item.id?T.accent:T.textDim}}>{item.label}</span>
          {screen===item.id && <div style={{width:4,height:4,borderRadius:"50%",background:T.accent}}/>}
        </button>
      ))}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [activeCollId, setActiveCollId] = useState(null);
  const [theme, setTheme] = useState(LS.loadTheme);
  const [showCost, setShowCost] = useState(LS.loadShowCost);
  const T = THEMES[theme];

  const [allOwned, setAllOwned] = useState(()=>({laliga:LS.loadOwned("laliga"),mundial:LS.loadOwned("mundial")}));
  const [allRepeats, setAllRepeats] = useState(()=>({laliga:LS.loadRepeats("laliga"),mundial:LS.loadRepeats("mundial")}));

  const toggleTheme = () => { const n=theme==='dark'?'light':'dark'; setTheme(n); LS.saveTheme(n); };
  const toggleCost  = () => { const n=!showCost; setShowCost(n); LS.savShowCost(n); };

  const handleToggle = (collId, cardId, val) => {
    setAllOwned(prev => { const u={...prev[collId],[cardId]:val}; LS.saveAll(collId,u,allRepeats[collId]||{}); return {...prev,[collId]:u}; });
  };
  const handleRepeat = (collId, cardId, delta) => {
    setAllRepeats(prev => { const cur=prev[collId]||{}; const nv=Math.max(0,(cur[cardId]||0)+delta); const u={...cur,[cardId]:nv}; LS.saveAll(collId,allOwned[collId]||{},u); return {...prev,[collId]:u}; });
  };
  const handleNav = s => { setScreen(s); setActiveCollId(null); };

  if (screen==="collection"&&activeCollId)
    return <CollectionScreen collId={activeCollId} ownedMap={allOwned[activeCollId]||{}} repeatsMap={allRepeats[activeCollId]||{}}
      onToggle={handleToggle} onRepeat={handleRepeat} onBack={()=>setScreen("home")} T={T}/>;

  const screens = { stats:<StatsScreen allOwned={allOwned} onBack={()=>setScreen("home")} T={T}/>,
    repeats:<RepeatsScreen allOwned={allOwned} allRepeats={allRepeats} onBack={()=>setScreen("home")} T={T}/>,
    profile:<ProfileScreen allOwned={allOwned} onBack={()=>setScreen("home")} T={T}/>,
    achievements:<AchievementsScreen allOwned={allOwned} onBack={()=>setScreen("home")} T={T}/> };

  return (
    <>
      {screens[screen] || <HomeScreen allOwned={allOwned} allRepeats={allRepeats}
        onEnter={id=>{setActiveCollId(id);setScreen("collection");}}
        onNav={handleNav} T={T} theme={theme} toggleTheme={toggleTheme} showCost={showCost} toggleCost={toggleCost}/>}
      {screen!=="achievements" && <NavBar screen={screen} onNav={handleNav} T={T}/>}
    </>
  );
}
