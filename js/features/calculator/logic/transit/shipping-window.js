function isWeekend(date) {
   const day = date.getDay();
   if (day === 6 || day === 0) return true;
   return false;
}

function subtractWorkingDays(date, days) {
    const result = new Date(date);
    let remainingDays = days;

    while (remainingDays > 0) {
        result.setDate(result.getDate() - 1);
        if (!isWeekend(result)) {
            remainingDays--;
        }
    }

    return result;
}

export function calculateShippingWindow(fiscalDeadline, transitDays) {
    const lastShippingDate = subtractWorkingDays(fiscalDeadline, transitDays);
    const windowStart = subtractWorkingDays(lastShippingDate, 4);

    return { windowStart, lastShippingDate };
}

