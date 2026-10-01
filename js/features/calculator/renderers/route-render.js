// ==== SUGGESTIONS ====

function highlightMatch(text, value) {
    const index = text.toLowerCase().indexOf(value.toLowerCase());
    if (index === -1) return text;

    const first = text.slice(0, index);
    const match = text.slice(index, index + value.length);
    const after = text.slice(index + value.length);

    return `${first}<strong>${match}</strong>${after}`;
}

export function renderSuggestions(
    suggestions,
    suggestionsContainer,
    value,
    fieldType
) {
    suggestionsContainer.innerHTML = '';

    if (suggestions.length === 0) {
        suggestionsContainer.classList.remove('is-open');
        return;
    }

    suggestionsContainer.classList.add('suggestions-container');
    suggestionsContainer.classList.add('is-open');

    suggestions.forEach(location => {
        const li = document.createElement('li');
        const btn = document.createElement('button');

        if (fieldType === 'country') {
            btn.innerHTML = highlightMatch(location.name, value);
            btn.dataset.name = location.name;
            btn.dataset.code = location.code;
        }

        if (fieldType === 'city' || fieldType === 'postcode') {
            const displayValue = location[fieldType];
            btn.innerHTML = highlightMatch(displayValue, value);

            btn.dataset.city = location.city;
            btn.dataset.lat = location.coordinates.lat;
            btn.dataset.lon = location.coordinates.lon;

            btn.dataset.postcode = location.postcode || '';
        }


        li.appendChild(btn);
        suggestionsContainer.appendChild(li);
    });
}

export function closeSuggestions(suggestionsContainer) {
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.classList.remove('is-open');
}


// ==== FIELD STATE ====

export function renderErrorMessage(field, errorType) {
    field.classList.remove('not-valid', 'not-europe', 'same-as-departure');

    if (!errorType) return;

    if (errorType === 'departure-country-not-europe') {
        field.classList.add('not-europe');
        return;
    }

    if (errorType === 'same-as-departure') {
        field.classList.add('same-as-departure');
        return;
    }

    field.classList.add('not-valid');
}


export function renderPostcodeLabel(label, status) {
    if (status === 'not-applicable') {
        label.textContent = '*no fixed postcode';
        label.classList.add('not-applicable');
        return;
    }
        label.textContent = '*select postcode';
        label.classList.remove('not-applicable');
}


export function renderPostcodeCityGroup(area, locationName, countryStatus, hasCountryBeenValidated) {
    const postcodeCityGroup = area.querySelector(`[data-${locationName}-postcode-city-group]`);
    const inputs = postcodeCityGroup.querySelectorAll('input');

    area.classList.remove('is-revealed', 'is-disabled');
    inputs.forEach(input => {
        input.disabled = false;
    })

    if (countryStatus === 'valid') {
        area.classList.add('is-revealed');
    }

    if (countryStatus !== 'valid' && hasCountryBeenValidated) {
        area.classList.add('is-disabled');
        inputs.forEach(input => {
            input.disabled = true;
        })
    }
}


// ==== MONTH PICKER ====

// Month = null shows the empty picker
export function renderSelectedMonth(label, input, month) {
    if (!month) {
        label.textContent = '*select fiscal month';
        label.classList.remove('field-label--selected');
        input.classList.remove('validated');
        return;
    }

    label.textContent = month.fullLabel;
    label.classList.add('field-label--selected');
    input.classList.add('validated');
}


export function renderMonthPanel(monthPickerPanel, pageOverlay, grid, arr, year) {
    grid.innerHTML = '';
    monthPickerPanel.classList.add('is-open');
    pageOverlay.classList.add('dark-overlay');

    arr.forEach(element => {

        // Create elements
        const button = document.createElement('button');
        const cardName = document.createElement('span');
        const cardYear = document.createElement('span');

        // Classes
        button.classList.add('month-card');
        button.type = 'button';
        cardName.classList.add('month-card__name');
        cardYear.classList.add('month-card__year');

        // Selectability is decided by the controller
        if (!element.isSelectable) {
            button.disabled = true;
            button.classList.add('month-card--disabled');
        };

        // Content and attributes
        button.dataset.monthId = element.id;
        cardName.textContent = element.label;
        cardYear.textContent = year;

        // Assemble
        button.append(cardName, cardYear);
        grid.append(button);
    })
}


export function closeMonthPanel(monthPickerPanel, monthPickerGrid, pageOverlay) {
    monthPickerGrid.innerHTML = '';
    monthPickerPanel.classList.remove('is-open');
    pageOverlay.classList.remove('dark-overlay');
}

