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
  return spring({ frame: frame - from, fps, config: { damping: 16, stiffness: 120, mass: 1, ...cfg } });
}
function fade(frame: number, inA: number, inB: number, outA?: number, outB?: number) {
  const pts = [inA, inB, ...(outA !== undefined ? [outA, outB!] : [])];
  const vals = [0,   1,  ...(outA !== undefined ? [1,    0   ] : [])];
  return interpolate(frame, pts, vals, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

const pairs = [
  {
    clientEmoji: "😤",
    client: ["Reklamy nie działają,", "wyrzucam kasę."],
    meEmoji: "🐧",
    me: ["Targeting ustawiony", "na całą Polskę", "razem z Antarktydą."],
  },
  {
    clientEmoji: "💸",
    client: ["Potrzebujemy", "większego budżetu."],
    meEmoji: "🎯",
    me: ["Macie 847 słów kluczowych.", "Potrzebujecie 12."],
  },
  {
    clientEmoji: "😡",
    client: ["Konkurencja ma", "tańsze kliknięcia!"],
    meEmoji: "🤷",
    me: ["Bo konkurencja", "nie ma konwersji."],
  },
  {
    clientEmoji: "📉",
    client: ["Wyniki są słabe", "w tym miesiącu..."],
    meEmoji: "🙃",
    me: ["Zmieniłeś stronę", "w środku kampanii."],
  },
];

// Każda para: 90 klatek = 3s
// Intro: 40 klatek
// Outro: 90 klatek
// Łącznie: 40 + 4*90 + 90 = 490 klatek ~ 16s

const PAIR_DURATION = 90;
const INTRO_FRAMES = 40;
const outroStart = INTRO_FRAMES + pairs.length * PAIR_DURATION;

const Panel: React.FC<{
  side: "left" | "right";
  label: string;
  emoji: string;
  lines: string[];
  color: string;
  frame: number;
  startFrame: number;
}> = ({ side, label, emoji, lines, color, frame, startFrame }) => {
  const p   = spr(frame, startFrame, 30, { damping: 14, stiffness: 100 });
  const op  = fade(frame, startFrame, startFrame + 12, startFrame + 78, startFrame + 88);
  const slideX = interpolate(p, [0, 1], [side === "left" ? -100 : 100, 0]);

  return (
    <div style={{
      position: "absolute",
      top: 0, bottom: 0,
      [side]: 0,
      width: "50%",
      background: side === "left"
        ? `linear-gradient(160deg, rgba(230,0,110,0.12) 0%, ${BG} 55%)`
        : `linear-gradient(200deg, rgba(13,229,230,0.12) 0%, ${BG} 55%)`,
      borderRight: side === "left" ? `1px solid rgba(255,255,255,0.07)` : "none",
      opacity: op,
      transform: `translateX(${slideX}px)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 32px",
      gap: 20,
    }}>
      {/* Label chip */}
      <div style={{
        position: "absolute", top: 160,
        background: `${color}20`,
        border: `2px solid ${color}`,
        borderRadius: 14,
        padding: "10px 24px",
        fontSize: 26,
        fontWeight: 800,
        color,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}>
        {label}
      </div>

      {/* Big emoji */}
      <div style={{ fontSize: 120, lineHeight: 1, marginBottom: 8 }}>
        {emoji}
      </div>

      {/* Lines */}
      <div style={{ textAlign: "center" }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            fontSize: i === 0 ? 38 : 42,
            fontWeight: i === 0 ? 400 : 800,
            color: i === 0 ? "rgba(255,255,255,0.6)" : "#fff",
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
          }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ClientVsMe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introOp = fade(frame, 0, 14, 28, 40);
  const introP  = spr(frame, 0, fps, { damping: 14, stiffness: 90 });

  const pairIndex = Math.min(
    Math.floor((Math.max(0, frame - INTRO_FRAMES)) / PAIR_DURATION),
    pairs.length - 1
  );
  const pairStart  = INTRO_FRAMES + pairIndex * PAIR_DURATION;
  const activePair = pairs[pairIndex];
  const inPairs    = frame >= INTRO_FRAMES && frame < outroStart;
  const inOutro    = frame >= outroStart;

  const outroOp  = fade(frame, outroStart, outroStart + 18);
  const outroP   = spr(frame, outroStart, fps, { damping: 16, stiffness: 80 });
  const lineW    = interpolate(frame, [outroStart + 22, outroStart + 55], [0, 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoOp   = fade(frame, outroStart + 52, outroStart + 68);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "'Poppins', sans-serif", overflow: "hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,700;0,800;0,900;1,400&display=swap');`}</style>

      <Audio src={staticFile("music.mp3")} volume={0.7} />

      {/* ── INTRO ── */}
      {frame < INTRO_FRAMES + 10 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
          <div style={{
            opacity: introOp,
            transform: `scale(${interpolate(introP, [0, 1], [0.75, 1])})`,
            textAlign: "center", padding: "0 72px",
          }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
              Klient
              <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 300 }}> vs </span>
              Ja
            </div>
            <div style={{ fontSize: 28, fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.35)", marginTop: 14 }}>
              dwie wersje tej samej historii
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── DIVIDER + VS ── */}
      {inPairs && (
        <>
          <div style={{
            position: "absolute", top: 0, bottom: 0,
            left: "50%", width: 1,
            background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.12) 25%, rgba(255,255,255,0.12) 75%, transparent)",
            transform: "translateX(-50%)",
            zIndex: 10,
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 20,
            width: 60, height: 60, borderRadius: "50%",
            background: BG,
            border: "1.5px solid rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 900, color: "rgba(255,255,255,0.4)",
          }}>
            VS
          </div>
        </>
      )}

      {/* ── PAIRS ── */}
      {inPairs && activePair && (
        <>
          <Panel side="left"  label="Klient" emoji={activePair.clientEmoji} lines={activePair.client} color={PINK} frame={frame} startFrame={pairStart} />
          <Panel side="right" label="Ja"     emoji={activePair.meEmoji}    lines={activePair.me}     color={TEAL} frame={frame} startFrame={pairStart + 10} />
        </>
      )}

      {/* ── OUTRO ── */}
      {inOutro && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: outroOp }}>

          <div style={{
            textAlign: "center", padding: "0 72px",
            transform: `translateY(${interpolate(outroP, [0, 1], [50, 0])}px)`,
          }}>
            <div style={{ fontSize: 50, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.25 }}>
              Dlatego gadamy{" "}
              <span style={{
                background: `linear-gradient(90deg, ${PINK}, ${TEAL})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>zanim</span>
              <br />cokolwiek zmienisz.
            </div>
          </div>

          <div style={{ height: 3, width: lineW, background: `linear-gradient(90deg, ${PINK}, ${TEAL})`, borderRadius: 999, margin: "32px 0 28px" }} />

          <div style={{ opacity: logoOp, display: "flex", alignItems: "center", gap: 14 }}>
            <Img src={staticFile("Assety/AdSavvy Logo (2) (1).png")}
              style={{ width: 56, height: 56, objectFit: "contain", mixBlendMode: "screen" }} />
            <span style={{ fontSize: 46, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
              Ad<span style={{
                background: `linear-gradient(90deg, ${PINK}, ${TEAL})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Savvy</span>
            </span>
          </div>

        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};
