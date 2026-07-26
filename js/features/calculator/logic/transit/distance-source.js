const EARTH_RADIUS_KM = 6371;
const ROAD_DISTANCE_CORRECTION_FACTOR = 1.3;

function toRadians(deg) {
    return deg * (Math.PI / 180);
}

export function calculateDistance(departureCoords, destinationCoords) {
    const { lat: lat1, lon: lon1 } = departureCoords;
    const { lat: lat2, lon: lon2 } = destinationCoords;

    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const deltaLat = lat2Rad - lat1Rad;
    const deltaLon = toRadians(lon2) - toRadians(lon1);

    const deltaLatHalf = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2);
    const deltaLonHalf = Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const a = deltaLatHalf + Math.cos(lat1Rad) * Math.cos(lat2Rad) * deltaLonHalf;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = EARTH_RADIUS_KM * c;

    return distanceKm * ROAD_DISTANCE_CORRECTION_FACTOR;
}

