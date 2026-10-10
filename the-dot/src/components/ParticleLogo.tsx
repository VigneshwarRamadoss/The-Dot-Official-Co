"use client";

interface Pixel {
  x: number;
  y: number;
  width: number;
  height: number;
}

const PIXELS: Pixel[] = [
  { x: 503.01, y: 143.94, width: 88.98, height: 88.67 },

  { x: 413.17, y: 233.96, width: 88.82, height: 88.45 },
  { x: 503.01, y: 233.96, width: 88.98, height: 88.46 },
  { x: 593.01, y: 233.96, width: 88.86, height: 88.45 },

  { x: 323.74, y: 323.73, width: 88.32, height: 88.32 },
  { x: 413.11, y: 323.73, width: 88.88, height: 88.33 },
  { x: 503.01, y: 323.73, width: 88.98, height: 88.34 },
  { x: 593.01, y: 323.73, width: 88.89, height: 88.34 },
  { x: 682.99, y: 323.74, width: 88.35, height: 88.32 },

  { x: 233.96, y: 413.17, width: 88.4, height: 88.82 },
  { x: 323.73, y: 413.11, width: 88.33, height: 88.88 },
  { x: 413.1, y: 413.1, width: 88.89, height: 88.89 },
  { x: 503.01, y: 413.09, width: 88.98, height: 88.91 },
  { x: 593.01, y: 413.09, width: 88.9, height: 88.91 },
  { x: 682.98, y: 413.1, width: 88.36, height: 88.89 },
  { x: 772.71, y: 413.17, width: 88.34, height: 88.82 },

  { x: 143.96, y: 503.01, width: 88.79, height: 88.98 },
  { x: 233.96, y: 503.01, width: 88.41, height: 88.97 },
  { x: 323.73, y: 503.01, width: 88.34, height: 88.97 },
  { x: 413.1, y: 503.01, width: 88.89, height: 88.97 },
  { x: 503.01, y: 503, width: 88.98, height: 88.98 },
  { x: 593.01, y: 503, width: 88.91, height: 88.98 },
  { x: 682.97, y: 503.01, width: 88.37, height: 88.97 },
  { x: 772.7, y: 503.01, width: 88.35, height: 88.97 },
  { x: 862.31, y: 503.01, width: 88.73, height: 88.98 },

  { x: 233.96, y: 593.02, width: 88.4, height: 88.86 },
  { x: 323.73, y: 593.02, width: 88.34, height: 88.89 },
  { x: 413.1, y: 593.02, width: 88.89, height: 88.89 },
  { x: 503.01, y: 593.02, width: 88.98, height: 88.9 },
  { x: 593.01, y: 593.02, width: 88.9, height: 88.9 },
  { x: 682.97, y: 593.02, width: 88.37, height: 88.89 },
  { x: 772.71, y: 593.02, width: 88.34, height: 88.86 },

  { x: 323.74, y: 682.99, width: 88.32, height: 88.35 },
  { x: 413.1, y: 682.98, width: 88.89, height: 88.36 },
  { x: 503.01, y: 682.97, width: 88.98, height: 88.37 },
  { x: 593.01, y: 682.97, width: 88.89, height: 88.37 },
  { x: 682.99, y: 682.98, width: 88.35, height: 88.37 },

  { x: 413.17, y: 772.68, width: 88.82, height: 88.36 },
  { x: 503.01, y: 772.67, width: 88.98, height: 88.37 },
  { x: 593.01, y: 772.68, width: 88.86, height: 88.36 },

  { x: 503.02, y: 862.47, width: 88.96, height: 88.6 },
];

interface ParticleLogoProps {
  className?: string;
}

export function ParticleLogo({
  className = "",
}: ParticleLogoProps) {
  return (
    <svg
      viewBox="0 0 1095 1095"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      {PIXELS.map((pixel, index) => (
        <rect
          key={`${pixel.x}-${pixel.y}-${index}`}
          data-logo-pixel
          className="preloader-logo-pixel"
          x={pixel.x}
          y={pixel.y}
          width={pixel.width}
          height={pixel.height}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}