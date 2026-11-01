import React from 'react';
import { getArabicGregorianDate, getArabicHijriDate, getArabicGreeting } from '../utils/dateUtils';
import { Calendar, Sparkles } from 'lucide-react';

interface DigitalClockProps {
  date: Date;
  use24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  showGreeting: boolean;
  themeColor: string;
}

export const DigitalClock: React.FC<DigitalClockProps> = ({
  date,
  use24Hour,
  showSeconds,
  showDate,
  showGreeting,
  themeColor,
}) => {
  const hoursRaw = date.getHours();
  const minutesRaw = date.getMinutes();
  const secondsRaw = date.getSeconds();

  let hoursDisplay = hoursRaw;
  let period = '';

  if (!use24Hour) {
    period = hoursRaw >= 12 ? 'م' : 'ص';
    hoursDisplay = hoursRaw % 12 || 12;
  }

  const format2Digits = (num: number) => num.toString().padStart(2, '0');

  const hoursStr = format2Digits(hoursDisplay);
  const minutesStr = format2Digits(minutesRaw);
  const secondsStr = format2Digits(secondsRaw);

  const greeting = getArabicGreeting(date);
  const gregorianDate = getArabicGregorianDate(date);
  const hijriDate = getArabicHijriDate(date);

  // Map theme colors to CSS glow classes & text colors
  const getGlowClass = () => {
    switch (themeColor) {
      case 'emerald': return 'glow-text-emerald text-emerald-500 dark:text-emerald-400';
      case 'cyan': return 'glow-text-cyan text-cyan-500 dark:text-cyan-400';
      case 'amber': return 'glow-text-amber text-amber-500 dark:text-amber-400';
      case 'rose': return 'glow-text-rose text-rose-500 dark:text-rose-400';
      case 'white': return 'glow-text-white text-slate-900 dark:text-white';
      case 'indigo':
      default: return 'glow-text-indigo text-indigo-600 dark:text-indigo-400';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center select-none w-full max-w-4xl mx-auto py-2">
      
      {/* Greeting Header */}
      {showGreeting && (
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/70 dark:bg-slate-800/60 border border-slate-300/50 dark:border-slate-700/50 backdrop-blur-md text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>{greeting.text}</span>
          <span className="text-slate-400 dark:text-slate-500">·</span>
          <span className="text-slate-500 dark:text-slate-400">{greeting.subtext}</span>
        </div>
      )}

      {/* Main Digital Clock Display */}
      <div className="flex items-baseline justify-center dir-ltr font-mono-nums tracking-tighter leading-none py-2">
        {/* Hours */}
        <span className={`text-6xl sm:text-8xl md:text-9xl font-bold transition-all duration-300 ${getGlowClass()}`}>
          {hoursStr}
        </span>

        {/* Separator Colon */}
        <span className={`text-5xl sm:text-7xl md:text-8xl font-light mx-1 sm:mx-2 animate-pulse ${getGlowClass()}`}>
          :
        </span>

        {/* Minutes */}
        <span className={`text-6xl sm:text-8xl md:text-9xl font-bold transition-all duration-300 ${getGlowClass()}`}>
          {minutesStr}
        </span>

        {/* Seconds (Optional) */}
        {showSeconds && (
          <>
            <span className={`text-5xl sm:text-7xl md:text-8xl font-light mx-1 sm:mx-2 opacity-70 ${getGlowClass()}`}>
              :
            </span>
            <span className={`text-4xl sm:text-6xl md:text-7xl font-semibold opacity-90 transition-all duration-300 ${getGlowClass()}`}>
              {secondsStr}
            </span>
          </>
        )}

        {/* AM / PM Badge */}
        {!use24Hour && (
          <span className="mr-2 sm:mr-4 text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-600 dark:text-slate-400 font-display">
            {period}
          </span>
        )}
      </div>

      {/* Date Display */}
      {showDate && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>{gregorianDate}</span>
          </div>

          <span className="hidden sm:inline text-slate-400">|</span>

          <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            <span>{hijriDate}</span>
          </div>
        </div>
      )}
    </div>
  );
};
