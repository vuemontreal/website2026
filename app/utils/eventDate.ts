/**
 * TheMeetHub / Prisma peuvent exposer la date sous plusieurs clés.
 * La vitrine ne doit pas dépendre uniquement de `date`.
 */
export function getEventCalendarDateString(
  e: Record<string, unknown> | null | undefined,
): string | null {
  if (!e) return null
  const candidates = [
    e.date,
    e.startDate,
    e.start_date,
    e.startsAt,
    e.starts_at,
    e.eventDate,
    e.event_date,
    e.scheduledStart,
    e.scheduled_start,
    e.beginAt,
  ]
  for (const v of candidates) {
    if (typeof v === 'string' && v.trim()) return v
    if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString()
  }
  return null
}
