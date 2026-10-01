import * as calculatorRender from "../renderers/calculator-render.js";
import * as routeRender from "../renderers/route-render.js";

import * as state from "../state.js";
import { searchLocation } from "../../../services/geocoding.js";
import { getFields } from "../helpers.js";
import { getCountryFieldStatus } from '../logic/geography-rules.js';
import { isFiscalMonthSelectable } from '../logic/business-rules.js';

import { getFiscalMonths, getFiscalMonth } from '../../fiscal-months/queries.js';

export function initRouteController({ elements, pageOverlay, onRouteChange }) {

    const {
        locations,
        monthPickerPanel,
        monthPickerInput,
        monthPickerTrigger,
        monthPickerLabel,
        monthPickerYearInput,
        monthPickerGrid,
    } = elements;


    // ==== HELPERS ====

    function updateRouteStep() {
        const areLocationsComplete = Object.entries(locations).every(([locationName]) => {
            return state.isFieldAreaComplete(locationName);
        })

        const isMonthSelected = Boolean(state.getSelectedMonth());

        const isRouteValid = areLocationsComplete && isMonthSelected;

        state.setStepValidity('route', isRouteValid);
    }


    function setFieldUiState(locationName, fieldType, status, field, errorType) {
        state.setFieldStatus(locationName, fieldType, status, errorType);
        const currentStatus = state.getFieldStatus(locationName, fieldType);
        calculatorRender.renderFieldState(field, currentStatus);
        routeRender.renderErrorMessage(field, errorType);
        if (fieldType === 'postcode') {
            routeRender.renderPostcodeLabel(locations[locationName].postcode.label, currentStatus);
        }
    }

    // Reveals or disables the postcode and city fields depending on the country state
    function updatePostcodeCityGroup(locationName, area) {
        routeRender.renderPostcodeCityGroup(
            area,
            locationName,
            state.getFieldStatus(locationName, 'country'),
            state.hasCountryBeenValidated(locationName)
        );
    }

    function applySelectedCountry(locationName, fieldType, button, input) {
        const name = button.dataset.name;
        const code = button.dataset.code;
        input.value = name;
        state.setInputValue(locationName, fieldType, name);
        state.setSelectedCountry(locationName, fieldType, name, code);
    }

    function applySelectedPostcodeOrCity(locationName, fieldType, button, input) {
        const postcode = button.dataset.postcode;
        const city = button.dataset.city;
        const value = fieldType === 'postcode' ? postcode : city;
        const coordinates = {
            lon: Number(button.dataset.lon),
            lat: Number(button.dataset.lat)
        }

        state.setSelectedCoordinates(locationName, coordinates);

        state.setInputValue(locationName, fieldType, value);
        input.value = value;

        if (fieldType === 'postcode') {
            locations[locationName].city.input.value = city;
        } else if (!postcode) {
            locations[locationName].postcode.input.value = '';
        } else {
            locations[locationName].postcode.input.value = postcode;
        }

        state.setSelectedPostcodeCity(locationName, postcode, city);
    }


    async function showSuggestions(locationName, fieldType, suggestionsContainer, checkedValue, input) {
        const selectedCountry = state.getSelectedCountryCode(locationName);

        const suggestions = await searchLocation(fieldType, checkedValue, selectedCountry);

        // Ignore late responses: the user may have kept typing while the request was pending
        if (input.value.trim() !== checkedValue) return;

        routeRender.renderSuggestions(suggestions, suggestionsContainer, checkedValue, fieldType);
    }
    

    async function handleLocationInput(locationName, fieldType, suggestionsContainer, value, input, field) {
        const checkedValue = value.trim();
        state.setInputValue(locationName, fieldType, checkedValue);

        // A new country invalidates the postcode and city already chosen
        if (fieldType === 'country') {
            resetPostcodeCity(locationName);
        }

        if (fieldType === 'postcode' || fieldType === 'city') {
            setFieldUiState(locationName, 'city', 'idle', locations[locationName].city.field);
            setFieldUiState(locationName, 'postcode', 'idle', locations[locationName].postcode.field);
        }

        if (checkedValue.length < 2) {
            setFieldUiState(locationName, fieldType, 'idle', field);
            return;
        }
        setFieldUiState(locationName, fieldType, 'typing', field);
        await showSuggestions(locationName, fieldType, suggestionsContainer, checkedValue, input);
    }


    function isSameAsDeparture() {
        return (
            state.getSelectedLocation('departure', 'country') === state.getSelectedLocation('destination', 'country') &&
            state.getSelectedLocation('departure', 'postcode') === state.getSelectedLocation('destination', 'postcode') &&
            state.getSelectedLocation('departure', 'city') === state.getSelectedLocation('destination', 'city')
        )
    }

    // Flags the destination when it matches the departure and clears only that error once they differ again
     function updateDuplicateDestinationState() {
        const isDuplicate = isSameAsDeparture();
        const cityWasFlagged = state.calculatorState.destination.city.errorType === 'same-as-departure';

        if (isDuplicate) {
        setFieldUiState('destination', 'city', 'error', locations.destination.city.field, 'same-as-departure');
        setFieldUiState('destination', 'postcode', 'error', locations.destination.postcode.field, 'same-as-departure');
        return;
    }

    if (cityWasFlagged) {
        const hasCity = state.getSelectedLocation('destination', 'city');
        const hasPostcode = state.getSelectedLocation('destination', 'postcode');
        setFieldUiState('destination', 'city', hasCity ? 'valid' : 'idle', locations.destination.city.field);
        setFieldUiState('destination', 'postcode', hasPostcode ? 'valid' : 'idle', locations.destination.postcode.field);
    }
}


    function resetPostcodeCity(locationName) {
        state.setFieldStatus(locationName, 'postcode', 'idle');
        state.setFieldStatus(locationName, 'city', 'idle');

        state.setSelectedPostcodeCity(locationName, '', '');
        locations[locationName].postcode.input.value = '';
        locations[locationName].city.input.value = '';

        const postcodeStatus = state.getFieldStatus(locationName, 'postcode');
        const cityStatus = state.getFieldStatus(locationName, 'city');

        calculatorRender.renderFieldState(locations[locationName].postcode.field, postcodeStatus);
        calculatorRender.renderFieldState(locations[locationName].city.field, cityStatus);
    }


    function resetCalculatorForm() {
        getFields(locations).forEach(({
            locationName,
            area,
            fieldType,
            input,
            field,
            suggestionsContainer
        }) => {

            input.value = '';

            state.setInputValue(locationName, fieldType, '');

            setFieldUiState(locationName, fieldType, 'idle', field);
            updatePostcodeCityGroup(locationName, area);

            routeRender.closeSuggestions(suggestionsContainer);
        });

        routeRender.renderSelectedMonth(monthPickerLabel, monthPickerInput, null);
        state.setSelectedMonth(null);
        state.resetVehicles();

        updateRouteStep();
        onRouteChange();
    }


    function restoreRouteForm() {
        getFields(locations).forEach(({
            locationName,
            area,
            fieldType,
            input,
            field
        }) => {

            const fieldState = state.calculatorState[locationName][fieldType];

            input.value = fieldState.selected || fieldState.inputValue;
            setFieldUiState(locationName, fieldType, fieldState.status, field, fieldState.errorType);
            updatePostcodeCityGroup(locationName, area);
        });

        const savedMonth = state.getSelectedMonth(); 

        // Reload the month from the fiscal months: its closing date may have changed on the other page
        if (savedMonth) {
        const freshMonth = getFiscalMonth(savedMonth);
        
        if (freshMonth) {
            routeRender.renderSelectedMonth(monthPickerLabel, monthPickerInput, freshMonth);
        }
    }
    }

    

    // Months shown in the picker, reloaded when the year changes
    let year = Number(monthPickerYearInput.value);
    let fiscalMonths = getFiscalMonths(year);

    // Selectability is a business rule, so it is decided here and passed to the renderer
    function openMonthPanel({ focusFirstMonth = false } = {}) {
        const months = fiscalMonths.map(month => ({
            ...month,
            isSelectable: isFiscalMonthSelectable(month)
        }));
        routeRender.renderMonthPanel(monthPickerPanel, pageOverlay, monthPickerGrid, months, year, monthPickerTrigger);
        if (focusFirstMonth) routeRender.focusFirstSelectableMonth(monthPickerGrid);
    }

    function closeMonthPanel(returnFocus = false) {
        routeRender.closeMonthPanel(monthPickerPanel, monthPickerGrid, pageOverlay, monthPickerTrigger, returnFocus);
    }


    // ==== EVENT LISTENERS ====

    getFields(locations).forEach(({
        locationName,
        area,
        fieldType,
        input,
        suggestionsContainer,
        field
    }) => {

        input.addEventListener('input', (e) => {
            handleLocationInput(locationName, fieldType, suggestionsContainer, e.target.value, input, field);
        });


        function selectSuggestion(button) {
            let status = 'valid';
            let errorType = null;

            if (fieldType === 'country') {
                applySelectedCountry(locationName, fieldType, button, input);
                const countryCode = button.dataset.code;
                status = getCountryFieldStatus(locationName, countryCode);
                if (status === 'error') {
                    errorType = 'departure-country-not-europe';
                }
            }

            if (fieldType === 'postcode') {
                applySelectedPostcodeOrCity(locationName, fieldType, button, input);
                setFieldUiState(locationName, 'city', status, locations[locationName].city.field, errorType);
            }

            if (fieldType === 'city') {
                applySelectedPostcodeOrCity(locationName, fieldType, button, input);
                if (button.dataset.postcode) {
                setFieldUiState(locationName, 'postcode', status, locations[locationName].postcode.field);
                } else {
                    setFieldUiState(locationName, 'postcode', 'not-applicable', locations[locationName].postcode.field);
                }
            }

            setFieldUiState(locationName, fieldType, status, field, errorType);

            routeRender.closeSuggestions(suggestionsContainer);
            updatePostcodeCityGroup(locationName, area);
            updateDuplicateDestinationState();

            updateRouteStep();
            onRouteChange();
        }

        // Uses mousedown: fires before the input blur, so the selection is applied before the blur validation runs
        suggestionsContainer.addEventListener('mousedown', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            selectSuggestion(button);
        })

        // Keyboard: arrow down from the field enters the suggestions, Escape closes them
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' && routeRender.moveSuggestionFocus(suggestionsContainer, null, 1)) {
                e.preventDefault();
            }
            if (e.key === 'Escape') {
                routeRender.closeSuggestions(suggestionsContainer);
            }
        })

        // Keyboard inside the suggestions: arrows move, Enter or Space selects, Escape goes back to the field
        suggestionsContainer.addEventListener('keydown', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const moved = routeRender.moveSuggestionFocus(suggestionsContainer, button, e.key === 'ArrowDown' ? 1 : -1);
                if (!moved && e.key === 'ArrowUp') input.focus();
                return;
            }

            if (e.key === 'Escape') {
                routeRender.closeSuggestions(suggestionsContainer);
                input.focus();
                return;
            }

            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectSuggestion(button);
                input.focus();
            }
        })


        // Leaving a field with text but no selected suggestion marks it as invalid,
        // unless the focus is moving into its own suggestions (keyboard navigation)
        input.addEventListener('blur', (e) => {
            if (suggestionsContainer.contains(e.relatedTarget)) return;

            const value = input.value.trim();
            if (!value) {
                setFieldUiState(locationName, fieldType, 'idle', field);
                updatePostcodeCityGroup(locationName, area);
                updateRouteStep();
                onRouteChange();
                return;
            }
            if (!state.getSelectedLocation(locationName, fieldType)) {
                setFieldUiState(locationName, fieldType, 'error', field, 'not-valid');
                updatePostcodeCityGroup(locationName, area);
                updateRouteStep();
                onRouteChange();
            }
        })
    });

    // Close every suggestion list except the one of the field that was clicked
    document.addEventListener('click', (e) => {
        getFields(locations).forEach(({
            field,
            suggestionsContainer
        }) => {
            if (!field.contains(e.target)) {
                routeRender.closeSuggestions(suggestionsContainer);
            }
        })
    })

    monthPickerInput.addEventListener('click', () => {
        openMonthPanel({ focusFirstMonth: true });
    });

    monthPickerYearInput.addEventListener('change', (e) => {
        year = Number(e.target.value);
        fiscalMonths = getFiscalMonths(year);
        openMonthPanel();
    })

    monthPickerGrid.addEventListener('click', (e) => {
        const button = e.target.closest('[data-month-id]');

        if (!button) return;

        const monthId = button.dataset.monthId;
        const selectedMonth = fiscalMonths.find(month => month.id === monthId);

        state.setSelectedMonth({
            id: selectedMonth.id,
            year: selectedMonth.year,
        });

        routeRender.renderSelectedMonth(monthPickerLabel, monthPickerInput, selectedMonth);
        closeMonthPanel(true);
        updateRouteStep();
        onRouteChange();
    })


    // Close the month panel on any click outside it and its trigger
    document.addEventListener('click', (e) => {
        const isPanelOpen = monthPickerPanel.classList.contains('is-open');

        if (!isPanelOpen) {
            return;
        };

        const clickedInsidePanel = monthPickerPanel.contains(e.target);
        const clickedInput = monthPickerInput.contains(e.target);

        if (clickedInsidePanel || clickedInput) return;

        closeMonthPanel();
    })

    // Escape closes the month panel and gives the focus back to its trigger
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || !monthPickerPanel.classList.contains('is-open')) return;
        closeMonthPanel(true);
    })


    // ==== INIT ====

    restoreRouteForm();

    return { resetCalculatorForm };
}