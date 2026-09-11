import React from "react";

interface ScanningRadarIconProps {
  size?: number;
  className?: string;
}

export function ScanningRadarIcon({
  size = 20,
  className = "",
}: ScanningRadarIconProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none overflow-hidden aspect-square ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        background: "radial-gradient(circle at 50% 50%, #0d4a22 0%, #063016 48%, #031b0c 80%, #010d06 100%)",
        boxShadow: "inset 0 0 4px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(34, 197, 94, 0.5)",
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes radarSweepSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes radarBlipGlow {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }
      `}</style>

      {/* Rotating Scanning Beam (Sweep) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          animation: "radarSweepSpin 2.4s linear infinite",
          transformOrigin: "50% 50%",
        }}
      >
        {/* Sweep Conic Sector - Trailing behind leading beam at 0deg (12 o'clock) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 315deg at 50% 50%, transparent 0deg, rgba(22, 101, 52, 0.08) 10deg, rgba(34, 197, 94, 0.35) 30deg, rgba(74, 222, 128, 0.72) 45deg, transparent 45.5deg, transparent 360deg)",
          }}
        />
        {/* Leading Bright Scan Beam Edge at 12 o'clock */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] h-1/2"
          style={{
            background: "linear-gradient(to top, rgba(74, 222, 128, 0.4), rgba(220, 252, 231, 0.95))",
            boxShadow: "0 0 4px rgba(74, 222, 128, 0.95)",
          }}
        />
      </div>

      {/* Static Concentric Radar Rings, Crosshairs with Ticks, & Glowing Target Blips */}
      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
        fill="none"
        stroke="#22c55e"
        strokeLinecap="round"
      >
        <defs>
          <radialGradient id="blipGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#86efac" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#22c55e" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Concentric rings matching authentic circular scope */}
        <circle cx="50" cy="50" r="14" strokeWidth="1.1" strokeOpacity="0.75" />
        <circle cx="50" cy="50" r="26" strokeWidth="1.1" strokeOpacity="0.75" />
        <circle cx="50" cy="50" r="38" strokeWidth="1.1" strokeOpacity="0.75" />
        <circle cx="50" cy="50" r="47.5" strokeWidth="1.5" strokeOpacity="0.95" />

        {/* Primary Crosshairs */}
        <line x1="2" y1="50" x2="98" y2="50" strokeWidth="1.2" strokeOpacity="0.85" />
        <line x1="50" y1="2" x2="50" y2="98" strokeWidth="1.2" strokeOpacity="0.85" />

        {/* Horizontal Axis Ticks */}
        <line x1="20" y1="48" x2="20" y2="52" strokeWidth="0.9" strokeOpacity="0.75" />
        <line x1="32" y1="48" x2="32" y2="52" strokeWidth="0.9" strokeOpacity="0.75" />
        <line x1="41" y1="48.5" x2="41" y2="51.5" strokeWidth="0.8" strokeOpacity="0.7" />
        <line x1="59" y1="48.5" x2="59" y2="51.5" strokeWidth="0.8" strokeOpacity="0.7" />
        <line x1="68" y1="48" x2="68" y2="52" strokeWidth="0.9" strokeOpacity="0.75" />
        <line x1="80" y1="48" x2="80" y2="52" strokeWidth="0.9" strokeOpacity="0.75" />

        {/* Vertical Axis Ticks */}
        <line x1="48" y1="20" x2="52" y2="20" strokeWidth="0.9" strokeOpacity="0.75" />
        <line x1="48" y1="32" x2="52" y2="32" strokeWidth="0.9" strokeOpacity="0.75" />
        <line x1="48.5" y1="41" x2="51.5" y2="41" strokeWidth="0.8" strokeOpacity="0.7" />
        <line x1="48.5" y1="59" x2="51.5" y2="59" strokeWidth="0.8" strokeOpacity="0.7" />
        <line x1="48" y1="68" x2="52" y2="68" strokeWidth="0.9" strokeOpacity="0.75" />
        <line x1="48" y1="80" x2="52" y2="80" strokeWidth="0.9" strokeOpacity="0.75" />

        {/* Proportional Vector Target Blips with Luminous Halos */}
        {/* Blip 1: Top-Left */}
        <g style={{ animation: "radarBlipGlow 1.8s ease-in-out infinite", transformOrigin: "29px 27px" }}>
          <circle cx="29" cy="27" r="7" fill="url(#blipGlowGrad)" stroke="none" />
          <circle cx="29" cy="27" r="1.8" fill="#ffffff" stroke="none" />
        </g>

        {/* Blip 2: Bottom-Left */}
        <g style={{ animation: "radarBlipGlow 2.1s ease-in-out infinite 0.4s", transformOrigin: "31px 54px" }}>
          <circle cx="31" cy="54" r="7" fill="url(#blipGlowGrad)" stroke="none" />
          <circle cx="31" cy="54" r="1.8" fill="#ffffff" stroke="none" />
        </g>

        {/* Blip 3: Top-Right */}
        <g style={{ animation: "radarBlipGlow 1.9s ease-in-out infinite 0.8s", transformOrigin: "62px 31px" }}>
          <circle cx="62" cy="31" r="7.5" fill="url(#blipGlowGrad)" stroke="none" />
          <circle cx="62" cy="31" r="2" fill="#ffffff" stroke="none" />
        </g>

        {/* Blip 4: Bottom-Right */}
        <g style={{ animation: "radarBlipGlow 2.3s ease-in-out infinite 1.2s", transformOrigin: "73px 78px" }}>
          <circle cx="73" cy="78" r="6" fill="url(#blipGlowGrad)" stroke="none" />
          <circle cx="73" cy="78" r="1.5" fill="#ffffff" stroke="none" />
        </g>
      </svg>
    </div>
  );
}
