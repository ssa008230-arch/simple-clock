import React from 'react';

interface AnalogClockProps {
  date: Date;
  themeColor: string;
  smoothSeconds?: boolean;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({
  date,
  themeColor = 'indigo',
  smoothSeconds = true,
}) => {
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();

  // Smooth continuous rotation or step rotation
  const secAngle = smoothSeconds
    ? (seconds + milliseconds / 1000) * 6
    : seconds * 6;
  const minAngle = (minutes + seconds / 60) * 6;
  const hourAngle = ((hours % 12) + minutes / 60) * 30;

  // Map themeColor to accent hex values
  const getThemeHex = () => {
    switch (themeColor) {
      case 'emerald': return '#10b981';
      case 'cyan': return '#06b6d4';
      case 'amber': return '#f59e0b';
      case 'rose': return '#f43f5e';
      case 'white': return '#ffffff';
      case 'indigo':
      default: return '#6366f1';
    }
  };

  const accentHex = getThemeHex();

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center select-none">
      {/* Outer Dial Glass Shadow Ring */}
      <div className="absolute inset-0 rounded-full bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 shadow-2xl backdrop-blur-md transition-all duration-300" />

      {/* Decorative Glow Ring */}
      <div 
        className="absolute inset-3 rounded-full opacity-20 blur-xl transition-all duration-500"
        style={{ backgroundColor: accentHex }}
      />

      {/* SVG Clock Face */}
      <svg className="w-full h-full p-4 relative z-10" viewBox="0 0 200 200">
        <defs>
          <filter id="hand-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Hour markers & ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isHour = i % 5 === 0;
          const angle = i * 6;
          const rad = (angle - 90) * (Math.PI / 180);
          const rInner = isHour ? 76 : 82;
          const rOuter = 86;

          const x1 = 100 + rInner * Math.cos(rad);
          const y1 = 100 + rInner * Math.sin(rad);
          const x2 = 100 + rOuter * Math.cos(rad);
          const y2 = 100 + rOuter * Math.sin(rad);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={isHour ? 2.5 : 1}
              className={isHour ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400/40 dark:text-slate-700/60'}
            />
          );
        })}

        {/* Number labels (12, 1, 2... 11) */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
          const angle = num * 30;
          const rad = (angle - 90) * (Math.PI / 180);
          const rText = 64;
          const x = 100 + rText * Math.cos(rad);
          const y = 100 + rText * Math.sin(rad);

          return (
            <text
              key={num}
              x={x}
              y={y + 4.5}
              textAnchor="middle"
              className="text-[11px] font-bold fill-slate-700 dark:fill-slate-300 font-mono-nums"
            >
              {num}
            </text>
          );
        })}

        {/* Hour Hand */}
        <line
          x1="100"
          y1="100"
          x2={100 + 42 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
          y2={100 + 42 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          filter="url(#hand-shadow)"
          className="text-slate-900 dark:text-slate-100"
        />

        {/* Minute Hand */}
        <line
          x1="100"
          y1="100"
          x2={100 + 62 * Math.cos(((minAngle - 90) * Math.PI) / 180)}
          y2={100 + 62 * Math.sin(((minAngle - 90) * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#hand-shadow)"
          className="text-slate-800 dark:text-slate-200"
        />

        {/* Second Hand */}
        <line
          x1="100"
          y1="100"
          x2={100 + 72 * Math.cos(((secAngle - 90) * Math.PI) / 180)}
          y2={100 + 72 * Math.sin(((secAngle - 90) * Math.PI) / 180)}
          stroke={accentHex}
          strokeWidth="1.5"
          strokeLinecap="round"
          filter="url(#hand-shadow)"
        />

        {/* Second Hand Tail */}
        <line
          x1="100"
          y1="100"
          x2={100 - 16 * Math.cos(((secAngle - 90) * Math.PI) / 180)}
          y2={100 - 16 * Math.sin(((secAngle - 90) * Math.PI) / 180)}
          stroke={accentHex}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Center Cap */}
        <circle cx="100" cy="100" r="4.5" fill={accentHex} />
        <circle cx="100" cy="100" r="2" className="fill-slate-900 dark:fill-slate-950" />
      </svg>
    </div>
  );
};
