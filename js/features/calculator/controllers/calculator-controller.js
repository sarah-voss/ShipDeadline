
import * as calculatorRender from "../renderers/calculator-render.js";
import * as state from "../state.js";

import { getCalculatorScenario } from "../logic/scenarios.js";
import { MODE_RENDERERS } from "../shipment/config.js";
import { getDestinationArea, getCountryFieldStatus } from '../logic/geography-rules.js';
import { saveCalculatorState } from "../storage.js";
import { initRouteController } from "./route-controller.js";
import { renderSummaryFromState } from "./summary-controller.js";
import { initFullRoadController } from "./shipment-step/full-road-controller.js";




export function initCalculatorController({ calculatorRoot, elements, pageOverlay }) {

    // init sub-controllers
    const { resetRouteForm } = initRouteController({ 
        elements, 
        pageOverlay, 
        onRouteChange: syncCalculatorUiFromState 
    });

    initFullRoadController({ elements });


    // destructure imported values
    const { tabButtons,
        calculatorBody,
        locations,
        calculatorNextButton,
        calculatorPreviousButton,
        calculatorSteps,
    } = elements;


    // ==========================================
    //  ===  CALCULATOR FORM ===
    // ==========================================

    // SAVE CALCULATOR STATE
    function saveCurrentState() {
        saveCalculatorState(state.calculatorState);
    }

    // GET CURRENT SCENARIO
    function getCurrentScenario() {
        const departureCountry = state.getSelectedLocation('departure', 'country');
        const destinationCountry = state.getSelectedLocation('destination', 'country');

        if (!destinationCountry) return null;
        if (getCountryFieldStatus('departure', departureCountry) === 'error') return null;

        return getCalculatorScenario({
            loadType: state.getLoadType(),
            destinationArea: getDestinationArea(destinationCountry),
        });
    }


    // SYNC NEXT BUTTON
    function syncNextButton() {
        const currentStep = state.getCurrentStep();
        const isCurrentStepValid = state.getStepValidity(currentStep);

        if (isCurrentStepValid) {
            calculatorRender.validateNextButton(calculatorNextButton);
        } else {
            calculatorRender.disableNextButton(calculatorNextButton);
        }
    }

    // SYNC CALCULATOR UI FROM STATE
    function syncCalculatorUiFromState() {
        const scenario = getCurrentScenario();
        renderSummaryFromState({ elements, scenario });
        syncNextButton();
        saveCurrentState();
    }


    // RENDER CALCULATOR FROM STATE
    function renderCalculatorFromState() {
        const currentStep = state.getCurrentStep();
        const scenario = getCurrentScenario();

        calculatorRender.renderCalculatorStep(calculatorSteps, currentStep);
        syncCalculatorUiFromState();

        if (currentStep !== 'route') {
            calculatorRender.renderPreviousButton(calculatorPreviousButton)
        } else {
            calculatorRender.hidePreviousButton(calculatorPreviousButton);
        }

        if (currentStep === 'shipment') {
            const renderMode = MODE_RENDERERS[scenario];
            renderMode(
                calculatorSteps.shipment,
                state.calculatorState.shipmentDetails.fullRoad.vehicles
            );
        }
    }

    // INIT 
    renderCalculatorFromState();
    


    // ==========================================
    //  === EVENT LISTENERS CALCULATOR FORM ===
    // ==========================================

    // EVENT LISTENERS TAB BUTTONS
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.modeTrigger;

            state.setLoadType(mode);
            state.setCurrentStep('route');

            calculatorRender.renderCalculator({
                mode,
                elements,
                calculatorRoot
            });
            calculatorRender.switchMode({
                calculatorBody, mode
            })

            resetRouteForm();
            renderCalculatorFromState();
        })
    });





    // ----- NEXT BUTTON -----
    calculatorNextButton.addEventListener('click', () => {
        const currentStep = state.getCurrentStep();

        if (currentStep === 'route') {
            state.setCurrentStep('shipment');
            renderCalculatorFromState();
        }

        if (currentStep === 'shipment') {
            state.setCurrentStep('result');
            renderCalculatorFromState();
        }

    })


    // ----- PREVIOUS BUTTON -----
    calculatorPreviousButton.addEventListener('click', () => {
        const currentStep = state.getCurrentStep();

        if (currentStep === 'shipment') {
            state.setCurrentStep('route');
            renderCalculatorFromState();
        }

        if (currentStep === 'result') {
            state.setCurrentStep('shipment');
            renderCalculatorFromState();
        }
    })


    // EDIT ALL SUMMARY BUTTON 
    elements.summaryCard.editAllButton.addEventListener('click', () => {
        state.setCurrentStep('route');
        renderCalculatorFromState();
        calculatorRender.focusFirstRouteField(locations.departure.country.input);
    })



}
