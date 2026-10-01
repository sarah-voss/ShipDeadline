
import * as calculatorRender from "../renderers/calculator-render.js";
import * as state from "../state.js";

import { getCalculatorScenario, isLoadTypeFullyUnavailable } from "../logic/scenarios.js";
import { SCENARIO_RENDERERS, IMPLEMENTED_SCENARIOS } from "../shipment/config.js";
import { getDestinationArea, getCountryFieldStatus } from '../logic/geography-rules.js';
import { saveCalculatorState, loadCalculatorState } from "../storage.js";
import { initRouteController } from "./route-controller.js";
import { renderSummaryFromState } from "./summary-overview-controller.js";
import { initFullRoadController } from "./shipment-step/full-road-controller.js";
import { renderResultStep } from "./result-controller.js";




export function initCalculatorController({ calculatorRoot, elements, pageOverlay }) {

    // Restore the saved state first: the sub-controllers read it while initialising
    state.restoreCalculatorState(loadCalculatorState());

    const { resetCalculatorForm } = initRouteController({
        elements,
        pageOverlay,
        onRouteChange: handleCalculatorChange
    });

    initFullRoadController({
        elements,
        onFullRoadChange: handleCalculatorChange,
        getCurrentScenario
    });


    const { tabButtons,
        calculatorBody,
        locations,
        calculatorNextButton,
        calculatorPreviousButtons,
        calculatorSteps,
        startNewButton,
    } = elements;


    // ==== HELPERS ====

    function saveCurrentState() {
        saveCalculatorState(state.calculatorState);
    }

    // Returns null while the route is incomplete or the departure country is not supported
    function getCurrentScenario() {
        const departureCountryCode = state.getSelectedCountryCode('departure');
        const destinationCountryCode = state.getSelectedCountryCode('destination');

        if (!destinationCountryCode) return null;
        if (getCountryFieldStatus('departure', departureCountryCode) === 'error') return null;

        return getCalculatorScenario({
            loadType: state.getLoadType(),
            destinationArea: getDestinationArea(destinationCountryCode),
        });
    }


    function syncNextButton() {
        const currentStep = state.getCurrentStep();
        const isCurrentStepValid = state.getStepValidity(currentStep);

        if (isCurrentStepValid) {
            calculatorRender.enableNextButton(calculatorNextButton);
        } else {
            calculatorRender.disableNextButton(calculatorNextButton);
        }
    }

    function syncCalculatorUiFromState() {
        const scenario = getCurrentScenario();
        renderSummaryFromState({ elements, scenario });
        syncNextButton();
        saveCurrentState();
    }

    // Any change to the inputs invalidates the result, so the loading animation plays again
    function handleCalculatorChange() {
        state.setResultAsStale();
        syncCalculatorUiFromState();
    }


    function renderCalculatorFromState() {
        const currentStep = state.getCurrentStep();
        const scenario = getCurrentScenario();
        const loadType = state.getLoadType();

        // Load types with no implemented scenario skip the route and show the coming soon message
        if (isLoadTypeFullyUnavailable(loadType)) {
            calculatorRender.renderCalculatorStep(calculatorSteps, 'shipment', calculatorRoot);
            calculatorRender.renderComingSoonMode(calculatorSteps.shipment);
            calculatorRender.hidePreviousButtons(calculatorPreviousButtons);
            calculatorRender.disableNextButton(calculatorNextButton);
            return;
        }

        calculatorRender.renderCalculatorStep(calculatorSteps, currentStep, calculatorRoot);
        syncCalculatorUiFromState();


        if (currentStep !== 'route') {
            calculatorRender.renderPreviousButtons(calculatorPreviousButtons)
        } else {
            calculatorRender.hidePreviousButtons(calculatorPreviousButtons);
        }

        if (currentStep === 'shipment') {
            // Scenario can be null if the route state is missing or corrupted (e.g. restored from stale storage)
            if (!scenario) {
                calculatorRender.renderComingSoonMode(calculatorSteps.shipment);
                state.setStepValidity('shipment', false);
                syncNextButton();
                return;
            }

            const renderMode = SCENARIO_RENDERERS[scenario];
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
            renderResultStep({ elements });

            // The loading animation plays only the first time a result is shown
            if (!state.hasResultBeenShown()) {
                calculatorRender.showResultLoading(calculatorRoot);
                elements.loadingElement.addEventListener('animationend', () => {
                    calculatorRender.hideResultLoading(calculatorRoot);
                    state.setResultAsShown();
                    saveCurrentState();
                }, { once: true });
            }
        }
    }

    function startNewCalculation() {
        resetCalculatorForm();
        renderCalculatorFromState();
    }


    // ==== INIT ====

    calculatorRender.renderLoadTypeTabs({
        loadType: state.getLoadType(),
        elements,
        calculatorRoot
    });
    renderCalculatorFromState();


    // ==== EVENT LISTENERS ====

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const loadType = button.dataset.loadType;

            state.setLoadType(loadType);
            state.setCurrentStep('route');

            calculatorRender.renderLoadTypeTabs({
                loadType,
                elements,
                calculatorRoot
            });
            calculatorRender.switchMode({
                calculatorBody
            })

            startNewCalculation();
        })
    });





    calculatorNextButton.addEventListener('click', () => {
        const currentStep = state.getCurrentStep();

        if (currentStep === 'route') {
            state.setCurrentStep('shipment');
            calculatorRender.renderStepEnter(calculatorSteps.shipment, 'next');
            renderCalculatorFromState();
        }

        if (currentStep === 'shipment') {
            state.setCurrentStep('result');
            renderCalculatorFromState();
        }

    })


    // Two previous buttons: the one under the form and "Back to Shipment" in the result
    calculatorPreviousButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = state.getCurrentStep();

            if (currentStep === 'shipment') {
                state.setCurrentStep('route');
                calculatorRender.renderStepEnter(calculatorSteps.route, 'back');
                renderCalculatorFromState();
            }

            if (currentStep === 'result') {
                state.setCurrentStep('shipment');
                calculatorRender.renderStepEnter(calculatorSteps.shipment, 'back');
                renderCalculatorFromState();
            }
        })
    })


    elements.summaryCard.editAllButton.addEventListener('click', () => {
        state.setCurrentStep('route');
        renderCalculatorFromState();
        calculatorRender.focusFirstRouteField(locations.departure.country.input);
    })

    startNewButton.addEventListener('click', () => {
        state.setCurrentStep('route');
        startNewCalculation();
    })

}
