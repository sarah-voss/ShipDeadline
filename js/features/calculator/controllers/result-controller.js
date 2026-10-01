import * as state from "../state.js";
import { isSameDay } from "../../../utils/date-utils.js";

import { getFiscalMonth } from '../../fiscal-months/queries.js';

import { getTransitDetails } from "../logic/transit/transit-calculator.js";
import { renderResult, renderDeadlineMatchState } from '../renderers/result-render.js';

import { renderOverviewValues } from "./summary-overview-controller.js";


export function renderResultStep({ elements }) {

    const { result } = elements;

    function getResultData() {

        const { departureCoords, destinationCoords } = state.getSelectedCoordinates();

        const vehiclesArr = state.getSelectedVehicles();

        const departureCountry = state.getSelectedCountryCode('departure');
        
        const destinationCountry = state.getSelectedCountryCode('destination');

        const selectedMonth = state.getSelectedMonth();
        const freshMonth = getFiscalMonth(selectedMonth);
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

    const isDeadlineMatch = isSameDay(transitData.lastShippingDate, transitData.adjustedDeadline);

    renderDeadlineMatchState(elements.calculatorSteps.result, isDeadlineMatch);

    renderResult(result, resultData, isDeadlineMatch);
    renderOverviewValues({ elements, transitData });

}