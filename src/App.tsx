/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar, ClockTab } from './components/Navbar';
import { DigitalClock } from './components/DigitalClock';
import { AnalogClock } from './components/AnalogClock';
import { WorldClock } from './components/WorldClock';
import { Timer } from './components/Timer';
import { Stopwatch } from './components/Stopwatch';
import { Alarm } from './components/Alarm';
import { SettingsModal, AmbientBg } from './components/SettingsModal';
import { soundSynth } from './utils/audio';
import { LayoutGrid, Clock as ClockIcon, Sliders, Volume2, Moon, Sun } from 'lucide-react';

export default function App() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<ClockTab>('clock');

  // Display Mode inside main clock tab: 'digital' | 'analog' | 'both'
  const [clockMode, setClockMode] = useState<'digital' | 'analog' | 'both'>('digital');

  // Customization & Options
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Settings states
  const [themeColor, setThemeColor] = useState<string>('indigo');
  const [ambientBg, setAmbientBg] = useState<AmbientBg>('midnight');
  const [use24Hour, setUse24Hour] = useState<boolean>(false);
  const [showSeconds, setShowSeconds] = useState<boolean>(true);
  const [showDate, setShowDate] = useState<boolean>(true);
  const [showGreeting, setShowGreeting] = useState<boolean>(true);
  const [tickSoundType, setTickSoundType] = useState<'none' | 'soft' | 'wood' | 'metallic'>('none');
  const [hourlyChime, setHourlyChime] = useState<boolean>(false);

  const prevSecondRef = useRef<number>(new Date().getSeconds());
  const prevHourRef = useRef<number>(new Date().getHours());

  // Master Clock Interval
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(now);

      const sec = now.getSeconds();
      const hour = now.getHours();

      // Trigger tick sound on second change if enabled
      if (sec !== prevSecondRef.current) {
        prevSecondRef.current = sec;
        if (soundEnabled && tickSoundType !== 'none') {
          soundSynth.playTick(tickSoundType);
        }

        // Check hourly chime
        if (hourlyChime && soundEnabled && now.getMinutes() === 0 && sec === 0 && hour !== prevHourRef.current) {
          prevHourRef.current = hour;
          soundSynth.playChime();
        }
      }
    }, 100);

    return () => clearInterval(timer);
  }, [soundEnabled, tickSoundType, hourlyChime]);

  // Sync dark class on HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Compute background class based on ambientBg state & darkMode
  const getBackgroundClass = () => {
    if (!darkMode || ambientBg === 'light') {
      return 'bg-slate-50 text-slate-900';
    }

    switch (ambientBg) {
      case 'oled':
        return 'bg-black text-slate-100';
      case 'sunset':
        return 'bg-gradient-to-br from-slate-950 via-amber-950/30 to-rose-950/50 text-slate-100';
      case 'emerald':
        return 'bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-900 text-slate-100';
      case 'midnight':
      default:
        return 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 text-slate-100';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-['Cairo',sans-serif] transition-colors duration-500 ${getBackgroundClass()}`}>
      
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center">
        
        {/* TAB 1: MAIN CLOCK VIEW */}
        {activeTab === 'clock' && (
          <div className="flex flex-col items-center justify-center my-auto space-y-8 animate-in fade-in duration-300">
            
            {/* Clock Sub-Mode Switcher */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/60 border border-slate-300/50 dark:border-slate-700/50 backdrop-blur-md">
              <button
                onClick={() => setClockMode('digital')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  clockMode === 'digital'
                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                رقمية
              </button>
              <button
                onClick={() => setClockMode('analog')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  clockMode === 'analog'
                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                تناظرية
              </button>
              <button
                onClick={() => setClockMode('both')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  clockMode === 'both'
                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                معاً
              </button>
            </div>

            {/* Displaying Clocks according to sub-mode */}
            {clockMode === 'digital' && (
              <DigitalClock
                date={currentDate}
                use24Hour={use24Hour}
                showSeconds={showSeconds}
                showDate={showDate}
                showGreeting={showGreeting}
                themeColor={themeColor}
              />
            )}

            {clockMode === 'analog' && (
              <div className="flex flex-col items-center space-y-6">
                <AnalogClock date={currentDate} themeColor={themeColor} smoothSeconds={true} />
                {showDate && (
                  <DigitalClock
                    date={currentDate}
                    use24Hour={use24Hour}
                    showSeconds={false}
                    showDate={true}
                    showGreeting={showGreeting}
                    themeColor={themeColor}
                  />
                )}
              </div>
            )}

            {clockMode === 'both' && (
              <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 w-full max-w-5xl py-4">
                <div className="shrink-0">
                  <AnalogClock date={currentDate} themeColor={themeColor} smoothSeconds={true} />
                </div>
                <div className="w-full">
                  <DigitalClock
                    date={currentDate}
                    use24Hour={use24Hour}
                    showSeconds={showSeconds}
                    showDate={showDate}
                    showGreeting={showGreeting}
                    themeColor={themeColor}
                  />
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: WORLD CLOCK */}
        {activeTab === 'world' && (
          <div className="animate-in fade-in duration-300">
            <WorldClock currentDate={currentDate} use24Hour={use24Hour} />
          </div>
        )}

        {/* TAB 3: ALARM */}
        {activeTab === 'alarm' && (
          <div className="animate-in fade-in duration-300">
            <Alarm currentDate={currentDate} soundEnabled={soundEnabled} />
          </div>
        )}

        {/* TAB 4: TIMER */}
        {activeTab === 'timer' && (
          <div className="animate-in fade-in duration-300">
            <Timer soundEnabled={soundEnabled} />
          </div>
        )}

        {/* TAB 5: STOPWATCH */}
        {activeTab === 'stopwatch' && (
          <div className="animate-in fade-in duration-300">
            <Stopwatch />
          </div>
        )}

      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        ambientBg={ambientBg}
        setAmbientBg={setAmbientBg}
        use24Hour={use24Hour}
        setUse24Hour={setUse24Hour}
        showSeconds={showSeconds}
        setShowSeconds={setShowSeconds}
        showDate={showDate}
        setShowDate={setShowDate}
        showGreeting={showGreeting}
        setShowGreeting={setShowGreeting}
        tickSoundType={tickSoundType}
        setTickSoundType={setTickSoundType}
        hourlyChime={hourlyChime}
        setHourlyChime={setHourlyChime}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/50 dark:border-slate-800/40 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            ساعة بسيطة وأنيقة · {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              تخصيص المظهر والصوت
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
