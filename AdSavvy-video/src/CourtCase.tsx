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
const RED  = "#FF2020";

function spr(frame: number, from: number, fps: number, cfg = {}) {
  return spring({ frame: frame - from, fps, config: { damping: 16, stiffness: 120, mass: 1, ...cfg } });
}
function fade(frame: number, inA: number, inB: number, outA?: number, outB?: number) {
  const pts = [inA, inB, ...(outA !== undefined ? [outA, outB!] : [])];
  const vals = [0,   1,  ...(outA !== undefined ? [1,    0   ] : [])];
  return interpolate(frame, pts, vals, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// ── TIMING ────────────────────────────────────────────────────
// 0–55     Tytuł — GÓRA
// 55–140   Zarzut 1 — z lewej, górna strefa
// 140–225  Zarzut 2 — z prawej, środek
// 225–310  Zarzut 3 — z dołu, dolna strefa
// 310–390  WINNY — pełny ekran
// 390–465  Wyrok — dół
// 465–540  Logo — centrum
// ─────────────────────────────────────────────────────────────

export const CourtCase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Tytuł ─────────────────────────────────────────────────
  const titleOp = fade(frame, 0, 14, 44, 55);
  const titleP  = spr(frame, 0, fps, { damping: 14, stiffness: 80 });

  // ── Zarzut 1 (lewa → prawa, góra) ─────────────────────────
  const z1Op = fade(frame, 55, 70, 128, 140);
  const z1P  = spr(frame, 55, fps);

  // ── Zarzut 2 (prawa → lewa, środek) ───────────────────────
  const z2Op = fade(frame, 140, 155, 213, 225);
  const z2P  = spr(frame, 140, fps);

  // ── Zarzut 3 (dół → góra, dolna strefa) ───────────────────
  const z3Op = fade(frame, 225, 240, 298, 310);
  const z3P  = spr(frame, 225, fps);

  // ── WINNY ─────────────────────────────────────────────────
  const winnyP  = spr(frame, 310, fps, { damping: 7, stiffness: 180, mass: 0.7 });
  const winnyOp = fade(frame, 310, 318, 378, 390);
  const redBg   = frame >= 308 && frame <= 340
    ? interpolate(frame, [308, 316, 340], [0, 0.22, 0.06])
    : frame > 340 && frame < 390 ? 0.06 : 0;

  // ── Wyrok ─────────────────────────────────────────────────
  const wyrokOp = fade(frame, 390, 406);
  const wyrokP  = spr(frame, 390, fps, { damping: 16, stiffness: 90 });

  // ── Logo ──────────────────────────────────────────────────
  const logoOp = fade(frame, 465, 480);
  const logoP  = spr(frame, 465, fps, { damping: 18, stiffness: 80 });
  const lineW  = interpolate(frame, [482, 516], [0, 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagOp  = fade(frame, 514, 530);

  // ── Tło animowane ──────────────────────────────────────────
  // Tytuł:    ciemny granat
  // Zarzut 1: ciemna zieleń
  // Zarzut 2: ciemny fiolet
  // Zarzut 3: ciemna czerwień
  // WINNY:    czerwień
  // Wyrok:    bardzo ciemny
  // Logo:     brand dark
  const bgColor = interpolate(
    frame,
    [0,   55,  140, 225, 308, 390, 465],
    [0,   1,   2,   3,   4,   5,   6  ],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bgColors = [
    "radial-gradient(ellipse 120% 80% at 50% 0%, #0d1a2e 0%, #060c14 60%, #020408 100%)",
    "radial-gradient(ellipse 100% 60% at 20% 30%, #0d2218 0%, #060e0c 60%, #020408 100%)",
    "radial-gradient(ellipse 100% 60% at 80% 50%, #1a0d2e 0%, #0a0614 60%, #020408 100%)",
    "radial-gradient(ellipse 100% 60% at 50% 80%, #2e0d0d 0%, #140606 60%, #020408 100%)",
    "radial-gradient(ellipse 80% 80% at 50% 50%, #3a0808 0%, #1a0303 50%, #080000 100%)",
    "radial-gradient(ellipse 100% 100% at 50% 100%, #0d0d14 0%, #060608 100%)",
    "radial-gradient(ellipse 80% 60% at 50% 50%, #0c0d0f 0%, #060608 100%)",
  ];
  const bgIndex = Math.min(Math.floor(bgColor), bgColors.length - 2);
  const bgProgress = bgColor - bgIndex;

  return (
    <AbsoluteFill style={{ background: bgColors[bgIndex], fontFamily: "'Poppins', sans-serif", overflow: "hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,700;0,800;0,900;1,400&display=swap');`}</style>

      {/* <Audio src={staticFile("music.mp3")} volume={0.65} /> */}

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
      }} />

      {/* Red background glow */}
      <div style={{ position: "absolute", inset: 0, background: RED, opacity: redBg, pointerEvents: "none" }} />

      {/* ── TYTUŁ — zakotwiczony u góry ── */}
      {frame < 60 && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          padding: "140px 72px 0",
          opacity: titleOp,
          transform: `translateY(${interpolate(titleP, [0, 1], [-80, 0])}px)`,
        }}>
          {/* Dekoracyjna linia */}
          <div style={{ height: 2, width: 120, background: RED, marginBottom: 28, borderRadius: 999 }} />

          <div style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>
            ⚖️ Sąd Rejonowy ds. Reklam
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: RED, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
            Sprawa nr 2025/ROAS
          </div>
          <div style={{ fontSize: 72, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            Kampania<br />Reklamowa
          </div>
          <div style={{ fontSize: 32, fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.4)", marginTop: 18 }}>
            oskarżona o przepalenie budżetu
          </div>

          {/* Tło dekoracyjne — ukośne linie */}
          <div style={{
            position: "absolute", bottom: -300, right: -60,
            width: 400, height: 400,
            border: `1px solid rgba(255,255,255,0.04)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }} />
        </div>
      )}

      {/* ── ZARZUT 1 — górna strefa, z lewej ── */}
      {frame >= 55 && frame < 145 && (
        <div style={{
          position: "absolute",
          top: 200,
          left: 0, right: 0,
          padding: "0 64px",
          opacity: z1Op,
          transform: `translateX(${interpolate(z1P, [0, 1], [-120, 0])}px)`,
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: RED, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
            Zarzut I
          </div>
          <div style={{
            background: "linear-gradient(135deg, rgba(255,32,32,0.08), rgba(255,32,32,0.02))",
            border: "1px solid rgba(255,32,32,0.25)",
            borderLeft: `5px solid ${RED}`,
            borderRadius: "0 20px 20px 0",
            padding: "32px 40px",
          }}>
            <div style={{ fontSize: 54, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 16 }}>
              Brak targetowania
            </div>
            <div style={{ fontSize: 32, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>
              „Wszyscy w Polsce,<br />wiek 18–99" to nie jest strategia.
            </div>
          </div>
        </div>
      )}

      {/* ── ZARZUT 2 — środek ekranu, z prawej ── */}
      {frame >= 140 && frame < 230 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 64px" }}>
          <div style={{
            opacity: z2Op,
            transform: `translateX(${interpolate(z2P, [0, 1], [120, 0])}px)`,
            width: "100%",
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: RED, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16, textAlign: "right" }}>
              Zarzut II
            </div>
            <div style={{
              background: "linear-gradient(225deg, rgba(255,32,32,0.08), rgba(255,32,32,0.02))",
              border: "1px solid rgba(255,32,32,0.25)",
              borderRight: `5px solid ${RED}`,
              borderLeft: "none",
              borderRadius: "20px 0 0 20px",
              padding: "32px 40px",
              textAlign: "right",
            }}>
              <div style={{ fontSize: 54, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 16 }}>
                Budżet przepalony
              </div>
              <div style={{ fontSize: 32, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>
                2 000 zł wydane.<br />0 konwersji.<br />847 słów kluczowych.
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── ZARZUT 3 — dolna strefa, z dołu ── */}
      {frame >= 225 && frame < 315 && (
        <div style={{
          position: "absolute",
          bottom: 160,
          left: 0, right: 0,
          padding: "0 64px",
          opacity: z3Op,
          transform: `translateY(${interpolate(z3P, [0, 1], [120, 0])}px)`,
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(255,32,32,0.08), rgba(255,32,32,0.02))",
            border: "1px solid rgba(255,32,32,0.25)",
            borderBottom: `5px solid ${RED}`,
            borderTop: "none",
            borderRadius: "20px 20px 0 0",
            padding: "32px 40px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: RED, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
              Zarzut III
            </div>
            <div style={{ fontSize: 54, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 16 }}>
              Kreacja w PowerPoint
            </div>
            <div style={{ fontSize: 32, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>
              „Bo mamy logo w PNG<br />to wystarczy."
            </div>
          </div>
        </div>
      )}

      {/* ── WINNY — pełny ekran, centrum ── */}
      {frame >= 308 && frame < 395 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{
            opacity: winnyOp,
            transform: `scale(${interpolate(winnyP, [0, 1], [3, 1])}) rotate(${interpolate(winnyP, [0, 1], [-20, -10])}deg)`,
            border: `10px solid ${RED}`,
            padding: "20px 48px",
            borderRadius: 14,
          }}>
            <div style={{
              fontSize: 110, fontWeight: 900, color: RED,
              letterSpacing: "0.2em", textTransform: "uppercase", lineHeight: 1,
            }}>
              WINNY
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── WYROK — dół ── */}
      {frame >= 390 && frame < 470 && (
        <div style={{
          position: "absolute",
          bottom: 180,
          left: 0, right: 0,
          padding: "0 72px",
          opacity: wyrokOp,
          transform: `translateY(${interpolate(wyrokP, [0, 1], [60, 0])}px)`,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 24 }}>
            ⚖️ Wyrok sądu
          </div>
          <div style={{ fontSize: 58, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            Natychmiastowa
            <br />
            <span style={{
              background: `linear-gradient(90deg, ${PINK}, ${TEAL})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              optymalizacja.
            </span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.35)", marginTop: 18 }}>
            wykonana przez specjalistę
          </div>
        </div>
      )}

      {/* ── LOGO — centrum ── */}
      {frame >= 465 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: logoOp }}>
          <div style={{
            transform: `scale(${interpolate(logoP, [0, 1], [0.6, 1])}) translateY(${interpolate(logoP, [0, 1], [-50, 0])}px)`,
            marginBottom: 20,
          }}>
            <Img src={staticFile("Assety/AdSavvy Logo (2) (1).png")}
              style={{ width: 160, height: 160, objectFit: "contain", mixBlendMode: "screen" }} />
          </div>
          <div style={{ fontSize: 110, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, textAlign: "center" }}>
            <span style={{ color: "#fff" }}>Ad</span>
            <span style={{
              background: `linear-gradient(90deg, ${PINK}, ${TEAL})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Savvy</span>
          </div>
          <div style={{ height: 3, width: lineW, background: `linear-gradient(90deg, ${PINK}, ${TEAL})`, borderRadius: 999, margin: "22px 0 20px" }} />
          <div style={{ opacity: tagOp, textAlign: "center" }}>
            <span style={{ fontSize: 26, fontWeight: 300, color: "rgba(255,255,255,0.45)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Performance Marketing
            </span>
          </div>
        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};
