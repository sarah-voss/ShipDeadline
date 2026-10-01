import { fetchData } from "./api.js";  
import { GEOAPIFY_CONFIG } from "./config.js";

// countries whose official postcode format includes a hyphen as a structural character
// (PL: NN-NNN, PT: NNNN-NNN) must never be split, unlike hyphenated postcode ranges
// returned by Geoapify for other countries (e.g. Trieste: "34121-34151")
const HYPHENATED_POSTCODE_COUNTRIES = [
    'pl',
    'pt',
];

function normalisePostcode(country, rawPostcode) {
    if (!rawPostcode) return rawPostcode;

    if (HYPHENATED_POSTCODE_COUNTRIES.includes(country)) {
        return rawPostcode;
    }

    return rawPostcode.split((/[-–]/))[0].trim();
}

export async function searchLocation(fieldType, query, selectedCountry) {
    if (!query || query.length < 2) return [];

    const { BASE_URL, API_KEY } = GEOAPIFY_CONFIG;

    if (fieldType === 'country') {
        const countryQuery = `${BASE_URL}?text=${encodeURIComponent(query)}&lang=en&type=country&limit=10&apiKey=${API_KEY}`;
        const jsonResponse = await fetchData(countryQuery);

        // skip results without name or country code: they can't be rendered or selected
        const filtered = jsonResponse.features.filter(element => {
        const { name, country_code } = element.properties;
        return name && country_code && name.toLowerCase().includes(query.toLowerCase());
        });

       const countries = filtered.map(element => {
       const name = element.properties.name;
       const countryCode = element.properties.country_code.toLowerCase();
        return {
            name, 
            code: countryCode,
        };
    });

    return countries;
    }


    let jsonResponse;

    if (fieldType === 'postcode') {
        const postcodeQuery = `${BASE_URL}?text=${encodeURIComponent(query)}&lang=en&type=postcode&limit=10&filter=countrycode:${selectedCountry}&apiKey=${API_KEY}`;
        jsonResponse = await fetchData(postcodeQuery);
    }

    if (fieldType === 'city') {
        const cityQuery = `${BASE_URL}?text=${encodeURIComponent(query)}&lang=en&type=city&limit=10&filter=countrycode:${selectedCountry}&apiKey=${API_KEY}`;
        jsonResponse = await fetchData(cityQuery);
    }

    if (!jsonResponse) return [];

    // skip results missing the searched value or the city (needed to fill both fields)
    const filtered = jsonResponse.features.filter(element => {
        const value = element.properties[fieldType];
        return value && element.properties.city && value.toLowerCase().includes(query.toLowerCase());
    });

    const locations = filtered.map(element => {
            const postcode = normalisePostcode(selectedCountry, element.properties.postcode);
            const city = element.properties.city.split("/")[0].trimEnd();
            const [lon, lat] = element.geometry.coordinates;
            const coordinates = { lon, lat };
            return {
                postcode, 
                city,
                coordinates,
                }
        });
    
    let checkedArray = [];
    
    locations.forEach(loc => {
        if (checkedArray.find(element => element.city === loc.city)) {
        return;
        }
        checkedArray.push(loc);
    });
 

    return checkedArray;
}






