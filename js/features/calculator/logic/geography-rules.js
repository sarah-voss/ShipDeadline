export const CONTINENTAL_EUROPE_COUNTRIES = [
    'Italy',
    'Germany',
    'France',
    'Spain',
    'Portugal',
    'Belgium',
    'Netherlands',
    'Luxembourg',
    'Austria',
    'Switzerland',
    'Poland',
    'Czech Republic',
    'Slovakia',
    'Hungary',
    'Slovenia',
    'Croatia',
    'Romania',
    'Bulgaria',
    'Serbia',
    'Bosnia and Herzegovina',
    'Montenegro',
    'North Macedonia',
    'Albania',
    'Greece',
    'Denmark',
    'Sweden',
    'Norway',
    'Finland',
    'United Kingdom',
];


export function isSupportedOriginCountry(countryName) {
    return CONTINENTAL_EUROPE_COUNTRIES.includes(countryName);
}

export function getCountryFieldStatus(locationName, country) {
    if (locationName === 'departure' && !isSupportedOriginCountry(country)) {
        return 'error';
    }
    return 'valid';
}


export function getDestinationArea(selectedCountry) {
    return isSupportedOriginCountry(selectedCountry) ? 'continental' : 'non-europe';
}