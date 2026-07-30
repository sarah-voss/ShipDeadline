import { formatDate } from "../../../utils/date-utils.js";


// render Summary Country
export function renderSummaryCountry(country, summaryField) {
    if (!country) {
        summaryField.textContent = summaryField.dataset.placeholder;
        summaryField.classList.add('placeholder');
        summaryField.classList.remove('bold');
        return
    }

    summaryField.textContent = country;
    summaryField.classList.remove('placeholder');
    summaryField.classList.add('bold');
}


// render Summary Location
export function renderSummaryLocation(city, postcode, summaryField) {
    if (!city) {
        summaryField.textContent = '';
        return;
    }

    if (!postcode) {
        summaryField.textContent = `${city}`;
        return;
    }

    summaryField.textContent = `${city} ${postcode}`;
}


// render summary chosen month
export function renderSummaryFiscalMonth(monthText, dateText, month, date) {
    if (!month || !date) {
        monthText.classList.add('placeholder');
        monthText.classList.remove('bold');
        monthText.textContent = 'Choose fiscal month';
        dateText.textContent = '';
        return;
    }

    const formattedDate = formatDate(date);
    monthText.textContent = month;
    monthText.classList.remove('placeholder');
    monthText.classList.add('bold');
    dateText.textContent = formattedDate;
}

//render summary mode 
export function renderSummaryMode(text, scenario) {
    if (!scenario) {
        text.classList.add('placeholder');
        text.textContent = 'Air / Sea / Road';
        text.classList.remove('bold');
        return;
    }

    if (scenario === 'full-road' || scenario === 'partial-road') {
        text.textContent = 'Road';
    }

    if (scenario === 'full-sea') {
        text.textContent = 'Sea';
    }

    if (scenario === 'partial-air') {
        text.textContent = 'Air';
    }

    text.classList.remove('placeholder');
    text.classList.add('bold');
}

export function renderSummaryVehicles(div, vehicles) {
    div.innerHTML = '';

    if (!vehicles) return; 
    
    vehicles.forEach(v => {
        if (v.status === 'valid') {
        const vehicleText = document.createElement('p');
        vehicleText.classList.add('vehicle-labels');
        const vehicleLabel = v.type.split('-');
        vehicleText.textContent = v.type.replace('-', ' ');
        div.append(vehicleText);
        }
    })
}


// render summary success
export function renderSummarySuccess(icon, isValid) {
    icon.classList.toggle('is-active', isValid);
}
