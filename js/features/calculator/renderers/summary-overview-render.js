import { formatDate } from "../../../utils/date-utils.js";
import { VEHICLES } from "../shipment/vehicles.js";

// === SHARED ===

// render Country Value
export function renderCountryValue(country, field) {
    field.textContent = country ?? '';
}

// render Location Value
export function renderLocationValue(city, postcode, field) {
    if (!city) {
        field.textContent = '';
        return;
    }

    if (!postcode) {
        field.textContent = `${city}`;
        return;
    }

    field.textContent = `${postcode} ${city}`;
}

// render Fiscal Date Value
export function renderFiscalDateValue(fiscalMonth, closingDate, month, date) {
    if (!month || !date) {
        return;
    }

    const formattedDate = formatDate(date);
    fiscalMonth.textContent = month;

    closingDate.textContent = formattedDate;
}

// render summary value: bold when set, grey placeholder text when empty
export function renderSummaryValue(element, value, placeholderText = '') {
    const hasValue = Boolean(value);
    element.textContent = hasValue ? value : placeholderText;
    element.classList.toggle('bold', hasValue);
    element.classList.toggle('placeholder', !hasValue);
}

// render summary fiscal date when no month is selected yet
export function renderEmptyFiscalDate(fiscalMonth, closingDate) {
    renderSummaryValue(fiscalMonth, null, 'Choose fiscal month');
    closingDate.textContent = '';
}



// === SUMMARY ===

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
        vehicleText.textContent = VEHICLES[v.type].label;
        div.append(vehicleText);
        }
    })
}

// render summary success
export function renderSummarySuccess(icon, isValid) {
    icon.classList.toggle('is-active', isValid);
}


// === OVERVIEW ===

export function renderVehicleValue(field, vehicleType) {
    field.chosenVehicle.innerText = VEHICLES[vehicleType].label;
    field.vehicleDescription.innerText = VEHICLES[vehicleType].description;
}

export function renderTransitValue(transitTime, field) {
    if (transitTime <= 1) {
        field.innerText = `${Math.round(transitTime)} hour`;
        return
    }
    field.innerText = `${Math.round(transitTime)} hours`;
}

export function renderCustomsValue(customsDelay, field) {
    if (!customsDelay) {
        field.needsCustoms.innerText = 'No';
        field.requiredText.innerText = 'Not required';
        return;
    }

    field.needsCustoms.innerText = 'Yes';
    field.requiredText.innerText = 'Required';
}