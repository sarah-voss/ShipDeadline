 export function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// HTML date inputs represent local calendar days, not UTC instants.
export function parseCalendarDate(value) {
    if (value instanceof Date) return new Date(value);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) throw new RangeError('Expected a date in YYYY-MM-DD format');
    const [, year, month, day] = match.map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        throw new RangeError('Invalid calendar date');
    }
    return date;
}

const DATE_STYLES = {
    long: undefined,
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    compact: { day: 'numeric', month: 'short' }
};

export function formatDate(dateString, style = 'long') {
    const date = parseCalendarDate(dateString);
    return date.toLocaleDateString('en-GB', DATE_STYLES[style]);
}

export function getTodayAtMidnight() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

export function isSameDay(dateA, dateB) {
    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
    );
}