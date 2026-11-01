import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Trophy } from 'lucide-react';

export interface LapItem {
  id: number;
  lapTime: number; // in ms
  overallTime: number; // in ms
}

export const Stopwatch: React.FC = () => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<LapItem[]>([]);

  const lastTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = performance.now();

      const update = () => {
        const now = performance.now();
        const delta = now - (lastTimeRef.current || now);
        lastTimeRef.current = now;

        setElapsedTime((prev) => prev + delta);
        animFrameRef.current = requestAnimationFrame(update);
      };

      animFrameRef.current = requestAnimationFrame(update);
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (!isRunning) return;
    const lastLapOverall = laps.length > 0 ? laps[0].overallTime : 0;
    const currentLapTime = elapsedTime - lastLapOverall;

    const newLap: LapItem = {
      id: laps.length + 1,
      lapTime: currentLapTime,
      overallTime: elapsedTime,
    };

    setLaps((prev) => [newLap, ...prev]);
  };

  // Helper to format ms into 00:00.00
  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;
    const milliseconds = Math.floor((ms % 1000) / 10); // 2 digits

    const pad = (n: number) => n.toString().padStart(2, '0');

    return {
      minutes: pad(minutes),
      seconds: pad(seconds),
      milliseconds: pad(milliseconds),
      fullString: `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`,
    };
  };

  const formattedMain = formatTime(elapsedTime);

  // Find fastest & slowest lap
  let minLapTime = Infinity;
  let maxLapTime = -Infinity;

  if (laps.length > 1) {
    laps.forEach((l) => {
      if (l.lapTime < minLapTime) minLapTime = l.lapTime;
      if (l.lapTime > maxLapTime) maxLapTime = l.lapTime;
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center select-none space-y-6">
      
      {/* Stopwatch Hero Clock Card */}
      <div className="w-full p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl -top-20 -right-20 pointer-events-none" />

        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Flag className="w-4 h-4 text-indigo-500" />
          <span>ساعة الإيقاف</span>
        </div>

        {/* Time Text Display */}
        <div className="font-mono-nums font-bold text-5xl sm:text-7xl md:text-8xl tracking-tight text-slate-900 dark:text-white dir-ltr flex items-baseline">
          <span>{formattedMain.minutes}</span>
          <span className="text-indigo-500 animate-pulse mx-1">:</span>
          <span>{formattedMain.seconds}</span>
          <span className="text-3xl sm:text-4xl text-slate-400 dark:text-slate-500 ml-2">
            .{formattedMain.milliseconds}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-8">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>بدء</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2 hover:scale-105"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>إيقاف</span>
            </button>
          )}

          <button
            onClick={handleLap}
            disabled={!isRunning}
            className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all flex items-center gap-2"
          >
            <Flag className="w-4 h-4" />
            <span>تسجيل دورة</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
            title="إعادة ضبط"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Laps List */}
      {laps.length > 0 && (
        <div className="w-full rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="w-16">الدورة</span>
            <span className="flex-1 text-center">زمن الدورة</span>
            <span className="w-32 text-left font-mono dir-ltr">الوقت الإجمالي</span>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {laps.map((lap) => {
              const isBest = laps.length > 1 && lap.lapTime === minLapTime;
              const isWorst = laps.length > 1 && lap.lapTime === maxLapTime;

              return (
                <div
                  key={lap.id}
                  className={`px-4 py-3 flex items-center justify-between text-sm transition-colors ${
                    isBest
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium'
                      : isWorst
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="w-16 font-semibold text-xs flex items-center gap-1">
                    <span>#{lap.id}</span>
                    {isBest && <Trophy className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>

                  <div className="flex-1 text-center font-mono-nums font-bold dir-ltr">
                    {formatTime(lap.lapTime).fullString}
                    {isBest && <span className="text-[10px] mr-2 text-emerald-500 font-sans">(الأسرع)</span>}
                    {isWorst && <span className="text-[10px] mr-2 text-rose-500 font-sans">(الأبطأ)</span>}
                  </div>

                  <div className="w-32 text-left font-mono-nums text-slate-500 dark:text-slate-400 text-xs dir-ltr">
                    {formatTime(lap.overallTime).fullString}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
