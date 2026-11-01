import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, BellRing, Timer as TimerIcon } from 'lucide-react';
import { soundSynth } from '../utils/audio';

interface TimerProps {
  soundEnabled: boolean;
}

export const Timer: React.FC<TimerProps> = ({ soundEnabled }) => {
  // Total initial seconds set by user
  const [totalSeconds, setTotalSeconds] = useState<number>(300); // Default 5 mins
  // Remaining seconds
  const [remainingSeconds, setRemainingSeconds] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Custom inputs
  const [customHours, setCustomHours] = useState<number>(0);
  const [customMinutes, setCustomMinutes] = useState<number>(5);
  const [customSeconds, setCustomSeconds] = useState<number>(0);

  const stopAlarmRef = useRef<(() => void) | null>(null);

  // Interval timer
  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && remainingSeconds > 0) {
      interval = window.setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && remainingSeconds === 0) {
      setIsRunning(false);
      setIsFinished(true);
      if (soundEnabled) {
        stopAlarmRef.current = soundSynth.playAlarmPattern();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds, soundEnabled]);

  const handleStart = () => {
    if (remainingSeconds === 0) return;
    setIsRunning(true);
    setIsFinished(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    if (stopAlarmRef.current) {
      stopAlarmRef.current();
      stopAlarmRef.current = null;
    }
    setRemainingSeconds(totalSeconds);
  };

  const handleSetPreset = (minutes: number) => {
    const secs = minutes * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setIsRunning(false);
    setIsFinished(false);
    if (stopAlarmRef.current) {
      stopAlarmRef.current();
      stopAlarmRef.current = null;
    }
    setCustomHours(Math.floor(minutes / 60));
    setCustomMinutes(minutes % 60);
    setCustomSeconds(0);
  };

  const handleApplyCustomTime = () => {
    const secs = customHours * 3600 + customMinutes * 60 + customSeconds;
    if (secs <= 0) return;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setIsRunning(false);
    setIsFinished(false);
    if (stopAlarmRef.current) {
      stopAlarmRef.current();
      stopAlarmRef.current = null;
    }
  };

  const handleAddMinute = () => {
    setTotalSeconds((prev) => prev + 60);
    setRemainingSeconds((prev) => prev + 60);
  };

  // Time breakdown
  const hours = Math.floor(remainingSeconds / 3600);
  const mins = Math.floor((remainingSeconds % 3600) / 60);
  const secs = remainingSeconds % 60;

  const format2 = (n: number) => n.toString().padStart(2, '0');

  // SVG Progress calculation
  const progressPercent = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;
  const strokeDashoffset = 502.65 - (502.65 * progressPercent) / 100;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center select-none space-y-6">
      
      {/* Alarm finished banner */}
      {isFinished && (
        <div className="w-full p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <BellRing className="w-6 h-6 animate-spin" />
            <div>
              <div className="font-bold text-base">انتهى الوقت!</div>
              <div className="text-xs opacity-80">المؤقت الذي قمت بضبطه اكتمل الآن.</div>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md"
          >
            إيقاف والتكرار
          </button>
        </div>
      )}

      {/* Quick Presets Chips */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {[
          { label: '1 دقيقة', mins: 1 },
          { label: '3 دقائق', mins: 3 },
          { label: '5 دقائق', mins: 5 },
          { label: '10 دقائق', mins: 10 },
          { label: '25 دقيقة (بومودورو)', mins: 25 },
          { label: '60 دقيقة', mins: 60 },
        ].map((preset) => (
          <button
            key={preset.mins}
            onClick={() => handleSetPreset(preset.mins)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              totalSeconds === preset.mins * 60 && !isRunning
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Circle Countdown Display */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
          {/* Track Circle */}
          <circle
            cx="90"
            cy="90"
            r="80"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-200 dark:text-slate-800"
          />
          {/* Progress Circle */}
          <circle
            cx="90"
            cy="90"
            r="80"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray="502.65"
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-linear ${
              isFinished ? 'text-rose-500' : 'text-indigo-600 dark:text-indigo-400'
            }`}
          />
        </svg>

        {/* Center Time Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="font-mono-nums font-bold text-4xl sm:text-5xl tracking-tight text-slate-900 dark:text-white dir-ltr">
            {hours > 0 ? `${format2(hours)}:` : ''}
            {format2(mins)}:{format2(secs)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1 font-medium">
            <TimerIcon className="w-3.5 h-3.5" />
            <span>المؤقت</span>
          </div>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={remainingSeconds === 0}
            className="w-16 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
            title="بدء"
          >
            <Play className="w-7 h-7 ml-0.5 fill-current" />
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="w-16 h-16 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
            title="إيقاف مؤقت"
          >
            <Pause className="w-7 h-7 fill-current" />
          </button>
        )}

        <button
          onClick={handleReset}
          className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all"
          title="إعادة ضبط"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {isRunning && (
          <button
            onClick={handleAddMinute}
            className="px-3 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
            title="إضافة دقيقة"
          >
            <Plus className="w-4 h-4" />
            <span>1 دقيقة</span>
          </button>
        )}
      </div>

      {/* Custom Time Picker */}
      <div className="w-full p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-center">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
          تخصيص الوقت:
        </h4>

        <div className="flex items-center justify-center gap-3">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 mb-1">ساعات</span>
            <input
              type="number"
              min="0"
              max="24"
              value={customHours}
              onChange={(e) => setCustomHours(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 text-center py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono-nums font-bold text-slate-900 dark:text-white text-sm"
            />
          </div>

          <span className="font-bold text-slate-400 self-end pb-2">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 mb-1">دقائق</span>
            <input
              type="number"
              min="0"
              max="59"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 text-center py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono-nums font-bold text-slate-900 dark:text-white text-sm"
            />
          </div>

          <span className="font-bold text-slate-400 self-end pb-2">:</span>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 mb-1">ثواني</span>
            <input
              type="number"
              min="0"
              max="59"
              value={customSeconds}
              onChange={(e) => setCustomSeconds(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 text-center py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono-nums font-bold text-slate-900 dark:text-white text-sm"
            />
          </div>

          <button
            onClick={handleApplyCustomTime}
            className="self-end px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-all shadow-sm"
          >
            تطبيق
          </button>
        </div>
      </div>

    </div>
  );
};
