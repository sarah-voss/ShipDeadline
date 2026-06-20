import { fetchData } from "./api.js";  
import { GEOAPIFY_CONFIG } from "./config.js";

export async function searchLocation(fieldType, query, selectedCountry) {
    if (!query || query.length < 2) return [];

    const { BASE_URL, API_KEY } = GEOAPIFY_CONFIG;

    if (fieldType === 'country') {
        const countryQuery = `${BASE_URL}?text=${encodeURIComponent(query)}&type=country&limit=10&apiKey=${API_KEY}`;
        const jsonResponse = await fetchData(countryQuery);

    const countries = jsonResponse.features.map(element => {
       const name = element.properties.country;
       const countryCode = element.properties.country_code.toLowerCase();
        return {
            name, 
            code: countryCode
        };
    });

    const filtered = countries.filter(country => {
        return country.name.toLowerCase().includes(query.toLowerCase());
        });

    return filtered;
    }
    
    if (fieldType === 'postcode') {
        const postcodeQuery = `${BASE_URL}?text=${encodeURIComponent(query)}&type=postcode&limit=10&filter=countrycode:${selectedCountry}&apiKey=${API_KEY}`;
        const jsonResponse = await fetchData(postcodeQuery);

        const location = jsonResponse.features.map(element => {
            const postcode = element.properties.postcode;
            const city = element.properties.city;
            return {
                postcode, 
                city
            }
        });

        const filtered = location.filter(loc => loc.postcode.includes(query));

        return filtered;
    }

    if (fieldType === 'city') {
        const cityQuery = `${BASE_URL}?text=${encodeURIComponent(query)}&type=city&limit=10&filter=countrycode:${selectedCountry}&apiKey=${API_KEY}`;
        const jsonResponse = await fetchData(cityQuery);

        const location = jsonResponse.features.map(element => {
            const postcode = element.properties.postcode;
            const city = element.properties.city;
            return {
                postcode, 
                city
            }
        });

        const filtered = location.filter(loc => loc.city.includes(query));

        return filtered;
    }

}




