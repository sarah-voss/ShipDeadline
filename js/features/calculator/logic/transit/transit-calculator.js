import * as state from '../../state.js'
import { calculateDistance } from './distance-source.js';
import { VEHICLE_SPEEDS_KMH } from './vehicle-speed.js';
import { getCustomsDelayHours } from './customs-rules.js';
import { calculateShippingWindow } from './shipping-window.js';

export function getTransitHours() {
    const { departureCoords, destinationCoords } = state.getSelectedCoordinates();
    const distanceKm = calculateDistance(departureCoords, destinationCoords);

    const vehiclesArr = state.getFullRoadVehicle();
    const vehicleTypes = vehiclesArr.map(v => v.type);
    const kmh = VEHICLE_SPEEDS_KMH[vehicleTypes];

    const drivingHours = distanceKm / kmh;

    const departureCountry = state.getSelectedCountry('departure');
    const destinationCountry = state.getSelectedCountry('destination');
    const customsDelay = getCustomsDelayHours(departureCountry, destinationCountry);

    return drivingHours + customsDelay;
}

// Um den Fall kümmern, das vehicle array mehr als ein vehicle type hat. Rechnung geht dann nach langsamsten.
// Schauen wie genau wir stunden in tage umrechnen, und wie wir kurze strecken (< 4 std) mit den tagen angehen.
// Vehicles bei summary mode hinzufügen


// Dann... Results-renderer + results-calculator