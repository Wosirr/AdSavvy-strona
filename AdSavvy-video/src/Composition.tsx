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
  return spring({ frame: frame - from, fps, config: { damping: 18, stiffness: 90, mass: 1, ...cfg } });
}
function fade(frame: number, inA: number, inB: number, outA?: number, outB?: number) {
  const pts = [inA, inB, ...(outA !== undefined ? [outA, outB!] : [])];
  const vals = [0,   1,  ...(outA !== undefined ? [1,    0   ] : [])];
  return interpolate(frame, pts, vals, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// ── TIMING (270 frames = 9s) ──────────────────────────────────
//  0–  8  podwójny flash biały
//  5– 80  HOOK: 3 uderzenia (góra / dół / centrum)
// 78–155  Savvy?
// 150–270 Logo lockup (~4s)
// ─────────────────────────────────────────────────────────────

export const AdSavvyIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Flash ────────────────────────────────────────────────
  const flash =
    frame >= 0 && frame < 3 ? 0.95 :
    frame >= 3 && frame < 5 ? 0    :
    frame >= 5 && frame < 7 ? 0.55 : 0;

  // ── Hook line 1: "Twoja agencja" ──
  // wchodzi: 7-16, wychodzi: 28-38
  const h1p  = spr(frame, 7, fps, { damping: 14, stiffness: 140, mass: 0.8 });
  const h1op = fade(frame, 7, 16, 28, 38);

  // ── Hook line 2: "bierze kasę." ──
  // wchodzi: 42-52, wychodzi: 64-74
  const h2p  = spr(frame, 42, fps, { damping: 14, stiffness: 140, mass: 0.8 });
  const h2op = fade(frame, 42, 52, 64, 74);

  // ── Hook line 3: "I milczy." ──
  // wchodzi: 78-88, wychodzi razem z "Czas to zmienić.": 155-167
  const h3op = fade(frame, 78, 88, 155, 167);
  const h3p  = spr(frame, 78, fps, { damping: 20, stiffness: 60 });

  // ── "Czas to zmienić." — pojawia się POD "I milczy." ─────
  const nieuOp = fade(frame, 118, 130, 155, 167);
  const nieuP  = spr(frame, 118, fps, { damping: 18, stiffness: 80 });

  // ── Savvy? — wchodzi po "Czas to zmienić." ───────────────
  const savvyP  = spr(frame, 171, fps, { damping: 10, stiffness: 65, mass: 1.5 });
  const savvyOp = fade(frame, 171, 187, 236, 251);

  // ── Logo lockup ──────────────────────────────────────────
  const lockOp    = fade(frame, 234, 250);
  const lockLogoP = spr(frame, 234, fps, { damping: 20, stiffness: 80 });
  const lineW     = interpolate(frame, [252, 290], [0, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const nameOp    = fade(frame, 250, 265);
  const tagOp     = fade(frame, 288, 304, 318, 330);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "'Poppins', sans-serif", overflow: "hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,700;0,900;1,300&display=swap');`}</style>

      {/* Audio */}
      <Audio src={staticFile("music.mp3")} volume={0.85} />

      {/* Flash */}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash, pointerEvents: "none" }} />

      {/* Glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 80% 50% at 50% 50%, rgba(230,0,110,0.07) 0%, transparent 65%)`,
      }} />

      {/* ── HOOK LINE 1: "Twoja agencja" — centrum ── */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 72px" }}>
        <div style={{
          opacity: h1op,
          transform: `translateY(${interpolate(h1p, [0, 1], [-60, 0])}px)`,
          textAlign: "center", width: "100%",
        }}>
          <span style={{ fontSize: 116, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, display: "block" }}>
            Twoja agencja
          </span>
        </div>
      </AbsoluteFill>

      {/* ── HOOK LINE 2: "bierze kasę." — centrum ── */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 72px" }}>
        <div style={{
          opacity: h2op,
          transform: `translateY(${interpolate(h2p, [0, 1], [-60, 0])}px)`,
          textAlign: "center", width: "100%",
        }}>
          <span style={{ fontSize: 116, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, display: "block" }}>
            <span style={{
              background: `linear-gradient(90deg, ${PINK}, #ff3399)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              bierze kasę.
            </span>
          </span>
        </div>
      </AbsoluteFill>

      {/* ── HOOK LINE 3: "I milczy." + "Czas to zmienić." — centrum ── */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{
          opacity: h3op,
          transform: `translateY(${interpolate(h3p, [0, 1], [-60, 0])}px)`,
          textAlign: "center",
        }}>
          <span style={{
            fontSize: 96, fontWeight: 300, fontStyle: "italic",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "-0.02em",
          }}>
            I milczy.
          </span>
        </div>

        <div style={{
          opacity: nieuOp,
          transform: `translateY(${interpolate(nieuP, [0, 1], [40, 0])}px)`,
          textAlign: "center",
          marginTop: 28,
        }}>
          <span style={{
            fontSize: 72, fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.03em",
          }}>
            Czas to zmienić.
          </span>
        </div>
      </AbsoluteFill>


      {/* ── SAVVY? ── */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{
          opacity: savvyOp,
          transform: `scale(${interpolate(savvyP, [0, 1], [0.5, 1])})`,
          textAlign: "center",
        }}>
          <span style={{
            fontSize: 230, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 0.88,
            background: `linear-gradient(135deg, ${PINK} 0%, ${TEAL} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            display: "block",
          }}>
            Savvy?
          </span>
        </div>
      </AbsoluteFill>

      {/* ── LOGO LOCKUP ── */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: lockOp }}>

        <div style={{
          transform: `scale(${interpolate(lockLogoP, [0, 1], [0.55, 1])}) translateY(${interpolate(lockLogoP, [0, 1], [-80, 0])}px)`,
          marginBottom: 28,
        }}>
          <Img
            src={staticFile("Assety/AdSavvy Logo (2) (1).png")}
            style={{ width: 200, height: 200, objectFit: "contain", mixBlendMode: "screen" }}
          />
        </div>

        <div style={{ opacity: nameOp, textAlign: "center" }}>
          <div style={{ fontSize: 124, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1 }}>
            <span style={{ color: "#fff" }}>Ad</span>
            <span style={{
              background: `linear-gradient(90deg, ${PINK}, ${TEAL})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Savvy</span>
          </div>
        </div>

        <div style={{ height: 4, width: lineW, background: `linear-gradient(90deg, ${PINK}, ${TEAL})`, borderRadius: 999, margin: "28px 0 32px" }} />

        <div style={{ opacity: tagOp, textAlign: "center" }}>
          <span style={{ fontSize: 30, fontWeight: 300, color: "rgba(255,255,255,0.5)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Performance Marketing
          </span>
        </div>

      </AbsoluteFill>

    </AbsoluteFill>
  );
};
