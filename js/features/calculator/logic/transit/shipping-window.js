function isWeekend(date) {
   const day = date.getDay();
   if (day === 6 || day === 0) return true;
   return false;
}

function rollBackToWorkDay(date) {
    const result = new Date (date);

    while (isWeekend(result)) {
        result.setDate(result.getDate() - 1);
    }

    return result;
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

const MAX_DRIVING_HOURS_PER_DAY = 9;

function calculateTransitDays(totalHours) {
return Math.max(0, Math.ceil(totalHours / MAX_DRIVING_HOURS_PER_DAY) - 1);
}

export function calculateShippingWindow(fiscalDeadline, totalHours) {
    const adjustedDeadline = rollBackToWorkDay(fiscalDeadline);
    const transitDays = calculateTransitDays(totalHours);
    const lastShippingDate = subtractWorkingDays(adjustedDeadline, transitDays);
    const windowStart = subtractWorkingDays(lastShippingDate, 4);

    return { windowStart, lastShippingDate };
}

