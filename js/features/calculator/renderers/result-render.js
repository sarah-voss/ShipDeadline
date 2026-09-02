import { formatDate } from "../../../utils/date-utils.js";

export function renderResult(result, resultData) {

const { transitData, fiscalDeadline } = resultData;
const { windowStart, lastShippingDate, customsDelay } = transitData;

const calculatedDates = [
    { key: 'safe', date: windowStart },
    { key: 'lastDate', date: lastShippingDate },
    { key: 'deadline', date: fiscalDeadline }
];


calculatedDates.forEach(({ key, date }) => {
    result[key].timelineMarkerDate.textContent = formatDate(date, 'short');
});

calculatedDates.forEach(({ key, date }) => {
    result[key].resultCardDate.textContent = key === 'safe'
    ? `${formatDate(windowStart, 'compact')} - ${formatDate(lastShippingDate, 'compact')}`
    : formatDate(date, 'short');
});

}





