import { getTodayAtMidnight } from "../../../utils/date-utils.js";

export function isFiscalMonthSelectable(fiscalMonth) {
    const today = getTodayAtMidnight();

    const currentMonthStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    const fiscalMonthStart = new Date(
        fiscalMonth.year,
        fiscalMonth.month,
        1
    );

    // Current or future fiscal month
    if (fiscalMonthStart >= currentMonthStart) {
        return true;
    }

    const closingDate = new Date(fiscalMonth.closingDate);

    const allowedSpilloverMonth = new Date(
        fiscalMonth.year,
        fiscalMonth.month + 1,
        1
    );

    const closingDateIsInAllowedMonth =
        closingDate.getFullYear() === allowedSpilloverMonth.getFullYear() &&
        closingDate.getMonth() === allowedSpilloverMonth.getMonth();

    const closingDateHasNotPassed =
        closingDate >= today;

    return closingDateIsInAllowedMonth && closingDateHasNotPassed;
}