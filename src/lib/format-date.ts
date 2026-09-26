/**
 * Formats a Date or ISO timestamp into Indian Standard Time (IST - Asia/Kolkata)
 * Example: "24 Sep 2026, 08:45 PM IST"
 */
export function formatISTDateTime(dateString: string | Date | undefined | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';

    return (
      new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date) + ' IST'
    );
  } catch {
    return String(dateString);
  }
}

/**
 * Formats date portion only in IST:
 * Example: "24 Sep 2026"
 */
export function formatISTDateOnly(dateString: string | Date | undefined | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return '—';
  }
}

/**
 * Formats time portion only in IST:
 * Example: "08:45 PM IST"
 */
export function formatISTTimeOnly(dateString: string | Date | undefined | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';

    return (
      new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date) + ' IST'
    );
  } catch {
    return '—';
  }
}

// Backwards-compatible alias
export const formatISTDate = formatISTDateTime;
