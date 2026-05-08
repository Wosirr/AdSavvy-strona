import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const PINK = "#E6006E";
const TEAL = "#0DE5E6";
const BG   = "#0c0d0f";

function spr(frame: number, from: number, fps: number, cfg = {}) {
  return spring({ frame: frame - from, fps, config: { damping: 12, stiffness: 100, mass: 1, ...cfg } });
}
function fade(frame: number, inA: number, inB: number, outA?: number, outB?: number) {
  const pts = [inA, inB, ...(outA !== undefined ? [outA, outB!] : [])];
  const vals = [0,   1,  ...(outA !== undefined ? [1,    0   ] : [])];
  return interpolate(frame, pts, vals, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// Gwiazdka latająca
const Star: React.FC<{ frame: number; from: number; x: number; y: number; color: string; size: number }> = ({ frame, from, x, y, color, size }) => {
  const p = spr(frame, from, 30, { damping: 6, stiffness: 80 });
  const op = fade(frame, from, from + 6, from + 18, from + 28);
  return (
    <div style={{
      position: "absolute",
      left: x, top: y,
      opacity: op,
      transform: `scale(${interpolate(p, [0, 1], [0, 1.4])}) rotate(${interpolate(p, [0, 1], [0, 360])}deg)`,
      fontSize: size,
      pointerEvents: "none",
    }}>{color}</div>
  );
};

// Dymek
const Bubble: React.FC<{ text: string; color: string; scale: number; opacity: number }> = ({ text, color, scale, opacity }) => (
  <div style={{
    opacity,
    transform: `scale(${scale})`,
    background: `${color}18`,
    border: `2.5px solid ${color}`,
    borderRadius: 24,
    padding: "14px 24px",
    fontSize: 34,
    fontWeight: 800,
    color,
    whiteSpace: "nowrap",
    letterSpacing: "-0.01em",
    boxShadow: `0 0 30px ${color}33`,
    maxWidth: 420,
    textAlign: "center",
  }}>
    {text}
  </div>
);

// Alert notification
const Alert: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => (
  <div style={{
    opacity,
    transform: `scale(${scale})`,
    background: "linear-gradient(135deg, #ff0040, #ff4466)",
    borderRadius: 20,
    padding: "14px 28px",
    display: "flex", alignItems: "center", gap: 12,
    boxShadow: "0 8px 40px rgba(255,0,64,0.6)",
  }}>
    <span style={{ fontSize: 36 }}>🚨</span>
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>ROAS Alert</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>797% 📈</div>
    </div>
  </div>
);

// ── TIMING (300 frames = 10s) ─────────────────────────────────
//  0–30    Logo + "Poznaj ekipę"
// 28–120   Savi spada, ROAS alert, gwiazdki, taniec szaleńczy
// 115–220  Adi wjeżdża, chef's kiss, dymek
// 200–265  Razem + "Twoja konkurencja właśnie płakała."
// 262–300  Logo lockup
// ─────────────────────────────────────────────────────────────

export const MascotsVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Logo góra ────────────────────────────────────────────
  const logoP  = spr(frame, 0, fps);
  const logoOp = fade(frame, 0, 14, 260, 272);

  // ── Tytuł ────────────────────────────────────────────────
  const titleOp = fade(frame, 6, 18, 52, 64);
  const titleP  = spr(frame, 6, fps);

  // ── SAVI ─────────────────────────────────────────────────
  const saviDrop = spr(frame, 28, fps, { damping: 6, stiffness: 130, mass: 1.3 }); // bardzo bouncy
  const saviY    = interpolate(saviDrop, [0, 1], [-700, 0]);
  const saviOp   = fade(frame, 28, 38, 252, 264);
  const saviRotY = interpolate(saviDrop, [0, 1], [-40, 0]);

  // szaleńczy taniec — bardziej dramatyczny
  const dance = frame > 68 && frame < 120
    ? Math.sin((frame - 68) * 0.7) * 22
    : 0;
  const danceRotY = frame > 68 && frame < 120
    ? Math.sin((frame - 68) * 0.5) * 30
    : 0;
  const saviPop = frame > 58 && frame < 72
    ? interpolate(frame, [58, 65, 72], [1, 1.5, 1]) // skacze bardziej
    : 1;

  // screen shake przy lądowaniu
  const shake = frame > 55 && frame < 62
    ? Math.sin((frame - 55) * 3) * 8
    : 0;

  // ROAS Alert
  const alertP  = spr(frame, 72, fps, { damping: 8, stiffness: 200, mass: 0.7 });
  const alertOp = fade(frame, 72, 80, 118, 128);

  // dymek Savi
  const saviBP  = spr(frame, 105, fps, { damping: 8, stiffness: 180 });
  const saviBOp = fade(frame, 105, 115, 168, 180);

  // ── ADI ──────────────────────────────────────────────────
  const adiSlide = spr(frame, 118, fps, { damping: 9, stiffness: 100 });
  const adiX     = interpolate(adiSlide, [0, 1], [700, 0]);
  const adiRotY  = interpolate(adiSlide, [0, 1], [50, 0]);
  const adiOp    = fade(frame, 118, 130, 252, 264);

  // chef's kiss spin
  const adiSpin = frame > 150 && frame < 182
    ? interpolate(frame, [150, 158, 165, 173, 182], [0, -25, 0, 25, 0])
    : 0;
  const adiRotY3D = frame > 150 && frame < 182
    ? interpolate(frame, [150, 158, 165, 173, 182], [0, -35, 0, 35, 0])
    : 0;
  const adiPop = frame > 148 && frame < 158
    ? interpolate(frame, [148, 153, 158], [1, 1.3, 1])
    : 1;

  // dymek Adi
  const adiBP  = spr(frame, 160, fps, { damping: 8, stiffness: 180 });
  const adiBOp = fade(frame, 160, 170, 222, 234);

  // ── RAZEM ────────────────────────────────────────────────
  const togetherOp = fade(frame, 200, 215, 255, 265);
  const togetherP  = spr(frame, 200, fps, { damping: 10, stiffness: 80 });

  // ── LOGO LOCKUP ──────────────────────────────────────────
  const lockOp = fade(frame, 264, 278);
  const lockP  = spr(frame, 264, fps, { damping: 18, stiffness: 80 });
  const lineW  = interpolate(frame, [280, 296], [0, 480], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagOp  = fade(frame, 294, 300);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "'Poppins', sans-serif", overflow: "hidden", transform: `translateX(${shake}px)` }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,700;0,900;1,300&display=swap');`}</style>

      <Audio src={staticFile("music.mp3")} volume={0.75} />

      {/* Glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 70% 40% at 50% 55%, rgba(13,229,230,0.06) 0%, transparent 65%)` }} />

      {/* ── LOGO GÓRA ── */}
      <div style={{
        position: "absolute", top: 90, left: "50%",
        transform: `translateX(-50%) translateY(${interpolate(logoP, [0, 1], [-70, 0])}px)`,
        opacity: logoOp,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <Img src={staticFile("Assety/AdSavvy Logo (2) (1).png")}
          style={{ width: 60, height: 60, objectFit: "contain", mixBlendMode: "screen" }} />
        <span style={{ fontSize: 42, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
          Ad<span style={{
            background: `linear-gradient(90deg, ${PINK}, ${TEAL})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Savvy</span>
        </span>
      </div>

      {/* ── TYTUŁ ── */}
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", paddingTop: 260 }}>
        <div style={{
          opacity: titleOp,
          transform: `translateY(${interpolate(titleP, [0, 1], [-40, 0])}px) scale(${interpolate(titleP, [0, 1], [0.8, 1])})`,
          textAlign: "center", width: "100%", padding: "0 60px",
        }}>
          <div style={{ fontSize: 68, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Poznaj moją ekipę 👋
          </div>
          <div style={{ fontSize: 36, fontWeight: 300, color: "rgba(255,255,255,0.4)", marginTop: 12, fontStyle: "italic" }}>
            (są trochę szaleni)
          </div>
        </div>
      </AbsoluteFill>

      {/* ── GWIAZDKI wybuchające ── */}
      {frame > 57 && frame < 85 && [
        { x: 80,  y: 680, c: "⭐", s: 40, f: 58 },
        { x: 340, y: 620, c: "✨", s: 48, f: 61 },
        { x: 160, y: 750, c: "💥", s: 44, f: 63 },
        { x: 260, y: 590, c: "⭐", s: 36, f: 60 },
        { x: 420, y: 700, c: "✨", s: 52, f: 65 },
        { x: 50,  y: 760, c: "💫", s: 40, f: 67 },
      ].map((s, i) => (
        <Star key={i} frame={frame} from={s.f} x={s.x} y={s.y} color={s.c} size={s.s} />
      ))}

      {/* ── SAVI — lewa kolumna, centrum ekranu w pionie ── */}
      <div style={{
        position: "absolute",
        top: 380,
        left: 40,
        width: 460,
        opacity: saviOp,
        transform: `translateY(${saviY}px)`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
      }}>
        {/* ROAS Alert */}
        <div style={{ transform: `scale(${alertP})`, opacity: alertOp }}>
          <Alert opacity={1} scale={1} />
        </div>

        {/* Savi 3D */}
        <div style={{ perspective: 500 }}>
          <Img src={staticFile("Assety/Savi.png")} style={{
            width: 380, height: 380, objectFit: "contain",
            transform: `rotateY(${saviRotY + danceRotY}deg) rotate(${dance + 6}deg) scale(${saviPop})`,
            filter: "drop-shadow(0 20px 50px rgba(13,229,230,0.6)) drop-shadow(0 4px 10px rgba(0,0,0,0.9))",
          }} />
        </div>

        {/* Dymek Savi — pod robotem */}
        <div style={{ transform: `scale(${saviBP})`, opacity: saviBOp }}>
          <Bubble text='797%? Normalka 😎' color={TEAL} scale={1} opacity={1} />
        </div>
      </div>

      {/* ── ADI — prawa kolumna, niżej o 200px żeby nie stać równo ── */}
      <div style={{
        position: "absolute",
        top: 580,
        right: 40,
        width: 460,
        opacity: adiOp,
        transform: `translateX(${adiX}px)`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
      }}>
        {/* Adi 3D — lustrzany */}
        <div style={{ perspective: 500 }}>
          <Img src={staticFile("Assety/Adi.png")} style={{
            width: 360, height: 360, objectFit: "contain",
            transform: `scaleX(-1) rotateY(${adiRotY + adiRotY3D}deg) rotate(${adiSpin - 6}deg) scale(${adiPop})`,
            filter: "drop-shadow(0 20px 50px rgba(230,0,110,0.6)) drop-shadow(0 4px 10px rgba(0,0,0,0.9))",
          }} />
        </div>

        {/* Dymek Adi — pod robotem */}
        <div style={{ transform: `scale(${adiBP})`, opacity: adiBOp }}>
          <Bubble text='Strona? Gotowa. 🤌' color={PINK} scale={1} opacity={1} />
        </div>
      </div>

      {/* ── RAZEM ── */}
      <div style={{
        position: "absolute", bottom: 260,
        left: 0, right: 0, textAlign: "center",
        opacity: togetherOp,
        transform: `translateY(${interpolate(togetherP, [0, 1], [50, 0])}px) scale(${interpolate(togetherP, [0, 1], [0.8, 1])})`,
        padding: "0 48px",
      }}>
        <div style={{ fontSize: 64, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
          Działamy.{" "}
          <span style={{
            background: `linear-gradient(90deg, ${PINK}, ${TEAL})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Ty zarabiasz.</span>
        </div>
      </div>

      {/* ── LOGO LOCKUP ── */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: lockOp }}>
        <div style={{
          transform: `scale(${interpolate(lockP, [0, 1], [0.6, 1])}) translateY(${interpolate(lockP, [0, 1], [-60, 0])}px)`,
          marginBottom: 22,
        }}>
          <Img src={staticFile("Assety/AdSavvy Logo (2) (1).png")}
            style={{ width: 180, height: 180, objectFit: "contain", mixBlendMode: "screen" }} />
        </div>
        <div style={{ fontSize: 118, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, textAlign: "center" }}>
          <span style={{ color: "#fff" }}>Ad</span>
          <span style={{
            background: `linear-gradient(90deg, ${PINK}, ${TEAL})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Savvy</span>
        </div>
        <div style={{ height: 4, width: lineW, background: `linear-gradient(90deg, ${PINK}, ${TEAL})`, borderRadius: 999, margin: "24px 0 26px" }} />
        <div style={{ opacity: tagOp, textAlign: "center" }}>
          <span style={{ fontSize: 28, fontWeight: 300, color: "rgba(255,255,255,0.5)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Performance Marketing
          </span>
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
