 export function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const DATE_STYLES = {
    long: undefined,
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    compact: { day: 'numeric', month: 'short' }
};

export function formatDate(dateString, style = 'long') {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', DATE_STYLES[style]);
}

export function getTodayAtMidnight() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}