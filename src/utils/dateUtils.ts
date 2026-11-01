/**
 * Date and Time utilities for Arabic & Gregorian calendar formatting and time zones
 */

export interface CityTimeZone {
  id: string;
  nameAr: string;
  nameEn: string;
  timeZone: string;
  country: string;
  flag: string;
}

export const POPULAR_CITIES: CityTimeZone[] = [
  { id: 'mecca', nameAr: 'مكة المكرمة', nameEn: 'Mecca', timeZone: 'Asia/Riyadh', country: 'السعودية', flag: '🇸🇦' },
  { id: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo', timeZone: 'Africa/Cairo', country: 'مصر', flag: '🇪🇬' },
  { id: 'dubai', nameAr: 'دبي', nameEn: 'Dubai', timeZone: 'Asia/Dubai', country: 'الإمارات', flag: '🇦🇪' },
  { id: 'jerusalem', nameAr: 'القدس الشريف', nameEn: 'Jerusalem', timeZone: 'Asia/Hebron', country: 'فلسطين', flag: '🇵🇸' },
  { id: 'baghdad', nameAr: 'بغداد', nameEn: 'Baghdad', timeZone: 'Asia/Baghdad', country: 'العراق', flag: '🇮🇶' },
  { id: 'kuwait', nameAr: 'الكويت', nameEn: 'Kuwait', timeZone: 'Asia/Kuwait', country: 'الكويت', flag: '🇰🇼' },
  { id: 'doha', nameAr: 'الدوحة', nameEn: 'Doha', timeZone: 'Asia/Qatar', country: 'قطر', flag: '🇶🇦' },
  { id: 'muscat', nameAr: 'مسقط', nameEn: 'Muscat', timeZone: 'Asia/Muscat', country: 'عُمان', flag: '🇴🇲' },
  { id: 'casablanca', nameAr: 'الدار البيضاء', nameEn: 'Casablanca', timeZone: 'Africa/Casablanca', country: 'المغرب', flag: '🇲🇦' },
  { id: 'london', nameAr: 'لندن', nameEn: 'London', timeZone: 'Europe/London', country: 'المملكة المتحدة', flag: '🇬🇧' },
  { id: 'paris', nameAr: 'باريس', nameEn: 'Paris', timeZone: 'Europe/Paris', country: 'فرنسا', flag: '🇫🇷' },
  { id: 'istanbul', nameAr: 'إسطنبول', nameEn: 'Istanbul', timeZone: 'Europe/Istanbul', country: 'تركيا', flag: '🇹🇷' },
  { id: 'newyork', nameAr: 'نيويورك', nameEn: 'New York', timeZone: 'America/New_York', country: 'أمريكا', flag: '🇺🇸' },
  { id: 'tokyo', nameAr: 'طوكيو', nameEn: 'Tokyo', timeZone: 'Asia/Tokyo', country: 'اليابان', flag: '🇯🇵' },
  { id: 'sydney', nameAr: 'سيدني', nameEn: 'Sydney', timeZone: 'Australia/Sydney', country: 'أستراليا', flag: '🇦🇺' },
];

// Format Arabic Gregorian Date
export function getArabicGregorianDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Format Hijri Date
export function getArabicHijriDate(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-uma', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }
}

// Arabic greeting based on time of day
export function getArabicGreeting(date: Date = new Date()): { text: string; subtext: string } {
  const hours = date.getHours();
  if (hours >= 5 && hours < 12) {
    return { text: 'صباح الخير', subtext: 'أتمنى لك يوماً جميلاً ومثمراً' };
  } else if (hours >= 12 && hours < 17) {
    return { text: 'مساء الخير', subtext: 'طاب يومك بكل خير وسعادة' };
  } else if (hours >= 17 && hours < 22) {
    return { text: 'مساء النور', subtext: 'أمسية هادئة وممتعة' };
  } else {
    return { text: 'تصبح على خير', subtext: 'طليعة ليلة هادئة ومريحة' };
  }
}

// Format time string for specific timeZone
export function getTimeInZone(timeZone: string, use24Hour: boolean = false, date: Date = new Date()) {
  const formatter = new Intl.DateTimeFormat('ar-EG', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !use24Hour,
  });

  const parts = formatter.formatToParts(date);
  let hour = '00';
  let minute = '00';
  let second = '00';
  let period = '';

  parts.forEach((p) => {
    if (p.type === 'hour') hour = p.value;
    if (p.type === 'minute') minute = p.value;
    if (p.type === 'second') second = p.value;
    if (p.type === 'dayPeriod') period = p.value;
  });

  // Also check if day or night in that zone
  const hourNum = parseInt(
    new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', hour12: false }).format(date),
    10
  );
  const isNight = hourNum < 6 || hourNum >= 18;

  // Calculate offset relative to local time
  const localOffset = date.getTimezoneOffset();
  const tzDateString = date.toLocaleString('en-US', { timeZone });
  const tzDate = new Date(tzDateString);
  const diffHours = Math.round((tzDate.getTime() - date.getTime()) / (1000 * 60 * 60));

  let diffText = '';
  if (diffHours === 0) {
    diffText = 'نفس التوقيت المحلي';
  } else if (diffHours > 0) {
    diffText = `متقدم بـ ${diffHours} ${diffHours === 1 ? 'ساعة' : 'ساعات'}`;
  } else {
    diffText = `متأخر بـ ${Math.abs(diffHours)} ${Math.abs(diffHours) === 1 ? 'ساعة' : 'ساعات'}`;
  }

  return {
    hour,
    minute,
    second,
    period,
    formatted: `${hour}:${minute}:${second} ${period}`,
    isNight,
    diffText,
    rawHour: hourNum,
  };
}
