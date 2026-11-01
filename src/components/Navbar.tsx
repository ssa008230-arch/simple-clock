import React from 'react';
import { Clock, Timer, Flag, Bell, Globe, Maximize2, Minimize2, Sun, Moon, Volume2, VolumeX, Settings } from 'lucide-react';

export type ClockTab = 'clock' | 'world' | 'timer' | 'stopwatch' | 'alarm';

interface NavbarProps {
  activeTab: ClockTab;
  setActiveTab: (tab: ClockTab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  soundEnabled,
  setSoundEnabled,
  isFullscreen,
  toggleFullscreen,
  onOpenSettings,
}) => {
  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display whitespace-nowrap">
            الساعة
          </span>
        </div>

        {/* Zone 2: Navigation Links / Mode Segmented Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('clock')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'clock'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>الساعة</span>
          </button>

          <button
            onClick={() => setActiveTab('world')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'world'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>التوقيت العالمي</span>
          </button>

          <button
            onClick={() => setActiveTab('alarm')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'alarm'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>المنبه</span>
          </button>

          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'timer'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>المؤقت</span>
          </button>

          <button
            onClick={() => setActiveTab('stopwatch')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'stopwatch'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>ساعة الإيقاف</span>
          </button>
        </nav>

        {/* Zone 3: Quick Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            title={soundEnabled ? 'إيقاف الصوت' : 'تفعيل الصوت'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4 opacity-60" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            title={darkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'الخروج من ملء الشاشة' : 'ملء الشاشة'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors hidden sm:flex"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Settings Modal Toggle */}
          <button
            onClick={onOpenSettings}
            title="الإعدادات والتخصيص"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
