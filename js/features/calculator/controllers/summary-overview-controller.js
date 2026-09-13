import * as summaryOverviewRender from "../renderers/summary-overview-render.js";
import * as state from "../state.js";

import { loadFiscalMonths } from '../../fiscal-months/storage.js';
import { createFiscalMonths, findFiscalMonthById } from '../../fiscal-months/state.js';
import { MONTHS } from '../../fiscal-months/config.js';


// === SHARED ===

// DISPLAY LOCATION VALUE
function displayLocationValue(component, locationName) {
    const field = component[locationName]; 

    const country = state.getSelectedLocation(locationName, 'country');
    const postcode = state.getSelectedLocation(locationName, 'postcode');
    const city = state.getSelectedLocation(locationName, 'city');

    const isComplete = state.isFieldAreaComplete(locationName);

    summaryOverviewRender.renderCountryValue(country, field.countryText); 
    summaryOverviewRender.renderLocationValue(city, postcode, field.locationText);

    if (field.successIcon) {
        const hasCountry = Boolean(country);
        field.countryText.classList.toggle('bold', hasCountry);
        field.countryText.classList.toggle('placeholder', !hasCountry);

        if (!hasCountry) {
            field.countryText.textContent = field.countryText.dataset.placeholder;
        }

        summaryOverviewRender.renderSummarySuccess(field.successIcon, isComplete); 
    }
}


// DISPLAY FISCAL DATE VALUE
function displayFiscalDateValue(elements) {
    const summaryField = elements.summaryCard.fiscalDate; 
    const selectedMonth = state.getSelectedMonth(); 

    if (!selectedMonth) {
        summaryOverviewRender.renderFiscalDateValue(summaryField.monthNameText, summaryField.closingDateText, null, null);
        summaryOverviewRender.renderSummarySuccess(summaryField.successIcon, false);
        return;
    }

    const currentMonths = loadFiscalMonths(selectedMonth.year) || createFiscalMonths(MONTHS, selectedMonth.year);
    const freshMonth = findFiscalMonthById(currentMonths, selectedMonth.id);

    summaryOverviewRender.renderFiscalDateValue(summaryField.fiscalMonth, summaryField.closingDate, freshMonth.label, freshMonth.closingDate);
    summaryOverviewRender.renderSummarySuccess(summaryField.successIcon, true);
}


// UPDATE SUMMARY MODE
function updateSummaryMode(elements, scenario) {
    const summaryField = elements.summaryCard.mode;
    const modeText = summaryField.modeText;
    const isConfirmed = state.getCurrentStep() !== 'route';
    const vehiclesDiv = summaryField.vehiclesDiv;
    const vehicles = state.getSelectedVehicles();

    if (!scenario) {
        summaryOverviewRender.renderSummaryMode(modeText, false);
        summaryOverviewRender.renderSummaryVehicles(vehiclesDiv, vehicles);
        summaryOverviewRender.renderSummarySuccess(summaryField.successIcon, false);
        return;
    }

    summaryOverviewRender.renderSummaryMode(modeText, scenario);
    summaryOverviewRender.renderSummaryVehicles(vehiclesDiv, vehicles);
    summaryOverviewRender.renderSummarySuccess(summaryField.successIcon, isConfirmed);
}


// === SUMMARY ===

export function renderSummaryFromState({ elements, scenario }) {
    displayLocationValue(elements.summaryCard, 'departure');
    displayLocationValue(elements.summaryCard, 'destination');
    displayFiscalDateValue(elements);
    updateSummaryMode(elements, scenario);
}


// === OVERVIEW ===
export function renderOverViewValues({ elements }) {
    displayLocationValue(elements.result.overview, 'departure');
    displayLocationValue(elements.result.overview, 'destination');
}
