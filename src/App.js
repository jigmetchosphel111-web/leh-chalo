import { useState, useEffect, useRef } from "react";

// Real Ladakh photos from Unsplash (free to use)
const PHOTOS = {
  splash:   "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",  // Pangong Lake wide
  pangong:  "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",  // Pangong blue
  nubra:    "https://images.unsplash.com/photo-1585016495481-91545e3d8e9e?w=800&q=80",  // Nubra dunes + camel
  leh:      "https://images.unsplash.com/photo-1604608999286-7e1c0b70e3b8?w=800&q=80",  // Leh mountains
  khardung: "https://images.unsplash.com/photo-1611807393003-ee65048fcb04?w=800&q=80",  // High pass
  monastery:"https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80",  // Monastery Ladakh
};

const VEHICLES = [
  { id:"bike",  icon:"🏍️", name:"Bullet Ride",      sub:"Solo • Royal Enfield",    base:60,  perKm:9,  eta:"2 min",  badge:"FASTEST" },
  { id:"mini",  icon:"🚗", name:"Swift Cab",         sub:"Upto 3 • AC available",   base:120, perKm:16, eta:"4 min",  badge:"" },
  { id:"suv",   icon:"🚙", name:"Mountain SUV",      sub:"Upto 6 • Best for passes",base:250, perKm:25, eta:"6 min",  badge:"POPULAR" },
  { id:"tempo", icon:"🚐", name:"Tempo Traveller",   sub:"Upto 12 • Group tours",   base:500, perKm:38, eta:"10 min", badge:"GROUP" },
];

const LOCATIONS = [
  { name:"Leh City Center",      icon:"🏙️", zone:"Leh",     photo:"leh" },
  { name:"Leh Airport",          icon:"✈️", zone:"Leh",     photo:"leh" },
  { name:"Shanti Stupa",         icon:"🕌", zone:"Leh",     photo:"monastery" },
  { name:"Leh Palace",           icon:"🏯", zone:"Leh",     photo:"monastery" },
  { name:"Main Bazaar",          icon:"🛒", zone:"Leh",     photo:"leh" },
  { name:"Khardung La Pass",     icon:"⛰️", zone:"North",   photo:"khardung" },
  { name:"Diskit, Nubra",        icon:"🐪", zone:"Nubra",   photo:"nubra" },
  { name:"Hunder Sand Dunes",    icon:"🏜️", zone:"Nubra",   photo:"nubra" },
  { name:"Pangong Lake",         icon:"💧", zone:"Pangong", photo:"pangong" },
  { name:"Pangong Tso Viewpoint",icon:"🔭", zone:"Pangong", photo:"pangong" },
  { name:"Magnetic Hill",        icon:"🧲", zone:"Leh",     photo:"leh" },
  { name:"Hemis Monastery",      icon:"🛕", zone:"South",   photo:"monastery" },
  { name:"Thiksey Monastery",    icon:"🛕", zone:"South",   photo:"monastery" },
  { name:"Hall of Fame",         icon:"🏛️", zone:"Leh",     photo:"leh" },
  { name:"Sindhu Ghat",          icon:"🌊", zone:"Leh",     photo:"leh" },
  { name:"Choglamsar",           icon:"🏘️", zone:"Leh",     photo:"leh" },
  { name:"Stok Palace",          icon:"🏰", zone:"South",   photo:"monastery" },
  { name:"Panamik Hot Springs",  icon:"♨️", zone:"Nubra",   photo:"nubra" },
];

const DRIVERS = [
  { name:"Stanzin Norbu",  rating:4.9, trips:1240, vehicle:"Innova Crysta • LA-01-1234", avatar:"🧔", lang:"Hindi, Ladakhi, English", badge:"⭐ Top Driver" },
  { name:"Sonam Wangchuk", rating:4.8, trips:870,  vehicle:"Maruti Alto • LA-01-5678",   avatar:"👨", lang:"Hindi, Ladakhi",         badge:"✅ Verified" },
  { name:"Tashi Dolma",    rating:5.0, trips:2100, vehicle:"Scorpio • LA-02-9012",       avatar:"👩", lang:"Hindi, Ladakhi, English", badge:"🏆 Expert" },
  { name:"Rigzin Angchuk", rating:4.7, trips:540,  vehicle:"Royal Enfield • LA-01-3456", avatar:"🧑", lang:"Ladakhi, Hindi",         badge:"🆕 New" },
];

const HISTORY = [
  { from:"Leh Airport",  to:"Leh City Center", date:"Apr 20", fare:220,  vehicle:"Swift Cab",      rating:5 },
  { from:"Shanti Stupa", to:"Hemis Monastery", date:"Apr 18", fare:580,  vehicle:"Mountain SUV",   rating:4 },
  { from:"Main Bazaar",  to:"Pangong Lake",     date:"Apr 15", fare:1800, vehicle:"Tempo Traveller",rating:5 },
];

const getFare = (v, km) => Math.round(v.base + v.perKm * parseFloat(km));
const getDist  = () => (Math.random() * 22 + 3).toFixed(1);

const getScenePhoto = (dest) => {
  if (!dest) return PHOTOS.leh;
  if (dest.includes("Pangong")) return PHOTOS.pangong;
  if (dest.includes("Nubra") || dest.includes("Hunder") || dest.includes("Diskit") || dest.includes("Panamik")) return PHOTOS.nubra;
  if (dest.includes("Khardung")) return PHOTOS.khardung;
  if (dest.includes("Monastery") || dest.includes("Stupa") || dest.includes("Palace") || dest.includes("Stok")) return PHOTOS.monastery;
  return PHOTOS.leh;
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;900&family=Nunito:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Nunito',sans-serif;background:#060e1a;overflow:hidden;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(42,159,214,0.5);border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  @keyframes slideUp{from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);}}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.35;}}
  @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
  @keyframes bgFade{from{opacity:0;}to{opacity:1;}}
  @keyframes shimmer{0%{transform:translateX(-100%);}100%{transform:translateX(100%);}}
  .fade{animation:fadeUp 0.45s ease both;}
  .slide{animation:slideUp 0.38s cubic-bezier(.16,1,.3,1) both;}
  .float{animation:float 3.5s ease-in-out infinite;}
  .spin{animation:spin 1s linear infinite;}
  .bgfade{animation:bgFade 0.7s ease both;}
`;

// ─── PHOTO BACKGROUND ────────────────────────────────────────────────
function PhotoBg({ src, overlay = "rgba(0,0,0,0.52)", height = 220, children }) {
  return (
    <div style={{ position:"relative", height, overflow:"hidden", flexShrink:0 }}>
      <div key={src} className="bgfade" style={{
        position:"absolute", inset:0,
        backgroundImage:`url(${src})`,
        backgroundSize:"cover", backgroundPosition:"center",
        transform:"scale(1.05)",
        transition:"background-image 0.7s ease",
      }}/>
      {/* Dark overlay for readability */}
      <div style={{ position:"absolute", inset:0, background:overlay }}/>
      {/* Bottom fade */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80, background:"linear-gradient(to bottom, transparent, #060e1a)" }}/>
      {children}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────
export default function LehChalo() {
  const [screen,       setScreen]       = useState("splash");
  const [mode,         setMode]         = useState("passenger");
  const [tab,          setTab]          = useState("home");
  const [pickup,       setPickup]       = useState("");
  const [destination,  setDestination]  = useState("");
  const [vehicle,      setVehicle]      = useState(null);
  const [rideState,    setRideState]    = useState(null);
  const [driver,       setDriver]       = useState(null);
  const [fare,         setFare]         = useState(0);
  const [dist,         setDist]         = useState(0);
  const [rating,       setRating]       = useState(0);
  const [locPicker,    setLocPicker]    = useState(null);
  const [locQ,         setLocQ]         = useState("");
  const [driverOnline, setDriverOnline] = useState(false);
  const [driverReqs,   setDriverReqs]   = useState([]);
  const [earnings,     setEarnings]     = useState(1640);
  const timer = useRef(null);

  const bgPhoto = getScenePhoto(destination);

  useEffect(() => { const t = setTimeout(() => setScreen("onboarding"), 2400); return () => clearTimeout(t); }, [onDone]);

  const filteredLocs = LOCATIONS.filter(l =>
    l.name.toLowerCase().includes(locQ.toLowerCase()) || l.zone.toLowerCase().includes(locQ.toLowerCase())
  );

  const bookRide = () => {
    if (!pickup || !destination || !vehicle) return;
    const d = getDist(); setDist(d); setFare(getFare(vehicle, d)); setRideState("searching");
    timer.current = setTimeout(() => { setDriver(DRIVERS[Math.floor(Math.random() * DRIVERS.length)]); setRideState("found"); }, 3000);
  };

  const reset = () => { setRideState(null); setDriver(null); setPickup(""); setDestination(""); setVehicle(null); setFare(0); setDist(0); setRating(0); };

  const advance = () => {
    const flow = ["found","enroute","arrived","ongoing","completed"];
    const i = flow.indexOf(rideState); if (i < flow.length - 1) setRideState(flow[i + 1]);
  };

  if (screen === "splash")     return <Splash    onDone={() => setScreen("onboarding")} />;
  if (screen === "onboarding") return <Onboarding onDone={(m) => { setMode(m); setScreen("app"); }} />;

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth:430, margin:"0 auto", height:"100vh", background:"#060e1a", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>

        {/* ── HEADER ── */}
        <div style={{ padding:"13px 16px 11px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(6,10,20,0.88)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,0.08)", zIndex:20, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:28 }}>🏔️</span>
            <div>
              <div style={{ fontFamily:"Unbounded", fontWeight:900, fontSize:20, color:"#fff", letterSpacing:"-0.5px", lineHeight:1 }}>Leh Chalo</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", letterSpacing:2.5, marginTop:1 }}>LADAKH'S RIDE APP</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div style={{ fontSize:10, color:"#2a9fd6", background:"rgba(42,159,214,0.15)", padding:"3px 10px", borderRadius:20, border:"1px solid rgba(42,159,214,0.3)", fontFamily:"Unbounded" }}>
              {mode==="passenger"?"🧳 Rider":"🚗 Driver"}
            </div>
            <button onClick={() => { setMode(m => m==="passenger"?"driver":"passenger"); setRideState(null); }}
              style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"6px 12px", fontSize:10, color:"rgba(255,255,255,0.6)", cursor:"pointer", fontFamily:"Unbounded" }}>
              Switch
            </button>
          </div>
        </div>

        {/* ── PHOTO HERO ── */}
        {!rideState && (
          <PhotoBg src={bgPhoto} height={200}>
            {/* Location badge */}
            <div style={{ position:"absolute", top:12, left:14, display:"flex", alignItems:"center", gap:6, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(8px)", borderRadius:20, padding:"5px 13px", border:"1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#2a9fd6", animation:"pulse 2s infinite" }}/>
              <span style={{ fontSize:11, color:"#fff", fontFamily:"Unbounded", letterSpacing:0.5 }}>
                {destination.includes("Pangong") ? "💧 Pangong Tso"
                  : destination.includes("Nubra")||destination.includes("Hunder")||destination.includes("Diskit") ? "🐪 Nubra Valley"
                  : destination.includes("Khardung") ? "⛰️ Khardung La"
                  : destination.includes("Monastery")||destination.includes("Stupa") ? "🛕 Monastery"
                  : "🏔️ Leh, Ladakh"}
              </span>
            </div>

            {/* Prayer flags decoration */}
            <div style={{ position:"absolute", top:0, left:0, right:0, display:"flex", justifyContent:"space-around", paddingTop:2, opacity:0.6 }}>
              {["#e74c3c","#f39c12","#27ae60","#2980b9","#fff","#e74c3c","#f39c12","#27ae60","#2980b9"].map((c,i) => (
                <div key={i} style={{ width:24, height:16, background:c, opacity:0.55, clipPath:"polygon(0 0,100% 0,100% 70%,50% 100%,0 70%)" }}/>
              ))}
            </div>

            {/* Route pins overlay */}
            {pickup && destination && (
              <div style={{ position:"absolute", bottom:24, left:16, right:16, display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ background:"rgba(39,174,96,0.9)", borderRadius:8, padding:"4px 10px", fontSize:11, color:"#fff", fontWeight:700, fontFamily:"Unbounded", maxWidth:"42%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>📍 {pickup}</div>
                <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.3)", position:"relative" }}>
                  <div style={{ position:"absolute", top:-3, left:"50%", fontSize:8, color:"rgba(255,255,255,0.7)" }}>━━━▶</div>
                </div>
                <div style={{ background:"rgba(212,160,74,0.9)", borderRadius:8, padding:"4px 10px", fontSize:11, color:"#fff", fontWeight:700, fontFamily:"Unbounded", maxWidth:"42%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>🏁 {destination}</div>
              </div>
            )}
          </PhotoBg>
        )}

        {/* ── SCROLLABLE CONTENT ── */}
        <div style={{ flex:1, overflowY:"auto", position:"relative", zIndex:1 }}>
          <div style={{ paddingBottom:80 }}>
            {mode === "passenger" ? (<>
              {!rideState && tab==="home"    && <BookPanel    pickup={pickup} setPickup={setPickup} destination={destination} setDestination={setDestination} vehicle={vehicle} setVehicle={setVehicle} onBook={bookRide} setLocPicker={setLocPicker}/>}
              {!rideState && tab==="trips"   && <TripsPanel/>}
              {!rideState && tab==="profile" && <ProfilePanel/>}
              {rideState && <RidePanel state={rideState} driver={driver} fare={fare} dist={dist} rating={rating} setRating={setRating} onReset={reset} vehicle={vehicle} onAdvance={advance} bgPhoto={bgPhoto}/>}
            </>) : (
              <DriverPanel online={driverOnline} onToggle={() => {
                setDriverOnline(o => {
                  if (!o) setTimeout(() => setDriverReqs([{ id:1, from:"Leh Airport", to:"Shanti Stupa", fare:320, dist:"4.2 km", passenger:"Rahul M.", pRating:4.6 }]), 3500);
                  else setDriverReqs([]);
                  return !o;
                });
              }} reqs={driverReqs} earnings={earnings}
                onAccept={() => { setEarnings(e => e+320); setDriverReqs([]); }}
                onDecline={() => setDriverReqs([])} bgPhoto={bgPhoto}
              />
            )}
          </div>
        </div>

        {/* ── BOTTOM NAV ── */}
        {mode==="passenger" && !rideState && (
          <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(6,10,20,0.95)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", padding:"10px 0 16px", zIndex:50 }}>
            {[["home","🏔️","Home"],["trips","📋","Trips"],["profile","👤","Profile"]].map(([id,icon,label]) => (
              <button key={id} onClick={() => setTab(id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <div style={{ fontSize:24, filter:tab===id?"drop-shadow(0 0 8px rgba(42,159,214,0.9))":"none", transition:"filter 0.2s" }}>{icon}</div>
                <div style={{ fontSize:9, color:tab===id?"#2a9fd6":"rgba(255,255,255,0.35)", fontFamily:"Unbounded", fontWeight:tab===id?700:400, letterSpacing:0.8 }}>{label}</div>
                {tab===id && <div style={{ width:20, height:2, borderRadius:1, background:"#2a9fd6", boxShadow:"0 0 8px rgba(42,159,214,0.8)" }}/>}
              </button>
            ))}
          </div>
        )}

        {/* ── LOCATION PICKER ── */}
        {locPicker && (
          <LocPicker type={locPicker} q={locQ} setQ={setLocQ} locs={filteredLocs}
            onSelect={(loc) => { locPicker==="pickup" ? setPickup(loc) : setDestination(loc); setLocPicker(null); setLocQ(""); }}
            onClose={() => { setLocPicker(null); setLocQ(""); }}
          />
        )}
      </div>
    </>
  );
}

// ─── SPLASH ──────────────────────────────────────────────────────────
function Splash({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, []);
  return (
    <>
      <style>{css}</style>
      <div style={{ height:"100vh", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`url(${PHOTOS.splash})`, backgroundSize:"cover", backgroundPosition:"center", transform:"scale(1.04)" }}/>
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.55)" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8) 100%)" }}/>

        {/* Prayer flags */}
        <div style={{ position:"absolute", top:0, left:0, right:0, display:"flex", justifyContent:"space-around", paddingTop:0, zIndex:2 }}>
          {["#e74c3c","#f39c12","#27ae60","#2980b9","#fff","#e74c3c","#f39c12","#27ae60","#2980b9","#fff"].map((c,i)=>(
            <div key={i} style={{ width:"10%", height:20, background:c, opacity:0.65, clipPath:"polygon(0 0,100% 0,100% 70%,50% 100%,0 70%)" }}/>
          ))}
        </div>

        <div style={{ position:"relative", zIndex:3, textAlign:"center" }}>
          <div className="float" style={{ fontSize:72, marginBottom:14, filter:"drop-shadow(0 4px 24px rgba(0,0,0,0.8))" }}>🏔️</div>
          <div style={{ fontFamily:"Unbounded", fontWeight:900, fontSize:42, color:"#fff", letterSpacing:"-1px", textShadow:"0 2px 30px rgba(0,0,0,0.9)", marginBottom:8 }}>Leh Chalo</div>
          <div style={{ color:"rgba(255,255,255,0.65)", fontSize:12, letterSpacing:4, fontFamily:"Nunito", marginBottom:36 }}>LADAKH'S FIRST RIDE APP</div>
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:36 }}>
            {["#e74c3c","#f39c12","#27ae60","#2980b9","#ecf0f1"].map((c,i)=><div key={i} style={{ width:22, height:14, background:c, borderRadius:2, opacity:0.7 }}/>)}
          </div>
          <div className="spin" style={{ width:36, height:36, borderRadius:"50%", border:"3px solid rgba(255,255,255,0.2)", borderTopColor:"#2a9fd6", margin:"0 auto" }}/>
        </div>
      </div>
    </>
  );
}

// ─── ONBOARDING ──────────────────────────────────────────────────────
function Onboarding({ onDone }) {
  return (
    <>
      <style>{css}</style>
      <div style={{ height:"100vh", display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
        {/* Full photo background */}
        <div style={{ position:"absolute", inset:0, backgroundImage:`url(${PHOTOS.pangong})`, backgroundSize:"cover", backgroundPosition:"center" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 40%, rgba(6,10,20,0.97) 72%)" }}/>

        {/* Prayer flags */}
        <div style={{ position:"absolute", top:0, left:0, right:0, display:"flex", justifyContent:"space-around", zIndex:2 }}>
          {["#e74c3c","#f39c12","#27ae60","#2980b9","#fff","#e74c3c","#f39c12","#27ae60","#2980b9","#fff"].map((c,i)=>(
            <div key={i} style={{ width:"10%", height:20, background:c, opacity:0.65, clipPath:"polygon(0 0,100% 0,100% 70%,50% 100%,0 70%)" }}/>
          ))}
        </div>

        {/* Top branding on photo */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", paddingBottom:32, position:"relative", zIndex:3 }}>
          <div className="float" style={{ fontSize:64, marginBottom:10, filter:"drop-shadow(0 4px 20px rgba(0,0,0,0.7))" }}>🏔️</div>
          <div style={{ fontFamily:"Unbounded", fontWeight:900, fontSize:36, color:"#fff", textShadow:"0 2px 24px rgba(0,0,0,0.9)", letterSpacing:"-0.5px", marginBottom:6 }}>Leh Chalo</div>
          <div style={{ color:"rgba(255,255,255,0.55)", fontSize:11, letterSpacing:4 }}>LADAKH'S FIRST RIDE APP</div>
        </div>

        {/* Bottom sheet */}
        <div style={{ position:"relative", zIndex:3, background:"rgba(8,14,26,0.98)", borderRadius:"28px 28px 0 0", padding:"26px 22px 44px", borderTop:"1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ width:40, height:4, borderRadius:2, background:"rgba(255,255,255,0.15)", margin:"0 auto 24px" }}/>
          <div style={{ fontFamily:"Unbounded", fontWeight:700, fontSize:22, color:"#fff", marginBottom:6 }}>Julley! 🙏</div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, lineHeight:1.8, marginBottom:24 }}>
            Your trusted ride partner across Leh, Nubra Valley, Pangong Tso & beyond.
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <button onClick={() => onDone("passenger")} style={{ background:"linear-gradient(135deg, #1a6b8a, #0d3d52)", border:"1px solid rgba(42,159,214,0.4)", borderRadius:16, padding:18, fontSize:16, fontFamily:"Unbounded", fontWeight:700, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow:"0 6px 30px rgba(42,159,214,0.25)" }}>
              🧳 I Need a Ride
            </button>
            <button onClick={() => onDone("driver")} style={{ background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.15)", borderRadius:16, padding:18, fontSize:16, fontFamily:"Unbounded", fontWeight:700, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              🚗 I'm a Driver
            </button>
          </div>
          <div style={{ textAlign:"center", marginTop:14, fontSize:11, color:"rgba(255,255,255,0.3)" }}>Switch modes anytime • Serving all of Ladakh</div>
        </div>
      </div>
    </>
  );
}

// ─── BOOK PANEL ──────────────────────────────────────────────────────
function BookPanel({ pickup, setPickup, destination, setDestination, vehicle, setVehicle, onBook, setLocPicker }) {
  return (
    <div style={{ padding:"14px 14px 0" }} className="fade">

      {/* Location inputs */}
      <div style={{ background:"rgba(10,18,34,0.92)", backdropFilter:"blur(16px)", borderRadius:20, border:"1px solid rgba(255,255,255,0.1)", overflow:"hidden", marginBottom:14, boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
        <div onClick={() => setLocPicker("pickup")} style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
          <div style={{ width:11, height:11, borderRadius:"50%", background:"#27ae60", boxShadow:"0 0 10px #27ae60", flexShrink:0 }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:1.8, marginBottom:2, fontFamily:"Unbounded" }}>PICKUP</div>
            <div style={{ fontSize:14, color:pickup?"#fff":"rgba(255,255,255,0.35)", fontWeight:pickup?600:400 }}>{pickup||"Where are you now?"}</div>
          </div>
          <span style={{ fontSize:18 }}>📍</span>
        </div>
        <div onClick={() => setLocPicker("destination")} style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
          <div style={{ width:11, height:11, borderRadius:2, background:"#d4a04a", boxShadow:"0 0 10px rgba(212,160,74,0.7)", flexShrink:0 }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:1.8, marginBottom:2, fontFamily:"Unbounded" }}>DESTINATION</div>
            <div style={{ fontSize:14, color:destination?"#fff":"rgba(255,255,255,0.35)", fontWeight:destination?600:400 }}>{destination||"Pangong? Nubra? Khardung La?"}</div>
          </div>
          <span style={{ fontSize:18 }}>🔍</span>
        </div>
      </div>

      {/* Quick picks with photo thumbnails */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:2, marginBottom:10, fontFamily:"Unbounded" }}>POPULAR DESTINATIONS</div>
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
          {[
            { label:"Pangong",   val:"Pangong Lake",      icon:"💧", photo:PHOTOS.pangong },
            { label:"Nubra",     val:"Diskit, Nubra",     icon:"🐪", photo:PHOTOS.nubra },
            { label:"Khardung",  val:"Khardung La Pass",  icon:"⛰️", photo:PHOTOS.khardung },
            { label:"Hemis",     val:"Hemis Monastery",   icon:"🛕", photo:PHOTOS.monastery },
            { label:"Airport",   val:"Leh Airport",       icon:"✈️", photo:PHOTOS.leh },
          ].map(({label,val,icon,photo}) => (
            <button key={label} onClick={() => setDestination(val)} style={{ flexShrink:0, position:"relative", width:80, height:72, borderRadius:14, overflow:"hidden", border:`2px solid ${destination===val?"#2a9fd6":"rgba(255,255,255,0.1)"}`, cursor:"pointer", background:"#111" }}>
              <div style={{ position:"absolute", inset:0, backgroundImage:`url(${photo})`, backgroundSize:"cover", backgroundPosition:"center", transform:"scale(1.08)" }}/>
              <div style={{ position:"absolute", inset:0, background:destination===val?"rgba(42,159,214,0.35)":"rgba(0,0,0,0.45)" }}/>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2 }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                <span style={{ fontSize:10, color:"#fff", fontFamily:"Unbounded", fontWeight:600, textShadow:"0 1px 4px rgba(0,0,0,0.8)" }}>{label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle selection */}
      {pickup && destination && (
        <div className="slide">
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:2, marginBottom:10, fontFamily:"Unbounded" }}>CHOOSE YOUR RIDE</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
            {VEHICLES.map(v => (
              <button key={v.id} onClick={() => setVehicle(v)} style={{ background:vehicle?.id===v.id?"rgba(26,107,138,0.35)":"rgba(10,18,34,0.85)", backdropFilter:"blur(10px)", border:`1.5px solid ${vehicle?.id===v.id?"rgba(42,159,214,0.7)":"rgba(255,255,255,0.08)"}`, borderRadius:16, padding:"12px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:12, textAlign:"left", transition:"all 0.2s", boxShadow:vehicle?.id===v.id?"0 4px 20px rgba(42,159,214,0.2)":"none" }}>
                <div style={{ fontSize:30, filter:vehicle?.id===v.id?"drop-shadow(0 0 8px rgba(42,159,214,0.7))":"none" }}>{v.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                    <span style={{ fontFamily:"Unbounded", fontWeight:700, fontSize:13, color:"#fff" }}>{v.name}</span>
                    {v.badge && <span style={{ fontSize:8, background:v.badge==="POPULAR"?"#1a6b8a":v.badge==="FASTEST"?"#27ae60":"#8a6a3a", color:"#fff", padding:"2px 7px", borderRadius:10, letterSpacing:0.5, fontFamily:"Unbounded" }}>{v.badge}</span>}
                  </div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{v.sub} • {v.eta}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"Unbounded", fontWeight:700, fontSize:16, color:"#d4a04a" }}>₹{getFare(v,6)}</div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)" }}>est.</div>
                </div>
              </button>
            ))}
          </div>
          <button onClick={onBook} disabled={!vehicle} style={{ width:"100%", background:vehicle?"linear-gradient(135deg, #1a6b8a 0%, #0d3d52 100%)":"rgba(255,255,255,0.06)", border:vehicle?"1px solid rgba(42,159,214,0.35)":"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:17, fontSize:14, fontFamily:"Unbounded", fontWeight:700, color:vehicle?"#fff":"rgba(255,255,255,0.25)", cursor:vehicle?"pointer":"not-allowed", transition:"all 0.3s", boxShadow:vehicle?"0 6px 28px rgba(42,159,214,0.3)":"none" }}>
            {vehicle ? `🏔️ Book ${vehicle.name}` : "Select a ride type first"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── RIDE STATUS PANEL ───────────────────────────────────────────────
function RidePanel({ state, driver, fare, dist, rating, setRating, onReset, vehicle, onAdvance, bgPhoto }) {
  const cfgs = {
    searching: { icon:"🔍", title:"Finding your driver...", sub:"Connecting with nearby Leh drivers", color:"#2a9fd6" },
    found:     { icon:"🙏", title:"Driver Found! Julley!", sub:(driver?.name||"")+" is heading to you", color:"#27ae60" },
    enroute:   { icon:"🚗", title:"On the Way!",            sub:"Sit back & enjoy the Ladakh vibes",    color:"#d4a04a" },
    arrived:   { icon:"📍", title:"Driver Arrived!",        sub:"Your driver is waiting outside",       color:"#27ae60" },
    ongoing:   { icon:"🏔️", title:"Ride in Progress",       sub:"Enjoy the mountain roads!",            color:"#2a9fd6" },
    completed: { icon:"✅", title:"Arrived Safely!",        sub:`${dist} km • ₹${fare} • Julley! 🙏`,  color:"#27ae60" },
  };
  const cfg = cfgs[state] || {};

  return (
    <div className="slide">
      {/* Photo strip for context */}
      <PhotoBg src={bgPhoto} height={140} overlay="rgba(0,0,0,0.6)">
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <div style={{ fontSize:44, filter:`drop-shadow(0 0 16px ${cfg.color}90)`, marginBottom:6 }}>{cfg.icon}</div>
          <div style={{ fontFamily:"Unbounded", fontWeight:800, fontSize:18, color:"#fff", textShadow:"0 2px 12px rgba(0,0,0,0.9)" }}>{cfg.title}</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:4 }}>{cfg.sub}</div>
          {state==="searching" && (
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              {[0,1,2].map(i=><div key={i} style={{ width:9, height:9, borderRadius:"50%", background:"#2a9fd6", animation:`pulse 1.6s ${i*0.25}s infinite` }}/>)}
            </div>
          )}
        </div>
      </PhotoBg>

      <div style={{ padding:"0 14px 14px" }}>
        {/* Driver card */}
        {driver && state!=="searching" && (
          <div style={{ background:"rgba(10,18,34,0.95)", backdropFilter:"blur(16px)", borderRadius:20, border:"1px solid rgba(255,255,255,0.1)", padding:"16px", marginBottom:10, boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:13 }}>
              <div style={{ width:58, height:58, borderRadius:18, background:"linear-gradient(135deg, #0d3d52, #1a6b8a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, border:"2px solid rgba(42,159,214,0.35)", flexShrink:0 }}>{driver.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"Unbounded", fontWeight:700, fontSize:15, color:"#fff" }}>{driver.name}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginTop:2 }}>{driver.vehicle}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>{driver.lang}</div>
                <div style={{ display:"flex", gap:6, marginTop:5, flexWrap:"wrap" }}>
                  <span style={{ fontSize:10, background:"rgba(42,159,214,0.15)", color:"#2a9fd6", padding:"2px 8px", borderRadius:20, border:"1px solid rgba(42,159,214,0.3)", fontFamily:"Unbounded" }}>{driver.badge}</span>
                  <span style={{ fontSize:10, color:"#d4a04a" }}>⭐ {driver.rating} • {driver.trips} trips</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <button style={{ width:42, height:42, borderRadius:13, background:"rgba(39,174,96,0.15)", border:"1px solid rgba(39,174,96,0.35)", fontSize:18, cursor:"pointer" }}>📞</button>
                <button style={{ width:42, height:42, borderRadius:13, background:"rgba(42,159,214,0.15)", border:"1px solid rgba(42,159,214,0.35)", fontSize:18, cursor:"pointer" }}>💬</button>
              </div>
            </div>
          </div>
        )}

        {/* Trip stats */}
        {state!=="searching" && (
          <div style={{ background:"rgba(10,18,34,0.9)", backdropFilter:"blur(12px)", borderRadius:16, border:"1px solid rgba(255,255,255,0.08)", padding:"12px 16px", marginBottom:10, display:"flex" }}>
            {[["📏",dist+" km","Distance"],["🚗",vehicle?.icon||"—","Ride"],["💰","₹"+fare,"Fare"],["💵","Cash","Pay"]].map(([icon,val,label],i)=>(
              <div key={i} style={{ flex:1, textAlign:"center", borderRight:i<3?"1px solid rgba(255,255,255,0.07)":"none" }}>
                <div style={{ fontSize:15 }}>{icon}</div>
                <div style={{ fontFamily:"Unbounded", fontWeight:700, fontSize:13, color:i===2?"#d4a04a":"#fff", marginTop:2 }}>{val}</div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:0.8 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Rating */}
        {state==="completed" && (
          <div style={{ background:"rgba(10,18,34,0.9)", backdropFilter:"blur(12px)", borderRadius:16, border:"1px solid rgba(255,255,255,0.08)", padding:"16px", marginBottom:10, textAlign:"center" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", letterSpacing:2, marginBottom:10, fontFamily:"Unbounded" }}>RATE YOUR RIDE</div>
            <div style={{ display:"flex", justifyContent:"center", gap:6 }}>
              {[1,2,3,4,5].map(s=><button key={s} onClick={()=>setRating(s)} style={{ fontSize:34, background:"none", border:"none", cursor:"pointer", opacity:s<=rating?1:0.2, transform:s<=rating?"scale(1.15)":"scale(1)", transition:"all 0.15s", filter:s<=rating?"drop-shadow(0 0 8px rgba(212,160,74,0.9))":"none" }}>⭐</button>)}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display:"flex", gap:10 }}>
          {state==="found"     && <button onClick={onAdvance} style={btnStyle("#1a6b8a","#2a9fd6")}>✅ Confirm Ride</button>}
          {state==="enroute"   && <button onClick={onAdvance} style={btnStyle("#8a6a3a","#d4a04a")}>📍 Mark Arrived</button>}
          {state==="arrived"   && <button onClick={onAdvance} style={btnStyle("#1e8449","#27ae60")}>🚗 Start Ride</button>}
          {state==="ongoing"   && <button onClick={onAdvance} style={btnStyle("#1a6b8a","#2a9fd6")}>🏁 End Ride</button>}
          {state==="completed" && <button onClick={onReset}   style={btnStyle("#1a6b8a","#0d3d52")}>🏔️ Book Another Ride</button>}
          {(state==="searching"||state==="found") && (
            <button onClick={onReset} style={{ background:"rgba(231,76,60,0.15)", border:"1px solid rgba(231,76,60,0.4)", borderRadius:14, padding:"15px 18px", fontFamily:"Unbounded", fontWeight:700, fontSize:12, color:"#e74c3c", cursor:"pointer" }}>Cancel</button>
          )}
        </div>
      </div>
    </div>
  );
}

const btnStyle = (from, to) => ({
  flex:1, background:`linear-gradient(135deg, ${from}, ${to}33)`, border:`1px solid ${to}55`,
  borderRadius:14, padding:15, fontFamily:"Unbounded", fontWeight:700, fontSize:13,
  color:"#fff", cursor:"pointer", boxShadow:`0 4px 20px ${to}30`,
});

// ─── TRIPS PANEL ─────────────────────────────────────────────────────
function TripsPanel() {
  return (
    <div style={{ padding:"14px" }} className="fade">
      <div style={{ fontFamily:"Unbounded", fontWeight:800, fontSize:18, color:"#fff", marginBottom:14 }}>Your Trips</div>
      {HISTORY.map((r,i) => (
        <div key={i} style={{ background:"rgba(10,18,34,0.9)", backdropFilter:"blur(12px)", borderRadius:18, border:"1px solid rgba(255,255,255,0.08)", padding:"14px 16px", marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <div><div style={{ fontWeight:700, fontSize:13, color:"#fff" }}>{r.from}</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>↓ {r.to}</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontFamily:"Unbounded", fontWeight:700, color:"#d4a04a", fontSize:16 }}>₹{r.fare}</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>{r.date}</div></div>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <span style={{ background:"rgba(39,174,96,0.2)", color:"#27ae60", fontSize:10, padding:"3px 10px", borderRadius:20, fontFamily:"Unbounded", fontWeight:600 }}>✅ Completed</span>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>{r.vehicle}</span>
            <span style={{ marginLeft:"auto", fontSize:14 }}>{"⭐".repeat(r.rating)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PROFILE PANEL ───────────────────────────────────────────────────
function ProfilePanel() {
  return (
    <div style={{ padding:"14px" }} className="fade">
      {/* Photo hero card */}
      <div style={{ position:"relative", borderRadius:24, overflow:"hidden", marginBottom:14, height:160 }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`url(${PHOTOS.leh})`, backgroundSize:"cover", backgroundPosition:"center" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(6,10,20,0.95))" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px 18px", display:"flex", alignItems:"flex-end", gap:12 }}>
          <div style={{ fontSize:48 }}>🧑‍💼</div>
          <div>
            <div style={{ fontFamily:"Unbounded", fontWeight:800, fontSize:18, color:"#fff" }}>Traveller</div>
            <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12 }}>+91 98XXX XXXXX • Julley! 🙏</div>
          </div>
        </div>
      </div>
      {/* Stats */}
      <div style={{ background:"rgba(10,18,34,0.9)", backdropFilter:"blur(12px)", borderRadius:16, border:"1px solid rgba(255,255,255,0.08)", padding:"14px 20px", marginBottom:14, display:"flex", justifyContent:"space-around" }}>
        {[["12","Rides"],["4.8⭐","Rating"],["₹2.4k","Spent"]].map(([val,label])=>(
          <div key={label} style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"Unbounded", fontWeight:700, fontSize:18, color:"#d4a04a" }}>{val}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>
      {[["🆘","Emergency SOS","Quick help on remote Ladakh roads"],["📞","24/7 Support","+91 1901 LEH-CHALO"],["🌐","Language","English / हिंदी / བོད་སྐད་"],["🗺️","Offline Maps","Download Ladakh maps for mountain areas"],["⭐","Rate Leh Chalo","Help us improve!"]].map(([icon,title,sub])=>(
        <div key={title} style={{ background:"rgba(10,18,34,0.85)", backdropFilter:"blur(10px)", borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", padding:"13px 16px", marginBottom:8, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"rgba(42,159,214,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, border:"1px solid rgba(42,159,214,0.2)", flexShrink:0 }}>{icon}</div>
          <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13, color:"#fff" }}>{title}</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:1 }}>{sub}</div></div>
          <div style={{ color:"rgba(255,255,255,0.3)", fontSize:18 }}>›</div>
        </div>
      ))}
    </div>
  );
}

// ─── DRIVER PANEL ────────────────────────────────────────────────────
function DriverPanel({ online, onToggle, reqs, earnings, onAccept, onDecline, bgPhoto }) {
  return (
    <div>
      {/* Photo hero */}
      <PhotoBg src={bgPhoto} height={140} overlay="rgba(0,0,0,0.55)">
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}>
          <div style={{ fontFamily:"Unbounded", fontWeight:900, fontSize:22, color:"#fff", textShadow:"0 2px 12px rgba(0,0,0,0.9)" }}>Driver Dashboard</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.55)" }}>🏔️ Serving Leh & Ladakh</div>
        </div>
      </PhotoBg>

      <div style={{ padding:"14px" }}>
        {/* Toggle card */}
        <div style={{ background:"rgba(10,18,34,0.92)", backdropFilter:"blur(16px)", borderRadius:22, border:`1.5px solid ${online?"rgba(39,174,96,0.4)":"rgba(255,255,255,0.08)"}`, padding:"22px 20px", textAlign:"center", marginBottom:12, boxShadow:online?"0 0 32px rgba(39,174,96,0.12)":"none", transition:"all 0.4s" }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", letterSpacing:2, marginBottom:14, fontFamily:"Unbounded" }}>DRIVER STATUS</div>
          <button onClick={onToggle} style={{ width:88, height:88, borderRadius:"50%", background:online?"linear-gradient(135deg,#27ae60,#1e8449)":"rgba(255,255,255,0.06)", border:`3px solid ${online?"#27ae60":"rgba(255,255,255,0.1)"}`, fontSize:36, cursor:"pointer", marginBottom:12, transition:"all 0.35s", boxShadow:online?"0 0 36px rgba(39,174,96,0.5)":"none" }}>
            {online?"🟢":"⭕"}
          </button>
          <div style={{ fontFamily:"Unbounded", fontWeight:800, fontSize:20, color:online?"#27ae60":"rgba(255,255,255,0.35)" }}>{online?"Online":"Offline"}</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:4 }}>{online?"Visible to passengers across Ladakh":"Go online to receive ride requests"}</div>
        </div>

        {/* Earnings */}
        <div style={{ background:"rgba(10,18,34,0.88)", backdropFilter:"blur(12px)", borderRadius:18, border:"1px solid rgba(255,255,255,0.08)", padding:"14px 18px", marginBottom:12 }}>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:2, marginBottom:12, fontFamily:"Unbounded" }}>TODAY'S SUMMARY</div>
          <div style={{ display:"flex", justifyContent:"space-around" }}>
            {[["₹"+earnings,"Earned","#d4a04a"],["8","Trips","#fff"],["4.9 ⭐","Rating","#2a9fd6"]].map(([val,label,col])=>(
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"Unbounded", fontWeight:800, fontSize:22, color:col }}>{val}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ride requests */}
        {reqs.map(req=>(
          <div key={req.id} style={{ background:"rgba(10,18,34,0.95)", backdropFilter:"blur(16px)", borderRadius:20, border:"2px solid rgba(42,159,214,0.45)", padding:"16px 18px", boxShadow:"0 0 32px rgba(42,159,214,0.15)" }} className="slide">
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:13 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#2a9fd6", animation:"pulse 1s infinite" }}/>
              <div style={{ fontFamily:"Unbounded", fontWeight:700, fontSize:13, color:"#2a9fd6" }}>New Ride Request!</div>
            </div>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#fff", marginBottom:4 }}>📍 {req.from}</div>
              <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>🏁 {req.to}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:6 }}>👤 {req.passenger} • ⭐ {req.pRating} • 📏 {req.dist}</div>
            </div>
            <div style={{ fontFamily:"Unbounded", fontWeight:900, fontSize:30, color:"#d4a04a", marginBottom:14 }}>₹{req.fare}</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={onAccept} style={{ flex:1, background:"linear-gradient(135deg,#27ae60,#1e8449)", border:"none", borderRadius:14, padding:15, fontFamily:"Unbounded", fontWeight:700, fontSize:13, color:"#fff", cursor:"pointer", boxShadow:"0 4px 20px rgba(39,174,96,0.3)" }}>✅ Accept</button>
              <button onClick={onDecline} style={{ background:"rgba(231,76,60,0.15)", border:"1px solid rgba(231,76,60,0.4)", borderRadius:14, padding:"15px 20px", fontFamily:"Unbounded", fontWeight:700, color:"#e74c3c", cursor:"pointer" }}>✗</button>
            </div>
          </div>
        ))}

        {online && reqs.length===0 && (
          <div style={{ textAlign:"center", padding:"28px 20px", color:"rgba(255,255,255,0.35)" }}>
            <div style={{ fontSize:44, marginBottom:12, animation:"float 3s ease-in-out infinite" }}>👀</div>
            <div style={{ fontFamily:"Unbounded", fontWeight:700, fontSize:14, color:"rgba(255,255,255,0.6)", marginBottom:6 }}>Watching the passes...</div>
            <div style={{ fontSize:12 }}>Ride requests will appear here</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LOCATION PICKER ────────────────────────────────────────────────
function LocPicker({ type, q, setQ, locs, onSelect, onClose }) {
  const zones = [...new Set(locs.map(l=>l.zone))];
  const zoneColors = { Pangong:"#2a9fd6", Nubra:"#c9a96e", Leh:"#fff", North:"#e8f0ee", South:"#f39c12" };
  return (
    <div style={{ position:"absolute", inset:0, background:"#060e1a", zIndex:100, display:"flex", flexDirection:"column" }} className="slide">
      {/* Photo header */}
      <div style={{ position:"relative", height:110, flexShrink:0 }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`url(${PHOTOS.pangong})`, backgroundSize:"cover", backgroundPosition:"center" }}/>
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)" }}/>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", padding:"0 14px", gap:10 }}>
          <button onClick={onClose} style={{ width:40, height:40, borderRadius:12, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)", cursor:"pointer", fontSize:18, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>←</button>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
            placeholder={type==="pickup"?"Search pickup in Ladakh...":"Where to in Ladakh?"}
            style={{ flex:1, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:12, padding:"11px 16px", fontSize:13, color:"#fff", outline:"none", fontFamily:"Nunito", backdropFilter:"blur(10px)" }}
          />
        </div>
      </div>

      {/* Results */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 14px" }}>
        {/* GPS option */}
        <div onClick={()=>onSelect("Current Location")} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.06)", cursor:"pointer" }}>
          <div style={{ width:44, height:44, borderRadius:14, background:"rgba(39,174,96,0.15)", border:"1px solid rgba(39,174,96,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>📍</div>
          <div><div style={{ fontWeight:700, fontSize:13, color:"#fff" }}>Use Current Location</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>GPS • Leh, Ladakh</div></div>
        </div>

        {/* Grouped by zone */}
        {zones.map(zone => {
          const zl = locs.filter(l=>l.zone===zone);
          return (
            <div key={zone}>
              <div style={{ fontSize:9, color:zoneColors[zone]||"rgba(255,255,255,0.35)", letterSpacing:2.5, padding:"14px 0 6px", fontFamily:"Unbounded" }}>{zone.toUpperCase()}</div>
              {zl.map(loc=>(
                <div key={loc.name} onClick={()=>onSelect(loc.name)} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", cursor:"pointer" }}>
                  <div style={{ width:44, height:44, borderRadius:14, overflow:"hidden", flexShrink:0, border:"1px solid rgba(255,255,255,0.1)", position:"relative" }}>
                    <div style={{ position:"absolute", inset:0, backgroundImage:`url(${PHOTOS[loc.photo]})`, backgroundSize:"cover", backgroundPosition:"center" }}/>
                    <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{loc.icon}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, color:"#fff" }}>{loc.name}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Ladakh • {loc.zone} region</div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
