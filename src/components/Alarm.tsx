import React, { useState, useEffect, useRef } from 'react';
import { Bell, Plus, Trash2, Check, Clock, Volume2, BellOff, RotateCcw } from 'lucide-react';
import { soundSynth } from '../utils/audio';

export interface AlarmItem {
  id: string;
  time: string; // "HH:MM" 24h format
  title: string;
  enabled: boolean;
  days: string[]; // ['sun', 'mon', ...] or ['daily']
}

interface AlarmProps {
  currentDate: Date;
  soundEnabled: boolean;
}

export const Alarm: React.FC<AlarmProps> = ({ currentDate, soundEnabled }) => {
  // Saved alarms state
  const [alarms, setAlarms] = useState<AlarmItem[]>([
    { id: '1', time: '06:30', title: 'الاستيقاظ وصلاة الفجر', enabled: true, days: ['daily'] },
    { id: '2', time: '13:00', title: 'تذكير صلاة الظهر', enabled: false, days: ['daily'] },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTime, setNewTime] = useState('07:00');
  const [newTitle, setNewTitle] = useState('منبه جديد');
  const [newDaysType, setNewDaysType] = useState<'daily' | 'weekdays' | 'weekend' | 'once'>('daily');

  // Triggered alarm state
  const [activeTriggeredAlarm, setActiveTriggeredAlarm] = useState<AlarmItem | null>(null);
  const stopAudioRef = useRef<(() => void) | null>(null);
  const lastTriggeredMinRef = useRef<string>('');

  // Check current time against enabled alarms
  useEffect(() => {
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const currentHM = `${hours}:${minutes}`;

    if (currentHM === lastTriggeredMinRef.current) return;

    const matched = alarms.find((a) => a.enabled && a.time === currentHM);
    if (matched) {
      lastTriggeredMinRef.current = currentHM;
      setActiveTriggeredAlarm(matched);

      if (soundEnabled) {
        stopAudioRef.current = soundSynth.playAlarmPattern();
      }
    }
  }, [currentDate, alarms, soundEnabled]);

  const handleDismissAlarm = () => {
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
    }
    setActiveTriggeredAlarm(null);
  };

  const handleSnoozeAlarm = () => {
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
    }
    // Add 5 minutes snooze
    const [h, m] = (activeTriggeredAlarm?.time || '07:00').split(':').map(Number);
    const snoozeDate = new Date();
    snoozeDate.setHours(h);
    snoozeDate.setMinutes(m + 5);

    const snoozeH = snoozeDate.getHours().toString().padStart(2, '0');
    const snoozeM = snoozeDate.getMinutes().toString().padStart(2, '0');

    const snoozedItem: AlarmItem = {
      id: Date.now().toString(),
      time: `${snoozeH}:${snoozeM}`,
      title: `غفوة: ${activeTriggeredAlarm?.title || 'منبه'}`,
      enabled: true,
      days: ['once'],
    };

    setAlarms((prev) => [...prev, snoozedItem]);
    setActiveTriggeredAlarm(null);
  };

  const toggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const deleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    const item: AlarmItem = {
      id: Date.now().toString(),
      time: newTime,
      title: newTitle || 'منبه',
      enabled: true,
      days: [newDaysType],
    };
    setAlarms((prev) => [...prev, item]);
    setIsModalOpen(false);
    setNewTitle('منبه جديد');
  };

  const getDaysLabel = (days: string[]) => {
    if (days.includes('daily')) return 'يومياً';
    if (days.includes('weekdays')) return 'أيام العمل';
    if (days.includes('weekend')) return 'عطلة نهاية الأسبوع';
    return 'مرة واحدة';
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* Triggered Active Alarm Modal */}
      {activeTriggeredAlarm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />

            <div className="w-20 h-20 mx-auto rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 animate-bounce">
              <Bell className="w-10 h-10" />
            </div>

            <div>
              <div className="font-mono-nums font-extrabold text-5xl text-white tracking-tight">
                {activeTriggeredAlarm.time}
              </div>
              <h3 className="text-xl font-bold text-slate-100 mt-2 font-display">
                {activeTriggeredAlarm.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                حان وقت المنبه الخاص بك!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleSnoozeAlarm}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>غفوة (5 دقائق)</span>
              </button>

              <button
                onClick={handleDismissAlarm}
                className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-1.5"
              >
                <BellOff className="w-4 h-4" />
                <span>إيقاف المنبه</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <Bell className="w-6 h-6 text-indigo-500" />
            <span>المنبهات</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            اضبط تذكيراتك اليومية ومواعيد الاستيقاظ بكل سهولة
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منبه</span>
        </button>
      </div>

      {/* Add Alarm Form Drawer */}
      {isModalOpen && (
        <form
          onSubmit={handleCreateAlarm}
          className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              ضبط منبه جديد:
            </h3>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Time input */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                الوقت:
              </label>
              <input
                type="time"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-nums font-bold text-lg"
              />
            </div>

            {/* Title input */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                اسم المنبه:
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثلاً: صلاة الفجر، اجتماع العمل..."
                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Repeat options */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              التكرار:
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'daily', label: 'يومياً' },
                { id: 'weekdays', label: 'أيام العمل' },
                { id: 'weekend', label: 'عطلة نهاية الأسبوع' },
                { id: 'once', label: 'مرة واحدة' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setNewDaysType(opt.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    newDaysType === opt.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md"
            >
              حفظ المنبه
            </button>
          </div>
        </form>
      )}

      {/* Alarms List */}
      <div className="space-y-3">
        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
              alarm.enabled
                ? 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/40 opacity-60'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Time */}
              <div className="font-mono-nums font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight dir-ltr">
                {alarm.time}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base font-display">
                  {alarm.title}
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {getDaysLabel(alarm.days)}
                </div>
              </div>
            </div>

            {/* Toggle switch & Delete */}
            <div className="flex items-center gap-3">
              {/* Toggle switch button */}
              <button
                onClick={() => toggleAlarm(alarm.id)}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 flex items-center ${
                  alarm.enabled ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md" />
              </button>

              <button
                onClick={() => deleteAlarm(alarm.id)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                title="حذف المنبه"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {alarms.length === 0 && (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
            لا يوجد منبهات مضافة حالياً. اضغط على "إضافة منبه" للبدء.
          </div>
        )}
      </div>

    </div>
  );
};
