import * as summaryOverviewRender from "../renderers/summary-overview-render.js";
import * as state from "../state.js";

import { getFiscalMonth } from '../../fiscal-months/queries.js';



// ==== SHARED ====
// Used by both the summary card and the result overview: only the summary has success icons and placeholders

function displayLocationValue(component, locationName) {
    const field = component[locationName];

    const country = state.getSelectedLocation(locationName, 'country');
    const postcode = state.getSelectedLocation(locationName, 'postcode');
    const city = state.getSelectedLocation(locationName, 'city');

    const isComplete = state.isFieldAreaComplete(locationName);

    summaryOverviewRender.renderCountryValue(country, field.countryText);
    summaryOverviewRender.renderLocationValue(city, postcode, field.locationText);

    if (field.successIcon) {
        summaryOverviewRender.renderSummaryValue(field.countryText, country, field.countryText.dataset.placeholder);
        summaryOverviewRender.renderSummarySuccess(field.successIcon, isComplete);
    }
}

function displayFiscalDateValue(field) {
    const selectedMonth = state.getSelectedMonth();

    if (!selectedMonth && field.successIcon) {
        summaryOverviewRender.renderEmptyFiscalDate(field.fiscalMonth, field.closingDate);
        summaryOverviewRender.renderSummarySuccess(field.successIcon, false);
        return;
    }

    const freshMonth = getFiscalMonth(selectedMonth);

    summaryOverviewRender.renderFiscalDateValue(field.fiscalMonth, field.closingDate, freshMonth.label, freshMonth.closingDate);

    if (field.successIcon) {
        summaryOverviewRender.renderSummaryValue(field.fiscalMonth, freshMonth.label);
        summaryOverviewRender.renderSummarySuccess(field.successIcon, true);
    }
}



// ==== SUMMARY ====

function displaySummaryMode(elements, scenario) {
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


export function renderSummaryFromState({ elements, scenario }) {
    displayLocationValue(elements.summaryCard, 'departure');
    displayLocationValue(elements.summaryCard, 'destination');
    displayFiscalDateValue(elements.summaryCard.fiscalDate);
    displaySummaryMode(elements, scenario);
}



// ==== OVERVIEW ====

export function renderOverviewValues({ elements, transitData }) {
    const overview = elements.result.overview;
    displayLocationValue(overview, 'departure');
    displayLocationValue(overview, 'destination');
    displayFiscalDateValue(overview.fiscalDate);
    summaryOverviewRender.renderVehicleValue(overview.vehicle, transitData.slowestVehicleType);
    summaryOverviewRender.renderTransitValue(transitData.drivingHours, overview.transitTime.valueText);
    summaryOverviewRender.renderCustomsValue(transitData.customsDelay, overview.customs);
}
