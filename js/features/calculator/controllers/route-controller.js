import * as calculatorRender from "../renderers/calculator-render.js";
import * as routeRender from "../renderers/route-render.js";

import * as state from "../state.js";
import { searchLocation } from "../../../services/geocoding.js";
import { getFields } from "../helpers.js";
import { getCountryFieldStatus } from '../logic/geography-rules.js';

import { MONTHS } from '../../fiscal-months/config.js';
import { loadFiscalMonths } from '../../fiscal-months/storage.js';
import { createFiscalMonths } from '../../fiscal-months/state.js';

export function initRouteController({ elements, pageOverlay, onRouteChange }) {

    // destructure imported values
    const {
        autocompleteWrapper,
        locations,
        monthPickerPanel,
        monthPickerInput,
        monthPickerTrigger,
        monthPickerYearInput,
        monthPickerGrid,
    } = elements;


    // ==========================================
    //  === HELPER FUNCTIONS + SETUP ===
    // ==========================================


    // CHECK & UPDATE VALIDITY
    function updateRouteStep() {
        const areLocationsComplete = Object.entries(locations).every(([locationName]) => {
            return state.isFieldAreaComplete(locationName);
        })

        const isMonthSelected = Boolean(state.getSelectedMonth());

        const isRouteValid = areLocationsComplete && isMonthSelected;

        state.setStepValidity('route', isRouteValid);
    }


    // SET FIELD UI STATE
    function setFieldUiState(locationName, fieldType, status, field, errorType) {
        state.setFieldStatus(locationName, fieldType, status, errorType);
        const currentStatus = state.getFieldStatus(locationName, fieldType);
        calculatorRender.renderFieldState(field, currentStatus);
        routeRender.renderErrorMessage(locationName, fieldType, field);
    }

    // APPLY SELECTED COUNTRY
    function applySelectedCountry(locationName, fieldType, button, input) {
        const name = button.dataset.name;
        const code = button.dataset.code;
        input.value = name;
        state.setInputValue(locationName, fieldType, name);
        state.setSelectedCountry(locationName, fieldType, name, code);
    }

    // APPLY SELECTED POSTCODE 
    function applySelectedPostcode(locationName, fieldType, button, input) {
        const postcode = button.dataset.postcode;
        const city = button.dataset.city;
        state.setInputValue(locationName, fieldType, postcode);
        state.setSelectedPostcodeCity(locationName, postcode, city);
        input.value = postcode;
        locations[locationName].city.input.value = city;
    }

    // APPLY SELECTED CITY
    function applySelectedCity(locationName, fieldType, button, input) {
        const postcode = button.dataset.postcode;
        const city = button.dataset.city;
        state.setInputValue(locationName, fieldType, city);
        state.setSelectedPostcodeCity(locationName, postcode, city);
        input.value = city;
        locations[locationName].postcode.input.value = postcode;
    }


    // SHOW SUGGESTIONS
    async function showSuggestions(locationName, fieldType, suggestionsContainer, checkedValue, input) {
        // get selected country
        const selectedCountry = state.getSelectedCountry(locationName, 'country');

        // send api request
        const suggestions = await searchLocation(fieldType, checkedValue, selectedCountry);

        // value still up to date?
        if (input.value.trim() !== checkedValue) return;

        // render suggestions
        routeRender.renderSuggestions(suggestions, suggestionsContainer, checkedValue, fieldType);
    }
    

    // HANDLE LOCATION INPUT
    async function handleLocationInput(locationName, fieldType, suggestionsContainer, value, input, field) {
        const checkedValue = value.trim();
        // set input
        state.setInputValue(locationName, fieldType, checkedValue);

        if (fieldType === 'country') {
            resetPostcodeCity(locationName);
        }

        if (checkedValue.length < 2) {
            setFieldUiState(locationName, fieldType, 'idle', field);
            return;
        }
        // typing
        setFieldUiState(locationName, fieldType, 'typing', field);
        // show suggestions
        await showSuggestions(locationName, fieldType, suggestionsContainer, checkedValue, input);
    }


    // IS DESTINATION SAME AS DEPARTURE
    function isSameAsDeparture() {
        return (
            state.getSelectedLocation('departure', 'country') === state.getSelectedLocation('destination', 'country') &&
            state.getSelectedLocation('departure', 'postcode') === state.getSelectedLocation('destination', 'postcode') &&
            state.getSelectedLocation('departure', 'city') === state.getSelectedLocation('destination', 'city')
        )
    }


    // RESET POSTCODE CITY
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


    // RESET CALCULATOR FORM
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
            routeRender.renderPostcodeCityGroup(locationName, area);

            routeRender.closeSuggestions(suggestionsContainer);
        });

        monthPickerTrigger.textContent = 'select fiscal month';
        monthPickerInput.classList.remove('validated');
        state.setSelectedMonth(null);

        updateRouteStep();
        onRouteChange();
    }


    // RESTORE ROUTE FORM
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
            routeRender.renderPostcodeCityGroup(locationName, area);
        });

        const savedMonth = state.getSelectedMonth();
        if (savedMonth) {
            monthPickerTrigger.textContent = savedMonth.fullLabel;
            routeRender.validateFiscalMonth(monthPickerInput);
        }
    }

    // CREATE / LOAD MONTHS FOR CALENDAR
    let year = Number(monthPickerYearInput.value);
    const fiscalMonths = loadFiscalMonths(year) || createFiscalMonths(MONTHS, year);



    // ==========================================
    //  === EVENT LISTENERS ===
    // ==========================================

    getFields(locations).forEach(({
        locationName,
        area,
        fieldType,
        input,
        suggestionsContainer,
        field
    }) => {

        input.addEventListener('input', (e) => {
            handleLocationInput(locationName, fieldType, suggestionsContainer, e.target.value, input, field, area);
        });


        // ----- SUGGESTIONS -----
        suggestionsContainer.addEventListener('mousedown', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            let status = 'valid';
            let errorType = null;

            if (fieldType === 'country') {
                applySelectedCountry(locationName, fieldType, button, input);
                const countryName = button.dataset.name;
                status = getCountryFieldStatus(locationName, countryName);
                if (status === 'error') {
                    errorType = 'departure-country-not-europe';
                }
            }

            if (fieldType === 'postcode') {
                applySelectedPostcode(locationName, fieldType, button, input);
            }

            if (fieldType === 'city') {
                applySelectedCity(locationName, fieldType, button, input)
            }

            if (locationName === 'destination' &&
                (fieldType === 'postcode' || fieldType === 'city') &&
                isSameAsDeparture()
            ) {
                status = 'error';
                errorType = 'same-as-departure';
            }

            setFieldUiState(locationName, fieldType, status, field, errorType);

            routeRender.closeSuggestions(suggestionsContainer);
            routeRender.renderPostcodeCityGroup(locationName, area);

            updateRouteStep();
            onRouteChange();
        })


        // ----- BLUR -----
        input.addEventListener('blur', () => {
            const value = input.value.trim();
            if (!value) {
                setFieldUiState(locationName, fieldType, 'idle', field);
                routeRender.renderPostcodeCityGroup(locationName, area);
                updateRouteStep();
                onRouteChange();
                return;
            }
            if (!state.getSelectedLocation(locationName, fieldType)) {
                setFieldUiState(locationName, fieldType, 'error', field, 'not-valid');
                routeRender.renderPostcodeCityGroup(locationName, area);
                updateRouteStep();
                onRouteChange();
            }
        })
    });

    // ----- CLOSE SUGGESTIONS -----
    document.addEventListener('click', (e) => {
        if (!autocompleteWrapper.contains(e.target)) {
            getFields(locations, field => field.suggestionsContainer).forEach(({
                suggestionsContainer
            }) => {
                routeRender.closeSuggestions(suggestionsContainer);
            })
        }
    })

    // ----- MONTH PICKER -----

    // open month panel
    monthPickerInput.addEventListener('click', () => {
        routeRender.renderMonthPanel(monthPickerPanel, pageOverlay, monthPickerGrid, fiscalMonths, year);
    });

    // select year
    monthPickerYearInput.addEventListener('change', (e) => {
        year = Number(e.target.value);
        routeRender.renderMonthPanel(monthPickerPanel, pageOverlay, monthPickerGrid, fiscalMonths, year);
    })

    // month button event
    monthPickerGrid.addEventListener('click', (e) => {
        const button = e.target.closest('[data-month-id]');

        if (!button) return;

        const monthId = button.dataset.monthId;
        const selectedMonth = fiscalMonths.find(month => month.id === monthId);

        monthPickerTrigger.textContent = selectedMonth.fullLabel;

        state.setSelectedMonth({
            id: selectedMonth.id,
            fullLabel: selectedMonth.fullLabel,
            monthLabel: selectedMonth.label,
            year: selectedMonth.year,
            closingDate: selectedMonth.closingDate
        });


        routeRender.validateFiscalMonth(monthPickerInput);
        routeRender.closeMonthPanel(monthPickerPanel, monthPickerGrid, pageOverlay);
        updateRouteStep();
        onRouteChange();
    })


    // close month picker
    document.addEventListener('click', (e) => {
        const isPanelOpen = monthPickerPanel.classList.contains('is-open');

        if (!isPanelOpen) {
            return;
        };

        const clickedInsidePanel = monthPickerPanel.contains(e.target);
        const clickedInput = monthPickerInput.contains(e.target);

        if (clickedInsidePanel || clickedInput) return;

        routeRender.closeMonthPanel(monthPickerPanel, monthPickerGrid, pageOverlay);
    })


    // INIT 
    restoreRouteForm();

    return { resetRouteForm: resetCalculatorForm };
}