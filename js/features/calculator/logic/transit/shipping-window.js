function isWeekend(date) {
   const day = date.getDay();
   if (day === 6 || day === 0) return true;
   return false;
}

// A deadline on a weekend moves back to the previous Friday
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

// EU limit for a truck driver's daily driving time
const MAX_DRIVING_HOURS_PER_DAY = 9;
// Up to this length, a shipment can leave and arrive on the same working day
const SAME_DAY_MAX_HOURS = 8;

function calculateTransitDays(totalHours) {

    if (totalHours <= SAME_DAY_MAX_HOURS) {
        return 0;
    }

// The shipping day itself counts as the first transit day
return Math.max(1, Math.ceil(totalHours / MAX_DRIVING_HOURS_PER_DAY) - 1);
}

export function calculateShippingWindow(fiscalDeadline, totalHours) {
    const adjustedDeadline = rollBackToWorkDay(fiscalDeadline);
    const transitDays = calculateTransitDays(totalHours);
    const lastShippingDate = subtractWorkingDays(adjustedDeadline, transitDays);
    // Recommended buffer of working days before the last shipping date
    const SAFE_WINDOW_DAYS = 4;
    const windowStart = subtractWorkingDays(lastShippingDate, SAFE_WINDOW_DAYS);

    return { windowStart, lastShippingDate, adjustedDeadline };
}

