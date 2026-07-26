import { fetchData } from "./api.js";  
import { GEOAPIFY_CONFIG } from "./config.js";
import { normalisePostcode } from "../features/calculator/logic/geography-rules.js";

export async function searchLocation(fieldType, query, selectedCountry) {
    if (!query || query.length < 2) return [];

    const { BASE_URL, API_KEY } = GEOAPIFY_CONFIG;

    if (fieldType === 'country') {
        const countryQuery = `${BASE_URL}?text=${encodeURIComponent(query)}&lang=en&type=country&limit=10&apiKey=${API_KEY}`;
        const jsonResponse = await fetchData(countryQuery);

        const filtered = jsonResponse.features.filter(element => {
        return element.properties.name.toLowerCase().includes(query.toLowerCase());
        }); 

       const countries = filtered.map(element => {
       const name = element.properties.name;
       if (!element.properties.country_code) return;
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

    if (!jsonResponse) return;

    const filtered = jsonResponse.features.filter(element => element.properties[fieldType].toLowerCase().includes(query.toLowerCase()));

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
 
    console.log(checkedArray);
    return checkedArray;
}






