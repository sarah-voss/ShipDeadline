import { fetchData } from "./api.js";  
import { GEOAPIFY_CONFIG } from "./config.js";

export async function searchLocation(fieldType, query, selectedCountry) {
    if (!query || query.length < 2) return [];

    const { BASE_URL, API_KEY } = GEOAPIFY_CONFIG;

    if (fieldType === 'country') {
        const countryQuery = `${BASE_URL}?text=${encodeURIComponent(query)}&type=country&limit=10&apiKey=${API_KEY}`;
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
        const postcodeQuery = `${BASE_URL}?text=${encodeURIComponent(query)}&type=postcode&limit=10&filter=countrycode:${selectedCountry}&apiKey=${API_KEY}`;
        jsonResponse = await fetchData(postcodeQuery);
    }

    if (fieldType === 'city') {
        const cityQuery = `${BASE_URL}?text=${encodeURIComponent(query)}&type=city&limit=10&filter=countrycode:${selectedCountry}&apiKey=${API_KEY}`;
        jsonResponse = await fetchData(cityQuery);
    }

    if (!jsonResponse) return;

    const filtered = jsonResponse.features.filter(element => element.properties[fieldType].toLowerCase().includes(query.toLowerCase()));

    const locations = filtered.map(element => {
            const postcode = element.properties.postcode;
            const city = element.properties.city;
            const coordinates = element.geometry.coordinates;
            const rank = element.properties.rank.importance;
            return {
                postcode, 
                city,
                coordinates,
                rank,
                }
        });

    let checkedArray = [];
    
    locations.forEach(loc => {
        if (checkedArray.find(element => element.name === loc.name)) {
        return;
        }
        checkedArray.push(loc);
    });
 
    return checkedArray;
}






