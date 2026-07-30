import * as state from '../../state.js'
import { calculateDistance } from './distance-source.js';
import { VEHICLE_CONFIG } from './vehicle-speed.js';
import { getCustomsDelayHours } from './customs-rules.js';
import { calculateShippingWindow } from './shipping-window.js';

import { MONTHS } from '../../../fiscal-months/config.js';
import { loadFiscalMonths } from '../../../fiscal-months/storage.js';
import { createFiscalMonths, findFiscalMonthById } from '../../../fiscal-months/state.js';



export function getTransitHours() {
    const { departureCoords, destinationCoords } = state.getSelectedCoordinates();
    const distanceKm = calculateDistance(departureCoords, destinationCoords);

    const vehiclesArr = state.getSelectedVehicles();
    const vehicleTypes = vehiclesArr.map(v => v.type);

    const speeds = vehicleTypes.map(type => VEHICLE_CONFIG[type].speedKmh);
    const kmh = Math.min(...speeds);
    const drivingHours = distanceKm / kmh;

    const departureCountry = state.getSelectedCountry('departure');
    const destinationCountry = state.getSelectedCountry('destination');
    const customsDelay = getCustomsDelayHours(departureCountry, destinationCountry);

    const loadingHours = vehicleTypes.map(type => VEHICLE_CONFIG[type].loadingHours);
    const turnaroundTime = Math.max(...loadingHours);

    const totalHours = drivingHours + customsDelay + turnaroundTime;

    const selectedMonth = state.getSelectedMonth(); 
    const currentMonths = loadFiscalMonths(selectedMonth.year) || createFiscalMonths(MONTHS, selectedMonth.year);
    const freshMonth = findFiscalMonthById(currentMonths, selectedMonth.id);
    const fiscalDeadline = new Date(freshMonth.closingDate);

    const { windowStart, lastShippingDate } = calculateShippingWindow(fiscalDeadline, totalHours);

    return { windowStart, lastShippingDate, totalHours };
}


console.log(getTransitHours());




// Dann... Results-renderer + results-calculator