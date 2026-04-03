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
  // Official CROMA logo SVG (vectorized)
  const scale = size / 110;
  return (
    <svg width={size} height={Math.round(size * 833/910)} viewBox="0 0 910 833" style={{flexShrink:0}}>
      <path fill="#f0f0ec" d="m112 719.5c-17.2-3.3-32.5-15.5-40.6-32.5-0.9-1.9-2.2-4.7-3-6.1-0.7-1.4-1.8-5.5-2.4-9.2-0.5-3.7-1.5-7.8-2-9.2-1.8-4.8-1.2-20.1 1.2-27.8 1.1-4 2.7-8.1 3.4-9.2 0.6-1.1 1.5-3.1 1.9-4.5 1.2-3.7 8-12.8 13.8-18.4 4.9-4.5 14.8-11.6 16.5-11.6 0.4 0 2.3-0.9 4.3-1.9 5.6-3 20.5-4.4 31.9-3 5.2 0.6 11.1 2 13 3 1.9 1.1 3.9 1.9 4.5 1.9 1.9 0 11.3 6.5 15.5 10.8 4.9 4.9 7.6 8.6 12.4 16.9 6.1 10.4 5.5 11.1-10.2 11.7l-12.2 0.5-2.2-3.2c-5.7-8.2-10.8-12.4-18.1-15.1q-20.6-7.5-34.8 6.7c-2.5 2.5-5.4 6.3-6.4 8.4-1 2.1-2.4 4.6-3.2 5.5-2.3 2.7-3.9 23.3-2.5 32.5 1.3 8.3 3.9 12.7 11.8 20.6 3.8 3.7 6.3 5.2 11.5 6.7 8 2.4 9.8 2.5 18.6 0.4 8.5-1.9 13.1-4.8 21-13.2l6.1-6.5 10.8 0.5c7.4 0.4 10.9 1 11.5 1.9 1.5 2.3 1 6.5-0.9 9-1.1 1.3-2.5 4.1-3.1 6.1-0.7 2.1-1.6 3.8-2.1 3.8-0.5 0-1.1 0.9-1.5 1.9-0.8 2.5-9.7 11.6-13.3 13.5-18.4 10.1-32.8 12.7-51.2 9.1zm268.8-0.1c-3.2-0.7-6.8-2-8.1-2.8-1.2-0.7-3.3-1.7-4.7-2.1-5.4-1.6-17.8-11.9-22.8-18.9-10.1-13.9-13.6-26.2-13-45.1 0.3-12.3 0.9-14.8 7-28.5 5.7-12.9 15.1-22.4 29.1-29.3 12.6-6.2 17.4-7.1 35.3-6.5 13.7 0.5 15.4 0.8 20.8 3.3 13.9 6.6 23.8 16.4 30.9 30.9 6.9 14 8 18.3 7.4 31.1-0.7 16.5-3.4 25.9-11.4 39.5-3.2 5.3-14.5 17-18.8 19.4-1.6 0.9-3.7 2.1-4.5 2.6-11.2 7.1-32.6 10-47.3 6.4zm30.5-26.8c8.9-3.8 12.9-7.9 18.9-19.7 2.4-4.9 3.1-7.7 3.6-15.3 1.1-17-2.8-28.6-12.8-38.5-3.8-3.8-6.1-5.1-12.3-6.9-9.6-2.8-11.7-2.8-21.3 0.3-9.8 3.1-15.8 8.6-20.8 19-4.1 8.8-7.3 24.5-5.6 28.1 0.6 1.4 1.1 3.5 1.1 4.8 0 3.9 3.2 11.9 6.2 15.9 8.2 10.3 18.4 14.9 31.8 14.2 4.1-0.2 9.2-1.1 11.2-1.9zm-126.4 26.6c-2.5-1.1-8.2-8.7-12.3-16.7-0.9-1.6-2.9-5.3-4.5-8-1.6-2.8-4.7-8.7-6.9-13.1-3.8-7.8-4.2-8.2-7.9-8.9-4.1-0.7-10.4 0.1-13.4 1.7-1.6 0.8-1.8 2.8-1.7 21.1 0.1 19.7 0 20.2-2.2 21.9-1.2 1-2.9 1.6-3.8 1.4-0.9-0.3-5.2-0.8-9.6-1.1-4.4-0.4-8.7-1.3-9.5-2.1-1.3-1.1-1.6-6.5-1.9-38.1-0.4-51.4 0.7-84.8 2.8-87.4 1.5-1.9 3-2 30.7-2 24.8-0.1 29.6 0.2 32.2 1.5 1.7 0.9 4.2 1.6 5.5 1.6 1.3 0 4.1 1.1 6.1 2.5 2 1.4 4 2.5 4.4 2.5 1.9 0 9.4 9.1 12.4 15 3.2 6.4 3.2 6.8 3.2 19.6 0 11.9-0.2 13.3-2.2 15.9-1.2 1.5-2.2 3.2-2.2 3.7 0 1.3-6.3 8.8-7.4 8.8-0.5 0-2.4 1.1-4.2 2.5-1.8 1.4-3.7 2.5-4.3 2.5-1.9 0-4.4 4.9-3.7 7.3 0.5 2 6.4 11.7 12.7 20.9 1.1 1.5 1.9 3 1.9 3.4 0 0.4 1.7 3.1 3.8 6.1 8.8 12.9 9.9 15.9 6 16.7-4.3 0.9-22.3 1.5-24 0.8zm-14.6-73.2c2.3-0.7 5-2.6 7.2-5.2 3.4-3.9 3.6-4.6 3.6-11 0-15-7.1-19.8-29-19.8-6.9 0-12 0.4-12.7 1.1-1.3 1.3-0.5 32.9 0.9 34.7 1.3 1.5 24.5 1.7 30 0.2zm218.2 71.6c-0.8-2.1-1-128.3-0.2-129.1 1.1-1.1 16.4-0.7 23.5 0.7 7.9 1.5 9.3 3 16.8 17.3 3.1 6 7 13.3 8.7 16 5.4 8.7 13.5 24.9 14.3 28.2 0.3 1.8 1.1 3.5 1.5 3.8 1.4 0.9 5.9-2.4 6.6-4.8 0.7-2.6 6.4-14.1 10.4-21.2 1.5-2.7 3.7-6.8 4.9-9 1.1-2.2 4.1-7.6 6.6-12 2.5-4.4 5.1-9.4 5.9-11 2.9-6.2 4.6-6.9 18.5-7.6 11.7-0.6 12.8-0.4 14.9 1.4l2.2 2.1-0.1 38.5c0 50-1.2 84.6-2.9 86.6-1.5 1.9-21.4 2.2-22.6 0.4-0.4-0.6-0.8-19.1-0.9-41.1-0.2-21.9-0.5-40.2-0.9-40.5-1.1-1.1-6.5 4.9-7.7 8.6-0.6 2-1.6 4.1-2.1 4.8-0.5 0.6-2.4 4-4.2 7.5-2.9 5.8-6.3 11.8-12.3 21.6-1.2 2.1-3.1 5.3-4.1 7.2-4.7 9.1-6.3 11-9.2 11-2.5 0-6.8-3.8-10.8-9.5-4.6-6.6-8.8-13.5-12.1-20-1.1-2.2-2.5-4.7-3.1-5.5-0.5-0.8-2.4-4.6-4.1-8.5-1.8-3.9-3.7-7.6-4.3-8.4-0.6-0.8-1.6-3-2.1-5-0.8-2.8-1.6-3.7-3.6-3.9-3.4-0.4-3.8 0.8-2.9 8.8 0.4 3.6 0.6 12.8 0.4 20.5-0.3 7.7-0.6 22.5-0.8 32.9-0.2 14.7-0.6 19-1.7 19.7-0.8 0.5-6 0.9-11.7 0.9-7.7 0-10.4-0.3-10.8-1.4zm158.9 0.7c-2-0.8-1.5-4.7 1.3-11 1.4-3.2 4.1-9.8 6-14.8 2-5 4.1-10.4 4.8-12 0.7-1.7 1.7-4.6 2.1-6.5 0.4-1.9 1.6-4.6 2.6-5.9 1.1-1.3 1.9-3.3 1.9-4.5 0-2.3 4-13.9 7-20.1 1-2.2 2.2-5.4 2.6-7 0.4-1.6 1.2-4.1 1.9-5.5 0.7-1.4 2.2-5.2 3.3-8.5 1.1-3.3 3-8.5 4.2-11.5 1.2-3 2.8-7.3 3.5-9.5 0.7-2.2 2.5-6.1 4-8.7l2.7-4.8h11.8c6.7 0 13 0.5 14.4 1.1 2.4 1.1 6.8 9.9 9.4 18.9 0.6 1.9 2.2 6.6 3.7 10.5 1.4 3.9 3.3 9 4.1 11.5 0.8 2.4 2.3 6.3 3.4 8.5 1.1 2.3 2 4.8 2 5.6 0 0.8 0.6 2.4 1.4 3.4 0.8 1.1 2.1 4.3 2.9 7 0.8 2.8 2.7 7.7 4.2 11 1.5 3.3 3.4 8.2 4.2 10.8 0.8 2.7 2.3 6.3 3.4 8 1 1.8 1.9 4.1 1.9 5.2 0 1.1 0.9 3.4 1.9 5.1 1 1.7 2.2 4.6 2.6 6.5 0.4 1.9 1.4 4.4 2.2 5.7 2.7 4.3 4.2 9.9 3 11.1-0.7 0.7-5.8 1.1-13.9 1.1h-12.8l-3.1-6.7c-6.2-13.3-6.8-14.8-7.4-17.5-1-5-5.1-5.8-28.4-5.8-23.7 0-24.2 0.2-26.6 8.5-3.3 11.3-6.3 18.9-8 20.1-1.3 1-5 1.4-12.4 1.3-5.8 0-11.2-0.3-11.8-0.6zm76.1-54.6c1.8-1.3 1.8-1.7-0.8-8.3-1.4-3.8-3.3-8.2-4.1-9.7-0.8-1.6-1.5-3.4-1.5-4.1 0-0.6-0.9-3-2.1-5.1-1.1-2.2-2.6-6.9-3.3-10.4-2-10.5-5.2-9-8 3.5-1 4.4-2.6 9.5-3.6 11.4-1 1.9-2.1 5.3-2.5 7.5-0.4 2.2-1.2 4.7-1.9 5.5-2.2 2.5-3.5 7.5-2.4 9.3 0.8 1.5 2.8 1.7 14.7 1.7 9.9 0 14.2-0.4 15.5-1.3zm-315.4-150.3c-1.9-0.2-6-1-9-1.8-9.9-2.5-15-3.6-17.1-3.6-1.1 0-3.3-0.7-5-1.5-1.6-0.9-5.5-2-8.6-2.6-3.1-0.6-6.6-1.6-7.7-2.4-1.2-0.7-3.7-1.6-5.6-2-3.2-0.6-12.5-4.4-16-6.6-0.8-0.5-2.4-1.2-3.4-1.6-1-0.3-6.4-3-12-5.8-16.8-8.7-32.3-19.9-47.6-34.4-8.8-8.3-9.4-9.1-7.9-10.6 1.5-1.5 2.1-1.4 8 1.3 3.5 1.6 7.5 3.3 8.9 3.7 4 1.1 13.3 4.6 16.2 6.2 1.5 0.8 7.4 2 13 2.8 5.7 0.7 12.8 2 15.8 2.7 3.9 0.9 14.1 1.3 36 1.3 26.8 0 30.8-0.2 33-1.7 1.4-0.9 4.7-1.9 7.5-2.3 2.7-0.4 7.7-1.5 11-2.5 3.3-1 8.5-2.4 11.6-3 3.1-0.6 7.4-2 9.5-3 2.1-1.1 4.5-2 5.4-2 1.6 0 11.5-3.9 14-5.5 1.4-0.9 5.8-3.2 25.3-13.3 4.2-2.2 8.4-4.5 9.2-5.2 0.9-0.7 2.9-2 4.5-2.9 10.3-5.6 27.7-19.9 38.6-31.5 10.9-11.6 12.8-13 15.6-11.5 1.3 0.6 3.4 2.2 4.8 3.4 1.4 1.3 5.5 3.9 9.1 5.8 3.6 1.9 7.9 4.2 9.5 5.2 3.3 2.1 15.2 9.7 20.4 13.2 2 1.3 4.1 2.3 4.7 2.3 0.6 0 1.6 0.7 2.4 1.6 0.7 0.8 3 2.5 5.2 3.7 5.1 2.8 6.2 3.5 11.9 7.5 7.9 5.5 7.7 6.1-13 26.9-18.7 19.1-26.1 25.6-35.6 31.9-13.2 8.8-27.8 17-34.6 19.5-2.5 0.9-7.2 2.6-10.5 3.8-3.3 1.2-6.4 2.6-6.9 3.1-0.6 0.6-1.9 1-3 1-1.1 0-3.3 0.4-5 1-6.9 2.2-19.8 5-23 5-1.9 0-4.7 0.5-6.3 1.2-1.5 0.6-6.4 1.6-10.8 2-8.4 0.9-56.5 1.8-62.5 1.2zm-71.9-107.9c-1.8-0.8-5-1.5-7-1.5-2 0-6.3-0.7-9.6-1.6-3.3-0.8-8.6-2.2-11.9-3-3.2-0.8-6.8-2.1-8-2.9-1.1-0.7-4-1.8-6.4-2.5-2.4-0.6-10.3-4.5-17.5-8.7-7.3-4.2-14.6-8.3-16.2-9.1-3.1-1.6-9.2-5.5-11.1-7-0.6-0.5-2.1-1.5-3.5-2.2-1.3-0.7-4.4-2.9-6.9-4.9-2.5-2-5.6-4.4-7-5.3-1.4-0.8-5.7-4.5-9.7-8.2-6.5-6.1-7.3-7.2-8.3-12.2-0.7-3.1-1.8-7-2.5-8.7-0.7-1.8-1.6-5.9-1.9-9.2-0.4-3.3-1.4-8.9-2.2-12.5-3-13.1 0-66.3 4.1-72.6 0.8-1.3 1.9-5 2.4-8.1 0.5-3.2 1.9-8.7 3.1-12.3 3.8-11.3 4-11.9 5.2-15.2 3.3-9.5 9.6-23.3 13.3-29.3 16.5-26.9 30-42.4 53.8-61.9 6.9-5.7 21.7-15.8 28.2-19.3 16.6-9 37.6-18.3 41.3-18.3 0.9 0 3-0.7 4.5-1.5 1.5-0.8 5.8-2.1 9.5-3 3.7-0.9 8.3-2 10.2-2.5 1.9-0.5 6.2-1.2 9.5-1.5 3.3-0.3 9.4-1.6 13.5-2.7 6.7-1.9 10.1-2.2 33.5-2.2l26-0.1 19 3.8c22.8 4.6 25.8 5.3 31.3 7.8 2.3 1 5.1 1.9 6.1 1.9 1.7 0 8.4 3 26.1 11.8 3 1.5 6.8 3.7 8.3 5 1.6 1.2 3.3 2.2 3.9 2.2 1.5 0 11.3 7.2 22.6 16.5 12.9 10.5 32.4 30.1 39.8 39.8 8.4 11.2 8 10.5 6.8 12.5-1.1 1.7-8 6.3-12.4 8.3-2.6 1.1-13.3 6.3-16 7.8-0.8 0.4-2.9 1.5-4.5 2.4-1.6 0.9-4.6 2.4-6.5 3.2-1.9 0.9-4.2 2-5 2.5-0.8 0.6-2.2 1.3-3 1.6-2.5 1.1-10.2 4.5-15.5 6.9-2.7 1.3-7.4 3-10.3 3.9-7.3 2.1-9.9 0.9-19-8.9-6.2-6.8-14.4-14.5-22.2-20.8-1.2-1-4.1-2.7-6.4-3.8-2.2-1.1-8.7-4.4-14.2-7.3-5.6-3-12.5-5.9-15.4-6.5-2.9-0.6-6.4-1.8-7.9-2.6-3-1.7-15.5-3.5-29.4-4.2-17.1-0.8-42.9 3.6-56.2 9.6-1.1 0.5-5.1 2.3-9 4-3.9 1.8-7.7 3.6-8.5 4.1-0.8 0.5-4.4 2.6-8 4.6-6.2 3.4-7.9 4.7-15.9 11.1-11.8 9.5-24.4 25.4-32.8 41.2-1.9 3.7-3.8 7.1-4.2 7.6-1.5 2.1-7.1 18.8-7.1 21.4 0 1.5-0.6 3.5-1.4 4.6-0.7 1.1-1.9 5.2-2.6 9-0.7 3.9-1.9 8-2.7 9.2-1.1 1.7-1.5 6-1.5 17.5-0.1 20.6 2.5 34.8 9.5 50.8 6.3 14.6 9.9 22.4 10.8 23 0.3 0.3 1.2 1.6 1.9 3 5 9.6 18.7 25.2 32.3 36.7 4.8 4.1 8.7 8.1 8.7 8.9 0 1.9-13.3 1.9-17.9-0.1z"/>
    </svg>
  );
}


// ─── LA LIGA ICON ─────────────────────────────────────────────────────────────

function LaLigaIcon({ size = 46 }) {
  const cx = size/2, cy = size/2;
  const r = size * 0.32;
  const w = "rgba(255,255,255,0.95)";
  const b = "rgba(255,255,255,0.15)";
  // Classic soccer ball flat geometry scaled to r
  // Pentagon top-center + 5 hexagons around + patches at edges
  const p = (angle, dist) => [
    cx + dist * Math.cos((angle - 90) * Math.PI / 180),
    cy + dist * Math.sin((angle - 90) * Math.PI / 180)
  ];
  const pt = (pts) => pts.map(([x,y])=>`${x},${y}`).join(' ');

  // Central pentagon
  const penta = [0,72,144,216,288].map(a => p(a, r*0.38));

  // 5 hexagons around the pentagon
  const hexCenters = [0,72,144,216,288].map(a => p(a, r*0.72));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      <defs>
        <linearGradient id="llGrad" x1="0" y1="0" x2={size} y2={size} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#cf9b15"/>
          <stop offset="50%" stopColor="#e21a1a"/>
          <stop offset="100%" stopColor="#e21818"/>
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width={size} height={size} rx={size*0.22} fill="url(#llGrad)"/>
      {/* Ball circle */}
      <circle cx={cx} cy={cy} r={r} fill={w}/>
      {/* Central pentagon — white with dark border to show shape */}
      <polygon points={pt(penta)} fill="rgba(30,30,30,0.85)"/>
      {/* 5 dark patches (pentagons at edges — simplified as small polygons) */}
      {[0,72,144,216,288].map((angle, i) => {
        const [hx, hy] = p(angle, r*0.78);
        const hr = r * 0.22;
        const pts = [0,60,120,180,240,300].map(a => [
          hx + hr * Math.cos((a + angle) * Math.PI/180),
          hy + hr * Math.sin((a + angle) * Math.PI/180)
        ]);
        return <polygon key={i} points={pt(pts)} fill="rgba(30,30,30,0.85)"/>;
      })}
      {/* Ball outline */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={size*0.015}/>
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
import LALIGA_CARDS from './data/laliga.js';
import MUNDIAL_CARDS from './data/mundial.js';


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
      <div style={{padding:"44px 20px 20px",background:"linear-gradient(160deg,#0a0a0a 0%,#13151c 100%)"}}>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <CromaIcon size={110}/>
          <div style={{fontSize:10,color:"#333",letterSpacing:3,fontWeight:600,paddingLeft:2}}>
            powered by <span style={{color:"#444"}}>CardOs</span>
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
