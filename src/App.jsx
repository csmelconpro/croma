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
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="50%" stopColor="#f97316"/>
          <stop offset="100%" stopColor="#dc2626"/>
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
        <div style={{display:"flex",alignItems:"center",gap:0}}>
          <CromaIcon size={58}/>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",marginLeft:2}}>
            <span style={{fontFamily:"'Dela Gothic One',sans-serif",fontSize:42,color:"#cbd5e1",lineHeight:1,letterSpacing:2}}>ROMA</span>
            <div style={{fontSize:10,color:"#333",letterSpacing:3,fontWeight:600,marginTop:2}}>
              powered by <span style={{color:"#444"}}>CardOs</span>
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
