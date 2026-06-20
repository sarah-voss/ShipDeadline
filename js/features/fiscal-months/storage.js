const STORAGE_KEY = 'shipDeadline:fiscal-months';


export function saveFiscalMonths(year, fiscalMonths) {

const storedData = localStorage.getItem(STORAGE_KEY);
const parsedData = storedData ? JSON.parse(storedData) : {};

const updatedData = {
    ...parsedData,
    [year]: fiscalMonths
};

localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
}

export function loadFiscalMonths(year) {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if(!storedData) return null;

    try {
        const parsedData = JSON.parse(storedData);
        return parsedData[year] || null
    } catch (error) {
        console.error('failed to load fiscal months:', error);
        return null;
    }
}