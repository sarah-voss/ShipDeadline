import * as summaryRender from "../renderers/summary-render.js";
import * as state from "../state.js";

import { loadFiscalMonths } from '../../fiscal-months/storage.js';
import { createFiscalMonths, findFiscalMonthById } from '../../fiscal-months/state.js';
import { MONTHS } from '../../fiscal-months/config.js';


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
    const selectedMonth = state.getSelectedMonth(); // { id, year }

    if (!selectedMonth) {
        summaryRender.renderSummaryFiscalMonth(summaryField.monthNameText, summaryField.closingDateText, null, null);
        summaryRender.renderSummarySuccess(summaryField.successIcon, false);
        return;
    }

    const currentMonths = loadFiscalMonths(selectedMonth.year) || createFiscalMonths(MONTHS, selectedMonth.year);
    const freshMonth = findFiscalMonthById(currentMonths, selectedMonth.id);

    summaryRender.renderSummaryFiscalMonth(summaryField.monthNameText, summaryField.closingDateText, freshMonth.label, freshMonth.closingDate);
    summaryRender.renderSummarySuccess(summaryField.successIcon, true);
}


// UPDATE SUMMARY MODE
function updateSummaryMode(elements, scenario) {
    const summaryField = elements.summaryCard.mode;
    const modeText = summaryField.modeText;
    const isConfirmed = state.getCurrentStep() !== 'route';
    const vehiclesDiv = summaryField.vehiclesDiv;
    const vehicles = state.getSelectedVehicles();

    if (!scenario) {
        summaryRender.renderSummaryMode(modeText, false);
        summaryRender.renderSummaryVehicles(vehiclesDiv, vehicles);
        summaryRender.renderSummarySuccess(summaryField.successIcon, false);
        return;
    }

    summaryRender.renderSummaryMode(modeText, scenario);
    summaryRender.renderSummaryVehicles(vehiclesDiv, vehicles);
    summaryRender.renderSummarySuccess(summaryField.successIcon, isConfirmed);
}


export function renderSummaryFromState({ elements, scenario }) {
    updateSummaryLocation(elements, 'departure');
    updateSummaryLocation(elements, 'destination');
    updateSummaryFiscalMonth(elements);
    updateSummaryMode(elements, scenario);
}