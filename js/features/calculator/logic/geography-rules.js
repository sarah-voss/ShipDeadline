export const CONTINENTAL_EUROPE_COUNTRIES = [
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


export function isSupportedOriginCountry(countryCode) {
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



// countries whose official postcode format includes a hyphen as a structural character
// (PL: NN-NNN, PT: NNNN-NNN) must never be split, unlike hyphenated postcode ranges
// returned by Geoapify for other countries (e.g. Trieste: "34121-34151")
export const HYPHENATED_POSTCODE_COUNTRIES = [
    'pl',
    'pt',
];

export function normalisePostcode(country, rawPostcode) {
    if (!rawPostcode) return rawPostcode;

    if (HYPHENATED_POSTCODE_COUNTRIES.includes(country)) {
        return rawPostcode;
    }

    return rawPostcode.split((/[-–]/))[0].trim();
}