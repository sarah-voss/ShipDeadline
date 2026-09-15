import { calculateDistance } from './distance-source.js';
import { VEHICLE_CONFIG } from './vehicle-speed.js';
import { getCustomsDelayHours } from './customs-rules.js';
import { calculateShippingWindow } from './shipping-window.js';


export function getTransitDetails({ resultElements }) {
    const {
        departureCoords, 
        destinationCoords,
        vehiclesArr,
        departureCountry,
        destinationCountry,
        fiscalDeadline
    } = resultElements;

    const distanceKm = calculateDistance(departureCoords, destinationCoords);

    const vehicleTypes = vehiclesArr.map(v => v.type);

    const speeds = vehicleTypes.map(type => {
      return  {
        type,
        speedKmh: VEHICLE_CONFIG[type].speedKmh
        }
    });

    const slowestVehicle = speeds.reduce((slowest, current) => {
        return current.speedKmh < slowest.speedKmh
        ? current
        : slowest;
    });

    const kmh = slowestVehicle.speedKmh;
    const slowestVehicleType = slowestVehicle.type;

    const drivingHours = distanceKm / kmh;
    
    const customsDelay = getCustomsDelayHours(departureCountry, destinationCountry);

    const loadingHours = vehicleTypes.map(type => VEHICLE_CONFIG[type].loadingHours);
    const turnaroundTime = Math.max(...loadingHours);

    const totalHours = drivingHours + customsDelay + turnaroundTime;

    const { windowStart, lastShippingDate } = calculateShippingWindow(fiscalDeadline, totalHours);

    return { windowStart, lastShippingDate, customsDelay, totalHours, slowestVehicleType };
}


