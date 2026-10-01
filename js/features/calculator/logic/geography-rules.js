// Countries reachable by road within Europe (EU and non-EU): the supported departures and road destinations
const CONTINENTAL_EUROPE_COUNTRIES = [
    'it',
    'de',
    'fr',
    'es',
    'pt',
    'be',
    'nl',
    'lu',
    'at',
    'ch',
    'pl',
    'cz',
    'sk',
    'hu',
    'si',
    'hr',
    'ro',
    'bg',
    'rs',
    'ba',
    'me',
    'mk',
    'al',
    'gr',
    'dk',
    'se',
    'no',
    'fi',
    'gb',
];


function isSupportedOriginCountry(countryCode) {
    return CONTINENTAL_EUROPE_COUNTRIES.includes(countryCode);
}

export function getCountryFieldStatus(locationName, countryCode) {
    if (locationName === 'departure' && !isSupportedOriginCountry(countryCode)) {
        return 'error';
    }
    return 'valid';
}


export function getDestinationArea(countryCode) {
    return isSupportedOriginCountry(countryCode) ? 'continental' : 'non-europe';
}
