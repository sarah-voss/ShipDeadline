import * as summaryRender from "../renderers/summary-render.js";
import * as state from "../state.js";


// UPDATE SUMMARY LOCATION
function updateSummaryLocation(elements, locationName) {
    const summaryField = elements.summaryCard[locationName];

    const country = state.getSelectedLocation(locationName, 'country');
    const postcode = state.getSelectedLocation(locationName, 'postcode');
    const city = state.getSelectedLocation(locationName, 'city');

    const isComplete = state.isFieldAreaComplete(locationName);

    summaryRender.renderSummaryCountry(country, summaryField.countryText);
    summaryRender.renderSummaryLocation(city, postcode, summaryField.locationText);
    summaryRender.renderSummarySuccess(summaryField.successIcon, isComplete);
}

// UPDATE SUMMARY FISCAL MONTH
function updateSummaryFiscalMonth(elements) {
    const summaryField = elements.summaryCard.within;
    const selectedMonth = state.getSelectedMonth();
    const monthText = summaryField.monthNameText;
    const dateText = summaryField.closingDateText;

    if (!selectedMonth) {
        summaryRender.renderSummaryFiscalMonth(monthText, dateText, null, null);
        summaryRender.renderSummarySuccess(summaryField.successIcon, false);
        return;
    }

    const chosenMonth = selectedMonth.monthLabel;
    const closingDate = selectedMonth.closingDate;

    summaryRender.renderSummaryFiscalMonth(monthText, dateText, chosenMonth, closingDate);
    summaryRender.renderSummarySuccess(summaryField.successIcon, true);
}

// UPDATE SUMMARY MODE
function updateSummaryMode(elements, scenario) {
    const summaryField = elements.summaryCard.mode;
    const text = summaryField.text;
    const isConfirmed = state.getCurrentStep() !== 'route';

    if (!scenario) {
        summaryRender.renderSummaryMode(text, false);
        summaryRender.renderSummarySuccess(summaryField.successIcon, false);
        return;
    }

    summaryRender.renderSummaryMode(text, scenario);
    summaryRender.renderSummarySuccess(summaryField.successIcon, isConfirmed);
}


export function renderSummaryFromState({ elements, scenario }) {
    updateSummaryLocation(elements, 'departure');
    updateSummaryLocation(elements, 'destination');
    updateSummaryFiscalMonth(elements);
    updateSummaryMode(elements, scenario);
}