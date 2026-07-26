// RESPONSABILITA': TROVA I NODI NEL DOM E CHIAMA IL CONTROLLER
import { setActiveNav } from "../utils/dom-utils.js";
import { initCalculatorController } from "../features/calculator/controllers/calculator-controller.js";
import { loadCalculatorState } from "../features/calculator/storage.js";
import { calculatorState } from "../features/calculator/state.js";

function initCalculatorPage() {

const calculatorRoot = document.querySelector('[data-calculator]');
if (!calculatorRoot) return;

const savedState = loadCalculatorState();

if (savedState) {
    Object.assign(calculatorState, savedState);
}

const navItems = document.querySelectorAll('[data-nav-item]');
const pageOverlay = document.querySelector('[data-page-overlay]');

const elements = {
    tabButtons: calculatorRoot.querySelectorAll('[data-mode-trigger]'),
    descriptionElement: calculatorRoot.querySelector('[data-mode-description]'),
    calculatorBody: calculatorRoot.querySelector('[data-calculator-body]'),
    autocompleteWrapper: calculatorRoot.querySelector('[data-autocomplete-wrapper]'),
    locations: {
        departure: {
            area: calculatorRoot.querySelector('[data-form-area-departure]'),

            country: {
                input: calculatorRoot.querySelector('[data-departure-country-input]'),
                suggestionsContainer: calculatorRoot.querySelector('[data-departure-country-suggestions]'),
                field: calculatorRoot.querySelector('[data-departure-country-field]')
            },
            postcode: {
                input: calculatorRoot.querySelector('[data-departure-postcode-input]'),
                suggestionsContainer: calculatorRoot.querySelector('[data-departure-postcode-suggestions]'),
                field: calculatorRoot.querySelector('[data-departure-postcode-field]'),
                label: calculatorRoot.querySelector('[data-departure-postcode-label]')
            },
            city: {
                input: calculatorRoot.querySelector('[data-departure-city-input]'),
                suggestionsContainer: calculatorRoot.querySelector('[data-departure-city-suggestions]'),
                field: calculatorRoot.querySelector('[data-departure-city-field]')
            }
        },
        destination: {
            area: calculatorRoot.querySelector('[data-form-area-destination]'),

            country: {
            input: calculatorRoot.querySelector('[data-destination-country-input]'),
            suggestionsContainer: calculatorRoot.querySelector('[data-destination-country-suggestions]'),
            field: calculatorRoot.querySelector('[data-destination-country-field]')
            },
            postcode: {
                input: calculatorRoot.querySelector('[data-destination-postcode-input]'),
                suggestionsContainer: calculatorRoot.querySelector('[data-destination-postcode-suggestions]'),
                field: calculatorRoot.querySelector('[data-destination-postcode-field]'),
                label: calculatorRoot.querySelector('[data-destination-postcode-label]')
            },
            city: {
                input: calculatorRoot.querySelector('[data-destination-city-input]'),
                suggestionsContainer: calculatorRoot.querySelector('[data-destination-city-suggestions]'),
                field: calculatorRoot.querySelector('[data-destination-city-field]')
            }
        }
      },
      monthPickerInput: calculatorRoot.querySelector('[data-month-picker-input]'),
      monthPickerTrigger: calculatorRoot.querySelector('[data-month-picker-trigger]'),
      monthPickerPanel: calculatorRoot.querySelector('[data-month-picker-panel]'),
      monthPickerYearInput: calculatorRoot.querySelector('[data-month-picker-year-input]'),
      monthPickerGrid: calculatorRoot.querySelector('[data-month-picker-grid]'),
    summaryCard: {
        departure: {
            countryText: calculatorRoot.querySelector('[data-summary-departure-country]'),
            locationText: calculatorRoot.querySelector('[data-summary-departure-location]'),
            successIcon: calculatorRoot.querySelector('[data-summary-departure-success-icon]')
        },
        destination: {
            countryText: calculatorRoot.querySelector('[data-summary-destination-country]'),
            locationText: calculatorRoot.querySelector('[data-summary-destination-location]'),
            successIcon: calculatorRoot.querySelector('[data-summary-destination-success-icon]')
        },
        within: {
            monthNameText: calculatorRoot.querySelector('[data-summary-month-name]'),
            closingDateText: calculatorRoot.querySelector('[data-summary-closing-date]'),
            successIcon: calculatorRoot.querySelector('[data-summary-within-success-icon]')
        },
        mode: {
            modeText: calculatorRoot.querySelector('[data-summary-mode]'),
            successIcon: calculatorRoot.querySelector('[data-summary-mode-success-icon]'),
            vehiclesDiv: calculatorRoot.querySelector('[data-summary-mode-vehicles]'),
        },
        editAllButton: calculatorRoot.querySelector('[data-summary-edit-all-button]'),
      },
      calculatorNextButton: calculatorRoot.querySelector('[data-calculator-next-button]'),
      calculatorPreviousButton: calculatorRoot.querySelector('[data-calculator-previous-button]'),
      calculatorSteps: {
        route: calculatorRoot.querySelector('[data-calculator-step="route"]'),
        shipment: calculatorRoot.querySelector('[data-calculator-step="shipment"]'),
        result: calculatorRoot.querySelector('[data-calculator-step="result"]'),
      }
      
  }

  
  setActiveNav(navItems, 'calculator');
  initCalculatorController({ calculatorRoot, elements, pageOverlay });
}

export { initCalculatorPage };