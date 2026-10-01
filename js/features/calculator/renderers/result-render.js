import { formatDate } from "../../../utils/date-utils.js";

// deadline match: shows the extra notes and the simplified timeline (see .result--deadline-match in result.css)
export function renderDeadlineMatchState(resultStep, isDeadlineMatch) {
    resultStep.classList.toggle('result--deadline-match', isDeadlineMatch);
}

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
    lastDate.resultCardNote.textContent = `Estimated transit time: ~${Math.round(transitData.drivingHours)} hr`;
} else {
    lastDate.resultCardDescription.textContent = 'Last recommended shipping date';
}

}





