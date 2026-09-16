import { formatDate } from "../../../utils/date-utils.js";

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


// === OVERVIEW ===

export function renderVehicleValue(VEHICLE_OVERVIEW_CONFIG, field, vehicle) {
    if (!VEHICLE_OVERVIEW_CONFIG) return;
    field.chosenVehicle.innerText = VEHICLE_OVERVIEW_CONFIG[vehicle].vehicleType;
    field.vehicleDescription.innerText = VEHICLE_OVERVIEW_CONFIG[vehicle].description;
}

export function renderTransitValue(transitTime, field) {
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