// src/utils/date.ts

/** Tidspunkt som "HH:MM", f.eks. "09:00" eller "14:30" */
export type HHMM = `${number}${number}:${number}${number}`;

// Åpningstider
export const WEEKDAY_OPEN = 9;
export const WEEKDAY_CLOSE = 19; // eksklusiv slutt (19:00 siste start er 18:30)
export const SATURDAY_OPEN = 9;
export const SATURDAY_CLOSE = 15; // eksklusiv slutt

/** Er det søndag? */
export function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

/** Generer 30-min slotter fra startHour til endHour (end er eksklusiv). */
export function generateTimeSlots(startHour: number, endHour: number): HHMM[] {
  const slots: HHMM[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    const h = hour.toString().padStart(2, "0");
    slots.push(`${h}:00` as HHMM);
    slots.push(`${h}:30` as HHMM);
  }
  return slots;
}

/** Generer slotter basert på hvilken ukedag en gitt dato er. */
export function generateTimeSlotsForDate(date: Date): HHMM[] {
  const day = date.getDay(); // 0 = søn, 1 = man, ..., 6 = lør
  if (day === 0) return []; // søndag stengt
  if (day === 6) return generateTimeSlots(SATURDAY_OPEN, SATURDAY_CLOSE);
  return generateTimeSlots(WEEKDAY_OPEN, WEEKDAY_CLOSE);
}

/** Filtrer bort opptatte tider (taken) fra alle slots. */
export function excludeTaken(all: HHMM[], taken: string[]): HHMM[] {
  const takenSet = new Set(taken);
  return all.filter((t) => !takenSet.has(t));
}

/** YYYY-MM-DD av en Date (lokalt). */
export function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Hjelper: lag ISO for startAt fra dato-streng og tid-streng. */
export function toStartAtISO(dateStr: string, timeStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const local = new Date(y, m - 1, d, hh, mm, 0);
  return local.toISOString();
}
