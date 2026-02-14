"use client";

import Link from "next/link";

/* Color scheme:
   GLAUCOUS: #59789F | POWDER BLUE: #A9B6C4 | VANILLA: #ECE69D
   MOSS GREEN: #7A9445 | DARK GREEN: #243C2C
*/

const CATEGORIES = [
  { id: "school", emoji: "🎓", label: "School", description: "Grades, coursework, and academic pressures", tint: "rgba(89, 120, 159, 0.2)" },
  { id: "internships", emoji: "💼", label: "Internships", description: "Finding and landing the right opportunity", tint: "rgba(169, 182, 196, 0.25)" },
  { id: "career", emoji: "🧑‍💻", label: "Career / Jobs", description: "Direction, growth, and professional clarity", tint: "rgba(122, 148, 69, 0.2)" },
  { id: "life", emoji: "🌱", label: "Life / Adulting", description: "Life skills, balance, and the in-between", tint: "rgba(236, 230, 157, 0.25)" },
] as const;

const fontStyle = {
  fontFamily: "Futura, Century Gothic, Trebuchet MS, Jost, sans-serif",
};

export default function Home() {
  return (
    <div className="relative min-h-dvh min-h-screen w-full overflow-x-hidden overflow-y-auto">
      {/* Background only - blobs + grain, no text */}
      <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-white" />
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
        <div
          className="absolute -left-[5%] -top-[5%] h-[50%] w-[50%] rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]"
          style={{ background: "#59789F" }}
        />
        <div
          className="absolute -bottom-[8%] -left-[4%] h-[55%] w-[52%] rounded-full blur-[70px] sm:blur-[90px] md:blur-[110px]"
          style={{ background: "#A9B6C4" }}
        />
        <div
          className="absolute -right-[5%] -top-[5%] h-[45%] w-[45%] rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]"
          style={{ background: "#7A9445" }}
        />
        <div
          className="absolute -bottom-[8%] -right-[4%] h-[52%] w-[48%] rounded-full blur-[70px] sm:blur-[90px] md:blur-[110px]"
          style={{ background: "#ECE69D" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[75%] w-[85%] min-w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]"
          style={{
            background:
              "linear-gradient(135deg, #243C2C 0%, #59789F 25%, #A9B6C4 50%, #ECE69D 75%, #7A9445 100%)",
          }}
        />
      </div>

      {/* Overlay - centered content with interactive text + circular orbs */}
      <div className="relative flex min-h-screen flex-col bg-transparent" style={{ zIndex: 10 }}>
        <header className="absolute left-0 right-0 top-0 px-6 pt-6 md:px-12 md:pt-8">
          <span className="text-lg font-semibold text-[#243C2C]" style={fontStyle}>
            Reframe
          </span>
        </header>

        {/* Main content - centered, orbs surrounding the question */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 md:px-12">
          <div className="relative flex min-h-[380px] min-w-[300px] flex-col items-center justify-center sm:min-h-[440px] sm:min-w-[360px] md:min-h-[500px] md:min-w-[420px]">
            {/* Circular orbs - positioned around the center text */}
            <Link
              href={`/decode?category=${CATEGORIES[0].id}`}
              className="group absolute left-0 top-0 flex aspect-square w-[90px] items-center justify-center overflow-hidden rounded-full transition-all duration-300 hover:scale-110 hover:shadow-xl sm:w-[110px] md:left-4 md:top-4 md:w-[130px]"
              style={{
                  background: `linear-gradient(135deg, ${CATEGORIES[0].tint} 0%, rgba(255,255,255,0.5) 100%)`,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "2px solid rgba(89, 120, 159, 0.35)",
                  boxShadow: "0 8px 32px rgba(36, 60, 44, 0.12)",
                }}
              >
                <div className="relative flex flex-col items-center text-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl">{CATEGORIES[0].emoji}</span>
                  <span className="mt-1 text-xs font-semibold text-[#243C2C] sm:text-sm" style={fontStyle}>
                    {CATEGORIES[0].label}
                  </span>
                </div>
              </Link>
            <Link
              href={`/decode?category=${CATEGORIES[1].id}`}
              className="group absolute right-0 top-0 flex aspect-square w-[90px] items-center justify-center overflow-hidden rounded-full transition-all duration-300 hover:scale-110 hover:shadow-xl sm:w-[110px] md:right-4 md:top-4 md:w-[130px]"
                style={{
                  background: `linear-gradient(135deg, ${CATEGORIES[1].tint} 0%, rgba(255,255,255,0.5) 100%)`,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "2px solid rgba(89, 120, 159, 0.35)",
                  boxShadow: "0 8px 32px rgba(36, 60, 44, 0.12)",
                }}
              >
                <div className="relative flex flex-col items-center text-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl">{CATEGORIES[1].emoji}</span>
                  <span className="mt-1 text-xs font-semibold text-[#243C2C] sm:text-sm" style={fontStyle}>
                    {CATEGORIES[1].label}
                  </span>
                </div>
              </Link>
            <Link
              href={`/decode?category=${CATEGORIES[2].id}`}
              className="group absolute bottom-0 left-0 flex aspect-square w-[90px] items-center justify-center overflow-hidden rounded-full transition-all duration-300 hover:scale-110 hover:shadow-xl sm:w-[110px] md:bottom-4 md:left-4 md:w-[130px]"
                style={{
                  background: `linear-gradient(135deg, ${CATEGORIES[2].tint} 0%, rgba(255,255,255,0.5) 100%)`,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "2px solid rgba(89, 120, 159, 0.35)",
                  boxShadow: "0 8px 32px rgba(36, 60, 44, 0.12)",
                }}
              >
                <div className="relative flex flex-col items-center text-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl">{CATEGORIES[2].emoji}</span>
                  <span className="mt-1 text-xs font-semibold text-[#243C2C] sm:text-sm" style={fontStyle}>
                    {CATEGORIES[2].label}
                  </span>
                </div>
              </Link>
            <Link
              href={`/decode?category=${CATEGORIES[3].id}`}
              className="group absolute bottom-0 right-0 flex aspect-square w-[90px] items-center justify-center overflow-hidden rounded-full transition-all duration-300 hover:scale-110 hover:shadow-xl sm:w-[110px] md:bottom-4 md:right-4 md:w-[130px]"
                style={{
                  background: `linear-gradient(135deg, ${CATEGORIES[3].tint} 0%, rgba(255,255,255,0.5) 100%)`,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "2px solid rgba(89, 120, 159, 0.35)",
                  boxShadow: "0 8px 32px rgba(36, 60, 44, 0.12)",
                }}
              >
                <div className="relative flex flex-col items-center text-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl">{CATEGORIES[3].emoji}</span>
                  <span className="mt-1 text-xs font-semibold text-[#243C2C] sm:text-sm" style={fontStyle}>
                    {CATEGORIES[3].label}
                  </span>
                </div>
              </Link>

            {/* Center question - interactive, separate from background, surrounded by orbs */}
            <div className="animate-text-breathe z-10 flex flex-col items-center px-6 py-8 text-center">
              <p
                className="cursor-default font-medium leading-relaxed text-white drop-shadow-lg transition-all hover:drop-shadow-xl"
                style={{ ...fontStyle, fontSize: "clamp(1.5rem, 5vw, 2.75rem)" }}
              >
                what part of
                <br />
                your work life
                <br />
                do <em>you want</em>
                <br />
                to change?
              </p>
            </div>

            {/* CTA + emoji below the orbs */}
            <div className="mt-6 flex flex-col items-center gap-4 sm:mt-8">
              <Link
                href="/decode"
                className="rounded-full px-8 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                style={{
                  ...fontStyle,
                  background: "linear-gradient(135deg, #59789F 0%, #7A9445 100%)",
                  boxShadow: "0 6px 24px rgba(89, 120, 159, 0.45)",
                }}
              >
                Start Reframing
              </Link>
              <div className="flex flex-col items-center gap-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/80" style={fontStyle}>
                  How are you feeling?
                </p>
                <div
                  className="rounded-full px-4 py-2"
                  style={{
                    background: "rgba(255,255,255,0.25)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.4)",
                  }}
                >
                  <span className="flex gap-2 text-lg">
                    <span className="opacity-60">😌</span>
                    <span className="opacity-80">🙂</span>
                    <span>😐</span>
                    <span className="opacity-80">😕</span>
                    <span className="opacity-60">😞</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
