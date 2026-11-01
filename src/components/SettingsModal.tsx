import React from 'react';
import { X, Palette, Volume2, Clock, Check } from 'lucide-react';
import { soundSynth } from '../utils/audio';

export type AmbientBg = 'midnight' | 'oled' | 'light' | 'sunset' | 'emerald';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  ambientBg: AmbientBg;
  setAmbientBg: (bg: AmbientBg) => void;
  use24Hour: boolean;
  setUse24Hour: (val: boolean) => void;
  showSeconds: boolean;
  setShowSeconds: (val: boolean) => void;
  showDate: boolean;
  setShowDate: (val: boolean) => void;
  showGreeting: boolean;
  setShowGreeting: (val: boolean) => void;
  tickSoundType: 'none' | 'soft' | 'wood' | 'metallic';
  setTickSoundType: (type: 'none' | 'soft' | 'wood' | 'metallic') => void;
  hourlyChime: boolean;
  setHourlyChime: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  themeColor,
  setThemeColor,
  ambientBg,
  setAmbientBg,
  use24Hour,
  setUse24Hour,
  showSeconds,
  setShowSeconds,
  showDate,
  setShowDate,
  showGreeting,
  setShowGreeting,
  tickSoundType,
  setTickSoundType,
  hourlyChime,
  setHourlyChime,
}) => {
  if (!isOpen) return null;

  const THEMES = [
    { id: 'indigo', label: 'نيلي', colorClass: 'bg-indigo-500' },
    { id: 'emerald', label: 'زمردي', colorClass: 'bg-emerald-500' },
    { id: 'cyan', label: 'سماوي', colorClass: 'bg-cyan-500' },
    { id: 'amber', label: 'كهرماني', colorClass: 'bg-amber-500' },
    { id: 'rose', label: 'وردي', colorClass: 'bg-rose-500' },
    { id: 'white', label: 'أبيض', colorClass: 'bg-slate-200' },
  ];

  const BACKGROUNDS: { id: AmbientBg; label: string; desc: string }[] = [
    { id: 'midnight', label: 'أزرق داكن', desc: 'خلفية هادئة مريحة للعين' },
    { id: 'oled', label: 'أسود شاشة OLED', desc: 'توفير طاقة وأعلى تباين' },
    { id: 'sunset', label: 'غروب دافئ', desc: 'ألوان دافئة مستوحاة من الأفق' },
    { id: 'emerald', label: 'ليلة زمردية', desc: 'خلفية خضراء داكنة وهادئة' },
    { id: 'light', label: 'فاتح مريح', desc: 'خلفية فاتحة أنيقة' },
  ];

  const handleTestTick = (type: 'soft' | 'wood' | 'metallic') => {
    soundSynth.playTick(type);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
            <Palette className="w-5 h-5 text-indigo-500" />
            <span>الإعدادات والتخصيص</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 divide-y divide-slate-100 dark:divide-slate-800/80">
          
          {/* Section 1: Color Theme */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              لون توهج الساعة:
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setThemeColor(theme.id)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    themeColor === theme.id
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50 dark:bg-indigo-950/40'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full ${theme.colorClass} shadow-sm`} />
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {theme.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Ambient Background */}
          <div className="pt-5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              نمط الخلفية المريحة:
            </h4>
            <div className="space-y-2">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setAmbientBg(bg.id)}
                  className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                    ambientBg === bg.id
                      ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {bg.label}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {bg.desc}
                    </div>
                  </div>
                  {ambientBg === bg.id && (
                    <Check className="w-4 h-4 text-indigo-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Time Options */}
          <div className="pt-5 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              خيارات العرض:
            </h4>

            {/* 12h / 24h format */}
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-700 dark:text-slate-300 font-medium">نظام 24 ساعة</span>
              <button
                onClick={() => setUse24Hour(!use24Hour)}
                className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center ${
                  use24Hour ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Show seconds */}
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-700 dark:text-slate-300 font-medium">إظهار الثواني</span>
              <button
                onClick={() => setShowSeconds(!showSeconds)}
                className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center ${
                  showSeconds ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Show date */}
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-700 dark:text-slate-300 font-medium">إظهار التاريخ (ميلادي وهجري)</span>
              <button
                onClick={() => setShowDate(!showDate)}
                className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center ${
                  showDate ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Show greeting */}
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-700 dark:text-slate-300 font-medium">إظهار الترحيب حسب الوقت</span>
              <button
                onClick={() => setShowGreeting(!showGreeting)}
                className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center ${
                  showGreeting ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>

          {/* Section 4: Sound Options */}
          <div className="pt-5 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-indigo-500" />
              <span>صوت تكة الساعة:</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'none', label: 'بدون صوت' },
                { id: 'soft', label: 'تكة هادئة' },
                { id: 'wood', label: 'تكة خشبية' },
                { id: 'metallic', label: 'تكة معدنية' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setTickSoundType(type.id as any);
                    if (type.id !== 'none') handleTestTick(type.id as any);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    tickSoundType === type.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Hourly Chime */}
            <div className="flex items-center justify-between text-xs py-1 pt-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">رنة إشعار عند رأس كل ساعة</span>
              <button
                onClick={() => {
                  setHourlyChime(!hourlyChime);
                  if (!hourlyChime) soundSynth.playChime();
                }}
                className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center ${
                  hourlyChime ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
          >
            تم
          </button>
        </div>

      </div>
    </div>
  );
};
