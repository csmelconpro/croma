import { useState, useMemo } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg: "#0f1014",
    surface: "#16181f",
    surface2: "#1e2028",
    border: "#252836",
    red: "#e8353a",
    green: "#22c55e",
    gold: "#f0c040",
    text: "#f0f1f5",
    textDim: "#6b7280",
    accent: "#f97316",
    logoColor: "#ffffff",
  },
  light: {
    bg: "#f4f4f8",
    surface: "#ffffff",
    surface2: "#ebebf0",
    border: "#dde0ea",
    red: "#dc2626",
    green: "#16a34a",
    gold: "#ca8a04",
    text: "#0f1014",
    textDim: "#6b7280",
    accent: "#f97316",
    logoColor: "#0f1014",
  }
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

// ─── SHIELD SVG (estilo PES) ──────────────────────────────────────────────────
function Shield({ team, size = 32 }) {
  const t = TEAMS[team] || { primary:"#444", secondary:"#888", abbr:(team||"?").slice(0,3).toUpperCase() };
  const s = size;
  const shield = `M${s*.1},${s*.08} L${s*.9},${s*.08} L${s*.9},${s*.62} Q${s*.9},${s*.85} ${s*.5},${s*.96} Q${s*.1},${s*.85} ${s*.1},${s*.62} Z`;
  const stripe = `M${s*.1},${s*.08} L${s*.5},${s*.08} L${s*.5},${s*.96} Q${s*.1},${s*.85} ${s*.1},${s*.62} Z`;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{flexShrink:0}}>
      <path d={shield} fill={t.primary}/>
      <path d={stripe} fill={t.secondary} opacity="0.25"/>
      <path d={shield} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <text x={s*.5} y={s*.62} textAnchor="middle" dominantBaseline="middle"
        fontSize={s*.2} fontWeight="800" fill="#fff"
        style={{fontFamily:"'Inter','Arial Narrow',sans-serif",letterSpacing:"-0.5px"}}>
        {t.abbr}
      </text>
    </svg>
  );
}

// ─── LOGOS ────────────────────────────────────────────────────────────────────
function CromaLogo({ height = 40, color = "#ffffff" }) {
  return (
    <svg height={height} viewBox="0 0 581 664" style={{flexShrink:0}}>
      <path fill={color} d="m246.4 571c-5.5-0.4-12.3-1.4-15-2.3-2.7-0.8-6.9-1.8-9.4-2.1-4.3-0.6-11.9-2.7-24.5-6.7-3.3-1.1-7.8-2.4-10-3-2.2-0.5-5.5-1.9-7.3-3-1.8-1-4-1.9-4.9-1.9-0.8 0-2.6-0.9-4-2-1.4-1.1-3.2-2-4-2-1.3 0-8.4-3.6-18.8-9.6-2.2-1.3-5.3-3.1-6.9-4-3.6-2-20.6-15-25.8-19.6-10.8-9.8-15.9-15.2-15.4-16.4 0.8-2 3.4-1.7 9.1 1.1 2.7 1.3 5.5 2.4 6.2 2.5 1.5 0 13.6 4.6 17.8 6.7 1.6 0.8 7.4 2.1 13 2.9 5.5 0.7 13.2 2 17 2.8 16.7 3.3 64.6 2.7 69.7-0.9 1.2-0.8 3.4-1.5 4.8-1.5 3.4 0 27.9-5.9 31-7.5 1.4-0.7 4.5-1.8 7-2.5 4-1 17.7-7.6 39.6-18.9 11.5-6 30.6-18.9 39.9-27.1 5-4.4 13.8-13.2 19.1-19.3 5.6-6.2 8.4-6.8 13.2-3 2 1.7 5.1 3.7 6.7 4.7 1.6 0.9 5 2.8 7.5 4.2 2.5 1.5 5.4 3.1 6.5 3.8 1.1 0.6 4.8 3 8.3 5.4 3.5 2.3 6.6 4.2 6.9 4.2 0.4 0 2.1 1.1 3.9 2.5 1.8 1.4 3.7 2.5 4.1 2.5 0.5 0 1.8 0.7 2.9 1.5 1 0.8 4.1 2.9 6.9 4.7 18.1 11.4 18.4 11.9 12.1 19.2-5.6 6.6-35.4 36.1-38.6 38.3-1.4 0.9-2.7 2-3 2.3-1.4 1.9-17.3 12.2-24.5 16-2.2 1.1-5.9 3.2-8.3 4.6-4.2 2.6-9.6 4.9-19.8 8.4-2.8 1-6 2.3-7 2.9-2.4 1.4-26.1 7.1-29.5 7.1-1.4 0-6.1 0.9-10.5 2-4.8 1.1-14.8 2.3-25.7 3-19.2 1.1-24.8 1.1-40.3 0zm-71.4-106.9c-2.5-0.4-5-1-5.6-1.3-0.6-0.4-5-1.2-9.9-1.8-4.8-0.6-10-1.7-11.6-2.6-1.5-0.8-4-1.4-5.4-1.4-1.4 0-5-1.1-7.8-2.4-2.9-1.4-7.1-2.9-9.5-3.5-2.4-0.5-5.1-1.5-6-2.3-0.9-0.8-2.8-2-4.2-2.7-3-1.5-6.2-3.3-15.7-8.9-3.9-2.3-7.4-4.2-7.8-4.2-0.3 0-1.8-0.8-3.3-1.9-1.5-1-4.7-3.1-7.2-4.7-9.9-6.3-28.2-21.1-32-25.9-1.7-2.1-3.1-5.4-3.5-8.2-0.4-2.7-1.2-5.7-1.8-6.8-3.4-6.1-7.1-42.9-5.7-57.7 1.8-20.7 3.9-34.7 5.3-37 0.9-1.2 2-5 2.5-8.3 0.5-3.3 1.9-8.5 3.1-11.5 1.1-3 2.1-6.1 2.1-7 0-0.8 0.6-2.7 1.4-4.2 0.8-1.5 1.7-4.1 2.1-5.8 0.8-3.9 10-24.2 12.9-28.6 1.2-1.7 4.1-6.3 6.6-10.3 7.2-11.4 20.5-27.4 29.3-35.3 4.4-4 9-8.2 10.1-9.3 2.7-2.7 12.4-10.6 15.6-12.8 14.5-9.8 18-12 27-16.9 12.4-6.8 31.5-14.8 35.3-14.8 1 0 3.2-0.7 5-1.7 1.8-0.9 4.9-2 6.9-2.5 2.1-0.4 5.7-1.3 8-1.8 2.4-0.6 9-1.8 14.7-2.6 5.7-0.8 11.2-1.9 12.3-2.5 5.3-2.8 50.2-3.5 65.3-1 21.5 3.6 41.6 8.4 45 10.8 1.1 0.7 3.1 1.3 4.6 1.3 3 0 35.9 15.6 35.9 16.9 0 0.5 1 1.2 2.3 1.5 8.4 2.2 54.1 43 62.2 55.6 1.3 1.9 3.7 5 5.5 6.9 3.9 4.2 3.6 6.8-1 9.8-1.9 1.2-3.9 2.6-4.5 3.1-0.6 0.4-4.1 2.2-8 4-3.9 1.8-7.7 3.7-8.5 4.2-2.7 1.7-34.1 17-34.8 17-0.4 0-2.5 0.9-4.7 2.1-5.7 3.1-13.4 5.2-16.4 4.4-1.5-0.3-7.4-5.5-14.1-12.3-16.7-17.1-16.7-17.1-42-30.4-4.7-2.5-10.3-4.8-12.5-5.2-2.2-0.4-5.9-1.7-8.3-2.7-4.8-2.2-16.1-3.9-31.1-4.6-12.9-0.5-33.1 2.4-47.1 6.9-19.3 6.1-41.5 18.7-54.3 30.7-8.1 7.7-18.1 19.6-22.3 26.6-1.6 2.8-3.5 5.9-4.1 7-4.2 7-7.5 13.4-8 15.5-0.3 1.4-1.5 4.5-2.6 7-1 2.4-2.2 6.3-2.5 8.5-0.3 2.2-1.1 5-1.9 6.2-0.8 1.2-1.8 4.8-2.3 8.1-0.4 3.3-1.6 7.7-2.6 9.7-2.7 5.7-2.4 31.7 0.5 44.4 1.1 5.2 2.1 10.3 2.1 11.4 0 1.7 2.1 6.8 7 17.2 9.5 20.1 9 19.1 15.5 28.5 5.3 7.6 6 8.4 9.5 12.4 6.2 6.9 8.3 9.1 16 15.6 4.1 3.5 8.3 7.1 9.2 7.9 2.2 1.9 2.3 3.7 0.2 4.5-1.8 0.7-3.9 0.6-10.4-0.3zm177-72c-4.7-1-13.1-5.3-16.9-8.6-15.6-13.9-16.4-41.3-1.7-56.1 2.8-2.7 7.8-6.3 11.1-7.9 5.4-2.7 7-2.9 16.5-3 9.7 0 10.9 0.2 16.5 3 10.9 5.5 19.5 20 19.5 32.8-0.1 21.6-14.6 38.5-34.5 40-3.9 0.3-8.6 0.2-10.5-0.2zm16.5-16c13.8-6.2 16.6-30.4 4.8-41.2-5.1-4.7-12.4-6.1-19.5-3.6-5 1.8-8.4 5.1-11.6 11.2-2.1 4.1-2.6 6.4-2.6 12.5 0 8.2 2 13.4 6.7 17.8 5.4 5.1 15.2 6.5 22.2 3.3zm-76 11.3c-1.7-2.5-5.1-8.5-7.6-13.3-5-9.1-6.5-10.2-12.5-8.7-2.3 0.6-2.3 1-2.6 12.9l-0.3 12.2-6.1 0.3c-4.2 0.2-6.6-0.1-7.5-1.1-1.1-1.1-1.4-7.6-1.2-34.4 0-18.2 0.4-34 0.7-35.1 0.8-2.6 4.8-3.2 20.6-3.2 10.1 0 13.6 0.4 18 2 7.7 2.8 10.1 4.8 13.3 11.1 2.5 4.7 2.8 6.2 2.4 11.9-0.5 8.3-2.6 12.2-8.7 16.6-2.8 2-5 4.3-5 5.1 0 0.8 2.8 5.9 6.2 11.4 8.7 13.9 9.3 15 7.9 15.9-0.7 0.4-4.2 0.8-7.9 0.9l-6.7 0.2zm-1.1-39.4c2-1.9 2.6-3.3 2.6-7 0-8.5-4.2-11.3-16.1-10.8l-7.4 0.3-0.3 8.9c-0.2 4.9-0.1 9.5 0.2 10.3 0.5 1.2 2.5 1.4 9.5 1.1 7.8-0.3 9.2-0.7 11.5-2.8zm123.6 43.1l-3.5-0.6-0.3-36c-0.1-21 0.1-36.3 0.7-36.8 0.5-0.6 4-0.7 8.1-0.2 5.6 0.5 7.8 1.2 9.4 2.9 2.3 2.5 12.9 21.4 16.2 29.1 1.2 2.7 2.8 5 3.5 5 0.6 0 2.8-3.2 4.8-7 8.6-16.8 14.4-27.1 15.9-28.3 2.2-1.8 15.6-1.7 17.1 0.1 0.8 1.1 1 10.4 0.6 34.9-0.2 18.4-0.7 34.2-1.1 35-0.7 1.9-11 3.6-12.5 2.1-0.5-0.5-1-11.2-1.2-23.6-0.2-17.3-0.5-22.7-1.5-22.7-0.6 0-3 3.6-5.2 7.9-2.2 4.4-5.5 10.4-7.3 13.3-1.8 2.9-4.2 7-5.3 9-1.4 2.8-2.5 3.7-3.9 3.5-3-0.4-9-9-15.8-22.5-3.4-6.7-6.6-12.1-7-12-0.4 0.2-1 10.4-1.3 22.7-0.3 13.6-1 23-1.6 23.8-1.1 1.3-3 1.4-8.8 0.4zm139.1-5.4c-1.6-3.4-3.1-7-3.4-7.9-0.9-2.6-7.6-4-17.8-3.8-10.7 0.3-11.9 1-14.5 9-1 3-2.2 6-2.8 6.7-1.3 1.9-14.6 1.7-14.6-0.2 0-1.4 9.2-26.7 15-41 0.5-1.1 2.9-7.7 5.5-14.5 6.6-17.9 6.1-17.4 14.8-16.6 4 0.4 7.7 1.2 8.3 1.9 0.7 0.6 1.9 3.2 2.7 5.7 2.8 7.8 7.4 20.4 9.5 25.5 1.1 2.7 4.3 11 7.1 18.5 2.9 7.4 5.9 15.1 6.7 17.1 0.9 2 1.3 4.2 0.9 4.8-0.4 0.6-3.7 1.1-7.6 1.1h-7.1zm-9.4-26.2c0.3-0.8-1.1-5.4-3-10.3-1.9-4.8-3.7-10-4.1-11.5-0.3-1.6-1-2.8-1.5-2.8-0.5 0-2.1 3.9-3.6 8.8-1.5 4.8-3.4 10-4.2 11.5-2.4 4.9-1.2 5.7 7.8 5.7 6 0 8.2-0.4 8.6-1.4z"/>
    </svg>
  );
}

function CromaIcon({ size = 46, color = "#ffffff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 475 550" style={{flexShrink:0}}>
      <path fill={color} d="m221.5 513.3c-1.7-0.2-5.3-1-8-1.7-2.8-0.8-8.2-1.9-12-2.6-3.8-0.7-7.8-1.7-8.7-2.2-1-0.4-5-1.7-9-2.8-8.5-2.2-15.7-4.6-21.3-7-12.5-5.4-25.7-11.8-32-15.5-2.2-1.3-5.2-3.1-6.7-3.9-3.6-2.1-21.3-15.6-26-19.8-9.8-8.9-15.8-15.1-15.8-16.3 0-2.6 1.9-2.6 7.3 0 3 1.4 7.4 3.2 9.8 4 9.3 3 16.4 5.7 17.5 6.6 0.7 0.5 5.2 1.4 10 2 4.9 0.6 10.2 1.4 11.9 1.9 8.8 2.5 19.5 3.2 45.6 2.9 24.1-0.4 27.7-0.6 29.9-2.1 1.3-1 3.6-1.8 5-1.8 1.5 0 6-0.9 10.1-2 4.1-1.1 10.5-2.7 14.2-3.5 3.7-0.8 7.7-2.1 9-2.9 1.2-0.7 3.5-1.7 5.2-2 4.1-0.9 13.4-4.7 16.5-6.6 1.4-0.9 6-3.3 10.3-5.5 17.8-9 21.6-11.1 23.4-12.7 1.1-1 2.4-1.8 3-1.8 0.6 0 2.6-1.2 4.6-2.7 2-1.6 6.8-5 10.8-7.8 4-2.7 14-11.6 22.2-19.7 8.1-8.2 15.1-14.8 15.5-14.8 0.4 0.1 2.5 1.4 4.7 3 2.2 1.6 7.1 4.7 11 7 9.4 5.4 12.7 7.4 23.7 14.4 9.2 5.8 12.8 8.1 21.1 13.3 2.3 1.4 6 3.8 8.2 5.2 7.9 5 8.3 7.3 2.3 13.9-8.1 8.8-31.3 31.7-37.3 36.8-13.4 11.5-36.2 24.7-53 30.9-3.9 1.4-8.4 3.2-10 4-1.6 0.8-7.1 2.4-12.1 3.5-5.1 1.1-10.4 2.4-11.9 3-1.4 0.5-4.3 1-6.3 1-2.1 0-5.3 0.5-7.2 1.1-1.9 0.7-6.9 1.6-11 2.1-8 1-59.5 1.9-64.5 1.1zm-71-107.8c-1.7-0.8-4.8-1.4-7-1.4-2.3-0.1-6.5-0.8-9.5-1.6-3-0.9-7.7-2.1-10.5-2.6-2.7-0.6-6.9-2.1-9.4-3.5-2.5-1.3-5.4-2.4-6.3-2.4-2.1 0-5.1-1.3-10.3-4.4-2.2-1.4-5.6-3.3-7.5-4.4-16.6-9.1-31.7-18.6-40.5-25.4-17.3-13.6-20.9-17.5-22-24.1-0.4-2.3-1.4-5.8-2.2-7.7-1.5-3.5-3.7-16.4-5.3-31-1.3-11.6-1.1-28.8 0.4-36 0.7-3.6 1.7-10.3 2.1-15 0.4-5.1 1.5-9.9 2.6-12 1-1.9 2-5.5 2.2-8 0.3-2.5 1.2-6.5 2.2-9 0.9-2.5 2.3-6.5 3-9 3.7-12.6 11.4-30.5 18-41.5 1.3-2.2 3.1-5.3 4.1-6.9 0.9-1.7 2.3-3.6 3-4.4 0.8-0.7 1.4-1.7 1.4-2.2 0-1.7 17.8-22.6 25.6-30 10.7-10.3 23.1-20.3 33.9-27.4 5-3.3 10.9-7.2 13.2-8.7 2.2-1.5 5.2-3 6.5-3.4 1.2-0.4 3.4-1.5 4.8-2.5 1.4-1 3.6-2.1 5-2.5 1.4-0.4 2.9-1.1 3.5-1.5 1.7-1.4 19.4-8 21.2-8 1 0 3.1-0.7 4.6-1.5 3.7-1.9 21.7-6.2 29.4-7 3.4-0.3 9.2-1.4 13.1-2.5 5-1.4 11.8-2.1 25.3-2.6 22.1-0.7 35.4 0.3 55.4 4.5 23.2 4.9 24.8 5.2 28.7 7.2 2.1 1.1 4.8 1.9 6.1 1.9 1.3 0 6.4 2 11.3 4.5 4.8 2.5 9.2 4.5 9.7 4.5 0.8 0 8.5 4.3 17.1 9.5 5.8 3.6 11 7.2 15.3 10.6 2.3 1.9 5.1 4.2 6.3 5.1 8.9 6.8 27.5 24.7 35.8 34.4 12.2 14.4 13.5 16.4 12.4 18.9-0.6 1.4-2.7 3.3-4.6 4.2-1.9 1-9.4 4.9-16.7 8.6-7.4 3.8-14.5 7.5-15.9 8.3-6.9 3.8-32.3 14.9-37.6 16.3-5.8 1.5-8.5 0.3-14.7-6.6-9.9-11.1-21.3-21.3-28.7-25.6-13.6-8.1-25.4-13.8-31.5-15.4-3.3-0.8-7.1-2.1-8.6-2.8-5.9-3.1-34.2-5.3-46.7-3.6-20.5 2.7-27.4 4.3-39.7 9.3-12.7 5.2-30.6 15.2-38.5 21.6-11.2 9.1-25.4 25.9-33 39.2-3.4 5.9-9 17.6-9 18.6 0 0.7-0.9 3.1-2 5.5-1.1 2.4-2 5.7-2 7.3 0 1.6-0.8 4.3-1.9 6-1 1.7-2.1 5.5-2.4 8.4-0.4 2.9-1.4 6.8-2.3 8.5-4.5 8.8-1.4 51.1 4.7 62.9 1 2 1.9 4.1 1.9 4.7 0 0.5 2.3 5.7 5 11.5 2.8 5.8 5 10.8 5 11.1 0 0.8 12.3 18.4 16 22.8 3.6 4.4 12 12.6 18 17.7 7.5 6.4 11 10.2 10.4 11.2-0.8 1.3-14.7 0.7-17.9-0.7z"/>
    </svg>
  );
}

// ─── LA LIGA ICON ─────────────────────────────────────────────────────────────
function LaLigaIcon({ size = 46 }) {
  const cx = size/2, cy = size/2, r = size * 0.3;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      <defs>
        <linearGradient id="llGrad" x1="0" y1="0" x2={size} y2={size} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="40%" stopColor="#f97316"/>
          <stop offset="100%" stopColor="#dc2626"/>
        </linearGradient>
        <radialGradient id="llBall" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#e5e7eb"/>
        </radialGradient>
      </defs>
      <rect width={size} height={size} rx={size*0.22} fill="url(#llGrad)"/>
      <circle cx={cx} cy={cy} r={r} fill="url(#llBall)"/>
      <polygon points={`${cx},${cy-r*.38} ${cx+r*.36},${cy-r*.12} ${cx+r*.22},${cy+r*.32} ${cx-r*.22},${cy+r*.32} ${cx-r*.36},${cy-r*.12}`} fill="rgba(20,20,20,0.8)"/>
      {[0,72,144,216,288].map((a,i) => {
        const rad = (a-90)*Math.PI/180;
        const hx = cx + r*.78*Math.cos(rad), hy = cy + r*.78*Math.sin(rad), hr = r*.18;
        const pts = [0,60,120,180,240,300].map(b => {
          const br = (b+a)*Math.PI/180;
          return `${hx+hr*Math.cos(br)},${hy+hr*Math.sin(br)}`;
        }).join(' ');
        return <polygon key={i} points={pts} fill="rgba(20,20,20,0.8)"/>;
      })}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={size*.015}/>
    </svg>
  );
}

// ─── MUNDIAL ICON ─────────────────────────────────────────────────────────────
function MundialIcon({ size = 46 }) {
  const cx = size/2, cy = size/2, s = size;
  const trophyBody = `M${s*.35},${s*.72} L${s*.65},${s*.72} L${s*.6},${s*.55} Q${s*.7},${s*.42} ${s*.68},${s*.28} Q${s*.5},${s*.22} ${s*.32},${s*.28} Q${s*.3},${s*.42} ${s*.4},${s*.55} Z`;
  const handles = `M${s*.32},${s*.32} Q${s*.2},${s*.32} ${s*.2},${s*.44} Q${s*.2},${s*.52} ${s*.32},${s*.5} M${s*.68},${s*.32} Q${s*.8},${s*.32} ${s*.8},${s*.44} Q${s*.8},${s*.52} ${s*.68},${s*.5}`;
  const base = `M${s*.3},${s*.75} L${s*.7},${s*.75} L${s*.65},${s*.82} L${s*.35},${s*.82} Z`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <defs>
        <linearGradient id="wg2" x1="0" y1="0" x2={s} y2={s} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#166534"/>
          <stop offset="50%" stopColor="#15803d"/>
          <stop offset="100%" stopColor="#7e22ce"/>
        </linearGradient>
      </defs>
      <rect width={size} height={size} rx={size*.22} fill="url(#wg2)"/>
      <path d={trophyBody} fill="rgba(255,255,255,0.9)"/>
      <path d={handles} stroke="rgba(255,255,255,0.8)" strokeWidth={s*.04} fill="none" strokeLinecap="round"/>
      <path d={base} fill="rgba(255,255,255,0.85)"/>
      <line x1={s*.43} y1={s*.72} x2={s*.43} y2={s*.75} stroke="rgba(255,255,255,0.7)" strokeWidth={s*.04}/>
      <line x1={s*.57} y1={s*.72} x2={s*.57} y2={s*.75} stroke="rgba(255,255,255,0.7)" strokeWidth={s*.04}/>
      <circle cx={s*.38} cy={s*.17} r={s*.035} fill="rgba(255,220,50,0.9)"/>
      <circle cx={s*.5} cy={s*.14} r={s*.035} fill="rgba(255,220,50,0.9)"/>
      <circle cx={s*.62} cy={s*.17} r={s*.035} fill="rgba(255,220,50,0.9)"/>
    </svg>
  );
}

// ─── PROGRESS RING ────────────────────────────────────────────────────────────
function ProgressRing({ pct, size=64, stroke=5, color="#f97316" }) {
  const r = (size-stroke*2)/2, circ = 2*Math.PI*r, offset = circ-(pct/100)*circ;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 0.6s ease"}}/>
    </svg>
  );
}

// ─── DATA IMPORTS ─────────────────────────────────────────────────────────────
import LALIGA_CARDS from './data/laliga.js';
import MUNDIAL_CARDS from './data/mundial.js';

const COLLECTIONS = {
  laliga: { id:"laliga", name:"La Liga 2025-26", color:"#f97316", sub:"Trading Cards", cards: LALIGA_CARDS },
  mundial: { id:"mundial", name:"Mundial 2026", color:"#4ade80", sub:"Trading Cards", cards: MUNDIAL_CARDS },
};

const SECTIONS_BY_COLL = {
  laliga: ["Todas","Regulares","Especiales","Plus","Bis","Edición Limitada"],
  mundial: ["Todas","Selecciones","Golden Baller","Categorías Especiales","Especiales Únicas","Edición Limitada"],
};

function loadData(id) { try { return JSON.parse(localStorage.getItem(`cc_${id}`) || "{}"); } catch { return {}; } }
function saveData(id, map) { try { localStorage.setItem(`cc_${id}`, JSON.stringify(map)); } catch {} }
function loadOwned(id) { const d = loadData(id); return d.owned || d; }
function loadRepeats(id) { const d = loadData(id); return d.repeats || {}; }
function saveAll(id, owned, repeats) { saveData(id, { owned, repeats }); }
function loadTheme() { try { return localStorage.getItem('croma_theme') || 'dark'; } catch { return 'dark'; } }
function saveTheme(t) { try { localStorage.setItem('croma_theme', t); } catch {} }

// ─── COLLECTION CARD ──────────────────────────────────────────────────────────
function CollCard({ coll, ownedMap, onClick, T }) {
  const cards = coll.cards;
  const count = cards.filter(c => (ownedMap[c.id] !== undefined ? ownedMap[c.id] : c.owned)).length;
  const pct = Math.round(count/cards.length*100);
  const isLaliga = coll.id === "laliga";
  const gradBar = isLaliga ? "linear-gradient(90deg,#fbbf24,#dc2626)" : "linear-gradient(90deg,#16a34a,#a855f7)";
  return (
    <div onClick={onClick} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:20,marginBottom:10,cursor:"pointer",position:"relative",overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        {isLaliga ? <LaLigaIcon size={46}/> : <MundialIcon size={46}/>}
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:18,lineHeight:1,color:T.text}}>{coll.name}</div>
          <div style={{fontSize:11,color:T.textDim,marginBottom:10}}>{coll.sub}</div>
          <div style={{height:3,background:T.surface2,borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:gradBar,borderRadius:4,transition:"width 0.6s"}}/>
          </div>
          <div style={{fontSize:11,color:T.textDim,marginTop:5}}>{count} / {cards.length} cards</div>
        </div>
        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <ProgressRing pct={pct} size={60} stroke={4} color={coll.color}/>
          <div style={{position:"absolute",fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:14,color:coll.color}}>{pct}%</div>
        </div>
      </div>
      <div style={{marginTop:14,display:"flex",alignItems:"center",gap:6,color:T.textDim,fontSize:12,borderTop:`1px solid ${T.border}`,paddingTop:12}}>
        <span>Ver colección →</span>
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScreen({ allOwned, allRepeats, onEnter, onNav, T, theme, setTheme }) {
  const laligaCards = COLLECTIONS.laliga.cards;
  const laligaOwned = allOwned.laliga || {};
  const mundialCards = COLLECTIONS.mundial.cards;
  const mundialOwned = allOwned.mundial || {};

  const teamStats = (collCards, ownedMap) => {
    const stats = {};
    collCards.filter(c => Object.keys(TEAMS).includes(c.team)).forEach(c => {
      if (!stats[c.team]) stats[c.team] = {total:0,owned:0};
      stats[c.team].total++;
      if (ownedMap[c.id] !== undefined ? ownedMap[c.id] : c.owned) stats[c.team].owned++;
    });
    return stats;
  };

  const allTeamStats = {
    ...teamStats(laligaCards, laligaOwned),
  };
  // Add mundial countries too
  mundialCards.filter(c => c.section === "Selecciones" && c.team !== "Contenders").forEach(c => {
    if (!allTeamStats[c.team]) allTeamStats[c.team] = {total:0,owned:0,coll:"mundial"};
    allTeamStats[c.team].total++;
    if (mundialOwned[c.id] !== undefined ? mundialOwned[c.id] : c.owned) allTeamStats[c.team].owned++;
  });

  const almostDone = Object.entries(allTeamStats)
    .map(([t,s])=>({team:t,missing:s.total-s.owned,pct:Math.round(s.owned/s.total*100),coll:s.coll}))
    .filter(x=>x.missing>0&&x.pct>=75).sort((a,b)=>a.missing-b.missing).slice(0,4);

  const topMissing = Object.entries(allTeamStats)
    .map(([t,s])=>({team:t,missing:s.total-s.owned,pct:Math.round(s.owned/s.total*100)}))
    .filter(x=>x.missing>0).sort((a,b)=>b.missing-a.missing).slice(0,4);

  const totalRepeats = [...Object.values(allRepeats?.laliga||{}), ...Object.values(allRepeats?.mundial||{})].reduce((a,b)=>a+b,0);

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,paddingBottom:80,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* HEADER */}
      <div style={{padding:"56px 20px 24px",display:"flex",flexDirection:"column",alignItems:"center",background:T.bg}}>
        <CromaLogo height={48} color={T.logoColor}/>
        <button onClick={()=>{const n=theme==='dark'?'light':'dark';setTheme(n);saveTheme(n);}}
          style={{marginTop:16,background:T.surface2,border:`1px solid ${T.border}`,borderRadius:20,padding:"4px 14px",
            fontSize:11,color:T.textDim,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
          {theme==='dark'?'☀️ Modo claro':'🌙 Modo oscuro'}
        </button>
      </div>

      <div style={{padding:"0 16px"}}>
        <div style={{fontSize:10,letterSpacing:3,color:T.textDim,textTransform:"uppercase",marginBottom:12,fontWeight:600}}>Mis Colecciones</div>

        <CollCard coll={COLLECTIONS.laliga} ownedMap={laligaOwned} onClick={()=>onEnter("laliga")} T={T}/>
        <CollCard coll={COLLECTIONS.mundial} ownedMap={mundialOwned} onClick={()=>onEnter("mundial")} T={T}/>

        {/* CASI LOS TIENES + MÁS LEJOS — en paralelo */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:8,marginBottom:24}}>
          {/* CASI LOS TIENES */}
          <div>
            <div style={{fontSize:10,letterSpacing:2,color:T.textDim,textTransform:"uppercase",marginBottom:10,fontWeight:600}}>Casi 🔥</div>
            <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
              {almostDone.length === 0
                ? <div style={{padding:16,fontSize:11,color:T.textDim,textAlign:"center"}}>—</div>
                : almostDone.map(({team,missing,pct},i)=>(
                  <div key={team} onClick={()=>onNav('stats')} style={{padding:"10px 12px",borderBottom:i<almostDone.length-1?`1px solid ${T.border}`:"none",cursor:"pointer"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <Shield team={team} size={22}/>
                      <div style={{flex:1,fontSize:11,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:T.text}}>{team}</div>
                    </div>
                    <div style={{fontSize:10,color:T.green,fontWeight:700}}>{missing===1?"¡Solo 1!":`${missing} faltan`}</div>
                    <div style={{height:2,background:T.surface2,borderRadius:4,overflow:"hidden",marginTop:4}}>
                      <div style={{height:"100%",width:`${pct}%`,background:"#22c55e",borderRadius:4}}/>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* MÁS LEJOS */}
          <div>
            <div style={{fontSize:10,letterSpacing:2,color:T.textDim,textTransform:"uppercase",marginBottom:10,fontWeight:600}}>Lejos 📦</div>
            <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
              {topMissing.length === 0
                ? <div style={{padding:16,fontSize:11,color:T.textDim,textAlign:"center"}}>—</div>
                : topMissing.map(({team,missing},i)=>(
                  <div key={team} onClick={()=>onNav('stats')} style={{padding:"10px 12px",borderBottom:i<topMissing.length-1?`1px solid ${T.border}`:"none",cursor:"pointer"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <Shield team={team} size={22}/>
                      <div style={{flex:1,fontSize:11,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:T.text}}>{team}</div>
                    </div>
                    <div style={{fontSize:10,color:T.accent,fontWeight:700}}>{missing} pendientes</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* REPETIDAS RESUMEN */}
        {totalRepeats > 0 && (
          <div style={{marginBottom:24}}>
            <div style={{fontSize:10,letterSpacing:2,color:T.textDim,textTransform:"uppercase",marginBottom:10,fontWeight:600}}>Mis repetidas</div>
            <div onClick={()=>onNav('repeats')} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text}}>Ver todas mis repetidas</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{background:"rgba(240,192,64,0.12)",color:T.gold,fontWeight:700,fontSize:12,padding:"3px 12px",borderRadius:20}}>{totalRepeats} total</div>
                <span style={{color:T.textDim}}>→</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── REPEATS SCREEN ───────────────────────────────────────────────────────────
function RepeatsScreen({ allOwned, allRepeats, onBack, T }) {
  const [activeCollId, setActiveCollId] = useState("laliga");
  const coll = COLLECTIONS[activeCollId];
  const ownedMap = allOwned[activeCollId] || {};
  const repeatsMap = allRepeats[activeCollId] || {};

  const repeatedCards = coll.cards
    .filter(c => {
      const owned = ownedMap[c.id] !== undefined ? ownedMap[c.id] : c.owned;
      const reps = repeatsMap[c.id] || 0;
      return owned && reps > 0;
    })
    .map(c => ({...c, reps: repeatsMap[c.id] || 0}))
    .sort((a,b) => b.reps - a.reps);

  const total = repeatedCards.reduce((a,c)=>a+c.reps, 0);

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,paddingBottom:80,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
      <div style={{padding:"56px 16px 16px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:T.text,fontSize:22,cursor:"pointer"}}>←</button>
          <div style={{flex:1,fontWeight:800,fontSize:20,color:T.text}}>Mis repetidas</div>
          <div style={{background:"rgba(240,192,64,0.12)",color:T.gold,fontWeight:700,fontSize:12,padding:"3px 12px",borderRadius:20}}>{total} total</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {Object.values(COLLECTIONS).map(c=>(
            <button key={c.id} onClick={()=>setActiveCollId(c.id)}
              style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",fontFamily:"'Inter',sans-serif",
                background:activeCollId===c.id?c.color:T.surface2,
                color:activeCollId===c.id?"#fff":T.textDim}}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"12px 16px"}}>
        {repeatedCards.length === 0
          ? <div style={{textAlign:"center",padding:48,color:T.textDim}}>
              <div style={{fontSize:36}}>🔄</div>
              <div style={{fontSize:15,marginTop:8,fontWeight:600}}>Sin repetidas en esta colección</div>
            </div>
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
  const [sortBy, setSortBy] = useState("missing"); // missing | owned | name
  const coll = COLLECTIONS[activeCollId];
  const ownedMap = allOwned[activeCollId] || {};

  const teamList = useMemo(()=>{
    const stats = {};
    coll.cards.filter(c => c.team && c.section !== "Edición Limitada").forEach(c => {
      if (!stats[c.team]) stats[c.team] = {total:0,owned:0};
      stats[c.team].total++;
      if (ownedMap[c.id] !== undefined ? ownedMap[c.id] : c.owned) stats[c.team].owned++;
    });
    return Object.entries(stats).map(([team,s])=>({
      team, total:s.total, owned:s.owned, missing:s.total-s.owned,
      pct:Math.round(s.owned/s.total*100)
    })).sort((a,b)=>{
      if(sortBy==="missing") return b.missing-a.missing;
      if(sortBy==="owned") return b.pct-a.pct;
      return a.team.localeCompare(b.team);
    });
  },[activeCollId, ownedMap, sortBy]);

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,paddingBottom:80,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
      <div style={{padding:"56px 16px 16px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:T.text,fontSize:22,cursor:"pointer"}}>←</button>
          <div style={{flex:1,fontWeight:800,fontSize:20,color:T.text}}>Estadísticas</div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {Object.values(COLLECTIONS).map(c=>(
            <button key={c.id} onClick={()=>setActiveCollId(c.id)}
              style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",fontFamily:"'Inter',sans-serif",
                background:activeCollId===c.id?c.color:T.surface2,
                color:activeCollId===c.id?"#fff":T.textDim}}>
              {c.name}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          {[["missing","Más faltan"],["owned","Más completos"],["name","A-Z"]].map(([v,l])=>(
            <button key={v} onClick={()=>setSortBy(v)}
              style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",border:"none",fontFamily:"'Inter',sans-serif",
                background:sortBy===v?T.accent:T.surface2,
                color:sortBy===v?"#fff":T.textDim}}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"12px 16px"}}>
        {teamList.map((item,i)=>(
          <div key={item.team} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
            <Shield team={item.team} size={32}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>{item.team}</div>
              <div style={{height:3,background:T.surface2,borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${item.pct}%`,background:COLLECTIONS[activeCollId].color,borderRadius:4}}/>
              </div>
            </div>
            <div style={{textAlign:"right",minWidth:60}}>
              <div style={{fontSize:13,fontWeight:800,color:item.pct===100?T.green:item.pct>50?T.gold:T.red}}>{item.pct}%</div>
              <div style={{fontSize:10,color:T.textDim}}>{item.owned}/{item.total}</div>
            </div>
          </div>
        ))}
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
  const sections = SECTIONS_BY_COLL[collId] || ["Todas"];

  const sectionStats = useMemo(()=>{
    const s={};
    sections.filter(x=>x!=="Todas").forEach(sec=>{
      const arr=cards.filter(c=>c.section===sec);
      s[sec]={total:arr.length,owned:arr.filter(c=>c.owned).length};
    });
    return s;
  },[cards]);

  const isLaliga = collId === "laliga";
  const headerGrad = isLaliga
    ? `linear-gradient(135deg,#dc262618 0%,#f9731610 50%,${T.bg} 80%)`
    : `linear-gradient(135deg,#16a34a18 0%,#a855f710 50%,${T.bg} 80%)`;

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,paddingBottom:80,fontFamily:"'Inter',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .pill{cursor:pointer;border:none;font-family:'Inter',sans-serif;transition:all 0.12s;}
        input{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:10px 14px;color:${T.text};font-size:14px;font-family:'Inter',sans-serif;width:100%;outline:none;}
        input:focus{border-color:${T.accent};}
        ::-webkit-scrollbar{width:3px;height:3px} ::-webkit-scrollbar-thumb{background:#333;border-radius:4px}
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
                background:activeTeam===t?(TEAMS[t]?.primary||coll.color):T.surface2,
                color:activeTeam===t?"#fff":T.textDim,
                border:`1px solid ${activeTeam===t?(TEAMS[t]?.primary||coll.color):T.border}`}}>
              {t}
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
                <div style={{fontWeight:800,fontSize:14,flex:1,color:T.text}}>{team}</div>
                <div style={{height:3,width:44,background:T.surface2,borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${tPct}%`,background:accent,borderRadius:4}}/>
                </div>
                <span style={{fontSize:11,color:T.textDim}}>{ownedN}/{teamCards.length}</span>
              </div>
              <div style={{background:T.surface2,borderRadius:"0 0 10px 10px",overflow:"hidden"}}>
                {teamCards.map((card,i)=>{
                  const reps = repeatsMap[card.id]||0;
                  return (
                    <div key={card.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",
                        background:card.owned?"rgba(34,197,94,0.04)":"transparent",
                        borderBottom:i<teamCards.length-1?`1px solid ${T.border}`:"none"}}>
                      <div onClick={()=>onToggle(collId,card.id,!card.owned)}
                        style={{width:22,height:22,borderRadius:5,border:`2px solid ${card.owned?T.green:T.border}`,
                          background:card.owned?T.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s",cursor:"pointer"}}>
                        {card.owned&&<span style={{fontSize:12,color:"#000",fontWeight:900}}>✓</span>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:600,color:card.owned?T.text:T.textDim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{card.name}</div>
                        <div style={{fontSize:10,color:T.textDim,marginTop:1}}>#{card.num}</div>
                      </div>
                      {card.owned ? (
                        <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                          {reps>0&&<div style={{background:"rgba(240,192,64,0.15)",color:T.gold,fontWeight:700,fontSize:10,padding:"1px 8px",borderRadius:12}}>×{reps}</div>}
                          <button onClick={e=>{e.stopPropagation();onRepeat(collId,card.id,-1);}}
                            style={{width:20,height:20,borderRadius:4,background:T.surface,border:`1px solid ${T.border}`,color:T.textDim,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",lineHeight:1}}>−</button>
                          <span style={{fontSize:12,fontWeight:700,color:reps>0?T.gold:T.textDim,minWidth:14,textAlign:"center"}}>{reps}</span>
                          <button onClick={e=>{e.stopPropagation();onRepeat(collId,card.id,1);}}
                            style={{width:20,height:20,borderRadius:4,background:T.surface,border:`1px solid ${T.border}`,color:T.textDim,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",lineHeight:1}}>+</button>
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
        {filtered.length===0&&(
          <div style={{textAlign:"center",padding:48,color:T.textDim}}>
            <div style={{fontSize:36}}>🔍</div>
            <div style={{fontSize:15,marginTop:8,fontWeight:600}}>Sin resultados</div>
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.bg,borderTop:`1px solid ${T.border}`,padding:"10px 8px",display:"flex",justifyContent:"space-around",zIndex:100}}>
        {Object.entries(sectionStats).map(([sec,{total,owned}])=>{
          const p=total>0?Math.round(owned/total*100):0;
          const labels={"Regulares":"Reg.","Especiales":"Esp.","Plus":"Plus","Bis":"Bis","Edición Limitada":"Ed.Lim.","Selecciones":"Selec.","Golden Baller":"Golden","Categorías Especiales":"Categ.","Especiales Únicas":"Únicas"};
          return(
            <div key={sec} style={{textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:800,color:p===100?T.green:p>50?T.gold:T.red}}>{p}%</div>
              <div style={{fontSize:9,color:T.textDim}}>{labels[sec]||sec}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── NAV BAR ──────────────────────────────────────────────────────────────────
function NavBar({ screen, onNav, T }) {
  const items = [
    { id:"home", label:"Inicio", icon:"🏠" },
    { id:"stats", label:"Stats", icon:"📊" },
    { id:"repeats", label:"Repetidas", icon:"🔄" },
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.surface,borderTop:`1px solid ${T.border}`,
      display:"flex",justifyContent:"space-around",padding:"10px 0 20px",zIndex:200}}>
      {items.map(item=>(
        <button key={item.id} onClick={()=>onNav(item.id)}
          style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",
            alignItems:"center",gap:3,fontFamily:"'Inter',sans-serif"}}>
          <span style={{fontSize:22}}>{item.icon}</span>
          <span style={{fontSize:10,fontWeight:600,color:screen===item.id?T.accent:T.textDim}}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [activeCollId, setActiveCollId] = useState(null);
  const [theme, setTheme] = useState(loadTheme);
  const T = THEMES[theme];

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

  const handleNav = (s) => {
    setScreen(s);
    setActiveCollId(null);
  };

  if (screen==="collection"&&activeCollId)
    return <CollectionScreen collId={activeCollId} ownedMap={allOwned[activeCollId]||{}} repeatsMap={allRepeats[activeCollId]||{}}
      onToggle={handleToggle} onRepeat={handleRepeat} onBack={()=>setScreen("home")} T={T}/>;

  if (screen==="repeats")
    return <><RepeatsScreen allOwned={allOwned} allRepeats={allRepeats} onBack={()=>setScreen("home")} T={T}/>
      <NavBar screen={screen} onNav={handleNav} T={T}/></>;

  if (screen==="stats")
    return <><StatsScreen allOwned={allOwned} onBack={()=>setScreen("home")} T={T}/>
      <NavBar screen={screen} onNav={handleNav} T={T}/></>;

  return (
    <>
      <HomeScreen allOwned={allOwned} allRepeats={allRepeats}
        onEnter={id=>{setActiveCollId(id);setScreen("collection");}}
        onNav={handleNav} T={T} theme={theme} setTheme={setTheme}/>
      <NavBar screen={screen} onNav={handleNav} T={T}/>
    </>
  );
}
