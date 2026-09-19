import { formatDate } from "../../../utils/date-utils.js";

export function renderResult(result, resultData, isDeadlineMatch) {

const { transitData, fiscalDeadline } = resultData;
const { windowStart, lastShippingDate } = transitData;


const calculatedDates = [
    { key: 'safe', date: windowStart },
    { key: 'lastDate', date: lastShippingDate },
    { key: 'deadline', date: fiscalDeadline }
];


calculatedDates.forEach(({ key, date }) => {
    result.dates[key].timelineMarkerDate.textContent = formatDate(date, 'short');
});

calculatedDates.forEach(({ key, date }) => {
    result.dates[key].resultCardDate.textContent = key === 'safe'
    ? `${formatDate(windowStart, 'compact')} - ${formatDate(lastShippingDate, 'compact')}`
    : formatDate(date, 'short');
});

const lastDate = result.dates.lastDate;

if (isDeadlineMatch) {
    lastDate.resultCardDescription.textContent = 'You can still ship on this day';
    lastDate.resultCardNote.textContent = `Estimated transit time: ~${Math.round(transitData.drivingHours)} hours`;
    return;
}

lastDate.resultCardDescription.textContent = 'Last recommended shipping date';

}





