import React, { useState } from 'react';
import { POPULAR_CITIES, getTimeInZone, CityTimeZone } from '../utils/dateUtils';
import { Globe, Sun, Moon, Plus, Trash2, Search } from 'lucide-react';

interface WorldClockProps {
  currentDate: Date;
  use24Hour: boolean;
}

export const WorldClock: React.FC<WorldClockProps> = ({ currentDate, use24Hour }) => {
  // Saved cities state (default first 6)
  const [selectedCities, setSelectedCities] = useState<CityTimeZone[]>(
    POPULAR_CITIES.slice(0, 6)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Available cities to add
  const availableToAdd = POPULAR_CITIES.filter(
    (c) => !selectedCities.some((sc) => sc.id === c.id)
  );

  const filteredAvailable = availableToAdd.filter(
    (c) => c.nameAr.includes(searchQuery) || c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addCity = (city: CityTimeZone) => {
    setSelectedCities((prev) => [...prev, city]);
    setIsAdding(false);
    setSearchQuery('');
  };

  const removeCity = (id: string) => {
    setSelectedCities((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <Globe className="w-6 h-6 text-indigo-500" />
            <span>التوقيت العالمي</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            تابع الوقت المباشر والفرق الزمني لأهم عواصم ومدن العالم
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مدينة</span>
        </button>
      </div>

      {/* Add City Drawer / Modal */}
      {isAdding && (
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition-all space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              اختر مدينة لإضافتها:
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              إلغاء
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اسم المدينة أو الدولة..."
              className="w-full pr-9 pl-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Cities Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1">
            {filteredAvailable.map((city) => (
              <button
                key={city.id}
                onClick={() => addCity(city)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-right transition-all flex items-center gap-2 hover:shadow-sm"
              >
                <span className="text-xl">{city.flag}</span>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {city.nameAr}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {city.country}
                  </div>
                </div>
              </button>
            ))}

            {filteredAvailable.length === 0 && (
              <div className="col-span-full py-4 text-center text-xs text-slate-500">
                لم يتم العثور على مدن إضافية مطابقة
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedCities.map((city) => {
          const tzData = getTimeInZone(city.timeZone, use24Hour, currentDate);

          return (
            <div
              key={city.id}
              className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm transition-all duration-300 group overflow-hidden"
            >
              {/* Background Glow Indicator */}
              <div
                className={`absolute -left-10 -bottom-10 w-32 h-32 rounded-full opacity-10 blur-2xl transition-all ${
                  tzData.isNight ? 'bg-indigo-500' : 'bg-amber-400'
                }`}
              />

              <div className="flex items-start justify-between gap-3 relative z-10">
                {/* City Name & Flag */}
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{city.flag}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                      {city.nameAr}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>{city.country}</span>
                      <span>·</span>
                      <span>{tzData.diffText}</span>
                    </div>
                  </div>
                </div>

                {/* Day / Night Icon & Delete Button */}
                <div className="flex items-center gap-1.5">
                  {tzData.isNight ? (
                    <span title="ليل" className="p-1.5 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-900/50">
                      <Moon className="w-4 h-4" />
                    </span>
                  ) : (
                    <span title="نهار" className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      <Sun className="w-4 h-4" />
                    </span>
                  )}

                  {selectedCities.length > 1 && (
                    <button
                      onClick={() => removeCity(city.id)}
                      title="حذف المدينة"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Live Time Display */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-baseline justify-between dir-ltr">
                <div className="font-mono-nums text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {tzData.hour}:{tzData.minute}
                  <span className="text-lg text-slate-400 dark:text-slate-500 ml-1">
                    :{tzData.second}
                  </span>
                </div>

                {!use24Hour && (
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-display">
                    {tzData.period}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
