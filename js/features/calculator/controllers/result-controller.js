import * as calculatorRender from "../renderers/calculator-render.js";
import * as state from "../state.js";

import { MONTHS } from '../../fiscal-months/config.js';
import { loadFiscalMonths } from '../../fiscal-months/storage.js';
import { createFiscalMonths, findFiscalMonthById } from '../../fiscal-months/state.js';

import { getTransitDetails } from "../logic/transit/transit-calculator.js";

export function initResultController() {



    function getResultDetails() {

        const { departureCoords, destinationCoords } = state.getSelectedCoordinates();

        const vehiclesArr = state.getSelectedVehicles();

        const departureCountry = state.getSelectedCountry('departure');
        const destinationCountry = state.getSelectedCountry('destination');

        const selectedMonth = state.getSelectedMonth(); 
        const currentMonths = loadFiscalMonths(selectedMonth.year) || createFiscalMonths(MONTHS, selectedMonth.year);
        const freshMonth = findFiscalMonthById(currentMonths, selectedMonth.id);
        const fiscalDeadline = new Date(freshMonth.closingDate);

        const resultElements = {
            departureCoords, 
            destinationCoords,
            vehiclesArr,
            departureCountry,
            destinationCountry,
            fiscalDeadline
        };

        const details = getTransitDetails({ resultElements });

        return details;
    }

}