
import * as calculatorRender from "../renderers/calculator-render.js";
import * as state from "../state.js";

import { getCalculatorScenario, isLoadTypeFullyUnavailable } from "../logic/scenarios.js";
import { MODE_RENDERERS, IMPLEMENTED_SCENARIOS } from "../shipment/config.js";
import { getDestinationArea, getCountryFieldStatus } from '../logic/geography-rules.js';
import { saveCalculatorState } from "../storage.js";
import { initRouteController } from "./route-controller.js";
import { renderSummaryFromState } from "./summary-controller.js";
import { initFullRoadController } from "./shipment-step/full-road-controller.js";
import { getResults } from "./result-controller.js";




export function initCalculatorController({ calculatorRoot, elements, pageOverlay }) {

    // init sub-controllers
    const { resetRouteForm } = initRouteController({ 
        elements, 
        pageOverlay, 
        onRouteChange: syncCalculatorUiFromState 
    });

    initFullRoadController({ 
        elements,
        onFullRoadChange: syncCalculatorUiFromState
    });


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
        const departureCountryCode = state.getSelectedCountry('departure');
        const destinationCountryCode = state.getSelectedCountry('destination');

        if (!destinationCountryCode) return null;
        if (getCountryFieldStatus('departure', departureCountryCode) === 'error') return null;

        return getCalculatorScenario({
            loadType: state.getLoadType(),
            destinationArea: getDestinationArea(destinationCountryCode),
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
        const loadType = state.getLoadType();

        if (isLoadTypeFullyUnavailable(loadType)) {
            calculatorRender.renderCalculatorStep(calculatorSteps, 'shipment', calculatorRoot);
            calculatorRender.renderComingSoonMode(calculatorSteps.shipment);
            calculatorRender.hidePreviousButton(calculatorPreviousButton);
            calculatorRender.disableNextButton(calculatorNextButton);
        return;
        }

        calculatorRender.renderCalculatorStep(calculatorSteps, currentStep, calculatorRoot);
        syncCalculatorUiFromState();


        if (currentStep !== 'route') {
            calculatorRender.renderPreviousButton(calculatorPreviousButton)
        } else {
            calculatorRender.hidePreviousButton(calculatorPreviousButton);
        }

        if (currentStep === 'shipment') {
            // scenario can be null if route state is missing/corrupted (e.g. restored from stale storage)
            if (!scenario) {
                calculatorRender.renderComingSoonMode(calculatorSteps.shipment);
                state.setStepValidity('shipment', false);
                syncNextButton();
                return;
            }

            const renderMode = MODE_RENDERERS[scenario];
            renderMode(
                calculatorSteps.shipment,
                state.calculatorState.shipmentDetails.fullRoad.vehicles,
                scenario
            );

            if (!IMPLEMENTED_SCENARIOS.includes(scenario)) {
                state.setStepValidity('shipment', false);
                syncNextButton();
            }
        }

        if (currentStep === 'result') { 
            getResults({ elements }); 
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
