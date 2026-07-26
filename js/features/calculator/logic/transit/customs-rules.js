const EU_CUSTOMS_UNION_COUNTRIES = [
    'it',
    'de',
    'fr',
    'es',
    'pt',
    'be',
    'nl',
    'lu',
    'at',
    'pl',
    'cz',
    'sk',
    'hu',
    'si',
    'hr',
    'ro',
    'bg',
    'gr',
    'dk',
    'se',
    'fi',
];

const CUSTOMS_DELAY_HOURS = 6;

function needsCustoms(departureCountry, destinationCountry) {
   const departureCheck = EU_CUSTOMS_UNION_COUNTRIES.includes(departureCountry);
   const destinationCheck = EU_CUSTOMS_UNION_COUNTRIES.includes(destinationCountry);
   return !departureCheck || !destinationCheck;
}

export function getCustomsDelayHours(departureCountry, destinationCountry) {
    return needsCustoms(departureCountry, destinationCountry) ? CUSTOMS_DELAY_HOURS : 0;
}