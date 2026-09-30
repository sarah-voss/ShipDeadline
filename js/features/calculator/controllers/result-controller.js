import * as state from "../state.js";

import { MONTHS } from '../../fiscal-months/config.js';
import { loadFiscalMonths } from '../../fiscal-months/storage.js';
import { createFiscalMonths, findFiscalMonthById } from '../../fiscal-months/state.js';

import { getTransitDetails } from "../logic/transit/transit-calculator.js";
import { renderResult } from '../renderers/result-render.js';

import { renderOverviewValues } from "./summary-overview-controller.js";


export function renderResultStep({ elements }) {

    const { result } = elements;

    function getResultData() {

        const { departureCoords, destinationCoords } = state.getSelectedCoordinates();

        const vehiclesArr = state.getSelectedVehicles();

        const departureCountry = state.getSelectedCountryCode('departure');
        
        const destinationCountry = state.getSelectedCountryCode('destination');

        const selectedMonth = state.getSelectedMonth();
        const currentMonths = loadFiscalMonths(selectedMonth.year) || createFiscalMonths(MONTHS, selectedMonth.year);
        const freshMonth = findFiscalMonthById(currentMonths, selectedMonth.id);
        const fiscalDeadline = new Date(freshMonth.closingDate);

        const transitInput = {
            departureCoords,
            destinationCoords,
            vehiclesArr,
            departureCountry,
            destinationCountry,
            fiscalDeadline
        };

        const transitData = getTransitDetails({ transitInput });

        return { transitData, fiscalDeadline };
    }

    const resultData = getResultData();
    const transitData = resultData.transitData;

    function isSameDay(dateA, dateB) {
        return (
            dateA.getFullYear() === dateB.getFullYear() &&
            dateA.getMonth() === dateB.getMonth() &&
            dateA.getDate() === dateB.getDate()
        );
    }

    const isDeadlineMatch = isSameDay(transitData.lastShippingDate, transitData.adjustedDeadline);

    elements.calculatorSteps.result.classList.toggle('result--deadline-match', isDeadlineMatch);

    renderResult(result, resultData, isDeadlineMatch);
    renderOverviewValues({ elements, transitData });

}